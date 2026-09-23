import React, { useState, useEffect } from 'react';
import { RECONCILIATION_SERVICES, SETTLEMENT_SCOPE_LABELS } from '../../data/models.js';

export function BranchDrawer({ isOpen, onClose, group, branch, onSave }) {
  const isEditing = Boolean(branch);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    studentCount: 100,
    emails: '',
    services: {
      managementSoftware: true,
      cameraAi: false,
      studentCard: false,
      canteen: false,
    },
    tariffs: {},
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        code: branch.code || '',
        name: branch.name || '',
        studentCount: branch.studentCount || 100,
        emails: (branch.emails || []).join(', '),
        services: { ...(branch.services || {}) },
        tariffs: branch.tariffs ? JSON.parse(JSON.stringify(branch.tariffs)) : {},
      });
    } else {
      // Default new branch
      const initialTariffs = {};
      (group?.periods || []).forEach((p) => {
        initialTariffs[p.id] = {
          managementSoftware: 15000,
          cameraAi: 8000,
          studentCard: 5000,
          canteen: 10000,
        };
      });

      setFormData({
        code: `${group?.code || 'SCH'}_${(group?.branches?.length || 0) + 1}`,
        name: '',
        studentCount: 100,
        emails: (group?.emails || []).join(', '),
        services: {
          managementSoftware: true,
          cameraAi: true,
          studentCard: false,
          canteen: false,
        },
        tariffs: initialTariffs,
      });
    }
  }, [branch, group, isOpen]);

  if (!isOpen) return null;

  const handleToggleService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: !prev.services[serviceId],
      },
    }));
  };

  const handleTariffChange = (periodId, serviceId, value) => {
    setFormData((prev) => {
      const updated = { ...prev.tariffs };
      if (!updated[periodId]) updated[periodId] = {};
      updated[periodId][serviceId] = Number(value) || 0;
      return { ...prev, tariffs: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Vui lòng nhập Tên chi nhánh và Mã chi nhánh');
      return;
    }

    const emailList = formData.emails
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    const payload = {
      id: branch?.id || `BR-${formData.code}`,
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      studentCount: Number(formData.studentCount) || 0,
      emails: emailList,
      services: formData.services,
      tariffs: formData.tariffs,
      isActive: branch?.isActive ?? true,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#232628]">
                {isEditing ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh mới'}
              </h2>
              {isEditing && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-50 text-[#0070CE] border border-blue-200">
                  {formData.code}
                </span>
              )}
            </div>
            {/* Metadata Subhead */}
            <div className="flex items-center gap-3 mt-1 text-xs text-[#687179]">
              <span>
                Nhóm:{' '}
                <strong className="text-[#00AB56] font-semibold">{group?.code}</strong>
              </span>
              <span>•</span>
              <span>{SETTLEMENT_SCOPE_LABELS[group?.settlementScope]}</span>
              <span>•</span>
              <span>Ngưỡng: {group?.thresholds?.minActiveMonths} tháng ({group?.thresholds?.surplusDayThreshold} ngày dư)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Thông tin chi nhánh */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              1. Thông tin chi nhánh và hợp đồng
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Mã chi nhánh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isEditing}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ví dụ: HIEUTEST_1"
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none ${
                    isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Tên trường / chi nhánh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Tiểu học Hieutest Cơ sở 1"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Số học sinh đăng ký <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1">
                  Email nhận biên bản
                </label>
                <input
                  type="text"
                  value={formData.emails}
                  onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                  placeholder="cs1@hieutest.edu.vn"
                  className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dịch vụ áp dụng */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              2. Dịch vụ áp dụng cho chi nhánh
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {RECONCILIATION_SERVICES.map((srv) => {
                const isSelected = Boolean(formData.services[srv.id]);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleService(srv.id)}
                    className={`p-3 border rounded-xl cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#0070CE] bg-[#E6F1FB]/40 ring-1 ring-[#0070CE]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#232628] block">{srv.name}</span>
                      <span className="text-[10px] text-gray-500">Đơn giá theo từng kỳ đối soát</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent div
                      className="w-4 h-4 accent-[#0070CE] rounded pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Biểu phí theo từng kỳ */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                3. Đơn giá dịch vụ theo từng kỳ (VND / học sinh / tháng - BR08)
              </h3>
            </div>

            <div className="space-y-3">
              {(group?.periods || []).map((p) => {
                const periodTariff = formData.tariffs[p.id] || {};
                return (
                  <div key={p.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0070CE]">{p.name}</span>
                        {p.isFeeCollected ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">
                            Có thu phí
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-600 font-medium">
                            Miễn phí
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {p.startDate} → {p.endDate}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {RECONCILIATION_SERVICES.map((srv) => {
                        const isEnabled = Boolean(formData.services[srv.id]);
                        return (
                          <div key={srv.id} className={isEnabled ? '' : 'opacity-40'}>
                            <label className="block text-[11px] font-medium text-gray-700 mb-1 truncate">
                              {srv.name}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                step="1000"
                                disabled={!isEnabled}
                                value={periodTariff[srv.id] || 0}
                                onChange={(e) => handleTariffChange(p.id, srv.id, e.target.value)}
                                className={`w-full px-2.5 py-1.5 text-xs border rounded-lg pr-7 text-right font-medium ${
                                  isEnabled ? 'bg-white focus:ring-1 focus:ring-[#0070CE]' : 'bg-gray-100 cursor-not-allowed'
                                }`}
                              />
                              <span className="absolute right-2.5 top-1.5 text-xs text-gray-400">đ</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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

export default BranchDrawer;
