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



function DatMonAn() {
  const [foods, setfoods] = useState([]);
  const [reservedFoods, setReservedFoods] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPDT, setCurrentPDT] = useState(null)
  const { handleNav } = useContext(StepContext);
  const [ctdatbanToEdit, setCtdatbanToEdit] = useState(null);
  const [tenMonAnToEdit, SetTenMonAnToEdit] = useState("")
  // Mock data
  const mockItems = useMemo(() => [
    {
      "MaMonAn": "DV001",
      "TenMonAn": "Thịt heo",
      "DonGia": 10000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA001",
      "TenMonAn": "Thịt heo",
      "DonGia": 10000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA002",
      "TenMonAn": "cua hấp bia",
      "DonGia": 300000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA003",
      "TenMonAn": "cua hoàng đế",
      "DonGia": 4000000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MA007",
      "TenMonAn": "Salad",
      "DonGia": 100000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MONAN00001",
      "TenMonAn": "Salad hoàng đế",
      "DonGia": 1500000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MONAN00002",
      "TenMonAn": "Gà súp nấm hương",
      "DonGia": 90000.0,
      "HinhAnh": "https://res.cloudinary.com/digpe9tmq/image/upload/v1747506883/xgtffkd0onsoolzthixp.png",
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MONAN00003",
      "TenMonAn": "Bê om sâm, nấm đông cô (kèm bánh mỳ)",
      "DonGia": 210000.0,
      "HinhAnh": "https://res.cloudinary.com/digpe9tmq/image/upload/v1747506677/oxxd53zg4suure6om4lj.png",
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MONAN00005",
      "TenMonAn": "Cá quả chiên sốt Thái",
      "DonGia": 120000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "MONAN00006",
      "TenMonAn": "Gà đông tảo rút xương xốt nấm",
      "DonGia": 1500000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "TEST01",
      "TenMonAn": "Cơm tấm test",
      "DonGia": 50000.0,
      "HinhAnh": null,
      "TrangThai": "AVAILABLE"
    },
    {
      "MaMonAn": "TEST02",
      "TenMonAn": "Cơm tấm test",
      "DonGia": 50000.0,
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

      const temp = reservedFoods.map(item =>
        item.MaMonAn === MaMonAn && item.SoPhieuDatTiec === currentPDT ? { ...item, ...data } : item
      );

      setReservedFoods(temp);
    } catch (err) {
      console.error("lỗi khi cập nhật chi tiết đặt bàn:", err);
    }
  }, [currentPDT, reservedFoods]);

  // AddReservedFood dùng currentPDT, reservedFoods và updateReservedFood
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

      setReservedFoods((preData) => [...preData, data]);
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
        ctDatBanService.update(currentPDT, MaMonAn),
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

  // Cập nhật tenMonAnToEdit khi ctdatbanToEdit hoặc foods thay đổi
  useEffect(() => {
    if (!ctdatbanToEdit) {
      SetTenMonAnToEdit("");
      return;
    }
    let tenMonAn = foods.find((item) => item.MaMonAn === ctdatbanToEdit.MaMonAn);
    if (!tenMonAn) tenMonAn = "";
    SetTenMonAnToEdit(tenMonAn);
  }, [ctdatbanToEdit, foods]);

  // Gọi fetchReservedFoods mỗi khi currentPDT hoặc fetchReservedFoods thay đổi
  useEffect(() => {
    if (currentPDT) {
      fetchReservedFoods();
    }
  }, [currentPDT, fetchReservedFoods]);


  const handleEdit = (data) => {
    setOpenDialog(true);
    setCtdatbanToEdit(data);
  };
  const handleSave = (data) => {
    updateReservedFood(data)
  };
  const handleDelete = (data) => {
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
      <CustomTable
        data={reservedFoods}
        columns={defaultColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditCTDatBanDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        ctdatban={{ ...ctdatbanToEdit, TenMonAn: tenMonAnToEdit }}
        title="Chỉnh sửa chi tiết đặt món"
      />
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
