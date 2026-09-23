import test from 'node:test';
import assert from 'node:assert/strict';

import {
  convertDaysToMonths,
  isStudentActive,
  calculateBranchFees,
  validateZeroFeeGuard,
  createSessionSnapshot,
  generatePeriodSchedule,
} from './reconciliationCalculator.js';

import {
  transitionSessionState,
} from './sessionLifecycle.js';

import { SESSION_STATUS, USER_ROLES } from '../data/models.js';

test('convertDaysToMonths calculates surplus day threshold correctly', () => {
  // Edge case: 0 days
  assert.equal(convertDaysToMonths(0, 15), 0);

  // Under surplus threshold (14 days < 15 days)
  assert.equal(convertDaysToMonths(14, 15), 0);

  // Exactly at surplus threshold (15 days >= 15 days -> rounds to 1 month)
  assert.equal(convertDaysToMonths(15, 15), 1);

  // 1 month 10 days (40 days) with 15-day threshold -> 1 month
  assert.equal(convertDaysToMonths(40, 15), 1);

  // 1 month 15 days (45 days) with 15-day threshold -> 2 months
  assert.equal(convertDaysToMonths(45, 15), 2);

  // Legacy BR07 explicit test case:
  // "4 tháng 10 ngày, cấu hình ngưỡng làm tròn 10 ngày -> tính là 5 tháng"
  // (4 * 30 + 10 = 130 days)
  assert.equal(convertDaysToMonths(130, 10), 5);
});

test('isStudentActive determines student qualification based on minActiveMonths', () => {
  // 15 days with threshold 15 qualifies for 1 month
  assert.equal(isStudentActive(15, 1, 15), true);

  // 14 days with threshold 15 evaluates to 0 months (< 1 month)
  assert.equal(isStudentActive(14, 1, 15), false);

  // 75 days with threshold 15 (2 months 15 days -> 3 months) qualifies for 2 months
  assert.equal(isStudentActive(75, 2, 15), true);
});

test('calculateBranchFees accurately computes service totals and arrears', () => {
  const mockBranch = {
    id: 'B01',
    code: 'HIEUTEST_1',
    name: 'Tiểu học Hieutest 1',
    studentCount: 150,
    services: {
      managementSoftware: true,
      cameraAi: true,
      studentCard: false,
      canteen: false,
    },
  };

  const mockTariffs = {
    'Kỳ 1': {
      managementSoftware: 10000,
      cameraAi: 5000,
      studentCard: 2000,
      canteen: 3000,
    },
  };

  const result = calculateBranchFees(mockBranch, 'Kỳ 1', mockTariffs, 100, true, 50000);

  // managementSoftware: 100 * 10000 = 1,000,000
  // cameraAi: 100 * 5000 = 500,000
  // periodFee = 1,500,000
  // arrearsFee = 50,000
  // totalFee = 1,550,000
  assert.equal(result.periodFee, 1500000);
  assert.equal(result.arrearsFee, 50000);
  assert.equal(result.totalFee, 1550000);

  // Inactive service studentCard should be 0 fee
  const studentCardSrv = result.serviceBreakdown.find((s) => s.serviceId === 'studentCard');
  assert.equal(studentCardSrv.isEnabled, false);
  assert.equal(studentCardSrv.totalFee, 0);
});

test('validateZeroFeeGuard blocks 0 VND sessions with legacy message MSG-01', () => {
  const zeroFeeCalculation = [
    { branchId: 'B01', branchName: 'Chi nhánh A', totalFee: 0 },
    { branchId: 'B02', branchName: 'Chi nhánh B', totalFee: 500000 },
  ];

  const validation = validateZeroFeeGuard(zeroFeeCalculation);
  assert.equal(validation.isValid, false);
  assert.equal(validation.zeroBranches.length, 1);
  assert.match(validation.errorMessage, /Không thể tạo phiên có tổng phí 0đ/);
  assert.match(validation.errorMessage, /Chi nhánh A chưa phát sinh phí/);

  const validCalculation = [
    { branchId: 'B01', branchName: 'Chi nhánh A', totalFee: 100000 },
    { branchId: 'B02', branchName: 'Chi nhánh B', totalFee: 500000 },
  ];

  const validResult = validateZeroFeeGuard(validCalculation);
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.errorMessage, null);
});

