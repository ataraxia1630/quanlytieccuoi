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
Tạo migration: npx sequelize-cli migration:generate --name <tênfile>
Tạo seed: npx sequelize-cli seed:generate --name <tênfile>
Xem danh sách migration: npx sequelize-cli db:migrate:status

```

## Hướng dẫn sử dụng và chạy migration, seed

### Môi trường dev

```
npm run start:dev
npm run migrate:dev (chạy tất cả file sequelize chưa được chạy)
npm run migrate:undo:all:dev (xóa tất cả bảng đã được tạo)
npm run seed:dev (chạy tất cả file seed)
npm run seed:undo:dev (xóa tất cả dữ liệu seed)
npm run db:reset:dev (thực hiện db:drop + db:create + db:migrate + db:seed:all)
```

### Môi trường test

```
npm run start:test
npm run migrate:test
npm run migrate:undo:all:test
npm run seed:test
npm run seed:undo:test
npm run db:reset:test
```

### Môi trường production

```
npm run start:prod hoặc npm start
npm run migrate:prod
npm run migrate:undo:all:prod
npm run seed:prod
npm run seed:undo:prod
npm run db:reset:prod
```
