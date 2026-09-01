import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Building2,
  DoorClosed,
  LayoutGrid,
  Columns,
  Grid,
  Layout,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onAddCategory: (category: Category) => Promise<void> | void;
  onUpdateCategory?: (id: string, name: string) => Promise<void> | void;
  onDeleteCategory: (id: string) => Promise<void> | void;
  loading?: boolean;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  loading = false,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [conflictModalMsg, setConflictModalMsg] = useState<string | null>(null);

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-sky-600" />;
      case 'DoorClosed':
        return <DoorClosed className="w-5 h-5 text-sky-600" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-5 h-5 text-sky-600" />;
      case 'Columns':
        return <Columns className="w-5 h-5 text-sky-600" />;
      case 'Grid':
        return <Grid className="w-5 h-5 text-sky-600" />;
      case 'Layout':
      default:
        return <Layout className="w-5 h-5 text-sky-600" />;
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setErrorMsg(null);

    try {
      await onAddCategory({
        id: Date.now().toString(),
        name: name.trim(),
        productCount: 0,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        iconName: 'LayoutGrid',
      });
      setName('');
      setIsAddModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إضافة التصنيف');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;
    setErrorMsg(null);

    try {
      if (onUpdateCategory) {
        await onUpdateCategory(editingCategory.id, editName.trim());
      }
      setEditingCategory(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تعديل التصنيف');
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    try {
      await onDeleteCategory(id);
    } catch (err: any) {
      // Check for HTTP 409 conflict
      const msg = err.message || '';
      if (msg.includes('409') || msg.includes('contains existing products') || msg.includes('يحتوي')) {
        setConflictModalMsg('لا يمكن حذف هذا التصنيف لأنه يحتوي على منتجات مرتبطة به. يرجى حذف أو نقل المنتجات أولاً.');
      } else {
        setErrorMsg(msg || 'حدث خطأ أثناء حذف التصنيف');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if Error */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">×</button>
        </div>
      )}

      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            إجمالي التصنيفات الإنشائية: {categories.length} تصنيفات رئيسية
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setErrorMsg(null);
            setIsAddModalOpen(true);
          }}
        >
          إضافة تصنيف جديد
        </Button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold">
          جاري تحميل التصنيفات...
        </div>
      ) : categories.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
          <p className="text-slate-500 font-bold">لا توجد تصنيفات حالياً</p>
          <p className="text-xs text-slate-400">اضغط على زر "إضافة تصنيف جديد" لإنشاء أول قسم</p>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-200"
            >
              {/* Category Image */}
              <div className="h-44 overflow-hidden relative bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Details */}
              <div className="p-5 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-extrabold text-slate-900">{cat.name}</h3>
                </div>

                <hr className="border-slate-100" />

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف التصنيف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditName(cat.name);
                      }}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      title="تعديل التصنيف"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100">
                    {renderCategoryIcon(cat.iconName)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding New Category */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة تصنيف جديد"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="اسم التصنيف"
            placeholder="مثال: شبابيك ألوميتال معزولة"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              إضافة
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Editing Category */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="تعديل اسم التصنيف"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="اسم التصنيف"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Modal>

      {/* HTTP 409 Conflict Safety Alert Modal */}
      <Modal
        isOpen={!!conflictModalMsg}
        onClose={() => setConflictModalMsg(null)}
        title="تعذر حذف التصنيف"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
            {conflictModalMsg}
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={() => setConflictModalMsg(null)}>
              موافق
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
