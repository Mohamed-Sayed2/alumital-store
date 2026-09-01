"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Wrench, Home as HomeIcon, CheckCircle2, Loader2 } from "lucide-react";
import { api, getImageUrl } from "@/lib/api";

const DEFAULT_ICONS = [LayoutGrid, Wrench, HomeIcon];

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getAbout()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setAboutData(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="py-24 px-6 text-center">
        <div className="mx-auto max-w-md p-12 rounded-3xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md">
          <Loader2 size={36} className="animate-spin text-[#f5a300] mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-300">جاري تحميل الصفحة...</p>
        </div>
      </main>
    );
  }

  const badge = aboutData?.badge || "جودة هندسية تفوق التوقعات";
  const mainTitle = aboutData?.mainTitle || "من نحن";
  const subtitle =
    aboutData?.subtitle ||
    "الأخوة لحلول الألومينتال والزجاج نقدم حلولاً عصرية تجمع بين التصميم المميز والجودة العالية والتنفيذ الاحترافي.";
  const description =
    aboutData?.description ||
    "انطلقت مسيرتنا بشغف ملتزم بتقديم حلول معمارية متميزة. نحن لسنا مجرد منفذين، بل شركاء نجاح نساعدك على اختيار القطاعات ونوعية الزجاج الأنسب لاحتياجات بيئتك الجغرافية والمناخية، لنصنع تحفة فنية آمنة وعازلة للحرارة والضوضاء.";
  const mainImage =
    aboutData?.mainImage ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const overlayTitle = aboutData?.overlayTitle || "نصنع الفخامة من الزجاج";
  const overlayText =
    aboutData?.overlayText ||
    "دمج الرؤية المعمارية العصرية مع متانة الألومنيوم بمنح منزلك أماناً يستمر لأجيال.";

  // Values cards (fallback defaults)
  const values =
    aboutData?.values && aboutData.values.length > 0
      ? aboutData.values
      : [
          { title: "حلول مخصصة", description: "تصاميم معمارية فريدة تتماشى تماماً مع طموحات العميل وبأبعاد حرة ومدروسة." },
          { title: "تنفيذ احترافي", description: "فريق من المهندسين والفنيين ذوي الخبرة الطويلة لضمان تثبيت دقيق ومثالي." },
          { title: "جودة عالية", description: "نستخدم أفضل قطاعات الألومنيوم العالمية المعالجة والزجاج المقاوم للصدمات والحرارة." },
        ];

  // Why Us section
  const whyUs = aboutData?.whyUs || {};
  const whyUsEyebrow = whyUs.eyebrow || "سر تميزنا واختيار العملاء لنا";
  const whyUsTitle = whyUs.title || "لماذا الأخوة لحلول الألومنيوم؟";
  const whyUsFeatures =
    whyUs.features && whyUs.features.length > 0
      ? whyUs.features
      : [
          { title: "تصميمات عصرية", description: "مظهر جمالي يضيف لمسة من الفخامة والاتساع المعماري للمباني الحديثة." },
          { title: "خامات عالية الجودة", description: "اكسسوارات معتمدة وقطاعات متينة تقاوم التآكل والصدأ على المدى البعيد." },
          { title: "حلول تناسب كافة المشاريع", description: "من النوافذ البسيطة إلى الواجهات الزجاجية الهيكلية الضخمة للشركات." },
          { title: "تنفيذ دقيق للغاية", description: "عمليات قياس وقص وتثبيت ميكانيكي تخضع لرعاية صارمة لضمان خلوها من العيوب." },
        ];
  const whyUsImage = whyUs.image
    ? getImageUrl(whyUs.image)
    : "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80";

  return (
    <main className="py-12 px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* RTL Right Column: Content */}
        <div className="flex flex-col items-start text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1264ff]/40 bg-[#1264ff]/10 px-4 py-1 text-xs font-semibold text-[#3b82f6] mb-6">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
            <span>{badge}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            {mainTitle}
          </h1>

          <p className="text-lg font-bold text-gray-200 leading-relaxed mb-4">
            {subtitle}
          </p>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* RTL Left Column: Image with Overlay Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
          <img
            src={getImageUrl(mainImage)}
            alt="الأخوة للألوميتال والزجاج"
            className="w-full h-[400px] md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Floating Translucent Overlay Card */}
          <div className="absolute bottom-6 right-6 left-6 p-6 rounded-2xl border border-white/15 bg-[#0c1424]/85 backdrop-blur-md shadow-2xl text-right">
            <h3 className="text-lg font-bold text-[#f5a300] mb-1">
              {overlayTitle}
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {overlayText}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Middle Value Cards (Dynamic from Backend) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((val, idx) => {
          const IconComponent = DEFAULT_ICONS[idx % DEFAULT_ICONS.length];
          return (
            <div
              key={idx}
              className="flex flex-col items-start p-8 rounded-3xl border border-white/10 bg-[#0c1424]/70 backdrop-blur-md text-right hover:border-[#f5a300]/40 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300] mb-6">
                <IconComponent size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{val.description}</p>
            </div>
          );
        })}
      </section>

      {/* 3. Why Choose Us Section (Dynamic from Backend) */}
      <section className="space-y-12">
        <div className="text-center">
          <span className="text-xs md:text-sm font-bold text-[#f5a300] uppercase tracking-wider">
            {whyUsEyebrow}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">
            {whyUsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Feature Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyUsFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/10 bg-[#0c1424]/70 backdrop-blur-md text-right flex flex-col justify-start"
              >
                <div className="flex items-center gap-2 mb-3 text-red-500">
                  <CheckCircle2 size={20} className="fill-red-500 text-[#070d18]" />
                  <h4 className="text-lg font-bold text-white">{feat.title}</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>

          {/* Feature Image */}
          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl min-h-[300px]">
            <img
              src={whyUsImage}
              alt="قطاعات الألوميتال والزجاج"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
