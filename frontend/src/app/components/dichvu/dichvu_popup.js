import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import SelectFieldCustom from '../Selectfieldcustom';
import DialogButtons from '../Dialogbutton';

const statusOptions = ['Có sẵn', 'Tạm dừng', 'Ngừng cung cấp'];

const formatPrice = (value) => {
  if (!value && value !== 0) return '';
  const cleanValue = String(value).split('.')[0].replace(/\D/g, '');
  const num = parseInt(cleanValue || '0', 10);
  return num.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
};

const parsePrice = (value) => {
  return value.replace(/\./g, '');
};

const DichVuDialog = ({
  open,
  onClose,
  onSave,
  title,
  initialData = null,
  mode = 'add',
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setName(initialData.TenDichVu || '');
        setPrice(initialData.DonGia ? formatPrice(initialData.DonGia) : '');
        setStatus(initialData.TinhTrang || '');
      } else {
        setName('');
        setPrice('');
        setStatus('');
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const validateName = (value) => {
    if (value.trim() && value.trim().length > 100) {
      return 'Tên dịch vụ không được vượt quá 100 ký tự';
    }
    return '';
  };

  const validatePrice = (value) => {
    const parsedPrice = parsePrice(value);
    if (parsedPrice && (isNaN(parsedPrice) || Number(parsedPrice) < 0)) {
      return 'Giá phải là số không âm';
    }
    if (parsedPrice && Number(parsedPrice) >= 100000000) {
      return 'Giá phải nhỏ hơn 100 triệu';
    }
    return '';
  };

  const validateStatus = () => {
    return '';
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({
      ...prev,
      name: validateName(value),
    }));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\./g, '');
    if (cleanValue === '' || !isNaN(cleanValue)) {
      const formattedValue = formatPrice(cleanValue);
      setPrice(formattedValue);
      setErrors((prev) => ({
        ...prev,
        price: validatePrice(formattedValue),
      }));
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    setErrors((prev) => ({
      ...prev,
      status: validateStatus(value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Tên dịch vụ không được để trống';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Tên dịch vụ không được vượt quá 100 ký tự';
    }

    const parsedPrice = parsePrice(price);
    if (!parsedPrice) {
      newErrors.price = 'Giá không được để trống';
    } else if (isNaN(parsedPrice) || Number(parsedPrice) < 0) {
      newErrors.price = 'Giá phải là số không âm';
    } else if (Number(parsedPrice) >= 100000000) {
      newErrors.price = 'Giá phải nhỏ hơn 100 triệu';
    }

    if (!status) {
      newErrors.status = 'Vui lòng chọn tình trạng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        name: name.trim(),
        price: Number(parsePrice(price)),
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
          border: '2px solid #063F5C',
          width: '100%',
          maxWidth: '430px',
        },
      }}
    >
      <DialogTitleCustom title={title} onClose={handleCancel} />

      <Divider sx={{ borderColor: '#063F5C', borderBottomWidth: '1.3px' }} />

      <DialogContent sx={{ pt: 4.5, px: 5, pb: 3.5 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
          <FormTextField
            label="Tên dịch vụ"
            value={name}
            onChange={handleNameChange}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <FormTextField
            label="Giá"
            value={price}
            onChange={handlePriceChange}
            InputProps={{
              endAdornment: <span style={{ marginLeft: 4 }}>VNĐ</span>,
            }}
            fullWidth
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{
              inputMode: 'numeric',
              onKeyPress: (e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              },
            }}
          />

          <SelectFieldCustom
            label="Tình trạng"
            options={statusOptions}
            value={status}
            onChange={handleStatusChange}
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
