module.exports = (sequelize, Sequelize) => {
 const SANH = sequelize.define("SANH", {
  MaSanh: {
   type: Sequelize.INTEGER,
   autoIncrement: true,
   primaryKey: true
  },
  MaLoaiSanh: {
   type: Sequelize.INTEGER,
   allowNull: false,
   references: {
    model: "LOAISANH",
    key: "MaLoaiSanh"
   },
   onDelete: "CASCADE"
  },
  TenSanh: {
   type: Sequelize.STRING(50),
   allowNull: false
  },
  DienTich: {
   type: Sequelize.FLOAT,
   allowNull: false
  },
  HinhAnh: {
   type: Sequelize.STRING,
   allowNull: true
  },
 }, {
  timestamps: true,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
 });

 return SANH
};