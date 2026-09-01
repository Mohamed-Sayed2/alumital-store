"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

export default function ProductsGrid() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [backendCats, backendProds] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);

        setCategories(backendCats || []);
        setProducts(backendProds || []);
      } catch (err) {
        console.error("Failed to load products from API:", err);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter products by selected backend category (_id or name)
  const filteredProducts = products.filter((p) => {
    if (activeCategory === "ALL") return true;

    const catId = typeof p.category === "object" ? p.category?._id : p.category;
    const catName = typeof p.category === "object" ? p.category?.name : null;

    if (catId && catId === activeCategory) return true;
    if (catName && catName === activeCategory) return true;

    return false;
  });

  return (
    <section className="py-8 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Filter Tabs Header - Only Rendered If Categories Exist */}
      {categories.length > 0 && (
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-[#0c1424]/90 p-1.5 backdrop-blur-md shadow-xl">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                activeCategory === "ALL"
                  ? "bg-[#f5a300] text-[#070d18] shadow-md shadow-[#f5a300]/20"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              الكل
            </button>
            {categories.map((cat) => {
              const isCatActive = activeCategory === cat._id || activeCategory === cat.name;
              return (
                <button
                  key={cat._id}
                  onClick={() => setActiveCategory(cat._id)}
                  className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                    isCatActive
                      ? "bg-[#f5a300] text-[#070d18] shadow-md shadow-[#f5a300]/20"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state or Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#f5a300] border-r-transparent"></div>
          <p className="mt-4 font-medium">جاري تحميل المنتجات...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          لا توجد منتجات حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
