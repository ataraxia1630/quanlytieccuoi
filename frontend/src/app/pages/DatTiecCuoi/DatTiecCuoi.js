import React, { useState, createContext } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import './DatTiecCuoi.css';
import { styled } from '@mui/material/styles';


export const StepContext = createContext();

const DatTiecCuoi = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);


  const steps = [{ label: 'Đặt tiệc cưới', path: '/DashBoard/DatTiecCuoi/ThongTinTiecCuoi' },
  { label: 'Đặt sảnh', path: '/DashBoard/DatTiecCuoi/DatSanhTiec' },
  { label: 'Đặt món ăn', path: '/DashBoard/DatTiecCuoi/DatMonAn' },
  { label: 'Dịch vụ bổ sung', path: '/DashBoard/DatTiecCuoi/DatDichVu' },
  ];

  const CustomStepper = styled(Stepper)(({ theme }) => ({
    '& .MuiStepIcon-root': {
      borderColor: '#066F5C',
      '&.Mui-active': {
        color: 'var(--main-color)',

      },
      '&.Mui-completed': {
        color: 'var(--main-color)',
      },
    },
    '& .MuiStepLabel-label': {
      color: 'var(--main-color)',
      '&.Mui-active': {
        color: 'var(--main-color)',
        fontWWeight: 'bold',
      },
      '&.Mui-completed': {
        color: 'var(--main-color)',
      },
    },
    '& .MuiStepConnector-line': {
      borderColor: 'var(--main-color)', // Màu xám nhạt cho đường nối
    },

  }));

  const handleNav = (step = -1) => {
    const nextStep = step === -1 ? activeStep + 1 : step;
    setActiveStep(nextStep);
    navigate(steps[nextStep].path);

  };

  return (
    <StepContext.Provider value={{ handleNav }}>
      <Box sx={{ flex: 1, display: 'flex', width: '100vw', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Stepper */}
        <div className='stepper-container'>
          <CustomStepper activeStep={activeStep} sx={{ mb: 4, width: '100%', px: 15 }}>
            {steps.map((step, index) => (
              <Step key={step.label} style={{ cursor: "pointer" }} onClick={() => handleNav(index)}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </CustomStepper>
        </div>
        <Outlet />
      </Box>
    </StepContext.Provider>
  )

}

export default DatTiecCuoi;
