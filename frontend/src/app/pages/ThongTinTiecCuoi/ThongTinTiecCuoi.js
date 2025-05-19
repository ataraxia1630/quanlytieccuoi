import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, TextField, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ThongTinTiecCuoi.css';
import { useNavigate } from 'react-router-dom';
import FormTextField from '../../components/Formtextfield';
;

function ThongTinTiecCuoi({ onClick: handleNext }) {
  const navigate = useNavigate();
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deposit, setDeposit] = useState('');
  const [reservedTables, setReservedTables] = useState(1);
  const [extraTables, setExtraTables] = useState(0);


  return (
    <div className="thongtintieccuoi-page">
      <Box sx={{ display: 'flex', height: '100vh' }}>

        {/* Left Section: Form */}
        <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Form */}
          <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2 }}>
            <FormTextField label="Tên cô dâu" value={brideName} onChange={(e) => setBrideName(e.target.value)} />
            <FormTextField label="Tên chú rể" value={groomName} onChange={(e) => setGroomName(e.target.value)} />
            <FormTextField label="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <FormTextField label="Đặt cọc" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </Box>

          {/* Table Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography sx={{ mr: 2 }}>Reserved table count</Typography>
            <IconButton onClick={() => setReservedTables(Math.max(1, reservedTables - 1))}><RemoveIcon /></IconButton>
            <Typography sx={{ mx: 2 }}>{reservedTables}</Typography>
            <IconButton onClick={() => setReservedTables(reservedTables + 1)}><AddIcon /></IconButton>
            <Typography sx={{ ml: 2 }}>Extra tables</Typography>
            <TextField
              value={extraTables}
              onChange={(e) => setExtraTables(Math.max(0, Number(e.target.value)))}
              size="small"
              sx={{ width: 60, ml: 1 }}
            />
          </Box>

          {/* Continue Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ mt: 3, px: 4 }}
          >
            Continue
          </Button>
        </Box>

        {/* Right Section: Image and Text */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(https://via.placeholder.com/400x600.png?text=Wedding+Photo)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Save the Date
            </Typography>
            <Typography variant="h6">
              Camille & Lucan
            </Typography>
            <Typography variant="body2">
              18 May 2025
            </Typography>
          </Box>
        </Box>

      </Box>
    </div>

  );
}

export default ThongTinTiecCuoi;
