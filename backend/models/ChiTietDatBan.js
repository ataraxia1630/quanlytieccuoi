module.exports = (sequelize, Sequelize) => {
 const ChiTietDatBan = sequelize.define("ChiTietDatBan", {
  MaTiecCuoi: {
   type: Sequelize.STRING, 
   primaryKey: true,
   references: {
    model: "TiecCuoi",
    key: "MaTiecCuoi"
   }
  },
  MaDatBan: {
   type: Sequelize.INTEGER,
   primaryKey: true,
   references: {
    model: "DatBan",
    key: "MaDatBan"
   }
  },
  SLBan: {type: Sequelize.INTEGER, allowNull: false},
  SLBanDuTru: {type: Sequelize.INTEGER, allowNull: false},
  DonGiaBan: {type: Sequelize.INTEGER, allowNull: false},
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return ChiTietDatBan
};