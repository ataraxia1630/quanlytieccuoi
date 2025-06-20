'use strict';

const { PhieuDatTiec, Ct_DichVu, Ct_DatBan, MonAn } = require('../models');
const ThamSoService = require('../services/thamso.service.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Lấy tham số từ ThamSoService
    const { THOIDIEMTHANHTOAN, TILEPHAT, APDUNGPHAT } =
      await ThamSoService.getThamSoValues();

    const phieuDatTiecRecords = await PhieuDatTiec.findAll({
      attributes: [
        'SoPhieuDatTiec',
        'NgayDaiTiec',
        'SoLuongBan',
        'SoBanDuTru',
        'TienDatCoc',
        'TrangThai',
      ],
      where: { TrangThai: 'Đã thanh toán' },
      raw: true,
    });

    if (phieuDatTiecRecords.length === 0) {
      console.warn(
        'Không có phiếu đặt tiệc nào ở trạng thái "Đã thanh toán" để tạo hóa đơn.'
      );
      return;
    }

    const ctDatBanRecords = await Ct_DatBan.findAll({
      attributes: ['SoPhieuDatTiec', 'MaMonAn', 'DonGia'],
      raw: true,
    });

    const ctDichVuRecords = await Ct_DichVu.findAll({
      attributes: ['SoPhieuDatTiec', 'DonGia'],
      raw: true,
    });

    const monAnRecords = await MonAn.findAll({
      attributes: ['MaMonAn', 'DonGia'],
      raw: true,
    });

    // Tạo map cho PĐT
    const phieuInfoMap = phieuDatTiecRecords.reduce((acc, phieu) => {
      acc[phieu.SoPhieuDatTiec] = {
        ngayDaiTiec: new Date(phieu.NgayDaiTiec),
        soLuongBan: phieu.SoLuongBan,
        soBanDuTru: phieu.SoBanDuTru,
        tienDatCoc: parseInt(phieu.TienDatCoc),
      };
      return acc;
    }, {});

    const dishUnitPrices = monAnRecords.reduce((acc, monAn) => {
      acc[monAn.MaMonAn] = parseInt(monAn.DonGia);
      return acc;
    }, {});

    const phieuMonAnMap = ctDatBanRecords.reduce((acc, ct) => {
      if (!acc[ct.SoPhieuDatTiec]) {
        acc[ct.SoPhieuDatTiec] = new Set();
      }
      acc[ct.SoPhieuDatTiec].add(ct.MaMonAn);
      return acc;
    }, {});

    const tongTienMonAnMap = ctDatBanRecords.reduce((acc, ct) => {
      const donGia = parseInt(ct.DonGia) || 0;
      acc[ct.SoPhieuDatTiec] = (acc[ct.SoPhieuDatTiec] || 0) + donGia;
      return acc;
    }, {});

    const tongTienDichVuMap = ctDichVuRecords.reduce((acc, ct) => {
      const donGia = parseInt(ct.DonGia) || 0;
      acc[ct.SoPhieuDatTiec] = (acc[ct.SoPhieuDatTiec] || 0) + donGia;
      return acc;
    }, {});

    const data = [];
    let hoaDonCounter = 1;

    for (const phieu of phieuDatTiecRecords) {
      const phieuInfo = phieuInfoMap[phieu.SoPhieuDatTiec];

      // Random ngày thanh toán, 30% trễ hạn
      const isLate = Math.random() < 0.3;
      const maxLateDays = 15;
      const randomDays = isLate
        ? THOIDIEMTHANHTOAN + Math.floor(Math.random() * maxLateDays) + 1
        : Math.floor(Math.random() * (THOIDIEMTHANHTOAN + 1));
      const ngayThanhToan = new Date(
        phieuInfo.ngayDaiTiec.getTime() + randomDays * 24 * 60 * 60 * 1000
      );

      // Tính SoLuongBanDaDung (90%–100% của tổng SoLuongBan + SoBanDuTru)
      const tongBan = phieuInfo.soLuongBan + phieuInfo.soBanDuTru;
      const soLuongBanDaDung =
        tongBan > 0
          ? Math.min(
              Math.floor(tongBan * (0.9 + Math.random() * 0.1)),
              tongBan,
              255
            )
          : 0;

      // Tính DonGiaBan (tổng đơn giá món ăn với SoLuong = 1)
      const monAnList = phieuMonAnMap[phieu.SoPhieuDatTiec] || new Set();
      let donGiaBan = 0;
      for (const maMonAn of monAnList) {
        donGiaBan += dishUnitPrices[maMonAn] || 0;
      }
      donGiaBan = parseInt(donGiaBan.toFixed(2));

      const tongTienMonAn = parseInt(
        (tongTienMonAnMap[phieu.SoPhieuDatTiec] || 0).toFixed(2)
      );
      const tongTienDichVu = parseInt(
        (tongTienDichVuMap[phieu.SoPhieuDatTiec] || 0).toFixed(2)
      );

      const tongTienHoaDonBase = parseInt(
        (tongTienMonAn + tongTienDichVu).toFixed(2)
      );

      // Tính TongTienPhat (nếu áp dụng phạt)
      const ngayHetHan = new Date(
        phieuInfo.ngayDaiTiec.getTime() +
          THOIDIEMTHANHTOAN * 24 * 60 * 60 * 1000
      );
      const soNgayTre = Math.max(
        Math.floor((ngayThanhToan - ngayHetHan) / (24 * 60 * 60 * 1000)),
        0
      );
      const tongTienPhat = APDUNGPHAT
        ? parseInt(
            (tongTienHoaDonBase * (TILEPHAT / 100) * soNgayTre).toFixed(2)
          )
        : 0;

      // Tính TongTienHoaDon (bao gồm phạt)
      const tongTienHoaDon = parseInt(
        (tongTienHoaDonBase + tongTienPhat).toFixed(2)
      );

      const tienConLai = parseInt(
        (tongTienHoaDon - phieuInfo.tienDatCoc).toFixed(2)
      );

      const soHoaDon = `HD${hoaDonCounter.toString().padStart(3, '0')}`;

      data.push({
        SoHoaDon: soHoaDon,
        SoPhieuDatTiec: phieu.SoPhieuDatTiec,
        NgayThanhToan: ngayThanhToan,
        DonGiaBan: donGiaBan,
        SoLuongBanDaDung: soLuongBanDaDung,
        TongTienDichVu: tongTienDichVu,
        TongTienMonAn: tongTienMonAn,
        TongTienHoaDon: tongTienHoaDon,
        TongTienPhat: tongTienPhat,
        TienConLai: tienConLai,
      });

      hoaDonCounter++;
    }

    await queryInterface.bulkInsert('HOADON', data, {});
  },

  async down(queryInterface, Sequelize) {
    const maHoaDonList = Array.from(
      { length: 300 }, // Đổi số nếu muốn undo nhiều/ít hóa đơn hơn
      (_, i) => `HD${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete('HOADON', {
      SoHoaDon: {
        [Sequelize.Op.in]: maHoaDonList,
      },
    });
  },
};
