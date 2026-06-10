# 03-08b Zaman Dönüşüm Makinesi

## Kapsam

- Module id: time-conversion-3
- Route: /embed/measure/time-conversion-3
- Sınıf: 3
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-07 Kaptan canlı görsel onayı alındı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.3.1.13.1: 1 saatin 60 dakika olduğunu hesaplamalarında kullanır.
- MAT.3.1.13.2: 1 dakikanın 60 saniye olduğunu hesaplamalarında kullanır.

## Deneyim Notu

Öğrenci yalnız saat-dakika ve dakika-saniye dönüşümünü görür. Sahne 60 dakika ve 60 saniye kartlarıyla desteklenir; cevap doğrudan sahnede yazılmaz, öğrenci sağdaki karttan seçer. `Tekrar Oyna` yeni saat/dakika sayılarını getirir.

2026-06-07 tekrar oynama notu: Saat-dakika ve dakika-saniye havuzları sekizer örneğe çıkarıldı. Önceki 3 oyunluk sayı döngüsü kapandı; çeldiriciler 60 yerine 10'la çarpma ve bir önceki dönüşüme kayma gibi gerçek öğrenci hatalarından üretilir.

## QA Kontratı

- Test id prefix: `time-conversion-3`
- Yanlış kart kırmızı feedback verir.
- Doğru kart görev ilerletir.
- `Tekrar Oyna` sonrası ilk sayı ve görev dizisi değişir.
- Completion yalnız zaman dönüşümü kazanımlarını gösterir.
