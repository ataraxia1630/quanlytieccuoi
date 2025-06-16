import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import CustomTable from '../../components/Customtable';
import FilterPanel from '../../components/ca/ca_filter_panel';
import EditCaDialog from '../../components/ca/ca_edit_dialog';
import defaultColumns from '../../components/ca/ca_default_column';
import caService from '../../service/ca.service';
import toastService from '../../service/toast/toast.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteDialog from './../../components/Deletedialog';

function DanhSachCa() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [cas, setCas] = useState([]);
  const [caToEdit, setCaToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCas();
  }, []);
  const fetchCas = async () => {
    setLoading(true);
    try {
      const data = await caService.getAllCa();
      setCas(data);
    } catch (error) {
      console.error('Error fetching cas:', error.message);
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
    setCaToEdit(null);
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
      const searchParams = {
        tenCa: searchTerm || '',
        maCa: searchTerm || '',
        gioBatDau: filters.gioBatDau || '',
        gioKetThuc: filters.gioKetThuc || '',
        sortBy: filters.sortBy || '',
        sortOrder: filters.sortOrder || '',
      };
      console.log('Search params:', searchParams); // Debug log
      const data = await caService.searchAndFilterCa(searchParams);
      setCas(data);
      
      // Chỉ hiện toast khi có search term (không hiện khi reset về danh sách đầy đủ)
      if (searchTerm.trim()) {
        if (data.length === 0) {
          toastService.search.noResults('ca');
        } else {
          toastService.search.success(data.length, 'ca');
        }
      }
    } catch (error) {
      console.error('Search error:', error.message);
      toastService.crud.error.generic();
    }
  };

  const handleEdit = (ca) => {
    console.log('Editing ca with maCa:', ca.MaCa);
    setCaToEdit(ca);
    setOpenDialog(true);
    setMode('edit');
  };

  const handleDelete = (ca) => {
    console.log('Deleting ca with maCa:', ca.MaCa);
    setCaToEdit(ca); // Store the ca to delete
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCaToEdit(null); // Clear the ca to delete
  };
  const handleConfirmDelete = async () => {
    try {
      toastService.crud.processing.deleting();
      await caService.deleteCa(caToEdit.MaCa);
      await fetchCas();
      toastService.entity.deleteSuccess('ca', caToEdit.TenCa);
      setIsDeleteDialogOpen(false);
      setCaToEdit(null);
    } catch (error) {
      if (error.message.includes('Không tìm thấy ca')) {
        toastService.validation.notFound('ca');
      } else {
        toastService.crud.error.delete('ca');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCaToEdit(null);
  };
  const handleSaveCa = async (caData) => {
    try {
      console.log('handleSaveCa received caData:', caData);

      if (!caData.TenCa || !caData.GioBatDau || !caData.GioKetThuc) {
        toastService.validation.requiredFields();
        return;
      }

      toastService.crud.processing.saving();
      console.log('Sending update with data:', caData);

      if (mode === 'edit') {
        const updatedCa = await caService.updateCa(caToEdit.MaCa, caData);
        setCas(cas.map((c) => (c.MaCa === caToEdit.MaCa ? updatedCa : c)));
        await fetchCas();
        toastService.entity.updateSuccess('ca', caData.TenCa);
      } else {
        const newCa = await caService.createCa(caData);
        setCas([...cas, newCa]);
        await fetchCas();
        toastService.entity.createSuccess('ca', caData.TenCa);
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.message.includes('Không tìm thấy ca')) {
        toastService.validation.notFound('ca');
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
        Danh sách ca
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
          placeholder="Tìm tên hoặc mã ca ..."
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
          data={cas}
          columns={defaultColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditCaDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveCa}
        ca={caToEdit}
        title={mode === 'edit' ? 'Chỉnh sửa ca' : 'Thêm ca'}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete}
        title="Xác nhận xóa ca"
      />
    </Box>
  );
}

export default DanhSachCa;
