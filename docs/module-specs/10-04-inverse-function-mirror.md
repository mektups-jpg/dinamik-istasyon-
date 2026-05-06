# 10-04 Ters Fonksiyon Aynası

## Durum

Done. SSOT atomları `MAT.10.2.5.1`, `MAT.10.2.5.2`, `MAT.10.2.5.3` ve `MAT.10.2.5.4` olarak doğrulandı. 11. sınıf uzun koşu kuyruğu tamamlandığı için üretim kilidi 10. sınıfa döndü.

## Amaç
10. sınıf öğrencisine ters fonksiyonu yalnız cebirsel denklem çözümü olarak değil, `y=x` aynasında giriş ve çıkış rollerinin yer değiştirmesi olarak sezdirme. Öğrenci grafik yansımasını, makine portlarının ters bağlanmasını ve denklemde x ile y rollerinin değişimini aynı ana deneyde görür.

## Atom Kapsamı
- `MAT.10.2.5.1`: Doğrusal bir fonksiyonun tersini cebirsel denklemlerle bulur.
- `MAT.10.2.5.2`: Karesel fonksiyonların tersini cebirsel denklemlerle bulur.
- `MAT.10.2.5.3`: Karekök fonksiyonlarının tersini cebirsel denklemlerle bulur.
- `MAT.10.2.5.4`: Rasyonel fonksiyonların tersini cebirsel denklemlerle bulur.

## Kapsam Dışı
- Genel tanım/değer kümesi kapı mantığı tekrar edilmez; `10-02 Tanım Kümesi Kapıları` içinde tamamlandı.
- İşaret tablosu ve eşitsizlik çözümü bu modüle alınmaz.
- Serbest grafik editörü yapılmaz; hedef ters alma sezgisidir.

## Ana Oyuncak
Tek sahne bir **ters fonksiyon ayna odası** olur:
- Ortada parlayan `y=x` aynası bulunur.
- Sol tarafta fonksiyon makinesi `x -> f(x)` çalışır; sağ tarafta ters makine `y -> f⁻¹(y)` portları görünür.
- Öğrenci ayna kolunu kapatınca grafik `y=x` boyunca yansır, giriş kapsülü çıkış kapsülüyle rol değiştirir.
- Denklemin iki tarafındaki `x` ve `y` etiketleri mekanik olarak yer değiştirir; çözüm adımı görsel boru hattı olarak açılır.

## Görev Akışı
1. `doğrusal ayna`: `f(x)=2x+1` grafiğini aynaya yansıt, portları ters bağla ve `f⁻¹(x)=(x-1)/2` sonucunu kilitle.
2. `kare/kök eşiği`: `x²` ile `√x` arasındaki tersliği güvenli bölgede göster; kareselde tek dal seçilmeden tersin fonksiyon olmadığını alarm olarak göster.
3. `rasyonel tersleme`: `f(x)=1/x` tipinde yasak duvarın aynada yine yasak duvar olarak kaldığını gör; ters sonucu doğru mühürle.

## Route
- `/embed/algebra/inverse-function-mirror`

## Test ID Kontratı
- `inverse-mirror-scene`
- `inverse-mirror-arm`
- `inverse-input-capsule`
- `inverse-output-capsule`
- `inverse-branch-gate`
- `inverse-check`
- `inverse-reset`

## QA Planı
- `npm run module:check -- inverse-function-mirror`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/inverse-function-mirror?qa=1` açılır.
  - Ayna sahnesi, giriş/çıkış kapsülleri, dal kapısı ve onay/reset görünür.
  - Yanlış mühür veya eksik dal seçimi AstroBot hata mesajı üretir.
  - `Home` fallback aktif kontrolü hedefe taşır.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Ters fonksiyonun yansıma ve cebir rol değişimi olarak sezilip sezilmediği, dal seçimi uyarısının kafa karıştırmadan göründüğü ve mobil/embed kontrollerin dokunulabilirliği değerlendirilir.

## Kapanış Notu
- `src/modules/grade10/inverse-function-mirror/` altında `types`, `inverseModel`, `InverseMirrorScene`, `InverseMirrorControls` ve `InverseFunctionMirrorApp` olarak parçalandı.
- Route `/embed/algebra/inverse-function-mirror` registry'ye bağlandı; modül tek ana oyuncak olarak `y=x` aynası, giriş/çıkış kapsülleri, dal kapısı, ters port makinesi ve mühür kontrolleriyle çalışıyor.
- Browser Use IAB ile test id görünürlüğü, yanlış onay AstroBot hatası, `Home` fallback üzerinden üç görev, completion ve console warning/error `[]` doğrulandı.
- İlk Gemini 3 Flash turu 92/100 PASS verdi ama rasyonel görevde kapsül/makine sıkışması ve `y=x aynası` etiketi çakışma riski için must-fix çıkardı. Kapsüller dış portlara açıldı, ayna etiketi ayrı rozet haline getirildi.
- Final Gemini 3 Flash turu 100/100 PASS, must-fix yok.
- `npm run module:check -- inverse-function-mirror` 22 pass / 0 warn / 0 fail, `npm run build` ve `git diff --check` temiz.
