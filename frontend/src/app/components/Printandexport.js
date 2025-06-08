import { useState } from 'react';
import { IconButton, Menu, MenuItem, Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import GetAppIcon from '@mui/icons-material/GetApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ActionDropdown = ({
  onPrint = () => {},
  onExportExcel = () => {},
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = () => {
    onPrint();
    handleClose();
  };

  const handleExportExcel = () => {
    onExportExcel();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disabled={disabled}
        sx={{
          color: '#063F5C',
          '&:hover': {
            backgroundColor: 'rgba(10, 62, 101, 0.04)',
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: '0px',
            minWidth: '130px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <MenuItem
          onClick={handlePrint}
          sx={{
            fontSize: '15px',
            padding: '10px 16px',
            '&:hover': {
              backgroundColor: 'rgba(10, 62, 101, 0.04)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PrintIcon fontSize="small" sx={{ color: '#063F5C' }} />
            In
          </Box>
        </MenuItem>
        <MenuItem
          onClick={handleExportExcel}
          sx={{
            fontSize: '15px',
            padding: '10px 16px',
            '&:hover': {
              backgroundColor: 'rgba(10, 62, 101, 0.04)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GetAppIcon fontSize="small" sx={{ color: '#063F5C' }} />
            Xuất file Excel
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionDropdown;
