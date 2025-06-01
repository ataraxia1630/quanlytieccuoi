"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PHIEUDATTIEC", {
      SoPhieuDatTiec: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      MaSanh: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        references: {
          model: "SANH",
          key: "MaSanh",
        },
        onDelete: "CASCADE",
      },
      TenChuRe: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      TenCoDau: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      SDT: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      NgayDaiTiec: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      MaCa: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        references: {
          model: "CA",
          key: "MaCa",
        },
        onDelete: "CASCADE",
      },
      TienDatCoc: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      SoLuongBan: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      SoBanDuTru: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
      },
      NgayDatTiec: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      TrangThai: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PHIEUDATTIEC");
  },
};