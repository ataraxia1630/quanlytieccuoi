import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './HoaDon.module.css';
import { checkEditAllowed, createHoaDon, deleteHoaDon, restoreDichVu, updateHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';
import CustomTable from '../../components/Customtable';
import ActionButtons from '../../components/Actionbuttons';
import AddButton from '../../components/Addbutton';
import PhieuDatTiecService from '../../service/phieudattiec.service';

import {
  getAllCTDichVuByPDTId,
  createCTDichVu,
  updateCTDichVu,
  deleteCTDichVu
} from '../../service/ct_dichvu.service';

import CTDatBanCotroller from '../../service/ct_datban.service';

import DichVuDialog from "../../components/hoadon_dv/dichvu_popup";
import DanhSachDichVuDialog from '../../components/hoadon_dv/danhsachdichvu_popup';

import DichVuService from "../../service/dichvu.service";
import MonAnService from '../../service/monan.service';
import { toast, ToastContainer } from 'react-toastify';
import DeleteDialog from "../../components/Deletedialog";
import ctDatBanService from '../../service/ct_datban.service';
import toastService from '../../service/toast/toast.service';
import { hasPermission } from '../../utils/hasPermission';
import FormTextField from '../../components/Formtextfield';
import DialogButtons from '../../components/Dialogbutton';
import EditDialog from '../../components/hoadon/editdialog';
import BaoCaoThangService from '../../service/baocao.service';

function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec, slBanToiDa } = location.state || {};
  const [tiLePhat, setTiLePhat] = useState(0);
  const[isHoaDon, setIsHoaDon] = useState(Boolean(soHoaDon))
  const [isViewMode, setIsViewMode] = useState(Boolean(soHoaDon));
  const [openDichVuDialog, setOpenDichVuDialog] = useState(false);

  const handleOpenDVDialog = () => setOpenDichVuDialog(true);
  const handleCloseDVDialog = () => setOpenDichVuDialog(false);
