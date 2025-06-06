'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QUYEN', {
      MaQuyen: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      TenQuyen: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QUYEN');
  },
};
