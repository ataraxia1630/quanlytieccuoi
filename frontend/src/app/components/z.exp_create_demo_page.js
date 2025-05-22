import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import FilterPanel from "../../components/z.exp_create_filter_panel";
import EditDishDialog from "../../components/z.exp_create_pop_up";
import defaultColumns from "../../components/z.exp_create_column";
import DeleteDialog from "../../components/z.exp_create_dialog_delete";

function DanhSachDichVu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState("add");

  const handleSearch = () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);
  };

  const handleAdd = () => {
    setMode("add");
    setIsEditDialogOpen(true);
    toast.success("Thêm món ăn mới");
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = () => {
    toast.success("Đã áp dụng bộ lọc");
  };

  const handleEdit = () => {
    setMode("edit");
    setIsEditDialogOpen(true);
    toast.info("Chỉnh sửa món ăn");
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    toast.warn("Bạn sắp xóa món ăn này");
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    toast.info("Đã hủy xóa");
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    toast.info("Đã đóng chỉnh sửa");
  };

  const handleSaveDish = () => {
    toast.success(mode === "edit" ? "Đã lưu chỉnh sửa" : "Đã thêm món ăn");
    setIsEditDialogOpen(false);
  };

  const acceptDelete = () => {
    toast.success("Đã xóa thành công");
    setIsDeleteDialogOpen(false);
  };

  const sampleData = [
    {
      id: "M001",
      name: "Cá quả chiên sốt Thái",
      image:
        "https://product.hstatic.net/200000561069/product/ca_chem_sot_goi_xoai-compressed_27089c6f57b4492782a554b74e414b2f_master.jpg",
      price: 115000,
      status: "Còn hàng",
    },
    {
      id: "M002",
      name: "Súp gà nấm hương",
      image: "/path/to/image2.jpg",
      price: 65000,
      status: "Hết hàng",
    },
    {
      id: "M003",
      name: "Salad hoàng đế",
      image: "/path/to/image3.jpg",
      price: 145000,
      status: "Còn hàng",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#063F5C", mb: 4 }}
      >
        Danh sách tiệc cưới
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

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      <CustomTable
        data={sampleData}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditDishDialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveDish}
        title={mode === "edit" ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title={"Xác nhận xóa"}
      />
    </Box>
  );
}

export default DanhSachDichVu;
