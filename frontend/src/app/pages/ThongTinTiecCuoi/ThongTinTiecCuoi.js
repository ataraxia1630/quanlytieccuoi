import React, { useState, useContext } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ThongTinTiecCuoi.css';
import FormTextField from '../../components/Formtextfield';
import Cancelbutton from '../../components/Cancelbutton';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';

function ThongTinTiecCuoi() {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deposit, setDeposit] = useState('');
  const [reservedTables, setReservedTables] = useState(1);
  const [extraTables, setExtraTables] = useState(0);

  const { handleNav } = useContext(StepContext);

  return (
    <div className="thongtintieccuoi-page">
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100vh', width: '96%' }}>

        {/* Left Section */}
        <Box className="form-section">
          <Box className="form-grid">
            <FormTextField label="Tên cô dâu" value={brideName} onChange={(e) => setBrideName(e.target.value)} />
            <FormTextField label="Tên chú rể" value={groomName} onChange={(e) => setGroomName(e.target.value)} />
            <FormTextField label="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <FormTextField label="Đặt cọc" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </Box>

          {/* Table Selection */}
          <Box className="table-selection">
            <div className="BookingCount-container">
              <span>Số lượng bàn</span>
              <IconButton sx={{ ml: 2 }} onClick={() => setReservedTables(Math.max(1, reservedTables - 1))}><RemoveIcon /></IconButton>
              <span>{reservedTables}</span>
              <IconButton onClick={() => setReservedTables(reservedTables + 1)}><AddIcon /></IconButton>
            </div>

            <div className="BookingCount-container">
              <span>Bàn dự trữ</span>
              <TextField
                value={extraTables}
                onChange={(e) => setExtraTables(Math.max(0, Number(e.target.value)))}
                size="small"
                sx={{ width: 60, ml: 2, mt: 2 }} />
            </div>

            <Cancelbutton onClick={() => handleNav()} textCancel="Continue" />
          </Box>
        </Box>

        {/* Right Section */}
        <Box className="image-section">
          <Box className="image-text">
            <Typography variant="h4" gutterBottom>Save the Date</Typography>
            <Typography variant="h6">Family & Love</Typography>
            <Typography variant="body2">../../2025</Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ThongTinTiecCuoi;
