import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
} from '@mui/material';
import DialogButtons from '../Dialogbutton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M17 2.99981C17.2626 2.73717 17.5744 2.52883 17.9176 2.38669C18.2608 2.24455 18.6286 2.17139 19 2.17139C19.3714 2.17139 19.7392 2.24455 20.0824 2.38669C20.4256 2.52883 20.7374 2.73717 21 2.99981C21.2626 3.26246 21.471 3.57426 21.6131 3.91742C21.7553 4.26058 21.8284 4.62838 21.8284 4.99981C21.8284 5.37125 21.7553 5.73905 21.6131 6.08221C21.471 6.42537 21.2626 6.73717 21 6.99981L7.5 20.4998L2 21.9998L3.5 16.4998L17 2.99981Z"
      stroke="#063F5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6H5H21"
      stroke="#063F5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
      stroke="#063F5C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function GroupAccordion({ group = {}, onDelete, onSave }) {
  const [groupName, setGroupName] = useState(group.TenNhom || '');
  const [groupCode, setGroupCode] = useState(group.MaNhom || '');
  const [permissionsState, setPermissionsState] = useState(
    group.QUYENs?.map((q) => q.MaQuyen) || []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setGroupName(group.TenNhom || '');
    setGroupCode(group.MaNhom || '');
    setPermissionsState(group.QUYENs?.map((q) => q.MaQuyen) || []);
  }, [group]);

  const handlePermissionChange = (permissionId) => {
    setPermissionsState((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    try {
      const editData = {
        TenNhom: groupName,
        MaQuyenArray: permissionsState,
      };
      console.log(editData);
      await GroupService.update(group.MaNhom, editData);
      toast.success(`Cập nhật nhóm ${groupName} thành công!`);
      setIsEditing(false);
      setExpanded(false);
      onSave();
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể cập nhật nhóm!'}`);
    }
  };

  const handleCancel = () => {
    setGroupName(group.TenNhom || '');
    setPermissionsState(group.QUYENs?.map((q) => q.MaQuyen) || []);
    setIsEditing(false);
    setExpanded(false);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ marginBottom: '30px' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#063F5C' }} />}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography>
            {groupCode} - {groupName}
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              sx={{ color: '#063F5C', borderColor: '#063F5C' }}
              onClick={(e) => {
                setIsEditing(!isEditing);
              }}
            >
              Sửa
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              sx={{ color: '#063F5C', borderColor: '#063F5C' }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(group);
              }}
            >
              Xóa
            </Button>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <TextField
              label="Tên Nhóm"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={!isEditing}
              sx={{ minWidth: '200px' }}
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
                            disabled={!isEditing}
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
          {isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <DialogButtons
                textCancel="Hủy"
                text="Lưu"
                onAction={handleSave}
                onCancel={handleCancel}
              />
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
