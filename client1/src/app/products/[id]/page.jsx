"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck, Award, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { api, getImageUrl } from "@/lib/api";

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(false);
      try {
        const data = await api.getProduct(productId);
        if (data) {
          setProduct(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <main className="py-24 px-6 text-center">
        <div className="mx-auto max-w-md p-12 rounded-3xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md">
          <Loader2 size={36} className="animate-spin text-[#f5a300] mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-300">جاري تحميل تفاصيل المنتج...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="py-24 px-6 text-center">
        <div className="mx-auto max-w-md p-12 rounded-3xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md space-y-6">
          <AlertCircle size={48} className="text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-white">المنتج غير موجود</h2>
          <p className="text-sm text-gray-300">لم نتمكن من العثور على تفاصل المنتج المطلوب.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#f5a300] px-6 py-3 text-sm font-bold text-[#070d18] shadow-lg shadow-[#f5a300]/20 transition-all hover:bg-[#e09500]"
          >
            <ArrowRight size={18} />
            <span>العودة للمنتجات</span>
          </Link>
        </div>
      </main>
    );
  }

  const categoryName = typeof product.category === "object" ? product.category?.name : product.category;
  const imageUrl = getImageUrl(product.image);

  return (
    <main className="py-12 px-6 lg:px-8 max-w-7xl mx-auto space-y-12 text-right">
      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#f5a300] hover:underline transition-all"
        >
          <ArrowRight size={18} />
          <span>العودة إلى جميع المنتجات</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Product Image Box (6 cols) */}
        <div className="lg:col-span-6 relative rounded-3xl border border-white/10 overflow-hidden bg-slate-900 shadow-2xl group">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {categoryName && (
            <div className="absolute top-4 right-4 rounded-xl bg-[#070d18]/90 border border-[#f5a300]/40 px-4 py-1.5 text-xs font-bold text-[#f5a300] backdrop-blur-md shadow-lg">
              {categoryName}
            </div>
          )}
        </div>

        {/* Product Information Box (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 rounded-3xl border border-white/10 bg-[#0c1424]/90 p-8 backdrop-blur-md shadow-2xl">
          {categoryName && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5a300]/30 bg-[#f5a300]/10 px-3.5 py-1 text-xs font-bold text-[#f5a300]">
              <Sparkles size={14} />
              <span>{categoryName}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {product.name}
          </h1>

          {product.material && (
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 border-b border-white/10 pb-2 w-full">
              <span className="text-[#f5a300]">القطاع / الخامة:</span>
              <span>{product.material}</span>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">وصف المنتج:</h3>
            <p className="text-base text-gray-300 leading-relaxed">
              {product.description || "قطاعات ألومينتال وزجاج فاخرة مصنعة وفق أعلى معايير العزل والجودة العالمية."}
            </p>
          </div>

          {/* Product Specifications Features */}
          {(() => {
            const rawFeatures = Array.isArray(product?.features) ? product.features : [];
            const featuresList = rawFeatures
              .map((f) => (typeof f === "string" ? f : f?.text || f?.title || f?.name || ""))
              .filter((f) => Boolean(f && typeof f === "string" && f.trim()));

            if (featuresList.length === 0) return null;

            return (
              <div className="w-full space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-base font-bold text-[#f5a300]">المميزات والمواصفات:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  {featuresList.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {idx % 2 === 0 ? (
                        <ShieldCheck size={18} className="text-[#f5a300] shrink-0" />
                      ) : (
                        <Award size={18} className="text-[#f5a300] shrink-0" />
                      )}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* CTA Button to Request Quote */}
          <div className="w-full pt-6 border-t border-white/10">
            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f5a300] py-4 text-base font-extrabold text-[#070d18] shadow-lg shadow-[#f5a300]/25 transition-all hover:bg-[#e09500] hover:shadow-[#f5a300]/40"
            >
              <Phone size={18} />
              <span>اطلب عرض سعر لهذا المنتج</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
