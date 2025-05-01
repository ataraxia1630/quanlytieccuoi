"use strict";

module.exports = (sequelize, DataTypes) => {
  const Ca = sequelize.define(
    "Ca",
    {
      MaCa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TenCa: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      GioBatDau: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      GioKetThuc: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      tableName: "CA",
      timestamps: false,
    }
  );

  Ca.associate = (models) => {
    Ca.hasMany(models.PhieuDatTiec, { foreignKey: "MaCa" });
  };

  return Ca;
};