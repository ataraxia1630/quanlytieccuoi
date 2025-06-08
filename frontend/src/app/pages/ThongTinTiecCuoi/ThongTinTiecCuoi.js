import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { Box, IconButton, Typography, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import './ThongTinTiecCuoi.css';
import FormTextField from '../../components/Formtextfield';
import Cancelbutton from '../../components/Cancelbutton';
import SaveAndPrintButton from '../../components/Someactionbutton';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PhieuDatTiecService from '../../service/phieudattiec.service';
import caService from '../../service/ca.service';
import sanhService from '../../service/sanh.service';
import useValidation from '../../validation/validation';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HallCard from '../../components/Hallcard';
import { format } from 'date-fns';

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
  const [errors, setErrors] = useState({
    SDT: "",
    NgayDaiTiec: "",
    TienDatCoc: "",
    SoLuongBan: "",
    NgayDatTiec: "",
    MaSanh: "",
    MaCa: ""
  });
  const [phieuDatTiec, setPhieuDatTiec] = useState(initialState)


  //sảnh/ca
  const [halls, setHalls] = useState([]);
  const [shifts, setshifts] = useState([]);
  const sectionRef = useRef(null);

  const { handleNav } = useContext(StepContext);


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
      title: 'lãng Mạn',
      description: 'Sảnh tiệc cưới lãng mạn với sắc hoa tươi thắm và thiết kế mềm mại, tạo nên không gian ấm áp, dịu dàng cho ngày trọng đại.',
      imageUrl: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image-2_sc6ztt.png',
    },
  ], []);



  //định dạng lại ngày 
  const pdtReFormat = useMemo(() => {
    return {
      ...phieuDatTiec,
      NgayDaiTiec: phieuDatTiec.NgayDaiTiec ? format(new Date(phieuDatTiec.NgayDaiTiec), "yyyy-MM-dd'T'HH:mm:ss") : null,
      NgayDatTiec: phieuDatTiec.NgayDatTiec ? format(new Date(phieuDatTiec.NgayDatTiec), "yyyy-MM-dd'T'HH:mm:ss") : null
    };
  }, [phieuDatTiec]);
  // Tìm sảnh tương ứng dựa trên MaSanh
  const sanhInfo = useMemo(() => {

    const sanh = halls.find(sanh => sanh.MaSanh === phieuDatTiec.MaSanh) || { MaSanh: null, TenSanh: "", TenLoaiSanh: "", SoLuongBanToiDa: "" };
    if (sanh.MaSanh === null) {
      setPhieuDatTiec(prev => ({ ...prev, MaCa: null }))
    };
    return sanh;
  }, [phieuDatTiec.MaSanh, halls, phieuDatTiec.SoLuongBan]);

  // Tìm ca tương ứng dựa trên MaCa
  const caInfo = useMemo(() => {
    return shifts.find(ca => ca.MaCa === phieuDatTiec.MaCa) || { MaCa: null, TenCa: "", ThoiGianBatDau: "", ThoiGianKetThuc: "" };
  }, [phieuDatTiec.MaCa, shifts]);


  //trường phone number
  const validatePhoneNumberField = useCallback((name, value, setErrors) => {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;

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


  const validateTimeField = useCallback((name, value, setErrors) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeStr = value instanceof Date ? value.toTimeString() : (value || "");
    if (timeStr && value.getTime() < today.getTime()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Ngày không được trước ngày hiện tại!",
      }));
    } else if (name === "NgayDaiTiec" && value.getTime() < phieuDatTiec.NgayDatTiec.getTime()
      || name === "NgayDatTiec" && value.getTime() > phieuDatTiec.NgayDaiTiec.getTime()) {
      setErrors(prev => ({ ...prev, [name]: "Ngày đặt tiệc không được trước ngày đặt tiệc!" }));
    }
    else {
      setErrors((prev) => ({ ...prev, NgayDaiTiec: "" }));
      setErrors((prev) => ({ ...prev, NgayDatTiec: "" }));
    }
  }, []);


  //Phiếu đặt tiệc
  // lưu thông tin thay đổi vào phieuDatTiec
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    // Nếu là trường số thì ép kiểu số nguyên
    if (name === "SoLuongBan" || name === "TienDatCoc") {
      newValue = parseInt(value, 10);
      if (isNaN(newValue)) {
        newValue = ""; // Trường hợp người dùng xóa hết input
      }

    }
    if (name === "sanhCa") {
      setPhieuDatTiec(prev => ({
        ...prev,
        MaSanh: newValue.MaSanh,
        MaCa: newValue.MaCa,
      }));
    }
    else
      setPhieuDatTiec({ ...phieuDatTiec, [name]: newValue });
    if (name === "NgayDaiTiec" || name === "NgayDatTiec") {

      validateTimeField(name, newValue, setErrors);

    }
    else if (name === "TienDatCoc" || name === "SoLuongBan") {
      validateNumberField(name, newValue, setErrors);
      if (phieuDatTiec.MaSanh && name === "SoLuongBan" && newValue > sanhInfo.SoLuongBanToiDa) {
        setErrors(prev => ({ ...prev, SoLuongBan: "Sảnh quá nhỏ so với số lượng bàn yêu cầu" }));
      }
    }
    else if (name === "SDT") {
      validatePhoneNumberField(name, newValue, setErrors);
    }
    console.log(`${name}:`, newValue)
    console.log("phieuDattiec: ", phieuDatTiec)


  };

  // Hàm xử lý khi nhấn nút cuộn
  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const fetchFullCa = useCallback(async (id) => {
    try {
      const data = await caService.getAllCa();
      setshifts(data);
    } catch (error) {
      toast.error(`${error.message || 'Không thể tải dữ liệu ca!'}`);
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

    } catch (error) {
      toast.error(`${error.message || 'Không thể tải dữ liệu phiếu đặt tiệc!'}`);
    }

  }, []);

  const fetchValidSanhByDate = useCallback(async (queries) => {
    try {
      const data = await sanhService.getSanhsAvailabilityByDate(queries);
      setHalls(data);
    } catch (error) {
      toast.error(`${error.message || 'Không thể tải dữ liệu sảnh!'}`);
    }

  }, []);


  // tạo data phiếu đặt tiệc
  const createCurrentPhieuDatTiec = useCallback(async (id) => {

    try {
      const data = await PhieuDatTiecService.createPhieuDatTiec(pdtReFormat);
      localStorage.setItem("currentPDT", data.data.SoPhieuDatTiec)

      handleNav()
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể tạo mới phiếu dặt tiệc!'}`);
    }

  }, [pdtReFormat]);

  // cập nhật data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const updateCurrentPhieuDatTiec = useCallback(async (id) => {
    try {
      const data = await PhieuDatTiecService.updatePhieuDatTiec(id, pdtReFormat);
      handleNav()
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể cập nhật phiếu đặt tiệc!'}`);
    }
  }, [pdtReFormat]);

  // hủy data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const removeCurrentPhieuDatTiec = useCallback(async (id) => {
    try {
      if (currentPDT) {
        await PhieuDatTiecService.deletePhieuDatTiec(id)
      }
      setCurrentPDT(null);
      setPhieuDatTiec(initialState);
      localStorage.setItem("currentPDT", null);
    } catch (error) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa phiếu đặt tiệc!'}`);
    }
  }, []);


  const hasErrors = () => {
    return Object.values(errors).some(error => error !== "");
  };

  const handleSave = () => {
    if (!currentPDT || currentPDT === "") {
      if ((!phieuDatTiec.TenChuRe || !phieuDatTiec.TenCoDau || !phieuDatTiec.SDT
        || !phieuDatTiec.SoLuongBan || !phieuDatTiec.NgayDaiTiec || !phieuDatTiec.NgayDatTiec)
        || !phieuDatTiec.MaCa || !phieuDatTiec.MaSanh || hasErrors()) {
        console.log("hass err", hasErrors())
        console.log("phieudattiec", phieuDatTiec)
        console.log("lỗi nhập liệu", errors)
        const toastId = "save-error-toast";
        if (!toast.isActive(toastId)) {
          toast.warn("Vui lòng nhập,chọn chính xác và đầy đủ thông tin!", {
            toastId: toastId,
          });
        }
        return;
      }
      createCurrentPhieuDatTiec(phieuDatTiec);
    }
    else

      updateCurrentPhieuDatTiec(currentPDT)



  };
  //set full ca data
  useEffect(() => {
    fetchFullCa();
  }, [fetchFullCa]);


  //set valid sanh data
  useEffect(() => {

    let slban = phieuDatTiec.SoLuongBan == "" ? 0 : phieuDatTiec.SoLuongBan;
    fetchValidSanhByDate({ ngayDaiTiec: pdtReFormat.NgayDaiTiec.slice(0, 10), soLuongBan: slban, soBanDuTru: phieuDatTiec.SoBanDuTru });

  }, [fetchFullCa, fetchValidSanhByDate, phieuDatTiec.NgayDaiTiec, phieuDatTiec.SoLuongBan, phieuDatTiec.SoBanDuTru]);



  // Lấy currentPDT từ localStorage 
  useEffect(() => {
    // setPhieuDatTiec(initialState);
    //localStorage.setItem("currentPDT", null);

    const pdt = localStorage.getItem("currentPDT");
    console.log("currentPDT: ", pdt)

    if (pdt !== "null") {
      setCurrentPDT(pdt);
      fetchCurrentPhieuDatTiec(pdt);
    }
    else {
      setCurrentPDT(null);
    }



  }, [fetchCurrentPhieuDatTiec]);


  console.log("phieuDatTiec: ", phieuDatTiec);
  console.log("ca: ", caInfo);
  console.log("sanh: ", sanhInfo);
  return (
    <div className="page">
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box className="form-section">
          <Box className="form-grid">
            <FormTextField label="Tên chú rể"
              InputLabelProps={{
                shrink: Boolean(phieuDatTiec.TenChuRe)
              }}
              name="TenChuRe"
              value={phieuDatTiec.TenChuRe}
              onChange={handleChange} />

            <FormTextField
              label="Tên cô dâu"
              name="TenCoDau"
              value={phieuDatTiec.TenCoDau}
              onChange={handleChange}
              InputLabelProps={{
                shrink: Boolean(phieuDatTiec.TenCoDau)
              }} />
            <FormTextField
              label="Số điện thoại"
              name="SDT"
              value={phieuDatTiec.SDT}
              onChange={handleChange}
              error={!!errors.SDT}
              helperText={errors.SDT}
              InputLabelProps={{
                shrink: Boolean(phieuDatTiec.SDT)
              }} />

            <FormTextField
              label="Tiền đặt cọc"
              name="TienDatCoc"
              value={phieuDatTiec.TienDatCoc}
              onChange={handleChange}
              error={!!errors.TienDatCoc}
              helperText={errors.TienDatCoc}
              InputLabelProps={{
                shrink: (phieuDatTiec.TienDatCoc >= 0 && phieuDatTiec.TienDatCoc !== "")
              }} />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Ngày đặt tiệc"
                value={phieuDatTiec.NgayDatTiec}
                onChange={(newValue) =>
                  handleChange({ target: { name: "NgayDatTiec", value: newValue } })
                }
                format="dd-MM-yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.NgayDatTiec,
                    helperText: errors.NgayDatTiec,
                  },
                }}
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
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <FormTextField
            label="Thông tin sảnh"
            name="MaSanh"
            value={sanhInfo.MaSanh ? `Mã sảnh: ${sanhInfo.MaSanh}, tên sảnh: ${sanhInfo.TenSanh}, loại sảnh: ${sanhInfo.TenLoaiSanh}, Số lượng bàn tối đa: ${sanhInfo.SoLuongBanToiDa}` : ""}
            error={!!errors.MaSanh}
            helperText={errors.MaSanh}
            InputLabelProps={{ shrink: true }}
            disabled
          />
          <FormTextField
            label="Ca"
            name="MaCa"
            value={caInfo.MaCa ? `${caInfo.MaCa}, ${caInfo.GioBatDau} - ${caInfo.GioKetThuc}` : ""}
            error={!!errors.TienDatCoc}
            helperText={errors.TienDatCoc}
            InputLabelProps={{ shrink: true }}
            disabled
          />



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
              <IconButton sx={{ ml: 2 }} onClick={() => handleChange({ target: { name: "SoBanDuTru", value: Math.max(0, phieuDatTiec.SoBanDuTru - 5) } })}><RemoveIcon /></IconButton>
              <Typography mt={5}>{phieuDatTiec.SoBanDuTru}</Typography>
              <IconButton onClick={() => handleChange({ target: { name: "SoBanDuTru", value: phieuDatTiec.SoBanDuTru + 5 } })}><AddIcon /></IconButton>
            </div>
          </Box>

        </Box>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#063F5C", my: 4 }}
        >
          Đặt sảnh
        </Typography>
        <div className='hall-introduction-container'>
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
          <IconButton sx={{ position: 'absolute', bottom: 20 }} onClick={() => handleScroll()}>
            <KeyboardDoubleArrowDown />
          </IconButton>
        </div>
        <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747733599/Group_64_wwly0x.png" style={{
          width: '40%', margin: 100
        }}
          alt='text-img' />
        <div className='selection-container' ref={sectionRef}>
          {halls.map((item, index) => (
            <HallCard key={index} hall={item} shifts={shifts} index={index} onClick={handleChange} />
          ))}

        </div>

        <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2, my: 6 }}>
          <SaveAndPrintButton onClick={() => removeCurrentPhieuDatTiec(currentPDT)} text='hủy' sx={{ color: "white" }} />
          <Cancelbutton onClick={handleSave} textCancel={(currentPDT) ? "Cập nhật" : "Tiếp theo"} />

        </Box>

      </Box>

    </div>
  );
}

export default ThongTinTiecCuoi;
