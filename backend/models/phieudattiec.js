module.exports = (sequelize, DataTypes) => {
  const PhieuDatTiec = sequelize.define(
    "PhieuDatTiec",
    {
      SoPhieuDatTiec: {
        type: DataTypes.CHAR(10),
        primaryKey: true,
      },
      MaSanh: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      TenChuRe: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      TenCoDau: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      SDT: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      NgayDaiTiec: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      MaCa: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      TienDatCoc: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      SoLuongBan: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      SoBanDuTru: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
      },
      NgayDatTiec: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      TrangThai: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "PHIEUDATTIEC",
      timestamps: false,
    }
  );

  PhieuDatTiec.associate = (models) => {
    PhieuDatTiec.belongsTo(models.Sanh, { foreignKey: "MaSanh" });
    PhieuDatTiec.belongsTo(models.Ca, { foreignKey: "MaCa" });
    PhieuDatTiec.hasOne(models.HoaDon, { foreignKey: "SoPhieuDatTiec" });
    PhieuDatTiec.hasMany(models.Ct_DichVu, {
      foreignKey: 'SoPhieuDatTiec',
    })
    PhieuDatTiec.hasMany(models.Ct_DatBan, {
      foreignKey: 'SoPhieuDatTiec',
    })
  };

  return PhieuDatTiec;
};