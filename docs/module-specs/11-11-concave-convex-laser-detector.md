# 11-11 Konkav-Konveks Lazer Dedektörü

## Durum

Done. SSOT atomları doğrulandı; bu modül `MAT.11.2.3.x` kapsamını ayrı bir makro deney olarak ele alır. Köşegen sayısı, dış açı toplamı, simetri ve mozaik kaplama bu modüle sıkıştırılmaz.

## Amaç
11. sınıf öğrencisine içbükey/dışbükey ayrımını tek güçlü görsel işaretle öğretmek: lazer tarayıcı şeklin köşelerini dolaşır, bütün iç açılar 180°'den küçükse dışbükey kilidi yanar; en az bir iç açı 180°'den büyükse içeri göçen köşe kırmızı alarm verir.

## Atom Kapsamı
- `MAT.11.2.3.1`: Bütün iç açıları 180°'den küçük olan düzgün şekillere "Dışbükey (Konveks)" etiketini basar.
- `MAT.11.2.3.2`: En az bir iç açısı 180°'den büyük olan içeri göçmüş şekillere "İçbükey (Konkav)" etiketini basar.

## Kapsam Dışı
- Çokgen köşegen sayısı ve dış açı toplamı 11-12 Çokgen Köşegen ve Simetri Atölyesi kapsamına bırakılır.
- Mozaik/fayans kaplama 11-13 Mozaik Kaplama Atölyesi kapsamına bırakılır.
- Özel dörtgen sınıflandırması tekrar edilmez; bu kapsam 11-10 içinde tamamlandı.

## Ana Oyuncak
Tek sahne bir **lazer açı dedektörü** olur:
- Ortada taranacak çokgen numunesi bulunur.
- Öğrenci lazer probunu köşe rayında ilerletir.
- Dışbükey görevde her köşe yeşil-mavi ışıkla "180° altı" olarak mühürlenir.
- İçbükey görevde içeri göçen köşede kırmızı alarm halkası ve ">180°" etiketi görünür.
- Öğrenci sınıflandırma kilidinden `Konveks` veya `Konkav` seçer.

## Görev Akışı
1. `konveks tarama`: Beşgen numunesinde bütün köşeler 180° altında taranır; doğru kilit `Konveks`.
2. `konkav alarm`: İçeri göçmüş beşgen numunesinde tek refleks köşe yakalanır; doğru kilit `Konkav`.

## Route
- `/embed/geometry/concave-convex-laser-detector`

## Test ID Kontratı
- `concave-convex-laser-scene`
- `concave-convex-angle-probe`
- `concave-convex-lock-convex`
- `concave-convex-lock-concave`
- `concave-convex-check`
- `concave-convex-reset`

## QA Planı
- `npm run module:check -- concave-convex-laser-detector`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/geometry/concave-convex-laser-detector?qa=1` açılır.
  - Ana lazer sahnesi, açı probu ve iki sınıflandırma kilidi görünür.
  - Yanlış kilit veya eksik tarama AstroBot hata mesajı üretir.
  - `Home` fallback ile prob hedefe alınır.
  - Konveks ve konkav görevleri tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - İçeri göçen köşe gerçekten en güçlü görsel sinyal mi, 180° eşiği anlaşılır mı, iki görev kafa karıştırmadan ayrışıyor mu değerlendirilir.

## Uygulama Checkpoint
- Route registry'ye bağlandı: `/embed/geometry/concave-convex-laser-detector`.
- Kaynak parçaları: `types`, `detectorModel`, `ConcaveConvexScene`, `ConcaveConvexControls`, `ConcaveConvexLaserDetectorApp`.
- Statik kapılar geçti: `module:check`, `npm run build`, `git diff --check`.
- Gemini 3 Flash kaynak incelemesi ilk turda lazer ışınının köşeden köşeye sıçramasını must-fix verdi; ışın ucu polygon yolu üzerinde sürekli ilerleyecek ve açı etiketleri şekil içine ofsetlenecek şekilde düzeltildi. İkinci kaynak incelemesinde must-fix yok.
- Browser Use final turunda yanlış konveks/konkav kilitleri, `Home` fallback ile iki doğru görev, completion ve console warning/error `[]` geçti.
- Browser Use QA sırasında konkav görevde sağ panelin `90°` göstermesi, kırmızı alarm köşesinin ise `266°` olması yakalandı; aktif açı etiketi alarm açısına bağlandı ve tekrar test edildi.
- Gemini 3 Flash final görsel değerlendirmesi 96/100 PASS verdi, must-fix yok.
