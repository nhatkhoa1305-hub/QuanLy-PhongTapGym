# USER STORY: US07 - ĐĂNG KÝ LỚP TẬP CỦA HỘI VIÊN

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US07** |
| **Tên User Story** | Đăng ký Lớp tập của Hội viên |
| **Phân hệ (Module)** | Phân hệ 3: Đăng ký & Sức chứa |
| **Use Case liên quan** | **UC07: Đăng ký lớp tập** |
| **Yêu cầu SRS** | **[FR-REG-01] Đăng ký lớp tập** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Nhân viên lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Nhân viên lễ tân,
* **Tôi muốn (I want to):** Đăng ký hội viên vào lớp tập phù hợp,
* **Để (So that):** Hội viên có thể tham gia hoạt động thể thao theo lịch và đúng điều kiện của gói dịch vụ.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Đăng ký lớp tập là bước tiếp theo sau khi hội viên có gói hiệu lực. Để duy trì trải nghiệm và phòng ngừa xung đột lịch, hệ thống cần kiểm tra điều kiện gói, số chỗ còn trống và lịch học trước khi chấp nhận đăng ký.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REG-07.1] Gói phải hiệu lực:** Chỉ hội viên có gói còn hiệu lực mới được đăng ký lớp.
* **[BR-REG-07.2] Không đăng ký trùng:** Một hội viên không đăng ký cùng một lớp hai lần.
* **[BR-REG-07.3] Sức chứa tối đa:** Hệ thống không cho phép vượt quá số chỗ còn lại của lớp.
* **[BR-REG-07.4] Hệ thống xác nhận:** Khi thành công phải tạo bản ghi đăng ký mới và cập nhật số lượng đang tham gia.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Đăng ký lớp thành công
* **Given:** Hội viên có gói hiệu lực và lớp còn chỗ.
* **When:** Nhân viên chọn lớp và xác nhận đăng ký.
* **Then:** Hệ thống lưu bản ghi đăng ký và tăng số lượng học viên của lớp.

### Kịch bản 2: Từ chối khi không đủ điều kiện
* **Given:** Hội viên chưa có gói hiệu lực hoặc lớp đã đầy.
* **When:** Thực hiện đăng ký.
* **Then:** Hệ thống không lưu và hiển thị thông báo lỗi phù hợp.

### Kịch bản 3: Trùng đăng ký
* **Given:** Hội viên đã đăng ký lớp A.
* **When:** Cố đăng ký lại lớp A.
* **Then:** Hệ thống cảnh báo và chặn thao tác.

### Kịch bản 4: Xem danh sách đăng ký lớp
* **Given:** Hội viên có nhiều lớp đã đăng ký.
* **When:** Mở hồ sơ hội viên.
* **Then:** Hệ thống hiển thị danh sách các lớp đã tham gia và trạng thái đăng ký.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_LOP`:
  * `MaDangKyLop` (VARCHAR(20), Primary Key)
  * `MaHoiVien` (VARCHAR(20), Foreign Key -> HOI_VIEN)
  * `MaLop` (VARCHAR(20), Foreign Key -> LOP_TAP)
  * `NgayDangKy` (DATETIME)
  * `TrangThai` (TINYINT: 1 - Đã đăng ký, 0 - Đã hủy)
* Bảng `LOP_TAP`:
  * `SucChuaToiDa` (INT)
  * `SoLuongHienTai` (INT)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM DANG_KY_LOP
WHERE MaLop = @MaLop AND TrangThai = 1;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có gói dịch vụ, hội viên và lớp tập.
* **Là tiền đề cho các User Story:**
  * **US08:** Kiểm tra sức chứa & điều kiện đăng ký.
  * **US09:** Hủy hoặc cập nhật đăng ký lớp.
  * **US12:** Báo cáo lớp còn chỗ / đã đầy.
