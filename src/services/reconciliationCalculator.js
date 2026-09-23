/**
 * ECO Card Portal - Module M6 (Đối soát)
 * Reconciliation Calculation and Snapshot Engine
 */

import { RECONCILIATION_SERVICES } from '../data/models.js';

/**
 * Calculates qualified active student months based on days and surplus threshold
 * @param {number} totalActiveDays
 * @param {number} surplusThresholdDays (e.g., 15)
 * @returns {number} evaluated months
 */
export function convertDaysToMonths(totalActiveDays, surplusThresholdDays = 15) {
  if (!totalActiveDays || totalActiveDays <= 0) return 0;
  const baseMonths = Math.floor(totalActiveDays / 30);
  const remainingDays = totalActiveDays % 30;
  return remainingDays >= surplusThresholdDays ? baseMonths + 1 : baseMonths;
}

/**
 * Determines whether a student meets the minimum active month requirement
 * @param {number} totalActiveDays
 * @param {number} minActiveMonths (e.g., 1)
 * @param {number} surplusThresholdDays (e.g., 15)
 * @returns {boolean}
 */
export function isStudentActive(totalActiveDays, minActiveMonths = 1, surplusThresholdDays = 15) {
  const months = convertDaysToMonths(totalActiveDays, surplusThresholdDays);
  return months >= minActiveMonths;
}

/**
 * Calculates fee breakdown per service for a single branch
 * @param {Object} branch
 * @param {string} periodId
 * @param {Object} tariffs - { [periodId]: { managementSoftware: 10000, cameraAi: 5000, ... } }
 * @param {number} activeStudentCount
 * @param {boolean} includeArrears
 * @param {number} previousArrearsAmount
 * @returns {Object} Branch fee breakdown
 */
export function calculateBranchFees(
  branch,
  periodId,
  tariffs = {},
  activeStudentCount = 0,
  includeArrears = false,
  previousArrearsAmount = 0
) {
  const periodTariffs = tariffs[periodId] || {};
  const activeServices = branch.services || {};

  const serviceBreakdown = RECONCILIATION_SERVICES.map((srv) => {
    const isEnabled = Boolean(activeServices[srv.id]);
    const unitPrice = isEnabled ? Number(periodTariffs[srv.id] || 0) : 0;
    const studentCount = isEnabled ? activeStudentCount : 0;
    const totalServiceFee = studentCount * unitPrice;

    return {
      serviceId: srv.id,
      serviceName: srv.name,
      shortName: srv.shortName,
      isEnabled,
      unitPrice,
      activeStudents: studentCount,
      totalFee: totalServiceFee,
    };
  });

  const periodFee = serviceBreakdown.reduce((sum, item) => sum + item.totalFee, 0);
  const arrearsFee = includeArrears ? Number(previousArrearsAmount || 0) : 0;
  const totalBranchFee = periodFee + arrearsFee;

  return {
    branchId: branch.id,
    branchCode: branch.code,
    branchName: branch.name,
    studentCount: branch.studentCount || 0,
    activeStudents: activeStudentCount,
    serviceBreakdown,
    periodFee,
    arrearsFee,
    totalFee: totalBranchFee,
  };
}

/**
 * Zero-Fee Blocker Guard (BR03 / MSG-01)
 * Checks if any selected branch has a total fee of 0 VND
 * @param {Array} branchCalculations
 * @returns {Object} { isValid: boolean, zeroBranches: Array, errorMessage: string|null }
 */
export function validateZeroFeeGuard(branchCalculations = []) {
  if (!branchCalculations || branchCalculations.length === 0) {
    return {
      isValid: false,
      zeroBranches: [],
      errorMessage: 'Vui lòng chọn ít nhất một trường để đối soát.',
    };
  }

  const zeroBranches = branchCalculations.filter((b) => b.totalFee === 0);

  if (zeroBranches.length > 0) {
    const branchNames = zeroBranches.map((b) => b.branchName).join(', ');
    return {
      isValid: false,
      zeroBranches,
      errorMessage: `Không thể tạo phiên có tổng phí 0đ - ${branchNames} chưa phát sinh phí. Vui lòng kiểm tra ngày chốt, ngưỡng thu phí hoặc chọn lại chi nhánh.`,
    };
  }

  return {
    isValid: true,
    zeroBranches: [],
    errorMessage: null,
  };
}

/**
 * Creates an immutable frozen configuration snapshot for a session (BR04 / ADR-M6-001)
 * @param {Object} group
 * @param {Array} branches
 * @param {Object} period
 * @param {Object} thresholds
 * @returns {Object} Deep-frozen snapshot
 */
export function createSessionSnapshot(group, branches, period, thresholds) {
  const snapshot = {
    group: {
      id: group.id,
      code: group.code,
      name: group.name,
      taxCode: group.taxCode,
      settlementScope: group.settlementScope,
      emails: [...(group.emails || [])],
    },
    period: {
      id: period.id,
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
      isFeeCollected: period.isFeeCollected,
    },
    thresholds: {
      minActiveMonths: thresholds?.minActiveMonths || 1,
      surplusDayThreshold: thresholds?.surplusDayThreshold || 15,
    },
    branches: branches.map((b) => ({
      id: b.id,
      code: b.code,
      name: b.name,
      studentCount: b.studentCount,
      services: { ...(b.services || {}) },
      tariffs: JSON.parse(JSON.stringify(b.tariffs || {})),
    })),
    createdAt: new Date().toISOString(),
  };

  return Object.freeze(JSON.parse(JSON.stringify(snapshot)));
}

/**
 * Auto-generate billing schedule periods (Sinh lịch kỳ)
 * Divides service year into N equal-interval periods
 * @param {string} startDateString - e.g. "2026-09-01"
 * @param {string} endDateString - e.g. "2027-05-31"
 * @param {number} numberOfPeriods - e.g. 9
 * @returns {Array} generated periods
 */
export function generatePeriodSchedule(startDateString, endDateString, numberOfPeriods = 9) {
  const start = new Date(startDateString);
  const end = new Date(endDateString);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || numberOfPeriods <= 0) {
    return [];
  }

  const totalTime = end.getTime() - start.getTime();
  const periodDuration = totalTime / numberOfPeriods;
  const periods = [];

  for (let i = 0; i < numberOfPeriods; i++) {
    const periodStart = new Date(start.getTime() + i * periodDuration);
    const periodEnd = new Date(
      i === numberOfPeriods - 1 ? end.getTime() : start.getTime() + (i + 1) * periodDuration - 86400000
    );

    const periodMonth = periodStart.getMonth() + 1;
    const periodYear = periodStart.getFullYear();

    periods.push({
      id: `Kỳ ${i + 1}`,
      name: `Kỳ ${i + 1} - Tháng ${periodMonth}/${periodYear}`,
      startDate: periodStart.toISOString().split('T')[0],
      endDate: periodEnd.toISOString().split('T')[0],
      isFeeCollected: true,
      hasActiveSession: false,
    });
  }

  return periods;
}
