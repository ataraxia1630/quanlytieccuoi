module.exports = (sequelize, DataTypes) => {
  const Nhom = sequelize.define(
    'NHOM',
    {
      MaNhom: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      TenNhom: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'NHOM',
      timestamps: false,
    }
  );

  Nhom.associate = (models) => {
    Nhom.hasMany(models.User, { foreignKey: 'MaNhom' });
    Nhom.hasMany(models.PhanQuyen, { foreignKey: 'MaNhom' });
  };

  // Automatically create default groups
  Nhom.afterSync(async () => {
    // Create Admin group (G0000)
    const adminCount = await Nhom.count({ where: { MaNhom: 'G0000' } });
    if (adminCount === 0) {
      await Nhom.create({ MaNhom: 'G0000', TenNhom: 'Admin' });
    }

    // Create Viewer group (G0001)
    const viewerCount = await Nhom.count({ where: { MaNhom: 'G0001' } });
    if (viewerCount === 0) {
      await Nhom.create({ MaNhom: 'G0001', TenNhom: 'Viewer' });
    }
  });

  return Nhom;
};
