
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../../components/Sidebar';
import './DashBoard.css';

export default function DashBoard() {
  return (
    <div className="dashboard-layout">

      <div className="dashboard-main">
        <Sidebar />

        <main className="dashboard-content">
          <Header />
          <Outlet />
          <Footer />
        </main>

      </div>

    </div>
  );
}
