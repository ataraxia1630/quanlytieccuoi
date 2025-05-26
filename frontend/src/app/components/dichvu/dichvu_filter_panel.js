import { useState } from "react";
import { Box, Collapse, Paper } from "@mui/material";
import RangeInputs from "../Rangeinput";
import FilterButton from "../Filterbutton";
import StatusCheckbox from "../Statuscheckbx";

const DichVuFilter = ({ isOpen, onApply }) => {
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [status, setStatus] = useState([]);

  const handleApply = () => {
    const mappedStatus = status
      .map((s) => {
        switch (s) {
          case "co_san":
            return "Có sẵn";
          case "tam_dung":
            return "Tạm dừng";
          case "ngung_cung_cap":
            return "Ngừng cung cấp";
          default:
            return null;
        }
      })
      .filter(Boolean);

    const filterParams = {};

    if (priceFrom && !isNaN(priceFrom)) {
      filterParams.giaTu = Number(priceFrom);
    }
    if (priceTo && !isNaN(priceTo)) {
      filterParams.giaDen = Number(priceTo);
    }

    if (mappedStatus.length > 0 && !status.includes("tat_ca")) {
      filterParams.tinhTrang = mappedStatus;
    }

    onApply(filterParams);
  };

  const handleReset = () => {
    setPriceFrom("");
    setPriceTo("");
    setStatus([]);
    onApply({});
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          <RangeInputs
            width="130px"
            label="Khoảng giá"
            fromValue={priceFrom}
            toValue={priceTo}
            onFromChange={setPriceFrom}
            onToChange={setPriceTo}
          />

          <Box sx={{ display: "block" }}>
            <StatusCheckbox
              label="Trạng thái"
              value={status}
              onChange={setStatus}
              row={false}
              options={[
                { value: "co_san", label: "Có sẵn" },
                { value: "tam_dung", label: "Tạm dừng" },
                { value: "ngung_cung_cap", label: "Ngừng cung cấp" },
                { value: "tat_ca", label: "Tất cả" },
              ]}
            />
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <FilterButton
            text="Reset"
            onClick={handleReset}
            colorVariant="reset"
          />

          <FilterButton text="Apply" onClick={handleApply} />
        </Box>
      </Paper>
    </Collapse>
  );
};

export default DichVuFilter;
