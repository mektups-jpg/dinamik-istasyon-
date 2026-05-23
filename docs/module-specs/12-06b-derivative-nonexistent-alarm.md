# 12-06b Türev Yok Alarm İstasyonu

## Durum
Showcase Ready. Ana uygulamada görünür; Kaptan canlı göz onayıyla vitrine alınmıştır.

## Amaç
Türev Eğim Sürücüsü içindeki yoğun "sivri uç / kopuk pist" yükünü ayırmak. Öğrenci türevin olmadığı iki özel durumu kalabalık kesen-teğet sahnesinde değil, ayrı ve sakin bir alarm istasyonunda görür.

## Atom Kapsamı
- MAT.12.2.4.3: Sivri uçlar (köşeler) gibi türevin alınamadığı özel noktaları grafikte yakalar.
- MAT.12.2.4.4: Fonksiyonun koptuğu (süreksiz) noktalarda türevin yok olduğunu saptar.

## Kapsam Dışı
- Ortalama değişim oranı ve teğet eğimi Türev Eğim Sürücüsü modülündedir.
- Türev alma kuralları 12-07 Derivative Rule Forge modülüne bırakılır.
- Limit ve süreklilik hesapları 12-04 / 12-05 modüllerinde kalır.

## Ana Oyuncak
Ortada büyük bir alarm grafiği bulunur. İlk istasyonda V biçimli sivri uç, soldan ve sağdan gelen eğimlerin tek teğette birleşmediğini gösterir. İkinci istasyonda kopuk grafik, aynı noktada kesintisiz davranış olmadığı için teğetin kurulamadığını gösterir. Öğrenci tarayıcı sürgüsünü kritik noktaya yaklaştırır ve sağ panelden alarm türünü seçer.

## Görev Akışı
1. MAT.12.2.4.3: Sivri uçta soldan ve sağdan eğim farklıdır; tek teğet yoktur.
2. MAT.12.2.4.4: Kopuk grafikte fonksiyon aynı noktada kesintisiz değildir; türev yoktur.

## Route
- /embed/calculus/derivative-nonexistent-alarm

## Test ID Kontratı
- `derivative-nonexistent-alarm-scene`
- `derivative-nonexistent-alarm-manipulator`
- `derivative-nonexistent-alarm-corner`
- `derivative-nonexistent-alarm-gap`
- `derivative-nonexistent-alarm-check`
- `derivative-nonexistent-alarm-feedback`
- `derivative-nonexistent-alarm-reset`

## QA Notu
- Bu modül kesen/teğet anlatımını tekrar etmemeli; yalnız "neden türev yok?" kararına odaklanmalıdır.
- Sivri uçta tek problem iki farklı eğim yönüdür; kopuk grafikte problem süreksizliktir. Bu iki neden görsel olarak ayrışmalıdır.
- Alarm tarayıcısı yalnız dekor olmamalı; sürüklendiğinde sahnedeki nokta kritik bölgeye yaklaşmalıdır.
- Gri boşluk, aşağı kaydırma zorunluluğu, dev formül ve panel/reçete hissi hard faildir.
- Telefon görünümü ana hedef değildir; karar desktop/kiosk görünümünden verilir.

## Kapanış Kanıtı
- Statü: `Showcase Ready / Vitrin Hazır`.
- 2026-05-22: Kaptan geri bildirimiyle Türev Eğim Sürücüsü içindeki sivri uç/kopuk pist yoğunluğu ayrı modüle taşındı. İlk kurulumda route, registry, test-id kontratı ve teknik build kapısı eklendi. Kaptan göz onayı sonrası puan ve Showcase Ready değerlendirmesi yapılacak.
- 2026-05-23: Kaptan eksik tamamlama turunda sahne probu SVG üzerinde doğrudan sürüklenebilir hale getirildi; erken `f'(2) yok` hükmü doğru alarm kilidi sonrasına taşındı, sağ panel scroll ve completion genişliği güvene alındı, ana dosya `AlarmTracks`, `AlarmControls`, `AlarmCompletion` parçalarına ayrıldı.
- 2026-05-23: Browser/Codex canlı QA'da sahne üstü sürükleme slider değerini `50 -> 92` değiştirdi, iki görev doğru zincirle completion'a ulaştı, console warning/error yok. `npm run module:check -- derivative-nonexistent-alarm` 18 pass / 2 warn / 0 fail, `npx tsc --noEmit`, `npm run build`, `git diff --check` geçti.
- 2026-05-23: Kaptan canlı görsel onayı: "tamamdır bu vitrin olsun sıradakine geçelim". Bu onayla registry, embed etiketi ve kalite defterleri `Showcase Ready / Vitrin Hazır` olarak kilitlendi.
