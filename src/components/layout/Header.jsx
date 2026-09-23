import React from 'react';
import { usePortal } from '../../context/PortalContext.jsx';
import { USER_ROLES, USER_ROLE_LABELS } from '../../data/models.js';
import EcoIcon from '../common/EcoIcon.jsx';

export function Header({ activeSubModule, onSelectSubModule }) {
  const { currentRole, setCurrentRole } = usePortal();

  return (
    <header className="bg-gradient-to-r from-[#0070CE] to-[#1A94FF] text-white shadow-md">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center p-1.5 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FEC020] fill-current">
                <path d="M20 7h-4.18C16.4 6.4 16.6 5.7 16.6 5c0-2.2-1.8-4-4-4-1.3 0-2.4.6-3.1 1.6C8.8 1.6 7.7 1 6.4 1c-2.2 0-4 1.8-4 4 0 .7.2 1.4.8 2H-.01v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7h-2zm-9-4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4.6 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM2 9h7v11H2V9zm9 11V9h7v11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide text-white drop-shadow-sm">Eco Card Portal</span>
              <span className="block text-[10px] text-blue-100 tracking-wider font-medium uppercase">Finviet Technology</span>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Người dùng
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Dịch vụ
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Đơn vị CNTT
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Nhật ký
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Trường học
            </button>
            {/* Active Module: Đối soát */}
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 border border-white/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FEC020] animate-pulse"></span>
              Đối soát
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-blue-100 hover:text-white rounded transition">
              Quản trị vận hành
            </button>
          </nav>
        </div>

        {/* Right: Role Switcher & User Profile */}
        <div className="flex items-center gap-4">
          {/* RBAC Role Switcher Sandbox Tool */}
          <div className="flex items-center gap-2 bg-black/15 px-3 py-1 rounded-lg border border-white/20">
            <span className="text-[11px] text-blue-100 hidden sm:inline">Vai trò:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value={USER_ROLES.FINANCE_OFFICER} className="text-gray-900">
                {USER_ROLE_LABELS[USER_ROLES.FINANCE_OFFICER]}
              </option>
              <option value={USER_ROLES.OPS_ADMIN} className="text-gray-900">
                {USER_ROLE_LABELS[USER_ROLES.OPS_ADMIN]}
              </option>
              <option value={USER_ROLES.FINANCE_APPROVER} className="text-gray-900">
                {USER_ROLE_LABELS[USER_ROLES.FINANCE_APPROVER]}
              </option>
            </select>
          </div>

          {/* User profile capsule */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#0070CE] font-bold text-xs flex items-center justify-center shadow">
              LT
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-tight">Lê Thuận</div>
              <div className="text-[10px] text-blue-100 leading-tight">Kế toán thanh toán</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
