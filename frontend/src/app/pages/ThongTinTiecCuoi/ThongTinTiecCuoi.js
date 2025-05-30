import React, { useState, useContext } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './ThongTinTiecCuoi.css';
import FormTextField from '../../components/Formtextfield';
import Cancelbutton from '../../components/Cancelbutton';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { PhieuDatTiecService } from '../../service/phieudattiec.service';
import useValidation from '../../validation/validation';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ThongTinTiecCuoi = () => {
  const { validatePhoneNumberField, validateNumberField, validateTimeField } = useValidation();
  const [errors, setErrors] = useState({
    SDT: "",
    NgayDaiTiec: "",
    TienDatCoc: "",
    SoLuongBan: "",
    NgayDatTiec: "",
  });
  const [phieuDatTiec, setPhieuDatTiec] = useState({
    MaSanh: "",
    TenChuRe: "",
    TenCoDau: "",
    SDT: "",
    NgayDaiTiec: "",
    MaCa: "",
    TienDatCoc: 0,
    SoLuongBan: 0,
    SoBanDuTru: 0,
    NgayDatTiec: "",
    TrangThai: "CHUA_THANH_TOAN",
  })

  const { handleNav } = useContext(StepContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhieuDatTiec({ ...phieuDatTiec, [name]: value });
    if (name === "NgayDaiTiec" || name === "NgayDatTiec") {
      validateTimeField(name, value, setErrors);
    }
    else if (name === "TienDatCoc" || name === "SoLuongBan") {
      validateNumberField(name, value, setErrors);
    }
    else if (name === "SDT") {
      validatePhoneNumberField(name, value, setErrors);
    }
  };

  return (
    <div className="thongtintieccuoi-page">
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100vh', width: '96%' }}>

        {/* Left Section */}
        <Box className="form-section">
          <Box className="form-grid">
            <FormTextField label="Tên chú rể" name="TenChuRe" value={phieuDatTiec.TenChuRe} onChange={handleChange} />
            <FormTextField label="Tên cô dâu" name="TenCoDau" value={phieuDatTiec.TenCoDau} onChange={handleChange} />
            <FormTextField
              label="Số điện thoại"
              name="SDT"
              value={phieuDatTiec.SDT}
              onChange={handleChange}
              error={!!errors.SDT}
              helperText={errors.SDT} />

            <FormTextField
              label="Tiền đặt cọc"
              name="TienDatCoc"
              value={phieuDatTiec.TienDatCoc}
              onChange={handleChange}
              error={!!errors.TienDatCoc}
              helperText={errors.TienDatCoc}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Ngày đặt tiệc"
                name="NgayDatTiec"
                value={phieuDatTiec.NgayDatTiec}
                onChange={(newValue) => handleChange({ target: { name: "NgayDatTiec", value: newValue } })}
                format="dd-MM-yyyy HH:mm:ss"
                ampm={false}
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    fullWidth
                    error={!!errors.NgayDatTiec}
                    helperText={errors.NgayDatTiec}
                  />
                )}
              />

              <DateTimePicker
                label="Ngày đãi tiệc"
                name="NgayDaiTiec"
                value={phieuDatTiec.NgayDaiTiec}
                onChange={(newValue) => handleChange({ target: { name: "NgayDaiTiec", value: newValue } })}
                format="dd-MM-yyyy HH:mm:ss"
                ampm={false}
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    fullWidth
                    error={!!errors.NgayDaiTiec}
                    helperText={errors.NgayDaiTiec}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>

          {/* Table Selection */}
          <Box className="table-selection">
            <div className="BookingCount-container" style={{ paddingTop: 20 }}  >
              <FormTextField
                label="Số lượng bàn"
                value={phieuDatTiec.SoLuongBan}
                name="SoLuongBan"
                onChange={handleChange}
                size="medium"
                error={!!errors.SoLuongBan}
                helperText={errors.SoLuongBan}
              />
            </div>

            <div className="BookingCount-container">
              <span>Số lượng bàn dự trữ</span>
              <IconButton sx={{ ml: 2 }} onClick={() => handleChange({ target: { name: "SoLuongBan", value: Math.max(1, phieuDatTiec.SoLuongBan - 5) } })}><RemoveIcon /></IconButton>
              <Typography mt={5}>{phieuDatTiec.SoBanDuTru}</Typography>
              <IconButton onClick={() => handleChange({ target: { name: "SoLuongBan", value: phieuDatTiec.SoBanDuTru + 5 } })}><AddIcon /></IconButton>
            </div>


            <Cancelbutton onClick={() => handleNav()} textCancel="Continue" />
          </Box>
        </Box>

        {/* Right Section */}
        <Box className="image-section">
          <Box className="image-text">
            <Typography variant="h4" gutterBottom>Save the Date</Typography>
            <Typography variant="h6">Family & Love</Typography>
            <Typography variant="body2">../../2025</Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ThongTinTiecCuoi;
