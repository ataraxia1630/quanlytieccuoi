import React, { useState, createContext, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import './DatTiecCuoi.css';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';




export const StepContext = createContext();

const DatTiecCuoi = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);


  const steps = useMemo(() => [{ label: 'Đặt tiệc cưới', path: '/DashBoard/DatTiecCuoi/ThongTinTiecCuoi' },
  { label: 'Đặt món ăn', path: '/DashBoard/DatTiecCuoi/DatMonAn' },
  { label: 'Dịch vụ bổ sung', path: '/DashBoard/DatTiecCuoi/DatDichVu' },
  ], []);



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
    if (nextStep === activeStep) return;
    localStorage.setItem("currentStep", nextStep);
    setActiveStep(nextStep);
    navigate(steps[nextStep].path);

  };

  // Khi load lại trang
  useEffect(() => {
    let savedStep = parseInt(localStorage.getItem("currentStep"), 10);
    if (isNaN(savedStep)) {
      savedStep = 0
    }
    setActiveStep(savedStep);
    navigate(steps[savedStep].path);

  }, [navigate, steps]);
  return (
    <StepContext.Provider value={{ handleNav }}>
      <Box sx={{ flex: 1, display: 'flex', width: '100vw', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Stepper */}
        <div className='stepper-container'>
          <CustomStepper activeStep={activeStep} sx={{ mb: 4, width: '100%', px: 15 }}>
            {steps.map((step, index) => (
              <Step key={step.label} style={{ cursor: "pointer" }} onClick={() => { if (localStorage.getItem("currentPDT")) { handleNav(index) } }}>
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
