import { useState } from 'react';
import {
  Box,
  Collapse,
  Paper,
  FormControl,
  FormHelperText,
} from '@mui/material';
import RangeInputs from '../Rangeinput';
import FilterButton from '../Filterbutton';
import StatusCheckbox from '../Statuscheckbx';

const DichVuFilter = ({ isOpen, onApply }) => {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [status, setStatus] = useState([]);
  const [errors, setErrors] = useState({
    priceFrom: '',
    priceTo: '',
  });

  const isValidPriceInput = (value) => {
    if (value === '') return true;
    return /^([0-9]+(\.[0-9]*)?)?$/.test(value);
  };

  const parsePrice = (value) => {
    if (value === '') return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const handlePriceFromChange = (value) => {
    if (isValidPriceInput(value)) {
      setPriceFrom(value);
      setErrors((prev) => ({ ...prev, priceFrom: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        priceFrom: 'Chỉ được nhập số dương hoặc số khoa học hợp lệ (VD: 1e6)',
      }));
    }
  };

  const handlePriceToChange = (value) => {
    if (isValidPriceInput(value)) {
      setPriceTo(value);
      setErrors((prev) => ({ ...prev, priceTo: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        priceTo: 'Chỉ được nhập số dương hoặc số khoa học hợp lệ (VD: 1e6)',
      }));
    }
  };

  const handleApply = () => {
    const parsedPriceFrom = parsePrice(priceFrom);
    const parsedPriceTo = parsePrice(priceTo);

    let newErrors = { priceFrom: '', priceTo: '' };
    let hasError = false;

    if (parsedPriceFrom !== null && parsedPriceFrom < 0) {
      newErrors.priceFrom = 'Giá từ không được nhỏ hơn 0';
      hasError = true;
    }
    if (parsedPriceTo !== null && parsedPriceTo < 0) {
      newErrors.priceTo = 'Giá đến không được nhỏ hơn 0';
      hasError = true;
    }

    if (
      parsedPriceFrom !== null &&
      parsedPriceTo !== null &&
      parsedPriceFrom > parsedPriceTo
    ) {
      newErrors.priceFrom = 'Giá từ phải nhỏ hơn hoặc bằng giá đến';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const mappedStatus = status
      .map((s) => {
        switch (s) {
          case 'co_san':
            return 'Có sẵn';
          case 'tam_dung':
            return 'Tạm dừng';
          case 'ngung_cung_cap':
            return 'Ngừng cung cấp';
          default:
            return null;
        }
      })
      .filter(Boolean);

    const filterParams = {};

    if (parsedPriceFrom !== null && !isNaN(parsedPriceFrom)) {
      filterParams.giaTu = parsedPriceFrom;
    }
    if (parsedPriceTo !== null && !isNaN(parsedPriceTo)) {
      filterParams.giaDen = parsedPriceTo;
    }

    if (mappedStatus.length > 0 && !status.includes('tat_ca')) {
      filterParams.tinhTrang = mappedStatus;
    }

    onApply(filterParams);
  };

  const handleReset = () => {
    setPriceFrom('');
    setPriceTo('');
    setStatus([]);
    setErrors({ priceFrom: '', priceTo: '' });
    onApply({});
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          <FormControl
            sx={{ width: '300px' }}
            error={Boolean(errors.priceFrom || errors.priceTo)}
          >
            <RangeInputs
              width="130px"
              label="Khoảng giá"
              fromValue={priceFrom}
              toValue={priceTo}
              onFromChange={handlePriceFromChange}
              onToChange={handlePriceToChange}
            />
            {errors.priceFrom && (
              <FormHelperText>{errors.priceFrom}</FormHelperText>
            )}
            {!errors.priceFrom && errors.priceTo && (
              <FormHelperText>{errors.priceTo}</FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'block' }}>
            <StatusCheckbox
              label="Trạng thái"
              value={status}
              onChange={setStatus}
              row={false}
              options={[
                { value: 'co_san', label: 'Có sẵn' },
                { value: 'tam_dung', label: 'Tạm dừng' },
                { value: 'ngung_cung_cap', label: 'Ngừng cung cấp' },
              ]}
            />
          </Box>
        </Box>

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

export default DichVuFilter;
