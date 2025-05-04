module.exports = (sequelize, DataTypes) => {
 const CT_DATBAN = sequelize.define('CT_DATBAN', {
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

  CT_DATBAN.associate = (models) => {
   CT_DATBAN.belongsTo(models.MONAN, {
     foreignKey: "MaMonAn",
     targetKey: "MaMonAn",
     onDelete: "CASCADE",
     onUpdate: "CASCADE",
   })
   CT_DATBAN.belongsTo(models.PHIEUDATTIEC, {
    foreignKey: "SoPhieuDatTiec",
    targetKey: "SoPhieuDatTiec",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  }
  return CT_DATBAN;
}