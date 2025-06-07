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
    Nhom.hasMany(models.USER, { foreignKey: 'MaNhom' });
    Nhom.hasMany(models.PHANQUYEN, { foreignKey: 'MaNhom' });
    Nhom.belongsToMany(models.QUYEN, {
      through: models.PHANQUYEN,
      foreignKey: 'MaNhom',
      otherKey: 'MaQuyen',
    });
  };

  return Nhom;
};
