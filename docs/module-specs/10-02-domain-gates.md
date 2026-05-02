# 10-02 Tanım Kümesi Kapıları

## Amaç
10. sınıf karekök ve rasyonel fonksiyon atomlarını tek "kapı/duvar" metaforunda öğretmek. Öğrenci, tanım kümesini formül ezberiyle değil, grafiğin doğmadığı veya geçemediği çizgileri sürükleyerek görür.

## Atom Kapsamı
- `MAT.10.2.3.1`: `f(x)=√x` referans fonksiyonunun grafiğini çizer.
- `MAT.10.2.3.2`: Kareköklü fonksiyonlarda `x≥0` güvenli bölgesini gösterir.
- `MAT.10.2.4.1`: `f(x)=1/x` referans fonksiyonunu asimptot eğrisiyle çizer.
- `MAT.10.2.4.2`: Rasyonel fonksiyonda paydayı sıfır yapan asimptot noktasını tanımsız bölge olarak atlar.

## Kapsam Dışı
- `MAT.10.2.1.x` fonksiyon şartları ayrı **Fonksiyon Mu Filtresi** modülündedir.
- `MAT.10.2.2.x` parabol dönüşümleri tamamlanan **Parabol Şekil Stüdyosu** modülündedir.
- `MAT.10.2.5.x` ters fonksiyon ve `MAT.10.2.6.x` işaret tablosu ayrı modüllere bırakılır.

## Ana Oyuncak
Sahnede tek koordinat ekranı vardır:
- Karekök katmanında başlangıç düğümü ve güvenli bölge kapısı x=0 çizgisine sürüklenir.
- Rasyonel katmanda asimptot duvarı ve kırmızı `x≠0` işareti x=0 çizgisine sürüklenir.
- Sol/merkez yasak alanlar kırmızı cam bölgeyle görünür.
- Tablet/QA güvenilirliği için aktif handle çift tıklanınca hedef çizgisine kilitlenir; klavyede sağ/sol oklar kapıyı küçük adımlarla taşır ve `Home` tuşu orijin çizgisine hizalar. Ana öğrenme davranışı yine sahnedeki kapıyı sürüklemektir.

## Görev Akışı
1. `√x` başlangıcını x=0 çizgisine getir.
2. Karekök güvenli bölge kapısını x=0 çizgisine kilitle.
3. `1/x` asimptot duvarını y eksenine hizala.
4. Payda sıfır alarmını x=0 noktasına kilitle.

## QA Başarı Kriteri
- `/embed/algebra/domain-gates?qa=1` açılır.
- `domain-gates-scene`, `domain-gates-svg`, `domain-root-start-handle`, `domain-safe-gate-handle`, `domain-asymptote-handle`, `domain-forbidden-handle` ilgili görevlerde görünür.
- Yanlış onay AstroBot hata mesajı üretir.
- Dört kapı/duvar etkileşimiyle completion ekranına ulaşılır; Browser Use akışında kırılgan koordinat tahmini yerine handle odak + `Home` doğrulaması kullanılabilir.
- `npm run build`, `git diff --check`, console ve responsive/embed smoke temizdir.
