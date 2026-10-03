# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)

## HỆ THỐNG QUẢN LÝ PHÒNG TẬP GYM (QLGym)
**Dự án:** Hệ thống Quản lý Phòng tập Gym (QLGym)  
**Môn học:** Phân tích và Thiết kế Hệ thống Thông tin  
**Tập trung giải pháp:** Quản lý Gói dịch vụ - Hiệu lực & Kiểm soát Sức chứa Lớp tập  
**Phiên bản:** 2.0 (Draft)  
**Ngày lập:** 03/10/2026  
**Vai trò soạn thảo:** Business Analyst (BA)

> **Quy ước:** nội dung gắn nhãn *(đề xuất)* là giả định của người phân tích, chưa được giảng viên/nghiệp vụ thực tế xác nhận.

---

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích
Tài liệu SRS này mô tả chi tiết các yêu cầu chức năng, phi chức năng, quy tắc nghiệp vụ, giao diện và mô hình dữ liệu cho **Hệ thống Quản lý Phòng tập Gym (QLGym)**. Tài liệu là căn cứ cho nhóm phát triển (Developers), kiểm thử (QA/QC), quản lý dự án (PM) và là sản phẩm phân tích chính trong môn Phân tích Thiết kế Hệ thống Thông tin.

### 1.2. Phạm vi hệ thống
Hệ thống là phần mềm quản lý dành cho phòng Gym quy mô nhỏ và vừa, hỗ trợ các hoạt động cơ bản: hội viên, gói dịch vụ, lớp tập, huấn luyện viên và việc đăng ký lớp của hội viên. Phạm vi tập trung vào:
- Quản lý danh mục hội viên, gói dịch vụ, huấn luyện viên và phòng học.
- Quản lý **hiệu lực và trạng thái của gói** (Hiệu lực / Tạm ngưng / Hết hạn), gồm đăng ký, gia hạn, tạm ngưng, kích hoạt lại.
- Quản lý lớp tập (lịch, phòng, HLV) và **kiểm soát sức chứa** theo số chỗ còn lại.
- Tự động kiểm tra điều kiện khi hội viên đăng ký lớp: gói còn hiệu lực, lớp còn chỗ, không đăng ký trùng.
- Tra cứu, thống kê, đăng nhập và phân quyền theo vai trò.

**Ngoài phạm vi (phiên bản hiện tại):**
- Thanh toán trực tuyến (việc thu tiền thực hiện tại quầy, ngoài hệ thống).
- Quản lý kho, quản lý thiết bị.
- Tính lương, chấm công nhân viên.
- Ứng dụng di động (native app).
- Các chức năng nâng cao chưa được yêu cầu.

Phạm vi có thể điều chỉnh nếu yêu cầu của giảng viên hoặc nghiệp vụ thực tế thay đổi.

### 1.3. Định nghĩa và Viết tắt
- **Gói dịch vụ (Package):** Loại gói phòng Gym cung cấp, gồm tên, giá, thời hạn (số ngày) và quyền lợi.
- **Đăng ký gói (Membership):** Một lần hội viên sử dụng một gói trong khoảng thời gian cụ thể (từ ngày bắt đầu đến ngày kết thúc).
- **Trạng thái gói:** Một trong ba giá trị: **Hiệu lực**, **Tạm ngưng**, **Hết hạn**.
- **Lớp tập (Class):** Lớp có HLV, phòng, lịch cố định hằng tuần và sức chứa tối đa.
- **Sức chứa (Capacity):** Số hội viên tối đa được đăng ký vào một lớp.
- **Số chỗ còn lại:** Sức chứa trừ số hội viên đang đăng ký lớp. Là giá trị tính toán, không nhập tay.
- **HLV:** Huấn luyện viên.
- **RBAC (Role-Based Access Control):** Phân quyền theo vai trò.
- **Audit Trail:** Nhật ký thao tác (ai, lúc nào, làm gì).
- **FR / NFR / BR / TC:** Yêu cầu chức năng / phi chức năng / quy tắc nghiệp vụ / test case.

### 1.4. Bối cảnh hoạt động thực tế (Business Context)
> Mô tả bối cảnh vận hành của một phòng Gym quy mô nhỏ/vừa làm cơ sở cho các yêu cầu. Cần đối chiếu lại khi khảo sát thực tế.

**Hiện trạng (as-is).** Phòng Gym ghi hội viên và gói tập bằng sổ hoặc file Excel. Lễ tân phải tra tay để biết hội viên còn hạn hay không; số người trong lớp được đếm thủ công. Hậu quả thường gặp:
- Lớp nhận quá số người cho phép.
- Hội viên hết hạn hoặc đang tạm ngưng vẫn vào lớp.
- Một hội viên bị ghi danh trùng một lớp.

**Hoạt động hằng ngày.**
1. **Khi có khách mới:** lễ tân tạo hồ sơ hội viên, tư vấn gói (ví dụ gói 1 tháng, 3 tháng, 12 tháng) và ghi nhận đăng ký gói. Việc thu tiền thực hiện tại quầy.
2. **Trong thời gian sử dụng:** hội viên có thể xin tạm ngưng gói (đi công tác, chấn thương...) và kích hoạt lại sau đó. Khi gói sắp hết hạn, hội viên quay lại gia hạn.
3. **Tổ chức lớp:** quản lý lập các lớp (Yoga, Zumba, Boxing...), gán HLV, phòng, lịch và sức chứa.
4. **Đăng ký lớp:** hội viên chọn lớp (tự đăng ký hoặc nhờ lễ tân). Chỉ hội viên có gói đang hiệu lực và lớp còn chỗ mới được ghi danh. Nếu không đi được, hội viên hủy để nhường chỗ.
5. **Theo dõi:** HLV xem danh sách hội viên của lớp mình phụ trách. Quản lý xem thống kê hội viên, tình trạng gói và mức lấp đầy của các lớp.

**Mục tiêu sau khi có hệ thống (to-be).** Hệ thống tự kiểm tra gói và sức chứa ở mọi lần đăng ký lớp, lưu lịch sử gói và đăng ký, giúp nhân viên không phải tra tay.

---

## 2. MÔ TẢ TỔNG QUAN (OVERALL DESCRIPTION)

