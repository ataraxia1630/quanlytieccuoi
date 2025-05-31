'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'CA',
      [
        {
          MaCa: 'CA001',
          TenCa: 'Trưa',
          GioBatDau: '7:30:00',
          GioKetThuc: '14:00:00',
        },
        {
          MaCa: 'CA002',
          TenCa: 'Tối',
          GioBatDau: '15:30:00',
          GioKetThuc: '22:00:00',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CA', null, {})
  },
}
