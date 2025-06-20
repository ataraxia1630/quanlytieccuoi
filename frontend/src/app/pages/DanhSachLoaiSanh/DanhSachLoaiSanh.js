import { useState, useEffect } from 'react';
import './DanhSachLoaiSanh.css';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import toastService from '../../service/toast/toast.service';

import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import ActionDropdown from '../../components/Printandexport';
import CustomTable from '../../components/Customtable';
import HallTypeFilterPanel from '../../components/loaisanh/loaisanh_filter_panel';
import EditHallTypePopUp from '../../components/loaisanh/loaisanh_edit_popup';
import HallTypeColumns from '../../components/loaisanh/loaisanh_column';
import DeleteDialog from '../../components/Deletedialog';

import LoaiSanhService from '../../service/loaisanh.service';

import { hasPermission } from '../../utils/hasPermission';

export default function DanhSachLoaiSanh() {
  //#region declaration
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [hallTypeData, setHallTypeData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 0,
  });
  const [loading, setLoading] = useState(false);
  let total;

  const permissions = localStorage.getItem('permissions');
  //#endregion

  //#region useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await LoaiSanhService.getAll(
        searchTerm,
        filters.priceMin,
        filters.priceMax
      );
      console.log(result.data);
      setHallTypeData(result.data || []);
      total = result.total;
    } catch (error) {
      console.log('Error fetching sanhs:', error.message);
      toastService.crud.error.generic();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (!searchTerm) fetchData();
  }, [searchTerm]);
  //#endregion

  //#region func handler
  const handleSearchResult = () => {
    if (total > 0) toastService.search.success(total, 'loại sảnh');
    else toastService.search.noResults('loại sảnh');
  };

  const handleSearch = async () => {
    try {
      await fetchData();
      handleSearchResult();
    } catch (error) {}
  };

  const handlePrint = async () => {
    const res = LoaiSanhService.print(hallTypeData);
    if (!res.success) {
      toastService.file.printError(res.message);
    }
  };

  const handleExportExcel = async () => {
    const res = await LoaiSanhService.exportExcel(hallTypeData);
    if (!res.success) {
      toastService.file.exportError(res.message);
    }
  };

  const handleOpenHideFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    toastService.search.appliedFilter();
  };

  const handleResetFilter = () => {
    setFilters({ priceMin: 0, priceMax: 0 });
    setSearchTerm('');
    toastService.search.resetFilter();
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toastService.entity.createStart('loại sảnh');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toastService.entity.editing('loại sảnh', row.TenLoaiSanh);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRow(false);
    mode === 'edit'
      ? toastService.crud.cancel.edit()
      : toastService.crud.cancel.create();
  };

  const handleDelete = async (row) => {
    setIsDeleteDialogOpen(true);
    setSelectedRow(row);
    toastService.entity.deleteConfirm('loại sảnh', row.TenLoaiSanh);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toastService.entity.cancelDelete('loại sảnh');
  };

  const handleSaveHallType = async (data) => {
    try {
      const loaisanhData = {
        TenLoaiSanh: data.name,
        DonGiaBanToiThieu: Number(data.price),
      };
      console.log(loaisanhData);
      toastService.crud.processing.saving();

      if (mode === 'edit' && selectedRow) {
        await LoaiSanhService.update(selectedRow.MaLoaiSanh, loaisanhData);
        toastService.entity.updateSuccess(
          'loại sảnh',
          loaisanhData.TenLoaiSanh
        );
      } else {
        await LoaiSanhService.createNew(loaisanhData);
        toastService.entity.createSuccess(
          'loại sảnh',
          loaisanhData.TenLoaiSanh
        );
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toastService.error(`Lỗi: ${error.message || 'Không thể lưu loại sảnh!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      await LoaiSanhService.delete(selectedRow.MaLoaiSanh);
      toastService.entity.deleteSuccess('loại sảnh', selectedRow.TenLoaiSanh);
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toastService.error(`Xóa thất bại: ${error.message || 'Xóa thất bại!'}`);
    }
  };

  //#endregion

  //#region ui
  return (
    <Box sx={{ px: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách loại sảnh
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
            placeholder="Tìm tên hoặc mã loại sảnh ..."
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
          <FilterButton onClick={handleOpenHideFilter} text="Filter" />
          <AddButton
            onClick={handleAdd}
            text="Thêm"
            disabled={!hasPermission(permissions, 'hallType.create')}
          />
          <ActionDropdown
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </Box>
      </Box>

      <HallTypeFilterPanel
        isOpen={isFilterOpen}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
        filters={filters}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#063F5C' }} />
        </Box>
      ) : (
        <CustomTable
          data={hallTypeData}
          columns={HallTypeColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          disabledEdit={!hasPermission(permissions, 'hallType.edit')}
          disabledDelete={!hasPermission(permissions, 'hallType.delete')}
        />
      )}

      <EditHallTypePopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveHallType}
        title={mode === 'edit' ? 'Chỉnh sửa loại sảnh' : 'Thêm loại sảnh'}
        editData={selectedRow}
        mode={mode}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title={'Xác nhận xóa'}
      />
    </Box>
  );
  //#endregion
}
