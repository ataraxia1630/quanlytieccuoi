import './DatDichVu.css';

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Cancelbutton from '../../components/Cancelbutton';
import {
  Card,
  Typography,
  IconButton,
  Button,
  Box,
  Stack
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';

function ServiceCard({ srv, onClick }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  return (
    <Card
      sx={{
        width: '19vw',
        p: 2,
        borderRadius: 2,
        backgroundColor: '#fffaf0', // gần giống nền ảnh
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 1,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={'Bold'} >{srv.TenDichVu}</Typography>
        {/* Dots */}
        <Stack direction="row" spacing={0.5}>
          <Box sx={{ width: 8, height: 8, bgcolor: '#cbd5d8', borderRadius: '50%' }} />
          <Box sx={{ width: 8, height: 8, bgcolor: '#9aaeb8', borderRadius: '50%' }} />
          <Box sx={{ width: 8, height: 8, bgcolor: '#5e7c8a', borderRadius: '50%' }} />
          <Box sx={{ width: 8, height: 8, bgcolor: '#003f5c', borderRadius: '50%' }} />
        </Stack>
      </Box>

      <Typography fontWeight="bold" fontSize={'1,2rem'}>
        {srv.DonGia} <Typography component="span" fontSize={'1rem'}>vnđ</Typography>
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Số lượng */}
        <Box display="flex" alignItems="center">
          <IconButton size="small" onClick={handleDecrease}>
            <Remove fontSize="small" />
          </IconButton>
          <Typography mx={1} sx={{ marginBottom: 0 }}>{quantity}</Typography>
          <IconButton size="small" onClick={handleIncrease}>
            <Add fontSize="small" />
          </IconButton>
        </Box>

        {/* Nút Add */}
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: 'orange',
            '&:hover': { bgcolor: 'darkorange' },
            borderRadius: '999px',
            textTransform: 'none',
            paddingX: 3,
          }}
        >
          Thêm
        </Button>
      </Box>
    </Card>
  );
}


function DatDichVu() {

  const [services, setServices] = useState([]);
  const { handleNav } = useContext(StepContext);
  //mock data
  const mockItems = [
    {
      TenDichVu: 'Dịch vụ 1',
      DonGia: '500,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 2',
      DonGia: '600,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 3',
      DonGia: '700,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 4',
      DonGia: '800,000',
      TinhTrang: 'AVAILABLE',

    },
    {
      TenDichVu: 'Dịch vụ 5',
      DonGia: '900,000',
      TinhTrang: 'AVAILABLE',

    },

    // Add more items as needed
  ];

  useEffect(() => {
    setServices(mockItems);
  }, [])
    ;
  return (
    <div className="page">
      <box className='intro-box'>
        <div className="dichvu-container">
          <h1 className="dichvu-title">Dich vu</h1>
          <p className="dichvu-description">
            Chúng tôi cam kết mang đến những dịch vụ
            chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.
            Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi luôn
            đồng hành cùng bạn trong mọi hành trình.
          </p>
        </div>
        <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747794536/Group_169_1_rdx0ok.png" alt="background" className='background-image' />
      </box>
      <div className='selection-container' >
        {services.map((item, index) => (
          <ServiceCard key={index} srv={item} />
        ))}
      </div>
      <div className='button-container'>
        <Cancelbutton onClick={() => handleNav()} textCancel="Hoàn Thành" />
      </div>
    </div>
  );
}

export default DatDichVu;
