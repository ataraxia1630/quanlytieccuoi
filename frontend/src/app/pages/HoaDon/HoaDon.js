import { useEffect, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, getHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { MenuItem, Select, TextField } from '@mui/material';
import CustomTable from '../../components/Customtable';
import ActionButtons from '../../components/Actionbuttons';
import {
  getAllCTDichVuByPDTId,
  createCTDichVu,
  updateCTDichVu,
  deleteCTDichVu
} from '../../service/ct_dichvu.service';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';


function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec } = location.state || {};

  const isViewMode = Boolean(soHoaDon);
  const isWriteMode = Boolean(soPhieuDatTiec && initData);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("add");

  const [dvForm, setDvForm] = useState({
    MaDichVu: '',
    TenDichVu: '',
    SoLuong: 1,
    DonGia: 0
  });

  const [form, setForm] = useState({
    SoPhieuDatTiec: '',
    SoHoaDon: '',
    NgayThanhToan: '',
    DonGiaBan: '',
    SoLuongBanDaDung: '',
    TongTienDichVu: '',
    TongTienMonAn: '',
    TongTienHoaDon: '',
    TongTienPhat: '',
    TienConLai: '',
    dsDichVu: [],
    dsMonAn: []
  });
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAdd = async (newData) => {
    try {
      const res = await createCTDichVu({ ...newData, SoPhieuDatTiec: soPhieuDatTiec });
      setForm((prev) => ({
        ...prev,
        dsDichVu: [...prev.dsDichVu, res]
      }));
      setOpenDialog(false);
    } catch (err) {
      console.error("Thêm dịch vụ thất bại", err);
    }
  };

  const handleEdit = async (updatedRow) => {
    try {
      const { MaDichVu, SoPhieuDatTiec } = updatedRow;
      const res = await updateCTDichVu(MaDichVu, SoPhieuDatTiec, updatedRow);
      setForm((prev) => ({
        ...prev,
        dsDichVu: prev.dsDichVu.map((dv) =>
          dv.MaDichVu === MaDichVu && dv.SoPhieuDatTiec === SoPhieuDatTiec ? res : dv
        ),
      }));
      setOpenDialog(false);
    } catch (err) {
      console.error("Cập nhật dịch vụ thất bại", err);
    }
  };

  const handleDelete = async (row) => {
    try {
      await deleteCTDichVu(row.MaDichVu, row.SoPhieuDatTiec);
      setForm((prev) => ({
        ...prev,
        dsDichVu: prev.dsDichVu.filter(
          (dv) =>
            !(dv.MaDichVu === row.MaDichVu && dv.SoPhieuDatTiec === row.SoPhieuDatTiec)
        ),
      }));
    } catch (err) {
      console.error("Xoá dịch vụ thất bại", err);
    }
  };

  const handleOpenAdd = () => {
    setMode("add");
    setDvForm({
      MaDichVu: '',
      DichVu: {
        TenDichVu: ''
      },
      SoLuong: 1,
      DonGia: 0
    });

    setOpenDialog(true);
  };

  const handleOpenEdit = (row) => {
    setMode("edit");
    setDvForm(row);
    setOpenDialog(true);
  };


  const columns = [
    { id: "index", label: "STT", width: 10 },
    {
      id: "TenDichVu",
      label: "Dịch vụ",
      width: 150,
      render: (row) => row?.DichVu?.TenDichVu || "Không rõ", width: 150
    },
    { id: "SoLuong", label: "Số lượng", width: 30 },
    { id: "DonGia", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGia && row.SoLuong ? row.DonGia * row.SoLuong : null
    },
    {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
  const columns2 = [
    { id: "index2", label: "STT", width: 10 },
    { id: "MonAn.TenMonAn", label: "Mon an", width: 150 },
    { id: "SLMonAn", label: "Số lượng", width: 30 },
    { id: "DonGiaMonAn", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTienMonAn",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGiaMonAn && row.SLMonAn ? row.DonGiaMonAn * row.SLMonAn : null
    },
    {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Lấy toàn bộ danh sách chi tiết dịch vụ trong phiếu
        const dsChiTietDichVu = await getAllCTDichVuByPDTId(soPhieuDatTiec);
        console.log('✅ Danh sách chi tiết dịch vụ:', dsChiTietDichVu);
        setForm({
          ...form,
          // dsMonAn: dsChiTietDichVu.dsMonAn || [],
          dsDichVu: dsChiTietDichVu || []
        });
        if (isViewMode) {
          console.log('vao read');
          setForm({
            ...initData,
            dsDichVu: dsChiTietDichVu || []  // Gộp vào
          });

        } else if (isWriteMode) {
          console.log('vao create');
          const randomNum = Math.floor(100000 + Math.random() * 900000);

          const newForm = {
            ...form,
            SoPhieuDatTiec: initData.SoPhieuDatTiec || '',
            SoHoaDon: `HD${randomNum}`,
            SoLuongBanDaDung: initData.SoLuongBan,
            NgayThanhToan: new Date().toISOString(),
            dsDichVu: dsChiTietDichVu || []  // Gán danh sách dịch vụ lấy được vào form luôn
          };
          setForm(newForm);

          try {
            const kq = await createHoaDon(soHoaDon, newForm);
            if (kq) {
              console.log('Tạo hóa đơn thành công');

            } else {
              console.log('Tạo hóa đơn không thành công');
            }
          } catch (er) {
            console.error('Lỗi khi tạo hóa đơn:', er);
          }
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [soHoaDon, soPhieuDatTiec]);


  function formatDate(date) {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  if (loading) return <p>Đang tải dữ liệu hóa đơn...</p>;

  return (
    <div className={styles.hoadonBox}>

      <div className={`${styles.hoadonLeft} ${styles.dashedBorder}`}>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{mode === 'add' ? 'Thêm Dịch Vụ' : 'Chỉnh Sửa Dịch Vụ'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Tên dịch vụ"
              fullWidth
              value={dvForm.DichVu?.TenDichVu || ''}
              onChange={(e) =>
                setDvForm({
                  ...dvForm,
                  DichVu: { ...dvForm.DichVu, TenDichVu: e.target.value }
                })
              }
            />

            <TextField
              margin="dense"
              label="Số lượng"
              type="number"
              fullWidth
              value={dvForm.SoLuong}
              onChange={(e) => setDvForm({ ...dvForm, SoLuong: parseInt(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="Đơn giá"
              type="number"
              fullWidth
              value={dvForm.DonGia}
              onChange={(e) => setDvForm({ ...dvForm, DonGia: parseInt(e.target.value) })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
            <Button
              onClick={() => {
                if (mode === 'add') handleAdd(dvForm);
                else handleEdit(dvForm);
              }}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>


        {/* <MuiModal open={openModal}>
  <Select value={selectedMon} onChange={handleChange}>
    {listMonAn.map(mon => (
      <MenuItem value={mon.id}>{mon.tenMon} - {mon.gia}đ</MenuItem>
    ))}
  </Select>
</MuiModal> */}

        <div style={{ flex: 1 }}>
          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '100px' }}>Chú rể:</p>
          <span className={styles.hoadonName}>{chuRe}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Cô dâu:</p>
          <span className={styles.hoadonName}>{coDau}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Ngày đãi tiệc: </p>
          <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Ngày thanh toán: </p>
          {isViewMode ? <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span> : <span></span>}

        </div>
        {isViewMode ?
          <div style={{ marginTop: 'auto' }}>
            <p className={styles.hoadonText} style={{ marginTop: '50px' }}>Tổng tiền dịch vụ: {isViewMode ? form.TongTienDichVu : '__'}</p>
            <p className={styles.hoadonText}>Tổng tiền hoá đơn: {isViewMode ? form.TongTienHoaDon : '__'}</p>
            <p className={styles.hoadonText}>Tiền đặt cọc: {tienCoc}</p>
            <p className={styles.hoadonText}>Tiền phạt: {isViewMode ? form.TongTienPhat : '__'}</p>
            <p className={styles.hoadonText}>Còn lại: {isViewMode ? form.TienConLai : '__'}</p>
          </div> : null}
      </div>

      <div className={styles.hoadonRight}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <p className={styles.ctHoadon}>CHI TIẾT HOÁ ĐƠN</p>



          <div className={styles.row}>
            <div className={styles.hoadonText}>
              <p>Số lượng bàn: </p>
              {isViewMode ? form.SoLuongBanDaDung : (
                <TextField
                  name="SoLuongBanDaDung"
                  type="number"
                  value={form.SoLuongBanDaDung}
                  onChange={handleChange}
                  variant="filled"
                  sx={{ width: 80 }}
                />
              )}
            </div>

            {isViewMode ?
              <div className={styles.hoadonText}>
                <p>Đơn giá bàn: {form.DonGiaBan}</p>
              </div> : null}

            {isViewMode ?
              <div className={styles.hoadonText}>
                <p>Tổng tiền bàn: {form.TongTienMonAn}</p>
              </div> : null}

          </div>
          {console.log('form la: ')}
          {console.log(form.dsDichVu)}
          {Array.isArray(form.dsDichVu) && form.dsDichVu.length > 0 ? (
            <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid rgba(224, 224, 224, 1)' }}>
              <CustomTable
                data={form.dsDichVu}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}

              />
            </div>
          ) : (
            <p>Không có dữ liệu dich vu.</p>
          )}

          {form.dsMonAn.length > 0 ? (
            <div style={{ maxHeight: '195px', overflow: 'auto', border: '1px solid rgba(224, 224, 224, 1)', marginTop: '30px' }}>
              <CustomTable
                data={form.dsMonAn}
                columns={columns2}
                onEdit={handleEdit}
                onDelete={handleDelete}

              />
            </div>
          ) : (
            <p>Không có dữ liệu món ăn.</p>
          )}


        </div>

      </div>
    </div>
  );
}

export default HoaDon;
