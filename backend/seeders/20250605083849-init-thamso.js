'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'THAMSO',
      [
        {
          TenThamSo: 'ThoiDiemThanhToanSoVoiNgayDaiTiec',
          GiaTri: 0,
        },
        {
          TenThamSo: 'TyLePhat',
          GiaTri: 1,
        },
        {
          TenThamSo: 'ApDungQDPhatThanhToanTre',
          GiaTri: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('THAMSO', null, {});
  },
};
