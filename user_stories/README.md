# User Stories - Hệ thống quản lý phòng tập Gym

## 1. Mục tiêu

Tài liệu này mô tả các yêu cầu nghiệp vụ từ góc nhìn người dùng và vai trò khác nhau trong hệ thống. Mỗi user story bao gồm mục tiêu, đối tượng sử dụng, hành vi mong muốn và tiêu chí chấp nhận.

## 2. Vai trò người dùng

- Quản lý phòng Gym
- Nhân viên lễ tân
- Huấn luyện viên
- Hội viên

## 3. User Stories theo vai trò

### 3.1 Quản lý phòng Gym

#### US-01: Quản lý hội viên
- Tư cách: Quản lý phòng Gym
- Story: Tôi muốn quản lý thông tin hội viên để theo dõi hồ sơ và trạng thái sử dụng dịch vụ.
- Tiêu chí chấp nhận:
  - Có thể thêm, sửa, xoá và tìm kiếm hội viên.
  - Có thể xem trạng thái hiện tại của hội viên.
  - Có thể xem lịch sử đăng ký gói và lớp.

#### US-02: Quản lý gói dịch vụ
- Tư cách: Quản lý phòng Gym
- Story: Tôi muốn quản lý gói dịch vụ để định nghĩa các lựa chọn phù hợp cho hội viên.
- Tiêu chí chấp nhận:
  - Có thể tạo, cập nhật, xóa gói dịch vụ.
  - Có thể thiết lập giá, thời hạn và quyền lợi.
  - Có thể kiểm tra trạng thái gói trong hệ thống.

#### US-03: Theo dõi báo cáo thống kê
- Tư cách: Quản lý phòng Gym
- Story: Tôi muốn xem báo cáo thống kê để đánh giá hiệu quả vận hành phòng tập.
- Tiêu chí chấp nhận:
  - Thống kê số lượng hội viên theo gói.
  - Thống kê số lượng hội viên theo lớp.
  - Theo dõi lớp còn chỗ và lớp đã đầy.

### 3.2 Nhân viên lễ tân

#### US-04: Đăng ký gói cho hội viên
- Tư cách: Nhân viên lễ tân
- Story: Tôi muốn đăng ký gói cho hội viên để họ có thể bắt đầu sử dụng dịch vụ.
- Tiêu chí chấp nhận:
  - Chọn hội viên và gói phù hợp.
  - Hệ thống lưu thông tin thời gian bắt đầu và kết thúc gói.
  - Hệ thống cập nhật trạng thái gói thành hiệu lực.

#### US-05: Gia hạn gói dịch vụ
- Tư cách: Nhân viên lễ tân
- Story: Tôi muốn gia hạn gói cho hội viên để họ tiếp tục sử dụng dịch vụ mà không bị gián đoạn.
- Tiêu chí chấp nhận:
  - Tìm thấy hội viên đang có gói.
  - Cập nhật thời hạn mới cho gói.
  - Lưu lại lịch sử gia hạn.

#### US-06: Đăng ký lớp tập cho hội viên
- Tư cách: Nhân viên lễ tân
- Story: Tôi muốn hỗ trợ hội viên đăng ký lớp tập để họ có thể tham gia đào tạo theo lịch.
- Tiêu chí chấp nhận:
  - Hệ thống kiểm tra gói đang hiệu lực.
  - Hệ thống kiểm tra số chỗ còn lại của lớp.
  - Khi lớp đầy, hệ thống cảnh báo và từ chối đăng ký.

### 3.3 Huấn luyện viên

#### US-07: Xem danh sách lớp được phụ trách
- Tư cách: Huấn luyện viên
- Story: Tôi muốn xem các lớp mà tôi phụ trách để lên kế hoạch dạy và theo dõi học viên.
- Tiêu chí chấp nhận:
  - Xem danh sách lớp được phân công.
  - Xem lịch học và phòng học.
  - Xem danh sách hội viên của từng lớp.

#### US-08: Theo dõi tình trạng học viên trong lớp
- Tư cách: Huấn luyện viên
- Story: Tôi muốn biết số lượng và danh sách học viên trong lớp để quản lý buổi tập tốt hơn.
- Tiêu chí chấp nhận:
  - Xem số lượng học viên đã đăng ký.
  - Xem danh sách hội viên hiện tại của lớp.
  - Phân biệt lớp còn chỗ và lớp đã đầy.

### 3.4 Hội viên

#### US-09: Xem thông tin cá nhân
- Tư cách: Hội viên
- Story: Tôi muốn xem thông tin cá nhân và trạng thái tài khoản để biết mình đang ở vị trí nào trong hệ thống.
- Tiêu chí chấp nhận:
  - Xem thông tin cá nhân cơ bản.
  - Xem lịch sử đăng ký và gói sử dụng.

#### US-10: Theo dõi gói dịch vụ
- Tư cách: Hội viên
- Story: Tôi muốn xem gói dịch vụ đang sử dụng và thời hạn hiệu lực để biết khi nào cần gia hạn.
- Tiêu chí chấp nhận:
  - Hiển thị tên gói, thời hạn bắt đầu và kết thúc.
  - Hiển thị trạng thái gói: hiệu lực, tạm ngưng, hết hạn.

#### US-11: Đăng ký lớp tập
- Tư cách: Hội viên
- Story: Tôi muốn đăng ký lớp tập trực tiếp trên hệ thống để dễ dàng tham gia buổi học.
- Tiêu chí chấp nhận:
  - Xem danh sách lớp có sẵn.
  - Chọn lớp phù hợp với lịch học.
  - Hệ thống xác nhận khi đăng ký thành công.
  - Hệ thống cảnh báo nếu lớp đã đầy hoặc không đủ điều kiện.

## 4. Backlog ưu tiên

### Mức ưu tiên cao
- US-04: Đăng ký gói cho hội viên
- US-05: Gia hạn gói dịch vụ
- US-06: Đăng ký lớp tập cho hội viên
- US-10: Theo dõi gói dịch vụ
- US-11: Đăng ký lớp tập

### Mức ưu tiên trung bình
- US-01: Quản lý hội viên
- US-02: Quản lý gói dịch vụ
- US-07: Xem danh sách lớp được phụ trách
- US-08: Theo dõi tình trạng học viên trong lớp

### Mức ưu tiên thấp
- US-03: Theo dõi báo cáo thống kê
- US-09: Xem thông tin cá nhân

## 5. Ghi chú

Các user story trên có thể tiếp tục được chia nhỏ thành task theo từng module khi bắt đầu phát triển. Cấu trúc này giúp nhóm xác định nhanh các chức năng cần làm trước, ưu tiên theo nhân vật người dùng và kiểm thử theo tiêu chí chấp nhận.
