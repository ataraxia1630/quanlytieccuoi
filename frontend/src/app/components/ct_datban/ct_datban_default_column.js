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
        id: "TenMonAn",
        label: "Tên món ăn",
        sortable: true,
        width: 150,
    },
    {
        id: "SoLuong",
        label: "Số lượng",
        sortable: true,
        width: 200,
    },
    {
        id: "DonGia",
        label: "Đơn Giá",
        sortable: true,
        width: 150,
        render: (row) =>
            new Intl.NumberFormat('vi-VN').format(row.DonGia),
    },
    {
        id: "GhiChu",
        label: "Ghi chú",
        sortable: false,
        width: 300,
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