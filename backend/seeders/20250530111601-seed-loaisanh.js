'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'LOAISANH',
      [
        {
          MaLoaiSanh: 'LS001',
          TenLoaiSanh: 'Tiêu chuẩn',
          DonGiaBanToiThieu: 2000000.0,
        },
        {
          MaLoaiSanh: 'LS002',
          TenLoaiSanh: 'Phổ thông',
          DonGiaBanToiThieu: 3000000.0,
        },
        {
          MaLoaiSanh: 'LS003',
          TenLoaiSanh: 'Thương gia',
          DonGiaBanToiThieu: 4000000.0,
        },
        {
          MaLoaiSanh: 'LS004',
          TenLoaiSanh: 'Cao cấp',
          DonGiaBanToiThieu: 6000000.0,
        },
        {
          MaLoaiSanh: 'LS005',
          TenLoaiSanh: 'VIP',
          DonGiaBanToiThieu: 8000000.0,
        },
        {
          MaLoaiSanh: 'LS006',
          TenLoaiSanh: 'Ngoài trời',
          DonGiaBanToiThieu: 5000000.0,
        },
        {
          MaLoaiSanh: 'LS007',
          TenLoaiSanh: 'Sảnh nhỏ',
          DonGiaBanToiThieu: 1500000.0,
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('LOAISANH', null, {})
  },
}
