'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CT_DICHVU', {
      MaDichVu: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        primaryKey: true,
      },
      SoPhieuDatTiec: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        primaryKey: true,
      },
      SoLuong: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      DonGia: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CT_DICHVU');
  }
};
