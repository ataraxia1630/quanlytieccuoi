import { useState, useEffect } from 'react';
import './DanhSachMonAn.css';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import SearchBar from '../../components/Searchbar';
import FilterButton from '../../components/Filterbutton';
import AddButton from '../../components/Addbutton';
import ActionDropdown from '../../components/Printandexport';
import CustomTable from '../../components/Customtable';
import DishFilterPanel from '../../components/monan/monan_filter_panel';
import EditDishPopUp from '../../components/monan/monan_edit_popup';
import DishColumns from '../../components/monan/monan_column';
import DeleteDialog from '../../components/Deletedialog';

import MonAnService from '../../service/monan.service';

import { hasPermission } from '../../utils/hasPermission';
import toastService from '../../service/toast/toast.service';

export default function DanhSachMonAn() {
  //#region declaration
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [dishData, setDishData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    priceMin: '',
    priceMax: '',
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(null);
  const [currentSort, setCurrentSort] = useState(null);
  let total;
  const limit = 30;

  const permissions = localStorage.getItem('permissions');
  //#endregion

  //#region useEffect
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await MonAnService.getAll(
        filters.status,
        searchTerm,
        filters.priceMin,
        filters.priceMax,
        currentPage,
        limit,
        sort
      );
      const monanData = result.data.map((monan, index) => {
        monan.STT = (currentPage - 1) * limit + index + 1;
        return monan;
      });
      console.log(monanData);
      setDishData(monanData || []);
      setTotalPages(result.totalPages || 1);
      total = result.total;
    } catch (error) {
      toastService.crud.error.generic();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, totalPages, currentPage, sort]);

  useEffect(() => {
    if (!searchTerm) fetchData();
  }, [searchTerm]);
  //#endregion

  //#region func handler
  const handleSearchResult = () => {
    if (total > 0) toastService.search.success(total, 'món ăn');
    else toastService.search.noResults('món ăn');
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    try {
      await fetchData();
      handleSearchResult();
    } catch (error) {}
  };

  const handleSortChange = (property, order) => {
    setCurrentSort({ field: property, order });
    console.log(property, order);
    if (property === 'TenMonAn') setSort('name_' + order);
    else if (property === 'DonGia') setSort('price_' + order);
    else if (property === 'MaMonAn') setSort('code_' + order);
    setCurrentPage(1);
  };

  const handlePrint = async () => {
    const result = await MonAnService.getAll();
    const data = result.data;
    const res = MonAnService.print(data);
    if (!res.success) {
      toastService.file.printError(res.message);
    }
  };

  const handleExportExcel = async () => {
    const result = await MonAnService.getAll();
    const data = result.data;
    const res = await MonAnService.exportExcel(data);
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
    setFilters({ status: [], priceMin: '', priceMax: '' });
    setSearchTerm('');
    setCurrentPage(1);
    setCurrentSort(null);
    setSort(null);
    toastService.search.resetFilter();
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toastService.entity.createStart('món ăn');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toastService.entity.editing('món ăn', row.TenMonAn);
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
    toastService.entity.deleteConfirm('món ăn', row.TenMonAn);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toastService.entity.cancelDelete('món ăn');
  };

  const handleSaveDish = async (data, file) => {
    try {
      const monanData = {
        TenMonAn: data.name,
        DonGia: Number(data.price),
        TinhTrang: data.status,
      };
      console.log(monanData);
      toastService.crud.processing.saving();

      if (mode === 'edit' && selectedRow) {
        await MonAnService.update(selectedRow.MaMonAn, monanData, file);
        toastService.entity.updateSuccess('món ăn', monanData.TenMonAn);
      } else {
        await MonAnService.createNew(monanData, file);
        toastService.entity.createSuccess('món ăn', monanData.TenMonAn);
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toastService.error(`Lỗi: ${error.message || 'Không thể lưu món ăn!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      const result = await MonAnService.delete(selectedRow.MaMonAn);
      result.message
        ? toastService.info(result.message)
        : toastService.entity.deleteSuccess('món ăn', selectedRow.TenMonAn);
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toastService.crud.error.delete();
    }
  };

  //#endregion

  //#region ui
  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Danh sách món ăn
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
            placeholder="Tìm tên hoặc mã món ăn ..."
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
            disabled={!hasPermission(permissions, 'food.create')}
          />
          <ActionDropdown
            onPrint={handlePrint}
            onExportExcel={handleExportExcel}
          />
        </Box>
      </Box>

      <DishFilterPanel
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CustomTable
            data={dishData}
            columns={DishColumns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            serverSideSort={true}
            onSortChange={handleSortChange}
            currentSort={currentSort}
            disabledEdit={!hasPermission(permissions, 'food.edit')}
            disabledDelete={!hasPermission(permissions, 'food.delete')}
          />
          <Pagination
            count={totalPages}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            onChange={(e, value) => setCurrentPage(value)}
            page={currentPage}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#063F5C',
                borderColor: '#063F5C',
                minWidth: '45px',
                height: '45px',
                borderRadius: '999px',
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#063F5C',
                color: '#fff',
                borderColor: '#063F5C',
                '&:hover': {
                  backgroundColor: '#045172',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: '#045172',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#063F5C',
                  opacity: 1,
                },
              },
              marginTop: '50px',
            }}
          />
        </Box>
      )}

      <EditDishPopUp
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDish}
        title={mode === 'edit' ? 'Chỉnh sửa món ăn' : 'Thêm món ăn'}
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
