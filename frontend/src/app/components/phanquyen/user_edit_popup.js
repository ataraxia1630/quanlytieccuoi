// Mở popup chỉnh sửa hoặc thêm
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Box, Divider } from '@mui/material';
import DialogTitleCustom from '../Dialogtitlecustom';
import FormTextField from '../Formtextfield';
import DialogButtons from '../Dialogbutton';
import SelectFieldCustom from '../Selectfieldcustom';
import GroupService from '../../service/nhom.service';

const EditUserPopUp = ({
  open,
  onClose,
  onSave,
  title,
  editData = null,
  mode = 'add',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [groupMap, setGroupMap] = useState({});
  const [errors, setErrors] = useState({
    username: '',
  });

  const fetchGroup = async () => {
    try {
      const groups = await GroupService.getAll();
      const map = {};
      const names = [];

      groups.forEach((group) => {
        names.push(group.TenNhom);
        map[group.TenNhom] = group.MaNhom;
      });

      setGroupList(names);
      setGroupMap(map);
      console.log(groups);
    } catch (error) {
      throw new Error('Không thể lấy danh sách nhóm');
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [mode]);

  useEffect(() => {
    console.log('editData', editData);
    if (mode === 'edit' && editData) {
      setUsername(editData.username || '');
      setPassword('');
      setGroupName(editData.TenNhom ? editData.TenNhom.toString() : '');
    } else {
      setUsername('');
      setGroupName('');
      setPassword('');
    }
    setErrors({ username: '' });
  }, [editData, mode]);

  const validate = () => {
    let tempErrors = { username: '' };
    let isValid = true;

    if (!username.trim()) {
      tempErrors.username = 'Username không được để trống';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Thông báo khi người dùng nhập sai
  const handleBlur = () => {
    validate();
  };

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) {
      console.log('Validate thất bại:', errors);
      alert(
        'Vui lòng kiểm tra lại thông tin: \n' +
          (errors.username ? errors.username + '\n' : '')
      );
      return;
    }

    const data = {
      MaNhom: groupMap[groupName],
    };
    if (mode === 'add') data.username = username.trim();
    if (password) data.password = password;
    console.log('Dữ liệu gửi từ popup:', data);
    onSave(data);
  };

  return (
    <Dialog
      open={open} // Kiên tra xem hộp thoại có mở hay không
      onClose={onClose} // Đóng hộp thoại khi nhấn nút hủy
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 10,
          p: 0,
          border: '2px solid #063F5C',
          width: '100%',
          maxWidth: '450px',
        },
      }}
    >
      {/* Tiêu đề của popup, title truyền trong page */}
      <DialogTitleCustom title={title} onClose={onClose} />

      <Divider sx={{ borderColor: '#063F5C', borderBottomWidth: '1.3px' }} />

      {/* Nội dung của popup */}
      <DialogContent sx={{ pt: 4, px: 3.5, pb: 3 }}>
        <Box display="flex" flexDirection="column" gap={3.5}>
          <FormTextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => handleBlur('username')}
            fullWidth
            error={!!errors.username}
            helperText={errors.username}
            disabled={mode === 'edit'}
          />
          <FormTextField
            label={mode === 'add' ? 'Password' : 'Password mới (optional)'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <SelectFieldCustom
            label="Nhóm"
            options={groupList}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onBlur={() => handleBlur('groupName')}
            fullWidth
          />
        </Box>

        <Box mt={4}>
          <DialogButtons
            textCancel={'Hủy'}
            text={'Lưu'}
            onCancel={onClose}
            onAction={handleSave}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserPopUp;
