import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DatSanhTiec.css';

function DatSanhTiec() {
  const navigate = useNavigate();
  return (
    <div className="datsanhtiec-page">
      <h1>DatSanhTiec Page</h1>
      <button onClick={() => navigate('/DashBoard/DatTiecCuoi/DatMonAn')}>Đặt món ăn</button>
    </div>
  );
}

export default DatSanhTiec;
