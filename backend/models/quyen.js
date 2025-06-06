module.exports = (sequelize, DataTypes) => {
  const Quyen = sequelize.define(
    'QUYEN',
    {
      MaQuyen: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      TenQuyen: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: 'QUYEN',
      timestamps: false,
    }
  );

  Quyen.associate = (models) => {
    Quyen.hasMany(models.PHANQUYEN, { foreignKey: 'MaQuyen' });
    Quyen.belongsToMany(models.NHOM, {
      through: models.PHANQUYEN,
      foreignKey: 'MaQuyen',
      otherKey: 'MaNhom',
    });
  };

  return Quyen;
};
