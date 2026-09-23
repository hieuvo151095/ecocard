import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext.jsx';
import {
  formatVND,
  formatDate,
  SESSION_STATUS_CONFIG,
  SETTLEMENT_SCOPE_LABELS,
  USER_ROLES,
} from '../data/models.js';
import TruyThuModal from '../components/sm2/TruyThuModal.jsx';

export function SM2SessionDetail({ sessionId, onBack }) {
  const { sessions, currentRole, executeSessionTransition } = usePortal();
  const session = sessions.find((s) => s.id === sessionId);

  const [activeTab, setActiveTab] = useState('FEES'); // 'FEES' | 'SNAPSHOT'
  const [truyThuModalOpen, setTruyThuModalOpen] = useState(false);
  const [expandedBranchIds, setExpandedBranchIds] = useState([]);

  if (!session) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
        <p className="text-sm font-semibold">Phiên đối soát không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] rounded-lg"
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

  return (
    <div className="space-y-6">
      {/* Top Header & Contextual Action Bar */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
              title="Quay lại danh sách"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-[#232628] font-mono">
                  {session.sessionCode}
                </h1>

                {/* Status Pill Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.color}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                  {statusConfig.label}
                </span>

                {/* Arrears Session Badge if applicable */}
                {session.isArrears && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    PHIÊN TRUY THU
                  </span>
                )}

                {/* Release flag */}
                {session.isReleased && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                    Đã nhả kết quả
                  </span>
                )}
              </div>
              <p className="text-xs text-[#687179] mt-0.5">
                Nhóm trường: <strong>{session.groupName}</strong> ({session.groupCode}) • {session.periodName}
              </p>
            </div>
          </div>

          {/* Contextual Action Buttons */}
          <div className="flex items-center gap-2">
            {/* DRAFT Actions */}
            {session.status === 'DRAFT' && (
              <>
                <button
                  onClick={handleRecalculate}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0070CE] border border-[#0070CE] hover:bg-blue-50 rounded-lg transition"
                >
                  Tính lại các nhánh
                </button>
                <button
                  onClick={() => handleAction('SUBMIT_APPROVAL')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg shadow-sm transition"
                >
                  Gửi duyệt
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn hủy phiên đối soát này?')) {
                      handleAction('CANCEL_SESSION');
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Hủy phiên
                </button>
              </>
            )}

            {/* PENDING_APPROVAL Actions */}
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

            {/* APPROVED Actions */}
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

            {/* SENT_TO_SCHOOL Actions */}
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

            {/* PAID Actions */}
            {session.status === 'PAID' && (
              <>
                {!session.isArrears && (
                  <button
                    onClick={() => setTruyThuModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold text-amber-900 bg-[#FFC700] hover:bg-amber-400 rounded-lg shadow-sm transition"
                  >
                    + Tạo phiên truy thu (BR07)
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

        {/* Master Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-xs text-[#687179]">
          <div>
            <span className="block text-[11px] text-gray-400">Đơn vị đối soát:</span>
            <span className="font-semibold text-gray-800">{SETTLEMENT_SCOPE_LABELS[session.settlementScope]}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">Kỳ đối soát:</span>
            <span className="font-semibold text-gray-800">{session.periodName}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">Ngày chốt số liệu (BR10):</span>
            <span className="font-semibold text-gray-800">{formatDate(session.cutOffDate)}</span>
          </div>
          <div>
            <span className="block text-[11px] text-gray-400">Ngày tạo phiên:</span>
            <span className="font-semibold text-gray-800">{formatDate(session.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Tổng học sinh active</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{session.totalActiveStudents}</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Phí kỳ này</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatVND(session.periodFee)}</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EAEC] p-4 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Phí truy thu</span>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatVND(session.arrearsFee)}</div>
        </div>

        <div className="bg-gradient-to-br from-[#E6F1FB] to-white rounded-xl border border-blue-200 p-4 shadow-sm">
          <span className="text-xs text-[#00549B] font-bold">Tổng cộng phải thu</span>
          <div className="text-2xl font-bold text-[#0070CE] mt-1">{formatVND(session.totalFee)}</div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-6 border-b border-gray-200 bg-white px-6 pt-3 rounded-t-xl shadow-xs">
        <button
          onClick={() => setActiveTab('FEES')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'FEES'
              ? 'border-[#0070CE] text-[#0070CE]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Chi tiết phí theo trường & dịch vụ</span>
        </button>

        <button
          onClick={() => setActiveTab('SNAPSHOT')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'SNAPSHOT'
              ? 'border-[#0070CE] text-[#0070CE]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Cấu hình đã khóa (ADR-M6-001)</span>
        </button>
      </div>

      {/* TAB CONTENT 1: CHI TIẾT PHÍ (SCR-06) */}
      {activeTab === 'FEES' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8EAEC] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Bảng kê chi tiết phí theo từng trường và danh mục dịch vụ (BR05)</span>
            <span className="text-[11px] italic">Một học sinh dùng nhiều dịch vụ tính nhiều lượt</span>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-3 w-8 text-center"></th>
                  <th className="py-3 px-4 font-semibold">Tên chi nhánh / Trường</th>
                  <th className="py-3 px-4 text-center font-semibold">HS active</th>
                  <th className="py-3 px-4 text-right font-semibold">Phí kỳ này</th>
                  <th className="py-3 px-4 text-right font-semibold">Phí truy thu</th>
                  <th className="py-3 px-4 text-right font-semibold">Tổng thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(session.branchesSummary || []).map((b) => {
                  const isExpanded = expandedBranchIds.includes(b.branchId);

                  return (
                    <React.Fragment key={b.branchId}>
                      <tr className="hover:bg-gray-50/60 font-medium">
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpandBranch(b.branchId)}
                            className="w-5 h-5 rounded border border-gray-300 hover:border-[#0070CE] hover:text-[#0070CE] flex items-center justify-center text-xs font-bold transition bg-white"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{b.branchName}</div>
                          <span className="font-mono text-[11px] text-[#0070CE]">{b.branchCode}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-[#0070CE]">{b.activeStudents}</td>
                        <td className="py-3 px-4 text-right">{formatVND(b.periodFee)}</td>
                        <td className="py-3 px-4 text-right">{formatVND(b.arrearsFee)}</td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">{formatVND(b.totalFee)}</td>
                      </tr>

                      {/* Expandable itemized service lines */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="6" className="p-0 bg-blue-50/20">
                            <div className="py-3 px-12 border-y border-blue-100 space-y-2">
                              <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                                Bảng kê chi tiết dịch vụ: {b.branchName}
                              </h4>
                              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
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

      {/* TAB CONTENT 2: CẤU HÌNH ĐÃ KHÓA (SCR-07 / ADR-M6-001) */}
      {activeTab === 'SNAPSHOT' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8EAEC] p-6 shadow-sm space-y-6">
          {/* Immutability Banner */}
          <div className="p-4 bg-[#E6F1FB] border-l-4 border-[#0070CE] rounded-r-xl shadow-xs">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#0070CE] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
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

          {/* Frozen Parameters */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs">
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

          {/* Frozen Tariff Matrix Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Biểu phí các trường đã khóa trong phiên
            </h4>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Mã trường</th>
                    <th className="py-2.5 px-4">Tên trường</th>
                    <th className="py-2.5 px-4 text-right">QL Nhà trường</th>
                    <th className="py-2.5 px-4 text-right">Camera AI</th>
                    <th className="py-2.5 px-4 text-right">Thẻ học sinh</th>
                    <th className="py-2.5 px-4 text-right">Căn tin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(session.snapshot?.branches || []).map((b) => {
                    const tariffs = b.tariffs?.[session.periodId] || {};
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/60 font-medium">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#0070CE]">{b.code}</td>
                        <td className="py-2.5 px-4 text-gray-900 font-semibold">{b.name}</td>
                        <td className="py-2.5 px-4 text-right">
                          {b.services?.managementSoftware ? formatVND(tariffs.managementSoftware) : '--'}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {b.services?.cameraAi ? formatVND(tariffs.cameraAi) : '--'}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {b.services?.studentCard ? formatVND(tariffs.studentCard) : '--'}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {b.services?.canteen ? formatVND(tariffs.canteen) : '--'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Truy Thu Modal */}
      <TruyThuModal
        isOpen={truyThuModalOpen}
        onClose={() => setTruyThuModalOpen(false)}
        parentSession={session}
      />
    </div>
  );
}

export default SM2SessionDetail;
