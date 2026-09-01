import React, { useState, useEffect } from 'react';
import { Building2, Info, Check, Loader2, Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ImageUploader } from '../components/ui/ImageUploader';
import { AppSettings, AboutValue, WhyUsFeature } from '../types';
import { api } from '../services/api';

interface SettingsProps {
  settings?: AppSettings;
  onSaveSettings?: (settings: AppSettings) => void;
}

export const Settings: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'about'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // General / Footer settings state
  const [companyName, setCompanyName] = useState('الأخوة');
  const [subtitle, setSubtitle] = useState('ALUMITAE & GLASS SOLUTIONS');
  const [phone, setPhone] = useState('+20 100 000 0000');
  const [whatsapp, setWhatsapp] = useState('+20 100 000 0000');
  const [email, setEmail] = useState('info@alalikhwa.com');
  const [address, setAddress] = useState('القاهرة، مصر');
  const [description, setDescription] = useState('حلول ألوميتال حديثة للمنازل والفلل والشركات، بأفضل القطاعات المحلية والعالمية وتنفيذ احترافي.');
  const [copyright, setCopyright] = useState('الأخوة للألوميتال والزجاج. جميع الحقوق محفوظة.');
  const [facebook, setFacebook] = useState('https://facebook.com');
  const [instagram, setInstagram] = useState('https://instagram.com');

  // Working Hours state
  const [whDays, setWhDays] = useState('السبت - الخميس');
  const [whOpen, setWhOpen] = useState('9:00 ص');
  const [whClose, setWhClose] = useState('9:00 م');
  const [whClosedDays, setWhClosedDays] = useState('الجمعة: عطلة أسبوعية');

  // About CMS state — Hero Section
  const [badge, setBadge] = useState('جودة هندسية تفوق التوقعات');
  const [mainTitle, setMainTitle] = useState('عن شركة الأخوة للألوميتال والزجاج');
  const [aboutSubtitle, setAboutSubtitle] = useState('خبرة تزيد عن 15 عاماً في تصميم وتنفيذ أجود قطاعات الألوميتال والواجهات الزجاجية المعمارية.');
  const [aboutDescription, setAboutDescription] = useState('نحن شركة رائدة متخصصة في تصنيع وتركيب أحدث أنظمة الألوميتال والواجهات الزجاجية الشفافة والمعشقة، ونقدم حلولاً متكاملة للمشاريع السكنية والتجارية.');
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [overlayTitle, setOverlayTitle] = useState('نصنع الفخامة من الزجاج');
  const [overlayText, setOverlayText] = useState('دمج الرؤية المعمارية العصرية مع متانة الألومنيوم بمنح منزلك أماناً يستمر لأجيال.');

  // About CMS state — Vision & Mission
  const [vision, setVision] = useState('أن نكون الخيار الأول والشركة الرائدة في تقديم كافة حلول الألوميتال والزجاج في المنطقة.');
  const [mission, setMission] = useState('تقديم أفضل المنتجات بأعلى معايير الدقة والأمان والتصميم العصري الذي يلبي كافة تطلعات عملائنا.');

  // About CMS state — Values Cards
  const [valuesList, setValuesList] = useState<AboutValue[]>([
    { title: 'حلول مخصصة', description: 'تصاميم معمارية فريدة تتماشى تماماً مع طموحات العميل وبأبعاد حرة ومدروسة.' },
    { title: 'تنفيذ احترافي', description: 'فريق من المهندسين والفنيين ذوي الخبرة الطويلة لضمان تثبيت دقيق ومثالي.' },
    { title: 'جودة عالية', description: 'نستخدم أفضل قطاعات الألومنيوم العالمية المعالجة والزجاج المقاوم للصدمات والحرارة.' },
  ]);
  const [newValueTitle, setNewValueTitle] = useState('');
  const [newValueDesc, setNewValueDesc] = useState('');

  // About CMS state — Why Us Section
  const [whyUsEyebrow, setWhyUsEyebrow] = useState('سر تميزنا واختيار العملاء لنا');
  const [whyUsTitle, setWhyUsTitle] = useState('لماذا الأخوة لحلول الألومنيوم؟');
  const [whyUsDescription, setWhyUsDescription] = useState('');
  const [whyUsImage, setWhyUsImage] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80');
  const [whyUsFeaturesList, setWhyUsFeaturesList] = useState<WhyUsFeature[]>([
    { title: 'تصميمات عصرية', description: 'مظهر جمالي يضيف لمسة من الفخامة والاتساع المعماري للمباني الحديثة.' },
    { title: 'خامات عالية الجودة', description: 'اكسسوارات معتمدة وقطاعات متينة تقاوم التآكل والصدأ على المدى البعيد.' },
    { title: 'حلول تناسب كافة المشاريع', description: 'من النوافذ البسيطة إلى الواجهات الزجاجية الهيكلية الضخمة للشركات.' },
    { title: 'تنفيذ دقيق للغاية', description: 'عمليات قياس وقص وتثبيت ميكانيكي تخضع لرعاية صارمة لضمان خلوها من العيوب.' },
  ]);
  const [newWhyUsTitle, setNewWhyUsTitle] = useState('');
  const [newWhyUsDesc, setNewWhyUsDesc] = useState('');

  useEffect(() => {
    async function loadAllSettings() {
      setLoading(true);
      try {
        const settingsData = await api.getSettings();
        if (settingsData) {
          setCompanyName(settingsData.companyName || 'الأخوة');
          setSubtitle(settingsData.subtitle || 'ALUMITAE & GLASS SOLUTIONS');
          setPhone(settingsData.phone || '+20 100 000 0000');
          setWhatsapp(settingsData.whatsapp || '+20 100 000 0000');
          setEmail(settingsData.email || 'info@alalikhwa.com');
          setAddress(settingsData.address || 'القاهرة، مصر');
          setDescription(settingsData.description || '');
          setCopyright(settingsData.copyright || '');
          if (settingsData.socialLinks) {
            setFacebook(settingsData.socialLinks.facebook || '');
            setInstagram(settingsData.socialLinks.instagram || '');
          }
          if (settingsData.workingHours) {
            setWhDays(settingsData.workingHours.days || 'السبت - الخميس');
            setWhOpen(settingsData.workingHours.open || '9:00 ص');
            setWhClose(settingsData.workingHours.close || '9:00 م');
            setWhClosedDays(settingsData.workingHours.closedDays || 'الجمعة: عطلة أسبوعية');
          }
        }

        const aboutData = await api.getAbout();
        if (aboutData) {
          if (aboutData.badge) setBadge(aboutData.badge);
          if (aboutData.mainTitle) setMainTitle(aboutData.mainTitle);
          if (aboutData.subtitle) setAboutSubtitle(aboutData.subtitle);
          if (aboutData.description) setAboutDescription(aboutData.description);
          if (aboutData.mainImage) setMainImage(aboutData.mainImage);
          if (aboutData.overlayTitle) setOverlayTitle(aboutData.overlayTitle);
          if (aboutData.overlayText) setOverlayText(aboutData.overlayText);
          if (aboutData.vision) setVision(aboutData.vision);
          if (aboutData.mission) setMission(aboutData.mission);

          if (Array.isArray(aboutData.values) && aboutData.values.length > 0) {
            setValuesList(aboutData.values);
          }

          if (aboutData.whyUs) {
            if (aboutData.whyUs.eyebrow) setWhyUsEyebrow(aboutData.whyUs.eyebrow);
            if (aboutData.whyUs.title) setWhyUsTitle(aboutData.whyUs.title);
            if (aboutData.whyUs.description) setWhyUsDescription(aboutData.whyUs.description);
            if (aboutData.whyUs.image) setWhyUsImage(aboutData.whyUs.image);
            if (Array.isArray(aboutData.whyUs.features) && aboutData.whyUs.features.length > 0) {
              setWhyUsFeaturesList(aboutData.whyUs.features);
            }
          }
        }
      } catch (err: any) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllSettings();
  }, []);

  // Values List Handlers
  const handleAddValue = () => {
    if (newValueTitle.trim()) {
      setValuesList([
        ...valuesList,
        {
          title: newValueTitle.trim(),
          description: newValueDesc.trim(),
        },
      ]);
      setNewValueTitle('');
      setNewValueDesc('');
    }
  };

  const handleRemoveValue = (index: number) => {
    setValuesList(valuesList.filter((_, idx) => idx !== index));
  };

  // Why Us Features Handlers
  const handleAddWhyUsFeature = () => {
    if (newWhyUsTitle.trim()) {
      setWhyUsFeaturesList([
        ...whyUsFeaturesList,
        {
          title: newWhyUsTitle.trim(),
          description: newWhyUsDesc.trim(),
        },
      ]);
      setNewWhyUsTitle('');
      setNewWhyUsDesc('');
    }
  };

  const handleRemoveWhyUsFeature = (index: number) => {
    setWhyUsFeaturesList(whyUsFeaturesList.filter((_, idx) => idx !== index));
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.updateSettings({
        companyName,
        subtitle,
        phone,
        whatsapp,
        email,
        address,
        description,
        copyright,
        workingHours: {
          days: whDays,
          open: whOpen,
          close: whClose,
          closedDays: whClosedDays,
        },
        socialLinks: {
          facebook,
          instagram,
        },
      });
      setSuccessMsg('تم حفظ إعدادات الشركة وحواشي الموقع (Footer) بنجاح!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.updateAbout({
        badge: badge.trim(),
        mainTitle: mainTitle.trim(),
        subtitle: aboutSubtitle.trim(),
        description: aboutDescription.trim(),
        mainImage: mainImage.trim(),
        overlayTitle: overlayTitle.trim(),
        overlayText: overlayText.trim(),
        vision: vision.trim(),
        mission: mission.trim(),
        values: valuesList.filter((v) => v.title.trim().length > 0),
        whyUs: {
          eyebrow: whyUsEyebrow.trim(),
          title: whyUsTitle.trim(),
          description: whyUsDescription.trim(),
          image: whyUsImage.trim(),
          features: whyUsFeaturesList.filter((f) => f.title.trim().length > 0),
        },
      });
      setSuccessMsg('تم تحديث كامل محتوى صفحة (من نحن) بنجاح!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء حفظ محتوى صفحة من نحن');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 font-medium max-w-4xl mx-auto flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
        <span>جاري تحميل إعدادات الموقع...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 border shadow-sm">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#0f172a] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>إعدادات الفوتر والشركة</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'about'
              ? 'bg-[#0f172a] text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>محتوى صفحة من نحن (About CMS الكامل)</span>
        </button>
      </div>

      {/* Notifications Feedback */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* General Settings Tab Form */}
      {activeTab === 'general' && (
        <form
          onSubmit={handleGeneralSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6"
        >
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            معلومات الترويسة والحاشية (Footer CMS)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="اسم الشركة"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="مثال: الأخوة"
              required
            />

            <Input
              label="الشعار الفرعي (Subtitle)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="مثال: ALUMITAE & GLASS SOLUTIONS"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف للاتصال"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 100 000 0000"
              required
            />

            <Input
              label="رقم الواتساب"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+20 100 000 0000"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@alalikhwa.com"
              required
            />

            <Input
              label="العنوان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="القاهرة، مصر"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف الشركة في الفوتر</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="وصف مختصر يظهر أسفل اسم الشركة في حاشية الموقع..."
              required
            />
          </div>

          <Input
            label="نص حقوق النشر (Copyright)"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder="الأخوة للألوميتال والزجاج. جميع الحقوق محفوظة."
            required
          />

          <h4 className="text-sm font-bold text-slate-900 pt-4 border-t border-slate-100">
            روابط التواصل الاجتماعي
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رابط صفحة فيسبوك"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
            />

            <Input
              label="رابط صفحة انستغرام"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
            />
          </div>

          <h4 className="text-sm font-bold text-slate-900 pt-4 border-t border-slate-100">
            ساعات العمل
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="أيام العمل"
              value={whDays}
              onChange={(e) => setWhDays(e.target.value)}
              placeholder="السبت - الخميس"
            />

            <Input
              label="أيام الإغلاق"
              value={whClosedDays}
              onChange={(e) => setWhClosedDays(e.target.value)}
              placeholder="الجمعة: عطلة أسبوعية"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="وقت الفتح"
              value={whOpen}
              onChange={(e) => setWhOpen(e.target.value)}
              placeholder="9:00 ص"
            />

            <Input
              label="وقت الإغلاق"
              value={whClose}
              onChange={(e) => setWhClose(e.target.value)}
              placeholder="9:00 م"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الموقع'}
            </Button>
          </div>
        </form>
      )}

      {/* About CMS Tab Form (Complete CMS) */}
      {activeTab === 'about' && (
        <form
          onSubmit={handleAboutSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-8"
        >
          {/* Section 1: Hero & Main Section */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>١. القسم الرئيسي والترويسة (Hero Section)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="بادج التميز (Eyebrow Badge)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="مثال: جودة هندسية تفوق التوقعات"
                required
              />

              <Input
                label="العنوان الرئيسي لصفحة من نحن"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                placeholder="مثال: من نحن أو عن شركة الأخوة"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">العنوان الفرعي</label>
              <textarea
                rows={2}
                value={aboutSubtitle}
                onChange={(e) => setAboutSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">النبذة التعريفية والشرح التفصيلي</label>
              <textarea
                rows={4}
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            {/* Main Image */}
            <div className="pt-2">
              <ImageUploader
                value={mainImage}
                onChange={(url) => setMainImage(url)}
                label="صورة القسم الرئيسي (Hero Image)"
              />
            </div>

            {/* Translucent Overlay Card on Hero Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
              <div>
                <Input
                  label="عنوان البطاقة العائمة على الصورة"
                  value={overlayTitle}
                  onChange={(e) => setOverlayTitle(e.target.value)}
                  placeholder="مثال: نصنع الفخامة من الزجاج"
                />
              </div>
              <div>
                <Input
                  label="نص البطاقة العائمة على الصورة"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="مثال: دمج الرؤية المعمارية العصرية..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Values Cards (3 Column Middle Section) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>٢. بطاقات القيم والمبادئ (Values Cards)</span>
                <span className="text-xs text-slate-400 font-normal">({valuesList.length} بطاقات)</span>
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              تظهر هذه البطاقات في منتصف الصفحة كأعمدة توضح ركائز الشركة. يمكنك تعديلها أو إضافة قيم جديدة أو حذف أي قيمة.
            </p>

            {/* Values Items */}
            <div className="space-y-3">
              {valuesList.map((val, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const updated = [...valuesList];
                        updated[idx].title = e.target.value;
                        setValuesList(updated);
                      }}
                      placeholder="عنوان القيمة"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={val.description}
                      onChange={(e) => {
                        const updated = [...valuesList];
                        updated[idx].description = e.target.value;
                        setValuesList(updated);
                      }}
                      placeholder="شرح وتفاصيل القيمة"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(idx)}
                    className="p-2 text-rose-600 hover:bg-rose-100/60 rounded-lg transition shrink-0"
                    title="حذف القيمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Value Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <input
                type="text"
                value={newValueTitle}
                onChange={(e) => setNewValueTitle(e.target.value)}
                placeholder="عنوان قيمة جديدة (مثال: حلول مبتكرة)..."
                className="w-full sm:w-1/3 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                type="text"
                value={newValueDesc}
                onChange={(e) => setNewValueDesc(e.target.value)}
                placeholder="تفاصيل وشرح القيمة الجديدة..."
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddValue();
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddValue}>
                <Plus className="w-4 h-4 ml-1" />
                <span>إضافة قيمة</span>
              </Button>
            </div>
          </div>

          {/* Section 3: Why Choose Us Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>٣. قسم لماذا تختارنا (Why Choose Us Section)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="النص الصغير العلوي (Eyebrow)"
                value={whyUsEyebrow}
                onChange={(e) => setWhyUsEyebrow(e.target.value)}
                placeholder="مثال: سر تميزنا واختيار العملاء لنا"
                required
              />

              <Input
                label="عنوان القسم"
                value={whyUsTitle}
                onChange={(e) => setWhyUsTitle(e.target.value)}
                placeholder="مثال: لماذا الأخوة لحلول الألومنيوم؟"
                required
              />
            </div>

            {/* Why Us Image */}
            <div className="pt-2">
              <ImageUploader
                value={whyUsImage}
                onChange={(url) => setWhyUsImage(url)}
                label="صورة قسم لماذا تختارنا"
              />
            </div>

            {/* Why Us Features List */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                عناصر ومميزات قسم لماذا تختارنا ({whyUsFeaturesList.length} ميزة)
              </label>

              <div className="space-y-3">
                {whyUsFeaturesList.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60"
                  >
                    <div className="w-full sm:w-1/3">
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...whyUsFeaturesList];
                          updated[idx].title = e.target.value;
                          setWhyUsFeaturesList(updated);
                        }}
                        placeholder="عنوان الميزة (مثال: تصميمات عصرية)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={feat.description}
                        onChange={(e) => {
                          const updated = [...whyUsFeaturesList];
                          updated[idx].description = e.target.value;
                          setWhyUsFeaturesList(updated);
                        }}
                        placeholder="تفاصيل وشرح الميزة..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWhyUsFeature(idx)}
                      className="p-2 text-rose-600 hover:bg-rose-100/60 rounded-lg transition shrink-0"
                      title="حذف الميزة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Why Us Feature Box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                <input
                  type="text"
                  value={newWhyUsTitle}
                  onChange={(e) => setNewWhyUsTitle(e.target.value)}
                  placeholder="عنوان ميزة جديدة..."
                  className="w-full sm:w-1/3 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="text"
                  value={newWhyUsDesc}
                  onChange={(e) => setNewWhyUsDesc(e.target.value)}
                  placeholder="تفاصيل وشرح الميزة الجديدة..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWhyUsFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddWhyUsFeature}>
                  <Plus className="w-4 h-4 ml-1" />
                  <span>إضافة ميزة</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Vision & Mission */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>٤. الرؤية والرسالة (Vision & Mission)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رؤيتنا (Vision)</label>
                <textarea
                  rows={3}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رسالتنا (Mission)</label>
                <textarea
                  rows={3}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ كامل محتوى صفحة من نحن'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
