# USER STORY: US09 - HỦY / CẬP NHẬT ĐĂNG KÝ LỚP

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US09** |
| **Tên User Story** | Hủy / Cập nhật Đăng ký lớp |
| **Phân hệ (Module)** | Phân hệ 3: Đăng ký & Sức chứa |
| **Use Case liên quan** | **UC09: Hủy / cập nhật đăng ký lớp** |
| **Yêu cầu SRS** | **[FR-REG-03] Hủy và cập nhật đăng ký lớp** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Nhân viên lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Nhân viên lễ tân,
* **Tôi muốn (I want to):** Hủy hoặc cập nhật đăng ký lớp của hội viên,
* **Để (So that):** Duy trì tình trạng lớp hợp lệ, cập nhật số lượng còn chỗ và hỗ trợ hội viên khi có thay đổi lịch trình.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Không phải lúc nào hội viên cũng giữ nguyên lịch học. Việc hủy hoặc cập nhật đăng ký cần được quản lý rõ ràng nhằm tránh sai sót trong doanh thu, số lượng lớp và báo cáo hoạt động. Hệ thống phải ghi nhận lịch sử thay đổi để bảo toàn tính minh bạch.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REG-09.1] Chỉ được hủy khi chưa diễn ra:** Hủy sau khi buổi học bắt đầu phải được xử lý theo quy định riêng.
* **[BR-REG-09.2] Cập nhật lịch sử:** Hệ thống phải lưu lịch sử hủy / cập nhật cùng thời gian thực hiện.
* **[BR-REG-09.3] Tăng lại sức chứa:** Khi hủy thành công, số lượng hiện tại của lớp phải giảm tương ứng.
* **[BR-REG-09.4] Không chặn cập nhật hợp lệ:** Nếu hội viên đổi sang lớp khác, hệ thống phải kiểm tra điều kiện mới trước khi chấp nhận.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Hủy đăng ký thành công
* **Given:** Hội viên đã đăng ký lớp nhưng muốn hủy trước khi buổi học diễn ra.
* **When:** Nhân viên thực hiện hủy.
* **Then:** Hệ thống cập nhật trạng thái đăng ký thành "Đã hủy" và giải phóng chỗ cho lớp.

### Kịch bản 2: Cảnh báo hủy sau giờ học
* **Given:** Buổi học đã bắt đầu hoặc gần hết.
* **When:** Hội viên yêu cầu hủy.
* **Then:** Hệ thống hiển thị cảnh báo theo chính sách và không tự động chấp nhận nếu không hợp lệ.

### Kịch bản 3: Chuyển lớp
* **Given:** Hội viên muốn đổi từ lớp A sang lớp B.
* **When:** Thực hiện cập nhật.
* **Then:** Hệ thống kiểm tra lớp mới, nếu đủ điều kiện thì cập nhật và giữ nguyên lịch sử cũ.

### Kịch bản 4: Xem lịch sử hủy/cập nhật
* **Given:** Một hội viên có nhiều thay đổi đăng ký trước đó.
* **When:** Mở hồ sơ hội viên hoặc báo cáo.
* **Then:** Hệ thống hiển thị thời gian, lý do và trạng thái của từng lần thay đổi.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_LOP`:
  * `MaDangKyLop` (VARCHAR(20), Primary Key)
  * `MaHoiVien` (VARCHAR(20), Foreign Key -> HOI_VIEN)
  * `MaLop` (VARCHAR(20), Foreign Key -> LOP_TAP)
  * `TrangThai` (TINYINT)
  * `NgayCapNhat` (DATETIME)
* Bảng `LICH_SU_DANG_KY`:
  * `MaLichSu` (VARCHAR(20), Primary Key)
  * `MaDangKyLop` (VARCHAR(20), Foreign Key -> DANG_KY_LOP)
  * `HanhDong` (NVARCHAR(50))
  * `NgayThucHien` (DATETIME)
  * `GhiChu` (NVARCHAR(MAX))

### 6.2. Ràng buộc truy vấn
```sql
UPDATE DANG_KY_LOP
SET TrangThai = 0,
    NgayCapNhat = GETDATE()
WHERE MaDangKyLop = @MaDangKyLop;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu đăng ký lớp và danh mục lớp tập.
* **Là tiền đề cho các User Story:**
  * **US08:** Cập nhật trạng thái thực tế khi lớp thay đổi.
  * **US10:** Hiển thị lịch sử hoạt động cho hội viên.
  * **US12:** Điều chỉnh báo cáo lớp còn chỗ / đã đầy.
