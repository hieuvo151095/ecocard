# Master Index — Module Đối soát (M6)

Tài liệu nghiệp vụ cho module **Đối soát** của Eco Card Portal (https://eco-card-portal-dev.finviet.com.vn), gồm 2 sub-module:

| Mã | Sub-module | Tài liệu |
|---|---|---|
| SM1 | Cấu hình đối soát | [m6-sm1-cau-hinh-doi-soat.md](m6-sm1-cau-hinh-doi-soat.md) |
| SM2 | Phiên đối soát | [m6-sm2-phien-doi-soat.md](m6-sm2-phien-doi-soat.md) |

Template dùng chung: [_template.md](_template.md)

## Quan hệ giữa hai sub-module
SM2 (Phiên đối soát) phụ thuộc trực tiếp vào SM1 (Cấu hình đối soát): mỗi phiên đối soát được tạo dựa trên nhóm trường, chi nhánh, dịch vụ, biểu phí và lịch kỳ đã khai báo ở SM1, và snapshot ("khóa") lại toàn bộ cấu hình biểu phí đó vào phiên tại thời điểm tạo — các thay đổi cấu hình sau đó ở SM1 không ảnh hưởng ngược lại các phiên đã tạo.

## Những gì còn chưa rõ (Open Questions)

1. **Phân quyền theo vai trò**: Không quan sát được permission gate rõ ràng nào phân biệt vai trò Ops và Finance trong UI của module Đối soát — tài khoản test (thuan.le@finviet.com.vn) truy cập được toàn bộ chức năng của cả hai sub-module. Cần xác nhận với đội sản phẩm/nghiệp vụ ai là actor thực sự cho từng thao tác (VD: ai tạo phiên, ai duyệt phiên).
2. **Vòng đời duyệt phiên**: Hệ thống dev không có phiên nào đang ở trạng thái "Chờ duyệt" hoặc "Đã từ chối" nên chưa quan sát trực tiếp được màn hình/thao tác của "Người duyệt" (UC-10 trong tài liệu SM2), cũng như thông báo cụ thể khi duyệt/từ chối.
3. **Cơ chế ghi nhận "Đã thanh toán"**: Chưa quan sát được UI/thao tác nào chuyển trạng thái phiên từ "Đã gửi trường" sang "Đã thanh toán" — có thể là thao tác thủ công ở màn hình khác, tích hợp với hệ thống thanh toán, hoặc webhook từ bên ngoài.
4. **Nhãn "Đã nhả kết quả"**: Xuất hiện cùng badge "Đã hủy" trên một số phiên trong danh sách Phiên đối soát nhưng không nằm trong danh sách "Trạng thái phiên truy thu" thả xuống — ý nghĩa chính xác cần xác nhận với đội nghiệp vụ.
5. **Chặn cứng hay chỉ cảnh báo khi kỳ "Đã có phiên"**: Khi tạo phiên mới và chọn một kỳ đã có phiên tồn tại, hệ thống hiển thị nhãn "Đã có phiên" trong dropdown chọn kỳ, nhưng chưa thử chọn để xác nhận hệ thống có chặn hẳn hay vẫn cho tạo thêm.
6. **Tắt trạng thái nhóm/chi nhánh ở SM1** có ngăn tạo phiên đối soát mới cho nhóm/chi nhánh đó ở SM2 hay không — chưa thao tác trực tiếp (tránh ảnh hưởng dữ liệu thật trên môi trường dev).
7. **Liên kết tới hệ thống khác**: Không phát hiện liên kết trực tiếp tới hệ thống ngoài (VD: ECO Me wallet) trong phạm vi 2 sub-module đã khảo sát; module "Đối soát" có vẻ độc lập, chỉ phụ thuộc dữ liệu học sinh nội bộ của Eco Card Portal.

## Ghi chú phương pháp
- Tài liệu được xây dựng hoàn toàn qua quan sát UI trực tiếp trên môi trường dev (đăng nhập bằng tài khoản test), không submit dữ liệu sai/thiếu để "ép" hệ thống hiện lỗi.
- Các thao tác có khả năng thay đổi dữ liệu thật không thể hoàn tác dễ dàng (Gửi duyệt, Hủy phiên, Tạo phiên truy thu, Bật/Tắt trạng thái, Lưu form Tạo mới/Chỉnh sửa) đã được dừng lại ở bước xem trước/mở form và đóng lại bằng "Hủy", không bấm "Lưu"/xác nhận cuối cùng.
- Riêng bước "Xem số liệu" khi tạo phiên đối soát là thao tác chỉ-đọc (không tạo phiên thật) nên đã thực hiện để quan sát được thông báo lỗi/thành công thực tế (mục 3.4.2 trong tài liệu SM2).
