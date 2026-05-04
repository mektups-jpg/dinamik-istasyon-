# 11-05 Logaritma Ters Ayna Odası

## Kapsam
- `MAT.11.1.4.1`: Üstel bir fonksiyonun tersini alarak logaritmik formata dönüştürür.
- `MAT.11.1.5.1`: Tabanı 1'den büyük olan logaritmik fonksiyon grafiğini çizer.
- `MAT.11.1.5.2`: Tabanı 0 ile 1 arasında olan logaritmik fonksiyon grafiğini çizer.

## Ana Oyuncak
Tek sahne: `y=x` aynası olan ters mühendislik odası. Öğrenci ayna sürgüsünü kapalıdan açığa taşır; `y=a^x` eğrisinin noktaları `y=x` aynasına göre yer değiştirip `x=a^y`, yani `y=log_a(x)` grafiğine dönüşür. Sonra taban çekirdeği aynı sahnede değiştirilir: `a>1` için logaritma artar, `0<a<1` için logaritma azalır.

## Görevler
1. Aynayı %100 aç ve üstel eğriyi logaritmaya dönüştür.
2. Tabanı `a>1` bölgesinde tutarak artan logaritma grafiğini kilitle.
3. Tabanı `0<a<1` bölgesine indirerek azalan logaritma grafiğini kilitle.

## Route ve Test ID
- Route: `/embed/algebra/logarithm-inverse-mirror`
- Ana sahne: `logarithm-mirror-scene`
- Grafik ekranı: `logarithm-graph-screen`
- Ayna sürgüsü: `logarithm-mirror-handle`
- Taban sürgüsü: `logarithm-base-handle`
- Onay: `logarithm-mirror-check`
- Reset: `logarithm-mirror-reset`

## QA Akışı
- Yanlış onay AstroBot hata mesajı üretmeli.
- Ayna ve taban sürgüleri sürüklenebilir olmalı.
- Ayna sürgüsü `Home` ile aktif görevde %100 hedefe gitmeli.
- Taban sürgüsü `Home` ile aktif görev hedef tabanına gitmeli.
- Üç görev tamamlanınca completion ekranı görünmeli.
- Orta/dar viewport'ta grafik, iki sürgü ve kontrol aksiyonları kırpılmamalı.
