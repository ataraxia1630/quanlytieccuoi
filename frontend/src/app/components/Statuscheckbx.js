import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";

const StatusCheckbox = ({
  label = "Trạng thái",
  value = [],
  onChange,
  options = [],
  row = false,
}) => {
  const handleCheckboxChange = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          {label}:
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: row ? "row" : "column",
          gap: row ? 2 : 0.5,
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                sx={{
                  "&.Mui-checked": {
                    color: "#063F5C",
                  },
                }}
              />
            }
            label={option.label}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StatusCheckbox;
