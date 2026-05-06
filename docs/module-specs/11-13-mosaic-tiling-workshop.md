# 11-13 Mozaik Kaplama Atölyesi

## Durum

Done. SSOT atomları `MAT.11.2.5.1` ve `MAT.11.2.5.2` olarak doğrulandı. Bu modül 11. sınıf çokgen problemlerinin kaplama/fayans kısmını ayrı bir makro deney olarak ele alır; köşegen, dış açı ve simetri kapsamı 11-12 içinde tamamlandı.

## Amaç
11. sınıf öğrencisine mozaik ve fayans problemlerini formül listesi olarak değil, boşluk/üst üste binme alarmı veren bir kaplama masasında sezdirme. Öğrenci çokgen fayansları sürükleyip döndürerek çevredeki açıların tam turu doldurup doldurmadığını, desenin boşluksuz ilerleyip ilerlemediğini görür.

## Atom Kapsamı
- `MAT.11.2.5.1`: Çokgenlerle oluşturulan mozaik kaplama problemlerini çözer.
- `MAT.11.2.5.2`: Çokgenlerle oluşturulan fayans hizalama problemlerini çözer.

## Kapsam Dışı
- Genel çokgen köşegen sayısı, dış açı toplamı ve simetri ekseni sayımı tekrar edilmez.
- Alan hesabı veya özel dörtgen sınıflandırması bu modüle alınmaz.
- Rastgele serbest tasarım editörü yapılmaz; hedef, kaplama koşulunu öğrenmektir.

## Ana Oyuncak
Tek sahne bir **mozaik kaplama masası** olur:
- Ortada boşluk alarmı veren bal peteği/ızgara yüzeyi bulunur.
- Öğrenci üçgen, kare ve altıgen fayansları sürükler; uygun olmayan açılar birleşince kırmızı boşluk/taşma alarmı yanar.
- Döndürme kadranı fayans yönünü 30°/60° adımlarla değiştirir.
- Doğru kaplama deseninde çevredeki açılar 360° halkasına kapanır ve desen ray boyunca hizalanır.

## Görev Akışı
1. `mozaik kilidi`: Eş altıgen fayansları boşluk bırakmadan bal peteği yuvasına yerleştir.
2. `açı halkası`: Bir köşe etrafındaki çokgen açılarını 360° olacak şekilde tamamla.
3. `fayans hizası`: Tekrarlayan deseni kaydırma rayında hizala; boşluk/üst üste binme alarmı sönsün.

## Route
- `/embed/geometry/mosaic-tiling-workshop`

## Test ID Kontratı
- `mosaic-tiling-scene`
- `mosaic-tile-hexagon`
- `mosaic-tile-triangle`
- `mosaic-gap-alarm`
- `mosaic-rotation-dial`
- `mosaic-check`
- `mosaic-reset`

## QA Planı
- `npm run module:check -- mosaic-tiling-workshop`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/geometry/mosaic-tiling-workshop?qa=1` açılır.
  - Mozaik sahnesi, sürüklenebilir fayanslar, boşluk alarmı ve döndürme kadranı görünür.
  - Yanlış hizalama AstroBot hata mesajı üretir.
  - `Home` fallback aktif fayansı/hedef kadranı doğru konuma alır.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Kaplama koşulu sezgisel mi, fayansların matematiksel anlamı açık mı, mobil/embed görünümde hedefler yeterince dokunulabilir mi değerlendirilir.

## Kapanış Notu
- `src/modules/grade11/mosaic-tiling-workshop/` altında `types`, `mosaicModel`, `MosaicScene`, `MosaicControls` ve `MosaicTilingWorkshopApp` olarak parçalandı.
- Route `/embed/geometry/mosaic-tiling-workshop` registry'ye bağlandı; modül tek ana oyuncak olarak mozaik kaplama masası, boşluk alarmı, sürüklenebilir altıgen/üçgen fayanslar ve döndürme/hizalama rayı ile çalışıyor.
- Browser Use IAB ile test id görünürlüğü, yanlış onay AstroBot hatası, `Home` fallback üzerinden üç görev, completion ve console warning/error `[]` doğrulandı.
- İlk Gemini 3 Flash turu 88/100 PASS verdi ama kadran hitbox'ı, merkez etiket çakışması ve mühürlerin tıklanabilirlik dili için must-fix çıkardı. Ray dokunma alanı kalınlaştırıldı, pasif çokgen etiketleri merkez derece göstergesini ezmeyecek şekilde gizlendi, mühürler üst etiket/seçili nokta ile ayrıştırıldı ve completion görünürlüğü için otomatik yukarı kaydırma eklendi.
- Final Gemini 3 Flash turu 98/100 PASS, must-fix yok.
- `npm run module:check -- mosaic-tiling-workshop` 20 pass / 0 warn / 0 fail, `npm run build` ve `git diff --check` temiz.
