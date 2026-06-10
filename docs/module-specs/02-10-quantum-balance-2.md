# 02-10 Eksik Sayı Terazisi

## Kapsam

- Module id: quantum-balance-2
- Route: /embed/numbers/quantum-balance-2
- Sınıf: 2
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-10 Kaptan canlı görsel onayı alındı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.2.2.3.1: Toplama işlemindeki bir toplanan eksik olduğunda çıkarma ile bulur.
- MAT.2.2.3.2: Çıkarma işlemindeki eksileni ters işlem yaklaşımıyla bulur.
- MAT.2.2.3.3: Çıkarma işlemindeki çıkanı ters işlem yaklaşımıyla bulur.
- MAT.2.2.6.1: Toplama/çıkarma içeren iki taraflı eşitliği terazi dengesinde kurar.

## Deneyim Notu

Öğrenci iki kefeli neon terazide eksik sayı yerini görür. Büyük sayı kartlarından birini seçince terazi anında kırmızı uyarı ya da yeşil denge ışığı verir. Görevler eksik toplanan, eksilen, çıkan ve iki işlemli eşitlik akışını 2. sınıf dilinde tamamlatır.

## 2026-06-10 Pedagoji ve Dil Cilası

- Çocuk ekranında teknik `Kuantum`, `kilit`, `küp` ve `yuva` dili azaltıldı; ad `Eksik Sayı Terazisi` oldu.
- İlk görev `Boş küp kaç?` yerine `Soru işareti yerine hangi sayı gelir?` diliyle netleştirildi.
- Sağ panelde uzun soru tekrarı azaltıldı; cevap kartı alanı eylemi söyler, `Terazi hedefi` kutusu yalnız kısa eşitliği gösterir.
- Kefe içindeki yükler artık `+4` gibi sayı etiketi kullanmaz; tüm yük sembollerle gösterilir, `+` işareti işlemle karışmaz.
- `? - 7 = 10` gibi başlangıcı bul görevlerinde sol kefe yükü çıkarılan sayı yerine başlangıç sayısını temsil edecek şekilde düzeltildi.
- Görev havuzları 4 örnekten 8 örneğe çıkarıldı; tekrar oynama ezber riski azaltıldı.
- Kaptan canlı görsel onayıyla `Showcase Ready / Vitrin Hazır` yapıldı.

## QA Kontratı

- Route: /embed/numbers/quantum-balance-2
- Sahne test id: `quantum-balance-2-stage`
- Panel test id: `quantum-balance-2-control-panel`
- Cevap kartları test id: `quantum-balance-2-choice`
- Feedback test id: `quantum-balance-2-feedback`
- Completion test id: `quantum-balance-2-complete`
- Tekrar oynama test id: `quantum-balance-2-restart`
