# 12-01 Dizi Çarkı

## Durum
Showcase Ready. Bu modül 2026-05-17 tarihinde Kaptan canlı görsel onayı aldı: "Dizi çarkı modülü güzel oldu." 12. sınıf tam sahne altın şablonunun ilk onaylı üretim referansıdır.

## Amaç
12. sınıf modülleri için 3D cisimler referansına yakın, ana oyuncağı sahne merkezine alan ve kontrol alanını ikinci planda tutan tam ekran kabuk kurmak. Dizi Çarkı bu kabuğun ilk oynanabilir örneğidir: öğrenci sabit farkı, sabit oranı ve dizi-fonksiyon ayrımını aynı ray üzerinde görür.

## Atom Kapsamı
- `MAT.12.1.1.1`: Aritmetik dizilerin sabit artış kuralını analiz eder.
- `MAT.12.1.1.2`: Geometrik dizilerin sabit çarpım (oran) kuralını analiz eder.
- `MAT.12.1.1.3`: Gerçek sayı dizilerini standart gerçek fonksiyonlarla kıyaslar (tanım kümesi ayrımı).

## Kapsam Dışı
- Polinom anatomisi, eşitsizlik, limit ve türev atomları bu modüle alınmaz.
- Diğer 12. sınıf modüllerinin atomları bu modüle taşınmaz; 12-01 yalnız dizi okuma kazanımlarının vitrin referansıdır.

## Ana Oyuncak
Ortada oranlı bir "dizi rayı / kural çarkı" bulunur. Beş sayı kapsülü sahnenin merkezinde okunur; kapsüllerin arasında `+3`, `x2` veya `1->2` ilişki çipleri yanar. Sağ panel yalnız görev, mod seçimi, küçük hareket, kontrol/reset ve feedback alanıdır; ana öğrenme sahnesini çalmaz.
Başlangıçta hiçbir mercek seçili gelmez; öğrenci önce Aritmetik/Geometrik/Bir Fonksiyondur kararını verir. Sahne içindeki tarayıcı/lens ve "sabitlik izi" seçilen merceğin ilişkileri tutarlı okuyup okumadığını gösterir; yanlış mercekte değer barları dengesizleşir, doğru mercekte aynı okuma korunur.
Kontrol düğmesi seçim yapılmadan "Önce Kural Seç" dilinde kalır; seçim sonrası öğrencinin ne yapacağını daha açık söyleyen "Seçimi Kontrol Et" aksiyonuna dönüşür. Fonksiyon/dizi ayrımı görevlerinde `n²` ve `n³` kuralları yalnız formül olarak kalmaz: sahnede ilişki çipleri, `n=1..5` kapsül etiketleri, `n²/n³` motoru ve canlı `n=6` projeksiyonu ile dizi/fonksiyon ayrımı görünür hale gelir.
2026-05-16 görsel cila: ana oyuncak artık yalnız ray gibi kalmaz; rayın altında seçilen ilişkiyi taşıyan döner "dizi motoru" vardır. Mercek seçilince motor sembolü `+3`, `x2` veya `n²` olur; kilitleme sonrası motor kartı başarı durumuna geçer.
2026-05-16 teknoloji cila: doğru mercek seçildiğinde işlem enerjisi kapsülden kapsüle akar ve sahne bir sonraki terimi canlı projekte eder. Aritmetikte `16 + 3 -> a6 = 19` ve `23 + 5 -> a6 = 28`, geometrikte `32 x 2 -> a6 = 64` ve `81 x 3 -> a6 = 243`, fonksiyon ayrımında `6² -> n=6 = 36` ve `6³ -> n=6 = 216` görünür; bu, kağıtta statik kalan "kuralı devam ettirme" fikrini ekranda hareketli ve sezgisel yapar.
2026-05-16 production candidate cila: genel trophy ekranı yerine 12-01'e özel başarı sahnesi eklendi. Completion artık üç kilitlenen bakışı ikişer kanıtla (`+3/+5`, `x2/x3`, `n²/n³`) özetliyor; öğrenci neyi tamamladığını yalnız puanla değil, matematiksel kanıtla görüyor. Atom sayısı değişmediği için XP `+120` kalır.

## Görev Akışı
1. `MAT.12.1.1.1`: `4, 7, 10, 13, 16` dizisinde sabit fark `+3` kilitlenir.
2. `MAT.12.1.1.2`: `2, 4, 8, 16, 32` dizisinde sabit oran `x2` kilitlenir.
3. `MAT.12.1.1.3`: `1, 4, 9, 16, 25` dizisinde kural `n²` olsa da okumanın yalnız `n=1,2,3...` ayrık adımlarında yapıldığı gösterilir.
4. `MAT.12.1.1.1`: `3, 8, 13, 18, 23` dizisinde ikinci sabit fark örneği `+5` ile pekiştirilir.
5. `MAT.12.1.1.2`: `1, 3, 9, 27, 81` dizisinde ikinci sabit oran örneği `x3` ile pekiştirilir.
6. `MAT.12.1.1.3`: `1, 8, 27, 64, 125` dizisinde kural `n³` olsa da dizinin yine doğal sayı adımlarında okunduğu gösterilir.

