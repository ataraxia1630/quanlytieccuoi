"use strict";

module.exports = (sequelize, DataTypes) => {
  const LoaiSanh = sequelize.define(
    "LoaiSanh",
    {
      MaLoaiSanh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TenLoaiSanh: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      DonGiaBanToiThieu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "LOAISANH",
      timestamps: false,
    }
  );

  LoaiSanh.associate = (models) => {
    LoaiSanh.hasMany(models.Sanh, { foreignKey: "MaLoaiSanh" });
  };

  return LoaiSanh;
};