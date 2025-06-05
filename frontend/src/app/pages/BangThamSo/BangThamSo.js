import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SearchBar from '../../components/Searchbar';
import CustomTable from '../../components/Customtable';
import ThamSoDialog from '../../components/thamso/thamso_popup';
import ThamSoColumn from '../../components/thamso/thamso_column';

function BangThamSo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSearch = () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
    toast.info('Chỉnh sửa quy định');
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    toast.info('Đã đóng chỉnh sửa');
  };

  const handleSaveDish = () => {
    toast.success('Đã lưu chỉnh sửa');
    setIsEditDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách quy định
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
          placeholder="Tìm tên quy định ..."
        />
      </Box>

      <Box
        sx={{
          '& .MuiTableCell-root': {
            paddingTop: '30px',
            paddingBottom: '30px',
          },
        }}
      >
        <CustomTable
          data={[
            { TenThamSo: 'Cá quả chiên sốt Thái', GiaTri: 'Còn hàng' },
            { TenThamSo: 'Cá quả chiên sốt Thái', GiaTri: 'Hết hàng' },
          ]} // Đổi thành data được lấy lên từ backend
          columns={ThamSoColumn}
          onEdit={handleEdit}
        />
      </Box>

      <ThamSoDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDish}
        title={'Chỉnh sửa quy định'}
      />
    </Box>
  );
}

export default BangThamSo;
