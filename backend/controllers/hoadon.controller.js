const { HoaDon, PhieuDatTiec, Ct_DichVu, Ct_DatBan, ThamSo, DichVu, MonAn} = require('../models')

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

    const result = hoadon.map(hd => ({
      ...hd.toJSON(),
      dsDichVu,
      dsMonAn
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// POST http://localhost:25053/api/danhsachtiec/hoadon/create
module.exports.create = async (req, res) => {

 try {

  const {SoPhieuDatTiec, SoHoaDon, SoLuongBanDaDung} = req.body;
      const dsDichVu = await Ct_DichVu.findAll({
      include: [{
        model: DichVu,
   attributes: ['TenDichVu']

      }],
   where: { SoPhieuDatTiec },
   attributes: ['SoLuong', 'DonGia']
  });
  
  

  const dsMonAn = await Ct_DatBan.findAll({
   where: { SoPhieuDatTiec },
   attributes: ['SoLuong', 'DonGia']
  });

  const phieuDatTiec = await PhieuDatTiec.findOne({
   where: { SoPhieuDatTiec },
   attributes: ['TienDatCoc', 'NgayDaiTiec']
  });

  // console.log("PHIEU Dat Tiec: /n");
  // console.log(phieuDatTiec);

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
  const ngayDaiTiec = new Date(phieuDatTiec.NgayDaiTiec);
  const thoiDiemThanhToan = Math.floor((ngayDaiTiec - now)/(1000*60*60*24))

  
    let tongTienDichVu = dsDichVu.reduce((tong, dv)=> {
    return tong + parseInt(dv.SoLuong)*dv.DonGia;
  }, 0);
  
  

  let donGiaBan = dsMonAn.reduce((tong, dv)=> {
    return tong + dv.SoLuong*dv.DonGia;
  }, 0);
  
  let tongTienBan = SoLuongBanDaDung*donGiaBan;
  let tienDatCoc = phieuDatTiec.TienDatCoc;
  let tongTien = tongTienDichVu + tongTienBan;
  let tienPhat = APDUNGPHAT&&(thoiDiemThanhToan>2) ? tongTien*TILEPHAT/100 : 0;
  let tienConLai = tongTien + tienPhat - tienDatCoc; //neu ra so am thi la tien khach hang con du

  const hoadon = await HoaDon.create({
   SoHoaDon: SoHoaDon,
   SoPhieuDatTiec: SoPhieuDatTiec,
   NgayThanhToan: new Date(),
   DonGiaBan: donGiaBan,
   SoLuongBanDaDung: SoLuongBanDaDung,
   TongTienDichVu: tongTienDichVu,
   TongTienMonAn: tongTienBan,      
   TongTienHoaDon: tongTien,
   TongTienPhat: tienPhat,
   TienConLai: tienConLai,
  });
hoadon.TienDatCoc = tienDatCoc
  res.status(200).json(hoadon);

 } catch (error) {

  res.status(500).json({ message: "Lỗi ở tạo HOADON", error: error.message });
 }
}
