import React, { useState, useEffect } from 'react';
import './Header.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Header = () => {
  const [anchorElFeatures, setAnchorElFeatures] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <AppBar position="static" elevation={0} sx={{
      padding: '10px 0px 0px 0px ',
      color: 'rgb(41, 41, 41)',
      backgroundColor: 'transparent',
    }} className={scrolled && 'scrolled'}>
      <Toolbar sx={{
        justifyItems: 'space-between',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '10px',
        whiteSpace: 'nowrap'
      }}>
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
              <MenuItem onClick={handleClose(setAnchorElFeatures)}>Feature 1</MenuItem>
              <MenuItem onClick={handleClose(setAnchorElFeatures)}>Feature 2</MenuItem>
            </Menu>
          </Box>

          <Button sx={{ color: 'black' }}>Về chúng tôi  </Button>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" >Get Started</Button>
          <Button sx={{ color: 'black' }}>Sign In</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
