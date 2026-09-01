import React, { useState } from 'react';
import { CheckCircle2, Trash2, Eye } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ContactRequest } from '../types';

interface ContactRequestsProps {
  requests: ContactRequest[];
  onMarkAsRead?: (id: string) => Promise<void> | void;
  onDeleteRequest: (id: string) => Promise<void> | void;
  loading?: boolean;
}

export const ContactRequests: React.FC<ContactRequestsProps> = ({
  requests,
  onMarkAsRead,
  onDeleteRequest,
  loading = false,
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactRequest | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === 'new') return req.status === 'new';
    if (statusFilter === 'replied') return req.status === 'replied';
    return true;
  });

  const handleOpenMsg = async (req: ContactRequest) => {
    setSelectedMsg(req);
    if (req.status === 'new' && onMarkAsRead) {
      await onMarkAsRead(req.id);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`هل أنت تأكد من حذف رسالة العميل "${name}"؟`)) {
      await onDeleteRequest(id);
      if (selectedMsg?.id === id) {
        setSelectedMsg(null);
      }
    }
  };

  const unreadCount = requests.filter((r) => r.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Top filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            طلبات التواصل الواردة: {requests.length} (الرسائل غير المقروءة: <strong className="text-sky-600 font-bold">{unreadCount}</strong>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="all">جميع الرسائل</option>
            <option value="new">الرسائل الجديدة (غير مقروءة)</option>
            <option value="replied">الرسائل المقروءة</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500">
                <th className="py-3.5 px-4">اسم العميل</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4">المدينة / المحافظة</th>
                <th className="py-3.5 px-4">محتوى الرسالة</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4">التاريخ</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    جاري تحميل الرسائل...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    لا توجد رسائل تواصل حالياً.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const isUnread = req.status === 'new';
                  return (
                    <tr
                      key={req.id}
                      className={`transition-colors ${
                        isUnread ? 'bg-sky-50/40 font-bold text-slate-900' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isUnread && <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />}
                          <span>{req.clientName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 dir-ltr text-right">
                        {req.phone}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {req.email /* Stores city */}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {req.message}
                      </td>
                      <td className="py-3.5 px-4">
                        {isUnread ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                            جديدة (غير مقروءة)
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            تمت القراءة
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 dir-ltr text-right">{req.date}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenMsg(req)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                            title="قراءة التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isUnread && onMarkAsRead && (
                            <button
                              onClick={() => onMarkAsRead(req.id)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="تعيين كمقروء"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(req.id, req.clientName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="حذف الرسالة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>إجمالي الرسائل المعروضة: {filteredRequests.length}</span>
        </div>
      </div>

      {/* Message Details Modal */}
      <Modal
        isOpen={!!selectedMsg}
        onClose={() => setSelectedMsg(null)}
        title="تفاصيل رسالة العميل"
      >
        {selectedMsg && (
          <div className="space-y-4 text-right">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">اسم العميل:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedMsg.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">رقم الهاتف:</span>
                <span className="font-bold text-slate-900 dir-ltr text-right inline-block">{selectedMsg.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">المدينة / المحافظة:</span>
                <span className="font-bold text-slate-900">{selectedMsg.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">التاريخ:</span>
                <span className="font-bold text-slate-900 dir-ltr text-right inline-block">{selectedMsg.date}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">محتوى الرسالة:</h4>
              <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedMsg.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => handleDelete(selectedMsg.id, selectedMsg.clientName)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الرسالة</span>
              </button>

              <button
                onClick={() => setSelectedMsg(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
