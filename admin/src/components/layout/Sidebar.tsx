import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  Mail,
  Settings,
  Bell,
  Building,
  X,
  LogOut,
} from 'lucide-react';
import { api } from '../../services/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'الرئيسية', path: '/', icon: LayoutDashboard },
    { label: 'المنتجات', path: '/products', icon: Box },
    { label: 'التصنيفات', path: '/categories', icon: Layers },
    { label: 'طلبات التواصل', path: '/contact-requests', icon: Mail },
    { label: 'الإشعارات', path: '/notifications', icon: Bell },
    { label: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-64 bg-[#0f172a] text-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand logo header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide leading-tight">ألوميتال</h1>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                STORE & ADMIN PANEL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0084c7] text-white shadow-md shadow-sky-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout & Footer info */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            onClick={() => api.logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
          <p className="text-[11px] text-slate-500 font-medium text-center">لوحة التحكم v1.0</p>
        </div>
      </aside>
    </>
  );
};
