const { BaoCaoThang, Ct_BaoCaoTheoNgay } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const { CTBCService } = require('./ctbc.service');

const BaoCaoService = {
  XemBaoCao: async (data) => {
    try {
      const { month, year, createdAt } = data;

      const existing = await BaoCaoThang.findOne({
        where: {
          [Op.and]: [{ Thang: month }, { Nam: year }],
        },
        include: [{ model: Ct_BaoCaoTheoNgay }],
      });

      if (existing) return existing;

      const MaBC = `BCT${month >= 10 ? month : `0${month}`}${year}`;

      // B1: Tạo trước báo cáo tháng (chưa có doanh thu, tạm là 0)
      const BC = await BaoCaoThang.create({
        MaBC,
        Thang: month,
        Nam: year,
        NgayLap: createdAt,
        TongDoanhThu: 0,
      });

      // B2: Tạo các chi tiết báo cáo
      const { TongDoanhThu, CTBCs } = await CTBCService.createCTBCs(
        MaBC,
        month,
        year
      );

      // B3: Cập nhật lại tổng doanh thu
      BC.TongDoanhThu = TongDoanhThu;
      await BC.save();

      return BC;
    } catch (error) {
      throw new ApiError(500, 'Lỗi server');
    }
  },
};

module.exports = { BaoCaoService };
