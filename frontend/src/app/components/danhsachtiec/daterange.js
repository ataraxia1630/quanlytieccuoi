import { Box, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateRangePicker = ({ label, fromDate, toDate, onFromChange, onToChange }) => {
  const inputStyle = {
    width: 150,
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {label && (
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {label}:
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
         <DatePicker
          label="Từ"
          value={fromDate ? dayjs(fromDate) : null}
          onChange={(newValue) =>
            onFromChange(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
          }
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              sx: inputStyle,
              onKeyDown: (e) => e.preventDefault(), 
            },
          }}
        />


          <Box sx={{ width: "10px", borderTop: "1.2px solid #ccc", mb: 1.5 }} />
          <DatePicker
            label="Đến"
            value={toDate ? dayjs(toDate) : null}
            onChange={(newValue) =>
              onToChange(newValue ? dayjs(newValue).format("YYYY-MM-DD") : "")
            }
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                variant: "outlined",
                size: "small",
                sx: inputStyle,
                onKeyDown: (e) => e.preventDefault(), 
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
