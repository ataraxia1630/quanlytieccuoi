import ActionButtons from "../../components/Actionbuttons";

const defaultColumns = [
  {
    id: "index",
    label: "STT",
    sortable: false,
    width: 50,
    render: (row, index) => index + 1, // Align with Sanh
  },
  {
    id: "MaCa",
    label: "Mã ca",
    sortable: true,
    width: 150,
  },
  {
    id: "TenCa",
    label: "Tên ca",
    sortable: true,
    width: 200,
  },
  {
    id: "GioBatDau",
    label: "Giờ bắt đầu",
    sortable: true,
    width: 150,
  },
  {
    id: "GioKetThuc",
    label: "Giờ kết thúc",
    sortable: true,
    width: 150,
  },
  {
    id: "actions",
    label: "Thao tác",
    sortable: false,
    width: 100,
    render: (row, onEdit, onDelete, disabledEdit, disabledDelete) => (
      <ActionButtons
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        disabledEdit={disabledEdit}
        disabledDelete={disabledDelete}
      />
    ),
  },
];

export default defaultColumns;