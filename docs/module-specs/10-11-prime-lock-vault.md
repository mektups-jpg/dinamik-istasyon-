# 10-11 Asal Kilit Kasası

## Durum

Done. SSOT atomları `MAT.10.1.1.1` ve `MAT.10.1.1.2` olarak doğrulandı; uygulama, Browser Use canlı QA, Gemini 3 Flash kapanışı ve doküman senkronu tamamlandı.

## Amaç

10. sınıf öğrencisine bir doğal sayının asal çarpanlarını ve tam bölenlerini listelemeyi, soyut bölme işlemi yerine şifreli bir kasa üzerinde asal lazerleri ve bölen rafı olarak göstermek.

## Atom Kapsamı

- `MAT.10.1.1.1`: Bir doğal sayının asal çarpanlarını izole eder.
- `MAT.10.1.1.2`: Bir doğal sayının tam bölenleri listesini tek tek oluşturur.

## Kapsam Dışı

- Birden fazla sayı için EBOB/EKOK hesaplama `10-12 EBOB/EKOK Dişli Kutusu` içindedir.
- Bölünebilme ve kalan kuralları `10-13 Kalan Kapısı` içindedir.
- 6. sınıf Eratosten kalburu bu modüle alınmaz; burada 10. sınıf düzeyinde çarpan-bölen ilişkisi işlenir.

## Ana Oyuncak

Tek sahne bir **asal kilit kasasıdır**:

- Kasa üzerinde hedef sayı `30` durur.
- Öğrenci asal lazerlerden `2`, `3`, `5` ışınlarını seçerek sayıyı `2 x 3 x 5` çekirdeğine ayırır.
- İkinci görevde bölen rafındaki tüm doğru kilit taşları seçilir: `1, 2, 3, 5, 6, 10, 15, 30`.
- Tarayıcı kolu aktif görev hedef çizgisine taşındığında kasa mühürü açılır.

## Görev Akışı

1. `Asal Lazerler`: `2`, `3`, `5` asal lazerlerini seç ve tarayıcıyı asal çekirdeğe getir.
2. `Tam Bölen Rafı`: `30` sayısının tüm tam bölen taşlarını seç ve tarayıcıyı bölen rafına getir.

## Route

- `/embed/numbers/prime-lock-vault`

## Test ID Kontratı

- `prime-vault-scene`
- `prime-vault-scanner`
- `prime-laser-2`
- `prime-laser-3`
- `prime-laser-5`
- `divisor-tile-1`
- `divisor-tile-2`
- `divisor-tile-3`
- `divisor-tile-5`
- `divisor-tile-6`
- `divisor-tile-10`
- `divisor-tile-15`
- `divisor-tile-30`
- `prime-vault-check`
- `prime-vault-reset`

## QA Planı

- `npm run module:check -- prime-lock-vault`: 28 pass / 0 warn / 0 fail.
- `npm run build`: geçti.
- `git diff --check`: temiz.
- Browser Use:
  - `/embed/numbers/prime-lock-vault?qa=1&run=post-gemini-fix-2` açıldı.
  - Yanlış onay AstroBot hata mesajı üretti; yeni ipucu cevabı doğrudan söylemedi.
  - `Home` fallback ile iki görev hedefi kilitlendi.
  - İki görev tamamlandı, completion ekranı göründü.
  - Console warning/error kontrolü `[]` temizdir.
  - Screenshot kanıtları `.agent/browser-use-shots/10-11-postfix-*.png` altında.
- Gemini 3 Flash:
  - İlk tur 82/100 PASS_WITH_WARNINGS verdi ama hata ipucunun cevabı söylemesi ve AstroBot toast yerleşimi için must-fix çıkardı.
  - Düzeltmeler: ipuçları yönlendirici dile çekildi; aktif hedef, metrik ve formül kartları doğru kilitlenmeden önce sonucu gizledi; AstroBot küçük/orta embed'de üst konuma alındı; bölen taşları ferahlatıldı.
  - Final tur `.agent/gemini-reports/10-11-prime-lock-vault-final.txt`: 92/100 PASS, must-fix yok.