### 2.1. Góc nhìn sản phẩm (Product Perspective)
Hệ thống vận hành theo kiến trúc Web-based client-server *(đề xuất)*, phục vụ nhân viên tại quầy, HLV và hội viên qua trình duyệt, dữ liệu lưu tập trung.

```
[Giao diện Web: Quản lý / Lễ tân / HLV / Hội viên] <---> [Backend API / Business Logic] <---> [Database Server]
                                                                    |
                                                                    +---> [Tiến trình định kỳ: cập nhật trạng thái Hết hạn]
```

Phiên bản hiện tại **không tích hợp** hệ thống bên ngoài (cổng thanh toán, thiết bị kiểm soát ra vào).

### 2.2. Đặc điểm Tác nhân Người dùng (User Characteristics)

| Tác nhân | Mức độ am hiểu CNTT | Tần suất sử dụng | Mục tiêu chính |
| :--- | :--- | :--- | :--- |
| **Quản lý phòng Gym** | Khá | Thường xuyên | Quản lý gói, lớp, HLV; xem thống kê vận hành; phân quyền tài khoản. |
| **Nhân viên lễ tân** | Trung bình | Liên tục | Tạo hội viên, đăng ký/gia hạn/tạm ngưng gói, hỗ trợ đăng ký lớp nhanh; biết ngay hội viên còn hạn hay không mà không phải tính tay. |
| **Huấn luyện viên** | Cơ bản - Trung bình | Theo lịch lớp | Xem lớp được phân công và danh sách hội viên đã đăng ký. |
| **Hội viên** | Cơ bản | Thỉnh thoảng | Xem gói của mình, xem lịch lớp và số chỗ còn lại, đăng ký/hủy lớp. |

Ngoài ra có tác nhân **Hệ thống** (tiến trình tự động): xác định gói Hết hạn và kiểm tra điều kiện khi đăng ký lớp.

### 2.3. Ràng buộc Thiết kế và Cài đặt (Design & Implementation Constraints)
1. **Ràng buộc sức chứa:** số hội viên đang đăng ký một lớp không bao giờ vượt sức chứa của lớp:
   $$SoDangKy(Lop) \le SucChua(Lop) \quad\Rightarrow\quad SoChoConLai = SucChua - SoDangKy \ge 0$$
   Số chỗ còn lại là giá trị **tính toán** từ bảng đăng ký lớp, không lưu thành cột để tránh lệch số.
2. **Ràng buộc gói:** chỉ gói ở trạng thái **Hiệu lực** mới được dùng để đăng ký lớp. Gói Tạm ngưng và Hết hạn bị chặn.
3. **Ràng buộc lịch sử:** dữ liệu đã phát sinh đăng ký (hội viên, gói, lớp) không bị xóa vật lý; chỉ chuyển sang trạng thái ngừng hoạt động hoặc hủy.
4. **Ràng buộc thời gian:** "ngày hiện tại" tính theo múi giờ Việt Nam (UTC+7), chỉ xét theo ngày (không xét giờ) đối với hiệu lực gói.

### 2.4. Nghiệp vụ trọng tâm
Ba nội dung cần đặc biệt chú ý khi thiết kế và kiểm thử: **(1) gói dịch vụ, (2) trạng thái và hiệu lực của gói, (3) sức chứa lớp**. Luồng tổng quát:

```text
Hội viên → Có gói dịch vụ → Kiểm tra trạng thái gói
                                   │
                    Gói Hiệu lực? ─┼─ Không → Từ chối đăng ký
                                   │ Có
                                   ▼
                      Chọn lớp → Kiểm tra sức chứa
                                   │
                       Còn chỗ? ───┼─ Không → Từ chối đăng ký
                                   │ Có
                                   ▼
                     Đăng ký lớp → Cập nhật số chỗ còn lại
```

---

## 3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 3.1. Phân hệ 1: Quản lý Danh mục (Master Data)

#### [FR-MD-01] Quản lý Hội viên
- **Mô tả:** Lễ tân/Quản lý thêm, sửa, xem, tìm kiếm hội viên và theo dõi trạng thái hội viên.
- **Dữ liệu bắt buộc:** Họ tên, Số điện thoại. **Tùy chọn:** Ngày sinh, Giới tính, Email. Hệ thống tự sinh Mã hội viên, Ngày tham gia (mặc định là ngày tạo), Trạng thái (mặc định *Hoạt động*).
- **Quy tắc nghiệp vụ:**
  - `BR-MD-01`: Số điện thoại là định danh hội viên, **không được trùng** *(đề xuất)*. Nếu trùng, hệ thống báo "Hội viên đã tồn tại" và hiển thị hồ sơ cũ.
  - `BR-MD-02`: Không xóa vật lý hội viên đã phát sinh đăng ký; chỉ chuyển trạng thái *Ngừng hoạt động*.

#### [FR-MD-02] Quản lý Gói dịch vụ
- **Mô tả:** Quản lý tạo, sửa, xem gói; quản lý giá, thời hạn, quyền lợi và theo dõi các gói đang cung cấp.
- **Dữ liệu bắt buộc:** Tên gói, Giá (> 0), Thời hạn tính theo **số ngày** (> 0). **Tùy chọn:** Quyền lợi.
- **Ví dụ minh họa:** `Gói 1 tháng` = 30 ngày; `Gói 3 tháng` = 90 ngày; `Gói 12 tháng` = 360 ngày.
- **Quy tắc nghiệp vụ:**
  - `BR-MD-03`: Thay đổi giá/thời hạn của gói chỉ áp dụng cho **đăng ký mới**; các đăng ký cũ giữ nguyên ngày kết thúc và giá đã ghi nhận.
  - `BR-MD-04`: Gói *Ngừng cung cấp* không được dùng để đăng ký hoặc gia hạn mới.

#### [FR-MD-03] Quản lý Huấn luyện viên
- **Mô tả:** Quản lý thêm, sửa, xem HLV và chuyên môn; xem các lớp HLV đang phụ trách.
- **Dữ liệu bắt buộc:** Họ tên, Số điện thoại, Chuyên môn (ví dụ Yoga, Boxing).

