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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [groupData, setGroupData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const groups = await GroupService.getAll(searchTerm);
      console.log(groups);
      setGroupData(groups || []);
    } catch (error) {
      console.log('Error fetching user:', error.message);
      toast.error(`Lỗi: ${error.message || 'Không thể tải danh sách nhóm!'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleSearch = () => {
    // toast.info(`Đang tìm kiếm: ${searchTerm}`);
    fetchData();
  };
  const handleAdd = () => {
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toast.success('Bắt đầu thêm người dùng mới');
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
        <Box sx={{ mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {groupData.map((group, idx) => (
            <GroupAccordion key={idx} group={group} />
          ))}
        </Box>
      )}
    </Box>
  );
}
