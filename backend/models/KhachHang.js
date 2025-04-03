const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const KhachHang = sequelize.define('KhachHang', {
        MaKH: { type: DataTypes.STRING, primaryKey: true },
        TenChuRe: { type: DataTypes.STRING(50), allowNull: false },
        TenCoDau: { type: DataTypes.STRING(50), allowNull: false },
        SDT: { type: DataTypes.STRING(12), allowNull: false },
        DiaChi: { type: DataTypes.STRING },
        Email: { type: DataTypes.STRING }
    });

    return KhachHang;
};
