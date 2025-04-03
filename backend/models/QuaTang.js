module.exports = (sequelize, Sequelize) => {
 const QuaTang = sequelize.define("QuaTang", {
  MaQuaTang: {type: Sequelize.STRING, primaryKey: true},
  TenQuaTang: {type: Sequelize.STRING(50), allowNull: false},
  SLTon: {type: sequelize.INTEGER, allowNull: false},
  DieuKien: {type: Sequelize.STRING, allowNull: false},
  MoTa: {type: Sequelize.STRING, allowNull: true},
  NgayApDung: {type: Sequelize.DATE, allowNull: false},
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return QuaTang
};