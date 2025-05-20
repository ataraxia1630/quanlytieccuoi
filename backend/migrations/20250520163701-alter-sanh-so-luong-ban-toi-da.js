'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SANH', 'SoLuongBanToiDa', {
      type: Sequelize.SMALLINT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SANH', 'SoLuongBanToiDa', {
      type: Sequelize.TINYINT,
      allowNull: false,
    });
  }
};