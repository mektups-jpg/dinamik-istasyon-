# 10-13 Kalan Kapısı

## Durum

In Progress. SSOT atomu `MAT.10.1.3.1` olarak doğrulandı. Bu modül EBOB/EKOK hesabını genişletmez; bölme işlemi yapmadan kalan sonucunu hızlı modüler kapılarla tespit eder.

## Amaç

10. sınıf öğrencisine kalanlı matematikte tam bölme yapmadan, sayının görünen izlerinden kalan sonucunu üretmeyi göstermek:

- Mod 9 için rakam toplamı aynı kalanı verir.
- Mod 5 için son basamak aynı kalanı verir.
- Mod 4 için son iki basamak aynı kalanı verir.

## Atom Kapsamı

- `MAT.10.1.3.1`: Bir doğal sayının bölme işlemi yapmadan modüler (kalanlı) matematik kurallarıyla sonucunu tespit eder.

## Kapsam Dışı

- Asal çarpanlar ve tam bölenler `10-11 Asal Kilit Kasası` içindedir.
- EBOB/EKOK algoritmaları `10-12 EBOB/EKOK Dişli Kutusu` içindedir.
- Soyut kongruans ispatları veya ileri modüler aritmetik yapılmaz.

## Ana Oyuncak

Tek sahne bir **modüler kalan kapısı**dır:

- Sayı kapsülü ray üzerinde hedef kapıya taşınır.
- Öğrenci doğru lensi ve kalan token'ını seçer.
- Rakam toplamı, son basamak ve son iki basamak izleri kapı üstünde ayrı renklerde görünür.
- Sonuç, bölme işlemi yazmadan kalan token'ıyla kilitlenir.

## Görev Akışı

1. `Rakam Toplamı Kapısı`: `758 mod 9` için rakam toplamı `20`, kalan `2`.
2. `Son Basamak Kapısı`: `748 mod 5` için son basamak `8`, kalan `3`.
3. `Son İki Basamak Kapısı`: `3714 mod 4` için son iki basamak `14`, kalan `2`.

## Route

- `/embed/numbers/remainder-gate`

## Test ID Kontratı

- `remainder-gate-scene`
- `remainder-gate-handle`
- `remainder-gate-sum-lens`
- `remainder-gate-last-digit-lens`
- `remainder-gate-last-two-lens`
- `remainder-token-2`
- `remainder-token-3`
- `remainder-gate-check`
- `remainder-gate-reset`

## QA Planı

- `npm run module:check -- remainder-gate`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/numbers/remainder-gate?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile üç görev hedefi kilitlenir.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü `[]`.
- Gemini 3 Flash:
  - Öğrenci hangi sayı izinin neden yeterli olduğunu görselden çıkarabiliyor mu denetlenir.
  - `758 mod 9 = 2`, `748 mod 5 = 3`, `3714 mod 4 = 2` doğruluğu kontrol edilir.
  - İlk 3 saniye, responsive/embed, toast/aksiyon çakışması ve bilişsel yük değerlendirilir.
