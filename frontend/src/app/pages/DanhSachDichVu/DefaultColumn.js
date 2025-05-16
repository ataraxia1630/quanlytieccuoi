import { Box } from "@mui/material";
import ActionButtons from "../../components/Actionbuttons";

const defaultColumns = [
  {
    id: "index",
    label: "STT",
    sortable: false,
    width: 50,
  },
  {
    id: "id",
    label: "Mã món ăn",
    sortable: true,
    width: 150,
  },
  {
    id: "name",
    label: "Tên món ăn",
    sortable: true,
    width: 200,
  },
  {
    id: "image",
    label: "Hình ảnh",
    sortable: false,
    width: 200,
    render: (row) => (
      <Box
        component="img"
        src={row.image}
        alt={row.name}
        sx={{ width: 100, height: 100, objectFit: "contain" }}
      />
    ),
  },
  {
    id: "price",
    label: "Giá",
    sortable: true,
    width: 150,
    render: (row) => `${row.price.toLocaleString()} VND`,
  },
  {
    id: "status",
    label: "Tình Trạng",
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
