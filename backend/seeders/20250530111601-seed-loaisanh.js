'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'LOAISANH',
      [
        {
          MaLoaiSanh: 'LS001',
          TenLoaiSanh: 'A',
          DonGiaBanToiThieu: 1000000,
        },
        {
          MaLoaiSanh: 'LS002',
          TenLoaiSanh: 'B',
          DonGiaBanToiThieu: 1100000,
        },
        {
          MaLoaiSanh: 'LS003',
          TenLoaiSanh: 'C',
          DonGiaBanToiThieu: 1200000,
        },
        {
          MaLoaiSanh: 'LS004',
          TenLoaiSanh: 'D',
          DonGiaBanToiThieu: 1400000,
        },
        {
          MaLoaiSanh: 'LS005',
          TenLoaiSanh: 'E',
          DonGiaBanToiThieu: 1600000,
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('LOAISANH', null, {})
  },
}
