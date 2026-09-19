# Bài tập 17: Phòng tập gym
## Họ tên và MSSV:
1. Bách Nhật Khoa - 2506022023
2. Phạm Đình Kiên - 2506022020
## Mục tiêu:
- Gói dịch vụ có hiệu lực
- Tạm ngưng
- Sức chứa lớp

## 1. Giới thiệu đề tài

Hệ thống quản lý phòng tập Gym được xây dựng nhằm hỗ trợ quản lý các hoạt động cơ bản của một phòng tập, bao gồm quản lý hội viên, gói dịch vụ, lớp tập, huấn luyện viên và đăng ký dịch vụ.

Hệ thống giúp phòng Gym theo dõi thông tin hội viên, tình trạng sử dụng gói dịch vụ và số lượng hội viên đăng ký các lớp tập, từ đó hỗ trợ việc quản lý và vận hành phòng tập hiệu quả hơn.

## 2. Mục tiêu

- Quản lý thông tin hội viên.
- Quản lý các gói dịch vụ của phòng Gym.
- Theo dõi trạng thái và thời hạn của gói dịch vụ.
- Quản lý các lớp tập và huấn luyện viên.
- Quản lý việc đăng ký lớp của hội viên.
- Theo dõi và kiểm soát sức chứa của từng lớp.
- Hỗ trợ tra cứu và thống kê thông tin phục vụ quản lý.

## 3. Đối tượng sử dụng

### Quản lý phòng Gym
- Quản lý hội viên.
- Quản lý gói dịch vụ.
- Quản lý lớp tập và huấn luyện viên.
- Theo dõi tình trạng hoạt động của phòng Gym.
- Xem thông tin và thống kê.

### Nhân viên lễ tân
- Quản lý thông tin hội viên.
- Đăng ký và gia hạn gói dịch vụ.
- Kiểm tra trạng thái gói.
- Hỗ trợ hội viên đăng ký lớp tập.

### Huấn luyện viên
- Xem thông tin lớp được phân công.
- Theo dõi lịch tập.
- Xem danh sách hội viên trong lớp.

### Hội viên
- Xem thông tin cá nhân.
- Xem gói dịch vụ đang sử dụng.
- Theo dõi thời hạn và trạng thái gói.
- Xem lịch lớp và đăng ký lớp tập.

## 4. Các chức năng chính

### Quản lý hội viên
- Thêm, sửa, xóa và tìm kiếm hội viên.
- Xem thông tin và trạng thái hội viên.
- Theo dõi lịch sử đăng ký dịch vụ.

### Quản lý gói dịch vụ
- Thêm, sửa và xem thông tin gói dịch vụ.
- Quản lý giá, thời hạn và quyền lợi của gói.
- Theo dõi trạng thái của gói dịch vụ.

### Quản lý hiệu lực gói dịch vụ
- Theo dõi thời gian bắt đầu và kết thúc của gói.
- Quản lý trạng thái gói: Hiệu lực, Tạm ngưng, Hết hạn.
- Kiểm tra điều kiện sử dụng gói.
- Hỗ trợ kích hoạt lại gói khi phù hợp.

### Quản lý đăng ký gói
- Đăng ký gói dịch vụ cho hội viên.
- Gia hạn gói.
- Theo dõi gói đang sử dụng.
- Xem lịch sử đăng ký gói.

### Quản lý lớp tập
- Thêm, sửa và quản lý các lớp tập.
- Quản lý lịch học và phòng học.
- Phân công huấn luyện viên.
- Thiết lập sức chứa tối đa của lớp.

### Quản lý đăng ký lớp và sức chứa
- Cho phép hội viên đăng ký lớp tập.
- Kiểm tra gói dịch vụ trước khi đăng ký.
- Kiểm tra số lượng chỗ còn lại.
- Không cho phép đăng ký khi lớp đã đủ sức chứa.
- Hủy đăng ký và cập nhật lại số chỗ.

### Quản lý huấn luyện viên
- Quản lý thông tin huấn luyện viên.
- Quản lý chuyên môn.
- Theo dõi các lớp mà huấn luyện viên phụ trách.

### Tra cứu và thống kê
- Tra cứu hội viên.
- Tra cứu gói dịch vụ.
- Theo dõi gói đang hiệu lực, tạm ngưng hoặc hết hạn.
- Theo dõi số lượng hội viên đăng ký từng lớp.
- Theo dõi các lớp còn chỗ hoặc đã đầy.

## 5. Các đầu việc cần thực hiện

- Tìm hiểu nghiệp vụ và quy trình hoạt động của phòng Gym.
- Xác định các đối tượng sử dụng hệ thống.
- Phân tích yêu cầu chức năng và yêu cầu phi chức năng.
- Xác định các quy tắc nghiệp vụ của hệ thống.
- Xây dựng các mô hình và sơ đồ phân tích hệ thống.
- Thiết kế cơ sở dữ liệu.
- Thiết kế giao diện hệ thống.
- Xây dựng và hoàn thiện hệ thống.
- Kiểm thử các chức năng.
- Hoàn thiện tài liệu, báo cáo và chuẩn bị thuyết trình.

## 6. Điểm nhấn của hệ thống

Hệ thống tập trung phân tích và xử lý ba nghiệp vụ chính:

1. **Gói dịch vụ**
2. **Trạng thái gói dịch vụ: Hiệu lực / Tạm ngưng / Hết hạn**
3. **Sức chứa và đăng ký lớp tập**

Các nghiệp vụ này được liên kết với nhau trong quá trình sử dụng hệ thống.
Ví dụ:
> Hội viên muốn đăng ký một lớp tập → hệ thống kiểm tra gói dịch vụ còn hiệu lực → kiểm tra sức chứa của lớp → nếu đủ điều kiện thì cho phép đăng ký.

## 7. Phạm vi

Hệ thống tập trung vào các hoạt động quản lý và vận hành cơ bản của phòng Gym.

Các chức năng nâng cao như thanh toán trực tuyến, quản lý kho, chấm công nhân viên, tính lương hoặc ứng dụng di động không nằm trong phạm vi chính của đề tài.

## 8. Tài liệu dự án

Các tài liệu phân tích và thiết kế hệ thống sẽ được cập nhật trong quá trình thực hiện dự án.

- Phân tích yêu cầu
- Use Case
- Activity Diagram
- Sequence Diagram
- Class Diagram
- Thiết kế cơ sở dữ liệu
- Tài liệu kiểm thử
- Các tài liệu liên quan khác
