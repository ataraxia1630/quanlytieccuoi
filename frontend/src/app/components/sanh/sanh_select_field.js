import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectFieldCustom = ({
  label,
  value,
  onChange,
  options,
  name, // Thêm prop name
  menuProps = {},
}) => {
  return (
    <FormControl
      fullWidth
      variant="outlined"
      sx={{
        "& .MuiInputLabel-root": {
          color: "black",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#063F5C",
        },
      }}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        name={name} // Truyền prop name xuống Select
        value={value}
        onChange={onChange}
        label={label}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          color: "black",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#063F5C",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#063F5C",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#063F5C",
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
      >
        {options && options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {/*option.label || */option.value} {/* Hiển thị label nếu có, ngược lại hiển thị value */}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFieldCustom;