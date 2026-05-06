# 10-08 Sinüs-Kosinüs Arazi Ölçeri

## Durum

Done. SSOT atomları `MAT.10.4.4.1` ve `MAT.10.4.4.2` olarak doğrulandı.

## Amaç

10. sınıf öğrencisine sinüs ve kosinüs teoremlerini soyut formül seçimi olarak değil, dik olmayan bir arazi üçgeninde eksik mesafe ve eksik açı ölçen tek lazerli arazi cihazı olarak öğretmek.

## Atom Kapsamı

- `MAT.10.4.4.1`: Dik olmayan üçgende bilinen açılardan Cosinüs teoremini formüle ederek eksik kenar uzunluğunu bulur.
- `MAT.10.4.4.2`: Dik olmayan üçgende bilinen kenarlardan Sinüs teoremini formüle ederek bilinmeyen açıyı bulur.

## Kapsam Dışı

- Dik üçgende `sin`, `cos`, `tan`, `cot` oran seçimi `10-06 Trigonometrik Teodolit` içinde tamamlandı.
- Üçgende sabit alan fikri `10-07 Sabit Alan Üçgen Rayı` içinde ayrı ele alındı.
- `sin²x + cos²x = 1` özdeşliği `10-09 Birim Çember Kalkanı` içinde ayrı ele alınacak.
- 11. sınıf trigonometrik dalga, denklem ve kök grafikleri bu modülün kapsamına alınmaz.

## Ana Oyuncak

Tek sahne bir **arazi ölçer üçgen masası** olur:

- Arazide `A`, `B`, `C` istasyonları dik olmayan bir üçgen kurar.
- Öğrenci tek lazer ölçeri aktif göreve göre kenar veya açı hedeflerine hizalar.
- Kosinüs görevi, iki kenar ve aradaki açıdan karşı kenarı hesaplayan mesafe lazerini açar.
- Sinüs görevi, bilinen kenar-açı eşleşmesinden bilinmeyen açıyı hesaplayan açı yayı lazerini açar.
- Formül paneli yalnız aktif teoremin seçilen parçalarını yakar; iki teorem aynı anda kalabalık gösterilmez.

## Görev Akışı

1. `kosinüs mesafe`: `AB`, `AC` ve `A` açısını kilitle; `BC² = AB² + AC² - 2AB AC cos(A)` ölçümünü tamamla.
2. `sinüs açı`: bilinen `A`, `BC` ve `AC` eşleşmesini kilitle; `sin(B) / AC = sin(A) / BC` oranıyla `B` açısını ölç.
3. `arazi raporu`: ölçüm raporunu kilitle; hangi durumda kosinüs, hangi durumda sinüs teoremi seçildiğini tek cümleyle mühürle.

## Route

- `/embed/geometry/sine-cosine-terrain-surveyor`

## Test ID Kontratı

- `terrain-surveyor-scene`
- `terrain-station-a`
- `terrain-station-b`
- `terrain-station-c`
- `terrain-cosine-lock`
- `terrain-sine-lock`
- `terrain-report-lock`
- `terrain-check`
- `terrain-reset`

## QA Planı

- `npm run module:check -- sine-cosine-terrain-surveyor`: 22 pass / 0 warn / 0 fail.
- `npm run build`: geçti.
- `git diff --check`: temiz.
- Browser Use:
  - `/embed/geometry/sine-cosine-terrain-surveyor?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile kosinüs, sinüs ve rapor hedefleri kilitlenir.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü `[]`.
  - Screenshot kanıtları: `.agent/browser-use-shots/10-08-*.png`.
- Gemini 3 Flash:
  - Final tur `.agent/gemini-reports/10-08-sine-cosine-terrain-surveyor.txt`: 96/100 PASS, must-fix yok.
  - Öğrencinin ne zaman kosinüs, ne zaman sinüs teoremi kullanacağını görselden ayırt edebildiği doğrulandı.
  - Formül paneli kalabalık yapmadan aktif teoremi gösteriyor; toast/buton yakınlığı should-fix olarak nonblocking not edildi.
