import { Box, TextField, Typography } from "@mui/material";

const RangeInputs = ({
  label,
  fromValue,
  toValue,
  width,
  onFromChange,
  onToChange,
}) => {
  const inputSx = {
    width: width,
    "& .MuiOutlinedInput-root": {
      fontSize: "0.95rem",
      height: "37.5px",
      "& input": {
        padding: "7px 12px",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#063F5C",
      },
    },
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {label}:
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Từ"
          value={fromValue}
          onChange={(e) => onFromChange(e.target.value)}
          sx={inputSx}
        />
        <Box sx={{ width: "10px", borderTop: "1.2px solid #ccc" }} />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Đến"
          value={toValue}
          onChange={(e) => onToChange(e.target.value)}
          sx={inputSx}
        />
      </Box>
    </Box>
  );
};

export default RangeInputs;
