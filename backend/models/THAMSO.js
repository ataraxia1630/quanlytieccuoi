module.exports = (sequelize, DataTypes) => {
 const THAMSO = sequelize.define('THAMSO', {
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

 
  return THAMSO;
}