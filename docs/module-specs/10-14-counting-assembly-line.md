# 10-14 Sayma Montaj Hattı

## Durum

In Progress. SSOT atomları `MAT.10.3.1.1` ve `MAT.10.3.1.2` olarak doğrulandı. Bu modül permütasyon/kombinasyon formül ezberine geçmez; toplama ve çarpma yoluyla sayma ayrımını fiziksel üretim hattı olarak gösterir.

## Amaç

10. sınıf öğrencisine iki temel sayma stratejisini ayrı üretim mekaniğiyle göstermek:

- Çarpma: bir ürün için bağımsız iki seçim aynı anda yapılır, olasılık sayıları çarpılır.
- Toplama: birbirini dışlayan iki hat arasında seçim yapılır, olasılık sayıları toplanır.

## Atom Kapsamı

- `MAT.10.3.1.1`: Çarpma yoluyla sayma mekanizmasını problemin içine uygular.
- `MAT.10.3.1.2`: Toplama yoluyla sayma mekanizmasını problemin içine uygular.

## Kapsam Dışı

- Permütasyon/kombinasyon formülleri ve faktöriyel dili bu modülde açılmaz.
- Koşullu olasılık ve bağımlı olaylar bu modülün dışında ayrı modüllerde yapılacak.

## Ana Oyuncak

Tek sahne bir **sayma montaj hattı**dır:

- Üst hat `3 renk × 2 rozet` bağımsız seçimlerini aynı üründe birleştirir ve `6` varyasyon üretir.
- Alt hat `4 drone veya 3 rover` ayrık alternatiflerini iki farklı hattan toplar ve `7` seçenek üretir.
- Öğrenci aksı hedef banda getirir, doğru sayma modunu ve sonuç tokenını seçer.
- Son rapor mührü çarpma/toplama ayrımını kilitler.

## Görev Akışı

1. `Çarpma Bandı`: `3 renk × 2 rozet = 6` için çarpma modunu ve `6` tokenını seç.
2. `Toplama Bandı`: `4 drone + 3 rover = 7` için toplama modunu ve `7` tokenını seç.
3. `Sayma Mührü`: iki stratejinin hangi durumda kullanıldığını rapor mührüne kilitle.

## Route

- `/embed/probability/counting-assembly-line`

## Test ID Kontratı

- `counting-line-scene`
- `counting-line-handle`
- `counting-mode-product`
- `counting-mode-sum`
- `counting-token-6`
- `counting-token-7`
- `counting-report-seal`
- `counting-line-check`
- `counting-line-reset`

## QA Planı

- `npm run module:check -- counting-assembly-line`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/probability/counting-assembly-line?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile üç görev hedefi kilitlenir.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü `[]`.
- Gemini 3 Flash:
  - Öğrenci çarpma/toplama ayrımını görselden çıkarabiliyor mu denetlenir.
  - `3 × 2 = 6` ve `4 + 3 = 7` doğruluğu kontrol edilir.
  - İlk 3 saniye, responsive/embed, toast/aksiyon çakışması ve bilişsel yük değerlendirilir.
