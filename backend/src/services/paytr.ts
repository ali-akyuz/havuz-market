/**
 * services/paytr.ts — PayTR iFrame Token Uretim Servisi
 *
 * PayTR ile odeme almak icin once bir "token" almamiz gerekiyor.
 * Bu token, PayTR'nin bize gonderdigi gecici bir anahtardir ve
 * kullanicinin tarayicisinda gosterecegimiz iFrame URL'sini olusturmak icin kullanilir.
 *
 * Akis soyle:
 *   Biz → PayTR API'sine token istegi gonderiyoruz (bu dosya)
 *   PayTR → Bize bir token gonderiyor
 *   Biz → O token ile iFrame URL'si olusturuyoruz: /odeme/guvenli/{token}
 *   Kullanici → O URL'yi iFrame olarak tarayicisinda goruyor ve kart bilgisini giriyor
 *
 * NEDEN SUNUCU TARAFI?
 * Token uretimi icin merchant_key ve merchant_salt gizli bilgilerini kullaniyoruz.
 * Bu bilgileri tarayiciya (frontend'e) gondermek TEHLIKELIDIR. O yuzden
 * token uretimi sadece backend'de (sunucu tarafinda) gerceklesir.
 *
 * KART BILGISI:
 * Bu dosyada kart numarasi, CVV veya son kullanma tarihi ISLENMEZ.
 * Kullanici kart bilgisini dogrudan PayTR'nin iFrame'ine girer; bize gelmez.
 */

import crypto from 'crypto';

// PayTR sepetindeki her bir urun satiri icin kullanilan tip tanimi.
// PayTR bu bilgileri odeme ozeti gostermek icin kullanir.
export interface PayTRBasketItem {
  name: string;
  price: string; // TL formatinda olmali, ornegin: "1500.00" (kurus degil!)
  quantity: number;
}

// createPayTRToken fonksiyonuna verilecek tum parametreler bu tipte tanimlidir.
export interface PayTRTokenRequest {
  orderCode: string;
  totalKurus: number;      // Veritabanindan gelen toplam tutar (kurus cinsinden)
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  customerIp: string;      // PayTR dolandiricilik onlemek icin IP adresini kontrol eder
  basketItems: PayTRBasketItem[];
}

// Fonksiyonun donecegi deger: token ve iFrame URL'si
export interface PayTRTokenResult {
  token: string;
  iframeUrl: string;
}

/**
 * PayTR API'sine istek atar ve iFrame token'i olusturur.
 *
 * ONEMLI: Veritabanindaki fiyatlar zaten KURUS cinsindendir (ornegin 15000 = 150 TL).
 * PayTR de payment_amount'u KURUS bekler. Bu yuzden * 100 YAPMIYORUZ.
 * Bu hatay yaparsaniz odeme tutari 100 kat fazla gorunur!
 */
