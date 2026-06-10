# 04-02 İşlem Kısayolları Atölyesi

## Modül

- Module id: zero-engine-4
- Route: /embed/algebra/zero-engine-4
- Sınıf: 4
- Statü: Showcase Ready / Vitrin Hazır. Kaptan canlı görsel onayıyla kilitlendi.

## SSOT Atomları

- MAT.4.2.1.1: Üç basamaklı sayıları kullanarak sıfırlı sayıları zihinden pratik yolla toplar.
- MAT.4.2.1.2: Dört basamaklı sayıları kullanarak sıfırlı sayıları zihinden pratik yolla toplar.
- MAT.4.2.2.1: Dört basamaklı sayıları alt alta yazarak elde kuralıyla basamak taşıyıp toplar.
- MAT.4.2.2.2: Dört basamaklı sayılarda onluk/yüzlük bozarak sütun çıkarma işlemi yapar.
- MAT.4.2.3.1: Çarpma işleminin sonucunu işlemi yapmadan önce en yakın onluğa/yüzlüğe yuvarlayarak tahmin eder.
- MAT.4.2.4.1: Bir sayıyı 10 ile kısa yoldan sıfır ekleyerek çarpar.
- MAT.4.2.4.2: Bir sayıyı 100 ile kısa yoldan sıfır ekleyerek çarpar.
- MAT.4.2.4.3: Bir sayıyı 1000 ile kısa yoldan sıfır ekleyerek çarpar.
- MAT.4.2.4.4: Sonu sıfırlı sayıları 10, 100, 1000'e bölerken sıfır silme kısa yolunu ateşler.
- MAT.4.2.6.1: "Sayının yarısının 5 katı" gibi 4 işlem içeren komut dizilerini arka arkaya hatasız çözer.
- MAT.4.2.9.1: 4 işlemin tümünün karışık bulunduğu terazide iki tarafın denkliğini sağlamak için verilmeyen ögeyi bulur.

## Çocuk Deneyimi

- Öğrenci ilk 3 saniyede canlı işlem kartını, eşitlik dengesini ve büyük cevap kartlarını görür.
- Teknik "bug/hata motoru" dili yerine "sıfır ekle", "sıfır sil", "elde", "bozma" gibi sınıf seviyesine uygun ifadeler kullanılır.
- Her sahne farklı vurgu rengine sahiptir; işlem türleri birbirinden ayrılır.
- Yanlış kart kırmızı yanar, AstroBot kısa ipucu verir ve doğru cevap hemen söylenmez.
- Doğru kart yeşil yanar, sistem sıradaki işlem görevine geçer.
- Son görevde çocuk iki tarafı eşitlemek için boş kutuya gelecek sayıyı seçer.
- Tekrar Oyna yeni sayılar ve yeni cevap sıraları üretir.

## Test Notları

- Route: /embed/algebra/zero-engine-4
- Sahne test id: `zero-engine-4-stage`
- Panel test id: `zero-engine-4-control-panel`
- Cevap kartları test id: `zero-engine-4-choice`
- Feedback test id: `zero-engine-4-feedback`
- Completion test id: `zero-engine-4-complete`
- Tekrar oynama test id: `zero-engine-4-restart`
- Yanlış deneme: seçilen kart kırmızı yanmalı ve AstroBot kısa ipucu vermeli.
- Doğru deneme: seçilen kart yeşil yanmalı ve görev ilerlemeli.
- Completion: kazanılan atomlar listesi, Tekrar Oyna ve Ana Merkez görünmeli.
