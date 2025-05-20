import { Box, Collapse, Paper } from "@mui/material";
import Dropdown from "../../components/Dropdown";
import RangeInputs from "../../components/Rangeinput";
import FilterButton from "../../components/Filterbutton";
import sanhService from "../../service/sanh.service";
import { useEffect, useState } from "react";

const FilterPanel = ({ isOpen, onApply, options }) => {
  const [maLoaiSanh, setMaLoaiSanh] = useState("");
  const [quantityFrom, setQuantityFrom] = useState("0");
  const [quantityTo, setQuantityTo] = useState("255");
  const [loaiSanhOptions, setLoaiSanhOptions] = useState(["LS001", "LS002", "LS003"]); // Default options

  const handleApply = () => {
    onApply({
      maLoaiSanh,
      minSoLuongBan: quantityFrom,
      maxSoLuongBan: quantityTo,
    });
  };
  useEffect(() => {
    const fetchLoaiSanh = async () => {
      try {
        const response = await sanhService.getAllLoaiSanh();
        const loaiSanhData = await response.data;
        console.log("Dữ liệu loại sảnh từ API (đã trích xuất data):", loaiSanhData);

        const options = loaiSanhData.map((loai) => ({
          value: loai.MaLoaiSanh,
          label: loai.MaLoaiSanh,
        }));
        setLoaiSanhOptions(options);
      } catch (error) {
        console.error("Error fetching loai sanh options:", error.message);
      }
    };
    fetchLoaiSanh();
  }, []);

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
            options={loaiSanhOptions}
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