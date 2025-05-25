import { useEffect, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, getHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import CustomTable from '../../components/Customtable';
import ActionButtons from '../../components/Actionbuttons';
import {
  createCTDichVu,
  updateCTDichVu,
  deleteCTDichVu
} from '../../service/ct_dichvu.service';


function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec } = location.state || {};

  const isViewMode = Boolean(soHoaDon);
  const isWriteMode = Boolean(soPhieuDatTiec && initData);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("add");

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
    dsDichVu: ''
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
    setForm(prev => ({
      ...prev,
      dsDichVu: [...prev.dsDichVu, res]
    }));
    setOpenDialog(false);
  } catch (err) {
    console.error("Thêm dịch vụ thất bại", err);
  }
};


  const handleEdit = () => {
    // Gọi hàm khi người dùng nhấn nút chỉnh sửa trong bảng
    console.log("Edit row");
    setOpenDialog(true);
    setMode("edit");
  };
  const handleDelete = () => {
    // Gọi hàm khi người dùng nhấn nút xóa trong bảng
    console.log("Delete row");
  };

  

  const columns = [
    { id: "index", label: "STT", width: 10 },
    { id: "DichVu.TenDichVu", label: "Dịch vụ", width: 150 },
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
      if (isViewMode) {
        try {
          const result = await getHoaDon(soHoaDon);
          const hoadon = result[0];
          if (hoadon) {
            setForm(hoadon);
          }
        } catch (err) {
          console.error("Không thể lấy dữ liệu hóa đơn", err);
        }
      } else if (isWriteMode) {
        const newForm = {
          ...form,
          SoPhieuDatTiec: initData.SoPhieuDatTiec || '',
          SoHoaDon: initData.SoPhieuDatTiec || '',
          SoLuongBanDaDung: initData.SoLuongBan,
          NgayThanhToan: new Date().toISOString()
        };
        setForm(newForm);
        try {
          const kq = await createHoaDon(soHoaDon, newForm);
          if (kq) setForm(kq);
        } catch (er) {
          console.error(er);
        }
      }
      setLoading(false);
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
        <div style={{ flex: 1 }}> 
        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '100px'}}>Chú rể:</p>
        <span className={styles.hoadonName}>{chuRe}</span>

        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Cô dâu:</p>
        <span className={styles.hoadonName}>{coDau}</span>

        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Ngày đãi tiệc: </p>
        <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

          <p  className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Ngày thanh toán: </p>
          {isViewMode ? <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span>  : <span></span>}
        
        </div>
      <div style={{ marginTop: 'auto' }}>
          <p className={styles.hoadonText} style={{ marginTop:'50px' }}>Tổng tiền dịch vụ: {isViewMode ? form.TongTienDichVu : '__'}</p>
          <p className={styles.hoadonText}>Tổng tiền hoá đơn: {isViewMode ? form.TongTienHoaDon : '__'}</p>
          <p className={styles.hoadonText}>Tiền đặt cọc: {tienCoc}</p>
          <p className={styles.hoadonText}>Tiền phạt: {isViewMode ? form.TongTienPhat : '__'}</p>
          <p className={styles.hoadonText}>Còn lại: {isViewMode ? form.TienConLai : '__'}</p>
      </div>
      </div>

      <div className={styles.hoadonRight}>
        <div style={{ flex: 1, overflow:'auto' }}>
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

          <div className={styles.hoadonText}>
            <p>Đơn giá bàn: </p>
            {isViewMode ? form.DonGiaBan : (
              <TextField
                name="DonGiaBan"
                type="number"
                value={form.DonGiaBan}
                onChange={handleChange}
                variant="filled"
                sx={{ width: 100 }}
              />
            )}
          </div>

          <p className={styles.hoadonText}>Tổng tiền bàn: {isViewMode ? form.TongTienMonAn : '__'}</p>
          
        </div>
      <div style={{ maxHeight:'400px', overflow:'auto', border: '1px solid rgba(224, 224, 224, 1)'}}>
        <CustomTable
          data={form.dsDichVu}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
         
        />
      </div>
      
      
      {form.dsMonAn.length > 0 ? (
      <div style={{ maxHeight:'195px', overflow:'auto', border: '1px solid rgba(224, 224, 224, 1)', marginTop:'30px'}}>
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
