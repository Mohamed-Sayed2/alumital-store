import "./globals.css";
import { Cairo } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "الأخوة | حلول الألوميتال والزجاج",
  description: "ابتكار وتصميم فاخر للشبابيك والأبواب الألومينتال والواجهات الزجاجية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
