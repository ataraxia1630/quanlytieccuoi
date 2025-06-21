'use strict';

const { Sanh, Ca } = require('../models');

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
      acc[sanh.MaSanh] = Math.min(sanh.SoLuongBanToiDa, 255);
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
      const maleNames = ['Nam', 'Huy', 'Minh', 'Khoa', 'Duy'];
      const femaleNames = ['Lan', 'Mai', 'Linh', 'Yến', 'Thu'];
      const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Vũ'];
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

    const getPartyDate = (ngayDatTiec) => {
      const rand = Math.random();

      const baseDateStart = new Date('2025-01-01T00:00:00+07:00');
      const baseDateEnd = new Date('2025-07-31T23:59:59+07:00');
      const baseDate = getRandomDate(baseDateStart, baseDateEnd);

      let partyDate;

      if (rand < 0.4) {
        // 40% : chọn ngày trước baseDate từ 1–3 ngày
        const daysBefore = Math.floor(Math.random() * 3) + 1;
        partyDate = new Date(
          baseDate.getTime() - daysBefore * 24 * 60 * 60 * 1000
        );
      } else if (rand < 0.8) {
        // 40% : chọn ngày sau baseDate từ 4–5 ngày
        const daysAfter = Math.floor(Math.random() * 2) + 4;
        partyDate = new Date(
          baseDate.getTime() + daysAfter * 24 * 60 * 60 * 1000
        );
      } else {
        // 20% : chọn ngẫu nhiên trong vòng 30 ngày sau baseDate
        const maxDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        partyDate = getRandomDate(
          baseDate,
          maxDate > baseDateEnd ? baseDateEnd : maxDate
        );
      }

      return partyDate > ngayDatTiec && partyDate <= baseDateEnd
        ? partyDate
        : new Date(ngayDatTiec.getTime() + 24 * 60 * 60 * 1000);
    };

    const getRandomStatus = (ngayDaiTiec) => {
      const currentDate = new Date(); // Lấy ngày hiện tại
      const partyDate = new Date(ngayDaiTiec);
      partyDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh ngày
      currentDate.setHours(0, 0, 0, 0);

      if (partyDate <= currentDate) {
        // Nếu đã đến hoặc qua ngày đãi tiệc, ưu tiên "Đã thanh toán"
        return 'Đã thanh toán';
      }

      // Nếu ngày đãi tiệc trong tương lai, chỉ gán "Chưa thanh toán" hoặc "Đã hủy"
      const rand = Math.random();
      if (rand < 0.95) return 'Chưa thanh toán'; // ~95%
      return 'Đã hủy'; // ~5%
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
      const possibleTimes = [];

      for (let minutes = startMinutes; minutes <= endMinutes; minutes++) {
        const minutePart = minutes % 60;
        if (validMinutes.includes(minutePart)) {
          possibleTimes.push(minutes);
        }
      }

      if (possibleTimes.length === 0) {
        const hour = Math.floor(startMinutes / 60);
        const minute = startMinutes % 60;
        return `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}:00`;
      }

      const totalRandomMinutes =
        possibleTimes[Math.floor(Math.random() * possibleTimes.length)];

      const hour = Math.floor(totalRandomMinutes / 60);
      const minute = totalRandomMinutes % 60;

      return `${hour.toString().padStart(2, '0')}:${minute
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
        existingDate === newDate &&
        existingPhieu.TrangThai !== 'Đã hủy'
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
        const ngayDaiTiecDate = getPartyDate(ngayDatTiec);
        const maSanh = maSanhIds[Math.floor(Math.random() * maSanhIds.length)];
        const maCa = maCaIds[Math.floor(Math.random() * maCaIds.length)];
        const timeForCa = getRandomTimeForCa(maCa);

        const [hours, minutes, seconds] = timeForCa.split(':').map(Number);
        const ngayDaiTiec = new Date(ngayDaiTiecDate);
        ngayDaiTiec.setHours(hours, minutes, seconds, 0);

        phieu = {
          SoPhieuDatTiec: `PDT${i.toString().padStart(3, '0')}`,
          MaSanh: maSanh,
          MaCa: maCa,
          NgayDaiTiec: ngayDaiTiec,
          NgayDatTiec: ngayDatTiec,
          TrangThai: getRandomStatus(ngayDaiTiec),
        };

        validSchedule = !usedSchedules.some((existing) =>
          isScheduleConflict(existing, phieu)
        );
        attempts++;
      }

      if (!validSchedule) {
        const maCa = maCaIds[Math.floor(Math.random() * maCaIds.length)];
        const ngayDaiTiecDate = getPartyDate(phieu.NgayDatTiec);
        const timeForCa = getRandomTimeForCa(maCa);
        const [hours, minutes, seconds] = timeForCa.split(':').map(Number);
        const ngayDaiTiec = new Date(ngayDaiTiecDate);
        ngayDaiTiec.setHours(hours, minutes, seconds, 0);
        phieu.NgayDaiTiec = ngayDaiTiec;
        phieu.MaCa = maCa;
        phieu.TrangThai = getRandomStatus(ngayDaiTiec);
      }

      const maSanh = phieu.MaSanh;
      const soLuongBanToiDa = soLuongBanToiDaMap[maSanh];

      // Random số lượng bàn đặt trong khoảng 70%–80% của số lượng tối đa
      const minBan = Math.floor(soLuongBanToiDa * 0.7);
      const maxBan = Math.floor(soLuongBanToiDa * 0.8);
      const soLuongBan = Math.min(
        Math.floor(Math.random() * (maxBan - minBan + 1)) + minBan
      );

      // Số bàn dự trù (70% khả năng có, và chỉ khi còn chỗ)
      const maxDuTru = soLuongBanToiDa - soLuongBan;
      const soBanDuTru =
        Math.random() > 0.3 && maxDuTru > 0
          ? Math.min(
              Math.floor(Math.random() * Math.min(15, maxDuTru)) + 1, // 1-15 bàn
              255 - soLuongBan
            )
          : 0;

      data.push({
        SoPhieuDatTiec: phieu.SoPhieuDatTiec,
        MaSanh: maSanh,
        TenChuRe: getRandomName(true),
        TenCoDau: getRandomName(false),
        SDT: getRandomSDT(),
        NgayDaiTiec: phieu.NgayDaiTiec,
        MaCa: phieu.MaCa,
        TienDatCoc:
          Math.floor(
            (Math.random() * (55000000 - 40000000) + 40000000) / 1000000
          ) * 1000000, // 40M–55M, step 1M
        SoLuongBan: soLuongBan,
        SoBanDuTru: soBanDuTru,
        NgayDatTiec: phieu.NgayDatTiec,
        TrangThai: phieu.TrangThai,
      });

      usedSchedules.push(phieu);
    }

    await queryInterface.bulkInsert('PHIEUDATTIEC', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    const maPhieuList = Array.from(
      { length: 300 },
      (_, i) => `PDT${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete(
      'PHIEUDATTIEC',
      {
        SoPhieuDatTiec: {
          [Sequelize.Op.in]: maPhieuList,
        },
      },
      {}
    );
  },
};
