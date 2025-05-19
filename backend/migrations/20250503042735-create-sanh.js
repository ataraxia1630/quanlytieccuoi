"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SANH", {
      MaSanh: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      MaLoaiSanh: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        references: {
          model: "LOAISANH",
          key: "MaLoaiSanh",
        },
        onDelete: "CASCADE",
      },
      TenSanh: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      SoLuongBanToiDa: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      GhiChu: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("SANH");
  },
};