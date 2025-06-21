import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, deleteHoaDon, restoreDichVu } from '../../service/hoadon.service';
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
import { useNavigate } from "react-router-dom";
import FormTextField from '../../components/Formtextfield';


function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec, slBanToiDa } = location.state || {};

  const [isViewMode, setIsViewMode] = useState(Boolean(soHoaDon));
  const [openDichVuDialog, setOpenDichVuDialog] = useState(false);

  const handleOpenDVDialog = () => setOpenDichVuDialog(true);
  const handleCloseDVDialog = () => setOpenDichVuDialog(false);

  const [form, setForm] = useState({
    SoPhieuDatTiec: '',
    SoHoaDon: '',
    NgayThanhToan: '',
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
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  const [selectedMonAn, setSelectedMonAn] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });
  const [errors, setErrors] = useState({
    SoLuongBanDaDung: "",
  });
  const navigate = useNavigate();


  const permissions = localStorage.getItem('permissions');


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

  const fetchDichVuList = useCallback(async (limit = 10, offset = 0) => {
    try {
      setLoading(true);
      const data = await DichVuService.getAllDichVu(limit, offset);
      const normalized = data.map(item => ({
        ...item,
        DichVu: {
          TenDichVu: item["DichVu.TenDichVu"] || item?.TenDichVu,
        },
      }));
      setDichVuList(normalized); // ❌ KHÔNG cập nhật form
    } catch (error) {
      toast.error(error.message);
      setDichVuList([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const tongtiendichvu = useMemo(() => {
    if (!form.dsDichVu || form.dsDichVu.length === 0) return 0;

    return form.dsDichVu.reduce((sum, dv) => {
      if (dv.isDeleted) return sum; // bỏ qua dịch vụ đã xoá tạm
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
  };

  const handleSaveCT_DichVu = async (formData) => {
  try {
    setLoading(true);

    if (!selectedDichVu?.MaDichVu) {
      toast.error("Không có dịch vụ nào được chọn.");
      return;
    }

    const dichVuData = {
      MaDichVu: selectedDichVu.MaDichVu,
      DonGia: Number(formData.price),
      SoLuong: Number(formData.sl),
      SoPhieuDatTiec: soPhieuDatTiec
    };

    let updatedDsDichVu;

    if (mode === "edit") {
      updatedDsDichVu = form.dsDichVu.map(dv =>
        dv.MaDichVu === selectedDichVu.MaDichVu
          ? {
              ...dv,
              ...(dv.original ? {} : { original: { SoLuong: dv.SoLuong, DonGia: dv.DonGia } }),
              DonGia: dichVuData.DonGia,
              SoLuong: dichVuData.SoLuong,
              isUpdated: true,
              isNew: false,
              DichVu: dv.DichVu?.TenDichVu
                ? { TenDichVu: dv.DichVu.TenDichVu }
                : selectedDichVu.DichVu
            }
          : dv
      );

      toastService.hoaDon.serviceUpdated();
    } else {
      const isExist = form.dsDichVu.some(
        (dv) => dv.MaDichVu === selectedDichVu.MaDichVu && !dv.isDeleted
      );
      if (isExist) {
        toastService.hoaDon.serviceAlreadySelected();
        setIsDVDialogOpen(false);
        return;
      }

      updatedDsDichVu = [
        ...form.dsDichVu,
        {
          ...dichVuData,
          isNew: true,
          isFromHoaDon: true,
          DichVu: {
            TenDichVu: selectedDichVu?.DichVu?.TenDichVu || "Không rõ"
          }
        }
      ];
      toastService.hoaDon.serviceAdded();
    }

    // ✅ Lưu cache
    const cacheKey = `dv-backup-${soPhieuDatTiec}`;
    localStorage.setItem(cacheKey, JSON.stringify(updatedDsDichVu));
    console.log("updated dich vu sau khi edit hoac them: " + updatedDsDichVu)
    
    // ✅ Cập nhật state
    setForm(prev => ({
      ...prev,
      dsDichVu: updatedDsDichVu
    }));

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

    if (!selectedDichVu?.MaDichVu) {
      toast.error("Không có dịch vụ được chọn để xoá.");
      return;
    }

    const updated = form.dsDichVu.map(dv =>
      dv.MaDichVu === selectedDichVu.MaDichVu && !dv.isDeleted
        ? { ...dv, isDeleted: true }
        : dv
    );

    setForm(prev => ({
      ...prev,
      dsDichVu: updated
    }));

    // ✅ Cập nhật cache
    localStorage.setItem(`dv-backup-${soPhieuDatTiec}`, JSON.stringify(updated));
    console.log("updated dich vu sau khi xoa: " + JSON.stringify(updated))

    toastService.hoaDon.serviceRemoved();
    setIsDeleteDVDialogOpen(false);
    setSelectedDichVu(null);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


 
const acceptDeleteHD = async () => {
  try {
    setLoading(true);

    const dichVuCanXoa = form.dsDichVu.filter(dv => dv.isFromHoaDon);
    for (const dv of dichVuCanXoa) {
      await deleteCTDichVu(dv.MaDichVu, soPhieuDatTiec);
    }

    // 🔁 Khôi phục từ localStorage
    const cacheKey = `dv-backup-${soPhieuDatTiec}`;
    const cachedDV = localStorage.getItem(cacheKey);

    if (cachedDV) {
      try {
        const parsedCache = JSON.parse(cachedDV);
        await restoreDichVu(soPhieuDatTiec, parsedCache);
console.log("📦 Dữ liệu sẽ khôi phục vào DB:", parsedCache);

        // Ghi dấu đã khôi phục để useEffect không dùng lại cache
        localStorage.setItem(`restored-${soPhieuDatTiec}`, 'true');

        // Reset lại state để tránh xung đột
        const updated = parsedCache.map(dv => ({
          ...dv,
          isNew: false,
          isUpdated: false,
          isDeleted: false,
          original: undefined,
        }));

        setForm(prev => ({
          ...prev,
          dsDichVu: updated
        }));
      } catch (err) {
        toast.error("Lỗi khi khôi phục dữ liệu gốc.");
        return;
      }
    }

    const maso = form.SoHoaDon || soHoaDon;
    await deleteHoaDon(maso);

    toast.success("Đã xoá hóa đơn và khôi phục dữ liệu gốc!");

    // ❗ Di chuyển xoá cache và điều hướng xuống dưới cùng
    localStorage.removeItem(`dv-backup-${soPhieuDatTiec}`);
    navigate(-1);

  } catch (error) {
    toast.error(error.message || "Xoá hóa đơn thất bại.");
  } finally {
    setLoading(false);
  }
};


  const handleCreateHoaDon = async () => {
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

    // Xử lý cập nhật chi tiết dịch vụ
    for (const dv of form.dsDichVu) {
      const isGoc = !dv.isNew && !dv.isFromHoaDon;

      if (dv.isDeleted && isGoc) {
        await deleteCTDichVu(dv.MaDichVu, soPhieuDatTiec);
      }

      if (dv.isNew) {
        // Chỉ tạo mới khi thực sự là mới và không bị xóa
        if (!dv.isDeleted) {
          await createCTDichVu(dv);
        }
      } else if (dv.isUpdated && !dv.isDeleted) {
        await updateCTDichVu(dv.MaDichVu, soPhieuDatTiec, dv);
      }
    }

    // Gửi dữ liệu tạo hoá đơn
    const hoaDonData = {
      SoPhieuDatTiec: form.SoPhieuDatTiec,
      SoHoaDon: form.SoHoaDon,
      SoLuongBanDaDung: parsed,
    };

    const result = await createHoaDon(hoaDonData);

    // Cập nhật trạng thái phiếu đặt tiệc
    await PhieuDatTiecService.updatePhieuDatTiec(form.SoPhieuDatTiec, {
      TrangThai: "Đã thanh toán",
    });

    if (result) {
      // ✅ Xoá cache sau khi thành công
      localStorage.removeItem(`dv-backup-${soPhieuDatTiec}`);

      setIsViewMode(true);
      setForm((prevForm) => ({
        ...prevForm,
        soHoaDon: result.SoHoaDon,
        ...result,
      }));
      toastService.hoaDon.paymentSuccess();
    } else {
      toastService.hoaDon.paymentFailed();
    }
  } catch (err) {
    console.error("❌ Lỗi khi tạo hoá đơn:", err);
    toastService.crud.error.generic(); // "Có lỗi xảy ra. Vui lòng thử lại sau!"
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  async function fetchData() {
    try {
      const cacheKey = `dv-backup-${soPhieuDatTiec}`;
      
      const restoredKey = `restored-${soPhieuDatTiec}`;

      const cachedDV = localStorage.getItem(cacheKey);
    console.log("dich vu trong useeffect: " + JSON.parse(cachedDV))

      const isRestored = localStorage.getItem(restoredKey);

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

      let finalDichVu = normalizedDichVu;

      // ✅ Chỉ dùng cache nếu chưa restore
      if (!isViewMode && cachedDV && !isRestored) {
        try {
          const parsedCache = JSON.parse(cachedDV);
          if (Array.isArray(parsedCache)) {
            finalDichVu = parsedCache;
          }
        } catch (e) {
          console.error("Lỗi parse localStorage:", e);
        }
      }

      if (isViewMode) {
        console.log('Vào chế độ xem');
        setForm({
          ...initData,
          dsDichVu: finalDichVu,
          dsMonAn: normalizedMonAn,
        });
      } else {
        const randomNumStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        setForm(prev => ({
          ...prev,
          SoPhieuDatTiec: initData.SoPhieuDatTiec || '',
          SoHoaDon: `HD${randomNumStr}`,
          SoLuongBanDaDung: initData.SoLuongBan,
          NgayThanhToan: new Date().toISOString(),
          dsDichVu: finalDichVu,
          dsMonAn: normalizedMonAn,
        }));
      }

      // 🧹 Xoá dấu đã restore sau khi dùng xong
      localStorage.removeItem(restoredKey);

    } catch (err) {
      toastService.crud.error.generic();
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);




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


  const handleChonMonAn = async (monan) => {
    setSelectedMonAn({
      MaMonAn: monan.MaMonAn,
      DonGia: monan.DonGia,
      SoLuong: 1,
      MonAn: { TenMonAn: monan.TenMonAn }

    });
    setMode("add");
    setIsMADialogOpen(true);

    await fetchMonAnList(pagination.limit, pagination.offset);
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


  const handleDeleteHD = (hoadon) => {
    setSelectedHoaDon(hoadon);
    setIsDeleteHDDialogOpen(true);
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

  const handleCloseHDDeleteDialog = () => {
    setIsDeleteHDDialogOpen(false);
    setSelectedHoaDon(null);
  };

  const handleCloseMADeleteDialog = () => {
    setIsDeleteMADialogOpen(false);
    setSelectedMonAn(null);
  };

  const handleCloseDVEditDialog = () => {
    setIsDVDialogOpen(false);
    setSelectedDichVu(null);
  };
  const handleCloseMAEditDialog = () => {
    setIsMADialogOpen(false);
    setSelectedDichVu(null);
  };

  const acceptDeleteMA = async () => {
    try {
      setLoading(true);
      const result = await ctDatBanService.remove(soPhieuDatTiec, selectedMonAn.MaMonAn);
      const newList = await CTDatBanCotroller.getAllByPhieuDatTiecId(soPhieuDatTiec);
      setForm((prev) => ({
        ...prev,
        dsMonAn: newList,
      }));
      toast.success('Đã xoá món ăn khỏi hoá đơn!')

      setIsDeleteMADialogOpen(false);
      setSelectedMonAn(null);
      fetchMonAnList(currentFilters, pagination.limit, pagination.offset);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  /////////////////////////////////////////


  const handleSaveCT_MonAn = async (formData) => {
    try {
      setLoading(true);
      const monAnData = {
        MaMonAn: selectedMonAn.MaMonAn,
        DonGia: Number(formData.price),
        SoLuong: Number(formData.sl),
        SoPhieuDatTiec: soPhieuDatTiec,
      };

      if (mode === "edit" && selectedMonAn) {
        await CTDatBanCotroller.update(soPhieuDatTiec, monAnData.MaMonAn, monAnData);
        const newList = await CTDatBanCotroller.getAllByPhieuDatTiecId(soPhieuDatTiec);
        const normalized = newList.map(item => ({
          ...item,
          MonAn: {
            TenMonAn: item["MonAn.TenMonAn"] || item?.MonAn?.TenMonAn
          }
        }));

        setForm(prev => ({ ...prev, dsMonAn: normalized }));

        toast.success("Món ăn đã được cập nhật!");
      } else {
        const isExist = form.dsMonAn.some(
          (ma) => ma.MaMonAn === selectedMonAn.MaMonAn
        );

        if (isExist) {
          toast.error("Món ăn đã được chọn trước đó!");
          setIsMADialogOpen(false);
          return;
        }


        await CTDatBanCotroller.create(monAnData);
        const newList = await CTDatBanCotroller.getAllByPhieuDatTiecId(soPhieuDatTiec);
        const normalized = newList.map(item => ({
          ...item,
          MonAn: {
            TenMonAn: item["MonAn.TenMonAn"] || item?.MonAn?.TenMonAn
          }
        }));
        setForm(prev => ({ ...prev, dsMonAn: normalized }));
        toast.success("Món ăn đã được thêm vào hoá đơn!");
      }

      setIsMADialogOpen(false);
      setSelectedMonAn(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
            {isViewMode && form.NgayThanhToan ? (
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
                  onClick={() => handleDeleteHD()}
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
                //   disabled={!hasPermission(permissions, 'bill.delete')}
                >
                  Xoá hoá đơn
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
                  <p>Đơn giá bàn: {form.DonGiaBan}</p>
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

          {/* <MonAnDialog
          open={isMADialogOpen}
          onClose={handleCloseMAEditDialog}
          onSave={handleSaveCT_MonAn}
          title={mode === "edit" ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
          initialData={selectedMonAn}
          mode={mode}
        /> */}
          {/* <DanhSachMonAnDialog
          open={openMonAnDialog}
          title='Chọn món ăn để thêm'
          onClose={handleCloseMADialog}
          onSelect={handleChonMonAn}
        /> */}
          <DeleteDialog
            open={isDeleteDVDialogOpen}
            onClose={handleCloseDVDeleteDialog}
            onDelete={acceptDeleteDV}
            title="Xác nhận xóa dịch vụ"
            content={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedDichVu?.TenDichVu}"?`}
          />
          <DeleteDialog
            open={isDeleteHDDialogOpen}
            onClose={handleCloseHDDeleteDialog}
            onDelete={acceptDeleteHD}
            title="Xác nhận xóa hoá đơn"
            content={`Bạn có chắc chắn muốn xóa hoá đơn này không?"`}
          />
          {/* <DeleteDialog
          open={isDeleteMADialogOpen}
          onClose={handleCloseMADeleteDialog}
          onDelete={acceptDeleteMA}
          title="Xác nhận xóa món ăn"
          content={`Bạn có chắc chắn muốn xóa món ăn "${selectedMonAn?.TenMonAn}"?`}
        /> */}
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
