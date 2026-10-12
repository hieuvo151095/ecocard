import React, { useState, useEffect } from 'react';
import { SETTLEMENT_SCOPES } from '../../data/models.js';

export function PasswordDrawer({ isOpen, onClose, group, onSavePassword }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const isAlreadySent = Boolean(group?.passwordSent);

  // Derive recipient emails
  const getRecipientEmails = () => {
    if (!group) return [];
    if (group.settlementScope === SETTLEMENT_SCOPES.GROUP && group.emails && group.emails.length > 0) {
      return group.emails;
    }
    // Branch scope: collect emails from all branches
    if (group.branches && group.branches.length > 0) {
      const branchEmails = group.branches.flatMap((b) => (Array.isArray(b.emails) ? b.emails : [b.emails])).filter(Boolean);
      if (branchEmails.length > 0) {
        return Array.from(new Set(branchEmails));
      }
    }
    return group.emails || ['ketoan@school.edu.vn'];
  };

  const recipientEmails = getRecipientEmails();
  const recipientDisplay = recipientEmails.join(', ');
  const ccEmails = 'edu@finviet.com.vn; phongketoan@finviet.com.vn';

  useEffect(() => {
    if (isOpen) {
      setPassword(group?.password || '');
      setConfirmPassword(group?.password || '');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setError('');
      setIsConfirmModalOpen(false);
    }
  }, [isOpen, group]);

  if (!isOpen) return null;

  const handlePreSend = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu mở file đối soát.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.');
      return;
    }

    // Open confirmation modal
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSend = () => {
    onSavePassword(password.trim());
    setIsConfirmModalOpen(false);
    onClose();
  };

  return (
    <>
      {/* Right Drawer Backdrop & Container */}
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
        <div className="w-full max-w-[620px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 relative">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E8EAEC] bg-white sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F1FB] text-[#0070CE] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#232628]">
                    {isAlreadySent ? 'Cập nhật mật khẩu file đối soát' : 'Gửi mật khẩu file đối soát'}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isAlreadySent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-[#0070CE] border border-blue-200'
                    }`}
                  >
                    {isAlreadySent ? 'Đã gửi trước đó' : 'Chưa gửi'}
                  </span>
                </div>
                <p className="text-xs text-[#687179] mt-0.5">
                  Nhóm trường: <strong className="text-gray-800">{group?.name}</strong> ({group?.code})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
              title="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handlePreSend} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Recipient Information Box */}
            <div className="bg-[#F8FAFC] border border-[#E8EAEC] rounded-xl p-4 space-y-2.5">
              <div className="text-xs font-bold text-[#232628] flex items-center gap-1.5 pb-2 border-b border-gray-200/60">
                <svg className="w-4 h-4 text-[#0070CE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Thông tin người nhận đối soát
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#687179] w-24 shrink-0 font-medium">Email nhận (To):</span>
                  <span className="font-semibold text-gray-800 break-all">{recipientDisplay || 'Chưa cấu hình email'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#687179] w-24 shrink-0 font-medium">Đồng kính gửi (Cc):</span>
                  <span className="font-semibold text-gray-700 break-all">{ccEmails}</span>
                </div>
              </div>
            </div>

            {/* Password Inputs */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#232628] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Thiết lập mật khẩu bảo vệ file
              </div>

              {/* Field 1: Add Password */}
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                  <span className="text-red-500 mr-0.5">*</span>Mật khẩu mới (Add password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Nhập mật khẩu mở file đối soát..."
                    className="w-full px-3 py-2 pr-10 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Field 2: Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#232628] mb-1.5">
                  <span className="text-red-500 mr-0.5">*</span>Xác nhận mật khẩu (Confirm password)
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Nhập lại mật khẩu để xác nhận..."
                    className="w-full px-3 py-2 pr-10 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] focus:border-[#0070CE]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Không giới hạn định dạng, người dùng có thể đặt mật khẩu tùy ý theo yêu cầu của trường.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Email Preview Section */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-[#232628] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0070CE] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Xem trước nội dung email sẽ gửi
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white text-xs">
                {/* Email Header */}
                <div className="bg-gray-50 p-3.5 border-b border-gray-200 space-y-1.5 font-mono text-[11px]">
                  <div className="flex">
                    <span className="text-gray-500 w-16 shrink-0">Từ:</span>
                    <span className="text-gray-800 font-semibold">FINVIET Reconciliation &lt;noreply@finviet.com.vn&gt;</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-16 shrink-0">Đến:</span>
                    <span className="text-gray-800">{recipientDisplay || 'mail_truong@edu.vn'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-16 shrink-0">Cc:</span>
                    <span className="text-gray-700">{ccEmails}</span>
                  </div>
                  <div className="flex pt-1 border-t border-gray-200">
                    <span className="text-gray-500 w-16 shrink-0">Tiêu đề:</span>
                    <span className="font-bold text-[#0070CE]">[FINVIET] Mật khẩu file đối soát</span>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4 bg-white text-gray-800 leading-relaxed font-sans space-y-3">
                  <p>Kính gửi Quý nhà trường,</p>
                  <p>FINVIET gửi Quý nhà trường mật khẩu mở file đối soát.</p>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg inline-flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Mật khẩu:</span>
                    <span className="font-mono font-bold text-sm text-[#0070CE] bg-white px-2.5 py-0.5 rounded border border-blue-200">
                      {password || '••••••••'}
                    </span>
                  </div>
                  <p>Quý nhà trường vui lòng sử dụng mật khẩu trên để mở file đối soát.</p>
                  <div className="pt-2 text-gray-600">
                    <p>Trân trọng,</p>
                    <p className="font-bold text-[#0070CE]">FINVIET Reconciliation Team</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Drawer Footer Actions */}
          <div className="px-6 py-4 border-t border-[#E8EAEC] bg-white flex items-center justify-end gap-3 sticky bottom-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handlePreSend}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {isAlreadySent ? 'Cập nhật & Gửi' : 'Gửi'}
            </button>
          </div>

          {/* Confirmation Pop-up Modal (Rendered on top layer inside right sheet) */}
          {isConfirmModalOpen && (
            <div
              className="absolute inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsConfirmModalOpen(false);
              }}
            >
              <div className="bg-white rounded-2xl max-w-[460px] w-full shadow-2xl overflow-hidden border border-gray-100 animate-scaleUp">
                {/* Modal Header */}
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#E6F1FB] text-[#0070CE] mx-auto flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <h3 className="text-base font-bold text-[#232628]">
                    {isAlreadySent ? 'Xác nhận cập nhật mật khẩu' : 'Xác nhận gửi mật khẩu'}
                  </h3>
                  <p className="text-xs text-[#687179] mt-2 leading-relaxed">
                    Bạn có chắc chắn muốn gửi mật khẩu mở file đối soát đến Quý nhà trường qua email?
                  </p>

                  {/* Summary Details in Modal */}
                  <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-left text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-gray-500">Nhóm trường:</span>
                      <span className="font-bold text-gray-800 text-right">{group?.name}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-500">Gửi đến (To):</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[240px] truncate">{recipientDisplay}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-gray-500">Cc:</span>
                      <span className="font-semibold text-gray-700 text-right max-w-[240px] truncate">{ccEmails}</span>
                    </div>
                    <div className="flex items-start justify-between pt-1 border-t border-gray-200">
                      <span className="text-gray-500">Mật khẩu gửi:</span>
                      <span className="font-mono font-bold text-[#0070CE]">{password}</span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSend}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Xác nhận gửi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PasswordDrawer;
