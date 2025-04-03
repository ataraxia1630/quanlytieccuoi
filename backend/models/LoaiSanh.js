module.exports = (sequelize, Sequelize) => {
 const LoaiSanh = sequelize.define("LoaiSanh", {
  MaLoaiSanh: {type: Sequelize.STRING, primaryKey: true },
  TenLoaiSanh: {type: Sequelize.STRING(50), allowNull: false},
  DonGiaToiThieu: {type: Sequelize.INTEGER, allowNull: false},
  SLBanToiDa: {type: Sequelize.INTEGER, allowNull: false},
  DienTichToiThieu: {type: Sequelize.FLOAT, allowNull: false},
  DienTichToiDa: {type: Sequelize.FLOAT, allowNull: false},
  GhiChu: {type: Sequelize.STRING, allowNull: true}
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return LoaiSanh
};