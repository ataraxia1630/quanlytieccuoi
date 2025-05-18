import { useState } from "react";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import FilterPanel from "../../components/z.exp_create_filter_panel";
import EditDishDialog from "../../components/z.exp_create_pop_up";
import defaultColumns from "../../components/z.exp_create_column";

function DanhSachDichVu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("add");

  const handleSearch = () => {
    // Gọi hàm khi người dùng tìm kiếm
    console.log("Searching for:", searchTerm);
  };

  const handleAdd = () => {
    // Gọi hàm khi người dùng nhấn nút thêm
    setDishToEdit(null);
    setOpenDialog(true);
    console.log("Add button clicked");
    setMode("add");
  };

  const handleFilter = () => {
    // Mở hoặc đóng bảng lọc khi người dùng nhấn nút lọc
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilter = () => {
    // Gọi hàm khi người dùng áp dụng bộ lọc
    console.log("Applied filters");
  };

  const handleEdit = () => {
    // Gọi hàm khi người dùng nhấn nút chỉnh sửa trong bảng
    console.log("Edit row");
    setDishToEdit();
    setOpenDialog(true);
    setMode("edit");
  };
  const handleDelete = () => {
    // Gọi hàm khi người dùng nhấn nút xóa trong bảng
    console.log("Delete row");
  };

  const handleCloseDialog = () => {
    // Đóng pop up khi người dùng nhấn nút hủy
    setOpenDialog(false);
    setDishToEdit(null);
  };

  const handleSaveDish = () => {
    // Gọi hàm khi người dùng nhấn nút lưu trong pop up
    console.log("Saved dish");
    setOpenDialog(false);
  };

  // Dữ liệu mẫu cho bảng, thay thế bằng dữ liệu từ API
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
      {/* Tiêu đề */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#063F5C", mb: 4 }}
      >
        Danh sách tiệc cưới
      </Typography>

      {/* Thanh tìm kiếm và nút thêm */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          mb: 3, // margin bottom
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Tìm tên hoặc mã dịch vụ ..." // Nội dung trong ô tìm kiếm
        />

        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          {/* Nút lọc ngang thanh tìm kiếm */}
          <FilterButton onClick={handleFilter} text="Filter" />

          {/* Nút thêm ngang thanh tìm kiếm */}
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <FilterPanel isOpen={isFilterOpen} onApply={handleApplyFilter} />

      {/* Bảng hiển thị danh sách */}
      <CustomTable
        data={sampleData}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pop up thêm hoặc chỉnh sửa món ăn */}
      <EditDishDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveDish}
        title={mode === "edit" ? "Chỉnh sửa món ăn" : "Thêm món ăn"} // Tiêu đề của pop up
      />
    </Box>
  );
}

export default DanhSachDichVu;
