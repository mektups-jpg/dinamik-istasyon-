# 12-05 Süreklilik Köprüsü

## Durum
Showcase Ready. Bu modül 2026-05-19 tarihinde Kaptan canlı görsel onayı aldı: "süreklilik köprüsünü de vitrin hazır durumuna getirebilirsin." 12. sınıf vitrin paketine alınabilir.

## Amaç
Sürekliliği büyük bir köprü deneyine çevirmek: öğrenci soldan limit ve sağdan limitin aynı değere yaklaşmasını, `f(a)` değerinin tanımlı olmasını ve bu değerin limit değeriyle eşit olmasını sahnede görür. Formül küçük kanıt etiketi olarak kalır; ana öğrenme nesnesi fonksiyonun ilgili noktada sürekli olup olmadığıdır.

## Atom Kapsamı
- MAT.12.2.3.1: Fonksiyonun bir noktada sürekli olması için limit değerinin fonksiyondaki o değere eşit olması prensibini ispatlar.

## Kapsam Dışı
- Limitin grafik ve cebirsel hesaplanması 12-04 Limit Asimptot Sensörü modülünde kalır.
- Türev, teğet eğimi ve türevin olmadığı noktalar 12-06 modülüne bırakılır.
- Parçalı fonksiyonlarda ileri ispat dili veya epsilon-delta yaklaşımı bu modülde yoktur.

## Ana Oyuncak
Ortada geniş bir "Süreklilik Köprüsü" bulunur. Soldan limit ve sağdan limit x=a noktasına yaklaşır; ortadaki `f(a)` değeri aynı noktadaki fonksiyon değerini temsil eder. Üç şart aynı anda sağlanırsa sahne "sürekli" kararını verir. Şartlardan biri bozulursa sahne pembe/sarı alarm verir ve öğrenci MEB dilindeki nedeni seçer: sağ-sol limit, `f(a)` değeri, süreksiz veya sürekli.

2026-05-16 son cila notu: Seçim anı ile karar anı ayrıldı. Öğrenci bir kilidi seçince sahne yalnız önizleme ve ipucu verir; doğru/yanlış hükmü `Köprüyü Test Et` sonrası oluşur. AstroBot ile çakışan sahne içi uzun feedback kartı kaldırıldı. Arıza görevlerinde başarı çipi artık "Köprü kilitlendi" değil, "Teşhis kilitlendi" der; köprü yalnız gerçekten sürekli görevlerde kapanmış sayılır.

2026-05-19 MEB dili ve ara kontrol cila notu: Seçenekler "Sağ-Sol Limit", "`f(a)` Değeri", "Süreksiz" ve "Sürekli" olarak sadeleştirildi. Doğru ara gözlemler artık yanlış sayılmaz; örneğin sürekli görevde "Sağ-Sol Limit" seçimi öğrenciyi cezalandırmak yerine "doğru ara kontrol, son karar Sürekli" mesajıyla yönlendirir. Sağ panelde soldan limit, sağdan limit ve `f(a)` değerini gösteren üç satırlı süreklilik kontrol kartı eklendi.

## Görev Akışı
1. MAT.12.2.3.1: x=2 noktasında soldan limit, sağdan limit ve `f(2)` değeri 4 olarak hizalanır; öğrenci "Sürekli" kararını verir.
2. MAT.12.2.3.1: Limit 3 olarak oluşur ama `f(1)` tanımlı değildir; öğrenci `f(a)` değeri şartının sağlanmadığını yakalar.
3. MAT.12.2.3.1: Soldan limit 2, sağdan limit 5 olduğundan iki taraflı limit oluşmaz; öğrenci sağ-sol limit şartını teşhis eder.
4. MAT.12.2.3.1: Limit 1 iken `f(3)=4` olur; öğrenci `f(a)` değerinin limitten farklı olduğunu teşhis eder.
5. MAT.12.2.3.1: Son görevde limit ve `f(-1)` aynı hatta oturur; süreklilik mührü kapanır.

## Route
- /embed/calculus/continuity-bridge

## Test ID Kontratı
- `continuity-bridge-scene`
- `continuity-bridge-manipulator`
- `continuity-bridge-rails`
- `continuity-bridge-pin`
- `continuity-bridge-gap`
- `continuity-bridge-seal`
- `continuity-bridge-check`
- `continuity-bridge-feedback`
- `continuity-bridge-reset`

## QA Notu
- Ana köprü desktop/kiosk görünümünde sahnenin baskın alanı olmalı; sağ panel yalnız kontrol alanı kalmalı.
- Süreklilik yalnız `lim f(x)=f(a)` yazısıyla anlatılırsa hard fail; köprü gerçekten kapanmalı veya açık kalmalı.
- Yanlış deneme yalnız hata mesajı vermemeli; ray, pim veya mühür sahnede alarm üretmeli.
- Gri boşluk, aşağı kaydırma zorunluluğu, dev formül, yazısı taşan rozet ve iç içe kart kalabalığı hard faildir.
- Telefon görünümü bu modül için ana hedef değildir; karar desktop/dizüstü QA ile verilir.

## Kapanış Kanıtı
- Statü: Showcase Ready / Vitrin Hazır.
- Internal puan: 96/100.
- Gemini 3.1 Pro final: 95/100 PASS, MUST_FIX yok.
- İlk Gemini turu 40/100 FAIL verdi; sahne letterbox/detached UI hissi verdiği için kapatılmadı. Köprü daha geniş sahneye alındı, değerler ray/pim/gate gövdesine gömüldü.
- İkinci Gemini turu 75/100 FAIL verdi; üst üste binen ray/limit etiketleri ve sıçrama durumunda yanıltıcı `limit y=2` etiketi düzeltildi.
- Post-Gemini polish: `!=` ifadesi `≠` ile değiştirildi; completion notu öğrenci dostu dile alındı.
- Computer Use QA: Chrome desktop üzerinde açılış, yanlış kopuk alarmı denemesi, doğru köprü kilidi ve eksik `f(a)` görevi canlı gözlendi.
- Playwright kanıtları: `.agent/browser-use-shots/12-05-rehab-final-00-start.png`, `20-selected-no-verdict.png`, `25-wrong.png`, `35-seal-success.png`, `50-missing-pin-success.png`, `70-jump-rails-success.png`, `85-wrong-height-pin-success.png`, `95-final-seal-success.png`, `100-complete.png`; ayrıca `12-05-rehab-label-missing-pin.png` ile arıza görevinde "Teşhis kilitlendi" dili doğrulandı.
- Console: `.agent/browser-use-shots/12-05-continuity-bridge-console.md`, 0 warning / 0 error.
- Teknik: `npm run module:check -- continuity-bridge`, `npx tsc --noEmit`, `npm run build` geçti.
- Kaptan onayı: 2026-05-19 canlı görsel kontrol sonrası vitrin hazır durumuna yükseltildi.
