"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#0a1220]/90 px-6 py-3.5 backdrop-blur-md shadow-2xl transition-all">
        <div className="flex items-center justify-between">
          {/* Logo / Brand (RTL Right / Start) */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5a300] font-black text-[#070d18] text-xl shadow-lg transition-transform group-hover:scale-105">
                أ
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xl font-bold text-white tracking-tight leading-none">
                  الأخوة
                </span>
                <span className="mt-1 text-[9px] font-semibold tracking-widest text-[#f5a300] uppercase leading-none">
                  ALUMITAE & GLASS SOLUTIONS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Centered) */}
          <nav className="hidden md:flex items-center justify-center gap-2">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "border border-[#f5a300] text-[#f5a300] bg-[#f5a300]/10 shadow-[0_0_15px_rgba(245,163,0,0.15)]"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Spacer on Desktop for Symmetric Centering */}
          <div className="hidden md:flex flex-1 items-center justify-end" />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="تغيير القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav className="mt-4 pt-4 border-t border-white/10 md:hidden flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "border border-[#f5a300] text-[#f5a300] bg-[#f5a300]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
