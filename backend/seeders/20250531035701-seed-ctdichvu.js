'use strict';

const { DichVu, PhieuDatTiec } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const dichVuRecords = await DichVu.findAll({
      attributes: ['MaDichVu', 'DonGia'],
      raw: true,
    });

    if (dichVuRecords.length === 0) {
      throw new Error(
        'Bảng DICHVU chưa có dữ liệu. Vui lòng seed bảng DICHVU trước.'
      );
    }

    const phieuDatTiecRecords = await PhieuDatTiec.findAll({
      attributes: ['SoPhieuDatTiec', 'NgayDatTiec'],
      raw: true,
    });

    if (phieuDatTiecRecords.length === 0) {
      throw new Error(
        'Bảng PHIEUDATTIEC chưa có dữ liệu. Vui lòng seed bảng PHIEUDATTIEC trước.'
      );
    }

    // Tạo object ánh xạ MaDichVu -> DonGia
    const dichVuUnitPrices = dichVuRecords.reduce((acc, dichVu) => {
      acc[dichVu.MaDichVu] = parseInt(dichVu.DonGia);
      return acc;
    }, {});

    const data = [];
    const phieuDatTiecIds = Array.from(
      { length: 300 },
      (_, i) => `PDT${(i + 1).toString().padStart(3, '0')}`
    );
    const maDichVuIds = dichVuRecords.map((dichVu) => dichVu.MaDichVu);

    for (const phieu of phieuDatTiecIds) {
      // Chọn ngẫu nhiên 0–10 dịch vụ
      const numServices = Math.floor(Math.random() * 11); // 0–10
      const selectedServices = maDichVuIds
        .sort(() => Math.random() - 0.5)
        .slice(0, numServices);

      for (const maDichVu of selectedServices) {
        const soLuong = Math.floor(Math.random() * 5) + 1; // 1–3
        const donGia = soLuong * dichVuUnitPrices[maDichVu];

        data.push({
          MaDichVu: maDichVu,
          SoPhieuDatTiec: phieu,
          SoLuong: soLuong,
          DonGia: donGia,
        });
      }
    }

    await queryInterface.bulkInsert('CT_DICHVU', data, {});
  },

  async down(queryInterface, Sequelize) {
    const maPhieuList = Array.from(
      { length: 300 },
      (_, i) => `PDT${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete('CT_DICHVU', {
      SoPhieuDatTiec: {
        [Sequelize.Op.in]: maPhieuList,
      },
    });
  },
};
