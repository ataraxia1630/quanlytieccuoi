module.exports = (sequelize, DataTypes) => {
  const ThamSo = sequelize.define(
    'ThamSo',
    {
      TenThamSo: {
        type: DataTypes.STRING(255),
        primaryKey: true,
      },
      GiaTri: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'THAMSO',
      timestamps: false,
    }
  )

  return ThamSo
}
