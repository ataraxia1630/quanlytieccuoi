import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import PageNotFound from '../layouts/PageNotFound';
import DashBoard from '../layouts/DashBoard'; 


import DatTiecCuoi from '../pages/DatTiecCuoi'; 
import DanhSachTiecCuoi from '../pages/DanhSachTiecCuoi'; 
import DanhSachSanhTiec from '../pages/DanhSachSanhTiec';
import DanhSachMonAn from '../pages/DanhSachMonAn';
import DanhSachDichVu from '../pages/DanhSachDichVu';

import DatSanhTiec from '../pages/DatSanhTiec'; 
import DatMonAn from '../pages/DatMonAn'; 
import DatDichVu from '../pages/DatDichVu'; 
import ThongTinTiecCuoi from '../pages/ThongTinTiecCuoi'; 

import Home from '../pages/Home';

// Thêm console.log ngay sau khi import để debug
console.log('Header =', Header);
console.log(' Home =', Home);
console.log('PageNotFound =', PageNotFound);
console.log('DashBoard =', DashBoard);

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Header />  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Route chứa layout sidebar (DashBoardLayout) */}
        <Route path="/DashBoard" element={<DashBoard />}>
           <Route index element={<DatTiecCuoi />} />
          <Route path="DatTiecCuoi" element={<DatTiecCuoi />} >
            <Route index element={<ThongTinTiecCuoi />} />
            <Route path="ThongTinTiecCuoi" element={<ThongTinTiecCuoi />} />
            <Route path="DatSanhTiec" element={<DatSanhTiec />} />
            <Route path="DatMonAn" element={<DatMonAn />} /> 
            <Route path="DatDichVu" element={<DatDichVu />} /> 
          </Route>
          <Route path="DanhSachTiecCuoi" element={<DanhSachTiecCuoi />} />
          <Route path="DanhSachSanhTiec" element={<DanhSachSanhTiec />} />
          <Route path="DanhSachMonAn" element={<DanhSachMonAn />} /> 
          <Route path="DanhSachDichVu" element={<DanhSachDichVu />} /> 
      </Route>

      </Routes>
       <Footer /> 
    </BrowserRouter>
  );
}



