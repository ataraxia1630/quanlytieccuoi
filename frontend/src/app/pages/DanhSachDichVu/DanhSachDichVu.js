import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import ActionDropdown from '../../components/Printandexport';
import CustomTable from '../../components/Customtable';
import DeleteDialog from '../../components/Deletedialog';
import DichVuFilter from '../../components/dichvu/dichvu_filter_panel';
import DichVuColumn from '../../components/dichvu/dichvu_column';
import DichVuDialog from '../../components/dichvu/dichvu_popup';
import DichVuService from '../../service/dichvu.service';
import exportDichVuToExcel from '../../components/dichvu/dichvu_export_excel';
import printDichVu from '../../components/dichvu/dichvu_print_data';
import toastService from '../../service/toast/toast.service';

import { hasPermission } from '../../utils/hasPermission';

function DanhSachDichVu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [loading, setLoading] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
  });

  const permissions = localStorage.getItem('permissions');

  const fetchDichVuList = useCallback(
    async (filters = currentFilters, limit = 50, offset = 0, search = '') => {
      try {
        setLoading(true);
        let data;
        const normalizedSearchTerm = search.trim().replace(/\s+/g, ' ');

        const { searchTerm: oldSearchTerm, ...filtersWithoutSearch } = filters;

        const searchParams = {
          ...filtersWithoutSearch,
          ...(normalizedSearchTerm && { searchTerm: normalizedSearchTerm }),
        };

        if (Object.keys(searchParams).length > 0) {
          data = await DichVuService.searchDichVu(searchParams, limit, offset);
        } else {
          data = await DichVuService.getAllDichVu(limit, offset);
        }

        setDichVuList(data);
        setPagination((prev) => ({ ...prev, limit, offset }));
        return data;
      } catch (error) {
        toastService.crud.error.generic(
          error.message || 'Lỗi khi tìm kiếm dịch vụ'
        );
        setDichVuList([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [currentFilters]
  );

  useEffect(() => {
    fetchDichVuList(currentFilters, pagination.limit, pagination.offset, '');
  }, [fetchDichVuList, currentFilters, pagination.limit, pagination.offset]);

  const handleSearch = async () => {
    const normalizedSearchTerm = searchTerm.trim().replace(/\s+/g, ' ');

    if (!normalizedSearchTerm) {
      toastService.search.emptyKeyword();
      return;
    }

    toastService.crud.processing.loading();
    const result = await fetchDichVuList(
      currentFilters,
      pagination.limit,
      0,
      normalizedSearchTerm
    );

    if (result?.length === 0) {
      toastService.search.noResults('dịch vụ');
    } else {
      toastService.search.success(result.length, 'dịch vụ');
    }
  };

  // Hiển thị lại ds dịch vụ sau khi xóa tìm kiếm
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.trim() === '') {
        fetchDichVuList(currentFilters, pagination.limit, 0, '');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchDichVuList, currentFilters, pagination.limit]);

  const handleAdd = () => {
    setMode('add');
    setSelectedDichVu(null);
    setIsDialogOpen(true);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (filterParams) => {
    setCurrentFilters(filterParams);
    fetchDichVuList(filterParams, pagination.limit, 0, searchTerm);
    if (Object.keys(filterParams).length > 0) {
      toastService.search.appliedFilter();
    } else {
      toastService.search.resetFilter();
    }
  };

  const handleEdit = (dichVu) => {
    setMode('edit');
    setSelectedDichVu(dichVu);
    setIsDialogOpen(true);
  };

  const handleDelete = (dichVu) => {
    setSelectedDichVu(dichVu);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDichVu(null);
  };

  const handleCloseEditDialog = () => {
    setIsDialogOpen(false);
    setSelectedDichVu(null);
  };

  const handleSaveDichVu = async (formData, errors) => {
    if (errors) {
      Object.values(errors).forEach((error) =>
        toastService.validation.invalidData(error)
      );
      return;
    }

    try {
      setLoading(true);
      const dichVuData = {
        TenDichVu: formData.name.trim().replace(/\s+/g, ' '),
        DonGia: Number(formData.price),
        TinhTrang: formData.status,
      };
      if (mode === 'edit' && selectedDichVu) {
        await DichVuService.updateDichVu(selectedDichVu.MaDichVu, dichVuData);
        toastService.entity.updateSuccess('dịch vụ', dichVuData.TenDichVu);
      } else {
        await DichVuService.createDichVu(dichVuData);
        toastService.entity.createSuccess('dịch vụ', dichVuData.TenDichVu);
      }

      setIsDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(
        currentFilters,
        pagination.limit,
        pagination.offset,
        searchTerm
      );
    } catch (error) {
      toastService.crud.error.create('dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const acceptDelete = async () => {
    try {
      setLoading(true);
      const result = await DichVuService.deleteDichVu(selectedDichVu.MaDichVu);

      const toastByStatus = {
        'soft-deleted': () =>
          toastService.info(result.message, `delete-soft-deleted`),
        'already-soft-deleted': () =>
          toastService.warning(result.message, `delete-already-soft-deleted`),
        deleted: () => toastService.success(result.message, `delete-deleted`),
      };

      (
        toastByStatus[result.status] ||
        (() => toastService.success(result.message, `delete-default`))
      )();

      setIsDeleteDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(
        currentFilters,
        pagination.limit,
        pagination.offset,
        searchTerm
      );
    } catch (error) {
      toastService.crud.error.delete('dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const res = printDichVu(dichVuList);
    if (!res.success) {
      toastService.file.printError(res.message);
    }
  };

  const handleExportExcel = async () => {
    const res = await exportDichVuToExcel(dichVuList);
    if (!res.success) {
      toastService.file.exportError(res.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách dịch vụ
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
            placeholder="Tìm tên hoặc mã dịch vụ ..."
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
          <AddButton
            onClick={handleAdd}
            text="Thêm"
            disabled={!hasPermission(permissions, 'service.create')}
          />
          <ActionDropdown
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </Box>
      </Box>

      <DichVuFilter isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
        <CustomTable
          data={dichVuList}
          columns={DichVuColumn}
          onEdit={handleEdit}
          onDelete={handleDelete}
          disabledEdit={!hasPermission(permissions, 'service.edit')}
          disabledDelete={!hasPermission(permissions, 'service.delete')}
        />
      )}

      <DichVuDialog
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDichVu}
        title={mode === 'edit' ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
        initialData={selectedDichVu}
        mode={mode}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title="Xác nhận xóa dịch vụ"
        content={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedDichVu?.TenDichVu}"?`}
      />
    </Box>
  );
}

export default DanhSachDichVu;
