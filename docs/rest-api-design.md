# Thiết kế REST API - Hệ thống QLGym

**Phiên bản:** Bản nháp 2.0 (Hoàn thiện chi tiết nghiệp vụ)
**Căn cứ:** `SRS_QLGym.md`
**Phạm vi:** API phục vụ các client của hệ thống quản lý phòng tập. Đây là thiết kế giao tiếp, chưa phải backend đã triển khai.

## Mục lục

1. [Kiến trúc](#1-kiến-trúc)
2. [Quy ước chung](#2-quy-ước-chung)
3. [Danh sách Endpoint chi tiết](#3-danh-sách-endpoint-chi-tiết)
4. [Bảng mã lỗi nghiệp vụ chuẩn hóa](#4-bảng-mã-lỗi-nghiệp-vụ-chuẩn-hóa-error-codes)
5. [Ghi chú kỹ thuật cho việc triển khai](#5-các-điểm-ghi-chú-kỹ-thuật-cho-việc-triển-khai-implementation-notes)

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
- **Phiên bản hóa:** Các thay đổi không tương thích ngược với contract hiện tại cần được phát hành dưới phiên bản API mới (`/api/v2`).

---

## 2. Quy ước chung

- **Base URL:** `/api/v1`
- **Định dạng dữ liệu:** JSON toàn bộ, tên thuộc tính chuẩn `camelCase`, định dạng ngày `YYYY-MM-DD`, thời điểm (Timestamp) dùng chuẩn ISO 8601 có múi giờ (`YYYY-MM-DDTHH:mm:ssZ`).
- **Quy ước tài nguyên:** Dùng danh từ số nhiều cho tài nguyên (`/members`, `/classes`), dùng HTTP Method (`GET`, `POST`, `PATCH`, `DELETE`) để thể hiện thao tác.
- **Phân trang & Lọc:** Các danh sách hỗ trợ tham số `page` (mặc định: 1), `limit` (mặc định: 20, tối đa: 100) và các tham số `search`, `status`, `sort`.
- **Phân quyền (Roles):** `MANAGER` (Quản lý), `RECEPTIONIST` (Lễ tân), `TRAINER` (HLV), `MEMBER` (Hội viên).

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

**Thành công (Danh sách kèm phân trang):**

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

### Các mã HTTP chính

| Mã | Ý nghĩa |
|----|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## 3. Danh sách Endpoint chi tiết

### 3.1. Tài khoản và Xác thực

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| POST | `/auth/login` | Đăng nhập hệ thống, trả về Bearer Token & thông tin user | Công khai |
| POST | `/auth/logout` | Đăng xuất, hủy phiên làm việc hiện tại | Đã đăng nhập |
| GET | `/auth/me` | Lấy thông tin tài khoản đang đăng nhập | Đã đăng nhập |
| GET | `/users` | Lấy danh sách tài khoản (hỗ trợ lọc theo `role`, `status`) | MANAGER |
| POST | `/users` | Tạo tài khoản mới (gắn kèm vai trò và hồ sơ liên kết) | MANAGER |
| PATCH | `/users/{userId}` | Cập nhật vai trò hoặc khóa/mở khóa tài khoản | MANAGER |

**Ví dụ Request Body tạo hội viên/tài khoản (`POST /users`):**

```json
{
  "username": "nguyenvana",
  "password": "SecurePassword123@",
  "role": "MEMBER",
  "fullName": "Nguyen Van A",
  "phone": "0900000000",
  "email": "vana@example.com"
}
```

### 3.2. Hội viên, Gói dịch vụ, HLV và Phòng tập

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/members` | Tìm kiếm hội viên theo tên, SĐT, mã; lọc theo trạng thái | MANAGER, RECEPTIONIST |
| POST | `/members` | Tạo mới hồ sơ hội viên | MANAGER, RECEPTIONIST |
| GET | `/members/{memberId}` | Xem chi tiết hồ sơ hội viên | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |
| PATCH | `/members/{memberId}` | Cập nhật thông tin/trạng thái hội viên | MANAGER, RECEPTIONIST |
| GET | `/packages` | Lấy danh sách gói dịch vụ (Membership Packages) | Đã đăng nhập |
| POST | `/packages` | Tạo gói dịch vụ mới | MANAGER |
| GET | `/packages/{packageId}` | Xem chi tiết gói dịch vụ | Đã đăng nhập |
| PATCH | `/packages/{packageId}` | Cập nhật thông tin hoặc ngừng cung cấp gói | MANAGER |
| GET | `/trainers` | Danh sách huấn luyện viên | Đã đăng nhập |
| POST | `/trainers` | Thêm thông tin HLV mới | MANAGER |
| GET | `/trainers/{trainerId}` | Chi tiết HLV | Đã đăng nhập |
| PATCH | `/trainers/{trainerId}` | Cập nhật thông tin/trạng thái HLV | MANAGER |
| GET | `/rooms` | Danh sách phòng tập trong cơ sở | MANAGER, RECEPTIONIST |
| POST | `/rooms` | Thêm phòng tập mới | MANAGER |
| PATCH | `/rooms/{roomId}` | Cập nhật thông tin phòng tập | MANAGER |

### 3.3. Đăng ký, Vòng đời gói hội viên & Thanh toán

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/memberships` | Tra cứu danh sách đăng ký gói theo hội viên, trạng thái | MANAGER, RECEPTIONIST |
| POST | `/memberships` | Đăng ký gói tập mới cho hội viên kèm tạo hóa đơn thanh toán | MANAGER, RECEPTIONIST |
| GET | `/memberships/{membershipId}` | Xem chi tiết một gói đăng ký | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |
| POST | `/memberships/{membershipId}/renewals` | Gia hạn gói dịch vụ | MANAGER, RECEPTIONIST |
| POST | `/memberships/{membershipId}/suspensions` | Tạm ngưng gói (ghi nhận lý do và lịch sử) | MANAGER, RECEPTIONIST |
| POST | `/memberships/{membershipId}/reactivations` | Kích hoạt lại gói (tính bù ngày theo SRS) | MANAGER, RECEPTIONIST |
| GET | `/members/{memberId}/membership-history` | Xem toàn bộ lịch sử đăng ký, gia hạn, tạm ngưng | MANAGER, RECEPTIONIST, MEMBER (chính chủ) |

**Quy tắc nghiệp vụ Đăng ký (`POST /memberships`):**

- Client gửi lên:

  ```json
  { "memberId": "mem_001", "packageId": "pkg_001", "paymentMethod": "CASH" }
  ```

- Backend tự lấy ngày hiện tại (múi giờ VN), chụp lại giá gốc tại thời điểm mua, tính `endDate = startDate + durationDays - 1`, kiểm tra hội viên không có gói nào đang `ACTIVE`/`SUSPENDED` trùng lặp, sau đó tạo hóa đơn (`invoices`) đi kèm **trong cùng một Transaction**.

### 3.4. Lớp tập, Đăng ký lớp & Check-in (Điểm danh) ⭐ *(Bổ sung mới)*

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/classes` | Lịch lớp (thông tin HLV, phòng, sức chứa, số chỗ còn) | Đã đăng nhập |
| POST | `/classes` | Tạo lịch lớp tập mới | MANAGER, RECEPTIONIST (nếu được phân quyền) |
| GET | `/classes/{classId}` | Chi tiết một lớp học cụ thể | Đã đăng nhập |
| PATCH | `/classes/{classId}` | Cập nhật lịch, HLV, phòng, trạng thái lớp | MANAGER, RECEPTIONIST |
| GET | `/classes/{classId}/registrations` | Danh sách hội viên đã đăng ký lớp | MANAGER, RECEPTIONIST, TRAINER (phụ trách) |
| GET | `/class-registrations` | Tra cứu lịch sử đăng ký lớp của hội viên | MANAGER, RECEPTIONIST, MEMBER |
| POST | `/class-registrations` | Đăng ký vào lớp (cho bản thân hoặc thay mặt hội viên) | MEMBER, MANAGER, RECEPTIONIST |
| POST | `/class-registrations/{registrationId}/cancellations` | Hủy đăng ký lớp (lưu vết thời gian hủy) | MEMBER (sở hữu), MANAGER, RECEPTIONIST |
| POST | `/check-ins` | Quét mã điểm danh hội viên vào phòng tập hoặc lớp học | RECEPTIONIST, MANAGER |
| GET | `/check-ins` | Tra cứu lịch sử ra vào / check-in của phòng tập | MANAGER, RECEPTIONIST |

**Chi tiết Payload Check-in (`POST /check-ins`):**

```json
{
  "memberId": "mem_001",
  "type": "GYM_ACCESS" // hoặc "CLASS_CHECKIN", kèm classId nếu có
}
```

**Backend kiểm tra:** Hội viên tồn tại, trạng thái gói tập (membership) đang `ACTIVE` và chưa hết hạn → trả về `201 Created` kèm thông tin chào mừng; ngược lại trả về lỗi `409 MEMBERSHIP_EXPIRED`.

### 3.5. Báo cáo & Thống kê

| Method | Endpoint | Mô tả | Quyền hạn |
|--------|----------|-------|-----------|
| GET | `/reports/overview` | Thống kê tổng quan (số hội viên active, số lớp trong ngày) | MANAGER, RECEPTIONIST |
| GET | `/reports/memberships` | Thống kê số lượng đăng ký gói theo loại/trạng thái | MANAGER, RECEPTIONIST |
| GET | `/reports/classes` | Thống kê tình trạng lớp học (số lượng đăng ký, lớp đầy) | MANAGER, RECEPTIONIST |
| GET | `/reports/revenue` | **[Bổ sung]** Thống kê doanh thu theo ngày/tháng/gói dịch vụ | MANAGER |

---

## 4. Bảng mã lỗi nghiệp vụ chuẩn hóa (Error Codes)

| HTTP Status | `error.code` | Ý nghĩa chi tiết |
|-------------|--------------|------------------|
| 400 | `VALIDATION_ERROR` | Dữ liệu đầu vào không đúng định dạng / thiếu trường bắt buộc |
| 401 | `UNAUTHORIZED` | Token không hợp lệ hoặc đã hết hạn |
| 403 | `FORBIDDEN` | Tài khoản không đủ quyền thực hiện hành động này |
| 404 | `MEMBER_NOT_FOUND` | Không tìm thấy hội viên hoặc hội viên ở trạng thái khóa |
| 404 | `CLASS_NOT_FOUND` | Lớp học không tồn tại trong hệ thống |
| 409 | `MEMBERSHIP_REQUIRED` | Hội viên chưa mua gói tập hoặc gói tập không hiệu lực |
| 409 | `MEMBERSHIP_SUSPENDED` | Gói tập hiện đang trong trạng thái tạm ngưng |
| 409 | `MEMBERSHIP_EXPIRED` | Gói tập của hội viên đã hết hạn sử dụng |
| 409 | `DUPLICATE_REGISTRATION` | Hội viên đã đăng ký lớp học này từ trước |
| 409 | `CLASS_FULL` | Lớp học đã đạt sức chứa tối đa, không thể nhận thêm |

---

## 5. Các điểm ghi chú kỹ thuật cho việc triển khai (Implementation Notes)

- **Quản lý trạng thái Gói (Membership Status):** Trạng thái `ACTIVE` hay `EXPIRED` của gói tập nên được xử lý tự động bằng Cron Job chạy ngầm hàng ngày trên Database (so sánh `endDate` với ngày hiện tại) kết hợp cờ trạng thái `isSuspended` để tránh lệch dữ liệu.
- **Concurrency Control (Tranh chấp chỗ lớp học):** Khi nhiều hội viên đăng ký 1 lớp cùng thời điểm (gần đầy chỗ), Backend phải sử dụng cơ chế Database Transaction kèm khóa dòng (`SELECT ... FOR UPDATE`) đối với bảng `classes` để tránh vượt quá `capacity`.
- **Check-in tự động:** Thiết kế endpoint `/check-ins` sẵn sàng cho việc tích hợp máy quét mã QR Code trên thẻ hội viên hoặc app mobile sau này.
