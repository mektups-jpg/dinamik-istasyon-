# 10-01 Parabol Şekil Stüdyosu

## Amaç
10. sınıf `MAT.10.2.2.x` atomlarını tek ana deneyde öğretmek: öğrenci parabolü cevap seçerek değil, tepe noktasını ve genişlik kolunu doğrudan sürükleyerek şekillendirir.

## Atom Kapsamı
- `MAT.10.2.2.1`: `f(x)=x²` referans parabolünü grafik üzerinde çizer.
- `MAT.10.2.2.2`: Karesel fonksiyon grafiğini daraltarak inceltir.
- `MAT.10.2.2.3`: Karesel fonksiyon grafiğini genişleterek açar.
- `MAT.10.2.2.4`: Karesel fonksiyon grafiğinin tepe noktasını eksenlerde kaydırır.

## Kapsam Dışı
- `MAT.10.2.1.x` fonksiyon şartları ayrı **Fonksiyon Mu Filtresi** modülüne bırakılır.
- `MAT.10.2.3.x` ve `MAT.10.2.4.x` tanım kümesi/asimptot konuları ayrı **Tanım Kümesi Kapıları** modülüne bırakılır.
- `MAT.10.2.5.x` ters fonksiyon ve `MAT.10.2.6.x` işaret tablosu ayrı modüllerdir.

## Ana Oyuncak
Sahnede tek parabol hologramı vardır:
- Mavi tepe düğümü `h` ve `k` değerlerini taşır.
- Pembe genişlik kolu `a` değerini değiştirir.
- Sarı kesik hedef hologram, öğrencinin canlı parabolü nereye oturtacağını gösterir.

## Görev Akışı
1. Referans kase: `f(x)=x²`.
2. Dar kase: `a=1.8`.
3. Geniş kase: `a=0.45`.
4. Tepe kaydı: `(h, k) = (2, 1.5)` ve `a=0.75`.

## QA Başarı Kriteri
- `/embed/algebra/parabola-shape-studio?qa=1` açılır.
- `parabola-scene`, `parabola-svg`, `parabola-vertex-handle`, `parabola-width-handle` görünür.
- Yanlış onay AstroBot hata mesajı üretir.
- Tepe ve genişlik handle'ları sürüklenerek 4 görev tamamlanır.
- Completion ekranı görünür.
- `npm run build`, `git diff --check`, console ve responsive/embed smoke temizdir.
