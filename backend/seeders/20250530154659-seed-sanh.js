'use strict'

const sanhData = [
  { TenSanh: 'Sảnh Hồng Ngọc', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Kim Cương', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Ngọc Trai', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Vàng Son', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Hoàng Gia', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Bình Minh', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Phổ Thông A', MaLoaiSanh: 'LS002' },
  { TenSanh: 'Sảnh Phổ Thông B', MaLoaiSanh: 'LS002' },
  { TenSanh: 'Sảnh Tiêu Chuẩn A', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Tiêu Chuẩn B', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Doanh Nhân', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Ruby', MaLoaiSanh: 'LS004' },
  { TenSanh: 'Sảnh Platinum', MaLoaiSanh: 'LS005' },
  { TenSanh: 'Sảnh Ánh Dương', MaLoaiSanh: 'LS001' },
  { TenSanh: 'Sảnh Giai Điệu', MaLoaiSanh: 'LS003' },
  { TenSanh: 'Sảnh Thanh Lịch', MaLoaiSanh: 'LS002' },
]

// Hàm random bàn tối đa
const getRandomBanToiDa = (loai) => {
  switch (loai) {
    case 'LS001':
      return Math.floor(Math.random() * 31) + 50 // 50–80
    case 'LS002':
      return Math.floor(Math.random() * 41) + 70 // 70–110
    case 'LS003':
      return Math.floor(Math.random() * 41) + 100 // 100–140
    case 'LS004':
      return Math.floor(Math.random() * 41) + 130 // 130–170
    case 'LS005':
      return Math.min(Math.floor(Math.random() * 51) + 150) // 150–200
    default:
      return 100
  }
}

const imageOptions = [
  // Thêm ảnh vào nếu có
]

// Tạo shuffle để không bị random ảnh trùng
const shuffle = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const shuffledImages = shuffle(imageOptions)

    const data = sanhData.map((item, index) => ({
      MaSanh: `S${String(index + 1).padStart(3, '0')}`,
      TenSanh: item.TenSanh,
      MaLoaiSanh: item.MaLoaiSanh,
      SoLuongBanToiDa: getRandomBanToiDa(item.MaLoaiSanh),
      HinhAnh: shuffledImages[index] || null,
      GhiChu: null,
    }))

    await queryInterface.bulkInsert('SANH', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SANH', null, {})
  },
}
