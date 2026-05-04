# 11-06 Richter-Desibel Ölçek Simülatörü

## Amaç
11. sınıf öğrencisine üstel ve logaritmik gerçek yaşam problemlerini tek bir "ölçek sıkıştırma" deneyinde göstermek. Öğrenci büyük oranların nasıl hızlı büyüdüğünü, desibel ve Richter ölçeklerinde ise aynı büyük oranların logaritmik olarak daha küçük ve okunabilir sayılara dönüştüğünü görür.

## Atom Kapsamı
- `MAT.11.1.6.1`: Gerçek yaşamdaki büyüme oranlarını üstel bir fonksiyon denklemiyle çözer.
- `MAT.11.1.6.2`: Gerçek yaşamdaki yüksek frekanslı ses şiddeti oranlarını (Desibel) logaritmik bir fonksiyon denklemiyle çözer.
- `MAT.11.1.6.3`: Gerçek yaşamdaki deprem şiddeti oranlarını (Richter ölçeği) logaritmik bir fonksiyon denklemiyle çözer.

## Kapsam Dışı
- Logaritma grafiğini çizme ve üstel-log ters dönüşümü bu modülde tekrar öğretilmez; bunlar `11-04 Üstel Büyüme Reaktörü` ve `11-05 Logaritma Ters Ayna Odası` içinde tamamlandı.
- Ayrıntılı cebirsel denklem çözüm maratonu yoktur. Bu modülün odağı gerçek yaşam oranını doğru ölçeğe dönüştürmek ve büyüklük hissini kurmaktır.
- Bileşke fonksiyonlar, fonksiyonlarda dört işlem ve çokgen/veri konuları ayrı makro deneylerde kalır.

## Ana Oyuncak
Tek sahne bir **dinamik ölçek ölçeri** olur:
- Sol tarafta öğrenci oran/büyüme çekirdeğini sürükler veya çevirmeli bir kadranla ayarlar.
- Orta ekranda ham oran fiziksel olarak büyür: bakteri kolonisi çoğalır, ses dalgası genliği yükselir veya sismik dalga halkası genişler.
- Sağdaki log/üstel ölçer ham büyüklüğü ders ölçeğine dönüştürür.
- Mod değişse de oyuncak değişmez; aynı kadran ve aynı sıkıştırma ölçeri üç gerçek yaşam senaryosunda çalışır.

## Görev Akışı
1. `Üstel Büyüme Odası`: Başlangıç nüfusu ve büyüme katsayısı verilir. Öğrenci zaman kadranını hedefe taşıyarak üstel büyümenin küçük zamanda nasıl hızlandığını görür.
2. `Desibel Kompresörü`: Ses şiddeti oranı büyütülür. Öğrenci oranı kadranda ayarlayınca desibel göstergesi `10 log(I/I0)` mantığıyla sıkışır; büyük oran küçük ölçek artışına dönüşür.
3. `Richter Sismografı`: Deprem genlik/enerji oranı büyütülür. Öğrenci Richter farkının logaritmik olduğunu görür; küçük ölçek farkının büyük fiziksel oran anlamına geldiğini kilitler.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: oran kadranı, canlı büyüklük alanı ve sıkıştırılmış ölçek göstergesi.
- Her görev aynı sahnenin teması değişmiş hali gibi davranır; ayrı kart yığını veya üç farklı uygulama hissi oluşmaz.
- Matematiksel anlam görünür olmalıdır: ham oran büyürken ölçer log/üstel formülle okunabilir sonuç üretir.
- Öğrenci "neden log ölçeği kullanılır?" sorusuna görsel cevap almalıdır.
- Dar/embed görünümde kadran, ölçer ve onay aksiyonları ilk ekranda kaybolmamalıdır.

## Route
- `/embed/algebra/richter-desibel-scale-simulator`

## Test ID Kontratı
- `scale-simulator-scene`
- `scale-ratio-dial`
- `scale-compression-meter`
- `scale-mode-growth`
- `scale-mode-desibel`
- `scale-mode-richter`
- `scale-simulator-check`
- `scale-simulator-reset`

## QA Planı
- `npm run module:check -- richter-desibel-scale-simulator`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/richter-desibel-scale-simulator?qa=1` açılır.
  - İlk sahne, oran kadranı ve sıkıştırma ölçeri görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - Kadran veya `Home` fallback ile üç görev tamamlanır.
  - Completion ekranı görünür.
  - Console warning/error kontrolü yapılır.
  - Dar/embed smoke yapılır.
- Gemini 3 Flash:
  - Başlangıç, desibel ve Richter ekranları öğrenci netliği, gerçek yaşam bağlantısı, bilişsel yük ve görsel hiyerarşi açısından değerlendirilir.
  - Must-fix yok, Gemini skor >=85 ve internal skor >=90 olmadan Done yapılmaz.
