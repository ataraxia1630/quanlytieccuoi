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

      const doc = new PDFDocument({ margin: 50 });
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

      // Tiêu đề
      doc
        .fontSize(18)
        .text(`BÁO CÁO THÁNG ${month >= 10 ? month : `0${month}`}/${year}`, {
          align: 'center',
        });
      doc.moveDown();

      // Thông tin tổng hợp
      const formattedNgayLap = baocao.NgayLap.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      doc
        .fontSize(12)
        .text(`Ngày lập: ${formattedNgayLap}`, { align: 'center' });
      doc.text(
        `Tổng doanh thu: ${new Intl.NumberFormat('vi-VN').format(
          baocao.TongDoanhThu
        )} VNĐ`,
        { align: 'center' }
      );
      doc.text(`Tổng số tiệc cưới: ${baocao.Ct_BaoCaoTheoNgays.length}`, {
        align: 'center',
      });
      doc.moveDown(1.5);

      // Tiêu đề bảng
      doc
        .fontSize(14)
        .text('CHI TIẾT THEO NGÀY:', { align: 'center', underline: true });
      doc.moveDown(0.5);

      // Tạo bảng
      const tableTop = doc.y + 10;
      const rowHeight = 25;
      const colWidths = [100, 130, 130, 80];
      const startX = (doc.page.width - colWidths.reduce((a, b) => a + b)) / 2;

      const drawRow = (y, row, isHeader = false) => {
        const cellAlign = 'center';
        const height = rowHeight;

        const cellOpts = {
          height,
          align: cellAlign,
          valign: 'center',
        };

        let x = startX;
        row.forEach((text, i) => {
          doc.rect(x, y, colWidths[i], height).stroke();

          doc
            .fontSize(isHeader ? 12 : 10)
            .font(fontPath)
            .text(text, x, y + 7, {
              width: colWidths[i],
              align: cellAlign,
            });

          x += colWidths[i];
        });
      };

      // Vẽ tiêu đề bảng
      drawRow(
        tableTop,
        ['Ngày', 'Số lượng tiệc cưới', 'Doanh thu (VNĐ)', 'Tỷ lệ (%)'],
        true
      );

      // Vẽ dữ liệu
      baocao.Ct_BaoCaoTheoNgays.forEach((ct, idx) => {
        const y = tableTop + rowHeight * (idx + 1);
        drawRow(y, [
          ct.Ngay.toLocaleDateString('vi-VN'),
          ct.SoLuongTiec.toString(),
          new Intl.NumberFormat('vi-VN').format(ct.DoanhThu),
          parseFloat(ct.TiLe).toFixed(2),
        ]);
      });

      doc.end();
    } catch (error) {
      throw new ApiError(500, 'Xuất báo cáo thất bại!');
    }
  },
};

module.exports = { BaoCaoService };
