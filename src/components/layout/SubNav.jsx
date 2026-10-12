import React from 'react';
import { usePortal } from '../../context/PortalContext.jsx';

export function SubNav({ activeSubModule, onSelectSubModule }) {
  const { resetToDefaultSeed } = usePortal();

  return (
    <div className="bg-white border-b border-[#E8EAEC] shadow-sm sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Breadcrumb row */}
        <div className="pt-3 pb-1 flex items-center justify-between text-xs text-[#687179]">
          <div className="flex items-center gap-1.5">
            <span className="hover:text-[#0070CE] cursor-pointer">Trang chủ</span>
            <span>/</span>
            <span className="font-medium text-[#232628]">Đối soát</span>
            <span>/</span>
            <span className="text-[#0070CE] font-semibold">
              {activeSubModule === 'CONFIG' ? 'Cấu hình đối soát' : 'Phiên đối soát'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/docs/PRD_Doi_Soat_Module_M6_VI.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-[#0070CE] hover:text-[#00549B] flex items-center gap-1.5 transition bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200 shadow-2xs cursor-pointer"
              title="Xem và tải tài liệu PRD Phân hệ Đối soát (Bản tiếng Việt 2.0)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Tài liệu PRD (Word/PDF/MD)</span>
            </a>

            <button
              onClick={() => {
                if (window.confirm('Khôi phục dữ liệu mẫu ban đầu từ kịch bản thiết kế?')) {
                  resetToDefaultSeed();
                }
              }}
              className="text-[11px] text-[#687179] hover:text-[#0070CE] flex items-center gap-1 transition cursor-pointer"
              title="Đặt lại dữ liệu mẫu theo đúng ảnh chụp màn hình"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Khôi phục dữ liệu mẫu
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-center gap-8 pt-2">
          <button
            onClick={() => onSelectSubModule('CONFIG')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeSubModule === 'CONFIG'
                ? 'border-[#0070CE] text-[#0070CE]'
                : 'border-transparent text-[#687179] hover:text-[#232628]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Cấu hình đối soát
          </button>

          <button
            onClick={() => onSelectSubModule('SESSIONS')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeSubModule === 'SESSIONS'
                ? 'border-[#0070CE] text-[#0070CE]'
                : 'border-transparent text-[#687179] hover:text-[#232628]'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Phiên đối soát
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubNav;
