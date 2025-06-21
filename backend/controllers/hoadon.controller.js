const { HoaDon, PhieuDatTiec, Ct_DichVu, Ct_DatBan, DichVu, MonAn } = require('../models')
const ThamSoService = require('../services/thamso.service.js')

// GET http://localhost:25053/api/danhsachtiec/hoadon/:id  (id = SoPhieuDatTiec)
module.exports.index = async (req, res) => {
  try {
    const { id } = req.params;

    const hoadon = await HoaDon.findAll({
      where: { SoPhieuDatTiec: id }
    });

    if (hoadon.length === 0) {
      return res.status(404).json("Không tìm thấy hóa đơn");
    }

    const dsDichVu = await Ct_DichVu.findAll({
      where: { SoPhieuDatTiec: id },
      include: [{
        model: DichVu,
        attributes: ['TenDichVu']
      }],
      attributes: ['SoLuong', 'DonGia'],
      raw: true
    });
    const dsMonAn = await Ct_DatBan.findAll({
      where: { SoPhieuDatTiec: id },
      include: [{
        model: MonAn,
        attributes: ['TenMonAn']
      }],
      attributes: [['SoLuong', 'SLMonAn'], ['DonGia', 'DonGiaMonAn']],
      raw: true
    });

    const result = hoadon.map(hd => {
      const json = hd.toJSON();
      return {
        ...json,
        dsDichVu,
        dsMonAn
      };
    });


    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// POST http://localhost:25053/api/danhsachtiec/hoadon/create
module.exports.create = async (req, res) => {
  try {
    const { SoPhieuDatTiec, SoHoaDon, SoLuongBanDaDung } = req.body;

    // Lấy dữ liệu dịch vụ
    const dsDichVu = await Ct_DichVu.findAll({
      include: [{ model: DichVu, attributes: ['TenDichVu'] }],
      where: { SoPhieuDatTiec },
      attributes: ['SoLuong', 'DonGia'],
    });

    // Lấy dữ liệu món ăn
    const dsMonAn = await Ct_DatBan.findAll({
      where: { SoPhieuDatTiec },
      attributes: ['SoLuong', 'DonGia'],
    });

    // Lấy phiếu đặt tiệc
    const phieuDatTiec = await PhieuDatTiec.findOne({
      where: { SoPhieuDatTiec },
      attributes: ['TienDatCoc', 'NgayDaiTiec'],
    });

    if (!phieuDatTiec) {
      return res.status(404).json({ message: "Không tìm thấy phiếu đặt tiệc" });
    }

    // Lấy tham số hệ thống
    const { THOIDIEMTHANHTOAN, TILEPHAT, APDUNGPHAT } =
      await ThamSoService.getThamSoValues();

    const now = new Date();
    const ngayDaiTiec = new Date(phieuDatTiec.NgayDaiTiec);

    const soNgayTre = Math.floor((now - ngayDaiTiec) / (1000 * 60 * 60 * 24));
    const biPhat = APDUNGPHAT && soNgayTre > THOIDIEMTHANHTOAN;

    // Tính tiền dịch vụ
    const tongTienDichVu = dsDichVu.reduce((tong, dv) => {
      const sl = Number(dv.SoLuong);
      const gia = Number(dv.DonGia);
      return tong + (isNaN(sl) || isNaN(gia) ? 0 : sl * gia);
    }, 0);

    // Tính tiền món ăn

    const donGiaBan = dsMonAn.reduce((tong, dv) => {
      const gia = parseFloat(dv.DonGia);
      return tong + (isNaN(gia) ? 0 : gia);
    }, 0);
    const tongTienBan = donGiaBan * SoLuongBanDaDung;

    const tongTien = tongTienDichVu + tongTienBan;

    let tienPhat = 0;
    if (biPhat) {
      const soNgayBiPhat = soNgayTre - THOIDIEMTHANHTOAN;
      tienPhat = (tongTien * TILEPHAT / 100) * soNgayBiPhat;
    }

    const tienDatCoc = Number(phieuDatTiec.TienDatCoc) || 0;
    const tienConLai = tongTien + tienPhat - tienDatCoc;
    const hoadon = await HoaDon.create({
      SoHoaDon,
      SoPhieuDatTiec,
      NgayThanhToan: now,
      DonGiaBan: donGiaBan.toFixed(2),
      SoLuongBanDaDung,
      TongTienDichVu: tongTienDichVu.toFixed(2),
      TongTienMonAn: tongTienBan.toFixed(2),
      TongTienHoaDon: tongTien.toFixed(2),
      TongTienPhat: tienPhat.toFixed(2),
      TienConLai: tienConLai.toFixed(2),
    });


    const hoadonData = hoadon.toJSON();
    hoadonData.TienDatCoc = tienDatCoc;

    return res.status(200).json(hoadonData);

  } catch (error) {
    console.error('[ERROR] createHoaDon:', error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tạo hóa đơn",
      error: error.message,
    });
  }
};

// DELETE http://localhost:25053/api/danhsachtiec/hoadon/:id
module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params; // id = SoHoaDon

    const hoaDon = await HoaDon.findOne({
      where: { SoHoaDon: id },
    });

    if (!hoaDon) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // (Tuỳ chọn) Cập nhật trạng thái phiếu đặt tiệc lại "Chưa thanh toán"
    await PhieuDatTiec.update(
      { TrangThai: "Chưa thanh toán" },
      { where: { SoPhieuDatTiec: hoaDon.SoPhieuDatTiec } }
    );

    // Xoá hoá đơn
    await hoaDon.destroy();

    return res.status(200).json({ message: "Xoá hoá đơn thành công" });
  } catch (error) {
    console.error("[ERROR] deleteHoaDon:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi xoá hoá đơn",
      error: error.message,
    });
  }
};

// POST /api/danhsachtiec/hoadon/restore-dichvu/:soPhieu
module.exports.restoreDichVu = async (req, res) => {
  try {
    const { soPhieu } = req.params;
    const dsBackup = req.body;

    if (!Array.isArray(dsBackup) || dsBackup.length === 0) {
      return res.status(400).json({ message: "Danh sách dịch vụ phục hồi không hợp lệ." });
    }

    // Xóa các dịch vụ hiện tại (do hóa đơn tạo ra)
    await Ct_DichVu.destroy({ where: { SoPhieuDatTiec: soPhieu } });

    // Phục hồi lại dịch vụ ban đầu
    const restored = dsBackup.map(dv => ({
      SoPhieuDatTiec: soPhieu,
      MaDichVu: dv.MaDichVu,
      SoLuong: dv.SoLuong,
      DonGia: dv.DonGia,
    }));

    await Ct_DichVu.bulkCreate(restored);

    return res.status(200).json({
      message: "Khôi phục dịch vụ thành công",
      restoredCount: restored.length
    });

  } catch (error) {
    console.error('[ERROR] restoreDichVu:', error);
    return res.status(500).json({
      message: "Lỗi server khi khôi phục dịch vụ",
      error: error.message,
    });
  }
};

