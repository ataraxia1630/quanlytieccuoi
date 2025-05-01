"use strict";

module.exports = (sequelize, DataTypes) => {
  const PhieuDatTiec = sequelize.define(
    "PhieuDatTiec",
    {
      SoPhieuDatTiec: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaSanh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TenChuRe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TenCoDau: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SDT: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NgayDaiTiec: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      MaCa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TienDatCoc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SoBanDuTru: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      NgayDatTiec: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      TrangThai: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "PHIEUDATTIEC",
      timestamps: false,
    }
  );

  PhieuDatTiec.associate = (models) => {
    PhieuDatTiec.belongsTo(models.Sanh, { foreignKey: "MaSanh" });
    PhieuDatTiec.belongsTo(models.Ca, { foreignKey: "MaCa" });
    PhieuDatTiec.hasOne(models.HoaDon, { foreignKey: "SoPhieuDatTiec" });
  };

  return PhieuDatTiec;
};