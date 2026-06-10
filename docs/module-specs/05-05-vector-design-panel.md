# 05-05 Doğru-Işın Çizim Paneli

## Durum
Showcase Ready. Ortaokul 5. sinif uretim hattinda `vector-design-panel` modulu 2026-06-02 Kaptan canli onayiyla vitrine alinmistir.

## Amaç
5. sınıf öğrencisinin doğru, ışın ve doğru parçası arasındaki farkı çizerek görmesini; kesişen doğrularda oluşan ters açıları seçip sanal iletkiyle ölçmesini sağlamak. Öğrenci önce çizim aracını seçer, sonra parlayan noktaları birleştirir ve her adımda hangi geometrik nesneyi oluşturduğunu ekranda görür.

## Atom Kapsamı
- `MAT.5.3.1.1`: Dijital/Sanal araçla bir doğru çizerek kodlar.
- `MAT.5.3.1.2`: Dijital/Sanal araçla bir doğru parçası çizerek kodlar.
- `MAT.5.3.1.3`: Dijital/Sanal araçla bir ışın çizerek kodlar.
- `MAT.5.3.3.1`: İletki aracıyla ekrandaki açının sayısal derece kavramını isabetli gösterir.
- `MAT.5.3.4.1`: İki doğru kesiştiğinde ortaya çıkan komşu açıları/Ters Açıları ve bunların özelliklerini doğrular.

## Kapsam Dışı
- Vektör cebiri, analitik doğru denklemi, eğim ve koordinat formülleri bu modülün hedefi değildir.
- Çokgen iç açı toplamı ve üçgen eşitsizliği ayrı geometri modüllerinde ele alınır.

## Ana Oyuncak
Tek ana oyuncak kareli çizim panelidir:
- Öğrenci soldan `Doğru`, `Işın` veya `Doğru parçası` aracını seçer.
- Panelin üstündeki görev kartı sıradaki adımı kalıcı olarak gösterir.
- Parlayan noktalar etiketlenir; yanlış araç seçilirse AstroBot doğru aracı söyler.
- Kesişen doğrular dört açı alanı üretir; öğrenci karşı karşıya duran ters açı çiftini seçer.
- İletki açı köşesine yerleşir ve öğrenci derece değerini kutuya yazar.

## Görev Akışı
1. Öğrenci `Doğru` aracını seçer.
2. İki mavi noktaya dokunarak ilk doğruyu çizer.
3. İki mor noktaya dokunarak ikinci doğruyu çizer.
4. Kesişen doğrularda karşılıklı duran ters açı çiftini seçer.
5. Seçtiği açıyı sanal iletkiyle ölçer.
6. `Işın` aracını seçip başlangıç ve yön noktasını işaretler.
7. Işının mavi doğruyla yaptığı açı türünü (`dar`, `dik` veya `geniş`) ekranda görür ve o açıyı ölçer.
8. `Doğru parçası` aracını seçip iki yeşil uç noktayı birleştirir.
9. Doğru parçasının mor doğruyla yaptığı açı türünü (`dar`, `dik` veya `geniş`) ekranda görür ve son açıyı ölçerek completion ekranına ulaşır.

## UI/UX Kriterleri
- İlk üç saniyede başlık, araçlar ve `Doğru aracını seç` görevi açıkça görünmelidir.
- Başlangıçta yanlış araç aktif görünmemelidir.
- Her görevde hedef noktaların yanında kısa etiket olmalıdır.
- Yanlış araç ve yanlış açı seçiminde neden yanlış olduğu söylenmelidir.
- Işın ölçümünde hangi açının istendiği `dar açı`, `dik açı` veya `geniş açı` ifadesiyle açıkça belirtilmelidir.
- Doğru parçası ölçümünde hangi açının istendiği `dar açı`, `dik açı` veya `geniş açı` ifadesiyle açıkça belirtilmelidir.
- İletki panelindeki metin 5. sınıf seviyesinde, formül veya terminal dili olmadan yazılmalıdır.
- Modül route'u `/embed/geometry/vector-design-panel` olarak kalır.

## QA Başarı Kriteri
- `/embed/geometry/vector-design-panel` açılır.
- `Doğru-Işın Çizimi` başlığı ve sıradaki adım kartı görünür.
- Yanlış araç seçimi ekranı düşürmeden AstroBot uyarısı verir.
- Doğru, ışın ve doğru parçası çizimleri parlayan noktalarla yapılır.
- Yanlış ters açı seçimi komşu açı açıklaması verir.
- Doğru ters açı seçimi ölçüm panelini açar.
- Completion ekranında `Çizim Tamamlandı` görünür.
- `npm run module:check -- vector-design-panel`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
