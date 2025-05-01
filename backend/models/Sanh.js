"use strict";

module.exports = (sequelize, DataTypes) => {
  const Sanh = sequelize.define(
    "Sanh",
    {
      MaSanh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      MaLoaiSanh: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TenSanh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      SoLuongBanToiDa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      GhiChu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "SANH",
      timestamps: false,
    }
  );

  Sanh.associate = (models) => {
    Sanh.belongsTo(models.LoaiSanh, { foreignKey: "MaLoaiSanh" });
    Sanh.hasMany(models.PhieuDatTiec, { foreignKey: "MaSanh" });
  };

  return Sanh;
};