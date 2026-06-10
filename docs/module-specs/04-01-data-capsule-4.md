# 04-01 Altı Basamaklı Sayı Dedektifi

## Modül

- Module id: data-capsule-4
- Route: /embed/numbers/data-capsule-4
- Sınıf: 4
- Statü: Showcase Ready / Vitrin Hazır. Kaptan canlı görsel onayıyla kilitlendi.

## SSOT Atomları

- MAT.4.1.1.1: 6 basamaklı devasa nicelikleri (100.000'ler) abaküs/şekiller üzerinde görselleştirir.
- MAT.4.1.1.2: 6 basamaklı sayıların sembolik rakam karşılığını kusursuzca okur/yazar.
- MAT.4.1.2.1: 6 basamaklı sayının Binler basamağını dijital kümelerle gruplar.
- MAT.4.1.2.2: 6 basamaklı sayının On Binler basamağını dijital kümelerle gruplar.
- MAT.4.1.2.3: 6 basamaklı sayının Yüz Binler basamağını dijital kümelerle gruplar.
- MAT.4.1.2.4: Verilen 6 basamaklı sayıyı basamak değerlerine ayırıp toplam formunda çözümler.
- MAT.4.1.3.1: 6 basamaklı sayıları büyükten küçüğe sıralar.
- MAT.4.1.3.2: 6 basamaklı sayıları küçükten büyüğe sıralar.
- MAT.4.1.4.1: İstenilen ardışık kurala göre ileri ritmik sayma zinciri inşa eder.
- MAT.4.1.4.2: İstenilen kurala göre geriye doğru ritmik zincir inşa eder.
- MAT.4.1.5.1: Artan veya azalan sayı örüntülerinin kuralını tek bir genel kural cümlesiyle özetler.

## Çocuk Deneyimi

- Öğrenci ilk 3 saniyede büyük bir altı haneli sayı ve parlayan hedef basamağı görür.
- Cevap kartları büyük dokunma alanlarıdır; çocuk kart seçerek ilerler.
- Yanlış kart kırmızı yanar, AstroBot kısa ipucu verir ve doğru cevabı hemen ele vermez.
- Doğru kart yeşil yanar, sahne bir sonraki büyük sayı görevine geçer.
- Tekrar Oyna yeni sayılar, yeni sıralama kartları ve yeni sayı örüntüleri üretir.

## Test Notları

- Route: /embed/numbers/data-capsule-4
- Sahne test id: `data-capsule-4-stage`
- Panel test id: `data-capsule-4-control-panel`
- Cevap kartları test id: `data-capsule-4-choice`
- Feedback test id: `data-capsule-4-feedback`
- Completion test id: `data-capsule-4-complete`
- Tekrar oynama test id: `data-capsule-4-restart`
- Yanlış deneme: seçilen kart kırmızı yanmalı, AstroBot kısa ipucu vermeli.
- Doğru deneme: seçilen kart yeşil yanmalı, görev ilerlemeli.
- Completion: kazanılan atomlar listesi, Tekrar Oyna ve Ana Merkez görünmeli.
