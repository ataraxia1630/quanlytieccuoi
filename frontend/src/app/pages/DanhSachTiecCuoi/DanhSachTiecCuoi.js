import React, { useEffect, useState } from 'react';
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
import { Box, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import DeleteDialog from '../../components/Deletedialog';
import PhieuDatTiecService from '../../service/phieudattiec.service';
import Phieucolumns from '../../components/danhsachtiec/phieudattiec_column';
import { useNavigate } from 'react-router-dom';
import useValidation from '../../validation/validation';
function DanhSachTiecCuoi() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sanh, setSanh] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPhieu, setSelectedPhieu] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    tuBan: "",
    denBan: "",
    sanh: "",
    tuNgay: "",
    denNgay: "",
    trangThai: "",
    ten: ""
  });
  const { validateNumberField, validateTimeField } = useValidation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [result, dsSanh] = await Promise.all([
        getDanhSach(),
        sanhService.getAllSanh()
      ]);

      const sanhList = dsSanh
        .filter(item => item.TenSanh)
        .map(item => item.TenSanh);
      setSanh(sanhList);

      setData(result);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (!searchText.trim()) {
        await fetchData();
        return;
      }
      const result = await postDanhSach({ ten: searchText.trim() });
      setData(result);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleResetFilter = async () => {
    setForm({
      tuBan: "",
      denBan: "",
      sanh: "",
      tuNgay: "",
      denNgay: "",
      trangThai: "",
      ten: ""
    });
    setSearchText('');
    setErrors({});
  };

  const handleDelete = (phieu) => {
    setSelectedPhieu(phieu);
    setIsDeleteDialogOpen(true);
    console.log("da vao xoa phieu")
  };

  const handleSubmit = async () => {
    const { tuBan, denBan, tuNgay, denNgay } = form;

    const newErrors = {};

    // Validate và ghi lỗi vào biến tạm
    if (isNaN(Number(tuBan)) || Number(tuBan) < 0) {
      newErrors.tuBan = "Nhập số nguyên dương!";
    }

    if (isNaN(Number(denBan)) || Number(denBan) < 0) {
      newErrors.tuBan = "Nhập số nguyên dương!";
    }

    const tuNgayDate = tuNgay ? new Date(tuNgay) : null;
    const denNgayDate = denNgay ? new Date(denNgay) : null;

    if (tuNgayDate && (isNaN(tuNgayDate) || tuNgayDate.getHours() > 23)) {
      newErrors.tuNgay = "Giờ phải trong khoảng 00:00:00 - 23:59:59";
    }

    if (denNgayDate && (isNaN(denNgayDate) || denNgayDate.getHours() > 23)) {
      newErrors.denNgay = "Giờ phải trong khoảng 00:00:00 - 23:59:59";
    }

    // Cập nhật state lỗi
    setErrors(newErrors);

    // Kiểm tra lỗi
    if (Object.values(newErrors).some((error) => error)) {
      console.warn("Dữ liệu không hợp lệ:", newErrors);
      return;
    }

    // Gửi dữ liệu nếu không có lỗi
    setLoading(true);
    try {
      const payload = {};
      if (tuBan) payload.tuBan = parseInt(tuBan);
      if (denBan) payload.denBan = parseInt(denBan);
      if (form.sanh) payload.sanh = form.sanh;
      if (tuNgay) payload.tuNgay = new Date(tuNgay).toISOString();
      if (denNgay) payload.denNgay = new Date(denNgay).toISOString();
      if (form.trangThai !== "") payload.trangThai = form.trangThai === "true";

      const result = await postDanhSach(payload);
      setData(result);
    } catch (error) {
      console.error("Lỗi lọc dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPhieu(null);
  };
  const acceptDelete = async () => {
    try {
      setLoading(true);
      const result = await PhieuDatTiecService.deletePhieuDatTiec(selectedPhieu.SoPhieuDatTiec);
      setIsDeleteDialogOpen(false);
      setData(prev => prev.filter(p => p.SoPhieuDatTiec !== selectedPhieu.SoPhieuDatTiec));

      const toastByStatus = {
        "soft-deleted": toast.info,
        "already-soft-deleted": toast.warning,
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
  const options = [
    { label: "Tất cả", value: "" },
    { label: "Đã huỷ", value: "false" },
    { label: "Bình thường", value: "true" },
  ];

  const options1 = sanh.map(MaSanh => ({ label: MaSanh, value: MaSanh }));
  const phieuData = Phieucolumns(navigate)

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#063F5C", mb: 4 }}
      >
        Danh sách tiệc cưới
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          mb: 3,
        }}
      >
        <Searchbar
          placeholder='Tìm tên cô dâu hoặc chú rể...'
          value={searchText}
          onChange={setSearchText}
          onSearch={handleSearch}
        />
        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          <FilterButton onClick={handleFilter} text="Filter" />
        </Box>
      </Box>
      {isFilterOpen &&
        <div className='box'>
          <div className='content'>
            <div className='sanh-box'>
              <Dropdown
                className="sanh"
                label="Sảnh"
                value={form.sanh}
                onChange={(value) => setForm({ ...form, sanh: value })}
                width={150}
                options={options1}
              />



            </div>

            <div className='ban-box'>
              <div className='ban-box'>
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

            <div className='ngay-box'>
              <div className='ngay-box'>
              <DateRangePicker
                label="Ngày"
                fromDate={form.tuNgay}
                toDate={form.denNgay}
                onFromChange={(v) => setForm({ ...form, tuNgay: v })}
                onToChange={(v) => setForm({ ...form, denNgay: v })}
              />
              {errors.tuNgay && <div className="error">{errors.tuNgay}</div>}
              {errors.denNgay && <div className="error">{errors.denNgay}</div>}
            </div>

            </div>

            <StatusRadio
              label="Tình trạng"
              value={form.trangThai}
              onChange={(val) => setForm({ ...form, trangThai: val })}
              options={options}
            />
            <div className="apply" >
              <FilterButton text='Apply' onClick={handleSubmit} />
              <FilterButton text='Reset' onClick={handleResetFilter} />
            </div>


          </div>
        </div>
      }
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title="Xác nhận xóa phiếu đặt tiệc"
        content={`Bạn có chắc chắn muốn xoá phiếu đặt tiệc này?`}
      />
      {
        loading ? (
          <p style={{ padding: 24 }}>Đang tải dữ liệu...</p>
        ) : (
          <CustomTable
            data={data}
            columns={phieuData}
            onDelete={handleDelete}
          />

        )
      }
    </Box>
  );
}

export default DanhSachTiecCuoi;
