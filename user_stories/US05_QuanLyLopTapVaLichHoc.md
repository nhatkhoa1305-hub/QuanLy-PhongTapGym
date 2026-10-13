# USER STORY: US05 - QUẢN LÝ LỚP TẬP & LỊCH HỌC

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US05** |
| **Tên User Story** | Quản lý Lớp tập & Lịch học |
| **Phân hệ (Module)** | Phân hệ 2: Lớp & Huấn luyện viên |
| **Use Case liên quan** | **UC05: Quản lý lớp tập** |
| **Yêu cầu SRS** | **[FR-CLS-01] Quản lý lớp tập và lịch học** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Huấn luyện viên, nhân viên lễ tân |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Tạo, cập nhật và quản lý lớp tập, lịch học và lịch trình của huấn luyện viên,
* **Để (So that):** Đảm bảo hoạt động của phòng gym được tổ chức rõ ràng, tối ưu sức chứa và phối hợp hiệu quả giữa huấn luyện viên và hội viên.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Phòng gym hoạt động theo nhiều loại lớp tập khác nhau như yoga, cardio, boxing, spinning... Mỗi lớp cần có lịch học, phòng tập, số lượng tối đa và giảng viên phụ trách rõ ràng để tránh xung đột thời gian và tối ưu sử dụng không gian.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-CLS-05.1] Mã lớp duy nhất:** Mỗi lớp phải có mã riêng.
* **[BR-CLS-05.2] Sức chứa tối thiểu:** Số lượng tối đa lớp không được nhỏ hơn 1.
* **[BR-CLS-05.3] Không trùng lịch:** Một giảng viên hoặc phòng tập không được bị phân công vào hai lớp cùng thời điểm.
* **[BR-CLS-05.4] Trạng thái lớp:** Lớp có thể ở trạng thái `Mở`, `Đã đầy`, `Bị hủy`, `Tạm ngưng`.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Tạo lớp mới thành công
* **Given:** Quản lý đang ở màn hình quản lý lớp tập.
* **When:** Nhập thông tin lớp, lịch học, sức chứa và người phụ trách, sau đó lưu.
* **Then:** Hệ thống lưu lớp mới và hiển thị trên danh sách lớp đang hoạt động.

### Kịch bản 2: Báo lỗi khi dữ liệu không hợp lệ
* **Given:** Quản lý nhập sức chứa âm hoặc lịch học trùng với lớp khác.
* **When:** Bấm lưu.
* **Then:** Hệ thống không lưu và hiển thị cảnh báo cụ thể.

### Kịch bản 3: Cập nhật lớp đã có đăng ký
* **Given:** Lớp đã có hội viên đăng ký.
* **When:** Quản lý thay đổi lịch học hoặc sức chứa.
* **Then:** Hệ thống cho phép cập nhật nhưng cảnh báo nếu thay đổi sẽ ảnh hưởng đến đăng ký hiện có.

### Kịch bản 4: Xem lịch học theo tuần
* **Given:** Có nhiều lớp trong hệ thống.
* **When:** Quản lý chọn xem theo tuần hoặc ngày.
* **Then:** Hệ thống hiển thị đầy đủ thời gian, phòng, giảng viên và tình trạng mỗi lớp.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `LOP_TAP`:
  * `MaLop` (VARCHAR(20), Primary Key)
  * `TenLop` (NVARCHAR(255), Not Null)
  * `MoTa` (NVARCHAR(MAX))
  * `SucChuaToiDa` (INT, Not Null)
  * `TrangThai` (TINYINT)
* Bảng `LICH_HOC`:
  * `MaLich` (VARCHAR(20), Primary Key)
  * `MaLop` (VARCHAR(20), Foreign Key -> LOP_TAP)
  * `NgayHoc` (DATE)
  * `GioBatDau` (TIME)
  * `GioKetThuc` (TIME)
  * `MaPhong` (VARCHAR(20))
  * `MaHLV` (VARCHAR(20))

### 6.2. Ràng buộc truy vấn
```sql
SELECT COUNT(1)
FROM LICH_HOC
WHERE MaHLV = @MaHLV
  AND NgayHoc = @NgayHoc
  AND (@GioBatDau < GioKetThuc AND @GioKetThuc > GioBatDau);
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có danh mục phòng tập và danh sách huấn luyện viên.
* **Là tiền đề cho các User Story:**
  * **US06:** Phân công huấn luyện viên cho lớp.
  * **US07:** Đăng ký lớp tập cho hội viên.
  * **US12:** Báo cáo lớp còn chỗ / đã đầy.
