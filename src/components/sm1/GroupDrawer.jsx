import React, { useState, useEffect } from 'react';
import { SETTLEMENT_SCOPES } from '../../data/models.js';
import { generatePeriodSchedule } from '../../services/reconciliationCalculator.js';

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
    emails: '',
    serviceYearStart: '2026-09-01',
    serviceYearEnd: '2027-05-31',
    periodsCount: 9,
    minActiveMonths: 1,
    surplusDayThreshold: 15,
    periods: [],
  });

  useEffect(() => {
    if (group) {
      setFormData({
        code: group.code || '',
        name: group.name || '',
        taxCode: group.taxCode || '',
        bankName: group.bankName || '',
        bankAccount: group.bankAccount || '',
        bankAccountName: group.bankAccountName || '',
        settlementScope: group.settlementScope || SETTLEMENT_SCOPES.GROUP,
        emails: (group.emails || []).join(', '),
        serviceYearStart: group.serviceYearStart || '2026-09-01',
        serviceYearEnd: group.serviceYearEnd || '2027-05-31',
        periodsCount: group.periodsCount || 9,
        minActiveMonths: group.thresholds?.minActiveMonths || 1,
        surplusDayThreshold: group.thresholds?.surplusDayThreshold || 15,
        periods: group.periods ? JSON.parse(JSON.stringify(group.periods)) : [],
      });
    } else {
      // Default new group
      const defaultPeriods = generatePeriodSchedule('2026-09-01', '2027-05-31', 9);
      setFormData({
        code: '',
        name: '',
        taxCode: '',
        bankName: '',
        bankAccount: '',
        bankAccountName: '',
        settlementScope: SETTLEMENT_SCOPES.GROUP,
        emails: '',
        serviceYearStart: '2026-09-01',
        serviceYearEnd: '2027-05-31',
        periodsCount: 9,
        minActiveMonths: 1,
        surplusDayThreshold: 15,
        periods: defaultPeriods,
      });
    }
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleGeneratePeriods = () => {
    const generated = generatePeriodSchedule(
      formData.serviceYearStart,
      formData.serviceYearEnd,
      Number(formData.periodsCount) || 9
    );
    setFormData((prev) => ({ ...prev, periods: generated }));
  };

  const handleAddPeriod = () => {
    const newIdx = formData.periods.length + 1;
    const newPeriod = {
      id: `Kỳ ${newIdx}`,
      name: `Kỳ ${newIdx}`,
      startDate: formData.serviceYearStart,
      endDate: formData.serviceYearEnd,
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
      return { ...prev, periods: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Vui lòng nhập Mã nhóm trường và Tên nhóm trường');
      return;
    }

    const emailList = formData.emails
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (emailList.length > 3) {
      alert('Email nhận biên bản tối đa 3 địa chỉ (BR03)');
      return;
    }

    const payload = {
      id: group?.id || `G-${formData.code.toUpperCase()}`,
      code: formData.code.toUpperCase().trim(),
      name: formData.name.trim(),
      taxCode: formData.taxCode.trim(),
      bankName: formData.bankName.trim(),
      bankAccount: formData.bankAccount.trim(),
      bankAccountName: formData.bankAccountName.trim(),
      settlementScope: formData.settlementScope,
      emails: emailList,
      serviceYearStart: formData.serviceYearStart,
      serviceYearEnd: formData.serviceYearEnd,
      periodsCount: Number(formData.periodsCount),
      thresholds: {
        minActiveMonths: Number(formData.minActiveMonths),
        surplusDayThreshold: Number(formData.surplusDayThreshold),
      },
      periods: formData.periods,
      isActive: group?.isActive ?? true,
      branches: group?.branches || [],
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
          </div>

          {/* SECTION 3: Lịch kỳ đối soát */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#0070CE] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#232628]">Lịch kỳ đối soát</h3>
              </div>
              <button
                type="button"
                onClick={handleAddPeriod}
                className="text-xs text-[#0070CE] font-semibold hover:underline flex items-center gap-1"
              >
                + Thêm kỳ thủ công
              </button>
            </div>

            {/* Generator Controls */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={formData.serviceYearStart}
                  onChange={(e) => setFormData({ ...formData, serviceYearStart: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={formData.serviceYearEnd}
                  onChange={(e) => setFormData({ ...formData, serviceYearEnd: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="w-20">
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Số kỳ</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.periodsCount}
                    onChange={(e) => setFormData({ ...formData, periodsCount: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePeriods}
                  className="flex-1 px-3 py-1.5 bg-[#0070CE] text-white text-xs font-semibold rounded-lg hover:bg-[#00549B] transition"
                >
                  Sinh lịch kỳ
                </button>
              </div>
            </div>

            {/* Periods Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                  {formData.periods.map((p, idx) => (
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
                        <button
                          type="button"
                          onClick={() => handleRemovePeriod(idx)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                          title="Xóa kỳ này"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
