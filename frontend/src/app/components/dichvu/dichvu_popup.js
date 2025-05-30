import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../Dialogtitlecustom";
import FormTextField from "../Formtextfield";
import SelectFieldCustom from "../Selectfieldcustom";
import DialogButtons from "../Dialogbutton";

const statusOptions = ["Có sẵn", "Tạm dừng", "Ngừng cung cấp"];

const DichVuDialog = ({
  open,
  onClose,
  onSave,
  title,
  initialData = null,
  mode = "add",
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setName(initialData.TenDichVu || "");
        setPrice(initialData.DonGia?.toString() || "");
        setStatus(initialData.TinhTrang || "");
      } else {
        setName("");
        setPrice("");
        setStatus("");
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Tên dịch vụ không được để trống";
    } else if (name.trim().length > 100) {
      newErrors.name = "Tên dịch vụ không được vượt quá 100 ký tự";
    }

    if (!price.trim()) {
      newErrors.price = "Giá không được để trống";
    } else if (isNaN(price) || Number(price) < 0) {
      newErrors.price = "Giá phải là số không âm";
    }

    if (!status) {
      newErrors.status = "Vui lòng chọn tình trạng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        name: name.trim(),
        price: Number(price),
        status: status,
      };
      onSave(formData);
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 10,
          p: 0,
          border: "2px solid #063F5C",
          width: "100%",
          maxWidth: "430px",
        },
      }}
    >
      <DialogTitleCustom title={title} onClose={handleCancel} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      <DialogContent sx={{ pt: 4.5, px: 5, pb: 3.5 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
          <FormTextField
            label="Tên dịch vụ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <FormTextField
            label="Giá"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            InputProps={{
              endAdornment: <span style={{ marginLeft: 4 }}>VNĐ</span>,
            }}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{
              min: 0,
              step: 1000,
            }}
          />

          <SelectFieldCustom
            label="Tình trạng"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            error={!!errors.status}
            helperText={errors.status}
          />
        </Box>

        <Box mt={4.5}>
          <DialogButtons
            textCancel="Hủy"
            text="Lưu"
            onCancel={handleCancel}
            onAction={handleSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DichVuDialog;
