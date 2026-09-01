"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { api } from "@/lib/api";

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Footer() {
  const [settings, setSettings] = useState({
    companyName: "الأخوة",
    subtitle: "ALUMITAE & GLASS SOLUTIONS",
    phone: "0101335854",
    email: "contact@alalikhwa.com",
    address: "المعادي، القاهرة، مصر",
    description: "حلول ألومينتال حديثة للمنازل والفيلل والشركات بأفضل القطاعات المحلية والعالمية وتنفيذ احترافي وعزل تام.",
    copyright: "جميع الحقوق محفوظة. الأخوة للألوميتال والزجاج.",
    socialLinks: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
    },
  });

  useEffect(() => {
    api.getSettings().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    });
  }, []);

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#070d18] pt-16 pb-8 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start gap-4 text-right">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5a300] font-black text-[#070d18] text-xl shadow-lg">
                أ
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none">
                  {settings.companyName || "الأخوة"}
                </span>
                <span className="mt-1 text-[9px] font-semibold tracking-widest text-[#f5a300] uppercase leading-none">
                  {settings.subtitle || "ALUMITAE & GLASS SOLUTIONS"}
                </span>
              </div>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-gray-400 max-w-sm">
              {settings.description || "حلول ألومينتال حديثة للمنازل والفيلل والشركات بأفضل القطاعات المحلية والعالمية وتنفيذ احترافي وعزل تام."}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start gap-4 text-right">
            <h4 className="text-lg font-bold text-[#f5a300]">روابط سريعة</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-[#f5a300] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info & Socials */}
          <div className="flex flex-col items-start gap-4 text-right">
            <h4 className="text-lg font-bold text-[#f5a300]">تواصل معنا</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#f5a300] shrink-0" />
                <span dir="ltr" className="font-sans text-gray-200">
                  {settings.phone || "0101335854"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#f5a300] shrink-0" />
                <span className="text-gray-200">
                  {settings.email || "contact@alalikhwa.com"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[#f5a300] shrink-0" />
                <span className="text-gray-200">
                  {settings.address || "المعادي، القاهرة، مصر"}
                </span>
              </li>
            </ul>

            {/* Working Hours */}
            {settings.workingHours && (
              <div className="mt-3 space-y-1.5 text-sm text-gray-300">
                <div className="flex items-center gap-2 text-[#f5a300] font-bold text-xs">
                  <Clock size={14} className="shrink-0" />
                  <span>ساعات العمل</span>
                </div>
                <p className="text-gray-300 text-xs">
                  {settings.workingHours.days}: {settings.workingHours.open} — {settings.workingHours.close}
                </p>
                {settings.workingHours.closedDays && (
                  <p className="text-gray-400 text-xs">{settings.workingHours.closedDays}</p>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center gap-3">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all hover:bg-[#f5a300] hover:text-[#070d18] hover:border-[#f5a300]"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all hover:bg-[#f5a300] hover:text-[#070d18] hover:border-[#f5a300]"
                >
                  <InstagramIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>AL IKHWA © 2026</div>
          <div>{settings.copyright || "جميع الحقوق محفوظة. الأخوة للألوميتال والزجاج."}</div>
        </div>
      </div>
    </footer>
  );
}
