import { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, Divider, TextField } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import SelectFieldCustom from '../Selectfieldcustom';
import DialogButtons from '../Dialogbutton';

const statusOptions = [
  { label: 'Áp dụng', value: 1 },
  { label: 'Không áp dụng', value: 0 },
];

const statusOptionValues = statusOptions.map((o) => o.value); // [1, 0]

const getLabelByValue = (val) => {
  const found = statusOptions.find((o) => o.value === val);
  return found ? found.label : '';
};

const ThamSoDialog = ({ open, onClose, onSave, title, initialData = null }) => {
  const [tenThamSo, setTenThamSo] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [giaTri, setGiaTri] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && initialData) {
      setTenThamSo(initialData.TenThamSo || '');
      setDisplayName(initialData.displayName || '');

      setGiaTri(
        initialData.GiaTri !== undefined ? initialData.GiaTri.toString() : ''
      );
      setErrors({});
    }
  }, [open, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (giaTri === '') {
      newErrors.giaTri = 'Vui lòng nhập giá trị';
      setErrors(newErrors);
      return false;
    }

    const validationRules = {
      TyLePhat: (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 0 || num > 100) {
          return 'Tỷ lệ phạt phải từ 0 đến 100';
        }
        return null;
      },

      ApDungQDPhatThanhToanTre: (value) => {
        const num = parseInt(value);
        if (!statusOptionValues.includes(num)) {
          return 'Vui lòng chọn tình trạng hợp lệ';
        }
        return null;
      },

      ThoiDiemThanhToanSoVoiNgayDaiTiec: (value) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 0) {
          return 'Thời điểm thanh toán phải là số không âm';
        }
        return null;
      },
    };

    const validator = validationRules[tenThamSo];
    if (validator) {
      const errorMessage = validator(giaTri);
      if (errorMessage) {
        newErrors.giaTri = errorMessage;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        TenThamSo: tenThamSo,
        GiaTri: parseInt(giaTri),
      });
    }
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  const renderGiaTriInput = () => {
    if (tenThamSo === 'ApDungQDPhatThanhToanTre') {
      const statusLabels = statusOptions.map((option) => option.label); // ["Áp dụng", "Không áp dụng"]

      const currentLabel = getLabelByValue(parseInt(giaTri));

      return (
        <SelectFieldCustom
          label="Tình trạng"
          options={statusLabels}
          value={currentLabel}
          onChange={(e) => {
            // Chuyển từ label về value để lưu
            const selectedLabel = e.target.value;
            const selectedOption = statusOptions.find(
              (opt) => opt.label === selectedLabel
            );
            setGiaTri(selectedOption ? selectedOption.value.toString() : '');
          }}
          fullWidth
          error={!!errors.giaTri}
          helperText={errors.giaTri}
        />
      );
    }

    return (
      <FormTextField
        label={tenThamSo === 'TyLePhat' ? 'Tỷ lệ (%)' : 'Số ngày'}
        type="number"
        value={giaTri}
        onChange={(e) => setGiaTri(e.target.value)}
        fullWidth
        error={!!errors.giaTri}
        helperText={errors.giaTri}
        InputProps={{
          endAdornment: tenThamSo === 'TyLePhat' ? <span>%</span> : null,
        }}
      />
    );
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
          <TextField
            label="Tên quy định"
            value={displayName}
            fullWidth
            disabled
          />

          {renderGiaTriInput()}
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
