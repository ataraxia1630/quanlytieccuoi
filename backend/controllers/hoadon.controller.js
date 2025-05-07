const { HoaDon, PhieuDatTiec, Ct_DichVu, Ct_DatBan, ThamSo} = require('../models')

// GET http://localhost:25053/phieudattiec/:id/hoadon/  (id = SoPhieuDatTiec)
module.exports.index = async (req, res) => {
 try {
 const {id} = req.params;
  const hoadon = await HoaDon.findAll({
   include: [
    {
     model: phieudattiec
    }
   ]
  });
  if(!hoadon) {
   return res.status(404).json("Khong tim thay hoa don");
  }
  res.json(hoadon);

 } catch (error) {
  res.status(500).json({ message: "Lỗi server", error: err.message });
 }
 

}

// POST http://localhost:25053/phieudattiec/:id/hoadon/create
module.exports.create = async (req, res) => {

 try {
  const {SoPhieuDatTiec, SoHoaDon, DonGiaBan, SoLuongBanDaDung} = req.body;

  const dsDichVu = await Ct_DichVu.findAll({
   where: { SoPhieuDatTiec },
   attributes: ['SoLuong', 'DonGia']
  });
  const dsDatBan = await Ct_DatBan.findAll({
   where: { SoPhieuDatTiec },
   attributes:['SoLuong', 'DonGia']
  })
  const phieuDatTiec = await PhieuDatTiec.findOne({
   where: { SoPhieuDatTiec },
   attributes: ['TienDatCoc', 'NgayDaiTiec']
  });
  const thamSo = await ThamSo.findAll();
  let THOIDIEMTHANHTOAN = 0;
  let TILEPHAT = 0;
  let APDUNGPHAT = true;

  thamSo.forEach((item) => {
   if(item.TenThamSo === "ThoiDiemThanhToanSoVoiNgayDaiTiec")
     THOIDIEMTHANHTOAN = parseInt(item.GiaTri, 10);
   else if (item.TenThamSo === "TyLePhat")
     TILEPHAT = parseInt(item.GiaTri, 10);
   else if (item.TenThamSo === "ApDungQDPhatThanhToanTre")
     APDUNGPHAT = item.GiaTri == 1 ? true : false;
  })

  const now = new Date();
  const thoiDiemThanhToan = Math.floor((phieuDatTiec.NgayDaiTiec - now)/(1000*60*60*24))
  let tongTienDichVu = dsDichVu.reduce((tong, dv)=> {
    return tong + dv.SoLuong*dv.DonGia;
  }, 0);
  let tongTienBan = dsDatBan.reduce((tong, ban) => {
    return tong + ban.SoLuong*ban.DonGia;
  }, 0);
  let tienDatCoc = phieuDatTiec.TienDatCoc;
  let tongTien = tongTienDichVu + tongTienBan;
  let tienPhat = APDUNGPHAT&&(!thoiDiemThanhToan.before(new Date()) ?true:false) ? tongTien*TILEPHAT/100 : 0;
  let tienConLai = tongTien + tienPhat - tienDatCoc;

  const hoadon = await HoaDon.create({
   SoHoaDon: SoHoaDon,
   SoPhieuDatTiec: SoPhieuDatTiec,
   NgayThanhToan: new Date(),
   DonGiaBan: DonGiaBan,
   SoLuongBanDaDung: SoLuongBanDaDung,
   TongTienDichVu: tongTienDichVu,
   TongTienMonAn: tongTienBan,
   TongTienHoaDon: tongTien,
   TongTienPhat: tienPhat,
   TienConLai: tienConLai,
  });

  res.status(200).json(hoadon);

 } catch (error) {

  res.status(500).json({ message: "Lỗi server", error: error.message });
 }
}
