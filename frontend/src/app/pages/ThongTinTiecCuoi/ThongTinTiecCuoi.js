import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, IconButton, Typography, Grid } from '@mui/material';
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import './ThongTinTiecCuoi.css';
import FormTextField from '../../components/Formtextfield';
import Cancelbutton from '../../components/Cancelbutton';
import SaveAndPrintButton from '../../components/Someactionbutton';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PhieuDatTiecService from '../../service/phieudattiec.service';
import caService from '../../service/ca.service';
import sanhService from '../../service/sanh.service';
import useValidation from '../../validation/validation';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HallCard from '../../components/Hallcard';
import { format, isValid } from 'date-fns';
import toastService from '../../service/toast/toast.service';
import LoaiSanhService from '../../service/loaisanh.service';

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState = {
  MaSanh: null,
  TenChuRe: null,
  TenCoDau: null,
  SDT: null,
  NgayDaiTiec: today,
  MaCa: null,
  TienDatCoc: 0,
  SoLuongBan: 1,
  SoBanDuTru: 0,
  NgayDatTiec: today,
  TrangThai: "Chưa thanh toán",
};


const ThongTinTiecCuoi = () => {

  //thong tin cơ bản 
  const { validateNumberField } = useValidation();
  const [currentPDT, setCurrentPDT] = useState(null)
  const [originDate, setOriginDate] = useState(null)
  const [errors, setErrors] = useState({
    SDT: "",
    TenChuRe: "",
    TenCoDau: "",
    NgayDaiTiec: "",
    GioDaiTiec: "",
    TienDatCoc: "",
    SoLuongBan: "",
    SoBanDuTru: "",
    MaSanh: "",
    MaCa: ""
  });
  const [phieuDatTiec, setPhieuDatTiec] = useState(initialState)


  //sảnh/ca
  const [halls, setHalls] = useState([]);
  const [shifts, setshifts] = useState([]);
  const sectionRef = useRef(null);
  const sectionRef2 = useRef(null);


  //introduction
  const introductionHalls = useMemo(() => [
    {
      title: 'Sang Trọng',
      description: 'Sảnh tiệc cưới sang trọng, rộng rãi với thiết kế tinh tế, tạo không gian ấm cúng và đẳng cấp cho ngày trọng đại.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
    },
    {
      title: 'Cổ Điển',
      description: 'Sảnh tiệc cưới cổ điển sang trọng, với các chi tiết hoa văn tinh xảo và nội thất quý phái, mang đến không gian trang nhã và đẳng cấp cho lễ cưới.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730641/Image-1_u1ebzb.png',
    },
    {
      title: 'Lãng Mạn',
      description: 'Sảnh tiệc cưới lãng mạn với sắc hoa tươi thắm và thiết kế mềm mại, tạo nên không gian ấm áp, dịu dàng cho ngày trọng đại.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image-2_sc6ztt.png',
    },
  ], []);

  const { handleNav } = useContext(StepContext);


  //định dạng lại ngày 
  const pdtReFormat = useMemo(() => {
    const ngayDaiTiec = phieuDatTiec.NgayDaiTiec;
    const ngayDatTiec = phieuDatTiec.NgayDatTiec;

    return {
      ...phieuDatTiec,
      NgayDaiTiec: isValid(new Date(ngayDaiTiec)) ? format(new Date(ngayDaiTiec), "yyyy-MM-dd'T'HH:mm:ss") : null,
      NgayDatTiec: isValid(new Date(ngayDatTiec)) ? format(new Date(ngayDatTiec), "yyyy-MM-dd'T'HH:mm:ss") : null,
    };
  }, [phieuDatTiec]);
  // Tìm sảnh tương ứng dựa trên MaSanh
  const sanhInfo = useMemo(() => {

    return halls.find(sanh => sanh.MaSanh === phieuDatTiec.MaSanh) || { TenSanh: "", TenLoaiSanh: "", SoLuongBanToiDa: "" };
  }, [phieuDatTiec.MaSanh, halls]);

  // Tìm ca tương ứng dựa trên MaCa
  const caInfo = useMemo(() => {
    return shifts.find(ca => ca.MaCa === phieuDatTiec.MaCa) || { MaCa: null, TenCa: "", ThoiGianBatDau: "", ThoiGianKetThuc: "" };
  }, [phieuDatTiec.MaCa, shifts]);



  //Validation
  const validatePhoneNumberField = useCallback((name, value) => {
    const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    if (!value || !phoneRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Số điện thoại không hợp lệ. ",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, []);


  const validateDateField = useCallback((name, value) => {
    const today = new Date();
    const timeStr = value instanceof Date ? value.toTimeString() : (value || "");
    if (timeStr && value.getTime() < today.getTime()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Ngày không được trước ngày hiện tại!",
      }));
    }
    else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, []);

  const validateTimeField = useCallback((name, value, gioBatDau, gioketthuc) => {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return;
    }

    const now = new Date();

    const gioPhutGiay = {
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds()
    };

    const nowTime = {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };

    // So sánh giờ phút giây với thời điểm hiện tại
    const isInPast =
      gioPhutGiay.hour < nowTime.hour ||
      (gioPhutGiay.hour === nowTime.hour && gioPhutGiay.minute < nowTime.minute) ||
      (gioPhutGiay.hour === nowTime.hour && gioPhutGiay.minute === nowTime.minute && gioPhutGiay.second < nowTime.second);

    if (isInPast) {
      setErrors(prev => ({ ...prev, [name]: "Thời gian đãi tiệc không được trong quá khứ" }));
      return;
    }

    // Chuyển đổi thời gian dạng chuỗi về số phút trong ngày để dễ so sánh
    const toMinutes = (time) => {
      if (typeof time === 'string') {
        const [h, m] = time.split(':');
        return parseInt(h) * 60 + parseInt(m);
      } else if (typeof time === 'object') {
        return time.hour * 60 + time.minute;
      }
      return 0;
    };

    const gioValueMinutes = toMinutes(gioPhutGiay);
    const gioBDMinutes = toMinutes(gioBatDau);
    const gioKTMinutes = toMinutes(gioketthuc);

    const isOutsideRange =
      (gioBDMinutes > gioKTMinutes && (gioValueMinutes > gioKTMinutes && gioValueMinutes < gioBDMinutes)) ||
      (gioBDMinutes < gioKTMinutes && (gioValueMinutes > gioKTMinutes || gioValueMinutes < gioBDMinutes));

    if (isOutsideRange) {
      setErrors(prev => ({ ...prev, [name]: "Thời gian đãi tiệc phải thuộc khung giờ của ca đã chọn" }));
    } else {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

  }, []);

  const validateTextField = useCallback((name, value) => {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return;
    }
    else
      setErrors((prev) => ({ ...prev, [name]: "" }))
  }, []);

  const validateRequiredField = useCallback(() => {
    const requiredFields = {
      TenChuRe: "Tên chú rể không được để trống.",
      TenCoDau: "Tên cô dâu không được để trống.",
      SDT: "Số điện thoại không được để trống.",
      NgayDaiTiec: "Ngày đãi tiệc không được để trống.",
      MaSanh: "Chưa chọn sảnh."
    };

    const rErrors = {};

    for (const [key, message] of Object.entries(requiredFields)) {
      const value = pdtReFormat[key];

      if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")
      ) {
        rErrors[key] = message;
      }
    }

    // Sau đó set lỗi
    setErrors(rErrors);

  }, [pdtReFormat]);

  //Phiếu đặt tiệc
  // lưu thông tin thay đổi vào phieuDatTiec
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    // Nếu là trường số thì ép kiểu số nguyên
    if (name === "SoLuongBan" || name === "TienDatCoc" || name === "SoBanDuTru") {
      if (newValue.length > 21) return;
      else
        newValue = parseInt(value, 10);
      if (isNaN(newValue) || newValue < 0) {
        if (value !== "") {
          console.error(`Giá trị không hợp lệ cho trường ${name}: ${value}`);
          return;
        }
        else newValue = 0

      }
    }




    //data validation
    switch (name) {
      case "TenCoDau": case 'TenChuRe':
        validateTextField(name, newValue);
        break;
      case "NgayDaiTiec":
        if (!(newValue instanceof Date) || isNaN(newValue.getTime())) {
          return;
        }
        validateDateField(name, newValue);

        break;
      case "TienDatCoc":

        validateNumberField(name, newValue, setErrors);
        break;
      case "SoLuongBan":
        validateNumberField(name, newValue, setErrors);
        if (phieuDatTiec.MaSanh && newValue + phieuDatTiec.SoBanDuTru > Number(sanhInfo.SoLuongBanToiDa)) {
          setErrors(prev => ({ ...prev, SoLuongBan: "Sảnh quá nhỏ so với số lượng bàn yêu cầu" }));
        }
        else setErrors(prev => ({ ...prev, SoLuongBan: "", SoBanDuTru: "" }))
        break;
      case "SoBanDuTru":
        validateNumberField(name, newValue, setErrors);
        if (phieuDatTiec.MaSanh && newValue + phieuDatTiec.SoLuongBan > Number(sanhInfo.SoLuongBanToiDa)) {
          setErrors(prev => ({ ...prev, SoBanDuTru: "Sảnh quá nhỏ so với số lượng bàn yêu cầu" }));
        }
        else setErrors(prev => ({ ...prev, SoLuongBan: "", SoBanDuTru: "" }))
        break;
      case "SDT":
        validatePhoneNumberField(name, newValue);
        break;
      case 'sanhCa':
        const newCa = shifts.find(ca => ca.MaCa === newValue.MaCa) || { MaCa: null, TenCa: "", ThoiGianBatDau: "", ThoiGianKetThuc: "" };
        validateTimeField('GioDaiTiec', phieuDatTiec.NgayDaiTiec, newCa.GioBatDau, newCa.GioKetThuc);
        break;
      case 'GioDaiTiec':
        if (caInfo.MaCa)
          validateTimeField('GioDaiTiec', newValue, caInfo.GioBatDau, caInfo.GioKetThuc);
        break;
      default:
        break;
    }


    //set phieudattiec prop
    if (name === "sanhCa") {
      setPhieuDatTiec(prev => ({
        ...prev,
        MaSanh: newValue.MaSanh,
        MaCa: newValue.MaCa,
      }));
      handleScroll(sectionRef2);
      toast.success(`Đã chọn sảnh/ca thành công`);
    }
    else if (name === "GioDaiTiec" && newValue) {
      const currentNgay = new Date(phieuDatTiec.NgayDaiTiec);
      const gioMoi = newValue;

      const ngayCapNhat = new Date(
        currentNgay.getFullYear(),
        currentNgay.getMonth(),
        currentNgay.getDate(),
        gioMoi.getHours(),
        gioMoi.getMinutes(),
        gioMoi.getSeconds()
      );

      setPhieuDatTiec(prev => ({
        ...prev,
        NgayDaiTiec: ngayCapNhat
      }));
    }
    else
      setPhieuDatTiec({ ...phieuDatTiec, [name]: newValue });


  };

  // Hàm xử lý khi nhấn nút cuộn
  const handleScroll = (targetRef) => {
    targetRef?.current.scrollIntoView({ behavior: 'smooth' });
  };


  const fetchFullCa = useCallback(async (id) => {
    try {
      const data = await caService.getAllCa();
      setshifts(data);
    } catch (error) {
      toastService.error(`${error.message || 'Không thể tải dữ liệu ca!'}`);
    }

  }, []);


  // fetch data phiếu đặt tiêc neeys đang tiến hành đặt tiệc
  const fetchCurrentPhieuDatTiec = useCallback(async (id) => {
    try {
      const data = await PhieuDatTiecService.getPhieuDatTiecById(id);

      // Lọc dữ liệu để chỉ lấy các trường có trong initialState
      let newData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key in initialState)
      );
      newData = {
        ...newData,
        NgayDaiTiec: new Date(newData.NgayDaiTiec),
        NgayDatTiec: new Date(newData.NgayDatTiec)
      };

      setPhieuDatTiec(newData);
      setOriginDate(newData.NgayDaiTiec);
      localStorage.setItem("SoLuongBan", newData.SoLuongBan);

    } catch (error) {
      toastService.error(`${error.message || 'Không thể tải dữ liệu phiếu đặt tiệc!'}`);
    }

  }, []);

  const fetchValidSanhByDate = useCallback(async (queries) => {
    try {
      const data = await sanhService.getSanhsAvailabilityByDate(queries);
      setHalls(data);
    } catch (error) {
      toastService.error(`${error.message || 'Không thể tải dữ liệu sảnh!'}`);
    }

  }, []);


  // tạo data phiếu đặt tiệc
  const createCurrentPhieuDatTiec = useCallback(async (id) => {

    try {
      const data = await PhieuDatTiecService.createPhieuDatTiec(pdtReFormat);
      const sanh = halls.find(sanh => sanh.MaSanh === data.data.MaSanh) || null;
      if (sanh) {
        const loaiSanh = await LoaiSanhService.getById(sanh.MaLoaiSanh);
        localStorage.setItem("DonGiaBanToiThieu", loaiSanh.DonGiaBanToiThieu);
      }
      localStorage.setItem("currentPDT", data.data.SoPhieuDatTiec);
      localStorage.setItem("SoLuongBan", pdtReFormat.SoLuongBan);
      console.log("Don gia ban toi thieu: ", localStorage.getItem("DonGiaBanToiThieu"))
      console.log("So luongg ban: ", localStorage.getItem("SoLuongBan"))

      window.scrollTo({ top: 0, behavior: 'smooth' });
      handleNav()
    } catch (error) {
      toastService.error(`Lỗi: ${error.message || 'Không thể tạo mới phiếu dặt tiệc!'}`);
    }

  }, [pdtReFormat, handleNav]);

  // cập nhật data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const updateCurrentPhieuDatTiec = useCallback(async (id) => {
    try {
      await PhieuDatTiecService.updatePhieuDatTiec(id, pdtReFormat);
      const sanh = halls.find(sanh => sanh.MaSanh === pdtReFormat.MaSanh) || null;
      if (sanh) {
        const loaiSanh = await LoaiSanhService.getById(sanh.MaLoaiSanh);
        localStorage.setItem("DonGiaBanToiThieu", loaiSanh.DonGiaBanToiThieu || 0);
      }

      localStorage.setItem("SoLuongBan", pdtReFormat.SoLuongBan);
      toast.success("Cập nhật phiếu đặt tiệc thành công!")
      window.scrollTo({ top: 0, behavior: 'smooth' });
      handleNav()

    } catch (error) {
      toastService.error(`Lỗi: ${error.message || 'Không thể cập nhật phiếu đặt tiệc!'}`);
    }
  }, [pdtReFormat, handleNav]);

  // hủy data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const removeCurrentPhieuDatTiec = useCallback(async (id) => {
    try {
      if (id) {
        await PhieuDatTiecService.deletePhieuDatTiec(id)
      }
      setCurrentPDT(null);
      setPhieuDatTiec(initialState);
      localStorage.setItem("currentPDT", null);
      localStorage.setItem("SoLuongBan", 0);
      localStorage.setItem("DonGiaBanToiThieu", 0);
      localStorage.setItem("TongTienDatBan", 0);
      localStorage.setItem("TongTienDichVu", 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      toastService.error(`Lỗi: ${error.message || 'Không thể xóa phiếu đặt tiệc!'}`);
    }
  }, []);


  const hasErrors = () => {
    return Object.values(errors).some(error => error !== "");
  };

  const handleSave = () => {
    if ((!phieuDatTiec.TenChuRe || !phieuDatTiec.TenCoDau || !phieuDatTiec.SDT
      || !phieuDatTiec.SoLuongBan || !phieuDatTiec.NgayDaiTiec || !phieuDatTiec.NgayDatTiec)
      || !phieuDatTiec.MaCa || !phieuDatTiec.MaSanh || hasErrors()) {

      toastService.warning("Vui lòng nhập,chọn chính xác và đầy đủ thông tin!");
      validateRequiredField();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!currentPDT || currentPDT === "") {
      createCurrentPhieuDatTiec(phieuDatTiec);
    }
    else

      updateCurrentPhieuDatTiec(currentPDT)
  };

  //set valid sanh data
  useEffect(() => {

    if (errors.SoLuongBan === "" && errors.SoBanDuTru === "" && errors.NgayDaiTiec === "") {
      let slban = pdtReFormat.SoLuongBan === "" ? 0 : pdtReFormat.SoLuongBan;
      let slBanDuTru = pdtReFormat.SoBanDuTru === "" ? 0 : pdtReFormat.SoBanDuTru;

      const ngay = pdtReFormat.NgayDaiTiec;
      const dateStr = typeof ngay === "string" ? ngay.slice(0, 10) : null;

      if (dateStr) {
        fetchValidSanhByDate({
          ngayDaiTiec: dateStr,
          soLuongBan: slban,
          soBanDuTru: slBanDuTru,
        });

      }
    }

  }, [pdtReFormat.MaSanh, errors.NgayDaiTiec, pdtReFormat.SoLuongBan, pdtReFormat.SoBanDuTru, errors.SoBanDuTru, errors.SoLuongBan, fetchValidSanhByDate, pdtReFormat.NgayDaiTiec]);
  //set full ca data
  useEffect(() => {
    fetchFullCa();
  }, [fetchFullCa]);

  useEffect(() => {
    const sanh = halls.find(sanh => sanh.MaSanh === sanhInfo.MaSanh) || null;
    const ca = sanh ? (sanh.CaAvailability.find(ca => ca.MaCa === caInfo.MaCa) || null) : null;
    if (ca && ca.TrangThai === "Không trống" && originDate && originDate.getDate() !== phieuDatTiec.NgayDaiTiec.getDate()) {
      setErrors(prev => ({
        ...prev,
        MaCa: "Ca trong ngày đãi tiệc hiện tại không trống"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        MaCa: "" // Hoặc thông báo phù hợp
      }));
    }
  }, [halls, caInfo.MaCa, sanhInfo.MaSanh]);


  // Lấy currentPDT từ localStorage
  useEffect(() => {
    // setPhieuDatTiec(initialState);
    //localStorage.setItem("currentPDT", null);

    const pdt = localStorage.getItem("currentPDT");

    if (pdt !== "null") {
      setCurrentPDT(pdt);
      fetchCurrentPhieuDatTiec(pdt);
    }
    else {
      setCurrentPDT(null);
    }
  }, [fetchCurrentPhieuDatTiec]);



  return (
    <div className="page">
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box className="form-section" ref={sectionRef2}>
          <Typography variant='h6' mb={3}>Thông tin khách hàng</Typography>
          <Box className="form-grid">
            <FormTextField label="Tên chú rể"

              name="TenChuRe"
              value={phieuDatTiec.TenChuRe}
              onChange={handleChange}
              error={!!errors.TenChuRe}
              helperText={errors.TenChuRe} />

            <FormTextField
              label="Tên cô dâu"
              name="TenCoDau"
              value={phieuDatTiec.TenCoDau}
              onChange={handleChange}
              error={!!errors.TenCoDau}
              helperText={errors.TenCoDau}
            />
            <FormTextField
              label="Số điện thoại"
              name="SDT"
              value={phieuDatTiec.SDT}
              onChange={handleChange}
              error={!!errors.SDT}
              helperText={errors.SDT}
            />

            <FormTextField
              label="Tiền đặt cọc"
              name="TienDatCoc"
              value={phieuDatTiec.TienDatCoc.toString()}
              onChange={handleChange}
              error={!!errors.TienDatCoc}
              helperText={errors.TienDatCoc}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày đặt tiệc"
                value={phieuDatTiec.NgayDatTiec}
                format="dd-MM-yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.NgayDatTiec,
                    helperText: errors.NgayDatTiec,
                  },
                }}
                disabled

              />


              <DatePicker
                label="Ngày đãi tiệc"
                name="NgayDaiTiec"
                value={phieuDatTiec.NgayDaiTiec}
                onChange={(newValue) => handleChange({ target: { name: "NgayDaiTiec", value: newValue } })}
                format="dd-MM-yyyy"

                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.NgayDaiTiec,
                    helperText: errors.NgayDaiTiec,
                    onKeyDown: (e) => {
                      if (e.key === "Backspace") {
                        e.preventDefault();
                      }
                    },
                  },
                }}
              />
              <TimePicker
                label="Giờ đãi tiệc"
                name="GioDaiTiec"
                value={phieuDatTiec.NgayDaiTiec}
                ampm={false}
                onChange={(newValue) => handleChange({ target: { name: "GioDaiTiec", value: newValue } })}
                format="HH:mm:ss"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.GioDaiTiec,
                    helperText: errors.GioDaiTiec,
                  },
                }}
              />

            </LocalizationProvider>
          </Box>
          <Typography variant='h6' >Thông tinh sảnh/ca</Typography>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ color: 'orange', margin: 0 }}>--Có thể tiến hành đặt sảnh ở bên dưới--</p>
            <IconButton onClick={() => handleScroll(sectionRef)} sx={{ color: "orange" }}>
              <KeyboardDoubleArrowDown />
            </IconButton>
          </div>
          <FormTextField
            label="Sảnh"
            name="MaSanh"
            value={sanhInfo.MaSanh ? `Mã sảnh: ${sanhInfo.MaSanh}, tên sảnh: ${sanhInfo.TenSanh}, loại sảnh: ${sanhInfo.TenLoaiSanh}, Số lượng bàn tối đa: ${sanhInfo.SoLuongBanToiDa}` : ""}
            InputLabelProps={{ shrink: true }}
            disabled
          />
          <FormTextField
            label="Ca"
            name="MaCa"
            value={caInfo.MaCa ? `${caInfo.MaCa}, ${caInfo.GioBatDau} - ${caInfo.GioKetThuc}` : ""}
            InputLabelProps={{ shrink: true }}
            error={!!errors.MaCa}
            helperText={errors.MaCa}
            disabled
          />



          {/* Table Selection */}
          <Box className="table-selection">
            <FormTextField
              label="Số lượng bàn"
              value={phieuDatTiec.SoLuongBan.toString()}
              name="SoLuongBan"
              onChange={handleChange}
              size="medium"
              error={!!errors.SoLuongBan}
              helperText={errors.SoLuongBan}
            />
            <FormTextField
              label="Số bàn dự trữ"
              value={phieuDatTiec.SoBanDuTru.toString()}
              name="SoBanDuTru"
              onChange={handleChange}
              size="medium"
              error={!!errors.SoBanDuTru}
              helperText={errors.SoBanDuTru}
            />
          </Box>

        </Box>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#063F5C", my: 4 }}
        >
          Đặt sảnh
        </Typography>
        <div className='hall-introduction-container' >
          {introductionHalls.map((hall, index) => (
            <div className='hall-card' key={hall.title}>
              {(index === 1) ? (
                <>

                  <img src={hall.imageUrl} alt={`introduction-hall-${index}`} className='hall-img-show' />
                  <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
                    <Typography sx={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}><b>{hall.title}</b></Typography>
                    <p>{hall.description}</p>
                  </Grid>


                </>
              ) : (
                <>
                  <Typography><b>{hall.title}</b></Typography>
                  <p>{hall.description}</p>
                  <img src={hall.imageUrl} alt={`introduction-hall-${index}`} className='hall-img-show' />
                </>
              )}
            </div>
          ))}

        </div>
        <div ref={sectionRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 20 }} />
        <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747733599/Group_64_wwly0x.png" style={{
          width: '40%', margin: 100
        }}
          alt='text-img' />
        <div className='selection-container'>
          {halls.map((item, index) => (
            <HallCard key={index} hall={item} shifts={shifts} index={index} onClick={handleChange} />
          ))}

        </div>

        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, my: 6 }}>
          <SaveAndPrintButton onClick={() => removeCurrentPhieuDatTiec(currentPDT)} text='Hủy' sx={{ color: "white" }} />
          <Cancelbutton onClick={handleSave} textCancel={(currentPDT) ? "Cập nhật" : "Tiếp theo"} />

        </Box>

      </Box>

    </div >
  );
}

export default ThongTinTiecCuoi;
