---
name: dinamik-istasyon-module-development
description: Dinamik İstasyon matematik modüllerini Kaptan standardına göre tasarlamak, üretmek, görsel olarak eleştirmek, test etmek ve kalite etiketlerini güncellemek için kullanılır. Kullanıcı yeni modül, modül rework, production seviyesi, vitrin, cila, 3D cisimler kalitesi, öğrenci dostu deneyim veya 12. sınıftan geriye kalite turu istediğinde tetiklenir.
---

# Dinamik İstasyon Modül Geliştirme Yeteneği

## Amaç
Modül yalnız çalışır hale getirilmez; öğrenci ilk 3 saniyede neyle oynadığını anlar, yaptığı her anlamlı eylem sahnede karşılık bulur ve konu kağıtta zor görülen bir ilişkiyi ekranda kolayca görünür kılar. Hedef kalite 3D cisimler ve 1. sınıf sayı atlama referanslarındaki gibi sade, büyük ama dengeli, doğrudan oynanabilir ve göze hoş gelen bir öğrenme deneyimidir.

## Değişmez Kurallar
- Kazanım atomları yalnız `docs/MEB_ATOMLARI.md` dosyasından alınır; uydurma atom yazılmaz.
- Modül sırası ve kapsamı için `MODULES.md`, mevcut spec ve ilerleme dokümanları okunur.
- Kullanıcı yapımı veya `Showcase Ready` kabul edilmiş referans modüller benchmark olarak açılır; kodları korunur.
- Ortak AstroBot dosyası kullanılır. Her modülde yeni lokal AstroBot kopyası yazılmaz.
- Route, module id, atom id ve test id kontratları korunur.
- `Showcase Ready` etiketi Kaptan görsel onayı olmadan verilmez. Ara hedef `Skeleton`, `Playable`, `Rework Needed` veya `Showcase Candidate` olabilir.

## Kalite Standardı
- Ana oyuncak ekranın başrolü olmalı; panel, dashboard veya reçete hissi sahneyi ele geçirmemeli.
- Büyük olmak kalite değildir. Nesne ne küçük kalmalı ne de devleşip yazıları, kontrolleri veya sahneyi boğmalı.
- Gri boş alan, kırpılan kapsül, aşağı kaydırma zorunluluğu, iç içe kart kalabalığı ve okunmayan metin hard fail kabul edilir.
- Gri boş alan yorumu iki aşamalıdır: modül kendi viewport'u içinde gri/boş alan bırakıyorsa hard faildir; ama Playwright küçük viewport'u büyük Chrome penceresinin içinde bırakmışsa bu QA kurulum hatasıdır. Görsel puan vermeden önce `innerWidth/outerWidth`, `#root` boyutu ve screenshot kaynağı kontrol edilir.
- AstroBot konuşma balonu otomatik kapanmaz; Kaptan veya öğrenci kapatana kadar okunabilir kalır. Balon botun sağ tarafına açılır ve ekran düzenini zıplatmaz.
- Öğrenci bir butona, slider'a, karta veya sürükleme alanına dokunduğunda renk, hareket, ölçü, kilit, projeksiyon veya kısa mesajla anlık geri bildirim almalıdır.
- Yanlış deneme yalnız "yanlış" dememeli; sahnede neden yanlış olduğunu göstermelidir.
- Teknoloji anlamlı kullanılmalıdır: 3D açılıp kapanma, sin/cos canlı hareketi, dizi sonraki terim projeksiyonu, limit yaklaşımı, teğete dönüşüm gibi kağıtta statik kalan ilişki ekranda görünür hale gelmelidir.
- İlk state seçili doğru cevapla başlamaz. Öğrenci karar verir, sistem tepki verir.
- Konuya göre esnek etkileşim standardı geçerlidir: her modülde sürükleme şart değildir, ama yalnız seçenek seçip metin değiştiren modül kapanmaz. Ana oyuncakta en az bir canlı davranış olmalıdır ve gerekiyorsa native slider/range gibi Computer Use ile de güvenilir denenebilir kontrol tercih edilir.

