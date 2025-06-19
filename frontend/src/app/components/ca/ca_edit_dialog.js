import { useState, useEffect, useCallback } from "react";
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

  const [errors, setErrors] = useState({
    TenCa: "",
    GioBatDau: "",
    GioKetThuc: "",
  });
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
      } else if (!validateTime(value)) {
        newErrors.GioBatDau = 'Giờ phải trong khoảng 00:00:00 - 23:59:59';
      } else {
        delete newErrors.GioBatDau;
      }
    } else if (name === 'GioKetThuc') {
      if (!value) {
        newErrors.GioKetThuc = 'Giờ kết thúc là bắt buộc';
      } else if (!validateTime(value)) {
        newErrors.GioKetThuc = 'Giờ phải trong khoảng 00:00:00 - 23:59:59';
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
    } else if (!validateTime(formData.GioBatDau)) {
      newErrors.GioBatDau = 'Giờ phải trong khoảng 00:00:00 - 23:59:59';
    }

    // Validate GioKetThuc
    if (!formData.GioKetThuc) {
      newErrors.GioKetThuc = 'Giờ kết thúc là bắt buộc';
    } else if (!validateTime(formData.GioKetThuc)) {
      newErrors.GioKetThuc = 'Giờ phải trong khoảng 00:00:00 - 23:59:59';
    }

    // Validate giờ bắt đầu != giờ kết thúc
    if (formData.GioBatDau && formData.GioKetThuc && validateTime(formData.GioBatDau) && validateTime(formData.GioKetThuc)) {
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

  const validateTime = useCallback((time) => {
    if (!time || !(time instanceof Date) || isNaN(time)) return false;
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
  }, []);
  useEffect(() => {
    const parseTimeToDate = (timeStr) => {
      if (!timeStr || !/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
        return null; // Return null for invalid or missing time
      }
      const date = new Date(`1970-01-01T${timeStr}`);
      return isNaN(date) ? null : date;
    };

    if (ca) {
      const gioBatDau = parseTimeToDate(ca.GioBatDau);
      const gioKetThuc = parseTimeToDate(ca.GioKetThuc);

      setFormData({
        TenCa: ca.TenCa || "",
        GioBatDau: gioBatDau,
        GioKetThuc: gioKetThuc,
      });
    } else {
      setFormData({
        TenCa: "",
        GioBatDau: null,
        GioKetThuc: null,
      });
    }
    
    // Reset errors when dialog opens/closes
    setErrors({
      TenCa: "",
      GioBatDau: "",
      GioKetThuc: "",
    });  }, [ca]);

  // Reset form when dialog closes
  const resetForm = () => {
    setFormData({
      TenCa: "",
      GioBatDau: null,
      GioKetThuc: null,
    });
    setErrors({
      TenCa: "",
      GioBatDau: "",
      GioKetThuc: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleTimeChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };  const handleSave = async () => {
    // Validate all fields at once when Save is clicked
    if (!validateForm()) {
      return;
    }

    const formattedData = {
      TenCa: formData.TenCa.trim(),
      GioBatDau: formData.GioBatDau ? formData.GioBatDau.toTimeString().slice(0, 8) : null,
      GioKetThuc: formData.GioKetThuc ? formData.GioKetThuc.toTimeString().slice(0, 8) : null,
    };

    try {
      const result = await onSave(formattedData);
      
      // Reset form after successful save (only for add mode)
      if (result && result.success && !ca) {
        setFormData({
          TenCa: "",
          GioBatDau: null,
          GioKetThuc: null,
        });
        setErrors({
          TenCa: "",
          GioBatDau: "",
          GioKetThuc: "",
        });
      }
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error saving ca:', error);
    }
  };

  return (    <Dialog
      open={open}
      onClose={handleClose}
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
      <DialogTitleCustom title={title} onClose={handleClose} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" flexDirection="column" gap={3.5}>
            <FormTextField
              label="Tên ca"
              name="TenCa"
              value={formData.TenCa}
              onChange={handleChange}
              fullWidth
              error={!!errors.TenCa}
              helperText={errors.TenCa}
              sx={{
                '& .MuiFormLabel-root.Mui-error': {
                  color: '#d32f2f',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: '#d32f2f',
                }
              }}
            />

            <TimePicker
              label="Giờ bắt đầu"
              name="GioBatDau"
              value={formData.GioBatDau}
              onChange={(newValue) => handleTimeChange("GioBatDau", newValue)}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.GioBatDau,
                  helperText: errors.GioBatDau,
                }
              }}
            />

            <TimePicker
              label="Giờ kết thúc"
              name="GioKetThuc"
              value={formData.GioKetThuc}
              onChange={(newValue) => handleTimeChange("GioKetThuc", newValue)}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.GioKetThuc,
                  helperText: errors.GioKetThuc,
                }
              }}
            />
          </Box>
        </LocalizationProvider>

        <Box mt={4}>          <DialogButtons
            textCancel={"Hủy"}
            text={"Lưu"}
            onAction={handleSave}
            onCancel={handleClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditCaDialog;