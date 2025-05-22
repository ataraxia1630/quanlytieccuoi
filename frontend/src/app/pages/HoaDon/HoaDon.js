import { useEffect, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, getHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import CustomTable from '../../components/Customtable';

function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec } = location.state || {};

  const isViewMode = Boolean(soHoaDon);
  const isWriteMode = Boolean(soPhieuDatTiec && initData);

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
        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '100px'}}>Chú rể:</p>
        <span className={styles.hoadonName}>{chuRe}</span>

        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Cô dâu:</p>
        <span className={styles.hoadonName}>{coDau}</span>

        <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Ngày đãi tiệc: </p>
        <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

          <p  className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px'}}>Ngày thanh toán: </p>
          {isViewMode ? <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span>  : <span></span>}
        
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
      <div style={{ maxHeight:'390px', overflow:'auto'}}>
        <CustomTable
          data={form.dsDichVu}
          columns={columns}
        />
      </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
          <p className={styles.hoadonText} style={{ marginTop:'50px' }}>Tổng tiền dịch vụ: {isViewMode ? form.TongTienDichVu : '__'}</p>
          <p className={styles.hoadonText}>Tổng tiền hoá đơn: {isViewMode ? form.TongTienHoaDon : '__'}</p>
          <p className={styles.hoadonText}>Tiền đặt cọc: {tienCoc}</p>
          <p className={styles.hoadonText}>Tiền phạt: {isViewMode ? form.TongTienPhat : '__'}</p>
          <p className={styles.hoadonText}>Còn lại: {isViewMode ? form.TienConLai : '__'}</p>
      </div>
      </div>
    </div>
  );
}

export default HoaDon;
