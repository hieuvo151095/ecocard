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
 * Returns detailed partitioned student data:
 * - currentPeriodStudents: all active students in the current period (e.g. 70 for CS1, 60 for CS2)
 * - arrearsStudents: all back-charged students from prior period (e.g. 15 for CS1, 10 for CS2)
 */
export function getBranchDetailedStudentData(branchSummary, session) {
  const thresholds = session?.thresholds
    || session?.snapshot?.thresholds
    || branchSummary?.groupThresholds
    || { minActiveMonths: 1, surplusDayThreshold: 10 };

  const isRollForward = session?.arrearsOption === 'ROLL_FORWARD' || branchSummary?.arrearsOption === 'ROLL_FORWARD' || (branchSummary.arrearsStudents > 0);
  const isImmediate = session?.arrearsOption === 'IMMEDIATE_T1' || branchSummary?.arrearsOption === 'IMMEDIATE_T1' || session?.isArrears;

  if (isRollForward) {
    return generateRollForwardBranchData(branchSummary, thresholds);
  }

  if (isImmediate) {
    const immediateStudents = generateImmediateStudents(branchSummary, thresholds);
    return {
      currentPeriodStudents: [],
      arrearsStudents: immediateStudents,
    };
  }

  // Normal regular session
  const regularStudents = getBranchStudentList(branchSummary, session);
  return {
    currentPeriodStudents: regularStudents,
    arrearsStudents: [],
  };
}

/**
 * Helper: Add days to date string (DD/MM/YYYY)
 */
export function addDaysToDateStr(dateStr, days) {
  if (!dateStr) return '01/01/2027';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  d.setDate(d.getDate() + days);
  const resDay = String(d.getDate()).padStart(2, '0');
  const resMonth = String(d.getMonth() + 1).padStart(2, '0');
  const resYear = d.getFullYear();
  return `${resDay}/${resMonth}/${resYear}`;
}

/**
 * Builds realistic Active/Inactive audit logs for each student to compare active days
 */
