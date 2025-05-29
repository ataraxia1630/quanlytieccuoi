// Mở popup chỉnh sửa hoặc thêm
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import DialogButtons from '../Dialogbutton';

const EditHallTypePopUp = ({
  open,
  onClose,
  onSave,
  title,
  editData = null,
  mode = 'add',
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({ name: '', price: '', status: '' });

  useEffect(() => {
    console.log('editData', editData);
    if (mode === 'edit' && editData) {
      setName(editData.TenLoaiSanh || '');
      setPrice(
        editData.DonGiaBanToiThieu ? editData.DonGiaBanToiThieu.toString() : ''
      );
    } else {
      setName('');
      setPrice('');
    }
    setErrors({ name: '', price: '' });
  }, [editData, mode]);

  const validate = () => {
    let tempErrors = { name: '', price: '' };
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Tên loại sảnh không được để trống';
      isValid = false;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      tempErrors.price = 'Giá phải là số dương';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Thông báo khi người dùng nhập sai
  const handleBlur = () => {
    validate();
  };

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) {
      console.log('Validate thất bại:', errors);
      alert(
        'Vui lòng kiểm tra lại thông tin: \n' +
          (errors.name ? errors.name + '\n' : '') +
          (errors.price ? errors.price + '\n' : '')
      );
      return;
    }

    const data = {
      name,
      price: Number(price),
    };
    console.log('Dữ liệu gửi từ popup:', data);
    onSave(data);
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
            label="Tên loại sảnh"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <FormTextField
            label="Đơn giá bàn tối thiểu"
            type="number" // Thay đổi kiểu nhập thành số nếu là giá trị số
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => handleBlur('price')}
            // Bỏ InputProps nếu không có VNĐ
            InputProps={{
              endAdornment: <span style={{ marginLeft: 4 }}>VNĐ</span>,
            }}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={'Hủy'}
            text={'Lưu'}
            onCancel={onClose}
            onAction={handleSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditHallTypePopUp;
