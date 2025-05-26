import { Box, Collapse, Paper } from "@mui/material";
import Dropdown from "./Dropdown";
import RangeInputs from "./Rangeinput";
import FilterButton from "./Filterbutton";
import StatusCheckbox from "./Statuscheckbx";
import { useState } from "react";
import StatusRadio from "./Statusradio";

const FilterPanel = ({ isOpen, onApply }) => {
  const [category, setCategory] = useState("");
  const [quantityFrom, setQuantityFrom] = useState("");
  const [quantityTo, setQuantityTo] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [status, setStatus] = useState([]);
  const [statusRadiobtn, setStatusRadiobtn] = useState();

  const handleApply = () => {
    onApply({
      category,
      quantity: { from: quantityFrom, to: quantityTo },
      price: { from: priceFrom, to: priceTo },
      status,
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
          {/* Dropdown */}
          <Dropdown
            label="Loại sảnh"
            value={category}
            onChange={setCategory}
            width="150px"
            options={[
              { value: "loai1", label: "Loại 1" },
              { value: "loai2", label: "Loại 2" },
              { value: "loai3", label: "Loại 3" },
            ]}
          />

          {/* Range input cho Số lượng bàn tối đa */}
          <RangeInputs
            width="90px"
            label="Số lượng bàn tối đa"
            fromValue={quantityFrom}
            toValue={quantityTo}
            onFromChange={setQuantityFrom}
            onToChange={setQuantityTo}
          />

          {/* Range input cho Khoảng giá */}
          <RangeInputs
            width="90px"
            label="Khoảng giá"
            fromValue={priceFrom}
            toValue={priceTo}
            onFromChange={setPriceFrom}
            onToChange={setPriceTo}
          />

          {/* Checkbox cho Trạng thái */}
          <Box sx={{ display: "block" }}>
            <StatusCheckbox
              label="Trạng thái áp dụng"
              value={status}
              onChange={setStatus}
              row={false}
              options={[
                { value: "con_ap_dung", label: "Còn áp dụng" },
                { value: "tam_ngung", label: "Tạm ngưng" },
                { value: "ngung_ap_dung", label: "Ngưng áp dụng" },
                { value: "tat_ca", label: "Tất cả" },
              ]}
            />
          </Box>

          <StatusRadio
            label="Trạng thái áp dụng"
            value={statusRadiobtn}
            onChange={setStatusRadiobtn}
            options={[
              { value: "con_ap_dung", label: "Còn áp dụng" },
              { value: "tam_ngung", label: "Tạm ngưng" },
              { value: "ngung_ap_dung", label: "Ngưng áp dụng" },
              { value: "tat_ca", label: "Tất cả" },
            ]}
          />
        </Box>

        {/* Nút áp dụng lọc */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default FilterPanel;
