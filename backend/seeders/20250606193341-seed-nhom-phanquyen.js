'use strict';

const { Op } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Thêm các nhóm mới vào bảng NHOM (trừ G0000 và G0001 vì đã tồn tại)
    const nhoms = [
      { MaNhom: 'G0002', TenNhom: 'Kế Toán' },
      { MaNhom: 'G0003', TenNhom: 'Quản Lý Sảnh' },
      { MaNhom: 'G0004', TenNhom: 'Quản Lý Món Ăn' },
      { MaNhom: 'G0005', TenNhom: 'Quản Lý Dịch Vụ' },
      { MaNhom: 'G0006', TenNhom: 'Tiếp Tân' },
      { MaNhom: 'G0007', TenNhom: 'Nhân Viên Thống Kê' },
      { MaNhom: 'G0008', TenNhom: 'Quản Trị Website' },
      { MaNhom: 'G0009', TenNhom: 'Hệ Thống Nội Bộ' },
      { MaNhom: 'G0010', TenNhom: 'Quản Lý Sự Kiện' },
      { MaNhom: 'G0011', TenNhom: 'Nhân Viên Đặt Tiệc' },
      { MaNhom: 'G0012', TenNhom: 'Kiểm Soát Viên' },
      { MaNhom: 'G0013', TenNhom: 'Nhân Viên Hỗ Trợ' },
    ];

    await queryInterface.bulkInsert('NHOM', nhoms);

    // 2. Lấy tất cả quyền từ bảng QUYEN
    const [quyens] = await queryInterface.sequelize.query(
      `SELECT MaQuyen, TenQuyen FROM QUYEN`
    );

    // 3. Tạo phân quyền cho các nhóm (bao gồm G0000, G0001 và các nhóm mới)
    const phanQuyenRows = [];

    // Danh sách tất cả nhóm, bao gồm Admin và Viewer
    const allNhoms = [
      { MaNhom: 'G0000', TenNhom: 'Admin' },
      { MaNhom: 'G0001', TenNhom: 'Viewer' },
      ...nhoms,
    ];

    for (const nhom of allNhoms) {
      const maNhom = nhom.MaNhom;

      for (const quyen of quyens) {
        const tenQuyen = quyen.TenQuyen;

        // G0000 (Admin): Có tất cả quyền
        if (maNhom === 'G0000') {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0001 (Viewer): Chỉ có các quyền .view, trừ quyền phân quyền
        if (maNhom === 'G0001') {
          const isView = tenQuyen.includes('.view');
          const isPhanQuyen =
            tenQuyen.startsWith('account.') || tenQuyen.startsWith('group.');
          if (isView && !isPhanQuyen) {
            phanQuyenRows.push({
              MaNhom: maNhom,
              MaQuyen: quyen.MaQuyen,
            });
          }
        }

        // G0002 (Kế Toán): Quyền liên quan đến thanh toán và báo cáo
        if (
          maNhom === 'G0002' &&
          (tenQuyen.includes('bill.') || tenQuyen === 'report.view')
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0003 (Quản Lý Sảnh): Quyền liên quan đến sảnh, loại sảnh và ca
        if (
          maNhom === 'G0003' &&
          (tenQuyen.includes('hall.') ||
            tenQuyen.includes('hallType.') ||
            tenQuyen.includes('shift.'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0004 (Quản Lý Món Ăn): Quyền liên quan đến món ăn
        if (maNhom === 'G0004' && tenQuyen.includes('food.')) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0005 (Quản Lý Dịch Vụ): Quyền liên quan đến dịch vụ
        if (maNhom === 'G0005' && tenQuyen.includes('service.')) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0006 (Tiếp Tân): Quyền đặt tiệc và xem
        if (
          maNhom === 'G0006' &&
          (tenQuyen === 'order.create' || tenQuyen.includes('.view'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0007 (Nhân Viên Thống Kê): Quyền báo cáo và xem
        if (
          maNhom === 'G0007' &&
          (tenQuyen === 'report.view' || tenQuyen.includes('.view'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0008 (Quản Trị Website): Quyền phân quyền
        if (
          maNhom === 'G0008' &&
          (tenQuyen.includes('account.') || tenQuyen.includes('group.'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0009 (Hệ Thống Nội Bộ): Quyền tham số
        if (maNhom === 'G0009' && tenQuyen.includes('variable.')) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0010 (Quản Lý Sự Kiện): Quyền liên quan đến tiệc cưới, sảnh và ca
        if (
          maNhom === 'G0010' &&
          (tenQuyen.includes('wedding.') ||
            tenQuyen.includes('hall.') ||
            tenQuyen.includes('shift.'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0011 (Nhân Viên Đặt Tiệc): Quyền đặt tiệc và xem
        if (
          maNhom === 'G0011' &&
          (tenQuyen === 'order.create' || tenQuyen.includes('.view'))
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0012 (Kiểm Soát Viên): Quyền xem và báo cáo
        if (
          maNhom === 'G0012' &&
          (tenQuyen.includes('.view') || tenQuyen === 'report.view')
        ) {
          phanQuyenRows.push({
            MaNhom: maNhom,
            MaQuyen: quyen.MaQuyen,
          });
        }

        // G0013 (Nhân Viên Hỗ Trợ): Ngẫu nhiên 50% quyền .view và .edit
        if (
          maNhom === 'G0013' &&
          (tenQuyen.includes('.view') || tenQuyen.includes('.edit'))
        ) {
          if (Math.random() > 0.5) {
            phanQuyenRows.push({
              MaNhom: maNhom,
              MaQuyen: quyen.MaQuyen,
            });
          }
        }
      }
    }

    // Thêm phân quyền vào bảng PHANQUYEN
    await queryInterface.bulkInsert('PHANQUYEN', phanQuyenRows);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa phân quyền của tất cả các nhóm
    await queryInterface.bulkDelete('PHANQUYEN', {
      MaNhom: {
        [Op.in]: [
          'G0000',
          'G0001',
          'G0002',
          'G0003',
          'G0004',
          'G0005',
          'G0006',
          'G0007',
          'G0008',
          'G0009',
          'G0010',
          'G0011',
          'G0012',
          'G0013',
        ],
      },
    });

    // Xóa các nhóm mới (trừ G0000 và G0001)
    await queryInterface.bulkDelete('NHOM', {
      MaNhom: {
        [Op.in]: [
          'G0002',
          'G0003',
          'G0004',
          'G0005',
          'G0006',
          'G0007',
          'G0008',
          'G0009',
          'G0010',
          'G0011',
          'G0012',
          'G0013',
        ],
      },
    });
  },
};
