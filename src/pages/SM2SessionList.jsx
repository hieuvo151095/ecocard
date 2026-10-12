import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext.jsx';
import {
  formatVND,
  formatDate,
  SESSION_STATUS,
  SESSION_STATUS_CONFIG,
  ARREARS_STATUS,
  SETTLEMENT_SCOPE_LABELS,
} from '../data/models.js';
import CreateSessionModal from '../components/sm2/CreateSessionModal.jsx';
import { FileDown, Plus } from 'lucide-react';

export function SM2SessionList({ onSelectSession }) {
  const { sessions, groups } = usePortal();

  // Filter States
  const [filterCode, setFilterCode] = useState('');
  const [filterGroupId, setFilterGroupId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterArrears, setFilterArrears] = useState('ALL');

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleResetFilter = () => {
    setFilterCode('');
    setFilterGroupId('ALL');
    setFilterStatus('ALL');
    setFilterArrears('ALL');
  };

  const handleExportSessionsHistory = () => {
    const headers = [
      'STT',
      'Mã phiên đối soát',
      'Mã nhóm trường',
      'Tên nhóm trường',
      'Đơn vị đối soát',
      'Kỳ đối soát',
      'Ngày chốt số liệu',
      'Số lượng HS active',
      'Phí kỳ này (VND)',
      'Phí truy thu (VND)',
      'Tổng phải thu (VND)',
      'Trạng thái phiên',
      'Trạng thái truy thu',
      'Ngày tạo',
      'Email đã gửi',
      'Ngày gửi email',
      'Ngày thanh toán',
      'Mã giao dịch / UNC',
      'Ghi chú'
    ];

    const rows = filteredSessions.map((s, idx) => {
      const statusConf = SESSION_STATUS_CONFIG[s.status] || SESSION_STATUS_CONFIG.DRAFT;
      const emailSentTo = (s.emailDetails?.to || []).join('; ');
      const emailSentAt = s.emailDetails?.sentAt ? formatDate(s.emailDetails.sentAt) : '--';
      const paidDate = s.paymentDetails?.paymentDate ? formatDate(s.paymentDetails.paymentDate) : '--';
      const refCode = s.paymentDetails?.referenceCode || '--';
      const notes = s.paymentDetails?.notes || s.reason || '';

      return [
        idx + 1,
        `"${s.sessionCode}"`,
        `"${s.groupCode}"`,
        `"${s.groupName}"`,
        `"${SETTLEMENT_SCOPE_LABELS[s.settlementScope] || s.settlementScope}"`,
        `"${s.periodName}"`,
        `"${formatDate(s.cutOffDate)}"`,
        s.totalActiveStudents,
        s.periodFee,
        s.arrearsFee || 0,
        s.totalFee,
        `"${statusConf.label}"`,
        `"${s.arrearsStatus === ARREARS_STATUS.HAS_ARREARS ? 'Đã có truy thu' : 'Bình thường'}"`,
        `"${formatDate(s.createdAt)}"`,
        `"${emailSentTo}"`,
        `"${emailSentAt}"`,
        `"${paidDate}"`,
        `"${refCode}"`,
        `"${notes.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lich_su_phien_doi_soat_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredSessions = sessions.filter((s) => {
    const matchesCode =
      !filterCode || s.sessionCode.toLowerCase().includes(filterCode.toLowerCase());
    const matchesGroup = filterGroupId === 'ALL' || s.groupId === filterGroupId;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesArrears = filterArrears === 'ALL' || s.arrearsStatus === filterArrears;

    return matchesCode && matchesGroup && matchesStatus && matchesArrears;
  });

  // Top-level parent sessions (sessions that are NOT child arrears)
  const parentSessions = filteredSessions.filter((s) => !s.parentSessionId);

  // Group child sessions by parentSessionId
  const childSessionsMap = {};
  filteredSessions
    .filter((s) => s.parentSessionId)
    .forEach((child) => {
      if (!childSessionsMap[child.parentSessionId]) {
        childSessionsMap[child.parentSessionId] = [];
      }
      childSessionsMap[child.parentSessionId].push(child);
    });

  // KPI Counters
  const countAll = sessions.length;
  const countDraft = sessions.filter((s) => s.status === SESSION_STATUS.DRAFT).length;
  const countPending = sessions.filter((s) => s.status === SESSION_STATUS.PENDING_APPROVAL).length;
  const countApproved = sessions.filter((s) => s.status === SESSION_STATUS.APPROVED).length;
  const countSent = sessions.filter((s) => s.status === SESSION_STATUS.SENT_TO_SCHOOL).length;
  const countPaid = sessions.filter((s) => s.status === SESSION_STATUS.PAID).length;
  const countCancelled = sessions.filter((s) => s.status === SESSION_STATUS.CANCELLED).length;

  return (
    <div className="space-y-6">
      {/* 1. TWO-ROW FILTER CARD */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] p-5 shadow-sm space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Mã phiên</label>
            <input
              type="text"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              placeholder="Ví dụ: REC-B7A17279166"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Nhóm trường</label>
            <select
              value={filterGroupId}
              onChange={(e) => setFilterGroupId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] bg-white cursor-pointer"
            >
              <option value="ALL">Tất cả nhóm trường</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Trạng thái phiên</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] bg-white cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value={SESSION_STATUS.DRAFT}>Nháp</option>
              <option value={SESSION_STATUS.PENDING_APPROVAL}>Chờ duyệt</option>
              <option value={SESSION_STATUS.APPROVED}>Đã duyệt</option>
              <option value={SESSION_STATUS.SENT_TO_SCHOOL}>Đã gửi trường</option>
              <option value={SESSION_STATUS.PAID}>Đã thanh toán</option>
              <option value={SESSION_STATUS.CANCELLED}>Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Trạng thái truy thu</label>
            <select
              value={filterArrears}
              onChange={(e) => setFilterArrears(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] bg-white cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value={ARREARS_STATUS.NORMAL}>Bình thường</option>
              <option value={ARREARS_STATUS.HAS_ARREARS}>Đã có truy thu</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleResetFilter}
            className="px-4 py-1.5 text-xs font-semibold text-[#687179] hover:bg-gray-100 rounded-lg transition"
          >
            Làm lại
          </button>
          <button
            onClick={() => {}}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* 2. KPI STATUS COUNTERS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === 'ALL'
              ? 'bg-[#0070CE] text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Tất cả</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">{countAll}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.DRAFT)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.DRAFT
              ? 'bg-gray-700 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Nháp</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700">{countDraft}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.PENDING_APPROVAL)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.PENDING_APPROVAL
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Chờ duyệt</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">{countPending}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.APPROVED)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.APPROVED
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Đã duyệt</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0070CE]">{countApproved}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.SENT_TO_SCHOOL)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.SENT_TO_SCHOOL
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Đã gửi trường</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800">{countSent}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.PAID)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.PAID
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Đã thanh toán</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">{countPaid}</span>
        </button>

        <button
          onClick={() => setFilterStatus(SESSION_STATUS.CANCELLED)}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            filterStatus === SESSION_STATUS.CANCELLED
              ? 'bg-gray-500 text-white shadow-sm'
              : 'bg-white border text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Đã hủy</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-600">{countCancelled}</span>
        </button>
      </div>

      {/* 3. MASTER SESSION TABLE CARD */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] shadow-sm overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#232628]">Danh sách phiên đối soát</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F1FB] text-[#0070CE]">
              {filteredSessions.length} phiên
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSessionsHistory}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center gap-1.5 shadow-2xs transition"
              title="Xuất danh sách phiên đối soát ra file CSV"
            >
              <FileDown className="w-4 h-4 text-gray-500" />
              <span>Xuất Excel / CSV</span>
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo phiên đối soát</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#687179] font-semibold border-b border-[#E8EAEC]">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã phiên</th>
                <th className="py-3 px-4 font-semibold">Nhóm trường</th>
                <th className="py-3 px-4 font-semibold">Kỳ đối soát</th>
                <th className="py-3 px-3 font-semibold">Ngày chốt</th>
                <th className="py-3 px-3 font-semibold text-center">HS active</th>
                <th className="py-3 px-4 font-semibold text-right">Tổng phải thu</th>
                <th className="py-3 px-3 font-semibold text-center">Trạng thái phiên</th>
                <th className="py-3 px-3 font-semibold text-center">Trạng thái truy thu</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parentSessions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    Không tìm thấy phiên đối soát nào phù hợp
                  </td>
                </tr>
              ) : (
                parentSessions.map((session) => {
                  const statusConf = SESSION_STATUS_CONFIG[session.status] || SESSION_STATUS_CONFIG.DRAFT;
                  const childSessions = childSessionsMap[session.id] || [];

                  return (
                    <React.Fragment key={session.id}>
                      {/* Parent Session Row */}
                      <tr className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectSession(session.id)}
                            className="font-mono font-bold text-[#0070CE] hover:underline"
                          >
                            {session.sessionCode}
                          </button>
                          <span className="block text-[10px] text-gray-400">
                            Tạo: {formatDate(session.createdAt)}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 block">{session.groupName}</span>
                          <span className="font-mono text-[11px] text-[#00AB56] font-medium">
                            {session.groupCode}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium text-gray-700">
                          {session.periodName}
                        </td>

                        <td className="py-3 px-3 text-gray-600">
                          {formatDate(session.cutOffDate)}
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-[#0070CE]">
                          {session.totalActiveStudents}
                        </td>

                        <td className="py-3 px-4 text-right font-bold text-gray-900 font-numeric">
                          {formatVND(session.totalFee)}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusConf.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dotColor}`} />
                            {statusConf.label}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          {session.arrearsStatus === ARREARS_STATUS.HAS_ARREARS ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              Đã có truy thu
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400">Bình thường</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectSession(session.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#0070CE] hover:bg-blue-50 rounded transition"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>

                      {/* Nested Child Arrears Sessions (BR07) */}
                      {childSessions.map((child) => {
                        const childStatusConf =
                          SESSION_STATUS_CONFIG[child.status] || SESSION_STATUS_CONFIG.DRAFT;

                        return (
                          <tr key={child.id} className="bg-amber-50/20 border-l-4 border-amber-400 hover:bg-amber-50/40 transition">
                            <td className="py-2.5 px-4 pl-10">
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-400">↳</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                                  TRUY THU
                                </span>
                                <button
                                  onClick={() => onSelectSession(child.id)}
                                  className="font-mono font-bold text-amber-900 hover:underline text-xs"
                                >
                                  {child.sessionCode}
                                </button>
                              </div>
                            </td>

                            <td className="py-2.5 px-4 text-gray-600">
                              <span>Trường: <strong>{child.targetBranchName}</strong></span>
                            </td>

                            <td className="py-2.5 px-4 text-gray-600 text-[11px]">
                              {child.periodName} (Bổ sung)
                            </td>

                            <td className="py-2.5 px-3 text-gray-600">
                              {formatDate(child.cutOffDate)}
                            </td>

                            <td className="py-2.5 px-3 text-center font-semibold text-amber-900">
                              {child.totalActiveStudents}
                            </td>

                            <td className="py-2.5 px-4 text-right font-bold text-amber-900 font-numeric">
                              {formatVND(child.totalFee)}
                            </td>

                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${childStatusConf.color}`}
                              >
                                <span className={`w-1 h-1 rounded-full ${childStatusConf.dotColor}`} />
                                {childStatusConf.label}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 text-center text-gray-400 text-[11px]">
                              --
                            </td>

                            <td className="py-2.5 px-4 text-right">
                              <button
                                onClick={() => onSelectSession(child.id)}
                                className="px-2 py-0.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100 rounded transition"
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SESSION MODAL WIZARD */}
      <CreateSessionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(newSession) => {
          onSelectSession(newSession.id);
        }}
      />
    </div>
  );
}

export default SM2SessionList;
