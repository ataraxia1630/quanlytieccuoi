import { Box, Collapse, Paper } from '@mui/material';
import RangeInputs from '../Rangeinput';
import FilterButton from '../Filterbutton';
import StatusCheckbox from '../Statuscheckbx';
import { useState } from 'react';

const DishFilterPanel = ({ isOpen, onApply }) => {
  const statusList = ['AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_AVAILABLE'];
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [status, setStatus] = useState(statusList || []);

  const handleApply = () => {
    onApply({
      price: { min: priceFrom, max: priceTo },
      filters: status,
    });
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
            onFromChange={setPriceFrom}
            onToChange={setPriceTo}
          />

          {/* Checkbox cho Trạng thái */}
          <Box sx={{ display: 'block' }}>
            <StatusCheckbox
              label="Trạng thái"
              value={status}
              onChange={setStatus}
              row={false}
              options={[
                { value: 'AVAILABLE', label: 'Còn hàng' },
                { value: 'UNAVAILABLE', label: 'Tạm hết hàng' },
                { value: 'NO_LONGER_AVAILABLE', label: 'Ngừng bán' },
              ]}
            />
          </Box>
        </Box>

        {/* Nút áp dụng lọc */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default DishFilterPanel;
