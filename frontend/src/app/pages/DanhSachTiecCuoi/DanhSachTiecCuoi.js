import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './DanhSachTiecCuoi.css';
import CustomTable from '../../components/Customtable';
import Searchbar from '../../components/Searchbar';
import Dropdown from '../../components/Dropdown';
import Rangeinput from '../../components/Rangeinput';
import StatusRadio from '../../components/Statusradio';
import FilterButton from '../../components/Filterbutton';
import { getDanhSach, postDanhSach } from '../../service/danhsachtiec.service';
import sanhService from '../../service/sanh.service';
import DateRangePicker from '../../components/danhsachtiec/daterange';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import PhieuDatTiecService from '../../service/phieudattiec.service';
import Phieucolumns from '../../components/danhsachtiec/phieudattiec_column';
import { useNavigate } from 'react-router-dom';
import useValidation from '../../validation/validation';
import EditDialog from '../../components/danhsachtiec/editDialog';
import dayjs from 'dayjs';
import ActionDropdown from '../../components/Printandexport';
import printDanhSachTiec from '../../components/danhsachtiec/dstiec_print_data';
import exportDanhSachTiecCuoiToExcel from '../../components/danhsachtiec/dstiec_export_excel';
import { getHoaDon } from '../../service/hoadon.service';

