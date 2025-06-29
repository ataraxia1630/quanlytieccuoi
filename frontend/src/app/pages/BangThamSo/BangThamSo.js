import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastService from '../../service/toast/toast.service';

import SearchBar from '../../components/Searchbar';
import CustomTable from '../../components/Customtable';
import ThamSoColumn from '../../components/thamso/thamso_column';
import ThamSoService from '../../service/thamso.service';
import ThamSoDialog from './../../components/thamso/thamso_popup';

import { hasPermission } from '../../utils/hasPermission';

function BangThamSo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [thamSoList, setThamSoList] = useState([]);
  const [selectedThamSo, setSelectedThamSo] = useState(null);
  const [pagination] = useState({ limit: 50, offset: 0 });
  const [loading, setLoading] = useState(false);

  const permissions = localStorage.getItem('permissions');

  const fetchThamSoList = useCallback(
    async (search = '') => {
      try {
        setLoading(true);
        const normalizedSearch = search.trim().replace(/\s+/g, ' ');
        const data = await ThamSoService.getAllThamSo(
          pagination.limit,
          pagination.offset,
          normalizedSearch
        );
        setThamSoList(data);
        return data;
      } catch (error) {
        toastService.error(
          error.message || 'Lỗi khi tải danh sách tham số',
          'thamso-load-error'
        );

        setThamSoList([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, pagination.offset]
  );

  useEffect(() => {
    fetchThamSoList();
  }, [fetchThamSoList]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchThamSoList('');
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchThamSoList]);

  const handleSearch = async () => {
    const keyword = searchTerm.trim();
    if (!keyword) {
      toastService.search.emptyKeyword();
      return;
    }

    toastService.crud.processing.loading();
    const result = await fetchThamSoList(keyword);

    if (result.length === 0) {
      toastService.search.noResults('tham số');
    } else {
      toastService.search.success(result.length, 'tham số');
    }
  };
  const handleEdit = (row) => {
    setSelectedThamSo(row);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedThamSo(null);
  };

  const handleSaveThamSo = async (formData) => {
    try {
      setLoading(true);
      await ThamSoService.updateThamSo(formData.TenThamSo, formData.GiaTri);
      const updatedList = thamSoList.map((ts) =>
        ts.TenThamSo === formData.TenThamSo
          ? { ...ts, GiaTri: formData.GiaTri }
          : ts
      );
      setThamSoList(updatedList);
      toastService.thamSo.saveEdit();
      setIsEditDialogOpen(false);
      setSelectedThamSo(null);
    } catch (error) {
      toastService.crud.error.update('tham số');
    } finally {
      setLoading(false);
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
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
            disabledEdit={!hasPermission(permissions, 'variable.edit')}
          />
        </Box>
      )}

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
