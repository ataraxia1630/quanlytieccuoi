module.exports = (sequelize, DataTypes) => {
 const BaoCaoThang = sequelize.define('BaoCaoThang', {
   MaBC: {
     type: DataTypes.CHAR(10),
     primaryKey: true,
   },
   Thang: {
     type: DataTypes.TINYINT,
     allowNull: false,
   },
   Nam: {
     type: DataTypes.INTEGER,
     allowNull: false,
   },
   NgayLap: {
     type: DataTypes.DATE,
     allowNull: false,
   },
   TongDoanhThu: {
     type: DataTypes.DECIMAL(12, 2),
     allowNull: false,
   }
 }, {
   tableName: 'BAOCAOTHANG',
  });

  BaoCaoThang.associate = (models) => {
    BaoCaoThang.hasMany(models.Ct_BaoCaoTheoNgay, {
      foreignKey: 'MaBC',
    })
  }
  return BaoCaoThang;
}