export function buildStudentStatusLogs({ name, uid, actualDays, isArrears, joinDate, index = 0 }) {
  const operators = [
    { name: 'Trần Thu Hà', role: 'Admin Trường' },
    { name: 'Nguyễn Thị Mai', role: 'Admin Trường' },
    { name: 'Phạm Quốc Tuấn', role: 'GVCN Lớp 6A' },
    { name: 'Lê Văn Hoàng', role: 'GVCN Lớp 7B' },
    { name: 'Vũ Minh Trí', role: 'GVCN Lớp 8C' },
    { name: 'Lâm Thanh Phong', role: 'Finviet System (Auto Sync)' },
    { name: 'Đỗ Thị Ngọc', role: 'Cán bộ Y tế Trường' },
    { name: 'Hoàng Bảo Sơn', role: 'Ban Giám Hiệu' },
  ];

  const op1 = operators[index % operators.length];
  const op2 = operators[(index + 2) % operators.length];
  const op3 = operators[(index + 4) % operators.length];

  // ARREARS CASES
  if (isArrears) {
    const jDate = joinDate || '15/11/2026';

    // Discrepancy Case in Arrears (student index 2)
    if (index === 2) {
      const loggedDays = actualDays + 12;
      return {
        totalActiveDays: loggedDays,
        isInterrupted: true,
        isDiscrepancy: true,
        discrepancyDays: 12,
        discrepancyExplanation: `Học sinh thực tế nhập học và quẹt thẻ từ 03/11/2026 (${loggedDays} ngày), nhưng văn thư cập nhật hồ sơ muộn sang ngày 15/11/2026 (${actualDays} ngày). -> Đề xuất: Bổ sung truy thu 12 ngày (làm tròn lên 1 tháng) trong kỳ kế tiếp.`,
        calculationFormula: `30 ngày (chính) + 12 ngày (nhập trễ) = ${loggedDays} ngày`,
        events: [
          {
            id: `LOG-ARR-${uid}-${index}-1`,
            status: 'ACTIVE',
            statusLabel: 'Hoạt động',
            startDate: '03/11/2026',
            endDate: '14/11/2026',
            days: 12,
            changedBy: `${op1.name} (${op1.role})`,
            reason: 'Kích hoạt thẻ sử dụng thực tế tại trường (Nhập trễ)',
          },
          {
            id: `LOG-ARR-${uid}-${index}-2`,
            status: 'ACTIVE',
            statusLabel: 'Hoạt động',
            startDate: '15/11/2026',
            endDate: '31/12/2026',
            days: actualDays,
            changedBy: `${op2.name} (${op2.role})`,
            reason: 'Đồng bộ hồ sơ chính thức vào CSDL',
          },
        ],
      };
    }

    // Arrears student with temporary pause / re-activation (1 in 3 students)
    if (index % 3 === 1 && actualDays > 30) {
      const part1Days = Math.max(Math.floor(actualDays * 0.5), 15);
      const pauseDays = 4;
      const part2Days = actualDays - part1Days;
      const midDate = addDaysToDateStr(jDate, part1Days);
      const resumeDate = addDaysToDateStr(midDate, pauseDays);

      return {
        totalActiveDays: actualDays,
        isInterrupted: true,
        isDiscrepancy: false,
        discrepancyDays: 0,
        calculationFormula: `${part1Days} ngày (đợt 1) + ${part2Days} ngày (đợt 2) = ${actualDays} ngày`,
        events: [
          {
            id: `LOG-ARR-${uid}-${index}-1`,
            status: 'ACTIVE',
            statusLabel: 'Hoạt động',
            startDate: jDate,
            endDate: midDate,
            days: part1Days,
            changedBy: `${op1.name} (${op1.role})`,
            reason: 'Tiếp nhận học sinh chuyển trường giữa kỳ',
          },
          {
            id: `LOG-ARR-${uid}-${index}-2`,
            status: 'INACTIVE',
            statusLabel: 'Tạm dừng',
            startDate: addDaysToDateStr(midDate, 1),
            endDate: resumeDate,
            days: pauseDays,
            changedBy: `${op2.name} (${op2.role})`,
            reason: 'Tạm khóa thẻ do điều chỉnh thông tin lớp',
          },
          {
            id: `LOG-ARR-${uid}-${index}-3`,
            status: 'ACTIVE',
            statusLabel: 'Hoạt động lại',
            startDate: addDaysToDateStr(resumeDate, 1),
            endDate: '31/12/2026',
            days: part2Days,
            changedBy: `${op3.name} (${op3.role})`,
            reason: 'Kích hoạt lại sau khi hoàn tất xác thực',
          },
        ],
      };
    }

    // Normal continuous active arrears student
    return {
      totalActiveDays: actualDays,
      isInterrupted: false,
      isDiscrepancy: false,
      discrepancyDays: 0,
      calculationFormula: `${actualDays} ngày liên tục`,
      events: [
        {
          id: `LOG-ARR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: jDate,
          endDate: '31/12/2026',
          days: actualDays,
          changedBy: `${op1.name} (${op1.role})`,
          reason: `Học sinh gia nhập ngày ${jDate}`,
        },
      ],
    };
  }

  // CURRENT PERIOD CASES
  // Discrepancy Case 1: Extra 15 days active after cutoff date (index 3)
  if (index === 3) {
    const loggedDays = actualDays + 15;
    return {
      totalActiveDays: loggedDays,
      isInterrupted: true,
      isDiscrepancy: true,
      discrepancyDays: 15,
      discrepancyExplanation: `Phiên đối soát chốt dữ liệu theo kỳ (${actualDays} ngày). Sau ngày chốt, học sinh được Admin trường kích hoạt bổ sung thêm 15 ngày chưa kịp đồng bộ vào phiên đối soát này. -> Đề xuất: Lập phiên truy thu bổ sung 15 ngày ở kỳ đối soát tiếp theo.`,
      calculationFormula: `${actualDays} ngày (kỳ chốt) + 15 ngày (bổ sung) = ${loggedDays} ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: addDaysToDateStr('01/01/2027', actualDays),
          days: actualDays,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt sử dụng học kỳ đầy đủ',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động bổ sung',
          startDate: addDaysToDateStr('01/01/2027', actualDays + 1),
          endDate: addDaysToDateStr('01/01/2027', loggedDays),
          days: 15,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Kích hoạt gia hạn dịch vụ sau ngày chốt kỳ',
        },
      ],
    };
  }

  // Discrepancy Case 2: Medical leave 35 days not yet deducted in session (index 7)
  if (index === 7) {
    const loggedDays = Math.max(actualDays - 35, 80);
    return {
      totalActiveDays: loggedDays,
      isInterrupted: true,
      isDiscrepancy: true,
      discrepancyDays: -35,
      discrepancyExplanation: `Học sinh có đơn xin nghỉ phép 35 ngày (15/02 – 22/03) do phẫu thuật. GVCN gửi phiếu offline muộn nên hệ thống tính phí chưa kịp khấu trừ. -> Đề xuất: Cần giảm trừ / hoàn phí 1 tháng (10.000đ) ở kỳ đối soát tới.`,
      calculationFormula: `45 ngày (đợt 1) + ${loggedDays - 45} ngày (đợt 2) = ${loggedDays} ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: '14/02/2027',
          days: 45,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt tự động đầu kỳ học',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'INACTIVE',
          statusLabel: 'Nghỉ phép dài hạn',
          startDate: '15/02/2027',
          endDate: '22/03/2027',
          days: 35,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Học sinh nghỉ ốm / phẫu thuật (Phiếu xin phép muộn)',
        },
        {
          id: `LOG-CUR-${uid}-${index}-3`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động lại',
          startDate: '23/03/2027',
          endDate: addDaysToDateStr('23/03/2027', loggedDays - 45),
          days: loggedDays - 45,
          changedBy: `${op3.name} (${op3.role})`,
          reason: 'Kích hoạt lại khi học sinh đi học trở lại',
        },
      ],
    };
  }

  // Discrepancy Case 3: Exceeded threshold (index 12 with actualDays 25)
  if (actualDays === 25 && index % 2 === 1) {
    const loggedDays = 36;
    return {
      totalActiveDays: loggedDays,
      isInterrupted: true,
      isDiscrepancy: true,
      discrepancyDays: 11,
      discrepancyExplanation: `Học sinh có thêm 11 ngày kích hoạt thử nghiệm tính năng thẻ trước ngày khai giảng. Tổng ngày hoạt động thực tế đạt 36 ngày (> 30 ngày ngưỡng). -> Đề xuất: Kế toán cần xác nhận với BGH để chuyển sang trạng thái "Có tính phí" (1 tháng).`,
      calculationFormula: `25 ngày (chính) + 11 ngày (test) = 36 ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động thử nghiệm',
          startDate: '20/12/2026',
          endDate: '31/12/2026',
          days: 11,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt thử nghiệm đầu đọc thẻ trước kỳ',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: '25/01/2027',
          days: 25,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Kích hoạt chính thức đầu kỳ',
        },
      ],
    };
  }

  // Non-billable student <= 30 days
  if (actualDays === 25) {
    return {
      totalActiveDays: 25,
      isInterrupted: true,
      isDiscrepancy: false,
      discrepancyDays: 0,
      calculationFormula: `25 ngày hoạt động (≤ 30 ngày ngưỡng)`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: '25/01/2027',
          days: 25,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt đầu học kỳ',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'INACTIVE',
          statusLabel: 'Ngừng sử dụng',
          startDate: '26/01/2027',
          endDate: '25/05/2027',
          days: 120,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Học sinh chuyển trường đi nơi khác (Dừng thẻ)',
        },
      ],
    };
  }

  if (actualDays === 128) {
    // 128 days: 45 active + 8 inactive + 83 active = 128 active
    return {
      totalActiveDays: 128,
      isInterrupted: true,
      isDiscrepancy: false,
      discrepancyDays: 0,
      calculationFormula: `45 ngày (đợt 1) + 83 ngày (đợt 2) = 128 ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: '14/02/2027',
          days: 45,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt tự động đầu kỳ học',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'INACTIVE',
          statusLabel: 'Tạm dừng',
          startDate: '15/02/2027',
          endDate: '22/02/2027',
          days: 8,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Học sinh nghỉ ốm dài hạn / Tạm dừng thẻ',
        },
        {
          id: `LOG-CUR-${uid}-${index}-3`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động lại',
          startDate: '23/02/2027',
          endDate: '16/05/2027',
          days: 83,
          changedBy: `${op3.name} (${op3.role})`,
          reason: 'Kích hoạt lại khi học sinh đi học trở lại',
        },
      ],
    };
  }

  if (actualDays === 131) {
    // 131 days: 20 active + 5 inactive + 111 active = 131 active
    return {
      totalActiveDays: 131,
      isInterrupted: true,
      isDiscrepancy: false,
      discrepancyDays: 0,
      calculationFormula: `20 ngày (đợt 1) + 111 ngày (đợt 2) = 131 ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: '20/01/2027',
          days: 20,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt CSDL đầu năm học',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'INACTIVE',
          statusLabel: 'Tạm khóa',
          startDate: '21/01/2027',
          endDate: '25/01/2027',
          days: 5,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Học sinh báo mất thẻ / Chờ cấp lại phôi thẻ',
        },
        {
          id: `LOG-CUR-${uid}-${index}-3`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động lại',
          startDate: '26/01/2027',
          endDate: '16/05/2027',
          days: 111,
          changedBy: `${op3.name} (${op3.role})`,
          reason: 'Cấp thẻ mới thành công & Kích hoạt lại',
        },
      ],
    };
  }

  // Realistic split for some students (every 4th student)
  if (index % 4 === 0 && actualDays > 60) {
    const part1 = Math.floor(actualDays * 0.5);
    const pause = 6;
    const part2 = actualDays - part1;
    const midDate = addDaysToDateStr('01/01/2027', part1);
    const resumeDate = addDaysToDateStr(midDate, pause);

    return {
      totalActiveDays: actualDays,
      isInterrupted: true,
      isDiscrepancy: false,
      discrepancyDays: 0,
      calculationFormula: `${part1} ngày (đợt 1) + ${part2} ngày (đợt 2) = ${actualDays} ngày`,
      events: [
        {
          id: `LOG-CUR-${uid}-${index}-1`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động',
          startDate: '01/01/2027',
          endDate: midDate,
          days: part1,
          changedBy: `${op1.name} (${op1.role})`,
          reason: 'Kích hoạt tự động đầu kỳ học',
        },
        {
          id: `LOG-CUR-${uid}-${index}-2`,
          status: 'INACTIVE',
          statusLabel: 'Tạm dừng',
          startDate: addDaysToDateStr(midDate, 1),
          endDate: resumeDate,
          days: pause,
          changedBy: `${op2.name} (${op2.role})`,
          reason: 'Phụ huynh xin tạm ngưng dịch vụ ngắn hạn',
        },
        {
          id: `LOG-CUR-${uid}-${index}-3`,
          status: 'ACTIVE',
          statusLabel: 'Hoạt động lại',
          startDate: addDaysToDateStr(resumeDate, 1),
          endDate: addDaysToDateStr(resumeDate, part2),
          days: part2,
          changedBy: `${op3.name} (${op3.role})`,
          reason: 'Gia hạn & Kích hoạt lại sử dụng dịch vụ',
        },
      ],
    };
  }

  // Default continuous active
  return {
    totalActiveDays: actualDays,
    isInterrupted: false,
    isDiscrepancy: false,
    discrepancyDays: 0,
    calculationFormula: `${actualDays} ngày liên tục`,
    events: [
      {
        id: `LOG-CUR-${uid}-${index}-1`,
        status: 'ACTIVE',
        statusLabel: 'Hoạt động',
        startDate: '01/01/2027',
        endDate: addDaysToDateStr('01/01/2027', actualDays),
        days: actualDays,
        changedBy: `${op1.name} (${op1.role})`,
        reason: 'Kích hoạt dịch vụ học kỳ đầy đủ',
      },
    ],
  };
}

