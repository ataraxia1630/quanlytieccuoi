'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CT_DATBAN', {
      MaMonAn: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        primaryKey: true,
      },
      SoPhieuDatTiec: {
        type: Sequelize.CHAR(10),
        allowNull: false,
        primaryKey: true,
      },
      SoLuong: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      DonGia: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      GhiChu: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CT_DATBAN')
  },
}
