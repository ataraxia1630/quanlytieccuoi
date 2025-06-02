import ActionButtons from "../Actionbuttons";

const DichVuColumn = [
  {
    id: "index",
    label: "STT",
    sortable: false,
    width: 70,
  },
  {
    id: "MaDichVu",
    label: "Mã dịch vụ",
    sortable: true,
    width: 150,
  },
  {
    id: "TenDichVu",
    label: "Tên dịch vụ",
    sortable: true,
    width: 200,
  },
  {
    id: "DonGia",
    label: "Giá",
    sortable: true,
    width: 150,
    render: (row) => {
      const price = Number(row.DonGia);
      return isNaN(price)
        ? "N/A"
        : new Intl.NumberFormat("vi-VN").format(price);
    },
  },
  {
    id: "TinhTrang",
    label: "Tình trạng",
    sortable: false,
    width: 150,
  },
  {
    id: "actions",
    label: "Thao tác",
    sortable: false,
    width: 100,
    render: (row, onEdit, onDelete) => (
      <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];

export default DichVuColumn;
