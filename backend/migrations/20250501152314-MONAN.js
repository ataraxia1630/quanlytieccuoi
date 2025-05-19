'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("MONAN", {
      MaMonAn: {
      type: Sequelize.CHAR(10),
      allowNull: false,
      primaryKey: true,
      },
      TenMonAn: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      DonGia: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      HinhAnh: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      TinhTrang: {
        type: Sequelize.STRING(100),
        allowNull: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("MONAN");
  }
};
