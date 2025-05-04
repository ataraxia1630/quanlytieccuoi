module.exports = (sequelize, DataTypes) => {
  const LoaiSanh = sequelize.define(
    "LoaiSanh",
    {
      MaLoaiSanh: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      TenLoaiSanh: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true,
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