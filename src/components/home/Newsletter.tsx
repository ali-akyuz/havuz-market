"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-turquoise-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-80" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-turquoise-500/10 flex items-center justify-center mx-auto mb-6 border border-turquoise-200">
            <Mail className="w-7 h-7 text-turquoise-600" />
          </div>

          <p className="text-turquoise-600 font-semibold text-sm uppercase tracking-widest mb-3">E-Bülten</p>
          <h2 className="text-3xl lg:text-4xl font-black text-navy-900 mb-4">
            Fırsatları İlk Siz Öğrenin
          </h2>
          <p className="text-navy-500 text-lg mb-10 leading-relaxed">
            Yeni ürünler, özel kampanyalar ve havuz bakım tüyoları için abone olun.
            Spam yok, yalnızca değerli içerik.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 font-semibold px-8 py-4 rounded-2xl">
              <Check className="w-5 h-5" />
              Başarıyla abone oldunuz! Teşekkürler.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="e-posta@adresiniz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-13 px-5 rounded-2xl border-2 border-navy-100 bg-navy-50 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-turquoise-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-navy-900 hover:bg-turquoise-600 disabled:opacity-70 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Abone Ol <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-navy-400 mt-4">
            Abone olarak{" "}
            <a href="#" className="underline hover:text-navy-600">Gizlilik Politikamızı</a>{" "}
            kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </section>
  );
}
