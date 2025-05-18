import { Box, TextField, Typography } from "@mui/material";

const RangeInputs = ({
  label,
  fromValue,
  toValue,
  width,
  onFromChange,
  onToChange,
}) => {
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
          sx={{
            width: width,
            "& .MuiOutlinedInput-root": {
              fontSize: "0.875rem",
              height: "37.5px",
              "& input": {
                padding: "7px 12px",
              },
            },
          }}
        />
        <Box sx={{ width: "10px", borderTop: "1.2px solid #ccc" }} />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Đến"
          value={toValue}
          onChange={(e) => onToChange(e.target.value)}
          sx={{ width: width }}
        />
      </Box>
    </Box>
  );
};

export default RangeInputs;
