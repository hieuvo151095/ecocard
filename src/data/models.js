/**
 * ECO Card Portal - Module M6 (Đối soát)
 * Domain Constants and Models
 */

export const RECONCILIATION_SERVICES = [
  { id: 'managementSoftware', name: 'Phần mềm quản lý nhà trường', shortName: 'Phần mềm QL' },
  { id: 'cameraAi', name: 'Camera AI', shortName: 'Camera AI' },
  { id: 'studentCard', name: 'Thẻ học sinh', shortName: 'Thẻ học sinh' },
  { id: 'canteen', name: 'Căn tin học đường', shortName: 'Căn tin' },
];

export const SETTLEMENT_SCOPES = {
  GROUP: 'GROUP', // Theo nhóm trường
  BRANCH: 'BRANCH', // Theo từng trường
};

export const SETTLEMENT_SCOPE_LABELS = {
  [SETTLEMENT_SCOPES.GROUP]: 'Theo nhóm trường',
  [SETTLEMENT_SCOPES.BRANCH]: 'Theo từng trường',
};

export const SESSION_STATUS = {
  DRAFT: 'DRAFT', // Nháp
  PENDING_APPROVAL: 'PENDING_APPROVAL', // Chờ duyệt
  APPROVED: 'APPROVED', // Đã duyệt
  REJECTED: 'REJECTED', // Đã từ chối
  SENT_TO_SCHOOL: 'SENT_TO_SCHOOL', // Đã gửi trường
  PAID: 'PAID', // Đã thanh toán
  CANCELLED: 'CANCELLED', // Đã hủy
};

export const SESSION_STATUS_CONFIG = {
  [SESSION_STATUS.DRAFT]: {
    label: 'Nháp',
    color: 'text-[#687179] bg-[#E8EAEC]',
    dotColor: 'bg-[#687179]',
  },
  [SESSION_STATUS.PENDING_APPROVAL]: {
    label: 'Chờ duyệt',
    color: 'text-[#BF9500] bg-[#FFF4CC]',
    dotColor: 'bg-[#BF9500]',
  },
  [SESSION_STATUS.APPROVED]: {
    label: 'Đã duyệt',
    color: 'text-[#0070CE] bg-[#CCE2F5]',
    dotColor: 'bg-[#0070CE]',
  },
  [SESSION_STATUS.REJECTED]: {
    label: 'Đã từ chối',
    color: 'text-[#FF424E] bg-[#FFF1F2]',
    dotColor: 'bg-[#FF424E]',
  },
  [SESSION_STATUS.SENT_TO_SCHOOL]: {
    label: 'Đã gửi trường',
    color: 'text-[#1A94FF] bg-[#E6F1FB]',
    dotColor: 'bg-[#1A94FF]',
  },
  [SESSION_STATUS.PAID]: {
    label: 'Đã thanh toán',
    color: 'text-[#00AB56] bg-[#E6F7EF]',
    dotColor: 'bg-[#00AB56]',
  },
  [SESSION_STATUS.CANCELLED]: {
    label: 'Đã hủy',
    color: 'text-[#8B97A1] bg-[#F4F5F6]',
    dotColor: 'bg-[#8B97A1]',
  },
};

export const ARREARS_STATUS = {
  NORMAL: 'NORMAL', // Bình thường
  HAS_ARREARS: 'HAS_ARREARS', // Đã có truy thu
};

export const ARREARS_MODES = {
  ROLL_FORWARD: 'ROLL_FORWARD', // Gồm truy thu ngược đợt sau
  IMMEDIATE_T1: 'IMMEDIATE_T1', // Truy thu liền vào tháng tiếp theo
};

export const ARREARS_MODE_LABELS = {
  [ARREARS_MODES.ROLL_FORWARD]: 'Gồm truy thu ngược đợt sau',
  [ARREARS_MODES.IMMEDIATE_T1]: 'Truy thu liền vào tháng tiếp theo',
};

export const USER_ROLES = {
  OPS_ADMIN: 'OPS_ADMIN', // Quản trị viên Vận hành
  FINANCE_OFFICER: 'FINANCE_OFFICER', // Nhân viên Tài chính
  FINANCE_APPROVER: 'FINANCE_APPROVER', // Người duyệt Tài chính
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.OPS_ADMIN]: 'Vận hành (Ops Admin)',
  [USER_ROLES.FINANCE_OFFICER]: 'Tài chính (Finance Officer)',
  [USER_ROLES.FINANCE_APPROVER]: 'Người duyệt (Approver)',
};

/**
 * Format currency to Vietnamese format: 1.008.000đ
 */
export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0đ';
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}đ`;
}

/**
 * Format standard date: DD/MM/YYYY
 */
export function formatDate(dateString) {
  if (!dateString) return '--';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
