# 10-12 EBOB/EKOK Dişli Kutusu

## Durum

In Progress. SSOT atomları `MAT.10.1.2.1` ve `MAT.10.1.2.2` olarak doğrulandı. Bu modül `10-11 Asal Kilit Kasası`ndan sonra gelir; asal çarpanları yeniden öğretmez, iki sayının ortak ve birleşik asal kuvvetlerini karşılaştırır.

## Amaç

10. sınıf öğrencisine EBOB ve EKOK algoritmalarını iki ayrı ezber listesi gibi değil, aynı asal çarpan dişli sistemindeki iki farklı seçim kuralı olarak göstermek:

- EBOB: iki sayıda ortak görünen asal kuvvetlerin küçük olanlarını seçer.
- EKOK: iki sayıda görünen asal kuvvetlerin büyük olanlarını seçer.

## Atom Kapsamı

- `MAT.10.1.2.1`: Birden fazla sayının en büyük ortak bölenini (EBOB) hesaplar.
- `MAT.10.1.2.2`: Birden fazla sayının en küçük ortak katını (EKOK) hesaplar.

## Kapsam Dışı

- Tek sayının asal çarpanlara ayrılması ve tam bölen listesini kurma `10-11 Asal Kilit Kasası` içinde tamamlandı.
- Bölünebilme/kalan kuralları `10-13 Kalan Kapısı` içinde ayrı yapılacak.
- Problem türleri uzun metinli rutin alıştırmaya çevrilmez; oyuncak hesaplama algoritmasına odaklanır.

## Ana Oyuncak

Tek sahne bir **EBOB/EKOK dişli kutusu**dur:

- Sayılar `12 = 2² · 3` ve `18 = 2 · 3²` iki giriş motoru olarak görünür.
- Öğrenci alt aks tutamacını hedef raya getirir.
- EBOB görevinde ortak küçük kuvvetleri temsil eden `2` ve `3` dişlilerini seçer; çıktı `6` olur.
- EKOK görevinde büyük kuvvetleri temsil eden `2² = 4` ve `3² = 9` dişlilerini seçer; çıktı `36` olur.
- Son görevde rapor mührü, aynı iki sayı için `EBOB = 6`, `EKOK = 36` ayrımını kilitler.

## Görev Akışı

1. `EBOB Ortak Aksı`: aksı ortak diş çizgisine getir, `2` ve `3` dişlilerini seç.
2. `EKOK Birleşik Aksı`: aksı birleşik diş çizgisine getir, `2² = 4` ve `3² = 9` dişlilerini seç.
3. `Karar Mührü`: aksı rapor çizgisine getir, EBOB/EKOK mühür çekirdeğini kilitle.

## Route

- `/embed/numbers/gcd-lcm-gearbox`

## Test ID Kontratı

- `gcd-lcm-scene`
- `gcd-lcm-handle`
- `gcd-gear-2`
- `gcd-gear-3`
- `lcm-gear-4`
- `lcm-gear-9`
- `gcd-lcm-seal`
- `gcd-lcm-check`
- `gcd-lcm-reset`

## QA Planı

- `npm run module:check -- gcd-lcm-gearbox`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/numbers/gcd-lcm-gearbox?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile üç görev hedefi kilitlenir.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü `[]`.
- Gemini 3 Flash:
  - EBOB ve EKOK seçim kurallarının görselden ayrılıp ayrılmadığı denetlenir.
  - `12` ve `18` için `EBOB = 6`, `EKOK = 36` matematik doğruluğu kontrol edilir.
  - İlk 3 saniye, responsive/embed ve toast/aksiyon çakışması değerlendirilir.
