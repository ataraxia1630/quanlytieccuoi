import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SearchBar from "../../components/Searchbar";
import FilterButton from "../../components/Filterbutton";
import AddButton from "../../components/Addbutton";
import CustomTable from "../../components/Customtable";
import FilterPanel from "../../components/sanh/sanh_filter_panel";
import EditSanhDialog from "../../components/sanh/sanh_edit_sanh_pop_up";
import defaultColumns from "../../components/sanh/sanh_default_column";
import sanhService from "../../service/sanh.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DanhSachSanh() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [mode, setMode] = useState("add");
  const [sanhs, setSanhs] = useState([]);
  const [sanhToEdit, setSanhToEdit] = useState(null);

  useEffect(() => {
    fetchSanhs();
  }, []);

  const fetchSanhs = async () => {
    try {
      toast.info("Đang xử lý …");
      const data = await sanhService.getAllSanh();
      setSanhs(data);
      toast.success("Tải danh sách sảnh thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  const handleSearch = () => {
    searchAndFilter();
  };

  const handleAdd = () => {
    setSanhToEdit(null);
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
      const data = await sanhService.searchAndFilterSanh({
        tenSanh: searchTerm,
        ...filters,
      });
      setSanhs(data);
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  const handleEdit = (sanh) => {
    setSanhToEdit(sanh);
    setOpenDialog(true);
    setMode("edit");
  };

  const handleDelete = (maSanh) => {
    const confirmDelete = () => {
      toast(
        ({ closeToast }) => (
          <div>
            <p>Bạn có chắc chắn muốn xóa sảnh này?</p>
            <button
              className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
              onClick={async () => {
                closeToast();
                try {
                  toast.info("Đang xử lý …");
                  await sanhService.deleteSanh(maSanh);
                  setSanhs(sanhs.filter((s) => s.MaSanh !== maSanh));
                  toast.success("Xóa thành công!");
                } catch (error) {
                  if (error.message.includes("Không tìm thấy sảnh")) {
                    toast.warn("Không tìm thấy sảnh!");
                  } else {
                    toast.error("Xóa thất bại! Vui lòng thử lại.");
                  }
                }
              }}
            >
              Có
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded"
              onClick={closeToast}
            >
              Không
            </button>
          </div>
        ),
        { autoClose: false }
      );
    };
    confirmDelete();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSanhToEdit(null);
  };

  const handleSaveSanh = async (sanhData) => {
    try {
      if (!sanhData.MaSanh || !sanhData.TenSanh || !sanhData.MaLoaiSanh || !sanhData.SoLuongBanToiDa) {
        toast.warn("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      toast.info("Đang gửi yêu cầu …");
      if (mode === "edit") {
        await sanhService.updateSanh(sanhToEdit.MaSanh, sanhData);
        setSanhs(
          sanhs.map((s) =>
            s.MaSanh === sanhToEdit.MaSanh ? { ...s, ...sanhData } : s
          )
        );
        toast.success("Cập nhật thành công!");
      } else {
        const newSanh = await sanhService.createSanh(sanhData);
        setSanhs([...sanhs, newSanh]);
        toast.success("Thêm mới thành công!");
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.message.includes("Không tìm thấy sảnh")) {
        toast.error("Cập nhật thất bại! Không tìm thấy sảnh.");
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
        Danh sách sảnh
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
          placeholder="Tìm tên hoặc mã sảnh ..."
        />

        <Box sx={{ display: "flex", gap: "17px", justifyContent: "flex-end" }}>
          <FilterButton onClick={handleFilter} text="Filter" />
          <AddButton onClick={handleAdd} text="Thêm" />
        </Box>
      </Box>

      <FilterPanel
        isOpen={isFilterOpen}
        onApply={handleApplyFilter}
        options={{ maLoaiSanh: ["LS001", "LS002", "LS003"] }}
      />

      <CustomTable
        data={sanhs}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditSanhDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveSanh}
        sanh={sanhToEdit}
        title={mode === "edit" ? "Chỉnh sửa sảnh" : "Thêm sảnh"}
      />
    </Box>
  );
}

export default DanhSachSanh;