import { Box, Collapse, Paper } from '@mui/material';
import RangeInputs from '../Rangeinput';
import FilterButton from '../Filterbutton';
import StatusCheckbox from '../Statuscheckbx';
import { useState, useEffect } from 'react';
import {
  statusOptions,
  statusMapToBackend,
} from '../../pages/DanhSachMonAn/statusMapping';

const DishFilterPanel = ({ isOpen, onApply, onReset, filters }) => {
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState('');
  const [status, setStatus] = useState(filters.status || []);
  const [errors, setErrors] = useState({ priceFrom: '', priceTo: '' });

  // Đồng bộ với filters từ props
  useEffect(() => {
    setPriceFrom(filters.priceMin || 0);
    setPriceTo(filters.priceMax || '');
    setStatus(filters.status || []);
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
    if (priceTo && (isNaN(to) || to < 0)) {
      tempErrors.priceTo = 'Giá tối đa phải là số không âm';
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
        status: status.map((s) => statusMapToBackend[s] || s),
        priceMin: priceFrom ? Number(priceFrom) : 0,
        priceMax: priceTo ? Number(priceTo) : 10000000,
      });
    }
  };

  const handleReset = () => {
    setPriceFrom('');
    setPriceTo('');
    setStatus([]);
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
            label="Giá"
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

          {/* Checkbox cho Trạng thái */}
          <Box sx={{ display: 'block' }}>
            <StatusCheckbox
              label="Trạng thái"
              value={status}
              onChange={setStatus}
              row={false}
              options={statusOptions}
            />
          </Box>
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

export default DishFilterPanel;
