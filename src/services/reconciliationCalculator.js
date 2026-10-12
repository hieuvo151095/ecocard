/**
 * ECO Card Portal - Module M6 (Đối soát)
 * Reconciliation Calculation and Snapshot Engine
 */

import { RECONCILIATION_SERVICES } from '../data/models.js';

/**
 * Calculates qualified active student months based on days and surplus threshold (Image 1 BR07)
 * 1 month is standard 30 days.
 * If surplus days >= surplusThresholdDays, round up +1 month.
 * @param {number} totalActiveDays
 * @param {number} surplusThresholdDays (e.g., 10 days)
 * @returns {number} evaluated months
 */
export function convertDaysToMonths(totalActiveDays, surplusThresholdDays = 10) {
  if (!totalActiveDays || totalActiveDays <= 0) return 0;
  const baseMonths = Math.floor(totalActiveDays / 30);
  const remainingDays = totalActiveDays % 30;
  return remainingDays >= Number(surplusThresholdDays) ? baseMonths + 1 : baseMonths;
}

/**
 * Determines whether a student meets the minimum active month requirement (Image 1 BR06)
 * One month is equal to 30 days standard.
 * If active maximum minActiveMonths * 30 days -> does NOT qualify (Không tính phí).
 * Only qualifies if active at least minActiveMonths * 30 + 1 days (i.e. > minActiveMonths * 30).
 * @param {number} totalActiveDays
 * @param {number} minActiveMonths (e.g., 1)
 * @returns {boolean}
 */
export function isStudentActive(totalActiveDays, minActiveMonths = 1) {
  if (!totalActiveDays || totalActiveDays <= 0) return false;
  const nonBillableMaxDays = Number(minActiveMonths) * 30;
  return totalActiveDays > nonBillableMaxDays;
}

/**
 * Calculates student billing details per service:
 * - Evaluated months based on surplus day rounding
 * - Charging qualification based on minActiveMonths (30 days/month standard)
 * - Monthly fee = billedMonths * unitPrice
 * @param {Object} student
 * @param {Object} thresholds - { minActiveMonths, surplusDayThreshold }
 * @param {number} unitPrice - monthly tariff for the service
 * @returns {Object} evaluated student billing details
 */
