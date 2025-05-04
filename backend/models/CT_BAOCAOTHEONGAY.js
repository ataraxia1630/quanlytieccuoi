module.exports = (sequelize, DataTypes) => {
  const CT_BAOCAOTHEONGAY = sequelize.define(
    "CT_BAOCAOTHEONGAY",
    {
      MaBC: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      Ngay: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      SoLuongTiec: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      DoanhThu: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      TiLe: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
    },
    {
      tableName: "CT_BAOCAOTHEONGAY",
      timestamps: false
    }
  );


  CT_BAOCAOTHEONGAY.associate = (models) => {
   CT_BAOCAOTHEONGAY.belongsTo(models.BAOCAOTHANG, {
    foreignKey: "MaBC",
    targetKey: "MaBC",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
   })
  }
  return CT_BAOCAOTHEONGAY;
};
