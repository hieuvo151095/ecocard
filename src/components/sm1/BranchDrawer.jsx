import React, { useState, useEffect, useRef } from 'react';
import { RECONCILIATION_SERVICES, SETTLEMENT_SCOPE_LABELS } from '../../data/models.js';
import { MASTER_SCHOOLS } from '../../data/masterData.js';

export function BranchDrawer({ isOpen, onClose, group, branch, onSave }) {
  const isEditing = Boolean(branch);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    startDate: '',
    contractDate: '',
    emails: '',
    studentCount: 0,
    services: {
      managementSoftware: false,
      cameraAi: false,
      studentCard: false,
      canteen: false,
    },
    tariffs: {},
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [branchSelectError, setBranchSelectError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Derive periods and service year range from group
  const periods = (group?.periods && group.periods.length > 0)
    ? group.periods
    : [
        { id: 'Kỳ 1', name: 'Kỳ 1', startDate: '05/09/2026', endDate: '31/01/2027' },
        { id: 'Kỳ 2', name: 'Kỳ 2', startDate: '01/02/2027', endDate: '20/05/2027' },
      ];

  const serviceYearText = group?.serviceYear?.startDate && group?.serviceYear?.endDate
    ? `${group.serviceYear.startDate} – ${group.serviceYear.endDate}`
    : (periods.length > 0
        ? `${periods[0].startDate} – ${periods[periods.length - 1].endDate}`
        : '05/09/2026 – 20/05/2027');

  // Handle outside click to close master data dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize or reset form data when drawer opens or target changes
  useEffect(() => {
    if (!isOpen) return;

    if (branch) {
      setFormData({
        code: branch.code || '',
        name: branch.name || '',
        startDate: branch.startDate || '15/09/2026',
        contractDate: branch.contractDate || '',
        emails: Array.isArray(branch.emails) ? branch.emails.join(', ') : (branch.emails || ''),
        studentCount: branch.studentCount ?? 100,
        services: {
          managementSoftware: Boolean(branch.services?.managementSoftware),
          cameraAi: Boolean(branch.services?.cameraAi),
          studentCard: Boolean(branch.services?.studentCard),
          canteen: Boolean(branch.services?.canteen),
        },
        tariffs: branch.tariffs ? JSON.parse(JSON.stringify(branch.tariffs)) : {},
      });
      setSearchQuery(`${branch.code} · ${branch.name}`);
      setBranchSelectError(false);
      setEmailError(false);
      setDropdownOpen(false);
    } else {
      // New branch setup matching Image 1
      setFormData({
        code: '',
        name: '',
        startDate: '',
        contractDate: '',
        emails: '',
        studentCount: 0,
        services: {
          managementSoftware: false,
          cameraAi: false,
          studentCard: false,
          canteen: false,
        },
        tariffs: {},
      });
      setSearchQuery('');
      setBranchSelectError(false);
      setEmailError(false);
      setDropdownOpen(false);
    }
  }, [branch, group, isOpen]);

  if (!isOpen) return null;

  // Filter master schools according to search query
  const filteredSchools = MASTER_SCHOOLS.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  const handleSelectSchool = (school) => {
    setFormData((prev) => ({
      ...prev,
      code: school.code,
      name: school.name,
      emails: prev.emails || school.email || '',
      studentCount: prev.studentCount === 0 || prev.studentCount === '' ? (school.defaultStudents || 100) : prev.studentCount,
    }));
    setSearchQuery(`${school.code} · ${school.name}`);
    setDropdownOpen(false);
    setBranchSelectError(false);
  };

  const handleClearSchool = (e) => {
    e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      code: '',
      name: '',
    }));
    setSearchQuery('');
    setDropdownOpen(true);
  };

  const handleToggleService = (serviceId) => {
    setFormData((prev) => {
      const willEnable = !prev.services[serviceId];
      const nextServices = {
        ...prev.services,
        [serviceId]: willEnable,
      };

      // Set default tariff values when service is enabled if not already set
      const updatedTariffs = { ...prev.tariffs };
      if (willEnable) {
        const defaultTariffMap = {
          managementSoftware: 10000,
          cameraAi: 5000,
          studentCard: 5000,
          canteen: 10000,
        };
        periods.forEach((p, idx) => {
          const pKey = p.name || p.id;
          if (!updatedTariffs[pKey]) updatedTariffs[pKey] = {};
          if (updatedTariffs[pKey][serviceId] === undefined) {
            // Period 2 slightly higher as example or standard rate
            const baseRate = defaultTariffMap[serviceId] || 10000;
            updatedTariffs[pKey][serviceId] = idx === 1 ? baseRate + (serviceId === 'managementSoftware' ? 2000 : 1000) : baseRate;
          }
        });
      }

      return {
        ...prev,
        services: nextServices,
        tariffs: updatedTariffs,
      };
    });
  };

  const handleTariffInputChange = (periodKey, serviceId, rawVal) => {
    const num = Number(String(rawVal).replace(/\./g, '').replace(/[^\d]/g, '')) || 0;
    setFormData((prev) => {
      const updated = { ...prev.tariffs };
      if (!updated[periodKey]) updated[periodKey] = {};
      updated[periodKey][serviceId] = num;
      return { ...prev, tariffs: updated };
    });
  };

  const formatTariffDisplay = (val) => {
    if (val === undefined || val === null || val === '') return '';
    const num = Number(val);
    if (isNaN(num)) return '';
    return num.toLocaleString('vi-VN');
  };

  const selectedServices = RECONCILIATION_SERVICES.filter((srv) => formData.services[srv.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.code.trim() || !formData.name.trim()) {
      setBranchSelectError(true);
      hasError = true;
    }

    if (!formData.emails.trim()) {
      setEmailError(true);
      hasError = true;
    }

    if (hasError) return;

    const emailList = formData.emails
      .split(/[,;]/)
      .map((e) => e.trim())
      .filter(Boolean);

    const payload = {
      id: branch?.id || `BR-${formData.code}`,
      code: formData.code.trim(),
      name: formData.name.trim(),
      studentCount: Number(formData.studentCount) || 0,
      startDate: formData.startDate || '',
      contractDate: formData.contractDate || '',
      emails: emailList,
      services: formData.services,
      tariffs: formData.tariffs,
      isActive: branch?.isActive ?? true,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-[840px] bg-[#F7F9FA] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] bg-white sticky top-0 z-30 flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Close button icon matching Image 1 */}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 text-gray-400 hover:text-gray-700 transition"
              title="Đóng"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#232628]">
                  {isEditing ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh'}
                </h2>
                {isEditing && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#F0F7FF] text-[#0070CE] border border-[#BEE0FF]">
                    {branch.code}
                  </span>
                )}
              </div>

              {/* Nhóm trường details */}
              <div className="mt-2 text-xs">
                <span className="text-[#687179] block text-[11px] mb-0.5">Nhóm trường</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#232628]">{group?.name || 'TestUAT'}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F4F5F7] text-[#42526E] border border-[#DFE1E6]">
                    {group?.code || 'TESTUAT'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Metadata */}
          <div className="flex items-start gap-8 pr-4">
            <div>
              <span className="text-[#687179] block text-[11px] mb-0.5">Đơn vị đối soát</span>
              <span className="text-xs font-bold text-[#232628]">
                {SETTLEMENT_SCOPE_LABELS[group?.settlementScope] || 'Theo từng trường'}
              </span>
            </div>
            <div>
              <span className="text-[#687179] block text-[11px] mb-0.5">Ngưỡng thu phí</span>
              <span className="text-xs font-bold text-[#232628]">
                {group?.thresholds?.minActiveMonths || 2} tháng
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Card Section 1: Thông tin chi nhánh và hợp đồng */}
          <div className="bg-white border border-[#E4E7EB] rounded-xl p-5 shadow-xs relative z-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-[#232628]">
                Thông tin chi nhánh và hợp đồng
              </h3>
            </div>

            <div className="space-y-4">
              {/* Field: Chọn chi nhánh */}
              <div ref={dropdownRef} className="relative">
                <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                  <span className="text-red-500 mr-0.5">*</span>Chọn chi nhánh
                </label>

                {isEditing ? (
                  /* Disabled state when editing existing branch */
                  <div className="w-full px-3 py-2 text-xs border border-gray-200 bg-[#F5F7F9] text-gray-700 rounded-lg flex items-center justify-between cursor-not-allowed">
                    <span className="font-medium">{`${formData.code} · ${formData.name}`}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  /* Searchable Master Data combobox */
                  <div className="relative">
                    <div
                      onClick={() => setDropdownOpen(true)}
                      className={`w-full border rounded-lg flex items-center px-3 py-1.5 bg-white transition cursor-text ${
                        branchSelectError
                          ? 'border-[#FF4D4F] ring-1 ring-[#FF4D4F]/20'
                          : dropdownOpen
                          ? 'border-[#0070CE] ring-1 ring-[#0070CE]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setDropdownOpen(true);
                          if (branchSelectError) setBranchSelectError(false);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(true);
                        }}
                        onFocus={() => setDropdownOpen(true)}
                        placeholder="Tìm theo tên hoặc mã trường học"
                        className="w-full text-xs text-[#232628] placeholder-gray-400 focus:outline-none bg-transparent py-0.5"
                      />

                      {/* Right icons */}
                      <div className="flex items-center gap-1.5 ml-2 text-gray-400">
                        {formData.code && (
                          <button
                            type="button"
                            onClick={handleClearSchool}
                            className="hover:text-gray-600 transition"
                            title="Xóa lựa chọn"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {dropdownOpen ? (
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Master Data Results Menu */}
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-gray-50">
                        {filteredSchools.length === 0 ? (
                          <div className="px-4 py-3 text-xs text-gray-400 text-center">
                            Không tìm thấy trường học nào phù hợp
                          </div>
                        ) : (
                          filteredSchools.map((school) => {
                            const isSelected = formData.code === school.code;
                            return (
                              <div
                                key={school.code}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSchool(school);
                                }}
                                className={`px-4 py-2.5 text-xs cursor-pointer transition flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-[#E6F1FB] text-[#0070CE] font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>{`${school.code} · ${school.name}`}</span>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-[#0070CE]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Validation error message matching Image 1 */}
                {branchSelectError && (
                  <p className="text-xs text-[#FF424E] mt-1">Vui lòng chọn chi nhánh.</p>
                )}
              </div>

              {/* Row 2: Ngày bắt đầu sử dụng + Ngày ký hợp đồng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                    Ngày bắt đầu sử dụng
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Chọn thời điểm"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg pr-9 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                    />
                    <label className="absolute right-2.5 top-2 cursor-pointer text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="date"
                        className="sr-only"
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const [y, m, d] = e.target.value.split('-');
                          setFormData((prev) => ({ ...prev, startDate: `${d}/${m}/${y}` }));
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                    Ngày ký hợp đồng
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Chọn thời điểm"
                      value={formData.contractDate}
                      onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg pr-9 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                    />
                    <label className="absolute right-2.5 top-2 cursor-pointer text-gray-400 hover:text-gray-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="date"
                        className="sr-only"
                        onChange={(e) => {
                          if (!e.target.value) return;
                          const [y, m, d] = e.target.value.split('-');
                          setFormData((prev) => ({ ...prev, contractDate: `${d}/${m}/${y}` }));
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 3: Email nhận biên bản + Số học sinh đăng ký */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                    <span className="text-red-500 mr-0.5">*</span>Email nhận biên bản
                  </label>
                  <input
                    type="text"
                    value={formData.emails}
                    onChange={(e) => {
                      setFormData({ ...formData, emails: e.target.value });
                      if (emailError) setEmailError(false);
                    }}
                    placeholder="Nhập email nhận biên bản"
                    className={`w-full px-3 py-2 text-xs border rounded-lg text-gray-800 focus:outline-none focus:ring-1 ${
                      emailError
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:ring-[#0070CE] focus:border-[#0070CE]'
                    }`}
                  />
                  <p className="text-[11px] text-[#687179] mt-1">
                    Tối đa 3 email, cách nhau bằng dấu phẩy hoặc chấm phẩy.
                  </p>
                  {emailError && (
                    <p className="text-xs text-[#FF424E] mt-1">Vui lòng nhập email nhận biên bản.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                    <span className="text-red-500 mr-0.5">*</span>Số học sinh đăng ký
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card Section 2: Dịch vụ và biểu phí */}
          <div className="bg-white border border-[#E4E7EB] rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-[#232628]">
                Dịch vụ và biểu phí
              </h3>
            </div>
            <div className="text-xs text-[#687179] mb-4 pl-7">
              Năm dịch vụ: {serviceYearText}
            </div>

            {/* Dịch vụ áp dụng - 4 Horizontal Checkbox Buttons */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#232628] mb-2">
                Dịch vụ áp dụng
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {RECONCILIATION_SERVICES.map((srv) => {
                  const isChecked = Boolean(formData.services[srv.id]);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleToggleService(srv.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer border ${
                        isChecked
                          ? 'border-[#0070CE] bg-[#F0F7FF] text-[#0070CE]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked
                            ? 'bg-[#0070CE] border-[#0070CE] text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span>{srv.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Biểu phí theo lịch nhóm trường */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#232628]">
                  Biểu phí theo lịch nhóm trường
                </span>
                <span className="text-xs text-[#687179]">
                  Đơn giá / học sinh / tháng (VNĐ)
                </span>
              </div>

              {/* State A: When NO services selected - Gray notice + empty cards */}
              {selectedServices.length === 0 ? (
                <div className="space-y-3">
                  <div className="bg-[#F8FAFC] border border-[#E8EAEC] rounded-lg p-3 text-xs text-[#687179]">
                    Chọn dịch vụ ở trên để nhập đơn giá cho từng kỳ.
                  </div>

                  {periods.map((p) => (
                    <div
                      key={p.id || p.name}
                      className="border border-[#E4E7EB] rounded-lg p-3.5 bg-white flex items-center"
                    >
                      <span className="text-xs font-bold text-[#232628] mr-3">
                        {p.name}
                      </span>
                      <span className="text-xs text-[#687179]">
                        Hiệu lực: {p.startDate} – {p.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* State B: When services are selected - Editable price inputs per period */
                <div className="space-y-3">
                  {periods.map((p) => {
                    const periodKey = p.name || p.id;
                    const periodTariff = formData.tariffs[periodKey] || {};
                    return (
                      <div
                        key={periodKey}
                        className="border border-[#E4E7EB] rounded-lg p-4 bg-[#FCFCFD] space-y-3"
                      >
                        <div className="flex items-center">
                          <span className="text-xs font-bold text-[#232628]">
                            {p.name}
                          </span>
                          <span className="text-xs text-[#687179] ml-3">
                            Hiệu lực: {p.startDate} – {p.endDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {selectedServices.map((srv) => (
                            <div key={srv.id}>
                              <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                                <span className="text-red-500 mr-0.5">*</span>{srv.name}
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={formatTariffDisplay(periodTariff[srv.id])}
                                  onChange={(e) =>
                                    handleTariffInputChange(periodKey, srv.id, e.target.value)
                                  }
                                  placeholder="10.000"
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg pr-7 text-left font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                                />
                                <span className="absolute right-3 top-2 text-xs text-gray-400 pointer-events-none">
                                  đ
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="pt-4 border-t border-[#E8EAEC] flex items-center justify-end gap-3 sticky bottom-0 bg-[#F7F9FA] pb-2 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition bg-white shadow-2xs"
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
