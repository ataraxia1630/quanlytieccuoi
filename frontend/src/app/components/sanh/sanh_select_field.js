import { MenuItem, Select, FormControl, InputLabel, FormHelperText } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectFieldCustom = ({
  label,
  value,
  onChange,
  options,
  name,
  error,
  helperText,
  menuProps = {},
}) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={error}
      sx={{
        "& .MuiInputLabel-root": {
          color: error ? "#d32f2f" : "black",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: error ? "#d32f2f" : "#063F5C",
        },
      }}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        error={error}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          color: "black",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#063F5C",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#063F5C",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: error ? "#d32f2f" : "#063F5C",
          },
        }}
        MenuProps={{
          disablePortal: true,
          PaperProps: {
            style: {
              maxHeight: 160,
              overflowY: "auto",
            },
          },
          ...menuProps,
        }}
      >        {options && options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label || option.value}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectFieldCustom;