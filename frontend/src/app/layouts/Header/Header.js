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
import ProfileCard from '../../components/phanquyen/profile_card';

const Header = () => {
  const [anchorElFeatures, setAnchorElFeatures] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
        <Typography
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/') }}
          variant="h6" sx={{ fontWeight: 'light' }}>
          <b>DAPHNE</b>
        </Typography>

        {/* Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button href="#" sx={{ color: 'black' }}>Về chúng tôi </Button>
        </Box>

        {/* Actions */}
        <ProfileCard />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
