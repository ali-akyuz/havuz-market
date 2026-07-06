"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const subjects = [
  "Ürün Hakkında Bilgi",
  "Sipariş Durumu",
  "İade & Değişim",
  "Teknik Destek",
  "Fiyat Teklifi",
  "Toplu Alım",
  "Diğer",
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "", email: "", phone: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPhone = (val: string) => {
    let numbers = val.replace(/\D/g, "");
    if (numbers.length > 0 && !numbers.startsWith("0")) numbers = "0" + numbers;
    numbers = numbers.slice(0, 11);
    let formatted = "";
    for (let i = 0; i < numbers.length; i++) {
      if (i === 4 || i === 7 || i === 9) formatted += " ";
      formatted += numbers[i];
    }
    return formatted;
  };

  const update = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.fullName.trim()) e.fullName = "Ad Soyad gereklidir";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) e.email = "Geçerli bir e-posta girin";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) e.phone = "Geçerli bir telefon numarası girin";
    if (!form.subject) e.subject = "Lütfen bir konu seçin";
    if (form.message.trim().length < 20) e.message = "Mesajınız en az 20 karakter olmalıdır";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const inputClass = (field: keyof FormState) =>
    cn(
      "w-full h-12 px-4 rounded-xl border-2 text-sm bg-white text-navy-900 placeholder:text-navy-300 transition-colors focus:outline-none",
      errors[field]
        ? "border-red-300 focus:border-red-400 bg-red-50/30"
        : "border-navy-100 focus:border-turquoise-400"
    );

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Telefon",
      primary: siteConfig.phone,
      secondary: "Sizi hemen bağlayalım",
      href: siteConfig.phoneHref,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "E-posta",
      primary: siteConfig.email,
      secondary: "Genellikle 4 saat içinde yanıt",
      href: siteConfig.emailHref,
      color: "bg-turquoise-50 text-turquoise-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adres",
      primary: siteConfig.address.line1,
      secondary: siteConfig.address.line2,
      href: siteConfig.address.mapsUrl,
      color: "bg-rose-50 text-rose-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Çalışma Saatleri",
      primary: siteConfig.workingHours.weekdays,
      secondary: siteConfig.workingHours.saturday,
      href: null,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ── */}
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-turquoise-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-navy-400 mb-8">
            <Link href="/" className="hover:text-turquoise-300 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy-200">İletişim</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-turquoise-500/20 border border-turquoise-400/30 rounded-full px-4 py-1.5 mb-6">
              <MessageSquare className="w-3.5 h-3.5 text-turquoise-400" />
              <span className="text-turquoise-300 text-sm font-semibold">Size Yardımcı Olmak İçin Buradayız</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Bizimle İletişime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-turquoise-300 to-turquoise-500">
                Geçin
              </span>
            </h1>
            <p className="text-navy-300 text-lg leading-relaxed">
              Ürün seçimi, sipariş durumu veya teknik destek için alanında uzman ekibimiz
              sizin için burada. Ortalama yanıt süremiz 4 saatin altındadır.
            </p>
          </div>
        </div>
      </section>

      {/* ── İLETİŞİM KARTLARI ── */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map(({ icon, title, primary, secondary, href, color }) => {
            const inner = (
              <div className="bg-white rounded-2xl border border-navy-100 p-6 h-full flex items-start gap-4 hover:shadow-xl hover:shadow-navy-900/8 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-1">{title}</p>
                  {title === "Çalışma Saatleri" && primary.includes(":") ? (
                    <div className="flex flex-col -mt-0.5 mb-0.5">
                      <p className="font-bold text-navy-900 text-sm truncate">{primary.split(':')[0]}:</p>
                      <p className="font-bold text-navy-900 text-sm truncate">{primary.split(':').slice(1).join(':').trim()}</p>
                    </div>
                  ) : (
                    <p className="font-bold text-navy-900 text-sm truncate">{primary}</p>
                  )}
                  <p className="text-xs text-navy-400 mt-0.5">{secondary}</p>
                </div>
              </div>
            );
            return href ? (
              <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div key={title}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* ── FORM + HARİTA ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ─ İletişim Formu ─ */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-navy-100 p-7 lg:p-10">
              <h2 className="text-2xl font-black text-navy-900 mb-2">Bize Mesaj Gönderin</h2>
              <p className="text-navy-500 text-sm mb-8">
                Aşağıdaki formu doldurun, ekibimiz en kısa sürede dönüş yapsın.
              </p>

              {submitted ? (
                /* ── Başarı mesajı ── */
                <div className="flex flex-col items-center text-center py-10">
                  <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center border-2 border-green-100 mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-navy-900 mb-2">Mesajınız İletildi!</h3>
                  <p className="text-navy-500 mb-6 max-w-sm">
                    Talebinizi aldık. Ekibimiz en geç 3-5 iş günü içinde <strong className="text-navy-800">{form.email || "e-posta"}</strong> adresine dönüş yapacaktır.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ fullName: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="text-turquoise-600 font-semibold text-sm hover:underline"
                  >
                    Yeni mesaj gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Ad Soyad + E-posta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                        Ad Soyad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ahmet Yılmaz"
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        className={inputClass("fullName")}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                        E-posta <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="ahmet@email.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass("email")}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Telefon + Konu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                        Telefon <span className="text-navy-400 font-normal">(isteğe bağlı)</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="0534 792 65 83"
                        value={form.phone}
                        onChange={(e) => update("phone", formatPhone(e.target.value))}
                        className={inputClass("phone")}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                        Konu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.subject}
                          onChange={(e) => update("subject", e.target.value)}
                          className={cn(
                            "w-full h-12 px-4 pr-9 rounded-xl border-2 text-sm bg-white text-navy-900 appearance-none transition-colors focus:outline-none cursor-pointer",
                            errors.subject
                              ? "border-red-300 focus:border-red-400"
                              : "border-navy-100 focus:border-turquoise-400",
                            !form.subject && "text-navy-300"
                          )}
                        >
                          <option value="" disabled>Konu seçin...</option>
                          {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 rotate-90 pointer-events-none" />
                      </div>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Mesaj */}
                  <div>
                    <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                      Mesajınız <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Mesajınızı buraya yazın... (en az 20 karakter)"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={5}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border-2 text-sm bg-white text-navy-900 placeholder:text-navy-300 transition-colors focus:outline-none resize-none",
                        errors.message
                          ? "border-red-300 focus:border-red-400 bg-red-50/30"
                          : "border-navy-100 focus:border-turquoise-400"
                      )}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message
                        ? <p className="text-red-500 text-xs">{errors.message}</p>
                        : <span />
                      }
                      <span className={cn("text-xs", form.message.length < 20 ? "text-navy-400" : "text-green-600")}>
                        {form.message.length} / 20+
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-turquoise-500 hover:bg-turquoise-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/20 active:scale-[0.98] text-base"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Mesajı Gönder</>
                    )}
                  </button>

                  <p className="text-xs text-navy-400 text-center">
                    Formu göndererek{" "}
                    <Link href="/gizlilik-politikasi" className="underline hover:text-navy-600">Gizlilik Politikamızı</Link>{" "}
                    kabul etmiş olursunuz.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ─ Sağ panel: Harita + Ek Bilgiler ─ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Harita placeholder */}
            <div className="relative flex-1 min-h-[280px] rounded-3xl overflow-hidden bg-navy-900 border border-navy-800">
              {/* Dekoratif harita benzeri arka plan */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              {/* Dekoratif şehir bloğu göstergeler */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -top-16 -left-20 w-32 h-20 bg-navy-700/60 rounded-lg" />
                  <div className="absolute -top-8 left-8 w-20 h-28 bg-navy-700/60 rounded-lg" />
                  <div className="absolute top-4 -left-28 w-24 h-16 bg-navy-700/60 rounded-lg" />
                  {/* Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-turquoise-500 flex items-center justify-center shadow-2xl shadow-turquoise-500/50 animate-pulse-glow">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-turquoise-400 mt-1 opacity-60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-turquoise-300 mt-0.5 opacity-30" />
                  </div>
                </div>
              </div>
              {/* Address overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-900 to-transparent p-5">
                <p className="text-white font-bold text-sm">{siteConfig.address.line1}</p>
                <p className="text-navy-300 text-xs mt-0.5">{siteConfig.address.line2}</p>
                <a
                  href={siteConfig.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-turquoise-400 hover:text-turquoise-300 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Yol Tarifi Al
                </a>
              </div>
            </div>

            {/* SSS / Hızlı yanıtlar */}
            <div className="bg-white rounded-2xl border border-navy-100 p-6">
              <h3 className="font-black text-navy-900 mb-4">Sık Sorulan Sorular</h3>
              <div className="space-y-4">
                {[
                  { q: "Kargo ne zaman gelir?", a: "Stokta olan ürünler 1-3 iş günü içinde teslim edilir." },
                  { q: "İade nasıl yapabilirim?", a: "14 gün içinde koşulsuz iade hakkınız vardır." },
                  { q: "Teknik destek var mı?", a: "Uzman ekibimiz hft içi 09:00–18:00 hizmetinizdedir." },
                ].map(({ q, a }) => (
                  <div key={q} className="border-b border-navy-50 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-bold text-navy-900 mb-1">{q}</p>
                    <p className="text-xs text-navy-500">{a}</p>
                  </div>
                ))}
              </div>
              <Link href="/sss" className="inline-flex items-center gap-1 mt-4 text-turquoise-600 text-xs font-semibold hover:underline">
                Tüm SSS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
