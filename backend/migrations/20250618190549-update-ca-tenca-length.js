'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('CA', 'TenCa', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('CA', 'TenCa', {
      type: Sequelize.STRING(5),
      allowNull: false,
    });
  }
};
