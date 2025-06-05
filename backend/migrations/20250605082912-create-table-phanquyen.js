'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PHANQUYEN', {
      MaNhom: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'NHOM',
          key: 'MaNhom',
        },
        onDelete: 'CASCADE',
      },
      MaQuyen: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'QUYEN',
          key: 'MaQuyen',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PHANQUYEN');
  },
};
