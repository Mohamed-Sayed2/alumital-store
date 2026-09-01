import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle2, Plus, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Product, Category } from '../types';
import { ImageUploader } from '../components/ui/ImageUploader';

interface ProductDetailsProps {
  products: Product[];
  categories?: Category[];
  onDeleteProduct: (id: string) => Promise<void> | void;
  onUpdateProduct?: (id: string, updatedData: any) => Promise<void> | void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  products,
  categories = [],
  onDeleteProduct,
  onUpdateProduct,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id) || products[0];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'features' | 'image'>('basic');

  // Form states
  const [editName, setEditName] = useState('');
  const [editMaterial, setEditMaterial] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editFeatures, setEditFeatures] = useState<string[]>([]);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync edit form with product when modal opens or product changes
  const populateFormData = () => {
    if (!product) return;
    setEditName(product.name || '');
    setEditMaterial(product.material || '');
    setEditDescription(product.description || '');
    setEditImage(product.image || '');

    const rawFeatures = Array.isArray(product.features) ? product.features : [];
    const normalized = rawFeatures
      .map((f: any) => (typeof f === 'string' ? f : f?.text || f?.title || f?.name || ''))
      .filter((f: string) => Boolean(f && typeof f === 'string' && f.trim()));
    setEditFeatures(normalized);

    const matchedCat = categories.find(
      (c) => c.id === product.category || c.name === product.category
    );
    setEditCategoryId(matchedCat ? matchedCat.id : categories[0]?.id || '');
  };

  useEffect(() => {
    populateFormData();
  }, [product, categories]);

  if (!product) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 mb-4">المنتج المطلوب غير موجود.</p>
        <Link to="/products" className="text-sky-600 font-bold underline">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
      await onDeleteProduct(product.id);
      navigate('/products');
    }
  };

  const handleEditOpen = () => {
    populateFormData();
    setActiveEditTab('basic');
    setErrorMsg('');
    setIsEditModalOpen(true);
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setEditFeatures([...editFeatures, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setEditFeatures(editFeatures.filter((_, idx) => idx !== index));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!editName.trim()) {
      setErrorMsg('يرجى إدخال اسم المنتج');
      return;
    }

    setSaving(true);
    try {
      if (onUpdateProduct) {
        await onUpdateProduct(product.id, {
          name: editName.trim(),
          material: editMaterial.trim(),
          description: editDescription.trim(),
          image: editImage.trim() || product.image,
          category: editCategoryId || undefined,
          features: editFeatures.filter((f) => f && f.trim().length > 0),
        });
      }
      setIsEditModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تعديل المنتج');
    } finally {
      setSaving(false);
    }
  };

  const displayFeatures = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Action Buttons & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            حالة النشر: {product.status === 'active' ? 'نشط' : 'مسودة'}
          </span>
          {product.isVisible !== false && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              ظاهر للعملاء
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
            حذف المنتج
          </Button>
          <Button variant="primary" icon={<Edit2 className="w-4 h-4" />} onClick={handleEditOpen}>
            تعديل المنتج
          </Button>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery / Image Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-100 aspect-4/3 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-right">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-2">
              <span>التصنيف: <strong className="text-slate-800">{product.category}</strong></span>
              <span className="mx-2 text-slate-300">|</span>
              <span>كود المنتج: <strong className="text-sky-600 font-mono">{product.code}</strong></span>
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">الوصف الفني</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || 'لا يوجد وصف متوفر.'}
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Material */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">المادة / القطاع</h3>
            <div className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {product.material || 'غير محدد'}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Product Features List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>المميزات والمواصفات</span>
                <span className="text-xs text-slate-400 font-normal">({displayFeatures.length})</span>
              </h3>
            </div>

            {displayFeatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayFeatures.map((feat: any, idx: number) => {
                  const featText = typeof feat === 'string' ? feat : feat?.text || feat?.title || '';
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate">{featText}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">لا توجد مميزات مضافة لهذا المنتج بعد.</p>
            )}
          </div>
        </div>
      </div>

      {/* Structured, Compact Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="تعديل بيانات المنتج"
        maxWidth="2xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-100/70 rounded-xl p-1 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveEditTab('basic')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeEditTab === 'basic'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>المعلومات الأساسية</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditTab('features')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeEditTab === 'features'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>المميزات والمواصفات ({editFeatures.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveEditTab('image')}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeEditTab === 'image'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>صورة المنتج</span>
            </button>
          </div>

          {/* Tab 1: Basic Info */}
          {activeEditTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="اسم المنتج *"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="اسم المنتج"
                  required
                />

                {categories.length > 0 ? (
                  <Select
                    label="التصنيف *"
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                ) : (
                  <Input
                    label="التصنيف"
                    value={product.category}
                    disabled
                  />
                )}
              </div>

              <Input
                label="المادة / القطاع الإنشائي *"
                value={editMaterial}
                onChange={(e) => setEditMaterial(e.target.value)}
                placeholder="مثال: قطاع Jumbo 100"
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الوصف الفني التفصيلي *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="اكتب وصفاً مختصراً ودقيقاً لمواصفات المنتج..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Features List Management */}
          {activeEditTab === 'features' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  قائمة المميزات والمواصفات للمنتج
                </span>
                <span className="text-[11px] text-slate-400">
                  تظهر هذه المميزات بعلامات صح داخل صفحة المنتج للعملاء
                </span>
              </div>

              {/* Existing Features List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {editFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...editFeatures];
                        updated[idx] = e.target.value;
                        setEditFeatures(updated);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="حذف الميزة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {editFeatures.length === 0 && (
                  <div className="p-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                    لا توجد مميزات مضافة. اكتب ميزة جديدة في الأسفل واضغط إضافة.
                  </div>
                )}
              </div>

              {/* Add New Feature Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  placeholder="اكتب ميزة جديدة هنا..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  <Plus className="w-4 h-4 ml-1" />
                  <span>إضافة ميزة</span>
                </Button>
              </div>
            </div>
          )}

          {/* Tab 3: Image Uploader */}
          {activeEditTab === 'image' && (
            <div className="space-y-3">
              <ImageUploader
                value={editImage}
                onChange={(url) => setEditImage(url)}
                label="صورة المنتج الرئيسية"
              />
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              {activeEditTab === 'basic' && <span>الخطوة ١ من ٣</span>}
              {activeEditTab === 'features' && <span>الخطوة ٢ من ٣</span>}
              {activeEditTab === 'image' && <span>الخطوة ٣ من ٣</span>}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
