'use strict'

const { AVAILABLE, UNAVAILABLE, NO_LONGER_AVAILABLE } = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
}

const foodData = [
  {
    TenMonAn: 'Cá hồi tẩm bột chiên giòn dùng với gỏi xoài Thái',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748656529/xdmdlys7hpgv6ju2kiie.jpg',
  },
  {
    TenMonAn: 'Tôm cuộn khoai môn chiên giòn sốt tartar',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748656585/mzys6codztqyytdqgaby.jpg',
  },
  {
    TenMonAn: 'Salad củ hũ dừa và tôm càng sốt cay',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748656642/zee7gqfa02dingybbwvn.jpg',
  },
  {
    TenMonAn:
      'Cánh gà nướng sốt BBQ dùng vời salad - Ba rọi cuộn nấm sốt phô mai',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748656693/oyrzmspm12i7py3iu1o7.jpg',
  },
  {
    TenMonAn: 'Củ sen bách hoa sốt chua ngọt',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748656759/s7ebahivpg8h8ntpsbj9.jpg',
  },
  {
    TenMonAn: 'Mực xuyên tiêu sốt tamarind',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/1-101.jpg',
  },
  {
    TenMonAn: 'Soup consomme bồ câu',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/soup-consomme-bo-cau-318.jpg',
  },
  {
    TenMonAn: 'Phi lê cá tâm đút lò sốt Teriyaki',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/phi-le-ca-tam-dut-lo-sot-teriyaki.jpg',
  },
  {
    TenMonAn: 'Tôm càng hấp - Salad Atichoke',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/tom-cang-hap-salad-atichoke.jpg',
  },
  {
    TenMonAn: 'Chân bê nướng - rau củ ratatoille',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/chan-be-nuong-rau-cu-ratatoille.jpg',
  },
  {
    TenMonAn: 'Mỳ Ý sốt cà ri - Bò cuôn phô mai nướng',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/my-y-sot-ca-ri-bo-cuon-pho-mai-nuong.jpg',
  },
  {
    TenMonAn: 'Món súp',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/soup-consomme-bo-cau.jpg',
  },
  {
    TenMonAn: 'Tôm sú sốt lá hương nhu và thịt heo bằm',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/2-601.jpg',
  },
  {
    TenMonAn: 'Bò xào sốt tương tỏi ớt dùng với bánh mỳ',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/3.jpg',
  },
  {
    TenMonAn: 'Bồ câu quay mắm nhĩ dùng với bánh bao chiên',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/4-837.jpg',
  },
  {
    TenMonAn: 'Ba rọi heo quay củ hồi - Tiến vua chua ngọt',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/5-581.jpg',
  },
  {
    TenMonAn: 'Cơm Nhật cà ri và tôm sốt teppan',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/7-536.jpg',
  },
  {
    TenMonAn: 'Lẩu bò Mỹ cuộn nấm dùng với mì somen',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/9-954.jpg',
  },
  {
    TenMonAn: 'Bánh mousse dâu',
    HinhAnh:
      'https://riversidepalace.vn/resizemultidata/banh-mousse-dau-tay.jpg',
  },
  {
    TenMonAn: 'Bánh táo tatin',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/11.jpg',
  },
  {
    TenMonAn: 'Bánh mousse chanh dây',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/1-937.jpg',
  },
  {
    TenMonAn: 'Puff Pastry nhân cá hồi',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/09-561.jpg',
  },
  {
    TenMonAn: 'Op Rib Bò Mỹ Nướng - Salad Xoài',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/08-341.jpg',
  },
  {
    TenMonAn: 'Súp hoành thánh tôm Foie Gras',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/07-227.jpg',
  },
  {
    TenMonAn: 'Cá tầm hấp tam vị',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/06-415.jpg',
  },
  {
    TenMonAn: 'Ức vịt nướng sốt cam gừng  - khoai tây Fondant',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/05-454.jpg',
  },
  {
    TenMonAn: 'Mỳ undon hải sản sốt shellfish',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/03.jpg',
  },
  {
    TenMonAn: 'Bánh phô mai nướng sốt dâu rừng',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/02-891.jpg',
  },
  {
    TenMonAn: 'Burger patê sườn non',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/07-968.jpg',
  },
  {
    TenMonAn: 'Cua lột rang muối - salad bưởi',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/01-501.jpg',
  },
  {
    TenMonAn: 'Súp cua hải vị',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/05-919.jpg',
  },
  {
    TenMonAn: 'Tôm càng nướng BBQ - Salad Salsa',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/13-307.jpg',
  },
  {
    TenMonAn: 'Thăn nõn bê cuộn thịt - Capuchino gan ngỗng',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/04.jpg',
  },
  {
    TenMonAn: 'Mì xào vịt quay xá xíu',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/03-88.jpg',
  },
  {
    TenMonAn: 'Rau câu tổ yến hạt chia - salad trái cây tươi',
    HinhAnh: 'https://riversidepalace.vn/resizemultidata/12-297.jpg',
  },
  {
    TenMonAn: 'Súp gà nấm hương',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748160221/tvchu9hnt32g1ackacgd.png',
  },
  {
    TenMonAn: 'Bê om sâm, nấm đông cô (kèm bánh mỳ)',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748160320/iwkj5u6otxitaz2xkxwb.png',
  },
  {
    TenMonAn: 'Gà đông tảo rút xương sốt nấm',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748165450/qulff9vio81sr7l38dyn.png',
  },
  {
    TenMonAn: 'Salad hoàng đế',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748619717/lvdrn0w4wajljx6ebulp.png',
  },
  {
    TenMonAn: 'Cá quả chiên sốt thái',
    HinhAnh:
      'https://res.cloudinary.com/digpe9tmq/image/upload/v1748492703/ufzhn9ey1jeyh7xy2ku3.png',
  },
]

const getRandomTinhTrang = () => {
  const rand = Math.random()
  if (rand < 0.7) return AVAILABLE
  if (rand < 0.9) return UNAVAILABLE
  return NO_LONGER_AVAILABLE
}

const getRandomDonGia = () => {
  return parseInt(Math.random() * (600000 - 200000) + 200000).toFixed(2)
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedData = foodData.map((item, index) => ({
      MaMonAn: `MA${String(index + 1).padStart(3, '0')}`,
      TenMonAn: item.TenMonAn,
      DonGia: getRandomDonGia(),
      HinhAnh: item.HinhAnh,
      TinhTrang: getRandomTinhTrang(),
    }))

    await queryInterface.bulkInsert('MONAN', seedData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MONAN', null, {})
  },
}
