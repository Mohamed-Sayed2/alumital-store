import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  unreadNotificationsCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ unreadNotificationsCount = 3 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-cairo">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pr-64 flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
