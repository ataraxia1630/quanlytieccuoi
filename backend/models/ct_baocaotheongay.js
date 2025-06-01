module.exports = (sequelize, DataTypes) => {
  const Ct_BaoCaoTheoNgay = sequelize.define(
    "Ct_BaoCaoTheoNgay",
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
        type: DataTypes.DECIMAL(18, 2),
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


  Ct_BaoCaoTheoNgay.associate = (models) => {
    Ct_BaoCaoTheoNgay.belongsTo(models.BaoCaoThang, {
    foreignKey: "MaBC",
    targetKey: "MaBC",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
   })
  }
  return Ct_BaoCaoTheoNgay;
};
