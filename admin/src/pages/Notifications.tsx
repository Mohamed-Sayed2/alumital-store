import React from 'react';
import { Check, Mail, Layers, Box, Trash2, CheckCheck, BellOff, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { NotificationItem } from '../types';

interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  loading?: boolean;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  loading = false,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <Mail className="w-5 h-5 text-sky-600" />;
      case 'category_created':
      case 'category_updated':
      case 'category_deleted':
        return <Layers className="w-5 h-5 text-amber-600" />;
      case 'new_product':
      case 'product_updated':
        return <Box className="w-5 h-5 text-emerald-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypePill = (type: string) => {
    switch (type) {
      case 'new_message':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">رسالة تواصل</span>;
      case 'new_product':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">منتج جديد</span>;
      case 'product_updated':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">تحديث منتج</span>;
      case 'category_created':
      case 'category_updated':
      case 'category_deleted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">تصنيف</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">نظام</span>;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">سجل الإشعارات والتنبيهات</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : 'جميع الإشعارات مقروءة'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            icon={<CheckCheck className="w-4 h-4" />}
            onClick={onMarkAllAsRead}
          >
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 font-medium">
          جاري تحميل الإشعارات...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BellOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">لا توجد إشعارات حالياً</h3>
          <p className="text-xs text-slate-500">ستظهر التنبيهات هنا عند إضافة منتجات جديدة أو استلام رسائل تواصل.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && onMarkAsRead(item.id)}
              className={`bg-white rounded-2xl p-5 border shadow-sm transition-all relative flex items-start gap-4 cursor-pointer hover:border-sky-300 ${
                !item.isRead
                  ? 'border-sky-300 bg-sky-50/20 ring-1 ring-sky-500/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Unread indicator vertical bar */}
              {!item.isRead && (
                <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-r-2xl" />
              )}

              {/* Icon Container */}
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 mt-0.5">
                {getNotificationIcon(item.type)}
              </div>

              {/* Notification Content */}
              <div className="flex-1 space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  {getTypePill(item.type)}
                  {!item.isRead && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                <p className="text-[11px] font-medium text-slate-400 pt-1">{formatDate(item.createdAt)}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(item.id);
                    }}
                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                    title="تحديد كمقروء"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNotification(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="حذف الإشعار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