#### [FR-MD-04] Quản lý Phòng học
- **Mô tả:** Quản lý danh mục phòng tập dùng cho lớp.
- **Dữ liệu bắt buộc:** Tên phòng, Sức chứa phòng (số nguyên dương). Sức chứa phòng là giới hạn trên của sức chứa lớp (xem `BR-CLS-01`).

---

### 3.2. Phân hệ 2: Quản lý Gói & Hiệu lực (Membership Lifecycle)

**Vòng đời của một đăng ký gói:**

```text
 (đăng ký gói)
      │
      ▼
 ┌──────────┐   tạm ngưng    ┌───────────┐
 │ Hiệu lực │ ─────────────► │ Tạm ngưng │
 │          │ ◄───────────── │           │
 └──────────┘  kích hoạt lại └───────────┘
      │
      │ NgayHienTai > NgayKetThuc
      ▼
 ┌──────────┐
 │ Hết hạn  │ ── gia hạn ──► quay lại Hiệu lực
 └──────────┘
```

| Từ | Sự kiện | Đến | Điều kiện |
| :--- | :--- | :--- | :--- |
| (mới) | Đăng ký gói | Hiệu lực | Hội viên chưa có gói Hiệu lực/Tạm ngưng |
| Hiệu lực | Tạm ngưng | Tạm ngưng | Gói chưa hết hạn |
| Tạm ngưng | Kích hoạt lại | Hiệu lực | Gói đang Tạm ngưng *(điều kiện chi tiết: TBD)* |
| Hiệu lực | Qua ngày kết thúc | Hết hạn | Tự động |
| Hiệu lực / Hết hạn | Gia hạn | Hiệu lực | Xem `FR-PKG-02` |
| Tạm ngưng | Gia hạn | - | Không cho phép, phải kích hoạt lại trước *(đề xuất)* |

#### [FR-PKG-01] Đăng ký Gói cho Hội viên
- **Mô tả:** Lễ tân chọn hội viên và gói; hệ thống tính ngày kết thúc và tạo đăng ký gói ở trạng thái *Hiệu lực*.
- **Dữ liệu nhập:** Hội viên, Gói dịch vụ. **Ngày bắt đầu** mặc định là ngày đăng ký (ngày hiện tại); phiên bản này không cho chọn ngày tương lai để tránh phát sinh trạng thái "chưa bắt đầu" *(đề xuất)*.
- **Công thức:** gói có hiệu lực trong khoảng $[NgayBatDau,\ NgayKetThuc]$ (gồm cả hai đầu):
  $$NgayKetThuc = NgayBatDau + ThoiHanNgay - 1$$
  *Ví dụ:* Gói 30 ngày, bắt đầu `03/10/2026` $\rightarrow$ kết thúc `01/11/2026`.
- **Quy trình xử lý:**
  1. Xác định hội viên $H$ và gói $P$. Hội viên phải *Hoạt động*; gói phải *Đang cung cấp* (`BR-MD-04`).
  2. Kiểm tra $H$ chưa có đăng ký gói ở trạng thái *Hiệu lực* hoặc *Tạm ngưng*. Nếu đã có, từ chối và gợi ý dùng Gia hạn (`FR-PKG-02`).
  3. Tính `NgayKetThuc` theo công thức trên; ghi nhận `GiaDangKy` = giá hiện tại của gói (`BR-MD-03`).
  4. Lưu đăng ký gói với trạng thái *Hiệu lực*, ghi nhật ký (người thực hiện, thời gian).
- **Quy tắc nghiệp vụ:**
  - `BR-PKG-01`: Một hội viên có thể có **nhiều lần** đăng ký gói theo thời gian; mỗi lần phải có ngày bắt đầu và ngày kết thúc.
  - `BR-PKG-03`: Tại một thời điểm, mỗi hội viên có **tối đa một** đăng ký gói ở trạng thái Hiệu lực hoặc Tạm ngưng *(đề xuất)*.

#### [FR-PKG-02] Gia hạn Gói
- **Mô tả:** Lễ tân gia hạn gói cho hội viên đang có gói Hiệu lực hoặc Hết hạn.
- **Dữ liệu nhập:** Hội viên, gói gia hạn (mặc định là gói hiện tại).
- **Công thức** *(đề xuất)*:
  - Gói còn Hiệu lực: $NgayKetThucMoi = NgayKetThucCu + ThoiHanNgay$.
  - Gói đã Hết hạn: $NgayKetThucMoi = NgayGiaHan + ThoiHanNgay - 1$ (tính lại từ ngày gia hạn).
- **Ví dụ:** Gói kết thúc `01/11/2026`, gia hạn thêm gói 30 ngày $\rightarrow$ kết thúc mới `01/12/2026`.
- **Quy trình xử lý:** chọn hội viên $\rightarrow$ xem đăng ký gói gần nhất $\rightarrow$ chọn gói gia hạn $\rightarrow$ hệ thống tính ngày kết thúc mới $\rightarrow$ xác nhận $\rightarrow$ cập nhật `NgayKetThuc`, đặt trạng thái *Hiệu lực*, lưu bản ghi gia hạn (ngày kết thúc cũ/mới, người thực hiện).
- **Lỗi:** hội viên chưa từng có gói $\rightarrow$ chuyển sang `FR-PKG-01`; gói đang Tạm ngưng $\rightarrow$ yêu cầu kích hoạt lại trước; gói chọn đã Ngừng cung cấp $\rightarrow$ chọn gói khác.

#### [FR-PKG-03] Xác định Trạng thái & Tự động Hết hạn
- **Mô tả:** Hệ thống luôn xác định đúng trạng thái gói, hiển thị ngày bắt đầu, ngày kết thúc và phân biệt ba trạng thái.
- **Công thức** (`BR-PKG-02`):
  $$TrangThai = \begin{cases} \text{Tạm ngưng} & \text{nếu gói đang bị tạm ngưng} \\ \text{Hết hạn} & \text{nếu } NgayHienTai > NgayKetThuc \\ \text{Hiệu lực} & \text{ngược lại} \end{cases}$$
