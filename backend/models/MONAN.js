module.exports = (sequelize, DataTypes) => {
 const MONAN = sequelize.define('MONAN', {
  MaMonAn: {
   type: DataTypes.CHAR(10),
   allowNull: false,
   primaryKey: true,
   },
   TenMonAn: {
     type: DataTypes.STRING(100),
     allowNull: false,
   },
   DonGia: {
     type: DataTypes.DECIMAL(10, 2),
     allowNull: false,
   },
   HinhAnh: {
     type: DataTypes.STRING(255),
     allowNull: true,
   },
   TinhTrang: {
     type: DataTypes.STRING(100),
     allowNull: true,
   }
 }, {
   tableName: 'MONAN',
   timestamps: false
  });

  MONAN.associate = (models) => {
    MONAN.hasMany(models.CT_DATBAN, {
      foreignKey: 'MaMonAn',
    })
  }
  return MONAN;
}