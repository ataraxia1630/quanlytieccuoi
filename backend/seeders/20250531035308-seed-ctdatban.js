'use strict';

const { MonAn, PhieuDatTiec, Sanh, LoaiSanh } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const monAnRecords = await MonAn.findAll({
      attributes: ['MaMonAn', 'DonGia'],
      raw: true,
    });

    if (monAnRecords.length === 0) {
      throw new Error(
        'Bảng MONAN chưa có dữ liệu. Vui lòng seed bảng MONAN trước.'
      );
    }

    // Tạo ánh xạ MaMonAn → DonGia
    const dishUnitPrices = monAnRecords.reduce((acc, monAn) => {
      acc[monAn.MaMonAn] = parseInt(monAn.DonGia);
      return acc;
    }, {});

    const phieuDatTiecRecords = await PhieuDatTiec.findAll({
      include: {
        model: Sanh,
        include: {
          model: LoaiSanh,
          attributes: ['DonGiaBanToiThieu'],
        },
        attributes: ['MaSanh', 'MaLoaiSanh'],
      },
      attributes: ['SoPhieuDatTiec', 'SoLuongBan', 'SoBanDuTru', 'NgayDatTiec'],
      raw: true,
      nest: true,
    });

    if (phieuDatTiecRecords.length === 0) {
      throw new Error(
        'Bảng PHIEUDATTIEC chưa có dữ liệu. Vui lòng seed bảng PHIEUDATTIEC trước.'
      );
    }

    // Tạo map phiếu: SoPhieuDatTiec → tổng bàn + giá bàn tối thiểu
    const phieuInfoMap = phieuDatTiecRecords.reduce((acc, record) => {
      const totalBan = record.SoLuongBan + (record.SoBanDuTru || 0);
      const minPrice = parseInt(
        record.Sanh.LoaiSanh?.DonGiaBanToiThieu || 1000000
      );
      acc[record.SoPhieuDatTiec] = {
        totalBan,
        minPricePerTable: minPrice,
        ngayDatTiec: new Date(record.NgayDatTiec),
      };
      return acc;
    }, {});

    const maMonAnIds = monAnRecords.map((m) => m.MaMonAn);

    if (maMonAnIds.length < 7) {
      throw new Error(
        `Bảng MONAN chỉ có ${maMonAnIds.length} món, cần ít nhất 7 món để chọn 4–7 món khác nhau.`
      );
    }

    const data = [];

    for (const phieu of phieuDatTiecRecords) {
      const soPhieuDatTiec = phieu.SoPhieuDatTiec;
      const { totalBan, minPricePerTable } = phieuInfoMap[soPhieuDatTiec];

      if (totalBan === 0) continue;

      let valid = false;
      let dishDetails = [];

      while (!valid) {
        const numDishes = Math.floor(Math.random() * 4) + 4; // 4–7 món

        const selectedDishes = [...maMonAnIds]
          .sort(() => Math.random() - 0.5)
          .slice(0, numDishes);

        let tongDonGiaMon = 0;
        const tempData = [];

        for (const maMonAn of selectedDishes) {
          // const soLuong = totalBan;
          const soLuong = Math.floor(Math.random() * 3) + 1; // 1-4 món
          const donGiaMon = dishUnitPrices[maMonAn];
          // const donGia = parseInt((soLuong * donGiaMon).toFixed(2));

          tempData.push({
            MaMonAn: maMonAn,
            SoPhieuDatTiec: soPhieuDatTiec,
            SoLuong: soLuong,
            DonGia: donGiaMon,
          });

          tongDonGiaMon += donGiaMon;
        }

        if (
          tongDonGiaMon >= minPricePerTable &&
          tempData.length >= 4 &&
          tempData.length <= 7
        ) {
          valid = true;
          dishDetails = tempData;
        }
      }

      data.push(...dishDetails);
    }

    await queryInterface.bulkInsert('CT_DATBAN', data, {});
  },

  async down(queryInterface, Sequelize) {
    const maPhieuList = Array.from(
      { length: 300 },
      (_, i) => `PDT${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete('CT_DATBAN', {
      SoPhieuDatTiec: {
        [Sequelize.Op.in]: maPhieuList,
      },
    });
  },
};
