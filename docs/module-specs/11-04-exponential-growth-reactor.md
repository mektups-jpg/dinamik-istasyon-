# 11-04 Üstel Büyüme Reaktörü

## Kapsam
- `MAT.11.1.3.1`: Tabanı 1'den büyük olan `f(x)=a^x` üstel fonksiyonunun artan grafiğini çizer.
- `MAT.11.1.3.2`: Tabanı 0 ile 1 arasında olan üstel fonksiyonun azalan grafiğini çizer.

## Ana Oyuncak
Tek sahne: taban sürgüsü olan temiz bir büyüme reaktörü. Öğrenci `a` tabanını doğrudan sürükler; `a=1` nötr kapısının sağında grafik yükselir, solunda grafik azalır. Sahne sadece üstel fonksiyon davranışını öğretir; logaritma, ters fonksiyon ve gerçek yaşam problemleri ayrı modüllere bırakılır.

## Görevler
1. Tabanı `a>1` bölgesine taşı ve artan üstel grafiği kilitle.
2. Tabanı `0<a<1` bölgesine taşı ve azalan üstel grafiği kilitle.

## Route ve Test ID
- Route: `/embed/algebra/exponential-growth-reactor`
- Ana sahne: `exponential-growth-scene`
- Grafik ekranı: `exponential-graph-screen`
- Taban sürgüsü: `exponential-base-handle`
- Onay: `exponential-growth-check`
- Reset: `exponential-growth-reset`

## QA Akışı
- Yanlış onay AstroBot hata mesajı üretmeli.
- Taban sürgüsü sürüklenebilir ve odaklandığında `Home` ile aktif görev hedef tabanına hizalanmalı.
- Artan görevde grafik sağa doğru hızlanarak yükselmeli.
- Azalan görevde grafik sağa doğru sönümlenerek azalmalı.
- Completion ekranı görünmeli.
- Orta/dar viewport'ta sahne, taban sürgüsü ve kontrol aksiyonları kırpılmamalı.
