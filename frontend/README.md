# Project Name

## Mô tả

Dự án ReactJS với cấu trúc thư mục được tổ chức hợp lý giúp dễ dàng quản lý và mở rộng.
Một số folder có thể đc thêm vào / loại bỏ tùy theo quy mô của dự án.

## Cài đặt

1. Cài đặt các package:
   npm install
2. Chạy dự án:
   npm start

## Cấu trúc thư mục

```
project-root/
├── node_modules/      # Thư viện của dự án
├── public/            # Thư mục chứa static files (index.html, favicon, ...)
├── src/               # Mã nguồn chính của dự án
│   ├── app/           # Source code chính
│   │   ├── assets/    # Tài nguyên (hình ảnh, icon, ...)
│   │   ├── components/ # Component dùng chung (Button, Input, ...)
│   │   ├── hooks/      # Custom hooks
│   │   ├── layouts/    # Layout chính (Header, Footer, 404 page, ...)
│   │   ├── locales/    # File ngôn ngữ (en.json, vn.json, ...)
│   │   ├── models/     # Định nghĩa model dữ liệu
│   │   ├── modules/    # Thư viện tự xây dựng
│   │   ├── pages/      # Mã nguồn các trang
│   │   ├── routes/     # Router của dự án
│   │   ├── styles/     # CSS chung
│   │   ├── mocks/      # Data mock cho dự án
│   │   ├── settings/   # Cấu hình môi trường
│   │   ├── App.js      # Component App chính
│   │   ├── index.js    # File khởi chạy chính
├── .gitignore         # Các file/folder bị bỏ qua khi commit
├── package.json       # Các thông tin dự án (tên, phiên bản, dependencies, ...)
├── package-lock.json  # Lưu lại dependencies với phiên bản cố định
├── README.md          # Tài liệu hướng dẫn dự án
```

## Đóng góp

Nếu cảm thấy cần thiết hãy bổ sung thêm các folder và hướng dẫn tương ứng
