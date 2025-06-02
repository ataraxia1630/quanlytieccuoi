'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'DICHVU',
      [
        {
          MaDichVu: 'DV001',
          TenDichVu: 'Trang trí sân khấu',
          DonGia: 5000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV002',
          TenDichVu: 'Ban nhạc sống',
          DonGia: 8000000.0,
          TinhTrang: 'Tạm dừng',
        },
        {
          MaDichVu: 'DV003',
          TenDichVu: 'MC chuyên nghiệp',
          DonGia: 3000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV004',
          TenDichVu: 'Quay phim & chụp ảnh',
          DonGia: 7000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV005',
          TenDichVu: 'Xe hoa',
          DonGia: 2500000.0,
          TinhTrang: 'Ngừng cung cấp',
        },
        {
          MaDichVu: 'DV006',
          TenDichVu: 'Trang trí bàn gallery',
          DonGia: 3500000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV007',
          TenDichVu: 'Đội bưng quả',
          DonGia: 2000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV008',
          TenDichVu: 'Lễ tân đón khách',
          DonGia: 1500000.0,
          TinhTrang: 'Tạm dừng',
        },
        {
          MaDichVu: 'DV009',
          TenDichVu: 'Bắn pháo giấy',
          DonGia: 1200000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV010',
          TenDichVu: 'Trang điểm, làm tóc cô dâu',
          DonGia: 4000000.0,
          TinhTrang: 'Ngừng cung cấp',
        },
        {
          MaDichVu: 'DV011',
          TenDichVu: 'Thuê áo cưới',
          DonGia: 4500000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV012',
          TenDichVu: 'Âm thanh ánh sáng',
          DonGia: 1500000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV013',
          TenDichVu: 'Chiếu slide kỷ niệm',
          DonGia: 2000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV014',
          TenDichVu: 'Trang trí cổng hoa',
          DonGia: 4500000.0,
          TinhTrang: 'Tạm dừng',
        },
        {
          MaDichVu: 'DV015',
          TenDichVu: 'Tiệc ngọt khai tiệc',
          DonGia: 6000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV016',
          TenDichVu: 'Trang trí bàn tiệc theo chủ đề',
          DonGia: 3800000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV017',
          TenDichVu: 'Photobooth chụp ảnh khách mời',
          DonGia: 2500000.0,
          TinhTrang: 'Tạm dừng',
        },
        {
          MaDichVu: 'DV018',
          TenDichVu: 'Thuê xe đưa rước khách',
          DonGia: 5000000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV019',
          TenDichVu: 'Trang trí không gian lối đi',
          DonGia: 3200000.0,
          TinhTrang: 'Có sẵn',
        },
        {
          MaDichVu: 'DV020',
          TenDichVu: 'Nhóm múa khai tiệc',
          DonGia: 4500000.0,
          TinhTrang: 'Ngừng cung cấp',
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('DICHVU', null, {})
  },
}
