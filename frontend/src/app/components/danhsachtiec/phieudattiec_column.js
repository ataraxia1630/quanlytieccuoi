import { getHoaDon } from "../../service/hoadon.service";
import { IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { hasPermission } from '../../utils/hasPermission';

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
const permissions = localStorage.getItem('permissions');

const Phieucolumns = (navigate) =>

    [
        { id: "SoPhieuDatTiec", label: "Số phiếu", sortable: true },
        { id: "TenChuRe", label: "Tên chú rể", sortable: true },
        { id: "TenCoDau", label: "Tên cô dâu", sortable: true },
        {
            id: "TenSanh", label: "Sảnh", sortable: true,
            render: (row) => row?.Sanh?.TenSanh || "Không rõ"
        },
        { id: "SoLuongBan", label: "Số bàn", sortable: true, width: 100 },
        {
            id: "NgayDaiTiec",
            label: "Ngày đãi",
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
            id: "NgayDatTiec",
            label: "Ngày đặt",
            sortable: true,
            render: (row) => {
                const date = new Date(row.NgayDatTiec);
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

            render: (row, _onEdit, onDelete, disabledEdit, disabledDelete, disableCreate) => {
                const handleXemHoaDon = async (e) => {
                    const today = new Date();
                    const ngayDaiTiec = new Date(row.NgayDaiTiec);

                    if (ngayDaiTiec > today) {
                        toast.warning("Chưa tới ngày đãi tiệc, không thể tạo hoá đơn.");
                        return;
                    }
                    e.stopPropagation();
                    try {
                        const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
                        const stateData = {
                            soPhieuDatTiec: row.SoPhieuDatTiec,
                            chuRe: row.TenChuRe,
                            coDau: row.TenCoDau,
                            tienCoc: row.TienDatCoc,
                            ngayDaiTiec: row.NgayDaiTiec,
                            slBanToiDa: row.Sanh?.SoLuongBanToiDa || 255,
                        };

                        if (hoaDon) {
                            navigate('/DashBoard/HoaDon', {
                                state: {
                                    ...stateData,
                                    soHoaDon: hoaDon.SoHoaDon,
                                    data: hoaDon,
                                }
                            });
                        } else {
                            navigate('/DashBoard/HoaDon', {
                                state: {
                                    ...stateData,
                                    data: row,
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Lỗi xem/tạo hóa đơn:", error);
                    }
                };

                const isChuaThanhToan = row.TrangThai === 'Chưa thanh toán';
                const isDaHuy = row.TrangThai === 'Đã hủy';
                const isDaThanhToan = row.TrangThai === 'Đã thanh toán';

                return (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        {/* Tạo hoặc Xem hóa đơn */}
                        {
                            isDaThanhToan && <IconButton
                                className="action"
                                onClick={handleXemHoaDon}

                            >
                                <EyeIcon />
                                <Typography variant="body2" sx={{ ml: 1, color: "#000", marginLeft: "0px" }}>
                                    Xem hóa đơn
                                </Typography>
                            </IconButton>
                        }
                        {
                            !isDaHuy && isChuaThanhToan && <IconButton
                                className="action"
                                onClick={handleXemHoaDon}
                                disabled={!hasPermission(permissions, 'bill.create')}

                                sx={{
                                    opacity: disableCreate ? 0.5 : 1,
                                    cursor: disableCreate ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <EyeIcon />
                                <Typography variant="body2" sx={{ ml: 1, color: "#000", marginLeft: "0px" }}>
                                    Tạo hóa đơn
                                </Typography>
                            </IconButton>
                        }
                        {/* Huỷ hoặc kích hoạt phiếu */}
                        {
                            isDaHuy && <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(row);
                                }}
                                disabled={disabledEdit}

                                sx={{
                                    opacity: disabledEdit ? 0.5 : 1,
                                    cursor: disabledEdit ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <EditIcon />
                                <Typography variant="body2" sx={{ ml: 1, color: "#000" }}>
                                    Kích hoạt
                                </Typography>
                            </IconButton>
                        }

                        {
                            isChuaThanhToan && <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(row);
                                }}
                                disabled={disabledDelete}

                                sx={{
                                    opacity: disabledDelete ? 0.5 : 1,
                                    cursor: disabledDelete ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <EditIcon />
                                <Typography variant="body2" sx={{ ml: 1, color: "#000" }}>
                                    Huỷ phiếu
                                </Typography>
                            </IconButton>
                        }
                    </div>
                );
            }

        }
    ];

export default Phieucolumns;
