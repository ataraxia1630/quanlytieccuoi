import { getHoaDon } from "../../service/hoadon.service";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
            d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
            stroke="#063F5C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
const EyeIcon = () => (
    <svg
        width="18"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1 12C1 12 5 5 12 5C19 5 23 12 23 12C23 12 19 19 12 19C5 19 1 12 1 12Z"
            stroke="#063F5C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            cx="12"
            cy="12"
            r="3"
            stroke="#063F5C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Phieucolumns = (navigate) =>

    [
        { id: "index", label: "STT", width: 10 },
        { id: "SoPhieuDatTiec", label: "Số phiếu", sortable: true, width: 150 },
        { id: "TenChuRe", label: "Tên chú rể", sortable: true },
        { id: "TenCoDau", label: "Tên cô dâu", sortable: true },
        {
            id: "TenSanh", label: "Sảnh",
            render: (row) => row?.Sanh?.TenSanh || "Không rõ"
        },
        { id: "SoLuongBan", label: "Số bàn", sortable: true, width: 100 },
        {
            id: "NgayDaiTiec",
            label: "Ngày",
            sortable: true,
            render: (row) => {
                const date = new Date(row.NgayDaiTiec);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Lưu ý: getMonth() trả về 0-11
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            id: "gio", label: "Giờ",
            render: (row) => {
                const date = new Date(row.NgayDaiTiec);
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
        },
        {
            id: "TrangThai", label: "Trạng thái"
        },
        {
            id: "actions", label: "Thao tác", width: 165,
            render: (row, _onEdit, onDelete) => (

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0px" }}>
                    {
                        row.TrangThai !== 'Đã hủy' &&
                        <IconButton
                            className='action'
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
                                    if (hoaDon) {
                                        navigate('/DashBoard/HoaDon', {
                                            state: {
                                                soHoaDon: hoaDon.SoHoaDon,
                                                soPhieuDatTiec: row.SoPhieuDatTiec,
                                                data: hoaDon,
                                                chuRe: row.TenChuRe,
                                                coDau: row.TenCoDau,
                                                tienCoc: row.TienDatCoc,
                                                ngayDaiTiec: row.NgayDaiTiec
                                            }
                                        });
                                    } else {
                                        navigate('/DashBoard/HoaDon', {
                                            state: {
                                                soPhieuDatTiec: row.SoPhieuDatTiec,
                                                data: row,
                                                chuRe: row.TenChuRe,
                                                coDau: row.TenCoDau,
                                                tienCoc: row.TienDatCoc,
                                                ngayDaiTiec: row.NgayDaiTiec
                                            }
                                        });
                                    }
                                } catch (error) {
                                    console.error("Lỗi xem hóa đơn:", error);
                                }
                            }}
                        >
                            <EyeIcon />


                            {
                                row.TrangThai === 'Đã thanh toán' &&
                                <Typography variant="body2" sx={{ color: "#000" }}>
                                    Xem hóa đơn
                                </Typography>}

                            {row.TrangThai === 'Chưa thanh toán' &&
                                <Typography variant="body2" sx={{ color: "#000" }}>
                                    Tạo hóa đơn
                                </Typography>}
                        </IconButton>
                    }

                    <div>
                        {row.TrangThai !== 'Đã thanh toán' &&
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(row);
                                }}
                            >
                                <EditIcon />
                                {
                                    row.TrangThai === 'Đã hủy' &&
                                    <Typography variant="body2" sx={{ ml: 1, color: "#000" }}>
                                        Kích hoạt
                                    </Typography>
                                }

                                {
                                    row.TrangThai === 'Chưa thanh toán' &&
                                    <Typography variant="body2" sx={{ ml: 1, color: "#000" }}>
                                        Huỷ phiếu
                                    </Typography>
                                }

                            </IconButton>
                        }
                    </div>
                </div>
            )
        }
    ];

export default Phieucolumns;
