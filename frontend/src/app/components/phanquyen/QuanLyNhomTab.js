import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { Box, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import SearchBar from '../Searchbar';
import AddButton from '../Addbutton';
import DeleteDialog from '../../components/Deletedialog';

import GroupAccordion from './group_accordion';
import GroupService from '../../service/nhom.service';

export default function QuanLyNhomTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const groups = await GroupService.getAll(searchTerm);
      setGroupData(groups || []);
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể tải danh sách nhóm!'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleSearch = () => {
    fetchData();
  };
  const handleAdd = () => {
    setSelectedRow(null);
    toast.success('Bắt đầu thêm nhóm mới');
  };

  const handleEdit = (group) => {
    setSelectedRow(group);
  };

  const handleDelete = (group) => {
    setSelectedRow(group);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow) return;
    try {
      await GroupService.delete(selectedRow.MaNhom);
      toast.success(`Xóa nhóm ${selectedRow.TenNhom} thành công!`);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa nhóm!'}`);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
    }
  };

  return (
    <Box>
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
          placeholder="Tìm tên hoặc mã nhóm ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {groupData.map((group, idx) => (
            <GroupAccordion
              key={idx}
              group={group}
              onDelete={handleDelete}
              onSave={fetchData}
            />
          ))}
        </Box>
      )}

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa Nhóm"
        content={`Bạn có chắc muốn xóa nhóm ${selectedRow?.TenNhom || ''}?`}
      />
    </Box>
  );
}
