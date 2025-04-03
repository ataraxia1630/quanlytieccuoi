module.exports = (sequelize, Sequelize) => {
 const PHAT = sequelize.define("PHAT", {
  MaPhat: {
   type: Sequelize.INTEGER,
   autoIncrement: true,
   primaryKey: true
  },
  TiLePhat: {
   type: sequelize.FLOAT,
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

 return PHAT
};