import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageNotFound from '../layouts/PageNotFound';
import DashBoard from '../layouts/DashBoard';


import DatTiecCuoi from '../pages/DatTiecCuoi'; 
import DanhSachTiecCuoi from '../pages/DanhSachTiecCuoi'; 
import HoaDon from '../pages/HoaDon/HoaDon';
import DanhSachSanhTiec from '../pages/DanhSachSanhTiec';
import DanhSachMonAn from '../pages/DanhSachMonAn';
import DanhSachDichVu from '../pages/DanhSachDichVu';
import DanhSachCa from '../pages/DanhSachCa';

import DatSanhTiec from '../pages/DatSanhTiec';
import DatMonAn from '../pages/DatMonAn';
import DatDichVu from '../pages/DatDichVu';
import ThongTinTiecCuoi from '../pages/ThongTinTiecCuoi';

import Home from '../pages/Home';



export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Route chứa layout sidebar (DashBoardLayout) */}
        <Route path="/DashBoard" element={<DashBoard />}>
          <Route path="DatTiecCuoi" element={<DatTiecCuoi />} >
            <Route path="ThongTinTiecCuoi" element={<ThongTinTiecCuoi />} />
            <Route path="DatSanhTiec" element={<DatSanhTiec />} />
            <Route path="DatMonAn" element={<DatMonAn />} />
            <Route path="DatDichVu" element={<DatDichVu />} />
          </Route>
          <Route path="DanhSachTiecCuoi" element={<DanhSachTiecCuoi />} />
          <Route path="DanhSachSanhTiec" element={<DanhSachSanhTiec />} />
          <Route path="HoaDon" element={<HoaDon /> }/>
          <Route path="DanhSachMonAn" element={<DanhSachMonAn />} /> 
          <Route path="DanhSachDichVu" element={<DanhSachDichVu />} /> 
          <Route path="DanhSachCa" element={<DanhSachCa />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}



