# 09-03 Akıllı Mantık Devreleri

## Durum

Review Needed. Kaptan canlı görsel onayı olmadan `Showcase Ready / Vitrin Hazır` yapılmayacak.

## Amaç

Öğrenci mantık bağlaçlarını ezber tanımı olarak değil, A/B anahtarları ve Y çıkış lambası üzerinden çalıştırır. Aynı devre gövdesi VE, VEYA, İSE ve YA DA kartuşlarıyla farklı çıkış üretir; aktif doğruluk satırı ve mini tablo aynı anda yanar.

## Atom Kapsamı

- `MAT.9.3.2.1`: VE bağlacında yalnız `1 ve 1` durumunun çıkışı `1` yaptığını çalıştırır.
- `MAT.9.3.2.2`: VEYA bağlacında yalnız `0 ve 0` durumunun çıkışı `0` yaptığını çalıştırır.
- `MAT.9.3.2.3`: İSE bağlacında yalnız `1=>0` durumunun çıkışı `0` yaptığını teyit eder.
- `MAT.9.3.2.4`: YA DA bağlacında yalnız farklı girişlerin çıkışı `1` yaptığını test eder.

## Kapsam Dışı

- Karışık problemleri akış şemasına bölme `09-12 Algoritma Akış Hattı` modülünde kalır.
- Her/Bazı niceleyicileri `09-13 Niceleyici Radar Avı` modülünde kalır.
- Sembolik ispat ve uzun doğruluk tablosu alıştırmaları bu ilk vitrin adayının kapsamı değildir.

## Tek Ana Oyuncak

Ana oyuncak fiziksel devre tezgahıdır. Öğrenci A/B düğümlerini doğrudan sahnede veya destek panelindeki anahtarlarla açıp kapatır. Kablolar ve Y lambası anında tepki verir; kontrol düğmesi yalnız hedef satırın doğru kurulup kurulmadığını mühürler.

## Görev Akışı

1. VE kapısı: A=1 ve B=1 olduğunda çıkışın yandığını kur.
2. VEYA kapısı: A=0 ve B=0 olduğunda çıkışın söndüğünü kur.
3. İSE kapısı: A=1, B=0 satırının tek arıza olduğunu gör.
4. YA DA kapısı: yalnız bir anahtar açıkken çıkışın yandığını kur.

Doğru/yanlış hükmü yalnız `Devreyi Test Et` sonrası gelir. Anahtar seçimi canlı devre önizlemesidir.

## Route

- `/embed/algebra/logic-circuit-lab`

## Test ID Kontratı

- `logic-scene`
- `logic-scene-input-a`
- `logic-scene-input-b`
- `logic-input-a`
- `logic-input-b`
- `logic-check`
- `logic-reset`

## QA Planı

- Başlangıçta uydurma `MAT.9.3.2.X` etiketi görünmeyecek.
- Yanlış hedef satır AstroBot alarmı verecek; doğru/yanlış hükmü testten önce sızmayacak.
- A/B düğümleri sahneden tıklanınca kablo ve Y lambası anında değişecek.
- Dört görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- logic-circuit-lab`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
