'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tenQuyens = [
      // Đặt tiệc
      'order.create',

      // Danh sách tiệc cưới
      'wedding.view',
      'wedding.edit',
      'wedding.delete',

      // Thanh toán
      'bill.view',
      'bill.create',
      'bill.edit',

      // DS sảnh
      'hall.view',
      'hall.create',
      'hall.edit',
      'hall.delete',

      // DS loại sảnh
      'hallType.view',
      'hallType.create',
      'hallType.edit',
      'hallType.delete',

      // DS ca
      'shift.view',
      'shift.create',
      'shift.edit',
      'shift.delete',

      // DS món ăn
      'food.view',
      'food.create',
      'food.edit',
      'food.delete',

      // DS dịch vụ
      'service.view',
      'service.create',
      'service.edit',
      'service.delete',

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
