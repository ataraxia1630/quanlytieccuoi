module.exports = (sequelize, DataTypes) => {
  const Ca = sequelize.define(
    "Ca",
    {
      MaCa: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },      TenCa: {
        type: DataTypes.STRING(50),
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