test('createSessionSnapshot generates deeply immutable frozen pricing snapshot (ADR-M6-001)', () => {
  const group = {
    id: 'G01',
    code: 'HIEUTEST',
    name: 'Hệ thống Trường Hieutest',
    taxCode: '0312345678',
    settlementScope: 'GROUP',
    emails: ['admin@hieutest.edu.vn'],
  };

  const period = {
    id: 'Kỳ 1',
    name: 'Kỳ 1 - Tháng 9/2026',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    isFeeCollected: true,
  };

  const thresholds = { minActiveMonths: 1, surplusDayThreshold: 15 };

  const mutableBranches = [
    {
      id: 'B01',
      code: 'HIEUTEST_1',
      name: 'Tiểu học Hieutest 1',
      studentCount: 100,
      services: { managementSoftware: true },
      tariffs: { 'Kỳ 1': { managementSoftware: 10000 } },
    },
  ];

  const snapshot = createSessionSnapshot(group, mutableBranches, period, thresholds);

  // Verify initial snapshot content
  assert.equal(snapshot.branches[0].tariffs['Kỳ 1'].managementSoftware, 10000);

  // Mutate source branch tariffs
  mutableBranches[0].tariffs['Kỳ 1'].managementSoftware = 99999;

  // Snapshot must remain unchanged (10000, NOT 99999)
  assert.equal(snapshot.branches[0].tariffs['Kỳ 1'].managementSoftware, 10000);
});

test('generatePeriodSchedule divides school year into N periods correctly', () => {
  const periods = generatePeriodSchedule('2026-09-01', '2027-05-31', 9);
  assert.equal(periods.length, 9);
  assert.equal(periods[0].id, 'Kỳ 1');
  assert.equal(periods[8].id, 'Kỳ 9');
  assert.equal(periods[0].isFeeCollected, true);
});

test('transitionSessionState enforces state machine and role permissions', () => {
  const draftSession = {
    id: 'REC-001',
    status: SESSION_STATUS.DRAFT,
    isReleased: false,
  };

  // Submit for approval as finance officer
  const submitRes = transitionSessionState(draftSession, 'SUBMIT_APPROVAL', USER_ROLES.FINANCE_OFFICER);
  assert.equal(submitRes.success, true);
  assert.equal(submitRes.updatedSession.status, SESSION_STATUS.PENDING_APPROVAL);

  // Approver approves session
  const approveRes = transitionSessionState(submitRes.updatedSession, 'APPROVE', USER_ROLES.FINANCE_APPROVER);
  assert.equal(approveRes.success, true);
  assert.equal(approveRes.updatedSession.status, SESSION_STATUS.APPROVED);

  // Send to school
  const sendRes = transitionSessionState(approveRes.updatedSession, 'SEND_TO_SCHOOL', USER_ROLES.FINANCE_OFFICER);
  assert.equal(sendRes.success, true);
  assert.equal(sendRes.updatedSession.status, SESSION_STATUS.SENT_TO_SCHOOL);

  // Confirm payment
  const paidRes = transitionSessionState(sendRes.updatedSession, 'CONFIRM_PAYMENT', USER_ROLES.FINANCE_OFFICER);
  assert.equal(paidRes.success, true);
  assert.equal(paidRes.updatedSession.status, SESSION_STATUS.PAID);

  // Cancel in draft state releases student active calculation hold (Đã nhả kết quả)
  const cancelRes = transitionSessionState(draftSession, 'CANCEL_SESSION', USER_ROLES.FINANCE_OFFICER);
  assert.equal(cancelRes.success, true);
  assert.equal(cancelRes.updatedSession.status, SESSION_STATUS.CANCELLED);
  assert.equal(cancelRes.updatedSession.isReleased, true);

  // Unauthorized role check: Officer cannot approve directly
  const unauthorizedRes = transitionSessionState(submitRes.updatedSession, 'APPROVE', USER_ROLES.FINANCE_OFFICER);
  assert.equal(unauthorizedRes.success, false);
});
