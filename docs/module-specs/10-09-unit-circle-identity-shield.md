# 10-09 Birim Çember Kalkanı

## Durum

Done. SSOT atomu `MAT.10.4.2.1` olarak doğrulandı; uygulama, Browser Use canlı QA, Gemini 3 Flash kapanışı ve doküman senkronu tamamlandı.

## Amaç

10. sınıf öğrencisine `sin²x + cos²x = 1` özdeşliğini soyut bir ezber değil, birim çember üzerinde yatay ve dikey izdüşüm karelerinin yarıçap kalkanını her açıda tam doldurması olarak göstermek.

## Atom Kapsamı

- `MAT.10.4.2.1`: sin²x + cos²x = 1 (Pisagor özdeşliği) dönüşümünü karmaşık denklemlere gömüp soruyu sadeleştirir.

## Kapsam Dışı

- Dik üçgen oranları `10-06 Trigonometrik Teodolit` içinde tamamlandı.
- Sinüs ve kosinüs teoremleri `10-08 Sinüs-Kosinüs Arazi Ölçeri` içindedir.
- Eski `/embed/geometry/unit-circle` legacy deneyine dokunulmaz; bu modül dar makro atom olarak yeni route'ta çalışır.

## Ana Oyuncak

Tek sahne bir **birim çember enerji kalkanı**dır:

- Öğrenci çember üzerindeki açı düğümünü sürükler.
- Yatay izdüşüm `cos x`, dikey izdüşüm `sin x` olarak kalkan içinde görünür.
- `cos²x` ve `sin²x` enerji plakaları alan olarak yan yana dolarken toplam halka `1` değerinde sabit kalır.
- Son görevde öğrenci iki kare plakayı merkez kalkan mühürüne bağlayarak `sin²x + cos²x = 1` özdeşliğini kilitler.

## Görev Akışı

1. `Kosinüs Kare Plakası`: açı düğümünü hedefe getir, `cos²x` plakasını seç.
2. `Sinüs Kare Plakası`: açı düğümünü ikinci hedefe getir, `sin²x` plakasını seç.
3. `Kalkan Mührü`: açı düğümünü mühür çizgisine getir, `sin²x + cos²x = 1` çekirdeğini kilitle.

## Route

- `/embed/trigonometry/unit-circle-identity-shield`

## Test ID Kontratı

- `unit-shield-scene`
- `unit-shield-handle`
- `unit-shield-cos-square`
- `unit-shield-sin-square`
- `unit-shield-identity-core`
- `unit-shield-check`
- `unit-shield-reset`

## QA Planı

- `npm run module:check -- unit-circle-identity-shield`: 19 pass / 0 warn / 0 fail.
- `npm run build`: geçti.
- `git diff --check`: temiz.
- Browser Use:
  - `/embed/trigonometry/unit-circle-identity-shield?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile üç görev hedefi kilitlenir.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü `[]`.
  - Screenshot kanıtları: `.agent/browser-use-shots/10-09-*.png`.
- Gemini 3 Flash:
  - Final tur `.agent/gemini-reports/10-09-unit-circle-identity-shield.txt`: 92/100 PASS, must-fix yok.
  - Öğrencinin `cos²` ve `sin²` plakalarının toplamının neden 1 kaldığını görselden çıkarabildiği doğrulandı.
  - Toast/buton yakınlığı should-fix olarak nonblocking kaldı; güncel AstroBot yerleşimiyle IAB smoke tekrarlandı.
