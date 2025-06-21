import { Popover, Typography, Box, Avatar, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CancelButton from '../../components/Cancelbutton';
import FormTextField from '../Formtextfield';
import DialogButtons from '../Dialogbutton';
import AuthService from '../../service/auth.service';
import toastService from '../../service/toast/toast.service';

export default function ProfileCard() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [openChangePass, setOpenChangePass] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setNewPassword('');
    setOldPassword('');
  }, [openChangePass]);

  useEffect(() => {
    setOpenChangePass(false);
  }, [Boolean(anchorElUser)]);

  const handleLogout = () => {
    localStorage.removeItem('permissions');
    setAnchorElUser(false);
    logout();
    navigate('/signin');
  };

  const handleClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElUser(null);
  };

  const handleCancel = () => {
    setNewPassword('');
    setOldPassword('');
    setOpenChangePass(false);
  };

  const handleSave = async () => {
    try {
      await AuthService.changePassword(oldPassword, newPassword);
      toastService.success('Đổi mật khẩu thành công!');
      setOpenChangePass(false);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
      {username ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            onClick={handleClick}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              bgcolor: '#063F5C',
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Popover
            open={Boolean(anchorElUser)}
            anchorEl={anchorElUser}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {!openChangePass && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', margin: 0 }}>
                    Username:
                  </Typography>
                  <Typography margin={0}> {username}</Typography>
                </Box>
              )}
              <Typography
                variant="small"
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  color: '#063F5C',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  alignSelf: openChangePass ? 'auto' : 'flex-end',
                }}
                role="button"
                onClick={() => setOpenChangePass(!openChangePass)}
              >
                Đổi mật khẩu?
              </Typography>
              {openChangePass && (
                <Box sx={{ gap: 0.5, maxWidth: '240px' }}>
                  <Box sx={{ p: 1 }}>
                    <FormTextField
                      label="Mật khẩu cũ"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <FormTextField
                      label="Mật khẩu mới"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Box>
                  <DialogButtons
                    text="Lưu"
                    textCancel="Hủy"
                    onCancel={handleCancel}
                    onAction={handleSave}
                  />
                </Box>
              )}
              {/* <Typography sx={{ margin: 0 }}>Nhóm: {username}</Typography> */}
              {!openChangePass && (
                <CancelButton onClick={handleLogout} textCancel={'Đăng xuất'} />
              )}
            </Box>
          </Popover>
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
  );
}
