# 12-04 Limit Asimptot Sensörü

## Durum
Showcase Ready. Bu modül 2026-05-19 tarihinde Kaptan canlı görsel onayı aldı: "gayet güzel oldu. limit asimptot sensörü nü de vitrin hazır durumuna getirebilirsin." 12. sınıf vitrin paketine alınabilir.

## Amaç
Limit kavramını reçete/panel okuma olmaktan çıkarıp tek bir yaklaşma sensörü deneyine çevirmek: öğrenci sol-sağ yaklaşımın aynı hedefe kilitlenmesini, sonsuzda yatay asimptot tüneline oturmayı, cebirsel yerel limitin giriş-çıkış olarak hesaplanmasını ve 0/0 belirsizliğin çarpan vinciyle açılmasını görür.

## Atom Kapsamı
- MAT.12.2.1.1: Çizilmiş bir grafikte x belirli bir noktaya yaklaşırken fonksiyonun limitini okur.
- MAT.12.2.1.2: Çizilmiş bir grafikte x sonsuza giderken fonksiyonun asimptot eğilimini okur.
- MAT.12.2.2.1: Denklemi verilen fonksiyonun belirli bir sayıdaki limit değerini cebirsel hesaplar.
- MAT.12.2.2.2: Denklemi verilen fonksiyonun sonsuzdaki limit değerini cebirsel hesaplar.
- MAT.12.2.2.3: Limit hesabında karşılaşılan 0/0 belirsizlik durumlarını çarpanlara ayırma manevrasıyla aşar.

## Kapsam Dışı
- Süreklilik eşitliği `limit = f(a)` 12-05 Süreklilik Köprüsü modülüne bırakılır.
- Türev ve teğet eğimi 12-06 modülüne bırakılır.
- L'Hospital veya ileri analiz teknikleri bu modülde yoktur.

## Ana Oyuncak
Ortada geniş bir "Yaklaşma Sensör Pisti" bulunur. Sol ve sağ sensörler x=a kapısına yaklaşır; doğru görevde ışınlar aynı yükseklikte birleşir. Sonsuz görevinde rota sağa doğru yatay asimptot tüneline girer. Cebirsel görevde giriş kapsülü fonksiyon makinesinden sonuç kapsülüne döner. 0/0 görevinde krater üstündeki ortak çarpan vinci engeli kaldırır ve sadeleşmiş rota hedefe bağlanır.

## Görev Akışı
1. MAT.12.2.1.1: Grafikte x=2 kapısına iki taraftan yaklaşınca limit değeri 4 olarak okunur.
2. MAT.12.2.1.2: Sonsuza giderken rota yatay asimptot tüneli y=2 seviyesine kilitlenir.
3. MAT.12.2.2.1: `lim x->3 (2x + 1)` yerel giriş-çıkış makinesinde 7 olarak hesaplanır.
4. MAT.12.2.2.2: `lim x->∞ (2x + 1)/(x + 4)` en büyük derece katsayı oranıyla 2'ye yaklaşır.
5. MAT.12.2.2.3: `lim x->2 (x² - 4)/(x - 2)` doğrudan 0/0 verir; çarpan vinci `(x - 2)` ortak parçasını kaldırıp sonucu 4 yapar.

## Route
- /embed/calculus/limit-asymptote-sensor

## Test ID Kontratı
- `limit-asymptote-sensor-scene`
- `limit-asymptote-sensor-manipulator`
- `limit-asymptote-sensor-two-sided`
- `limit-asymptote-sensor-local`
- `limit-asymptote-sensor-infinity`
- `limit-asymptote-sensor-factor`
- `limit-asymptote-sensor-check`
- `limit-asymptote-sensor-feedback`
- `limit-asymptote-sensor-reset`

## QA Notu
- Ana sensör pisti desktop/kiosk görünümünde sahnenin baskın oyuncak alanı olmalı.
- Limit yalnız formül metniyle anlatılırsa hard fail; yaklaşma hareketi sahnede görünmeli.
- Yanlış deneme neden yanlış olduğunu kısa matematik cümlesiyle açıklamalı.
- 0/0 görevinde belirsizlik dekor değil, gerçekten kaldırılan ortak çarpan olarak görünmeli.
- Telefon görünümü bu modül için ana hedef değildir; karar desktop/dizüstü QA ile verilir.

## Kapanış Kanıtı
- Statü: Showcase Ready / Vitrin Hazır.
- Internal puan: 96/100.
- Gemini 3.1 Pro final: 94/100 PASS, MUST_FIX yok.
- İlk Gemini turu 35/100 FAIL verdi; bu nedenle modül kapatılmadı. Rework sonrası merkez sahne gerçek koordinat grafiği, parlayan eğri, sol-sağ yaklaşım sensörleri, sonsuz asimptot çizgisi ve mekanik 0/0 çarpan vinci içerir.
- 2026-05-16 son cila: sensör seçimi ile limit kararı ayrıldı. Seçim artık yalnız önizleme verir; `y=4`, `y=2`, `7`, `2` ve `4` gibi sonuçlar ancak `Limiti Kilitle` sonrası görünür. Yerel cebir makinesi `çıkış kilitli/işleniyor`, sonsuz katsayı oranı `= ?`, 0/0 kalan yolu da vinç seçilmeden `gizli yol` olarak bekler.
- Test id cila: ortak kabuktaki `limit-asymptote-sensor-scene` kontratı tekil bırakıldı; iç görsel kök `limit-asymptote-sensor-scene-visual` oldu.
- 2026-05-17 limit notasyonu cilası: `lim x->a ...` düz metni kaldırıldı; `lim` ile fonksiyon gövdesi aynı satır hizasına alındı, `x → a` ifadesi ise `lim` yazısının altında okunur bir alt etiket olarak gösteriliyor.
- 2026-05-17 grafik okuma cilası: İlk görevde fonksiyon kuralı verilmediği için sonuç `f(2)` değeri gibi sunulmuyor. Grafik üzerinde `y = 4 çizgisi` açık rozetle gösteriliyor; öğrenci limiti bu yatay yaklaşma çizgisinden okuyor.
- 2026-05-19 Kaptan canlı cila onayı: 0/0 sadeleştirme kısmında AstroBot balonuna yalnız balon içinde kalacak şekilde kesir çizgili `f(x)=\frac{x^2-4}{x-2}` denklemi eklendi; sağ panel, sahne ve limit komutu kalabalıklaştırılmadı. Bu son cila sonrası Kaptan onayıyla modül vitrin hazır durumuna yükseltildi.
- Computer Use QA: Chrome desktop üzerinde açılış, yanlış yerel hesap denemesi, doğru iki yan sensör kilidi ve reset canlı gözlendi.
- 2026-05-16 cila QA: Computer Use yerel cebir cevap sızıntısını yakaladı; Playwright 1488x768 üzerinde başlangıç, önizleme, doğru zincir, sonsuz katsayı görevi, 0/0 vinç, completion ve reset tekrar geçti.
- Playwright kanıtları: başlangıç, yanlış deneme, yerel cebir orta görev, 0/0 uç durum, completion ve 1488x768 dar dizüstü screenshotları `.agent/browser-use-shots/12-04-limit-asymptote-sensor-*.png` altında.
- Console kanıtı: `.agent/browser-use-shots/12-04-limit-asymptote-sensor-console.md`, 0 warning / 0 error.
- Teknik kapılar: `npm run module:check -- limit-asymptote-sensor`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.
- Kaptan onayı: 2026-05-19 canlı görsel kontrol sonrası vitrin hazır durumuna yükseltildi.
