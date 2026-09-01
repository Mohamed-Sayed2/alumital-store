import ProductsHeader from "@/components/product/ProductsHeader";
import ProductsGrid from "@/components/product/ProductsGrid";

export const metadata = {
  title: "المنتجات | الأخوة للألوميتال والزجاج",
  description: "اكتشف أحدث الشبابيك والأبواب والواجهات الزجاجية بأفضل جودة مصنعية",
};

export default function ProductsPage() {
  return (
    <main>
      <ProductsHeader />
      <ProductsGrid />
    </main>
  );
}
