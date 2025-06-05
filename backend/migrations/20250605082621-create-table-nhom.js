'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NHOM', {
      MaNhom: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
        allowNull: false,
      },
      TenNhom: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });

    // Seed default groups
    await queryInterface.bulkInsert('NHOM', [
      { MaNhom: 'G0000', TenNhom: 'Admin' },
      { MaNhom: 'G0001', TenNhom: 'Viewer' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NHOM');
  },
};
