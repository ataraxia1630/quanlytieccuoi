module.exports = (sequelize, DataTypes) => {
 const BAOCAOTHANG = sequelize.define('BAOCAOTHANG', {
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

  BAOCAOTHANG.associate = (models) => {
    BAOCAOTHANG.hasMany(models.CT_BAOCAOTHEONGAY, {
      foreignKey: 'MaBC',
    })
  }
  return BAOCAOTHANG;
}