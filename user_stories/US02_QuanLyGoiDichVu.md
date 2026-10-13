# USER STORY: US02 - QUẢN LÝ GÓI DỊCH VỤ

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US02** |
| **Tên User Story** | Quản lý Gói dịch vụ |
| **Phân hệ (Module)** | Phân hệ 1: Master Data |
| **Use Case liên quan** | **UC02: Quản lý gói dịch vụ** |
| **Yêu cầu SRS** | **[FR-MD-02] Quản lý danh mục gói dịch vụ** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Tạo, chỉnh sửa và quản lý danh mục gói dịch vụ,
* **Để (So that):** Định nghĩa rõ quyền lợi, thời hạn và giá trị của từng gói, từ đó hỗ trợ đăng ký và thanh toán chính xác cho hội viên.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Mỗi phòng gym có nhiều gói sử dụng dịch vụ với các mức giá, thời hạn và quyền lợi khác nhau. Việc quản lý chính xác gói dịch vụ giúp xây dựng cấu trúc kinh doanh, hỗ trợ nhân viên lễ tân trong quá trình tư vấn và chăm sóc khách hàng, đồng thời giảm sai sót trong giao dịch.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-MD-02.1] Mã gói phải duy nhất:** Mỗi gói dịch vụ phải có mã định danh riêng.
* **[BR-MD-02.2] Giá và thời hạn bắt buộc:** Giá tiền và thời hạn sử dụng không được để trống.
* **[BR-MD-02.3] Không xóa gói đang được sử dụng:** Nếu gói đã có học viên đăng ký, chỉ được chuyển trạng thái `Không còn áp dụng`.
* **[BR-MD-02.4] Trạng thái gói:** Gói cần có trạng thái `Hoạt động` hoặc `Ngừng áp dụng`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo gói mới thành công
* **Given:** Quản lý đang ở màn hình quản lý gói dịch vụ.
* **When:** Nhập mã gói, tên, giá, thời hạn và lưu.
* **Then:** Hệ thống lưu gói thành công và hiển thị trong danh sách gói có sẵn.

### Kịch bản 2: Validate dữ liệu khi nhập sai
* **Given:** Quản lý đang tạo gói mới.
* **When:** Bỏ trống giá, thời hạn hoặc nhập mã trùng.
* **Then:** Hệ thống hiển thị thông báo lỗi rõ ràng và không lưu.

### Kịch bản 3: Chỉnh sửa gói đã có hội viên đăng ký
* **Given:** Gói đã có người sử dụng.
* **When:** Quản lý sửa tên hoặc đặc quyền.
* **Then:** Hệ thống cho phép cập nhật thông tin nhưng không xóa gói; nếu cần ngừng áp dụng thì chuyển trạng thái.

### Kịch bản 4: Tìm kiếm và lọc gói
* **Given:** Có nhiều loại gói trong hệ thống.
* **When:** Quản lý nhập từ khóa tên hoặc mã gói.
* **Then:** Hệ thống lọc danh sách đáp ứng đúng yêu cầu tìm kiếm.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `GOI_DICH_VU`:
  * `MaGoi` (VARCHAR(20), Primary Key)
  * `TenGoi` (NVARCHAR(255), Not Null)
  * `LoaiGoi` (NVARCHAR(50))
  * `GiaTien` (DECIMAL(18,0), Not Null)
  * `ThoiHanNgay` (INT, Not Null)
  * `MoTa` (NVARCHAR(MAX))
  * `TrangThai` (TINYINT: 1 - Hoạt động, 0 - Ngừng áp dụng)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM GOI_DICH_VU
WHERE MaGoi = @MaGoi;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có danh mục hội viên và vai trò quản lý.
* **Là tiền đề cho các User Story:**
  * **US03:** Đăng ký gói cho hội viên.
  * **US04:** Theo dõi hiệu lực gói.
  * **US11:** Báo cáo số lượng hội viên theo gói.
