module.exports = (sequelize, Sequelize) => {
 const ChiTietKhuyenMai = sequelize.define("ChiTietKhuyenMai", {
  MaPhat: {
   type: Sequelize.STRING, 
   primaryKey: true,
   references: {
    model: "Phat",
    key: "MaPhat"
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
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return ChiTietKhuyenMai
};