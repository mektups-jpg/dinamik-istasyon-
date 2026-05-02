# 11-02 Tanjant Asimptot Kapıları

## Kapsam
- `MAT.11.1.1.3`: `f(x)=tan(x)` referans fonksiyonunun asimptotlu grafiğini çizer.
- `MAT.11.1.1.4`: `f(x)=cot(x)` referans fonksiyonunun asimptotlu grafiğini çizer.

## Ana Oyuncak
Tek sahne: 0°-360° arası bir trigonometrik dalga tüneli. Öğrenci dikey neon "asimptot kapılarını" grafik üzerinde sürükleyerek tanjant ve kotanjantın yasak duvarlarını yerleştirir. Son katmanda bir tarayıcı duvara yaklaştığında eğrinin sonsuza fırladığını ve duvarda grafik noktası olmadığını görür.

## Görevler
1. `tan` grafiğinde 90° kapısını kilitle.
2. `tan` grafiğinde 270° kapısını kilitle.
3. `cot` grafiğinde 0° / 180° / 360° kapı ailesini kilitle.
4. Kotanjant tarayıcısını 180° duvarına yaklaştır; değer patlarken grafiğin duvarı kesmediğini gör.

## Route ve Test ID
- Route: `/embed/trigonometry/tangent-asymptote-gates`
- Ana sahne: `tangent-asymptote-scene`
- Grafik ekranı: `asymptote-graph-screen`
- Kapılar: `asymptote-gate-tan-a`, `asymptote-gate-tan-b`, `asymptote-gate-cot-a`, `asymptote-gate-cot-b`, `asymptote-gate-cot-c`
- Tarayıcı: `asymptote-scanner`
- Onay: `tangent-asymptote-check`
- Reset: `tangent-asymptote-reset`

## QA Akışı
- Yanlış onay AstroBot hata mesajı üretmeli.
- Her kapı sürüklenebilir ve odaklandığında `Home` ile görev hedef açısına hizalanmalı.
- Tarayıcı sürüklenebilir ve son görevde `Home` ile 178° yakınına hizalanmalı.
- Completion ekranı görünmeli.
- Orta/dar viewport'ta sağ panel aksiyonları ve sahne kırpılmamalı.