/**
 * Generates two distinct student arrays for Roll-Forward sessions:
 * 1. currentPeriodStudents: All N students in the current period (e.g. 70 for CS1, 60 for CS2)
 * 2. arrearsStudents: K students active after cutoff in prior period (e.g. 15 for CS1, 10 for CS2)
 */
function generateRollForwardBranchData(branchSummary, thresholds) {
  const sampleFirstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý'];
  const sampleMiddleNames = ['Minh', 'Gia', 'Bảo', 'Quỳnh', 'Hoàng', 'Thảo', 'Quốc', 'Ngọc', 'Quang', 'Phương', 'Anh', 'Hải'];
  const sampleLastNames = ['Thanh', 'Anh', 'Nam', 'Chi', 'Huy', 'Vy', 'Bảo', 'Linh', 'Khải', 'Trang', 'Khoa', 'Đăng'];

  const unitPrice = 10000; // 10.000đ/tháng
  const cycleMonths = 5;   // 5 tháng kỳ mới

  const totalCurrentCount = branchSummary.currentPeriodStudents || 70;
  const arrearsCount = branchSummary.arrearsStudents ?? 15;

  // 1. ALL STUDENTS IN CURRENT PERIOD (e.g. 70 for CS1, 60 for CS2)
  const currentPeriodStudents = [];
  for (let i = 1; i <= totalCurrentCount; i++) {
    const fName = sampleFirstNames[i % sampleFirstNames.length];
    const mName = sampleMiddleNames[(i * 3) % sampleMiddleNames.length];
    const lName = sampleLastNames[(i * 7) % sampleLastNames.length];
    const isNew = i > (totalCurrentCount - arrearsCount);
    const name = `${fName} ${mName} ${lName}${isNew ? ' (Mới)' : ''} ${i > 25 && !isNew ? `(Lớp ${6 + (i % 4)}A)` : ''}`.trim();
    const uid = `0963${String((branchSummary.branchCode?.charCodeAt(0) || 1) * 10000 + i).padStart(8, '0')}`;
    
    // Demonstrate realistic active days: most are full 132 days, 1 is non-billable <= 30 days
    let actualDays = 132;
    if (i === totalCurrentCount && totalCurrentCount > 20) {
      actualDays = 25; // <= 30 days non-billable test case
    } else if (i % 7 === 3) {
      actualDays = 128; // 128 days (4 months after rounding)
    } else if (i % 7 === 5) {
      actualDays = 131; // 131 days (5 months after rounding)
    }

    const billing = calculateStudentBilling(
      {
        id: `STU-CUR-${branchSummary.branchCode || 'BR'}-${i}`,
        name,
        uid,
        actualDays,
        serviceId: 'managementSoftware',
        serviceName: 'Phần mềm quản lý nhà trường',
        unitPrice,
      },
      thresholds,
      unitPrice
    );

    const statusLogs = buildStudentStatusLogs({
      name,
      uid,
      actualDays,
      isArrears: false,
      index: i,
    });

    currentPeriodStudents.push({
      ...billing,
      periodFee: billing.periodFee,
      arrearsFee: 0,
      totalFee: billing.periodFee,
      note: isNew ? 'Học sinh mới gia nhập kỳ này' : '', // Removed 'Học sinh tiếp tục sử dụng'
      isArrearsStudent: false,
      statusLogs,
    });
  }

  // 2. BACK-CHARGE STUDENTS FROM PRIOR PERIOD (e.g. 15 for CS1, 10 for CS2)
  const joinDates = [
    { date: '12/11/2026', priorDays: 49 },
    { date: '14/11/2026', priorDays: 47 },
    { date: '15/11/2026', priorDays: 46 },
    { date: '18/11/2026', priorDays: 43 },
    { date: '20/11/2026', priorDays: 41 },
    { date: '22/11/2026', priorDays: 39 },
    { date: '25/11/2026', priorDays: 36 },
    { date: '28/11/2026', priorDays: 33 },
    { date: '01/12/2026', priorDays: 30 },
    { date: '02/12/2026', priorDays: 29 },
    { date: '05/12/2026', priorDays: 26 },
    { date: '06/12/2026', priorDays: 25 },
    { date: '08/12/2026', priorDays: 23 },
    { date: '10/12/2026', priorDays: 21 },
    { date: '12/12/2026', priorDays: 19 },
    { date: '15/12/2026', priorDays: 16 },
    { date: '16/12/2026', priorDays: 15 },
    { date: '18/12/2026', priorDays: 13 },
    { date: '20/12/2026', priorDays: 11 },
    { date: '22/12/2026', priorDays: 9 },
    { date: '24/12/2026', priorDays: 7 },
    { date: '25/12/2026', priorDays: 6 },
    { date: '26/12/2026', priorDays: 5 },
    { date: '28/12/2026', priorDays: 3 },
    { date: '30/12/2026', priorDays: 1 },
  ];

  const arrearsStudents = [];
  const baseCount = totalCurrentCount - arrearsCount;

  for (let j = 0; j < arrearsCount; j++) {
    const studentIdx = baseCount + j + 1;
    const fName = sampleFirstNames[(j * 2 + 1) % sampleFirstNames.length];
    const mName = sampleMiddleNames[(j * 5 + 2) % sampleMiddleNames.length];
    const lName = sampleLastNames[(j * 3 + 4) % sampleLastNames.length];
    const name = `${fName} ${mName} ${lName} (Mới)`;
    const uid = `0963${String((branchSummary.branchCode?.charCodeAt(0) || 1) * 10000 + studentIdx).padStart(8, '0')}`;
    const jd = joinDates[j % joinDates.length] || { date: '15/11/2026', priorDays: 45 };

    // Strict evaluation of BR06 (Ngưỡng thu tháng) & BR07 (Làm tròn ngày dư) for prior period
    const minDaysThreshold = (thresholds.minActiveMonths || 1) * 30; // 30 days
    let billedMonths = 0;
    let thresholdMonths = 0;
    let result = 'Không tính phí';

    if (jd.priorDays > minDaysThreshold) {
      const baseMonths = Math.floor(jd.priorDays / 30);
      const surplusDays = jd.priorDays % 30;
      const isSurplusRounded = surplusDays >= (thresholds.surplusDayThreshold || 10);
      billedMonths = baseMonths + (isSurplusRounded ? 1 : 0);
      thresholdMonths = billedMonths;
      result = 'Có tính phí';
    }

    const arrearsFee = billedMonths * unitPrice;

    const statusLogs = buildStudentStatusLogs({
      name,
      uid,
      actualDays: jd.priorDays,
      isArrears: true,
      joinDate: jd.date,
      index: j,
    });

    arrearsStudents.push({
      id: `STU-ARR-${branchSummary.branchCode || 'BR'}-${studentIdx}`,
      name,
      uid,
      actualDays: jd.priorDays,
      thresholdMonths,
      billedMonths,
      serviceId: 'managementSoftware',
      serviceName: 'Phần mềm quản lý nhà trường',
      unitPrice,
      periodFee: 0,
      arrearsFee,
      result,
      totalFee: arrearsFee,
      note: `Gia nhập ngày ${jd.date}`, // Only keep 'Gia nhập ngày dd/mm/yyyy'
      isArrearsStudent: true,
      joinDate: jd.date,
      priorDays: jd.priorDays,
      statusLogs,
    });
  }

  return {
    currentPeriodStudents,
    arrearsStudents,
  };
}

