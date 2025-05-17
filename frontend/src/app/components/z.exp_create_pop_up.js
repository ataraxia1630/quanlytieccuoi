// Mở popup chỉnh sửa hoặc thêm
import { useState } from "react";
import { Dialog, DialogContent, Box, Divider } from "@mui/material";
import DialogTitleCustom from "../../components/Dialogtitlecustom";
import FormTextField from "../../components/Formtextfield";
import SelectFieldCustom from "../../components/Selectfieldcustom";
import ImageUploadField from "../../components/Imageuploadfield";
import DialogButtons from "../../components/Dialogbutton";

// Danh sách các tùy chọn tình trạng trong popup
const statusOptions = [
  "Còn hàng",
  "Hết hàng",
  "Ngừng bán",
  "Đang bảo trì",
  "Đang sửa chữa",
  "Tạm ngưng",
  "Chờ kiểm tra",
  "Đợi xác nhận",
  "Sắp ra mắt",
];

const EditDishDialog = ({ open, onClose, onSave, title }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  return (
    <Dialog
      open={open} // Kiên tra xem hộp thoại có mở hay không
      onClose={onClose} // Đóng hộp thoại khi nhấn nút hủy
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
      {/* Tiêu đề của popup, title truyền trong page */}
      <DialogTitleCustom title={title} onClose={onClose} />

      <Divider sx={{ borderColor: "#063F5C", borderBottomWidth: "1.3px" }} />

      {/* Nội dung của popup */}
      <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
          <FormTextField
            label="Tên món ăn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <ImageUploadField
            imagePath={image?.name || ""}
            onClear={handleClearImage}
            onSelect={handleImageSelect}
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
          />

          <SelectFieldCustom
            label="Tình trạng"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={"Hủy"}
            text={"Lưu"}
            onCancel={onClose}
            onSave={onSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditDishDialog;
