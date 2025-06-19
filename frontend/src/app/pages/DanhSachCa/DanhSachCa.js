import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import ActionDropdown from '../../components/Printandexport';
import CustomTable from '../../components/Customtable';
import FilterPanel from '../../components/ca/ca_filter_panel';
import EditCaDialog from '../../components/ca/ca_edit_dialog';
import defaultColumns from '../../components/ca/ca_default_column';
import caService from '../../service/ca.service';
import exportCaToExcel from '../../components/ca/ca_export_excel';
import printCa from '../../components/ca/ca_print_data';
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
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchCas = useCallback(
    async (filters = currentFilters, search = '') => {
      try {
        setLoading(true);
        let data;
        const normalizedSearchTerm = search.trim().replace(/\s+/g, ' ');

        const { searchTerm: oldSearchTerm, ...filtersWithoutSearch } = filters;

        const searchParams = {
          ...filtersWithoutSearch,
          ...(normalizedSearchTerm && { 
            tenCa: normalizedSearchTerm,
            maCa: normalizedSearchTerm 
          }),
        };

        if (Object.keys(searchParams).length > 0) {
          data = await caService.searchAndFilterCa(searchParams);
        } else {
          data = await caService.getAllCa();
        }

        setCas(data);
        return data;      } catch (error) {
        toastService.error(`Lỗi khi tìm kiếm ca: ${error.message}`, 'search-error');
        setCas([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentFilters]
  );

  useEffect(() => {
    fetchCas();
  }, [fetchCas]);
  const handleSearch = async () => {
    const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ');

    if (!normalizedSearchTerm) {
      //toastService.warning('Vui lòng nhập từ khóa tìm kiếm', 'search-empty');
      return;
    }

    toastService.info(`Đang tìm kiếm: ${normalizedSearchTerm}`, 'search-start');
    const result = await fetchCas(currentFilters, normalizedSearchTerm);

    if (result?.length === 0) {
      toastService.search.noResults('ca');
    } else {
      toastService.search.success(result.length, 'ca');
    }
  };

  // Hiển thị lại ds ca sau khi xóa tìm kiếm
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchCas(currentFilters, '');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchCas, currentFilters]);
  const handleAdd = () => {
    setCaToEdit(null);
    setOpenDialog(true);
    setMode('add');
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const handleApplyFilter = (filterParams) => {
    setCurrentFilters(filterParams);
    fetchCas(filterParams, searchTerm);

    if (Object.keys(filterParams).length > 0) {
      toastService.search.appliedFilter('ca');
    } else {
      toastService.search.resetFilter('ca');
    }
  };

  const handleEdit = (ca) => {
    setMode('edit');
    setCaToEdit(ca);
    setOpenDialog(true);
  };

  const handleDelete = (ca) => {
    setCaToEdit(ca);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCaToEdit(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCaToEdit(null);
  };
  const handleSaveCa = async (caData) => {
    try {
      setLoading(true);

      if (mode === 'edit' && caToEdit) {
        await caService.updateCa(caToEdit.MaCa, caData);
        toastService.entity.updateSuccess('ca', caData.TenCa);
      } else {
        await caService.createCa(caData);
        toastService.entity.createSuccess('ca', caData.TenCa);
      }

      setOpenDialog(false);
      setCaToEdit(null);
      fetchCas(currentFilters, searchTerm);
      
      // Return success to indicate the operation completed successfully
      return { success: true };
    } catch (error) {
      // Parse error message for better user experience
      let errorMessage = error.message || 'Lỗi khi lưu ca';
      
      if (errorMessage.includes('đã tồn tại')) {
        toastService.error(errorMessage, 'duplicate-error');
      } else if (errorMessage.includes('trùng') || errorMessage.includes('overlap')) {
        toastService.error(errorMessage, 'overlap-error');
      } else if (errorMessage.includes('bằng')) {
        toastService.error(errorMessage, 'time-equal-error');
      } else {
        toastService.crud.error.generic();
      }
      
      // Return error to indicate the operation failed
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      toastService.crud.processing.deleting();
      await caService.deleteCa(caToEdit.MaCa);
      toastService.entity.deleteSuccess('ca', caToEdit.TenCa);
      setIsDeleteDialogOpen(false);
      setCaToEdit(null);
      fetchCas(currentFilters, searchTerm);
    } catch (error) {
      let errorMessage = error.message || 'Lỗi khi xóa ca';
      
      if (errorMessage.includes('Không tìm thấy ca')) {
        toastService.validation.notFound('ca');
      } else if (errorMessage.includes('Không thể xóa') && errorMessage.includes('phiếu đặt tiệc')) {
        // Show detailed error message from backend
        toastService.error(errorMessage, 'delete-in-use-error');
      } else {
        toastService.crud.error.delete('ca');
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    const res = printCa(cas);
    if (!res.success) {
      toastService.file.printError(res.message);
    }
  };

  const handleExportExcel = async () => {
    const res = await exportCaToExcel(cas);
    if (res.success) {
      toastService.success(`Xuất Excel thành công`, 'export-success');
    } else {
      toastService.file.exportError(res.message);
    }
  };  return (
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
          alignItems: 'flex-start',
          gap: 2,
          mb: 3,
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box
          sx={{ flex: 1, minWidth: 250, display: 'flex', alignItems: 'center' }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Tìm tên hoặc mã ca ..."
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}
        >
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
          <ActionDropdown
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
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
        content={`Bạn có chắc chắn muốn xóa ca "${caToEdit?.TenCa}"?`}
      />
    </Box>
  );
}

export default DanhSachCa;