Yanlış seçimde feedback yalnız "yanlış" demez; sahnedeki ilişki çipleri ve panel mesajı neden yanlış olduğunu açıklar.
AstroBot geri bildirimi modül içinde kopyalanmaz; yanlış/doğru/ilerleme mesajları ortak `useAstroBotStore` hattına gönderilir ve sağ paneldeki AstroBot kartı ortak `AstroBotPanel` bileşeninden gelir.

## Route
- `/embed/algebra/sequence-wheel`

## Test ID Kontratı
- `sequence-wheel-scene`
- `sequence-wheel-manipulator`
- `sequence-wheel-arithmetic`
- `sequence-wheel-geometric`
- `sequence-wheel-function`
- `sequence-wheel-check`
- `sequence-wheel-feedback`
- `sequence-wheel-reset`

## QA Notu
- Ana oyuncak küçük kalırsa fail.
- Ana oyuncak devleşip yazıları veya dock'u boğarsa fail.
- İlk viewport'ta aşağı kaydırma, gri boş alan, dikdörtgen arka leke, panelin sahneye binmesi veya kırpılan kapsül varsa fail.
- Ana kabul ekranı bilgisayar/kiosk görünümüdür. Telefon görünümü bu modül için yalnız patlama/taşma smoke kontrolüdür; kalite kararını desktop/dizüstü sahne belirler.
- Computer Use canlı gözleminde yanlış seçim, doğru zincir, sağ/sol hareket, check, completion ve reset denendi.
- 2026-05-15 student-flow polish: seçimsiz kontrol engeli, fonksiyon ayrımı için `n = 1..5` örnek noktaları ve sol/sağ ray hareketi Computer Use ile tekrar gözlendi.
- 2026-05-16 microcopy polish: sağ paneldeki kontrol düğmesi "Merceği Kilitle" yerine daha anlaşılır "Seçimi Kontrol Et" olarak değiştirildi.
- 2026-05-16 microcopy polish: sağ paneldeki "Fonksiyon Ayrımı" seçim etiketi öğrenciye daha anlaşılır olması için "Bir Fonksiyondur" olarak değiştirildi.
- 2026-05-16 visual polish: üçüncü görevde sayı kapsüllerinin arkasındaki fonksiyon eğrisi tamamen kaldırıldı. Fonksiyon fikri artık sayıların arkasında görsel leke yapmadan `1->2` ilişki çipleri, `n²` motoru ve canlı `n=6` projeksiyonu ile anlatılıyor.
- 2026-05-16 visual polish: dizi motoru/rotor eklendi; ilk denemedeki gömülü disk hissi Computer Use'ta yakalanıp motor kartı içine taşındı. Başlangıç ve doğru kilit state'i canlı ekranda tekrar gözlendi.
- 2026-05-16 tech polish: işlem darbeleri ve canlı sonraki terim projeksiyonu eklendi; Computer Use ile `a6=19`, `a6=64` ve `n=6 -> 36` state'leri gözlendi.
- 2026-05-16 production candidate: özel completion ekranı ve Dinamik İstasyon modül geliştirme skill hafızası eklendi. Bu tur modülü `Showcase Candidate` yapar; Kaptan onayı olmadan `Showcase Ready` değildir.
- 2026-05-16 görev artırma: görev sayısı `3`ten `6`ya çıkarıldı. Her atom iki örnekle pekişiyor: aritmetik `+3/+5`, geometrik `x2/x3`, fonksiyon/dizi ayrımı `n²/n³`. Bitiş ekranı 6 kalabalık kart yerine 3 ustalık kartında 6 kanıt satırı gösteriyor; XP atom sayısı değişmediği için `+120` kalıyor.
- 2026-05-16 Computer Use full-chain: 6 görev zincirinde iki yanlış deneme, `+5/x3/n³` motor sembolleri, completion ve `Tekrar Oyna` reseti doğrulandı. QA sırasında yakalanan `+5` görevinde motorun `+3` göstermesi hatası düzeltildi.
- Playwright/Chrome screenshot kanıtları: desktop/dizüstü `1440x900` ve `1488x768`, yanlış/doğru/fonksiyon/completion state. Telefon smoke nonblocking tutulur.
- Gemini final v2: `.agent/gemini-reports/12-01-sequence-wheel-playable-draft-final-v2.txt` içinde `PASS 92/100`, must-fix yok.
- 2026-05-17 Kaptan canlı görsel onayı sonrası modül `Showcase Ready` olarak işaretlendi; sonraki küçük cila istekleri yeni tur olarak ele alınır.
