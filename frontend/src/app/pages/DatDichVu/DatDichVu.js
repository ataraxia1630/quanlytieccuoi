import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import './DatDichVu.css';
import Cancelbutton from '../../components/Cancelbutton';
import ServiceCard from '../../components/ServiceCard';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import { getAllCTDichVuByPDTId, updateCTDichVu, createCTDichVu, deleteCTDichVu } from '../../service/ct_dichvu.service';
import DichVuService from '../../service/dichvu.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultColumns from '../../components/ct_dichvu/ct_dichvu_default_column';
import CustomTable from "../../components/Customtable";
import { Typography, Box } from '@mui/material';
import EditCTDichVuDialog from "../../components/ct_dichvu/ct_dichvu_edit_dialog";
import DeleteDialog from '../../components/Deletedialog';



function DatDichVu() {

  const [services, setServices] = useState([]);
  const [reservedServices, setReservedServices] = useState([]);
  const { handleNav } = useContext(StepContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPDT, setCurrentPDT] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ctdichvuToEdit, setCtdichvuToEdit] = useState(null);
  console.log("DatDichVu: currentPDT:", reservedServices);
  //mock data         
  // const mockItems = useMemo(() => [
  //   {
  //     "MaDV": "DV004",
  //     "TenDV": "Quay phim & Chụp ảnh",
  //     "DonGia": 2000000.00,
  //     "TrangThai": "Ngừng cung cấp"
  //   },
  //   {
  //     "MaDV": "DV006",
  //     "TenDV": "Rượu mừng",
  //     "DonGia": 20000000.00,
  //     "TrangThai": "Tạm dừng"
  //   },
  //   {
  //     "MaDV": "DV007",
  //     "TenDV": "Thuê MC",
  //     "DonGia": 500000.00,
  //     "TrangThai": "Có sẵn"
  //   },
  //   {
  //     "MaDV": "DV008",
  //     "TenDV": "Cổng cưới",
  //     "DonGia": 1000000.00,
  //     "TrangThai": "Có sẵn"
  //   }
  // ], []);

  // fetch data dịch vụ từ db
  const fetchValidServices = useCallback(async () => {
    try {
      const data = await DichVuService.searchDichVu({ TinhTrang: "Có sẵn" });
      setServices(data); // set dữ liệu nếu thành công
    } catch (error) {
      toast.error(error.message || "lỗi khi tải dịch vụ");
    }
  }, []);


  // fetch data chi tiết dịch vụ từ db
  const fetchReservedServices = useCallback(async () => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await getAllCTDichVuByPDTId(currentPDT);
      setReservedServices(data); // set dữ liệu nếu thành công
    } catch (error) {
      toast.error(error.message || "lỗi khi tải chi tiết dịch vụ");
    }
  }, [currentPDT]);

  // cập nhật chi tiết dịch vụ
  const updateReservedService = useCallback(async ({ MaDichVu, SoLuong, DonGia }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await updateCTDichVu(MaDichVu, currentPDT, {
        SoLuong,
        DonGia,

      });
      console.log("return data: ", data)
      const temp = reservedServices.map(item =>
        item.MaDichVu === MaDichVu && item.SoPhieuDatTiec === currentPDT ? { ...item, ...data.data } : item
      );

      setReservedServices(temp);
      toast.success("cập nhật chi tiết dịch vụ thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi cập nhật chi tiết dịch vụ");
    }
  }, [currentPDT, reservedServices]);

  // thêm/cập nhật chi tiết dịch vụ vào bảng thông tin
  const AddReservedService = useCallback(async ({ MaDichVu, SoLuong, DonGia }) => {
    try {
      const exists = reservedServices.some(item => item.MaDichVu === MaDichVu);
      if (exists) {
        updateReservedService({ MaDichVu, SoLuong, DonGia });
        return;
      }

      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await createCTDichVu({
        MaDichVu,
        SoPhieuDatTiec: currentPDT,
        SoLuong,
        DonGia,

      });

      setReservedServices((preData) => [...preData, data.data]);
      toast.success("Đặt dịch vụ thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi thêm chi tiết dịch vụ");
    }
  }, [currentPDT, reservedServices, updateReservedService]);

  // xóa chi tiết dịch vụ
  const RemoveReservedService = useCallback(async ({ MaDichVu }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      await deleteCTDichVu(MaDichVu, currentPDT);
      const temp = reservedServices.filter(item => !(item.MaDichVu === MaDichVu && item.SoPhieuDatTiec === currentPDT));
      setReservedServices(temp);
      toast.success("Xóa chi tiết dịch vụ thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi xóa chi tiết dịch vụ");
    }
  }, [currentPDT, reservedServices]);



  // Lấy currentPDT từ localStorage 
  useEffect(() => {
    const pdt = localStorage.getItem("currentPDT");
    if (pdt === "null") {
      console.error(`không lấy được phiếu đặt tiệc hiện tại:pdt: ${pdt}`);
      handleNav(0);
      return
    } else {
      setCurrentPDT(pdt);
    }
  }, [handleNav]);



  // Gọi fetchReservedServices mỗi khi currentPDT hoặc fetchReservedServices thay đổi
  useEffect(() => {
    if (currentPDT) {
      console.log("current: ", currentPDT)
      fetchReservedServices();
    }
  }, [currentPDT, fetchReservedServices]);

  // Gọi fetchValidServices lây dữ liệu dịch vụ
  useEffect(() => {
    fetchValidServices();
  }, [fetchValidServices]);

  const fullReservedServicesData = useMemo(() => {

    return reservedServices.map((reserv) => {
      const serviceItem = services.find((item) => item.MaDichVu === reserv.MaDichVu);
      return {
        ...reserv,
        TenDichVu: (serviceItem ? serviceItem.TenDichVu : 'Không xác định'), // Giá trị mặc định nếu không tìm thấy
      };

    });
  }, [reservedServices, services]);

  console.log("reserva", fullReservedServicesData)


  const handleEdit = (data) => {
    setOpenDialog(true);
    setCtdichvuToEdit(data);
  };
  const handleSave = async (data) => {
    setOpenDialog(false)
    await updateReservedService(data);
    setCtdichvuToEdit(null);
  };
  const handleDelete = async (data) => {
    setIsDeleteDialogOpen(true);
    setCtdichvuToEdit(data);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCtdichvuToEdit(null);
  }
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCtdichvuToEdit(null);
    toast.info('Đã hủy xóa chi tiết dịch vụ');
  };
  const acceptDelete = async () => {
    setIsDeleteDialogOpen(false);
    RemoveReservedService(ctdichvuToEdit);
    setCtdichvuToEdit(null);
  };

  return (
    <div className="page">
      <ToastContainer />
      <Box className='intro-box'>
        <div className="dichvu-container">
          <h1 className="dichvu-title">Dich vu</h1>
          <p className="dichvu-description">
            Chúng tôi cam kết mang đến những dịch vụ
            chất lượng cao, đáp ứng mọi nhu cầu của khách hàng.
            Với đội ngũ chuyên nghiệp và tận tâm, chúng tôi luôn
            đồng hành cùng bạn trong mọi hành trình.
          </p>
        </div>
        <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747794536/Group_169_1_rdx0ok.png" alt="background" className='background-image' />
      </Box>

      <div style={{ width: "90%" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#063F5C", marginBottom: 4, marginTop: -12 }}
        >
          Dịch vụ đã đặt
        </Typography>
        <CustomTable
          data={fullReservedServicesData}
          columns={defaultColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <div className='button-container' style={{ paddingTop: "30px" }}>
          <Cancelbutton onClick={() => handleNav()} textCancel="Xong" />
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title={'Xác nhận xóa'}
      />

      <EditCTDichVuDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        ctdichvu={{ ...ctdichvuToEdit }}
        title="Chỉnh sửa chi tiết dịch vụ"
      >
        <input autoFocus />
      </EditCTDichVuDialog>
      <div className='selection-container' >
        {services.map((item, index) => (
          <ServiceCard key={index} srv={item} onClick={AddReservedService} />
        ))}
      </div>
    </div>
  );
}

export default DatDichVu;
