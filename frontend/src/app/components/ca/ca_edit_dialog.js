import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import DialogButtons from "../../components/Dialogbutton";
import { toast } from "react-toastify";
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
    GioBatDau: "",
    GioKetThuc: "",
  });

  const validateTime = useCallback((time) => {
    if (!time || !(time instanceof Date) || isNaN(time)) return false;
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
  }, []);

  const validateTimeField = useCallback((name, value) => {
    const timeStr = value instanceof Date ? value.toTimeString().slice(0, 8) : (value || "");
    if (timeStr && !validateTime(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Giờ phải trong khoảng 00:00:00 - 23:59:59",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [validateTime]);

  useEffect(() => {
    const parseTimeToDate = (timeStr) => {
      if (!timeStr || !/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
        return null; // Return null for invalid or missing time
      }
      const date = new Date(`1970-01-01T${timeStr}`);
      return isNaN(date) ? null : date;
    };

    if (ca) {
      const gioBatDau = parseTimeToDate(ca.GioBatDau) || new Date("1970-01-01T00:00:00");
      const gioKetThuc = parseTimeToDate(ca.GioKetThuc) || new Date("1970-01-01T23:59:59");

      setFormData({
        TenCa: ca.TenCa || "",
        GioBatDau: gioBatDau,
        GioKetThuc: gioKetThuc,
      });

      validateTimeField("GioBatDau", gioBatDau);
      validateTimeField("GioKetThuc", gioKetThuc);
    } else {
      setFormData({
        TenCa: "",
        GioBatDau: null,
        GioKetThuc: null,
      });
      setErrors({ GioBatDau: "", GioKetThuc: "" });
    }
  }, [ca, validateTimeField]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "GioBatDau" || name === "GioKetThuc") {
      // TimePicker passes a Date object directly as `value`
      setFormData({ ...formData, [name]: value });
      validateTimeField(name, value);
    } else {
      // FormTextField passes an event object; use the string value
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    const { TenCa, GioBatDau, GioKetThuc } = formData;
    if (!TenCa || !GioBatDau || !GioKetThuc) {
      toast.warn("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!validateTime(GioBatDau) || !validateTime(GioKetThuc)) {
      toast.error("Giờ phải trong khoảng 00:00:00 - 23:59:59!");
      return;
    }

    const formattedData = {
      TenCa,
      GioBatDau: GioBatDau.toTimeString().slice(0, 8),
      GioKetThuc: GioKetThuc.toTimeString().slice(0, 8),
    };
    onSave(formattedData);
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" flexDirection="column" gap={3.5}>
            <FormTextField
              label="Tên ca"
              name="TenCa"
              value={formData.TenCa}
              onChange={handleChange}
              fullWidth
            />

            <TimePicker
              label="Giờ bắt đầu"
              name="GioBatDau"
              value={formData.GioBatDau}
              onChange={(newValue) => handleChange({ target: { name: "GioBatDau", value: newValue } })}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
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
              name="GioKetThuc"
              value={formData.GioKetThuc}
              onChange={(newValue) => handleChange({ target: { name: "GioKetThuc", value: newValue } })}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  error={!!errors.GioKetThuc}
                  helperText={errors.GioKetThuc}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

        <Box mt={4}>
          <DialogButtons
            textCancel={"Hủy"}
            text={"Lưu"}
            onAction={handleSave}
            onCancel={onClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditCaDialog;