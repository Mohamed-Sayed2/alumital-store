import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'صورة المنتج',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً. الحد الأقصى المسموح 5 ميجابايت.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('نوع الملف غير مدعوم. المسموح فقط: (JPG, PNG, WEBP).');
      return;
    }

    // Show local preview immediately
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        setPreview(res.url);
        onChange(res.url);
      } else {
        throw new Error('لم يتم استلام رابط الصورة من السيرفر');
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'فشل رفع الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-w-sm aspect-video">
          <img
            src={preview}
            alt="معاينة الصورة"
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
          />
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-xs font-bold gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري رفع الصورة...</span>
            </div>
          )}
          {!uploading && (
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label
                htmlFor="replace-image-input"
                className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-bold cursor-pointer hover:bg-white transition-colors"
              >
                تغيير الصورة
              </label>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-600 transition-colors"
                title="إزالة الصورة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            id="replace-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-sky-500 hover:bg-sky-50/30 transition-all text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-sky-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">اضغط هنا لاختيار صورة من جهازك</span>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP (حجم أقصى 5MB)</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
