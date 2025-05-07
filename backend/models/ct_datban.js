module.exports = (sequelize, DataTypes) => {
 const Ct_DatBan = sequelize.define('Ct_DatBan', {
   MaMonAn: {
     type: DataTypes.CHAR(10),
     allowNull: false,
     primaryKey: true,
   },
   SoPhieuDatTiec: {
    type: DataTypes.CHAR(10),
    allowNull: false,
    primaryKey: true,
  },
   SoLuong: {
     type: DataTypes.TINYINT,
     allowNull: false,
   },
   DonGia: {
     type: DataTypes.DECIMAL(10, 2),
     allowNull: false,
   },
   GhiChu: {
     type: DataTypes.STRING(255),
     allowNull: true,
   }
 }, {
   tableName: 'CT_DATBAN',
   timestamps: false
  });

  Ct_DatBan.associate = (models) => {
   Ct_DatBan.belongsTo(models.MonAn, {
     foreignKey: "MaMonAn",
     targetKey: "MaMonAn",
     onDelete: "CASCADE",
     onUpdate: "CASCADE",
   })
   Ct_DatBan.belongsTo(models.PhieuDatTiec, {
    foreignKey: "SoPhieuDatTiec",
    targetKey: "SoPhieuDatTiec",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  }
  return Ct_DatBan;
}