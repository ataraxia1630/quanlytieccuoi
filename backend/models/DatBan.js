module.exports = (sequelize, Sequelize) => {
 const DatBan = sequelize.define("DatBan", {
  MaDatBan: {type: Sequelize.STRING, primaryKey: true},
  MaMonAn: {
   type: Sequelize.STRING,
   allowNull: false,
   references: {
    model: "MonAnLe",
    key: "MaMonAn"
   }
  },
  MaSet: {
   type: Sequelize.INTEGER,
   allowNull: false,
   references: {
    model: "SetMonAn",
    key: "MaSet"
   }
  },
  SLDichVu: {type: Sequelize.INTEGER, allowNull: false},
  SLMonAn: {type: Sequelize.INTEGER, allowNull: false},
  SLSetMonAn: {type: Sequelize.INTEGER, allowNull: false},
  
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return DatBan
};