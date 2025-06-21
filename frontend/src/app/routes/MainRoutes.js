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

import ProtectedRoute from './ProtectedRoute';
import CheckPermissionRoute from './CheckPermissionRoute';

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/signin" element={<Login />} />

        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Route chứa layout sidebar (DashBoardLayout) */}
        <Route
          path="/DashBoard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DatTiecCuoi />} />
          <Route
            path="DatTiecCuoi"
            element={
              <CheckPermissionRoute requiredPermissions={['order.create']}>
                <DatTiecCuoi />
              </CheckPermissionRoute>
            }
          >
            <Route index element={<ThongTinTiecCuoi />} />
            <Route path="ThongTinTiecCuoi" element={<ThongTinTiecCuoi />} />
            <Route path="DatMonAn" element={<DatMonAn />} />
            <Route path="DatDichVu" element={<DatDichVu />} />
          </Route>
          <Route
            path="DanhSachTiecCuoi"
            element={
              <CheckPermissionRoute
                requiredPermissions={['wedding.view', 'wedding.delete']}
              >
                <DanhSachTiecCuoi />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="DanhSachSanhTiec"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'hall.view',
                  'hall.edit',
                  'hall.delete',
                  'hall.create',
                ]}
              >
                <DanhSachSanhTiec />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="HoaDon"
            element={
              <CheckPermissionRoute requiredPermissions={['bill.create']}>
                <HoaDon />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="DanhSachMonAn"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'food.view',
                  'food.edit',
                  'food.delete',
                  'food.create',
                ]}
              >
                <DanhSachMonAn />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="DanhSachDichVu"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'service.view',
                  'service.edit',
                  'service.delete',
                  'service.create',
                ]}
              >
                <DanhSachDichVu />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="DanhSachCa"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'shift.view',
                  'shift.edit',
                  'shift.delete',
                  'shift.create',
                ]}
              >
                <DanhSachCa />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="DanhSachLoaiSanh"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'hallType.view',
                  'hallType.edit',
                  'hallType.delete',
                  'hallType.create',
                ]}
              >
                <DanhSachLoaiSanh />
              </CheckPermissionRoute>
            }
          />

          <Route
            path="BangThamSo"
            element={
              <CheckPermissionRoute
                requiredPermissions={['variable.view', 'variable.edit']}
              >
                <BangThamSo />
              </CheckPermissionRoute>
            }
          />
          <Route
            path="BaoCaoThang"
            element={
              <CheckPermissionRoute requiredPermissions={['report.view']}>
                <BaoCaoThang />
              </CheckPermissionRoute>
            }
          />

          <Route
            path="PhanQuyen"
            element={
              <CheckPermissionRoute
                requiredPermissions={[
                  'account.view',
                  'account.create',
                  'account.edit',
                  'account.delete',
                  'group.view',
                  'group.create',
                  'group.edit',
                  'group.delete',
                ]}
              >
                <PhanQuyen />
              </CheckPermissionRoute>
            }
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
