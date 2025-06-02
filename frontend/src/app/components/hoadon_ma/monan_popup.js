import { useState, useEffect } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../Dialogtitlecustom";
import FormTextField from "../Formtextfield";
import DialogButtons from "../Dialogbutton";


const MonAnDialog = ({
  open,
  onClose,
  onSave,
  title,
  initialData = null,
  mode = "add",
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sl, setSL] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
        setPrice(initialData.DonGia || "");
      
      if (mode === "edit" && initialData) {
        setSL(initialData.SoLuong || "");
      } else {
        setSL("");
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!price.trim()) {
      newErrors.price = "Giá không được để trống";
    } else if (isNaN(price) || Number(price) < 0) {
      newErrors.price = "Giá phải là số không âm";
    }
    if (!sl) {
      newErrors.sl = "Vui lòng chọn số lượng!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        name: (initialData?.DichVu?.TenDichVu && initialData.DichVu.TenDichVu) || '',
        price: Number(price),
        sl: sl,
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
        {initialData?.MonAn?.TenMonAn && (
          <strong style={{ fontSize: '16px', color: '#063F5C' }}>
            {initialData.MonAn.TenMonAn}
          </strong>
        )}

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
          <FormTextField
            label="Số lượng"
            type="number"
            value={sl}
            onChange={(e) => setSL(e.target.value)}
            fullWidth
            error={!!errors.price}
            helperText={errors.sl}
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

export default MonAnDialog;
