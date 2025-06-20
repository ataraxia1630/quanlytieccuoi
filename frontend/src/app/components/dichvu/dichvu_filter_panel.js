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

const formatPrice = (value) => {
  if (!value && value !== 0) return '';
  const num = parseInt(value.toString().replace(/\D/g, '') || '0');
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parsePrice = (value) => {
  if (!value) return '';
  return value.replace(/\./g, '');
};

const DichVuFilter = ({ isOpen, onApply }) => {
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [status, setStatus] = useState([]);
  const [errors, setErrors] = useState({
    priceFrom: [],
    priceTo: [],
  });

  const MAX_PRICE = 100_000_000;

  const validatePrice = (value, field) => {
    const errors = [];
    if (value === '') return errors;
    const parsed = Number(value);
    if (!/^\d+$/.test(value) || parsed < 0) {
      errors.push(
        `${
          field === 'priceFrom' ? 'Giá tối thiểu' : 'Giá tối đa'
        } phải là số và không âm`
      );
    } else if (parsed >= MAX_PRICE) {
      errors.push(
        `${
          field === 'priceFrom' ? 'Giá tối thiểu' : 'Giá tối đa'
        } phải nhỏ hơn ${MAX_PRICE.toLocaleString('vi-VN', {
          style: 'decimal',
        })}`
      );
    }
    return errors;
  };

  const validatePriceRange = (from, to) => {
    const parsedFrom = parsePrice(from);
    const parsedTo = parsePrice(to);
    if (parsedFrom && parsedTo && Number(parsedFrom) > Number(parsedTo)) {
      return ['Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa'];
    }
    return [];
  };

  const handlePriceFromChange = (value) => {
    const rawValue = parsePrice(value);
    const formattedValue = formatPrice(rawValue);
    setPriceFrom(formattedValue);
    const priceErrors = validatePrice(rawValue, 'priceFrom');
    const rangeErrors = validatePriceRange(rawValue, parsePrice(priceTo));
    setErrors((prev) => ({
      ...prev,
      priceFrom: [...priceErrors, ...(rawValue !== '' ? rangeErrors : [])],
      priceTo: validatePrice(parsePrice(priceTo), 'priceTo'),
    }));
  };

  const handlePriceToChange = (value) => {
    const rawValue = parsePrice(value);
    const formattedValue = formatPrice(rawValue);
    setPriceTo(formattedValue);
    const priceErrors = validatePrice(rawValue, 'priceTo');
    const rangeErrors = validatePriceRange(parsePrice(priceFrom), rawValue);
    setErrors((prev) => ({
      ...prev,
      priceTo: priceErrors,
      priceFrom: [
        ...validatePrice(parsePrice(priceFrom), 'priceFrom'),
        ...(parsePrice(priceFrom) !== '' ? rangeErrors : []),
      ],
    }));
  };

  const handleApply = () => {
    const parsedPriceFrom = parsePrice(priceFrom);
    const parsedPriceTo = parsePrice(priceTo);

    let newErrors = { priceFrom: [], priceTo: [] };
    let hasError = false;

    newErrors.priceFrom = validatePrice(parsedPriceFrom, 'priceFrom');
    if (newErrors.priceFrom.length > 0) hasError = true;

    newErrors.priceTo = validatePrice(parsedPriceTo, 'priceTo');
    if (newErrors.priceTo.length > 0) hasError = true;

    const rangeErrors = validatePriceRange(parsedPriceFrom, parsedPriceTo);
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

    if (parsedPriceFrom) {
      filterParams.giaTu = Number(parsedPriceFrom);
    }
    if (parsedPriceTo) {
      filterParams.giaDen = Number(parsedPriceTo);
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
