module.exports = (sequelize, DataTypes) => {
  const Sanh = sequelize.define(
    "Sanh",
    {
      MaSanh: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      MaLoaiSanh: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      TenSanh: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      SoLuongBanToiDa: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      GhiChu: {
        type: DataTypes.STRING(255),
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