- **Cơ chế:** tiến trình định kỳ chạy mỗi ngày (ví dụ 00:05) chuyển *Hiệu lực* $\rightarrow$ *Hết hạn* khi quá ngày kết thúc. Khi kiểm tra điều kiện đăng ký lớp, hệ thống **vẫn so sánh ngày trực tiếp**, không phụ thuộc kết quả của tiến trình để tránh sai lệch khi tiến trình chạy trễ.
- **Quy tắc nghiệp vụ:**
  - `BR-PKG-02`: Gói chỉ ở một trong ba trạng thái Hiệu lực, Tạm ngưng, Hết hạn.
  - `BR-PKG-04`: Gói **Tạm ngưng** không được dùng cho nghiệp vụ yêu cầu gói đang hoạt động.
  - `BR-PKG-05`: Gói **Hết hạn** không được dùng để đăng ký lớp.

#### [FR-PKG-04] Tạm ngưng Gói
- **Mô tả:** Quản lý/Lễ tân chuyển gói đang Hiệu lực sang Tạm ngưng.
- **Dữ liệu nhập:** Hội viên, Lý do. Hệ thống ghi **Ngày tạm ngưng** (ngày hiện tại).
- **Ràng buộc:** gói đã Hết hạn không được tạm ngưng; gói đã Tạm ngưng không tạm ngưng lần nữa. Gói Tạm ngưng không dùng được để đăng ký lớp mới (`BR-PKG-04`). Số phận các lớp hội viên đã đăng ký trước đó: *giữ nguyên, chỉ chặn đăng ký mới* *(đề xuất)*.

#### [FR-PKG-05] Kích hoạt lại Gói
- **Mô tả:** Quản lý/Lễ tân chuyển gói Tạm ngưng về Hiệu lực khi đủ điều kiện.
- **Công thức** *(đề xuất: bù số ngày đã tạm ngưng)*:
  $$SoNgayTamNgung = NgayKichHoatLai - NgayTamNgung \qquad NgayKetThucMoi = NgayKetThucCu + SoNgayTamNgung$$
- **Ví dụ:** Gói kết thúc `01/11/2026`, tạm ngưng `10/10/2026`, kích hoạt lại `20/10/2026` $\rightarrow$ 10 ngày $\rightarrow$ kết thúc mới `11/11/2026`.
- **Ràng buộc:** chỉ kích hoạt lại gói đang Tạm ngưng; ghi `NgayKichHoatLai` vào lịch sử tạm ngưng.

#### [FR-PKG-06] Xem Gói đang sử dụng & Lịch sử
- **Mô tả:** Quản lý/Lễ tân xem gói hiện tại của hội viên (ngày bắt đầu, ngày kết thúc, trạng thái) và toàn bộ lịch sử đăng ký, gia hạn, tạm ngưng theo thời gian.

---

### 3.3. Phân hệ 3: Quản lý Lớp tập (Class Management)

#### [FR-CLS-01] Tạo & Cập nhật Lớp tập
- **Mô tả:** Quản lý (hoặc Lễ tân nếu được phân quyền) tạo và cập nhật lớp, thiết lập lịch, phòng, HLV và sức chứa tối đa.
- **Dữ liệu bắt buộc:** Tên lớp, HLV phụ trách, Phòng học, Thứ trong tuần, Giờ bắt đầu, Giờ kết thúc, Sức chứa tối đa. **Tùy chọn:** Mô tả. Lớp mới có trạng thái *Đang mở*, số chỗ còn lại bằng sức chứa.
- **Quy tắc nghiệp vụ:**
  - `BR-CLS-01`: Mỗi lớp có một sức chứa tối đa là số nguyên dương và **không vượt sức chứa của phòng học** được gán *(phần "không vượt phòng" là đề xuất)*.
  - `BR-CLS-02`: Một HLV có thể phụ trách nhiều lớp nhưng **không trùng giờ**. Phòng học cũng không được trùng giờ *(đề xuất)*. Hai lớp trùng giờ khi cùng *Thứ* và:
    $$GioBatDau_1 < GioKetThuc_2 \ \land\ GioBatDau_2 < GioKetThuc_1$$
  - `BR-CLS-03`: Giờ kết thúc phải sau giờ bắt đầu.
  - `BR-CLS-04`: Không được giảm sức chứa xuống thấp hơn số hội viên đang đăng ký *(đề xuất)*.

#### [FR-CLS-02] Phân công HLV & Xem lớp phụ trách
- **Mô tả:** Gán/đổi HLV cho lớp (có kiểm tra `BR-CLS-02`); HLV xem danh sách lớp mình phụ trách và danh sách hội viên của từng lớp.

#### [FR-CLS-03] Đóng/Mở Đăng ký & Ngừng Lớp
- **Mô tả:** Quản lý chuyển trạng thái lớp: *Đang mở* $\leftrightarrow$ *Đã đóng đăng ký*, hoặc *Ngừng*. Lớp không ở trạng thái *Đang mở* thì không nhận đăng ký mới. Lớp ngừng vẫn giữ lịch sử đăng ký (`BR-MD-02`).

---

### 3.4. Phân hệ 4: Đăng ký Lớp & Kiểm soát Sức chứa (Class Registration)

#### [FR-REG-01] Xem Lịch lớp & Số chỗ còn lại
- **Mô tả:** Hội viên và nhân viên xem danh sách lớp: tên lớp, thời gian, phòng, HLV, số chỗ còn lại.
- **Công thức:**
  $$SoChoConLai = SucChua - \sum DangKyLop\,(TrangThai = \text{Đang đăng ký})$$
  Hiển thị dạng `Còn X/Y chỗ`; khi $SoChoConLai = 0$ hiển thị **Đã đầy**.

