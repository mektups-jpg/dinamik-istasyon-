# 03-08c Süre Tahmin Dedektifi

## Kapsam

- Module id: duration-estimate-3
- Route: /embed/measure/duration-estimate-3
- Sınıf: 3
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-07 Kaptan canlı görsel onayı alındı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.3.1.14.1: Günlük bir olayın kaç dakika/saniye süreceğini makul ölçekte tahmin eder.

## Deneyim Notu

Öğrenci günlük bir olay için makul süreyi seçer. Bu atom dönüşüm değil, tahmin-muhakeme odağı taşır; bu yüzden tek başına kısa ve anlaşılır tutulur. `Tekrar Oyna` farklı günlük olaylar getirir.

2026-06-07 dil/görsel cila notu: Canlı modelde bağlam kelimeleri yerine `saniye`, `dakika`, `saat` birim ölçeği gösterilir. Böylece çocuk seçenekleri süre birimi olarak karşılaştırır; doğru cevap ekranda doğrudan verilmez.

2026-06-07 çeşitlilik notu: İlk kontrolde atomun aynı üç günlük olayı döndürdüğü ve bunun ezber riski oluşturduğu görüldü. Olay havuzu saniye, dakika ve saat ölçeklerini kapsayan 9 günlük örneğe çıkarıldı; `Tekrar Oyna` farklı olay dizisi getirir.

2026-06-07 dil netliği notu: `Okulda geçirilen yarım gün` ifadesi 12 saat çağrışımı yapabileceği için havuzdan çıkarıldı. Aynı 4 saatlik makul süre örneği `Okulda geçen bir sabah` olarak yazılır.

## QA Kontratı

- Test id prefix: `duration-estimate-3`
- Yanlış kart kırmızı feedback verir.
- Doğru kart görev ilerletir.
- Canlı model süre birimlerini `saniye`, `dakika`, `saat` olarak gösterir.
- `Tekrar Oyna` sonrası ilk olay ve görev dizisi değişir.
- Completion yalnız süre tahmini kazanımını gösterir.
