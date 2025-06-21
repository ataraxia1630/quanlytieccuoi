import {
  Box,
  FormControlLabel,
  Typography,
  RadioGroup,
  Radio,
} from "@mui/material";

const StatusRadio = ({
  label = "Trạng thái",
  value,
  onChange,
  options = [],
  row = false,
}) => {
  return (
    <Box>
      {label && (
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          {label}:
        </Typography>
      )}
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row={row}
        sx={{  
          ".css-1tclnr1-MuiTypography-root": {
            marginBottom: 0
          }
         }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
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
      </RadioGroup>
    </Box>
  );
};

export default StatusRadio;
