'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("DICHVU", {
      MaDichVu: {
      type: Sequelize.CHAR(10),
      allowNull: false,
      primaryKey: true,
      },
      TenDichVu: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      DonGia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      TinhTrang: {
        type: Sequelize.STRING(100),
        allowNull: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("DICHVU");
  }
};
