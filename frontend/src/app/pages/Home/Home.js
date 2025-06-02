import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  // Khai báo navigate sử dụng hook useNavigate
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome!!! It's homepage</h1>
      {/* Sử dụng navigate khi người dùng click vào nút */}
      <button onClick={() => navigate('/DashBoard')}>Đặt tiệc ngay</button>
    </div>
  );
}
