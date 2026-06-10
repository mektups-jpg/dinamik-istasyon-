# 05-06 Üçgen Çubuk Atölyesi

## Durum
Showcase Ready. Ortaokul 5. sınıf üretim hattında `polygon-collision-test` modülü 2026-06-03 canlı CU incelemesi sonrası anlaşılabilirlik için sadeleştirilmiş ve Kaptan canlı onayıyla vitrine alınmıştır.

## Amaç
5. sınıf öğrencisinin üç çubuk uzunluğunu değiştirerek üçgen eşitsizliğini somut biçimde test etmesini sağlamak. Öğrenci iki kısa çubuğun toplamının en uzun çubuktan büyük olması gerektiğini sayı, renk ve sahne hareketiyle aynı anda görür.

## Atom Kapsamı
- `MAT.5.3.7.1`: Bir üçgenin iki kenarının toplam uzunluğunun, diğer kenardan büyük olmak zorunda olduğu (Üçgen Eşitsizliği) kuralını test eder.

## Kapsam Dışı
- Üçgen iç açı toplamı, açı-kenar ilişkisi, benzerlik ve eşlik bu modülün hedefi değildir.
- Çokgen sınıflandırması ve ileri ispat dili kullanılmaz.

## Ana Oyuncak
Tek ana oyuncak üç renkli çubuk atölyesidir:
- Kırmızı `A`, mavi `B`, yeşil `C` çubuklarının uzunlukları büyük `+` ve `-` düğmeleriyle değiştirilir.
- Sağdaki sahne çubukların uçlarının kapanıp kapanmadığını canlı gösterir.
- Kapanmayan durumda açıklık mesafesi ve hangi toplamın yetmediği yazılır.
- Kapanan durumda üçgen şekli oluşur ve başarı rengi yeşile döner.

## Görev Akışı
1. Öğrenci başlangıçta `A=3`, `B=4`, `C=8` durumunu görür.
2. Sistem `A + B = 7`, en uzun kenar `C = 8` olduğu için üçgenin kapanmadığını açıklar.
3. Öğrenci `+` veya `-` düğmeleriyle çubuk uzunluklarını değiştirir.
4. İki kısa çubuğun toplamı en uzun çubuktan büyük olduğunda sahne üçgeni kapatır.
5. Öğrenci farklı değerler deneyerek eşkenar, ikizkenar ve çeşitkenar üçgenleri keşfeder.

## UI/UX Kriterleri
- İlk üç saniyede hedef cümlesi görünür: iki kısa çubuğun toplamı en uzun çubuktan büyük olmalıdır.
- Slider tek başına ana kontrol değildir; büyük `+` ve `-` düğmeleri dokunma hedefi sağlar.
- Kapanma/kapanmama nedeni tek cümleyle verilir: kısa toplam, en uzun kenar ve karşılaştırma.
- Formül paneli 5. sınıf seviyesinde kısa kontrol satırları olarak kalır.
- Yanlış/geçersiz durumda öğrenci neden kapanmadığını görür; doğru/geçerli durumda sahne yeşil başarı durumuna geçer.
- Modül route'u `/embed/geometry/polygon-collision-test` olarak kalır.

## QA Başarı Kriteri
- `/embed/geometry/polygon-collision-test` açılır.
- `Üçgen Çubuk Atölyesi` başlığı görünür.
- Başlangıçta `A=3`, `B=4`, `C=8` ve `Üçgen kapanmadı` açıklaması görünür.
- `Yeşil (C) uzunluğunu azalt` düğmesiyle `C=5` yapılınca üçgen kapanır.
- `Üçgen kapanıyor` açıklaması, `BAĞLANTI BAŞARILI` durumu ve yeşil sahne görünür.
- Konsolda hata/uyarı olmamalıdır.
- `npm run module:check -- polygon-collision-test`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
