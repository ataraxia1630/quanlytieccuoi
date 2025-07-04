import { Box, Collapse, Paper, Typography } from '@mui/material';
import RangeInputs from '../Rangeinput';
import FilterButton from '../Filterbutton';
import { useState, useEffect } from 'react';
import toastService from '../../service/toast/toast.service';

const HallTypeFilterPanel = ({ isOpen, onApply, onReset, filters }) => {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [errors, setErrors] = useState({ priceFrom: '', priceTo: '' });

  // Đồng bộ với filters từ props
  useEffect(() => {
    setPriceFrom(filters.priceMin || '');
    setPriceTo(filters.priceMax || '');
    setErrors({ priceFrom: '', priceTo: '' });
  }, [filters]);

  useEffect(() => {
    validate();
  }, [priceFrom, priceTo]);

  const validate = () => {
    let tempErrors = { priceFrom: '', priceTo: '' };
    let isValid = true;

    const from = Number(priceFrom);
    const to = Number(priceTo);

    if (priceFrom && (isNaN(from) || from < 0)) {
      tempErrors.priceFrom = 'Giá tối thiểu phải là số và không âm';
      isValid = false;
    }
    if (priceTo && (isNaN(to) || to < 0)) {
      tempErrors.priceTo = 'Giá tối đa phải là số không âm';
      isValid = false;
    }
    if (priceFrom && priceTo && from > to) {
      tempErrors.priceFrom = 'Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa';
      isValid = false;
    }
    if (priceFrom && from >= 100000000) {
      tempErrors.priceFrom = 'Giá tối thiểu phải nhỏ hơn 100.000.000';
      isValid = false;
    }
    if (priceTo && to >= 100000000) {
      tempErrors.priceTo = 'Giá tối đa phải nhỏ hơn 100.000.000';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleApply = () => {
    const isValid = validate();
    if (!isValid) {
      toastService.validation.invalidData();
      return;
    }

    let newFilters = {};
    if (priceFrom) newFilters.priceMin = priceFrom;
    if (priceTo) newFilters.priceMax = priceTo;

    onApply(newFilters);
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
          <Box sx={{ display: 'block' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {errors.priceFrom && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.priceFrom}
                </Typography>
              )}

              {errors.priceTo && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.priceTo}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Nút áp dụng lọc */}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}
        >
          <FilterButton
            text="Reset"
            onClick={handleReset}
            colorVariant="reset"
          />

          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default HallTypeFilterPanel;