#### [FR-REG-02] Đăng ký Lớp với Kiểm tra Điều kiện (Core Functional Requirement)
- **Mô tả:** Khi hội viên bấm Đăng ký, hệ thống kiểm tra toàn bộ điều kiện theo đúng thứ tự dưới đây và chỉ ghi nhận khi tất cả đều hợp lệ.
- **Dữ liệu vào:** Mã hội viên (lấy từ tài khoản, hoặc do lễ tân chọn), Mã lớp.
- **Quy trình xử lý:**
  1. **Kiểm tra hội viên và lớp:**
     - Hội viên $H$ phải tồn tại và *Hoạt động*, nếu không $\rightarrow$ lỗi **E1**.
     - Lớp $C$ phải tồn tại và *Đang mở*, nếu không $\rightarrow$ lỗi **E2**.
  2. **Xác định gói của $H$:**
     $$G = \{ g \mid g.MaHV = H \ \land\ g.TrangThai \in \{\text{Hiệu lực},\ \text{Tạm ngưng}\} \}$$
     - Nếu $G = \emptyset$: xét đăng ký gói gần nhất của $H$. Không có bản ghi nào $\rightarrow$ lỗi **E3**; có bản ghi (đã Hết hạn) $\rightarrow$ lỗi **E4b**.
     - Nếu gói thuộc $G$ đang *Tạm ngưng* $\rightarrow$ lỗi **E4a**.
     - Nếu gói *Hiệu lực*: kiểm tra trực tiếp $NgayHienTai \le NgayKetThuc$; nếu vi phạm $\rightarrow$ lỗi **E4b**.
  3. **Kiểm tra đăng ký trùng:** tồn tại đăng ký lớp của $H$ vào $C$ ở trạng thái *Đang đăng ký* $\rightarrow$ lỗi **E5** (`BR-REG-03`).
  4. **Kiểm tra sức chứa và ghi nhận (trong một transaction):**
     - Khóa bản ghi lớp $C$ để các thao tác đăng ký cùng lúc xếp hàng tuần tự.
     - Tính $SoDangKy$ = số đăng ký *Đang đăng ký* của $C$.
     - Nếu $SoDangKy \ge SucChua_C$ $\rightarrow$ lỗi **E6**, rollback.
     - Ngược lại: tạo bản ghi đăng ký lớp (trạng thái *Đang đăng ký*, kèm gói đã dùng), ghi nhật ký, commit.
  5. Thông báo đăng ký thành công kèm thông tin lớp; số chỗ còn lại giảm 1.
- **Thứ tự kiểm tra** là: danh tính $\rightarrow$ lớp $\rightarrow$ gói $\rightarrow$ trùng lặp $\rightarrow$ sức chứa. Sức chứa đặt cuối để hội viên nhận đúng nguyên nhân (không bị báo "lớp đầy" khi thực ra gói đã hết hạn).
- **Bảng lỗi và thông báo gợi ý:**

| Mã | Điều kiện | Thông báo |
| :--- | :--- | :--- |
| E1 | Hội viên không tồn tại / ngừng hoạt động | "Không tìm thấy hội viên hợp lệ" |
| E2 | Lớp không tồn tại / không mở đăng ký | "Lớp không mở đăng ký" |
| E3 | Hội viên chưa từng có gói | "Hội viên chưa đăng ký gói dịch vụ" |
| E4a | Gói đang Tạm ngưng | "Gói đang tạm ngưng, không thể đăng ký lớp" |
| E4b | Gói đã Hết hạn | "Gói đã hết hạn, vui lòng gia hạn" |
| E5 | Đã đăng ký lớp này | "Bạn đã đăng ký lớp này" |
| E6 | Lớp đã đầy | "Lớp đã đầy" |

- **Quy tắc nghiệp vụ:**
  - `BR-REG-01`: Số hội viên đăng ký không được vượt sức chứa của lớp.

#### [FR-REG-03] Hủy Đăng ký Lớp
- **Mô tả:** Hội viên hủy đăng ký để nhường chỗ.
- **Quy trình xử lý:** chọn đăng ký cần hủy $\rightarrow$ xác nhận $\rightarrow$ trong một transaction: đổi trạng thái sang *Đã hủy*, ghi thời gian hủy, ghi nhật ký $\rightarrow$ số chỗ còn lại tăng 1 (tự cập nhật do công thức ở `FR-REG-01`).
- **Quy tắc nghiệp vụ:**
  - `BR-REG-02`: Khi hủy đăng ký, số chỗ còn lại của lớp phải được cập nhật.
  - `BR-REG-03`: Không đăng ký trùng chỉ xét các bản ghi *Đang đăng ký*; hội viên đã hủy vẫn đăng ký lại được nếu lớp còn chỗ.
  - `BR-REG-04`: Hội viên chỉ được hủy đăng ký của **chính mình** *(đề xuất)*.
- **Lỗi:** đăng ký không tồn tại hoặc không thuộc về hội viên $\rightarrow$ từ chối; đăng ký đã hủy trước đó $\rightarrow$ báo trạng thái không phù hợp. Hạn chót được hủy: chưa giới hạn *(TBD)*.

#### [FR-REG-04] Thao tác Thay mặt Hội viên
- **Mô tả:** Lễ tân/Quản lý có thể đăng ký hoặc hủy lớp thay hội viên. Áp dụng đầy đủ quy trình của `FR-REG-02`, `FR-REG-03`; nhật ký ghi rõ người thực hiện thay (`NFR-SEC-03`).

---

### 3.5. Phân hệ 5: Tra cứu, Thống kê & Quản trị

#### [FR-REP-01] Tra cứu Thông tin
- **Mô tả:** Tìm kiếm hội viên (tên, số điện thoại, mã), gói dịch vụ, lớp tập, HLV. Hiển thị kết quả; không có kết quả thì thông báo phù hợp.

#### [FR-REP-02] Theo dõi Trạng thái Gói & Mức lấp đầy Lớp
- **Mô tả:** Hiển thị mã màu để nhận biết nhanh:
  - *Gói:* **Xanh** = Hiệu lực; **Vàng** = Tạm ngưng; **Đỏ** = Hết hạn.
  - *Lớp:* tỷ lệ lấp đầy $TyLeLapDay = \dfrac{SoDangKy}{SucChua}$. **Xanh** khi $< 80\%$ (còn nhiều chỗ); **Vàng** khi $80\% \le TyLeLapDay < 100\%$ (sắp đầy); **Đỏ** khi $= 100\%$ (đã đầy). Ngưỡng 80% là *(đề xuất)*, có thể cấu hình.
- **Mở rộng (không bắt buộc, đề xuất):** danh sách gói sắp hết hạn trong 7 ngày để lễ tân nhắc hội viên gia hạn.

