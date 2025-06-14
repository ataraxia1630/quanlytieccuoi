import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { Box, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import SearchBar from '../Searchbar';
import AddButton from '../Addbutton';
import CustomTable from '../Customtable';
import UserColumn from './user_column';
import EditUserPopUp from './user_edit_popup';
import DeleteDialog from '../../components/Deletedialog';

import UserService from '../../service/user.service';

export default function DanhSachLoaiSanh() {
  //#region declaration
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [userData, setUserData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await UserService.getAll(searchTerm);
      console.log(result);
      setUserData(result || []);
    } catch (error) {
      console.log('Error fetching user:', error.message);
      toast.error(`Lỗi: ${error.message || 'Không thể tải danh sách user!'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);
  //#endregion

  //#region func handler
  const handleSearch = () => {
    // toast.info(`Đang tìm kiếm: ${searchTerm}`);
    fetchData();
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toast.success('Bắt đầu thêm người dùng mới');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toast.info(`Đang chỉnh sửa người dùng: ${row.username}`);
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
    toast.warn(`Bạn sắp xóa người dùng: ${row.username}`);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toast.info('Đã hủy xóa người dùng');
  };

  const handleSaveUser = async (data) => {
    try {
      const userData = {
        username: data.username,
        MaNhom: data.MaNhom,
      };
      if (data.password) userData.password = data.password;
      console.log(userData);
      toast.info('Đang xử lý yêu cầu ...');

      if (mode === 'edit' && selectedRow) {
        await UserService.update(selectedRow.username, userData);
        toast.success(
          `Cập nhật người dùng "${selectedRow.username}" thành công!`
        );
      } else {
        await UserService.createNew(userData);
        toast.success(`Thêm người dùng "${userData.username}" thành công!`);
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể lưu người dùng!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      await UserService.delete(selectedRow.username);
      toast.success(`Đã xóa người dùng "${selectedRow.username}" thành công!`);
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(
        `Xóa thất bại: ${error.message || 'Không thể xóa người dùng!'}`
      );
    }
  };

  //#endregion

  //#region ui
  return (
    <Box sx={{ px: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
          placeholder="Tìm username hoặc tên nhóm ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
        <CustomTable
          data={userData}
          columns={UserColumn}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditUserPopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveUser}
        title={mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
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
