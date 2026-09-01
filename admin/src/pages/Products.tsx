import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product, Category } from '../types';

interface ProductsProps {
  products: Product[];
  categories?: Category[];
  onDeleteProduct: (id: string) => Promise<void> | void;
  onToggleVisibility?: (id: string, isVisible: boolean) => Promise<void> | void;
  loading?: boolean;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  categories = [],
  onDeleteProduct,
  onToggleVisibility,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`هل أنت تأكد من حذف المنتج "${name}"؟`)) {
      await onDeleteProduct(id);
    }
  };

  const handleToggle = async (product: Product) => {
    if (!onToggleVisibility) return;
    setTogglingId(product.id);
    try {
      await onToggleVisibility(product.id, !product.isVisible);
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right: Search bar & Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم المنتج..."
              className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-white shadow-sm focus:border-sky-500 focus:outline-none transition-colors placeholder-slate-400 text-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-sm focus:outline-none"
          >
            <option value="all">كل التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Left: Add product button */}
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500">
                <th className="py-3.5 px-4">صورة</th>
                <th className="py-3.5 px-4">اسم المنتج</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">المادة</th>
                <th className="py-3.5 px-4">الظهور (العملاء)</th>
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
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-sm">
                    لا توجد منتجات مطابقة للبحث حالياً.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
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
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600 max-w-[200px] truncate">
                      {product.material}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(product)}
                        disabled={togglingId === product.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          product.isVisible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title={product.isVisible ? 'انقر لإخفاء المنتج من موقع العملاء' : 'انقر لإظهار المنتج للعملاء'}
                      >
                        {product.isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>👁 ظاهر</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>🚫 مخفي</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 dir-ltr text-right">
                      {product.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
                          title="عرض وتعديل التفاصيل"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>إجمالي المنتجات المعروضة: {filteredProducts.length}</span>
        </div>
      </div>
    </div>
  );
};