function DanhSachTiecCuoi() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sanh, setSanh] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    tuBan: '',
    denBan: '',
    sanh: '',
    tuNgay: '',
    denNgay: '',
    trangThai: '',
    ten: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDanhSach()
      setData(result);
    } catch (error) {
      console.error('Lỗi lấy danh sách:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSanh = async () => {
    try {
      const dsSanh = await sanhService.getAllSanh();
      const sanhList = dsSanh
        .filter((item) => item.TenSanh)
        .map((item) => item.TenSanh);
      setSanh(sanhList);
    } catch (error) {
      console.error('Lỗi lấy danh sách sảnh:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleFilter = () => {
    fetchSanh();
    setIsFilterOpen(!isFilterOpen);

  };

  const handleResetFilter = async () => {
    setForm({
      tuBan: '',
      denBan: '',
      sanh: '',
      tuNgay: '',
      denNgay: '',
      trangThai: '',
      ten: '',
    });
    setSearchText('');
    setErrors({});
    await fetchData();
  };

  const handleDelete = (phieu) => {
    setSelectedPhieu(phieu);
    setIsUpdateDialogOpen(true);
  };

  const handleSubmit = async () => {
    const { tuBan, denBan, tuNgay, denNgay } = form;

    const newErrors = {};

    // Validate và ghi lỗi vào biến tạm
    if (isNaN(Number(tuBan)) || Number(tuBan) < 0) {
      newErrors.tuBan = 'Nhập số nguyên dương!';
    }

    if (isNaN(Number(denBan)) || Number(denBan) < 0) {
      newErrors.tuBan = 'Nhập số nguyên dương!';
    }
    if (Number(tuBan) > Number(denBan) && denBan !== '') {
      newErrors.denBan = "'Từ bàn' phải nhỏ hơn hoặc bằng 'Đến bàn'!";
    }
    if (dayjs(tuNgay).isAfter(dayjs(denNgay))) {
      newErrors.denNgay = "'Từ ngày' phải nhỏ hơn hoặc bằng 'Đến ngày'!";
    }

    // Cập nhật state lỗi
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      console.warn('Dữ liệu không hợp lệ:', newErrors);
      return;
    }

    // Gửi dữ liệu nếu không có lỗi
    setLoading(true);
    try {
      const payload = {};
      if (tuBan != null && tuBan !== '') payload.tuBan = parseInt(tuBan);
if (denBan != null && denBan !== '') payload.denBan = parseInt(denBan);

      if (form.sanh) payload.sanh = form.sanh;
      if (tuNgay) payload.tuNgay = dayjs(tuNgay).format("YYYY-MM-DD");
      if (denNgay) payload.denNgay = dayjs(denNgay).format("YYYY-MM-DD");

      if (form.trangThai !== '') payload.trangThai = form.trangThai;
      payload.ten = searchText.trim();
      const result = await postDanhSach(payload);
      setData(result);
    } catch (error) {
      console.error('Lỗi lọc dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedPhieu(null);
  };
  const acceptDelete = async () => {
    try {
      setLoading(true);
      let newTrangThai = selectedPhieu.TrangThai;
      if (newTrangThai === 'Đã hủy') {
        newTrangThai = 'Chưa thanh toán';
      } else if (newTrangThai === 'Chưa thanh toán') {
        newTrangThai = 'Đã hủy';
      }

      const result = await PhieuDatTiecService.updatePhieuDatTiec(
        selectedPhieu.SoPhieuDatTiec,
        { TrangThai: newTrangThai }
      );

      setIsUpdateDialogOpen(false);
      await handleSubmit();

      const toastByStatus = {
        'soft-deleted': toast.info,
        'already-soft-deleted': toast.warning,
        deleted: toast.success,
      };

      (toastByStatus[result.status] || toast.success)(result.message);

      setSelectedPhieu(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    const res = printDanhSachTiec(data);
    if (!res.success) {
      //showToast('error', `Lỗi khi in: ${res.message}`, 'print-error');
    }
  };

  const handleExportExcel = async () => {
    const res = await exportDanhSachTiecCuoiToExcel(data);
    if (!res.success) {
      //showToast('error', `Lỗi khi xuất file: ${res.message}`, 'excel-error');
    }
  };
  const handleSearchTextChange = useCallback((val) => {
  setSearchText(val);
}, []);

  const options = [
    { label: 'Tất cả', value: '' },
    { label: 'Đã hủy', value: 'Đã hủy' },
    { label: 'Đã thanh toán', value: 'Đã thanh toán' },
    { label: 'Chưa thanh toán', value: 'Chưa thanh toán' },
  ];

  const options1 = sanh.map((MaSanh) => ({ label: MaSanh, value: MaSanh }));
  const phieuData = useMemo(() => Phieucolumns(navigate), [navigate]);

const columns = useMemo(() => Phieucolumns(), []);

const handleViewHoaDon = async (row) => {
    try {
      const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
      navigate("/DashBoard/HoaDon", {
        state: {
          ...(hoaDon ? { soHoaDon: hoaDon.SoHoaDon, data: hoaDon } : { data: row }),
          soPhieuDatTiec: row.SoPhieuDatTiec,
          chuRe: row.TenChuRe,
          coDau: row.TenCoDau,
          tienCoc: row.TienDatCoc,
          ngayDaiTiec: row.NgayDaiTiec
        }
      });
    } catch (err) {
      console.error("Lỗi khi xem hóa đơn:", err);
    }
  };

  const dataWithHandlers = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        onViewHoaDon: handleViewHoaDon,
        onDeletePhieu: handleDelete,
      })),
    [data]
  );

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách tiệc cưới
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          mb: 3,
        }}
      >
        <Searchbar
          placeholder="Tìm tên cô dâu, chú rể hoặc số phiếu đặt tiệc..."
          value={searchText}
          onChange={handleSearchTextChange}
          onSearch={handleSubmit}
        />
        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <ActionDropdown
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </Box>
      </Box>
      {isFilterOpen && (
        <div className="box">
          <div className="content">
            <div className="sanh-box">
              <Dropdown
                className="sanh"
                label="Sảnh"
                value={form.sanh}
                onChange={(value) => setForm({ ...form, sanh: value })}
                width={150}
                options={options1}
              />
            </div>

            <div className="ban-box">
              <div className="ban-box">
                <Rangeinput
                  label="Số lượng bàn"
                  width={56}
                  fromValue={form.tuBan}
                  toValue={form.denBan}
                  onFromChange={(v) => setForm({ ...form, tuBan: v })}
                  onToChange={(v) => setForm({ ...form, denBan: v })}
                />
                {errors.tuBan && <div className="error">{errors.tuBan}</div>}
                {errors.denBan && <div className="error">{errors.denBan}</div>}
              </div>
            </div>

            <div className="ngay-box">
              <div className="ngay-box">
                <DateRangePicker
                  label="Ngày"
                  fromDate={form.tuNgay}
                  toDate={form.denNgay}
                  onFromChange={(v) => setForm({ ...form, tuNgay: v })}
                  onToChange={(v) => setForm({ ...form, denNgay: v })}
                />
                {errors.tuNgay && <div className="error">{errors.tuNgay}</div>}
                {errors.denNgay && (
                  <div className="error">{errors.denNgay}</div>
                )}
              </div>
            </div>

            <StatusRadio
              label="Tình trạng"
              value={form.trangThai}
              onChange={(val) => setForm({ ...form, trangThai: val })}
              options={options}
            />
            <div className="apply">
              <FilterButton text="Apply" onClick={handleSubmit} />
              <FilterButton text="Reset" onClick={handleResetFilter} />
            </div>
          </div>
        </div>
      )}

      <EditDialog
        open={isUpdateDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title="Xác nhận thay đổi trạng thái phiếu đặt tiệc"
        content={`Bạn có chắc chắn muốn thay đổi trạng thái phiếu đặt tiệc này?`}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
        <CustomTable data={data} columns={phieuData} onDelete={handleDelete} />
      )}
    </Box>
  );
}

export default DanhSachTiecCuoi;
