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
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      SoLuongBan: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      SoBanDuTru: {
        type: Sequelize.TINYINT,
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