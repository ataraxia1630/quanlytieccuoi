'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('MONAN', 'TinhTrang', {
      type: Sequelize.ENUM('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('MONAN', 'TinhTrang', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
};
