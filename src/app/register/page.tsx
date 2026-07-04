import Link from "next/link";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="text-3xl font-black text-navy-900 tracking-tighter">
            Havuz<span className="text-turquoise-500">Market</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-navy-900">
          Yeni hesap oluşturun
        </h2>
        <p className="mt-2 text-center text-sm text-navy-600">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="font-semibold text-turquoise-600 hover:text-turquoise-500 transition-colors">
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-navy-900/5 sm:rounded-2xl sm:px-10 border border-navy-100">
          <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-navy-900">
                Ad Soyad
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-navy-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 placeholder:text-navy-300 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-navy-900">
                E-posta Adresi
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-navy-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 placeholder:text-navy-300 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold leading-6 text-navy-900">
                Şifre
              </label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-navy-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 placeholder:text-navy-300 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-navy-300 text-turquoise-600 focus:ring-turquoise-600 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="terms" className="text-navy-600">
                  <a href="#" className="font-semibold text-turquoise-600 hover:text-turquoise-500 transition-colors">Kullanım Koşulları</a>'nı ve <a href="#" className="font-semibold text-turquoise-600 hover:text-turquoise-500 transition-colors">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-turquoise-500 px-3 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-turquoise-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise-600 transition-all hover:shadow-lg hover:shadow-turquoise-500/30"
                onClick={() => alert("Kayıt olma özelliği şu an için aktif değildir. (Phase 2 Mockup)")}
              >
                Kayıt Ol <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-navy-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-navy-500">Demo Bilgilendirmesi</span>
              </div>
            </div>
            
            <div className="mt-6 text-center text-xs text-navy-400 bg-navy-50 p-4 rounded-xl border border-navy-100">
              Bu sayfa bir stajyer projesi (Phase 2) için hazırlanan arayüz (mockup) tasarımıdır. Arka planda herhangi bir kullanıcı veritabanı bulunmamaktadır.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
