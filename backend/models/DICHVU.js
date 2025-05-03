module.exports = (sequelize, DataTypes) => {
 const DICHVU = sequelize.define('DICHVU', {
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
     allowNull: true,
   }
 }, {
   tableName: 'DICHVU',
   timestamps: false
  });

  DICHVU.associate = (models) => {
    DICHVU.hasMany(models.CT_DICHVU, {
      foreignKey: 'MaDichVu',
    })
  }
  return DICHVU;
}