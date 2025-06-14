// Tạo cột mặc định cho bảng
import ActionButtons from '../Actionbuttons';
import { statusMapToFrontend } from '../../pages/DanhSachMonAn/statusMapping';

const DishColumns = [
  {
    id: 'STT',
    label: 'STT',
    sortable: false,
    width: 50,
  },
  {
    id: 'MaMonAn',
    label: 'Mã món ăn',
    sortable: true,
    width: 150,
  },
  {
    id: 'TenMonAn',
    label: 'Tên món ăn',
    sortable: true,
    width: 200,
  },
  {
    id: 'HinhAnh',
    label: 'Hình ảnh',
    sortable: false,
    width: 200,
    render: (row) =>
      row.HinhAnh ? (
        <img
          src={row.HinhAnh}
          alt={row.TenMonAn}
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
          }}
        />
      ) : (
        <span>Chưa có hình</span>
      ),
  },
  {
    id: 'DonGia',
    label: 'Giá',
    sortable: true,
    width: 150,
    render: (row) => new Intl.NumberFormat('vi-VN').format(row.DonGia),
  },
  {
    id: 'TinhTrang',
    label: 'Tình trạng',
    sortable: false,
    width: 150,
    render: (row) => statusMapToFrontend[row.TinhTrang] || row.TinhTrang,
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

export default DishColumns;
