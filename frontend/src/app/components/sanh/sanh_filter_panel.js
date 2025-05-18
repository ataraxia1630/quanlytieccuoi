import { Box, Collapse, Paper } from "@mui/material";
import Dropdown from "../../components/Dropdown";
import RangeInputs from "../../components/Rangeinput";
import FilterButton from "../../components/Filterbutton";
import { useState } from "react";

const FilterPanel = ({ isOpen, onApply, options }) => {
  const [maLoaiSanh, setMaLoaiSanh] = useState("");
  const [quantityFrom, setQuantityFrom] = useState("");
  const [quantityTo, setQuantityTo] = useState("");

  const handleApply = () => {
    onApply({
      maLoaiSanh,
      minSoLuongBan: quantityFrom,
      maxSoLuongBan: quantityTo,
    });
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Dropdown
            label="Mã loại sảnh"
            value={maLoaiSanh}
            onChange={setMaLoaiSanh}
            width="150px"
            options={options.maLoaiSanh.map((value) => ({
              value,
              label: value,
            }))}
          />

          <RangeInputs
            width={"90px"}
            label="Số lượng bàn tối đa"
            fromValue={quantityFrom}
            toValue={quantityTo}
            onFromChange={setQuantityFrom}
            onToChange={setQuantityTo}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default FilterPanel;