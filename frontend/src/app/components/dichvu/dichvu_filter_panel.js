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
import toastService from '../../service/toast/toast.service';

const DichVuFilter = ({ isOpen, onApply }) => {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [status, setStatus] = useState([]);
  const [errors, setErrors] = useState({
    priceFrom: [],
    priceTo: [],
  });

  const MAX_PRICE = 100_000_000;

  const toNumber = (value) =>
    Number(value?.toString().replace(/[.,]/g, '') || '0');

  const validatePrice = (value, field) => {
    const errors = [];
    const parsed = toNumber(value);
    if (value === '') return errors;
    if (isNaN(parsed)) {
      errors.push(
        `${
          field === 'priceFrom' ? 'Giá tối thiểu' : 'Giá tối đa'
        } phải là số hợp lệ`
      );
    } else if (parsed < 0) {
      errors.push(
        `${
          field === 'priceFrom' ? 'Giá tối thiểu' : 'Giá tối đa'
        } phải là số và không âm`
      );
    } else if (parsed >= MAX_PRICE) {
      errors.push(
        `${
          field === 'priceFrom' ? 'Giá tối thiểu' : 'Giá tối đa'
        } phải nhỏ hơn ${MAX_PRICE.toLocaleString('vi-VN')}`
      );
    }
    return errors;
  };

  const validatePriceRange = (from, to) => {
    const fromNum = toNumber(from);
    const toNum = toNumber(to);
    if (from && to && fromNum > toNum) {
      return ['Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa'];
    }
    return [];
  };

  const handlePriceFromChange = (value) => {
    setPriceFrom(value);
    const priceErrors = validatePrice(value, 'priceFrom');
    const rangeErrors = validatePriceRange(value, priceTo);
    setErrors((prev) => ({
      ...prev,
      priceFrom: [...priceErrors, ...(value !== '' ? rangeErrors : [])],
      priceTo: validatePrice(priceTo, 'priceTo'),
    }));
  };

  const handlePriceToChange = (value) => {
    setPriceTo(value);
    const priceErrors = validatePrice(value, 'priceTo');
    const rangeErrors = validatePriceRange(priceFrom, value);
    setErrors((prev) => ({
      ...prev,
      priceTo: priceErrors,
      priceFrom: [
        ...validatePrice(priceFrom, 'priceFrom'),
        ...(priceFrom !== '' ? rangeErrors : []),
      ],
    }));
  };

  const handleApply = () => {
    let newErrors = { priceFrom: [], priceTo: [] };
    let hasError = false;

    newErrors.priceFrom = validatePrice(priceFrom, 'priceFrom');
    if (newErrors.priceFrom.length > 0) hasError = true;

    newErrors.priceTo = validatePrice(priceTo, 'priceTo');
    if (newErrors.priceTo.length > 0) hasError = true;

    const rangeErrors = validatePriceRange(priceFrom, priceTo);
    if (rangeErrors.length > 0) {
      newErrors.priceFrom = [...newErrors.priceFrom, ...rangeErrors];
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      toastService.validation.invalidData();
      return;
    }

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

    if (priceFrom) {
      filterParams.giaTu = toNumber(priceFrom);
    }
    if (priceTo) {
      filterParams.giaDen = toNumber(priceTo);
    }

    if (mappedStatus.length > 0) {
      filterParams.tinhTrang = mappedStatus;
    }

    onApply(filterParams);
  };

  const handleReset = () => {
    setPriceFrom('');
    setPriceTo('');
    setStatus([]);
    setErrors({ priceFrom: [], priceTo: [] });
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
            error={Boolean(
              errors.priceFrom.length > 0 || errors.priceTo.length > 0
            )}
          >
            <RangeInputs
              width="130px"
              label="Khoảng giá"
              fromValue={priceFrom}
              toValue={priceTo}
              onFromChange={handlePriceFromChange}
              onToChange={handlePriceToChange}
            />
            <Box sx={{ mt: 0.5 }}>
              {errors.priceFrom.map((error, index) => (
                <FormHelperText
                  key={`priceFrom-${index}`}
                  error
                  sx={{ m: 0, lineHeight: 1.5 }}
                >
                  {error}
                </FormHelperText>
              ))}
              {errors.priceTo.map((error, index) => (
                <FormHelperText
                  key={`priceTo-${index}`}
                  error
                  sx={{ m: 0, lineHeight: 1.5 }}
                >
                  {error}
                </FormHelperText>
              ))}
            </Box>
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
