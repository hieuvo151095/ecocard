/**
 * Student Data Generator & Registry for M6 Phiên đối soát
 * Implements dynamic BR06 (Ngưỡng thu) & BR07 (Làm tròn ngày dư) rules:
 * - 1 month = 30 days standard. Max 30 days active -> Không tính phí (0đ).
 * - Minimum 31 days active -> Có tính phí.
 * - Days surplus >= surplusDayThreshold -> +1 month (e.g. 132 days -> 5 months; 128 days -> 4 months).
 * - Monthly fee = billedMonths * unitPrice.
 */

import { calculateStudentBilling } from './reconciliationCalculator.js';

export const EXACT_AUTO_ECO_STUDENTS = [
  // 1 & 2: Nguyễn Minh Thanh (132 days: 120 + 12 days >= 10 -> 5 months)
  {
    id: 'STU-001',
    name: 'Nguyễn Minh Thanh',
    uid: '096300000001',
    actualDays: 132,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 25000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 25000,
  },
  {
    id: 'STU-002',
    name: 'Nguyễn Minh Thanh',
    uid: '096300000003',
    actualDays: 132,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 25000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 25000,
  },
  {
    id: 'STU-003',
    name: 'Nguyễn Minh Thanh',
    uid: '096300000003',
    actualDays: 132,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 50000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 50000,
  },
  {
    id: 'STU-004',
    name: 'Nguyễn Minh Thanh',
    uid: '096300000001',
    actualDays: 132,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 50000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 50000,
  },

  // 5 & 6: Nguyễn Nam Auto05 (131 days: 120 + 11 days >= 10 -> 5 months)
  {
    id: 'STU-005',
    name: 'Nguyễn Nam Auto05',
    uid: '096300000005',
    actualDays: 131,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 25000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 25000,
  },
  {
    id: 'STU-006',
    name: 'Nguyễn Nam Auto05',
    uid: '096300000005',
    actualDays: 131,
    thresholdMonths: 5,
    billedMonths: 5,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 50000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 50000,
  },

  // 7 & 8: Nguyễn Nam AutoA1_15 (128 days: 120 + 8 days < 10 -> 4 months)
  {
    id: 'STU-007',
    name: 'Nguyễn Nam AutoA1_15',
    uid: '096300000015',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-008',
    name: 'Nguyễn Nam AutoA1_15',
    uid: '096300000015',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // 9 & 10: Nguyễn Nam AutoA1_16 (128 days: 120 + 8 days < 10 -> 4 months)
  {
    id: 'STU-009',
    name: 'Nguyễn Nam AutoA1_16',
    uid: '096300000016',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-010',
    name: 'Nguyễn Nam AutoA1_16',
    uid: '096300000016',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // Page 2 items
  // 11 & 12: Nguyễn Nam AutoA1_17 (128 days -> 4 months)
  {
    id: 'STU-011',
    name: 'Nguyễn Nam AutoA1_17',
    uid: '096300000017',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-012',
    name: 'Nguyễn Nam AutoA1_17',
    uid: '096300000017',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // 13 & 14: Nguyễn Nam AutoA1_18 (128 days -> 4 months)
  {
    id: 'STU-013',
    name: 'Nguyễn Nam AutoA1_18',
    uid: '096300000018',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-014',
    name: 'Nguyễn Nam AutoA1_18',
    uid: '096300000018',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // 15 & 16: Nguyễn Nam AutoA1_19 (128 days -> 4 months)
  {
    id: 'STU-015',
    name: 'Nguyễn Nam AutoA1_19',
    uid: '096300000019',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-016',
    name: 'Nguyễn Nam AutoA1_19',
    uid: '096300000019',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // 17 & 18: Nguyễn Nam AutoA1_20 (128 days -> 4 months)
  {
    id: 'STU-017',
    name: 'Nguyễn Nam AutoA1_20',
    uid: '096300000020',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 20000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 20000,
  },
  {
    id: 'STU-018',
    name: 'Nguyễn Nam AutoA1_20',
    uid: '096300000020',
    actualDays: 128,
    thresholdMonths: 4,
    billedMonths: 4,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 40000,
    arrearsFee: 0,
    result: 'Có tính phí',
    totalFee: 40000,
  },

  // 19 & 20: Nguyễn Nam AutoA1_21 (25 days active <= 30 days max -> Không tính phí!)
  {
    id: 'STU-019',
    name: 'Nguyễn Nam AutoA1_21',
    uid: '096300000021',
    actualDays: 25,
    thresholdMonths: 0,
    billedMonths: 0,
    serviceId: 'cameraAi',
    serviceName: 'Camera AI',
    unitPrice: 5000,
    periodFee: 0,
    arrearsFee: 0,
    result: 'Không tính phí',
    totalFee: 0,
  },
  {
    id: 'STU-020',
    name: 'Nguyễn Nam AutoA1_21',
    uid: '096300000021',
    actualDays: 25,
    thresholdMonths: 0,
    billedMonths: 0,
    serviceId: 'managementSoftware',
    serviceName: 'Phần mềm quản lý nhà trường',
    unitPrice: 10000,
    periodFee: 0,
    arrearsFee: 0,
    result: 'Không tính phí',
    totalFee: 0,
  },
];

/**
 * Returns dynamically evaluated student list for any branch in a session
 * Applies threshold evaluation and surplus rounding on the fly
 */
export function getBranchStudentList(branchSummary, session) {
  const thresholds = session?.thresholds
    || session?.snapshot?.thresholds
    || branchSummary?.groupThresholds
    || { minActiveMonths: 1, surplusDayThreshold: 10 };

  const rawStudents = (branchSummary.students && branchSummary.students.length > 0)
    ? branchSummary.students
    : ((branchSummary.branchName?.includes('Auto_Eco') || branchSummary.branchCode?.includes('AUTO_SCHOOL'))
        ? EXACT_AUTO_ECO_STUDENTS
        : generateSyntheticStudents(branchSummary, thresholds));

  // Dynamically calculate student fee per service using current thresholds
  return rawStudents.map((s) => {
    let unitPrice = s.unitPrice;
    if (!unitPrice) {
      if (s.serviceId === 'cameraAi') unitPrice = 5000;
      else if (s.serviceId === 'managementSoftware') unitPrice = 10000;
      else if (s.serviceId === 'studentCard') unitPrice = 5000;
      else if (s.serviceId === 'canteen') unitPrice = 10000;
      else unitPrice = 5000;
    }

    return calculateStudentBilling(s, thresholds, unitPrice);
  });
}

function generateSyntheticStudents(branchSummary, thresholds) {
  const activeServices = (branchSummary.serviceBreakdown || []).filter(s => s.isEnabled && s.activeStudents > 0);
  if (activeServices.length === 0) {
    return [];
  }

  const sampleNames = [
    'Nguyễn Minh Thanh', 'Trần Bảo Anh', 'Lê Hoàng Nam', 'Phạm Quỳnh Chi',
    'Hoàng Gia Huy', 'Vũ Thảo Vy', 'Đặng Quốc Bảo', 'Bùi Ngọc Linh',
    'Đỗ Quang Khải', 'Ngô Phương Anh', 'Dương Anh Khoa', 'Lý Hải Đăng'
  ];

  const studentCount = Math.min(branchSummary.activeStudents || 10, 15);
  const result = [];

  for (let i = 0; i < studentCount; i++) {
    const name = sampleNames[i % sampleNames.length];
    const uid = `0963${String(i + 1).padStart(8, '0')}`;
    // Generate realistic days: some with surplus >= 10, some < 10, some <= 30 days
    let actualDays = 120 + ((i * 7) % 30);
    if (i === studentCount - 1) {
      actualDays = 25; // demonstrate <= 30 days non-billable rule
    }

    for (const srv of activeServices) {
      const fee = srv.unitPrice > 0 ? srv.unitPrice : 5000;
      result.push({
        id: `STU-${branchSummary.branchCode}-${i}-${srv.serviceId}`,
        name: `${name} ${i > 4 ? `(Lớp ${6 + (i % 4)}A)` : ''}`.trim(),
        uid,
        actualDays,
        serviceId: srv.serviceId,
        serviceName: srv.serviceName,
        unitPrice: fee,
        arrearsFee: 0,
      });
    }
  }

  return result;
}
