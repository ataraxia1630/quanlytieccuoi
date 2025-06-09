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

const permissionGroups = {
  'Đặt tiệc cưới': [{ MaQuyen: 'Q0001', TenQuyen: 'order.create' }],
  'Tra cứu tiệc cưới': [
    { MaQuyen: 'Q0002', TenQuyen: 'wedding.view' },
    { MaQuyen: 'Q0003', TenQuyen: 'wedding.delete' },
  ],
  'Lập hóa đơn thanh toán': [{ MaQuyen: 'Q0004', TenQuyen: 'bill.create' }],
  'Danh sách sảnh': [
    { MaQuyen: 'Q0005', TenQuyen: 'hall.view' },
    { MaQuyen: 'Q0006', TenQuyen: 'hall.edit' },
    { MaQuyen: 'Q0007', TenQuyen: 'hall.delete' },
    { MaQuyen: 'Q0008', TenQuyen: 'hall.create' },
  ],
  'Danh sách loại sảnh': [
    { MaQuyen: 'Q0009', TenQuyen: 'hallType.view' },
    { MaQuyen: 'Q0010', TenQuyen: 'hallType.edit' },
    { MaQuyen: 'Q0011', TenQuyen: 'hallType.delete' },
    { MaQuyen: 'Q0012', TenQuyen: 'hallType.create' },
  ],
  'Danh sách món ăn': [
    { MaQuyen: 'Q0013', TenQuyen: 'food.view' },
    { MaQuyen: 'Q0014', TenQuyen: 'food.edit' },
    { MaQuyen: 'Q0015', TenQuyen: 'food.delete' },
    { MaQuyen: 'Q0016', TenQuyen: 'food.create' },
  ],
  'Danh sách dịch vụ': [
    { MaQuyen: 'Q0017', TenQuyen: 'service.view' },
    { MaQuyen: 'Q0018', TenQuyen: 'service.edit' },
    { MaQuyen: 'Q0019', TenQuyen: 'service.delete' },
    { MaQuyen: 'Q0020', TenQuyen: 'service.create' },
  ],
  'Danh sách tham số': [
    { MaQuyen: 'Q0021', TenQuyen: 'variable.view' },
    { MaQuyen: 'Q0022', TenQuyen: 'variable.edit' },
  ],
  'Báo cáo tháng': [{ MaQuyen: 'Q0023', TenQuyen: 'report.view' }],
  'Quản lý người dùng': [
    { MaQuyen: 'Q0024', TenQuyen: 'account.view' },
    { MaQuyen: 'Q0025', TenQuyen: 'account.create' },
    { MaQuyen: 'Q0026', TenQuyen: 'account.edit' },
    { MaQuyen: 'Q0027', TenQuyen: 'account.delete' },
  ],
  'Quản lý nhóm người dùng': [
    { MaQuyen: 'Q0028', TenQuyen: 'group.view' },
    { MaQuyen: 'Q0029', TenQuyen: 'group.create' },
    { MaQuyen: 'Q0030', TenQuyen: 'group.edit' },
    { MaQuyen: 'Q0031', TenQuyen: 'group.delete' },
  ],
};

export default function AddGroupPopUp({ open, onClose, onSave }) {
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
        TenNhom: groupName,
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