## Çalışma Akışı
1. Bağlam yükle: `AGENTS.md`, `.agent/CURRENT_TASK.md`, `PROGRESS.md`, `MODULES.md`, ilgili module spec ve `docs/MEB_ATOMLARI.md` bölümünü oku.
2. Kısa kalite tezi yaz: bu modülde öğrenci hangi ana oyuncakla, hangi matematiksel ilişkiyi fiziksel olarak oynayacak?
3. Referans kıyasını yap: 3D cisimler, 1. sınıf sayı atlama ve varsa güçlü trigonometrik sin/cos modülünden ne alınacak, ne alınmayacak?
4. Önce canlı gözlem yap: Browser/Chrome/Computer Use ile mevcut ekranı aç, ilk görünüm, yanlış deneme, doğru deneme, uç durum, completion ve desktop/dar dizüstü durumunu izle. Telefon yalnız Kaptan isterse veya hızlı smoke gerekiyorsa eklenir.
5. Rework gerekiyorsa tek modüle odaklan: aynı anda çok modül düzeltme. Önce ana oyuncak ve feedback omurgasını kur, sonra cila yap.
6. Milestone kontrolü yap: yaklaşık `%25`, `%50`, `%75`, `%100` noktalarında ekran görüntüsü al veya canlı görsel kontrol yap. Göz tırmalayan şey kalırsa modül kapanmaz.
7. Görsel eleştiriyi kendin yaz: `MUST_FIX`, `SHOULD_FIX`, `UNIQUE_TOY`, `TECH_VALUE`, `STUDENT_FEEDBACK` başlıklarıyla kısa karar ver.
8. Kod 300-420 satırı aşmaya başlarsa parçala: model, scene, controls, completion ve shared shell ayrımı yapılır.
9. Gemini veya görsel modelden fikir alınabilir; ama karar verici Kaptan standardı, görsel QA ve MEB kapsamıdır.
10. Her mantıklı kapanışta spec, scorecard, showcase readiness, progress ve worklog güncellenir.

## Zorunlu QA Kapısı
- Açılış: öğrenci ilk 3 saniyede neyle oynadığını anlıyor mu?
- Yanlış deneme: neden yanlış olduğunu sahne ve AstroBot söylüyor mu?
- Doğru zincir: başarı sadece mesaj değil, sahnede fiziksel değişim yaratıyor mu?
- Uç durum: farklı görev, edge state, reset, sağ/sol hareket veya slider gerçek davranışla deneniyor mu?
- Completion: öğrenci ne öğrendiğini kısa ve net bir başarı ekranında görüyor mu?
- Ana hedef bilgisayar/kiosk deneyimidir: desktop ve dar dizüstü yüksekliklerinde ana oyuncak kırpılmadan, panel taşmadan çalışmalıdır. Telefon yalnız hafif smoke kontrolüdür; Kaptan özellikle istemedikçe kalite kararını mobil görünüm belirlemez.
- Playwright ile canlı Chrome penceresi kullanılıyorsa screenshot öncesi viewport/pencere eşleşmesi doğrulanır. `page.setViewportSize(1488,768)` sonrası Chrome dış penceresi daha büyük kalırsa görünen gri alan modül değil test aracı problemidir; aynı modül gerçek viewport screenshotı veya eşleştirilmiş pencereyle yeniden değerlendirilir.
- Teknik: `module:check`, TypeScript, build, diff check ve console/page error kontrolü yapılır.

