import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button, Box, IconButton, Typography, Grid, Card, CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import './ThongTinTiecCuoi.css';
import FormTextField from '../../components/Formtextfield';
import Cancelbutton from '../../components/Cancelbutton';
import SaveAndPrintButton from '../../components/Saveandprintbutton';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PhieuDatTiecService from '../../service/phieudattiec.service';
import useValidation from '../../validation/validation';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TagButton from '../../components/Tagbutton';
import { format } from 'date-fns';

const initialState = {
  MaSanh: null,
  TenChuRe: null,
  TenCoDau: null,
  SDT: null,
  NgayDaiTiec: null,
  MaCa: null,
  TienDatCoc: 0,
  SoLuongBan: 1,
  SoBanDuTru: 0,
  NgayDatTiec: null,
  TrangThai: 1,
};
const HallCard = ({ hall, shifts, index, onClick }) => {
  const [chosingShift, setChoosingShift] = useState(null)
  const handleSave = () => {
    if (!chosingShift) {
      alert("Vui lòng chọn một ca trước khi đặt sảnh!");
      return;
    }
    onClick({ target: { name: "sanhCa", value: { MaSanh: hall.MaSanh, MaCa: chosingShift } } });
    setChoosingShift(null);
  }
  return (
    <Card className='hall-card' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} >
      <div className='hall-card-header'>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 'Bold', marginBottom: 0 }}>{hall.TenSanh}</Typography>
        <TagButton>
          {hall.LoaiSanh}</TagButton>
      </div>
      <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', marginBottom: 0 }}>Số lượng bàn tối đa: {hall.SoLuongBanToiDa}</Typography>
      <CardMedia
        component="img"
        height="192"
        image={hall.HinhAnh}
        alt={`introduction-hall-${index}`}
        sx={{ objectFit: 'cover' }}
        className='hall-img-show'
      />
      <div>
        {hall.Ca.map((ca) => (
          <TagButton
            key={ca.MaCa}
            sx={{ background: ca.TinhTrang === 'Đang trống' ? '#063F5C' : '#DFDFDF', marginRight: 1, marginBottom: 1 }}
            onClick={() => setChoosingShift(ca.MaCa)}
            disabled={!(ca.TinhTrang === "Đang trống")}
          >
            {(shifts.find(shift => shift.MaCa === ca.MaCa) || {}).TenCa || ""}
          </TagButton>
        ))}
      </div>

      <Typography sx={{ fontSize: '1rem', fontWeight: 'Bold', height: '10vh', overflowY: 'auto', overflowX: 'hidden' }}>Ghi chú: {hall.GhiChu}</Typography>
      <Button
        onClick={() => handleSave()}
        variant="contained"
        size="small"
        sx={{
          bgcolor: 'orange',
          '&:hover': { bgcolor: 'darkorange' },
          borderRadius: '999px',
          textTransform: 'none',
          paddingX: 3,
        }}
      >
        Đặt sảnh
      </Button>

    </Card>
  );
}
const ThongTinTiecCuoi = () => {
  const { validatePhoneNumberField, validateNumberField, validateTimeField } = useValidation();
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


  //sảnh
  const [halls, setHalls] = useState([]);
  const [shifts, setshifts] = useState([]);
  const sectionRef = useRef(null);

  const { handleNav } = useContext(StepContext);


  // Hàm xử lý khi nhấn nút
  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
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
  // Mock data
  const mockItems = useMemo(() => [
    {
      MaSanh: "SANH01",
      TenSanh: 'Sảnh A',
      LoaiSanh: 'Sảnh nhỏ',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',

        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    }, {
      MaSanh: "SANH02",
      TenSanh: 'Sảnh B',
      LoaiSanh: 'Sảnh nhỏ',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
        {
          MaCa: 'CA03',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA04',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh cótr dfghjkdsf ghjkkjhgfd ghjklkjhgfd ghjklkj hgfdgh jklkj hgfdsf ghjkjvchjk jhgjk hsjok pdfoljksh jiokij khjgkj nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      MaSanh: "SANH03",
      TenSanh: 'Sảnh C',
      LoaiSanh: 'Sảnh lớn',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      MaSanh: "SANH04",
      TenSanh: 'Sảnh D',
      LoaiSanh: 'Sảnh trung',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
        {
          MaCa: 'CA03',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      MaSanh: "SANH05",
      TenSanh: 'Sảnh E',
      LoaiSanh: 'Sảnh lớn',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    },
    {
      MaSanh: "SANH06",
      TenSanh: 'Sảnh F',
      LoaiSanh: 'Sảnh trung',
      SoLuongBanToiDa: 100,
      HinhAnh: 'https://res.cloudinary.com/digpe9tmq/image/upload/v1747730640/Image_nhlkpt.png',
      Ca: [
        {
          MaCa: 'CA01',
          TinhTrang: 'Đang trống',
        },
        {
          MaCa: 'CA02',
          TinhTrang: 'Đã đặt',
        },
      ],
      GhiChu: 'Sảnh có nhiều nội thất sang trong, đắt đỏ cần cẩn thận trong quá trình diễn ra tiệc cưới.',
    }
  ], []);

  const caMockItems = useMemo(() => [
    {
      MaCa: 'CA01',
      TenCa: 'Ca tối',
      GioBatDau: "11:00:00",
      GioKetThuc: "04:00:00"
    },
    {
      MaCa: 'CA02',
      TenCa: 'Ca tối',
      GioBatDau: "11:00:00",
      GioKetThuc: "04:00:00"
    },
    {
      MaCa: 'CA03',
      TenCa: 'Ca tối',
      GioBatDau: "11:00:00",
      GioKetThuc: "04:00:00"
    },
    {
      MaCa: 'CA04',
      TenCa: 'Ca tối',
      GioBatDau: "11:00:00",
      GioKetThuc: "04:00:00"
    },
    {
      MaCa: 'CA05',
      TenCa: 'Ca tối',
      GioBatDau: "11:00:00",
      GioKetThuc: "04:00:00"
    }
  ], []);
  //set data
  useEffect(() => {
    setHalls(mockItems.map((item) => ({
      MaSanh: item.MaSanh,
      TenSanh: item.TenSanh,
      LoaiSanh: item.LoaiSanh,
      SoLuongBanToiDa: item.SoLuongBanToiDa,
      HinhAnh: item.HinhAnh,
      Ca: item.Ca,
      GhiChu: item.GhiChu,
    })));
    setshifts(caMockItems.map((item) => ({
      MaCa: item.MaCa,
      TenCa: item.TenCa,
      GioBatDau: item.GioBatDau,
      GioKetThuc: item.GioKetThuc
    })));

  }, [mockItems, caMockItems]);

  console.log("pdt: ", phieuDatTiec)
  // Tìm ca tương ứng dựa trên MaCa
  const caInfo = useMemo(() => {
    return shifts.find(ca => ca.MaCa === phieuDatTiec.MaCa) || { TenCa: "", ThoiGianBatDau: "", ThoiGianKetThuc: "" };
  }, [phieuDatTiec.MaCa, shifts]);

  // Tìm sảnh tương ứng dựa trên MaSanh
  const sanhInfo = useMemo(() => {
    return halls.find(sanh => sanh.MaSanh === phieuDatTiec.MaSanh) || { TenSanh: "", LoaiSanh: "", SoLuongBanToiDa: "" };
  }, [phieuDatTiec.MaSanh, halls]);


  //Phiếu đặt tiệc
  // lưu thông tin vào phieuDatTieec
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
    }
    else if (name === "SDT") {
      validatePhoneNumberField(name, newValue, setErrors);
    }
    console.log(`${name}:`, newValue)
    console.log("phieuDattiec: ", phieuDatTiec)


  };

  // fetch data phiếu đặt tiêc neeys đang tiến hành đặt tiệc
  const fetchCurrentPhieuDatTiec = useCallback(async (id) => {
    await toast.promise(
      PhieuDatTiecService.getPhieuDatTiecById(id),
      {
        loading: "Đang xử lý...",
        success: "Tải dữ liệu thành công!",
        error: (err) => "Lỗi: " + err.message,
      }
    ).then((data) => {
      let newData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key in initialState)
      );
      newData = {
        ...newData,
        NgayDaiTiec: new Date(newData.NgayDaiTiec),
        NgayDatTiec: new Date(newData.NgayDatTiec)
      };
      console.log("phieudattiec fetch data: ", newData)
      setPhieuDatTiec(newData);
    }); // set dữ liệu nếu thành công

  }, []);
  // Lấy currentPDT từ localStorage chỉ 1 lần
  useEffect(() => {
    // setPhieuDatTiec(initialState);
    localStorage.setItem("currentPDT", 'PDT006');

    const pdt = localStorage.getItem("currentPDT");
    if (pdt !== null && pdt !== undefined && pdt !== "" && pdt !== "null") {
      setCurrentPDT(pdt)
      fetchCurrentPhieuDatTiec(pdt);
    }
  }, [fetchCurrentPhieuDatTiec]);

  //định dạng lại ngày 
  const pdtReFormat = useMemo(() => {
    return {
      ...phieuDatTiec,
      NgayDaiTiec: phieuDatTiec.NgayDaiTiec ? format(new Date(phieuDatTiec.NgayDaiTiec), "yyyy-MM-dd'T'HH:mm:ss") : null,
      NgayDatTiec: phieuDatTiec.NgayDatTiec ? format(new Date(phieuDatTiec.NgayDatTiec), "yyyy-MM-dd'T'HH:mm:ss") : null,
      TrangThai: phieuDatTiec.NgayDatTiec ? 1 : 2
    };
  }, [phieuDatTiec.NgayDaiTiec, phieuDatTiec.NgayDatTiec, phieuDatTiec.TrangThai]);
  // tạo data phiếu đặt tiệc
  const createCurrentPhieuDatTiec = useCallback(async (id) => {
    console.log("đafa: ", pdtReFormat());
    const data = await toast.promise(

      PhieuDatTiecService.createPhieuDatTiec(pdtReFormat()),
      {
        loading: "Đang xử lý...",
        success: "khởi tạo dữ liệu thành công!",
        error: (err) => "Lỗi: " + err.message,
      }
    );
    setPhieuDatTiec(data) // set dữ liệu nếu thành công
    setCurrentPDT(data.SoPhieuDatTiec);
    localStorage.setItem("currentPDT", data.data.SoPhieuDatTiec)

  }, [pdtReFormat]);

  // cập nhật data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const updateCurrentPhieuDatTiec = useCallback(async (id) => {
    console.log("pdtqưq: ", id)
    await toast.promise(
      PhieuDatTiecService.updatePhieuDatTiec(id, pdtReFormat()),
      {
        loading: "Đang xử lý...",
        success: "cập nhật dữ liệu thành công!",
        error: (err) => "Lỗi: " + err.message,
      }
    ).then((data) => setPhieuDatTiec(data)); // set dữ liệu nếu thành công
  }, [pdtReFormat]);

  // hủy data phiếu đặt tiêc nếu đang tiến hành đặt tiệc
  const removeCurrentPhieuDatTiec = useCallback(async (id) => {
    await toast.promise(
      PhieuDatTiecService.deletePhieuDatTiec(id),
      {
        loading: "Đang xử lý...",
        success: "Hủy đặt tiệc cưới thành công!",
        error: (err) => "Lỗi: " + err.message,
      }
    )
    setCurrentPDT(null);
    setPhieuDatTiec(initialState);
    localStorage.setItem("currentPDT", null);
  }, []);


  const hasErrors = () => {
    return Object.values(errors).some(error => error !== "");
  };

  const handleSave = useCallback(() => {
    if (!currentPDT || currentPDT === "") {
      if ((!phieuDatTiec.TenChuRe || !phieuDatTiec.TenCoDau || !phieuDatTiec.SDT
        || !phieuDatTiec.SoLuongBan || !phieuDatTiec.NgayDaiTiec || !phieuDatTiec.NgayDatTiec)
        || !phieuDatTiec.MaCa || !phieuDatTiec.MaSanh || hasErrors()) {
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
      console.log("currrrr: ", currentPDT)
    updateCurrentPhieuDatTiec(currentPDT)


    handleNav()

  }, [currentPDT, createCurrentPhieuDatTiec, updateCurrentPhieuDatTiec]);


  return (
    <div className="page">
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%' }}>
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
          <FormTextField
            label="Thông tin sảnh"
            name="MaSanh"
            defaultValue={phieuDatTiec.MaSanh ? `Mã sảnh: ${phieuDatTiec.MaSanh}, tên sảnh: ${sanhInfo.TenSanh}, loại sảnh: ${sanhInfo.LoaiSanh}, Số lượng bàn tối đa: ${sanhInfo.SoLuongBanToiDa}` : ""}
            error={!!errors.MaSanh}
            helperText={errors.MaSanh}
            disabled
          />
          <FormTextField
            label="Ca"
            name="MaCa"
            value={phieuDatTiec.MaCa ? `${phieuDatTiec.MaCa}, ${caInfo.GioBatDau} - ${caInfo.GioKetThuc}` : ""}
            error={!!errors.TienDatCoc}
            helperText={errors.TienDatCoc}
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

        {/* Right Section
        <Box className="image-section">
          <Box className="image-text">
            <Typography variant="h4" gutterBottom>Save the Date</Typography>
            <Typography variant="h6">Family & Love</Typography>
            <Typography variant="body2">../../2025</Typography>
          </Box>
        </Box> */}
      </Box>

    </div>
  );
}

export default ThongTinTiecCuoi;
