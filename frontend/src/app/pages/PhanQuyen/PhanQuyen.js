import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Tabs, Tab } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import QuanLyNguoiDungTab from '../../components/phanquyen/QuanLyNguoiDungTab';
import QuanLyNhomTab from '../../components/phanquyen/QuanLyNhomTab';
import 'react-toastify/dist/ReactToastify.css';

export default function PhanQuyen() {
  const [value, setValue] = useState(0);
  const handleChange = (_, newValue) => setValue(newValue);

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', color: '#063F5C', mb: 4 }}
      >
        Phân quyền
      </Typography>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#063F5C',
            },
          }}
        >
          <Tab
            label="Quản lý nhóm"
            sx={{
              '&.Mui-selected': {
                color: '#063F5C',
              },
            }}
          />
          <Tab
            label="Quản lý người dùng"
            sx={{
              '&.Mui-selected': {
                color: '#063F5C',
              },
            }}
          />
        </Tabs>
        <Box sx={{ p: 2 }}>
          {value === 0 && <QuanLyNhomTab />}
          {value === 1 && <QuanLyNguoiDungTab />}
        </Box>
      </Box>
    </Box>
  );
}
