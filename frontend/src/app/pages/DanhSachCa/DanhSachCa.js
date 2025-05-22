import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import FilterPanel from "../../components/ca/ca_filter_panel";
import EditCaDialog from "../../components/ca/ca_edit_dialog";
import defaultColumns from "../../components/ca/ca_default_column";
import caService from "../../service/ca.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteDialog from "../../components/z.exp_create_dialog_delete";

function DanhSachCa() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [cas, setCas] = useState([]);
  const [caToEdit, setCaToEdit] = useState(null);

  useEffect(() => {
    fetchCas();
  }, []);

  const fetchCas = async () => {
    try {
      toast.info("Đang xử lý …");
      const data = await caService.getAllCa();
      setCas(data);
      toast.success("Tải danh sách ca thành công!");
    } catch (error) {
      console.error("Error fetching cas:", error.message);
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleSearch = () => {
    searchAndFilter();
  };

  const handleAdd = () => {
    setCaToEdit(null);
    setOpenDialog(true);
    setMode("add");
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = async (filters) => {
    searchAndFilter(filters);
  };

  const searchAndFilter = async (filters = {}) => {
    try {
      const searchParams = {
        tenCa: searchTerm || "",
        maCa: searchTerm || "",
        gioBatDau: filters.gioBatDau || "",
        gioKetThuc: filters.gioKetThuc || "",
        sortBy: filters.sortBy || "",
        sortOrder: filters.sortOrder || "",
      };
      console.log("Search params:", searchParams); // Debug log
      const data = await caService.searchAndFilterCa(searchParams);
      setCas(data);
      toast.success("Tìm kiếm thành công!");
    } catch (error) {
      console.error("Search error:", error.message);
      toast.error("Có lỗi xảy ra: " + error.message);
    }
  };

  const handleEdit = (ca) => {
    console.log("Editing ca with maCa:", ca.MaCa);
    setCaToEdit(ca);
    setOpenDialog(true);
    setMode("edit");
  };

  const handleDelete = (ca) => {
    console.log("Deleting ca with maCa:", ca.MaCa);
    setCaToEdit(ca); // Store the ca to delete
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCaToEdit(null); // Clear the ca to delete
  };

  const handleConfirmDelete = async () => {
    try {
      toast.info("Đang xử lý …");
      await caService.deleteCa(caToEdit.MaCa);
      await fetchCas();
      toast.success("Xóa thành công!");
      setIsDeleteDialogOpen(false);
      setCaToEdit(null);
    } catch (error) {
      if (error.message.includes("Không tìm thấy ca")) {
        toast.warn("Không tìm thấy ca!");
      } else {
        toast.error("Xóa thất bại! Vui lòng thử lại.");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCaToEdit(null);
  };

  const handleSaveCa = async (caData) => {
    try {
      console.log("handleSaveCa received caData:", caData);

      if (!caData.MaCa || !caData.TenCa || !caData.GioBatDau || !caData.GioKetThuc) {
        toast.warn("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      toast.info("Đang gửi yêu cầu …");
      console.log("Sending update with data:", caData);

      if (mode === "edit") {
        const updatedCa = await caService.updateCa(caToEdit.MaCa, caData);
        setCas(cas.map((c) => c.MaCa === caToEdit.MaCa ? updatedCa : c));
        await fetchCas();
        toast.success("Cập nhật thành công!");
      } else {
        const newCa = await caService.createCa(caData);
        setCas([...cas, newCa]);
        await fetchCas();
        toast.success("Thêm mới thành công!");
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.message.includes("Không tìm thấy ca")) {
        toast.error("Cập nhật thất bại! Không tìm thấy ca.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#063F5C", mb: 4 }}
      >
        Danh sách ca
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
          placeholder="Tìm tên hoặc mã ca ..."
        />

        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      <CustomTable
        data={cas}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditCaDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveCa}
        ca={caToEdit}
        title={mode === "edit" ? "Chỉnh sửa ca" : "Thêm ca"}
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