module.exports = (sequelize, DataTypes) => {
 const CT_DICHVU = sequelize.define('CT_DICHVU', {
   MaDichVu: {
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
   }
 }, {
   tableName: 'CT_DICHVU',
   timestamps: false
  });

  CT_DICHVU.associate = (models) => {
   CT_DICHVU.belongsTo(models.DICHVU, {
     foreignKey: "MaDichVu",
     targetKey: "MaDichVu",
     onDelete: "CASCADE",
     onUpdate: "CASCADE",
   })
   CT_DICHVU.belongsTo(models.PHIEUDATTIEC, {
    foreignKey: "SoPhieuDatTiec",
    targetKey: "SoPhieuDatTiec",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  }
  return CT_DICHVU;
}