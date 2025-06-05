import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import SelectFieldCustom from '../Selectfieldcustom';
import DialogButtons from '../Dialogbutton';

const statusOptions = ['Áp dụng', 'Không áp dụng'];

const ThamSoDialog = ({ open, onClose, onSave, title, initialData = null }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.TenDichVu || '');
        setValue(initialData.GiaTri || '');
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!value) {
      newErrors.value = 'Vui lòng nhập giá trị';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        name: name.trim(),
        value: value,
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
            label="Tên quy định"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <SelectFieldCustom
            label="Tình trạng"
            options={statusOptions}
            value={value}
            onChange={(e) => setValue(e.target.value)}
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

export default ThamSoDialog;
