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
    Quyen.hasMany(models.PhanQuyen, { foreignKey: 'MaQuyen' });
    Quyen.belongsToMany(models.Nhom, {
      through: models.PhanQuyen,
      foreignKey: 'MaQuyen',
      otherKey: 'MaNhom',
    });
  };

  return Quyen;
};
