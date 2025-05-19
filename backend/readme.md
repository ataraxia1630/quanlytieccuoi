## Cấu trúc thư mục

```
backend/
├── config/ # Cấu hình (DB, môi trường)
│ └── config.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── migrations/ # <--- Nơi chứa các file migration (nếu có)
│ └── 20250414-create-users.js (ví dụ)
├── seeders/ # (Tuỳ chọn) Tạo dữ liệu mẫu
├── .env
├── .gitignore
├── server.js
└── package.json
```

## Hướng dẫn làm việc mới migration

```
Tạo migration cho mỗi lần thay đổi csdl: npx sequelize-cli migration:generate --name <tênfile>
Thêm migration cho khóa ngoại: npx sequelize-cli migration:generate --name add-foreign-key-to-posts
Chạy migration: npx sequelize-cli db:migrate
Rollback: sequelize db:migrate:undo
```

## Hướng dẫn sử dụng

```
npm run start:dev (cho môi trường development)
npm run start:prod (cho môi trường production)
```
