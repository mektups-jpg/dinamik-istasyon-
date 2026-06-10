# 05-07 Birim Kare Alan Fabrikası

## Durum
Showcase Ready. Ortaokul 5. sınıf üretim hattında `unit-square-area-factory` modülü dikdörtgen alanını birim karelerle keşfetmek için açılmıştır. 2026-06-03 Kaptan canlı onayıyla vitrine alınmıştır.

## Amaç
5. sınıf öğrencisinin dikdörtgenin içini 1x1 birim karelerle kaplayarak alanın neden `uzun x kısa` olduğunu somut biçimde görmesini sağlamak. Öğrenci önce kareleri yerleştirir, sonra toplam birim kare sayısını seçer.

## Atom Kapsamı
- `MAT.5.4.2.1`: Bir dikdörtgenin içini sanal 1x1'lik birim fayanslarla/karelerle sayarak kaplar ve alanın `Uzun x Kısa` mantığını ispatlar.

## Kapsam Dışı
- Sabit çevre-farklı alan optimizasyonu bu modülün hedefi değildir.
- Sütun/çizgi grafik okuma ve veri manipülasyonu bu modüle sıkıştırılmaz.
- Alan problemleri metin ağırlıklı problem çözme ekranına dönüştürülmez.

## Ana Oyuncak
Tek ana oyuncak büyük bir 1x1 birim kare zeminidir:
- Öğrenci her kareye dokunarak zemini kaplar.
- Doluluk çubuğu kaç birim karenin yerleştiğini gösterir.
- Zemin tamamen dolmadan alan seçilirse AstroBot neden erken olduğunu söyler.
- Doğru alan seçilince `sütun x satır` kanıt cümlesi görünür ve sıradaki zemin açılır.
- Her yeni oyunda kolay, orta ve büyük zemin ölçüleri yeniden seçilir; cevap seçenekleri de karışık sırada gelir.

## Görev Akışı
1. Öğrenci küçük bir dikdörtgen zemini birim karelerle kaplar.
2. Zemin tamamlanmadan alan seçerse eksik kaplama uyarısı alır.
3. Tüm kareleri doldurunca doğru birim kare sayısını seçerek başarı alır.
4. Aynı mantık orta ve daha büyük zeminlerde tekrar edilir.
5. Son görevden sonra `MAT.5.4.2.1` atomu ve `unit-square-area-factory` modülü kilitlenir.

## UI/UX Kriterleri
- İlk üç saniyede ana oyuncak büyük kare zemin olarak görünür.
- Yazı kısa kalır; hedef, doluluk ve alan seçimi ayrıdır.
- Tıklanabilir kareler ve cevap düğmeleri en az 44px dokunma alanına sahiptir.
- Yanlış cevapta neden yanlış olduğu söylenir: ya zemin eksiktir ya da `sütun x satır` sonucu hatalıdır.
- Modül route'u `/embed/geometry/unit-square-area-factory` olarak kalır.

## QA Başarı Kriteri
- `/embed/geometry/unit-square-area-factory` açılır.
- `Birim Kare Alan Fabrikası` başlığı görünür.
- Kök test id `unit-square-area-factory` görünür.
- İlk görevde `unit-square-cell-*` hücreleri tıklanınca doluluk artar.
- Zemin tamamlanmadan `area-choice-*` tıklanınca eksik kaplama uyarısı gelir.
- İlk görevde tüm kareler doldurulup doğru alan seçilince ikinci zemine geçilir.
- Son görevde doğru alan seçimiyle completion ekranı açılır.
- Sayfa yenilenince veya `TEKRAR OYNA` kullanılınca zemin ölçülerinin ve cevap sırasının sabit kalmadığı kontrol edilir.
- Console hata/uyarı olmamalıdır.
- `npm run module:check -- unit-square-area-factory`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