## 12-01 Dizi Çarkından Çıkan Dersler
- İlk kötü denemeler çoğu zaman "çalışıyor" görünür ama öğrencinin zihninde ana ilişkiyi büyütmez; görsel kalite kapısı bu yüzden koddan ayrı çalışmalıdır.
- Dizi modülünde kaliteyi artıran kırılım, sayıları sahne merkezine almak ve `+3`, `x2`, `n²` ilişkisini yalnız metin değil hareketli enerji/projeksiyon olarak göstermek oldu.
- Matematiksel rehber çizgiler sayı kapsüllerinin arkasında kalabalık yapmamalıdır. Fonksiyon eğrisi, dikey iz veya nokta yardımcıları ana sayıları ezmeye başlıyorsa önce sadeleştirilir; hâlâ gözü yoruyorsa tamamen kaldırılır ve ilişki çipi/projeksiyon gibi temiz kanıtlarla anlatılır.
- Sağ panel 3D cisimlerdeki gibi yardımcı kontrol alanı kalmalı; öğrenmenin merkezi sağ panel değil sahnedeki oyuncaktır.
- Completion ekranı genel trophy değil, modülün matematiksel kazanımını özetleyen özel bir başarı sahnesi olmalıdır.
- Çekirdek oyuncak kabul edildikten sonra görev artırma yapılacaksa yeni görevler kalabalık ekran üretmemelidir. 12-01'deki doğru desen: her atoma ikinci örnek ekle, XP'yi atom sayısı değişmedikçe şişirme ve completion'ı 6 ayrı kart yerine 3 ustalık kartında ikişer kanıt satırıyla göster.
- Kaptan canlı olarak "modül güzel oldu" veya eşdeğer görsel onay verdiğinde bu, kalite kapısının son halkasıdır. O modül için `Showcase Candidate / Review Needed` etiketi `Showcase Ready`ye yükseltilir; dashboard ve kalite defterleri aynı turda senkronlanır.
- Kaptan "bu kötü, acemice, gri boşluk var, devleşmiş ama anlamlı değil" dediğinde bu bir bug raporudur; savunmadan kalite rubriğine işlenir ve çalışma yöntemi güncellenir.

## 12-02 Polinom Kasasından Çıkan Dersler
- İlk sürüm çalışsa bile dış görsel eleştirmen `65/100 FAIL` verebilir; bu durumda modül kesinlikle kapatılmaz, aynı modül üstünde rework devam eder.
- "Büyük raflar" tek başına kalite değildir. Sahne fiziksel bir ana oyuncak gibi hissettirmelidir: derinlik katmanı, çekmece/raf gövdesi, hareketli tarama merceği ve matematiksel sebep-sonuç ışığı gerekir.
- Polinom gibi soyut konularda öğrenci küçük formül okumamalı; terimler derece raflarında büyük bloklar olarak görünmeli ve seçilen mercek sahnede gerçek bir parça hareket ettirmelidir.
- Mercek veya lens seçimi cevap vermek değildir. Seçim yalnız önizleme/odak üretmeli; doğru değer, yanlış alarmı ve başarı dili ancak `Kasayı Kilitle / Kontrol Et` sonrası görünmelidir. Aksi cevap sızıntısıdır ve hard-fail sayılır.
- Fazla işaretleme de kalite sorunudur ama önemli kavramlar saklanmamalıdır. Polinom Kasası'nda doğru desen, 5 merceği görünür tutmak, seçenek sırasını görevden göreve değiştirmemek, görev bağlamındaki 3 odak merceği daha belirgin yapmak, diğer önemli mercekleri yardımcı seçenek olarak sakin göstermek ve sahnede yalnız karar veren rafı başrol yapmaktır.
- Gemini/GPT görsel eleştirisi karar verici değil ama kaçan görsel anlamsızlıkları yakalayan zorunlu kalite aynasıdır. `MUST_FIX` varsa veya skor 90 altındaysa sıradaki modüle geçilmez.
- Kapanışta `Review Needed` ana uygulamada görünür; `Showcase Ready` yalnız Kaptan canlı göz onayıyla verilir.

