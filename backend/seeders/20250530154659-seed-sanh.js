'use strict'

const sanhData = [
  { TenSanh: 'Sảnh Hồng Ngọc', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Kim Cương', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Ngọc Trai', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Vàng Son', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Tiệc Trời Sao', MaLoaiSanh: 'LS006' },
  { TenSanh: 'Sảnh Hoàng Gia', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Bình Minh', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Phổ Thông A', MaLoaiSanh: 'LS002' },
  { TenSanh: 'Sảnh Phổ Thông B', MaLoaiSanh: 'LS002' },
  { TenSanh: 'Sảnh Mini 1', MaLoaiSanh: 'LS007' },
  { TenSanh: 'Sảnh Mini 2', MaLoaiSanh: 'LS007' },
  { TenSanh: 'Sảnh Tiêu Chuẩn A', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Tiêu Chuẩn B', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Doanh Nhân', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Ruby', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Platinum', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Ánh Dương', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Giai Điệu', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Thanh Lịch', MaLoaiSanh: 'LS002' },
]

const getRandomBanToiDa = (loai) => {
  switch (loai) {
    case 'LS007': // Sảnh nhỏ
      return Math.floor(Math.random() * 21) + 30 // 30–50
    case 'LS001': // Tiêu chuẩn
      return Math.floor(Math.random() * 31) + 50 // 50–80
    case 'LS002': // Phổ thông
      return Math.floor(Math.random() * 41) + 70 // 70–110
    case 'LS003': // Thương gia
      return Math.floor(Math.random() * 41) + 100 // 100–140
    case 'LS004': // Cao cấp
      return Math.floor(Math.random() * 41) + 130 // 130–170
    case 'LS005': // VIP
      return Math.floor(Math.random() * 51) + 150 // 150–200
    case 'LS006': // Ngoài trời
      return Math.floor(Math.random() * 61) + 180 // 180–240
    default:
      return 100
  }
}

const getRandomImage = () => {
  const options = [
    // Thêm các hình ảnh sảnh vào đây
  ]
  return options[Math.floor(Math.random() * options.length)]
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = sanhData.map((item, index) => ({
      MaSanh: `S${String(index + 1).padStart(3, '0')}`,
      TenSanh: item.TenSanh,
      MaLoaiSanh: item.MaLoaiSanh,
      SoLuongBanToiDa: getRandomBanToiDa(item.MaLoaiSanh),
      HinhAnh: getRandomImage(),
      GhiChu: null,
    }))

    await queryInterface.bulkInsert('SANH', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SANH', null, {})
  },
}
