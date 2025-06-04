module.exports = (sequelize, DataTypes) => {
  const MonAn = sequelize.define(
    'MonAn',
    {
      MaMonAn: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        primaryKey: true,
      },
      TenMonAn: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      DonGia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      HinhAnh: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      TinhTrang: {
        type: DataTypes.ENUM('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
    },
    {
      tableName: 'MONAN',
      timestamps: false,
    }
  );

  MonAn.associate = (models) => {
    MonAn.hasMany(models.Ct_DatBan, {
      foreignKey: 'MaMonAn',
    });
  };
  return MonAn;
};
