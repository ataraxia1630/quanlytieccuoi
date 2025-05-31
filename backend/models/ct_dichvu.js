module.exports = (sequelize, DataTypes) => {
 const  Ct_DichVu = sequelize.define('Ct_DichVu', {
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
     type: DataTypes.DECIMAL(15, 2),
     allowNull: false,
   }
 }, {
   tableName: 'CT_DICHVU',
   timestamps: false
  });

  Ct_DichVu.associate = (models) => {
   Ct_DichVu.belongsTo(models.DichVu, {
     foreignKey: "MaDichVu",
     targetKey: "MaDichVu",
     onDelete: "CASCADE",
     onUpdate: "CASCADE",
   })
   Ct_DichVu.belongsTo(models.PhieuDatTiec, {
    foreignKey: "SoPhieuDatTiec",
    targetKey: "SoPhieuDatTiec",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  }
  return Ct_DichVu;
}