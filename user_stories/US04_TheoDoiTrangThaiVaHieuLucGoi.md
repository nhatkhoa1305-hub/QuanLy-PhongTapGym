# USER STORY: US04 - THEO DÕI TRẠNG THÁI & HIỆU LỰC GÓI

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US04** |
| **Tên User Story** | Theo dõi Trạng thái & Hiệu lực Gói |
| **Phân hệ (Module)** | Phân hệ 1: Master Data |
| **Use Case liên quan** | **UC04: Theo dõi trạng thái gói** |
| **Yêu cầu SRS** | **[FR-OPS-02] Theo dõi hiệu lực gói** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân, hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Xem tình trạng hiệu lực của các gói đang được sử dụng,
* **Để (So that):** Phân biệt hội viên còn hiệu lực, sắp hết hạn và đã hết hạn để kịp thời hỗ trợ gia hạn hay nhắc nhở.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Việc theo dõi thời hạn gói giúp phòng gym duy trì sự ổn định trong hoạt động và tăng tỷ lệ giữ chân khách hàng. Khi hệ thống xác định trạng thái gói rõ ràng, quản lý và lễ tân có thể tương tác với hội viên kịp thời, tránh tình trạng miễn phí or không hợp lệ trong quá trình dịch vụ.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-OPS-04.1] Tự động cập nhật trạng thái:** Hệ thống phải cập nhật trạng thái gói dựa trên thời gian hiện tại.
* **[BR-OPS-04.2] Trạng thái bắt buộc:** Mỗi gói phải thuộc một trong các trạng thái `Hiệu lực`, `Sắp hết hạn`, `Hết hạn`.
* **[BR-OPS-04.3] Có cảnh báo:** Gói sắp hết hạn cần hiển thị thông báo nhắc nhở.
* **[BR-OPS-04.4] Không cho phép sử dụng gói hết hạn:** Nếu gói hết hạn, hệ thống không cho phép đăng ký lớp liên quan đến gói đó.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Theo dõi trạng thái gói trong dashboard
* **Given:** Có nhiều hội viên với các loại gói khác nhau.
* **When:** Quản lý mở dashboard.
* **Then:** Hệ thống hiển thị tổng số gói hiệu lực, sắp hết hạn và đã hết hạn.

### Kịch bản 2: Cảnh báo khi gói sắp hết hạn
* **Given:** Gói có thời hạn còn dưới 7 ngày.
* **When:** Quản lý hoặc lễ tân xem hồ sơ hội viên.
* **Then:** Hệ thống hiển thị cảnh báo "Gói sắp hết hạn" và đề xuất gia hạn.

### Kịch bản 3: Gói hết hạn bị khóa
* **Given:** Gói đã qua thời hạn.
* **When:** Hội viên cố gắng đăng ký lớp hoặc sử dụng quyền lợi.
* **Then:** Hệ thống từ chối và thông báo không đủ điều kiện do gói hết hạn.

### Kịch bản 4: Lịch sử hiệu lực
* **Given:** Một hội viên đã từng đổi gói hoặc gia hạn.
* **When:** Quản lý mở hồ sơ hội viên.
* **Then:** Hệ thống hiển thị đầy đủ chuỗi thời gian hiệu lực của từng gói.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_GOI`:
  * `MaDangKy` (VARCHAR(20), Primary Key)
  * `MaHoiVien` (VARCHAR(20), Foreign Key -> HOI_VIEN)
  * `MaGoi` (VARCHAR(20), Foreign Key -> GOI_DICH_VU)
  * `NgayBatDau` (DATETIME)
  * `NgayKetThuc` (DATETIME)
  * `TrangThai` (TINYINT)

### 6.2. Ràng buộc truy vấn
```sql
SELECT *
FROM DANG_KY_GOI
WHERE MaHoiVien = @MaHoiVien
  AND NgayBatDau <= GETDATE()
  AND NgayKetThuc >= GETDATE();
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu đăng ký gói và lịch sử thanh toán.
* **Là tiền đề cho các User Story:**
  * **US08:** Kiểm tra điều kiện đăng ký lớp.
  * **US10:** Hiển thị thông tin gói trong hồ sơ hội viên.
  * **US11:** Báo cáo theo gói và hiệu lực.