export async function createPayTRToken(req: PayTRTokenRequest): Promise<PayTRTokenResult> {
  // .env dosyasindan gizli bilgileri okuyoruz.
  // Bu bilgileri kod icine yazmayiz (hardcode) — cunku .env git'e eklenmez
  // ve boylece gizli bilgileri korumaya almis oluruz.
  const merchantId   = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey  = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;

  if (!merchantId || !merchantKey || !merchantSalt) {
    throw new Error(
      'PayTR baglanti bilgileri bulunamadi. backend/.env dosyasina PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT degerlerini eklemeniz gerekiyor.'
    );
  }

  // Odeme tamamlaninca kullanicinin yonlendirilecegi sayfalar
  const frontendUrl = process.env.FRONTEND_URL       || 'http://localhost:3000';
  const backendUrl  = process.env.BACKEND_PUBLIC_URL || 'http://localhost:4000';

  const merchantOkUrl   = `${frontendUrl}/payment/success?orderCode=${req.orderCode}`;
  const merchantFailUrl = `${frontendUrl}/payment/fail?orderCode=${req.orderCode}`;

  // PayTR odeme sonucunu bu adrese POST eder (callback).
  // NOT: PayTR'nin bu URL'ye ulasabilmesi icin internetten eriselebilir olmasi lazim.
  // Lokalden test icin ngrok kullanilmali: ngrok http 4000
  const callbackUrl = `${backendUrl}/api/paytr/callback`;

  // payment_amount kurus cinsinden gonderilir (veritabanindaki deger aynen kullanilir)
  const paymentAmount = req.totalKurus.toString();

  // PayTR sepet formati: [[urun_adi, birim_fiyat_TL, adet], ...]
  // Ornek: [["Havuz Robotu", "1500.00", 2], ...]
  // Oncelikle JSON dizisi olusturuyoruz, sonra base64'e ceviriyoruz.
  // PayTR bu formati zorunlu kilmistir.
  const basket     = req.basketItems.map((item) => [item.name, item.price, item.quantity]);
  const userBasket = Buffer.from(JSON.stringify(basket)).toString('base64');

  // .env'den alinmayan degerler icin mantikli varsayilanlar tanimliyoruz
  const testMode       = process.env.PAYTR_TEST_MODE      ?? '1'; // Varsayilan: test modu
  const debugOn        = process.env.PAYTR_DEBUG_ON        ?? '1';
  const noInstallment  = process.env.PAYTR_NO_INSTALLMENT  ?? '0';
  const maxInstallment = process.env.PAYTR_MAX_INSTALLMENT ?? '0';
  const currency       = process.env.PAYTR_CURRENCY        ?? 'TL';
  const lang           = process.env.PAYTR_LANG            ?? 'tr';

  // HASH HESAPLAMA
  // PayTR, istegimizin gercekten bizden geldigini dogrulamak icin bir hash sistemi kullanir.
  // Bu hash'i olusturmak icin belirli alanlari sira ile birlestirir,
  // sonra HMAC-SHA256 algoritmasi ile merchant_key kullanarak sifreler ve base64'e ceviririz.
  //
  // Hash icin kullanilan alan sirasi (PayTR dokumantasyonundan):
  // merchant_id + user_ip + merchant_oid + email + payment_amount
  // + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
  //
  // Bu sirayi degistirirseniz PayTR "Hash Hatasi" dondurecektir!
  const hashStr = [
    merchantId,
    req.customerIp,
    req.orderCode,
    req.customerEmail,
    paymentAmount,
    userBasket,
    noInstallment,
    maxInstallment,
    currency,
    testMode,
    merchantSalt,
  ].join('');

  // Node.js'in dahili crypto modulu ile HMAC-SHA256 hash olusturuyoruz.
  // Harici bir kutuphane kullanmiyoruz; bu hem daha guvenli hem de hizlidir.
  const paytrToken = crypto
    .createHmac('sha256', merchantKey)
    .update(hashStr)
    .digest('base64');

  // PayTR API'sine gondermek icin form verisi hazirliyoruz.
  // API "application/x-www-form-urlencoded" formatinda veri bekliyor,
  // JSON degil. URLSearchParams bunu otomatik yapiyor.
  const formData = new URLSearchParams({
    merchant_id:       merchantId,
    user_ip:           req.customerIp,
    merchant_oid:      req.orderCode,   // Siparisimizin benzersiz kodu (HM-XXXXXXXX)
    email:             req.customerEmail,
    payment_amount:    paymentAmount,
    paytr_token:       paytrToken,      // Yukarida hesapladigimiz guvenlik hash'i
    user_basket:       userBasket,
    debug_on:          debugOn,
    no_installment:    noInstallment,
    max_installment:   maxInstallment,
    user_name:         req.customerName,
    user_address:      req.address,
    user_phone:        req.customerPhone,
    merchant_ok_url:   merchantOkUrl,   // Basarili odeme sonrasi kullanicinin yonlenecegi URL
    merchant_fail_url: merchantFailUrl, // Basarisiz odeme sonrasi yonlenecegi URL
    callback_link:     callbackUrl,     // PayTR'nin sonucu POST edecegi sunucu adresi
    test_mode:         testMode,
    lang:              lang,
    currency:          currency,
    client_lang:       lang,
  });

  // PayTR token API'sine istek gonderiyoruz
  const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`PayTR API'sine ulasilamadi: HTTP ${response.status}`);
  }

  const result = (await response.json()) as { status: string; token?: string; reason?: string };

  // PayTR "failed" dondurduysa neden sorusunun cevabini hataya ekliyoruz
  if (result.status !== 'success' || !result.token) {
    throw new Error(`PayTR token alinamadi: ${result.reason ?? 'PayTR bilinmeyen bir hata bildirdi'}`);
  }

  // Basarili! Token ve kullaniciya gosterecegimiz iFrame URL'sini donuyoruz.
  return {
    token: result.token,
    iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
  };
}