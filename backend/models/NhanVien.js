const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const NhanVien = sequelize.define("NhanVien", {
        MaNV: { type: DataTypes.STRING, primaryKey: true },
        MaQuyen: { type: DataTypes.STRING, allowNull: false },
        HoTen: { type: DataTypes.STRING(50), allowNull: false },
        NgayVaoLam: { type: DataTypes.DATE, allowNull: false },
        MatKhau: { type: DataTypes.STRING, allowNull: false },
        SDT: { type: DataTypes.STRING(12), allowNull: false },
        DiaChi: { type: DataTypes.STRING },
        Email: { type: DataTypes.STRING }
    });

    return NhanVien;
};