## 12-03 İşaret Yörünge Radarından Çıkan Dersler
- Tarayıcı seçimi de mercek seçimi gibi yalnız önizleme olmalıdır. Kök/yasak/pozitif/çözüm gibi doğru tarayıcı seçilse bile `hedef kilidi açıldı`, `doğru ışın` veya sonuç değeri testten önce görünmez.
- Yasak nokta için `!` ve pembe renk matematiksel anlam taşıyabilir; ama bu renk yanlış alarmı gibi kullanılacaksa yalnız `Yörüngeyi Kilitle` sonrası sertleşmelidir. Preview dili mutlaka `tarama önizlemesi` olarak kalır.
- Rasyonel eşitsizlikte çözüm, tek nokta değil açık yasak + kapalı kök + aralık koridoru birleşimidir. Sahne bu üç parçayı birlikte göstermezse öğrenci yalnız buton ezberler.
- Completion sonrası `Tekrar Oyna` reseti de canlı QA kapısıdır. Sadece görev state'i değil, AstroBot ve sağ panel mesajları da ilk göreve dönmelidir.

## 12-04 Limit Asimptot Sensöründen Çıkan Dersler
- Teknik olarak çalışan bir modül grafik atomlarını karşılamayabilir. Limit gibi "grafikte okuma" atomlarında merkez sahnede gerçek koordinat düzlemi, eğri, yaklaşma kapısı ve asimptot çizgisi görünmeden modül kapanmaz.
- Gemini'nin ilk tur `35/100 FAIL` kararı doğru bir çalışma düzeni düzeltmesiydi: canlı QA "çalışıyor" dese bile görsel model ana öğrenme nesnesi yoksa modülü geri açtırabilir.
- 0/0 belirsizliği yalnız formül metniyle veya kutu yer değişimiyle anlatılırsa teknoloji değeri zayıf kalır. Ortak çarpan fiziksel olarak kaldırılmalı, sade rota ayrı bir sahne nesnesi olarak belirmelidir.
- `PASS` tek başına yeterli değildir; gece planında skor `90+` şartı varsa `88/100 PASS` modülü kapatmaz. Aynı modülde kontrast, mekanik derinlik ve okunurluk polish'i yapılır.
- Screenshot kanıtları animasyon oturduktan sonra alınmalıdır; geçiş anında soluk yakalanan parçalar dış kalite eleştirmenini yanlış yönlendirebilir.
- Limit modülünde sensör seçimi cevap vermek değildir. `y=4`, `y=2`, yerel hesap `7`, katsayı oranı `2` ve 0/0 sonucu `4` gibi hedef değerler yalnız `Limiti Kilitle` sonrası açılmalıdır; seçim state'i en fazla `hedef çizgi taranıyor`, `= ?`, `işleniyor` gibi önizleme dili kullanır.
- Yerel hesap makinesinde output kapsülü kontrol öncesi `kilitli/işleniyor` kalmalıdır. Cevabı `çıkış 7` olarak erken göstermek, öğrenci hamlesini anlamsızlaştıran answer leak'tir.
- 0/0 görevinde ortak çarpanlar görülebilir ama sade kalan yol ve final değer kontrol öncesi hüküm gibi verilmemelidir. Vinç seçilmeden `gizli yol`, vinç önizlemesinde `x+2`, kilitten sonra `x+2 -> 4` akışı korunur.
- Ortak shell zaten `${moduleId}-scene` veriyorsa iç sahne aynı test id'yi tekrar etmemelidir. Duplicate test id görsel QA'nın yanlış öğeye bakmasına neden olur.
- AstroBot içinde kritik bir cebir ifadesi verilecekse düz yazı ("x kare eksi dört bölü...") yerine kesir çizgili matematik render'ı kullanılmalıdır. Ancak bu destek yalnız AstroBot balonunda istenmişse sağ panel, sahne ve limit komutu tekrar kalabalıklaştırılmaz.