#### [FR-REP-03] Thống kê Hoạt động
- **Mô tả:** Quản lý (và Lễ tân nếu được phân quyền) xem thống kê phục vụ vận hành:
  - Số lượng hội viên (theo trạng thái).
  - Số gói theo trạng thái Hiệu lực / Tạm ngưng / Hết hạn.
  - Số lượng đăng ký lớp.
  - Số lớp còn chỗ / đã đầy.

#### [FR-ADM-01] Đăng nhập & Đăng xuất
- **Mô tả:** Người dùng đăng nhập bằng tên đăng nhập và mật khẩu; hệ thống xác định vai trò (Quản lý, Lễ tân, HLV, Hội viên) và chỉ hiển thị chức năng thuộc vai trò đó. Người dùng có thể đăng xuất để hủy phiên.
- **Lỗi và quy tắc nghiệp vụ:**
  - `BR-ADM-01`: Thiếu tên đăng nhập hoặc mật khẩu $\rightarrow$ yêu cầu nhập đủ.
  - `BR-ADM-02`: Sai tên đăng nhập hoặc mật khẩu $\rightarrow$ báo chung "Tên đăng nhập hoặc mật khẩu không đúng", **không tiết lộ** mục nào sai.
  - `BR-ADM-03`: Tài khoản bị khóa $\rightarrow$ báo "Tài khoản đã bị khóa, vui lòng liên hệ quản lý".

#### [FR-ADM-02] Quản lý Tài khoản & Vai trò
- **Mô tả:** Quản lý tạo tài khoản, gán vai trò, khóa/mở khóa, đặt lại mật khẩu. Tài khoản của hội viên/HLV liên kết với hồ sơ tương ứng.

#### [FR-ADM-03] Phân quyền theo Vai trò (RBAC)
- **Mô tả:** Người dùng chỉ truy cập chức năng phù hợp vai trò; truy cập ngoài quyền bị từ chối và báo không đủ quyền.

| Chức năng | Quản lý | Lễ tân | HLV | Hội viên |
| :--- | :---: | :---: | :---: | :---: |
| `FR-MD-01` Hội viên | ✓ | ✓ | - | Xem hồ sơ của mình* |
| `FR-MD-02` Gói dịch vụ | ✓ | Xem | - | Xem |
| `FR-MD-03` HLV | ✓ | Xem | Xem hồ sơ của mình* | Xem |
| `FR-MD-04` Phòng học | ✓ | Xem | - | - |
| `FR-PKG-01..06` Đăng ký, gia hạn, tạm ngưng, kích hoạt, lịch sử | ✓ | ✓ | - | Xem gói của mình* |
| `FR-CLS-01..03` Lớp tập | ✓ | ✓* | Xem lớp mình phụ trách* | Xem |
| `FR-REG-01` Xem lịch lớp | ✓ | ✓ | ✓ | ✓ |
| `FR-REG-02..04` Đăng ký / hủy lớp | ✓ | ✓ (thay mặt) | - | ✓ (của mình) |
| `FR-REP-01` Tra cứu | ✓ | ✓ | ✓* | ✓* |
| `FR-REP-02..03` Theo dõi, thống kê | ✓ | Có thể* | - | - |
| `FR-ADM-01` Đăng nhập / đăng xuất | ✓ | ✓ | ✓ | ✓ |
| `FR-ADM-02..03` Tài khoản & phân quyền | ✓ | - | - | - |

`*` Cần xác nhận lại theo nghiệp vụ thực tế. Ký hiệu: ✓ = thêm/sửa/xem; Xem = chỉ xem; - = không truy cập.

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

> Các con số dưới đây là *(đề xuất)* theo quy mô phòng Gym nhỏ/vừa (khoảng 5.000 hội viên, 200 lớp), chưa có yêu cầu cụ thể từ giảng viên; điều chỉnh khi được yêu cầu.

### 4.1. Hiệu năng (Performance)
- **[NFR-PER-01] Thời gian phản hồi đăng ký lớp:** kiểm tra điều kiện và ghi nhận đăng ký (`FR-REG-02`) hoàn thành dưới **2 giây** ($< 2s$).
- **[NFR-PER-02] Thời gian tra cứu:** thao tác tra cứu (`FR-REP-01`) trả kết quả dưới **2 giây** với tối đa 5.000 hội viên.
- **[NFR-PER-03] Khả năng xử lý đồng thời:** hệ thống đáp ứng tối thiểu **30 thao tác đăng ký lớp cùng lúc** mà không vượt sức chứa và không gây tắc nghẽn (locking/deadlock) trên bản ghi lớp.

### 4.2. An toàn & Bảo mật (Security & Audit)
- **[NFR-SEC-01] Phân quyền truy cập (RBAC):** người dùng chỉ truy cập chức năng thuộc vai trò (ma trận ở `FR-ADM-03`). Phải đăng nhập trước khi truy cập chức năng yêu cầu quyền hạn. Hội viên không thể truy cập chức năng quản trị kể cả khi gõ trực tiếp đường dẫn.
- **[NFR-SEC-02] Bảo vệ tài khoản và dữ liệu:** mật khẩu lưu dạng **băm có salt**, không lưu văn bản thuần; dữ liệu hội viên chỉ hiển thị cho vai trò có quyền.
- **[NFR-SEC-03] Nhật ký giao dịch (Audit Trail):** mọi thao tác đăng ký gói, gia hạn, tạm ngưng, kích hoạt lại, đăng ký/hủy lớp (kể cả thao tác thay mặt) phải ghi lại `User_ID`, `Timestamp`, đối tượng tác động và `Lý do` (nếu có).

### 4.3. Độ tin cậy & Toàn vẹn dữ liệu (Reliability & Integrity)
- **[NFR-REL-01] Giao dịch (Database Transaction):** thao tác đăng ký lớp gồm [Kiểm tra sức chứa + Tạo đăng ký + Ghi nhật ký] và thao tác hủy lớp phải nằm trong **một ACID Transaction**. Nếu có lỗi ở bất kỳ bước nào, toàn bộ giao dịch phải Rollback.
- **[NFR-REL-02] Ràng buộc ở tầng CSDL:** ngoài kiểm tra ở tầng ứng dụng, CSDL phải có ràng buộc chống đăng ký trùng (duy nhất theo cặp hội viên - lớp đối với đăng ký *Đang đăng ký*) và chống số lượng âm, làm lớp bảo vệ thứ hai.

