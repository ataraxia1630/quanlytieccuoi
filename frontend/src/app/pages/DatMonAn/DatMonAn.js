import './DatMonAn.css';
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import Cancelbutton from '../../components/Cancelbutton';
import FoodCard from '../../components/FoodCard';
import ctDatBanService from '../../service/ct_datban.service';
import MonAnService from '../../service/monan.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultColumns from '../../components/ct_datban/ct_datban_default_column';
import EditCTDatBanDialog from '../../components/ct_datban/ct_datban_edit_dialog';
import CustomTable from "../../components/Customtable";
import { Typography } from '@mui/material';
import DeleteDialog from '../../components/Deletedialog';
import { set } from 'date-fns';




function DatMonAn() {
  const [foods, setFoods] = useState([]);
  const [reservedFoods, setReservedFoods] = useState([]);
  const { handleNav } = useContext(StepContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPDT, setCurrentPDT] = useState(null)
  const [ctdatbanToEdit, setCtdatbanToEdit] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Mock data
  const mockItems = useMemo(() => [
    {
      "MaMonAn": "MA001", // Loại bỏ khoảng trắng
      "TenMonAn": "Thịtsáasdsa  heo",
      "DonGia": 10000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA001", // Loại bỏ khoảng trắng
      "TenMonAn": "Thịt heo",
      "DonGia": 10000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA001", // Loại bỏ khoảng trắng
      "TenMonAn": "Thịt heo",
      "DonGia": 10000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA002", // Giữ lại một mục duy nhất cho MA002
      "TenMonAn": "Cua hấp bia",
      "DonGia": 300000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA003",
      "TenMonAn": "Cua hoàng đế",
      "DonGia": 4000000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    }
  ], []);


  // fetch data món ăn từ db
  const fetchValidFoods = useCallback(async () => {
    try {
      const data = await MonAnService.getAvailableMonAn();
      setFoods(data.data); // set dữ liệu nếu thành công
    } catch (error) {
      toast.error(error.message || "lỗi khi tải món ăn");
    }
  }, []);

  // fetch data chi tiêt đặt bàntừ db
  const fetchReservedFoods = useCallback(async () => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await ctDatBanService.getAllByPhieuDatTiecId(currentPDT);
      setReservedFoods(data); // set dữ liệu nếu thành công
    } catch (error) {
      toast.error(error.message || "lỗi khi tải chi tiết đặt bàn");
    }
  }, [currentPDT]);

  // cập nhật chi tiết đặt bàn
  const updateReservedFood = useCallback(async ({ MaMonAn, SoLuong, DonGia, GhiChu }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }

      const data = await ctDatBanService.update(currentPDT, MaMonAn, {
        SoLuong,
        DonGia,
        GhiChu,
      });
      const temp = reservedFoods.map(item =>
        item.MaMonAn === MaMonAn && item.SoPhieuDatTiec === currentPDT ? { ...item, ...data.data } : item
      );
      setReservedFoods(temp);
      toast.success("cập nhật chi tiết đặt món thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi cập nhật chi tiết đặt bàn");
    }
  }, [currentPDT, reservedFoods]);

  // thêm/cập nhật chi đặt bàn tiêc vào bảng thông tin
  const AddReservedFood = useCallback(async ({ MaMonAn, SoLuong, DonGia, GhiChu }) => {
    try {
      const exists = reservedFoods.some(item => item.MaMonAn === MaMonAn);
      if (exists) {
        updateReservedFood({ MaMonAn, SoLuong, DonGia, GhiChu });
        return;
      }

      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await ctDatBanService.create({
        MaMonAn,
        SoPhieuDatTiec: currentPDT,
        SoLuong,
        DonGia,
        GhiChu,
      });

      setReservedFoods((preData) => [...preData, data.data]);
      toast.success("Đặt món thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi thêm chi tiết đặt bàn");
    }
  }, [currentPDT, reservedFoods, updateReservedFood]);

  // xóa chi tiết đặt bàn
  const RemoveReservedFood = useCallback(async ({ MaMonAn }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      await ctDatBanService.remove(currentPDT, MaMonAn);
      const temp = reservedFoods.filter(item => !(item.MaMonAn === MaMonAn && item.SoPhieuDatTiec === currentPDT));
      setReservedFoods(temp);
      toast.success("xóa chi tiết đặt món thành công!")
    } catch (err) {
      toast.error(err.message || "lỗi khi xóa chi tiết đặt bàn");
    }
  }, [currentPDT, reservedFoods]);



  //hook useEffect 

  // Lấy currentPDT từ localStorage 
  useEffect(() => {
    const pdt = localStorage.getItem("currentPDT");

    if (pdt === "null") {
      console.error("không lấy được phiếu đặt tiệc hiện tại");
      handleNav(0)
      return;
    } else {
      setCurrentPDT(pdt);
    }
  }, [handleNav]);

  // useEffect(() => {
  //   setFoods(mockItems)
  // }, [])

  // Gọi fetchReservedFoods mỗi khi currentPDT hoặc fetchReservedFoods thay đổi
  useEffect(() => {
    if (currentPDT) {
      console.log("current: ", currentPDT)
      fetchReservedFoods();
    }
    console.log("currrrr: ", currentPDT)
  }, [currentPDT, fetchReservedFoods]);

  // Gọi fetchValidFoods lây dữ liệu món ăn
  useEffect(() => {

    fetchValidFoods();

  }, [fetchValidFoods]);

  const fullReservedFoodsData = useMemo(() => {
    console.log("ctdatban: ", reservedFoods);
    console.log("monan: ", foods);
    return reservedFoods.map((reserv) => {
      const foodItem = foods.find((item) => item.MaMonAn === reserv.MaMonAn);
      console.log("fullReservedFoodsData: ", foodItem ? foodItem.TenMonAn : 'Không xác định');
      return {
        ...reserv,
        TenMonAn: (foodItem ? foodItem.TenMonAn : 'Không xác định'), // Giá trị mặc định nếu không tìm thấy
      };

    });
  }, [reservedFoods, foods]);



  const handleEdit = (data) => {
    setOpenDialog(true);
    setCtdatbanToEdit(data);
  };
  const handleSave = async (data) => {
    setOpenDialog(false)
    await updateReservedFood(data);
    setCtdatbanToEdit(null);
  };
  const handleDelete = async (data) => {
    setIsDeleteDialogOpen(true);
    setCtdatbanToEdit(data);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCtdatbanToEdit(null);
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCtdatbanToEdit(null);
    toast.info('Đã hủy xóa chi tiết đặt món');
  };

  const acceptDelete = async () => {
    setIsDeleteDialogOpen(false);
    RemoveReservedFood(ctdatbanToEdit);
    setCtdatbanToEdit(null);
  };

  return (
    <div className="page">
      <ToastContainer />
      <img src="https://res.cloudinary.com/digpe9tmq/image/upload/v1747755620/Frame_104_zhrlod.png" alt="background" className='background-images' />

      <div style={{ width: "90%" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#063F5C", marginBottom: 4, marginTop: -12 }}
        >
          Các món đã đặt
        </Typography>
        <CustomTable
          data={fullReservedFoodsData}
          columns={defaultColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <div className='button-container' style={{ paddingTop: "30px" }}>
          <Cancelbutton onClick={() => handleNav()} textCancel="Tiếp tục" />
        </div>
      </div>
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={acceptDelete}
        title={'Xác nhận xóa'}
      />

      <EditCTDatBanDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        ctdatban={{ ...ctdatbanToEdit }}
        title="Chỉnh sửa chi tiết đặt món"
      >
        <input autoFocus />
      </EditCTDatBanDialog>
      <div className='selection-container' >
        {foods.map((item, index) => (
          <FoodCard key={index} food={item} onClick={AddReservedFood} />
        ))}
      </div>
    </div>
  );
}

export default DatMonAn;
