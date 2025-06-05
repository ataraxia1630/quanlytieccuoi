import React from 'react';
import './Footer.css';
import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import {
  Instagram,
  Facebook,
  Close,
  KeyboardDoubleArrowUp,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box mt={20} sx={{ bgcolor: '#fdf6ec', borderTop: '2px solid #ccc', width: '100vw', zIndex: 10, height: "50vh" }}>
      <Grid container spacing={4} justifyContent="space-between" sx={{ height: '100%' }}>
        {/* Save the Date Calendar */}
        <Grid gridColumn={{ xs: 'span 12', md: 'span 3', ml: 'span 6' }} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <img
            src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747706236/Group_84_rdcorn.png"
            alt="Save the Date"
            style={{ width: '100%' }}
          />
          <Box mt={1}>
            <Link href="#" className='footer-nav-decoration' fontWeight="bold">ABOUT US.</Link>
            <Link href="#" className='footer-nav-decoration'>HOME.</Link>
            <Link href="#" className='footer-nav-decoration'>SERVICES.</Link>
            <Link href="#" className='footer-nav-decoration'>FAQs.</Link>
          </Box>
        </Grid>


        {/* Center Logo */}
        <Grid gridColumn={{ xs: 'span 12', md: 'span 5' }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            DAPHNE
          </Typography>
          <Typography mt={3} fontStyle="italic" fontSize="0.9rem" >
            "Every love story is unique,
            <br />and your wedding should be too."
          </Typography>
          <Box mt={2}>
            <IconButton><Instagram /></IconButton>
            <IconButton><Close /></IconButton>
            <IconButton><Facebook /></IconButton>
          </Box>
        </Grid>

        {/* Contact & Pages */}
        <Grid gridColumn={{ xs: 'span 12', md: 'span 2' }} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography fontWeight="bold">CONTACT.</Typography>
          <Typography ml={4} fontSize="0.9rem">konichiwa@daphne.com</Typography>
          <Typography ml={4} fontSize="0.9rem">@daphne_nekaichelchalasca</Typography>

          <Box mt={1}>
            <Typography fontWeight="bold">OVERVIEW.</Typography>
            <Typography fontWeight="bold">GET STARTED.</Typography>
            <Typography ml={4} fontSize="0.9rem">New wedding project.</Typography>

            <Typography fontWeight="bold">PRIVACY POLICY</Typography>
            <Typography fontWeight="bold">HELP.</Typography>
          </Box>
        </Grid>

        {/* Wedding Couple Image */}
        <Grid gridColumn={{ xs: 'span 12', md: 'span 2' }} sx={{ display: 'flex', position: "relative", alignItems: 'center', flexDirection: 'column' }}>
          <img
            src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747706237/Group_169_pjxhoz.png"
            alt="Wedding Couple"
            style={{ height: '88.5  %' }}
          />
          <IconButton sx={{ position: 'absolute', top: -10, left: 120, border: '2px solid #ccc', backgroundColor: 'white', borderRadius: '0%' }}>
            <KeyboardDoubleArrowUp />
          </IconButton>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box textAlign="center" fontSize="0.8rem" bgcolor='white' p={2} borderTop={'2px solid #ccc'} >
        © COPYRIGHT 2024 | ALL RIGHT RESERVED | WEB DESIGN BY NHÓM 17
      </Box>
    </Box>
  );
};

export default Footer;