## 12-05 Süreklilik Köprüsünden Çıkan Dersler
- Desktop sahne yüksekliği bilinçsiz `max-height` veya letterbox hissiyle boşa bırakılırsa ana oyuncak kaliteli görünmez; kiosk görünümünde sahne alanı gerçekten kullanılmalıdır.
- Değerler, etiketler ve formüller ana oyuncaktan kopuk UI balonu gibi durursa modül yine panel/reçete hissine döner. Limit rayı, `f(a)` pimi ve eşitlik mührü gibi matematik parçaları oyuncak gövdesinin içine yerleşmelidir.
- Süreklilik gibi üç şartlı konularda öğrenciye yalnız sonucu seçtirmek yetmez; "limit var mı", "`f(a)` var mı", "limit = f(a) mı" ayrımı sahnede farklı fiziksel arıza olarak görünmelidir.
- Seçim anı ile test kararı ayrılmalıdır. Öğrenci bir kilidi seçince önizleme alabilir; doğru/yanlış hükmü ve "kilitlendi" dili yalnız testten sonra gelmelidir.
- Arıza görevlerinde başarı "köprü kilitlendi" diye adlandırılmaz. Doğru teşhis kilitlenir, köprü yalnız gerçekten süreklilik sağlandığında kapanır.
- Görsel model üst üste binen küçük label hatalarını ve matematiksel yanlış etiketleri yakalayabilir. Sıçrama süreksizliğinde tek bir `limit y=...` etiketi yazmak pedagojik olarak hatadır; iki yan limit birleşmiyorsa etiket bunu açıkça söylemelidir.
- Gemini `PASS` sonrası gelen should-fixler de Kaptan standardına uygunsa uygulanır; ama raporda hangi değişikliğin post-Gemini polish olduğu ayrıca yazılır.

## 12-06 Türev Eğim Sürücüsünden Çıkan Dersler
- Seçim anı ile kontrol anı ayrılmalıdır. Öğrenci bir parça seçince sahne ipucu ve önizleme verebilir; doğru/yanlış hükmü yalnız `Kontrol Et / Pisti Test Et` sonrası görünmelidir.
- `data-testid` değerleri benzersiz kalmalıdır. Aynı id hem SVG görselinde hem kontrol düğmesinde kullanılırsa görsel QA ve otomasyon doğru öğeyi tıklayamaz.
- 1488x768 laptop yüksekliği gerçek kapıdır. Sağ panelde atom rezervi, ek kanıt kutusu veya fazla kartlar altı kesiyorsa Gemini `PASS` verse bile `MUST_FIX` kapanmadan modül geçmez.
- Türev gibi kağıtta zor görülen konularda teknoloji değeri, formül afişinden değil sekantın teğete dönüşmesi, sivri uçta iki kanadın ayrılması ve kopuk pistte teğetin fiziksel olarak kurulamamasından gelir.
- Panel bilgisi ana sahneyi desteklemeli; görev ve aktif kanıt mümkünse tek blokta tutulmalı, öğrenci gözü grafikten panel kutularına parçalanmamalıdır.
- Kaptan feedback'i sonrası ek ders: panelde dört seçenek olması tek başına "oynanabilir" değildir. Eğim gibi konularda sahne üstünde sürüklenebilir prob, B noktası veya teğet kızağı bulunmalı; panel sadece fallback/kısa yol olmalıdır.
- SVG içine özel pointer drag koymak tek başına yeterli sayılmaz; Computer Use gerçek sürüklemeyi yakalamıyorsa native range/slider katmanı veya daha sağlam hitbox kullanılmalıdır.
- Native range eklerken aynı kontrolün SVG tutacağı da görünür kalırsa öğrenci iki ayrı sürükleme hedefi var sanır. Tek ana manipülatör görünmeli; diğer görsel izler pasif/okuyucu olmalıdır.
- AstroBot mesajı görev state'inden bir adım geride kalırsa modül pedagojik olarak bozulur. Mesaj id'leri çakışmamalı, görev geçişinde eski mesaj temizlenmeli ve screenshot kararlı state alındıktan sonra çekilmelidir.
- Sağ panelde, sahne kartında ve global AstroBot'ta aynı uzun cümleyi üç kere göstermek kalite değil kalabalıktır. Ana iletişim AstroBot + sahne kanıt kartında kalmalı; panel feedback'i kısa durum çipi olmalıdır.

