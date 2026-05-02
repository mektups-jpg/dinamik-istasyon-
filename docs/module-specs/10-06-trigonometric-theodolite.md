# 10-06 Trigonometrik Teodolit

## Amaç
10. sınıf dik üçgende trigonometrik oranları tek ölçüm cihazı deneyinde öğretmek. Öğrenci oranları formül kartı olarak ezberlemez; açı kolunu hareket ettirip karşı, komşu ve hipotenüs uzunluklarının canlı değişimini görerek `sin`, `cos`, `tan` ve `cot` oranlarını okur.

## Atom Kapsamı
- `MAT.10.4.1.1`: Dik üçgende karşı dik kenarı hipotenüse bölerek "Sinüs" değerini saptar.
- `MAT.10.4.1.2`: Dik üçgende komşu dik kenarı hipotenüse bölerek "Kosinüs" değerini saptar.
- `MAT.10.4.1.3`: Dik üçgende karşı dik kenarı komşu dik kenara bölerek "Tanjant" değerini saptar.
- `MAT.10.4.1.4`: Dik üçgende komşu dik kenarı karşı dik kenara bölerek "Kotanjant" değerini saptar.

## Kapsam Dışı
- `MAT.10.4.2.x` trigonometrik özdeşlikler ayrı **Birim Çember Kalkanı** modülündedir.
- `MAT.10.4.3.x` sabit alan üçgenleri ayrı **Sabit Alan Üçgen Rayı** modülündedir.
- `MAT.10.4.4.x` sinüs/kosinüs teoremleri ayrı **Sinüs-Kosinüs Arazi Ölçeri** modülündedir.
- 11. sınıf trigonometrik fonksiyon grafikleri ve dalgalar bu modülün kapsamına alınmaz.

## Ana Oyuncak
Tek sahne bir dijital teodolit ölçüm masasıdır:
- Sabit bir dik üçgen zemini vardır; öğrenci açı kolunu sürükleyerek hedef ışını yukarı/aşağı döndürür.
- Teodolit, karşı kenar, komşu kenar ve hipotenüsü farklı neon ölçü şeritleriyle canlı gösterir.
- Aktif oran kartuşu `sin`, `cos`, `tan`, `cot` olarak sırayla değişir; öğrenci doğru iki ölçü şeridini oran okuyucusuna kilitler.
- Oran sonucu sahnede kesir ve yaklaşık ondalık değer olarak görünür.

## Görev Akışı
1. `sin` görevi: karşı kenar / hipotenüs ölçü şeritlerini seç.
2. `cos` görevi: komşu kenar / hipotenüs ölçü şeritlerini seç.
3. `tan` görevi: karşı kenar / komşu kenar ölçü şeritlerini seç.
4. `cot` görevi: komşu kenar / karşı kenar ölçü şeritlerini seç.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: döndürülebilir teodolit açı kolu ve üç kenar ölçü şeridi.
- Sağ/alt panel yalnız aktif oran, canlı uzunluklar, seçilen pay/payda ve onay/reset içerir.
- Öğrenci bir kenar seçtiğinde o kenar sahnede parlamalı; yanlış iki kenar seçildiğinde AstroBot kısa ve öğretici hata vermeli.
- Açı kolu hem sürüklenebilir hem klavyeyle erişilebilir olmalı; Browser Use QA kırılgan koordinata bağlı kalmamalı.
- Görsel metafor gerçek ölçüm cihazı gibi sade ve teknik hissetmeli; dekoratif ama matematiksel anlamı olmayan parça eklenmemeli.

## QA Başarı Kriteri
- `/embed/trigonometry/trigonometric-theodolite?qa=1` açılır.
- `trig-theodolite-scene`, `theodolite-angle-handle`, `ratio-side-opposite`, `ratio-side-adjacent`, `ratio-side-hypotenuse`, `trig-theodolite-check` görünür.
- Yanlış kenar seçimi AstroBot hata mesajı üretir.
- Dört oran görevi doğru seçimlerle tamamlanır ve `10. SINIF LAB TAMAMLANDI` görünür.
- `npm run build`, `git diff --check`, Browser Use console ve embed smoke temizdir.
