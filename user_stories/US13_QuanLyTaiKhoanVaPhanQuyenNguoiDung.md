# USER STORY: US13 - QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN NGƯỜI DÙNG

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US13** |
| **Tên User Story** | Quản lý Tài khoản & Phân quyền Người dùng |
| **Phân hệ (Module)** | Phân hệ 4: Tra cứu & Thống kê |
| **Use Case liên quan** | **UC13: Quản lý tài khoản và phân quyền** |
| **Yêu cầu SRS** | **[FR-SEC-01] Quản lý người dùng và phân quyền** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân, huấn luyện viên, hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Tạo, cập nhật và phân quyền tài khoản người dùng,
* **Để (So that):** Mỗi vai trò chỉ được truy cập đúng phần chức năng cần thiết và bảo vệ dữ liệu hệ thống hiệu quả.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Hệ thống quản lý phòng gym bao gồm nhiều vai trò như quản lý, lễ tân, huấn luyện viên và hội viên. Nếu không kiểm soát quyền truy cập rõ ràng, dữ liệu nhạy cảm và thao tác nghiệp vụ có thể bị truy cập sai hoặc sửa nhầm. Vì vậy, quản lý tài khoản và phân quyền là chức năng điều kiện cần có.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-SEC-13.1] Username phải duy nhất:** Mỗi tài khoản chỉ có một tên đăng nhập duy nhất.
* **[BR-SEC-13.2] Vai trò bắt buộc:** Mỗi tài khoản phải thuộc ít nhất một vai trò hợp lệ.
* **[BR-SEC-13.3] Không xóa tài khoản đang hoạt động:** Chỉ được vô hiệu hóa hoặc khóa tài khoản nếu cần.
* **[BR-SEC-13.4] Mật khẩu phải tuân thủ chính sách:** Chiều dài tối thiểu, chữ hoa/số hoặc quy tắc bảo mật tương ứng.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo tài khoản mới thành công
* **Given:** Quản lý đang ở màn hình quản lý tài khoản.
* **When:** Nhập username, mật khẩu, vai trò và lưu.
* **Then:** Hệ thống tạo tài khoản mới và cho phép đăng nhập theo quyền tương ứng.

### Kịch bản 2: Báo lỗi khi username hoặc vai trò không hợp lệ
* **Given:** Username bị trùng hoặc không chọn vai trò.
* **When:** Bấm lưu.
* **Then:** Hệ thống hiển thị thông báo lỗi và không lưu.

### Kịch bản 3: Khóa hoặc vô hiệu hóa tài khoản
* **Given:** Tài khoản cần tạm dừng hoạt động.
* **When:** Quản lý thực hiện khóa tài khoản.
* **Then:** Hệ thống ngăn người dùng truy cập nhưng giữ dữ liệu và lịch sử đăng nhập.

### Kịch bản 4: Phân quyền theo vai trò
* **Given:** Một người dùng có vai trò quản lý hoặc nhân viên.
* **When:** Đăng nhập vào hệ thống.
* **Then:** Chỉ những chức năng thuộc phạm vi quyền của vai trò mới được hiển thị hoặc thao tác.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `NGUOI_DUNG`:
  * `MaUser` (VARCHAR(20), Primary Key)
  * `Username` (VARCHAR(50), Not Null, Unique)
  * `PasswordHash` (VARCHAR(255), Not Null)
  * `VaiTro` (VARCHAR(50), Not Null)
  * `TrangThai` (TINYINT)
  * `NgayTao` (DATETIME)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM NGUOI_DUNG
WHERE Username = @Username;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có module xác thực và danh sách vai trò hệ thống.
* **Là tiền đề cho các User Story:**
  * **US01–US12:** Quyền truy cập và phân quyền ảnh hưởng đến toàn bộ hệ thống.
  * **Tất cả giao dịch:** Chỉ vai trò phù hợp mới được thao tác dữ liệu quan trọng.
