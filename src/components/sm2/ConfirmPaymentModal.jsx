import React, { useState } from 'react';
import { formatVND, formatDate } from '../../data/models.js';
import { CreditCard, CheckCircle2, X, Upload, Building2 } from 'lucide-react';

export function ConfirmPaymentModal({ isOpen, onClose, session, onConfirmSuccess }) {
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [amountReceived, setAmountReceived] = useState(session?.totalFee || 0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [referenceCode, setReferenceCode] = useState(() => `UNC-${Math.floor(Math.random() * 900000 + 100000)}`);
  const [receivingBank, setReceivingBank] = useState('MBBank - 008899889988 (CONG TY CP CONG NGHE FINVIET)');
  const [notes, setNotes] = useState('Đã đối chiếu khớp số dư tài khoản ngân hàng và phiếu thu.');
  const [attachedProofName, setAttachedProofName] = useState('chung_tu_unc_ngan_hang.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amountReceived || Number(amountReceived) <= 0) {
      alert('Vui lòng nhập số tiền thực nhận hợp lệ');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onConfirmSuccess) {
        onConfirmSuccess({
          paymentDate,
          amountReceived: Number(amountReceived),
          paymentMethod,
          referenceCode: referenceCode.trim(),
          receivingBank,
          notes,
          attachedProofName,
          paidAt: new Date().toISOString(),
        });
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#00AB56]">
              <CreditCard className="w-4 h-4 text-[#00AB56]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#232628]">Ghi nhận thanh toán đối soát</h2>
              <p className="text-xs text-[#687179] mt-0.5">
                Cập nhật tiền về và chuyển trạng thái phiên <strong>{session.sessionCode}</strong> sang Đã thanh toán (PAID)
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Amount Overview Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-800 font-medium">Số tiền cần thu theo biên bản:</span>
              <div className="text-xl font-extrabold text-[#00AB56] mt-0.5">{formatVND(session.totalFee)}</div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">
                {session.groupName} • {session.periodName}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ĐÃ GỬI BIÊN BẢN
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Ngày tiền về / Ngày thanh toán <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Số tiền thực nhận (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE] font-bold text-gray-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hình thức thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-[#0070CE]"
              >
                <option value="BANK_TRANSFER">Chuyển khoản ngân hàng (UNC)</option>
                <option value="DIRECT_DEBIT">Ủy nhiệm thu tự động</option>
                <option value="CASH">Tiền mặt</option>
                <option value="ECO_PAY">Cổng thanh toán ECO Card</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mã giao dịch / Số UNC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Ví dụ: UNC-2026-98124"
                className="w-full px-3 py-2 border rounded-lg bg-white font-mono focus:ring-1 focus:ring-[#0070CE]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Tài khoản Finviet thụ hưởng</label>
            <select
              value={receivingBank}
              onChange={(e) => setReceivingBank(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-[#0070CE]"
            >
              <option value="MBBank - 008899889988 (CONG TY CP CONG NGHE FINVIET)">
                MBBank - 008899889988 (CONG TY CP CONG NGHE FINVIET)
              </option>
              <option value="Techcombank - 19033445566001 (CONG TY CP CONG NGHE FINVIET)">
                Techcombank - 19033445566001 (CONG TY CP CONG NGHE FINVIET)
              </option>
              <option value="Vietcombank - 0071009988776 (CONG TY CP CONG NGHE FINVIET)">
                Vietcombank - 0071009988776 (CONG TY CP CONG NGHE FINVIET)
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Ghi chú kế toán</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
            />
          </div>

          {/* Attached Proof Document */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Chứng từ giao dịch / File UNC đính kèm</label>
            <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-800">{attachedProofName}</span>
                <span className="text-[10px] text-gray-400">(180 KB)</span>
              </div>
              <button
                type="button"
                onClick={() => alert('Chọn file mới từ máy tính thành công')}
                className="text-xs text-[#0070CE] font-semibold hover:underline"
              >
                Đổi file
              </button>
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2 font-bold text-white bg-[#00AB56] hover:bg-emerald-700 rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang ghi nhận...' : 'Xác nhận đã nhận tiền'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmPaymentModal;
