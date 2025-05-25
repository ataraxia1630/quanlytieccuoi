// Tạo cột mặc định cho bảng
import ActionButtons from '../Actionbuttons';

const HallTypeColumns = [
  {
    id: 'index',
    label: 'STT',
    sortable: false,
    width: 50,
  },
  {
    id: 'MaLoaiSanh',
    label: 'Mã loại sảnh',
    sortable: true,
    width: 150,
  },
  {
    id: 'TenLoaiSanh',
    label: 'Tên loại sảnh',
    sortable: true,
    width: 200,
  },
  {
    id: 'DonGiaBanToiThieu',
    label: 'Đơn giá bàn tối thiểu',
    sortable: true,
    width: 150,
    render: (row) =>
      new Intl.NumberFormat('vi-VN').format(row.DonGiaBanToiThieu),
  },
  {
    id: 'actions',
    label: 'Thao tác',
    sortable: false,
    width: 100,
    render: (row, onEdit, onDelete) => (
      <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];

export default HallTypeColumns;
