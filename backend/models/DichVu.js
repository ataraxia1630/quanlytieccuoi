module.exports = (sequelize, Sequelize) => {
 const DichVu = sequelize.define("DichVu", {
  MaDichVu: {type: Sequelize.STRING, primaryKey: true },
  TenDichVu: { type: Sequelize.STRING(50), allowNull: false},
  DonGia: {type: Sequelize.INTEGER,allowNull: false }
 
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return DichVu
};