import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin route hiện tại

  const menuItems = [
    { text: 'Đặt tiệc cưới', icon: <ChurchIcon />, path: 'DatTiecCuoi' },
    { text: 'Danh sách tiệc', icon: <BookIcon />, path: 'DanhSachSanhTiec' },
    { text: 'Sảnh tổ chức', icon: <PeopleIcon />, path: 'DanhSachSanhTiec' },
    { text: 'Menu tiệc', icon: <RestaurantMenuIcon />, path: 'DanhSachMonAn' },
    { text: 'Dịch vụ', icon: <VideocamIcon />, path: 'DanhSachDichVu' },
    { icon: <MoreVertIcon />, path: '' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? 200 : 60,
        flexShrink: 0,
        transition: 'width 0.3s',
        [`& .MuiDrawer-paper`]: {
          width: isOpen ? 200 : 60,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <List sx={{ padding: 0, paddingTop: 10 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => item.path && navigate(`/DashBoard/${item.path}`)}
            sx={{
              minHeight: 70,
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              backgroundColor:
                location.pathname === `/DashBoard/${item.path}` ? '#e0e0e0' : 'transparent', // Làm nổi bật mục đang chọn
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isOpen ? 3 : 0,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {item.text && (
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.3s',
                  whiteSpace: 'nowrap',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;