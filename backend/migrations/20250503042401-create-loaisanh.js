"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("LOAISANH", {
      MaLoaiSanh: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      TenLoaiSanh: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        unique: true,
      },
      DonGiaBanToiThieu: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("LOAISANH");
  },
};