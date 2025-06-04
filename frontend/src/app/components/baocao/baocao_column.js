const ReportColumns = [
  {
    id: 'index',
    label: 'STT',
    sortable: false,
    width: 50,
  },
  {
    id: 'Ngay',
    label: 'Ngày',
    sortable: true,
    width: 150,
    render: (row) => {
      const dateParts = row.Ngay.split('-');
      if (dateParts.length === 3) {
        return `${dateParts[2].split('T')[0]}/${dateParts[1]}/${dateParts[0]}`;
      }
      return row.Ngay;
    },
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
    render: (row) => (parseFloat(row.TiLe) || 0).toFixed(2),
  },
];

export default ReportColumns;
