import { useCallback, useEffect, useState } from 'react';
import styles from './HoaDon.module.css';
import { createHoaDon, getHoaDon } from '../../service/hoadon.service';
import { useLocation } from 'react-router-dom';
import { MenuItem, Select, TextField } from '@mui/material';
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

import DichVuService from "../../service/dichvu.service";
import { toast } from 'react-toastify';
import DeleteDialog from "../../components/Deletedialog";
import { useNavigate } from 'react-router-dom';



function HoaDon() {
  const navigate = useNavigate();

  const location = useLocation();
  const { soHoaDon, soPhieuDatTiec, data: initData, coDau, chuRe, tienCoc, ngayDaiTiec } = location.state || {};

  const isViewMode = Boolean(soHoaDon);
  const isWriteMode = Boolean(soPhieuDatTiec && initData);

  const [openDichVuDialog, setOpenDichVuDialog] = useState(false);
  const handleOpenDialog = () => setOpenDichVuDialog(true);
  const handleCloseDialog = () => setOpenDichVuDialog(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [dvForm, setDvForm] = useState({
    MaDichVu: '',
    TenDichVu: '',
    SoLuong: 1,
    DonGia: 0
  });

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
    dsMonAn: []
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);
  const [dichVuList, setDichVuList] = useState([]);
  const [selectedDichVu, setSelectedDichVu] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
  });

  const fetchDichVuList = useCallback(
    async (filters = {}, limit = 10, offset = 0) => {
      try {
        setLoading(true);
        let data;

        if (Object.keys(filters).length > 0 || searchTerm.trim()) {
          const trimmedTerm = searchTerm.trim();
          const searchParams = {
            ...filters,
            ...(trimmedTerm &&
              (() => {
                if (/^DV\d{3}$/.test(trimmedTerm)) {
                  return { maDichVu: trimmedTerm };
                } else {
                  return { tenDichVu: trimmedTerm };
                }
              })()),
          };
          data = await DichVuService.searchDichVu(searchParams, limit, offset);
        } else {
          data = await DichVuService.getAllDichVu(limit, offset);
        }

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
    [searchTerm]
  );

  useEffect(() => {
    fetchDichVuList();
  }, [fetchDichVuList]);

  const handleSearch = async () => {
    toast.info(`Đang tìm kiếm: ${searchTerm}`);

    const result = await fetchDichVuList(currentFilters, pagination.limit, 0);

    if (result?.length === 0) {
      toast.warning("Không tìm thấy dịch vụ nào phù hợp.");
      setSearchTerm("");
    } else {
      toast.success(`Đã tìm thấy: ${searchTerm}`);
    }
  };
  const handleChonDichVu = (dichVu) => {
    setSelectedDichVu({
      MaDichVu: dichVu.MaDichVu,
      DonGia: dichVu.DonGia,
      SoLuong: 1,
      DichVu: dichVu, // để hiển thị tên
    });
    setMode("add");
    setIsDialogOpen(true);
  };


  // const handleAdd = () => {
  //   setMode("add");

  //   setSelectedDichVu(null);
  //   setIsDialogOpen(true);
  // };


  const handleEdit = (dichVu) => {
    setMode("edit");
    setSelectedDichVu(dichVu);
    setIsDialogOpen(true);
  };

  const handleDelete = (dichVu) => {
    setSelectedDichVu(dichVu);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDichVu(null);
  };

  const handleCloseEditDialog = () => {
    setIsDialogOpen(false);
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
        const updated = await updateCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec, dichVuData);

        setForm((prev) => ({
          ...prev,
          dsDichVu: prev.dsDichVu.map((dv) =>
            dv.MaDichVu === selectedDichVu.MaDichVu ? updated : dv
          ),
        }));
        toast.success("Chỉnh sửa dịch vụ trong hoá đơn thành công");
      } else {
        console.log("vao add dich vu");
        const created = await createCTDichVu(dichVuData);
        setForm((prev) => ({
          ...prev,
          dsDichVu: [...prev.dsDichVu, created],
        }));
        toast.success("Thêm dịch vụ vào hoá đơn thành công");
      }

      setIsDialogOpen(false);
      setSelectedDichVu(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const acceptDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteCTDichVu(selectedDichVu.MaDichVu, soPhieuDatTiec);

      const toastByStatus = {
        "soft-deleted": toast.info,
        "already-soft-deleted": toast.warning,
        deleted: toast.success,
      };

      (toastByStatus[result.status] || toast.success)(result.message);

      setIsDeleteDialogOpen(false);
      setSelectedDichVu(null);
      fetchDichVuList(currentFilters, pagination.limit, pagination.offset);
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


  // const handleAdd = async (newData) => {
  //   try {
  //     const res = await createCTDichVu({ ...newData, SoPhieuDatTiec: soPhieuDatTiec });
  //     setForm((prev) => ({
  //       ...prev,
  //       dsDichVu: [...prev.dsDichVu, res]
  //     }));
  //     setOpenDialog(false);
  //   } catch (err) {
  //     console.error("Thêm dịch vụ thất bại", err);
  //   }
  // };

  // const handleEdit = async (updatedRow) => {
  //   try {
  //     const { MaDichVu, SoPhieuDatTiec } = updatedRow;
  //     const res = await updateCTDichVu(MaDichVu, SoPhieuDatTiec, updatedRow);
  //     setForm((prev) => ({
  //       ...prev,
  //       dsDichVu: prev.dsDichVu.map((dv) =>
  //         dv.MaDichVu === MaDichVu && dv.SoPhieuDatTiec === SoPhieuDatTiec ? res : dv
  //       ),
  //     }));
  //     setOpenDialog(false);
  //   } catch (err) {
  //     console.error("Cập nhật dịch vụ thất bại", err);
  //   }
  // };

  // const handleDelete = async (row) => {
  //   try {
  //     await deleteCTDichVu(row.MaDichVu, row.SoPhieuDatTiec);
  //     setForm((prev) => ({
  //       ...prev,
  //       dsDichVu: prev.dsDichVu.filter(
  //         (dv) =>
  //           !(dv.MaDichVu === row.MaDichVu && dv.SoPhieuDatTiec === row.SoPhieuDatTiec)
  //       ),
  //     }));
  //   } catch (err) {
  //     console.error("Xoá dịch vụ thất bại", err);
  //   }
  // };




  const columns = [
    { id: "index", label: "STT", width: 10 },
    {
      id: "TenDichVu",
      label: "Dịch vụ",
      width: 150,
      render: (row) => row?.DichVu?.TenDichVu || "Không rõ", width: 150
    },
    { id: "SoLuong", label: "Số lượng", width: 30 },
    { id: "DonGia", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGia && row.SoLuong ? row.DonGia * row.SoLuong : null
    },
    {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];
  const columns2 = [
    { id: "index", label: "STT", width: 5 },
    {
      id: "TenMonAn",
      label: "Món ăn",
      width: 150,
      render: (row) => row?.MonAn?.TenMonAn || "Không rõ", width: 150
    },
    { id: "SoLuong", label: "Số lượng", width: 30 },    
    { id: "DonGia", label: "Đơn giá", width: 50 },
    {
      id: "ThanhTien",
      label: "Thành tiền",
      width: 50,
      render: (row) => row.DonGia && row.SoLuong ? row.DonGia * row.SoLuong : null
    },
    {
      id: "actions",
      label: "Thao tác",
      sortable: false,
      width: 10,
      render: (row, onEdit, onDelete) => (
        <ActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const dsChiTietDichVu = await getAllCTDichVuByPDTId(soPhieuDatTiec);
        console.log('✅ Danh sách chi tiết dịch vụ:', dsChiTietDichVu);
        setForm({
          ...form,
          dsDichVu: dsChiTietDichVu || []
        });

        const dsThucDon = await CTDatBanCotroller.getAllByPhieuDatTiecId(soPhieuDatTiec);
        console.log('✅ Danh sách món ăn:', dsThucDon);
        setForm((prev) => ({
          ...prev,
          dsMonAn: dsThucDon || [],
        }));

        if (isViewMode) {
          console.log('vao read');
          setForm({
            ...initData,
            // dsDichVu: dsChiTietDichVu || []  
          });

        } else if (isWriteMode) {
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

          try {
            const kq = await createHoaDon(soHoaDon, newForm);
            if (kq) {
              console.log('Tạo hóa đơn thành công');

            } else {
              console.log('Tạo hóa đơn không thành công');
            }
          } catch (er) {
            console.error('Lỗi khi tạo hóa đơn:', er);
          }
        }
      } catch (err) {
        console.error('❌ Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [soHoaDon, soPhieuDatTiec]);


  function formatDate(date) {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, '0');
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  if (loading) return <p>Đang tải dữ liệu hóa đơn...</p>;

  return (
    <div className={styles.hoadonBox}>

      <div className={`${styles.hoadonLeft} ${styles.dashedBorder}`}>



        <div style={{ flex: 1 }}>
          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '100px' }}>Chú rể:</p>
          <span className={styles.hoadonName}>{chuRe}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Cô dâu:</p>
          <span className={styles.hoadonName}>{coDau}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Ngày đãi tiệc: </p>
          <span className={styles.hoadonName}>{formatDate(ngayDaiTiec)}</span>

          <p className={styles.hoadonName} style={{ fontSize: '14px', fontWeight: 400, color: 'white', marginTop: '30px' }}>Ngày thanh toán: </p>
          {isViewMode ? <span className={styles.hoadonName}>{formatDate(form.NgayThanhToan)}</span> : <span></span>}

        </div>
        {isViewMode ?
          <div style={{ marginTop: 'auto' }}>
            <p className={styles.hoadonText} style={{ marginTop: '50px' }}>Tổng tiền dịch vụ: {isViewMode ? form.TongTienDichVu : '__'}</p>
            <p className={styles.hoadonText}>Tổng tiền hoá đơn: {isViewMode ? form.TongTienHoaDon : '__'}</p>
            <p className={styles.hoadonText}>Tiền đặt cọc: {tienCoc}</p>
            <p className={styles.hoadonText}>Tiền phạt: {isViewMode ? form.TongTienPhat : '__'}</p>
            <p className={styles.hoadonText}>Còn lại: {isViewMode ? form.TienConLai : '__'}</p>
          </div> : null}
      </div>

      <div className={styles.hoadonRight}>
        <div style={{ flex: 1, overflow: 'auto' }}>
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
                />
              )}
            </div>

            {isViewMode ?
              <div className={styles.hoadonText}>
                <p>Đơn giá bàn: {form.DonGiaBan}</p>
              </div> : null}

            {isViewMode ?
              <div className={styles.hoadonText}>
                <p>Tổng tiền bàn: {form.TongTienMonAn}</p>
              </div> : null}

          </div>
          {/* {console.log('form la: ')}
          {console.log(form.dsDichVu)} */}
          {Array.isArray(form.dsDichVu) && form.dsDichVu.length > 0 ? (
            <div>

              <div style={{ maxHeight: '600px', overflow: 'auto', border: '1px solid rgba(224, 224, 224, 1)' }}>
                <CustomTable
                  data={form.dsDichVu}
                  columns={columns}
                  onEdit={handleEdit}
                  onDelete={handleDelete}

                />


              </div>
              <AddButton onClick={handleOpenDialog} text="Thêm dịch vụ" />
            </div>

          ) : (
            <p>Không có dữ liệu dich vu.</p>
          )}

          {form.dsMonAn.length > 0 ? (
            <div>
              <div style={{ maxHeight: '600px', overflow: 'auto', border: '1px solid rgba(224, 224, 224, 1)', marginTop: '30px' }}>
                <CustomTable
                  data={form.dsMonAn}
                  columns={columns2}
                  onEdit={handleEdit}
                  onDelete={handleDelete}

                />
              </div>
              <AddButton onClick={handleOpenDialog} text="Thêm món ăn" />
            </div>
          ) : (
            <p>Không có dữ liệu món ăn.</p>
          )}


        </div>

        <DichVuDialog
          open={isDialogOpen}
          onClose={handleCloseEditDialog}
          onSave={handleSaveCT_DichVu}
          title={mode === "edit" ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
          initialData={selectedDichVu}
          mode={mode}
        />
        <DanhSachDichVuDialog
          open={openDichVuDialog}
          title='Chọn dịch vụ để thêm'
          onClose={handleCloseDialog}
          onSelect={handleChonDichVu}
        />
        <DeleteDialog
          open={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onDelete={acceptDelete}
          title="Xác nhận xóa dịch vụ"
          content={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedDichVu?.TenDichVu}"?`}
        />
      </div>
    </div>
  );
}

export default HoaDon;
