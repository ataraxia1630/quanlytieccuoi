const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const KhachHang = require('./KhachHang')(sequelize);
const NhanVien = require('./NhanVien')(sequelize);
const HoaDon = require('./HoaDon')(sequelize);
const TiecCuoi = require('./TiecCuoi')(sequelize);
const Ca = require('./Ca')(sequelize);
const Quyen = require('./Quyen')(sequelize);
const PhanQuyen = require('./PhanQuyen')(sequelize);
const BaoCaoThang = require('./BaoCaoThang')(sequelize);

// Định nghĩa quan hệ giữa các bảng
KhachHang.hasMany(HoaDon, { foreignKey: 'MaKH' });
HoaDon.belongsTo(KhachHang, { foreignKey: 'MaKH' });

NhanVien.belongsTo(Quyen, { foreignKey: 'MaQuyen' });
Quyen.hasMany(NhanVien, { foreignKey: 'MaQuyen' });

NhanVien.hasMany(HoaDon, { foreignKey: 'MaNhanVien' });
HoaDon.belongsTo(NhanVien, { foreignKey: 'MaNhanVien' });

TiecCuoi.belongsTo(Ca, { foreignKey: 'MaCa' });
Ca.hasMany(TiecCuoi, { foreignKey: 'MaCa' });

TiecCuoi.belongsTo(HoaDon, { foreignKey: 'MaTiecCuoi' });
HoaDon.belongsTo(TiecCuoi, { foreignKey: 'MaTiecCuoi' });

NhanVien.hasMany(Ca, { foreignKey: 'MaCa' });
Ca.hasMany(NhanVien, { foreignKey: 'MaCa' });

BaoCaoThang.hasMany(HoaDon, { foreignKey: 'MaHD' });
HoaDon.belongsTo(BaoCaoThang, { foreignKey: 'MaHD' });

Quyen.hasMany(PhanQuyen, { foreignKey: 'MaQuyen' });
PhanQuyen.belongsTo(Quyen, { foreignKey: 'MaQuyen' });

module.exports = {
    sequelize,
    KhachHang,
    NhanVien,
    HoaDon,
    TiecCuoi,
    Ca,
    Quyen,
    PhanQuyen,
    BaoCaoThang
};
