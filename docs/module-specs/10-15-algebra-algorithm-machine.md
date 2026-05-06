# 10-15 Cebir Algoritma Makinesi

## Durum

In Progress. SSOT atomu `MAT.10.3.2.1` olarak doğrulandı. Bu modül cebirsel ifadeyi genişletme alıştırmasına dönmez; işlem sırasını girdi-çıktı makinesi ve algoritma akışı olarak görünür yapar.

## Amaç

10. sınıf öğrencisine karmaşık cebirsel bir işlem zincirinin bilgisayar mantığıyla yazılabileceğini göstermek:

- Girdi `x = 3` olarak makineye alınır.
- İşlem hattı sırayla `+2`, `karesini al`, `-4`, `/3` bloklarından geçer.
- Çıktı `7` olarak okunur ve sözde kod mührüyle akış tamamlanır.

## Atom Kapsamı

- `MAT.10.3.2.1`: Karışık bir cebirsel işlemi bilgisayar mantığıyla algoritmik dile kodlar.

## Kapsam Dışı

- Denklem çözme, ters işlemle bilinmeyen bulma ve programlama dili sözdizimi bu modülde açılmaz.
- Sayma stratejileri önceki sayma modülünde ayrı tutulur.

## Ana Oyuncak

Tek sahne bir **cebir algoritma makinesi**dir:

- Sol port girdi kapsülünü `x=3` olarak yakalar.
- Orta işlem boru hattı `((x + 2)² - 4) / 3` akışını blok blok gösterir.
- Sağ çıktı portu `7` tokenını bekler.
- Son görevde öğrenci akışı sözde kod mührüne kilitler.

## Görev Akışı

1. `Girdi Portu`: aksı giriş portuna getir ve `x=3` girdi bloğunu seç.
2. `İşlem Boru Hattı`: aksı işlem zincirine getir, işlem bloklarını ve `7` çıktı tokenını kilitle.
3. `Kod Mührü`: aksı sözde kod satırına getir ve algoritma mührünü aç.

## Route

- `/embed/algebra/algebra-algorithm-machine`

## Test ID Kontratı

- `algorithm-machine-scene`
- `algorithm-machine-handle`
- `algorithm-input-block`
- `algorithm-operation-chain`
- `algorithm-output-token-7`
- `algorithm-code-seal`
- `algorithm-machine-check`
- `algorithm-machine-reset`

## QA Planı

- `npm run module:check -- algebra-algorithm-machine`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/algebra-algorithm-machine?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile girdi, işlem hattı ve kod mührü görevleri tamamlanır.
  - Completion ekranı ve console warning/error `[]` doğrulanır.
- Gemini 3 Flash:
  - Öğrenci cebirsel ifadeyi işlem sırası olarak okuyabiliyor mu denetlenir.
  - `x=3` için ara sonuçlar `5`, `25`, `21`, `7` doğru ve görünür mü kontrol edilir.
  - İlk 3 saniye, responsive/embed ve bilişsel yük değerlendirilir.
