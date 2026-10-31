# Thiết kế REST API - Hệ thống QLGym

**Phiên bản:** Bản nháp 1.0  
**Căn cứ:** `SRS_QLGym.md`  
**Phạm vi:** API phục vụ các client của hệ thống quản lý phòng tập. Đây là thiết kế giao tiếp, chưa phải backend đã triển khai.

## 1. Kiến trúc

```text
[Web UI: Quản lý / Lễ tân / HLV / Hội viên]
                     |
                     | HTTPS, JSON
                     v
             [REST API / Business Logic]
                     |
                     v
                 [Database]
```

Giao diện gọi API; backend xác thực, phân quyền, kiểm tra quy tắc nghiệp vụ và đọc/ghi cơ sở dữ liệu. Trình duyệt không truy cập trực tiếp database.

Giao diện web hiện tại là bản tạm và được giữ nguyên trong phạm vi thiết kế API này. API được xác định theo nghiệp vụ trong SRS, không theo cấu trúc màn hình hiện tại. Sau này, nếu triển khai hoặc tích hợp API đòi hỏi giao diện gọi endpoint hay thay đổi chức năng, chỉ cập nhật những phần web liên quan khi cần; nếu không liên quan thì giữ nguyên giao diện hiện tại. Thay đổi không tương thích ngược với contract cần được quản lý bằng phiên bản API mới.

## 2. Quy ước chung

- Base URL đề xuất: `/api/v1`.
- Dữ liệu gửi và nhận dùng JSON, tên thuộc tính `camelCase`, ngày dùng `YYYY-MM-DD`, thời điểm dùng ISO 8601 có múi giờ.
- Tài nguyên dùng danh từ số nhiều; dùng HTTP method để thể hiện thao tác.
- Contract API độc lập với framework và cách tổ chức UI; các thay đổi giao diện không tự động làm thay đổi endpoint hoặc cấu trúc dữ liệu.
- Thay đổi không tương thích ngược với contract hiện tại cần được phát hành dưới phiên bản API mới, ví dụ `/api/v2`.
- Các danh sách hỗ trợ `page` (mặc định `1`), `limit` (mặc định `20`, tối đa `100`) và tham số tìm kiếm/lọc phù hợp.
- Endpoint cần đăng nhập nhận `Authorization: Bearer <token>`. Backend kiểm tra quyền theo vai trò, không dựa vào việc ẩn nút trên giao diện.
- Vai trò: `MANAGER`, `RECEPTIONIST`, `TRAINER`, `MEMBER`.

### Định dạng phản hồi

Thành công với một tài nguyên:

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