### 4.4. Khả dụng (Usability)
- **[NFR-USA-01] Giao diện rõ ràng:** chức năng được nhóm phù hợp với từng vai trò; mỗi vai trò chỉ thấy menu của mình.
- **[NFR-USA-02] Thông báo lỗi rõ nguyên nhân:** khi từ chối đăng ký lớp, hệ thống nêu đúng lý do theo bảng lỗi E1 - E6.
- **[NFR-USA-03] Tra cứu thuận tiện:** hội viên có thể được tìm bằng số điện thoại, tên hoặc mã; kết quả có trạng thái gói hiển thị ngay.

---

## 5. YÊU CẦU GIAO DIỆN VÀ TÍCH HỢP (EXTERNAL INTERFACE REQUIREMENTS)

### 5.1. Giao diện Người dùng (UI Requirements)
- **Màn hình Lễ tân (hồ sơ hội viên):**
  - Tìm nhanh theo số điện thoại.
  - Khối **trạng thái gói** nổi bật ở đầu hồ sơ (Xanh/Vàng/Đỏ), kèm ngày bắt đầu, ngày kết thúc.
  - Các nút nghiệp vụ: Đăng ký gói, Gia hạn, Tạm ngưng/Kích hoạt lại, Đăng ký lớp thay.
- **Màn hình Lịch lớp (Hội viên):**
  - Danh sách lớp với `Còn X/Y chỗ` và mã màu mức lấp đầy (`FR-REP-02`).
  - Nút Đăng ký bị vô hiệu hóa khi lớp đầy; khi bị từ chối, hiển thị đúng thông báo lỗi E1 - E6.
- **Màn hình HLV:** danh sách lớp phụ trách và danh sách hội viên từng lớp.
- **Màn hình Quản lý:** bảng thống kê (`FR-REP-03`), quản lý gói, lớp, HLV, phòng, tài khoản.
- Giao diện web hiển thị tốt trên điện thoại (responsive) vì hội viên chủ yếu dùng điện thoại *(đề xuất)*.

### 5.2. Giao diện Tích hợp (Hardware / External Integration)
- Phiên bản hiện tại **không tích hợp** thiết bị hay dịch vụ bên ngoài (thanh toán trực tuyến, thẻ từ, máy quét vân tay nằm ngoài phạm vi).
- Định hướng mở rộng sau: tích hợp cổng thanh toán và check-in bằng QR.

---

## 6. MÔ HÌNH DỮ LIỆU CỐT LÕI (CONCEPTUAL DATA MODEL)

Để phục vụ bài toán hiệu lực gói và sức chứa lớp, kiến trúc CSDL tối thiểu phải chứa các thực thể và quan hệ sau:

```text
[HOI_VIEN] 1 --- * [DANG_KY_GOI] * --- 1 [GOI_DICH_VU]
                        1
                        |--- * [GIA_HAN_GOI]
                        |--- * [TAM_NGUNG_GOI]

[HUAN_LUYEN_VIEN] 1 --- * [LOP_TAP] * --- 1 [PHONG_HOC]

[HOI_VIEN] 1 --- * [DANG_KY_LOP] * --- 1 [LOP_TAP]
[DANG_KY_LOP] * --- 1 [DANG_KY_GOI]       (gói đã dùng khi đăng ký)

[TAI_KHOAN] 1 --- 0..1 [HOI_VIEN | HUAN_LUYEN_VIEN]
[TAI_KHOAN] 1 --- * [NHAT_KY]
```

### Chi tiết thuộc tính chính:
1. **`HOI_VIEN`** (`MaHV`, `HoTen`, `NgaySinh`, `GioiTinh`, `SoDienThoai`, `Email`, `NgayThamGia`, `TrangThai`)
2. **`GOI_DICH_VU`** (`MaGoi`, `TenGoi`, `Gia`, `ThoiHanNgay`, `QuyenLoi`, `TrangThai`)
3. **`DANG_KY_GOI`** (`MaDKGoi`, `MaHV`, `MaGoi`, `NgayDangKy`, `NgayBatDau`, `NgayKetThuc`, `GiaDangKy`, `TrangThai`, `MaNguoiThucHien`)
4. **`GIA_HAN_GOI`** (`MaGiaHan`, `MaDKGoi`, `NgayGiaHan`, `SoNgayThem`, `NgayKetThucCu`, `NgayKetThucMoi`, `MaNguoiThucHien`)
5. **`TAM_NGUNG_GOI`** (`MaTamNgung`, `MaDKGoi`, `NgayTamNgung`, `NgayKichHoatLai`, `LyDo`, `MaNguoiThucHien`)
6. **`HUAN_LUYEN_VIEN`** (`MaHLV`, `HoTen`, `SoDienThoai`, `ChuyenMon`, `TrangThai`)
7. **`PHONG_HOC`** (`MaPhong`, `TenPhong`, `SucChuaPhong`)
8. **`LOP_TAP`** (`MaLop`, `TenLop`, `MoTa`, `MaHLV`, `MaPhong`, `Thu`, `GioBatDau`, `GioKetThuc`, `SucChua`, `TrangThai`)
9. **`DANG_KY_LOP`** (`MaDKLop`, `MaHV`, `MaLop`, `MaDKGoi`, `ThoiGianDangKy`, `TrangThai`, `ThoiGianHuy`, `MaNguoiThucHien`)
10. **`TAI_KHOAN`** (`MaTK`, `TenDangNhap`, `MatKhauHash`, `VaiTro`, `MaHoSo`, `TrangThai`)
11. **`NHAT_KY`** (`MaNhatKy`, `MaTK`, `ThoiGian`, `HanhDong`, `DoiTuong`, `LyDo`)

