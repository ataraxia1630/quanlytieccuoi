const { HoaDon, PhieuDatTiec, Ct_DichVu, Ct_DatBan, DichVu, MonAn, BaoCaoThang } = require('../models')
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

module.exports.create = async (req, res) => {
  try {
    const { SoPhieuDatTiec, SoLuongBanDaDung } = req.body;
    let SoHoaDon = '';
    let attempt = 0;
    const MAX_ATTEMPT = 10;

    do {
      const random = Math.floor(Math.random() * 1000);
      const randomStr = random.toString().padStart(3, '0');
      SoHoaDon = `HD${randomStr}`;

      const exists = await HoaDon.findOne({ where: { SoHoaDon: SoHoaDon } });
      if (!exists) break;

      attempt++;
    } while (attempt < MAX_ATTEMPT);

    if (attempt >= MAX_ATTEMPT) {
      return res.status(500).json({ message: 'Không thể tạo mã hóa đơn duy nhất sau nhiều lần thử' });
    }
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
    const donGiaBan = dsMonAn.reduce((sum, dv) => {
      const sl = Number(dv.SoLuong);
      const gia = parseFloat(dv.DonGia);
      return sum + (isNaN(sl) || isNaN(gia) ? 0 : sl * gia);
    }, 0);
    const tongTienBan = donGiaBan * SoLuongBanDaDung;

    const tongTien = tongTienDichVu + tongTienBan;

    let tienPhat = 0;
    let tilephat = 0;
    if (biPhat) {
      const soNgayBiPhat = soNgayTre - THOIDIEMTHANHTOAN;
      tienPhat = (tongTien * TILEPHAT / 100) * soNgayBiPhat;
      tilephat = TILEPHAT * soNgayBiPhat;
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
    hoadonData.TiLePhat = tilephat;
    return res.status(200).json(hoadonData);

  } catch (error) {
    console.error('[ERROR] createHoaDon:', error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tạo hóa đơn",
      error: error.message,
    });
  }
};
module.exports.update = async (req, res) => {
  try {
    const { id: SoHoaDon } = req.params; // từ URL: /api/hoadon/:id
    const { SoLuongBanDaDung } = req.body;

    // Kiểm tra hóa đơn tồn tại
    const hoaDon = await HoaDon.findOne({ where: { SoHoaDon } });
    if (!hoaDon) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn để cập nhật" });
    }

    const SoPhieuDatTiec = hoaDon.SoPhieuDatTiec;

    // Lấy lại dữ liệu chi tiết hiện tại
    const dsDichVu = await Ct_DichVu.findAll({
      where: { SoPhieuDatTiec },
      attributes: ['SoLuong', 'DonGia'],
      include: [{ model: DichVu, attributes: ['TenDichVu'] }],
    });

    const dsMonAn = await Ct_DatBan.findAll({
      where: { SoPhieuDatTiec },
      attributes: ['SoLuong', 'DonGia'],
    });

    const phieuDatTiec = await PhieuDatTiec.findOne({
      where: { SoPhieuDatTiec },
      attributes: ['TienDatCoc', 'NgayDaiTiec'],
    });

    if (!phieuDatTiec) {
      return res.status(404).json({ message: "Không tìm thấy phiếu đặt tiệc" });
    }

    // Tính toán
    const tongTienDichVu = dsDichVu.reduce((sum, dv) => {
      const sl = Number(dv.SoLuong);
      const gia = Number(dv.DonGia);
      return sum + (isNaN(sl) || isNaN(gia) ? 0 : sl * gia);
    }, 0);

    const donGiaBan = dsMonAn.reduce((sum, dv) => {
      const sl = Number(dv.SoLuong);
      const gia = parseFloat(dv.DonGia);
      return sum + (isNaN(sl) || isNaN(gia) ? 0 : sl * gia);
    }, 0);
    const tongTienBan = donGiaBan * SoLuongBanDaDung;

    const tongTien = tongTienDichVu + tongTienBan;

    const tienphat = hoaDon.TongTienPhat;
    const tongtien = hoaDon.TongTienHoaDon;

    if (!tongtien) {
      return res.status(500).json({
        message: "Tong tien phai > 0",
        error: error.message,
      });
    }
    const TiLePhat = tienphat / tongtien
    console.log("ti le phat " + tienphat + ' ' + tongtien + ' ' + TiLePhat)
    let tienPhat = TiLePhat * tongTien / 100;


    const tienDatCoc = Number(phieuDatTiec.TienDatCoc) || 0;

    const tienConLai = tongTien + tienPhat - tienDatCoc;

    // Cập nhật hóa đơn
    await HoaDon.update({
      DonGiaBan: donGiaBan.toFixed(2),
      SoLuongBanDaDung,
      TongTienDichVu: tongTienDichVu.toFixed(2),
      TongTienMonAn: tongTienBan.toFixed(2),
      TongTienHoaDon: tongTien.toFixed(2),
      TongTienPhat: tienPhat.toFixed(2),
      TienConLai: tienConLai.toFixed(2),
    }, {
      where: { SoHoaDon }
    });

    const updatedHoaDon = await HoaDon.findOne({ where: { SoHoaDon } });
    const hoadonData = updatedHoaDon.toJSON();
    hoadonData.TienDatCoc = tienDatCoc;

    return res.status(200).json(hoadonData);

  } catch (error) {
    console.error("[ERROR] updateHoaDon:", error);
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật hóa đơn",
      error: error.message,
    });
  }
};

module.exports.checkDate = async (req, res) => {
  try {
    const { id: SoHoaDon } = req.params;

    const hoaDon = await HoaDon.findOne({ where: { SoHoaDon } });
    if (!hoaDon) return res.status(404).json({ allowed: false, message: "Không tìm thấy hóa đơn" });

    const pdt = await PhieuDatTiec.findOne({ where: { SoPhieuDatTiec: hoaDon.SoPhieuDatTiec } });
    if (!pdt) return res.status(404).json({ allowed: false, message: "Không tìm thấy phiếu" });

    const thang = new Date(pdt.NgayDaiTiec).getMonth() + 1;
    const nam = new Date(pdt.NgayDaiTiec).getFullYear();

    const daLap = await BaoCaoThang.findOne({ where: { Thang: thang, Nam: nam } });
    const allowed = !daLap;

    return res.status(200).json({ allowed });
  } catch (error) {
    console.error("Check edit date error:", error);
    return res.status(500).json({ allowed: false, error: error.message });
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

