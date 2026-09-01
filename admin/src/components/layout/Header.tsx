import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { api } from '../../services/api';

interface HeaderProps {
  onOpenSidebar: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  unreadNotificationsCount = 0,
}) => {
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') {
      return { title: 'الرئيسية', crumbs: ['الرئيسية', 'لوحة التحكم', 'الأخوة'] };
    }
    if (path.startsWith('/products/new')) {
      return { title: 'إضافة منتج جديد', crumbs: ['إضافة جديد', 'المنتجات', 'الأخوة'] };
    }
    if (path.startsWith('/products/') && path !== '/products') {
      return { title: 'تفاصيل المنتج', crumbs: ['تفاصيل المنتج', 'المنتجات', 'الأخوة'] };
    }
    if (path === '/products') {
      return { title: 'إدارة المنتجات', crumbs: ['عرض الكل', 'المنتجات', 'الأخوة'] };
    }
    if (path === '/categories') {
      return { title: 'إدارة التصنيفات', crumbs: ['كل الفئات', 'التصنيفات', 'الأخوة'] };
    }
    if (path === '/contact-requests') {
      return { title: 'طلبات التواصل', crumbs: ['طلبات التواصل', 'لوحة التحكم', 'الأخوة'] };
    }
    if (path === '/notifications') {
      return { title: 'الإشعارات', crumbs: ['الإشعارات', 'لوحة التحكم', 'الأخوة'] };
    }
    if (path === '/settings') {
      return { title: 'الإعدادات', crumbs: ['الإعدادات', 'لوحة التحكم', 'الأخوة'] };
    }
    return { title: 'لوحة التحكم', crumbs: ['الرئيسية', 'لوحة التحكم', 'الأخوة'] };
  };

  const { title, crumbs } = getBreadcrumb();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Right side (Breadcrumbs & Title) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-0.5">
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300">/</span>}
                <span className={idx === 0 ? 'text-sky-600 font-semibold' : ''}>{crumb}</span>
              </React.Fragment>
            ))}
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-none">{title}</h2>
        </div>
      </div>

      {/* Left side (Search, Notifications, Profile, Logout) */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Search bar */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <input
            type="text"
            placeholder="بحث في لوحة التحكم..."
            className="w-full pl-3 pr-9 py-2 text-xs rounded-full bg-slate-100 border border-transparent focus:border-sky-500 focus:bg-white focus:outline-none transition-all placeholder-slate-400 text-slate-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        {/* Notifications Icon Button */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          title="الإشعارات"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
            </span>
          )}
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-r border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80"
            alt="المدير العام"
            className="w-9 h-9 rounded-full object-cover border-2 border-sky-500 shadow-sm"
          />
          <div className="hidden sm:block text-right">
            <h4 className="text-xs font-bold text-slate-900 leading-snug">مدير النظام</h4>
            <p className="text-[10px] text-slate-500 font-medium">المدير العام</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => api.logout()}
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
