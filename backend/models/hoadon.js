module.exports = (sequelize, DataTypes) => {
  const HoaDon = sequelize.define(
    "HoaDon",
    {
      SoHoaDon: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      SoPhieuDatTiec: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      NgayThanhToan: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      DonGiaBan: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      SoLuongBanDaDung: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      TongTienDichVu: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      TongTienMonAn: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      TongTienHoaDon: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      TongTienPhat: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      TienConLai: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
    },
    {
      tableName: "HOADON",
      timestamps: false,
    }
  );

  HoaDon.associate = (models) => {
    HoaDon.belongsTo(models.PhieuDatTiec, { foreignKey: "SoPhieuDatTiec" });
  };

  return HoaDon;
};