## 12-07 Türev Kural Dökümhanesinden Çıkan Dersler
- Başlangıç state'i doğru formülü veya sonucu açık etmemelidir. Öğrenci önce `üretim isteği` yapısını görmeli; tam kural formülü ve sayı sonucu doğru testten sonra açılmalıdır.
- Kural öğretimi formül listesi olarak kalırsa teknoloji değeri düşer. Çarpımda "türevle/koru" kolları, bölümde pay-payda kalkanı, zincirde dış kabuk/iç çekirdek fiziksel olarak ayrışmalıdır.
- Seçilen kartuş önizleme yapabilir ama doğru/yanlış kararı yine test düğmesinden sonra verilmelidir; bu ayrım yanlış denemeyi pedagojik yapar.
- Kartuş önizlemesi formül cevabı değildir. `fʼ+gʼ`, `fʼg+fgʼ`, `g²` veya final output gibi ifadeler doğru testten önce görünürse cevap sızıntısıdır; preview dili `iki ışın`, `iki kol`, `pay/zırh`, `halka/çekirdek` gibi mekanik olmalıdır.
- Bölüm ve zincir gibi karmaşık ifadelerde kısa önizleme çıktıları kullanılmalı; tam uzun ifade yalnız başarı anında gösterilmelidir. Böylece sahne reçete hissine dönmez.
- Computer Use canlı akışı ile Playwright screenshotları aynı davranışı göstermelidir. Özellikle yanlış deneme, uç kural ve completion tek tek gözlenmeden Gemini skoru modülü kapatmaya yetmez.

## 12-08 Optimizasyon Arazisinden Çıkan Dersler
- Optimizasyon yalnız `f'=0` formülüne indirgenirse teknoloji değeri düşer. Artan/azalan işaret, ekstremum kapısı, maksimum hacim ve minimum maliyet ayrı fiziksel davranışlar olarak görünmelidir.
- Ortadaki yardımcı yönerge bile ana pistle çakışıyorsa görsel hard-faildir. Bilgi, sahnenin üzerine yazı bindirmek yerine sağ panel, feedback hattı veya oyuncak üstü küçük etiketlerle taşınmalıdır.
- Gerçek problem atomlarında "tepe" ve "vadi" soyut nokta olarak kalmamalıdır; maksimum hacim kapasite kutusu gibi, minimum maliyet maliyet çukuru gibi özel nesneyle ayrışmalıdır.
- Console kapısı görsel QA kadar önemlidir. Ekran düzgün görünse bile SVG attribute hatası (`height: undefined` gibi) modül kapanmadan yakalanıp temizlenmelidir.
- 90+ Gemini skoru tek başına yetmez; `MUST_FIX` çıktıysa aynı modülde düzeltilir, ekran görüntüleri yenilenir ve Gemini güncel kanıt paketiyle tekrar çalıştırılır.
- Optimizasyon karar seçimi cevap değildir. `f'(x)>0`, `f'(x)<0`, `V maksimum`, `C minimum` ve final kanıt metni yalnız `Araziyi Test Et` sonrası açılmalıdır; seçim önizlemesi `yükseliş izi`, `iniş izi`, `düz kapı`, `kapasite izi`, `maliyet izi` gibi mekanik dille kalır.
- Erişilebilirlik için eklenen `sr-only` kanıt metinleri de cevap sızıntısı yapabilir. Görselde görünmese bile ekran okuyucu/snapshot cevabı alıyorsa kalite kapısından geçmez; doğru kilitten sonra render edilmelidir.