/**
 * Returns dynamically evaluated student list for any branch in a session
 * Applies threshold evaluation and surplus rounding on the fly
 */
export function getBranchStudentList(branchSummary, session) {
  const thresholds = session?.thresholds
    || session?.snapshot?.thresholds
    || branchSummary?.groupThresholds
    || { minActiveMonths: 1, surplusDayThreshold: 10 };

  if (branchSummary.students && branchSummary.students.length > 0) {
    return branchSummary.students.map(s => calculateStudentBilling(s, thresholds, s.unitPrice || 10000));
  }

  const isRollForward = session?.arrearsOption === 'ROLL_FORWARD' || branchSummary?.arrearsOption === 'ROLL_FORWARD' || (branchSummary.arrearsStudents > 0);
  const isImmediate = session?.arrearsOption === 'IMMEDIATE_T1' || branchSummary?.arrearsOption === 'IMMEDIATE_T1' || session?.isArrears;

  if (isRollForward) {
    const data = generateRollForwardBranchData(branchSummary, thresholds);
    return [...data.currentPeriodStudents, ...data.arrearsStudents];
  }

  if (isImmediate) {
    return generateImmediateStudents(branchSummary, thresholds);
  }

  const rawStudents = (branchSummary.branchName?.includes('Auto_Eco') || branchSummary.branchCode?.includes('AUTO_SCHOOL'))
    ? EXACT_AUTO_ECO_STUDENTS
    : generateSyntheticStudents(branchSummary, thresholds);

  // Dynamically calculate student fee per service using current thresholds
  return rawStudents.map((s, idx) => {
    let unitPrice = s.unitPrice;
    if (!unitPrice) {
      if (s.serviceId === 'cameraAi') unitPrice = 5000;
      else if (s.serviceId === 'managementSoftware') unitPrice = 10000;
      else if (s.serviceId === 'studentCard') unitPrice = 5000;
      else if (s.serviceId === 'canteen') unitPrice = 10000;
      else unitPrice = 5000;
    }

    const billing = calculateStudentBilling(s, thresholds, unitPrice);
    const statusLogs = s.statusLogs || buildStudentStatusLogs({
      name: s.name,
      uid: s.uid,
      actualDays: s.actualDays,
      isArrears: false,
      index: idx,
    });

    return {
      ...billing,
      statusLogs,
    };
  });
}

