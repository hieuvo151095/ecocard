import React, { useState, useMemo } from 'react';
import { usePortal } from '../../context/PortalContext.jsx';
import {
  SETTLEMENT_SCOPES,
  SETTLEMENT_SCOPE_LABELS,
  formatVND,
  formatDate,
  SESSION_STATUS,
  ARREARS_STATUS,
} from '../../data/models.js';
import {
  calculateBranchFees,
  validateZeroFeeGuard,
  createSessionSnapshot,
} from '../../services/reconciliationCalculator.js';

export function CreateSessionModal({ isOpen, onClose, onCreated }) {
  const { groups, createSession } = usePortal();

  // Wizard Step: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Group & Branch Selection
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  // Step 2: Period & Date
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [cutOffDate, setCutOffDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [includeArrears, setIncludeArrears] = useState(false);

  // Simulated student attendance adjustment for demo (slider to trigger 0 VND guard)
  const [studentActivityFactor, setStudentActivityFactor] = useState(1.0); // 1.0 = normal, 0 = 0 active students (triggers MSG-01)

  const activeGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0] || null;
  }, [groups, selectedGroupId]);

  // Set initial default selections when group changes
  React.useEffect(() => {
    if (activeGroup) {
      setSelectedGroupId(activeGroup.id);
      setSelectedBranchIds((activeGroup.branches || []).map((b) => b.id));
      const firstAvailablePeriod = (activeGroup.periods || []).find((p) => !p.hasActiveSession);
      setSelectedPeriodId(firstAvailablePeriod?.id || activeGroup.periods?.[0]?.id || 'Kỳ 1');
    }
  }, [activeGroup?.id]);

  if (!isOpen || !activeGroup) return null;

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    const grp = groups.find((g) => g.id === groupId);
    if (grp) {
      setSelectedBranchIds((grp.branches || []).map((b) => b.id));
      const firstAvail = (grp.periods || []).find((p) => !p.hasActiveSession);
      setSelectedPeriodId(firstAvail?.id || grp.periods?.[0]?.id || 'Kỳ 1');
    }
  };

  const handleToggleBranch = (branchId) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const handleSelectAllBranches = () => {
    if (selectedBranchIds.length === (activeGroup.branches || []).length) {
      setSelectedBranchIds([]);
    } else {
      setSelectedBranchIds((activeGroup.branches || []).map((b) => b.id));
    }
  };

  // Step 3 Live Calculations
  const selectedPeriod = (activeGroup.periods || []).find((p) => p.id === selectedPeriodId) || activeGroup.periods[0];
  const selectedBranches = (activeGroup.branches || []).filter((b) => selectedBranchIds.includes(b.id));

  const branchCalculations = selectedBranches.map((b) => {
    // Simulated active student scanning
    const activeCount = Math.round((b.studentCount || 0) * studentActivityFactor);
    const mockPreviousArrears = includeArrears ? 150000 : 0;
    return calculateBranchFees(
      b,
      selectedPeriod.id,
      b.tariffs || {},
      activeCount,
      includeArrears,
      mockPreviousArrears
    );
  });

  const zeroFeeValidation = validateZeroFeeGuard(branchCalculations);

  const totalActiveStudents = branchCalculations.reduce((sum, b) => sum + b.activeStudents, 0);
  const totalPeriodFee = branchCalculations.reduce((sum, b) => sum + b.periodFee, 0);
  const totalArrearsFee = branchCalculations.reduce((sum, b) => sum + b.arrearsFee, 0);
  const grandTotalFee = totalPeriodFee + totalArrearsFee;

  const handleCreate = () => {
    if (!zeroFeeValidation.isValid) return;

    const sessionCode = `REC-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
    const frozenSnapshot = createSessionSnapshot(
      activeGroup,
      selectedBranches,
      selectedPeriod,
      activeGroup.thresholds
    );

    const newSession = {
      id: sessionCode,
      sessionCode,
      groupId: activeGroup.id,
      groupCode: activeGroup.code,
      groupName: activeGroup.name,
      settlementScope: activeGroup.settlementScope,
      periodId: selectedPeriod.id,
      periodName: selectedPeriod.name,
      cutOffDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: SESSION_STATUS.DRAFT,
      arrearsStatus: includeArrears ? ARREARS_STATUS.HAS_ARREARS : ARREARS_STATUS.NORMAL,
      isReleased: false,
      isArrears: false,
      parentSessionId: null,
      totalActiveStudents,
      periodFee: totalPeriodFee,
      arrearsFee: totalArrearsFee,
      totalFee: grandTotalFee,
      snapshot: frozenSnapshot,
      branchesSummary: branchCalculations,
    };

    createSession(newSession);
    if (onCreated) onCreated(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-bold text-[#232628]">Tạo phiên đối soát mới</h2>
            <p className="text-xs text-[#687179] mt-0.5">
              Bước {currentStep}/3: {currentStep === 1 && 'Chọn nhóm trường & trường'}
              {currentStep === 2 && 'Chọn kỳ đối soát & ngày chốt'}
              {currentStep === 3 && 'Xem trước số liệu quét học sinh và tính phí'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="bg-[#F8FAFC] px-8 py-3 border-b border-[#E8EAEC]">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            
            {/* Step 1 Pill */}
            <div className="relative z-10 flex items-center gap-2 bg-[#F8FAFC] px-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  currentStep >= 1 ? 'bg-[#0070CE] text-white shadow-sm' : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </span>
              <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-[#0070CE]' : 'text-gray-500'}`}>
                Chọn nhóm & trường
              </span>
            </div>

            {/* Step 2 Pill */}
            <div className="relative z-10 flex items-center gap-2 bg-[#F8FAFC] px-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  currentStep >= 2 ? 'bg-[#0070CE] text-white shadow-sm' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </span>
              <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-[#0070CE]' : 'text-gray-500'}`}>
                Chọn kỳ & ngày chốt
              </span>
            </div>

            {/* Step 3 Pill */}
            <div className="relative z-10 flex items-center gap-2 bg-[#F8FAFC] px-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  currentStep >= 3 ? 'bg-[#0070CE] text-white shadow-sm' : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </span>
              <span className={`text-xs font-semibold ${currentStep >= 3 ? 'text-[#0070CE]' : 'text-gray-500'}`}>
                Xem trước số liệu
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CHỌN NHÓM TRƯỜNG & CHI NHÁNH */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#232628] mb-2">
                  1. Chọn nhóm trường đối soát <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {groups.map((grp) => {
                    const isSelected = grp.id === activeGroup.id;
                    return (
                      <div
                        key={grp.id}
                        onClick={() => handleSelectGroup(grp.id)}
                        className={`p-3.5 border rounded-xl cursor-pointer transition ${
                          isSelected
                            ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-[#00AB56] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            {grp.code}
                          </span>
                          <span className="text-[10px] text-gray-500">{grp.branches?.length || 0} trường</span>
                        </div>
                        <div className="font-semibold text-xs text-[#232628] mt-1 truncate">{grp.name}</div>
                        <div className="text-[11px] text-[#687179] mt-0.5">
                          {SETTLEMENT_SCOPE_LABELS[grp.settlementScope]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group Meta Info Banner */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-[#003867] flex flex-wrap gap-x-6 gap-y-1">
                <span>
                  Đơn vị đối soát: <strong>{SETTLEMENT_SCOPE_LABELS[activeGroup.settlementScope]}</strong>
                </span>
                <span>
                  Ngưỡng thu phí: <strong>{activeGroup.thresholds?.minActiveMonths} tháng</strong> ({activeGroup.thresholds?.surplusDayThreshold} ngày dư làm tròn)
                </span>
                <span>
                  Năm dịch vụ: <strong>{formatDate(activeGroup.serviceYearStart)} → {formatDate(activeGroup.serviceYearEnd)}</strong>
                </span>
              </div>

              {/* Branch Selection List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#232628]">
                    2. Chọn các trường / chi nhánh đối soát <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllBranches}
                    className="text-xs font-semibold text-[#0070CE] hover:underline"
                  >
                    {selectedBranchIds.length === (activeGroup.branches || []).length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {(!activeGroup.branches || activeGroup.branches.length === 0) ? (
                    <div className="p-6 text-center text-xs text-gray-400">
                      Nhóm trường này chưa có chi nhánh nào được cấu hình.
                    </div>
                  ) : (
                    activeGroup.branches.map((b) => {
                      const isChecked = selectedBranchIds.includes(b.id);
                      return (
                        <div
                          key={b.id}
                          onClick={() => handleToggleBranch(b.id)}
                          className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition ${
                            isChecked ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent div
                              className="w-4 h-4 accent-[#0070CE] rounded"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#0070CE]">{b.code}</span>
                                <span className="text-xs font-semibold text-gray-900">{b.name}</span>
                              </div>
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                {b.studentCount} học sinh đăng ký
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            {b.services?.managementSoftware && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#0070CE] font-medium border border-blue-100">
                                QL Nhà trường
                              </span>
                            )}
                            {b.services?.cameraAi && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-medium border border-amber-100">
                                Camera AI
                              </span>
                            )}
                            {b.services?.studentCard && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                                Thẻ HS
                              </span>
                            )}
                            {b.services?.canteen && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-medium border border-purple-100">
                                Căn tin
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CHỌN KỲ ĐỐI SOÁT & NGÀY CHỐT */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#232628] mb-2">
                  1. Chọn kỳ đối soát <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(activeGroup.periods || []).map((p) => {
                    const isSelected = p.id === selectedPeriodId;
                    const hasActiveSession = Boolean(p.hasActiveSession);

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (!hasActiveSession) setSelectedPeriodId(p.id);
                        }}
                        className={`p-3.5 border rounded-xl transition ${
                          hasActiveSession
                            ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE] cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#232628]">{p.name}</span>
                          {hasActiveSession ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                              Đã có phiên (BR01)
                            </span>
                          ) : isSelected ? (
                            <span className="w-2 h-2 rounded-full bg-[#0070CE]" />
                          ) : null}
                        </div>
                        <div className="text-[11px] text-[#687179]">
                          {formatDate(p.startDate)} → {formatDate(p.endDate)}
                        </div>
                        {hasActiveSession && (
                          <div className="text-[10px] text-amber-700 mt-1 font-medium">
                            Kỳ này đã có phiên đối soát đang hoạt động
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cut-off Date & Options */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-[#232628] mb-1">
                    Ngày chốt số liệu (BR10) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={cutOffDate}
                    onChange={(e) => setCutOffDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Mặc định là ngày hôm nay, dùng làm mốc quét học sinh active
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={includeArrears}
                      onChange={(e) => setIncludeArrears(e.target.checked)}
                      className="w-4 h-4 accent-[#0070CE] rounded"
                    />
                    <span className="text-xs font-medium text-[#232628]">
                      Truy thu phần chưa thu trước ngày bắt đầu kỳ này (BR09)
                    </span>
                  </label>
                  <span className="text-[10px] text-gray-500 ml-6 mt-1">
                    Nếu chọn, hệ thống sẽ gộp các khoản chưa thu phát sinh trước đó vào phiên này
                  </span>
                </div>
              </div>

              {/* Demo Sandbox Slider: Simulate 0 VND condition */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-900">
                  <span>Giả lập hoạt động học sinh (Kiểm thử BR03 / MSG-01):</span>
                  <span>{Math.round(studentActivityFactor * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={studentActivityFactor}
                  onChange={(e) => setStudentActivityFactor(Number(e.target.value))}
                  className="w-full accent-[#0070CE] cursor-pointer"
                />
                <span className="text-[10px] text-amber-700 block">
                  Kéo về 0% để kiểm thử cảnh báo chặn tạo phiên khi phí = 0đ (MSG-01).
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: XEM TRƯỚC SỐ LIỆU QUÉT HỌC SINH */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Zero-fee Guard Blocker Alert Banner (MSG-01) */}
              {!zeroFeeValidation.isValid && (
                <div className="p-4 bg-[#FFF5EB] border-l-4 border-[#FF9F41] rounded-r-xl shadow-xs">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#FF9F41] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
                    </svg>
                    <div>
                      <h4 className="text-xs font-bold text-[#4C3B00]">Cảnh báo chặn tạo phiên (BR03 / MSG-01)</h4>
                      <p className="text-xs text-[#7F6300] mt-0.5 leading-relaxed">
                        {zeroFeeValidation.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-medium">Tổng HS active</span>
                  <div className="text-lg font-bold text-gray-900 mt-1">{totalActiveStudents}</div>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-medium">Phí kỳ này</span>
                  <div className="text-lg font-bold text-gray-900 mt-1">{formatVND(totalPeriodFee)}</div>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-medium">Phí truy thu</span>
                  <div className="text-lg font-bold text-gray-900 mt-1">{formatVND(totalArrearsFee)}</div>
                </div>

                <div className="p-3.5 bg-[#E6F1FB] border border-blue-200 rounded-xl">
                  <span className="text-[11px] text-[#00549B] font-bold">Tổng cộng phải thu</span>
                  <div className="text-lg font-bold text-[#0070CE] mt-1">{formatVND(grandTotalFee)}</div>
                </div>
              </div>

              {/* Itemized Table per Branch */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3">Tên chi nhánh</th>
                      <th className="py-2.5 px-3 text-center">HS đăng ký</th>
                      <th className="py-2.5 px-3 text-center">HS active (quét)</th>
                      <th className="py-2.5 px-3 text-right">Phí kỳ này</th>
                      <th className="py-2.5 px-3 text-right">Truy thu</th>
                      <th className="py-2.5 px-3 text-right">Tổng thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {branchCalculations.map((b) => (
                      <tr key={b.branchId} className={b.totalFee === 0 ? 'bg-amber-50/50' : 'hover:bg-gray-50/60'}>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-gray-900">{b.branchName}</span>
                          <span className="text-[11px] text-gray-500 block font-mono">{b.branchCode}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-medium">{b.studentCount}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#0070CE]">{b.activeStudents}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{formatVND(b.periodFee)}</td>
                        <td className="py-2.5 px-3 text-right font-medium">{formatVND(b.arrearsFee)}</td>
                        <td className={`py-2.5 px-3 text-right font-bold ${b.totalFee === 0 ? 'text-red-500' : 'text-[#0070CE]'}`}>
                          {formatVND(b.totalFee)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E8EAEC] flex items-center justify-between bg-white">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              ← Quay lại
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              disabled={selectedBranchIds.length === 0}
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition disabled:opacity-50"
            >
              Tiếp tục: {currentStep === 1 ? 'Chọn kỳ' : 'Xem số liệu'} →
            </button>
          ) : (
            <button
              type="button"
              disabled={!zeroFeeValidation.isValid}
              onClick={handleCreate}
              className="px-6 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tạo phiên đối soát
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;
