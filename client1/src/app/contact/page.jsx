"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Clock, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

function ContactFormContent() {
  const searchParams = useSearchParams();
  const productQuery = searchParams.get("product");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    message: "",
  });

  const [settings, setSettings] = useState({
    phone: "0101335854",
    email: "contact@alalikhwa.com",
    address: "المعادي، القاهرة، مصر",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productQuery) {
      setFormData((prev) => ({
        ...prev,
        message: `أود الاستفسار وطلب عرض سعر عن منتج: ${productQuery}`,
      }));
    }

    api.getSettings().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    });
  }, [productQuery]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.message.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
      setSubmitting(false);
      return;
    }

    try {
      await api.sendMessage({
        fullName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        city: "",
        message: "",
      });
    } catch (err) {
      console.error("Message submission error:", err);
      setError(err.message || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-12 px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f5a300]/30 bg-[#f5a300]/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-[#f5a300] mb-6">
          <span className="h-2 w-2 rounded-full bg-[#f5a300] animate-pulse" />
          <span>نحن هنا لمساعدتك على مدار الساعة</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          تواصل معنا لطلب استشارة مجانية
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
          يسعدنا تواصلك معنا لطلب استشارة أو استفسار حول خدمات الألومينتال والزجاج وسنقوم بالرد عليك في أسرع وقت.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Side (RTL Right): Direct Contact Information Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="text-right mb-2">
            <h3 className="text-2xl font-extrabold text-white">معلومات الاتصال المباشر</h3>
          </div>

          {/* Card 1: Phone */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md shadow-xl text-right">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300]">
              <Phone size={22} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-400">رقم الهاتف</div>
              <div dir="ltr" className="text-lg font-black text-[#f5a300] tracking-wide mt-0.5">
                {settings.phone || "0101335854"}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">متاح طوال اليوم لاستقبال استفساراتكم</div>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md shadow-xl text-right">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300]">
              <Mail size={22} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-400">البريد الإلكتروني</div>
              <div className="text-base font-bold text-[#f5a300] tracking-wide mt-0.5">
                {settings.email || "contact@alalikhwa.com"}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">راسلنا للحصول على عروض أسعار رسمية</div>
            </div>
          </div>

          {/* Card 3: Location */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md shadow-xl text-right">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300]">
              <MapPin size={22} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-400">موقعنا الرئيسي</div>
              <div className="text-base font-bold text-[#f5a300] tracking-wide mt-0.5">
                {settings.address || "المعادي، القاهرة، مصر"}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">تفضل بزيارة معرضنا لرؤية أحدث القطاعات</div>
            </div>
          </div>

          {/* Card 4: Hours */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#0c1424]/80 backdrop-blur-md shadow-xl text-right">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f5a300]">
              <Clock size={22} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-400">ساعات العمل</div>
              <div className="text-base font-bold text-[#f5a300] tracking-wide mt-0.5">
                {settings.workingHours
                  ? `${settings.workingHours.days}: ${settings.workingHours.open} - ${settings.workingHours.close}`
                  : "السبت - الخميس: 9:00 ص - 9:00 م"}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {settings.workingHours?.closedDays || "الجمعة: عطلة أسبوعية"}
              </div>
            </div>
          </div>
        </div>

        {/* Left Side (RTL Left): Contact Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0c1424]/90 p-8 backdrop-blur-md shadow-2xl text-right">
          <h3 className="text-2xl font-extrabold text-white mb-6">أرسل طلبك الآن</h3>

          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm font-semibold">
              <CheckCircle size={20} className="shrink-0" />
              <span>تم إرسال طلبك بنجاح! سيتواصل معك فريقنا في أقرب وقت.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-sm font-semibold">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="مثال: أحمد محمود"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#f5a300] focus:ring-1 focus:ring-[#f5a300]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="مثال: 012345678"
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#f5a300] focus:ring-1 focus:ring-[#f5a300]"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">
                المدينة / المحافظة *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="مثال: القاهرة"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#f5a300] focus:ring-1 focus:ring-[#f5a300]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">
                تفاصيل الطلب / الرسالة *
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="اكتب تفاصيل استفسارك أو المقاسات المطلوبة والقطاعات المفضلة هنا..."
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#f5a300] focus:ring-1 focus:ring-[#f5a300] resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f5a300] py-4 text-base font-extrabold text-[#070d18] shadow-lg shadow-[#f5a300]/25 transition-all hover:bg-[#e09500] hover:shadow-[#f5a300]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري إرسال الرسالة...</span>
                </>
              ) : (
                <>
                  <span>إرسال الرسالة</span>
                  <ArrowLeft size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-gray-400">
        <Loader2 size={32} className="animate-spin mx-auto text-[#f5a300]" />
        <p className="mt-4 font-medium">جاري تحميل الصفحة...</p>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
}
