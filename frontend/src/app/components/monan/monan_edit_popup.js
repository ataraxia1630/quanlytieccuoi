// Mở popup chỉnh sửa hoặc thêm
import { useState } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import SelectFieldCustom from '../Selectfieldcustom';
import ImageUploadField from '../Imageuploadfield';
import DialogButtons from '../Dialogbutton';

// Danh sách các tùy chọn tình trạng trong popup
const statusOptions = ['Còn hàng', 'Tạm hết hàng', 'Ngừng bán'];

const EditDishPopUp = ({ open, onClose, onSave, title }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

  const handleChange = (e) => {
    setError(''); // Xóa lỗi tạm thời khi đang nhập
  };

  // Thông báo khi người dùng nhập sai
  const handleBlur = () => {};

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
          border: '2px solid #063F5C',
          width: '100%',
          maxWidth: '450px',
        },
      }}
    >
      {/* Tiêu đề của popup, title truyền trong page */}
      <DialogTitleCustom title={title} onClose={onClose} />

      <Divider sx={{ borderColor: '#063F5C', borderBottomWidth: '1.3px' }} />

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
            imagePath={image?.name || ''}
            onClear={handleClearImage}
            onSelect={handleImageSelect}
          />

          <FormTextField
            label="Giá"
            type="number" // Thay đổi kiểu nhập thành số nếu là giá trị số
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            // Bỏ InputProps nếu không có VNĐ
            InputProps={{
              endAdornment: <span style={{ marginLeft: 4 }}>VNĐ</span>,
            }}
            fullWidth
          />

          <SelectFieldCustom
            label="Tình trạng"
            options={statusOptions} // Tình trạng cho combo box
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={'Hủy'}
            text={'Lưu'}
            onCancel={onClose}
            onAction={onSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditDishPopUp;
