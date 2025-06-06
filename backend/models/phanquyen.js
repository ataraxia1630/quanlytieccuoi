module.exports = (sequelize, DataTypes) => {
  const PhanQuyen = sequelize.define(
    'PHANQUYEN',
    {
      MaNhom: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      MaQuyen: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: 'PHANQUYEN',
      timestamps: false,
    }
  );

  PhanQuyen.associate = (models) => {
    PhanQuyen.belongsTo(models.NHOM, {
      foreignKey: 'MaNhom',
      onDelete: 'CASCADE',
    });
    PhanQuyen.belongsTo(models.QUYEN, {
      foreignKey: 'MaQuyen',
      onDelete: 'CASCADE',
    });
  };

  return PhanQuyen;
};
