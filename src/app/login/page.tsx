"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuth";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        router.push("/");
      } else {
        setError(res.message || "Giriş başarısız.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Giriş yapılırken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="text-3xl font-black text-navy-900 tracking-tighter">
            Havuz<span className="text-turquoise-500">Market</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-navy-900">
          Hesabınıza giriş yapın
        </h2>
        <p className="mt-2 text-center text-sm text-navy-600">
          Veya{" "}
          <Link href="/register" className="font-semibold text-turquoise-600 hover:text-turquoise-500 transition-colors">
            yeni bir hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-navy-900/5 sm:rounded-2xl sm:px-10 border border-navy-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                {error}
              </div>
            )}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-navy-900 ring-1 ring-inset ring-navy-200 placeholder:text-navy-300 focus:ring-2 focus:ring-inset focus:ring-turquoise-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-navy-300 text-turquoise-600 focus:ring-turquoise-600 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-navy-700 cursor-pointer">
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm leading-6">
                <a href="#" className="font-semibold text-turquoise-600 hover:text-turquoise-500 transition-colors">
                  Şifremi Unuttum
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-turquoise-500 px-3 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-turquoise-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise-600 transition-all hover:shadow-lg hover:shadow-turquoise-500/30 disabled:opacity-70"
              >
                {loading ? "Giriş Yapılıyor..." : (
                  <>
                    Giriş Yap <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

