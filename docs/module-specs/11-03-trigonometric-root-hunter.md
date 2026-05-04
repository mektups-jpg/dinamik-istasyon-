# 11-03 Trigonometrik Kök Avcısı

## Amaç
11. sınıf öğrencisine trigonometrik denklemlerin köklerini formül listesi ezberletmeden, grafik üzerindeki kesişim noktaları olarak buldurmak. Bu modül `11-01 Trigonometrik Osiloskop` ve `11-02 Tanjant Asimptot Kapıları` deneylerinin devamıdır; burada ana oyuncak bir **dalga kök tarayıcısıdır**.

## Atom Kapsamı
- `MAT.11.1.2.1`: İçerisinde sinüs barındıran trigonometrik bir denklemin köklerini bulur.
- `MAT.11.1.2.2`: İçerisinde kosinüs barındıran trigonometrik bir denklemin köklerini bulur.
- `MAT.11.1.2.3`: İçerisinde tanjant barındıran trigonometrik bir denklemin köklerini bulur.
- `MAT.11.1.2.4`: İçerisinde kotanjant barındıran trigonometrik bir denklemin köklerini bulur.

## Kapsam Dışı
- Genel çözüm formülleri, radyan-derece dönüşüm alıştırmaları, çok adımlı özdeşlik sadeleştirmeleri ve sınav tipi cebir manipülasyonları bu ilk deneyde yoktur.
- Tanjant/kotanjant asimptot mantığı `11-02 Tanjant Asimptot Kapıları` içinde tamamlandı; burada yalnız kökün asimptot dışında kesişim olduğu vurgulanır.
- Aynı anda dört fonksiyon gösterilmez; tek dalga sahnesi aktif göreve göre sin, cos, tan veya cot davranışına dönüşür.

## Ana Oyuncak
Tek sahne bir trigonometrik kök avcısıdır:
- 0°-360° grafik tünelinde aktif fonksiyon dalgası görünür.
- Yatay hedef ışını denklem değerini temsil eder: örnek `sin(x)=1/2`.
- Öğrenci iki kök işaretçisini dalga ile hedef ışınının kesişimlerine taşır.
- Doğru kökler kilitlenince kesişim noktaları parlar ve açı değerleri kısa etiket olarak görünür.
- `tan` ve `cot` görevlerinde asimptot kapıları silik uyarı duvarı olarak kalır; köklerin duvar üzerinde değil kesişimde olduğu görülür.

## Görev Akışı
1. `Sinüs Kökleri`: `sin(x)=1/2` için 30° ve 150° köklerini işaretle.
2. `Kosinüs Kökleri`: `cos(x)=-1/2` için 120° ve 240° köklerini işaretle.
3. `Tanjant Kökleri`: `tan(x)=1` için 45° ve 225° köklerini işaretle; 90°/270° duvarlarının kök olmadığını gör.
4. `Kotanjant Kökleri`: `cot(x)=√3` için 30° ve 210° köklerini işaretle; 0°/180°/360° duvarlarının kök olmadığını gör.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: dalga, hedef ışını ve iki kök işaretçisi.
- Kontrol paneli yalnız aktif denklem, seçilen kökler, onay/reset ve kısa kural içerir.
- Öğrenci "kök = grafiğin hedef ışını kestiği açı" fikrini sahnede görür.
- Hedef açı etiketi yalnız işaretçi kilitlenince netleşir; ekran açı listesiyle dolmaz.
- Orta/dar viewport'ta dalga sahnesi ve kök işaretçileri kırpılmaz; işaretçiler `touch-action: none` ve klavye `Home` fallback ile test edilebilir.

## Route
- `/embed/trigonometry/trigonometric-root-hunter`

## Test ID Kontratı
- `trigonometric-root-scene`
- `root-wave-screen`
- `root-target-line`
- `root-marker-a`
- `root-marker-b`
- `trigonometric-root-check`
- `trigonometric-root-reset`

## QA Planı
- `npm run module:check -- trigonometric-root-hunter`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/trigonometry/trigonometric-root-hunter?qa=1` açılır.
  - İlk sahne, aktif dalga, hedef ışını ve iki kök işaretçisi görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback veya gerçek etkileşimle dört görev tamamlanır.
  - Completion ekranı görünür.
  - Console warning/error kontrolü yapılır.
  - Orta viewport smoke yapılır.
- Gemini 3 Flash:
  - Başlangıç, tanjant/kotanjant asimptotlu görev ve completion ekranları kök fikri, görsel netlik ve bilişsel yük açısından değerlendirilir.
  - Must-fix yok, Gemini skor >=85 ve internal skor >=90 olmadan Done yapılmaz.
