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
    const maDichVuIds = dichVuRecords.map((dichVu) => dichVu.MaDichVu);

    for (const phieu of phieuDatTiecRecords) {
      const soPhieuDatTiec = phieu.SoPhieuDatTiec;

      // Random 0-9 dịch vụ
      const numServices = Math.floor(Math.random() * 10);
      const selectedServices = maDichVuIds
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numServices, maDichVuIds.length));

      for (const maDichVu of selectedServices) {
        const soLuong = Math.floor(Math.random() * 3) + 1; // 1–3
        // const donGia = parseInt(
        //   (soLuong * dichVuUnitPrices[maDichVu]).toFixed(2)
        // );

        data.push({
          MaDichVu: maDichVu,
          SoPhieuDatTiec: soPhieuDatTiec,
          SoLuong: soLuong,
          DonGia: dichVuUnitPrices[maDichVu],
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