function generateImmediateStudents(branchSummary, thresholds) {
  const sampleNames = [
    'Lê Hoàng Long', 'Trần Thu Trang', 'Phạm Minh Quân', 'Nguyễn Gia Hân',
    'Hoàng Nhật Nam', 'Đỗ Thảo Linh', 'Vũ Quốc Huy', 'Bùi Ngọc Mai',
    'Đặng Tuấn Kiệt', 'Ngô Phương Thảo', 'Dương Đức Anh', 'Lý Khánh An'
  ];

  const results = [];
  const unitPrice = 10000;
  const arrearsFeePerStudent = 30000; // 3 months remaining in previous cycle

  for (let i = 0; i < 25; i++) {
    const name = sampleNames[i % sampleNames.length] + ` (HS ${i + 1})`;
    const uid = `0963${String(100 + i + 1).padStart(8, '0')}`;
    const activeDays = 45 + (i % 20);

    const statusLogs = buildStudentStatusLogs({
      name,
      uid,
      actualDays: activeDays,
      isArrears: true,
      joinDate: '15/11/2026',
      index: i,
    });

    results.push({
      id: `STU-IMM-${i + 1}`,
      name,
      uid,
      actualDays: activeDays,
      thresholdMonths: 3,
      billedMonths: 3,
      serviceId: 'managementSoftware',
      serviceName: 'Truy thu bổ sung tháng T+1',
      unitPrice,
      periodFee: 0,
      arrearsFee: arrearsFeePerStudent,
      result: 'Truy thu T+1',
      totalFee: arrearsFeePerStudent,
      note: `Gia nhập ngày 15/11/2026`,
      isArrearsStudent: true,
      statusLogs,
    });
  }

  return results;
}

