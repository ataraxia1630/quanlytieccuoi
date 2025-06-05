import { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import DeleteDialog from "../../components/Deletedialog";
import DichVuFilter from "../../components/dichvu/dichvu_filter_panel";
import DichVuColumn from "../../components/dichvu/dichvu_column";
import DichVuDialog from "../../components/dichvu/dichvu_popup";
import DichVuService from "../../service/dichvu.service";

function DanhSachDichVu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
  });

  const fetchDichVuList = useCallback(
    async (filters = {}, limit = 50, offset = 0) => {
      try {
        setLoading(true);
        let data;

        if (Object.keys(filters).length > 0 || searchTerm.trim()) {
          const trimmedTerm = searchTerm.trim();
          const searchParams = {
            ...filters,
            ...(trimmedTerm &&
              (() => {
                if (/^DV\d{3}$/.test(trimmedTerm)) {
                  return { maDichVu: trimmedTerm };
                } else {
                  return { tenDichVu: trimmedTerm };
                }
              })()),
          };
          data = await DichVuService.searchDichVu(searchParams, limit, offset);
        } else {
          data = await DichVuService.getAllDichVu(limit, offset);
        }

        setDichVuList(data);
        setPagination((prev) => ({ ...prev, limit, offset }));

        return data;
      } catch (error) {
        toast.error(error.message);
        setDichVuList([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    fetchDichVuList();
  }, [fetchDichVuList]);

  const handleSearch = async () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);

    const result = await fetchDichVuList(currentFilters, pagination.limit, 0);

    if (result?.length === 0) {
      toast.warning("Không tìm thấy dịch vụ nào phù hợp.");
      setSearchTerm("");
    } else {
      toast.success(`Đã tìm thấy: ${searchTerm}`);
    }
  };

  const handleAdd = () => {
    setMode("add");
    setSelectedDichVu(null);
    setIsDialogOpen(true);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = (filterParams) => {
    setCurrentFilters(filterParams);
    fetchDichVuList(filterParams, pagination.limit, 0);

    if (Object.keys(filterParams).length > 0) {
      toast.success("Đã áp dụng bộ lọc");
    } else {
      toast.info("Đã reset bộ lọc");
    }
  };

  const handleEdit = (dichVu) => {
    setMode("edit");
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

  const handleSaveDichVu = async (formData) => {
    try {
      setLoading(true);
      const dichVuData = {
        TenDichVu: formData.name,
        DonGia: Number(formData.price),
        TinhTrang: formData.status,
      };

      if (mode === "edit" && selectedDichVu) {
        await DichVuService.updateDichVu(selectedDichVu.MaDichVu, dichVuData);
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        await DichVuService.createDichVu(dichVuData);
        toast.success("Thêm dịch vụ thành công");
      }

      setIsDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(currentFilters, pagination.limit, pagination.offset);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptDelete = async () => {
    try {
      setLoading(true);
      const result = await DichVuService.deleteDichVu(selectedDichVu.MaDichVu);

      const toastByStatus = {
        "soft-deleted": toast.info,
        "already-soft-deleted": toast.warning,
        deleted: toast.success,
      };

      (toastByStatus[result.status] || toast.success)(result.message);

      setIsDeleteDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(currentFilters, pagination.limit, pagination.offset);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#063F5C", mb: 4 }}
      >
        Danh sách dịch vụ
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          mb: 3,
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Tìm tên hoặc mã dịch vụ ..."
        />

        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <DichVuFilter isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CustomTable
          data={dichVuList}
          columns={DichVuColumn}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DichVuDialog
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDichVu}
        title={mode === "edit" ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
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
