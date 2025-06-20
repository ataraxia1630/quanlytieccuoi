import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Divider,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DialogButtons from '../Dialogbutton';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import GroupService from '../../service/nhom.service';
import { toast } from 'react-toastify';

export default function AddGroupPopUp({
  open,
  onClose,
  onSave,
  permissionGroups,
}) {
  const [groupName, setGroupName] = useState('');
  const [permissionsState, setPermissionsState] = useState([]);

  const handlePermissionChange = (permissionId) => {
    setPermissionsState((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleClose = () => {
    setGroupName('');
    setPermissionsState([]);
    onClose();
  };

  const handleSave = async () => {
    try {
      const data = {
        TenNhom: groupName.trim(),
        MaQuyenArray: permissionsState,
      };
      console.log(data);
      await GroupService.createNew(data);
      toast.success(`Thêm nhóm ${groupName} thành công!`);
      onSave();
      handleClose();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể thêm nhóm!'}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 10,
          p: 0,
          border: '2px solid #063F5C',
          width: '100%',
          maxWidth: '600px',
        },
      }}
    >
      <DialogTitleCustom title="Thêm Nhóm Mới" onClose={handleClose} />
      <Divider sx={{ borderColor: '#063F5C', borderBottomWidth: '1.3px' }} />
      <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <FormTextField
              label="Tên nhóm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(permissionGroups).map(
              ([groupName, permissions]) => (
                <Box key={groupName}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {groupName}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '20px',
                      pl: 2,
                      alignItems: 'center',
                    }}
                  >
                    {permissions.map((permission) => (
                      <FormControlLabel
                        key={permission.MaQuyen}
                        control={
                          <Checkbox
                            checked={permissionsState.includes(
                              permission.MaQuyen
                            )}
                            onChange={() =>
                              handlePermissionChange(permission.MaQuyen)
                            }
                            sx={{
                              color: 'grey',
                              '&.Mui-checked': {
                                color: '#063F5C',
                              },
                            }}
                          />
                        }
                        label={`${permission.MaQuyen} - ${permission.TenQuyen}`}
                        sx={{
                          minWidth: '250px',
                          display: 'flex',
                          alignItems: 'center',
                          '& .MuiFormControlLabel-label': {
                            marginBottom: 0,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <DialogButtons
              textCancel="Hủy"
              text="Lưu"
              onAction={handleSave}
              onCancel={handleClose}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
