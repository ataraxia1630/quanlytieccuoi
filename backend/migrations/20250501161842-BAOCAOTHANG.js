'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("BAOCAOTHANG", {
      MaBC: {
        type: Sequelize.CHAR(10),
        primaryKey: true,
      },
      Thang: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      Nam: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      NgayLap: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      TongDoanhThu: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('BAOCAOTHANG');
  }
};
