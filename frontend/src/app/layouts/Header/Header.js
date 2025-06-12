import React, { useState, useEffect } from 'react';
// import './Header.css';
import CancelButton from '../../components/Cancelbutton';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const [anchorElFeatures, setAnchorElFeatures] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpen = (setter) => (event) => {
    setter(event.currentTarget);
  };

  const handleClose = (setter) => () => {
    setter(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('permissions');
    setAnchorElUser(false);
    logout();
    navigate('/signin');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: 10,
        padding: '10px 0px 10px 0px ',
        color: 'rgb(41, 41, 41)',
        backgroundColor: 'white',
        width: '100vw',
        boxShadow: '0px -4px 6px 0px rgba(198, 191, 212, 0.18) inset',
      }}
      className={scrolled && 'scrolled'}
    >
      <Toolbar
        sx={{
          justifyItems: 'space-between',
          display: 'grid',
          gridTemplateColumns: '1fr 3fr 2fr',
          gap: '10px',
          whiteSpace: 'nowrap',
          marginX: '60px',
        }}
      >
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: 'light' }}>
          <b>DAPHNE</b>
        </Typography>

        {/* Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Button
              onClick={handleOpen(setAnchorElFeatures)}
              endIcon={<ArrowDropDownIcon />}
              sx={{ color: 'black' }}
            >
              Dịch vụ
            </Button>
            <Menu
              anchorEl={anchorElFeatures}
              open={Boolean(anchorElFeatures)}
              onClose={handleClose(setAnchorElFeatures)}
            >
              <MenuItem onClick={handleClose(setAnchorElFeatures)}>
                Feature 1
              </MenuItem>
              <MenuItem onClick={handleClose(setAnchorElFeatures)}>
                Feature 2
              </MenuItem>
            </Menu>
          </Box>

          <Button sx={{ color: 'black' }}>Về chúng tôi </Button>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
          {username ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                onClick={handleOpen(setAnchorElUser)}
                sx={{
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  bgcolor: '#063F5C',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleClose(setAnchorElUser)}
              >
                <MenuItem onClick={() => navigate('/profile')}>Hồ sơ</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </Box>
          ) : (
            <CancelButton
              onClick={() => {
                navigate('/signin');
              }}
              textCancel="Sign In"
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
