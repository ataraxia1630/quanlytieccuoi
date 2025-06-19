import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import SelectFieldCustom from "./sanh_select_field";
import ImageUploadField from "../../components/Imageuploadfield";
import DialogButtons from "../../components/Dialogbutton";
import sanhService from "../../service/sanh.service";
import toastService from "../../service/toast/toast.service";

const EditSanhDialog = ({ open, onClose, onSave, title, sanh }) => {
  const [formData, setFormData] = useState({
    TenSanh: sanh?.TenSanh || "",
    MaLoaiSanh: sanh?.MaLoaiSanh || "",
    SoLuongBanToiDa: sanh?.SoLuongBanToiDa || "",
    GhiChu: sanh?.GhiChu || "",
    HinhAnh: null,
  });
  const [loaiSanhOptions, setLoaiSanhOptions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sanh) {
      setFormData({
        TenSanh: sanh.TenSanh || "",
        MaLoaiSanh: sanh.MaLoaiSanh || "",
        SoLuongBanToiDa: sanh.SoLuongBanToiDa || "",
        GhiChu: sanh.GhiChu || "",
        HinhAnh: null,
      });
    } else {
      setFormData({
        TenSanh: "",
        MaLoaiSanh: "",
        SoLuongBanToiDa: "",
        GhiChu: "",
        HinhAnh: null,
      });
    }
    // Clear errors when dialog opens/closes
    setErrors({});

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
        toastService.error("Có lỗi xảy ra khi tải loại sảnh");
      }
    };
    fetchLoaiSanh();
  }, [sanh, open]); // Thêm open dependency để reset khi dialog mở

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (name === 'TenSanh') {
      const tenSanhValue = value || '';
      if (!tenSanhValue || (typeof tenSanhValue === 'string' && !tenSanhValue.trim())) {
        newErrors.TenSanh = 'Tên sảnh là bắt buộc';
      } else if (tenSanhValue.length > 100) {
        newErrors.TenSanh = 'Tên sảnh tối đa 100 ký tự';
      } else {
        delete newErrors.TenSanh;
      }
    } else if (name === 'MaLoaiSanh') {
      if (!value) {
        newErrors.MaLoaiSanh = 'Loại sảnh là bắt buộc';
      } else {
        delete newErrors.MaLoaiSanh;
      }
    } else if (name === 'SoLuongBanToiDa') {
      const soLuongValue = value || '';
      if (!soLuongValue || soLuongValue.toString().trim() === '') {
        newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa là bắt buộc';
      } else if (parseInt(soLuongValue) < 1) {
        newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa phải lớn hơn 0';
      } else if (parseInt(soLuongValue) > 255) {
        newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa không được vượt quá 255';
      } else {
        delete newErrors.SoLuongBanToiDa;
      }
    } else if (name === 'GhiChu') {
      const ghiChuValue = value || '';
      if (ghiChuValue.length > 255) {
        newErrors.GhiChu = 'Ghi chú tối đa 255 ký tự';
      } else {
        delete newErrors.GhiChu;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate TenSanh
    const tenSanhValue = formData.TenSanh || '';
    if (!tenSanhValue || (typeof tenSanhValue === 'string' && !tenSanhValue.trim())) {
      newErrors.TenSanh = 'Tên sảnh là bắt buộc';
    } else if (tenSanhValue.length > 100) {
      newErrors.TenSanh = 'Tên sảnh tối đa 100 ký tự';
    }

    // Validate MaLoaiSanh
    if (!formData.MaLoaiSanh) {
      newErrors.MaLoaiSanh = 'Loại sảnh là bắt buộc';
    }

    // Validate SoLuongBanToiDa
    const soLuongValue = formData.SoLuongBanToiDa || '';
    if (!soLuongValue || soLuongValue.toString().trim() === '') {
      newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa là bắt buộc';
    } else if (parseInt(soLuongValue) < 1) {
      newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa phải lớn hơn 0';
    } else if (parseInt(soLuongValue) > 255) {
      newErrors.SoLuongBanToiDa = 'Số lượng bàn tối đa không được vượt quá 255';
    }

    // Validate GhiChu (optional but check length)
    const ghiChuValue = formData.GhiChu || '';
    if (ghiChuValue.length > 255) {
      newErrors.GhiChu = 'Ghi chú tối đa 255 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    console.log("Field changed:", e.target.name, "Value:", e.target.value);
    const { name, value } = e.target;
    
    if (name === "SoLuongBanToiDa") {
      // Chỉ cho phép nhập số
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
      validateField(name, numericValue);
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
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
    
    // Validate all fields at once when Save is clicked
    if (!validateForm()) {
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
            label="Tên sảnh"
            name="TenSanh"
            value={formData.TenSanh}
            onChange={handleChange}
            fullWidth
            error={!!errors.TenSanh}
            helperText={errors.TenSanh}
          />

          <SelectFieldCustom
            label="Loại sảnh"
            name="MaLoaiSanh"
            options={loaiSanhOptions}
            value={formData.MaLoaiSanh}
            onChange={handleChange}
            fullWidth
            error={!!errors.MaLoaiSanh}
            helperText={errors.MaLoaiSanh}
          />

          <FormTextField
            label="Số lượng bàn tối đa"
            name="SoLuongBanToiDa"
            type="text"
            value={formData.SoLuongBanToiDa}
            onChange={handleChange}
            fullWidth
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            error={!!errors.SoLuongBanToiDa}
            helperText={errors.SoLuongBanToiDa}
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
            error={!!errors.GhiChu}
            helperText={errors.GhiChu}
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={"Hủy"}
            text={"Lưu"}
            onCancel={onClose}
            onAction={handleSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditSanhDialog;
