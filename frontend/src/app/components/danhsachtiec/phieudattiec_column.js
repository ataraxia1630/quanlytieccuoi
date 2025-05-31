import { getHoaDon } from "../../service/hoadon.service";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DeleteIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3 6H5H21"
            stroke="#063F5C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
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

const Phieucolumns = (navigate ) =>

    [
        { id: "index", label: "STT", width: 30 },
        { id: "TenChuRe", label: "Tên chú rể", sortable: true },
        { id: "TenCoDau", label: "Tên cô dâu", sortable: true },
        {
            id: "TenSanh", label: "Sảnh",
            render: (row) => row?.Sanh?.TenSanh || "Không rõ"
        },
        { id: "SoLuongBan", label: "Số lượng bàn", sortable: true, width: 150 },
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
            id: "gio", label: "Giờ", sortable: true,
            render: (row) => {
                const date = new Date(row.NgayDaiTiec);
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            }
        },
        {
            id: "actions", label: "Thao tác", width: 200,
            render: (row, _onEdit, onDelete) => (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
                    {
                        row.TrangThai === true &&
                        <IconButton
                            className='action'
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
                                    console.log("Hóa đơn:", hoaDon);
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
                            <Typography variant="body2" sx={{ color: "#000" }}>
                                Xem hóa đơn
                            </Typography>

                        </IconButton>
                    }

                    <div>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(row);
                            }}
                        >
                            <DeleteIcon />
                            <Typography variant="body2" sx={{ ml: 1, color: "#000" }}>
                                Xoá
                            </Typography>
                        </IconButton>
                    </div>
                </div>
            )
        }
    ];

export default Phieucolumns;
