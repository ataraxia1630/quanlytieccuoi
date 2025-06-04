module.exports = (sequelize, DataTypes) => {
 const DichVu = sequelize.define('DichVu', {
   MaDichVu: {
     type: DataTypes.CHAR(10),
     allowNull: false,
     primaryKey: true,
   },
   TenDichVu: {
     type: DataTypes.STRING(100),
     allowNull: false,
   },
   DonGia: {
     type: DataTypes.DECIMAL(10, 2),
     allowNull: false,
   },
   TinhTrang: {
     type: DataTypes.STRING(100),
     allowNull: false,
   }
 }, {
   tableName: 'DICHVU',
   timestamps: false
  });

  DichVu.associate = (models) => {
    DichVu.hasMany(models.Ct_DichVu, {
      foreignKey: 'MaDichVu',
    })
  }
  return DichVu;
}