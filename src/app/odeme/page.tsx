"use client";

import { useCartStore } from "@/lib/store/useCart";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, CreditCard, Lock, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; district: string; zipCode: string;
  cardName: string; cardNumber: string; expiry: string; cvv: string;
  saveCard: boolean;
}

type FieldErrors = Partial<Record<keyof FormData, string>>;

interface FieldProps {
  label: string;
  field: keyof FormData;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  placeholder?: string;
  className?: string;
  onChange?: (val: string) => void;
  update?: (field: keyof FormData, val: string) => void;
  value: string;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Field = ({
  label, field, type = "text", inputMode, placeholder, className = "",
  onChange, update, value, error, onFocus, onBlur
}: FieldProps) => (
  <div className={className}>
    <label htmlFor={field} className="block text-sm font-semibold text-navy-700 mb-1.5">{label}</label>
    <input
      id={field}
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
        else if (update) update(field, e.target.value);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={cn(
        "w-full h-12 px-4 rounded-xl border-2 text-sm bg-white text-navy-900 transition-colors focus:outline-none placeholder:text-navy-300",
        error ? "border-red-300 focus:border-red-400" : "border-navy-100 focus:border-turquoise-400"
      )}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", district: "", zipCode: "",
    cardName: "", cardNumber: "", expiry: "", cvv: "",
    saveCard: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/sepet");
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) return null;

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 49.90;
  const total = subtotal + shipping;

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const formatName = (val: string) => val.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, "");

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

  const formatZipCode = (val: string) => val.replace(/\D/g, "").slice(0, 5);

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/");

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.firstName.trim()) e.firstName = "Ad gerekli";
    if (!form.lastName.trim()) e.lastName = "Soyad gerekli";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) e.email = "Geçerli e-posta girin";
    if (form.phone.replace(/\D/g, "").length < 11) e.phone = "11 haneli telefon girin";
    if (!form.address.trim()) e.address = "Adres gerekli";
    if (!form.city.trim()) e.city = "Şehir gerekli";
    if (!form.district.trim()) e.district = "İlçe gerekli";
    if (form.zipCode.length < 5) e.zipCode = "Geçerli posta kodu girin";
    if (!form.cardName.trim()) e.cardName = "Kart sahibi adı gerekli";
    if (form.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Geçerli kart numarası girin";
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(form.expiry)) e.expiry = "AA/YY formatında girin";
    if (form.cvv.length < 3) e.cvv = "CVV gerekli";
    setErrors(e);
    const isValid = Object.keys(e).length === 0;
    if (!isValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    
    // Generate order ID
    const generateOrderCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `HM-${code}`;
    };
    
    const orderId = generateOrderCode();
    sessionStorage.setItem("lastOrderId", orderId);

    setTimeout(() => {
      router.push("/siparis-basarili");
    }, 1200);
  };


  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-navy-900">Güvenli Ödeme</h1>
          <div className="flex items-center gap-2 text-sm text-navy-500">
            <Lock className="w-4 h-4 text-green-500" />
            256-bit SSL Şifreleme
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Sepet", "Adres & Ödeme", "Onay"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={cn("flex items-center gap-2", i < 2 ? "text-turquoise-600" : "text-navy-400")}>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  i === 0 ? "bg-turquoise-100 text-turquoise-700" :
                  i === 1 ? "bg-turquoise-500 text-white" :
                  "bg-navy-100 text-navy-400"
                )}>
                  {i === 0 ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{step}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-navy-200" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Forms */}
            <div className="flex-grow space-y-6">
              {/* Address */}
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <h2 className="font-black text-navy-900 text-lg mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-navy-900 text-white text-sm flex items-center justify-center font-bold">1</span>
                  Teslimat Adresi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Ad" field="firstName" value={form.firstName} onChange={(v) => update("firstName", formatName(v))} error={errors.firstName} placeholder="Ahmet" />
                  <Field label="Soyad" field="lastName" value={form.lastName} onChange={(v) => update("lastName", formatName(v))} error={errors.lastName} placeholder="Yılmaz" />
                  <Field label="E-posta" field="email" type="email" inputMode="email" value={form.email} update={update} error={errors.email} placeholder="ahmet@email.com" className="sm:col-span-2" />
                  <Field label="Telefon" field="phone" type="tel" inputMode="numeric" value={form.phone} onChange={(v) => update("phone", formatPhone(v))} error={errors.phone} placeholder="0534 792 65 83" />
                  <Field label="Şehir" field="city" value={form.city} onChange={(v) => update("city", formatName(v))} error={errors.city} placeholder="İstanbul" />
                  <Field label="İlçe" field="district" value={form.district} onChange={(v) => update("district", formatName(v))} error={errors.district} placeholder="Kadıköy" />
                  <Field label="Posta Kodu" field="zipCode" type="text" inputMode="numeric" value={form.zipCode} onChange={(v) => update("zipCode", formatZipCode(v))} error={errors.zipCode} placeholder="34700" />
                  <Field label="Açık Adres" field="address" value={form.address} update={update} error={errors.address} placeholder="Mahalle, sokak, no..." className="sm:col-span-2" />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-navy-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-black text-navy-900 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-navy-900 text-white text-sm flex items-center justify-center font-bold">2</span>
                    Ödeme Bilgileri
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <Shield className="w-3.5 h-3.5" />
                    Güvenli Ödeme
                  </div>
                </div>

                {/* Card visual 3D */}
                <div className="relative w-full max-w-xs mx-auto mb-8 h-48 perspective-1000" style={{ perspective: "1000px" }}>
                  <div 
                    className="w-full h-full relative transition-transform duration-700 shadow-xl rounded-2xl" 
                    style={{ transformStyle: "preserve-3d", transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                  >
                    {/* Front Side */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl p-6 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-turquoise-500/20 rounded-full blur-2xl" />
                      <div className="text-navy-400 text-xs mb-8 font-mono uppercase tracking-widest">Kredi / Banka Kartı</div>
                      <div className="text-white font-mono text-lg tracking-[4px] mb-4">
                        {form.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-navy-400 text-[9px] uppercase tracking-widest mb-0.5">Kart Sahibi</div>
                          <div className="text-white text-sm font-semibold">{form.cardName || "AD SOYAD"}</div>
                        </div>
                        <div>
                          <div className="text-navy-400 text-[9px] uppercase tracking-widest mb-0.5">Son Kullanma</div>
                          <div className="text-white text-sm font-semibold">{form.expiry || "AA/YY"}</div>
                        </div>
                        <CreditCard className="w-8 h-8 text-turquoise-400 self-end" />
                      </div>
                    </div>
                    
                    {/* Back Side */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <div className="w-full h-10 bg-black/80 mt-6" />
                      <div className="px-6 mt-4">
                        <div className="w-full h-8 bg-white/10 rounded flex items-center justify-end px-3">
                          <span className="text-white font-mono tracking-widest">{form.cvv || "•••"}</span>
                        </div>
                        <div className="text-[9px] text-navy-400 mt-2 text-right uppercase tracking-widest">CVV / Güvenlik Kodu</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Kart Üzerindeki İsim" field="cardName" value={form.cardName} error={errors.cardName}
                    placeholder="AHMET YILMAZ" className="sm:col-span-2"
                    onChange={(v) => update("cardName", formatName(v).toUpperCase())}
                  />
                  <Field
                    label="Kart Numarası" field="cardNumber" value={form.cardNumber} error={errors.cardNumber}
                    placeholder="0000 0000 0000 0000" className="sm:col-span-2"
                    onChange={(v) => update("cardNumber", formatCard(v))}
                  />
                  <Field
                    label="Son Kullanma Tarihi" field="expiry" value={form.expiry} error={errors.expiry}
                    placeholder="AA/YY"
                    onChange={(v) => update("expiry", formatExpiry(v))}
                  />
                  <Field
                    label="CVV" field="cvv" type="text" value={form.cvv} error={errors.cvv}
                    placeholder="•••"
                    onChange={(v) => update("cvv", v.replace(/\D/g, "").slice(0, 4))}
                    onFocus={() => setIsCardFlipped(true)}
                    onBlur={() => setIsCardFlipped(false)}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-navy-100 p-6 sticky top-24">
                <h2 className="font-black text-navy-900 text-lg mb-5">Sipariş Özeti</h2>

                <div className="space-y-3 max-h-56 overflow-y-auto mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-50 flex-shrink-0 border border-navy-100">
                        <Image src={item.product.images[0]} alt={item.product.title} fill className="object-contain p-1" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-navy-800 line-clamp-2">{item.product.title}</p>
                        <p className="text-xs text-navy-500">{item.quantity} adet</p>
                      </div>
                      <span className="text-sm font-bold text-navy-900 flex-shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 py-4 border-t border-navy-100 mb-4">
                  <div className="flex justify-between text-sm text-navy-600">
                    <span>Ara Toplam</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-navy-600">
                    <span>Kargo</span>
                    <span className={shipping === 0 ? "font-semibold text-green-600" : "font-semibold"}>{shipping === 0 ? "Ücretsiz" : formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-navy-100 mb-6">
                  <span className="font-black text-navy-900">Toplam</span>
                  <span className="text-2xl font-black text-turquoise-600">{formatCurrency(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 bg-turquoise-500 hover:bg-turquoise-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-turquoise-500/20 text-base"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      İşleniyor...
                    </div>
                  ) : (
                    <><Lock className="w-4 h-4" /> Siparişi Tamamla</>
                  )}
                </button>

                <p className="text-xs text-navy-400 text-center mt-3">
                  "Siparişi Tamamla" butonuna basarak{" "}
                  <Link href="/satis-sozlesmesi" target="_blank" rel="noopener noreferrer" className="underline hover:text-turquoise-500 transition-colors">Satış Sözleşmesi</Link>'ni kabul edersiniz.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
