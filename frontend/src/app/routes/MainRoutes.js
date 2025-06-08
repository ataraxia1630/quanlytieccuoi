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
import DanhSachLoaiSanh from '../pages/DanhSachLoaiSanh';

import BaoCaoThang from '../pages/BaoCaoThang';
import BangThamSo from '../pages/BangThamSo';

import DatMonAn from '../pages/DatMonAn';
import DatDichVu from '../pages/DatDichVu';
import ThongTinTiecCuoi from '../pages/ThongTinTiecCuoi';

import Home from '../pages/Home';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

import 'react-toastify/dist/ReactToastify.css';
import PhanQuyen from '../pages/PhanQuyen';
import Login from '../pages/Login';

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Route chứa layout sidebar (DashBoardLayout) */}
        <Route path="/DashBoard" element={<DashBoard />}>
          <Route index element={<DatTiecCuoi />} />
          <Route path="DatTiecCuoi" element={<DatTiecCuoi />}>
            <Route index element={<ThongTinTiecCuoi />} />
            <Route path="ThongTinTiecCuoi" element={<ThongTinTiecCuoi />} />
            <Route path="DatMonAn" element={<DatMonAn />} />
            <Route path="DatDichVu" element={<DatDichVu />} />
          </Route>
          <Route path="DanhSachTiecCuoi" element={<DanhSachTiecCuoi />} />
          <Route path="DanhSachSanhTiec" element={<DanhSachSanhTiec />} />
          <Route path="HoaDon" element={<HoaDon />} />
          <Route path="DanhSachMonAn" element={<DanhSachMonAn />} />
          <Route path="DanhSachDichVu" element={<DanhSachDichVu />} />
          <Route path="DanhSachCa" element={<DanhSachCa />} />
          <Route path="DanhSachLoaiSanh" element={<DanhSachLoaiSanh />} />

          <Route path="BangThamSo" element={<BangThamSo />} />
          <Route path="BaoCaoThang" element={<BaoCaoThang />} />

          <Route path="PhanQuyen" element={<PhanQuyen />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
