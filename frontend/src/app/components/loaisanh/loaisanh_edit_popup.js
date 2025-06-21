// Mở popup chỉnh sửa hoặc thêm
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import DialogButtons from '../Dialogbutton';
import NumericFormatCustom from '../NumericFormatCustom';
import toastService from '../../service/toast/toast.service';

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
  const [errors, setErrors] = useState({ name: '', price: '' });
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  useEffect(() => {
    console.log('editData', editData);
    if (mode === 'edit' && editData) {
      setName(editData.TenLoaiSanh || '');
      setPrice(
        editData.DonGiaBanToiThieu ? Number(editData.DonGiaBanToiThieu) : ''
      );
    } else {
      setName('');
      setPrice('');
    }
    setErrors({ name: '', price: '' });
    setIsPriceFocused(false);
  }, [editData, mode, open]);

  useEffect(() => {
    validateName();
  }, [name]);

  useEffect(() => {
    validatePrice();
  }, [price]);

  const validateName = () => {
    let nameError = '';

    if (!name.trim()) {
      nameError = 'Tên loại sảnh không được để trống';
    }

    if (name.length > 100) {
      nameError = 'Tên loại sảnh không được quá 10 ký tự';
    }

    setErrors({ ...errors, name: nameError });
    return nameError;
  };

  const validatePrice = () => {
    let priceError = '';

    if (!price) {
      priceError = 'Đơn giá bàn tối thiểu không được để trống';
    }

    if (isNaN(price) || Number(price) <= 0) {
      priceError = 'Đơn giá bàn tối thiểu phải là số dương';
    }

    if (Number(price) >= 100000000) {
      priceError = 'Đơn giá bàn tối thiểu phải nhỏ hơn 100.000.000 VNĐ';
    }

    setErrors({ ...errors, price: priceError });
    return priceError;
  };

  const validate = () => {
    let isValid = true;

    const nameError = validateName();
    const priceError = validatePrice();

    if (nameError || priceError) isValid = false;

    setErrors({ name: nameError, price: priceError });
    return isValid;
  };

  // Thông báo khi người dùng nhập sai
  const handleBlur = () => {
    validate();
  };

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) {
      toastService.validation.invalidData();
      return;
    }

    const data = {
      name: name.trim(),
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onFocus={() => setIsPriceFocused(true)}
            onBlur={() => {
              setIsPriceFocused(false);
              handleBlur('price');
            }}
            // Bỏ InputProps nếu không có VNĐ
            InputProps={{
              inputComponent: NumericFormatCustom,
              endAdornment: <span style={{ marginLeft: 4 }}>VNĐ</span>,
            }}
            InputLabelProps={{
              shrink: !!price || isPriceFocused, // Thu nhỏ nhãn nếu price có giá trị
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
