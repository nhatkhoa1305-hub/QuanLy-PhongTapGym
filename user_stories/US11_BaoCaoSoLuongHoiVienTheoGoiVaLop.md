# USER STORY: US11 - BÁO CÁO SỐ LƯỢNG HỘI VIÊN THEO GÓI / LỚP

---

## 1. THÔNG TIN CHUNG (METADATA)

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Mã User Story** | **US11** |
| **Tên User Story** | Báo cáo Số lượng Hội viên theo Gói / Lớp |
| **Phân hệ (Module)** | Phân hệ 4: Tra cứu & Thống kê |
| **Use Case liên quan** | **UC11: Báo cáo thống kê hội viên** |
| **Yêu cầu SRS** | **[FR-REP-02] Báo cáo số lượng theo gói / lớp** |
| **Độ ưu tiên (Priority)** | **Must-Have (Cao)** |
| **Tác nhân chính (Primary Actor)** | Quản lý phòng gym |
| **Tác nhân phụ (Secondary Actor)** | Nhân viên lễ tân |
| **Trạng thái (Status)** | Ready for Development |

---

## 2. NỘI DUNG USER STORY (STORY STATEMENT)

* **Là một (As a):** Quản lý phòng gym,
* **Tôi muốn (I want to):** Xem báo cáo số lượng hội viên theo từng gói và lớp,
* **Để (So that):** Đánh giá hiệu quả kinh doanh, nhận diện xu hướng sử dụng dịch vụ và đưa ra quyết định điều chỉnh chính sách.

---

## 3. BỐI CẢNH & MÔ TẢ NGHIỆP VỤ (BUSINESS CONTEXT)

Việc theo dõi số lượng hội viên theo gói và lớp giúp quản lý xác định gói nào đang ưu chuộng, lớp nào đang thu hút nhiều người và mốc thời gian nào mang lại hiệu quả cao nhất. Báo cáo này là dữ liệu nền cho kế hoạch marketing và quản lý nguồn lực.

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

* **[BR-REP-11.1] Dữ liệu thống kê dựa trên giao dịch hợp lệ:** Hệ thống chỉ tính các đăng ký có trạng thái đang hoạt động.
* **[BR-REP-11.2] Bộ lọc theo thời gian:** Người dùng có thể lọc theo ngày, tháng hoặc quý.
* **[BR-REP-11.3] Bảng hiển thị đồng bộ:** Mỗi gói và lớp phải có số lượng được tính tự động.
* **[BR-REP-11.4] Xuất báo cáo:** Dữ liệu có thể xuất ra Excel/PDF.

---

## 5. TIÊU CHÍ CHẤP NHẬN (ACCEPTANCE CRITERIA - AC)

### Kịch bản 1: Báo cáo số lượng theo gói
* **Given:** Hệ thống có dữ liệu đăng ký gói của nhiều hội viên.
* **When:** Quản lý chọn báo cáo theo gói.
* **Then:** Hệ thống hiển thị tổng số hội viên đang sử dụng từng gói.

### Kịch bản 2: Báo cáo số lượng theo lớp
* **Given:** Hệ thống có nhiều lớp và học viên đăng ký.
* **When:** Quản lý chọn báo cáo theo lớp.
* **Then:** Hệ thống hiển thị số lượng học viên đang tham gia từng lớp.

### Kịch bản 3: Lọc theo thời gian
* **Given:** Báo cáo cần xem trong tháng hoặc quý nhất định.
* **When:** Quản lý đặt lọc thời gian.
* **Then:** Hệ thống cập nhật dữ liệu thống kê theo mốc thời gian đã chọn.

### Kịch bản 4: Xuất báo cáo
* **Given:** Báo cáo đã được tạo.
* **When:** Quản lý bấm xuất file.
* **Then:** Hệ thống xuất báo cáo định dạng phù hợp và giữ nguyên dữ liệu thống kê.

---

## 6. ĐẶC TẢ KỸ THUẬT & DỮ LIỆU LIÊN QUAN (TECHNICAL & DATA SPECS)

### 6.1. Thực thể CSDL liên quan
* Bảng `DANG_KY_GOI` và `DANG_KY_LOP`.
* Các trường cần tổng hợp: `MaGoi`, `MaLop`, `TrangThai`, `NgayBatDau`, `NgayKetThuc`.

### 6.2. Ràng buộc truy vấn
```sql
SELECT MaGoi, COUNT(*) AS SoLuong
FROM DANG_KY_GOI
WHERE TrangThai = 1
GROUP BY MaGoi;
```

---

## 7. MỐI QUAN HỆ & ĐIỀU KIỆN TIÊN QUYẾT (TRACEABILITY & DEPENDENCIES)

* **Điều kiện tiên quyết:** Đã có dữ liệu hội viên, gói, lớp và đăng ký hợp lệ.
* **Là tiền đề cho các User Story:**
  * **US12:** Báo cáo lớp còn chỗ / đã đầy.
  * **US13:** Phân quyền xem báo cáo theo vai trò.
