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
    const tongTienBan = donGiaBan*SoLuongBanDaDung;

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
      DonGiaBan: donGiaBan,
      SoLuongBanDaDung,
      TongTienDichVu: tongTienDichVu,
      TongTienMonAn: tongTienBan,
      TongTienHoaDon: tongTien,
      TongTienPhat: tienPhat,
      TienConLai: tienConLai,
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
