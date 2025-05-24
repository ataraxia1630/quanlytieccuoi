import './DatMonAn.css';
import React, { useState, useContext, useEffect } from 'react';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import Cancelbutton from '../../components/Cancelbutton';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

function FoodCard({ food, onClick }) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 10));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 10);
  };

  return (
    <Card sx={{ width: 320, borderRadius: 2, boxShadow: 3 }}>
      {/* Ảnh */}
      <CardMedia
        component="img"
        height="192"
        image={food.HinhAnh}
        alt="food image"
        sx={{ objectFit: 'cover' }}
      />

      {/* Tiêu đề & Giá */}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            {food.TenMonAn}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {food.DonGia} <Typography variant="caption">vnđ</Typography>
          </Typography>
        </Box>

        {/* Ghi chú */}
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Thêm ghi chú ....."
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </CardContent>

      {/* Số lượng & Nút Add */}
      <CardActions sx={{ px: 2, pb: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton size="small" onClick={handleDecrease}>
            <Remove />
          </IconButton>
          <Typography sx={{ mx: 1, minWidth: 24, textAlign: 'center', marginBottom: 0 }}>
            {quantity}
          </Typography>
          <IconButton size="small" onClick={handleIncrease}>
            <Add />
          </IconButton>
        </Box>

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
      </CardActions>
    </Card>
  );
}

function DatMonAn() {
  const [foods, setfoods] = useState([]);
  const { handleNav } = useContext(StepContext);
  // Mock data
  const mockItems = [
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      TenMonAn: 'Sảnh A',
      DonGia: 'Sảnh nhỏ',
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
  ]
  useEffect(() => {
    setfoods(mockItems);
  }, []);


  return (
    <div className="page">
      <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747755620/Frame_104_zhrlod.png" alt="background" className='background-image' />
      <div className='selection-container' >
        {foods.map((item, index) => (
          <FoodCard key={index} food={item} />
        ))}
      </div>
      <div className='button-container'>
        <Cancelbutton onClick={() => handleNav()} textCancel="Tiếp tục" />
      </div>
    </div>
  );
}

export default DatMonAn;
