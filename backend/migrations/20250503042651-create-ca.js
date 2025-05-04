"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CA", {
      MaCa: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      TenCa: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      GioBatDau: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      GioKetThuc: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CA");
  },
};