function generateSyntheticStudents(branchSummary, thresholds) {
  const activeServices = (branchSummary.serviceBreakdown || []).filter(s => s.isEnabled && s.activeStudents > 0);
  if (activeServices.length === 0) {
    return [];
  }

  const sampleNames = [
    'Nguyễn Minh Thanh', 'Trần Bảo Anh', 'Lê Hoàng Nam', 'Phạm Quỳnh Chi',
    'Hoàng Gia Huy', 'Vũ Thảo Vy', 'Đặng Quốc Bảo', 'Bùi Ngọc Linh',
    'Đỗ Quang Khải', 'Ngô Phương Anh', 'Dương Anh Khoa', 'Lý Hải Đăng',
    'Vũ Minh Tuấn', 'Trịnh Thảo Nhi', 'Lê Gia Hưng', 'Nguyễn Thu Trang'
  ];

  const studentCount = Math.min(branchSummary.activeStudents || 15, 30);
  const result = [];

  for (let i = 0; i < studentCount; i++) {
    const name = sampleNames[i % sampleNames.length];
    const uid = `0963${String((branchSummary.branchCode?.charCodeAt(0) || 1) * 10000 + i + 1).padStart(8, '0')}`;
    let actualDays = 120 + ((i * 7) % 30);
    if (i === studentCount - 1) {
      actualDays = 25; // <= 30 days non-billable rule
    }

    const srv = activeServices[i % activeServices.length] || activeServices[0];
    const fee = srv.unitPrice > 0 ? srv.unitPrice : 15000;

    result.push({
      id: `STU-${branchSummary.branchCode || 'BR'}-${i + 1}`,
      name: `${name} ${i > 4 ? `(Lớp ${6 + (i % 4)}A)` : ''}`.trim(),
      uid,
      actualDays,
      serviceId: srv.serviceId,
      serviceName: srv.serviceName,
      unitPrice: fee,
      arrearsFee: 0,
    });
  }

  return result;
}

