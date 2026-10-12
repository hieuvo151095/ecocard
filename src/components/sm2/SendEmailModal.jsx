import React, { useState } from 'react';
import { formatVND, formatDate } from '../../data/models.js';
import { Mail, Paperclip, Send, X, FileText, CheckCircle2 } from 'lucide-react';

export function SendEmailModal({ isOpen, onClose, session, onSendSuccess }) {
  const defaultEmails = (session?.snapshot?.group?.emails || []).join(', ') || 'ketoan@school.edu.vn';
  const [toEmails, setToEmails] = useState(defaultEmails);
  const [ccEmails, setCcEmails] = useState('ops-finance@finviet.com.vn');
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = useState(() => {
    return `[FINVIET - ECO CARD] Biên bản đối soát phí dịch vụ ${session?.sessionCode} - ${session?.groupName} (${session?.periodName})`;
  });

  const [messageNote, setMessageNote] = useState(
    'Kính gửi Ban Giám hiệu và Phòng Tài chính Kế toán nhà trường,\n\nFinviet trân trọng gửi bảng kê chi tiết và biên bản đối soát phí dịch vụ tháng/kỳ vừa qua. Quý nhà trường vui lòng kiểm tra số liệu đính kèm và thực hiện đối soát, thanh toán theo thông tin tài khoản bên dưới trong vòng 07 ngày làm việc.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!toEmails.trim()) {
      alert('Vui lòng nhập ít nhất một địa chỉ email nhận biên bản');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSendSuccess) {
        onSendSuccess({
          to: toEmails.split(/[,;]/).map((e) => e.trim()).filter(Boolean),
          cc: ccEmails.split(/[,;]/).map((e) => e.trim()).filter(Boolean),
          subject,
          sentAt: new Date().toISOString(),
        });
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070CE]">
              <Mail className="w-4 h-4 text-[#0070CE]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#232628]">Gửi biên bản đối soát cho nhà trường</h2>
              <p className="text-xs text-[#687179] mt-0.5">
                Phiên <strong>{session.sessionCode}</strong> • {session.groupName} ({session.periodName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSend} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Email Recipients */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-gray-700">
                Email người nhận (To) <span className="text-red-500">*</span>
              </label>
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[11px] text-[#0070CE] hover:underline font-medium"
                >
                  + Thêm CC
                </button>
              )}
            </div>
            <input
              type="text"
              value={toEmails}
              onChange={(e) => setToEmails(e.target.value)}
              placeholder="school-accountant@edu.vn, ban-giam-hieu@edu.vn"
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
              required
            />
          </div>

          {showCc && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email đồng kính gửi (CC)</label>
              <input
                type="text"
                value={ccEmails}
                onChange={(e) => setCcEmails(e.target.value)}
                placeholder="ops-finance@finviet.com.vn"
                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
              />
            </div>
          )}

          {/* Email Subject */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Tiêu đề email <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE] font-medium text-gray-800"
              required
            />
          </div>

          {/* Email Body Message Note */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nội dung thư gửi kèm</label>
            <textarea
              rows="3"
              value={messageNote}
              onChange={(e) => setMessageNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE] leading-relaxed"
            />
          </div>

          {/* Rendered Invoice & Payment Summary in Email Body */}
          <div className="p-4 bg-[#F8FAFC] border border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-bold text-gray-800 uppercase text-[11px] tracking-wide">
                Bảng tóm tắt số liệu thanh toán
              </span>
              <span className="text-[11px] font-mono text-[#0070CE] font-bold">
                Mã phiên: {session.sessionCode}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg">
                <span className="text-[10px] text-gray-500 block">HS tính phí</span>
                <span className="font-bold text-gray-900 text-sm">{session.totalActiveStudents}</span>
              </div>
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg">
                <span className="text-[10px] text-gray-500 block">Phí kỳ này</span>
                <span className="font-bold text-gray-900 text-sm">{formatVND(session.periodFee)}</span>
              </div>
              <div className="p-2.5 bg-white border border-gray-200 rounded-lg">
                <span className="text-[10px] text-gray-500 block">Phí truy thu</span>
                <span className="font-bold text-red-600 text-sm">{formatVND(session.arrearsFee || 0)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#E6F1FB] rounded-lg flex items-center justify-between border border-blue-100">
              <span className="font-bold text-[#003867]">TỔNG TIỀN THANH TOÁN:</span>
              <span className="font-extrabold text-base text-[#0070CE]">{formatVND(session.totalFee)}</span>
            </div>

            {/* Finviet Beneficiary Account */}
            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-1 text-[11px]">
              <div className="font-bold text-gray-800 mb-1">Thông tin chuyển khoản Finviet:</div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng thụ hưởng:</span>
                <span className="font-semibold text-gray-800">MBBank (Ngân hàng Quân Đội) - CN TP.HCM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản:</span>
                <span className="font-mono font-bold text-[#0070CE]">008899889988</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tên chủ tài khoản:</span>
                <span className="font-semibold text-gray-800">CONG TY CO PHAN CONG NGHE FINVIET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cú pháp chuyển tiền:</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {session.sessionCode} {session.groupCode}
                </span>
              </div>
            </div>
          </div>

          {/* Attached Files List */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-gray-500" />
              <span>Tệp tài liệu đính kèm tự động ({2})</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-red-500 shrink-0" />
                <div className="truncate">
                  <span className="block font-medium text-gray-800 truncate">
                    Bien_ban_doi_soat_{session.sessionCode}.pdf
                  </span>
                  <span className="text-[10px] text-gray-400">248 KB • Đã ký số điện tử</span>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="block font-medium text-gray-800 truncate">
                    Bang_ke_chi_tiet_{session.sessionCode}.xlsx
                  </span>
                  <span className="text-[10px] text-gray-400">512 KB • Chi tiết từng học sinh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-bold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi email cho trường'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendEmailModal;
