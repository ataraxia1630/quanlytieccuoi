// Mở popup chỉnh sửa hoặc thêm
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import SelectFieldCustom from '../Selectfieldcustom';
import ImageUploadField from '../Imageuploadfield';
import DialogButtons from '../Dialogbutton';
import {
  statusList,
  statusMapToFrontend,
  statusMapToBackend,
} from '../../pages/DanhSachMonAn/statusMapping';
import NumericFormatCustom from '../NumericFormatCustom';
// Danh sách các tùy chọn tình trạng trong popup

const EditDishPopUp = ({
  open,
  onClose,
  onSave,
  title,
  editData = null,
  mode = 'add',
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({ name: '', price: '', status: '' });
  const [isPriceFocused, setIsPriceFocused] = useState(false);

  useEffect(() => {
    console.log('editData', editData);
    if (mode === 'edit' && editData) {
      setName(editData.TenMonAn || '');
      setPrice(Number(editData.DonGia) || '');
      setStatus(statusMapToFrontend[editData.TinhTrang] || '');
      setImage(editData.HinhAnh || null);
    } else {
      setName('');
      setPrice('');
      setStatus(statusList[0] || '');
      setImage(null);
    }
    setErrors({ name: '', price: '', status: '' });
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
      nameError = 'Tên món ăn không được để trống';
    }

    if (name.length > 100) {
      nameError = 'Tên món ăn không được quá 100 ký tự';
    }

    setErrors({ ...errors, name: nameError });
    return nameError;
  };

  const validatePrice = () => {
    let priceError = '';

    if (!price) {
      priceError = 'Giá món ăn không được để trống';
    }

    if (isNaN(price) || Number(price) <= 0) {
      priceError = 'Giá món ăn phải là số dương';
    }

    if (Number(price) >= 100000000) {
      priceError = 'Giá món ăn phải nhỏ hơn 100.000.000 VNĐ';
    }

    setErrors({ ...errors, price: priceError });
    return priceError;
  };

  const validate = () => {
    let statusError = '';
    let isValid = true;

    const nameError = validateName();
    const priceError = validatePrice();

    if (nameError || priceError) isValid = false;

    if (!status) {
      statusError = 'Vui lòng chọn tình trạng';
      isValid = false;
    }

    setErrors({ name: nameError, price: priceError, status: statusError });
    return isValid;
  };

  // Thông báo khi người dùng nhập sai
  const handleBlur = () => {
    validate();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) {
      return;
    }

    const data = {
      name,
      price: Number(price),
      status: statusMapToBackend[status],
    };
    console.log('Dữ liệu gửi từ popup:', data);
    onSave(data, image);
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
            onBlur={() => handleBlur('name')}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <ImageUploadField
            imagePath={
              image
                ? typeof image === 'string'
                  ? image
                  : URL.createObjectURL(image)
                : ''
            }
            onClear={handleClearImage}
            onSelect={handleImageSelect}
          />

          <FormTextField
            label="Giá"
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

          <SelectFieldCustom
            label="Tình trạng"
            options={statusList}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            onBlur={() => handleBlur('status')}
            fullWidth
            error={!!errors.status}
            helperText={errors.status}
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

export default EditDishPopUp;
