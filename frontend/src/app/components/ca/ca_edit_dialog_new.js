import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import DialogButtons from "../../components/Dialogbutton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const EditCaDialog = ({ open, onClose, onSave, title, ca }) => {
  const [formData, setFormData] = useState({
    TenCa: ca?.TenCa || "",
    GioBatDau: ca?.GioBatDau ? new Date(`1970-01-01T${ca.GioBatDau}`) : null,
    GioKetThuc: ca?.GioKetThuc ? new Date(`1970-01-01T${ca.GioKetThuc}`) : null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ca) {
      setFormData({
        TenCa: ca.TenCa || "",
        GioBatDau: ca.GioBatDau ? new Date(`1970-01-01T${ca.GioBatDau}`) : null,
        GioKetThuc: ca.GioKetThuc ? new Date(`1970-01-01T${ca.GioKetThuc}`) : null,
      });
    } else {
      setFormData({
        TenCa: "",
        GioBatDau: null,
        GioKetThuc: null,
      });
    }
    // Clear errors when dialog opens/closes
    setErrors({});
  }, [ca, open]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (name === 'TenCa') {
      const tenCaValue = value || '';
      if (!tenCaValue || (typeof tenCaValue === 'string' && !tenCaValue.trim())) {
        newErrors.TenCa = 'Tên ca là bắt buộc';
      } else if (tenCaValue.length > 50) {
        newErrors.TenCa = 'Tên ca tối đa 50 ký tự';
      } else {
        delete newErrors.TenCa;
      }
    } else if (name === 'GioBatDau') {
      if (!value) {
        newErrors.GioBatDau = 'Giờ bắt đầu là bắt buộc';
      } else {
        delete newErrors.GioBatDau;
      }
    } else if (name === 'GioKetThuc') {
      if (!value) {
        newErrors.GioKetThuc = 'Giờ kết thúc là bắt buộc';
      } else {
        delete newErrors.GioKetThuc;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate TenCa
    const tenCaValue = formData.TenCa || '';
    if (!tenCaValue || (typeof tenCaValue === 'string' && !tenCaValue.trim())) {
      newErrors.TenCa = 'Tên ca là bắt buộc';
    } else if (tenCaValue.length > 50) {
      newErrors.TenCa = 'Tên ca tối đa 50 ký tự';
    }

    // Validate GioBatDau
    if (!formData.GioBatDau) {
      newErrors.GioBatDau = 'Giờ bắt đầu là bắt buộc';
    }

    // Validate GioKetThuc
    if (!formData.GioKetThuc) {
      newErrors.GioKetThuc = 'Giờ kết thúc là bắt buộc';
    }

    // Validate giờ bắt đầu != giờ kết thúc
    if (formData.GioBatDau && formData.GioKetThuc) {
      const startTime = formData.GioBatDau.toTimeString().slice(0, 8);
      const endTime = formData.GioKetThuc.toTimeString().slice(0, 8);
      if (startTime === endTime) {
        newErrors.GioBatDau = 'Giờ bắt đầu không được bằng giờ kết thúc';
        newErrors.GioKetThuc = 'Giờ kết thúc không được bằng giờ bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleTimeChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSave = async () => {
    // Validate all fields at once when Save is clicked
    if (!validateForm()) {
      return;
    }

    const caData = {
      TenCa: formData.TenCa.trim(),
      GioBatDau: formData.GioBatDau ? formData.GioBatDau.toTimeString().slice(0, 8) : null,
      GioKetThuc: formData.GioKetThuc ? formData.GioKetThuc.toTimeString().slice(0, 8) : null,
    };

    onSave(caData);
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
            label="Tên ca"
            name="TenCa"
            value={formData.TenCa}
            onChange={handleChange}
            fullWidth
            error={!!errors.TenCa}
            helperText={errors.TenCa}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Giờ bắt đầu"
              value={formData.GioBatDau}
              onChange={(value) => handleTimeChange('GioBatDau', value)}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  error={!!errors.GioBatDau}
                  helperText={errors.GioBatDau}
                />
              )}
            />

            <TimePicker
              label="Giờ kết thúc"
              value={formData.GioKetThuc}
              onChange={(value) => handleTimeChange('GioKetThuc', value)}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  error={!!errors.GioKetThuc}
                  helperText={errors.GioKetThuc}
                />
              )}
            />
          </LocalizationProvider>
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

export default EditCaDialog;
