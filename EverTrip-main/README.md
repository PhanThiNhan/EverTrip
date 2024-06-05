# Quản Lý Khu Cắm Trại

Đây là một ứng dụng được xây dựng bằng Node.js, Express và React.js để quản lý các khu cắm trại. Ứng dụng cho phép người dùng thực hiện các thao tác như thêm, sửa, xóa, tìm kiếm và thống kê về các khu cắm trại.

## Cài Đặt

1. Clone repository này về máy của bạn:
2. Di chuyển vào thư mục dự án:
3. Cài đặt các dependency cần thiết:
   - npm install
5. Cấu hình cơ sở dữ liệu MySQL trong file `config/db.js`.
6. Chạy ứng dụng:
   - npm start

## Cấu Trúc Thư Mục Backend

- `controllers`: Chứa các logic xử lý nghiệp vụ.
- `models`: Định nghĩa các model của cơ sở dữ liệu.
- `routes`: Định nghĩa các router của API.
- `config`: Cấu hình ứng dụng.
- `index.js`: File chính khởi chạy ứng dụng.

## Công Nghệ Sử Dụng

- Node.js
- Express.js
- MySQL
- React.js

## Tính Năng

- Thêm, sửa, xóa khu cắm trại.
- Tìm kiếm khu cắm trại theo tên, địa chỉ.
- Phê duyệt hoặc từ chối khu cắm trại.
- Thống kê số lượng khu cắm trại, doanh thu, ...

