import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '../layouts/Header';
import PageNotFound from '../layouts/PageNotFound';
import Home from '../pages/Home';

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
