/**
 * ECO Card Portal - Module M6 (Đối soát)
 * Session Lifecycle State Machine and Permission Engine
 */

import { SESSION_STATUS, USER_ROLES } from '../data/models.js';

export const PERMITTED_ACTIONS = {
  [SESSION_STATUS.DRAFT]: [
    { key: 'RECALCULATE', label: 'Tính lại các nhánh', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN] },
    { key: 'SUBMIT_APPROVAL', label: 'Gửi duyệt', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN] },
    { key: 'CANCEL_SESSION', label: 'Hủy phiên', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN], isDestructive: true },
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.PENDING_APPROVAL]: [
    { key: 'APPROVE', label: 'Phê duyệt', role: [USER_ROLES.FINANCE_APPROVER, USER_ROLES.OPS_ADMIN] },
    { key: 'REJECT', label: 'Từ chối', role: [USER_ROLES.FINANCE_APPROVER, USER_ROLES.OPS_ADMIN], isDestructive: true },
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.APPROVED]: [
    { key: 'SEND_TO_SCHOOL', label: 'Gửi biên bản', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN] },
    { key: 'DOWNLOAD_STATEMENT', label: 'Tải biên bản', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'EXPORT_DATA', label: 'Xuất dữ liệu', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.SENT_TO_SCHOOL]: [
    { key: 'CONFIRM_PAYMENT', label: 'Xác nhận thanh toán', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN] },
    { key: 'DOWNLOAD_STATEMENT', label: 'Tải biên bản', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'EXPORT_DATA', label: 'Xuất dữ liệu', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.PAID]: [
    { key: 'CREATE_ARREARS', label: 'Tạo phiên truy thu', role: [USER_ROLES.FINANCE_OFFICER, USER_ROLES.OPS_ADMIN] },
    { key: 'DOWNLOAD_STATEMENT', label: 'Tải biên bản', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'EXPORT_DATA', label: 'Xuất dữ liệu', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.CANCELLED]: [
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
  [SESSION_STATUS.REJECTED]: [
    { key: 'VIEW_DETAIL', label: 'Xem chi tiết', role: [USER_ROLES.OPS_ADMIN, USER_ROLES.FINANCE_OFFICER, USER_ROLES.FINANCE_APPROVER] },
  ],
};

/**
 * Transitions session to the next valid state
 * @param {Object} session
 * @param {string} actionKey
 * @param {string} currentRole
 * @returns {Object} { success: boolean, updatedSession: Object, error: string|null }
 */
export function transitionSessionState(session, actionKey, currentRole = USER_ROLES.FINANCE_OFFICER) {
  if (!session) {
    return { success: false, updatedSession: null, error: 'Phiên không tồn tại.' };
  }

  const actions = PERMITTED_ACTIONS[session.status] || [];
  const matchedAction = actions.find((a) => a.key === actionKey);

  if (!matchedAction) {
    return {
      success: false,
      updatedSession: session,
      error: `Hành động ${actionKey} không hợp lệ cho trạng thái ${session.status}.`,
    };
  }

  if (!matchedAction.role.includes(currentRole)) {
    return {
      success: false,
      updatedSession: session,
      error: `Vai trò hiện tại không có quyền thực hiện hành động này.`,
    };
  }

  const updated = { ...session, updatedAt: new Date().toISOString() };

  switch (actionKey) {
    case 'SUBMIT_APPROVAL':
      updated.status = SESSION_STATUS.PENDING_APPROVAL;
      break;
    case 'APPROVE':
      updated.status = SESSION_STATUS.APPROVED;
      break;
    case 'REJECT':
      updated.status = SESSION_STATUS.REJECTED;
      break;
    case 'SEND_TO_SCHOOL':
      updated.status = SESSION_STATUS.SENT_TO_SCHOOL;
      break;
    case 'CONFIRM_PAYMENT':
      updated.status = SESSION_STATUS.PAID;
      break;
    case 'CANCEL_SESSION':
      updated.status = SESSION_STATUS.CANCELLED;
      updated.isReleased = true; // Đã nhả kết quả (holds released back to unbilled pool)
      break;
    default:
      break;
  }

  return { success: true, updatedSession: updated, error: null };
}
