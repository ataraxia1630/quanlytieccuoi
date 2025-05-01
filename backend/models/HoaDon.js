"use strict";

module.exports = (sequelize, DataTypes) => {
  const HoaDon = sequelize.define(
    "HoaDon",
    {
      SoHoaDon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SoPhieuDatTiec: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      NgayThanhToan: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      DonGiaBan: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBanDaDung: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TongTienDichVu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienMonAn: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienHoaDon: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      TongTienPhat: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      TienConLai: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "HOADON",
      timestamps: false,
    }
  );

  HoaDon.associate = (models) => {
    HoaDon.belongsTo(models.PhieuDatTiec, { foreignKey: "SoPhieuDatTiec" });
  };

  return HoaDon;
};