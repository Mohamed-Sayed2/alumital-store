import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bold, Italic, List, AlignRight, Plus, Trash2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { ImageUploader } from '../components/ui/ImageUploader';
import { Product, Category } from '../types';

interface AddProductProps {
  categories: Category[];
  onAddProduct: (product: Product) => Promise<void> | void;
}

export const AddProduct: React.FC<AddProductProps> = ({ categories, onAddProduct }) => {
  const navigate = useNavigate();

  const defaultCatId = categories.length > 0 ? categories[0].id : '';

  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCatId);
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'عزل كامل للصوت والحرارة',
    'إكسسوارات معتمدة ومقاومة للصدأ',
    'زجاج مزدوج مقسى مقاوم للصدمات',
    'ضمان شامل على التثبيت والقص',
  ]);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!image) {
      setErrorMsg('يرجى اختيار صورة للمنتج ورفعها أولاً');
      return;
    }

    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }

    const catIdToSubmit = selectedCategoryId || (categories[0]?.id || '');
    if (!catIdToSubmit) {
      setErrorMsg('يرجى إضافة تصنيف أولاً قبل إضافة منتج');
      return;
    }

    setSubmitting(true);
    try {
      const selectedCatObj = categories.find((c) => c.id === catIdToSubmit);
      const categoryName = selectedCatObj ? selectedCatObj.name : 'ألوميتال';

      const newProd: Product = {
        id: Date.now().toString(),
        name: name.trim(),
        code: 'PRD-' + Math.floor(Math.random() * 1000),
        category: categoryName,
        material: material.trim() || 'ألومنيوم معزول + زجاج',
        description: description.trim(),
        features: features,
        status: 'active',
        isVisible: true,
        createdAt: new Date().toLocaleDateString('ar-EG'),
        image: image.trim(),
      };

      await onAddProduct({
        ...newProd,
        category: catIdToSubmit,
      });

      navigate('/products');
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ المنتج');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-8">
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            ١. المعلومات الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="اسم المنتج"
                placeholder="أدخل اسم المنتج بالكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Select
                label="التصنيف"
                value={selectedCategoryId || defaultCatId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                options={
                  categoryOptions.length > 0
                    ? categoryOptions
                    : [{ value: '', label: 'لا توجد تصنيفات متاحة' }]
                }
              />
            </div>
          </div>

          <div className="w-full">
            <Input
              label="المادة / القطاع الإنشائي"
              placeholder="مثال: قطاع Jumbo 100 أو قطاع PS"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Section 2: Detailed Description */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            ٢. الوصف التفصيلي
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
            <div className="flex items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200 text-slate-600 text-xs font-semibold">
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700 italic">
                <Italic className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700">
                <List className="w-4 h-4" />
              </button>
              <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-slate-700">
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل ومميزات المنتج أو النظام..."
              className="w-full p-4 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Product Features / Specs */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            ٣. المميزات والمواصفات (Features)
          </h3>
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[idx] = e.target.value;
                    setFeatures(updated);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="حذف الميزة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                placeholder="اكتب ميزة جديدة هنا..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddFeature}>
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة ميزة</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Product Image File Picker */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            ٤. صورة المنتج
          </h3>
          <ImageUploader value={image} onChange={(url) => setImage(url)} label="رفع صورة المنتج" />
        </div>

        {/* Form Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={() => navigate('/products')}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'جاري الحفظ...' : 'حفظ وتخزين المنتج'}
          </Button>
        </div>
      </div>
    </form>
  );
};