Thành công với danh sách:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0 }
}
```

Lỗi thống nhất:

```json
{
  "error": {
    "code": "CLASS_FULL",
    "message": "Lớp đã đầy",
    "details": null
  }
}
```

Các mã HTTP chính: `200` thành công, `201` tạo thành công, `204` thành công không có nội dung, `400` dữ liệu không hợp lệ, `401` chưa đăng nhập, `403` không đủ quyền, `404` không tìm thấy, `409` xung đột nghiệp vụ, `500` lỗi hệ thống.

## 3. Endpoint

### 3.1 Tài khoản và xác thực

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| `POST` | `/auth/login` | Đăng nhập, trả token và thông tin vai trò | Công khai |
| `POST` | `/auth/logout` | Đăng xuất / thu hồi phiên | Đã đăng nhập |
| `GET` | `/auth/me` | Lấy tài khoản hiện tại | Đã đăng nhập |
| `GET` | `/users` | Danh sách tài khoản | Quản lý |
| `POST` | `/users` | Tạo tài khoản, gán vai trò và hồ sơ liên kết | Quản lý |
| `PATCH` | `/users/{userId}` | Cập nhật vai trò hoặc khóa/mở tài khoản | Quản lý |

Mật khẩu chỉ được gửi khi tạo/đặt lại và phải được backend băm trước khi lưu. Không bao giờ trả `passwordHash` trong response.

### 3.2 Hội viên, gói dịch vụ, HLV và phòng tập

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| `GET` | `/members` | Tìm theo tên, số điện thoại, mã; lọc trạng thái | Quản lý, Lễ tân |
| `POST` | `/members` | Tạo hội viên | Quản lý, Lễ tân |
| `GET` | `/members/{memberId}` | Xem hồ sơ hội viên | Quản lý, Lễ tân; Hội viên xem hồ sơ mình |
| `PATCH` | `/members/{memberId}` | Cập nhật hồ sơ/trạng thái; không xóa vật lý | Quản lý, Lễ tân |
| `GET` | `/packages` | Danh sách gói đang cung cấp hoặc toàn bộ | Đã đăng nhập |
| `POST` | `/packages` | Tạo gói | Quản lý |
| `GET` | `/packages/{packageId}` | Chi tiết gói | Đã đăng nhập |
| `PATCH` | `/packages/{packageId}` | Cập nhật thông tin hoặc ngừng cung cấp | Quản lý |
| `GET` | `/trainers` | Danh sách HLV | Đã đăng nhập |
| `POST` | `/trainers` | Tạo HLV | Quản lý |
| `GET` | `/trainers/{trainerId}` | Chi tiết HLV | Đã đăng nhập |
| `PATCH` | `/trainers/{trainerId}` | Cập nhật HLV/trạng thái | Quản lý |
| `GET` | `/rooms` | Danh sách phòng tập | Quản lý, Lễ tân |
| `POST` | `/rooms` | Tạo phòng tập | Quản lý |
| `PATCH` | `/rooms/{roomId}` | Cập nhật phòng | Quản lý |

Gợi ý lọc: `GET /members?search=0900&status=ACTIVE&page=1&limit=20`; `GET /packages?status=AVAILABLE`.

### 3.3 Đăng ký và vòng đời gói hội viên

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| `GET` | `/memberships` | Tìm/lọc đăng ký gói theo hội viên, trạng thái, thời hạn | Quản lý, Lễ tân |
| `POST` | `/memberships` | Đăng ký gói cho hội viên | Quản lý, Lễ tân |
| `GET` | `/memberships/{membershipId}` | Xem một đăng ký gói | Quản lý, Lễ tân; Hội viên xem gói mình |
| `POST` | `/memberships/{membershipId}/renewals` | Gia hạn và ghi lịch sử gia hạn | Quản lý, Lễ tân |
| `POST` | `/memberships/{membershipId}/suspensions` | Tạm ngưng, ghi lý do và lịch sử | Quản lý, Lễ tân |
| `POST` | `/memberships/{membershipId}/reactivations` | Kích hoạt lại, tính ngày được bù theo SRS | Quản lý, Lễ tân |
| `GET` | `/members/{memberId}/membership-history` | Lịch sử đăng ký, gia hạn và tạm ngưng | Quản lý, Lễ tân; Hội viên xem của mình |

Ví dụ đăng ký gói:

```http
POST /api/v1/memberships
Content-Type: application/json
```

```json
{
  "memberId": "mem_001",
  "packageId": "pkg_001"
}
```

Backend lấy ngày hiện tại theo múi giờ Việt Nam, chụp giá gói tại thời điểm đăng ký, tính `endDate = startDate + durationDays - 1`, rồi kiểm tra hội viên chưa có gói hiệu lực/tạm ngưng. Không nhận `status`, `price` hoặc `endDate` từ client làm dữ liệu quyết định.

Ví dụ gia hạn:

```http
POST /api/v1/memberships/ms_001/renewals
Content-Type: application/json
```

```json
{ "packageId": "pkg_001" }
```

Gói đang hiệu lực được nối tiếp từ ngày kết thúc hiện tại; gói hết hạn được tính từ ngày gia hạn. Từ chối gói tạm ngưng hoặc gói đã ngừng cung cấp.

### 3.4 Lớp tập và đăng ký lớp

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| `GET` | `/classes` | Lịch lớp; gồm HLV, phòng, sức chứa, số đã đăng ký và số chỗ còn | Đã đăng nhập |
| `POST` | `/classes` | Tạo lớp | Quản lý; Lễ tân nếu được cấp quyền |
| `GET` | `/classes/{classId}` | Chi tiết lớp | Đã đăng nhập |
| `PATCH` | `/classes/{classId}` | Cập nhật lịch, HLV, phòng, sức chứa hoặc trạng thái | Quản lý; Lễ tân nếu được cấp quyền |
| `GET` | `/classes/{classId}/registrations` | Danh sách hội viên đăng ký lớp | Quản lý, Lễ tân, HLV phụ trách |
| `GET` | `/class-registrations` | Tra cứu đăng ký theo hội viên/lớp/trạng thái | Quản lý, Lễ tân; Hội viên xem của mình |
| `POST` | `/class-registrations` | Đăng ký lớp cho mình hoặc thay mặt hội viên | Hội viên; Quản lý, Lễ tân |
| `POST` | `/class-registrations/{registrationId}/cancellations` | Hủy đăng ký, lưu thời điểm và nhật ký | Hội viên sở hữu; Quản lý, Lễ tân |

Lọc lịch: `GET /classes?status=OPEN&dayOfWeek=1&page=1&limit=20`. Số chỗ còn lại được tính từ số đăng ký `ACTIVE`, không nhận hoặc lưu giá trị này từ client.

Khi hội viên tự đăng ký, backend lấy `memberId` từ tài khoản đăng nhập; chỉ Quản lý/Lễ tân mới được gửi `memberId` để thao tác thay mặt. Ví dụ:

```json
{ "classId": "cls_001", "memberId": "mem_001" }
```

Backend kiểm tra theo thứ tự: hội viên hợp lệ, lớp đang mở, gói hiệu lực và chưa quá hạn, chưa đăng ký trùng, còn sức chứa. Kiểm tra sức chứa, tạo đăng ký và ghi audit log phải nằm trong một transaction; khóa lớp hoặc dùng cơ chế tương đương để ngăn đăng ký đồng thời vượt chỗ.

### 3.5 Báo cáo

| Method | Endpoint | Mô tả | Quyền |
|---|---|---|---|
| `GET` | `/reports/overview` | Tổng quan hội viên, gói và lớp | Quản lý; Lễ tân nếu được cấp quyền |
| `GET` | `/reports/memberships` | Thống kê hội viên theo gói/trạng thái | Quản lý; Lễ tân nếu được cấp quyền |
| `GET` | `/reports/classes` | Số đăng ký, sức chứa, lớp còn chỗ/đã đầy | Quản lý; Lễ tân nếu được cấp quyền |

## 4. Mã lỗi nghiệp vụ

| HTTP | `error.code` | Ý nghĩa |
|---|---|---|
| `404` | `MEMBER_NOT_FOUND` | Hội viên không tồn tại hoặc không hoạt động (E1) |
| `404` / `409` | `CLASS_NOT_OPEN` | Lớp không tồn tại hoặc không mở đăng ký (E2) |
| `409` | `MEMBERSHIP_REQUIRED` | Hội viên chưa từng đăng ký gói (E3) |
| `409` | `MEMBERSHIP_SUSPENDED` | Gói đang tạm ngưng (E4a) |
| `409` | `MEMBERSHIP_EXPIRED` | Gói đã hết hạn (E4b) |
| `409` | `DUPLICATE_REGISTRATION` | Đã đăng ký lớp này (E5) |
| `409` | `CLASS_FULL` | Lớp đã đầy (E6) |
| `403` | `FORBIDDEN` | Vai trò không được phép thực hiện thao tác |
| `400` | `VALIDATION_ERROR` | Thiếu/sai dữ liệu đầu vào |

## 5. Các điểm cần xác nhận

- SRS chưa chốt công nghệ backend/database và cơ chế token; Bearer token ở trên là đề xuất cho hợp đồng API.
- Cần xác nhận HLV/Lễ tân có được tạo hoặc cập nhật lớp không; quyền này đang được ghi là có điều kiện.
- Cần xác nhận chính sách thời hạn hủy đăng ký lớp.
- SRS mô tả trạng thái gói vừa được tính theo ngày vừa được tiến trình cập nhật; khi triển khai cần thống nhất trạng thái lưu hay trạng thái suy ra để tránh dữ liệu lệch.