## 12-09 Çember Radar İstasyonundan Çıkan Dersler
- Çember gibi çok elemanlı konularda tek metafor işe yarar ama her atom fiziksel ayrışma ister: kesen iki kesişim, kiriş iç gergi, teğet tek temas + `90°`, yay eğrisel tarama, açı/alan ayrı davranışlar.
- Sağ panelde 7 seçenek varsa iki kolon taşabilir; üç kolonlu kompakt kontrol ve atom rezervini öğrenci ekranından kaldırmak dar laptop kapısını kurtarır.
- SVG animasyonlarında `r`, `height` gibi geometri attribute'larını animasyonlamak console hatası üretebilir; sabit geometri + opacity/scale benzeri güvenli animasyon tercih edilmeli.
- Gemini must-fixleri bazen küçük metin, kontrast veya lokalizasyon gibi basit görünür ama kapanışa engeldir; düzeltmeden `Review Needed` bile kapanmaz.
- Dış eleştirmenin daha fazla direct manipulation önerisi future polish olabilir; mevcut kapanışta doğru/yanlış feedback ve fiziksel radar ayrımı 90+ kapıyı geçirdiyse sıradaki modüle geçilebilir.

## 12-10 Katı Cisim Ölçüm Dökümhanesinden Çıkan Dersler
- 3D cisim modüllerinde doğru cevabı başlangıçta göstermek daha da kolaydır; nötr bekleme çekirdeği kullanılmalı, gerçek cisim ve formül öğrenci seçiminden veya doğru kilitten sonra açılmalıdır.
- Hacim/yüzey alanı ayrımı en güçlü teknoloji değerini "iç dolum" ve "dış zırh" ayrımında verir; formül metni bu fiziksel ayrımın ardından gelmelidir.
- Three.js sahnelerinde boş canvası yalnız screenshotla değil WebGL pixel check ile de doğrulamak gerekir. `preserveDrawingBuffer` bu QA için bilinçli açıldı; Playwright `ReadPixels` performans uyarısı uygulama hatası değildir.
- Çok atomlu 3D modülde 5 cisim x 2 mod seçim yapısı sağ paneli sade tutar; 10 ayrı kart yerine iki karar katmanı öğrencinin kavram yanılgısını hedefler.
- Gemini `SHOULD_FIX` önerisi küçük terminoloji düzeltmesi bile olsa MEB diliyle uyum sağlıyorsa uygulanır ve raporda post-Gemini polish olarak belirtilir.

## 12-11 Büyük Veri Yargı Laboratuvarından Çıkan Dersler
- Veri modüllerinde "kaynak güvenilir mi, filtre doğru mu, sonuç cümlesi güvenli mi" ayrımı üç ayrı UI kartı değil tek veri hattında fiziksel kilitler olarak görünmelidir.
- İstatistikte güvenli sonuç dili pedagojik kapıdır. Veri güçlü olsa bile öğrenci nedensellik iddiası kurarsa sahne bunu yargı mühründe alarm olarak göstermelidir.
- Grafiklerde QA kritik geometriyi `motion.rect` gibi animasyonlu SVG attribute'larına bağlamak risklidir; screenshot anında bar gövdesi ve değer etiketi kopuk görünebilir. Final kanıt için bar/çizgi geometrisi sabit tutulur veya etiketle aynı koordinat sisteminde birlikte animasyonlanır.
- Gemini'nin aynı görsel sorun için iki tur üst üste `MUST_FIX` vermesi yöntem hatası sinyalidir; kök neden bulunmadan kozmetik cila yapılmaz.
- 1488x768 kiosk/dizüstü kapısında sağ panelde tüm seçimler, kontrol, reset ve feedback görünür kalmalıdır; telefon görünümü bu sprintte ana kalite kararı değildir.
- Paneldeki küçük rozetler bile cevap sızıntısı yapabilir. `%64`, `+12`, `MEDYAN` gibi hedef değerler test öncesi görünmemeli; görev ilerleme rozeti `Kilit 1/2/3/4` gibi nötr kalmalıdır.
- Kaynak ve yargı seçimleri önizleme yapabilir ama "bu güvenilir değil", "aşırı iddia" gibi hüküm veren dil testten önce kullanılmamalıdır. Test öncesi dil `port açıldı`, `taslak hazır`, `testte kontrol edilecek`; test sonrası dil `RED/ONAY`, neden ve sonuç olmalıdır.
