import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import CustomTable from '../../components/Customtable';
import FilterPanel from '../../components/sanh/sanh_filter_panel';
import EditSanhDialog from '../../components/sanh/sanh_edit_sanh_pop_up';
import defaultColumns from '../../components/sanh/sanh_default_column';
import sanhService from '../../service/sanh.service';
import toastService from '../../service/toast/toast.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteDialog from '../../components/Deletedialog';

function DanhSachSanh() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [sanhs, setSanhs] = useState([]);
  const [sanhToEdit, setSanhToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSanhs();
  }, []);
  const fetchSanhs = async () => {
    setLoading(true);
    try {
      const data = await sanhService.getAllSanh();
      setSanhs(data);
    } catch (error) {
      console.error('Error fetching sanhs:', error.message);
      toastService.crud.error.generic();
    } finally {
      setLoading(false);
    }
  };  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // Nếu không có search term, reset về danh sách đầy đủ
      searchAndFilter({});
      return;
    }
    searchAndFilter();
  };

  const handleAdd = () => {
    setSanhToEdit(null);
    setOpenDialog(true);
    setMode('add');
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleApplyFilter = async (filters) => {
    searchAndFilter(filters);
    
    // Toast cho filter
    const hasFilters = Object.values(filters).some(v => v);
    if (hasFilters) {
      toastService.search.appliedFilter();
    } else {
      toastService.search.resetFilter();
    }
  };  const searchAndFilter = async (filters = {}) => {
    try {
      const data = await sanhService.searchAndFilterSanh({
        tenSanh: searchTerm,
        maSanh: searchTerm,
        ...filters,
      });
      setSanhs(data);
      
      // Chỉ hiện toast khi có search term (không hiện khi reset về danh sách đầy đủ)
      if (searchTerm.trim()) {
        if (data.length === 0) {
          toastService.search.noResults('sảnh');
        } else {
          toastService.search.success(data.length, 'sảnh');
        }
      }
    } catch (error) {
      toastService.crud.error.generic();
    }
  };

  const handleEdit = (sanh) => {
    console.log('Editing sanh with maSanh:', sanh.MaSanh);
    setSanhToEdit(sanh);
    setOpenDialog(true);
    setMode('edit');
  };

  const handleDelete = (sanh) => {
    console.log('Deleting sanh with maSanh:', sanh.MaSanh);
    setSanhToEdit(sanh); // Set the sanh to delete
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSanhToEdit(null); // Clear the sanh to delete
  };
  const handleConfirmDelete = async () => {
    try {
      toastService.crud.processing.deleting();
      await sanhService.deleteSanh(sanhToEdit.MaSanh);
      await fetchSanhs();
      toastService.entity.deleteSuccess('sảnh', sanhToEdit.TenSanh);
      setIsDeleteDialogOpen(false);
      setSanhToEdit(null);
    } catch (error) {
      if (error.message.includes('Không tìm thấy sảnh')) {
        toastService.validation.notFound('sảnh');
      } else {
        toastService.crud.error.delete('sảnh');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSanhToEdit(null);
  };
  const handleSaveSanh = async (sanhData) => {
    try {
      console.log('handleSaveSanh received sanhData:', sanhData);
      console.log(
        'HinhAnh in handleSaveSanh:',
        sanhData.HinhAnh,
        'instanceof File:',
        sanhData.HinhAnh instanceof File
      );

      if (
        !sanhData.TenSanh ||
        !sanhData.MaLoaiSanh ||
        !sanhData.SoLuongBanToiDa
      ) {
        toastService.validation.requiredFields();
        return;
      }

      toastService.crud.processing.saving();
      console.log('Sending update with data:', sanhData);

      if (mode === 'edit') {
        const updatedSanh = await sanhService.updateSanh(
          sanhToEdit.MaSanh,
          sanhData
        );
        setSanhs(
          sanhs.map((s) => (s.MaSanh === sanhToEdit.MaSanh ? updatedSanh : s))
        );
        toastService.entity.updateSuccess('sảnh', sanhData.TenSanh);
      } else {
        const newSanh = await sanhService.createSanh(sanhData);
        setSanhs([...sanhs, newSanh]);
        toastService.entity.createSuccess('sảnh', sanhData.TenSanh);
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.message.includes('Không tìm thấy sảnh')) {
        toastService.validation.notFound('sảnh');
      } else {
        toastService.crud.error.generic();
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách sảnh
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
          placeholder="Tìm tên hoặc mã sảnh ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
        <CustomTable
          data={sanhs}
          columns={defaultColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditSanhDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveSanh}
        sanh={sanhToEdit}
        title={mode === 'edit' ? 'Chỉnh sửa sảnh' : 'Thêm sảnh'}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete}
        title="Xác nhận xóa sảnh"
      />
    </Box>
  );
}

export default DanhSachSanh;
