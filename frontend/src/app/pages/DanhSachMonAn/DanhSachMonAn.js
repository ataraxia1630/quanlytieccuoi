import { useState, useEffect } from 'react';
import './DanhSachMonAn.css';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

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
        20,
        sort
      );
      const monanData = result.data.map((monan, index) => {
        monan.STT = (currentPage - 1) * 20 + index + 1;
        return monan;
      });
      console.log(monanData);
      setDishData(monanData || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.log('Error fetching sanhs:', error.message);
      toast.error(`Lỗi: ${error.message || 'Không thể tải danh sách món ăn!'}`);
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
  const handleSearch = () => {
    // toast.info(`Đang tìm kiếm: ${searchTerm}`);
    setCurrentPage(1);
    fetchData();
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
      toast('error', `Lỗi khi in: ${res.message}`);
    }
  };

  const handleExportExcel = async () => {
    const result = await MonAnService.getAll();
    const data = result.data;
    const res = await MonAnService.exportExcel(data);
    if (!res.success) {
      toast('error', `Lỗi khi xuất file: ${res.message}`);
    }
  };

  const handleOpenHideFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    toast.success('Đã áp dụng bộ lọc');
  };

  const handleResetFilter = () => {
    setFilters({ status: [], priceMin: '', priceMax: '' });
    setSearchTerm('');
    setCurrentPage(1);
    setCurrentSort(null);
    setSort(null);
    toast.success('Đã reset bộ lọc');
  };

  const handleAdd = () => {
    setMode('add');
    setSelectedRow(null);
    setIsEditDialogOpen(true);
    toast.success('Bắt đầu thêm món ăn mới');
  };

  const handleEdit = async (row) => {
    setMode('edit');
    setSelectedRow(row);
    setIsEditDialogOpen(true);
    toast.info(`Đang chỉnh sửa món ăn: ${row.TenMonAn}`);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRow(false);
    mode === 'edit'
      ? toast.info('Đã đóng cửa sổ chỉnh sửa')
      : toast.info('Đã đóng cửa sổ thêm mới');
  };

  const handleDelete = async (row) => {
    setIsDeleteDialogOpen(true);
    setSelectedRow(row);
    toast.warn(`Bạn sắp xóa món ăn: ${row.TenMonAn}`);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRow(null);
    toast.info('Đã hủy xóa món ăn');
  };

  const handleSaveDish = async (data, file) => {
    try {
      const monanData = {
        TenMonAn: data.name,
        DonGia: Number(data.price),
        TinhTrang: data.status,
      };
      console.log(monanData);
      toast.info('Đang xử lý yêu cầu ...');

      if (mode === 'edit' && selectedRow) {
        await MonAnService.update(selectedRow.MaMonAn, monanData, file);
        toast.success(`Cập nhật món ăn "${monanData.TenMonAn}" thành công!`);
      } else {
        await MonAnService.createNew(monanData, file);
        toast.success(`Thêm món ăn "${monanData.TenMonAn}" thành công!`);
      }

      setIsEditDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể lưu món ăn!'}`);
    }
  };

  const acceptDelete = async () => {
    try {
      const result = await MonAnService.delete(selectedRow.MaMonAn);
      result.message
        ? toast.info(result.message)
        : toast.success(`Đã xóa món ăn "${selectedRow.TenMonAn}" thành công!`);
      setIsDeleteDialogOpen(false);
      setSelectedRow(null);
      fetchData();
    } catch (error) {
      toast.error(`Xóa thất bại: ${error.message || 'Không thể xóa món ăn!'}`);
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
          placeholder="Tìm tên hoặc mã món ăn ..."
        />

        <Box sx={{ display: 'flex', gap: '17px', justifyContent: 'flex-end' }}>
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
