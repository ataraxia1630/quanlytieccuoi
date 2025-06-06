import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SearchBar from '../../components/Searchbar';
import CustomTable from '../../components/Customtable';
import ThamSoColumn from '../../components/thamso/thamso_column';
import ThamSoService from '../../service/thamso.service';
import ThamSoDialog from './../../components/thamso/thamso_popup';

function BangThamSo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [thamSoList, setThamSoList] = useState([]);
  const [selectedThamSo, setSelectedThamSo] = useState(null);

  useEffect(() => {
    const fetchThamSo = async () => {
      try {
        const data = await ThamSoService.getAllThamSo(10, 0, searchTerm);
        setThamSoList(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchThamSo();
  }, [searchTerm]);

  const handleSearch = () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);
  };

  const handleEdit = (row) => {
    setSelectedThamSo(row);
    setIsEditDialogOpen(true);
    toast.info('Chỉnh sửa quy định');
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedThamSo(null);
    toast.info('Đã đóng chỉnh sửa');
  };

  const handleSaveThamSo = async (formData) => {
    try {
      await ThamSoService.updateThamSo(formData.TenThamSo, formData.GiaTri);
      const updatedList = thamSoList.map((ts) =>
        ts.TenThamSo === formData.TenThamSo
          ? { ...ts, GiaTri: formData.GiaTri }
          : ts
      );
      setThamSoList(updatedList);
      toast.success('Đã lưu chỉnh sửa');
      setIsEditDialogOpen(false);
      setSelectedThamSo(null);
    } catch (error) {
      toast.error(error.message);
    }
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
          data={thamSoList}
          columns={ThamSoColumn}
          onEdit={handleEdit}
        />
      </Box>

      <ThamSoDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveThamSo}
        title="Chỉnh sửa quy định"
        initialData={selectedThamSo}
      />
    </Box>
  );
}

export default BangThamSo;
