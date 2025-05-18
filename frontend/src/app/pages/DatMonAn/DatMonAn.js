import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DatMonAn.css';

function DatMonAn() {
  const navigate = useNavigate();
  return (
    <div className="datmonan-page">
      <h1>DatMonAn Page</h1>
      <button onClick={() => navigate('/DashBoard/DatTiecCuoi/DatDichVu')}>Đặt DatDichVu</button>
    </div>
  );
}

export default DatMonAn;
