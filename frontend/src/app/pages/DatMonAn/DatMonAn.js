import './DatMonAn.css';
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { StepContext } from '../DatTiecCuoi/DatTiecCuoi';
import Cancelbutton from '../../components/Cancelbutton';
import FoodCard from '../../components/FoodCard';
import ctDatBanService from '../../service/ct_datban.service';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultColumns from '../../components/ct_datban/ct_datban_default_column';
import EditCTDatBanDialog from '../../components/ct_datban/ct_datban_edit_dialog';
import CustomTable from "../../components/Customtable";
import { Typography } from '@mui/material';



function DatMonAn() {
  const [foods, setfoods] = useState([]);
  const [reservedFoods, setReservedFoods] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPDT, setCurrentPDT] = useState(null)
  const { handleNav } = useContext(StepContext);
  const [ctdatbanToEdit, setCtdatbanToEdit] = useState(null);

  // Mock data
  const mockItems = useMemo(() => [
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



  // fetchReservedFoods phụ thuộc currentPDT
  const fetchReservedFoods = useCallback(async () => {
    if (!currentPDT || currentPDT === "") {
      console.error("không lấy được phiếu đặt tiệc hiện tại");
      return;
    }
    await toast.promise(
      ctDatBanService.getAllByPhieuDatTiecId(currentPDT),
      {
        loading: "Đang xử lý...",
        success: "Tải dữ liệu thành công!",
        error: (err) => "Lỗi: " + err.message,
      }
    ).then((data) => setReservedFoods(data)); // set dữ liệu nếu thành công
  }, [currentPDT]);

  // updateReservedFood dùng currentPDT và reservedFoods (phải để reservedFoods vì nó dùng trong map)
  const updateReservedFood = useCallback(async ({ MaMonAn, SoLuong, DonGia, GhiChu }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await toast.promise(
        ctDatBanService.update(currentPDT, MaMonAn, {
          SoLuong,
          DonGia,
          GhiChu,
        }),
        {
          loading: "Đang xử lý...",
          success: "cập nhật thông tin đặt món thành công!",
          error: (err) => "Lỗi: " + err.message,
        }
      );
      console.log("return data: ", data)
      const temp = reservedFoods.map(item =>
        item.MaMonAn === MaMonAn && item.SoPhieuDatTiec === currentPDT ? { ...item, ...data.data } : item
      );

      setReservedFoods(temp);
    } catch (err) {
      console.error("lỗi khi cập nhật chi tiết đặt bàn:", err);
    }
  }, [currentPDT, reservedFoods]);

  // AddReservedFood dùng currentPDT, reservedFoods và updateReservedFood
  const AddReservedFood = useCallback(async ({ MaMonAn, SoLuong, DonGia, GhiChu }) => {
    try {
      console.log("current pdt:", currentPDT)
      console.log("CTDB", {
        MaMonAn,
        SoPhieuDatTiec: currentPDT,
        SoLuong,
        DonGia,
        GhiChu,
      })
      const exists = reservedFoods.some(item => item.MaMonAn === MaMonAn);
      if (exists) {
        updateReservedFood({ MaMonAn, SoLuong, DonGia, GhiChu });
        return;
      }

      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      const data = await toast.promise(
        ctDatBanService.create({
          MaMonAn,
          SoPhieuDatTiec: currentPDT,
          SoLuong,
          DonGia,
          GhiChu,
        }),
        {
          loading: "Đang xử lý...",
          success: "Đặt món ăn thành công!",
          error: (err) => "Lỗi: " + err.message,
        }
      );

      setReservedFoods((preData) => [...preData, data.data]);
      console.log("ctdatban", reservedFoods);
    } catch (err) {
      console.error("lỗi khi thêm chi tiết đặt bàn:", err);
    }
  }, [currentPDT, reservedFoods, updateReservedFood]);

  // RemoveReservedFood dùng currentPDT và reservedFoods
  const RemoveReservedFood = useCallback(async ({ MaMonAn }) => {
    try {
      if (!currentPDT || currentPDT === "") {
        console.error("không lấy được phiếu đặt tiệc hiện tại");
        return;
      }
      await toast.promise(
        ctDatBanService.remove(currentPDT, MaMonAn),
        {
          loading: "Đang xử lý...",
          success: "xóa thông tin đặt món thành công!",
          error: (err) => "Lỗi: " + err.message,
        }
      );
      const temp = reservedFoods.filter(item => !(item.MaMonAn === MaMonAn && item.SoPhieuDatTiec === currentPDT));
      setReservedFoods(temp);
    } catch (err) {
      console.error("lỗi khi xóa chi tiết đặt bàn:", err);
    }
  }, [currentPDT, reservedFoods]);



  //hook useEffect 
  // setfoods khi mockItems thay đổi
  useEffect(() => {
    setfoods(mockItems);
  }, [mockItems]);

  // Lấy currentPDT từ localStorage chỉ 1 lần
  useEffect(() => {
    const pdt = localStorage.getItem("currentPDT");
    if (!pdt || pdt === "") {
      console.error("không lấy được phiếu đặt tiệc hiện tại");
    } else {
      setCurrentPDT(pdt);
    }
  }, []);


  // Gọi fetchReservedFoods mỗi khi currentPDT hoặc fetchReservedFoods thay đổi
  useEffect(() => {
    if (currentPDT) {
      console.log("current: ", currentPDT)
      fetchReservedFoods();
    }
  }, [currentPDT, fetchReservedFoods]);
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
    updateReservedFood(data)
  };
  const handleDelete = async (data) => {
    RemoveReservedFood(data)
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCtdatbanToEdit(null);
  }



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
      </div>


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
      <div className='button-container'>
        <Cancelbutton onClick={() => handleNav()} textCancel="Tiếp tục" />
      </div>
    </div>
  );
}

export default DatMonAn;
