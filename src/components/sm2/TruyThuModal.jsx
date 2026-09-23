import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext.jsx';
import { formatVND, SESSION_STATUS, ARREARS_STATUS } from '../../data/models.js';

export function TruyThuModal({ isOpen, onClose, parentSession }) {
  const { createArrearsSession } = usePortal();

  const branches = parentSession?.branchesSummary || [];
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.branchId || '');
  const [arrearsStudents, setArrearsStudents] = useState(10);
  const [arrearsAmount, setArrearsAmount] = useState(250000);
  const [reason, setReason] = useState('Bổ sung học sinh đăng ký muộn sau ngày chốt kỳ');

  if (!isOpen || !parentSession) return null;

  const targetBranch = branches.find((b) => b.branchId === selectedBranchId) || branches[0];

  const handleCreateTruyThu = (e) => {
    e.preventDefault();
    if (!targetBranch) return;

    const childCode = `${parentSession.sessionCode}-TT${Math.floor(Math.random() * 900 + 100)}`;
    const childSession = {
      id: childCode,
      sessionCode: childCode,
      groupId: parentSession.groupId,
      groupCode: parentSession.groupCode,
      groupName: parentSession.groupName,
      settlementScope: parentSession.settlementScope,
      periodId: parentSession.periodId,
      periodName: parentSession.periodName,
      cutOffDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: SESSION_STATUS.DRAFT,
      arrearsStatus: ARREARS_STATUS.NORMAL,
      isReleased: false,
      isArrears: true, // Mark as child arrears session (BR07)
      parentSessionId: parentSession.id,
      targetBranchId: targetBranch.branchId,
      targetBranchName: targetBranch.branchName,
      totalActiveStudents: Number(arrearsStudents) || 0,
      periodFee: 0,
      arrearsFee: Number(arrearsAmount) || 0,
      totalFee: Number(arrearsAmount) || 0,
      snapshot: parentSession.snapshot,
      reason,
      branchesSummary: [
        {
          branchId: targetBranch.branchId,
          branchCode: targetBranch.branchCode,
          branchName: targetBranch.branchName,
          studentCount: Number(arrearsStudents) || 0,
          activeStudents: Number(arrearsStudents) || 0,
          periodFee: 0,
          arrearsFee: Number(arrearsAmount) || 0,
          totalFee: Number(arrearsAmount) || 0,
          serviceBreakdown: [
            {
              serviceId: 'managementSoftware',
              serviceName: 'Phần mềm quản lý (Truy thu)',
              isEnabled: true,
              activeStudents: Number(arrearsStudents) || 0,
              unitPrice: 15000,
              totalFee: Number(arrearsAmount) || 0,
            },
          ],
        },
      ],
    };

    createArrearsSession(parentSession.id, childSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                BR07
              </span>
              <h2 className="text-base font-bold text-[#232628]">Tạo phiên truy thu (Arrears Session)</h2>
            </div>
            <p className="text-xs text-[#687179] mt-0.5">
              Tạo phiên truy thu con từ phiên gốc <strong>{parentSession.sessionCode}</strong> (Đã thanh toán)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleCreateTruyThu} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Chi nhánh / Trường áp dụng truy thu <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-[#0070CE]"
              required
            >
              {branches.map((b) => (
                <option key={b.branchId} value={b.branchId}>
                  {b.branchName} ({b.branchCode})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Số học sinh truy thu <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={arrearsStudents}
                onChange={(e) => setArrearsStudents(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Số tiền truy thu (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={arrearsAmount}
                onChange={(e) => setArrearsAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Lý do truy thu</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
              required
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="text-[11px] text-[#003867]">
              Phiên truy thu con sẽ được lồng dưới phiên gốc <strong>{parentSession.sessionCode}</strong> trong danh sách và trải qua vòng đời duyệt tương tự phiên chính.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm"
            >
              Tạo phiên truy thu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TruyThuModal;
