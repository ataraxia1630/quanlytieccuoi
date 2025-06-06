import { Box } from "@mui/material";
import ActionButtons from "../../components/Actionbuttons";

const defaultColumns = [
  {
    id: "index",
    label: "STT",
    sortable: false,
    width: 50,
    render: (row, index) => index + 1,
  },
  {
    id: "MaSanh",
    label: "Mã sảnh",
    sortable: true,
    width: 150,
  },
  {
    id: "TenSanh",
    label: "Tên sảnh",
    sortable: true,
    width: 200,
  },
  {
    id: "MaLoaiSanh",
    label: "Loại sảnh",
    sortable: true,
    width: 150,
    render: (row) => row.LoaiSanh?.TenLoaiSanh || "Không có",
  },
  {
    id: "SoLuongBanToiDa",
    label: "Số lượng bàn tối đa",
    sortable: true,
    width: 150,
  },
  {
    id: "HinhAnh",
    label: "Hình ảnh",
    sortable: false,
    width: 200,
    render: (row) => (
      <Box
        component="img"
        src={row.HinhAnh || "https://via.placeholder.com/50"}
        alt={row.TenSanh}
        sx={{ width: 300, height: 300, objectFit: "contain" }}
      />
    ),
  },
  {
    id: "GhiChu",
    label: "Ghi chú",
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

export default defaultColumns;