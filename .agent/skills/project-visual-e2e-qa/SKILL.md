---
name: project-visual-e2e-qa
description: Dinamik İstasyon projesindeki frontend/modül teslimlerinde Browser Use ile görsel ve işlevsel uçtan uca kalite denetimi yapar. Kullanıcı "uçtan uca test et", "görsel hata var mı bak", "denetle", "test et", "tamamlandı demeden kontrol et", "Browser Use ile kontrol et" veya benzeri bir modül/arayüz doğrulama isteği verdiğinde kullan.
---

# Project Visual E2E QA

## Amaç

Modülü sadece derleme ve happy-path ile değil, öğrencinin gördüğü gerçek ekran kalitesiyle teslim etmek. "Bitti" demeden önce ana deney, kontrol paneli, görev akışı, AstroBot geri bildirimi, mobil/embed davranışı ve console sağlığı birlikte doğrulanır.

## Zorunlu Akış

1. **Bağlamı yükle**
   - İlgili module route, registry kaydı ve ana dosyaları oku.
   - Gerekirse `docs/MODULES.md` ve `docs/MEB_ATOMLARI.md` ile kazanım kapsamını doğrula.

2. **Browser Use ile canlı aç**
   - Localhost/embed URL'yi Browser Use `iab` backend ile aç.
   - MCP Docker browser araçlarını kullanma.
   - Her önemli sahnede screenshot al; sadece DOM veya test id varlığına güvenme.

3. **İlk viewport kontrolü yap**
   - Görünür Chrome/Playwright penceresinde gri boş alan varsa önce QA kurulumunu kontrol et: `window.innerWidth/innerHeight`, `window.outerWidth/outerHeight`, `#root` rect ve `documentElement` ölçüleri eşleşiyor mu? Playwright `page.setViewportSize(1488,768)` kullanıp Chrome penceresini daha büyük bırakırsan uygulama küçük bir viewport olarak kalır ve dışı gri görünür; bu modül hatası değil, test kurulumu hatasıdır.
   - Kiosk/desktop görsel QA için screenshot almadan önce viewport ile görünür pencereyi eşleştir veya yalnız gerçek viewport screenshotına göre karar ver. Gri letterbox görüntüsü varsa modülü puanlama; önce pencere/viewport eşleşmesini düzeltip tekrar bak.
   - Ana deney, kontrol paneli ve ana aksiyonlar ilk ekranda görünür mü?
   - Yatay taşma, kırpılma, üst üste binme, düşük kontrast, okunmayan metin veya anlamsız görünen şekil/blok var mı?
   - Animasyonların oturması için kısa bekleyip ikinci screenshot al.

4. **Her görev sahnesini ayrı denetle**
   - Yanlış deneme: AstroBot hata mesajı geliyor mu, UI kilitleniyor mu?
   - Doğru deneme: sahne matematiksel olarak anlamlı biçimde değişiyor mu?
   - Son görev: completion ekranı görünüyor mu?
   - Her sahnede "öğrenci neyle oynayacağını ilk bakışta anlıyor mu?" sorusunu cevapla.

5. **Dar viewport / embed smoke yap**
   - En az bir orta/dar görünümde kontrol paneli, hitbox ve sahne okunabilirliğini kontrol et.
   - SVG/canvas içerikleri viewport dışına fırlamamalı.

6. **Teknik doğrulama yap**
   - `npm run build`
   - `git diff --check`
   - Browser console warning/error delta kontrolü.

7. **Hata bulursan kapalı döngü uygula**
   - Görsel semptomu tarif et.
   - Kod sebebini bul.
   - Düzelt.
   - Aynı sahneyi Browser Use ile tekrar screenshot/e2e doğrula.
   - Finalde neden kaçtığını ve hangi testin eksik olduğunu açıkça söyle.

## Teslim Kriteri

Kanıt olmadan "bitti" deme. Final cevapta kısa şekilde şunları belirt:

- Bulunan görsel/işlevsel sorunlar.
- Düzeltilen dosyalar.
- Çalıştırılan doğrulamalar.
- Kalan risk veya çalıştırılamayan test varsa nedeni.