export function calculateStudentBilling(student, thresholds = {}, unitPrice = 0) {
  const minActiveMonths = Number(thresholds.minActiveMonths ?? 1);
  const surplusThresholdDays = Number(thresholds.surplusDayThreshold ?? 10);
  const actualDays = Number(student.actualDays || 0);

  // Billable if active > minActiveMonths * 30 days
  const isCharged = isStudentActive(actualDays, minActiveMonths);
  const thresholdMonths = convertDaysToMonths(actualDays, surplusThresholdDays);
  const billedMonths = isCharged ? thresholdMonths : 0;
  const periodFee = isCharged ? billedMonths * Number(unitPrice || 0) : 0;
  const arrearsFee = Number(student.arrearsFee || 0);
  const totalFee = periodFee + arrearsFee;
  const result = isCharged ? 'Có tính phí' : 'Không tính phí';

  return {
    ...student,
    actualDays,
    thresholdMonths,
    billedMonths,
    isCharged,
    periodFee,
    arrearsFee,
    totalFee,
    result,
  };
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
  const periodTariffs = tariffs[periodId] || tariffs['YEARLY'] || tariffs['Năm học'] || branch?.yearlyTariffs || {};
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

/**
 * Mode A: Thu liền sau kỳ đối soát (vào tháng T+1)
 * Phí dịch vụ cần thu/user = (Phí dịch vụ / số tháng của kỳ hoặc năm) x Số tháng sử dụng còn lại
 * @param {Object} params
 * @param {number} params.serviceFee - Tổng phí dịch vụ kỳ hoặc năm
 * @param {number} params.totalCycleMonths - Tổng số tháng của kỳ hoặc năm (ví dụ 5 tháng, 9 tháng, 12 tháng)
 * @param {number} params.remainingMonths - Số tháng sử dụng còn lại trong kỳ/năm
 * @returns {number} Fee to collect in month T+1
 */
export function calculateArrearsImmediateModeA({ serviceFee = 0, totalCycleMonths = 1, remainingMonths = 1 }) {
  if (totalCycleMonths <= 0 || remainingMonths <= 0 || serviceFee <= 0) return 0;
  const monthlyRate = serviceFee / totalCycleMonths;
  return Math.round(monthlyRate * remainingMonths);
}

/**
 * Mode B: Truy thu ngược vào đợt đối soát tiếp theo (Roll-forward settlement)
 * - Nếu thời gian sử dụng trong kỳ trước >= n tháng (minActiveMonths):
 *   Phí truy thu/học sinh = (Phí dịch vụ / số tháng của kỳ hoặc năm) x Số tháng sử dụng thực tế kỳ trước
 * - Nếu thời gian sử dụng trong kỳ trước < n tháng:
 *   Phí truy thu = 0đ (không truy thu kỳ trước, nhưng tính vào danh sách học sinh active kỳ tiếp theo)
 * @param {Object} params
 * @param {number} params.serviceFee - Tổng phí dịch vụ kỳ hoặc năm
 * @param {number} params.totalCycleMonths - Tổng số tháng của kỳ hoặc năm
 * @param {number} params.priorUsageMonths - Số tháng học sinh đã sử dụng thực tế trong kỳ trước
 * @param {number} params.minActiveMonths - Ngưỡng tối thiểu để tính phí truy thu (mặc định 1)
 * @returns {Object} { isArrearsCharged: boolean, arrearsFeePerStudent: number, includeInNextPeriod: boolean }
 */
export function calculateArrearsRetroactiveModeB({
  serviceFee = 0,
  totalCycleMonths = 1,
  priorUsageMonths = 0,
  minActiveMonths = 1,
}) {
  const isArrearsCharged = priorUsageMonths >= Number(minActiveMonths);
  let arrearsFeePerStudent = 0;

  if (isArrearsCharged && totalCycleMonths > 0 && serviceFee > 0) {
    const monthlyRate = serviceFee / totalCycleMonths;
    arrearsFeePerStudent = Math.round(monthlyRate * priorUsageMonths);
  }

  return {
    isArrearsCharged,
    arrearsFeePerStudent,
    includeInNextPeriod: true, // Always included in the next cycle's active base
  };
}

/**
 * Calculates reconciliation cycle fee based on pricing unit
 * Supports:
 * - By Term: user active x VNĐ/tháng x số tháng của kỳ OR user active x VNĐ/kỳ
 * - By Month: user active x VNĐ/tháng
 * - By Year: user active x VNĐ/tháng x số tháng năm OR user active x VNĐ/năm
 * @param {Object} params
 * @param {number} params.activeStudents
 * @param {number} params.unitPrice - Unit price amount
 * @param {string} params.pricingUnit - 'PER_MONTH' | 'PER_PERIOD' | 'PER_YEAR'
 * @param {number} params.cycleMonths - Number of months in the cycle (e.g. 5 for term, 1 for month, 12 for year)
 * @returns {number} calculated total fee
 */
export function calculateCycleTariff({
  activeStudents = 0,
  unitPrice = 0,
  pricingUnit = 'PER_MONTH',
  cycleMonths = 1,
}) {
  if (activeStudents <= 0 || unitPrice <= 0) return 0;

  if (pricingUnit === 'PER_MONTH') {
    return Math.round(activeStudents * unitPrice * (cycleMonths > 0 ? cycleMonths : 1));
  }
  // If PER_PERIOD or PER_YEAR, unitPrice is already the flat rate per student for the entire cycle
  return Math.round(activeStudents * unitPrice);
}

