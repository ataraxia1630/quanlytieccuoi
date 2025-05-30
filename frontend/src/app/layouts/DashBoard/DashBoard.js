
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './DashBoard.css';

export default function DashBoard() {
  return (
    <div className="dashboard-layout">

      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
