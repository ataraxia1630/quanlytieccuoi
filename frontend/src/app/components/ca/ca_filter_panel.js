import { Box, Collapse, Paper } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormTextField from "../../components/Formtextfield";
import FilterButton from "../../components/Filterbutton";

const FilterPanel = ({ isOpen, onApply }) => {
  const [timeFrom, setTimeFrom] = useState("00:00:00");
  const [timeTo, setTimeTo] = useState("23:00:00");

  const handleApply = () => {
    onApply({
      gioBatDau: timeFrom,
      gioKetThuc: timeTo,
    });
  };

  const handleTimeFromChange = (newValue) => {
    if (newValue) {
      setTimeFrom(newValue.toTimeString().slice(0, 8));
    } else {
      setTimeFrom("00:00:00");
    }
  };

  const handleTimeToChange = (newValue) => {
    if (newValue) {
      setTimeTo(newValue.toTimeString().slice(0, 8));
    } else {
      setTimeTo("23:59:59");
    }
  };

  return (
    <Collapse in={isOpen}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 5,
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <TimePicker
              label="Giờ bắt đầu"
              value={timeFrom ? new Date(`1970-01-01T${timeFrom}`) : null}
              onChange={handleTimeFromChange}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  sx={{ width: "90px" }}
                />
              )}
            />
            <TimePicker
              label="Giờ kết thúc"
              value={timeTo ? new Date(`1970-01-01T${timeTo}`) : null}
              onChange={handleTimeToChange}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  sx={{ width: "90px" }}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default FilterPanel;