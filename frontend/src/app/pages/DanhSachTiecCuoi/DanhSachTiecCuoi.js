import React, { useEffect, useState } from 'react';
import './DanhSachTiecCuoi.css';
import CustomTable from '../../components/Customtable';
import Searchbar from '../../components/Searchbar';
import Dropdown from '../../components/Dropdown';
import Rangeinput from '../../components/Rangeinput';
import StatusRadio from '../../components/Statusradio';
import FilterButton from '../../components/Filterbutton';
import { getDanhSach, postDanhSach } from '../../service/danhsachtiec.service';
import { getHoaDon } from '../../service/hoadon.service';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useNavigate } from "react-router-dom";

function DanhSachTiecCuoi() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sanh, setSanh] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tuBan: "",
    denBan: "",
    sanh: "",
    tuNgay: "",
    denNgay: "",
    trangThai: "",
    ten: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDanhSach();
      const dsSanh = result.map(item => item.MaSanh);
      setSanh(dsSanh);
      setData(result);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
  setLoading(true);
  try {
    if (!searchText.trim()) {
      await fetchData(); // Nếu ô tìm kiếm trống, lấy lại danh sách ban đầu
      return;
    }

    const payload = { ten: searchText.trim() };
    const result = await postDanhSach(payload);
    setData(result);
  } catch (error) {
    console.error("Lỗi tìm kiếm:", error);
  } finally {
    setLoading(false);
  }
};


const handleSubmit = async () => {
  setLoading(true);
  try {
    const {
      tuBan,
      denBan,
      sanh,
      tuNgay,
      denNgay,
      trangThai
    } = form;

    const payload = {};

    if (tuBan !== "") payload.tuBan = parseInt(tuBan);
    if (denBan !== "") payload.denBan = parseInt(denBan);
    if (sanh !== "") payload.sanh = sanh;
    if (tuNgay !== "") payload.tuNgay = new Date(tuNgay).toISOString();
    if (denNgay !== "") payload.denNgay = new Date(denNgay).toISOString();
    if (trangThai !== "") payload.trangThai = trangThai;

    const result = await postDanhSach(payload);
    setData(result);
  } catch (error) {
    console.error("Lỗi lọc dữ liệu:", error);
  } finally {
    setLoading(false);
  }
};


  const columns = [
    { id: "index", label: "STT", width: 30 },
    { id: "TenChuRe", label: "Tên chú rể", sortable: true },
    { id: "TenCoDau", label: "Tên cô dâu", sortable: true },
    { id: "MaSanh", label: "Sảnh" },
    { id: "SoLuongBan", label: "Số lượng bàn", sortable: true },
    {
      id: "NgayDaiTiec", label: "Ngày", sortable: true,
      render: (row) => new Date(row.NgayDaiTiec).toISOString().split('T')[0]
    },
    {
      id: "gio", label: "Giờ", sortable: true,
      render: (row) => row.Ca?.GioBatDau || "Không có giờ"
    },
    {
      id: "actions", label: "Thao tác", width: 200,
      render: (row) => (
        <div
          className='action'
          onClick={async () => {
            try {
              const hoaDon = await getHoaDon(row.SoPhieuDatTiec);
              if (hoaDon && hoaDon.length > 0) {
                navigate('/DashBoard/HoaDon', {
                  state: {
                    soHoaDon: hoaDon[0].SoHoaDon,
                    chuRe: row.TenChuRe,
                    coDau: row.TenCoDau,
                    tienCoc: row.TienDatCoc,
                    ngayDaiTiec: row.NgayDaiTiec
                  }
                });
              } else {
                navigate('/DashBoard/HoaDon', {
                  state: {
                    soPhieuDatTiec: row.SoPhieuDatTiec,
                    data: row,
                    chuRe: row.TenChuRe,
                    coDau: row.TenCoDau,
                    tienCoc: row.TienDatCoc,
                    ngayDaiTiec: row.NgayDaiTiec
                  }
                });
              }
            } catch (error) {
              console.error("Lỗi xem hóa đơn:", error);
            }
          }}
        >
          <RemoveRedEyeOutlinedIcon />
          <a style={{ cursor: "pointer" }}>Xem hóa đơn</a>
        </div>
      )
    }
  ];

  const options = [
    { label: "Tất cả", value: "" },
    { label: "Đã huỷ", value: false },
    { label: "Bình thường", value: true },
  ];

  const options1 = sanh.map(MaSanh => ({ label: MaSanh, value: MaSanh }));

  return (
    <div className="danhsachtieccuoi-page">
      <p className='title'>Danh sách tiệc cưới</p>

      <div className='box-search'>
        <Searchbar
          placeholder='Tìm tên cô dâu hoặc chú rể...'
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
            <div className="apply">
              <FilterButton text='Apply' onClick={handleSubmit} />
            </div>
          </div>

          <div className='ban-box'>
            <Rangeinput
              label="Số lượng bàn"
              width={56}
              fromValue={form.tuBan}
              toValue={form.denBan}
              onFromChange={(v) => setForm({ ...form, tuBan: v })}
              onToChange={(v) => setForm({ ...form, denBan: v })}
            />
          </div>

          <div className='ngay-box'>
            <Rangeinput
              label="Ngày"
              width={56}
              fromValue={form.tuNgay}
              toValue={form.denNgay}
              onFromChange={(v) => setForm({ ...form, tuNgay: v })}
              onToChange={(v) => setForm({ ...form, denNgay: v })}
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

      {loading ? (
        <p style={{ padding: 24 }}>Đang tải dữ liệu...</p>
      ) : (
        <CustomTable data={data} columns={columns} />
      )}
    </div>
  );
}

export default DanhSachTiecCuoi;
