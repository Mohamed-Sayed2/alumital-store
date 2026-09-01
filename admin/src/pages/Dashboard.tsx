import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft, Box, Layers, Mail, MailWarning, Eye, EyeOff, Bell } from 'lucide-react';
import { Product, Category, ContactRequest, NotificationItem } from '../types';

interface DashboardProps {
  products: Product[];
  categories: Category[];
  contactRequests: ContactRequest[];
  notifications?: NotificationItem[];
  onDeleteProduct?: (id: string) => Promise<void> | void;
  loading?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  categories,
  contactRequests,
  notifications = [],
  onDeleteProduct,
  loading = false,
}) => {
  const recentProducts = products.slice(0, 5);
  const unreadMessagesCount = contactRequests.filter((r) => r.status === 'new').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const visibleCount = products.filter((p) => p.isVisible !== false).length;
  const hiddenCount = products.filter((p) => p.isVisible === false).length;

  const realMetrics = [
    {
      id: '1',
      title: 'إجمالي المنتجات',
      value: products.length,
      change: 'كل المنتجات بالأنظمة',
      isPositive: true,
      icon: Box,
    },
    {
      id: '2',
      title: 'المنتجات الظاهرة للعملاء',
      value: visibleCount,
      change: 'معروضة على الموقع',
      isPositive: true,
      icon: Eye,
    },
    {
      id: '3',
      title: 'المنتجات المخفية',
      value: hiddenCount,
      change: 'مخفية مؤقتاً',
      isPositive: false,
      icon: EyeOff,
    },
    {
      id: '4',
      title: 'الأقسام والتصنيفات',
      value: categories.length,
      change: 'أقسام رئيسية',
      isPositive: true,
      icon: Layers,
    },
    {
      id: '5',
      title: 'إجمالي الرسائل',
      value: contactRequests.length,
      change: 'طلبات استفسارات العملاء',
      isPositive: true,
      icon: Mail,
    },
    {
      id: '6',
      title: 'الرسائل غير المقروءة',
      value: unreadMessagesCount,
      change: unreadMessagesCount > 0 ? 'تتطلب متابعة' : 'لا توجد رسائل جديدة',
      isPositive: unreadMessagesCount === 0,
      icon: MailWarning,
    },
    {
      id: '7',
      title: 'الإشعارات غير المقروءة',
      value: unreadNotificationsCount,
      change: unreadNotificationsCount > 0 ? 'تنبيهات غير مقروءة' : 'كل الإشعارات مقروءة',
      isPositive: unreadNotificationsCount === 0,
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] text-white p-6 md:p-8 shadow-lg">
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-right max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              لوحة تحكم شركة الألوميتال والزجاج
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              إدارة المنتجات، متابعة التصنيفات، واستقبال رسائل واستفسارات العملاء مباشرة من قاعدة البيانات.
            </p>
          </div>
        </div>
      </div>

      {/* Real Stat Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {realMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between"
            >
              <div className="space-y-1 text-right">
                <p className="text-xs font-semibold text-slate-500">{metric.title}</p>
                <h3 className="text-2xl font-black text-slate-900">{loading ? '...' : metric.value}</h3>
                <p className="text-[11px] font-medium text-slate-400">{metric.change}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">أحدث المنتجات المضافة</h3>
          <Link
            to="/products"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>عرض كل المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500">
                <th className="py-3.5 px-4">صورة</th>
                <th className="py-3.5 px-4">اسم المنتج</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">المادة</th>
                <th className="py-3.5 px-4">الظهور</th>
                <th className="py-3.5 px-4">التاريخ</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    جاري تحميل المنتجات...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    لا توجد منتجات مضافة بعد.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link to={`/products/${product.id}`} className="hover:text-sky-600">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">{product.category}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600 max-w-[200px] truncate">{product.material}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        product.isVisible !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {product.isVisible !== false ? '👁 ظاهر' : '🚫 مخفي'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dir-ltr text-right">{product.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {onDeleteProduct && (
                          <button
                            onClick={() => {
                              if (window.confirm(`حذف المنتج "${product.name}"؟`)) {
                                onDeleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
