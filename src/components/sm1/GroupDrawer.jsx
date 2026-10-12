import React, { useState, useEffect } from 'react';
import { SETTLEMENT_SCOPES, ARREARS_MODES } from '../../data/models.js';
import { generatePeriodSchedule } from '../../services/reconciliationCalculator.js';

function addDays(dateStr, numDays) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const d = new Date(year, month, day);
    d.setDate(d.getDate() + numDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  d.setDate(d.getDate() + numDays);
  return d.toISOString().split('T')[0];
}

export function GroupDrawer({ isOpen, onClose, group, onSave }) {
  const isEditing = Boolean(group);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    taxCode: '',
    bankName: '',
    bankAccount: '',
    bankAccountName: '',
    settlementScope: SETTLEMENT_SCOPES.GROUP,
    arrearsMode: ARREARS_MODES.ROLL_FORWARD,
    emails: '',
    cycleType: 'YEARLY',
    serviceYearStart: '',
    serviceYearEnd: '',
    periodsCount: '',
    minActiveMonths: 1,
    surplusDayThreshold: 15,
    periods: [],
  });

  useEffect(() => {
    if (group) {
      const derivedCycleType = group.cycleType || (group.periods && group.periods.length > 1 ? 'PERIODIC' : 'YEARLY');
      let initialPeriods = [];

      if (derivedCycleType === 'YEARLY') {
        const start = group.serviceYearStart || '2026-09-01';
        const end = group.serviceYearEnd || '2027-05-31';
        initialPeriods = [
          {
            id: 'Kỳ 1',
            name: (group.periods && group.periods[0]?.name) || 'Năm học',
            startDate: start,
            endDate: end,
            isFeeCollected: true,
            hasActiveSession: false,
          },
        ];
      } else {
        initialPeriods = group.periods ? JSON.parse(JSON.stringify(group.periods)) : [];
      }

      setFormData({
        code: group.code || '',
        name: group.name || '',
        taxCode: group.taxCode || '',
        bankName: group.bankName || '',
        bankAccount: group.bankAccount || '',
        bankAccountName: group.bankAccountName || '',
        settlementScope: group.settlementScope || SETTLEMENT_SCOPES.GROUP,
        arrearsMode: group.arrearsMode || ARREARS_MODES.ROLL_FORWARD,
        emails: (group.emails || []).join(', '),
        cycleType: derivedCycleType,
        serviceYearStart: group.serviceYearStart || '2026-09-01',
        serviceYearEnd: group.serviceYearEnd || '2027-05-31',
        periodsCount: derivedCycleType === 'YEARLY' ? '1' : (group.periodsCount !== undefined && group.periodsCount !== null ? String(group.periodsCount) : (group.periods ? String(group.periods.length) : '')),
        minActiveMonths: group.thresholds?.minActiveMonths || 1,
        surplusDayThreshold: group.thresholds?.surplusDayThreshold || 15,
        periods: initialPeriods,
      });
    } else {
      // Default new group: empty inputs and empty periods list
      setFormData({
        code: '',
        name: '',
        taxCode: '',
        bankName: '',
        bankAccount: '',
        bankAccountName: '',
        settlementScope: SETTLEMENT_SCOPES.GROUP,
        arrearsMode: ARREARS_MODES.ROLL_FORWARD,
        emails: '',
        cycleType: 'YEARLY',
        serviceYearStart: '',
        serviceYearEnd: '',
        periodsCount: '1',
        minActiveMonths: 1,
        surplusDayThreshold: 15,
        periods: [],
      });
    }
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleCycleTypeSelect = (newType) => {
    setFormData((prev) => {
      if (newType === 'YEARLY') {
        const start = prev.serviceYearStart || '2026-09-01';
        const end = prev.serviceYearEnd || '2027-05-31';
        return {
          ...prev,
          cycleType: 'YEARLY',
          periodsCount: '1',
          periods: [
            {
              id: 'Kỳ 1',
              name: 'Năm học',
              startDate: start,
              endDate: end,
              isFeeCollected: true,
              hasActiveSession: false,
            },
          ],
        };
      } else {
        // Switching to PERIODIC: clear periods list
        return {
          ...prev,
          cycleType: 'PERIODIC',
          periodsCount: prev.periodsCount === '1' ? '' : prev.periodsCount,
          periods: [],
        };
      }
    });
  };

  const handleServiceYearStartChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, serviceYearStart: val };
      if (prev.cycleType === 'YEARLY' && prev.periods.length > 0) {
        updated.periods = prev.periods.map((p, idx) => (idx === 0 ? { ...p, startDate: val } : p));
      }
      return updated;
    });
  };

  const handleServiceYearEndChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, serviceYearEnd: val };
      if (prev.cycleType === 'YEARLY' && prev.periods.length > 0) {
        updated.periods = prev.periods.map((p, idx) => (idx === 0 ? { ...p, endDate: val } : p));
      }
      return updated;
    });
  };

  const handleGeneratePeriods = () => {
    if (!formData.serviceYearStart || !formData.serviceYearEnd) {
      alert('Vui lòng nhập đầy đủ Từ ngày và Đến ngày để sinh lịch đối soát');
      return;
    }

    if (formData.cycleType === 'YEARLY') {
      const generated = [
        {
          id: 'Kỳ 1',
          name: 'Năm học',
          startDate: formData.serviceYearStart,
          endDate: formData.serviceYearEnd,
          isFeeCollected: true,
          hasActiveSession: false,
        },
      ];
      setFormData((prev) => ({ ...prev, periodsCount: '1', periods: generated }));
      return;
    }

    if (!formData.periodsCount) {
      alert('Vui lòng nhập Số kỳ để sinh lịch đối soát');
      return;
    }

    const count = Number(formData.periodsCount);
    if (isNaN(count) || count <= 0) {
      alert('Số kỳ đối soát phải lớn hơn 0');
      return;
    }
    const generated = generatePeriodSchedule(
      formData.serviceYearStart,
      formData.serviceYearEnd,
      count
    );
    setFormData((prev) => ({ ...prev, periods: generated }));
  };

  const handleAddPeriod = () => {
    if (formData.cycleType === 'YEARLY') return;

    const newIdx = formData.periods.length + 1;
    let newStartDate = formData.serviceYearStart || '';
    let newEndDate = formData.serviceYearEnd || '';

    if (formData.periods.length > 0) {
      const lastPeriod = formData.periods[formData.periods.length - 1];
      if (lastPeriod.endDate) {
        newStartDate = addDays(lastPeriod.endDate, 1);
        newEndDate = formData.serviceYearEnd && formData.serviceYearEnd > newStartDate
          ? formData.serviceYearEnd
          : newStartDate;
      }
    }

    const newPeriod = {
      id: `Kỳ ${newIdx}`,
      name: `Kỳ ${newIdx}`,
      startDate: newStartDate,
      endDate: newEndDate,
      isFeeCollected: true,
      hasActiveSession: false,
    };
    setFormData((prev) => ({ ...prev, periods: [...prev.periods, newPeriod] }));
  };

  const handleRemovePeriod = (index) => {
    setFormData((prev) => ({
      ...prev,
      periods: prev.periods.filter((_, idx) => idx !== index),
    }));
  };

  const handlePeriodChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.periods];
      updated[index] = { ...updated[index], [field]: value };

      let updatedStart = prev.serviceYearStart;
      let updatedEnd = prev.serviceYearEnd;

      if (prev.cycleType === 'YEARLY' && index === 0) {
        if (field === 'startDate') updatedStart = value;
        if (field === 'endDate') updatedEnd = value;
      }

      // If user changes endDate of period i, automatically adjust startDate of period i + 1 to endDate + 1 day
      if (field === 'endDate' && value && index + 1 < updated.length) {
        const nextStartDate = addDays(value, 1);
        updated[index + 1] = {
          ...updated[index + 1],
          startDate: nextStartDate,
        };

        // If next period's endDate is before its new startDate, adjust it
        if (updated[index + 1].endDate && updated[index + 1].endDate < nextStartDate) {
          updated[index + 1].endDate = nextStartDate;
        }
      }

      return {
        ...prev,
        serviceYearStart: updatedStart,
        serviceYearEnd: updatedEnd,
        periods: updated,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Vui lòng nhập Mã nhóm trường và Tên nhóm trường');
      return;
    }

    let emailList = [];
    if (formData.settlementScope === SETTLEMENT_SCOPES.GROUP) {
      emailList = formData.emails
        .split(/[,;]/)
        .map((e) => e.trim())
        .filter(Boolean);

      if (emailList.length === 0) {
        alert('Vui lòng nhập Email nhận biên bản của nhóm (BR03)');
        return;
      }

      if (emailList.length > 3) {
        alert('Email nhận biên bản tối đa 3 địa chỉ (BR03)');
        return;
      }
    }

    const finalPeriods = formData.cycleType === 'YEARLY'
      ? formData.periods.slice(0, 1)
      : formData.periods;

    const updatedBranches = (group?.branches || []).map((b) => {
      if (formData.settlementScope === SETTLEMENT_SCOPES.GROUP) {
        return { ...b, emails: emailList };
      }
      return b;
    });

    const payload = {
      id: group?.id || `G-${formData.code.toUpperCase()}`,
      code: formData.code.toUpperCase().trim(),
      name: formData.name.trim(),
      taxCode: formData.taxCode.trim(),
      bankName: formData.bankName.trim(),
      bankAccount: formData.bankAccount.trim(),
      bankAccountName: formData.bankAccountName.trim(),
      settlementScope: formData.settlementScope,
      arrearsMode: formData.arrearsMode || ARREARS_MODES.ROLL_FORWARD,
      emails: emailList,
      cycleType: formData.cycleType || 'YEARLY',
      serviceYearStart: formData.serviceYearStart,
      serviceYearEnd: formData.serviceYearEnd,
      periodsCount: formData.cycleType === 'YEARLY' ? 1 : (Number(formData.periodsCount) || finalPeriods.length),
      thresholds: {
        minActiveMonths: Number(formData.minActiveMonths),
        surplusDayThreshold: Number(formData.surplusDayThreshold),
      },
      periods: finalPeriods,
      isActive: group?.isActive ?? true,
      branches: updatedBranches,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-base font-bold text-[#232628]">
              {isEditing ? `Cập nhật nhóm trường: ${formData.code}` : 'Tạo mới nhóm trường'}
            </h2>
            <p className="text-xs text-[#687179] mt-0.5">
              Thiết lập thông tin pháp nhân, đơn vị đối soát, lịch kỳ và ngưỡng thu phí
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* SECTION 1: Thông tin pháp nhân */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-[#232628]">Thông tin pháp nhân</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Mã nhóm trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isEditing}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ví dụ: HIEUTEST"
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] ${
                    isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  required
                />
                {isEditing && (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Mã nhóm trường là khóa định danh duy nhất không thể chỉnh sửa (BR01)
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Tên nhóm trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Hệ thống Trường Hieutest"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">Mã số thuế</label>
                <input
                  type="text"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                  placeholder="Ví dụ: 0312345678"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">Ngân hàng</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Ví dụ: Vietcombank"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">Số tài khoản</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="Ví dụ: 0071001234567"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">Tên chủ tài khoản</label>
                <input
                  type="text"
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                  placeholder="Ví dụ: HE THONG TRUONG HIEUTEST"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Đơn vị đối soát */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-[#232628]">Đơn vị đối soát</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  formData.settlementScope === SETTLEMENT_SCOPES.GROUP
                    ? 'border-[#0070CE] bg-[#E6F1FB]/30 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#232628]">Theo nhóm trường</span>
                  <input
                    type="radio"
                    name="settlementScope"
                    checked={formData.settlementScope === SETTLEMENT_SCOPES.GROUP}
                    onChange={() => setFormData({ ...formData, settlementScope: SETTLEMENT_SCOPES.GROUP })}
                    className="accent-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-[#687179] leading-relaxed">
                  Tạo phiên gộp cả nhóm thành một dòng, sinh một biên bản đối soát duy nhất cho cả pháp nhân (BR02).
                </p>
              </label>

              <label
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  formData.settlementScope === SETTLEMENT_SCOPES.BRANCH
                    ? 'border-[#0070CE] bg-[#E6F1FB]/30 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#232628]">Theo từng trường</span>
                  <input
                    type="radio"
                    name="settlementScope"
                    checked={formData.settlementScope === SETTLEMENT_SCOPES.BRANCH}
                    onChange={() => setFormData({ ...formData, settlementScope: SETTLEMENT_SCOPES.BRANCH })}
                    className="accent-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-[#687179] leading-relaxed">
                  Mỗi chi nhánh được tạo thành một phiên đối soát và biên bản riêng biệt (BR02).
                </p>
              </label>
            </div>

            {formData.settlementScope === SETTLEMENT_SCOPES.GROUP && (
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Email nhận biên bản của nhóm (Tối đa 3 email) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                  placeholder="email1@school.edu.vn, email2@school.edu.vn"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Phân tách các email bằng dấu phẩy hoặc chấm phẩy (BR03).
                </span>
              </div>
            )}
          </div>

          {/* SECTION 3: Lịch kỳ đối soát & Năm dịch vụ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#232628]">Lịch kỳ đối soát & Năm sử dụng dịch vụ</h3>
              </div>
              {formData.cycleType !== 'YEARLY' && (
                <button
                  type="button"
                  onClick={handleAddPeriod}
                  className="text-xs text-[#0070CE] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Thêm kỳ thủ công
                </button>
              )}
            </div>

            {/* Cycle Mode Picker: [1] Đối soát theo năm vs [2] Đối soát theo kỳ */}
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 border rounded-xl cursor-pointer transition flex items-center justify-between ${
                  formData.cycleType === 'YEARLY'
                    ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cycleType"
                    checked={formData.cycleType === 'YEARLY'}
                    onChange={() => handleCycleTypeSelect('YEARLY')}
                    className="accent-[#0070CE]"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">1. Đối soát theo năm</span>
                    <span className="text-[11px] text-gray-500">Cấu hình năm học/năm dịch vụ trọn gói (cố định 1 kỳ)</span>
                  </div>
                </div>
              </label>

              <label
                className={`p-3 border rounded-xl cursor-pointer transition flex items-center justify-between ${
                  formData.cycleType === 'PERIODIC'
                    ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cycleType"
                    checked={formData.cycleType === 'PERIODIC'}
                    onChange={() => handleCycleTypeSelect('PERIODIC')}
                    className="accent-[#0070CE]"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">2. Đối soát theo kỳ</span>
                    <span className="text-[11px] text-gray-500">Cấu hình theo từng kỳ/học kỳ riêng biệt</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Generator Controls */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Từ ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.serviceYearStart}
                  onChange={(e) => handleServiceYearStartChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Đến ngày <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.serviceYearEnd}
                  onChange={(e) => handleServiceYearEndChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="w-24">
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Số kỳ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    disabled={formData.cycleType === 'YEARLY'}
                    placeholder={formData.cycleType === 'YEARLY' ? '1' : 'VD: 9'}
                    value={formData.cycleType === 'YEARLY' ? '1' : formData.periodsCount}
                    onChange={(e) => setFormData({ ...formData, periodsCount: e.target.value })}
                    className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] ${
                      formData.cycleType === 'YEARLY'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200 font-bold text-center'
                        : 'bg-white text-gray-800'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePeriods}
                  className="flex-1 px-3 py-1.5 bg-[#0070CE] text-white text-xs font-semibold rounded-lg hover:bg-[#00549B] transition shadow-2xs cursor-pointer"
                >
                  Sinh lịch kỳ
                </button>
              </div>
            </div>

            {/* Periods Table: Only show if periods array has items */}
            {formData.periods.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden animate-in fade-in duration-150">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Tên kỳ</th>
                      <th className="py-2 px-3">Từ ngày</th>
                      <th className="py-2 px-3">Đến ngày</th>
                      <th className="py-2 px-3 text-center">Thu phí (BR05)</th>
                      <th className="py-2 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(formData.cycleType === 'YEARLY' ? formData.periods.slice(0, 1) : formData.periods).map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handlePeriodChange(idx, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-xs border rounded font-medium"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="date"
                            value={p.startDate}
                            onChange={(e) => handlePeriodChange(idx, 'startDate', e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="date"
                            value={p.endDate}
                            onChange={(e) => handlePeriodChange(idx, 'endDate', e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={p.isFeeCollected}
                            onChange={(e) => handlePeriodChange(idx, 'isFeeCollected', e.target.checked)}
                            className="w-4 h-4 accent-[#0070CE] cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-3 text-right">
                          {formData.cycleType === 'YEARLY' ? (
                            <span className="text-gray-400 text-xs italic">Cố định 1 kỳ</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemovePeriod(idx)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                              title="Xóa kỳ này"
                            >
                              Xóa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 bg-gray-50/70 border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-500">
                <span>Chưa có danh sách kỳ đối soát. Vui lòng nhập <strong>Từ ngày</strong>, <strong>Đến ngày</strong>, <strong>Số kỳ</strong> và bấm <strong>"Sinh lịch kỳ"</strong> (hoặc bấm <strong>"+ Thêm kỳ thủ công"</strong>).</span>
              </div>
            )}
          </div>

          {/* SECTION 4: Ngưỡng thu phí */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-bold text-[#232628]">Ngưỡng thu phí (BR06 & BR07)</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Ngưỡng thu (tháng) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.minActiveMonths}
                    onChange={(e) => setFormData({ ...formData, minActiveMonths: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-500">tháng</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Số tháng active tối thiểu để tính phí trong kỳ (BR06)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Ngày dư làm tròn lên 1 tháng (lần đầu) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.surplusDayThreshold}
                    onChange={(e) => setFormData({ ...formData, surplusDayThreshold: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-500">ngày</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Quy đổi số ngày dư thành 1 tháng (ví dụ ≥ 15 ngày tính tròn 1 tháng - BR07)
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Hình thức truy thu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="text-sm font-bold text-[#232628]">Hình thức truy thu</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  formData.arrearsMode === ARREARS_MODES.ROLL_FORWARD
                    ? 'border-[#0070CE] bg-[#E6F1FB]/30 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0070CE]">Gồm truy thu ngược đợt sau</span>
                  <input
                    type="radio"
                    name="arrearsMode"
                    checked={formData.arrearsMode === ARREARS_MODES.ROLL_FORWARD}
                    onChange={() => setFormData({ ...formData, arrearsMode: ARREARS_MODES.ROLL_FORWARD })}
                    className="accent-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-[#687179] leading-relaxed">
                  Tổng phí đợt sau bao gồm phí dịch vụ cần truy thu của đợt trước (học sinh dùng ≥ {formData.minActiveMonths} tháng) và phí của đợt này.
                </p>
              </label>

              <label
                className={`p-3.5 border rounded-xl cursor-pointer transition flex flex-col justify-between ${
                  formData.arrearsMode === ARREARS_MODES.IMMEDIATE_T1
                    ? 'border-[#0070CE] bg-[#E6F1FB]/30 ring-1 ring-[#0070CE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-900">Truy thu liền vào tháng tiếp theo</span>
                  <input
                    type="radio"
                    name="arrearsMode"
                    checked={formData.arrearsMode === ARREARS_MODES.IMMEDIATE_T1}
                    onChange={() => setFormData({ ...formData, arrearsMode: ARREARS_MODES.IMMEDIATE_T1 })}
                    className="accent-[#0070CE]"
                  />
                </div>
                <p className="text-[11px] text-[#687179] leading-relaxed">
                  Thu bổ sung ngay vào tháng T+1 cho các học sinh active sau ngày chốt của kỳ trước (thu theo số tháng sử dụng còn lại của kỳ trước).
                </p>
              </label>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupDrawer;
