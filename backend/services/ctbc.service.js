const { Ct_BaoCaoTheoNgay, PhieuDatTiec, sequelize } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const { raw } = require('express');

const CTBCService = {
  // tạo mới ds các ctbc của một báo cáo tháng
  createCTBCs: async (MaBC, month, year) => {
    try {
      // B1: Lấy {Ngay, SoLuongTiec, DoanhThu} của tháng/năm
      const data = await PhieuDatTiec.findAll({
        include: [
          {
            model: HoaDon,
            attributes: [],
          },
        ],
        attributes: [
          ['NgayDaiTiec', 'Ngay'],
          [
            sequelize.fn('COUNT', sequelize.col('SoPhieuDatTiec')),
            'SoLuongTiec',
          ],
          [
            sequelize.fn('SUM', sequelize.col('HoaDon.TongTienHoaDon')),
            'DoanhThu',
          ],
        ],

        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('MONTH', sequelize.col('NgayDaiTiec')),
              month
            ),
            sequelize.where(
              sequelize.fn('YEAR', sequelize.col('NgayDaiTiec')),
              year
            ),
          ],
        },

        group: ['NgayDaiTiec'],
        order: [['NgayDaiTiec', 'ASC']],
        raw: true,
      });

      // B2: Tính tổng doanh thu của tháng
      let TongDoanhThu = 0;
      for (const item of data) {
        TongDoanhThu += parseFloat(item.DoanhThu || 0);
      }

      // B3: Tính tỷ lệ doanh thu của từng ngày => {MaBC, TiLe}
      const CTBCs = data.map((item) => {
        const doanhThu = parseFloat(item.DoanhThu || 0);
        const tyLe =
          TongDoanhThu > 0
            ? ((doanhThu / TongDoanhThu) * 100).toFixed(2)
            : '0.00';
        return {
          ...item,
          TiLe: tyLe,
          MaBC: `${MaBC}`,
        };
      });

      // B4: Tạo CTBC, lưu vô csdl
      await Ct_BaoCaoTheoNgay.bulkCreate(CTBCs);

      return { TongDoanhThu, CTBCs };
    } catch (error) {
      throw new ApiError(500, 'Lỗi server!');
    }
  },
};

module.exports = { CTBCService };
