# USER STORY: US12 - BÁO CÁO LỚP CÒN CHỖ / ĐÃ ĐẦY

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US12** |
| **Tên User Story** | Báo cáo Lớp còn chỗ / Đã đầy |
| **Phân hệ (Module)** | Phân hệ 4: Tra cứu & Thống kê |
| **Use Case liên quan** | **UC12: Theo dõi tình trạng lớp** |
| **Yêu cầu SRS** | **[FR-REP-03] Báo cáo sức chứa lớp** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Xem trạng thái lớp còn chỗ hoặc đã đầy,
* **Để (So that):** Có thể điều phối lịch học, nhận biết lớp cần mở thêm buổi hoặc giới hạn đăng ký theo chính sách.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Lớp tập có thể thay đổi số lượng người đăng ký theo thời gian. Việc cập nhật trạng thái còn chỗ / đã đầy giúp quản lý và lễ tân sắp xếp tư vấn hiệu quả, đồng thời hỗ trợ quyết định mở rộng hoặc tạm dừng lớp khi cần.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REP-12.1] Tính trạng thái theo số lượng hiện tại:** Hệ thống phải tính trạng thái dựa trên `SoLuongHienTai` và `SucChuaToiDa`.
* **[BR-REP-12.2] Lớp đầy = không còn chỗ:** Khi số lượng hiện tại bằng hoặc vượt sức chứa tối đa, lớp chuyển sang `Đã đầy`.
* **[BR-REP-12.3] Cảnh báo lớp sắp đầy:** Khi còn dưới 20% sức chứa, hệ thống hiển thị cảnh báo.
* **[BR-REP-12.4] Cập nhật theo thời gian thực:** Dữ liệu báo cáo phải cập nhật sau mỗi thao tác đăng ký / hủy.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Hiển thị trạng thái lớp
* **Given:** Có nhiều lớp với lượng học viên khác nhau.
* **When:** Quản lý mở báo cáo.
* **Then:** Hệ thống hiển thị rõ ràng từng lớp đang `Còn chỗ`, `Sắp đầy` hoặc `Đã đầy`.

### Kịch bản 2: Cảnh báo lớp sắp đầy
* **Given:** Lớp còn dưới 20% chỗ trống.
* **When:** Quản lý xem báo cáo.
* **Then:** Hệ thống hiển thị cảnh báo tương ứng.

### Kịch bản 3: Cập nhật khi có thay đổi đăng ký
* **Given:** Hội viên đăng ký hoặc hủy lớp.
* **When:** Thao tác hoàn tất.
* **Then:** Báo cáo cập nhật lại trạng thái mới của lớp.

### Kịch bản 4: Lọc theo ngày / buổi học
* **Given:** Hệ thống có nhiều lớp và nhiều ngày học.
* **When:** Quản lý chọn khung lọc.
* **Then:** Hệ thống hiển thị lớp theo đúng điều kiện thời gian.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `LOP_TAP`:
  * `MaLop`, `TenLop`, `SucChuaToiDa`, `SoLuongHienTai`, `TrangThai`
* Bảng `DANG_KY_LOP`: dữ liệu số lượng hiện tại của từng lớp.

### 6.2. Ràng buộc truy vấn
```sql
SELECT MaLop,
       SoLuongHienTai,
       SucChuaToiDa,
       CASE
           WHEN SoLuongHienTai >= SucChuaToiDa THEN 'DaDay'
           WHEN SoLuongHienTai / CAST(SucChuaToiDa AS float) >= 0.8 THEN 'SapDay'
           ELSE 'ConCho'
       END AS TrangThaiLop
FROM LOP_TAP;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu lớp học và đăng ký lớp.
* **Là tiền đề cho các User Story:**
  * **US11:** Tạo báo cáo tổng hợp theo gói / lớp.
  * **US13:** Phân quyền truy cập báo cáo.
