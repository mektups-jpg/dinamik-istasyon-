# 📜 Kural Seti: UI, UX ve Vibe Tasarım Kılavuzu

**Açıklama:** Projenin "Siber / Uzay / Eğitim" estetiğine ("Vibe") sadık kalmak için katı tasarım kuralları ve Framer Motion standartları.

## 1. Tema ve Renk Paleti (Siber-Eğitim Uzayı)
- **Arka Plan (Void/Space):** Ana arka plan daima uzay derinliğini veren koyu lacivert/siyah tonlarıdır (`#050510` veya türevleri). 
- **Vurgu (Neon):** Ana aksiyonlar ve doğrular için Mavi-Neon (`#00E5FF`) ve Yeşim-Neon (`#00FF88`), hatalar için Kırmızı/Pembe-Neon (`#FF0055`), diğer veri kümeleri için Mor-Neon (`#B388FF`) kullanılmalıdır.
- **Gölge ve Glow:** Butonlar ve önemli paneller yalnızca gölgeye (shadow) değil, neon yansımaya (glow) sahip olmalıdır (`shadow-[0_0_20px_#00E5FF]`).

## 2. Cam Efekti ve Derinlik (Glassmorphism)
- Bilgi panelleri, bot HUD'ları ve modal'lar uzayda süzülen holografik camlar gibi tasarlanmalıdır.
- Tailwind sınıfları: `bg-white/5` (veya türevleri), `backdrop-blur-md` veya `backdrop-blur-2xl`, ince, saydam kenarlık: `border border-white/10`.

## 3. Dinamizm ve "Juice" (Oyun Hissiyatı - Framer Motion)
- **Hareketsiz UI Yasaktır:** Her buton bir hover (`hover:scale-105`) veya tap (`whileTap={{ scale: 0.95 }}`) etkileşimi barındırmalıdır.
- **AnimatePresence:** Arayüze giren veya çıkan elementler bir anda kaybolmamalı veya belirmemelidir. `AnimatePresence` ile yumuşak geçişler (`opacity`, `y` veya `scale`) kullanılmalıdır.
- **Tatmin Edici Geri Bildirim:** Kazanım anlarında veya bir kilit çözüldüğünde ekranda ani parlama ve nabız (pulse) efektleri zorunludur.

## 4. Kullanıcı Deneyimi (UX) Sınırları
- **Eğitim Önceliklidir:** Animasyonlar çok uzun sürmemeli (ortalama 0.2s - 0.5s) ve eğitimin, oyuncunun dikkatinin önüne geçmemelidir.
- **Hitbox Sınırları (Touch Targets):** Mobil ve tablet kullanım düşünülerek tüm tıklanabilir alanların yüksekliği veya genişliği minimum `44px` olmalıdır.
- **Bot Rehberliği:** Ekrandaki hiçbir hata durumu cevapsız kalmamalı, muhakkak `AstroBotHelper` veya eşdeğeri ile açıklanmalıdır.
