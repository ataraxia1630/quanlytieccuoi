module.exports = (sequelize, Sequelize) => {
 const SetMonAn = sequelize.define("SetMonAn", {
  MaSet: {type: Sequelize.STRING, primaryKey: true},
  TenSet: {type: Sequelize.STRING(50), allowNull: false},
  DonGia: {type: Sequelize.INTEGER, allowNull: false},
  GhiChu: {type: Sequelize.STRING(100), allowNull: true}
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return SetMonAn
};