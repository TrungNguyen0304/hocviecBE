# MỤC LỤC
[1. Mô tả bài toán:	1](#_toc195535399)

[1.1 Hoạt động và yêu cầu chức năng quản lý:	1](#_toc195535400)

[1.2 Hoạt động và yêu cầu chức năng nhân viên:	1](#_toc195535401)

[2. Sơ đồ Use Case	2](#_toc195535402)

[2.1 Mô tả sơ đồ use case	2](#_toc195535403)

[2.1.1 Đăng nhập	2](#_toc195535404)

[2.1.2 Quản lý nhân viên	3](#_toc195535405)

[2.1.3 Giao việc cho nhân viên	3](#_toc195535406)

[2.1.4 Theo dõi tiến độ công việc	4](#_toc195535407)

[2.1.4 Xem báo cáo công việc hằng ngày từ nhân viên	5](#_toc195535408)

[2.1.5 Gửi báo cáo công việc hằng ngày	5](#_toc195535409)

[2.1.6 Cập nhật trạng thái công việc	6](#_toc195535410)

[2.1.7 Xem công việc được giao	6](#_toc195535411)

[2.1.8 Xem phản hồi từ quản lý	7](#_toc195535412)

[3. Mô hình lớp	8](#_toc195535413)



PHÂN TÍCH

Để bài: hệ thông quản lý giao việc cho nhân viên và báo cáo công việc hàng ngày
# <a name="_toc195535399"></a>1. Mô tả bài toán:
Hệ thống quản lý công việc giữa quản lý và nhân viên được xây dựng nhằm hỗ trợ giao việc, theo dõi tiến độ và báo cáo công việc hàng ngày.
## <a name="_toc195535400"></a>1.1 Hoạt động và yêu cầu chức năng quản lý:
- Đăng nhập hệ thống
- Tạo và quản lý tài khoản nhân viên
  - Thêm, sửa, xóa thông tin nhân viên
- Giao việc cho từng nhân viên 
  - Tạo công việc mới
  - Phân công công việc cho từng nhân viên
  - Đặt thời hạn hoàn thành
- Theo dõi tiến độ và trạng thái công việc
  - Xem danh sách công việc theo từng nhân viên
  - Kiểm tra trạng thái và mức độ hoàn thành
- Xem báo cáo công việc hàng ngày từ nhân viên
  - Xem nội dung báo cáo do nhân viên gửi
  - Đánh giá hiệu quả làm việc theo từng ngày hoặc theo công việc
- Nhận thông báo khi nhân viên không gửi báo cáo
  - Hệ thống sẽ tự động kiểm tra tần suất gửi báo cáo hàng ngày
  - Nếu quá hạn quản lý không nhận được báo cáo từ một nhân viên, hệ thống sẽ gửi thông báo cho quản lý để kịp thời theo dõi và xử lý
## <a name="_toc195535401"></a>1.2 Hoạt động và yêu cầu chức năng nhân viên:
- Đăng nhập hệ thống
- Nhận và xem danh sách công việc được giao	
  - Xem danh sách công việc mà quản lý đã phân công
  - Xem chi tiết nội dung, thời hạn và yêu cầu công việc
- Cập nhật trạng thái công việc (đang làm, đã hoàn thành, v.v.)
  - Thay đổi trạng thái công việc (chưa làm, đang làm, đã hoàn thành)
  - Ghi chú thông tin liên quan đến quá trình thực hiện
- Gửi báo cáo công việc hàng ngày cho quản lý
  - Tạo báo cáo cho từng ngày làm việc
  - Ghi lại những việc đã làm, tiến độ, khó khăn gặp phải
  - Gửi báo cáo cho quản lý xem và đánh giá
- Xem phản hồi từ quản lý (nếu có):
  - Xem các nhận xét, đánh giá từ quản lý về công việc hoặc báo cáo
# <a name="_toc195535402"></a>2. Sơ đồ Use Case
![Mô tả ảnh](https://github.com/TrungNguyen0304/hocviecBE/blob/main/images/cec68007-e3c1-4602-bc31-64b44f8c560f.jpg)


## <a name="_toc195535403"></a>2.1 Mô tả sơ đồ use case
### <a name="_toc195535404"></a>2.1.1 Đăng nhập
- Tác nhân chính: Quản lý, Nhân viên
- Điều kiện tiên quyết:
  - Người dùng đã có tài khoản trong hệ thống.
  - Truy cập vào giao diện đăng nhập của hệ thống.
- Luồng sự kiện chính:
  - Người dùng truy cập hệ thống và chọn chức năng "Đăng nhập".
  - Nhập thông tin tài khoản (email và mật khẩu).
  - Nhấn nút "Đăng nhập".
  - Hệ thống xác thực thông tin người dùng.
- Kết quả mong đợi:
  - Người dùng đăng nhập thành công và được chuyển đến giao diện tương ứng với vai trò.
- Luồng sự kiện thay thế:
  - Nếu thông tin đăng nhập không hợp lệ:
    - Hệ thống thông báo lỗi và yêu cầu nhập lại.
### <a name="_toc195535405"></a>2.1.2 Quản lý nhân viên
- Tác nhân chính: Quản lý
- Điều kiện tiên quyết: Quản lý đã đăng nhập vào hệ thống.
- Luồng sự kiện chính:
  - Quản lý truy cập chức năng "Quản lý nhân viên".
  - Xem danh sách nhân viên hiện có.
  - Thực hiện các thao tác thêm/sửa/xóa thông tin nhân viên.
- Kết quả mong đợi:
  - Danh sách nhân viên được cập nhật theo thao tác của quản lý.
- Luồng sự kiện thay thế:
  - Nếu thao tác cập nhật thất bại (ví dụ: thiếu thông tin), hệ thống thông báo lỗi và yêu cầu chỉnh sửa lại.
### <a name="_toc195535406"></a>2.1.3 Giao việc cho nhân viên
- Tác nhân chính: Quản lý
- Điều kiện tiên quyết: Quản lý đã đăng nhập và có danh sách nhân viên.
- Luồng sự kiện chính:
  - Quản lý truy cập chức năng "Giao việc".
  - Chọn nhân viên cần giao việc.
  - Nhập thông tin công việc (tiêu đề, mô tả, deadline, v.v.).
  - Nhấn nút “Giao việc”.
- Kết quả mong đợi:
  - Nhân viên được thông báo và có thể xem công việc mới được giao.
- Luồng sự kiện thay thế:
  - Nếu thiếu thông tin bắt buộc, hệ thống yêu cầu bổ sung trước khi cho phép giao việc.
### <a name="_toc195535407"></a>2.1.4 Theo dõi tiến độ công việc
- Tác nhân chính: Quản lý
- Điều kiện tiên quyết: 
  - Quản lý đã đăng nhập.
  - Đã có công việc được giao cho nhân viên.
- Luồng sự kiện chính:
  - Quản lý truy cập chức năng “Theo dõi tiến độ công việc”.
  - Hệ thống hiển thị danh sách nhân viên đang làm việc.
  - Quản lý chọn một nhân viên cụ thể để xem chi tiết.
  - Hệ thống hiển thị:
    - Danh sách công việc đã giao cho nhân viên đó.
    - Trạng thái hiện tại của từng công việc (Đang làm, Đã hoàn thành, Đang chờ, v.v.).
- Kết quả mong đợi:
  - Quản lý nắm được tiến độ thực hiện các công việc đã giao.
- Luồng sự kiện thay thế:
  - Nếu nhân viên chưa có công việc được giao:
    - Hệ thống hiển thị thông báo “Hiện tại nhân viên chưa có công việc nào.”
  - Nếu có lỗi khi truy xuất dữ liệu:
    - Hệ thống hiển thị thông báo lỗi “Không thể tải dữ liệu công việc. Vui lòng thử lại sau.”
### <a name="_toc195535408"></a>2.1.4 Xem báo cáo công việc hằng ngày từ nhân viên
- Tác nhân chính: Quản lý
- Điều kiện tiên quyết: Quản lý đã đăng nhập.
- Luồng sự kiện chính:
  - Quản lý truy cập mục “Báo cáo hằng ngày”.
  - Chọn ngày hoặc nhân viên để lọc báo cáo.
  - Xem nội dung chi tiết báo cáo của nhân viên.
- Kết quả mong đợi:
  - Quản lý nắm được tình hình công việc hàng ngày.
- Luồng sự kiện thay thế:
  - Nếu nhân viên chưa gửi báo cáo, hệ thống thông báo “Chưa có báo cáo cho ngày này”.
### <a name="_toc195535408"></a>2.1.4 Nhận thông báo khi nhân viên không gửi báo cáo
- Tác nhân chính: quản lý
- Điều kiện tiên quyết: Quản lý đăng nhập vào hệ thống
- Luồng sự kiến chính:
  - Hệ thống theo dõi tần suất gửi báo cáo của từng nhân viên theo ngày.
  - Nếu một nhân viên không gửi báo cáo công việc quán hạn:
      - Hệ thống tự động tạo thông báo.
      - Gửi thông báo đến tài khoản của quản lý
  - Quản lý nhận thông báo và truy cập thông tin chi tiết (tên nhân viên, ngày không gửi báo cáo,...).
- Kết quả mong đợi:
  - Quản lý được thông báo kịp thời khi có nhân viên không gửi báo cáo.
  - Giúp quản lý theo dõi được tiến độ và tính chủ động của nhân viên.
- Luồng sự kiện thay thế:
### <a name="_toc195535409"></a>2.1.5 Gửi báo cáo công việc hằng ngày
- Tác nhân chính: Nhân viên
- Điều kiện tiên quyết: Nhân viên đã đăng nhập.
- Luồng sự kiện chính:
  - Nhân viên chọn chức năng “Gửi báo cáo hằng ngày”.
  - Nhập nội dung công việc đã làm, khó khăn, đề xuất, thời gian hoàn thành, v.v.
  - Nhấn “Gửi”.
- Kết quả mong đợi:
  - Báo cáo được gửi tới quản lý và lưu vào hệ thống.
- Luồng sự kiện thay thế:
  - Nếu thiếu thông tin hoặc lỗi hệ thống, báo cáo không gửi được và người dùng nhận được thông báo lỗi.
### <a name="_toc195535410"></a>2.1.6 Cập nhật trạng thái công việc
- Tác nhân chính: Nhân viên
- Điều kiện tiên quyết: Nhân viên đã đăng nhập và có công việc được giao.
- Luồng sự kiện chính:
  - Nhân viên chọn công việc cần cập nhật.
  - Chọn trạng thái mới (Đang làm, Đã hoàn thành, Đang chờ, v.v.).
  - Nhấn “Cập nhật”.
- Kết quả mong đợi:
  - Trạng thái công việc được cập nhật và hiển thị cho quản lý.
- Luồng sự kiện thay thế:
  - Nếu chọn trạng thái không hợp lệ, hệ thống sẽ hiển thị lỗi và không lưu thay đổi.
### <a name="_toc195535411"></a>2.1.7 Xem công việc được giao
- Tác nhân chính: Nhân viên
- Điều kiện tiên quyết: Nhân viên đã đăng nhập và có công việc được giao.
- Luồng sự kiện chính:
  - Nhân viên chọn mục “Công việc được giao”.
  - Hệ thống hiển thị danh sách công việc đang chờ xử lý, đang làm hoặc đã hoàn thành.
- Kết quả mong đợi:
  - Nhân viên có thể xem chi tiết các công việc đã được giao.
- Luồng sự kiện thay thế:
  - Nếu không có công việc nào được giao, hệ thống hiển thị thông báo phù hợp.
### <a name="_toc195535412"></a>2.1.8 Xem phản hồi từ quản lý
- Tác nhân chính: Nhân viên
- Điều kiện tiên quyết: Nhân viên đã gửi báo cáo công việc.
- Luồng sự kiện chính:
  - Nhân viên truy cập mục “Phản hồi từ quản lý”.
  - Hệ thống hiển thị danh sách phản hồi (nhận xét, đánh giá, yêu cầu cải thiện, v.v.) ứng với từng báo cáo đã gửi.
- Kết quả mong đợi:
  - Nhân viên đọc được nhận xét từ quản lý và có hướng điều chỉnh phù hợp.
- Luồng sự kiện thay thế:
  - Nếu chưa có phản hồi, hệ thống hiển thị thông báo “Chưa có phản hồi từ quản lý”.
# <a name="_toc195535413"></a>3. Mô hình lớp 
![Mô tả ảnh](https://github.com/TrungNguyen0304/hocviecBE/blob/main/images/f7eff077-f949-4458-bc0f-0d6fd88382e1.jpg)


