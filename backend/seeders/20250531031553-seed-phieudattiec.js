'use strict';

const { Sanh } = require('../models');
const { Ca } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const sanhRecords = await Sanh.findAll({
      attributes: ['MaSanh', 'SoLuongBanToiDa'],
      raw: true,
    });

    if (sanhRecords.length === 0) {
      throw new Error(
        'Bảng SANH chưa có dữ liệu. Vui lòng seed bảng SANH trước.'
      );
    }

    const caRecords = await Ca.findAll({
      attributes: ['MaCa', 'GioBatDau', 'GioKetThuc'],
      raw: true,
    });

    if (caRecords.length === 0) {
      throw new Error('Bảng CA chưa có dữ liệu. Vui lòng seed bảng CA trước.');
    }

    const maSanhIds = sanhRecords.map((sanh) => sanh.MaSanh);
    const soLuongBanToiDaMap = sanhRecords.reduce((acc, sanh) => {
      acc[sanh.MaSanh] = Math.min(sanh.SoLuongBanToiDa, 255); // Giới hạn SoLuongBanToiDa <= 255
      return acc;
    }, {});

    const maCaIds = caRecords.map((ca) => ca.MaCa);
    const caTimeMap = caRecords.reduce((acc, ca) => {
      acc[ca.MaCa] = {
        start: ca.GioBatDau,
        end: ca.GioKetThuc,
      };
      return acc;
    }, {});

    const getRandomName = (isMale) => {
      const maleNames = [
        'Nam',
        'Hùng',
        'Minh',
        'Long',
        'Khoa',
        'Đức',
        'Tuấn',
        'Hải',
        'Phong',
        'Vũ',
      ];
      const femaleNames = [
        'Lan',
        'Mai',
        'Hương',
        'Ngọc',
        'Thảo',
        'Linh',
        'Yến',
        'Trang',
        'Huyền',
        'Thu',
      ];
      const lastNames = [
        'Nguyễn',
        'Trần',
        'Lê',
        'Phạm',
        'Hoàng',
        'Vũ',
        'Đặng',
        'Bùi',
        'Đỗ',
        'Hồ',
      ];
      const firstName = isMale
        ? maleNames[Math.floor(Math.random() * maleNames.length)]
        : femaleNames[Math.floor(Math.random() * femaleNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${lastName} ${firstName}`;
    };

    const getRandomSDT = () => {
      const prefixes = ['090', '091', '093', '094', '097', '098', '099'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0');
      return `${prefix}${suffix}`;
    };

    const getRandomDate = (start, end) => {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    };

    // Hàm chuyển đổi giờ dạng "HH:mm:ss" thành phút để so sánh
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const getRandomTimeForCa = (maCa) => {
      const { start, end } = caTimeMap[maCa];
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);

      const validMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

      // Random giờ và phút trong khoảng của ca
      let randomMinutes =
        Math.floor(Math.random() * (endMinutes - startMinutes)) + startMinutes;
      const randomHour = Math.floor(randomMinutes / 60);
      const minuteIndex = Math.floor(Math.random() * validMinutes.length);
      const randomMinute = validMinutes[minuteIndex];

      const totalRandomMinutes = randomHour * 60 + randomMinute;
      if (
        totalRandomMinutes < startMinutes ||
        totalRandomMinutes > endMinutes
      ) {
        // Nếu vượt quá, điều chỉnh về giá trị gần nhất hợp lệ
        const adjustedMinutes = Math.min(
          Math.max(totalRandomMinutes, startMinutes),
          endMinutes
        );
        const adjustedHour = Math.floor(adjustedMinutes / 60);
        const adjustedMinute = validMinutes.reduce((prev, curr) =>
          Math.abs(curr - (adjustedMinutes % 60)) <
          Math.abs(prev - (adjustedMinutes % 60))
            ? curr
            : prev
        );
        return `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinute
          .toString()
          .padStart(2, '0')}:00`;
      }

      return `${randomHour.toString().padStart(2, '0')}:${randomMinute
        .toString()
        .padStart(2, '0')}:00`;
    };

    // Hàm kiểm tra trùng lịch tổ chức tiệc
    const isScheduleConflict = (existingPhieu, newPhieu) => {
      const existingDate = new Date(existingPhieu.NgayDaiTiec).setHours(
        0,
        0,
        0,
        0
      );
      const newDate = new Date(newPhieu.NgayDaiTiec).setHours(0, 0, 0, 0);
      return (
        existingPhieu.MaSanh === newPhieu.MaSanh &&
        existingPhieu.MaCa === newPhieu.MaCa &&
        existingDate === newDate
      );
    };

    const startDate = new Date('2025-01-01T00:00:00+07:00');
    const endDate = new Date();
    const data = [];
    const usedSchedules = [];

    for (let i = 1; i <= 300; i++) {
      let validSchedule = false;
      let attempts = 0;
      let phieu;

      while (!validSchedule && attempts < 10) {
        const ngayDatTiec = getRandomDate(startDate, endDate);
        const minDaiTiec = new Date(
          ngayDatTiec.getTime() + 1 * 24 * 60 * 60 * 1000
        );
        const maxDaiTiec = new Date(
          ngayDatTiec.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const ngayDaiTiecDate = getRandomDate(
          minDaiTiec,
          maxDaiTiec > endDate ? endDate : maxDaiTiec
        );
        const maSanh = maSanhIds[Math.floor(Math.random() * maSanhIds.length)];
        const maCa = maCaIds[Math.floor(Math.random() * maCaIds.length)];
        const timeForCa = getRandomTimeForCa(maCa);

        // Kết hợp ngày và giờ cho NgayDaiTiec
        const [hours, minutes, seconds] = timeForCa.split(':').map(Number);
        const ngayDaiTiec = new Date(ngayDaiTiecDate);
        ngayDaiTiec.setHours(hours, minutes, seconds, 0);

        phieu = {
          SoPhieuDatTiec: `PDT${i.toString().padStart(3, '0')}`,
          MaSanh: maSanh,
          MaCa: maCa,
          NgayDaiTiec: ngayDaiTiec,
          NgayDatTiec: ngayDatTiec,
        };

        validSchedule = !usedSchedules.some((existing) =>
          isScheduleConflict(existing, phieu)
        );
        attempts++;
      }

      if (!validSchedule) {
        const maCa = maCaIds[Math.floor(Math.random() * maCaIds.length)];
        const ngayDaiTiecDate = getRandomDate(startDate, endDate);
        const timeForCa = getRandomTimeForCa(maCa);
        const [hours, minutes, seconds] = timeForCa.split(':').map(Number);
        const ngayDaiTiec = new Date(ngayDaiTiecDate);
        ngayDaiTiec.setHours(hours, minutes, seconds, 0);
        phieu.NgayDaiTiec = ngayDaiTiec;
        phieu.MaCa = maCa;
      }

      const maSanh = phieu.MaSanh;
      const soLuongBanToiDa = soLuongBanToiDaMap[maSanh];

      // Random số lượng bàn đặt trong khoảng 70%–90% của số lượng tối đa
      const minBan = Math.floor(soLuongBanToiDa * 0.7);
      const maxBan = Math.floor(soLuongBanToiDa * 0.9);
      const soLuongBan = Math.min(
        Math.floor(Math.random() * (maxBan - minBan + 1)) + minBan
      );

      // Số bàn dự trù (70% khả năng có, và chỉ khi còn chỗ)
      const maxDuTru = soLuongBanToiDa - soLuongBan;
      const soBanDuTru =
        Math.random() > 0.3 && maxDuTru > 0
          ? Math.min(
              Math.floor(Math.random() * Math.min(5, maxDuTru)) + 1,
              255 - soLuongBan
            )
          : null;

      data.push({
        SoPhieuDatTiec: phieu.SoPhieuDatTiec,
        MaSanh: maSanh,
        TenChuRe: getRandomName(true),
        TenCoDau: getRandomName(false),
        SDT: getRandomSDT(),
        NgayDaiTiec: phieu.NgayDaiTiec,
        MaCa: phieu.MaCa,
        TienDatCoc: parseInt(
          (Math.random() * (7000000 - 5000000) + 5000000).toFixed(2)
        ), // 5M–7M
        SoLuongBan: soLuongBan,
        SoBanDuTru: soBanDuTru,
        NgayDatTiec: phieu.NgayDatTiec,
        TrangThai: Math.random() > 0.2, // 80% true, 20% false
      });

      usedSchedules.push(phieu);
    }

    await queryInterface.bulkInsert('PHIEUDATTIEC', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PHIEUDATTIEC', null, {});
  },
};
