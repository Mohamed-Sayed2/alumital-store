"use client";

import Link from "next/link";
import { ArrowLeft, Phone, LayoutGrid, DoorClosed, Building2, Wrench } from "lucide-react";

const services = [
  {
    icon: LayoutGrid,
    title: "شبابيك ألومينتال",
    description: "أحدث قطاعات النوافذ العازلة للصوت والحرارة بتشطيبات ممتازة ومقاومة لعوامل الجو.",
  },
  {
    icon: DoorClosed,
    title: "أبواب ألومينتال",
    description: "أبواب قوية وراقية بتصاميم مفصلية وسحابة توفر أماناً وعزلاً تاماً.",
  },
  {
    icon: Building2,
    title: "واجهات زجاجية",
    description: "واجهات هيكلية فاخرة تعزز المظهر العصري للمباني والشركات الكبرى.",
  },
  {
    icon: Wrench,
    title: "حلول مخصصة",
    description: "تصاميم فريدة تناسب احتياجات مشروعك الخاصة بمواصفات حصرية.",
  },
];

export default function HomeHero() {
  return (
    <section className="relative pt-12 pb-20">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1264ff]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-[#f5a300]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
        {/* Top Badge Pill */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0c1424]/80 px-4 py-1.5 text-xs md:text-sm font-medium text-gray-200 backdrop-blur-md shadow-lg mb-8">
          <span className="h-2 w-2 rounded-full bg-[#f5a300] animate-pulse" />
          <span>الجودة الفائقة لقطاعات الألوميتال والزجاج</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.25] md:leading-[1.2] max-w-4xl mx-auto">
          ابتكار وتصميم فاخر{" "}
          <span className="text-[#1264ff] inline-block">للشبابيك</span>
          <br className="hidden sm:inline" />
          والأبواب الألومينتال
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-6 text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
          نقدم حلول ألومينتال حديثة للمنازل والفيلل والشركات باستخدام أفضل القطاعات المحلية والعالمية مع تنفيذ احترافي وعزل حراري وصوتي بأعلى جودة.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Blue Primary Button */}
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#1264ff] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#1264ff]/25 transition-all hover:bg-[#0052e0] hover:shadow-[#1264ff]/40 hover:-translate-y-0.5"
          >
            <span>تصفح المنتجات</span>
            <ArrowLeft size={18} />
          </Link>

          {/* Yellow Secondary Button */}
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#f5a300] px-8 py-3.5 text-base font-bold text-[#070d18] shadow-lg shadow-[#f5a300]/20 transition-all hover:bg-[#e09500] hover:shadow-[#f5a300]/35 hover:-translate-y-0.5"
          >
            <Phone size={18} />
            <span>تواصل معنا</span>
          </Link>
        </div>

        {/* Services / Features Section */}
        <div className="mt-28">
          <div className="text-center">
            <span className="text-xs md:text-sm font-bold text-[#f5a300] uppercase tracking-wider">
              خدماتنا المميزة
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-white">
              حلول معمارية متكاملة للزجاج والألومنيوم
            </h2>
          </div>

          {/* 4 Cards Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-[#0c1424]/70 backdrop-blur-md transition-all hover:border-[#f5a300]/40 hover:bg-[#0c1424]/90 hover:-translate-y-1 shadow-xl text-right"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300] transition-colors group-hover:bg-[#f5a300] group-hover:text-[#070d18] group-hover:border-[#f5a300]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
