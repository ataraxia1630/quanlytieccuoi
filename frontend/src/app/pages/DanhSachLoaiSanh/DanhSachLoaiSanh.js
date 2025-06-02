import { useState, useEffect } from 'react';
import './DanhSachLoaiSanh.css';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import CustomTable from '../../components/Customtable';
import HallTypeFilterPanel from '../../components/loaisanh/loaisanh_filter_panel';
import EditHallTypePopUp from '../../components/loaisanh/loaisanh_edit_popup';
import HallTypeColumns from '../../components/loaisanh/loaisanh_column';
import DeleteDialog from '../../components/Deletedialog';

import LoaiSanhService from '../../service/loaisanh.service';

export default function DanhSachLoaiSanh() {
  //#region declaration
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [hallTypeData, setHallTypeData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000000,
  });
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await LoaiSanhService.getAll(
        searchTerm,
        filters.priceMin,
        filters.priceMax
      );
      console.log(result.data);
      setHallTypeData(result.data || []);
    } catch (error) {
      console.log('Error fetching sanhs:', error.message);
      toast.error(
        `Lỗi: ${error.message || 'Không thể tải danh sách loại sảnh!'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, searchTerm]);
  //#endregion

  //#region func handler
  const handleSearch = () => {
    // toast.info(`Đang tìm kiếm: ${searchTerm}`);
    fetchData();
  };

  const handleOpenHideFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    toast.success('Đã áp dụng bộ lọc');
  };

  const handleResetFilter = () => {
    setFilters({ priceMin: 0, priceMax: 10000000 });
    setSearchTerm('');
    toast.success('Đã reset bộ lọc');
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toast.success('Bắt đầu thêm loại sảnh mới');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toast.info(`Đang chỉnh sửa loại sảnh: ${row.TenLoaiSanh}`);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRow(false);
    mode === 'edit'
      ? toast.info('Đã đóng cửa sổ chỉnh sửa')
      : toast.info('Đã đóng cửa sổ thêm mới');
  };

  const handleDelete = async (row) => {
    setIsDeleteDialogOpen(true);
    setSelectedRow(row);
    toast.warn(`Bạn sắp xóa loại sảnh: ${row.TenLoaiSanh}`);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toast.info('Đã hủy xóa loại sảnh');
  };

  const handleSaveHallType = async (data) => {
    try {
      const loaisanhData = {
        TenLoaiSanh: data.name,
        DonGiaBanToiThieu: Number(data.price),
      };
      console.log(loaisanhData);
      toast.info('Đang xử lý yêu cầu ...');

      if (mode === 'edit' && selectedRow) {
        await LoaiSanhService.update(selectedRow.MaLoaiSanh, loaisanhData);
        toast.success(
          `Cập nhật loại sảnh "${loaisanhData.TenLoaiSanh}" thành công!`
        );
      } else {
        await LoaiSanhService.createNew(loaisanhData);
        toast.success(
          `Thêm loại sảnh "${loaisanhData.TenLoaiSanh}" thành công!`
        );
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể lưu loại sảnh!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      await LoaiSanhService.delete(selectedRow.MaLoaiSanh);
      toast.success(
        `Đã xóa loại sảnh "${selectedRow.TenLoaiSanh}" thành công!`
      );
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(
        `Xóa thất bại: ${error.message || 'Không thể xóa loại sảnh!'}`
      );
    }
  };

  //#endregion

  //#region ui
  return (
    <Box sx={{ px: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách loại sảnh
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
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Tìm tên hoặc mã loại sảnh ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <FilterButton onClick={handleOpenHideFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <HallTypeFilterPanel
        isOpen={isFilterOpen}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        filters={filters}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CustomTable
          data={hallTypeData}
          columns={HallTypeColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditHallTypePopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveHallType}
        title={mode === 'edit' ? 'Chỉnh sửa loại sảnh' : 'Thêm loại sảnh'}
        editData={selectedRow}
        mode={mode}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title={'Xác nhận xóa'}
      />
    </Box>
  );
  //#endregion
}
