'use strict'

const { MonAn, PhieuDatTiec, Sanh, LoaiSanh } = require('../models')

module.exports = {
  async up(queryInterface, Sequelize) {
    const monAnRecords = await MonAn.findAll({
      attributes: ['MaMonAn', 'DonGia'],
      raw: true,
    })

    if (monAnRecords.length === 0) {
      throw new Error(
        'Bảng MONAN chưa có dữ liệu. Vui lòng seed bảng MONAN trước.'
      )
    }

    // Tạo ánh xạ MaMonAn → DonGia
    const dishUnitPrices = monAnRecords.reduce((acc, monAn) => {
      acc[monAn.MaMonAn] = parseInt(monAn.DonGia)
      return acc
    }, {})

    const phieuDatTiecRecords = await PhieuDatTiec.findAll({
      include: {
        model: Sanh,
        include: {
          model: LoaiSanh,
          attributes: ['DonGiaBanToiThieu'],
        },
        attributes: ['MaSanh', 'MaLoaiSanh'],
      },
      attributes: ['SoPhieuDatTiec', 'SoLuongBan', 'SoBanDuTru', 'NgayDatTiec'],
      raw: true,
      nest: true,
    })

    if (phieuDatTiecRecords.length === 0) {
      throw new Error(
        'Bảng PHIEUDATTIEC chưa có dữ liệu. Vui lòng seed bảng PHIEUDATTIEC trước.'
      )
    }

    // Tạo map phiếu: SoPhieuDatTiec → tổng bàn + giá tối thiểu/bàn
    const phieuInfoMap = phieuDatTiecRecords.reduce((acc, record) => {
      const totalBan = record.SoLuongBan + (record.SoBanDuTru || 0)
      const minPrice = parseInt(
        record.Sanh.LoaiSanh?.DonGiaBanToiThieu || 1000000
      )
      acc[record.SoPhieuDatTiec] = {
        totalBan,
        minPricePerTable: minPrice,
        ngayDatTiec: new Date(record.NgayDatTiec),
      }
      return acc
    }, {})

    const phieuDatTiecIds = Object.keys(phieuInfoMap)
    const maMonAnIds = monAnRecords.map((m) => m.MaMonAn)

    const data = []

    for (const phieu of phieuDatTiecIds) {
      const { totalBan, minPricePerTable } = phieuInfoMap[phieu]

      let valid = false
      let dishDetails = []
      let avgPerTable = 0

      // Lặp cho đến khi tổng giá món ăn/bàn >= đơn giá tối thiểu
      while (!valid) {
        const numDishes = Math.floor(Math.random() * 5) + 4 // 5–8 món
        const selectedDishes = [...maMonAnIds]
          .sort(() => Math.random() - 0.5)
          .slice(0, numDishes)

        let tongTien = 0
        const tempData = []

        for (const maMonAn of selectedDishes) {
          const soLuong = totalBan
          const donGia = dishUnitPrices[maMonAn]
          const thanhTien = parseInt((soLuong * donGia).toFixed(2))
          tongTien += thanhTien

          tempData.push({
            MaMonAn: maMonAn,
            SoPhieuDatTiec: phieu,
            SoLuong: soLuong,
            DonGia: thanhTien,
            GhiChu:
              Math.random() > 0.7
                ? `Ghi chú cho món ${maMonAn} trong ${phieu}`
                : null,
          })
        }

        avgPerTable = tongTien / totalBan
        if (avgPerTable >= minPricePerTable) {
          valid = true
          dishDetails = tempData
        }
      }

      data.push(...dishDetails)
    }

    await queryInterface.bulkInsert('CT_DATBAN', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CT_DATBAN', null, {})
  },
}
