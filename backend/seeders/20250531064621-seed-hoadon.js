'use strict'

const { PhieuDatTiec, Ct_DichVu, Ct_DatBan } = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const phieuDatTiecRecords = await PhieuDatTiec.findAll({
      attributes: ['SoPhieuDatTiec', 'NgayDaiTiec', 'SoLuongBan', 'TienDatCoc'],
      raw: true,
    })

    if (phieuDatTiecRecords.length === 0) {
      throw new Error(
        'Bảng PHIEUDATTIEC chưa có dữ liệu. Vui lòng seed bảng PHIEUDATTIEC trước.'
      )
    }

    const ctDatBanRecords = await Ct_DatBan.findAll({
      attributes: ['SoPhieuDatTiec', 'DonGia'],
      raw: true,
    })

    const ctDichVuRecords = await Ct_DichVu.findAll({
      attributes: ['SoPhieuDatTiec', 'DonGia'],
      raw: true,
    })

    // Tạo map cho PĐT
    const phieuInfoMap = phieuDatTiecRecords.reduce((acc, phieu) => {
      acc[phieu.SoPhieuDatTiec] = {
        ngayDaiTiec: new Date(phieu.NgayDaiTiec),
        soLuongBan: phieu.SoLuongBan,
        tienDatCoc: parseInt(phieu.TienDatCoc),
      }
      return acc
    }, {})

    // Tính tổng DonGia món ăn theo SoPhieuDatTiec
    const tongTienMonAnMap = ctDatBanRecords.reduce((acc, ct) => {
      const donGia = parseInt(ct.DonGia)
      acc[ct.SoPhieuDatTiec] = (acc[ct.SoPhieuDatTiec] || 0) + donGia
      return acc
    }, {})

    // Tính tổng DonGia dịch vụ theo SoPhieuDatTiec
    const tongTienDichVuMap = ctDichVuRecords.reduce((acc, ct) => {
      const donGia = parseInt(ct.DonGia)
      acc[ct.SoPhieuDatTiec] = (acc[ct.SoPhieuDatTiec] || 0) + donGia
      return acc
    }, {})

    const data = []
    const phieuDatTiecIds = Array.from(
      { length: 300 },
      (_, i) => `PDT${(i + 1).toString().padStart(3, '0')}`
    )

    for (const phieu of phieuDatTiecIds) {
      const phieuInfo = phieuInfoMap[phieu]
      if (!phieuInfo) continue 

      // Tính NgayThanhToan (NgayDaiTiec đến 30 ngày sau)
      const ngayThanhToan = new Date(
        phieuInfo.ngayDaiTiec.getTime() +
          Math.floor(Math.random() * 31) * 24 * 60 * 60 * 1000
      )

      // Tính SoLuongBanDaDung (90%–100% của SoLuongBan)
      const soLuongBanDaDung = Math.min(
        Math.floor(phieuInfo.soLuongBan * (0.9 + Math.random() * 0.1)),
        255
      )

      // Tính TongTienMonAn và TongTienDichVu
      const tongTienMonAn = parseInt(
        (tongTienMonAnMap[phieu] || 0).toFixed(2)
      )
      const tongTienDichVu = parseInt(
        (tongTienDichVuMap[phieu] || 0).toFixed(2)
      )

      // Tính DonGiaBan (tổng tiền món ăn / số bàn đã dùng)
      const donGiaBan =
        soLuongBanDaDung > 0 && tongTienMonAn > 0
          ? parseInt((tongTienMonAn / soLuongBanDaDung).toFixed(2))
          : 500000.0

      const tongTienHoaDonBase = parseInt(
        (tongTienMonAn + tongTienDichVu).toFixed(2)
      )

      // Tính TongTienPhat (1% mỗi ngày trễ sau 7 ngày)
      const ngayHetHan = new Date(
        phieuInfo.ngayDaiTiec.getTime() + 7 * 24 * 60 * 60 * 1000
      )
      const soNgayTre = Math.max(
        Math.floor((ngayThanhToan - ngayHetHan) / (24 * 60 * 60 * 1000)),
        0
      )
      const tongTienPhat =
        soNgayTre > 0
          ? parseInt((tongTienHoaDonBase * 0.01 * soNgayTre).toFixed(2))
          : null

      // Tính TongTienHoaDon (bao gồm phạt)
      const tongTienHoaDon = parseInt(
        (tongTienHoaDonBase + (tongTienPhat || 0)).toFixed(2)
      )

      const tienConLai = parseInt(
        (tongTienHoaDon - phieuInfo.tienDatCoc).toFixed(2)
      )

      data.push({
        SoHoaDon: `HD${phieu.slice(3)}`,
        SoPhieuDatTiec: phieu,
        NgayThanhToan: ngayThanhToan,
        DonGiaBan: donGiaBan,
        SoLuongBanDaDung: soLuongBanDaDung,
        TongTienDichVu: tongTienDichVu,
        TongTienMonAn: tongTienMonAn,
        TongTienHoaDon: tongTienHoaDon,
        TongTienPhat: tongTienPhat,
        TienConLai: tienConLai,
      })
    }

    await queryInterface.bulkInsert('HOADON', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('HOADON', null, {})
  },
}
