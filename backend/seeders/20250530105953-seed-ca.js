'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'CA',
      [
        {
          MaCa: 'CA001',
          TenCa: 'Sáng',
          GioBatDau: '07:00:00',
          GioKetThuc: '11:00:00',
        },
        {
          MaCa: 'CA002',
          TenCa: 'Trưa',
          GioBatDau: '11:30:00',
          GioKetThuc: '15:00:00',
        },
        {
          MaCa: 'CA003',
          TenCa: 'Chiều',
          GioBatDau: '15:30:00',
          GioKetThuc: '19:00:00',
        },
        {
          MaCa: 'CA004',
          TenCa: 'Tối',
          GioBatDau: '19:30:00',
          GioKetThuc: '23:00:00',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('CA', null, {})
  },
}
