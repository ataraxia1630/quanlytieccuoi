import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SelectFieldCustom = ({
  label,
  value,
  onChange,
  options,
  menuProps = {},
  error = false,
  helperText = '',
  fullWidth = false,
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      variant="outlined"
      error={error}
      sx={{
        '& .MuiInputLabel-root': {
          color: error ? '#d32f2f' : 'black',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: error ? '#d32f2f' : '#063F5C',
        },
      }}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        value={value}
        onChange={onChange}
        label={label}
        IconComponent={KeyboardArrowDownIcon}
        error={error}
        sx={{
          color: 'black',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? '#d32f2f' : '#063F5C',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? '#d32f2f' : '#063F5C',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? '#d32f2f' : '#063F5C',
          },
        }}
        MenuProps={{
          disablePortal: true,
          PaperProps: {
            style: {
              maxHeight: 160,
              overflowY: 'auto',
            },
          },
          ...menuProps,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText sx={{ color: error ? '#d32f2f' : 'inherit' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectFieldCustom;
