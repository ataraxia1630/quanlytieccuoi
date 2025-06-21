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
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
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
import toastService from '../../service/toast/toast.service';
import { hasPermission } from '../../utils/hasPermission';
import { useLocation } from 'react-router-dom';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterPayload, setFilterPayload] = useState(null);
  const [sort, setSort] = useState({ field: null, order: null });

  const permissions = localStorage.getItem('permissions');

  const [form, setForm] = useState({
    tuBan: '',
    denBan: '',
    sanh: '',
    tuNgay: '',
    denNgay: '',
    trangThai: '',
    ten: '',
  });
  const location = useLocation();
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDanhSach({ page: currentPage, limit: 30 });
      setData(result.data);
      setTotalItems(result.totalItems);
    } catch (error) {
      console.log(error)
      toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"

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
      toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"

      console.error('Lỗi lấy danh sách sảnh:', error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const payload = {
          page: currentPage,
          limit: 30,
          sortField: sort.field,
          sortOrder: sort.order,
        };


        let result;
        if (isFiltering && filterPayload) {
          result = await postDanhSach(
            { ...filterPayload, page: currentPage, limit: 30, sortField: sort.field, sortOrder: sort.order }
          );
        } else {
          result = await getDanhSach({
            page: currentPage,
            limit: 30,
            sortField: sort.field,
            sortOrder: sort.order,
          });
        }

        setData(result.data);
        setTotalItems(result.totalItems);
      } catch (error) {
        console.log(error)

        toastService.crud.error.generic();
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [currentPage, isFiltering, filterPayload, location.state, sort]);

  const handleSortChange = (field, order) => {
    setSort({ field, order });
    setCurrentPage(1); // về trang đầu khi sort
  };


  const handleFilter = () => {
    fetchSanh();
    setIsFilterOpen(!isFilterOpen);

  };

  const handleResetFilter = async () => {
    setCurrentPage(1);
    setForm({
      tuBan: '',
      denBan: '',
      sanh: '',
      tuNgay: '',
      denNgay: '',
      trangThai: '',
      ten: '',
    });

    setIsFiltering(false);
    setFilterPayload(null);
    setCurrentPage(1);
    setSearchText('');
    setErrors({});
    await fetchData();
    toastService.search.resetFilter();

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
      newErrors.tuBan = 'Số lượng bàn là số nguyên dương!';
    }
    if (isNaN(Number(denBan)) || Number(denBan) < 0) {
      newErrors.tuBan = 'Số lượng bàn là số nguyên dương!';
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
      toastService.validation.invalidData(); // 

      console.warn('Dữ liệu không hợp lệ:', newErrors);
      return;
    }

    try {
      const payload = {};
      if (tuBan != null && tuBan !== '') payload.tuBan = parseInt(tuBan);
      if (denBan != null && denBan !== '') payload.denBan = parseInt(denBan);

      if (form.sanh) payload.sanh = form.sanh;
      if (tuNgay) payload.tuNgay = dayjs(tuNgay).format("YYYY-MM-DD");
      if (denNgay) payload.denNgay = dayjs(denNgay).format("YYYY-MM-DD");

      if (form.trangThai !== '') payload.trangThai = form.trangThai;
      payload.ten = searchText.trim();

      setCurrentPage(1);
      setLoading(true);
      setIsFiltering(true);      // bật chế độ lọc
      setFilterPayload(payload);

      const result = await postDanhSach(payload, currentPage, 30);

      setData(result.data);
      setTotalItems(result.totalItems);
      toastService.search.appliedFilter(); // "Đã áp dụng bộ lọc"

    } catch (error) {
      toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"

      console.error('Lỗi lọc dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };///

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

      await PhieuDatTiecService.updatePhieuDatTiec(
        selectedPhieu.SoPhieuDatTiec,
        { TrangThai: newTrangThai }
      );

      setIsUpdateDialogOpen(false);
      await handleSubmit();
      toastService.crud.success.update('trạng thái'); // "Cập nhật trạng thái thành công!"


      setSelectedPhieu(null);
    } catch (error) {
      toastService.crud.error.update('trạng thái'); // "Cập nhật trạng thái thất bại!"

    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    if (data.length === 0) {
      toastService.file.noPrintData(); // "Không có dữ liệu để in!"
      return;
    }
    const res = printDanhSachTiec(data);
    if (!res.success) {
      toastService.file.printError('Connection timeout'); // "Lỗi khi in: Connection timeout"
    }
  };

  const handleExportExcel = async () => {
    if (data.length === 0) {
      toastService.file.noPrintData(); // "Không có dữ liệu để in!"
      return;
    }
    const res = await exportDanhSachTiecCuoiToExcel(data);
    if (!res.success) {
      toastService.file.exportError('File not found'); // "Lỗi khi xuất file: File not found"
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


  const computedDataWithIndex = data.map((item, idx) => ({
    ...item,
    indexGlobal: (currentPage - 1) * 30 + idx + 1,
  }));

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
          alignItems: 'flex-start',
          gap: 2,
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box
          sx={{ flex: 1, minWidth: 250, display: 'flex', alignItems: 'center' }}
        >
          <Searchbar
            placeholder="Tìm tên cô dâu, chú rể hoặc số phiếu đặt tiệc..."
            value={searchText}
            onChange={handleSearchTextChange}
            onSearch={handleSubmit}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
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
                  label="Ngày đãi tiệc"
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

            <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, marginTop: 20 }}
        >
              <FilterButton text="Reset" onClick={handleResetFilter} colorVariant="reset" />
              <FilterButton text="Apply" onClick={handleSubmit} />

            </Box>
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CustomTable
            columns={[
              { id: 'indexGlobal', label: 'STT', width: 50 },
              ...phieuData,
            ]}
            data={computedDataWithIndex}
            currentPage={currentPage}
            pageSize={30} onDelete={handleDelete} serverSideSort
            currentSort={sort}
            onSortChange={handleSortChange}
            disabledEdit={!hasPermission(permissions, 'wedding.edit')}
            disabledDelete={!hasPermission(permissions, 'wedding.delete')}
            disabledCreate={!hasPermission(permissions, 'bill.create')}
          />
          <Pagination
            page={currentPage}
            count={Math.ceil(totalItems / 30)}
            onChange={(e, page) => setCurrentPage(page)}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#063F5C',
                borderColor: '#063F5C',
                minWidth: '45px',
                height: '45px',
                borderRadius: '999px',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#063F5C',
                color: '#fff',
                borderColor: '#063F5C',
                '&:hover': {
                  backgroundColor: '#045172',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: '#045172',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#063F5C',
                  opacity: 1,
                },
              },
              marginTop: '50px',
            }}
          />
        </Box>

      )}
    </Box>
  );
}

export default DanhSachTiecCuoi;
