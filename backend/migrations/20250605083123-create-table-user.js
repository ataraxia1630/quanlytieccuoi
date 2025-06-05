'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('USER', {
      username: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      MaNhom: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        defaultValue: 'G0001',
        references: {
          model: 'NHOM',
          key: 'MaNhom',
        },
      },
    });

    // Seed default user
    await queryInterface.bulkInsert('USER', [
      { username: 'defaultUser', password: 'defaultPass123', MaNhom: 'G0000' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('USER');
  },
};
