# Thiết kế REST API - Hệ thống QLGym

**Phiên bản:** Bản nháp 3.0 (bổ sung giải thích, hóa đơn, quy tắc check-in, mã lỗi đầy đủ)
**Căn cứ:** `SRS_QLGym.md`
**Phạm vi:** API phục vụ các client của hệ thống quản lý phòng tập. Đây là thiết kế giao tiếp, chưa phải backend đã triển khai.

## Mục lục

1. [Kiến trúc](#1-kiến-trúc)
2. [Quy ước chung](#2-quy-ước-chung)
3. [Danh sách Endpoint chi tiết](#3-danh-sách-endpoint-chi-tiết)
4. [Bảng mã lỗi nghiệp vụ](#4-bảng-mã-lỗi-nghiệp-vụ-chuẩn-hóa-error-codes)
5. [Ghi chú kỹ thuật khi triển khai](#5-ghi-chú-kỹ-thuật-khi-triển-khai-implementation-notes)
6. [Thay đổi so với bản 2.0](#6-thay-đổi-so-với-bản-20)

---

## 1. Kiến trúc

```plaintext
[Web UI: Quản lý / Lễ tân / HLV / Hội viên]
                     |
                     | HTTPS, JSON (Authorization: Bearer <token>)
                     v
             [REST API / Business Logic]
                     |
                     v
                 [Database (MySQL/PostgreSQL)]
```

- **Nguyên tắc:** Trình duyệt không truy cập trực tiếp database. Backend đảm nhiệm xác thực, phân quyền, kiểm tra quy tắc nghiệp vụ (Business Rules) và quản lý Database Transactions.
- **Vì sao:** Nếu client nối thẳng vào database thì ai cũng có thể sửa dữ liệu và bỏ qua các quy tắc (ví dụ đăng ký lớp đã đầy). Đặt backend ở giữa để mọi thao tác đều phải đi qua một cửa kiểm tra duy nhất.
- **Phiên bản hóa:** Các thay đổi không tương thích ngược với contract hiện tại cần được phát hành dưới phiên bản API mới (`/api/v2`). Nhờ vậy client cũ vẫn chạy bình thường khi API thay đổi.

---

## 2. Quy ước chung

| Nội dung | Quy ước |
|----------|---------|
| Base URL | `/api/v1` |
| Dữ liệu | JSON, thuộc tính viết `camelCase` |
| Ngày | `YYYY-MM-DD` (ví dụ `2026-11-07`) |
| Thời điểm | ISO 8601 có múi giờ (`2026-11-07T14:00:00Z`) |
| Múi giờ nghiệp vụ | `Asia/Ho_Chi_Minh` (dùng để xác định "ngày hôm nay" khi tính gói tập) |
| Tài nguyên | Danh từ số nhiều (`/members`, `/classes`); thao tác thể hiện bằng HTTP Method |
| Xóa dữ liệu | Không dùng `DELETE`. Hệ thống **xóa mềm** bằng cách đổi `status` (ví dụ `INACTIVE`) để giữ lịch sử và hóa đơn |
| ID | Chuỗi có tiền tố, phần sau là UUID/ULID (ví dụ `mem_01HZX...`). Không dùng số tăng dần vì dễ bị đoán |

**Giải thích về HTTP Method:**

| Method | Dùng khi | Ví dụ |
|--------|----------|-------|
| `GET` | Lấy dữ liệu, không làm thay đổi gì | `GET /members` |
| `POST` | Tạo mới hoặc thực hiện một hành động | `POST /memberships` |
| `PATCH` | Sửa một phần dữ liệu | `PATCH /members/{memberId}` |

Các hành động như gia hạn, tạm ngưng, hủy được thiết kế thành tài nguyên con (`/renewals`, `/suspensions`, `/cancellations`) để mỗi lần thực hiện đều có một bản ghi lưu lại lịch sử.

### Phân quyền (Roles)

| Role | Ý nghĩa |
|------|---------|
| `MANAGER` | Quản lý, toàn quyền |
| `RECEPTIONIST` | Lễ tân, xử lý hội viên, đăng ký gói, check-in |
| `TRAINER` | Huấn luyện viên, xem lớp mình phụ trách |
| `MEMBER` | Hội viên, chỉ xem và thao tác trên dữ liệu của chính mình |

### Phân trang, lọc, sắp xếp

- `page` (mặc định `1`), `limit` (mặc định `20`, tối đa `100`).
- `search`: tìm theo từ khóa. `status`: lọc theo trạng thái.
- `sort`: tên trường, thêm dấu `-` phía trước để sắp giảm dần. Ví dụ `sort=-createdAt` là mới nhất trước.

### Định dạng phản hồi chuẩn

**Thành công (1 tài nguyên):**

```json
{
  "data": {
    "id": "mem_001",
    "fullName": "Nguyen Van A",
    "phone": "0900000000",
    "status": "ACTIVE"
  }
}
```

**Thành công (danh sách kèm phân trang):**

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 45 }
}
```

**Lỗi thống nhất (Error Response):**

```json
{
  "error": {
    "code": "CLASS_FULL",
    "message": "Lớp học đã đạt sức chứa tối đa",
    "details": [
      { "field": "classId", "message": "Lớp cls_001 hiện đã có đủ 30/30 hội viên" }
    ]
  }
}
```

Client dựa vào `error.code` để xử lý logic (ví dụ hiện nút "Gia hạn" khi nhận `MEMBERSHIP_EXPIRED`), còn `message` chỉ để hiển thị cho người dùng.

### Các mã HTTP chính

| Mã | Ý nghĩa | Khi nào dùng |
|----|---------|--------------|
| 200 | OK | Lấy hoặc sửa thành công |
| 201 | Created | Tạo mới thành công |
| 204 | No Content | Thành công và không có dữ liệu trả về (ví dụ đăng xuất) |
| 400 | Bad Request | Dữ liệu gửi lên sai định dạng hoặc thiếu |
| 401 | Unauthorized | Chưa đăng nhập hoặc token hết hạn |
| 403 | Forbidden | Đã đăng nhập nhưng không đủ quyền |
| 404 | Not Found | Không tìm thấy tài nguyên |
| 409 | Conflict | Vi phạm quy tắc nghiệp vụ (đã đầy, hết hạn, trùng...) |
| 500 | Internal Server Error | Lỗi phía server |

> **Quy ước bảo mật:** Khi hội viên truy cập tài nguyên của người khác, API trả `403 FORBIDDEN`. Người dùng không có quyền không được xem dữ liệu của người khác.

---

## 3. Danh sách Endpoint chi tiết

### 3.1. Tài khoản và Xác thực

> **Tài khoản (`users`) khác hồ sơ (`members`, `trainers`).** Hồ sơ lưu thông tin người (họ tên, SĐT...). Tài khoản dùng để đăng nhập. Một hội viên có thể có hồ sơ mà chưa có tài khoản, ví dụ khách vừa đăng ký ở quầy. Khi cần cấp tài khoản thì tạo `user` rồi liên kết với hồ sơ bằng `memberId` hoặc `trainerId`.

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| POST | `/auth/login` | Đăng nhập, trả về access token, refresh token và thông tin user | Công khai |
| POST | `/auth/refresh` | Dùng refresh token để lấy access token mới | Công khai (kèm refresh token) |
| POST | `/auth/logout` | Đăng xuất, hủy phiên hiện tại | Đã đăng nhập |
| GET | `/auth/me` | Lấy thông tin tài khoản đang đăng nhập | Đã đăng nhập |
| POST | `/auth/change-password` | Đổi mật khẩu (gửi mật khẩu cũ và mới) | Đã đăng nhập |
| GET | `/users` | Danh sách tài khoản (lọc theo `role`, `status`) | MANAGER |
| POST | `/users` | Tạo tài khoản mới, gắn vai trò và hồ sơ liên kết | MANAGER |
| PATCH | `/users/{userId}` | Đổi vai trò, khóa/mở khóa tài khoản | MANAGER |

**Quy tắc đăng nhập:**

- Access token có thời hạn ngắn (đề xuất 15-60 phút). Hết hạn thì client gọi `/auth/refresh` thay vì bắt người dùng đăng nhập lại.
- Đăng nhập sai quá 5 lần liên tiếp thì tạm khóa tài khoản (`ACCOUNT_LOCKED`) trong một khoảng thời gian, để chống dò mật khẩu.
- Mật khẩu chỉ lưu dạng băm (bcrypt/argon2), không bao giờ trả về trong response.

**Ví dụ tạo tài khoản hội viên (`POST /users`):**

```json
{
  "username": "nguyenvana",
  "password": "SecurePassword123@",
  "role": "MEMBER",
  "memberId": "mem_001"
}
```

Với `role = TRAINER` thì gửi `trainerId`. Với `MANAGER` và `RECEPTIONIST` thì gửi thêm `fullName`, `phone`, `email` vì không có hồ sơ liên kết.

### 3.2. Hội viên, Gói dịch vụ, HLV và Phòng tập

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/members` | Tìm hội viên theo tên, SĐT, mã; lọc theo trạng thái | MANAGER, RECEPTIONIST |
| POST | `/members` | Tạo hồ sơ hội viên | MANAGER, RECEPTIONIST |
| GET | `/members/me` | Xem hồ sơ của chính mình | MEMBER |
| GET | `/members/{memberId}` | Xem chi tiết hồ sơ hội viên | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |
| PATCH | `/members/{memberId}` | Cập nhật thông tin/trạng thái hội viên | MANAGER, RECEPTIONIST |
| GET | `/packages` | Danh sách gói dịch vụ (Membership Packages) | Đã đăng nhập |
| POST | `/packages` | Tạo gói dịch vụ mới | MANAGER |
| GET | `/packages/{packageId}` | Chi tiết gói dịch vụ | Đã đăng nhập |
| PATCH | `/packages/{packageId}` | Cập nhật hoặc ngừng cung cấp gói | MANAGER |
| GET | `/trainers` | Danh sách huấn luyện viên | Đã đăng nhập |
| POST | `/trainers` | Thêm HLV mới | MANAGER |
| GET | `/trainers/{trainerId}` | Chi tiết HLV | Đã đăng nhập |
| PATCH | `/trainers/{trainerId}` | Cập nhật thông tin/trạng thái HLV | MANAGER |
| GET | `/trainers/{trainerId}/classes` | Lịch các lớp HLV phụ trách | MANAGER, RECEPTIONIST, TRAINER (chính chủ) |
| GET | `/rooms` | Danh sách phòng tập | MANAGER, RECEPTIONIST |
| POST | `/rooms` | Thêm phòng tập mới | MANAGER |
| PATCH | `/rooms/{roomId}` | Cập nhật thông tin phòng tập | MANAGER |

**Ghi chú:**

- `/members/me` giúp hội viên lấy hồ sơ của mình mà không cần biết `memberId`.
- Gói dịch vụ không bị xóa. Khi ngừng bán thì `PATCH` đổi `status` thành `INACTIVE`. Gói đã được người khác mua vẫn giữ nguyên.

### 3.3. Đăng ký gói, Vòng đời gói hội viên & Thanh toán

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/memberships` | Tra cứu đăng ký gói theo hội viên, trạng thái | MANAGER, RECEPTIONIST |
| POST | `/memberships` | Đăng ký gói mới cho hội viên, kèm tạo hóa đơn | MANAGER, RECEPTIONIST |
| GET | `/memberships/me` | Xem các gói của chính mình | MEMBER |
| GET | `/memberships/{membershipId}` | Chi tiết một gói đăng ký | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |
| POST | `/memberships/{membershipId}/renewals` | Gia hạn gói | MANAGER, RECEPTIONIST |
| POST | `/memberships/{membershipId}/suspensions` | Tạm ngưng gói (ghi lý do và lịch sử) | MANAGER, RECEPTIONIST |
| POST | `/memberships/{membershipId}/reactivations` | Kích hoạt lại gói (tính bù ngày theo SRS) | MANAGER, RECEPTIONIST |
| GET | `/members/{memberId}/membership-history` | Toàn bộ lịch sử đăng ký, gia hạn, tạm ngưng | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |
| GET | `/invoices` | Danh sách hóa đơn (lọc theo `memberId`, `status`, khoảng ngày) | MANAGER, RECEPTIONIST, MEMBER (chỉ của mình) |
| GET | `/invoices/{invoiceId}` | Chi tiết một hóa đơn | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |

**Quy tắc nghiệp vụ đăng ký (`POST /memberships`):**

Client chỉ gửi lên:

```json
{ "memberId": "mem_001", "packageId": "pkg_001", "paymentMethod": "CASH" }
```

Backend tự xử lý các việc sau, **trong cùng một Transaction**:

1. Lấy ngày hiện tại theo múi giờ Việt Nam làm `startDate`. Client không được tự gửi ngày để tránh gian lận.
2. Chụp lại giá gốc của gói tại thời điểm mua (`priceAtPurchase`). Sau này giá gói có đổi thì hóa đơn cũ vẫn đúng.
3. Tính `endDate = startDate + durationDays - 1`. Trừ 1 vì ngày bắt đầu đã tính là ngày đầu tiên. Ví dụ gói 30 ngày bắt đầu 01/11 thì hết hạn 30/11.
4. Kiểm tra hội viên chưa có gói nào đang `ACTIVE` hoặc `SUSPENDED`, nếu có thì trả `409 MEMBERSHIP_OVERLAP`.
5. Tạo hóa đơn (`invoices`) đi kèm.

Dùng chung một Transaction nghĩa là nếu một bước lỗi thì toàn bộ bị hủy. Nhờ vậy không có tình trạng tạo gói mà thiếu hóa đơn, hoặc ngược lại.

**Vòng đời trạng thái của gói (Membership Status):**

| Từ | Hành động | Sang | Ghi chú |
|----|-----------|------|---------|
| (mới) | `POST /memberships` | `ACTIVE` | Tạo kèm hóa đơn |
| `ACTIVE` | `suspensions` | `SUSPENDED` | Lưu lý do và ngày bắt đầu tạm ngưng |
| `SUSPENDED` | `reactivations` | `ACTIVE` | `endDate` được cộng thêm số ngày đã tạm ngưng |
| `ACTIVE` | Quá `endDate` | `EXPIRED` | Hệ thống tự chuyển |
| `ACTIVE` / `EXPIRED` | `renewals` | `ACTIVE` | Tạo hóa đơn mới; `endDate` tính từ `endDate` cũ nếu còn hạn, hoặc từ hôm nay nếu đã hết hạn |

Thao tác không có trong bảng (ví dụ tạm ngưng gói đã `EXPIRED`) trả về `409 INVALID_STATE_TRANSITION`. *Các quy tắc gia hạn và tính bù ngày cần đối chiếu lại với SRS.*

**Phương thức thanh toán (`paymentMethod`):** `CASH`, `BANK_TRANSFER`, `CARD` (điều chỉnh theo SRS).

### 3.4. Lớp tập, Đăng ký lớp & Check-in (Điểm danh)

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/classes` | Lịch lớp (HLV, phòng, sức chứa, số chỗ còn) | Đã đăng nhập |
| POST | `/classes` | Tạo lịch lớp mới | MANAGER, RECEPTIONIST |
| GET | `/classes/{classId}` | Chi tiết một lớp | Đã đăng nhập |
| PATCH | `/classes/{classId}` | Cập nhật lịch, HLV, phòng, trạng thái lớp | MANAGER, RECEPTIONIST |
| GET | `/classes/{classId}/registrations` | Danh sách hội viên đã đăng ký lớp | MANAGER, RECEPTIONIST, TRAINER (phụ trách) |
| GET | `/class-registrations` | Lịch sử đăng ký lớp. MEMBER chỉ thấy của mình | MANAGER, RECEPTIONIST, MEMBER |
| POST | `/class-registrations` | Đăng ký vào lớp (cho mình hoặc thay mặt hội viên) | MEMBER, MANAGER, RECEPTIONIST |
| POST | `/class-registrations/{registrationId}/cancellations` | Hủy đăng ký lớp (lưu thời điểm hủy) | MEMBER (sở hữu), MANAGER, RECEPTIONIST |
| POST | `/check-ins` | Điểm danh hội viên vào phòng tập hoặc lớp học | RECEPTIONIST, MANAGER |
| GET | `/check-ins` | Lịch sử ra vào / check-in | MANAGER, RECEPTIONIST |

**Điều kiện đăng ký lớp (`POST /class-registrations`):**

Body: `{ "memberId": "mem_001", "classId": "cls_001" }`. Nếu là MEMBER tự đăng ký thì có thể bỏ `memberId`, backend lấy từ token.

| Kiểm tra | Lỗi nếu vi phạm |
|----------|-----------------|
| Lớp tồn tại | `404 CLASS_NOT_FOUND` |
| Lớp chưa bị hủy | `409 CLASS_CANCELLED` |
| Hội viên có gói đang hiệu lực | `409 MEMBERSHIP_REQUIRED` / `MEMBERSHIP_SUSPENDED` / `MEMBERSHIP_EXPIRED` |
| Chưa đăng ký lớp này | `409 DUPLICATE_REGISTRATION` |
| Lớp còn chỗ | `409 CLASS_FULL` |

**Check-in (`POST /check-ins`):**

```json
{
  "memberCode": "GYM0001",
  "type": "GYM_ACCESS"
}
```

```json
{
  "memberCode": "GYM0001",
  "type": "CLASS_CHECKIN",
  "classId": "cls_001"
}
```

- `type` nhận `GYM_ACCESS` (vào phòng tập) hoặc `CLASS_CHECKIN` (vào lớp). Với `CLASS_CHECKIN` thì `classId` là **bắt buộc**.
- Dùng `memberCode` (mã trên thẻ hội viên hoặc mã QR) thay vì `memberId` nội bộ.

Backend kiểm tra theo thứ tự:

1. Hội viên tồn tại và chưa bị khóa, nếu không trả `404 MEMBER_NOT_FOUND` hoặc `403 MEMBER_LOCKED`.
2. Gói tập đang hiệu lực (`ACTIVE` và chưa quá `endDate`), nếu không trả `409 MEMBERSHIP_REQUIRED` / `MEMBERSHIP_SUSPENDED` / `MEMBERSHIP_EXPIRED`.
3. Riêng `CLASS_CHECKIN`: hội viên đã đăng ký lớp đó (`409 NOT_REGISTERED_FOR_CLASS`) và thời điểm quét nằm trong khung giờ cho phép điểm danh của lớp.
4. Chưa check-in cùng loại trong cùng lần (`409 DUPLICATE_CHECKIN`), để tránh quét hai lần ghi hai bản ghi.

Thành công trả `201 Created` kèm thông tin chào mừng (họ tên, ngày hết hạn gói, số ngày còn lại).

### 3.5. Báo cáo & Thống kê

Tất cả endpoint báo cáo hỗ trợ tham số `from` và `to` (định dạng `YYYY-MM-DD`) để chọn khoảng thời gian.

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/reports/overview` | Tổng quan (số hội viên active, số lớp trong ngày) | MANAGER, RECEPTIONIST |
| GET | `/reports/memberships` | Số lượng đăng ký gói theo loại/trạng thái | MANAGER, RECEPTIONIST |
| GET | `/reports/classes` | Tình trạng lớp học (số đăng ký, lớp đầy) | MANAGER, RECEPTIONIST |
| GET | `/reports/revenue` | Doanh thu, thêm `groupBy=day\|month\|package` | MANAGER |

Doanh thu được tính từ bảng `invoices` có trạng thái đã thanh toán (`PAID`).

---

## 4. Bảng mã lỗi nghiệp vụ chuẩn hóa (Error Codes)

### Lỗi chung

| HTTP | `error.code` | Ý nghĩa |
|------|--------------|---------|
| 400 | `VALIDATION_ERROR` | Dữ liệu đầu vào sai định dạng hoặc thiếu trường bắt buộc |
| 401 | `UNAUTHORIZED` | Token không hợp lệ hoặc đã hết hạn |
| 401 | `INVALID_CREDENTIALS` | Sai tên đăng nhập hoặc mật khẩu |
| 403 | `FORBIDDEN` | Tài khoản không đủ quyền thực hiện hành động này |
| 403 | `ACCOUNT_LOCKED` | Tài khoản bị khóa (thủ công hoặc do đăng nhập sai nhiều lần) |
| 403 | `MEMBER_LOCKED` | Hồ sơ hội viên đang bị khóa |

### Không tìm thấy

| HTTP | `error.code` | Ý nghĩa |
|------|--------------|---------|
| 404 | `MEMBER_NOT_FOUND` | Không tìm thấy hội viên |
| 404 | `PACKAGE_NOT_FOUND` | Không tìm thấy gói dịch vụ |
| 404 | `MEMBERSHIP_NOT_FOUND` | Không tìm thấy gói đăng ký |
| 404 | `CLASS_NOT_FOUND` | Lớp học không tồn tại |
| 404 | `REGISTRATION_NOT_FOUND` | Không tìm thấy lượt đăng ký lớp |

### Xung đột nghiệp vụ

| HTTP | `error.code` | Ý nghĩa |
|------|--------------|---------|
| 409 | `MEMBERSHIP_REQUIRED` | Hội viên chưa mua gói hoặc không có gói hiệu lực |
| 409 | `MEMBERSHIP_SUSPENDED` | Gói đang tạm ngưng |
| 409 | `MEMBERSHIP_EXPIRED` | Gói đã hết hạn |
| 409 | `MEMBERSHIP_OVERLAP` | Hội viên đã có gói đang `ACTIVE` hoặc `SUSPENDED` |
| 409 | `INVALID_STATE_TRANSITION` | Hành động không hợp lệ với trạng thái hiện tại |
| 409 | `DUPLICATE_REGISTRATION` | Hội viên đã đăng ký lớp này |
| 409 | `CLASS_FULL` | Lớp đã đủ sức chứa |
| 409 | `CLASS_CANCELLED` | Lớp đã bị hủy |
| 409 | `NOT_REGISTERED_FOR_CLASS` | Hội viên chưa đăng ký lớp nên không thể điểm danh lớp |
| 409 | `DUPLICATE_CHECKIN` | Hội viên đã check-in rồi |

---

## 5. Ghi chú kỹ thuật khi triển khai (Implementation Notes)

### 5.1. Quản lý trạng thái gói

Trạng thái gói được **tính tại thời điểm kiểm tra**, dựa trên `endDate` và cờ `isSuspended`. Ví dụ khi check-in, backend so sánh `endDate` với ngày hiện tại.

Cron Job chạy hàng ngày chỉ có vai trò **đồng bộ cột `status`** trong database để báo cáo và lọc danh sách nhanh. Nếu chỉ dựa vào cron, gói hết hạn lúc 00:00 nhưng cron chạy lúc 00:05 thì hội viên vẫn vào được trong 5 phút đó.

### 5.2. Concurrency Control (tranh chấp chỗ lớp học)

Giả sử lớp còn 1 chỗ và hai hội viên bấm đăng ký cùng lúc. Nếu cả hai cùng đọc thấy "còn 1 chỗ" thì cả hai đều được thêm và lớp vượt `capacity`. Cách xử lý:

- Dùng Database Transaction kèm khóa dòng `SELECT ... FOR UPDATE` trên bản ghi lớp trong bảng `classes`. Người thứ hai phải chờ người thứ nhất xong rồi mới đọc lại số chỗ.
- Thêm ràng buộc `UNIQUE (class_id, member_id)` ở bảng đăng ký lớp. Khóa dòng bảo vệ sức chứa, còn ràng buộc này chặn đăng ký trùng ngay ở database, kể cả khi code backend bị bỏ sót.

### 5.3. Check-in tự động

Endpoint `/check-ins` thiết kế sẵn để tích hợp máy quét QR trên thẻ hội viên hoặc app mobile sau này. Mã QR chỉ nên chứa `memberCode`, không chứa thông tin nhạy cảm.

### 5.4. Chống gửi trùng (tùy chọn, hướng mở rộng)

Nếu người dùng bấm "Đăng ký gói" hai lần do mạng chậm thì có thể tạo hai gói và hai hóa đơn. Có thể cho client gửi header `Idempotency-Key` (một chuỗi ngẫu nhiên cho mỗi thao tác) cho các `POST` quan trọng. Server nhận cùng key lần hai thì trả lại kết quả cũ thay vì tạo mới. Phần này không bắt buộc cho phiên bản đầu.

### 5.5. Tài liệu hóa API

Nên viết thêm file `openapi.yaml` (đặc tả OpenAPI 3) để xem bằng Swagger UI và cho client gọi thử trực tiếp.
