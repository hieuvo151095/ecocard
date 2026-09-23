# UI Screen Inventory & Component Specifications: Module M6 (Đối soát)

This document catalogs every screen, drawer, modal, and key visual component within Module M6, specifying routes, layouts, interactive states, and design system token mappings.

---

## 1. Application Chrome & Navigation Architecture

### SCR-00: Top Navigation Header (`src/components/layout/Header.jsx`)
- **Route**: Global Chrome
- **Visual Match**: `docs_legacy/screenshots/sm1-cau-hinh-doi-soat-danh-sach.png` (Top Banner)
- **Layout & Structure**:
  - Background: Primary blue gradient (`background: linear-gradient(90deg, var(--color-primary-blue-eco) 0%, var(--color-global-blue60) 100%)`).
  - Left: Logo icon (wrapped gift vector with colorful confetti) + text label "Eco Card Portal" in white bold 16px.
  - Center: Module navigation links: *Người dùng*, *Dịch vụ*, *Đơn vị CNTT*, *Nhật ký*, *Trường học*, *Đối soát* (active with subtle semi-transparent white highlight pill), *Quản trị vận hành*.
  - Right: User profile pill with circular white avatar icon and text label "Lê Thuận".
- **Sub-Navigation Breadcrumbs (`src/components/layout/SubNav.jsx`)**:
  - Breadcrumb track: `Đối soát / Cấu hình đối soát` or `Đối soát / Phiên đối soát`.
  - Main Page Title: Heading 24px semi-bold (`color: var(--color-title)`).

---

## 2. Sub-Module 1 Screens: Cấu hình đối soát

### SCR-01: School Group Master List (`src/pages/SM1ConfigList.jsx`)
- **Route**: `/reconciliation/config`
- **Visual Match**: `docs_legacy/screenshots/sm1-cau-hinh-doi-soat-danh-sach.png` and `sm1-cau-hinh-doi-soat-expand-chi-nhanh.png`
- **Components**:
  1. **Filter Card**:
     - Container: White card with 1px border (`var(--color-alias-outline)`), radius 8px, padding 20px.
     - Controls:
       - Input "Nhóm trường": prompt hint "Nhập tên, mã nhóm, MST hoặc hợp đồng".
       - Input "Mã trường": prompt hint "Ví dụ: TDN2042".
       - Dropdown "Trạng thái": options "Tất cả", "Bật", "Tắt".
     - Action Buttons (Right-aligned): "Làm lại" (White button with outline), "Tìm kiếm" (Solid primary blue button).
  2. **Data Table Card**:
     - Header bar: Title "Danh sách nhóm trường", "+ Tạo mới" button (solid blue with plus icon), table action utilities (Refresh icon, Row density toggle, Settings/column chooser).
     - Table Columns:
       - Expand Toggle (`+` / `-` square icon button).
       - "Mã nhóm": Green pill tag (`border: 1px solid var(--color-global-green60); color: var(--color-global-green60); border-radius: 4px; padding: 2px 8px`). Example: `HIEUTEST`.
       - "Tên nhóm trường": Group name in bold 14px, secondary subtext "Chưa có thông tin hợp đồng" in gray 12px.
       - "Chi nhánh": Center-aligned branch count (e.g. `1`, `2`).
       - "Năm dịch vụ": Date range formatted `DD/MM/YYYY -> DD/MM/YYYY`.
       - "Ngưỡng truy thu": Purple pill badge (`background: #F3E8FF; color: #7E22CE; border-radius: 4px`). Example: `1 tháng`, `2 tháng`.
       - "Đơn vị đối soát": Text label "Theo nhóm" or "Theo từng trường".
       - "Trạng thái": Interactive switch toggle (blue track when active).
       - "Thao tác": 3-dots dropdown menu button (`...`).
  3. **Expanded Row: Child Branches Table**:
     - Nested card inside table row with title "Chi nhánh trong nhóm" and badge "N chi nhánh".
     - Sub-table columns: `#`, `Mã trường`, `Tên chi nhánh`, `Năm dịch vụ & lịch kỳ`, `Dịch vụ & đơn giá`, `Trạng thái` (switch), `Thao tác` (button "Sửa").

### SCR-02: School Group Drawer (`src/components/sm1/GroupDrawer.jsx`)
- **Route**: Slide-over Drawer triggered from SCR-01 (`+ Tạo mới` or `Thao tác -> Chỉnh sửa`)
- **Visual Match**: `docs_legacy/screenshots/sm1-cau-hinh-doi-soat-modal-chinh-sua-2.png` and `sm1-cau-hinh-doi-soat-modal-chinh-sua-bottom.png`
- **Layout & Structure**:
  - Drawer header: Close icon (`X`), Title "Cập nhật nhóm trường: [Mã nhóm]" or "Tạo mới nhóm trường".
  - Section 1 (Thông tin pháp nhân): Numbered blue circle badge `1`. Fields: `* Mã nhóm trường` (disabled input with gray background on edit), `* Tên nhóm trường`, `Mã số thuế`, `Số hợp đồng`, `Ghi chú hợp đồng`, `Người đại diện`.
  - Section 2 (Đơn vị đối soát): Numbered blue circle badge `2`. Two selectable radio cards: "Theo nhóm trường" (subtext: "Tạo phiên gộp cả nhóm thành một dòng...") and "Theo từng trường" (subtext: "Mỗi chi nhánh là một dòng riêng..."). Input `* Email nhận biên bản của nhóm` with helper text.
  - Section 3 (Lịch kỳ đối soát): Inputs for Service Year Date Range and Period Count, blue button `Sinh lịch kỳ`. Configured periods table with period name, date pickers, `Thu phí` checkbox, delete icon, and button `+ Thêm kỳ`.
  - Section 4 (Ngưỡng thu phí): Inputs for `* Ngưỡng thu (tháng)` and `* Ngày dư làm tròn lên 1 tháng (lần đầu)`.
  - Sticky Footer: "Hủy" button (outline) and "Lưu" button (primary solid blue).

### SCR-03: Branch Assignment Drawer (`src/components/sm1/BranchDrawer.jsx`)
- **Route**: Slide-over Drawer triggered from SCR-01 row actions (`Thêm chi nhánh` or child table `Sửa`)
- **Visual Match**: `docs_legacy/screenshots/sm1-cau-hinh-doi-soat-modal-chi-nhanh-1.png` and `sm1-cau-hinh-doi-soat-modal-chi-nhanh-2.png`
- **Layout & Structure**:
  - Drawer header: Close icon, Title "Cập nhật chi nhánh [Mã chi nhánh badge]", Metadata subhead displaying Group Code badge, Settlement scope, and Threshold.
  - Section 1 (Thông tin chi nhánh và hợp đồng): Dropdown `* Chọn chi nhánh`, date pickers for Start Date and Contract Date, `* Email nhận biên bản`, `* Số học sinh đăng ký`.
  - Section 2 (Dịch vụ và biểu phí): 4 selectable checkbox cards (*Phần mềm quản lý nhà trường*, *Camera AI*, *Thẻ học sinh*, *Căn tin học đường*). Tariff schedule cards for each period (Kỳ 1, Kỳ 2...) displaying active service unit price inputs with currency suffix `đ`.
  - Sticky Footer: "Hủy" and "Lưu".

---

## 3. Sub-Module 2 Screens: Phiên đối soát

### SCR-04: Reconciliation Session Master List (`src/pages/SM2SessionList.jsx`)
- **Route**: `/reconciliation/sessions`
- **Visual Match**: `docs_legacy/screenshots/sm2-phien-doi-soat-danh-sach.jpeg`
- **Components**:
  1. **Two-Row Filter Card**:
     - Row 1: "Mã phiên / đơn vị đối soát", "Nhóm trường", "Trường", "Trạng thái phiên".
     - Row 2: "Trạng thái phiên truy thu", "Khoảng ngày chốt", "Ngày tạo", and action buttons "Làm lại", "Tìm kiếm".
  2. **Summary Metric Counters Bar**:
     - Horizontal sequence of count badges:
       - *Phiên hiển thị* (Blue badge)
       - *Tổng số phiên* (Cyan badge)
       - *Nháp* (Gray badge)
       - *Chờ duyệt* (Orange badge)
       - *Đã duyệt* (Green badge)
       - *Đã gửi trường* (Blue badge)
       - *Đã thanh toán* (Green badge)
     - Right utilities: `[+] Tạo mới` button, Refresh, Density, Settings.
  3. **Session Master Table**:
     - Columns:
       - Expand Toggle for rows containing child truy thu sessions.
       - "Mã phiên": Link in primary blue (e.g. `REC-B7A17279166`), subtext "N chi nhánh".
       - "Tên đơn vị": Unit name in bold, subtext code pair.
       - "Đơn vị đối soát": Cyan pill badge (`Từng trường` or `Theo nhóm`).
       - "Kỳ đối soát": Bold period name (e.g. `Kỳ 1`), subtext date range.
       - "Tổng phải thu": Bold formatted currency (e.g. `750.000đ`) or secondary tag `Đã nhả kết quả`.
       - "Trạng thái": Status badge (Gray for `Nháp`, Green for `Đã duyệt`, Red for `Đã hủy`, etc.).
       - "Thao tác": State-driven 3-dots action dropdown menu.

### SCR-05: Session Creation Wizard Modal (`src/components/sm2/CreateSessionModal.jsx`)
- **Route**: Center Modal dialog triggered from SCR-04 (`+ Tạo mới`)
- **Visual Match**: `docs_legacy/screenshots/sm2-tao-moi-modal-2-tung-truong.jpeg` and `sm2-tao-moi-modal-3-preview.jpeg`
- **Wizard Steps**:
  - **Step 1 (Chọn nhóm trường)**: Group dropdown selector. Displays informational box with Settlement Scope, Active Branch List, and Calculation Thresholds. When scope is `Theo từng trường`, renders a checkbox list of branches with `Chọn tất cả` header.
  - **Step 2 (Chọn kỳ đối soát)**: Period dropdown showing period dates and tagging existing cycles with `Đã có phiên`. Cut-off date picker (defaults to today). Checkbox for retroactive settlement before period start.
  - **Step 3 (Xem trước số liệu)**:
    - Button `Xem số liệu` / `Cập nhật số liệu` with scanning animation.
    - Zero-fee blocker alert: Amber box with icon `(!)` and text `MSG-01: Không thể tạo phiên có tổng phí 0đ - [Tên chi nhánh] chưa phát sinh phí...` (locks submit button).
    - Success preview: Blue info box `(i) Đã quét N học sinh` and 4 metric cards: *Học sinh thu phí*, *Phí kỳ này*, *Truy thu*, *Tổng phải thu*.
  - Modal Footer: "Hủy" button and "Tạo phiên" button (solid blue, enabled only when valid).

### SCR-06: Session Detail View (`src/pages/SM2SessionDetail.jsx`)
- **Route**: `/reconciliation/sessions/:sessionId`
- **Visual Match**: `docs_legacy/screenshots/sm2-phien-chi-tiet-nhap.jpeg`, `sm2-phien-chi-tiet-da-duyet.jpeg`, `sm2-phien-chi-tiet-expand-dich-vu.jpeg`, `sm2-phien-cau-hinh-da-khoa.jpeg`
- **Layout & Structure**:
  - Header: Back button arrow + Title `<- Phiên đối soát [Mã phiên]`.
  - Master Info Card: Document icon, Session title, Status badge. 6-cell metadata grid displaying Session Code (with copy icon), Period name, Cut-off date, Settlement scope badge, Service date range, and Recipient emails.
  - 4 Summary KPI Cards:
    - Card 1: *Học sinh tính phí* (Large count, subtext "Một học sinh dùng nhiều dịch vụ tính nhiều lượt").
    - Card 2: *Phí kỳ này* (Bold currency in black).
    - Card 3: *Truy thu kỳ trước* (Bold currency in red if > 0).
    - Card 4: *Tổng phải thu* (Bold currency in primary blue).
  - Navigation Tabs & Action Bar:
    - Left: Tabs "Chi tiết phí" and "Cấu hình đã khóa" with active blue indicator.
    - Right: Dynamic action buttons based on session status:
      - In `Nháp`: "Tính lại các nhánh" (calculator icon), "Gửi duyệt" (blue), "Hủy phiên" (red outline).
      - In `Đã duyệt` / `Đã gửi trường` / `Đã thanh toán`: "Xuất dữ liệu" (spreadsheet icon), "Tải biên bản" (download icon), "Gửi biên bản" (mail icon).
  - Tab 1 View (Chi tiết phí): Table of branches with expander. Expanded row shows service breakdown: *Dịch vụ*, *Học sinh tính phí*, *Phí kỳ này*, *Truy thu kỳ trước*, *Thành tiền*.
  - Tab 2 View (Cấu hình đã khóa): Read-only presentation of the frozen pricing configuration snapshotted at creation time.
