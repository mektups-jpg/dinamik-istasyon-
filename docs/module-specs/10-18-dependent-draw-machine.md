# 10-18 Bağımlı Çekiliş Makinesi

## Durum

In Progress. SSOT atomu `MAT.10.7.2.1` olarak doğrulandı. Bu modül koşullu olasılık filtresini tekrar etmez; geri koymadan çekilişte örnek uzayın fiziksel olarak değişmesini gösterir.

## Amaç

10. sınıf öğrencisine bağımlı olayda ikinci olasılığın ilk çekilişten sonra değiştiğini göstermek:

- Başlangıç torbasında `3 kırmızı` ve `2 mavi` top vardır.
- İlk çekilişte bir kırmızı top gelir ve geri atılmaz.
- Torbada artık `2 kırmızı` ve `2 mavi`, toplam `4` top kalır.
- İkinci çekilişte kırmızı gelme olasılığı `2/4 = 1/2` olur.

## Atom Kapsamı

- `MAT.10.7.2.1`: Torbadan çıkarılan top geri atılmadığında ikinci çekilişin bozulan evrensel küme ihtimalini simüle eder.

## Kapsam Dışı

- Bağımsız olaylarda geri koyma senaryosu bu modülde ana hedef değildir.
- Ağaç diyagramı, kombinasyon sayımı ve Bayes dili bu modülde açılmaz.

## Ana Oyuncak

Tek sahne bir **bağımlı çekiliş makinesi**dir:

- Torba başlangıçta 5 top gösterir.
- Öğrenci ilk kırmızı topu çıkış kanalına alır.
- Kalan torba sayacı `2 kırmızı / 4 toplam` olarak güncellenir.
- Son görevde `1/2` olasılık mührü kilitlenir.

## Görev Akışı

1. `İlk Çekiliş`: aksı ilk çekiliş kanalına getir ve kırmızı topu geri koymadan çıkar.
2. `Evren Güncelle`: aksı sayaç paneline getir ve kalan evreni `2 kırmızı / 4 toplam` olarak güncelle.
3. `Olasılık Mührü`: aksı sonuç portuna getir, `1/2` tokenını ve rapor mührünü kilitle.

## Route

- `/embed/probability/dependent-draw-machine`

## Test ID Kontratı

- `dependent-draw-scene`
- `dependent-draw-handle`
- `dependent-first-red`
- `dependent-space-update`
- `dependent-probability-1-2`
- `dependent-report-seal`
- `dependent-draw-check`
- `dependent-draw-reset`

## QA Planı

- `npm run module:check -- dependent-draw-machine`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/probability/dependent-draw-machine?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile ilk çekiliş, evren güncelleme ve olasılık mührü görevleri tamamlanır.
  - Completion ekranı ve console warning/error `[]` doğrulanır.
- Gemini 3 Flash:
  - İlk kırmızı topun geri konmadığı ve toplamın 5'ten 4'e düştüğü açık mı denetlenir.
  - İkinci kırmızı olasılığının `2/4 = 1/2` olduğu kontrol edilir.
  - İlk 3 saniye, responsive/embed ve bilişsel yük değerlendirilir.
