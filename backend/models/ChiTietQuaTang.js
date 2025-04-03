module.exports = (sequelize, Sequelize) => {
 const ChiTietQuaTang = sequelize.define("ChiTietQuaTang", {
  MaQuaTang: {
   type: Sequelize.STRING, 
   primaryKey: true,
   references: {
    model: "QuaTang",
    key: "MaQuaTang"
   }
  },
  MaTiecCuoi: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   references: {
    model: "TiecCuoi",
    key: "MaTiecCuoi"
   }
  },
  SLQuaTang: {type: Sequelize.INTEGER, allowNull: false},

 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return ChiTietQuaTang
};