'use strict';

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
];

// Hàm random bàn tối đa
const getRandomBanToiDa = (loai) => {
  const getSteppedRandom = (min, max, step) => {
    const values = [];
    for (let i = min; i <= max; i += step) {
      values.push(i);
    }
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  };

  switch (loai) {
    case 'LS001':
      return getSteppedRandom(50, 80, 5);
    case 'LS002':
      return getSteppedRandom(70, 110, 5);
    case 'LS003':
      return getSteppedRandom(100, 140, 5);
    case 'LS004':
      return getSteppedRandom(130, 170, 5);
    case 'LS005':
      return getSteppedRandom(150, 200, 5);
    default:
      return 100;
  }
};

const imageOptions = [
  'https://banquet.vn/wp-content/uploads/2023/12/Sanh-tiec-Silverland.jpg',
  'https://banquet.vn/wp-content/uploads/2023/12/Sony-8410-copy-1024x683.jpg',
  'https://banquet.vn/wp-content/uploads/2024/07/tiec-cong-ty-8-1024x1024.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/Sony-1042-copy-1024x683.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/Sony-0337-1024x683.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/sanh_tiec_5-1024x529.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/khong-gian-tiec-cong-ty-sang-trong-1024x529.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/tiec_doanh_nghiep-1024x529.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/tiec-cuoi_1-1024x529.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/Sanh_tiec_Ery_3-1-1024x529.jpg',
  'https://banquet.vn/wp-content/uploads/2023/10/tiec-cong-ty-1024x529.jpg',
  'https://www.saigon.park.hyattrestaurants.com/uploads/1/1/2/9/112964589/phs-ballroom-wedding-550x400_orig.jpg',
  'https://www.saigon.park.hyattrestaurants.com/uploads/1/1/2/9/112964589/phs-poolhouse-banquet-550x400_orig.jpg',
  'https://dp1.diamondplace.vn/wp-content/uploads/2023/04/hinh-sanh-grand-ruby-2-1024x682.jpg',
  'https://dp1.diamondplace.vn/wp-content/uploads/2024/05/sanh-tiec-cuoi-sapphire-diamond-place-1024x681.webp',
  'https://tonywedding.vn/wp-content/uploads/2022/12/1a-1536x864.jpg',
];

// Tạo shuffle để không bị random ảnh trùng
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const shuffledImages = shuffle(imageOptions);

    const data = sanhData.map((item, index) => ({
      MaSanh: `S${String(index + 1).padStart(3, '0')}`,
      TenSanh: item.TenSanh,
      MaLoaiSanh: item.MaLoaiSanh,
      SoLuongBanToiDa: getRandomBanToiDa(item.MaLoaiSanh),
      HinhAnh: shuffledImages[index] || null,
      GhiChu: null,
    }));

    await queryInterface.bulkInsert('SANH', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    const maSanhList = Array.from(
      { length: 16 },
      (_, i) => `S${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete(
      'SANH',
      {
        MaSanh: {
          [Sequelize.Op.in]: maSanhList,
        },
      },
      {}
    );
  },
};
