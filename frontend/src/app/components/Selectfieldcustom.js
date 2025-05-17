import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const SelectFieldCustom = ({
  label,
  value,
  onChange,
  options,
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
              maxHeight: 170,
              overflowY: "auto",
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
    </FormControl>
  );
};

export default SelectFieldCustom;
