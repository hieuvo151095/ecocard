#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to generate standard Confluence-ready PRD Microsoft Word (.docx) document
for Module M6: Phân Hệ Đối Soát & Quyết Toán Dịch Vụ Trường Học (ECO Card Portal)
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_cell_margins(cell, top=120, bottom=120, left=140, right=140):
    """Sets padding inside table cell in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
    """Sets clean borders for table (standard Confluence look)."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def format_cell_text(cell, text_list, is_header=False, bold_first=False, align=WD_ALIGN_PARAGRAPH.LEFT):
    """Populates cell with multiple paragraphs without <br> tags."""
    p = cell.paragraphs[0]
    p.text = ""
    p.alignment = align
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    
    if not text_list:
        return
        
    for idx, item in enumerate(text_list):
        if idx > 0:
            p = cell.add_paragraph()
            p.alignment = align
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
        
        run = p.add_run(item)
        run.font.name = 'Calibri'
        run.font.size = Pt(9.5 if not is_header else 10)
        if is_header or (bold_first and idx == 0):
            run.bold = True
        if is_header:
            run.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

def main():
    doc = docx.Document()
    
    # Page setup - Margins 0.8 inches
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(10.5)
    style_normal.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
    style_normal.paragraph_format.line_spacing = 1.2
    style_normal.paragraph_format.space_after = Pt(5)

    # Document Header Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(8)
    run_title = title_p.add_run("[M6] Phân Hệ Đối Soát & Quyết Toán Dịch Vụ Trường Học")
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(22)
    run_title.bold = True
    run_title.font.color.rgb = RGBColor(0x00, 0x70, 0xCE)

    # Subtitle / Platform
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Tài Liệu Đặc Tả Yêu Cầu Sản Phẩm (PRD Specification) — Cổng Vận Hành Thẻ ECO Card Portal")
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)
    run_sub.italic = True

    # ==========================================
    # BẢNG 1: THÔNG TIN ĐỊNH DANH TÀI LIỆU
    # ==========================================
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    tbl_info = doc.add_table(rows=5, cols=2)
    tbl_info.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_info)
    
    meta_data = [
        ("Priority", "MUST HAVE"),
        ("Document Status", "APPROVED – READY FOR IMPLEMENTATION"),
        ("Document Owner", "diem.vo@finviet.com.vn (Senior BA / Product Owner)"),
        ("Created date", "09 Jul 2026 (Hoàn thiện nghiệm thu: 12 Oct 2026)"),
        ("Reviewer", "hieu.vo1@finviet.com.vn (Product Lead / Project Sponsor)")
    ]
    
    col_widths_meta = [Inches(1.8), Inches(5.0)]
    for row_idx, (label, val) in enumerate(meta_data):
        row = tbl_info.rows[row_idx]
        for col_idx, width in enumerate(col_widths_meta):
            row.cells[col_idx].width = width
            set_cell_margins(row.cells[col_idx], top=80, bottom=80, left=120, right=120)
        
        set_cell_background(row.cells[0], "F8FAFC")
        format_cell_text(row.cells[0], [label], is_header=True)
        format_cell_text(row.cells[1], [val])

    # ==========================================
    # BẢNG 2: LỊCH SỬ TÀI LIỆU (VERSION HISTORY)
    # ==========================================
    p_hist = doc.add_paragraph()
    p_hist.paragraph_format.space_before = Pt(14)
    p_hist.paragraph_format.space_after = Pt(4)
    run_hist = p_hist.add_run("Lịch sử tài liệu")
    run_hist.bold = True
    run_hist.font.size = Pt(11)
    run_hist.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)

    tbl_hist = doc.add_table(rows=3, cols=5)
    tbl_hist.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_hist)

    hist_headers = ["Phiên bản", "Mức thay đổi", "Nội dung", "Ngày", "Phụ trách tài liệu"]
    hist_widths = [Inches(0.9), Inches(1.0), Inches(2.9), Inches(1.0), Inches(1.4)]
    
    for col_idx, text in enumerate(hist_headers):
        cell = tbl_hist.rows[0].cells[col_idx]
        cell.width = hist_widths[col_idx]
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        set_cell_background(cell, "F1F5F9")
        format_cell_text(cell, [text], is_header=True)
        
    hist_rows = [
        ("1.0", "All", "Khởi tạo tài liệu đặc tả M6 Đối soát (SM1 Cấu hình & SM2 Phiên đối soát)", "09 Jul 2026", "diem.vo@finviet.com.vn"),
        ("2.0", "Major", "Cập nhật hoàn thiện Biểu phí Đa chu kỳ Năm/Tháng, Ngưỡng thu phí BR06, Làm tròn ngày dư BR07, Quản trị Mật khẩu File, Kiểm toán Log Song song & Bộ chốt an toàn 0đ MSG-01", "12 Oct 2026", "diem.vo@finviet.com.vn")
    ]
    
    for r_idx, r_data in enumerate(hist_rows):
        row = tbl_hist.rows[r_idx + 1]
        for c_idx, val in enumerate(r_data):
            cell = row.cells[c_idx]
            cell.width = hist_widths[c_idx]
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            format_cell_text(cell, [val])

    # ==========================================
    # MỤC LỤC
    # ==========================================
    p_toc = doc.add_paragraph()
    p_toc.paragraph_format.space_before = Pt(16)
    p_toc.paragraph_format.space_after = Pt(4)
    run_toc_title = p_toc.add_run("Mục lục")
    run_toc_title.bold = True
    run_toc_title.font.size = Pt(12)
    run_toc_title.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    toc_items = [
        "1. Thông tin tổng quan",
        "    1.1 Giới thiệu chung",
        "    1.2 Mục tiêu",
        "    1.3 Phạm vi",
        "    1.4 Tài liệu tham khảo",
        "2. Tổng quan nghiệp vụ & Quy tắc cốt lõi",
        "    2.1 Mô hình hóa nghiệp vụ",
        "    2.2 Mô tả chi tiết các bước nghiệp vụ & Quy tắc cốt lõi",
        "3. Đặc tả tính năng & Use cases",
        "    3.1 Phân rã chức năng",
        "    3.2 Đặc tả Use case (UC-01 đến UC-08)",
        "4. Giao diện người dùng (Screen Specifications)",
        "    4.1 Mô tả màn hình",
        "5. Tiêu chí nghiệm thu (Acceptance Criteria – AC)"
    ]
    for item in toc_items:
        p_item = doc.add_paragraph()
        p_item.paragraph_format.space_before = Pt(1)
        p_item.paragraph_format.space_after = Pt(2)
        p_item.paragraph_format.line_spacing = 1.15
        r = p_item.add_run(item)
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0x37, 0x41, 0x51)

    # Helper function for adding styled Headings
    def add_sec_heading(title, level):
        h = doc.add_paragraph()
        if level == 1:
            h.paragraph_format.space_before = Pt(22)
            h.paragraph_format.space_after = Pt(6)
            r = h.add_run(title)
            r.bold = True
            r.font.size = Pt(15)
            r.font.color.rgb = RGBColor(0x00, 0x70, 0xCE)
        elif level == 2:
            h.paragraph_format.space_before = Pt(14)
            h.paragraph_format.space_after = Pt(4)
            r = h.add_run(title)
            r.bold = True
            r.font.size = Pt(12.5)
            r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
        elif level == 3:
            h.paragraph_format.space_before = Pt(10)
            h.paragraph_format.space_after = Pt(2)
            r = h.add_run(title)
            r.bold = True
            r.font.size = Pt(11)
            r.font.color.rgb = RGBColor(0x37, 0x41, 0x51)
        return h

    # ==========================================
    # PHẦN 1: THÔNG TIN TỔNG QUAN
    # ==========================================
    add_sec_heading("1. Thông tin tổng quan", 1)
    
    add_sec_heading("1.1 Giới thiệu chung", 2)
    p = doc.add_paragraph()
    p.add_run("Trong hệ sinh thái chuyển đổi số giáo dục và thẻ học sinh thông minh của FINVIET Technology, dịch vụ thẻ ECO và các giải pháp tiện ích trường học (Điểm danh thông minh, Camera AI, Căn tin học đường, Phần mềm quản lý nhà trường) được triển khai trên diện rộng tại hàng trăm cơ sở giáo dục trên toàn quốc.")
    
    p = doc.add_paragraph()
    p.add_run("Trước khi phân hệ M6 được xây dựng, quy trình thanh quyết toán và đối soát học phí/dịch vụ giữa Finviet và các trường học đối tác gặp nhiều thách thức lớn:")
    
    bullet_items = [
        "Mô hình tổ chức trường học phức tạp: Khách hàng gồm các Tập đoàn giáo dục, Hệ thống trường liên cấp (K-12) với nhiều chi nhánh/cơ sở trực thuộc. Mỗi cơ sở có sĩ số, danh mục dịch vụ đăng ký và đơn giá theo hợp đồng độc lập.",
        "Quy định chu kỳ thu phí linh hoạt: Một số trường thu trọn gói theo Năm học (1 kỳ duy nhất), trong khi nhiều trường thu định kỳ theo Kỳ học / Tháng (từ 2 đến 10 kỳ/năm).",
        "Biến động học sinh liên tục: Học sinh nhập học muộn, chuyển lớp, chuyển trường đòi hỏi thuật toán tính phí căn cứ chính xác trên tổng số ngày hoạt động thực tế, đối chiếu với ngưỡng thu tối thiểu và quy tắc làm tròn ngày dư.",
        "Rủi ro nghiệp vụ thủ công: Rủi ro thay đổi biểu phí quá khứ khi ký phụ lục mới, nguy cơ phát hành hóa đơn rỗng (0 VNĐ), và thiếu công cụ kiểm toán trực quan để giải trình chi tiết từng ngày quẹt thẻ."
    ]
    for b in bullet_items:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.space_before = Pt(1)
        p_b.paragraph_format.space_after = Pt(2)
        p_b.add_run(b)

    p = doc.add_paragraph()
    p.add_run("Phân Hệ Đối Soát & Quyết Toán (Module M6) gồm 2 phân hệ trung tâm:")
    
    m_items = [
        "SM1 – Cấu hình đối soát: Quản trị thông tin pháp nhân nhóm trường, quản lý chi nhánh phân cấp, cấu hình đơn vị đối soát (Theo nhóm trường vs Theo từng trường), sinh lịch kỳ tự động, biểu phí đa chu kỳ (Học phí theo năm vs Học phí theo tháng), và quản lý mật khẩu file đối soát bảo mật.",
        "SM2 – Phiên đối soát: Quản trị vòng đời phiên (Nháp → Chờ duyệt → Đã duyệt → Đã gửi trường → Đã thanh toán), tự động quét học sinh và tính phí theo chuẩn 30 ngày/tháng, kích hoạt bộ chốt an toàn ngăn chặn phiên 0 VNĐ (MSG-01), đóng băng Snapshot bất biến (ADR-M6-001), và quyết toán truy thu con (Arrears)."
    ]
    for m in m_items:
        p_m = doc.add_paragraph(style='List Bullet')
        p_m.paragraph_format.space_before = Pt(1)
        p_m.paragraph_format.space_after = Pt(2)
        p_m.add_run(m)

    add_sec_heading("1.2 Mục tiêu", 2)
    objs = [
        "Tự động hóa 100% công tác tính toán và chốt công nợ dịch vụ trường học định kỳ.",
        "Bảo đảm tính toàn vẹn và bất biến của dữ liệu quá khứ nhờ cơ chế đóng băng Snapshot JSON (ADR-M6-001). Mọi thay đổi đơn giá ở SM1 trong tương lai không làm sai lệch số liệu các kỳ đã quyết toán.",
        "Ngăn ngừa tuyệt đối phát hành chứng từ rỗng qua Bộ chốt an toàn 0 VNĐ (MSG-01 / ADR-M6-002).",
        "Minh bạch hóa 100% dữ liệu kiểm toán với giao diện So sánh Log song song (Side-by-Side Audit), chỉ rõ nguyên nhân lệch ngày, cuộn mượt đồng bộ và xuất báo cáo Excel 2 Sheet.",
        "Rút ngắn thời gian chốt biên bản đối soát song phương từ 2-3 tuần xuống dưới 15 phút làm việc."
    ]
    for o in objs:
        p_o = doc.add_paragraph(style='List Bullet')
        p_o.paragraph_format.space_before = Pt(1)
        p_o.paragraph_format.space_after = Pt(2)
        p_o.add_run(o)

    add_sec_heading("1.3 Phạm vi", 2)
    tbl_scope = doc.add_table(rows=6, cols=2)
    tbl_scope.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_scope)
    
    col_w_scope = [Inches(3.4), Inches(3.4)]
    set_cell_background(tbl_scope.rows[0].cells[0], "F1F5F9")
    set_cell_background(tbl_scope.rows[0].cells[1], "F1F5F9")
    format_cell_text(tbl_scope.rows[0].cells[0], ["Trong phạm vi (In-Scope)"], is_header=True)
    format_cell_text(tbl_scope.rows[0].cells[1], ["Ngoài phạm vi (Out-of-Scope)"], is_header=True)
    
    scope_data = [
        ("Quản lý danh sách, tìm kiếm, lọc nhóm trường và chi nhánh phân cấp.", "Quản lý học sinh, cấp phát thẻ vật lý (thuộc phân hệ Quản trị Trường học)."),
        ("Thiết lập đơn vị đối soát, lịch kỳ theo năm/kỳ, biểu phí đ/HS/năm và đ/HS/tháng.", "Tích hợp cổng thanh toán trực tuyến Core Banking của ngân hàng đối tác."),
        ("Quản lý cấp phát mật khẩu file đối soát, live preview email và pop-up xác nhận.", "Phần cứng đầu đọc thẻ, điểm danh nhận diện khuôn mặt Camera AI tại cổng trường."),
        ("Tạo phiên đối soát bằng Wizard 3 bước, tự động quét học sinh và chốt chặn 0đ.", "Xóa cứng (hard delete) dữ liệu tài chính lịch sử (bị cấm bởi chính sách kiểm toán)."),
        ("Kiểm toán học sinh Side-by-Side, so sánh log quẹt thẻ, cuộn đồng bộ, xuất Excel 2 Sheet.", "Hạch toán kế toán chi tiết nội bộ sâu bên trong hệ thống ERP của từng trường.")
    ]
    for r_idx, (inc, out) in enumerate(scope_data):
        row = tbl_scope.rows[r_idx + 1]
        row.cells[0].width = col_w_scope[0]
        row.cells[1].width = col_w_scope[1]
        set_cell_margins(row.cells[0], top=80, bottom=80, left=100, right=100)
        set_cell_margins(row.cells[1], top=80, bottom=80, left=100, right=100)
        format_cell_text(row.cells[0], [inc])
        format_cell_text(row.cells[1], [out])

    add_sec_heading("1.4 Tài liệu tham khảo", 2)
    tbl_ref = doc.add_table(rows=6, cols=2)
    tbl_ref.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ref)
    
    set_cell_background(tbl_ref.rows[0].cells[0], "F1F5F9")
    set_cell_background(tbl_ref.rows[0].cells[1], "F1F5F9")
    format_cell_text(tbl_ref.rows[0].cells[0], ["Loại tài liệu"], is_header=True)
    format_cell_text(tbl_ref.rows[0].cells[1], ["Đường dẫn / Tên tài liệu"], is_header=True)
    
    ref_data = [
        ("Tài liệu PRD tiếng Việt nguyên bản", "docs/PRD_Doi_Soat_Module_M6_VI.md"),
        ("Tài liệu Cấu hình đối soát SM1", "docs_legacy/m6-sm1-cau-hinh-doi-soat.md"),
        ("Tài liệu Phiên đối soát SM2", "docs_legacy/m6-sm2-phien-doi-soat.md"),
        ("Sổ cái Kiến trúc & Quyết định kỹ thuật", "docs/decisions.md (ADR-M6-001, ADR-M6-002, ADR-M6-003)"),
        ("Mã nguồn & Prototype trực tiếp", "http://localhost:5173/ (Vite React 18, TailwindCSS)")
    ]
    for r_idx, (t, pth) in enumerate(ref_data):
        row = tbl_ref.rows[r_idx + 1]
        row.cells[0].width = Inches(2.5)
        row.cells[1].width = Inches(4.3)
        set_cell_margins(row.cells[0], top=80, bottom=80, left=100, right=100)
        set_cell_margins(row.cells[1], top=80, bottom=80, left=100, right=100)
        format_cell_text(row.cells[0], [t], bold_first=True)
        format_cell_text(row.cells[1], [pth])

    # ==========================================
    # PHẦN 2: TỔNG QUAN NGHIỆP VỤ & QUY TẮC CỐT LÕI
    # ==========================================
    add_sec_heading("2. Tổng quan nghiệp vụ & Quy tắc cốt lõi", 1)
    
    add_sec_heading("2.1 Mô hình hóa nghiệp vụ (Luồng liên thông đa tác nhân – RECONCILE USER SCHOOL)", 2)
    p = doc.add_paragraph()
    p.add_run("Phân hệ Đối soát (Module M6) đóng vai trò là mắt xích tài chính cốt lõi trong toàn bộ vòng đời hợp tác dịch vụ giữa FINVIET và Đối tác Nhà trường. Toàn bộ quy trình đối soát và quyết toán người dùng/học sinh (RECONCILE USER SCHOOL) được mô hình hóa theo chuẩn BPMN Swimlane với sự tham gia phối hợp xuyên suốt của 3 tác nhân (Làn bơi – Swimlanes):")
    
    actor_bullets = [
        "1. Làn Vận hành FV (Finviet Operations / Ops Admin): Chịu trách nhiệm ký kết hợp đồng dịch vụ, khởi tạo hồ sơ pháp nhân nhóm trường và các chi nhánh cơ sở ban đầu.",
        "2. Làn Trường học (School Partner / Đối tác Nhà trường): Chịu trách nhiệm tạo Master Data học sinh, giáo viên, lớp học; triển khai đưa dịch vụ vào sử dụng; liên tục cập nhật biến động trạng thái học sinh (Active / Inactive) qua cổng phân nhánh song song (+); đối chiếu bảng kê và thực hiện thanh toán chi phí dịch vụ.",
        "3. Làn ECO Card (Hệ thống ECO Card Portal & Kế toán Finviet): Tự động đồng bộ Master Data; cấu hình danh mục dịch vụ và ma trận biểu phí; định kỳ tạo phiên đối soát (SM2) kèm bộ chốt an toàn 0 VNĐ (MSG-01); đóng băng Snapshot bất biến (ADR-M6-001); gửi mail biên bản kèm mật khẩu bảo mật; ghi nhận thanh toán và hoàn tất phiên đối soát."
    ]
    for ab in actor_bullets:
        p_ab = doc.add_paragraph(style='List Bullet')
        p_ab.paragraph_format.space_before = Pt(1)
        p_ab.paragraph_format.space_after = Pt(2)
        p_ab.add_run(ab)

    # Embed BPMN Diagram Image
    p_img_bpmn = doc.add_paragraph()
    p_img_bpmn.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img_bpmn.paragraph_format.space_before = Pt(8)
    p_img_bpmn.paragraph_format.space_after = Pt(4)
    bpmn_path = "docs/images/flow_reconcile_user_school.png"
    if os.path.exists(bpmn_path):
        p_img_bpmn.add_run().add_picture(bpmn_path, width=Inches(6.8))
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(8)
        r_cap = p_cap.add_run("Sơ đồ luồng nghiệp vụ đối soát liên thông đa tác nhân (BPMN Swimlane: RECONCILE USER SCHOOL)")
        r_cap.font.size = Pt(9)
        r_cap.italic = True
        r_cap.font.color.rgb = RGBColor(0x6B, 0x72, 0x80)

    # 13-step Swimlane Table
    p_tbl_lbl = doc.add_paragraph()
    p_tbl_lbl.paragraph_format.space_before = Pt(6)
    p_tbl_lbl.paragraph_format.space_after = Pt(3)
    r_tl = p_tbl_lbl.add_run("Bảng phân tích chi tiết 13 bước trong luồng RECONCILE USER SCHOOL:")
    r_tl.bold = True
    r_tl.font.size = Pt(10)

    flow_headers = ["Bước", "Tác nhân (Swimlane)", "Hành động / Nghiệp vụ", "Mô tả chi tiết luồng xử lý", "Dữ liệu & Chứng từ"]
    flow_widths = [Inches(0.6), Inches(1.3), Inches(1.6), Inches(2.2), Inches(1.1)]

    flow_matrix = [
        ("01", "Vận hành FV", "Ký hợp đồng dịch vụ", "Finviet và Nhà trường hoàn tất đàm phán, thống nhất điều khoản và ký hợp đồng cung cấp dịch vụ giải pháp thẻ ECO và các tiện ích số trường học.", "Hợp đồng dịch vụ, Phụ lục biểu phí"),
        ("02", "Vận hành FV", "Tạo trường & các chi nhánh của trường", "Chuyên viên Vận hành khởi tạo hồ sơ pháp nhân nhóm trường (Mã nhóm duy nhất, bất biến) và các chi nhánh cơ sở trực thuộc trên hệ thống Cổng vận hành.", "Tạo SchoolGroup & SchoolBranch"),
        ("03", "Trường học", "Tạo master data trường học (HS, GV, Lớp...)", "Ban giám hiệu hoặc Quản trị viên trường học thiết lập danh mục lớp học, hồ sơ học sinh, giáo viên và phân lớp giảng dạy trên hệ thống quản lý trường.", "Master Data học sinh, giáo viên, lớp"),
        ("04", "ECO Card", "Đồng bộ trường học và Học sinh (Lớp, GV...)", "Hệ thống ECO Card Portal tự động kết nối và đồng bộ hai chiều toàn bộ danh mục trường, lớp học, hồ sơ học sinh và giáo viên vào cơ sở dữ liệu đối soát.", "Dữ liệu đồng bộ (Sync Database)"),
        ("05", "ECO Card", "Hiển thị danh sách & trạng thái người dùng", "Hệ thống hiển thị danh bạ người dùng, mã định danh thẻ UID, trạng thái tài khoản và thông tin lớp học phục vụ theo dõi vận hành.", "Danh sách người dùng & Thẻ học sinh"),
        ("06", "ECO Card", "Cấu hình dịch vụ trường học", "Chuyên viên thiết lập danh mục dịch vụ số áp dụng cho từng chi nhánh: Phần mềm quản lý nhà trường, Camera AI, Thẻ học sinh, Căn tin học đường.", "Danh mục dịch vụ kích hoạt"),
        ("07", "ECO Card", "Cấu hình biểu phí dịch vụ (SM1)", "Thiết lập đơn vị đối soát (GROUP vs BRANCH), chu kỳ (Năm vs Kỳ), ma trận đơn giá (đ/HS/năm hoặc đ/HS/tháng), lịch kỳ và ngưỡng thu phí (BR01 – BR08).", "Cấu hình biểu phí hoàn chỉnh (SM1)"),
        ("08", "Trường học", "Triển khai & sử dụng dịch vụ", "Nhà trường đưa dịch vụ vào vận hành thực tế. Học sinh quẹt thẻ điểm danh thông minh, ăn bán trú, vào thư viện và sử dụng tiện ích hàng ngày.", "Nhật ký quẹt thẻ thực tế (Log)"),
        ("08+", "Trường học", "Cập nhật thông tin HS (Active / Inactive)", "[Cổng phân nhánh song song +]: Trong quá trình sử dụng, nhà trường liên tục cập nhật trạng thái học sinh chuyển trường, nghỉ ốm, bảo lưu (Inactive) hoặc nhập học mới (Active). Mốc chốt số liệu được ghi nhận theo thời gian thực.", "Biến động trạng thái Active / Inactive"),
        ("09", "ECO Card", "KT tạo phiên đối soát thu phí dịch vụ (SM2)", "Định kỳ, Kế toán Finviet khởi tạo phiên đối soát bằng Wizard 3 bước: Chọn nhóm/chi nhánh, chọn kỳ, chốt ngày quét số liệu. Động cơ tính phí chuẩn 30 ngày/tháng, kiểm tra ngưỡng (BR06), làm tròn ngày dư (BR07). Bộ chốt an toàn khóa tạo phiên nếu tổng phí = 0đ (MSG-01 / BR10). Đóng băng Snapshot bất biến (ADR-M6-001).", "Phiên đối soát (DRAFT) & Snapshot JSON"),
        ("10", "ECO Card", "KT kiểm tra, điều chỉnh & gửi mail biên bản đối soát", "Kế toán kiểm tra số liệu, kiểm toán đối chiếu Log song song (Side-by-Side Audit), gửi duyệt cấp quản lý. Sau khi duyệt, hệ thống phát hành email biên bản đối soát kèm mật khẩu file bảo mật đến trường.", "Biên bản đối soát & Mật khẩu file"),
        ("11", "Trường học", "Trường đối chiếu & thanh toán phí dịch vụ cho FV", "Kế toán nhà trường mở file đối soát bằng mật khẩu, đối chiếu số ngày hoạt động thực tế của từng học sinh và thực hiện chuyển khoản thanh toán phí dịch vụ cho Finviet.", "Biên bản ký duyệt & Ủy nhiệm chi (UNC)"),
        ("12", "ECO Card", "FV ghi nhận & cập nhật phiên ĐÃ HOÀN TẤT đối soát", "Kế toán Finviet kiểm tra sao kê ngân hàng, xác nhận tiền về và cập nhật trạng thái phiên đối soát sang ĐÃ THANH TOÁN (PAID). Mở quyền tạo phiên truy thu con nếu phát sinh học sinh mới.", "Cập nhật trạng thái PAID"),
        ("13", "ECO Card", "Hoàn tất phiên đối soát", "Phiên đối soát chính thức khép lại vòng đời (End Event), toàn bộ chứng từ được lưu trữ an toàn phục vụ thanh tra tài chính, hoàn tất chu kỳ đối soát.", "Hồ sơ quyết toán lưu trữ hoàn tất")
    ]

    tbl_flow = doc.add_table(rows=1 + len(flow_matrix), cols=5)
    tbl_flow.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_flow)

    for c_i, h_txt in enumerate(flow_headers):
        cell = tbl_flow.rows[0].cells[c_i]
        cell.width = flow_widths[c_i]
        set_cell_margins(cell, top=80, bottom=80, left=60, right=60)
        set_cell_background(cell, "F1F5F9")
        format_cell_text(cell, [h_txt], is_header=True)

    for r_i, (step_num, actor_name, act_title, act_desc, act_data) in enumerate(flow_matrix):
        row = tbl_flow.rows[r_i + 1]
        for c_i, w in enumerate(flow_widths):
            row.cells[c_i].width = w
            set_cell_margins(row.cells[c_i], top=60, bottom=60, left=60, right=60)
            
        format_cell_text(row.cells[0], [step_num], align=WD_ALIGN_PARAGRAPH.CENTER)
        format_cell_text(row.cells[1], [actor_name], bold_first=True)
        format_cell_text(row.cells[2], [act_title], bold_first=True)
        format_cell_text(row.cells[3], [act_desc])
        format_cell_text(row.cells[4], [act_data])

    add_sec_heading("2.2 Mô tả chi tiết các bước nghiệp vụ & Quy tắc cốt lõi", 2)
    p = doc.add_paragraph()
    p.add_run("Hệ thống tuân thủ 12 quy tắc nghiệp vụ cốt lõi (Core Business Rules – BR01 đến BR12):")

    rules = [
        ("BR01: Cấu trúc phân cấp Nhóm trường & Chi nhánh", [
            "• Pháp nhân Nhóm trường (SchoolGroup): Khóa định danh duy nhất (Mã nhóm trường code) tự động viết hoa (ví dụ: HIEUTEST, VINASCHOOL). Mã nhóm bị khóa vĩnh viễn không thể chỉnh sửa sau khi tạo mới.",
            "• Chi nhánh trường (SchoolBranch): Quản lý cơ sở trực thuộc với mã trường riêng, sĩ số học sinh đăng ký, danh mục dịch vụ áp dụng và đơn giá độc lập theo từng kỳ đối soát.",
            "• Quản trị trạng thái độc lập (Switch): Nhóm trường và từng chi nhánh sở hữu nút gạt Bật/Tắt hoạt động độc lập."
        ]),
        ("BR02: Đơn vị đối soát & Cơ chế trường Email nhận biên bản động", [
            "• Theo nhóm trường (GROUP): Gộp toàn bộ chi nhánh thành 1 biên bản đối soát và 1 khoản thanh toán chung. Tại GroupDrawer, trường Email nhận biên bản nhóm bắt buộc nhập (tối đa 3 email). Tại BranchDrawer, trường Email nhận biên bản bị khóa mờ (disabled), tự động kế thừa email từ nhóm kèm huy hiệu đồng bộ.",
            "• Theo từng trường (BRANCH): Tạo độc lập từng phiên đối soát riêng cho mỗi chi nhánh. Tại GroupDrawer, trường Email nhóm tự động ẩn hoàn toàn. Tại BranchDrawer, trường Email nhận biên bản mở cho phép nhập tự do tối đa 3 email riêng của cơ sở."
        ]),
        ("BR03: Chu kỳ đối soát & Lịch sinh kỳ tự động", [
            "• Đối soát theo năm (YEARLY): Áp dụng quyết toán trọn gói 1 năm học. Số kỳ đối soát cố định là 1 (trường nhập bị khóa disabled). Nút Sinh lịch kỳ tạo duy nhất 1 kỳ từ 01/09/YYYY đến 31/05/YYYY+1.",
            "• Đối soát theo kỳ (PERIODIC): Áp dụng quyết toán nhiều đợt trong năm (từ 2 đến 12 kỳ). Nút Sinh lịch kỳ tự động chia đều khoảng thời gian năm học.",
            "• Nối tiếp ngày liên tục (Continuous Cascading Dates): Khi sửa trường Đến ngày của Kỳ i thành ngày D, trường Từ ngày của Kỳ i+1 tự động cập nhật ngay lập tức thành D + 1 ngày."
        ]),
        ("BR04: Biểu phí đa chu kỳ theo dịch vụ & Nút Điều chỉnh ngay", [
            "• Tab Học phí theo năm: Đơn giá trọn gói năm học. Hậu tố nhãn đơn vị: đ/học sinh/ năm.",
            "• Tab Học phí theo tháng: Đơn giá chi tiết từng kỳ. Hậu tố nhãn đơn vị: đ/học sinh/ tháng.",
            "• Tự động mở đúng tab mặc định dựa trên chu kỳ nhóm trường (Đối soát theo năm → mở Tab Năm; Đối soát theo kỳ → mở Tab Tháng).",
            "• Khi nhấp sang Tab không áp dụng: Ẩn toàn bộ form giá, hiển thị khung cảnh báo màu vàng và nút bấm Điều chỉnh ngay (khi bấm lập tức mở ngăn kéo nhóm trường để chuyển đổi chu kỳ)."
        ]),
        ("BR05: Cơ chế Quản trị Mật khẩu File Đối Soát Bảo Mật", [
            "• Trạng thái menu: Nhóm trường chưa từng gửi mật khẩu hiển thị Gửi mật khẩu. Sau khi gửi lần đầu thành công, hành động vĩnh viễn chuyển thành Cập nhật mật khẩu.",
            "• Quy tắc mật khẩu: 2 trường Nhập mật khẩu mới và Xác nhận mật khẩu, không áp đặt bất kỳ ràng buộc định dạng nào, người dùng tự do thiết lập tùy ý. Có icon mắt ẩn/hiện.",
            "• Live Preview email: Hiển thị To (email trường), Cc (cố định: edu@finviet.com.vn; phongketoan@finviet.com.vn), tiêu đề [FINVIET] Mật khẩu file đối soát.",
            "• Pop-up xác nhận lồng trong Right-Sheet: Modal xác nhận hiển thị ở lớp trên cùng ngay giữa Right-Sheet (absolute inset-0 z-50), không bị lệch ra ngoài."
        ]),
        ("BR06: Ngưỡng tính phí theo số ngày hoạt động (Chuẩn 30 ngày/tháng)", [
            "• Quy chuẩn tháng: Hệ thống quy ước tiêu chuẩn 1 tháng = 30 ngày hoạt động.",
            "• Điều kiện thu phí: Căn cứ tham số Ngưỡng thu (tháng) M_threshold. Mốc ngày bắt đầu tính phí: D_min = M_threshold * 30 + 1 ngày.",
            "• Nếu số ngày hoạt động ≤ M_threshold * 30 ngày: Phân loại Không tính phí, số tháng = 0, thành tiền = 0đ (huy hiệu xám).",
            "• Nếu số ngày hoạt động ≥ D_min: Phân loại Có tính phí (huy hiệu xanh lá), chuyển sang quy tắc làm tròn ngày dư."
        ]),
        ("BR07: Quy tắc làm tròn ngày dư thành tháng (Surplus Day Threshold)", [
            "• Tham số Ngày dư làm tròn lên 1 tháng D_surplus (mặc định 10 hoặc 15 ngày).",
            "• Số tháng nguyên M_base = số ngày chia nguyên cho 30. Số ngày dư D_rem = số ngày chia dư cho 30.",
            "• Nếu D_rem ≥ D_surplus: Làm tròn cộng thêm 1 tháng (M_billed = M_base + 1).",
            "• Nếu D_rem < D_surplus: Giữ nguyên số tháng nguyên (M_billed = M_base)."
        ]),
        ("BR08: Hình thức xử lý truy thu & Quyết toán số dư", [
            "• Option 1 – Gồm truy thu ngược đợt sau (ROLL_FORWARD): Phí chưa thu của học sinh phát sinh trước kỳ hiện tại được dồn quyết toán vào kỳ kế tiếp.",
            "• Option 2 – Truy thu liền vào tháng tiếp theo (IMMEDIATE_T1): Khoản phát sinh chưa thu của tháng T được hạch toán ngay vào kỳ đối soát tháng T+1.",
            "• Không truy thu (NONE): Chỉ chốt phí phát sinh trong phạm vi từ ngày – đến ngày của kỳ đó."
        ]),
        ("BR09: Tính Bất Biến Của Dữ Liệu Phiên Đối Soát (ADR-M6-001)", [
            "• Khi tạo phiên thành công, toàn bộ biểu phí, dịch vụ, ngưỡng thu được đóng băng vào Snapshot JSON bất biến.",
            "• Mọi điều chỉnh biểu phí ở SM1 sau ngày tạo phiên không bao giờ làm thay đổi số liệu tài chính của phiên đã tạo. Tab Cấu hình đã khóa hiển thị trung thực biểu phí gốc."
        ]),
        ("BR10: Bộ Chốt An Toàn Ngăn Chặn Phiên 0 VNĐ (MSG-01 / ADR-M6-002)", [
            "• Hệ thống nghiêm cấm tạo phiên có tổng tiền bằng 0 VNĐ hoặc có chi nhánh trong lô đối soát không phát sinh chi phí.",
            "• Trong Bước 3 Wizard, nếu có chi nhánh tổng phí = 0đ: Khóa nút Tạo phiên (disabled) và hiển thị thông báo lỗi MSG-01: Không thể tạo phiên có tổng phí 0đ. Chi nhánh [Tên Chi Nhánh] chưa phát sinh phí. Vui lòng kiểm tra ngày chốt, ngưỡng thu phí hoặc chọn lại chi nhánh."
        ]),
        ("BR11: Máy Trạng Thái Vòng Đời Phiên Đối Soát (State Machine)", [
            "• Vòng đời 6 trạng thái: Nháp (DRAFT) → Chờ duyệt (CHO_DUYET) → Đã duyệt (APPROVED) → Đã gửi trường (SENT_TO_SCHOOL) → Đã thanh toán (PAID). Các trạng thái kết thúc: Đã hủy (CANCELLED), Đã từ chối (REJECTED).",
            "• Hành động Tạo phiên truy thu chỉ xuất hiện độc quyền khi phiên ở trạng thái Đã thanh toán (PAID)."
        ]),
        ("BR12: Bảng Kiểm Toán Học Sinh & So Sánh Log Song Song (Side-by-Side Audit)", [
            "• Bảng chia đôi: Bên trái hiển thị học sinh tính phí; bên phải hiển thị nhật ký quẹt thẻ thực tế.",
            "• Nhận diện cảnh báo lệch ngày (ví dụ: ⚠️ Lệch +15 ngày) kèm lý do giải trình.",
            "• Cuộn đồng bộ & Làm mờ: Bấm chọn học sinh bên trái, các dòng khác tự động làm mờ (opacity-25), bảng log bên phải tự động cuộn mượt đến đúng học sinh đó.",
            "• Xuất file Excel 2 Sheet: Sheet 1 (Danh sách học sinh tính tiền) & Sheet 2 (Đối chiếu lịch sử log)."
        ])
    ]

    for title, points in rules:
        add_sec_heading(title, 3)
        for pt in points:
            p_pt = doc.add_paragraph()
            p_pt.paragraph_format.space_before = Pt(1)
            p_pt.paragraph_format.space_after = Pt(2)
            p_pt.paragraph_format.line_spacing = 1.15
            p_pt.add_run(pt)

    # Ví dụ minh họa thực tế
    p_ex_title = doc.add_paragraph()
    p_ex_title.paragraph_format.space_before = Pt(8)
    p_ex_title.paragraph_format.space_after = Pt(2)
    r_ex_t = p_ex_title.add_run("Ví dụ thực tế minh họa quy tắc tính phí (BR06 & BR07):")
    r_ex_t.bold = True
    r_ex_t.italic = True
    
    p_ex = doc.add_paragraph()
    p_ex.add_run("Giả sử chi nhánh THCS Trần Đại Nghĩa có Ngưỡng thu = 1 tháng (30 ngày), Ngày dư làm tròn = 10 ngày, đơn giá dịch vụ Camera AI = 5.000 đ/tháng:")
    
    ex_cases = [
        "Học sinh Nguyễn Văn An (132 ngày hoạt động): 132 = 4 tháng (120 ngày) + 12 ngày dư. Do 12 ngày dư ≥ 10 ngày làm tròn → Quy đổi thành 5 tháng tính phí. Thành tiền: 5 * 5.000 đ = 25.000 VNĐ (Huy hiệu xanh: Có tính phí).",
        "Học sinh Lê Thu Thảo (128 ngày hoạt động): 128 = 4 tháng (120 ngày) + 8 ngày dư. Do 8 ngày dư < 10 ngày làm tròn → Quy đổi thành 4 tháng tính phí. Thành tiền: 4 * 5.000 đ = 20.000 VNĐ (Huy hiệu xanh: Có tính phí).",
        "Học sinh Phạm Minh Khôi (25 ngày hoạt động): 25 ngày ≤ 30 ngày ngưỡng tối thiểu → Quy đổi thành 0 tháng tính phí. Thành tiền: 0 VNĐ (Huy hiệu xám: Không tính phí)."
    ]
    for ec in ex_cases:
        p_ec = doc.add_paragraph(style='List Bullet')
        p_ec.paragraph_format.space_before = Pt(1)
        p_ec.paragraph_format.space_after = Pt(2)
        p_ec.add_run(ec)

    # ==========================================
    # PHẦN 3: ĐẶC TẢ TÍNH NĂNG & USE CASES
    # ==========================================
    add_sec_heading("3. Đặc tả tính năng & Use cases", 1)
    
    add_sec_heading("3.1 Phân rã chức năng", 2)
    tbl_features = doc.add_table(rows=9, cols=6)
    tbl_features.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_features)

    feat_headers = ["Epic", "Feature", "Platform", "Priority", "User Story", "Status"]
    feat_widths = [Inches(1.1), Inches(1.4), Inches(0.8), Inches(0.8), Inches(2.1), Inches(0.6)]
    
    for c_idx, h_text in enumerate(feat_headers):
        cell = tbl_features.rows[0].cells[c_idx]
        cell.width = feat_widths[c_idx]
        set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
        set_cell_background(cell, "F1F5F9")
        format_cell_text(cell, [h_text], is_header=True)

    features_data = [
        ("SM1: Cấu hình", "Quản lý nhóm trường & Lịch kỳ", "Web Portal", "MUST HAVE", "Thiết lập pháp nhân, đơn vị đối soát, lịch sinh kỳ liên tục", "Verified"),
        ("SM1: Cấu hình", "Chi nhánh & Biểu phí đa chu kỳ", "Web Portal", "MUST HAVE", "Cấu hình biểu phí đ/HS/năm và đ/HS/tháng, nút Điều chỉnh ngay", "Verified"),
        ("SM1: Cấu hình", "Quản trị Mật khẩu file đối soát", "Web Portal", "MUST HAVE", "Gửi/cập nhật mật khẩu file, preview email To/Cc, pop-up xác nhận", "Verified"),
        ("SM2: Phiên đối soát", "Wizard tạo phiên 3 bước", "Web Portal", "MUST HAVE", "Khởi tạo phiên đối soát định kỳ, chọn kỳ, chốt ngày quét số liệu", "Verified"),
        ("SM2: Phiên đối soát", "Bộ chốt an toàn 0đ (MSG-01)", "Web Portal", "MUST HAVE", "Ngăn chặn tạo phiên rỗng 0 VNĐ, cảnh báo chi nhánh chưa có phí", "Verified"),
        ("SM2: Phiên đối soát", "Khóa Snapshot bất biến", "Web Portal", "MUST HAVE", "Đóng băng cấu hình biểu phí tại thời điểm lập phiên (ADR-M6-001)", "Verified"),
        ("SM2: Phiên đối soát", "Vòng đời State Machine", "Web Portal", "MUST HAVE", "Điều chuyển trạng thái duyệt, gửi biên bản, thanh toán, truy thu", "Verified"),
        ("Kiểm toán & Báo cáo", "So sánh Log & Xuất Excel 2 Sheet", "Web Portal", "MUST HAVE", "Kiểm toán học sinh Side-by-Side, cuộn đồng bộ, xuất Excel 2 Sheet", "Verified")
    ]
    for r_idx, r_vals in enumerate(features_data):
        row = tbl_features.rows[r_idx + 1]
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            cell.width = feat_widths[c_idx]
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            format_cell_text(cell, [val])

    add_sec_heading("3.2 Đặc tả chi tiết từng Use case", 2)

    use_cases = [
        {
            "id": "UC-01",
            "name": "Khởi tạo và thiết lập Nhóm trường (GroupDrawer)",
            "desc": "Người dùng khai báo thông tin pháp nhân nhóm trường mới, chọn đơn vị đối soát, chu kỳ đối soát, lịch kỳ và ngưỡng thu phí.",
            "actor": "Chuyên viên Vận hành (Ops Admin)",
            "trigger": "Bấm nút [+ Tạo mới] trên thanh công cụ trang Danh sách nhóm trường.",
            "pre": "Người dùng đã đăng nhập hệ thống ECO Card Portal với quyền Vận hành (Ops Admin).",
            "happy": [
                "1. Người dùng bấm nút [+ Tạo mới] trên thanh công cụ.",
                "2. Hệ thống hiển thị Right-Sheet Tạo mới nhóm trường (GroupDrawer).",
                "3. Người dùng nhập Mã nhóm trường (ví dụ: HIEUTEST), Tên nhóm, MST, Số hợp đồng, Người đại diện, SĐT.",
                "4. Người dùng chọn Đơn vị đối soát: 'Theo nhóm trường' hoặc 'Theo từng trường'.",
                "   • Nếu chọn 'Theo nhóm trường': Hệ thống hiển thị trường Email nhận biên bản nhóm.",
                "   • Nếu chọn 'Theo từng trường': Hệ thống tự động ẩn trường Email nhóm.",
                "5. Người dùng chọn Chu kỳ đối soát: 'Đối soát theo năm' hoặc 'Đối soát theo kỳ'.",
                "   • Nếu chọn 'Đối soát theo năm': Số kỳ tự động cố định = 1 (khóa disabled).",
                "   • Nếu chọn 'Đối soát theo kỳ': Nhập số kỳ tùy ý (ví dụ: 4 kỳ).",
                "6. Người dùng bấm nút 'Sinh lịch kỳ': Hệ thống tự động tạo danh sách các kỳ với ngày bắt đầu/kết thúc liên tục.",
                "7. Người dùng thiết lập Ngưỡng thu phí (tháng) và Ngày dư làm tròn lên 1 tháng.",
                "8. Người dùng bấm 'Lưu thông tin'.",
                "9. Hệ thống kiểm tra hợp lệ, lưu nhóm trường vào cơ sở dữ liệu và hiển thị Toast thông báo thành công."
            ],
            "exc": [
                "• Trùng Mã nhóm trường: Hệ thống báo lỗi đỏ và chặn lưu.",
                "• Để trống trường bắt buộc (Mã, Tên, Năm dịch vụ, Email nhóm khi chọn Theo nhóm trường): Hệ thống báo lỗi validation.",
                "• Chỉnh sửa nhóm trường có sẵn: Trường Mã nhóm trường bị khóa vĩnh viễn không cho chỉnh sửa."
            ],
            "post": "Nhóm trường mới xuất hiện trên bảng danh sách; sẵn sàng để gán chi nhánh.",
            "rules": "BR01, BR02, BR03, BR08."
        },
        {
            "id": "UC-02",
            "name": "Cấu hình Chi nhánh & Biểu phí đa chu kỳ (BranchDrawer)",
            "desc": "Người dùng gán chi nhánh vào nhóm trường, cấu hình dịch vụ áp dụng và thiết lập đơn giá chuẩn theo chu kỳ năm hoặc tháng.",
            "actor": "Chuyên viên Vận hành (Ops Admin)",
            "trigger": "Bấm 'Thêm chi nhánh' hoặc bấm icon Chỉnh sửa trên dòng chi nhánh.",
            "pre": "Nhóm trường cha đã được khởi tạo thành công.",
            "happy": [
                "1. Người dùng mở ngăn kéo chi nhánh (BranchDrawer).",
                "2. Người dùng chọn Chi nhánh trường từ danh mục, nhập số học sinh đăng ký.",
                "3. Kiểm tra trường Email nhận biên bản của chi nhánh:",
                "   • Nếu nhóm chọn 'Theo nhóm trường': Ô email chi nhánh tự động điền sẵn email nhóm, bị khóa mờ (disabled) kèm huy hiệu đồng bộ.",
                "   • Nếu nhóm chọn 'Theo từng trường': Ô email chi nhánh mở cho phép nhập tối đa 3 email.",
                "4. Tại mục 'Dịch vụ và biểu phí', hệ thống tự động mở tab tương ứng:",
                "   • Nhóm chọn Đối soát theo năm → Mở tab 'Học phí theo năm' với đơn vị đ/học sinh/ năm.",
                "   • Nhóm chọn Đối soát theo kỳ → Mở tab 'Học phí theo tháng' với đơn vị đ/học sinh/ tháng.",
                "5. Người dùng tích chọn các dịch vụ áp dụng và nhập đơn giá tương ứng.",
                "6. Người dùng bấm 'Lưu cấu hình'.",
                "7. Hệ thống cập nhật biểu phí chi nhánh và hiển thị Toast thành công."
            ],
            "exc": [
                "• Người dùng nhấp sang tab biểu phí không áp dụng: Hệ thống ẩn form giá, hiển thị banner cảnh báo và nút 'Điều chỉnh ngay'. Khi bấm, hệ thống chuyển sang GroupDrawer để điều chỉnh chu kỳ nhóm.",
                "• Nhập đơn giá âm hoặc ký tự không hợp lệ: Báo lỗi validation."
            ],
            "post": "Chi nhánh được lưu với ma trận biểu phí chuẩn xác sẵn sàng cho việc lập phiên đối soát.",
            "rules": "BR01, BR02, BR04."
        },
        {
            "id": "UC-03",
            "name": "Cấp phát và Quản trị Mật khẩu file đối soát (PasswordDrawer)",
            "desc": "Người dùng thiết lập mật khẩu bảo vệ file đối soát, xem trước nội dung email và gửi mật khẩu đến nhà trường kèm pop-up xác nhận.",
            "actor": "Chuyên viên Vận hành (Ops Admin) / Kế toán viên",
            "trigger": "Bấm '•••' trên dòng nhóm trường → Chọn 'Gửi mật khẩu' (hoặc 'Cập nhật mật khẩu').",
            "pre": "Nhóm trường đã có email nhận biên bản hợp lệ.",
            "happy": [
                "1. Người dùng nhấp menu '•••' của nhóm trường và chọn 'Gửi mật khẩu'.",
                "2. Hệ thống mở Right-Sheet Cấu hình mật khẩu file đối soát (PasswordDrawer).",
                "3. Người dùng nhập Mật khẩu mới (Add password) và Xác nhận mật khẩu (Confirm password) tùy ý không giới hạn định dạng.",
                "4. Người dùng xem trước nội dung email (To, Cc: edu@finviet...; phongketoan@finviet..., Tiêu đề, Mật khẩu thực tế).",
                "5. Người dùng bấm nút 'Gửi' (hoặc 'Cập nhật & Gửi').",
                "6. Hệ thống hiển thị Pop-up 'Xác nhận gửi mật khẩu' nổi bật ở lớp trên cùng ngay giữa Right-Sheet.",
                "7. Người dùng kiểm tra thông tin và bấm 'Xác nhận gửi'.",
                "8. Hệ thống lưu mật khẩu, ghi nhận trạng thái đã gửi và hiển thị Toast thông báo thành công.",
                "9. Menu '•••' của nhóm trường từ nay vĩnh viễn hiển thị 'Cập nhật mật khẩu'."
            ],
            "exc": [
                "• Mật khẩu xác nhận không trùng khớp: Hệ thống báo lỗi đỏ và chặn mở pop-up xác nhận.",
                "• Bấm 'Hủy' trong pop-up xác nhận: Đóng pop-up xác nhận và quay lại màn hình nhập mật khẩu."
            ],
            "post": "Mật khẩu được lưu trữ an toàn, email thông báo mật khẩu sẵn sàng phát hành.",
            "rules": "BR05."
        },
        {
            "id": "UC-04",
            "name": "Tạo mới Phiên đối soát qua Wizard 3 bước & Chốt an toàn 0đ",
            "desc": "Kế toán viên khởi tạo phiên đối soát định kỳ thông qua quy trình Wizard 3 bước, hệ thống quét học sinh và chặn tạo phiên nếu có chi nhánh tổng phí = 0đ.",
            "actor": "Kế toán viên (Finance Officer)",
            "trigger": "Bấm nút [+ Tạo mới] trên trang Danh sách phiên đối soát.",
            "pre": "Đã có nhóm trường và chi nhánh ở trạng thái Bật (Active) với đầy đủ biểu phí.",
            "happy": [
                "1. Người dùng bấm [+ Tạo mới] trên trang SM2 Phiên đối soát.",
                "2. Bước 1: Chọn nhóm trường đối soát. Hệ thống nạp danh sách chi nhánh trực thuộc.",
                "3. Bước 2: Chọn kỳ đối soát (kỳ đã có phiên hiển thị nhãn 'Đã có phiên'), chọn Ngày chốt (Cut-off Date) và chọn hình thức xử lý truy thu.",
                "4. Bước 3: Người dùng bấm 'Xem số liệu'. Hệ thống tự động quét học sinh active đến ngày chốt và tính toán chi phí theo chuẩn 30 ngày/tháng.",
                "5. Hệ thống hiển thị bảng xem trước: Sĩ số hoạt động, Phí kỳ này, Phí truy thu, Tổng tiền phải thu theo từng chi nhánh.",
                "6. Tất cả chi nhánh đều có tổng tiền > 0 VNĐ → Nút 'Tạo phiên' ở trạng thái Enable.",
                "7. Người dùng bấm 'Tạo phiên'.",
                "8. Hệ thống sao chép toàn bộ biểu phí vào Snapshot JSON bất biến (ADR-M6-001) và khởi tạo phiên đối soát ở trạng thái Nháp (DRAFT)."
            ],
            "exc": [
                "• Có chi nhánh tổng phí = 0đ: Hệ thống kích hoạt Bộ chốt an toàn 0đ (MSG-01 / BR10), hiển thị cảnh báo đỏ và khóa nút 'Tạo phiên'.",
                "• Kỳ đối soát đã có phiên đang hoạt động: Hệ thống đánh dấu 'Đã có phiên' và không cho chọn lại."
            ],
            "post": "Phiên đối soát được khởi tạo ở trạng thái Nháp với cấu hình Snapshot đã khóa vĩnh viễn.",
            "rules": "BR06, BR07, BR08, BR09, BR10, BR11."
        },
        {
            "id": "UC-05",
            "name": "Vận hành Vòng đời phê duyệt và Thanh toán phiên đối soát",
            "desc": "Theo dõi và điều chuyển trạng thái của phiên đối soát qua các bước kiểm duyệt, phát hành biên bản cho trường và xác nhận thanh toán.",
            "actor": "Kế toán viên (Finance Officer) / Quản lý tài chính (Finance Lead)",
            "trigger": "Người dùng thực hiện các hành động Gửi duyệt, Duyệt phiên, Gửi biên bản hoặc Xác nhận thanh toán.",
            "pre": "Phiên đối soát đang ở trạng thái hợp lệ trong State Machine.",
            "happy": [
                "1. Tại phiên trạng thái Nháp (DRAFT): Người dùng kiểm tra số liệu, có thể bấm 'Tính lại các nhánh' nếu dữ liệu quẹt thẻ thay đổi, sau đó bấm 'Gửi duyệt'. Trạng thái chuyển thành 'Chờ duyệt' (CHO_DUYET).",
                "2. Cấp quản lý kiểm tra chi tiết bảng kê và snapshot, bấm 'Duyệt phiên'. Trạng thái chuyển thành 'Đã duyệt' (APPROVED).",
                "3. Kế toán viên bấm 'Gửi biên bản' để phát hành biên bản đối soát cho trường qua email. Trạng thái chuyển thành 'Đã gửi trường' (SENT_TO_SCHOOL).",
                "4. Khi nhà trường thanh toán công nợ, kế toán viên bấm 'Xác nhận thanh toán'. Trạng thái chuyển thành 'Đã thanh toán' (PAID)."
            ],
            "exc": [
                "• Người quản lý từ chối phiên Chờ duyệt: Bấm 'Từ chối' (kèm lý do) → Trạng thái chuyển thành 'Đã từ chối' (REJECTED). Kế toán viên có thể điều chỉnh và gửi duyệt lại.",
                "• Hủy phiên: Người dùng bấm 'Hủy phiên' khi ở trạng thái Nháp → Phiên chuyển thành 'Đã hủy' (CANCELLED)."
            ],
            "post": "Phiên hoàn tất thanh toán, lưu vết thời gian và người thực hiện đầy đủ.",
            "rules": "BR11."
        },
        {
            "id": "UC-06",
            "name": "Khởi tạo Phiên truy thu bổ sung từ phiên Đã thanh toán",
            "desc": "Khởi tạo phiên truy thu con phân cấp từ một phiên gốc đã hoàn tất thanh toán để quyết toán bổ sung cho học sinh mới phát sinh.",
            "actor": "Kế toán viên (Finance Officer)",
            "trigger": "Bấm 'Tạo phiên truy thu' tại menu thao tác của phiên đối soát đã thanh toán.",
            "pre": "Phiên đối soát gốc phải ở trạng thái 'Đã thanh toán' (PAID).",
            "happy": [
                "1. Người dùng mở menu thao tác của phiên có trạng thái PAID, chọn 'Tạo phiên truy thu'.",
                "2. Hệ thống hiển thị modal Tạo phiên truy thu, kế thừa thông tin nhóm trường và kỳ đối soát gốc.",
                "3. Người dùng chọn chi nhánh cần tính toán truy thu và thiết lập ngày chốt bổ sung.",
                "4. Hệ thống quét danh sách học sinh mới kích hoạt hoặc phát sinh ngày hoạt động trước ngày bắt đầu kỳ.",
                "5. Người dùng xác nhận tạo phiên truy thu.",
                "6. Hệ thống tạo phiên truy thu con (PHIÊN TRUY THU) hiển thị lồng phân cấp ngay dưới phiên gốc trong bảng danh sách."
            ],
            "exc": [
                "• Không phát sinh học sinh cần truy thu: Hệ thống thông báo và không cho tạo phiên rỗng."
            ],
            "post": "Phiên truy thu con được khởi tạo và quản lý vòng đời tương tự phiên đối soát chuẩn.",
            "rules": "BR08, BR11."
        },
        {
            "id": "UC-07",
            "name": "Kiểm toán danh sách học sinh & So sánh Log hoạt động song song",
            "desc": "Kiểm toán viên đối chiếu chi tiết từng học sinh tính phí với nhật ký quẹt thẻ thực tế của máy quét, phát hiện lệch ngày và tự động cuộn đồng bộ.",
            "actor": "Kế toán viên / Kiểm toán viên / Kế toán trường học",
            "trigger": "Bấm '•••' trên dòng chi nhánh trong chi tiết phiên → Chọn 'Xem chi tiết' để mở modal Danh sách học sinh.",
            "pre": "Phiên đối soát đã được khởi tạo thành công.",
            "happy": [
                "1. Người dùng mở modal 'Danh sách học sinh' của chi nhánh.",
                "2. Hệ thống hiển thị danh sách toàn bộ học sinh kèm UID, Lớp, Dịch vụ, Số ngày hoạt động, Số tháng tính phí, Thành tiền và Huy hiệu tính phí.",
                "3. Người dùng bật nút gạt 'So sánh log'.",
                "4. Màn hình chuyển sang chế độ chia đôi song song (Side-by-Side):",
                "   • Bảng trái: Danh sách học sinh tính phí chốt từ phiên đối soát.",
                "   • Bảng phải: Nhật ký quẹt thẻ thực tế từ hệ thống điểm danh, hiển thị cảnh báo lệch ngày (ví dụ: ⚠️ Lệch +15 ngày) kèm lý do giải trình.",
                "5. Người dùng nhấp chuột vào một học sinh bất kỳ ở bảng bên trái.",
                "6. Hệ thống tự động tô sáng viền học sinh đó, làm mờ các dòng khác (dimming opacity-25), và tự động cuộn mượt bảng bên phải đến đúng bản ghi log của học sinh đó.",
                "7. Người dùng kiểm tra đối chiếu nhanh chóng và chính xác 100%."
            ],
            "exc": [
                "• Bấm ra ngoài vùng học sinh: Hệ thống hủy trạng thái làm mờ, đưa toàn bộ bảng về trạng thái hiển thị bình thường."
            ],
            "post": "Số liệu đối soát được kiểm chứng và giải trình minh bạch trước khi phê duyệt.",
            "rules": "BR06, BR07, BR12."
        },
        {
            "id": "UC-08",
            "name": "Xuất báo cáo dữ liệu đối soát ra Excel đa trang tính (2 Sheet)",
            "desc": "Xuất toàn bộ bảng kê học sinh tính phí và đối chiếu lịch sử trạng thái thẻ ra file Excel định dạng chuẩn gồm 2 Sheet.",
            "actor": "Kế toán viên (Finance Officer)",
            "trigger": "Bấm nút 'Xuất Excel / CSV' trong modal Danh sách học sinh.",
            "pre": "Đang mở modal Danh sách học sinh của một chi nhánh.",
            "happy": [
                "1. Người dùng bấm nút 'Xuất Excel / CSV'.",
                "2. Hệ thống khởi tạo tệp bảng tính Excel (.xls / .xlsx) đa trang tính chuẩn:",
                "   • Sheet 1 (Danh sách học sinh): Bảng kê học sinh tính tiền, chi tiết từng dịch vụ, phân cách hàng nghìn rõ ràng, tổng cộng tiền.",
                "   • Sheet 2 (Đối chiếu lịch sử trạng thái): Nhật ký chi tiết trạng thái hoạt động thẻ và giải trình lý do lệch ngày.",
                "3. Trình duyệt tự động tải tệp tin về máy tính người dùng.",
                "4. Tệp tin mở được trên Microsoft Excel, Google Sheets hoàn toàn không lỗi font tiếng Việt."
            ],
            "exc": [
                "• Chi nhánh không có dữ liệu học sinh: Báo thông báo và không tải file rỗng."
            ],
            "post": "Tệp Excel được lưu về máy phục vụ công tác thanh quyết toán và lưu trữ chứng từ.",
            "rules": "BR12."
        }
    ]

    for uc in use_cases:
        p_uc_h = doc.add_paragraph()
        p_uc_h.paragraph_format.space_before = Pt(12)
        p_uc_h.paragraph_format.space_after = Pt(4)
        r_uch = p_uc_h.add_run(f"{uc['id']}: {uc['name']}")
        r_uch.bold = True
        r_uch.font.size = Pt(11.5)
        r_uch.font.color.rgb = RGBColor(0x00, 0x70, 0xCE)

        tbl_uc = doc.add_table(rows=8, cols=2)
        tbl_uc.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(tbl_uc)
        
        uc_fields = [
            ("Use case ID", [uc["id"]]),
            ("Use case name", [uc["name"]]),
            ("Use case description", [uc["desc"]]),
            ("Actor", [uc["actor"]]),
            ("Trigger", [uc["trigger"]]),
            ("Pre-condition", [uc["pre"]]),
            ("Happy path", uc["happy"]),
            ("Exception", uc["exc"])
        ]
        for r_i, (lbl, val_list) in enumerate(uc_fields):
            row = tbl_uc.rows[r_i]
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(5.0)
            set_cell_margins(row.cells[0], top=60, bottom=60, left=100, right=100)
            set_cell_margins(row.cells[1], top=60, bottom=60, left=100, right=100)
            set_cell_background(row.cells[0], "F8FAFC")
            format_cell_text(row.cells[0], [lbl], is_header=True)
            format_cell_text(row.cells[1], val_list)

        p_post = doc.add_paragraph()
        p_post.paragraph_format.space_before = Pt(3)
        p_post.paragraph_format.space_after = Pt(2)
        r_post_lbl = p_post.add_run("Post-condition: ")
        r_post_lbl.bold = True
        p_post.add_run(uc["post"])

        p_br = doc.add_paragraph()
        p_br.paragraph_format.space_before = Pt(1)
        p_br.paragraph_format.space_after = Pt(6)
        r_br_lbl = p_br.add_run("Business Rules: ")
        r_br_lbl.bold = True
        p_br.add_run(uc["rules"])

    # ==========================================
    # PHẦN 4: GIAO DIỆN NGƯỜI DÙNG (SCREEN SPECIFICATIONS)
    # ==========================================
    add_sec_heading("4. Giao diện người dùng (Screen Specifications)", 1)
    
    add_sec_heading("4.1 Mô tả màn hình", 2)
    p = doc.add_paragraph()
    p.add_run("Bảng đặc tả giao diện người dùng 5 cột chuẩn Confluence, tích hợp hình ảnh chụp thực tế từ hệ thống:")

    screens_data = [
        {
            "name": "Màn hình 1: Danh sách nhóm trường (SM1)",
            "img": "docs_legacy/screenshots/sm1-cau-hinh-doi-soat-danh-sach.png",
            "desc_header": "Màn hình danh sách quản trị toàn bộ các nhóm trường (pháp nhân) đã ký hợp đồng đối tác với Finviet. Cho phép tìm kiếm, lọc theo mã trường, trạng thái Bật/Tắt.",
            "components": [
                ("Thanh tìm kiếm & lọc", "Search Input / Dropdowns", "Tìm kiếm theo Tên nhóm, Mã nhóm, MST, Hợp đồng; lọc theo Mã trường và Trạng thái (Tất cả, Đang hoạt động, Ngừng hoạt động).", "Tự động debounce tìm kiếm thời gian thực."),
                ("Nút [+ Tạo mới]", "Primary Button", "Nút bấm màu xanh Finviet (#0070CE) mở Right-Sheet tạo mới nhóm trường (GroupDrawer).", "Vị trí góc trên bên phải bảng danh sách."),
                ("Nút mở rộng [+] / [-]", "Toggle Button", "Nút vuông nhỏ đầu mỗi dòng cho phép mở rộng xem danh sách chi nhánh hoặc thu gọn.", "Mặc định ở trạng thái thu gọn để giao diện thoáng đãng."),
                ("Cột Trạng thái (Switch)", "Toggle Switch", "Nút gạt Bật/Tắt hoạt động của nhóm trường.", "Chuyển màu xanh khi Active, xám khi Inactive."),
                ("Menu Thao tác (•••)", "Dropdown Menu", "Menu gồm: Thêm chi nhánh, Chỉnh sửa nhóm, Gửi mật khẩu (hoặc Cập nhật mật khẩu).", "Tự động định vị mở ngược lên trên (bottom-10) ở các dòng cuối bảng tránh che khuất.")
            ]
        },
        {
            "name": "Màn hình 2: Cấu hình nhóm trường (GroupDrawer)",
            "img": "docs_legacy/screenshots/sm1-cau-hinh-doi-soat-modal-chinh-sua-1.png",
            "desc_header": "Ngăn kéo cấu hình chi tiết thông tin pháp nhân nhóm trường, đơn vị đối soát, lịch kỳ và ngưỡng tính phí.",
            "components": [
                ("Mã nhóm trường", "Text Input", "Mã định danh duy nhất của nhóm trường (ví dụ: HIEUTEST, VINASCHOOL).", "Khóa cứng (disabled) khi chỉnh sửa nhóm trường có sẵn."),
                ("Đơn vị đối soát", "Radio Group", "Lựa chọn 'Theo nhóm trường' (GROUP) hoặc 'Theo từng trường' (BRANCH).", "Thay đổi lập tức ẩn/hiện trường Email nhận biên bản nhóm."),
                ("Email nhận biên bản nhóm", "Text Input", "Nhập tối đa 3 email nhận biên bản của nhóm trường, phân cách bằng dấu phẩy.", "Bắt buộc khi chọn Theo nhóm trường; tự động ẩn khi chọn Theo từng trường."),
                ("Chu kỳ đối soát", "Select / Radio", "Lựa chọn 'Đối soát theo năm' (YEARLY) hoặc 'Đối soát theo kỳ' (PERIODIC).", "Chọn Theo năm: cố định số kỳ = 1. Chọn Theo kỳ: cho phép sửa số kỳ."),
                ("Lịch kỳ đối soát", "Data Table / Generator", "Hiển thị các kỳ đối soát, nút Sinh lịch kỳ, checkbox Thu phí cho từng kỳ.", "Nối tiếp ngày liên tục: sửa Đến ngày của Kỳ i thì Từ ngày Kỳ i+1 tự nhảy."),
                ("Ngưỡng thu phí (tháng)", "Number Input", "Số tháng hoạt động tối thiểu để bắt đầu tính phí (mặc định: 1 tháng = 30 ngày).", "Tham số cốt lõi cho BR06."),
                ("Ngày dư làm tròn lên 1 tháng", "Number Input", "Số ngày lẻ dư tối thiểu để được làm tròn cộng thêm 1 tháng (mặc định: 10 ngày).", "Tham số cốt lõi cho BR07.")
            ]
        },
        {
            "name": "Màn hình 3: Cấu hình chi nhánh & Biểu phí (BranchDrawer)",
            "img": "docs_legacy/screenshots/sm1-cau-hinh-doi-soat-modal-chi-nhanh-1.png",
            "desc_header": "Ngăn kéo thiết lập dịch vụ áp dụng và ma trận đơn giá cho từng chi nhánh trường trực thuộc.",
            "components": [
                ("Chọn chi nhánh & Sĩ số", "Dropdown / Number", "Chọn cơ sở trường học và nhập số lượng học sinh đăng ký dịch vụ.", "Bắt buộc nhập."),
                ("Email nhận biên bản chi nhánh", "Text Input", "Địa chỉ email nhận biên bản đối soát của chi nhánh.", "Đồng bộ và khóa mờ nếu nhóm là GROUP; mở sửa tự do nếu nhóm là BRANCH."),
                ("Tab Học phí theo năm", "Tab Header", "Thiết lập biểu phí trọn gói theo năm học.", "Hậu tố đơn vị hiển thị: đ/học sinh/ năm. Mặc định mở nếu nhóm là YEARLY."),
                ("Tab Học phí theo tháng", "Tab Header", "Thiết lập biểu phí chi tiết theo từng kỳ đối soát.", "Hậu tố đơn vị hiển thị: đ/học sinh/ tháng. Mặc định mở nếu nhóm là PERIODIC."),
                ("Banner cảnh báo & [Điều chỉnh ngay]", "Warning Box / Button", "Xuất hiện khi người dùng nhấp sang tab biểu phí không áp dụng.", "Nút 'Điều chỉnh ngay' mở trực tiếp GroupDrawer để chuyển đổi chu kỳ nhóm."),
                ("Danh mục 4 dịch vụ", "Checkbox & Table", "Gồm: Phần mềm quản lý, Camera AI, Thẻ học sinh, Căn tin học đường.", "Có thể chọn dịch vụ và đặt đơn giá riêng cho từng kỳ.")
            ]
        },
        {
            "name": "Màn hình 4: Cấp phát mật khẩu file đối soát (PasswordDrawer)",
            "img": "/Users/hieuvo/.gemini/antigravity/brain/3d0c75be-893c-4c8d-b448-d72dd0d989d1/.user_uploaded/media_1790935208041.png",
            "desc_header": "Right-Sheet cấp phát mật khẩu mã hóa file đối soát gửi đến trường học qua email, tích hợp xem trước email và pop-up xác nhận lồng.",
            "components": [
                ("Mật khẩu mới (Add password)", "Password Input", "Nhập mật khẩu mở file đối soát tùy ý theo yêu cầu của trường.", "Không giới hạn định dạng, có icon con mắt ẩn/hiện."),
                ("Xác nhận mật khẩu (Confirm password)", "Password Input", "Nhập lại mật khẩu để xác nhận trùng khớp.", "Báo lỗi đỏ nếu không khớp với mật khẩu mới."),
                ("Khung xem trước email (Live Preview)", "Preview Card", "Hiển thị trực quan: To (email trường), Cc (cố định Finviet), Tiêu đề và Nội dung thư.", "Tự động hiển thị mật khẩu thực tế đang nhập."),
                ("Nút Gửi / Cập nhật & Gửi", "Primary Button", "Nút gửi ở chân Right-Sheet mở pop-up xác nhận.", "Đổi nhãn thành 'Cập nhật & Gửi' nếu đã gửi trước đó."),
                ("Pop-up Xác nhận gửi mật khẩu", "Modal Dialog", "Hộp thoại xác nhận nổi bật ở lớp trên cùng ngay giữa Right-Sheet (absolute inset-0 z-50).", "Hiển thị tóm tắt Nhóm trường, To, Cc, Mật khẩu thực tế và nút Xác nhận.")
            ]
        },
        {
            "name": "Màn hình 5: Danh sách phiên đối soát (SM2)",
            "img": "docs_legacy/screenshots/sm2-phien-doi-soat-danh-sach.jpeg",
            "desc_header": "Màn hình quản trị toàn bộ các phiên đối soát định kỳ, theo dõi trạng thái vòng đời và lọc đa tiêu chí.",
            "components": [
                ("Thẻ KPI thống kê", "KPI Cards", "6 thẻ thống kê số lượng phiên: Tất cả, Nháp, Chờ duyệt, Đã duyệt, Đã gửi trường, Đã thanh toán.", "Click thẻ để lọc nhanh danh sách theo trạng thái."),
                ("Thanh công cụ lọc", "Filter Bar", "Lọc theo Nhóm trường, Chi nhánh, Kỳ đối soát, Trạng thái phiên, Trạng thái truy thu, Ngày chốt.", "Hỗ trợ reset bộ lọc nhanh."),
                ("Nút [+ Tạo mới]", "Primary Button", "Mở Wizard 3 bước tạo phiên đối soát mới.", "Định vị nổi bật góc trên bên phải."),
                ("Huy hiệu Trạng thái", "Status Badges", "Hiển thị màu sắc chuẩn: Nháp (Xám), Chờ duyệt (Cam), Đã duyệt (Xanh dương), Đã gửi trường (Tím), Đã thanh toán (Xanh lá).", "Trực quan hóa vòng đời phiên."),
                ("Menu Thao tác dòng (•••)", "Dropdown Menu", "Gồm: Xem chi tiết, Tính lại, Gửi duyệt, Hủy phiên, Tải biên bản, Gửi biên bản, Xác nhận thanh toán, Tạo phiên truy thu.", "Hành động hiển thị động theo trạng thái của phiên.")
            ]
        },
        {
            "name": "Màn hình 6: Wizard tạo phiên Bước 3 & Chốt an toàn 0đ",
            "img": "docs_legacy/screenshots/sm2-tao-moi-modal-3-preview.jpeg",
            "desc_header": "Bước 3 trong quy trình tạo phiên đối soát: Quét học sinh, xem trước số liệu tính toán và kiểm tra bộ chốt an toàn 0 VNĐ.",
            "components": [
                ("Thanh tiến trình 3 bước", "Stepper", "Bước 1: Chọn nhóm & trường → Bước 2: Chọn kỳ & ngày chốt → Bước 3: Xem số liệu.", "Hiển thị rõ bước hiện tại."),
                ("Bảng xem trước số liệu", "Data Table", "Hiển thị theo chi nhánh: Sĩ số học sinh active, Phí kỳ này, Phí truy thu, Tổng tiền phải thu.", "Tự động tính toán theo chuẩn 30 ngày và làm tròn ngày dư."),
                ("Bộ chốt an toàn 0đ (MSG-01)", "Alert Banner", "Cảnh báo đỏ xuất hiện khi có chi nhánh tổng phí = 0đ kèm thông điệp MSG-01.", "Khóa nút 'Tạo phiên' (disabled) ngăn chặn hoàn toàn việc tạo phiên rỗng."),
                ("Nút [Tạo phiên]", "Primary Button", "Nút bấm xác nhận tạo phiên đối soát mới và đóng băng Snapshot cấu hình.", "Chỉ Enable khi tất cả các chi nhánh đều có tổng tiền > 0 VNĐ.")
            ]
        },
        {
            "name": "Màn hình 7: Chi tiết phiên đối soát & Vòng đời",
            "img": "docs_legacy/screenshots/sm2-phien-chi-tiet-nhap.jpeg",
            "desc_header": "Trang chi tiết phiên đối soát với 2 tab: 'Chi tiết phí' (bảng kê chi nhánh & dịch vụ) và 'Cấu hình đã khóa' (Snapshot bất biến).",
            "components": [
                ("Header & Trạng thái phiên", "Page Header", "Mã phiên, Tên nhóm trường, Kỳ đối soát, Ngày chốt, Tổng tiền và Huy hiệu trạng thái.", "Các nút hành động nghiệp vụ (Gửi duyệt, Duyệt, Gửi biên bản...)."),
                ("Tab Chi tiết phí", "Tab View", "Bảng kê tổng hợp các chi nhánh. Mở rộng dòng để xem chi tiết từng dịch vụ (Phần mềm, Camera AI, Thẻ HS, Căn tin).", "Cung cấp nút '•••' trên từng dòng chi nhánh để mở Danh sách học sinh."),
                ("Tab Cấu hình đã khóa", "Tab View", "Hiển thị Snapshot JSON biểu phí, dịch vụ và ngưỡng thu đã đóng băng tại thời điểm tạo phiên.", "Bảo đảm bất biến (ADR-M6-001), không bị thay đổi bởi SM1."),
                ("Nút [Tính lại các nhánh]", "Secondary Button", "Cho phép tính toán lại số liệu quét quẹt thẻ khi phiên ở trạng thái Nháp.", "Chỉ khả dụng khi phiên là DRAFT.")
            ]
        },
        {
            "name": "Màn hình 8: Danh sách học sinh & So sánh Log song song",
            "img": "/Users/hieuvo/.gemini/antigravity/brain/3d0c75be-893c-4c8d-b448-d72dd0d989d1/.user_uploaded/media_1790241045758.png",
            "desc_header": "Modal chi tiết từng học sinh của chi nhánh, tích hợp chế độ kiểm toán đối chiếu Log quẹt thẻ song song (Side-by-Side View).",
            "components": [
                ("Nút gạt [So sánh log]", "Toggle Switch", "Bật/Tắt chế độ xem đối chiếu chia đôi màn hình song song.", "Bật lên để xem nhật ký hoạt động quẹt thẻ bên cạnh danh sách tính tiền."),
                ("Bảng trái: Danh sách tính phí", "Data Table", "Tên học sinh, Mã UID, Lớp, Dịch vụ, Số ngày hoạt động, Số tháng tính phí, Đơn giá, Thành tiền, Huy hiệu Có/Không tính phí.", "Bấm vào dòng để kích hoạt Focus & Cuộn đồng bộ."),
                ("Bảng phải: Đối chiếu Log máy quét", "Data Table", "Tên học sinh, Mã UID, Lịch sử hoạt động thẻ, Tổng ngày thực tế, Người cập nhật, Cảnh báo lệch ngày (⚠️ Lệch +15 ngày).", "Hiển thị rõ lý do chênh lệch ngày."),
                ("Tương tác Cuộn đồng bộ & Làm mờ", "UX Feature", "Khi chọn học sinh bảng trái: Học sinh đó nổi bật viền xanh, các dòng khác mờ đi (opacity-25), bảng phải tự cuộn mượt đến đúng vị trí.", "Hỗ trợ kiểm toán cực nhanh."),
                ("Nút [Xuất Excel / CSV]", "Action Button", "Xuất toàn bộ dữ liệu ra tệp Excel đa trang tính chuẩn (.xls / .xlsx).", "Sheet 1: Danh sách học sinh tính tiền; Sheet 2: Đối chiếu lịch sử log.")
            ]
        }
    ]

    for s in screens_data:
        add_sec_heading(s["name"], 3)
        
        # Add description paragraph
        p_desc = doc.add_paragraph()
        p_desc.add_run(s["desc_header"])
        p_desc.paragraph_format.space_before = Pt(2)
        p_desc.paragraph_format.space_after = Pt(6)

        # 5-column Confluence Table: Màn hình | Field / Component | Format | Description | Note
        num_rows = len(s["components"]) + 1
        tbl_s = doc.add_table(rows=num_rows, cols=5)
        tbl_s.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(tbl_s)

        headers_s = ["Màn hình", "Field / Component", "Format", "Description", "Note"]
        widths_s = [Inches(2.2), Inches(1.2), Inches(0.9), Inches(1.8), Inches(0.9)]

        for c_idx, h_text in enumerate(headers_s):
            cell = tbl_s.rows[0].cells[c_idx]
            cell.width = widths_s[c_idx]
            set_cell_margins(cell, top=80, bottom=80, left=60, right=60)
            set_cell_background(cell, "F1F5F9")
            format_cell_text(cell, [h_text], is_header=True)

        # First data row: merge or put image in column 0
        img_cell = tbl_s.rows[1].cells[0]
        img_cell.width = widths_s[0]
        set_cell_margins(img_cell, top=80, bottom=80, left=60, right=60)
        
        # Add image
        p_img = img_cell.paragraphs[0]
        p_img.text = ""
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_name = p_img.add_run(s["name"] + "\n")
        r_name.bold = True
        r_name.font.size = Pt(8.5)
        r_name.font.color.rgb = RGBColor(0x00, 0x70, 0xCE)
        
        if os.path.exists(s["img"]):
            try:
                p_img.add_run().add_picture(s["img"], width=Inches(2.0))
            except Exception as e:
                p_img.add_run(f"\n[Hình ảnh thực tế: {os.path.basename(s['img'])}]")
        else:
            p_img.add_run(f"\n[Hình ảnh thực tế: {os.path.basename(s['img'])}]")

        # Merge column 0 across all data rows
        if num_rows > 2:
            img_cell.merge(tbl_s.rows[num_rows - 1].cells[0])

        # Fill component rows
        for comp_idx, (f_comp, fmt, desc, note) in enumerate(s["components"]):
            row_idx = comp_idx + 1
            row = tbl_s.rows[row_idx]
            
            # cell 1 to 4
            row.cells[1].width = widths_s[1]
            row.cells[2].width = widths_s[2]
            row.cells[3].width = widths_s[3]
            row.cells[4].width = widths_s[4]
            
            for c_i in range(1, 5):
                set_cell_margins(row.cells[c_i], top=60, bottom=60, left=60, right=60)
                
            format_cell_text(row.cells[1], [f_comp], bold_first=True)
            format_cell_text(row.cells[2], [fmt])
            format_cell_text(row.cells[3], [desc])
            format_cell_text(row.cells[4], [note])

    # ==========================================
    # PHẦN 5: TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
    # ==========================================
    add_sec_heading("5. Tiêu chí nghiệm thu (Acceptance Criteria – AC)", 1)
    
    p_ac_intro = doc.add_paragraph()
    p_ac_intro.add_run("Các tiêu chí nghiệm thu được viết theo định dạng rút gọn, tập trung vào điều kiện kiểm thử độc lập (Condition-driven, Briefer format). Mỗi tiêu chí được thiết kế khoảng cách đệm trên thoáng đãng (spacing before: 360 twips) để phục vụ công tác đối chiếu và kiểm thử chất lượng (QA/QC):")

    acs = [
        {
            "id": "AC-01",
            "title": "Tính bất biến của Mã nhóm trường (Immutable Group Code)",
            "applies": "Người dùng mở form Chỉnh sửa một nhóm trường đã tồn tại trong SM1.",
            "block": "Cấm mọi thao tác sửa đổi, gõ đè, xóa hoặc khoảng trắng vào ô Mã nhóm trường.",
            "system": "Hệ thống thiết lập thuộc tính disabled={true} và trường mang giá trị mã nhóm gốc không thể tương tác.",
            "result": "Mã nhóm trường giữ nguyên 100% tính toàn vẹn dữ liệu, các trường tên, MST, hợp đồng vẫn cho phép chỉnh sửa bình thường."
        },
        {
            "id": "AC-02",
            "title": "Ẩn/Hiện trường Email nhóm theo Đơn vị đối soát (Dynamic Group Email)",
            "applies": "Người dùng thao tác trên form Tạo mới hoặc Chỉnh sửa nhóm trường (GroupDrawer).",
            "block": "Không hiển thị trường Email nhận biên bản nhóm khi chọn đơn vị đối soát là 'Theo từng trường'.",
            "system": "Khi chuyển chọn radio 'Theo nhóm trường': Form hiển thị ô nhập Email nhóm (tối đa 3 email). Khi chuyển chọn 'Theo từng trường': Ô nhập Email nhóm tự động biến mất và bị loại khỏi luồng kiểm tra validation.",
            "result": "Dữ liệu cấu hình email phản ánh chính xác phạm vi phát hành biên bản của pháp nhân."
        },
        {
            "id": "AC-03",
            "title": "Khóa đồng bộ Email tại Chi nhánh khi nhóm là GROUP (Synced Branch Email)",
            "applies": "Người dùng mở ngăn kéo cấu hình chi nhánh (BranchDrawer) thuộc nhóm trường cấu hình 'Theo nhóm trường'.",
            "block": "Cấm người dùng tự ý chỉnh sửa trường Email nhận biên bản của chi nhánh trường.",
            "system": "Hệ thống tự động điền sẵn email của nhóm trường vào ô email chi nhánh, thiết lập disabled={true}, hiển thị huy hiệu màu xanh thông báo đã đồng bộ từ nhóm trường.",
            "result": "Tất cả chi nhánh thuộc nhóm GROUP luôn thống nhất 1 danh sách email người nhận, loại trừ sai lệch người nhận biên bản."
        },
        {
            "id": "AC-04",
            "title": "Cố định 1 kỳ khi chọn Đối soát theo năm (Fixed Yearly Cycle)",
            "applies": "Người dùng chọn chu kỳ đối soát là 'Đối soát theo năm' (YEARLY) tại GroupDrawer.",
            "block": "Cấm người dùng thay đổi số kỳ đối soát thành các giá trị khác 1.",
            "system": "Ô nhập 'Số kỳ' tự động gán giá trị 1 và bị khóa mờ (disabled). Bấm 'Sinh lịch kỳ' tạo duy nhất 1 kỳ trọn năm học từ 01/09/YYYY đến 31/05/YYYY+1.",
            "result": "Trường chỉ có duy nhất 1 kỳ đối soát cho toàn bộ năm học, không phát sinh các kỳ con thừa thãi."
        },
        {
            "id": "AC-05",
            "title": "Nối tiếp ngày liên tục giữa các kỳ đối soát (Continuous Cascading Dates)",
            "applies": "Nhóm trường có chu kỳ 'Đối soát theo kỳ' (PERIODIC) với từ 2 kỳ trở lên.",
            "block": "Cấm để xảy ra khoảng trống ngày hoặc ngày chồng lấn giữa các kỳ kế tiếp nhau.",
            "system": "Khi người dùng chỉnh sửa trường 'Đến ngày' của Kỳ i thành ngày D, hệ thống tự động cập nhật trường 'Từ ngày' của Kỳ i+1 thành ngày D + 1 ngày.",
            "result": "Các kỳ đối soát luôn liên tục 100% theo dòng thời gian, đảm bảo không bỏ sót ngày hoạt động của học sinh."
        },
        {
            "id": "AC-06",
            "title": "Mở đúng Tab biểu phí và hành động nút Điều chỉnh ngay (Tab Auto-Routing)",
            "applies": "Người dùng mở ngăn kéo cấu hình chi nhánh (BranchDrawer).",
            "block": "Chặn cấu hình đơn giá sai chu kỳ (nhập giá tháng cho trường chu kỳ năm và ngược lại).",
            "system": "Hệ thống tự động mở tab biểu phí khớp với chu kỳ nhóm. Nếu người dùng nhấp sang tab không áp dụng: Ẩn form giá, hiển thị banner cảnh báo và nút 'Điều chỉnh ngay'. Bấm nút này lập tức đóng BranchDrawer và mở GroupDrawer để đổi chu kỳ nhóm.",
            "result": "Người dùng thao tác chuẩn xác, dễ dàng chuyển đổi chu kỳ nhóm chỉ với 1 click."
        },
        {
            "id": "AC-07",
            "title": "Hậu tố nhãn đơn vị biểu phí chuẩn xác (Tariff Unit Suffixes)",
            "applies": "Quan sát các ô nhập đơn giá dịch vụ tại BranchDrawer.",
            "block": "Không hiển thị nhãn chung chung hoặc thiếu đơn vị thời gian tính phí.",
            "system": "Tab Học phí theo năm hiển thị hậu tố cố định: 'đ/học sinh/ năm'. Tab Học phí theo tháng hiển thị hậu tố cố định: 'đ/học sinh/ tháng' với lề phải được căn chỉnh hợp lý.",
            "result": "Kế toán viên nhận diện ngay đơn vị tính phí mà không cần đọc lại ghi chú hướng dẫn."
        },
        {
            "id": "AC-08",
            "title": "Menu thao tác 3 chấm tự động mở ngược tránh che khuất (Smart Dropdown Direction)",
            "applies": "Người dùng nhấp vào menu '•••' trên các dòng ở cuối bảng Danh sách nhóm trường.",
            "block": "Cấm menu bị che khuất hoặc cắt cụt bởi đường viền đáy của khung bảng (table overflow-hidden).",
            "system": "Khi dòng có chỉ số idx ≥ Math.max(1, total - 2), menu tự động mở ngược hướng lên trên (bottom-10 origin-bottom-right) với z-index 40.",
            "result": "Toàn bộ 3 mục menu (Thêm chi nhánh, Chỉnh sửa nhóm, Gửi mật khẩu) hiển thị trọn vẹn 100% trên lớp trên cùng."
        },
        {
            "id": "AC-09",
            "title": "Cấp phát mật khẩu file đối soát & Pop-up xác nhận lồng (Password Delivery Modal)",
            "applies": "Người dùng thực hiện chức năng Gửi mật khẩu file đối soát tại PasswordDrawer.",
            "block": "Cấm pop-up xác nhận hiển thị lệch ra ngoài khung Right-Sheet hoặc bị đè bởi các layer khác.",
            "system": "Hỗ trợ đặt mật khẩu tự do không ràng buộc định dạng; hiển thị live preview To và Cc (edu@finviet...; phongketoan@finviet...). Bấm 'Gửi' mở pop-up xác nhận nằm gọn ở lớp trên cùng ngay giữa Right-Sheet (absolute inset-0 z-50). Sau khi gửi, menu vĩnh viễn đổi thành 'Cập nhật mật khẩu'.",
            "result": "Quy trình gửi mật khẩu diễn ra bảo mật, trực quan và thao tác tập trung ngay trong Right-Sheet."
        },
        {
            "id": "AC-10",
            "title": "Ngưỡng hoạt động tối thiểu dựa trên chuẩn 30 ngày/tháng (BR06 Threshold Guard)",
            "applies": "Động cơ quét tính phí học sinh trong phiên đối soát với ngưỡng thu M_threshold (tháng).",
            "block": "Không tính phí học sinh có tổng số ngày hoạt động ≤ M_threshold * 30 ngày.",
            "system": "Học sinh có số ngày hoạt động ≤ M_threshold * 30 ngày được gán isCharged = false, billedMonths = 0, thành tiền = 0đ (huy hiệu xám 'Không tính phí'). Học sinh có số ngày ≥ M_threshold * 30 + 1 ngày được tính phí (huy hiệu xanh 'Có tính phí').",
            "result": "Học sinh sử dụng dịch vụ dưới ngưỡng hợp đồng được miễn phí hoàn toàn theo đúng cam kết."
        },
        {
            "id": "AC-11",
            "title": "Quy tắc làm tròn ngày dư quy đổi số tháng thu phí (BR07 Surplus Day Rounding)",
            "applies": "Tính toán số tháng thu phí cho học sinh vượt ngưỡng với tham số làm tròn ngày dư D_surplus.",
            "block": "Không làm tròn lên tháng nếu số ngày dư nhỏ hơn ngưỡng D_surplus.",
            "system": "Nếu số ngày lẻ dư D_rem ≥ D_surplus: Làm tròn cộng thêm 1 tháng (M_billed = M_base + 1). Nếu D_rem < D_surplus: Giữ nguyên số tháng nguyên M_base.",
            "result": "Học sinh 132 ngày (dư 12 ngày ≥ 10 ngày) tính 5 tháng. Học sinh 128 ngày (dư 8 ngày < 10 ngày) tính 4 tháng."
        },
        {
            "id": "AC-12",
            "title": "Bộ chốt an toàn ngăn chặn phiên 0 VNĐ (MSG-01 Zero-Fee Blocker Guard)",
            "applies": "Bước 3 Wizard tạo phiên đối soát (Xem số liệu).",
            "block": "Nghiêm cấm tạo phiên nếu có bất kỳ chi nhánh nào trong lô đối soát có tổng tiền phải thu = 0 VNĐ.",
            "system": "Nếu có chi nhánh tổng tiền = 0đ: Hệ thống tự động khóa nút 'Tạo phiên' (disabled={true}), đồng thời hiển thị banner cảnh báo đỏ với thông điệp MSG-01.",
            "result": "Loại trừ 100% nguy cơ phát hành hóa đơn và biên bản rỗng gây sai lệch số liệu kế toán."
        },
        {
            "id": "AC-13",
            "title": "Khóa đóng băng Snapshot cấu hình bất biến (ADR-M6-001 Snapshot Lock)",
            "applies": "Phiên đối soát được tạo thành công ở SM2.",
            "block": "Cấm các thay đổi biểu phí hoặc ngưỡng thu ở SM1 làm thay đổi số liệu tài chính của phiên đã tạo.",
            "system": "Hệ thống đóng băng toàn bộ biểu phí vào Snapshot JSON bất biến. Màn hình chi tiết phiên hiển thị tab 'Cấu hình đã khóa' phản ánh chính xác biểu phí gốc.",
            "result": "Dữ liệu tài chính lịch sử được bảo vệ bất biến phục vụ công tác thanh tra và kiểm toán độc lập."
        },
        {
            "id": "AC-14",
            "title": "Máy trạng thái chuyển đổi vòng đời phiên đối soát (State Machine Flow)",
            "applies": "Vận hành phiên đối soát qua các trạng thái trong State Machine.",
            "block": "Cấm nhảy cóc trạng thái trái quy trình tài chính (ví dụ: từ Nháp nhảy thẳng lên Đã thanh toán).",
            "system": "Thực thi tuần tự: Nháp (DRAFT) → Gửi duyệt → Chờ duyệt (CHO_DUYET) → Duyệt phiên → Đã duyệt (APPROVED) → Gửi biên bản → Đã gửi trường (SENT_TO_SCHOOL) → Xác nhận thanh toán → Đã thanh toán (PAID). Hỗ trợ Hủy phiên và Từ chối.",
            "result": "Quy trình phê duyệt và thanh toán được kiểm soát chặt chẽ theo phân quyền."
        },
        {
            "id": "AC-15",
            "title": "Quyết toán phiên truy thu con từ phiên Đã thanh toán (Arrears Child Session)",
            "applies": "Người dùng mở menu thao tác của phiên đối soát ở trạng thái Đã thanh toán (PAID).",
            "block": "Không hiển thị nút 'Tạo phiên truy thu' trên các phiên chưa hoàn tất thanh toán.",
            "system": "Bấm 'Tạo phiên truy thu' khởi tạo phiên truy thu con (PHIÊN TRUY THU) gắn với chi nhánh cụ thể và hiển thị lồng phân cấp ngay dưới phiên gốc trong bảng danh sách.",
            "result": "Quản lý truy thu bổ sung rành mạch, bảo toàn liên kết với chứng từ thanh toán gốc."
        },
        {
            "id": "AC-16",
            "title": "Kiểm toán Log song song, cuộn đồng bộ và xuất Excel 2 Sheet (Audit Hub)",
            "applies": "Người dùng mở modal Danh sách học sinh và bật chế độ 'So sánh log'.",
            "block": "Không để xảy ra tình trạng cuộn lệch hoặc xuất file Excel thiếu trang tính đối chiếu.",
            "system": "Hiển thị chia đôi song song (bảng tính tiền vs bảng log quẹt thẻ). Bấm chọn học sinh bên trái: Học sinh nổi bật viền xanh, các dòng khác mờ đi (opacity-25), bảng log bên phải tự cuộn mượt đến đúng vị trí học sinh. Nút 'Xuất Excel' tạo tệp gồm 2 Sheet: Sheet 1 (Danh sách học sinh) và Sheet 2 (Đối chiếu lịch sử trạng thái).",
            "result": "Công tác kiểm toán, đối chiếu số liệu và giải trình với nhà trường đạt độ chính xác và minh bạch 100%."
        }
    ]

    for ac in acs:
        # Paragraph for spacing before: 360 twips (18 pt)
        p_ach = doc.add_paragraph()
        p_ach.paragraph_format.space_before = Pt(18)
        p_ach.paragraph_format.space_after = Pt(4)
        r_ach = p_ach.add_run(f"### {ac['id']}: {ac['title']}")
        r_ach.bold = True
        r_ach.font.size = Pt(11.5)
        r_ach.font.color.rgb = RGBColor(0x00, 0x70, 0xCE)

        tbl_ac = doc.add_table(rows=4, cols=2)
        tbl_ac.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(tbl_ac)

        ac_rows = [
            ("Điều kiện áp dụng", [ac["applies"]]),
            ("Điều kiện chặn", [ac["block"]]),
            ("Xử lý hệ thống", [ac["system"]]),
            ("Kết quả mong đợi", [ac["result"]])
        ]
        for r_i, (lbl, text_list) in enumerate(ac_rows):
            row = tbl_ac.rows[r_i]
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(5.0)
            set_cell_margins(row.cells[0], top=60, bottom=60, left=100, right=100)
            set_cell_margins(row.cells[1], top=60, bottom=60, left=100, right=100)
            set_cell_background(row.cells[0], "F8FAFC")
            format_cell_text(row.cells[0], [lbl], is_header=True)
            format_cell_text(row.cells[1], text_list)

    # Output paths
    output_files = [
        "PRD.docx",
        "docs/PRD_Doi_Soat_Module_M6.docx",
        "public/PRD.docx",
        "public/docs/PRD.docx"
    ]
    
    for out_path in output_files:
        os.makedirs(os.path.dirname(out_path) if os.path.dirname(out_path) else ".", exist_ok=True)
        doc.save(out_path)
        print(f"Generated: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    main()
