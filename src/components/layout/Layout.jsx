import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
