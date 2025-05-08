const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./models/index.js"); // Import sequelize instance từ models/index.js
const models = require("./models/index.js"); // Import tất cả các model
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();
const port = process.env.DB_PORT || 3000;

const myRouter = require("./routes/index.route.js");
const requiredEnvVars = [
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_HOST",
  "DB_DIALECT",
];

// Kiểm tra các biến môi trường bắt buộc
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
});

app.use(cors());
app.use(express.json()); // Hỗ trợ JSON request body

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully");

    const { Ct_DichVu, Ct_DatBan, DichVu, MonAn, PhieuDatTiec } = models;
    

    // await DichVu.create({
    //   MaDichVu: "DV001",
    //   TenDichVu: "Nước ngọt",
    //   DonGia: 12000.0,
    // })
    // await DichVu.create({
    //   MaDichVu: "DV002",
    //   TenDichVu: "Trai cay",
    //   DonGia: 19000.0,
    // })
    // await MonAn.create({
    //   MaMonAn: "MA001",
    //   TenMonAn: "Thịt heo",
    //   DonGia: 10000.0,
    // })
    // await Ct_DichVu.create({
    //   SoPhieuDatTiec: "PDT001",
    //   MaDichVu: "DV001",
    //   SoLuong: 2,
    //   DonGia: 10000.0,
    // })
    // await Ct_DichVu.create({
    //   SoPhieuDatTiec: "PDT001",
    //   MaDichVu: "DV002",
    //   SoLuong: 2,
    //   DonGia: 20000.0,
    // })
    // await Ct_DatBan.create({
    //   SoPhieuDatTiec: "PDT001",
    //   MaMonAn: "MA001",
    //   SoLuong: 5,
    //   DonGia: 10000.0,
    // })
    
    // const existing = await HoaDon.findByPk("HD001");
    // if (!existing) {
    //   await HoaDon.create({
    //     SoHoaDon: "HD001",
    //     SoPhieuDatTiec: "PDT001", // Đảm bảo PDT001 tồn tại trong bảng PHIEUDATTIEC
    //     NgayThanhToan: new Date(),
    //     DonGiaBan: 1500000.00,
    //     SoLuongBanDaDung: 15,
    //     TongTienDichVu: 2000000.00,
    //     TongTienMonAn: 10000000.00,
    //     TongTienHoaDon: 13500000.00,
    //     TongTienPhat: 0.00,
    //     TienConLai: 0.00,
    //   });
    //   console.log("✅ Insert hóa đơn mẫu thành công!");
    // } else {
    //   console.log("ℹ️  Hóa đơn đã tồn tại, không insert lại.");
    // }
 
    // // Insert mẫu cho bảng LOAISANH
    // const loaiSanhTest = {
    //   MaLoaiSanh: "LS001",
    //   TenLoaiSanh: "Tiec",
    //   DonGiaBanToiThieu: 500000,
    // };

    // const existingLoaiSanh = await LoaiSanh.findByPk(loaiSanhTest.MaLoaiSanh);
    // if (!existingLoaiSanh) {
    //   await LoaiSanh.create(loaiSanhTest);
    //   console.log("Đã insert LOAISANH mẫu: LS001");
    // } else {
    //   console.log("LOAISANH mẫu LS001 đã tồn tại");
    // }

    // // Insert mẫu cho bảng CA
    // const caTest = {
    //   MaCa: "CA01",
    //   TenCa: "Ca 1",
    //   GioBatDau: "18:00:00",
    //   GioKetThuc: "22:00:00",
    // };

    // const existingCa = await Ca.findByPk(caTest.MaCa);
    // if (!existingCa) {
    //   await Ca.create(caTest);
    //   console.log("Đã insert CA mẫu: CA01");
    // } else {
    //   console.log("CA mẫu CA01 đã tồn tại");
    // }

    // // Insert mẫu cho bảng SANH
    // const sanhTest = {
    //   MaSanh: "S001",
    //   MaLoaiSanh: "LS001", // Foreign key từ bảng LOAISANH
    //   TenSanh: "Sảnh Hồng",
    //   SoLuongBanToiDa: 30,
    //   GhiChu: "Sảnh đẹp, view hồ bơi",
    // };

    // const existingSanh = await Sanh.findByPk(sanhTest.MaSanh);
    // if (!existingSanh) {
    //   await Sanh.create(sanhTest);
    //   console.log("Đã insert SANH mẫu: S001");
    // } else {
    //   console.log("SANH mẫu S001 đã tồn tại");
    // }

    const phieuDatTiecTest = {
      SoPhieuDatTiec: "PDT003",
      MaSanh: "S001", // Foreign key từ bảng SANH
      TenChuRe: "ABC",
      TenCoDau: "mny",
      SDT: "0912345679",
      NgayDaiTiec: new Date(),
      MaCa: "CA01", // Foreign key từ bảng CA
      TienDatCoc: 1200000,
      SoLuongBan: 2,
      SoBanDuTru: 2,
      NgayDatTiec: new Date(),
      TrangThai: false
    };

    // const existingPhieuDatTiec = await PhieuDatTiec.findByPk(phieuDatTiecTest.SoPhieuDatTiec);
    // if (!existingPhieuDatTiec) {
    //   await PhieuDatTiec.create(phieuDatTiecTest);
    //   console.log("Đã insert PHIEUDATTIEC mẫu: PDT002");
    // } else {
    //   console.log("PHIEUDATTIEC mẫu PDT001 đã tồn tại");
    // }

  })
  .catch((err) => console.error("Database connection failed:", err));

// Đồng bộ models với database (Cập nhật cơ sở dữ liệu nếu có thay đổi trong các model)
if (process.env.NODE_ENV === "development") {
  // sequelize
  //   .sync({ alter: true }) //nên dùng phương pháp migration để thay cho alter: true
  //   .then(() => console.log("Database synchronized!"))
  //   .catch((err) => console.error("Sync failed:", err.message));
}


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use(errorHandler);
myRouter(app);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