console.log("ngay lap hoa don: " + initData.NgayThanhToan)
console.log("ti le phat: " + initData.TiLePhat)
  const [form, setForm] = useState({
    SoPhieuDatTiec: '',
    SoHoaDon: '',
    NgayThanhToan: initData.NgayThanhToan?initData.NgayThanhToan:'',
    DonGiaBan: '',
    SoLuongBanDaDung: '',
    TongTienDichVu: '',
    TongTienMonAn: '',
    TongTienHoaDon: '',
    TongTienPhat: '',
    TienConLai: '',
    dsDichVu: [],
    dsMonAn: [],
  });
  const [isDVDialogOpen, setIsDVDialogOpen] = useState(false);
  const [isMADialogOpen, setIsMADialogOpen] = useState(false);

  const [isDeleteDVDialogOpen, setIsDeleteDVDialogOpen] = useState(false);
  const [isDeleteHDDialogOpen, setIsDeleteHDDialogOpen] = useState(false);
  const [isDeleteMADialogOpen, setIsDeleteMADialogOpen] = useState(false);

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [monAnList, setMonAnList] = useState([]);

  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [selectedMonAn, setSelectedMonAn] = useState(null);

  const [isEditHDDialogOpen, setIsEditHDDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const [errors, setErrors] = useState({
    SoLuongBanDaDung: "",
  });
  const permissions = localStorage.getItem('permissions');

  useEffect(() => {
    async function fetchData() {
      try {
        const dsChiTietDichVu = await getAllCTDichVuByPDTId(soPhieuDatTiec);
        const dsThucDon = await CTDatBanCotroller.getAllByPhieuDatTiecId(soPhieuDatTiec);

        const normalizedDichVu = dsChiTietDichVu.map(item => ({
          ...item,
          DichVu: { TenDichVu: item["DichVu.TenDichVu"] || item?.DichVu?.TenDichVu }
        }));

        const normalizedMonAn = dsThucDon.map(item => ({
          ...item,
          MonAn: { TenMonAn: item["MonAn.TenMonAn"] || item?.MonAn?.TenMonAn }
        }));

        setForm((prev) => ({
          ...prev,
          dsDichVu: normalizedDichVu,
          dsMonAn: normalizedMonAn,
        }));
        if (isViewMode) {
          console.log('vao read');
          setForm({
            ...initData,
            dsDichVu: normalizedDichVu,
            dsMonAn: normalizedMonAn,
          });
        } else {
          console.log('vao create');
          const randomNum = Math.floor(Math.random() * 1000); // 0 - 999
          const randomNumStr = randomNum.toString().padStart(3, '0');
          const newForm = {
            ...form,
            SoPhieuDatTiec: initData.SoPhieuDatTiec || '',
            SoHoaDon: `HD${randomNumStr}`,
            SoLuongBanDaDung: initData.SoLuongBan,
            NgayThanhToan: new Date().toISOString(),
            dsDichVu: dsChiTietDichVu || [],
            dsMonAn: dsThucDon || [],
          };
          setForm(newForm);
        }
      } catch (err) {
        toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const fetchMonAnList = useCallback(
    async (filters = {}, limit = 10, offset = 0) => {
      try {
        setLoading(true);
        let data;
        data = await MonAnService.getAll(limit, offset);

        setMonAnList(data);
        setPagination((prev) => ({ ...prev, limit, offset }));

        return data;
      } catch (error) {
        toast.error(error.message);
        setMonAnList([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchDichVuList = useCallback(
    async (filters = {}, limit = 10, offset = 0) => {
      try {
        setLoading(true);
        let data;
        data = await DichVuService.getAllDichVu(limit, offset);
        setDichVuList(data);
        setPagination((prev) => ({ ...prev, limit, offset }));

        return data;
      } catch (error) {
        toast.error(error.message);
        setDichVuList([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );


  const tongtiendichvu = useMemo(() => {
    if (!form.dsDichVu || form.dsDichVu.length === 0) return 0;

    return form.dsDichVu.reduce((sum, dv) => {
      if (dv.isDeleted) return sum;
      const thanhTien = (Number(dv.DonGia) || 0) * (Number(dv.SoLuong) || 0);
      return sum + thanhTien;
    }, 0);
  }, [form.dsDichVu]);

  const tongTienMonAn = useMemo(() => {
    return form.dsMonAn.reduce((sum, mon) => {
      if (mon.isDeleted) return sum;
      return sum + mon.SoLuong * mon.DonGia;
    }, 0);
  }, [form.dsMonAn]);

  const tongtienhoadon = useMemo(() => {
    const soLuongBan = Number(form.SoLuongBanDaDung) || 0;
    return tongTienMonAn * soLuongBan + tongtiendichvu;
  }, [tongtiendichvu, form.TongTienMonAn, form.SoLuongBanDaDung]);

  const handleChonDichVu = async (dichVu) => {
    setSelectedDichVu({
      MaDichVu: dichVu.MaDichVu,
      DonGia: dichVu.DonGia,
      SoLuong: 1,
      DichVu: { TenDichVu: dichVu.TenDichVu }
    });
    setMode("add");
    setIsDVDialogOpen(true);
    toastService.hoaDon.serviceAlreadySelected(); // "Dịch vụ đã được chọn trước đó!"

    await fetchDichVuList(pagination.limit, pagination.offset);

  };

  const handleSaveCT_DichVu = async (formData) => {
    try {
      setLoading(true);
      const dichVuData = {
        MaDichVu: selectedDichVu.MaDichVu,
        DonGia: Number(formData.price),
        SoLuong: Number(formData.sl),
        SoPhieuDatTiec: soPhieuDatTiec,
      };

      if (mode === "edit" && selectedDichVu) {
        await updateCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec, dichVuData);

        setForm(prev => ({
          ...prev,
          dsDichVu: prev.dsDichVu.map(dv =>
            dv.MaDichVu === selectedDichVu.MaDichVu
              ? { ...dv, ...dichVuData, DichVu: { TenDichVu: dv.DichVu.TenDichVu } }
              : dv
          )
        }));

        toastService.hoaDon.serviceUpdated();
      } else {

        const isExist = form.dsDichVu.some(
          (dv) => dv.MaDichVu === selectedDichVu.MaDichVu
        );

        if (isExist) {
          toastService.hoaDon.serviceAlreadySelected(); // "Dịch vụ đã được chọn trước đó!"
          setIsDVDialogOpen(false);
          return;
        }
        console.log("vao add dich vu");
        await createCTDichVu(dichVuData);
        const newList = await getAllCTDichVuByPDTId(soPhieuDatTiec);
        const normalized = newList.map(item => ({
          ...item,
          DichVu: {
            TenDichVu: item["DichVu.TenDichVu"] || item?.DichVu?.TenDichVu
          }
        }));

        setForm(prev => ({ ...prev, dsDichVu: normalized }));
        toastService.hoaDon.serviceAdded(); // "Dịch vụ đã được thêm vào hoá đơn!"
      }

      setIsDVDialogOpen(false);
      setSelectedDichVu(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptDeleteDV = async () => {
    try {
      setLoading(true);

      await deleteCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec);

      setForm(prev => ({
        ...prev,
        dsDichVu: prev.dsDichVu.filter(
          dv => dv.MaDichVu !== selectedDichVu.MaDichVu
        ),
      }));

      toastService.hoaDon.serviceRemoved();

      setIsDeleteDVDialogOpen(false);
      setSelectedDichVu(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHD = async () => {
    const parsed = parseInt(form.SoLuongBanDaDung);

    let message = "";
    if (form.SoLuongBanDaDung === "") {
      message = "Không được để trống";
    } else if (isNaN(parsed)) {
      message = "Giá trị không hợp lệ";
    } else if (parsed < 0) {
      message = "Không được nhập số âm";
    } else if (parsed > slBanToiDa) {
      message = `Số lượng bàn tối đa của sảnh là ${slBanToiDa}`;
    }

    if (message !== "") {
      setErrors((prev) => ({
        ...prev,
        SoLuongBanDaDung: message,
      }));
      toastService.hoaDon.paymentFailed();
      return;
    }

    try {
      setLoading(true);
      const hoaDonData = {
        SoPhieuDatTiec: form.SoPhieuDatTiec,
        SoLuongBanDaDung: form.SoLuongBanDaDung,
        TiLePhat: tiLePhat 
      };
      console.log(hoaDonData)
      if (!form.SoHoaDon) {
        toast.error("Không tìm thấy mã số hoá đơn để cập nhật.");
        return;
      }

      const result = await updateHoaDon(form.SoHoaDon, hoaDonData);

      if (result) {
        setIsViewMode(true);
        setForm((prevForm) => ({
          ...prevForm,
          ...result,
        }));
        setIsDeleteHDDialogOpen(true);
      PhieuDatTiecService.updatePhieuDatTiec(form.SoPhieuDatTiec, { TrangThai: "Đã thanh toán"});

        toast.success("Chỉnh sửa hoá đơn thành công!")
      } else {
        toastService.hoaDon.paymentFailed();
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật hoá đơn");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateHoaDon = async () => {
    if(isHoaDon) {
      handleEditHD()
    }  else {

    const parsed = parseInt(form.SoLuongBanDaDung);

    let message = "";
    if (form.SoLuongBanDaDung === "") {
      message = "Không được để trống";
    } else if (isNaN(parsed)) {
      message = "Giá trị không hợp lệ";
    } else if (parsed < 0) {
      message = "Không được nhập số âm";
    } else if (parsed > slBanToiDa) {
      message = `Số lượng bàn tối đa của sảnh là ${slBanToiDa}`;
    }

    if (message !== "") {
      setErrors((prev) => ({
        ...prev,
        SoLuongBanDaDung: message,
      }));
      toastService.hoaDon.paymentFailed();
      return;
    }
   
    try {
      setLoading(true);
      const hoaDonData = {
        SoPhieuDatTiec: form.SoPhieuDatTiec,
        SoHoaDon: form.SoHoaDon,
        SoLuongBanDaDung: form.SoLuongBanDaDung,
      };
       
      const result = await createHoaDon(hoaDonData);
      setTiLePhat(result.TiLePhat)
      setIsHoaDon(true);
      PhieuDatTiecService.updatePhieuDatTiec(form.SoPhieuDatTiec, { TrangThai: "Đã thanh toán"});
      if (result) {
        setIsViewMode(true);
        setForm((prevForm) => ({
          ...prevForm,
          ...result,
        }));

        toastService.hoaDon.paymentSuccess();
      } else {
        toastService.hoaDon.paymentFailed();
      }
    } catch (err) {
      toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"
    } finally {
      setLoading(false);
    }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const parsed = parseInt(value);

    if (parsed > slBanToiDa) {
      setErrors(prev => ({
        ...prev,
        [name]: `Số lượng bàn tối đa của sảnh là ${slBanToiDa}`,
      }));
      return;
    }
    if(parsed === 0) {
      setErrors(prev => ({
        ...prev,
        [name]: `Số lượng bàn phải lớn hơn 0`,
      }));
      return;
    }
    // Cập nhật form trước
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let message = "";

    if (name === "SoLuongBanDaDung") {
      if (value === "") {
        message = ""; // không lỗi khi chưa nhập
      } else if (parsed < 0) {
        message = "Không được nhập số âm";
      } else if (parsed > slBanToiDa) {
        message = `Số lượng bàn tối đa của sảnh là ${slBanToiDa}`;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  function formatDate(date) {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handlePrintHoaDon = () => {
    window.print();
  };

  const handleEditDV = (dichVu) => {
    setMode("edit");
    setSelectedDichVu(dichVu);
    setIsDVDialogOpen(true);
  };

  const handleDeleteDV = (dichVu) => {
    setSelectedDichVu(dichVu);
    setIsDeleteDVDialogOpen(true);
  };

  const handleEditMA = (monan) => {
    setMode("edit");
    setSelectedMonAn(monan);
    setIsMADialogOpen(true);
  };

  const handleDeleteMA = (monan) => {
    setSelectedMonAn(monan);
    setIsDeleteMADialogOpen(true);
  };


  const handleCloseDVDeleteDialog = () => {
    setIsDeleteDVDialogOpen(false);
    setSelectedDichVu(null);
  };

  const handleCloseDVEditDialog = () => {
    setIsDVDialogOpen(false);
    setSelectedDichVu(null);
  };
  
  const handleMoveToEditHD = () => {
    setIsViewMode (false);
    setIsEditHDDialogOpen(false);

    toast.success("Đã sang chế độ chỉnh sửa hoá đơn")
    
  }
  const handleCloseHDEditDialog = () => {
    setIsEditHDDialogOpen(false);

  }
  
  const handleOpenHDEditDialog = async () => {
  try {
    const allowed = await checkEditAllowed(form.SoHoaDon);
    if (!allowed) {
      toast.warning("Tháng của ngày đãi tiệc đã có báo cáo. Không thể sửa hoá đơn.");
      return;
    }

    setIsEditHDDialogOpen(true);
  } catch (error) {
    
}
  // Cho phép chỉnh sửa
  setIsEditHDDialogOpen(true);
};
   if (loading) return <p>Đang tải dữ liệu hóa đơn...</p>;

  const columns = [
    { id: "index", label: "STT", width: 15 },
    {
      id: "TenDichVu",
      label: "Dịch vụ",
      width: 120,
      render: (row) => row?.DichVu?.TenDichVu || "Không rõ"

    },
    { id: "SoLuong", label: "Số lượng", width: 40 },
    {
      id: "DonGia", label: "Đơn giá", width: 70, render: (row) => new Intl.NumberFormat('vi-VN').format(row.DonGia)
    },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,

      render: (row) => row.DonGia && row.SoLuong ? new Intl.NumberFormat('vi-VN').format(row.DonGia * row.SoLuong) : null
    },
    !isViewMode ? {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete, disabledEdit, disabledDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} disabledEdit={disabledEdit}
          disabledDelete={disabledDelete} />
      ),
    } : null,
  ].filter(Boolean);
  const columns2 = [
    { id: "index", label: "STT", width: 15 },
    {
      id: "TenMonAn",
      label: "Món ăn",
      width: 150,
      render: (row) => row?.MonAn?.TenMonAn || "Không rõ"
    },
    { id: "SoLuong", label: "Số lượng", width: 30 },
    {
      id: "DonGia", label: "Đơn giá", width: 50,
      render: (row) => new Intl.NumberFormat('vi-VN').format(row.DonGia)
    },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGia && row.SoLuong ? new Intl.NumberFormat('vi-VN').format(row.DonGia * row.SoLuong) : null
    }
  ].filter(Boolean);

  return (
    <Box sx={{ p: 3 }}>

      <div className={`${styles.hoadonBox} ${styles.printableHoaDon}`}>
        <ToastContainer className={styles.noPrint} position="top-right" autoClose={3000} hideProgressBar />

        <div className={`${styles.hoadonLeft} ${styles.dashedBorder}`}>

          <div style={{ flex: 1 }}>
            <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '16px' }}>Chú rể:</p>
            <span className={styles.hoadonName}>{chuRe}</span>

            <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Cô dâu:</p>
            <span className={styles.hoadonName}>{coDau}</span>

            <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Ngày đãi tiệc: </p>
            <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

            <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Ngày thanh toán: </p>
            { form.NgayThanhToan ? (
              <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span>
            ) : (
              <span className={styles.hoadonName}>{formatDate(new Date())}</span>
            )}
          </div>
          {isViewMode ?
            <div>
              <p className={styles.hoadonText} style={{ marginTop: '20px' }}>Tổng tiền dịch vụ: {new Intl.NumberFormat('vi-VN').format(form.TongTienDichVu) ?? 0}</p>
              <p className={styles.hoadonText}>Tổng tiền bàn: {new Intl.NumberFormat('vi-VN').format(form.TongTienMonAn) ?? 0}</p>
              <p className={styles.hoadonText}>Tổng tiền hoá đơn: {new Intl.NumberFormat('vi-VN').format(form.TongTienHoaDon)}</p>
              <p className={styles.hoadonText}>Tiền đặt cọc: {new Intl.NumberFormat('vi-VN').format(tienCoc)}</p>
              <p className={styles.hoadonText}>Tiền phạt: {new Intl.NumberFormat('vi-VN').format(form.TongTienPhat)}</p>
              {form.TienConLai > 0 ?
                <p className={styles.hoadonText}>Khách còn thiếu: {new Intl.NumberFormat('vi-VN').format(form.TienConLai)}</p>
                :
                <p className={styles.hoadonText}>Khách còn dư: {new Intl.NumberFormat('vi-VN').format(Math.abs(form.TienConLai))}</p>
              }
            </div> :
            <div>
              <p className={styles.hoadonText} style={{ marginTop: '20px' }}>Tổng tiền dịch vụ: {new Intl.NumberFormat('vi-VN').format(tongtiendichvu) ?? 0}</p>
              <p className={styles.hoadonText}>Tổng tiền hoá đơn (chưa tính tiền phạt và tiền cọc): {new Intl.NumberFormat('vi-VN').format(tongtienhoadon)}</p>

            </div>
          }

          {
            !isViewMode ? (
              <Button
                className={styles.noPrint}
                variant="contained"
                onClick={() => handleCreateHoaDon()}
                sx={{
                  bgcolor: "#FFD66D",
                  width: "150px",
                  textTransform: "none",
                  height: "40px",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#063F5C",
                  marginTop: '190px',
                  "&:hover": {
                    bgcolor: "#D9A441",
                  },
                }}
                  disabled={!hasPermission(permissions, 'bill.create')}

              >
                Lưu thay đổi
              </Button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0px' }}>
                <Button
                  className={styles.noPrint}
                  variant="contained"
                  onClick={() => handlePrintHoaDon()}
                  sx={{
                    bgcolor: "#FFD66D",
                    width: "140px",
                    textTransform: "none",
                    height: "40px",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#063F5C",
                    marginTop: '15px',
                    "&:hover": {
                      bgcolor: "#D9A441",
                    },
                  }}
                >
                  Xuất hoá đơn
                </Button>
                <Button
                  className={styles.noPrint}
                  variant="contained"
                  onClick={() => handleOpenHDEditDialog()}
                  sx={{
                    bgcolor: "#e53935",
                    width: "140px",
                    textTransform: "none",
                    height: "40px",
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "white",
                    marginTop: '15px',
                    "&:hover": {
                      bgcolor: "#c62828",
                    },
                  }}
                  disabled={!hasPermission(permissions, 'bill.edit')}
                >
                  Sửa hoá đơn
                </Button>
              </div>
            )
          }
        </div>


        <div className={styles.hoadonRight}>

          <div >
            {isViewMode ? <p className={styles.ctHoadon}>CHI TIẾT HOÁ ĐƠN</p> : <p className={styles.ctHoadon}>CHI TIẾT ĐẶT TIỆC</p>}
            <div className={styles.row}>
              <div className={styles.hoadonText} style={{ height: "20px", marginTop: "20px", marginBottom: "20px" }}>
                <p>Số lượng bàn: </p>
                {isViewMode ? form.SoLuongBanDaDung : (
                  <FormTextField
                    disabled={!hasPermission(permissions, 'bill.edit')}
                    name="SoLuongBanDaDung"
                    type="number"
                    value={form.SoLuongBanDaDung}
                    onChange={handleChange}
                    variant="filled"
                    error={!!errors.SoLuongBanDaDung}
                    helperText={errors.SoLuongBanDaDung || " "}
                    sx={{
                      width: 110,
                      marginTop: '43px',
                      backgroundColor: '#063F5C',
                      borderRadius: 1,
                      marginLeft: '10px',
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#063F5C',
                        borderRadius: 1,
                        boxShadow: '0 0 0 0.5px white',

                        '&.Mui-error': {
                          boxShadow: '0 0 0 0.5px red', // ✅ viền đỏ khi có lỗi
                        },

                        '&:hover': {
                          backgroundColor: '#075373',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#063F5C',
                        },
                        input: {
                          color: 'white',
                        },
                      },

                      '& .MuiFormHelperText-root': {
                        color: 'red',
                        width: '230px',
                        marginLeft: '-1px',
                        display: 'inline',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },

                      '& input[type=number]::-webkit-outer-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      '& input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                      '& input[type=number]': {
                        MozAppearance: 'textfield', // Firefox
                      },

                    }}
                    InputProps={{
                      disableUnderline: true,
                      inputProps: {
                        min: 0,
                        max: 255,
                      },
                    }}
                    onKeyDown={(e) => {
                      if (["-", "e", "+"].includes(e.key)) e.preventDefault();
                    }}
                  />
                )}
              </div>

              {isViewMode ?
                <div className={styles.hoadonText}>
                  <p>Đơn giá bàn: {new Intl.NumberFormat('vi-VN').format(form.DonGiaBan)}</p>
                </div> : null}
            </div>
            <div>
              <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                <p style={{ color: 'white', fontWeight: "700", fontSize: "28px", marginBottom: '10px' }}>Danh sách dịch vụ</p>
              </div>
              {Array.isArray(form.dsDichVu) && form.dsDichVu.length > 0 ? (

                <div className={styles.table} style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                  <CustomTable
                    sx={{ marginRight: '20px' }}
                    data={form.dsDichVu.filter(dv => !dv.isDeleted)}
                    columns={columns}
                    onEdit={handleEditDV}
                    onDelete={handleDeleteDV}
                    disabledEdit={!hasPermission(permissions, 'service.edit')}
                    disabledDelete={!hasPermission(permissions, 'service.delete')}
                  />
                </div>

              ) : (
                <div>
                  <p style={{ color: 'white', zIndex: '1' }}>Không có dữ liệu dịch vụ.</p>
                </div>
              )}
              {!isViewMode && <div style={{ border: '1px solid rgba(224, 224, 224, 1)', width: 'fit-content', marginTop: "5px", marginBottom: "0px" }}>
                <AddButton onClick={handleOpenDVDialog} text="Thêm" sx={{ width: "fit-content" }} disabled={!hasPermission(permissions, 'service.create')} /></div>}
            </div>
            {form.dsMonAn.length > 0 ? (
              <div>
                <p style={{ color: 'white', marginTop: "30px", fontWeight: "700", fontSize: "28px", marginBottom: "10px" }}>Danh sách món ăn</p>
                <div className={styles.table} style={{ border: '1px solid rgba(224, 224, 224, 1)', marginBottom: "15px" }}>

                  <CustomTable
                    data={form.dsMonAn}
                    columns={columns2}
                    onEdit={handleEditMA}
                    onDelete={handleDeleteMA}

                  />
                </div>
              </div>
            ) : (
              <p style={{ color: 'white' }}>Không có dữ liệu món ăn.</p>
            )}

          </div>

          <DichVuDialog
            open={isDVDialogOpen}
            onClose={handleCloseDVEditDialog}
            onSave={handleSaveCT_DichVu}
            title={mode === "edit" ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
            initialData={selectedDichVu}
            mode={mode}
          />
          <DanhSachDichVuDialog
            open={openDichVuDialog}
            title='Chọn dịch vụ để thêm'
            onClose={handleCloseDVDialog}
            onSelect={handleChonDichVu}
          />

          <DeleteDialog
            open={isDeleteDVDialogOpen}
            onClose={handleCloseDVDeleteDialog}
            onDelete={acceptDeleteDV}
            title="Xác nhận xóa dịch vụ"
            content={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedDichVu?.TenDichVu}"?`}
          />
          
          <EditDialog
            open={isEditHDDialogOpen} 
            onClose={handleCloseHDEditDialog}
            onEdit={handleMoveToEditHD}
            title="Xác nhận chỉnh sửa hoá đơn"
            content={`Bạn có chắc chắn muốn chỉnh sửa hoá đơn này không?"`}
          />
        </div>
      </div>
      <div className={styles.footerPrint} style={{ display: "none" }}>
        <div >
          <div className={styles.signatureTitle}>Người lập</div>
          <div >Ký tên</div>
        </div>

      </div>

    </Box>
  );
}
export default HoaDon;
