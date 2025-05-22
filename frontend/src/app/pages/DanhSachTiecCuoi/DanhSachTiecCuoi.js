import React, { useEffect, useState } from 'react';
import './DanhSachTiecCuoi.css';
import '../../components/Customtable'
import CustomTable from '../../components/Customtable';
import DialogButton from '../../components/Dialogbutton';
import DialogTitlecustom from '../../components/Dialogtitlecustom';
import StatusRadio from '../../components/Statusradio';
import { Button } from '@mui/material';
import Searchbar from '../../components/Searchbar'
import FormTextField from '../../components/Formtextfield';
import Rangeinput from '../../components/Rangeinput'
import Dropdown from '../../components/Dropdown';
import FilterButton from '../../components/Filterbutton';
import { getDanhSach } from '../../service/danhsachtiec.service';
import { getHoaDon } from '../../service/hoadon.service';
import SaveAndPrintButton from '../../components/Saveandprintbutton';
import { postDanhSach } from '../../service/danhsachtiec.service';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import { Link, Navigate, Outlet } from 'react-router-dom';
import './DanhSachTiecCuoi.css'
import { useNavigate } from "react-router-dom";



function DanhSachTiecCuoi() {
  const navigate = useNavigate();
  const [data, setData] = useState([])
  const [sanh, setSanh] = useState([]);
  const [form, setForm] = useState({
    tuBan: "",
    denBan: "",
    sanh: "",
    tuNgay: "",
    denNgay: "",
    trangThai: "",
    ten: ""
  });
   const [searchText, setSearchText] = useState('');

  const handleSearch = async (keyword) => {
   // console.log("Đang tìm:", keyword);
    // Gọi API hoặc filter danh sách bài viết ở đây
    form.ten = searchText;
    // console.log("form la: " + form.ten);
    // console.log("ten la: " + searchText);
    try {
    const cleanForm = Object.fromEntries(
    Object.entries(form).filter(([_, value]) => value !== "" && value !== null && value !== undefined));
    const result = await postDanhSach(cleanForm);
    setData(result);
    form.ten = ""
    console.log(cleanForm);
  } catch (error) {
    console.error("Lỗi gửi form:", error);
  }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDanhSach(); 
        //tam thoi 
        const dsSanh = result.map(item => item.MaSanh)
        setSanh(dsSanh)
        setData(result);   
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);  

 const handleSubmit = async () => {
  try {
    const cleanForm = Object.fromEntries(
  Object.entries(form).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
);


    const result = await postDanhSach(cleanForm);
    setData(result);
    console.log(cleanForm);
  } catch (error) {
    console.error("Lỗi gửi form:", error);
  }
};


  const columns = [
    { id: "index", label: "STT", width: 30 },
    { id: "TenChuRe", label: "Tên chú rể", sortable: true },
    { id: "TenCoDau", label: "Tên cô dâu", sortable: true },
    { id: "MaSanh", label: "Sảnh"},
    { id: "SoLuongBan", label: "Số lượng bàn", sortable: true },
    { id: "NgayDaiTiec", label: "Ngày", sortable: true, render: (row) => {
      // Chuyển đổi NgayDaiTiec sang định dạng yyyy-mm-dd
      const date = new Date(row.NgayDaiTiec);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`; // Trả về ngày theo định dạng yyyy-mm-dd
    }
  },
    { id: "gio", label: "Giờ", sortable: true, render: (row) => {
      // Lấy giờ từ đối tượng Ca
      if (row.Ca && row.Ca.GioBatDau) {
        return row.Ca.GioBatDau; 
      }
      return "Không có giờ"; 
    }
  },
    {
      id: "actions",
      label: "Thao tác",
      width: 200,
      render: (row, onEdit, onDelete) => (
        <div >
          <div className='action' onClick={async () => {
        try {
    const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
    console.log("hi")

    if(hoaDon) {
      console.log("hi1 vao xem hoa don")
      console.log(row.TenCoDau)
      navigate('/DashBoard/HoaDon', {
      state: { soHoaDon: hoaDon[0].SoHoaDon,
        chuRe: row.TenChuRe,
        coDau: row.TenCoDau,
        tienCoc: row.TienDatCoc,
        ngayDaiTiec: row.NgayDaiTiec
      }
    });
    }
    else {
      console.log("hi2 tao hoa don")

      navigate('/DashBoard/HoaDon', {
      state: { soPhieuDatTiec: row.SoPhieuDatTiec, data: row,
        chuRe: row.TenChuRe,
        coDau: row.TenCoDau,
        tienCoc: row.TienDatCoc,
        ngayDaiTiec: row.NgayDaiTiec

       }
    });
    }
  } catch (error) {
    // Nếu chưa có hóa đơn → truyền soPhieuDatTiec để tạo mới
    console.error(error)
    
  }
      }}>
        <RemoveRedEyeOutlinedIcon />
        <a style={{ cursor: "pointer" }}>Xem hóa đơn</a>
      </div>
        </div>
          
      ),
    },
  ];

  const options = [
    { label: "Tất cả", value: "" },
    { label: "Đã huỷ", value: false },
    { label: "Bình thường", value: true },
  ]
const options1 = sanh.map(MaSanh => ({
          label: MaSanh,
          value: MaSanh
        }))
  return (
    <div className="danhsachtieccuoi-page">
      <p className='title'>Danh sách tiệc cưới</p>
      <div className='box-search'>
        <Searchbar placeholder='Tim ten co dau hoac chu re...' 
        value={searchText}
        onChange={setSearchText}
        onSearch={handleSearch}
        /> 
      </div>


      <div className='box'>
        <div className='content'>
        <div className='sanh-box'>
        <Dropdown
          className="sanh"
          label="Sảnh"
          onChange={(value) => setForm({ ...form, sanh: value })}
          width={150}
          options={options1}
        />
        <div className="apply" >
         <FilterButton text='Apply' onClick={handleSubmit}/>
        </div>

        </div>
        
        <div className='ban-box'>
         <Rangeinput label="Số lượng bàn" width={56} 
          fromValue={form.tuBan} 
          toValue={form.denBan}
          onFromChange={(v)=>setForm({...form, tuBan: v})}
          onToChange={(v)=>setForm({...form, denBan: v})}
          />
        </div>

        <div className='ngay-box'>
          <Rangeinput label = "Ngày" width={56} 
          fromValue={form.tuNgay} 
          toValue={form.denNgay}
          onFromChange={(v)=>setForm({...form, tuNgay: v})}
          onToChange={(v)=>setForm({...form, denNgay: v})}
          />
        </div>
        <StatusRadio
            label="Tình trạng"
            value={form.trangThai}
            onChange={(val) => setForm({ ...form, trangThai: val })}
            options={options}
        />
        </div>
        
      </div>
     
      <CustomTable data={data} columns={columns}/>
      <div style={{ padding: 24 }}>
      
    </div>
    </div>
  );
}

export default DanhSachTiecCuoi;
