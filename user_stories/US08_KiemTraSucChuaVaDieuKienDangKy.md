# USER STORY: US08 - KIỂM TRA SỨC CHỨA & ĐIỀU KIỆN ĐĂNG KÝ

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US08** |
| **Tên User Story** | Kiểm tra Sức chứa & Điều kiện Đăng ký |
| **Phân hệ (Module)** | Phân hệ 3: Đăng ký & Sức chứa |
| **Use Case liên quan** | **UC08: Kiểm tra điều kiện đăng ký** |
| **Yêu cầu SRS** | **[FR-REG-02] Kiểm tra sức chứa và điều kiện** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Hệ thống / Nhân viên lễ tân |
| **Tác nhân phụ (Secondary Actor)** | Hội viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Hệ thống và nhân viên lễ tân,
* **Tôi muốn (I want to):** Kiểm tra điều kiện và sức chứa của lớp trước khi chấp nhận đăng ký,
* **Để (So that):** Tránh tình trạng đăng ký sai, lớp quá tải và không đáp ứng đúng chính sách hoạt động của phòng gym.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Không phải mọi hội viên đều có thể đăng ký mọi lớp cùng thời điểm. Hệ thống cần kiểm tra gói đang hiệu lực, số người hiện tại, thời gian lớp và các điều kiện phụ trợ để từ chối hoặc chấp nhận đúng lúc. Đây là lớp kiểm soát nghiệp vụ quan trọng nhất trong đăng ký.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REG-08.1] Sức chứa phải còn chỗ:** Số lượng hiện tại không được vượt quá sức chứa tối đa.
* **[BR-REG-08.2] Gói hiệu lực bắt buộc:** Chỉ hội viên có gói còn hiệu lực mới đủ điều kiện.
* **[BR-REG-08.3] Chặn trùng lớp:** Hệ thống kiểm tra xem hội viên đã tham gia lớp đó chưa.
* **[BR-REG-08.4] Cảnh báo thời gian thực:** Nếu lớp gần đầy, hệ thống hiển thị trạng thái `Sắp đầy`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Chấp nhận đăng ký khi đủ điều kiện
* **Given:** Hội viên có gói hiệu lực và lớp còn chỗ.
* **When:** Người dùng bấm đăng ký.
* **Then:** Hệ thống cho phép và lưu bản ghi đăng ký mới.

### Kịch bản 2: Từ chối khi lớp đã đầy
* **Given:** Tỷ lệ đăng ký đã đạt sức chứa tối đa.
* **When:** Hội viên thử đăng ký.
* **Then:** Hệ thống hiển thị "Lớp đã đầy" và không cho lưu.

### Kịch bản 3: Từ chối khi gói không hiệu lực
* **Given:** Hội viên đã hết hạn gói.
* **When:** Chọn lớp để đăng ký.
* **Then:** Hệ thống thông báo không đủ điều kiện sử dụng dịch vụ.

### Kịch bản 4: Xem trạng thái real-time
* **Given:** Có nhiều hội viên đang đăng ký cùng lúc.
* **When:** Người dùng xem danh sách lớp.
* **Then:** Hệ thống cập nhật còn chỗ theo thời gian thực hoặc gần như thực tế.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_LOP`:
  * `MaDangKyLop` (VARCHAR(20), Primary Key)
  * `MaHoiVien` (VARCHAR(20), Foreign Key -> HOI_VIEN)
  * `MaLop` (VARCHAR(20), Foreign Key -> LOP_TAP)
  * `TrangThai` (TINYINT)
* Bảng `LOP_TAP`:
  * `SucChuaToiDa` (INT)
  * `SoLuongHienTai` (INT)

### 6.2. Ràng buộc truy vấn
```sql
SELECT SoLuongHienTai, SucChuaToiDa
FROM LOP_TAP
WHERE MaLop = @MaLop;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu hội viên, gói dịch vụ, lớp tập và đăng ký lớp.
* **Là tiền đề cho các User Story:**
  * **US07:** Chấp nhận hoặc từ chối đăng ký lớp.
  * **US09:** Hủy / cập nhật đăng ký lớp do lớp đầy hoặc thay đổi điều kiện.
  * **US12:** Báo cáo lớp còn chỗ / đã đầy.
