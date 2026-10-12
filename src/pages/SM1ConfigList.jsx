import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext.jsx';
import { formatDate, SETTLEMENT_SCOPE_LABELS } from '../data/models.js';
import GroupDrawer from '../components/sm1/GroupDrawer.jsx';
import BranchDrawer from '../components/sm1/BranchDrawer.jsx';
import PasswordDrawer from '../components/sm1/PasswordDrawer.jsx';

export function SM1ConfigList() {
  const {
    groups,
    addGroup,
    updateGroup,
    toggleGroupStatus,
    toggleBranchStatus,
    updateBranch,
  } = usePortal();

  // Filter States
  const [filterGroupQuery, setFilterGroupQuery] = useState('');
  const [filterBranchQuery, setFilterBranchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Expanded Rows State (All collapsed by default)
  const [expandedGroupIds, setExpandedGroupIds] = useState([]);

  // Drawer States
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [branchDrawerOpen, setBranchDrawerOpen] = useState(false);
  const [activeBranchContext, setActiveBranchContext] = useState(null); // { group, branch }

  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const [selectedGroupForPassword, setSelectedGroupForPassword] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Action Menu Dropdown State
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const toggleExpand = (groupId) => {
    setExpandedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const handleResetFilter = () => {
    setFilterGroupQuery('');
    setFilterBranchQuery('');
    setFilterStatus('ALL');
  };

  // Filter Logic
  const filteredGroups = groups.filter((g) => {
    const matchesGroup =
      !filterGroupQuery ||
      g.name.toLowerCase().includes(filterGroupQuery.toLowerCase()) ||
      g.code.toLowerCase().includes(filterGroupQuery.toLowerCase()) ||
      (g.taxCode && g.taxCode.includes(filterGroupQuery));

    const matchesBranch =
      !filterBranchQuery ||
      (g.branches || []).some(
        (b) =>
          b.name.toLowerCase().includes(filterBranchQuery.toLowerCase()) ||
          b.code.toLowerCase().includes(filterBranchQuery.toLowerCase())
      );

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && g.isActive) ||
      (filterStatus === 'INACTIVE' && !g.isActive);

    return matchesGroup && matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. FILTER CARD */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Nhóm trường</label>
            <div className="relative">
              <input
                type="text"
                value={filterGroupQuery}
                onChange={(e) => setFilterGroupQuery(e.target.value)}
                placeholder="Nhập tên, mã nhóm, MST hoặc hợp đồng"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Mã trường</label>
            <div className="relative">
              <input
                type="text"
                value={filterBranchQuery}
                onChange={(e) => setFilterBranchQuery(e.target.value)}
                placeholder="Ví dụ: TDN2042"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232628] mb-1.5">Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0070CE] bg-white cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value="ACTIVE">Bật</option>
              <option value="INACTIVE">Tắt</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
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

      {/* 2. MASTER TABLE CARD */}
      <div className="bg-white rounded-xl border border-[#E8EAEC] shadow-sm">
        {/* Table Top Toolbar */}
        <div className="px-6 py-4 border-b border-[#E8EAEC] flex items-center justify-between rounded-t-xl bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#232628]">Danh sách nhóm trường</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F1FB] text-[#0070CE]">
              {filteredGroups.length}
            </span>
          </div>

          <button
            onClick={() => {
              setEditingGroup(null);
              setGroupDrawerOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#00549B] rounded-lg flex items-center gap-1.5 shadow-sm transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Tạo mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[260px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#687179] font-semibold border-b border-[#E8EAEC]">
              <tr>
                <th className="py-3 px-3 w-10 text-center"></th>
                <th className="py-3 px-4 font-semibold">Mã nhóm</th>
                <th className="py-3 px-4 font-semibold">Tên nhóm trường</th>
                <th className="py-3 px-3 font-semibold text-center">Chi nhánh</th>
                <th className="py-3 px-4 font-semibold">Năm dịch vụ</th>
                <th className="py-3 px-4 font-semibold">Ngưỡng truy thu</th>
                <th className="py-3 px-4 font-semibold">Đơn vị đối soát</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    Không tìm thấy nhóm trường nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredGroups.map((g, idx) => {
                  const isExpanded = expandedGroupIds.includes(g.id);
                  const isMenuOpen = openActionMenuId === g.id;
                  const openUpwards = idx >= Math.max(1, filteredGroups.length - 2);

                  return (
                    <React.Fragment key={g.id}>
                      {/* Master Group Row */}
                      <tr className={`hover:bg-[#F8FAFC] transition ${isExpanded ? 'bg-[#F4F9FD]/60' : ''}`}>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleExpand(g.id)}
                            className="w-5 h-5 rounded border border-gray-300 hover:border-[#0070CE] hover:text-[#0070CE] flex items-center justify-center text-xs font-bold transition bg-white"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        </td>

                        {/* Mã nhóm */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E6F7EF] text-[#00AB56] border border-[#00AB56]/30">
                            {g.code}
                          </span>
                        </td>

                        {/* Tên nhóm trường */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#232628]">{g.name}</div>
                          <div className="text-[11px] text-[#8B97A1]">
                            {g.taxCode ? `MST: ${g.taxCode}` : 'Chưa có thông tin hợp đồng'}
                          </div>
                        </td>

                        {/* Chi nhánh count */}
                        <td className="py-3 px-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-bold text-gray-700 bg-gray-100">
                            {g.branches?.length || 0}
                          </span>
                        </td>

                        {/* Năm dịch vụ */}
                        <td className="py-3 px-4 text-[#687179]">
                          {formatDate(g.serviceYearStart)} → {formatDate(g.serviceYearEnd)}
                        </td>

                        {/* Ngưỡng truy thu */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3E8FF] text-[#7E22CE]">
                            {g.thresholds?.minActiveMonths} tháng ({g.thresholds?.surplusDayThreshold} ngày dư)
                          </span>
                        </td>

                        {/* Đơn vị đối soát */}
                        <td className="py-3 px-4 font-medium text-[#232628]">
                          {SETTLEMENT_SCOPE_LABELS[g.settlementScope]}
                        </td>

                        {/* Trạng thái Switch (BR10) */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleGroupStatus(g.id)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              g.isActive ? 'bg-[#0070CE]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                g.isActive ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Thao tác Menu */}
                        <td className="py-3 px-4 text-right relative">
                          <button
                            onClick={() => setOpenActionMenuId(isMenuOpen ? null : g.id)}
                            className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                          >
                            •••
                          </button>

                          {isMenuOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30 cursor-default"
                                onClick={() => setOpenActionMenuId(null)}
                              />
                              <div
                                className={`absolute right-4 ${
                                  openUpwards ? 'bottom-10 origin-bottom-right' : 'top-10 origin-top-right'
                                } w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-40 text-left transition-all duration-150 animate-in fade-in`}
                              >
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setActiveBranchContext({ group: g, branch: null });
                                    setBranchDrawerOpen(true);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0070CE] flex items-center gap-2 cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                  Thêm chi nhánh
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setEditingGroup(g);
                                    setGroupDrawerOpen(true);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0070CE] flex items-center gap-2 cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                  Chỉnh sửa nhóm
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setSelectedGroupForPassword(g);
                                    setPasswordDrawerOpen(true);
                                  }}
                                  className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-[#0070CE] flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                  </svg>
                                  <span>{g.passwordSent ? 'Cập nhật mật khẩu' : 'Gửi mật khẩu'}</span>
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>

                      {/* Nested Branch Sub-table Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="9" className="p-0 bg-[#F8FAFC]">
                            <div className="p-4 pl-12 border-y border-blue-100 bg-[#F4F9FD]/40 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-800">Chi nhánh trong nhóm</span>
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white text-gray-600 border border-gray-200">
                                    {g.branches?.length || 0} chi nhánh
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveBranchContext({ group: g, branch: null });
                                    setBranchDrawerOpen(true);
                                  }}
                                  className="text-xs text-[#0070CE] font-semibold hover:underline flex items-center gap-1"
                                >
                                  + Thêm chi nhánh vào nhóm
                                </button>
                              </div>

                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                                    <tr>
                                      <th className="py-2.5 px-3 w-8 text-center font-semibold">#</th>
                                      <th className="py-2.5 px-3 font-semibold">Mã trường</th>
                                      <th className="py-2.5 px-4 font-semibold">Tên chi nhánh</th>
                                      <th className="py-2.5 px-4 font-semibold">Dịch vụ & đơn giá</th>
                                      <th className="py-2.5 px-4 font-semibold text-center">Trạng thái (BR10)</th>
                                      <th className="py-2.5 px-3 font-semibold text-right">Thao tác</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {(!g.branches || g.branches.length === 0) ? (
                                      <tr>
                                        <td colSpan="6" className="py-6 text-center text-gray-400">
                                          Nhóm trường chưa có chi nhánh nào
                                        </td>
                                      </tr>
                                    ) : (
                                      g.branches.map((b, idx) => (
                                        <tr key={b.id} className="hover:bg-gray-50/60">
                                          <td className="py-2.5 px-3 text-center text-gray-400">{idx + 1}</td>
                                          <td className="py-2.5 px-3 font-mono font-bold text-[#0070CE]">
                                            {b.code}
                                          </td>
                                          <td className="py-2.5 px-4">
                                            <span className="font-semibold text-gray-800">{b.name}</span>
                                            <span className="text-[11px] text-gray-500 block">
                                              {b.studentCount} học sinh đăng ký
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-4">
                                            <div className="flex flex-wrap gap-1">
                                              {b.services?.managementSoftware && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-[#0070CE] font-medium border border-blue-100">
                                                  QL Nhà trường
                                                </span>
                                              )}
                                              {b.services?.cameraAi && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 font-medium border border-amber-100">
                                                  Camera AI
                                                </span>
                                              )}
                                              {b.services?.studentCard && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                                                  Thẻ học sinh
                                                </span>
                                              )}
                                              {b.services?.canteen && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-medium border border-purple-100">
                                                  Căn tin
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-4 text-center">
                                            <button
                                              type="button"
                                              onClick={() => toggleBranchStatus(g.id, b.id)}
                                              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                b.isActive ? 'bg-[#0070CE]' : 'bg-gray-300'
                                              }`}
                                            >
                                              <span
                                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                  b.isActive ? 'translate-x-3' : 'translate-x-0'
                                                }`}
                                              />
                                            </button>
                                          </td>
                                          <td className="py-2.5 px-3 text-right">
                                            <button
                                              onClick={() => {
                                                setActiveBranchContext({ group: g, branch: b });
                                                setBranchDrawerOpen(true);
                                              }}
                                              className="px-2.5 py-1 text-xs font-semibold text-[#0070CE] hover:bg-blue-50 rounded transition"
                                            >
                                              Sửa
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWERS */}
      <GroupDrawer
        isOpen={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
        group={editingGroup}
        onSave={(data) => {
          if (editingGroup) {
            updateGroup(editingGroup.id, data);
          } else {
            addGroup(data);
          }
        }}
      />

      <BranchDrawer
        isOpen={branchDrawerOpen}
        onClose={() => {
          setBranchDrawerOpen(false);
          setActiveBranchContext(null);
        }}
        group={activeBranchContext?.group}
        branch={activeBranchContext?.branch}
        onOpenGroupConfig={(groupToEdit) => {
          setBranchDrawerOpen(false);
          setActiveBranchContext(null);
          setEditingGroup(groupToEdit);
          setGroupDrawerOpen(true);
        }}
        onSave={(branchData) => {
          if (!activeBranchContext?.group) return;
          const groupId = activeBranchContext.group.id;
          if (activeBranchContext.branch) {
            updateBranch(groupId, activeBranchContext.branch.id, branchData);
          } else {
            // Add branch to group
            const currentBranches = activeBranchContext.group.branches || [];
            updateGroup(groupId, { branches: [...currentBranches, branchData] });
          }
        }}
      />

      <PasswordDrawer
        isOpen={passwordDrawerOpen}
        onClose={() => {
          setPasswordDrawerOpen(false);
          setSelectedGroupForPassword(null);
        }}
        group={selectedGroupForPassword}
        onSavePassword={(newPassword) => {
          if (!selectedGroupForPassword) return;
          const isUpdate = Boolean(selectedGroupForPassword.passwordSent);
          updateGroup(selectedGroupForPassword.id, {
            password: newPassword,
            passwordSent: true,
            passwordSentAt: new Date().toISOString(),
          });
          setToastMessage(
            isUpdate
              ? `Đã cập nhật và gửi mật khẩu file đối soát cho ${selectedGroupForPassword.name} thành công!`
              : `Đã gửi mật khẩu mở file đối soát cho ${selectedGroupForPassword.name} thành công!`
          );
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Success Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
          <div className="bg-[#0070CE] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/20 text-xs">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 hover:bg-white/20 rounded p-1 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SM1ConfigList;
