import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import './DatTiecCuoi.css';

const DatTiecCuoi = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);


  const steps = ['Đặt tiệc cưới', 'Đặt sảnh', 'Chọn menu', 'Dịch vụ bổ sung'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    navigate('/DashBoard/DatTiecCuoi/DatSanhTiec')

  };

  return (
    <Box sx={{ flex: 1, display: 'flex', minHeight: '100%', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Outlet onClick={handleNext} />
    </Box>
  )

}

export default DatTiecCuoi;
