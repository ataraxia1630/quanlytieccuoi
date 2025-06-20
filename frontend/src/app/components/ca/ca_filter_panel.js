import { Box, Collapse, Paper } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormTextField from "../../components/Formtextfield";
import FilterButton from "../../components/Filterbutton";

const FilterPanel = ({ isOpen, onApply }) => {
  // Set default time values - 06:00:00 for start and 22:00:00 for end
  const defaultTimeFrom = new Date('1970-01-01T06:00:00');
  const defaultTimeTo = new Date('1970-01-01T22:00:00');
  
  const [timeFrom, setTimeFrom] = useState(defaultTimeFrom);
  const [timeTo, setTimeTo] = useState(defaultTimeTo);
  const handleApply = () => {
    const filters = {};
    
    // If timeFrom is empty/null, set it to default and use default value for filter
    const finalTimeFrom = timeFrom || defaultTimeFrom;
    const finalTimeTo = timeTo || defaultTimeTo;
    
    // Update state with default values if they were empty
    if (!timeFrom) {
      setTimeFrom(defaultTimeFrom);
    }
    if (!timeTo) {
      setTimeTo(defaultTimeTo);
    }
    
    filters.gioBatDauFrom = finalTimeFrom.toTimeString().slice(0, 8);
    filters.gioBatDauTo = finalTimeTo.toTimeString().slice(0, 8);
    
    onApply(filters);
  };
  const handleReset = () => {
    setTimeFrom(defaultTimeFrom);
    setTimeTo(defaultTimeTo);
    onApply({});
  };

  const handleTimeFromChange = (newValue) => {
    setTimeFrom(newValue);
  };

  const handleTimeToChange = (newValue) => {
    setTimeTo(newValue);
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
              value={timeFrom}
              onChange={handleTimeFromChange}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  sx={{ width: "150px" }}
                />
              )}
            />
            <TimePicker
              label="Giờ kết thúc"
              value={timeTo}
              onChange={handleTimeToChange}
              format="HH:mm:ss"
              ampm={false}
              views={["hours", "minutes", "seconds"]}
              renderInput={(params) => (
                <FormTextField
                  {...params}
                  fullWidth
                  sx={{ width: "150px" }}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
          <FilterButton text="Reset" onClick={handleReset} colorVariant="reset" />
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default FilterPanel;