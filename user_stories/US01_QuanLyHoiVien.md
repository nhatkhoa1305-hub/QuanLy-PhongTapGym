# USER STORY: US01 - QUẢN LÝ HỘI VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US01** |
| **Tên User Story** | Quản lý Hội viên |
| **Phân hệ (Module)** | Phân hệ 1: Master Data |
| **Use Case liên quan** | **UC01: Quản lý hội viên** |
| **Yêu cầu SRS** | **[FR-MD-01] Quản lý thông tin hội viên** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân, huấn luyện viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Thêm, cập nhật, tìm kiếm và theo dõi hồ sơ hội viên,
* **Để (So that):** Quản lý được dữ liệu khách hàng, trạng thái sử dụng dịch vụ và hỗ trợ các nghiệp vụ đăng ký, thanh toán, lớp tập liên quan.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Hệ thống quản lý phòng gym cần lưu trữ hồ sơ hội viên đầy đủ và nhất quán để phục vụ cho mọi giao dịch từ đăng ký gói, đăng ký lớp, kiểm tra lịch sử và báo cáo. Mỗi hội viên cần có thông tin nhận diện, liên hệ, trạng thái hoạt động và lịch sử sử dụng dịch vụ để hỗ trợ quản lý hiệu quả.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-MD-01.1] Mã hội viên phải duy nhất:** Mỗi hội viên chỉ có một mã định danh duy nhất trong hệ thống.
* **[BR-MD-01.2] Trường bắt buộc:** Họ tên và số điện thoại phải được nhập trước khi lưu.
* **[BR-MD-01.3] Xóa mềm:** Không xóa hẳn dữ liệu hội viên nếu đã có giao dịch; chỉ chuyển sang trạng thái `Ngừng hoạt động`.
* **[BR-MD-01.4] Trạng thái hoạt động:** Hội viên có thể ở các trạng thái `Đang hoạt động`, `Tạm khóa`, `Ngừng hoạt động`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Thêm mới hội viên thành công
* **Given:** Quản lý đang ở màn hình quản lý hội viên.
* **When:** Quản lý nhập thông tin hợp lệ và bấm "Lưu".
* **Then:** Hệ thống lưu hồ sơ thành công, hiển thị thông báo "Thêm hội viên thành công" và hội viên xuất hiện trong danh sách.

### Kịch bản 2: Báo lỗi khi thiếu dữ liệu hoặc trùng mã
* **Given:** Quản lý đang ở form thêm hội viên.
* **When:** Nhập mã hội viên đã tồn tại hoặc bỏ trống họ tên / số điện thoại.
* **Then:** Hệ thống không lưu dữ liệu và hiển thị lỗi phù hợp.

### Kịch bản 3: Cập nhật thông tin hội viên
* **Given:** Hội viên đã tồn tại trong hệ thống.
* **When:** Quản lý chỉnh sửa thông tin cá nhân và lưu.
* **Then:** Dữ liệu cập nhật được lưu đầy đủ và lịch sử thay đổi được ghi nhận.

### Kịch bản 4: Tìm kiếm và lọc hội viên
* **Given:** Danh sách hội viên có nhiều bản ghi.
* **When:** Quản lý nhập tên, số điện thoại hoặc mã hội viên.
* **Then:** Hệ thống lọc kết quả theo thời gian thực và chỉ hiển thị hội viên phù hợp.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `HOI_VIEN`:
  * `MaHoiVien` (VARCHAR(20), Primary Key)
  * `HoTen` (NVARCHAR(255), Not Null)
  * `NgaySinh` (DATE)
  * `GioiTinh` (TINYINT)
  * `SoDienThoai` (VARCHAR(20), Not Null)
  * `Email` (VARCHAR(100))
  * `DiaChi` (NVARCHAR(255))
  * `TrangThai` (TINYINT: 1 - Đang hoạt động, 0 - Ngừng hoạt động)
  * `NgayTao` (DATETIME)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM HOI_VIEN
WHERE MaHoiVien = @MaHoiVien;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có cơ chế quản lý người dùng và vai trò.
* **Là tiền đề cho các User Story:**
  * **US03:** Đăng ký gói cho hội viên.
  * **US07:** Đăng ký lớp tập.
  * **US10:** Xem lịch sử và thông tin hội viên.
