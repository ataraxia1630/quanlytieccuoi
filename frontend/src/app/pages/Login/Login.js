import React, { useState } from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../../service/auth.service';
import weddingImage from '../../assets/wedding_img.jpg';
import { usePermission } from '../../../context/PermissionContext';
import QuyenService from '../../service/quyen.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toastService from '../../service/toast/toast.service';

const style = {
  width: { xs: '100%', sm: '300px' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#063F5C',
    },
    '&:hover fieldset': {
      borderColor: '#063F5C',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#063F5C',
    },
    '& input': {
      color: 'black',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'black',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#063F5C',
  },
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setPermissions } = usePermission();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await AuthService.login(username, password);
      localStorage.setItem('accessToken', token);
      const permissions = await QuyenService.getPerOfUser();
      localStorage.setItem('permissions', JSON.stringify(permissions));
      setPermissions(permissions);
      login(token);
      navigate('/');
    } catch (error) {
      toastService.error(error.message || 'Đăng nhập không thành công!');
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: { xs: 2, sm: 4 },
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Box
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '1050px',
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <Grid container>
          {/* Image Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Box
              component="img"
              src={weddingImage}
              alt="Wedding"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Grid>

          {/* Form Section */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, sm: 5 },
              flex: '1',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#063F5C', mb: 6 }}
            >
              SIGN IN
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={style}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={style}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: '#063F5C',
                width: { xs: '100%', sm: '300px' },
                '&:hover': { bgcolor: '#045270' },
              }}
              onClick={handleLogin}
            >
              Sign in
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
