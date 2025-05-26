import { Box, Collapse, Paper } from '@mui/material';
import RangeInputs from '../Rangeinput';
import FilterButton from '../Filterbutton';
import { useState, useEffect } from 'react';

const HallTypeFilterPanel = ({ isOpen, onApply, onReset, filters }) => {
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState('');
  const [errors, setErrors] = useState({ priceFrom: '', priceTo: '' });

  // Đồng bộ với filters từ props
  useEffect(() => {
    setPriceFrom(filters.priceMin || 0);
    setPriceTo(filters.priceMax || '');
    setErrors({ priceFrom: '', priceTo: '' });
  }, [filters]);

  const validate = () => {
    let tempErrors = { priceFrom: '', priceTo: '' };
    let isValid = true;

    const from = Number(priceFrom);
    const to = Number(priceTo);

    if (priceFrom && (isNaN(from) || from < 0)) {
      tempErrors.priceFrom = 'Giá tối thiểu phải là số không âm';
      isValid = false;
    }
    if (priceTo && (isNaN(to) || to < 0 || to > 100000000)) {
      tempErrors.priceTo =
        'Giá tối đa phải là số không âm và nhỏ hơn 100 triệu';
      isValid = false;
    }
    if (priceFrom && priceTo && from > to) {
      tempErrors.priceFrom = 'Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleApply = () => {
    if (validate()) {
      onApply({
        priceMin: priceFrom ? Number(priceFrom) : 0,
        priceMax: priceTo ? Number(priceTo) : 100000000,
      });
    }
  };

  const handleReset = () => {
    setPriceFrom('');
    setPriceTo('');
    setErrors({ priceFrom: '', priceTo: '' });
    onReset();
  };

  return (
    <Collapse in={isOpen}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 5,
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {/* Range input cho Khoảng giá */}
          <RangeInputs
            width="90px"
            label="Đơn giá bàn tối thiểu"
            fromValue={priceFrom}
            toValue={priceTo}
            onFromChange={(value) => {
              setPriceFrom(value);
              setErrors({ ...errors, priceFrom: '' });
            }}
            onToChange={(value) => {
              setPriceTo(value);
              setErrors({ ...errors, priceTo: '' });
            }}
            errorFrom={errors.priceFrom}
            errorTo={errors.priceTo}
          />
        </Box>

        {/* Nút áp dụng lọc */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <FilterButton text="Reset" onClick={handleReset} />
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default HallTypeFilterPanel;
