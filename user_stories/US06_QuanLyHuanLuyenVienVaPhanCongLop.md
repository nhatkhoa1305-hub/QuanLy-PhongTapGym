# USER STORY: US06 - QUẢN LÝ HUẤN LUYỆN VIÊN & PHÂN CÔNG LỚP

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US06** |
| **Tên User Story** | Quản lý Huấn luyện viên & Phân công lớp |
| **Phân hệ (Module)** | Phân hệ 2: Lớp & Huấn luyện viên |
| **Use Case liên quan** | **UC06: Quản lý huấn luyện viên** |
| **Yêu cầu SRS** | **[FR-CLS-02] Quản lý huấn luyện viên và phân công lớp** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Huấn luyện viên |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Quản lý hồ sơ huấn luyện viên và phân công lớp học cho từng người,
* **Để (So that):** Đảm bảo mỗi lớp đều có người phụ trách phù hợp, lịch dạy được sắp xếp hợp lý và hoạt động giảng dạy hiệu quả.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Một phòng gym cần nhiều huấn luyện viên với chuyên môn và lịch làm việc khác nhau. Nếu không quản lý tốt phân công lớp, hệ thống dễ xảy ra chồng lịch, thiếu người giảng, hoặc phân bổ không đều theo chuyên môn. Việc quản lý huấn luyện viên hợp lý là nền tảng cho chất lượng phục vụ.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-CLS-06.1] Mã huấn luyện viên duy nhất:** Mỗi huấn luyện viên phải có mã riêng.
* **[BR-CLS-06.2] Trường bắt buộc:** Họ tên và chuyên môn phải được nhập.
* **[BR-CLS-06.3] Không xếp chồng lịch:** Một huấn luyện viên không được phân công hai lớp đồng thời.
* **[BR-CLS-06.4] Trạng thái nhân sự:** Huấn luyện viên có thể là `Đang làm việc`, `Nghỉ phép`, `Ngừng hợp đồng`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Thêm mới huấn luyện viên thành công
* **Given:** Quản lý đang ở màn hình quản lý nhân sự.
* **When:** Nhập thông tin huấn luyện viên và lưu.
* **Then:** Hệ thống tạo hồ sơ mới và hiển thị trong danh sách huấn luyện viên.

### Kịch bản 2: Cảnh báo trùng lịch hoặc thiếu dữ liệu
* **Given:** Huấn luyện viên đã được phân công lớp trong cùng khung giờ hoặc dữ liệu thiếu.
* **When:** Quản lý lưu phân công.
* **Then:** Hệ thống không lưu và thông báo lỗi rõ ràng.

### Kịch bản 3: Thay đổi phân công lớp
* **Given:** Một huấn luyện viên đang phụ trách lớp A.
* **When:** Quản lý chuyển sang lớp B.
* **Then:** Hệ thống cập nhật phân công mới và ghi nhận lịch sử thay đổi.

### Kịch bản 4: Xem danh sách lớp theo huấn luyện viên
* **Given:** Có nhiều lớp và nhiều huấn luyện viên.
* **When:** Quản lý chọn từng huấn luyện viên.
* **Then:** Hệ thống hiển thị các lớp đang phụ trách và lịch học tương ứng.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `HUAN_LUYEN_VIEN`:
  * `MaHLV` (VARCHAR(20), Primary Key)
  * `HoTen` (NVARCHAR(255), Not Null)
  * `ChuyenMon` (NVARCHAR(255))
  * `SoDienThoai` (VARCHAR(20))
  * `Email` (VARCHAR(100))
  * `TrangThai` (TINYINT)
* Bảng `PHAN_CONG_LOP`:
  * `MaPhanCong` (VARCHAR(20), Primary Key)
  * `MaLop` (VARCHAR(20), Foreign Key -> LOP_TAP)
  * `MaHLV` (VARCHAR(20), Foreign Key -> HUAN_LUYEN_VIEN)
  * `NgayBatDau` (DATE)
  * `NgayKetThuc` (DATE)

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM PHAN_CONG_LOP pc
JOIN LICH_HOC lh ON pc.MaLop = lh.MaLop
WHERE pc.MaHLV = @MaHLV
  AND lh.NgayHoc = @NgayHoc
  AND (@GioBatDau < lh.GioKetThuc AND @GioKetThuc > lh.GioBatDau);
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có danh mục huấn luyện viên và lịch học lớp.
* **Là tiền đề cho các User Story:**
  * **US05:** Quản lý lịch học của lớp.
  * **US08:** Xác định điều kiện và khả năng đăng ký lớp.
  * **US12:** Báo cáo lớp còn chỗ / đã đầy theo staffing.
