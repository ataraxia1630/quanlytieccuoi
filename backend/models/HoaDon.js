const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const HoaDon = sequelize.define("HoaDon", {
        MaHD: { type: DataTypes.STRING, primaryKey: true },
        MaTiecCuoi: { type: DataTypes.STRING, allowNull: false },
        MaKH: { type: DataTypes.STRING, allowNull: false },
        MaNhanVien: { type: DataTypes.STRING, allowNull: false },
        NgayThanhToan: { type: DataTypes.DATE, allowNull: false },
        TongTienBan: { type: DataTypes.FLOAT, allowNull: false },
        TongTienDichVu: { type: DataTypes.FLOAT, allowNull: false },
        TongChiPhiKhac: { type: DataTypes.FLOAT, allowNull: false },
        TienDatCoc: { type: DataTypes.FLOAT, allowNull: false },
        TienConLai: { type: DataTypes.FLOAT, allowNull: false }
    });

    return HoaDon;
};
