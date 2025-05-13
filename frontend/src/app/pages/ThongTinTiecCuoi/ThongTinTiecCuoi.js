import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThongTinTiecCuoi.css';

function ThongTinTiecCuoi() {
  const navigate = useNavigate();
  return (
    <div className="thongtintieccuoi-page">
      <h1>ThongTinTiecCuoi Page</h1>
      <button onClick={() => navigate('/DashBoard/DatTiecCuoi/DatSanhTiec')}>Đặt Sảnh Cưới</button>
    </div>
  );
}

export default ThongTinTiecCuoi;
