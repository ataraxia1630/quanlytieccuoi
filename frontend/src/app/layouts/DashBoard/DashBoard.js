
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
        <h1>chào mừng đến với dashboard</h1>
          <Outlet />
        </main>
      </div>  
    </div>
  );
}
