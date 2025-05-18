const { BaoCaoThang, Ct_BaoCaoTheoNgay } = require('../models');
const { Op } = require('sequelize');
const ApiError = require('../utils/apiError');
const { CTBCService } = require('./ctbc.service');
const PDFDocument = require('pdfkit');
const path = require('path');

const BaoCaoService = {
  XemBaoCao: async (data) => {
    try {
      const month = parseInt(data.month);
      const year = parseInt(data.year);

      const createdAt = new Date();

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
      if (TongDoanhThu > 0) {
        BC.TongDoanhThu = TongDoanhThu;
        await BC.save();
      }

      return { BC, CTBCs };
    } catch (error) {
      throw new ApiError(500, 'Lỗi server' + error.message);
    }
  },

  XuatBaoCao: async (data, res) => {
    try {
      const month = parseInt(data.month);
      const year = parseInt(data.year);
      const baocao = await BaoCaoThang.findOne({
        where: { Thang: month, Nam: year },
        include: [{ model: Ct_BaoCaoTheoNgay }],
      });

      if (!baocao) throw new ApiError(404, 'Không tìm thấy báo cáo');

      const doc = new PDFDocument();
      const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
      doc.font(fontPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=BaoCao_${
          month >= 10 ? month : `0${month}`
        }_${year}.pdf`
      );
      doc.pipe(res);

      doc
        .fontSize(18)
        .text(`BÁO CÁO THÁNG ${month >= 10 ? month : `0${month}`}/${year}`, {
          align: 'center',
        });
      doc.moveDown();

      doc.fontSize(12).text(`Ngày lập: ${baocao.NgayLap}`);
      doc.text(`Tổng doanh thu: ${baocao.TongDoanhThu.toLocaleString()} VND`);
      doc.moveDown();

      doc.fontSize(14).text('Chi tiết theo ngày:', { underline: true });
      doc.moveDown(0.5);

      (baocao.Ct_BaoCaoTheoNgays || []).forEach((ct) => {
        doc
          .fontSize(12)
          .text(
            `- ${ct.Ngay}: ${ct.SoLuongTiec} tiệc, Doanh thu: ${ct.DoanhThu} VND, Tỉ lệ: ${ct.TiLe}%`
          );
      });
      doc.end();
    } catch (error) {
      throw new ApiError(500, 'Xuất báo cáo thất bại!');
    }
  },
};

module.exports = { BaoCaoService };
