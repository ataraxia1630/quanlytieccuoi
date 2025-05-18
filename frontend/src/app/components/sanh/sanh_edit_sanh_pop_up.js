import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import SelectFieldCustom from "../../components/Selectfieldcustom";
import ImageUploadField from "../../components/Imageuploadfield";
import DialogButtons from "../../components/Dialogbutton";
import sanhService from "../../service/sanh.service";

const EditSanhDialog = ({ open, onClose, onSave, title, sanh }) => {
  const [formData, setFormData] = useState({
    MaSanh: sanh?.MaSanh || "",
    TenSanh: sanh?.TenSanh || "",
    MaLoaiSanh: sanh?.MaLoaiSanh || "",
    SoLuongBanToiDa: sanh?.SoLuongBanToiDa || "",
    GhiChu: sanh?.GhiChu || "",
    HinhAnh: null,
  });

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
    }
  }, [sanh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, HinhAnh: file });
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, HinhAnh: null });
  };

  const handleSave = async () => {
    if (formData.HinhAnh && formData.MaSanh) {
      await sanhService.uploadImage(formData.MaSanh, formData.HinhAnh);
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
            options={["LS001", "LS002", "LS003"]}
            value={formData.MaLoaiSanh}
            onChange={handleChange}
            fullWidth
          />

          <FormTextField
            label="Số lượng bàn tối đa"
            name="SoLuongBanToiDa"
            type="number"
            value={formData.SoLuongBanToiDa}
            onChange={handleChange}
            fullWidth
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