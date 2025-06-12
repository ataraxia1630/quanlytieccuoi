'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tenQuyens = [
      // Đặt tiệc
      'order.create',

      // Danh sách tiệc cưới
      'wedding.view',
      'wedding.delete',

      // Thanh toán
      'bill.create',

      // DS sảnh
      'hall.view',
      'hall.edit',
      'hall.delete',
      'hall.create',

      // DS loại sảnh
      'hallType.view',
      'hallType.edit',
      'hallType.delete',
      'hallType.create',

      // DS ca
      'shift.view',
      'shift.edit',
      'shift.delete',
      'shift.create',

      // DS món ăn
      'food.view',
      'food.edit',
      'food.delete',
      'food.create',

      // DS dịch vụ
      'service.view',
      'service.edit',
      'service.delete',
      'service.create',

      // DS tham số
      'variable.view',
      'variable.edit',

      // Báo cáo tháng
      'report.view',

      // Phân quyền - tài khoản
      'account.view',
      'account.create',
      'account.edit',
      'account.delete',

      // Phân quyền - nhóm
      'group.view',
      'group.create',
      'group.edit',
      'group.delete',
    ];

    const now = new Date();

    const permissions = tenQuyens.map((ten, index) => ({
      MaQuyen: `Q${String(index + 1).padStart(4, '0')}`,
      TenQuyen: ten,
    }));

    await queryInterface.bulkInsert('QUYEN', permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('QUYEN', null, {});
  },
};
