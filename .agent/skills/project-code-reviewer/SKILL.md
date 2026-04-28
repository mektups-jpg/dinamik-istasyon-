# 🛠️ Skill: Code Reviewer (Kod Denetçisi)

**Tetikleyici:** Geliştirme sürecinin sonunda, büyük bir modül tamamlandığında veya kullanıcı "Bunu bir incele/refactor edelim", "Hata var mı bak" dediğinde.

## 🎯 Amaç
Yazılan kodu yayına (canlıya) almadan veya o modülü terk etmeden önce "Vibe Coder" standartlarına (`docs/rules/` içindeki kurallara) göre otomatik denetimden (Self Check) geçirmek.

## 🔄 İş Akışı
1. **Dosya Taraması:** Son değiştirilen veya kullanıcının gösterdiği ana dosyayı oku (`view_file`).
2. **Kural Denetimi:**
   - **TS/React Kuralları:** `any` kullanılmış mı? Gereksiz `useEffect` re-render tetikliyor mu? `map` içerisinde `key` eksik mi?
   - **Vibe Kuralları:** Arayüz bileşenlerinde Glassmorphism var mı? Bot animasyonu statik kalmış mı? Rengi bizim "Uzay" paletimize uygun mu?
3. **Optimizasyon Raporu:**
   - Hataları doğrudan düzeltmeden önce (Kritik/Küçük) olarak kategorize et.
   - Kullanıcıya: "Kaptan, denetimden geçirdim. Şu 3 noktada Vibe standartlarımızdan sapmışız, düzeltiyorum, onaylıyor musun?" şeklinde bir rapor sun.
4. **Kod Uygulaması:** Onay alındığında `edit_file` işlemi ile performans/stil düzeltmelerini uygula.
