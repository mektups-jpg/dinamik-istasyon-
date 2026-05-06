# 10-05 İşaret Tablosu Tarayıcısı

## Durum

Done. SSOT atomları `MAT.10.2.6.1` ve `MAT.10.2.6.2` olarak doğrulandı; uygulama, Browser Use canlı QA, Gemini 3 Flash kapanışı ve doküman senkronu tamamlandı.

## Amaç
10. sınıf öğrencisine ikinci dereceden eşitsizliklerde işaret tablosunu ezber şeması olarak değil, kök duraklarının böldüğü sayı doğrusu üzerinde çalışan artı/eksi lazer bandı olarak sezdirme. Öğrenci çözüm aralığını fiziksel tarayıcıyla seçer.

## Atom Kapsamı
- `MAT.10.2.6.1`: İkinci dereceden denklemlerle kurulan büyüklük problemlerini işaret tablosuyla çözer.
- `MAT.10.2.6.2`: İkinci dereceden denklemlerle kurulan küçüklük problemlerini işaret tablosuyla çözer.

## Kapsam Dışı
- Ters fonksiyon ve tanım kümesi tekrar edilmez.
- Genel parabol dönüşümleri tekrar edilmez; `10-01 Parabol Şekil Stüdyosu` içinde tamamlandı.
- Rasyonel/polinom genel işaret tablosu 12. sınıf kapsamına bırakılır.

## Ana Oyuncak
Tek sahne bir **işaret bandı tarayıcısı** olur:
- Sayı doğrusunda iki kök durağı bulunur.
- `x=2` ve `x=3` sabit hedef lazerleri ile hareketli `sol/sağ` kök tutamaçları ayrı görünür.
- Parabol sensörü köklerin dış aralıklarını ve iç aralığını farklı renkte yakar.
- `>0` görevinde pozitif enerji bölgeleri, `<0` görevinde negatif enerji bölgesi seçilir.
- Öğrenci aralık kapılarını sürükler; doğru bölgeler seçilince çözüm ışını kilitlenir.

## Görev Akışı
1. `kök durakları`: `x²-5x+6=0` için kök duraklarını 2 ve 3 noktalarına getir.
2. `büyüklük bandı`: `x²-5x+6>0` için dış aralıkları seç.
3. `küçüklük bandı`: `x²-5x+6<0` için köklerin arasını seç.

## Route
- `/embed/algebra/sign-table-scanner`

## Test ID Kontratı
- `sign-table-scene`
- `sign-root-left`
- `sign-root-right`
- `sign-positive-band`
- `sign-negative-band`
- `sign-check`
- `sign-reset`

## QA Planı
- `npm run module:check -- sign-table-scanner`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/sign-table-scanner?qa=1` açılır.
  - Kök durakları, pozitif/negatif bantlar, onay/reset görünür.
  - Yanlış aralık AstroBot hata mesajı üretir.
  - `Home` fallback aktif kök veya bant seçimini hedefe taşır.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - İşaret tablosu aralık mantığının görsel olarak sezilip sezilmediği, açık/kapalı uç ve pozitif/negatif bölgelerin karışıp karışmadığı değerlendirilir.

## Güncel Test Durumu
- `npm run module:check -- sign-table-scanner`: 20 pass / 0 warn / 0 fail.
- `npm run build`: geçti.
- `git diff --check`: temiz.
- Statik pedagojik düzeltme: hareketli kök tutamaçları artık hedef değer gibi `2/3` yazmıyor; sabit hedefler `x=2`, `x=3` lazer rozetleriyle ayrıldı.
- Browser Use IAB: 2026-05-06 manuel handoff turunda backend bağlandı. Canlı QA'da kök tutamaçlarının görsel hedefe sürüklenince state hedefe ulaşmadığı yakalandı; kök progress hesabı kendi görsel hareket aralığına bağlandı ve `aria-valuenow` eklendi.
- Browser Use canlı QA: yanlış deneme, kök sürükleme, pozitif bant, negatif bant, completion, console `[]` ve dar/embed smoke geçti. Screenshot kanıtları `.agent/browser-use-shots/10-05-*.png`.
- Gemini 3 Flash:
  - İlk tur 88/100 PASS_WITH_WARNINGS verdi ama köklerin çakışma belirsizliği ve eşitsizlik sürecinin kök görevinde yeterince görünmemesi için must-fix çıkardı.
  - Düzeltmeler: sol ve sağ kökler ayrı raylarla ve `çakışmaz boşluk` etiketiyle görselleştirildi; akış etiketi ilk görevden itibaren görünür oldu; hedef lazerleri kalınlaştırıldı; işaret kuralı açıklaması ve ince metinler güçlendirildi.
  - Browser Use tekrarında `/embed/algebra/sign-table-scanner?qa=1&run=post-gemini-fix` üzerinde yanlış deneme, üç görev, completion ve console `[]` geçti. Screenshot kanıtları `.agent/browser-use-shots/10-05-postfix-*.png`.
  - Final tur `.agent/gemini-reports/10-05-sign-table-scanner-final.txt`: 96/100 PASS, must-fix yok.