### Giá trị trạng thái và ghi chú:
- `HOI_VIEN.TrangThai`: Hoạt động / Ngừng hoạt động (khác với trạng thái gói).
- `GOI_DICH_VU.TrangThai`: Đang cung cấp / Ngừng cung cấp.
- `DANG_KY_GOI.TrangThai`: Hiệu lực / Tạm ngưng / Hết hạn.
- `LOP_TAP.TrangThai`: Đang mở / Đã đóng đăng ký / Ngừng.
- `DANG_KY_LOP.TrangThai`: Đang đăng ký / Đã hủy.
- `TAI_KHOAN.VaiTro`: Quản lý / Lễ tân / HLV / Hội viên. `MaHoSo` để trống với tài khoản Quản lý và Lễ tân.
- **Số chỗ còn lại** không phải cột của `LOP_TAP`: tính bằng $SucChua - \text{COUNT}(DANG\_KY\_LOP\ \text{Đang đăng ký})$.
- Các cột `NgayKetThuc`, `GiaDangKy` lưu giá trị tại thời điểm đăng ký/gia hạn để đổi giá, đổi thời hạn của gói sau này không làm sai lịch sử (`BR-MD-03`).

---

## 7. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

> Mốc "hôm nay" trong các kịch bản là `03/10/2026`.

| STT | Kịch bản kiểm thử | Kết quả mong đợi | FR liên quan |
| :--- | :--- | :--- | :--- |
| **TC01** | Hội viên A có gói Hiệu lực (kết thúc 01/11/2026). Lớp Yoga sức chứa 20, đang có 19 đăng ký, trạng thái Đang mở. A bấm Đăng ký. | Đăng ký thành công; tạo bản ghi *Đang đăng ký*; số chỗ còn lại từ 1 về 0, lớp hiển thị **Đã đầy**. | FR-REG-02 |
| **TC02** | Hội viên có gói đang Tạm ngưng đăng ký một lớp còn chỗ. | Từ chối, báo E4a "Gói đang tạm ngưng"; không tạo bản ghi. | FR-REG-02 |
| **TC03** | Hội viên có gói kết thúc 30/09/2026 (Hết hạn) đăng ký lớp còn chỗ. | Từ chối, báo E4b "Gói đã hết hạn, vui lòng gia hạn". | FR-REG-02, FR-PKG-03 |
| **TC04** | Hội viên có gói Hiệu lực đăng ký lớp đã đủ 20/20. | Từ chối, báo E6 "Lớp đã đầy"; số đăng ký vẫn là 20. | FR-REG-02 |
| **TC05** | Hội viên đã *Đang đăng ký* lớp Yoga, bấm Đăng ký lớp Yoga lần nữa. | Từ chối, báo E5 "Bạn đã đăng ký lớp này". | FR-REG-02 |
| **TC06** | Lớp 20/20. Hội viên đang đăng ký bấm Hủy; sau đó hội viên khác (gói Hiệu lực) đăng ký. | Bản ghi chuyển *Đã hủy*, số chỗ 0 $\rightarrow$ 1; hội viên khác đăng ký thành công. Hội viên đã hủy vẫn đăng ký lại được nếu còn chỗ. | FR-REG-03 |
| **TC07** | Hội viên mới tạo, chưa từng đăng ký gói, đăng ký lớp. | Từ chối, báo E3 "Hội viên chưa đăng ký gói dịch vụ". | FR-REG-02 |
| **TC08** | Lớp còn đúng 1 chỗ; hai hội viên hợp lệ khác nhau bấm Đăng ký cùng lúc. | Đúng **1** người thành công, người còn lại nhận E6; tổng đăng ký = sức chứa. | FR-REG-02, NFR-REL-01 |
| **TC09** | Đăng ký Gói 30 ngày cho hội viên chưa có gói, bắt đầu 03/10/2026. | Tạo đăng ký trạng thái *Hiệu lực*, `NgayKetThuc` = **01/11/2026**. | FR-PKG-01 |
| **TC10** | Hội viên đang có gói Hiệu lực, lễ tân đăng ký thêm một gói mới. | Từ chối theo `BR-PKG-03` và gợi ý dùng Gia hạn. | FR-PKG-01 |
| **TC11** | Gia hạn Gói 30 ngày cho gói đang Hiệu lực, kết thúc 01/11/2026. | `NgayKetThuc` mới = **01/12/2026**; lưu bản ghi gia hạn (cũ/mới). | FR-PKG-02 |
| **TC12** | Gia hạn Gói 30 ngày vào 03/10/2026 cho gói Hết hạn (kết thúc 30/09/2026). | `NgayKetThuc` mới = **01/11/2026**; trạng thái trở lại *Hiệu lực*. | FR-PKG-02 |
| **TC13** | Gói kết thúc 01/11/2026; tạm ngưng 10/10/2026, kích hoạt lại 20/10/2026. | Gói về *Hiệu lực*; `NgayKetThuc` mới = **11/11/2026** (bù 10 ngày). | FR-PKG-04, FR-PKG-05 |
| **TC14** | HLV X đã có lớp Thứ 2, 18:00 - 19:00. Tạo lớp mới cho X vào Thứ 2, 18:30 - 19:30. | Từ chối, báo xung đột lịch và nêu lớp đang trùng. | FR-CLS-01 |
| **TC15** | Lớp sức chứa 20 đang có 18 đăng ký; quản lý sửa sức chứa thành 15. | Từ chối theo `BR-CLS-04`; sức chứa giữ nguyên 20. | FR-CLS-01 |
| **TC16** | Thêm hội viên mới với số điện thoại đã tồn tại. | Từ chối, báo "Hội viên đã tồn tại" và hiển thị hồ sơ cũ. | FR-MD-01 |
| **TC17** | Đăng nhập với mật khẩu sai. | Không vào được; báo chung "Tên đăng nhập hoặc mật khẩu không đúng". | FR-ADM-01 |
| **TC18** | Hội viên gõ trực tiếp đường dẫn trang quản lý thống kê. | Bị từ chối, báo không đủ quyền. | FR-ADM-03 |
| **TC19** | Hội viên A cố hủy đăng ký lớp của hội viên B. | Từ chối theo `BR-REG-04`; đăng ký của B không đổi. | FR-REG-03 |
| **TC20** | Giả lập lỗi khi ghi nhật ký giữa lúc đăng ký lớp. | Toàn bộ giao dịch rollback: không có bản ghi đăng ký, số chỗ còn lại không đổi. | NFR-REL-01 |
