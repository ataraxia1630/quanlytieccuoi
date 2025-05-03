'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("THAMSO", {
      TenThamSo: {
      type: Sequelize.STRING(255),
      allowNull: false,
      primaryKey: true,
      },
      GiaTri: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('THAMSO');

  }
};
