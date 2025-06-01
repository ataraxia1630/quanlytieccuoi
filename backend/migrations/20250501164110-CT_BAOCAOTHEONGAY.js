'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("CT_BAOCAOTHEONGAY", {
      MaBC: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      Ngay: {
        type: Sequelize.DATE,
        primaryKey: true,
      },
      SoLuongTiec: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      DoanhThu: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      TiLe: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('CT_BAOCAOTHEONGAY');
  }
};
