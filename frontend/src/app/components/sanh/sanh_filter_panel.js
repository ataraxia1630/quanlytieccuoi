import { Box, Collapse, Paper } from "@mui/material";
import Dropdown from "../../components/Dropdown";
import RangeInputs from "../../components/Rangeinput";
import FilterButton from "../../components/Filterbutton";
import sanhService from "../../service/sanh.service";
import toastService from "../../service/toast/toast.service";
import { useEffect, useState } from "react";

const FilterPanel = ({ isOpen, onApply, options }) => {
  const [maLoaiSanh, setMaLoaiSanh] = useState("");  const [quantityFrom, setQuantityFrom] = useState("1");
  const [quantityTo, setQuantityTo] = useState("255");
  const [loaiSanhOptions, setLoaiSanhOptions] = useState([]);  const handleApply = () => {
    // Set default values if empty
    let fromValue = quantityFrom;
    let toValue = quantityTo;
    
    if (!fromValue || fromValue.trim() === '') {
      fromValue = "1";
      setQuantityFrom("1");
    }
    
    if (!toValue || toValue.trim() === '') {
      toValue = "255";
      setQuantityTo("255");
    }
    
    // Validation for range inputs
    const fromNum = fromValue ? parseInt(fromValue) : 1;
    const toNum = toValue ? parseInt(toValue) : 255;
    
    // Validation for max value
    if (toNum > 255) {
      toastService.error('Số lượng bàn chỉ có thể từ 1 - 255', 'filter-validation-error');
      return;
    }
    
    if (fromNum > 255) {
      toastService.error('Số lượng bàn chỉ có thể từ 1 - 255', 'filter-validation-error');
      return;
    }
    
    if (fromNum > toNum) {
      toastService.error('Số lượng bàn "từ" không thể lớn hơn số lượng bàn "đến"', 'filter-validation-error');
      return;
    }
    
    onApply({
      maLoaiSanh,
      minSoLuongBan: fromNum,
      maxSoLuongBan: toNum,
    });
  };

  // Handler để chỉ cho phép nhập số
  const handleQuantityChange = (value, setter) => {
    // Chỉ cho phép số và empty string
    if (value === '' || /^[0-9]+$/.test(value)) {
      setter(value);
    }
  };
  const handleReset = () => {
    setMaLoaiSanh("");
    setQuantityFrom("1");
    setQuantityTo("255");
    onApply({}); // Apply empty filters
  };
  useEffect(() => {
    const fetchLoaiSanh = async () => {
      try {
        const response = await sanhService.getAllLoaiSanh();
        const loaiSanhData = await response.data;
        console.log("Dữ liệu loại sảnh từ API (đã trích xuất data):", loaiSanhData);        const options = loaiSanhData.map((loai) => ({
          value: loai.MaLoaiSanh,
          label: loai.TenLoaiSanh, // Hiển thị tên thay vì mã
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
            label="Loại sảnh"
            value={maLoaiSanh}
            onChange={setMaLoaiSanh}
            width="150px"
            options={loaiSanhOptions}
          />          <RangeInputs
            width={"90px"}
            label="Số lượng bàn tối đa"
            fromValue={quantityFrom}
            toValue={quantityTo}
            onFromChange={(value) => handleQuantityChange(value, setQuantityFrom)}
            onToChange={(value) => handleQuantityChange(value, setQuantityTo)}
          />
        </Box>        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
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

export default FilterPanel;