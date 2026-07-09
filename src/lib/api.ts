/**
 * src/lib/api.ts — Merkezi API İstemcisi (Frontend)
 *
 * Bu dosya, frontend bileşenlerinin backend API'sine istek atmasını sağlar.
 * Tüm fetch çağrıları buradan yapılır, böylece URL tek bir yerden yönetilir.
 *
 * NEXT_PUBLIC_API_URL → .env.local dosyasında tanımlıdır.
 * (örn: http://localhost:4000/api)
 */

import { useAuthStore } from "./store/useAuth";

// Backend API'nin temel URL'si
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Temel fetch yardımcısı.
 * Hata durumunda anlaşılır bir mesaj fırlatır.
 */
export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const token = useAuthStore.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  // HTTP 4xx veya 5xx hatası varsa JSON'dan mesajı al ve fırlat
  if (!res.ok) {
    let message = 'Sunucudan hata yanıtı alındı.';
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {
      // JSON parse edilemezse default mesajı kullan
    }
    throw new Error(message);
  }

  return res.json();
};
