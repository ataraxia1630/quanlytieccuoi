module.exports = (sequelize, DataTypes) => {
 const ThamSo = sequelize.define('ThamSo', {
  TenThamSo: {
   type: DataTypes.CHAR(10),
   primaryKey: true,
   },
   GiaTri: {
     type: DataTypes.INTEGER,
     allowNull: false,
   },
 }, {
   tableName: 'THAMSO',
   timestamps: false
  });

 
  return ThamSo;
}