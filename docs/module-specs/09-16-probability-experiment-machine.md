# 09-16 Olasılık Deney Makinesi

## Module ID

`probability-experiment-machine`

## Route

`/embed/probability/probability-experiment-machine`

## Atom Kapsamı

- `MAT.9.7.1.1`: Gerçek hayat deneylerinden gelen veriyi baz alarak bir sonraki adımın gelme oranını gözlemsel olarak tahmin eder.
- `MAT.9.7.2.1`: Küçük örneklemden elde ettiği olasılık oranını tüm evrene tümevarım yoluyla genelleyerek sayısal sonuç çıkarır.

## Öğrenme Oyuncağı

Öğrenci tek bir deney makinesinde iki oran kapağıyla oynar. İlk görevde son 100 deney kaydındaki mavi sonuçları sayaç kapağına taşır; oran, yapılmış gözlem verisinden doğar. İkinci görevde 30 denemelik küçük örneklem oranını 200 denemelik büyük tahmin rayına aktarır; aynı oran korununca tümevarımsal projeksiyon kilitlenir.

## Sızıntı Kuralı

- Gözlemsel oran ve büyük evren tahmini testten önce başarı/hüküm olarak görünmez.
- Öğrencinin ayarladığı sayaç değeri görünür; doğru olduğu yalnız `Deneyi Test Et` sonrası mühürlenir.
- Tümevarım sonucunun anlam cümlesi testten önce açılmaz.

## Test ID Sözleşmesi

- `probability-experiment-machine-scene`
- `probability-experiment-machine-controls`
- `probability-experiment-machine-ratio-handle`
- `probability-experiment-machine-projection-handle`
- `probability-experiment-machine-minus`
- `probability-experiment-machine-plus`
- `probability-experiment-machine-check`
- `probability-experiment-machine-reset`

## QA Planı

- Başlangıçta oran sonucunun başarı hükmü gizli kalacak.
- Yanlış sayaç konumu AstroBot alarmı ve sahne renk değişimi üretecek.
- Gözlemsel oran ve tümevarımsal projeksiyon görevleri ayrı ayrı test sonrası mühürlenecek.
- İki görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- probability-experiment-machine`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.

## Durum

`Review Needed`. Kaptan canlı görsel onayı olmadan `Showcase Ready` yapılmayacak.
