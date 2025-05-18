import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";

const Dropdown = ({ label, value, onChange, width, options = [] }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {label}:
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
          sx={{
            width: width,
            "& .MuiSelect-select": {
              padding: "7px 12px",
            },
          }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Dropdown;
