# 03-08a Saati Okuyorum

## Kapsam

- Module id: clock-reader-3
- Route: /embed/measure/clock-reader-3
- Sınıf: 3
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-07 Kaptan canlı görsel onayı alındı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.3.1.12.1: Analog saatteki zamanı dakikası dakikasına okur.
- MAT.3.1.12.2: Analogdaki saati baz alarak dijital saatin kodlamasını yazar.

## Deneyim Notu

Öğrenci tek ana oyuncak olarak büyük analog saat görür. Akrep mor, yelkovan mavi çizilir; 1-12 sayıları ve dakika çizgileri kadranda okunur. Cevap kartlarında dijital saat seçenekleri bulunur. `Tekrar Oyna` farklı saatleri getirir.

2026-06-07 tekrar oynama notu: Saat havuzu 12 farklı, dakikası 5'in katı olan okunabilir örneğe çıkarıldı. Cevap çeldiricileri saat kaydırma ve yelkovanın üstündeki sayıyı dakika sanma gibi gerçek öğrenci hatalarından üretilir; çocuk aynı üç cevabı ezberleyemez.

## QA Kontratı

- Test id prefix: `clock-reader-3`
- Yanlış kart kırmızı feedback verir.
- Doğru kart görev ilerletir.
- `Tekrar Oyna` sonrası ilk saat ve görev dizisi değişir.
- Completion yalnız saat okuma kazanımlarını gösterir.
