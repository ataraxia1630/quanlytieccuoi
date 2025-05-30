import { useCallback, useEffect, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, getHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import CustomTable from '../../components/Customtable';
import ActionButtons from '../../components/Actionbuttons';
import AddButton from '../../components/Addbutton';

import {
  getAllCTDichVuByPDTId,
  createCTDichVu,
  updateCTDichVu,
  deleteCTDichVu
} from '../../service/ct_dichvu.service';

import CTDatBanCotroller from '../../service/ct_datban.service';

import DichVuDialog from "../../components/hoadon_dv/dichvu_popup";
import DanhSachDichVuDialog from '../../components/hoadon_dv/danhsachdichvu_popup';

import MonAnDialog from '../../components/hoadon_ma/monan_popup';
import DanhSachMonAnDialog from '../../components/hoadon_ma/danhsachmonan_popup';

import DichVuService from "../../service/dichvu.service";
import MonAnService from '../../service/monan.service';
import { toast } from 'react-toastify';
import DeleteDialog from "../../components/Deletedialog";
import ctDatBanService from '../../service/ct_datban.service';
import SomeActionButton from '../../components/Someactionbutton';

function HoaDon() {
  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec } = location.state || {};

  const [isViewMode, setIsViewMode] = useState(Boolean(soHoaDon));
  const [openDichVuDialog, setOpenDichVuDialog] = useState(false);
  const [openMonAnDialog, setOpenMonAnDialog] = useState(false);

  const handleOpenDVDialog = () => setOpenDichVuDialog(true);
  const handleCloseDVDialog = () => setOpenDichVuDialog(false);

  const handleOpenMADialog = () => setOpenMonAnDialog(true);
  const handleCloseMADialog = () => setOpenMonAnDialog(false);
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
  const [isDeleteMADialogOpen, setIsDeleteMADialogOpen] = useState(false);

  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [monAnList, setMonAnList] = useState([]);

  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [selectedMonAn, setSelectedMonAn] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });

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

  useEffect(() => {
    fetchDichVuList();
  }, [fetchDichVuList]);

  const handleChonDichVu = async (dichVu) => {
    setSelectedDichVu({
      MaDichVu: dichVu.MaDichVu,
      DonGia: dichVu.DonGia,
      SoLuong: 1,
      DichVu: { TenDichVu: dichVu.TenDichVu }
    });
    setMode("add");
    setIsDVDialogOpen(true);

    await fetchDichVuList(pagination.limit, pagination.offset);

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
        
        
        console.log("vao edit dich vu");
        await updateCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec, dichVuData);
        const newList = await getAllCTDichVuByPDTId(soPhieuDatTiec);

        const normalized = newList.map(item => ({
          ...item,
          DichVu: {
            TenDichVu: item["DichVu.TenDichVu"] || item?.DichVu?.TenDichVu
          }
        }));

        setForm(prev => ({ ...prev, dsDichVu: normalized }));

        toast.success("Dịch vụ đã được cập nhật!");
      } else {

        const isExist = form.dsDichVu.some(
          (dv) => dv.MaDichVu === selectedDichVu.MaDichVu
        );

        if (isExist) {
          console.log("Dịch vụ đã được chọn trước đó!");
          toast.error("Dịch vụ đã được chọn trước đó!");
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
        toast.success("Dịch vụ đã được thêm vào hoá đơn!");
      }

      setIsDVDialogOpen(false);
      setSelectedDichVu(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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


  const acceptDeleteDV = async () => {
    try {
      setLoading(true);
      const result = await deleteCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec);
      const newList = await getAllCTDichVuByPDTId(soPhieuDatTiec);
      setForm((prev) => ({
        ...prev,
        dsDichVu: newList,
      }));
      toast.success('Đã xoá dịch vụ khỏi hoá đơn!')

      setIsDeleteDVDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(currentFilters, pagination.limit, pagination.offset);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    { id: "index", label: "STT", width: 10 },
    {
      id: "TenDichVu",
      label: "Dịch vụ",
      width: 150,
      render: (row) => row?.DichVu?.TenDichVu || "Không rõ"

    },
    { id: "SoLuong", label: "Số lượng", width: 30 },
    { id: "DonGia", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,

      render: (row) => row.DonGia && row.SoLuong ? row.DonGia * row.SoLuong : null
    },
    !isViewMode ? {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    } : null,
  ].filter(Boolean);
  const columns2 = [
    { id: "index", label: "STT", width: 5 },
    {
      id: "TenMonAn",
      label: "Món ăn",
      width: 150,
      render: (row) => row?.MonAn?.TenMonAn || "Không rõ"
    },
    { id: "SoLuong", label: "Số lượng", width: 30 },
    { id: "DonGia", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGia * row.SoLuong
    },
    !isViewMode ? {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    } : null,
  ].filter(Boolean);

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
          const randomNum = Math.floor(100000 + Math.random() * 900000);

          const newForm = {
            ...form,
            SoPhieuDatTiec: initData.SoPhieuDatTiec || '',
            SoHoaDon: `HD${randomNum}`,
            SoLuongBanDaDung: initData.SoLuongBan,
            NgayThanhToan: new Date().toISOString(),
            dsDichVu: dsChiTietDichVu || [],
            dsMonAn: dsThucDon || [],
          };
          setForm(newForm);
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  function formatDate(date) {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const handleCreateHoaDon = async () => {
    try {
      setLoading(true);
      const hoaDonData = {
        SoPhieuDatTiec: form.SoPhieuDatTiec,
        SoHoaDon: form.SoHoaDon,
        SoLuongBanDaDung: form.SoLuongBanDaDung,
      };

      const result = await createHoaDon(hoaDonData);
      if (result) {
        console.log('✅ Tạo hóa đơn thành công:', result);
        setIsViewMode(true);
        setForm((prevForm) => ({
          ...prevForm,
          ...result,
        }));

        toast.success("Tạo hóa đơn thành công");
      } else {
        console.warn('⚠️ Tạo hóa đơn không thành công');
        toast.error("Tạo hóa đơn không thành công");
      }
    } catch (err) {
      console.error('❌ Lỗi khi tạo hóa đơn:', err);
      toast.error("Lỗi khi tạo hóa đơn: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintHoaDon = () => {
    window.print();
  };


  if (loading) return <p>Đang tải dữ liệu hóa đơn...</p>;

  return (
    <div className={`${styles.hoadonBox} ${styles.printableHoaDon}`}>

      <div className={`${styles.hoadonLeft} ${styles.dashedBorder}`}>

        <div style={{ flex: 1 }}>
          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '80px' }}>Chú rể:</p>
          <span className={styles.hoadonName}>{chuRe}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Cô dâu:</p>
          <span className={styles.hoadonName}>{coDau}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Ngày đãi tiệc: </p>
          <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '15px' }}>Ngày thanh toán: </p>
          {isViewMode && form.NgayThanhToan && (
            <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span>
          )}
        </div>
        {isViewMode ?
          <div>
            <p className={styles.hoadonText} style={{ marginTop: '50px' }}>Tổng tiền dịch vụ: {form.TongTienDichVu ?? 0}</p>
            <p className={styles.hoadonText}>Tổng tiền món ăn: {form.TongTienMonAn ?? 0}</p>
            <p className={styles.hoadonText}>Tổng tiền hoá đơn: {form.TongTienHoaDon}</p>
            <p className={styles.hoadonText}>Tiền đặt cọc: {tienCoc}</p>
            <p className={styles.hoadonText}>Tiền phạt: {form.TongTienPhat}</p>
            {form.TienConLai > 0 ?
              <p className={styles.hoadonText}>Khách hàng còn thiếu: {form.TienConLai}</p>
              :
              <p className={styles.hoadonText}>Khách hàng còn dư: {Math.abs(form.TienConLai)}</p>
            }
          </div> :
          <div></div>
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
                marginTop: '300px',
                "&:hover": {
                  bgcolor: "#D9A441",
                },
              }}
            >
              Lưu thay đổi
            </Button>
          ) : (
            <Button
              className={styles.noPrint}
              variant="contained"
              onClick={() => handlePrintHoaDon()}
              sx={{
                bgcolor: "#FFD66D",
                width: "150px",
                textTransform: "none",
                height: "40px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#063F5C",
                marginTop: '30px',
                "&:hover": {
                  bgcolor: "#D9A441",
                },
              }}
            >
              Xuất hoá đơn
            </Button>
          )
        }
      </div>


      <div className={styles.hoadonRight}>

        <div >
          <p className={styles.ctHoadon}>CHI TIẾT HOÁ ĐƠN</p>

          <div className={styles.row}>
            <div className={styles.hoadonText}>
              <p>Số lượng bàn: </p>
              {isViewMode ? form.SoLuongBanDaDung : (
                <TextField
                  name="SoLuongBanDaDung"
                  type="number"
                  value={form.SoLuongBanDaDung}
                  onChange={handleChange}
                  variant="filled"
                  sx={{ width: 80 }}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      input: {
                        color: 'white',
                      },
                    },
                  }}
                />
              )}
            </div>

            {isViewMode ?
              <div className={styles.hoadonText}>
                <p>Đơn giá bàn: {form.DonGiaBan}</p>
              </div> : null}

            

          </div>
          {Array.isArray(form.dsDichVu) && form.dsDichVu.length > 0 ? (
            <div>

              <div style={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
                <CustomTable
                  sx={{ marginRight: '20px' }}
                  data={form.dsDichVu}
                  columns={columns}
                  onEdit={handleEditDV}
                  onDelete={handleDeleteDV}
                />
              </div>

            </div>
          ) : (
            <p style={{ color: 'white' }}>Không có dữ liệu dịch vụ.</p>
          )}
          {!isViewMode && <AddButton onClick={handleOpenDVDialog} text="Thêm dịch vụ" />}


          {form.dsMonAn.length > 0 ? (
            <div>
              <div style={{ border: '1px solid rgba(224, 224, 224, 1)', marginTop: '30px' }}>
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
          {!isViewMode && <AddButton onClick={handleOpenMADialog} text="Thêm món ăn" />}

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

        <MonAnDialog
          open={isMADialogOpen}
          onClose={handleCloseMAEditDialog}
          onSave={handleSaveCT_MonAn}
          title={mode === "edit" ? "Chỉnh sửa món ăn" : "Thêm món ăn"}
          initialData={selectedMonAn}
          mode={mode}
        />
        <DanhSachMonAnDialog
          open={openMonAnDialog}
          title='Chọn món ăn để thêm'
          onClose={handleCloseMADialog}
          onSelect={handleChonMonAn}
        />
        <DeleteDialog
          open={isDeleteDVDialogOpen}
          onClose={handleCloseDVDeleteDialog}
          onDelete={acceptDeleteDV}
          title="Xác nhận xóa dịch vụ"
          content={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedDichVu?.TenDichVu}"?`}
        />
        <DeleteDialog
          open={isDeleteMADialogOpen}
          onClose={handleCloseMADeleteDialog}
          onDelete={acceptDeleteMA}
          title="Xác nhận xóa món ăn"
          content={`Bạn có chắc chắn muốn xóa món ăn "${selectedMonAn?.TenMonAn}"?`}
        />
      </div>
    </div>
  );
}

export default HoaDon;
