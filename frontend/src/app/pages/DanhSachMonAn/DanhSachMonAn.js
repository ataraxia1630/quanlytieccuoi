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
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchData();
  }, []);
  //#endregion

  const fetchData = async () => {
    try {
      toast.info('Đang xử lý …');
      const data = await MonAnService.getAll();
      setDishData(data);
      toast.success('Tải danh sách món ăn thành công!');
    } catch (error) {
      console.error('Error fetching sanhs:', error.message);
      toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  //#region func handler
  const handleSearch = () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);
  };

  const handleOpenHideFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = () => {
    toast.success('Đã áp dụng bộ lọc');
  };

  const handleResetFilter = () => {
    toast.success('Đã reset bộ lọc');
  };

  const handleAdd = () => {
    setMode('add');
    setIsEditDialogOpen(true);
    toast.success('Thêm món ăn mới');
  };

  const handleEdit = () => {
    setMode('edit');
    setIsEditDialogOpen(true);
    toast.info('Chỉnh sửa món ăn');
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    toast.info('Đã đóng chỉnh sửa');
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    toast.warn('Bạn sắp xóa món ăn này');
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    toast.info('Đã hủy xóa');
  };

  const handleSaveDish = () => {
    toast.success(mode === 'edit' ? 'Đã lưu chỉnh sửa' : 'Đã thêm món ăn');
    setIsEditDialogOpen(false);
  };

  const acceptDelete = () => {
    toast.success('Đã xóa thành công');
    setIsDeleteDialogOpen(false);
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

      <DishFilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      <CustomTable
        data={dishData}
        columns={DishColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditDishPopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDish}
        title={mode === 'edit' ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
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
