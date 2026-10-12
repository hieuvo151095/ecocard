import React, { useState, useEffect } from 'react';
import { usePortal } from '../../context/PortalContext.jsx';
import { formatVND, SESSION_STATUS, ARREARS_STATUS } from '../../data/models.js';
import {
  calculateArrearsImmediateModeA,
  calculateArrearsRetroactiveModeB,
} from '../../services/reconciliationCalculator.js';
import { Calculator, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export function TruyThuModal({ isOpen, onClose, parentSession }) {
  const { createArrearsSession } = usePortal();

  const branches = parentSession?.branchesSummary || [];
  const [selectedBranchId, setSelectedBranchId] = useState('');

  // Arrears Calculation Mechanism: 'MODE_A' (Thu liền tháng T+1) | 'MODE_B' (Truy thu ngược kỳ tiếp theo)
  const [arrearsMode, setArrearsMode] = useState('MODE_A');

  // Parameters
  const [studentCount, setStudentCount] = useState(15);
  const [totalCycleMonths, setTotalCycleMonths] = useState(5); // e.g. Kỳ 5 tháng hoặc Năm 10 tháng
  const [serviceFeePerStudent, setServiceFeePerStudent] = useState(50000); // 50.000đ / kỳ
  const [remainingMonths, setRemainingMonths] = useState(3); // Mode A: Tháng còn lại trong kỳ/năm
  const [priorUsageMonths, setPriorUsageMonths] = useState(2); // Mode B: Tháng thực tế đã dùng kỳ trước
  const [minActiveMonths, setMinActiveMonths] = useState(1);
  const [reason, setReason] = useState('Bổ sung học sinh đăng ký muộn sau ngày chốt kỳ');

  useEffect(() => {
    if (parentSession) {
      if (parentSession.branchesSummary?.[0]?.branchId) {
        setSelectedBranchId(parentSession.branchesSummary[0].branchId);
      }
      if (parentSession.snapshot?.thresholds?.minActiveMonths) {
        setMinActiveMonths(parentSession.snapshot.thresholds.minActiveMonths);
      }
    }
  }, [parentSession, isOpen]);

  if (!isOpen || !parentSession) return null;

  const targetBranch = branches.find((b) => b.branchId === selectedBranchId) || branches[0];

  // Pure Direct Calculations (No conditional hook issues)
  const feePerUserA = calculateArrearsImmediateModeA({
    serviceFee: Number(serviceFeePerStudent) || 0,
    totalCycleMonths: Number(totalCycleMonths) || 1,
    remainingMonths: Number(remainingMonths) || 1,
  });
  const totalArrearsA = feePerUserA * (Number(studentCount) || 0);
  const modeACalculation = { feePerUser: feePerUserA, totalArrears: totalArrearsA };

  const resB = calculateArrearsRetroactiveModeB({
    serviceFee: Number(serviceFeePerStudent) || 0,
    totalCycleMonths: Number(totalCycleMonths) || 1,
    priorUsageMonths: Number(priorUsageMonths) || 0,
    minActiveMonths: Number(minActiveMonths) || 1,
  });
  const totalArrearsB = resB.arrearsFeePerStudent * (Number(studentCount) || 0);
  const modeBCalculation = { ...resB, totalArrears: totalArrearsB };

  const activeArrearsTotal =
    arrearsMode === 'MODE_A' ? modeACalculation.totalArrears : modeBCalculation.totalArrears;

  const activeFeePerUser =
    arrearsMode === 'MODE_A' ? modeACalculation.feePerUser : modeBCalculation.arrearsFeePerStudent;


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
      isArrears: true,
      arrearsMode,
      parentSessionId: parentSession.id,
      targetBranchId: targetBranch.branchId,
      targetBranchName: targetBranch.branchName,
      totalActiveStudents: Number(studentCount) || 0,
      periodFee: 0,
      arrearsFee: activeArrearsTotal,
      totalFee: activeArrearsTotal,
      snapshot: parentSession.snapshot,
      reason: `${reason} (${arrearsMode === 'MODE_A' ? 'Thu liền tháng T+1' : 'Truy thu ngược kỳ tiếp theo'})`,
      branchesSummary: [
        {
          branchId: targetBranch.branchId,
          branchCode: targetBranch.branchCode,
          branchName: targetBranch.branchName,
          studentCount: Number(studentCount) || 0,
          activeStudents: Number(studentCount) || 0,
          periodFee: 0,
          arrearsFee: activeArrearsTotal,
          totalFee: activeArrearsTotal,
          serviceBreakdown: [
            {
              serviceId: 'managementSoftware',
              serviceName: `Truy thu ${arrearsMode === 'MODE_A' ? 'tháng T+1' : 'kỳ tiếp theo'}`,
              isEnabled: true,
              activeStudents: Number(studentCount) || 0,
              unitPrice: activeFeePerUser,
              totalFee: activeArrearsTotal,
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                BR07 & BR09
              </span>
              <h2 className="text-base font-bold text-[#232628]">Công cụ tính & Tạo phiên truy thu</h2>
            </div>
            <p className="text-xs text-[#687179] mt-0.5">
              Xử lý các trường hợp học sinh active sau kỳ đối soát của phiên <strong>{parentSession.sessionCode}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleCreateTruyThu} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Branch Selector */}
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

          {/* Mode Selector (Mode A vs Mode B) */}
          <div>
            <label className="block font-bold text-[#232628] mb-2">
              Hình thức xử lý user active sau ngày chốt:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setArrearsMode('MODE_A')}
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  arrearsMode === 'MODE_A'
                    ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0070CE]">1. Thu liền tháng T+1</span>
                    <input
                      type="radio"
                      checked={arrearsMode === 'MODE_A'}
                      onChange={() => setArrearsMode('MODE_A')}
                      className="accent-[#0070CE]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Thu ngay vào tháng tiếp theo (T+1). Phí = (Phí dịch vụ / số tháng) × Số tháng còn lại trong kỳ/năm.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setArrearsMode('MODE_B')}
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  arrearsMode === 'MODE_B'
                    ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#00AB56]">2. Truy thu ngược đợt sau</span>
                    <input
                      type="radio"
                      checked={arrearsMode === 'MODE_B'}
                      onChange={() => setArrearsMode('MODE_B')}
                      className="accent-[#00AB56]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    Đánh giá ngưỡng ≥ n tháng trong kỳ trước để truy thu thực tế, và đồng thời tính vào base học sinh kỳ sau.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Parameter Grid */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">
              Thông số tính toán theo công thức
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Số học sinh bổ sung <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={studentCount}
                  onChange={(e) => setStudentCount(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Tổng số tháng của kỳ / năm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={totalCycleMonths}
                  onChange={(e) => setTotalCycleMonths(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Biểu phí trọn gói (VND/kỳ hoặc năm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={serviceFeePerStudent}
                  onChange={(e) => setServiceFeePerStudent(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              {arrearsMode === 'MODE_A' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Số tháng sử dụng còn lại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalCycleMonths}
                    value={remainingMonths}
                    onChange={(e) => setRemainingMonths(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    (Phí / {totalCycleMonths} tháng) × {remainingMonths} tháng còn lại
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Số tháng đã dùng thực tế kỳ trước <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={totalCycleMonths}
                    value={priorUsageMonths}
                    onChange={(e) => setPriorUsageMonths(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-[#0070CE]"
                    required
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    So sánh với ngưỡng tối thiểu: ≥ {minActiveMonths} tháng
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Live Calculated Output Box */}
          <div className="p-4 bg-gradient-to-br from-[#E6F1FB] to-blue-50 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#003867]">Kết quả tính phí tự động:</span>
              <span className="text-[11px] font-semibold text-[#0070CE]">
                {arrearsMode === 'MODE_A'
                  ? `Thu vào tháng T+1: ${formatVND(activeFeePerUser)}/học sinh`
                  : modeBCalculation.isArrearsCharged
                  ? `Đạt ngưỡng ≥ ${minActiveMonths} tháng: ${formatVND(activeFeePerUser)}/học sinh`
                  : `Dưới ngưỡng < ${minActiveMonths} tháng: 0đ (không truy thu)`}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
              <span className="text-xs text-gray-700">
                Tổng tiền phiên truy thu ({studentCount} học sinh):
              </span>
              <span className="text-lg font-extrabold text-[#0070CE]">{formatVND(activeArrearsTotal)}</span>
            </div>

            {arrearsMode === 'MODE_B' && !modeBCalculation.isArrearsCharged && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>
                  Học sinh dưới ngưỡng không bị tính phí kỳ trước (0đ), nhưng vẫn được tự động cộng vào danh sách học sinh tính phí của kỳ đối soát tiếp theo.
                </span>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Lý do truy thu</label>
            <textarea
              rows="2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 border rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Tạo phiên truy thu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TruyThuModal;
