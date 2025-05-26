const ReportColumns = [
  {
    id: 'Ngay',
    label: 'Ngày',
    sortable: true,
    width: 150,
  },
  {
    id: 'SoLuongTiec',
    label: 'Số lượng tiệc cưới',
    sortable: true,
    width: 150,
  },
  {
    id: 'DoanhThu',
    label: 'Doanh thu (VNĐ)',
    sortable: true,
    width: 150,
    render: (row) => new Intl.NumberFormat('vi-VN').format(row.DoanhThu || 0),
  },
  {
    id: 'TiLe',
    label: 'Tỷ lệ (%)',
    sortable: true,
    width: 150,
    render: (row) => (row.TiLe || 0).toFixed(2),
  },
];

export default ReportColumns;
