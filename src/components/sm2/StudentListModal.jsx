import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Filter,
  ArrowLeftRight,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  Eye,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { formatVND } from '../../data/models.js';
import { getBranchDetailedStudentData } from '../../services/studentDataGenerator.js';

export default function StudentListModal({ isOpen, onClose, branchData, sessionData }) {
  const [activeTab, setActiveTab] = useState('CURRENT'); // 'CURRENT' | 'ARREARS'
  const [showLogCompare, setShowLogCompare] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ACTIVE_ONLY' | 'NON_BILLABLE' | 'DISCREPANCY_ONLY' | 'INTERRUPTED'
  const pageSize = 10;

  // Resolve current period and previous period names
  const currentPeriodName = sessionData?.periodName || 'Kỳ 3';
  const prevPeriodName = useMemo(() => {
    if (sessionData?.snapshot?.period?.name && sessionData?.arrearsOption === 'IMMEDIATE_T1') {
      return sessionData.snapshot.period.name;
    }
    const match = currentPeriodName.match(/Kỳ\s*(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > 1 ? `Kỳ ${num - 1}` : 'Kỳ 2';
    }
    return 'Kỳ 2';
  }, [currentPeriodName, sessionData]);

  // Retrieve partitioned student data
  const detailedData = useMemo(() => {
    if (!isOpen || !branchData) {
      return { currentPeriodStudents: [], arrearsStudents: [] };
    }
    return getBranchDetailedStudentData(branchData, sessionData);
  }, [isOpen, branchData, sessionData]);

  const currentList = detailedData.currentPeriodStudents || [];
  const arrearsList = detailedData.arrearsStudents || [];
  const hasArrearsTab = arrearsList.length > 0;

  // Active raw list depending on selected tab
  const activeRawList = activeTab === 'ARREARS' && hasArrearsTab ? arrearsList : currentList;

  // Count discrepancies for filter badge
  const discrepancyCount = useMemo(() => {
    return activeRawList.filter((s) => s.statusLogs?.isDiscrepancy === true).length;
  }, [activeRawList]);

  // Filter students based on search term and filter type
  const filteredStudents = useMemo(() => {
    return activeRawList.filter((s) => {
      const matchSearch =
        !searchTerm ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.statusLogs?.events?.some((ev) =>
          ev.changedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ev.reason?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchSearch) return false;

      if (filterType === 'ACTIVE_ONLY') {
        return s.billedMonths > 0 && s.result !== 'Không tính phí';
      }
      if (filterType === 'NON_BILLABLE') {
        return s.result === 'Không tính phí' || s.billedMonths === 0;
      }
      if (filterType === 'DISCREPANCY_ONLY') {
        return s.statusLogs?.isDiscrepancy === true;
      }
      if (filterType === 'INTERRUPTED') {
        return s.statusLogs?.isInterrupted === true;
      }
      return true;
    });
  }, [activeRawList, searchTerm, filterType]);

  // Resolve selected student object (hooks declared unconditionally before any early return)
  const selectedStudentObj = useMemo(() => {
    if (!selectedStudentId) return null;
    return filteredStudents.find((s) => s.id === selectedStudentId) || null;
  }, [selectedStudentId, filteredStudents]);

  // Auto-scroll the matching row into view on the right panel (and left panel) when selected
  useEffect(() => {
    if (selectedStudentId) {
      const timer = setTimeout(() => {
        const safeId = selectedStudentId.replace(/[^a-zA-Z0-9_-]/g, '_');
        const rightRow = document.getElementById(`log-row-${safeId}`);
        if (rightRow) {
          rightRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const leftRow = document.getElementById(`left-row-${safeId}`);
        if (leftRow) {
          leftRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedStudentId, showLogCompare, activeTab, currentPage]);

  if (!isOpen || !branchData) return null;

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Adjust page if search reduces total pages
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const currentItems = filteredStudents.slice(startIndex, startIndex + pageSize);

  const handleExportExcel = (e) => {
    e?.stopPropagation();
    const isArrears = activeTab === 'ARREARS';
    const periodLabel = isArrears ? prevPeriodName : currentPeriodName;

    const escapeXml = (unsafe) => {
      if (unsafe === null || unsafe === undefined) return '';
      return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Sheet 1: Bảng bên trái - Danh sách học sinh
    const sheet1Headers = [
      'STT',
      'Họ và tên',
      'Mã UID',
      isArrears ? 'Số ngày thực tế kỳ trước' : 'Số ngày thực tế kỳ này',
      'Tính ngưỡng (tháng)',
      'Số tháng thu',
      'Dịch vụ',
      'Đơn giá (VND)',
      isArrears ? 'Phí truy thu (VND)' : 'Phí kỳ này (VND)',
      'Kết quả',
      'Tổng tiền (VND)',
      'Ghi chú',
    ];

    let sheet1RowsXml = `
      <Row ss:Height="26">
        ${sheet1Headers
          .map(
            (h) =>
              `<Cell ss:StyleID="HeaderBlue"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
          )
          .join('')}
      </Row>
    `;

    filteredStudents.forEach((s, idx) => {
      const fee = isArrears ? s.arrearsFee || 0 : s.periodFee || 0;
      sheet1RowsXml += `
        <Row ss:Height="22">
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${idx + 1}</Data></Cell>
          <Cell ss:StyleID="TextBold"><Data ss:Type="String">${escapeXml(s.name)}</Data></Cell>
          <Cell ss:StyleID="Code"><Data ss:Type="String">${escapeXml(s.uid)}</Data></Cell>
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${s.actualDays || 0}</Data></Cell>
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${s.thresholdMonths || 0}</Data></Cell>
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${s.billedMonths || 0}</Data></Cell>
          <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(s.serviceName || '')}</Data></Cell>
          <Cell ss:StyleID="Currency"><Data ss:Type="Number">${s.unitPrice || 0}</Data></Cell>
          <Cell ss:StyleID="Currency"><Data ss:Type="Number">${fee}</Data></Cell>
          <Cell ss:StyleID="Center"><Data ss:Type="String">${escapeXml(s.result || 'Có tính phí')}</Data></Cell>
          <Cell ss:StyleID="CurrencyBold"><Data ss:Type="Number">${s.totalFee || 0}</Data></Cell>
          <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(s.note || '')}</Data></Cell>
        </Row>
      `;
    });

    // Sheet 2: Bảng bên phải - Đối chiếu lịch sử trạng thái
    const sheet2Headers = [
      'STT',
      'Tên học sinh',
      'Mã UID',
      'Phân loại học sinh',
      'Lịch sử chi tiết (Hoạt động / Tạm dừng)',
      'Tổng số ngày hoạt động (theo Log)',
      'Số ngày tính trên phiên',
      'Chênh lệch đối soát',
      'Giải trình chênh lệch & Đề xuất',
      'Người cập nhật trạng thái',
    ];

    let sheet2RowsXml = `
      <Row ss:Height="26">
        ${sheet2Headers
          .map(
            (h) =>
              `<Cell ss:StyleID="HeaderPurple"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`
          )
          .join('')}
      </Row>
    `;

    filteredStudents.forEach((s, idx) => {
      const events = s.statusLogs?.events || [];
      const logSummary = events
        .map(
          (ev) =>
            `[${ev.statusLabel || (ev.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng')}] ${ev.startDate} → ${ev.endDate} (${ev.days} ngày - ${ev.reason})`
        )
        .join('; \n');

      const changedBySummary = events
        .map((ev) => ev.changedBy)
        .filter((v, i, a) => v && a.indexOf(v) === i)
        .join(', ');

      const isDiscrepancy = s.statusLogs?.isDiscrepancy === true;
      const discrepancyInfo = isDiscrepancy
        ? `Lệch ${s.statusLogs.discrepancyDays > 0 ? '+' : ''}${s.statusLogs.discrepancyDays} ngày`
        : 'Khớp tính phí';

      const explanation = s.statusLogs?.discrepancyExplanation || (isDiscrepancy ? 'Cần đối chiếu thêm' : 'Dữ liệu khớp');

      sheet2RowsXml += `
        <Row ss:Height="${events.length > 1 ? events.length * 18 + 12 : 24}">
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${idx + 1}</Data></Cell>
          <Cell ss:StyleID="TextBold"><Data ss:Type="String">${escapeXml(s.name)}</Data></Cell>
          <Cell ss:StyleID="Code"><Data ss:Type="String">${escapeXml(s.uid)}</Data></Cell>
          <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(s.isArrearsStudent ? 'Học sinh truy thu' : 'Học sinh chính thức')}</Data></Cell>
          <Cell ss:StyleID="Multiline"><Data ss:Type="String">${escapeXml(logSummary)}</Data></Cell>
          <Cell ss:StyleID="CenterBold"><Data ss:Type="Number">${s.statusLogs?.totalActiveDays || s.actualDays || 0}</Data></Cell>
          <Cell ss:StyleID="Center"><Data ss:Type="Number">${s.actualDays || 0}</Data></Cell>
          <Cell ss:StyleID="${isDiscrepancy ? 'Warning' : 'Success'}"><Data ss:Type="String">${escapeXml(discrepancyInfo)}</Data></Cell>
          <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(explanation)}</Data></Cell>
          <Cell ss:StyleID="Default"><Data ss:Type="String">${escapeXml(changedBySummary)}</Data></Cell>
        </Row>
      `;
    });

    const xmlWorkbook = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
   <Style ss:ID="Default" ss:Name="Normal">
     <Alignment ss:Vertical="Center"/>
     <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#232628"/>
   </Style>
   <Style ss:ID="HeaderBlue">
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
     <Interior ss:Color="#0070CE" ss:Pattern="Solid"/>
     <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
     <Borders>
       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0050B3"/>
       <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0050B3"/>
       <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0050B3"/>
       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0050B3"/>
     </Borders>
   </Style>
   <Style ss:ID="HeaderPurple">
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
     <Interior ss:Color="#6B21A8" ss:Pattern="Solid"/>
     <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
     <Borders>
       <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#581C87"/>
       <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#581C87"/>
       <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#581C87"/>
       <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#581C87"/>
     </Borders>
   </Style>
   <Style ss:ID="Center">
     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
     <Font ss:FontName="Calibri" ss:Size="10"/>
   </Style>
   <Style ss:ID="CenterBold">
     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1"/>
   </Style>
   <Style ss:ID="TextBold">
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
     <Alignment ss:Vertical="Center"/>
   </Style>
   <Style ss:ID="Code">
     <Font ss:FontName="Consolas" ss:Size="10" ss:Color="#374151"/>
     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   </Style>
   <Style ss:ID="Currency">
     <NumberFormat ss:Format="#,##0"/>
     <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
     <Font ss:FontName="Calibri" ss:Size="10"/>
   </Style>
   <Style ss:ID="CurrencyBold">
     <NumberFormat ss:Format="#,##0"/>
     <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#111827"/>
   </Style>
   <Style ss:ID="Warning">
     <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#B45309"/>
     <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   </Style>
   <Style ss:ID="Success">
     <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#047857"/>
     <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
     <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   </Style>
   <Style ss:ID="Multiline">
     <Alignment ss:Vertical="Top" ss:WrapText="1"/>
     <Font ss:FontName="Calibri" ss:Size="9" ss:Color="#4B5563"/>
   </Style>
 </Styles>

 <Worksheet ss:Name="Danh sách học sinh">
   <Table ss:DefaultRowHeight="18">
     <Column ss:Width="35"/>
     <Column ss:Width="170"/>
     <Column ss:Width="110"/>
     <Column ss:Width="100"/>
     <Column ss:Width="80"/>
     <Column ss:Width="80"/>
     <Column ss:Width="180"/>
     <Column ss:Width="95"/>
     <Column ss:Width="110"/>
     <Column ss:Width="95"/>
     <Column ss:Width="110"/>
     <Column ss:Width="160"/>
     ${sheet1RowsXml}
   </Table>
 </Worksheet>

 <Worksheet ss:Name="Đối chiếu lịch sử trạng thái">
   <Table ss:DefaultRowHeight="18">
     <Column ss:Width="35"/>
     <Column ss:Width="170"/>
     <Column ss:Width="110"/>
     <Column ss:Width="130"/>
     <Column ss:Width="340"/>
     <Column ss:Width="120"/>
     <Column ss:Width="100"/>
     <Column ss:Width="120"/>
     <Column ss:Width="320"/>
     <Column ss:Width="190"/>
     ${sheet2RowsXml}
   </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlWorkbook], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const tabSlug = isArrears ? 'truy_thu' : 'phi_ky_nay';
    link.download = `Danh_sach_hoc_sinh_va_Doi_chieu_${branchData.branchCode || 'branch'}_${tabSlug}_${sessionData?.sessionCode || 'session'}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper for smart pagination display
  const getPaginationPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (validCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (validCurrentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, '...', totalPages];
  };

  const handleRowClick = (studentId, e) => {
    e.stopPropagation();
    setSelectedStudentId((prev) => (prev === studentId ? null : studentId));
  };

  const clearSelection = () => {
    if (selectedStudentId) {
      setSelectedStudentId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-2 lg:p-4 overflow-y-auto"
      onClick={clearSelection}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 transition-all ${
          showLogCompare
            ? 'w-full max-w-[98vw] 2xl:max-w-[1650px] h-[94vh]'
            : 'w-full max-w-[1100px] max-h-[96vh]'
        }`}
        onClick={clearSelection}
      >
        {/* Header (Clicking anywhere here clears chosen student) */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 cursor-default">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-gray-900">Danh sách học sinh</h3>
            <span className="px-2.5 py-0.5 text-xs text-[#0070CE] bg-[#E6F4FF] border border-[#91CAFF] rounded-md font-semibold">
              {branchData.branchName}
            </span>
            {showLogCompare && (
              <span className="px-2.5 py-0.5 text-xs text-purple-700 bg-purple-50 border border-purple-200 rounded-md font-semibold flex items-center gap-1.5 animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                Chế độ so sánh Lịch sử Hoạt động
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Button: So sánh log */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogCompare(!showLogCompare);
              }}
              title="Mở bảng so sánh đối chiếu lịch sử hoạt động của học sinh"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-2xs border cursor-pointer ${
                showLogCompare
                  ? 'bg-[#0070CE] text-white border-[#0050B3] shadow-inner ring-2 ring-blue-200'
                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ArrowLeftRight className={`w-3.5 h-3.5 ${showLogCompare ? 'text-white' : 'text-[#0070CE]'}`} />
              <span>{showLogCompare ? 'Đang so sánh log' : 'So sánh log'}</span>
              {showLogCompare && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>

            {/* Export Excel (2 Sheets) */}
            <button
              onClick={handleExportExcel}
              title="Xuất file Excel gồm 2 Sheet: [1] Danh sách học sinh & [2] Đối chiếu lịch sử trạng thái"
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#0070CE]" />
              <span>Xuất Excel / CSV</span>
            </button>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2 Tabs: [1] Phí kỳ hiện tại (Kỳ 3) & [2] Truy thu phí kỳ trước (Kỳ 2) */}
        {hasArrearsTab && (
          <div className="flex items-center gap-6 px-5 border-b border-gray-200 bg-white shrink-0 cursor-default">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('CURRENT');
                setCurrentPage(1);
                setSelectedStudentId(null);
              }}
              className={`py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'CURRENT'
                  ? 'border-[#0070CE] text-[#0070CE]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Phí kỳ hiện tại ({currentPeriodName})</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'CURRENT'
                    ? 'bg-blue-100 text-[#0070CE]'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {currentList.length}
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('ARREARS');
                setCurrentPage(1);
                setSelectedStudentId(null);
              }}
              className={`py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'ARREARS'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Truy thu phí kỳ trước ({prevPeriodName})</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  activeTab === 'ARREARS'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {arrearsList.length}
              </span>
            </button>
          </div>
        )}

        {/* SEARCH & FILTER BAR (Clicking empty background here clears chosen student) */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 cursor-default">
          <div
            className="relative flex-1 min-w-[220px] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, UID, người đổi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE]"
            />
          </div>

          <div className="flex items-center gap-3">
            {selectedStudentId && (
              <div
                className="flex items-center gap-1.5 bg-blue-100 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-medium animate-in fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="w-3.5 h-3.5 text-[#0070CE]" />
                <span>Đang tập trung: <strong>{selectedStudentObj?.name || '1 học sinh'}</strong></span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStudentId(null);
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-950 font-bold px-1 rounded hover:bg-blue-200 transition cursor-pointer"
                  title="Bỏ chọn học sinh"
                >
                  ✕ Bỏ chọn
                </button>
              </div>
            )}

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#0070CE] cursor-pointer text-gray-700 font-medium"
              >
                <option value="ALL">Tất cả ({activeRawList.length})</option>
                <option value="ACTIVE_ONLY">Có tính phí</option>
                <option value="NON_BILLABLE">Không tính phí (≤ 30 ngày)</option>
                {discrepancyCount > 0 && (
                  <option value="DISCREPANCY_ONLY">⚠️ Lệch dữ liệu đối soát ({discrepancyCount})</option>
                )}
                {showLogCompare && (
                  <option value="INTERRUPTED">Có gián đoạn / Kích hoạt lại</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* MAIN BODY: SPLIT VIEW IF showLogCompare IS TRUE, ELSE SINGLE TABLE */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-gray-200 select-none">
          {/* ================= LEFT PANEL: BASELINE CURRENT UI TABLE ================= */}
          <div className={`flex flex-col overflow-hidden bg-white ${showLogCompare ? 'w-full lg:w-[48%] xl:w-[46%]' : 'w-full'}`}>
            {showLogCompare && (
              <div className="px-4 py-2 bg-[#F0F7FF] border-b border-[#D0E5FF] flex items-center justify-between text-xs font-bold text-[#0050B3] shrink-0 cursor-default">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0070CE]"></span>
                  <span>Dữ liệu tính phí phiên đối soát (Kỳ hiện hành)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-normal text-blue-700">
                  <span>{activeTab === 'CURRENT' ? `Kỳ đối soát: ${currentPeriodName}` : `Truy thu: ${prevPeriodName}`}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 italic">Click 1 học sinh để đối chiếu</span>
                </div>
              </div>
            )}

            <div className="overflow-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-gray-700 font-semibold border-b border-gray-200 select-none sticky top-0 z-10 cursor-default">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center bg-[#F8FAFC]">STT</th>
                    <th className="py-2.5 px-3 min-w-[140px] bg-[#F8FAFC]">Học sinh</th>
                    <th className="py-2.5 px-3 min-w-[120px] bg-[#F8FAFC]">
                      {activeTab === 'ARREARS' ? 'Thời gian active kỳ trước' : 'Thời gian active'}
                    </th>
                    <th className="py-2.5 px-2 text-center min-w-[80px] bg-[#F8FAFC]">Số tháng thu</th>
                    <th className="py-2.5 px-3 min-w-[140px] bg-[#F8FAFC]">Dịch vụ</th>
                    {activeTab === 'ARREARS' ? (
                      <th className="py-2.5 px-3 text-right min-w-[95px] bg-[#F8FAFC]">Phí truy thu</th>
                    ) : (
                      <th className="py-2.5 px-3 text-right min-w-[95px] bg-[#F8FAFC]">Phí kỳ này</th>
                    )}
                    <th className="py-2.5 px-2 text-center min-w-[95px] bg-[#F8FAFC]">Kết quả</th>
                    <th className="py-2.5 px-3 text-right min-w-[100px] bg-[#F8FAFC]">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-gray-400 text-xs">
                        Không tìm thấy học sinh phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, index) => {
                      const stt = startIndex + index + 1;
                      const isCamera = item.serviceName?.toLowerCase().includes('camera');
                      const isSchoolApp =
                        item.serviceName?.toLowerCase().includes('quản lý') ||
                        item.serviceName?.toLowerCase().includes('phần mềm');
                      const isStudentCard = item.serviceName?.toLowerCase().includes('thẻ');

                      let serviceBadgeClass = 'px-2 py-0.5 text-xs rounded border inline-block ';
                      if (isCamera) {
                        serviceBadgeClass += 'text-[#0050B3] bg-[#E6F7FF] border-[#91D5FF]';
                      } else if (isSchoolApp) {
                        serviceBadgeClass += 'text-[#1D39C4] bg-[#F0F5FF] border-[#ADC6FF]';
                      } else if (isStudentCard) {
                        serviceBadgeClass += 'text-[#00897B] bg-[#E0F2F1] border-[#80CBC4]';
                      } else {
                        serviceBadgeClass += 'text-[#0070CE] bg-[#E6F4FF] border-[#91CAFF]';
                      }

                      // ONLY ONE STUDENT PICKED AT A TIME
                      const isSelected = selectedStudentId === item.id;
                      const hasActiveSelection = Boolean(selectedStudentId);
                      const isBlurred = hasActiveSelection && !isSelected;
                      const isHovered = hoveredId === item.id;

                      const safeId = (item.id || item.uid || `row-${index}`).replace(/[^a-zA-Z0-9_-]/g, '_');
                      let rowClass = 'transition-all duration-150 cursor-pointer scroll-mt-12 ';
                      if (isSelected) {
                        rowClass += 'bg-blue-100/90 ring-2 ring-[#0070CE] shadow-xs z-10 relative font-semibold';
                      } else if (isBlurred) {
                        rowClass += 'opacity-25 filter blur-[0.6px] hover:opacity-80 hover:filter-none';
                      } else if (isHovered) {
                        rowClass += 'bg-blue-50/60 ring-1 ring-blue-300';
                      } else {
                        rowClass += 'hover:bg-blue-50/25';
                      }

                      return (
                        <tr
                          id={`left-row-${safeId}`}
                          key={item.id || `${item.uid}-${item.serviceId || index}`}
                          onClick={(e) => handleRowClick(item.id, e)}
                          onMouseEnter={() => setHoveredId(item.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          className={rowClass}
                        >
                          <td className="py-2 px-3 text-center text-gray-500 font-medium">
                            {stt}
                          </td>

                          <td className="py-2 px-3">
                            <div className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.statusLogs?.isDiscrepancy && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Có chênh lệch log" />
                              )}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                              UID: {item.uid}
                            </div>
                            {item.note && item.note !== 'Học sinh tiếp tục sử dụng' && (
                              <div
                                className={`text-[10px] rounded px-1.5 py-0.5 mt-1 inline-block border ${
                                  activeTab === 'ARREARS'
                                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                                    : 'text-gray-600 bg-gray-50 border-gray-200'
                                }`}
                              >
                                {item.note}
                              </div>
                            )}
                          </td>

                          <td className="py-2 px-3">
                            <div className="text-gray-900 text-xs font-medium">
                              {item.actualDays} ngày thực tế
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              Tính ngưỡng: {item.thresholdMonths} tháng
                            </div>
                          </td>

                          <td className="py-2 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 text-xs rounded font-medium inline-block ${
                                item.billedMonths > 0
                                  ? activeTab === 'ARREARS'
                                    ? 'text-amber-900 bg-amber-50 border border-amber-300 font-bold'
                                    : 'text-[#0070CE] bg-[#E6F4FF] border border-[#91CAFF]'
                                  : 'text-gray-400 bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {item.billedMonths} tháng
                            </span>
                          </td>

                          <td className="py-2 px-3">
                            <span className={serviceBadgeClass}>{item.serviceName}</span>
                          </td>

                          {activeTab === 'ARREARS' ? (
                            <td className="py-2 px-3 text-right font-numeric font-bold text-amber-900">
                              {formatVND(item.arrearsFee || 0)}
                            </td>
                          ) : (
                            <td className="py-2 px-3 text-right font-numeric text-gray-900">
                              {formatVND(item.periodFee || 0)}
                            </td>
                          )}

                          <td className="py-2 px-2 text-center">
                            {item.result === 'Không tính phí' ? (
                              <span className="px-2 py-0.5 text-xs text-[#687179] bg-[#F4F5F7] border border-[#DFE1E6] rounded font-medium inline-block">
                                Không tính phí
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-xs text-[#00AB56] bg-[#E6F9F0] border border-[#A3E9C7] rounded font-medium inline-block">
                                Có tính phí
                              </span>
                            )}
                          </td>

                          <td className="py-2 px-3 text-right font-bold font-numeric text-gray-900">
                            {formatVND(item.totalFee)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Left Footer: Pagination */}
            <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white shrink-0 cursor-default">
              <div className="font-medium text-gray-600">
                Hiển thị {currentItems.length} / {totalItems} học sinh
              </div>

              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={validCurrentPage === 1}
                  className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPaginationPages().map((pageNumber, idx) => {
                  if (pageNumber === '...') {
                    return (
                      <span key={`ellipsis-left-${idx}`} className="px-1 text-gray-400 select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-left-${pageNumber}`}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold transition cursor-pointer ${
                        validCurrentPage === pageNumber
                          ? 'bg-[#0070CE] text-white shadow-xs'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={validCurrentPage === totalPages}
                  className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL: LOG COMPARISON AUDIT (100% VIETNAMESE + DISCREPANCY REASONING) ================= */}
          {showLogCompare && (
            <div className="w-full lg:w-[52%] xl:w-[54%] flex flex-col overflow-hidden bg-[#FAFBFC] animate-in fade-in slide-in-from-right-4 duration-150">
              {/* Right Header Banner */}
              <div className="px-4 py-2 bg-purple-50/90 border-b border-purple-200 flex items-center justify-between text-xs font-bold text-purple-950 shrink-0 cursor-default">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span>Đối chiếu Lịch sử Trạng thái (Hoạt động / Tạm dừng)</span>
                </div>
                <div className="flex items-center gap-2">
                  {discrepancyCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-800 border border-rose-200 rounded font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      {discrepancyCount} lệch dữ liệu
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-[10px] bg-purple-100 text-purple-900 border border-purple-200 rounded font-semibold">
                    {totalItems} bản ghi log
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLogCompare(false);
                    }}
                    className="text-gray-400 hover:text-gray-700 text-xs px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-100 transition cursor-pointer"
                    title="Đóng chế độ so sánh"
                  >
                    ✕ Thu gọn
                  </button>
                </div>
              </div>

              {/* Right Table with 5 Requested Columns in 100% Vietnamese */}
              <div className="overflow-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F1F5F9] text-gray-700 font-semibold border-b border-gray-200 select-none sticky top-0 z-10 cursor-default">
                    <tr>
                      <th className="py-2.5 px-3 min-w-[130px] bg-[#F1F5F9]">Tên học sinh</th>
                      <th className="py-2.5 px-3 min-w-[100px] bg-[#F1F5F9]">Mã UID</th>
                      <th className="py-2.5 px-3 min-w-[210px] bg-[#F1F5F9]">Lịch sử hoạt động</th>
                      <th className="py-2.5 px-3 min-w-[220px] bg-[#F1F5F9]">Tổng số ngày hoạt động</th>
                      <th className="py-2.5 px-3 min-w-[150px] bg-[#F1F5F9]">Người cập nhật trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-gray-400 text-xs">
                          Không có dữ liệu log cho bộ lọc hiện tại.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, index) => {
                        // ONLY ONE STUDENT PICKED AT A TIME
                        const isSelected = selectedStudentId === item.id;
                        const hasActiveSelection = Boolean(selectedStudentId);
                        const isBlurred = hasActiveSelection && !isSelected;
                        const isHovered = hoveredId === item.id;

                        const statusLogs = item.statusLogs;
                        const events = statusLogs?.events || [];
                        const totalLogDays = statusLogs?.totalActiveDays || item.actualDays;
                        const isDiscrepancy = statusLogs?.isDiscrepancy === true;

                        const safeId = (item.id || item.uid || `row-${index}`).replace(/[^a-zA-Z0-9_-]/g, '_');
                        let rowClass = 'transition-all duration-150 align-top cursor-pointer scroll-mt-12 ';
                        if (isSelected) {
                          rowClass += 'bg-purple-100/95 ring-2 ring-purple-600 shadow-md z-10 relative font-semibold';
                        } else if (isBlurred) {
                          rowClass += 'opacity-25 filter blur-[0.6px] hover:opacity-80 hover:filter-none';
                        } else if (isHovered) {
                          rowClass += 'bg-purple-50/60 ring-1 ring-purple-300';
                        } else {
                          rowClass += isDiscrepancy ? 'bg-amber-50/30 hover:bg-amber-50/60' : 'hover:bg-purple-50/25';
                        }

                        return (
                          <tr
                            id={`log-row-${safeId}`}
                            key={`log-${item.id || item.uid}-${index}`}
                            onClick={(e) => handleRowClick(item.id, e)}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={rowClass}
                          >
                            {/* 1. Tên học sinh */}
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-gray-900 text-xs flex items-center gap-1.5">
                                <span>{item.name}</span>
                                {isDiscrepancy && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    Lệch
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                <span>{item.isArrearsStudent ? 'Học sinh truy thu' : 'Học sinh chính thức'}</span>
                              </div>
                            </td>

                            {/* 2. Mã UID */}
                            <td className="py-2.5 px-3">
                              <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded inline-block border border-gray-200">
                                {item.uid}
                              </span>
                            </td>

                            {/* 3. Lịch sử hoạt động */}
                            <td className="py-2.5 px-3">
                              <div className="space-y-1.5">
                                {events.map((ev, evIdx) => (
                                  <div
                                    key={ev.id || evIdx}
                                    className="p-1.5 rounded-md bg-white border border-gray-200/80 shadow-2xs text-[11px]"
                                  >
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span
                                        className={`px-1.5 py-0.5 text-[10px] rounded font-bold uppercase tracking-wider ${
                                          ev.status === 'ACTIVE'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                        }`}
                                      >
                                        {ev.status === 'ACTIVE' ? '● Hoạt động' : '○ Tạm dừng'}
                                      </span>
                                      <span className="font-numeric font-bold text-gray-800 text-[11px]">
                                        {ev.days} ngày
                                      </span>
                                    </div>
                                    <div className="text-gray-700 font-medium mt-1 flex items-center gap-1 text-[11px]">
                                      <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                                      <span>{ev.startDate} → {ev.endDate}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-0.5 italic">
                                      {ev.reason}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* 4. Tổng số ngày hoạt động (WITH DISCREPANCY BADGE & EXPLANATION) */}
                            <td className="py-2.5 px-3">
                              <div className={`p-2 rounded-md border shadow-2xs ${
                                isDiscrepancy
                                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200'
                                  : 'bg-white border-gray-200/80'
                              }`}>
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className={`text-xs font-extrabold font-numeric px-2 py-0.5 rounded border ${
                                    isDiscrepancy
                                      ? 'bg-purple-100 text-purple-900 border-purple-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                    {totalLogDays} ngày hoạt động
                                  </span>

                                  {isDiscrepancy ? (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                                      Lệch {statusLogs.discrepancyDays > 0 ? `+${statusLogs.discrepancyDays}` : statusLogs.discrepancyDays} ngày
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                      Khớp tính phí
                                    </span>
                                  )}
                                </div>

                                {statusLogs?.calculationFormula && (
                                  <div className="text-[10px] text-gray-600 font-medium mt-1.5 bg-white p-1 rounded border border-gray-100">
                                    {statusLogs.calculationFormula}
                                  </div>
                                )}

                                {/* DISCREPANCY EXPLANATION BLOCK */}
                                {isDiscrepancy && statusLogs?.discrepancyExplanation && (
                                  <div className="mt-2 p-2 rounded-md bg-white border border-amber-300 text-[11px] leading-relaxed shadow-2xs">
                                    <div className="font-bold flex items-center gap-1 text-amber-900">
                                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                      <span>Giải trình chênh lệch:</span>
                                    </div>
                                    <div className="mt-1 text-gray-700 text-[11px] leading-relaxed">
                                      {statusLogs.discrepancyExplanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* 5. Người cập nhật trạng thái */}
                            <td className="py-2.5 px-3">
                              <div className="space-y-1.5">
                                {events.map((ev, evIdx) => (
                                  <div
                                    key={`who-${ev.id || evIdx}`}
                                    className="p-1.5 rounded-md bg-white border border-gray-200/80 shadow-2xs text-[11px]"
                                  >
                                    <div className="font-semibold text-gray-900 flex items-center gap-1">
                                      <User className="w-3 h-3 text-gray-400 shrink-0" />
                                      <span>{ev.changedBy}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                      <Calendar className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                                      <span>Mốc cập nhật: {ev.startDate}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Footer: Sync Navigation */}
              <div className="px-4 py-2.5 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 bg-[#FAFBFC] shrink-0 cursor-default">
                <div className="text-[11px] text-purple-900 font-medium flex items-center gap-1">
                  <span>Trang {validCurrentPage} / {totalPages} (Đồng bộ với bảng bên trái)</span>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={validCurrentPage === 1}
                    className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-2 py-0.5 font-bold text-gray-700 bg-white border border-gray-200 rounded">
                    {validCurrentPage}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={validCurrentPage === totalPages}
                    className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
