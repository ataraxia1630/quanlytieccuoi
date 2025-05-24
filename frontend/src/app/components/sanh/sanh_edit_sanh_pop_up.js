import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import SelectFieldCustom from "./sanh_select_field";
import ImageUploadField from "../../components/Imageuploadfield";
import DialogButtons from "../../components/Dialogbutton";
import sanhService from "../../service/sanh.service";
import { toast } from "react-toastify";

const EditSanhDialog = ({ open, onClose, onSave, title, sanh }) => {
  const [formData, setFormData] = useState({
    MaSanh: sanh?.MaSanh || "",
    TenSanh: sanh?.TenSanh || "",
    MaLoaiSanh: sanh?.MaLoaiSanh || "",
    SoLuongBanToiDa: sanh?.SoLuongBanToiDa || "",
    GhiChu: sanh?.GhiChu || "",
    HinhAnh: null,
  });
  const [loaiSanhOptions, setLoaiSanhOptions] = useState(["LS001", "LS002", "LS003"]); // Default options

  useEffect(() => {
    if (sanh) {
      setFormData({
        MaSanh: sanh.MaSanh || "",
        TenSanh: sanh.TenSanh || "",
        MaLoaiSanh: sanh.MaLoaiSanh || "",
        SoLuongBanToiDa: sanh.SoLuongBanToiDa || "",
        GhiChu: sanh.GhiChu || "",
        HinhAnh: null,
      });
    } else {
      setFormData({
        MaSanh: "",
        TenSanh: "",
        MaLoaiSanh: "",
        SoLuongBanToiDa: "",
        GhiChu: "",
        HinhAnh: null,
      });
    }

    const fetchLoaiSanh = async () => {
      try {
        const response = await sanhService.getAllLoaiSanh();
        const loaiSanhData = await response.data;
        console.log("Dữ liệu loại sảnh từ API (đã trích xuất data):", loaiSanhData);

        const options = loaiSanhData.map((loai) => ({
          value: loai.MaLoaiSanh,
          label: loai.TenLoaiSanh || loai.MaLoaiSanh,
        }));
        setLoaiSanhOptions(options);
      } catch (error) {
        console.error("Error fetching loai sanh options:", error.message);
        toast.error("Có lỗi xảy ra khi tải loại sảnh.");
      }
    };
    fetchLoaiSanh();
  }, [sanh]);

  const handleChange = (e) => {
    console.log("Field changed:", e.target.name, "Value:", e.target.value);
    if(e.target.name === "SoLuongBanToiDa") {
      const value = e.target.value.replace(/\D/g, "");
      setFormData({ ...formData, [e.target.name]: value });
    }
    else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file, "instanceof File:", file instanceof File);
    if (file) {
      setFormData({ ...formData, HinhAnh: file });
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, HinhAnh: null });
  };

  const handleSave = async () => {
    console.log("Saving formData:", formData, "HinhAnh instanceof File:", formData.HinhAnh instanceof File);
    if (!formData.MaSanh || !formData.TenSanh || !formData.MaLoaiSanh || !formData.SoLuongBanToiDa) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 10,
          p: 0,
          border: "2px solid #063F5C",
          width: "100%",
          maxWidth: "450px",
        },
      }}
    >
      <DialogTitleCustom title={title} onClose={onClose} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
          <FormTextField
            label="Mã sảnh"
            name="MaSanh"
            value={formData.MaSanh}
            onChange={handleChange}
            fullWidth
            disabled={!!sanh}
          />

          <FormTextField
            label="Tên sảnh"
            name="TenSanh"
            value={formData.TenSanh}
            onChange={handleChange}
            fullWidth
          />

          <SelectFieldCustom
            label="Mã loại sảnh"
            name="MaLoaiSanh"
            options={loaiSanhOptions}
            value={formData.MaLoaiSanh}
            onChange={handleChange}
            fullWidth
          />

          <FormTextField
            label="Số lượng bàn tối đa"
            name="SoLuongBanToiDa"
            type="text"
            value={formData.SoLuongBanToiDa}
            onChange={handleChange}
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          />

          <ImageUploadField
            imagePath={formData.HinhAnh?.name || sanh?.HinhAnh || ""}
            onClear={handleClearImage}
            onSelect={handleImageSelect}
          />

          <FormTextField
            label="Ghi chú"
            name="GhiChu"
            value={formData.GhiChu}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={"Hủy"}
            text={"Lưu"}
            onCancel={onClose}
            onSave={handleSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default EditSanhDialog;