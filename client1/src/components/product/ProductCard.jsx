"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getImageUrl } from "@/lib/api";

export default function ProductCard({ product }) {
  const categoryName = typeof product.category === "object" ? product.category?.name : product.category;
  const productId = product._id || product.id;
  const imageUrl = getImageUrl(product.image);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md transition-all hover:border-[#f5a300]/40 hover:-translate-y-1 shadow-xl text-right">
      <div>
        {/* Product Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category Badge on Top-Right */}
          {categoryName && (
            <div className="absolute top-3 right-3 rounded-md bg-[#070d18]/85 border border-[#f5a300]/30 px-3 py-1 text-xs font-bold text-[#f5a300] backdrop-blur-md">
              {categoryName}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-white group-hover:text-[#f5a300] transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0 flex items-center justify-between gap-3">
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#f5a300]/40 bg-[#f5a300]/10 px-4 py-2 text-sm font-bold text-[#f5a300] transition-all hover:bg-[#f5a300] hover:text-[#070d18] hover:border-[#f5a300]"
        >
          <span>عرض التفاصيل</span>
          <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}
