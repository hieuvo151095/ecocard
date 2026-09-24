import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { formatVND } from '../../data/models.js';

export default function StudentListModal({ isOpen, onClose, branchData, sessionData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  if (!isOpen || !branchData) return null;

  const students = branchData.students || [];
  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = students.slice(startIndex, startIndex + pageSize);

  const handleExportCSV = () => {
    const headers = [
      'STT',
      'Họ và tên',
      'UID',
      'Số ngày thực tế',
      'Tính ngưỡng (tháng)',
      'Số tháng thu',
      'Dịch vụ',
      'Phí kỳ này (VND)',
      'Truy thu (VND)',
      'Kết quả',
      'Tổng tiền (VND)'
    ];

    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.name}"`,
      `"${s.uid}"`,
      s.actualDays,
      s.thresholdMonths,
      s.billedMonths,
      `"${s.serviceName}"`,
      s.periodFee,
      s.arrearsFee || 0,
      `"${s.result || 'Có tính phí'}"`,
      s.totalFee
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_${branchData.branchCode || 'branch'}_${sessionData?.sessionCode || 'session'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] max-h-[92vh] border border-gray-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-gray-900">
              Danh sách học sinh
            </h3>
            <span className="px-2 py-0.5 text-xs text-[#0070CE] bg-[#E6F4FF] border border-[#91CAFF] rounded font-medium">
              {branchData.branchName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              title="Xuất dữ liệu Excel / CSV"
              className="p-1.5 text-gray-500 hover:text-[#0070CE] hover:bg-blue-50 rounded-lg transition border border-gray-200"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200 select-none sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center bg-[#F8FAFC]">STT</th>
                <th className="py-2.5 px-4 min-w-[160px] bg-[#F8FAFC]">Học sinh</th>
                <th className="py-2.5 px-4 min-w-[140px] bg-[#F8FAFC]">Thời gian active</th>
                <th className="py-2.5 px-4 text-center min-w-[100px] bg-[#F8FAFC]">Số tháng thu</th>
                <th className="py-2.5 px-4 min-w-[180px] bg-[#F8FAFC]">Dịch vụ</th>
                <th className="py-2.5 px-4 text-right min-w-[110px] bg-[#F8FAFC]">Phí kỳ này</th>
                <th className="py-2.5 px-4 text-right min-w-[110px] bg-[#F8FAFC]">Truy thu kỳ trước</th>
                <th className="py-2.5 px-4 text-center min-w-[110px] bg-[#F8FAFC]">Kết quả</th>
                <th className="py-2.5 px-4 text-right min-w-[110px] bg-[#F8FAFC]">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400 text-xs">
                    Chưa có dữ liệu học sinh phát sinh phí trong chi nhánh này.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  const stt = startIndex + index + 1;
                  const isCamera = item.serviceName?.toLowerCase().includes('camera');
                  const isSchoolApp = item.serviceName?.toLowerCase().includes('quản lý') || item.serviceName?.toLowerCase().includes('phần mềm');
                  const isStudentCard = item.serviceName?.toLowerCase().includes('thẻ');

                  let serviceBadgeClass = "px-2 py-0.5 text-xs rounded border inline-block ";
                  if (isCamera) {
                    serviceBadgeClass += "text-[#0050B3] bg-[#E6F7FF] border-[#91D5FF]";
                  } else if (isSchoolApp) {
                    serviceBadgeClass += "text-[#1D39C4] bg-[#F0F5FF] border-[#ADC6FF]";
                  } else if (isStudentCard) {
                    serviceBadgeClass += "text-[#00897B] bg-[#E0F2F1] border-[#80CBC4]";
                  } else {
                    serviceBadgeClass += "text-[#0070CE] bg-[#E6F4FF] border-[#91CAFF]";
                  }

                  return (
                    <tr key={item.id || `${item.uid}-${item.serviceId || index}`} className="hover:bg-blue-50/20 transition">
                      <td className="py-2 px-4 text-center text-gray-500 font-medium">
                        {stt}
                      </td>

                      <td className="py-2 px-4">
                        <div className="font-semibold text-gray-900 text-xs">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          UID: {item.uid}
                        </div>
                      </td>

                      <td className="py-2 px-4">
                        <div className="text-gray-900 text-xs">
                          {item.actualDays} ngày thực tế
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Tính ngưỡng: {item.thresholdMonths} tháng
                        </div>
                      </td>

                      <td className="py-2 px-4 text-center">
                        <span className="px-2 py-0.5 text-xs text-[#0070CE] bg-[#E6F4FF] border border-[#91CAFF] rounded font-medium inline-block">
                          {item.billedMonths} tháng
                        </span>
                      </td>

                      <td className="py-2 px-4">
                        <span className={serviceBadgeClass}>
                          {item.serviceName}
                        </span>
                      </td>

                      <td className="py-2 px-4 text-right font-numeric text-gray-900">
                        {formatVND(item.periodFee)}
                      </td>

                      <td className="py-2 px-4 text-right font-numeric text-gray-500">
                        {formatVND(item.arrearsFee || 0)}
                      </td>

                      <td className="py-2 px-4 text-center">
                        <span className="px-2 py-0.5 text-xs text-[#00AB56] bg-[#E6F9F0] border border-[#A3E9C7] rounded font-medium inline-block">
                          {item.result || 'Có tính phí'}
                        </span>
                      </td>

                      <td className="py-2 px-4 text-right font-bold font-numeric text-gray-900">
                        {formatVND(item.totalFee)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white shrink-0">
          <div className="font-medium text-gray-600">
            {totalItems} lượt HS × DV
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold transition ${
                  currentPage === pageNumber
                    ? 'bg-[#0070CE] text-white shadow-xs'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
