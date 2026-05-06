# 10-17 Koşullu Olasılık Filtresi

## Durum

In Progress. SSOT atomu `MAT.10.7.1.1` olarak doğrulandı. Bu modül genel olasılık kurallarını listelemez; gerçekleşmiş koşulun evrensel kümeyi nasıl daralttığını tek filtre sahnesinde gösterir.

## Amaç

10. sınıf öğrencisine koşullu olasılığın paydanın değişmesi olduğunu göstermek:

- Zar evreni başlangıçta `{1, 2, 3, 4, 5, 6}`.
- "Çift geldiği biliniyor" koşulu evreni `{2, 4, 6}` olarak daraltır.
- "4'ten büyük" hedef olayı bu dar evrende yalnız `{6}` olur.
- Sonuç `1/3` olarak kilitlenir.

## Atom Kapsamı

- `MAT.10.7.1.1`: Gerçekleşmiş bir olayın ardından evrensel kümeyi daraltarak ikinci koşulun olasılığını zihinden bulur.

## Kapsam Dışı

- Bağımlı çekiliş ve geri koymama durumu ayrı olasılık modülünde yapılır.
- Bayes formülü, ağaç diyagramı ve çarpma kuralı bu modülde açılmaz.

## Ana Oyuncak

Tek sahne bir **koşul filtresi**dir:

- Altı zar yüzü başlangıç evreninde görünür.
- Öğrenci koşul filtresini açınca tek sayılar karanlığa düşer, çift yüzler kalır.
- Hedef filtresi `>4` ışığını dar evrende yalnız `6` yüzüne indirir.
- Kesir mührü `1/3` sonucunu kilitler.

## Görev Akışı

1. `Koşul Kapısı`: aksı koşul portuna getir ve `çift geldi` filtresini aç.
2. `Hedef Olay`: aksı hedef portuna getir ve `4'ten büyük` filtresini dar evrende çalıştır.
3. `Kesir Mührü`: aksı sonuç portuna getir, `1/3` tokenını ve rapor mührünü kilitle.

## Route

- `/embed/probability/conditional-probability-filter`

## Test ID Kontratı

- `conditional-filter-scene`
- `conditional-filter-handle`
- `conditional-even-filter`
- `conditional-target-filter`
- `conditional-fraction-1-3`
- `conditional-report-seal`
- `conditional-filter-check`
- `conditional-filter-reset`

## QA Planı

- `npm run module:check -- conditional-probability-filter`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/probability/conditional-probability-filter?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile koşul, hedef olay ve kesir mührü görevleri tamamlanır.
  - Completion ekranı ve console warning/error `[]` doğrulanır.
- Gemini 3 Flash:
  - Daralan evren `{2,4,6}` görsel olarak açık mı denetlenir.
  - `>4` hedefinin dar evrende yalnız `6` verdiği ve paydanın `3` kaldığı kontrol edilir.
  - İlk 3 saniye, responsive/embed ve bilişsel yük değerlendirilir.
