import { useState, useEffect } from 'react';
import './DanhSachMonAn.css';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import CustomTable from '../../components/Customtable';
import DishFilterPanel from '../../components/monan/monan_filter_panel';
import EditDishPopUp from '../../components/monan/monan_edit_popup';
import DishColumns from '../../components/monan/monan_column';
import DeleteDialog from '../../components/Deletedialog';

import MonAnService from '../../service/monan.service';

export default function DanhSachMonAn() {
  //#region declaration
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [dishData, setDishData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    priceMin: '',
    priceMax: '',
  });
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await MonAnService.getAll(
        filters.status,
        searchTerm,
        filters.priceMin,
        filters.priceMax
      );
      console.log(result.data);
      setDishData(result.data || []);
    } catch (error) {
      console.log('Error fetching sanhs:', error.message);
      toast.error(`Lỗi: ${error.message || 'Không thể tải danh sách món ăn!'}`);
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
    setFilters({ status: [], priceMin: '', priceMax: '' });
    setSearchTerm('');
    toast.success('Đã reset bộ lọc');
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toast.success('Bắt đầu thêm món ăn mới');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toast.info(`Đang chỉnh sửa món ăn: ${row.TenMonAn}`);
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
    toast.warn(`Bạn sắp xóa món ăn: ${row.TenMonAn}`);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toast.info('Đã hủy xóa món ăn');
  };

  const handleSaveDish = async (data, file) => {
    try {
      const monanData = {
        TenMonAn: data.name,
        DonGia: Number(data.price),
        TinhTrang: data.status,
      };
      console.log(monanData);
      toast.info('Đang xử lý yêu cầu ...');

      if (mode === 'edit' && selectedRow) {
        await MonAnService.update(selectedRow.MaMonAn, monanData, file);
        toast.success(`Cập nhật món ăn "${monanData.TenMonAn}" thành công!`);
      } else {
        await MonAnService.createNew(monanData, file);
        toast.success(`Thêm món ăn "${monanData.TenMonAn}" thành công!`);
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể lưu món ăn!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      const result = await MonAnService.delete(selectedRow.MaMonAn);
      result.message
        ? toast.info(result.message)
        : toast.success(`Đã xóa món ăn "${selectedRow.TenMonAn}" thành công!`);
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Xóa thất bại: ${error.message || 'Không thể xóa món ăn!'}`);
    }
  };

  //#endregion

  //#region ui
  return (
    <Box>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách món ăn
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
          placeholder="Tìm tên hoặc mã món ăn ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <FilterButton onClick={handleOpenHideFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <DishFilterPanel
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
          data={dishData}
          columns={DishColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditDishPopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDish}
        title={mode === 'edit' ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
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
