# 11-14 Korelasyon Serpilme Radarı

## Amaç
11. sınıf korelasyon konusunu tek nokta bulutu deneyinde öğretmek. Öğrenci iki sayısal değişkeni koordinat düzlemine yerleştirir, noktaların birlikte nasıl yön değiştirdiğini görür ve eğilim çizgisinin pozitif/negatif ilişkiyi nasıl anlattığını keşfeder.

## Atom Kapsamı
- `MAT.11.3.1.1`: İki farklı sayısal değişkeni serpilme grafiği üzerinde noktalayarak koordinatlara döker.
- `MAT.11.3.1.2`: Serpilme grafiğindeki noktaların eğilimine bakarak pozitif doğrusal ilişki tespiti yapar.
- `MAT.11.3.1.3`: Serpilme grafiğindeki noktaların eğilimine bakarak negatif doğrusal ilişki tespiti yapar.

## Kapsam Dışı
- `MAT.11.3.2.1` dışarıdan verilmiş iki nicel değişkenli istatistiksel sonuçları eleştirme görevi ayrı **Medya Korelasyon Denetçisi** modülünde kalır.
- Regresyon katsayısı hesaplama, nedensellik iddiası kurma ve gerçek medya veri seti analizi bu ilk serpilme grafiği modülüne alınmaz.

## Ana Oyuncak
Tek sahne bir korelasyon radarıdır:
- Öğrenci nokta kapsüllerini x-y radar alanına sürükleyerek serpilme grafiğini kurar.
- Radar, noktaların genel yönünü yarı saydam bir eğilim ışınıyla gösterir.
- Pozitif korelasyonda ışın sol alttan sağ üste, negatif korelasyonda sol üstten sağ alta kilitlenir.
- Noktalar matematiksel anlam taşır: x ekseni bir değişkeni, y ekseni ikinci değişkeni temsil eder. Dekoratif parçacık yoktur.

## Görev Akışı
1. `Noktaları Yerleştir`: Verilen çiftleri radar alanındaki doğru koordinat noktalarına hizala.
2. `Pozitif Eğilim`: Artan veri setini sıkıştır/aç ve eğilim ışınını pozitif yöne kilitle.
3. `Negatif Eğilim`: Azalan veri setine geç; eğilim ışınını negatif yöne kilitle.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: tutup taşınabilen nokta bulutu ve radar eksenleri.
- Sağ/alt panel yalnız aktif görev, canlı eğim yönü, yerleşen nokta sayısı ve onay/reset içerir.
- Öğrenci "korelasyon nedensellik değildir" gürültüsüne bu modülde boğulmaz; bu mesaj kısa uyarı olarak kalır, asıl medya eleştirisi 11-15'e bırakılır.
- Görsel dil premium ve sade olmalı: nokta kapsülleri, eğilim ışını, hedef koordinat halkaları ve kısa AstroBot geri bildirimi.
- Noktalar sürüklenebilir ve klavye erişimli olmalı; `Home` aktif görevde hedef dizilime hizalama için QA fallback sağlar.

## Route
- `/embed/statistics/correlation-scatter-radar`

## Test ID Kontratı
- `correlation-scatter-scene`
- `scatter-radar-screen`
- `scatter-point-*`
- `trend-beam`
- `correlation-check`
- `correlation-reset`

## QA Planı
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/statistics/correlation-scatter-radar?qa=1` açılır.
  - İlk sahne, radar eksenleri, en az bir sürüklenebilir nokta ve eğilim ışını görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback veya gerçek sürükleme ile üç görev tamamlanır.
  - Completion ekranı görünür.
  - Console warning/error kontrolü yapılır.
  - Orta viewport ve mobil/embed smoke yapılır.
