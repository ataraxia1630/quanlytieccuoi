module.exports = (sequelize, Sequelize) => {
 const QUATANG = sequelize.define("QUATANG", {
  MaQuaTang: {
   type: Sequelize.INTEGER,
   autoIncrement: true,
   primaryKey: true
  },
  TenQuaTang: {
   type: Sequelize.STRING(50),
   allowNull: false
  },
  SLTon: {
   type: sequelize.INTEGER,
   allowNull: false
  },
  DieuKien: {
   type: Sequelize.STRING,
   allowNull: false
  },
  MoTa: {
   type: Sequelize.STRING,
   allowNull: true
  },
  NgayApDung: {
   type: Sequelize.DATE,
   allowNull: false
  },
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return Sanh
};