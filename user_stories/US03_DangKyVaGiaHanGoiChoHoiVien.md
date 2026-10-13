# USER STORY: US03 - ĐĂNG KÝ & GIA HẠN GÓI CHO HỘI VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US03** |
| **Tên User Story** | Đăng ký & Gia hạn Gói cho Hội viên |
| **Phân hệ (Module)** | Phân hệ 1: Master Data |
| **Use Case liên quan** | **UC03: Đăng ký và gia hạn gói** |
| **Yêu cầu SRS** | **[FR-OPS-01] Đăng ký & gia hạn gói** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Nhân viên lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Quản lý phòng gym, hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI CUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Nhân viên lễ tân,
* **Tôi muốn (I want to):** Đăng ký mới hoặc gia hạn gói cho hội viên,
* **Để (So that):** Hội viên có thể sử dụng dịch vụ theo đúng thời hạn, quyền lợi và chính sách của phòng gym.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Quá trình đăng ký và gia hạn gói là giao dịch kinh doanh cốt lõi. Việc theo dõi thời gian bắt đầu, hết hạn và trạng thái gói giúp phòng gym kiểm soát quyền lợi, ngăn chặn vi phạm chính sách và hỗ trợ nhiều hoạt động khác như đăng ký lớp, thanh toán và báo cáo.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-OPS-03.1] Hội viên phải tồn tại:** Giao dịch chỉ được phép thực hiện nếu hội viên đã có hồ sơ hợp lệ.
* **[BR-OPS-03.2] Một gói đang hiệu lực:** Mỗi hội viên chỉ có một gói đang hoạt động tại một thời điểm, trừ trường hợp chính sách cho phép nhiều gói cùng lúc.
* **[BR-OPS-03.3] Ngày bắt đầu & hết hạn:** Hệ thống tính tự động thời hạn theo thời gian đăng ký và số ngày của gói.
* **[BR-OPS-03.4] Không gia hạn khi gói đã hết hạn:** Hệ thống yêu cầu xác nhận trạng thái hoặc tạo mới nếu gói đã kết thúc.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Đăng ký gói mới thành công
* **Given:** Hội viên chưa có gói đang hiệu lực.
* **When:** Nhân viên chọn hội viên và gói phù hợp, bấm xác nhận.
* **Then:** Hệ thống lưu thông tin đăng ký, tính ngày bắt đầu và ngày hết hạn, đồng thời cập nhật trạng thái gói.

### Kịch bản 2: Không cho phép đăng ký khi hội viên chưa đủ điều kiện
* **Given:** Hội viên không tồn tại hoặc đã có gói đang hiệu lực.
* **When:** Nhân viên thực hiện thao tác đăng ký.
* **Then:** Hệ thống từ chối và hiển thị thông báo rõ ràng.

### Kịch bản 3: Gia hạn gói thành công
* **Given:** Hội viên có gói đang hiệu lực nhưng sắp hết hạn.
* **When:** Nhân viên chọn gia hạn và xác nhận.
* **Then:** Thời hạn mới được cộng thêm đúng với chính sách và lịch sử gia hạn được ghi nhận.

### Kịch bản 4: Xem lịch sử đăng ký
* **Given:** Hội viên đã đăng ký gói trước đó.
* **When:** Nhân viên mở hồ sơ hội viên.
* **Then:** Hệ thống hiển thị lịch sử gói, thời gian từng lần đăng ký và trạng thái tương ứng.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_GOI`:
  * `MaDangKy` (VARCHAR(20), Primary Key)
  * `MaHoiVien` (VARCHAR(20), Foreign Key -> HOI_VIEN)
  * `MaGoi` (VARCHAR(20), Foreign Key -> GOI_DICH_VU)
  * `NgayBatDau` (DATETIME, Not Null)
  * `NgayKetThuc` (DATETIME, Not Null)
  * `TrangThai` (TINYINT: 1 - Hiệu lực, 0 - Hết hạn)
  * `NgayTao` (DATETIME)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM DANG_KY_GOI
WHERE MaHoiVien = @MaHoiVien AND TrangThai = 1;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có danh mục hội viên và gói dịch vụ.
* **Là tiền đề cho các User Story:**
  * **US04:** Theo dõi hiệu lực gói.
  * **US07:** Đăng ký lớp cho hội viên có gói hiệu lực.
  * **US10:** Xem lịch sử hội viên.
