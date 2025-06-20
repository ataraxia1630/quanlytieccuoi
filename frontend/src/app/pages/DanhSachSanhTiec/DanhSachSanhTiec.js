import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import ActionDropdown from '../../components/Printandexport';
import CustomTable from '../../components/Customtable';
import FilterPanel from '../../components/sanh/sanh_filter_panel';
import EditSanhDialog from '../../components/sanh/sanh_edit_sanh_pop_up';
import defaultColumns from '../../components/sanh/sanh_default_column';
import sanhService from '../../service/sanh.service';
import toastService from '../../service/toast/toast.service';
import exportSanhToExcel from '../../components/sanh/sanh_export_excel';
import printSanh from '../../components/sanh/sanh_print_data';
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
  const [filteredSanhs, setFilteredSanhs] = useState([]);
  const [sanhToEdit, setSanhToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetchSanhs();
  }, []);  const fetchSanhs = async () => {
    setLoading(true);
    try {
      const data = await sanhService.getAllSanh();
      setSanhs(data);
      setFilteredSanhs(data);
    } catch (error) {
      console.error('Error fetching sanhs:', error.message);
      toastService.error(`Lỗi khi tải dữ liệu: ${error.message}`, 'fetch-error');
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // Reset về danh sách đầy đủ khi không có search term
      setFilteredSanhs(sanhs);
      setCurrentFilters({});
      return;
    }
    searchAndFilter();
  };

  // Tự động search khi xóa search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSanhs(sanhs);
      setCurrentFilters({});
    }
  }, [searchTerm, sanhs]);

  const handleAdd = () => {
    setSanhToEdit(null);
    setOpenDialog(true);
    setMode('add');
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };  const handleApplyFilter = async (filters) => {
    setCurrentFilters(filters);
    searchAndFilter(filters);
    
    // Toast cho filter
    const hasFilters = Object.values(filters).some(v => v);
    if (hasFilters) {
      toastService.search.appliedFilter('sảnh');
    } else {
      toastService.search.resetFilter('sảnh');
    }
  };
  const searchAndFilter = async (filters = currentFilters) => {
    try {
      const data = await sanhService.searchAndFilterSanh({
        tenSanh: searchTerm,
        maSanh: searchTerm,
        ...filters,
      });
      setFilteredSanhs(data);
      
      // Chỉ hiện toast khi có search term (không hiện khi reset về danh sách đầy đủ)
      if (searchTerm.trim()) {
        if (data.length === 0) {
          toastService.search.noResults('sảnh');
        } else {
          toastService.search.success(data.length, 'sảnh');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      let errorMessage = 'Có lỗi xảy ra khi tìm kiếm';
      
      if (error.message) {
        if (error.message.includes('too long') || error.message.includes('quá dài')) {
          errorMessage = 'Từ khóa tìm kiếm quá dài, vui lòng nhập ngắn hơn';
        } else {
          errorMessage = error.message;
        }
      }
      
      toastService.error(`Lỗi tìm kiếm: ${errorMessage}`, 'search-error');
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
  };  const handleConfirmDelete = async () => {
    // Show processing toast
    toastService.info('Đang xóa sảnh...', 'processing-delete');
    
    try {
      await sanhService.deleteSanh(sanhToEdit.MaSanh);
      await fetchSanhs();
      
      // Dismiss processing toast and show success
      toastService.dismissAll();
      toastService.entity.deleteSuccess('sảnh', sanhToEdit.TenSanh);
      
      setIsDeleteDialogOpen(false);
      setSanhToEdit(null);
    } catch (error) {
      console.error('Delete error:', error);
      
      // Dismiss processing toast
      toastService.dismissAll();
      
      // Parse error message từ backend
      let errorMessage = error.message || 'Có lỗi xảy ra khi xóa sảnh';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      if (errorMessage.includes('Không tìm thấy sảnh')) {
        toastService.validation.notFound('sảnh');
      } else if (errorMessage.includes('Không thể xóa sảnh') && errorMessage.includes('phiếu đặt tiệc')) {
        // Hiển thị message chi tiết từ backend
        toastService.error(errorMessage, 'delete-in-use-error');
      } else {
        toastService.error(`Lỗi khi xóa sảnh "${sanhToEdit.TenSanh}": ${errorMessage}`, 'delete-error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSanhToEdit(null);
  };  const handleSaveSanh = async (sanhData) => {
    // Show processing toast
    const processingMessage = mode === 'edit' ? 'Đang cập nhật sảnh...' : 'Đang thêm sảnh...';
    toastService.info(processingMessage, `processing-${mode}`);
    
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
        // Dismiss processing toast
        toastService.dismissAll();
        toastService.validation.requiredFields();
        return;
      }

      console.log('Sending update with data:', sanhData);

      if (mode === 'edit') {
        const updatedSanh = await sanhService.updateSanh(
          sanhToEdit.MaSanh,
          sanhData
        );
        setSanhs(
          sanhs.map((s) => (s.MaSanh === sanhToEdit.MaSanh ? updatedSanh : s))
        );
        setFilteredSanhs(
          filteredSanhs.map((s) => (s.MaSanh === sanhToEdit.MaSanh ? updatedSanh : s))
        );
        
        // Dismiss processing toast and show success
        toastService.dismissAll();
        toastService.entity.updateSuccess('sảnh', sanhData.TenSanh);
      } else {
        const newSanh = await sanhService.createSanh(sanhData);
        setSanhs([...sanhs, newSanh]);
        setFilteredSanhs([...filteredSanhs, newSanh]);
        
        // Dismiss processing toast and show success
        toastService.dismissAll();
        toastService.entity.createSuccess('sảnh', sanhData.TenSanh);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Save error:', error);      
      // Dismiss processing toast
      toastService.dismissAll();
      
      let errorMessage = error.message || 'Có lỗi xảy ra';
      
      if (error.message && error.message.includes('Không tìm thấy sảnh')) {
        toastService.validation.notFound('sảnh');
      } else if (error.message && error.message.includes('đã tồn tại')) {
        // Parse JSON error message if it exists
        try {
          // Check if message is JSON format
          if (errorMessage.startsWith('{') && errorMessage.endsWith('}')) {
            const parsed = JSON.parse(errorMessage);
            errorMessage = parsed.error || errorMessage;
          }
        } catch (e) {
          // If not valid JSON, use original message
        }
        toastService.error(errorMessage, 'duplicate-error');
      } else if (error.message && error.message.includes('Số lượng bàn')) {
        toastService.error(errorMessage, 'validation-error');
      } else {
        toastService.error(`Lỗi khi lưu: ${errorMessage}`, 'save-error');
      }
    }
  };

  // Chức năng in
  const handlePrint = () => {
    const res = printSanh(filteredSanhs);
    if (!res.success) {
      toastService.file.printError(res.message);
    }
  };  // Chức năng xuất Excel
  const handleExport = async () => {
    const res = await exportSanhToExcel(filteredSanhs);
    if (res.success) {
      toastService.success(`Xuất Excel thành công: ${res.fileName}`, 'export-success');
    } else {
      toastService.file.exportError(res.message);
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
            placeholder="Tìm tên hoặc mã sảnh ..."
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
            onExportExcel={handleExport}
          />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (        <CustomTable
          data={filteredSanhs}
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
