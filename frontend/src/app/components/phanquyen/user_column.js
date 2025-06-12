// Tạo cột mặc định cho bảng
import ActionButtons from '../Actionbuttons';

const UserColumn = [
  {
    id: 'index',
    label: 'STT',
    sortable: false,
    width: 50,
  },
  {
    id: 'username',
    label: 'Username',
    sortable: true,
    width: 150,
  },
  {
    id: 'TenNhom',
    label: 'Nhóm',
    sortable: true,
    width: 200,
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

export default UserColumn;
