'use strict';

const { AVAILABLE, UNAVAILABLE, NO_LONGER_AVAILABLE } = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  NO_LONGER_AVAILABLE: 'NO_LONGER_AVAILABLE',
};

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
      'Cánh gà nướng sốt BBQ dùng với salad - Ba rọi cuộn nấm sốt phô mai',
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
    TenMonAn: 'Phi lê cá tầm đút lò sốt Teriyaki',
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
    TenMonAn: 'Mỳ Ý sốt cà ri - Bò cuộn phô mai nướng',
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
  {
    TenMonAn: 'Burger phô mai tan chảy',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg',
  },
  {
    TenMonAn: 'Súp mì thịt viên đậm đà',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/foodiesfeed-2024-12-16-100127.jpg',
  },
  {
    TenMonAn: 'Bánh cheesecake chanh mát lạnh',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/refreshing-lemon-cheesecake-slice-with-mint-garnish.jpg',
  },
  {
    TenMonAn: 'Cơm rau củ sắc màu cùng trứng ốp la',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/colorful-bowl-of-deliciousness-with-fried-egg.png',
  },
  {
    TenMonAn: 'Kem ly socola',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/10/bowl-of-ice-cream-with-chocolate.jpg',
  },
  {
    TenMonAn: 'Sữa dâu tươi',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/04/strawberry-milk-splash.jpg',
  },
  {
    TenMonAn: 'Cánh gà chiên giòn cay nồng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/08/crispy-spicy-chicken-wings.jpg',
  },
  {
    TenMonAn: 'Bò bít tết nướng ăn kèm rau củ',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/05/freshly-prepared-beef-steak-with-vegetables.jpg',
  },
  {
    TenMonAn: 'Bánh kem matcha tầng phủ cherry và hạnh nhân',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/matcha-layer-cake-with-cherries-and-almonds.webp',
  },
  {
    TenMonAn: 'Salad cá hồi tươi cùng thảo mộc và cam chanh',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/fresh-salmon-salad-with-herbs-and-citrus.png',
  },
  {
    TenMonAn: 'Chanh tươi',
    HinhAnh: 'https://www.foodiesfeed.com/wp-content/uploads/2023/09/limes.jpg',
  },
  {
    TenMonAn: 'Burger phô mai mọng nước',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/05/juicy-cheeseburger.jpg',
  },
  {
    TenMonAn: 'Cà chua mọng nước phủ sương',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/04/fresh-and-juicy-tomatoes-with-water-droplets.png',
  },
  {
    TenMonAn: 'Bò bít tết ăn kèm khoai tây chiên',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/04/steak-with-french-fries-on-a-plate.jpg',
  },
  {
    TenMonAn: 'Bánh pancake rưới mật ong',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/06/pouring-honey-on-pancakes.jpg',
  },
  {
    TenMonAn: 'Sô-cô-la nóng thơm nồng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/10/hot-chocolate.jpg',
  },
  {
    TenMonAn: 'Đào tươi',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/09/peaches.jpg',
  },
  {
    TenMonAn: 'Thịt xiên nướng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/grilled-meat-skewers-with-lemon-and-mint.webp',
  },
  {
    TenMonAn: 'Kem ốc quế',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/06/ice-cream-cone-splash.jpg',
  },
  {
    TenMonAn: 'Việt quất',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/05/blueberries-full-frame.jpg',
  },
  {
    TenMonAn: 'Pizza salami',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/05/pizza-salami.jpg',
  },
  {
    TenMonAn: 'Bánh Pavlova phủ trái cây tươi',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/decadent-pavlova-topped-with-fresh-berries-delight.jpg',
  },
  {
    TenMonAn: 'Bát rau củ cùng trứng và bắp non',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/colorful-breakfast-bowl-with-eggs-and-vegetables.webp',
  },
  {
    TenMonAn: 'Tôm xào rau củ cùng cơm trắng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/colorful-shrimp-stir-fry-with-broccoli-and-rice.jpg',
  },
  {
    TenMonAn: 'Trứng luộc',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/06/boiled-eggs-on-a-plate.jpg',
  },
  {
    TenMonAn: 'Trái cây cắt lát sắc màu',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/heart-shaped-fruit-slices-in-vibrant-colors.webp',
  },
  {
    TenMonAn: 'Cơm xào rau củ',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/vibrant-vegetable-rice-stir-fry-delight.webp',
  },
  {
    TenMonAn: 'Bông cải xanh và ớt chuông',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/09/broccoli-and-bell-peppers.jpg',
  },
  {
    TenMonAn: 'Gà sốt bơ đậm đà',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/07/butter-chicken-in-a-pan.jpg',
  },
  {
    TenMonAn: 'Pizza cắt lát',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/12/cutting-pizza.jpg',
  },
  {
    TenMonAn: 'Thịt heo nướng giòn',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/08/grilled-crispy-pork-with-rice.jpg',
  },
  {
    TenMonAn: 'Bánh croissant',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/04/golden-croissants-on-baking-paper.png',
  },
  {
    TenMonAn: 'Cà phê espresso có lớp crema',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/06/coffee-crema.jpg',
  },
  {
    TenMonAn: 'Nước ép trái cây',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/colorful-healthy-fruit-juices-and-fresh-ingredients.png',
  },
  {
    TenMonAn: 'Súp cá hồi kem cùng thảo mộc',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/creamy-salmon-soup-with-fresh-herbs.png',
  },
  {
    TenMonAn: 'Cà phê',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/10/coffee-book.jpg',
  },
  {
    TenMonAn: 'Nước chanh tươi mát lạnh',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2020/05/suco-de-limao-com-slash.jpg',
  },
  {
    TenMonAn: 'Tôm hấp cùng chanh và bắp ngọt',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/flavorful-shrimp-feast-with-lemon-and-corn.png',
  },
  {
    TenMonAn: 'Salad trái cây tươi với bạc hà',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/04/fresh-fruit-salad-with-mint.jpg',
  },
  {
    TenMonAn: 'Bánh cheesecake phủ trái cây',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/delicious-cheesecake-with-fresh-berries.webp',
  },
  {
    TenMonAn: 'Rượu vang trắng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/golden-sunset-with-glass-of-white-wine.webp',
  },
  {
    TenMonAn: 'Bánh kem chanh phủ topping ngọt dịu',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/creamy-key-lime-pie-with-whipped-topping.webp',
  },
  {
    TenMonAn: 'Latte đá',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/iced-latte-with-golden-straw-in-cozy-cafe.webp',
  },
  {
    TenMonAn: 'Cá hồi nướng cùng quinoa và rau củ',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/grilled-salmon-bowl-with-quinoa-and-colorful-veggies.webp',
  },
  {
    TenMonAn: 'Salad trộn',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/fresh-greens-tossed-in-a-vibrant-bowl.webp',
  },
  {
    TenMonAn: 'Kem que dâu',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/refreshing-strawberry-mint-popsicles-on-ice.jpg',
  },
  {
    TenMonAn: 'Tiramisu',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/delicious-tiramisu-dessert-slice-on-elegant-plate.webp',
  },
  {
    TenMonAn: 'Thăn bò áp chảo',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/04/flat-iron-steak-on-a-plate-in-a-restaurant.jpg',
  },
  {
    TenMonAn: 'Đùi gà chiên giòn',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/crispy-fried-chicken-drumstick-in-hot-oil.webp',
  },
  {
    TenMonAn: 'Sữa lắc cookie kem béo',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/irresistible-cookie-cream-milkshake-delight.png',
  },
  {
    TenMonAn: 'Gà nướng chanh thảo mộc cùng lá rosemary',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/grilled-lemon-herb-chicken-with-fresh-rosemary.png',
  },
  {
    TenMonAn: 'Bánh mì nướng vàng giòn',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/golden-toast-stacked-on-neutral-background.webp',
  },
  {
    TenMonAn: 'Salad gà và bơ',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/04/avocado-chicken-salad.jpg',
  },
  {
    TenMonAn: 'Sushi cuộn sắc màu',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/colorful-sushi-rolls-floating-in-air.webp',
  },
  {
    TenMonAn: 'Mì ramen trứng lòng đào',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/06/flavorful-ramen-noodles-with-soft-boiled-eggs.webp',
  },
  {
    TenMonAn: 'Cà ri gà với khoai tây và thảo mộc',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2024/12/flavorful-chicken-curry-with-potatoes-and-herbs.jpg',
  },
  {
    TenMonAn: 'Bánh cupcake phủ kem hồng',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/01/delicious-pink-frosted-cupcakes-with-gold-sprinkles.png',
  },
  {
    TenMonAn: 'Salad trái cây tươi',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/colorful-fruit-salad-platter-with-fresh-mint.webp',
  },
  {
    TenMonAn: 'Bánh baklava mật ong',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/2023/10/baklava-macro.jpg',
  },
  {
    TenMonAn: 'Dâu tây xoáy',
    HinhAnh:
      'https://www.foodiesfeed.com/wp-content/uploads/ff-images/2025/05/swirling-fresh-strawberries-with-splashing-juice.webp',
  },
];

const getRandomTinhTrang = () => {
  const rand = Math.random();
  if (rand < 0.7) return AVAILABLE;
  if (rand < 0.9) return UNAVAILABLE;
  return NO_LONGER_AVAILABLE;
};

const getRandomDonGia = () => {
  const min = 300000;
  const max = 700000;
  const step = 10000;

  const range = Math.floor((max - min) / step) + 1;
  const randomStep = Math.floor(Math.random() * range);
  return min + randomStep * step;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seedData = foodData.map((item, index) => ({
      MaMonAn: `MA${String(index + 1).padStart(3, '0')}`,
      TenMonAn: item.TenMonAn,
      DonGia: getRandomDonGia(),
      HinhAnh: item.HinhAnh,
      TinhTrang: getRandomTinhTrang(),
    }));

    await queryInterface.bulkInsert('MONAN', seedData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const maMonAnList = Array.from(
      { length: 100 },
      (_, i) => `MA${String(i + 1).padStart(3, '0')}`
    );

    await queryInterface.bulkDelete(
      'MONAN',
      {
        MaMonAn: {
          [Sequelize.Op.in]: maMonAnList,
        },
      },
      {}
    );
  },
};
