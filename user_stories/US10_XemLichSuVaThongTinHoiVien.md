# USER STORY: US10 - XEM LỊCH SỬ & THÔNG TIN HỘI VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US10** |
| **Tên User Story** | Xem Lịch sử & Thông tin Hội viên |
| **Phân hệ (Module)** | Phân hệ 4: Tra cứu & Thống kê |
| **Use Case liên quan** | **UC10: Tra cứu hồ sơ hội viên** |
| **Yêu cầu SRS** | **[FR-REP-01] Tra cứu hồ sơ hội viên** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân, huấn luyện viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Xem hồ sơ và lịch sử hoạt động của hội viên,
* **Để (So that):** Cung cấp thông tin đầy đủ khi lên kế hoạch dịch vụ, chăm sóc khách hàng và xử lý sự cố liên quan đến hội viên.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Hồ sơ hội viên không chỉ là dữ liệu cơ bản mà còn là chuỗi lịch sử đăng ký gói, lớp, thanh toán và tương tác. Khi phục vụ khách hàng, nhân sự cần truy cập lịch sử này để hiểu đầy đủ nhu cầu, trạng thái và chính sách liên quan.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REP-10.1] Quyền truy cập theo vai trò:** Chỉ nhân sự có quyền mới được xem hồ sơ hội viên đầy đủ.
* **[BR-REP-10.2] Lịch sử phải đầy đủ:** Tất cả giao dịch hiệu lực, lớp, gia hạn và hủy bỏ cần được lưu.
* **[BR-REP-10.3] Không sửa lịch sử:** Dữ liệu lịch sử là nhật ký, không chỉnh sửa trực tiếp.
* **[BR-REP-10.4] Tìm kiếm nhanh:** Hệ thống hỗ trợ tìm theo mã, tên hoặc số điện thoại.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Xem thông tin cơ bản
* **Given:** Có hội viên trong hệ thống.
* **When:** Quản lý nhập mã hoặc tên hội viên và mở hồ sơ.
* **Then:** Hệ thống hiển thị thông tin cá nhân, trạng thái và gói hiện tại.

### Kịch bản 2: Xem lịch sử gói và lớp
* **Given:** Hội viên đã từng đăng ký lớp hoặc gói.
* **When:** Mở chi tiết hồ sơ.
* **Then:** Hệ thống hiển thị lịch sử đầy đủ theo thời gian.

### Kịch bản 3: Không cho phép sửa nhật ký lịch sử
* **Given:** Dữ liệu lịch sử đã được tạo.
* **When:** Người dùng cố sửa trực tiếp.
* **Then:** Hệ thống khóa thao tác và yêu cầu tạo bản ghi mới hoặc xử lý theo nghiệp vụ.

### Kịch bản 4: Tìm kiếm nhanh
* **Given:** Cơ sở dữ liệu có nhiều hội viên.
* **When:** Nhập mã hoặc tên.
* **Then:** Hệ thống trả về kết quả phù hợp trong thời gian ngắn.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `HOI_VIEN`:
  * `MaHoiVien` (VARCHAR(20), Primary Key)
  * `HoTen` (NVARCHAR(255))
  * `SoDienThoai` (VARCHAR(20))
  * `TrangThai` (TINYINT)
* Bảng `DANG_KY_GOI` / `DANG_KY_LOP`:
  * `MaDangKy`, `MaDangKyLop`, `NgayBatDau`, `NgayKetThuc`, `TrangThai`

### 6.2. Ràng buộc truy vấn
```sql
SELECT hv.*, dkg.*, dkl.*
FROM HOI_VIEN hv
LEFT JOIN DANG_KY_GOI dkg ON hv.MaHoiVien = dkg.MaHoiVien
LEFT JOIN DANG_KY_LOP dkl ON hv.MaHoiVien = dkl.MaHoiVien
WHERE hv.MaHoiVien = @MaHoiVien;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có hồ sơ hội viên, gói dịch vụ, đăng ký gói và lớp.
* **Là tiền đề cho các User Story:**
  * **US11:** Báo cáo theo gói / lớp dựa trên dữ liệu hội viên.
  * **US13:** Phân quyền truy cập hồ sơ.
