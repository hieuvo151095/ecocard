import test from 'node:test';
import assert from 'node:assert/strict';

import {
  convertDaysToMonths,
  isStudentActive,
  calculateStudentBilling,
  calculateBranchFees,
  validateZeroFeeGuard,
  createSessionSnapshot,
  generatePeriodSchedule,
} from './reconciliationCalculator.js';

import {
  transitionSessionState,
} from './sessionLifecycle.js';

import { SESSION_STATUS, USER_ROLES } from '../data/models.js';

test('convertDaysToMonths calculates surplus day threshold correctly (BR07)', () => {
  // Edge case: 0 days
  assert.equal(convertDaysToMonths(0, 10), 0);

  // User Student 1: 132 days -> 4 months (120 days) and 12 days. 12 >= 10 -> count as 5 months
  assert.equal(convertDaysToMonths(132, 10), 5);

  // User Student 2: 128 days -> 4 months (120 days) and 8 days. 8 < 10 -> count as 4 months
  assert.equal(convertDaysToMonths(128, 10), 4);

  // 1 month 10 days (40 days) with 10-day threshold -> 1 month 10 days >= 10 -> 2 months
  assert.equal(convertDaysToMonths(40, 10), 2);

  // 1 month 9 days (39 days) with 10-day threshold -> 9 < 10 -> 1 month
  assert.equal(convertDaysToMonths(39, 10), 1);
});

test('isStudentActive determines student qualification based on minActiveMonths (30 days/month standard - BR06)', () => {
  // Standard: 1 month = 30 days. Maximum 30 days active -> does NOT get charged (Không tính phí)
  assert.equal(isStudentActive(30, 1), false);
  assert.equal(isStudentActive(25, 1), false);
  assert.equal(isStudentActive(0, 1), false);

  // At least 31 days active -> gets charged (Có tính phí)
  assert.equal(isStudentActive(31, 1), true);
  assert.equal(isStudentActive(132, 1), true);
  assert.equal(isStudentActive(128, 1), true);

  // 2 months threshold (60 days max non-billable): 60 days -> false; 61 days -> true
  assert.equal(isStudentActive(60, 2), false);
  assert.equal(isStudentActive(61, 2), true);
});

test('calculateStudentBilling correctly evaluates billed months and service fees', () => {
  const thresholds = { minActiveMonths: 1, surplusDayThreshold: 10 };

  // Student 1: 132 days (5 months), Camera AI (5.000đ)
  const student1 = calculateStudentBilling(
    { actualDays: 132, serviceId: 'cameraAi' },
    thresholds,
    5000
  );
  assert.equal(student1.thresholdMonths, 5);
  assert.equal(student1.billedMonths, 5);
  assert.equal(student1.periodFee, 25000); // 5 * 5000 = 25000đ
  assert.equal(student1.result, 'Có tính phí');

  // Student 2: 128 days (4 months), Camera AI (5.000đ)
  const student2 = calculateStudentBilling(
    { actualDays: 128, serviceId: 'cameraAi' },
    thresholds,
    5000
  );
  assert.equal(student2.thresholdMonths, 4);
  assert.equal(student2.billedMonths, 4);
  assert.equal(student2.periodFee, 20000); // 4 * 5000 = 20000đ
  assert.equal(student2.result, 'Có tính phí');

  // Student 3: 25 days (<= 30 days max), Camera AI (5.000đ)
  const student3 = calculateStudentBilling(
    { actualDays: 25, serviceId: 'cameraAi' },
    thresholds,
    5000
  );
  assert.equal(student3.billedMonths, 0);
  assert.equal(student3.periodFee, 0); // 0đ
  assert.equal(student3.result, 'Không tính phí');
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
