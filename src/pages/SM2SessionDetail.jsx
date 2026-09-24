import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext.jsx';
import {
  formatVND,
  formatDate,
  SESSION_STATUS_CONFIG,
  SETTLEMENT_SCOPE_LABELS,
  USER_ROLES,
} from '../data/models.js';
import TruyThuModal from '../components/sm2/TruyThuModal.jsx';
import StudentListModal from '../components/sm2/StudentListModal.jsx';
import { getBranchStudentList } from '../services/studentDataGenerator.js';
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Send,
  MoreHorizontal,
  Eye,
  FileText,
  FileDown,
  Lock,
  Plus,
  Minus,
} from 'lucide-react';

export function SM2SessionDetail({ sessionId, onBack }) {
  const { sessions, currentRole, executeSessionTransition } = usePortal();
  const session = sessions.find((s) => s.id === sessionId);

  const [activeTab, setActiveTab] = useState('FEES'); // 'FEES' | 'SNAPSHOT'
  const [truyThuModalOpen, setTruyThuModalOpen] = useState(false);
  const [expandedBranchIds, setExpandedBranchIds] = useState([]);
  const [activeActionBranchId, setActiveActionBranchId] = useState(null);
  const [selectedBranchForStudents, setSelectedBranchForStudents] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!session) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
        <p className="text-sm font-semibold">Phiên đối soát không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] rounded-lg hover:bg-blue-700 transition"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusConfig = SESSION_STATUS_CONFIG[session.status] || SESSION_STATUS_CONFIG.DRAFT;

  const toggleExpandBranch = (branchId) => {
    setExpandedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const handleAction = (actionKey) => {
    const res = executeSessionTransition(session.id, actionKey);
    if (!res.success) {
      alert(res.error);
    }
  };

  const handleRecalculate = () => {
    alert('Đã tính lại dữ liệu học sinh thành công theo trạng thái mới nhất.');
  };

  const handleDownload = () => {
    alert(`Đang tải biên bản đối soát cho phiên ${session.sessionCode}...`);
  };

  const handleExport = () => {
    alert(`Đang xuất dữ liệu bảng kê chi tiết cho phiên ${session.sessionCode}...`);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenStudentList = (branch) => {
    const students = getBranchStudentList(branch, session);
    setSelectedBranchForStudents({ ...branch, students });
    setIsStudentModalOpen(true);
    setActiveActionBranchId(null);
  };

  const handleExportBranchStudents = (branch) => {
    const students = getBranchStudentList(branch, session);
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
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_hoc_sinh_${branch.branchCode || 'branch'}_${session.sessionCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActiveActionBranchId(null);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Back Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1.5 text-base font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Phiên đối soát {session.sessionCode}</span>
        </button>
      </div>

      {/* 2. Top Card: Thông tin phiên (Pixel-Accurate to Image 1) */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] p-5 shadow-xs space-y-4">
        {/* Top Header inside Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0070CE]">
              <FileText className="w-5 h-5 text-[#0070CE]" />
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-medium">Thông tin phiên</div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                {session.groupName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${statusConfig.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
              {statusConfig.label}
            </span>

            {session.isArrears && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                TRUY THU
              </span>
            )}
          </div>
        </div>

        {/* 3-Column 6-Field Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 pt-4 border-t border-gray-100 text-xs">
          {/* Column 1 */}
          <div className="space-y-3">
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">Mã phiên</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 font-mono text-xs">{session.sessionCode}</span>
                <button
                  onClick={() => handleCopyCode(session.sessionCode)}
                  className="text-gray-400 hover:text-gray-600 transition"
                  title="Sao chép mã phiên"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-gray-400 mb-1">Đơn vị đối soát</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-[#5CDBD3] bg-[#E6FFFB] text-[#006D75]">
                  {SETTLEMENT_SCOPE_LABELS[session.settlementScope]}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                {session.groupName} • {session.groupCode}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">Kỳ đối soát</span>
              <div className="font-semibold text-gray-900">{session.periodName}</div>
            </div>

            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">Phạm vi tính phí</span>
              <div className="font-semibold text-gray-900">
                {session.periodRange || '05/09/2026 – 31/01/2027'}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">Mốc chốt số liệu</span>
              <div className="font-semibold text-gray-900">{formatDate(session.cutOffDate)}</div>
            </div>

            <div>
              <span className="block text-[11px] text-gray-400 mb-0.5">Số chi nhánh</span>
              <div className="font-semibold text-gray-900">
                {session.branchesSummary?.length || 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 KPI Counter Cards (Exact Match to Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Học sinh tính phí */}
        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Học sinh tính phí</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{session.totalActiveStudents}</div>
          <div className="text-[11px] text-gray-400 mt-1">Tổng học sinh tính phí của các chi nhánh</div>
        </div>

        {/* Card 2: Phí kỳ này */}
        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Phí kỳ này</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatVND(session.periodFee)}</div>
        </div>

        {/* Card 3: Truy thu kỳ trước */}
        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Truy thu kỳ trước</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{formatVND(session.arrearsFee || 0)}</div>
        </div>

        {/* Card 4: Tổng phải thu */}
        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-xs">
          <span className="text-xs text-gray-500 font-medium">Tổng phải thu</span>
          <div className="text-2xl font-bold text-[#0070CE] mt-1">{formatVND(session.totalFee)}</div>
        </div>
      </div>

      {/* 4. Tabs Row with Actions on the Right (Pixel-Accurate to Image 1) */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-white px-6 pt-3 rounded-t-xl shadow-xs gap-4">
        {/* Left: Tab Selectors */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('FEES')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'FEES'
                ? 'border-[#0070CE] text-[#0070CE]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Chi tiết phí</span>
          </button>

          <button
            onClick={() => setActiveTab('SNAPSHOT')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'SNAPSHOT'
                ? 'border-[#0070CE] text-[#0070CE]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cấu hình đã khóa</span>
          </button>
        </div>

        {/* Right: State Action Buttons */}
        <div className="flex items-center gap-2 pb-2">
          {session.status === 'DRAFT' && (
            <>
              <button
                onClick={handleRecalculate}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                <span>Tính lại các nhánh</span>
              </button>
              <button
                onClick={() => handleAction('SUBMIT_APPROVAL')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0070CE] hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi duyệt</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn hủy phiên đối soát này?')) {
                    handleAction('CANCEL_SESSION');
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition"
              >
                Hủy phiên
              </button>
            </>
          )}

          {session.status === 'PENDING_APPROVAL' && (
            <>
              <button
                onClick={() => handleAction('APPROVE')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#00AB56] hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                Phê duyệt
              </button>
              <button
                onClick={() => handleAction('REJECT')}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition"
              >
                Từ chối
              </button>
            </>
          )}

          {session.status === 'APPROVED' && (
            <>
              <button
                onClick={() => handleAction('SEND_TO_SCHOOL')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1A94FF] hover:bg-blue-600 rounded-lg shadow-sm transition"
              >
                Gửi biên bản
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 border hover:bg-gray-50 rounded-lg transition"
              >
                Tải biên bản
              </button>
            </>
          )}

          {session.status === 'SENT_TO_SCHOOL' && (
            <>
              <button
                onClick={() => handleAction('CONFIRM_PAYMENT')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#00AB56] hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                Xác nhận thanh toán
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 border hover:bg-gray-50 rounded-lg transition"
              >
                Tải biên bản
              </button>
            </>
          )}

          {session.status === 'PAID' && (
            <>
              {!session.isArrears && (
                <button
                  onClick={() => setTruyThuModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-[#FFC700] hover:bg-amber-400 rounded-lg shadow-sm transition"
                >
                  + Tạo phiên truy thu
                </button>
              )}
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 border hover:bg-gray-50 rounded-lg transition"
              >
                Tải biên bản
              </button>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 border hover:bg-gray-50 rounded-lg transition"
              >
                Xuất dữ liệu
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5. TAB 1: CHI TIẾT PHÍ (With Dropdown Action & Student Pop-up Trigger) */}
      {activeTab === 'FEES' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8EAEC] p-6 shadow-sm space-y-6">
          <div className="border border-gray-200 rounded-xl overflow-visible shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 w-8 text-center"></th>
                  <th className="py-3 px-4 font-semibold min-w-[140px]">Mã phiên</th>
                  <th className="py-3 px-4 font-semibold min-w-[200px]">Tên đơn vị</th>
                  <th className="py-3 px-4 text-center font-semibold min-w-[120px]">Học sinh tính phí</th>
                  <th className="py-3 px-4 text-right font-semibold min-w-[110px]">Phí kỳ này</th>
                  <th className="py-3 px-4 text-right font-semibold min-w-[100px]">Truy thu</th>
                  <th className="py-3 px-4 text-right font-semibold min-w-[110px]">Tổng phải thu</th>
                  <th className="py-3 px-4 text-center font-semibold w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(session.branchesSummary || []).map((b) => {
                  const isExpanded = expandedBranchIds.includes(b.branchId);
                  const isMenuOpen = activeActionBranchId === b.branchId;

                  return (
                    <React.Fragment key={b.branchId}>
                      <tr className="hover:bg-gray-50/60 font-medium">
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpandBranch(b.branchId)}
                            className="w-5 h-5 rounded border border-gray-300 hover:border-[#0070CE] hover:text-[#0070CE] flex items-center justify-center text-xs font-bold transition bg-white"
                          >
                            {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#0070CE] cursor-pointer hover:underline">
                            {b.sessionCode || session.sessionCode}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            1 chi nhánh
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{b.branchName}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                            {b.branchCode} • {session.groupName}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center text-gray-800">
                          {b.activeStudents}
                        </td>

                        <td className="py-3 px-4 text-right font-numeric text-gray-800">
                          {formatVND(b.periodFee)}
                        </td>

                        <td className="py-3 px-4 text-right font-numeric text-gray-500">
                          {formatVND(b.arrearsFee || 0)}
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-gray-900 font-numeric">
                          {formatVND(b.totalFee)}
                        </td>

                        <td className="py-3 px-4 text-center relative">
                          <button
                            data-testid="branch-more-btn"
                            onClick={() => setActiveActionBranchId(isMenuOpen ? null : b.branchId)}
                            className="w-7 h-7 rounded border border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-600 mx-auto transition"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {/* Dropdown Action Menu (Exact match to Image 1) */}
                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-20 cursor-default"
                                onClick={() => setActiveActionBranchId(null)}
                              />
                              <div
                                className="absolute right-4 top-10 z-30 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 text-left text-xs animate-in fade-in zoom-in-95 duration-100"
                              >
                                <button
                                  data-testid="view-student-list-btn"
                                  onClick={() => handleOpenStudentList(b)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Xem chi tiết</span>
                                </button>
                                <button
                                  data-testid="export-student-list-btn"
                                  onClick={() => handleExportBranchStudents(b)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 transition font-medium"
                                >
                                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                                  <span>Xuất dữ liệu</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>

                      {/* Expandable itemized service lines */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="8" className="p-0 bg-blue-50/20">
                            <div className="py-3 px-12 border-y border-blue-100 space-y-2">
                              <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                                Bảng kê chi tiết dịch vụ: {b.branchName}
                              </h4>
                              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                                    <tr>
                                      <th className="py-2 px-3">Dịch vụ</th>
                                      <th className="py-2 px-3 text-center">Trạng thái</th>
                                      <th className="py-2 px-3 text-center">Học sinh áp dụng</th>
                                      <th className="py-2 px-3 text-right">Đơn giá</th>
                                      <th className="py-2 px-3 text-right">Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(b.serviceBreakdown || []).map((srv) => (
                                      <tr key={srv.serviceId} className={srv.isEnabled ? '' : 'opacity-40'}>
                                        <td className="py-2 px-3 font-medium text-gray-800">{srv.serviceName}</td>
                                        <td className="py-2 px-3 text-center">
                                          {srv.isEnabled ? (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-50 text-green-700 font-semibold">
                                              Áp dụng
                                            </span>
                                          ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500">
                                              Không bật
                                            </span>
                                          )}
                                        </td>
                                        <td className="py-2 px-3 text-center">{srv.activeStudents}</td>
                                        <td className="py-2 px-3 text-right">{formatVND(srv.unitPrice)}</td>
                                        <td className="py-2 px-3 text-right font-semibold text-gray-900">
                                          {formatVND(srv.totalFee)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TAB 2: CẤU HÌNH ĐÃ KHÓA */}
      {activeTab === 'SNAPSHOT' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8EAEC] p-6 shadow-sm space-y-6">
          <div className="p-4 bg-[#E6F1FB] border-l-4 border-[#0070CE] rounded-r-xl shadow-2xs">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#0070CE] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#003867]">
                  Cấu hình biểu phí đã khóa bất biến (BR04 / ADR-M6-001)
                </h4>
                <p className="text-xs text-[#00549B] mt-0.5 leading-relaxed">
                  Cấu hình biểu phí, dịch vụ và ngưỡng tính phí đã được snapshot và khóa chặt tại thời điểm tạo phiên ({formatDate(session.snapshot?.createdAt)}). Mọi cập nhật sau này trong Cấu hình đối soát (SM1) tuyệt đối không làm thay đổi các thông số dưới đây.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs">
            <div>
              <span className="block text-gray-400 font-medium">Nhóm trường:</span>
              <span className="font-bold text-gray-800">{session.snapshot?.group?.name}</span>
              <span className="block text-[11px] font-mono text-[#0070CE] mt-0.5">
                {session.snapshot?.group?.code} • MST: {session.snapshot?.group?.taxCode}
              </span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Kỳ đối soát snapshot:</span>
              <span className="font-bold text-gray-800">{session.snapshot?.period?.name}</span>
              <span className="block text-[11px] text-gray-500 mt-0.5">
                {formatDate(session.snapshot?.period?.startDate)} → {formatDate(session.snapshot?.period?.endDate)}
              </span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Ngưỡng tính phí đã khóa:</span>
              <span className="font-bold text-gray-800">
                {session.snapshot?.thresholds?.minActiveMonths} tháng tối thiểu
              </span>
              <span className="block text-[11px] text-gray-500 mt-0.5">
                Làm tròn ngày dư: ≥ {session.snapshot?.thresholds?.surplusDayThreshold} ngày tính tròn 1 tháng
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Pop-up "Danh sách học sinh" (Image 2) */}
      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        branchData={selectedBranchForStudents}
        sessionData={session}
      />

      {/* 8. Modal Tạo phiên truy thu (BR07) */}
      <TruyThuModal
        isOpen={truyThuModalOpen}
        onClose={() => setTruyThuModalOpen(false)}
        parentSession={session}
      />
    </div>
  );
}

export default SM2SessionDetail;
