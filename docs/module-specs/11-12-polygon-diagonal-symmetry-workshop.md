# 11-12 Çokgen Köşegen ve Simetri Atölyesi

## Durum

Done. SSOT atomları doğrulandı; bu modül `MAT.11.2.4.x` kapsamını ayrı bir makro deney olarak ele alır. Konkav/konveks ayrımı 11-11 içinde tamamlandı; mozaik/fayans kaplama 11-13 içinde ayrıca yapılacaktır.

## Amaç
11. sınıf öğrencisine dışbükey çokgen formüllerini ezber yerine tek düzenekte doğurtmak: kenar sayısı değiştikçe köşegen lazerleri çoğalır, dış açı yürüyüşü 360° halkayı kapatır ve simetri aynası düzgün çokgenin eksenlerini saydırır.

## Atom Kapsamı
- `MAT.11.2.4.1`: Dışbükey bir çokgenin toplam köşegen sayısını n(n-3)/2 formülüyle saptar.
- `MAT.11.2.4.2`: Dışbükey bir çokgenin dış açıları toplamının sabit (360°) olduğunu test eder.
- `MAT.11.2.4.3`: Düzgün çokgenin simetri ekseni sayısını belirler.

## Kapsam Dışı
- İçbükey/dışbükey etiketleme tekrar edilmez.
- Mozaik ve fayans hizalama problemleri bu modüle sıkıştırılmaz.
- Genel çokgen alan formülleri bu modülün hedefi değildir.

## Ana Oyuncak
Tek sahne bir **çokgen kalibrasyon masası** olur:
- Ortada düzgün çokgen bulunur; öğrenci kenar sayısını 5-8 arasında ayarlar.
- Köşegen modunda bir köşeden çıkan lazerler ve sonra tüm çokgenin köşegen patlaması görünür.
- Dış açı modunda yürüyen robot her köşede döner; dönüş parçaları halka üzerinde birleşip 360° olur.
- Simetri modunda ayna çizgisi döndürülür; doğru eksende şekil kendi üzerine kilitlenir.

## Görev Akışı
1. `köşegen sayacı`: n=6 için köşegen lazerlerini tamamla ve toplam 9 köşegeni kilitle.
2. `dış açı yürüyüşü`: çokgen çevresinde dış açı parçalarını 360° halkaya tamamla.
3. `simetri aynası`: düzgün altıgenin 6 simetri eksenini ayna taramasıyla say.

## Route
- `/embed/geometry/polygon-diagonal-symmetry-workshop`

## Test ID Kontratı
- `polygon-workshop-scene`
- `polygon-vertex-dial`
- `polygon-diagonal-burst`
- `polygon-exterior-walker`
- `polygon-symmetry-mirror`
- `polygon-check`
- `polygon-reset`

## QA Planı
- `npm run module:check -- polygon-diagonal-symmetry-workshop`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/geometry/polygon-diagonal-symmetry-workshop?qa=1` açılır.
  - Ana çokgen sahnesi, kenar sayısı kontrolü, köşegen lazeri, dış açı yürüyüşü ve simetri aynası görünür.
  - Yanlış sayım veya eksik tarama AstroBot hata mesajı üretir.
  - `Home` fallback ile aktif kontrol hedefe alınır.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Köşegen formülü çizimden doğuyor mu, dış açı 360° sezgisi net mi, simetri eksenleri sayımı kafa karıştırmadan ayrışıyor mu değerlendirilir.

## Kapanış Notu
- `src/modules/grade11/polygon-diagonal-symmetry-workshop/` altında `types`, `polygonWorkshopModel`, `PolygonWorkshopScene`, `PolygonWorkshopControls` ve `PolygonDiagonalSymmetryWorkshopApp` olarak parçalandı.
- Browser Use IAB ile test id görünürlüğü, yanlış onay, `Home` fallback üzerinden üç görev, completion ve console warning/error `[]` doğrulandı.
- Browser Use görsel QA sırasında dar embed görünümde sahne başlık rozeti ve alt ray değer etiketleri sıkıştı; rozet satırlandı, raylar arası boşluk artırıldı, yüzde etiketleri ray sağına alındı ve `n=5` durumundaki `9 köşegen` metni `HEDEF: 9 köşegen` olarak netleştirildi.
- Gemini 3 Flash ilk tur 88/100 PASS ama must-fix verdi; düzeltmelerden sonra final tur 98/100 PASS, must-fix yok.
- `npm run module:check -- polygon-diagonal-symmetry-workshop` 21 pass / 0 warn / 0 fail, `npm run build` ve `git diff --check` temiz.
