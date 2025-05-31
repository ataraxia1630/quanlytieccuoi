"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("HOADON", {
      SoHoaDon: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      SoPhieuDatTiec: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        references: {
          model: "PHIEUDATTIEC",
          key: "SoPhieuDatTiec",
        },
        onDelete: "CASCADE",
      },
      NgayThanhToan: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      DonGiaBan: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBanDaDung: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      TongTienDichVu: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      TongTienMonAn: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      TongTienHoaDon: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      TongTienPhat: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },
      TienConLai: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("HOADON");
  },
};