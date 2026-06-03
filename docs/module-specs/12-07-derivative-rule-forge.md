# 12-07 Dört İşlem ve Zincir Türevi

## Durum
Showcase Ready. Kaptan canlı onayıyla ana uygulamada `Showcase Ready / Vitrin Hazır` etiketiyle görünür.

## Amaç
Türev alma kurallarını formül listesi olmaktan çıkarıp büyük, doğrudan etkileşimli bir kural kurma sahnesine çevirmek. Öğrenci toplam, fark, çarpım, bölüm ve zincir kuralında hangi fonksiyonun türevlendiğini, hangisinin aynen kaldığını ve sonucun hangi işlemle oluştuğunu sahnede adım adım kurar.

## Atom Kapsamı
- MAT.12.2.5.1: İki ayrı fonksiyonun toplamının türev kuralını uygular.
- MAT.12.2.5.2: İki ayrı fonksiyonun farkının türev kuralını uygular.
- MAT.12.2.5.3: İki ayrı fonksiyonun çarpımının türev kuralını uygular.
- MAT.12.2.5.4: İki ayrı fonksiyonun bölümünün türev kuralını uygular.
- MAT.12.2.5.5: İçiçe geçmiş (Bileşke) fonksiyonlarda zincir kuralı manevrasıyla türev alır.

## Kapsam Dışı
- Türevin geometrik tanımı, sekant-teğet dönüşümü ve türevin olmadığı noktalar 12-06 modülünde kalır.
- Artan/azalan, ekstremum ve optimizasyon 12-08 Optimization Terrain modülüne bırakılır.

## Ana Oyuncak
Ortada geniş bir türev kuralı sahnesi bulunur. Sol tarafta verilen fonksiyonlar, ortada seçilen kural, sağda sonuç alanı vardır. Toplam/farkta `f'` ve `g'` ayrı ayrı oluşur; çarpımda `f'·g` ve `f·g'` iki terim olarak görünür; bölümde pay `f'g - fg'`, payda `g²` olarak ayrılır; zincirde dış fonksiyon ve iç fonksiyonun türevleri birlikte okunur.

## Görev Akışı
1. MAT.12.2.5.1: Toplam kuralında `f' + g'` kurulur.
2. MAT.12.2.5.2: Fark kuralında `f' - g'` kurulur.
3. MAT.12.2.5.3: Çarpım kuralında `f'·g + f·g'` iki terimle kurulur.
4. MAT.12.2.5.4: Bölüm kuralında pay `f'g - fg'`, payda `g²` olur.
5. MAT.12.2.5.5: Zincir kuralında dış türev, iç türevle çarpılır.

## Altın Şablon Cila
- Kural seçimi yalnız önizleme verir; doğru kural bile sahnedeki matematik adımları tamamlanmadan başarı üretmez.
- Toplam/farkta öğrenci `f türevi`, `g türevi` ve `topla/çıkar` adımlarını uygular.
- Çarpımda iki terim ayrı kurulur: `fʼ·g` için `fʼ al + g aynen`, `f·gʼ` için `f aynen + gʼ al`, sonra terimler toplanır.
- Bölümde pay farkı `fʼg - fgʼ` ve payda karesi `g²` ayrı adım olarak görünür.
- Zincirde `dış türev` ve `iç türev` ayrı adımlardır; başarı ancak ikisi birlikte çalışınca gelir.
- Doğru kural + eksik adım durumunda `Eksik adım` uyarısı görünür; formül ve çıktı açılmaz.

## Route
- /embed/calculus/derivative-rule-forge

## Test ID Kontratı
- `derivative-rule-forge-scene`
- `derivative-rule-forge-manipulator`
- `derivative-rule-forge-sum`
- `derivative-rule-forge-difference`
- `derivative-rule-forge-product`
- `derivative-rule-forge-quotient`
- `derivative-rule-forge-chain`
- `derivative-rule-forge-check`
- `derivative-rule-forge-feedback`
- `derivative-rule-forge-reset`
- `derivative-rule-forge-step-derive-f`
- `derivative-rule-forge-step-derive-g`
- `derivative-rule-forge-step-bridge-plus`
- `derivative-rule-forge-step-bridge-minus`
- `derivative-rule-forge-step-keep-f`
- `derivative-rule-forge-step-keep-g`
- `derivative-rule-forge-step-subtract-pay`
- `derivative-rule-forge-step-shield-g2`
- `derivative-rule-forge-step-outer-shell`
- `derivative-rule-forge-step-inner-core`

## QA Notu
- Kural listesi veya formül reçetesi hard faildir; seçilen kural sahnede mekanik parça olarak çalışmalıdır.
- Çarpım ve bölüm kurallarında "hangisi türevleniyor, hangisi aynen kalıyor?" ayrımı görsel kol ve renklerle görünmelidir.
- Zincir kuralı bileşke fonksiyon diliyle anlaşılmalıdır; dış fonksiyon ve iç fonksiyon adımları açık olmalıdır.
- Seçim anı doğru/yanlış kararı vermez; yalnız önizleme ve ipucu gösterir. Karar `Sonucu Kontrol Et` sonrası verilir.
- Telefon görünümü ana hedef değildir; karar desktop/kiosk görünümünden verilir.

## Kapanış Kanıtı
- Statü: `Showcase Ready / Vitrin Hazır`. Kaptan 2026-05-29 canlı onayıyla vitrin etiketi açıldı.
- Computer Use QA: Chrome desktop üzerinde açılış, yanlış çarpım kartuşu denemesi, doğru toplam/fark/çarpım/bölüm/zincir zinciri, completion ve `Tekrar Oyna` reset akışı gözlendi.
- Playwright QA: `.agent/browser-use-shots/12-07-derivative-rule-forge-00-start.png`, `25-wrong.png`, `50-mid.png`, `75-edge.png`, `80-chain.png`, `100-complete.png`, `viewport-1488x768.png`.
- Console: `.agent/browser-use-shots/12-07-derivative-rule-forge-console.md`, 0 warning / 0 error.
- Gemini 3.1 Pro final: `.agent/gemini-reports/12-07-derivative-rule-forge-final.txt`, `100/100 PASS`, `MUST_FIX` boş.
- Teknik kapılar: `npm run module:check -- derivative-rule-forge` 34 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti. Build yalnız mevcut Vite büyük chunk uyarısını verdi.
- Internal görsel/öğrenci deneyimi puanı: `97/100`. Başlangıçta doğru formülün erken görünmesi self-audit ile yakalandı; artık öğrenci önce `(f + g)' = ?` gibi üretim isteğini görüyor, kural formülü doğru testten sonra açılıyor.
- 2026-05-16 son cila: kartuş seçimi sırasında çıkış kapsülü artık `fʼ+gʼ`, `fʼg+fgʼ`, `g²` gibi formül cevabını sızdırmıyor; yalnız `iki ışın`, `iki kol`, `pay/zırh`, `halka/çekirdek` gibi mekanik önizleme dili kullanıyor. Gerçek formül, çıktı ve kural kanıtı yalnız `Kuralı Test Et` sonrası açılıyor.
- 2026-05-16 QA: Computer Use Chrome desktop'ta yanlış `Çarpım Kolu` önizlemesi ve test alarmı gözlendi. Playwright 1488x768 üzerinde yanlış deneme, doğru toplam/fark/çarpım/bölüm/zincir zinciri, completion ve reset geçti.
- 2026-05-23 Kaptan canlı göz cila: çizgilerin üst üste binmiş gibi durduğu bildirildi. Tek kalın ana bant kaldırılıp giriş ve çıkış üç ayrı ince raya ayrıldı; aktif kural seçilince pasif giriş rayları gizleniyor, böylece `f'` ve `g'` kolları üst üste binmeden okunuyor. Aktif kuralın üstüne binen ekstra parlak çerçeve kaldırıldı ve embed statü etiketi Türkçe `Görüş Gerekli` oldu. Browser/Codex canlı QA'da yanlış kartuş, doğru toplam, beş görev completion, yatay taşma ve console kontrolü geçti.
- 2026-05-23 altın şablon cila: Kaptan onayıyla modül kartuş seçme deneyinden sahnede kural inşa etme deneyine taşındı. Browser/Codex canlı QA'da doğru kartuş + eksik parça alarmı, `3/3` parça kilidi, yanlış kartuş engeli, beş görev completion, completion kart genişliği, yatay taşma ve console kontrolü geçti. Görseller `.agent/visual-reports/12-07-build-step-lock.png` ve `.agent/visual-reports/12-07-build-completion.png` altında.
- 2026-05-23 kartuş gövdesi toplu cila: Çarpım dışındaki kartuşlarda da orta gövde kalitesi eşitlendi. Tüm kural seçenekleri ortak portlu `RuleCartridgeCore` ve animasyonlu `RuleFlowRail` kullanıyor; eski içinden geçen statik path kalıpları kaldırıldı. Toplam/fark etiketleri gövdenin arkasında kalmayacak biçimde dışa taşındı. Browser/Codex canlı kontrolde beş kartuş tek tek tıklandı; ortak çekirdek, sembol, eski path yokluğu, yatay taşma `0` ve console warning/error `0` doğrulandı.
- 2026-05-23 etiket katmanı cila: Kural rayları ve okunacak rozetler ayrı SVG katmanlarına ayrıldı. `köprü`, `türevle · koru`, `pay bandı`, `dış halka` gibi etiketler artık kartuş/çıkış katmanından sonra çiziliyor; kompakt rozetler daraltıldı ve yazıya koyu kontur eklendi. Browser/Codex canlı kontrolde çarpım kolu `köprü` etiketi üst katmanda ve okunur.
- 2026-05-24 MEB dil sadeleştirme: Görünen modül dili `Türev Kuralları Atölyesi`, `Kural Adımları`, `Sonucu Kontrol Et`, `f türevi`, `g türevi`, `aynen`, `pay`, `payda`, `dış türev` ve `iç türev` kavramlarına taşındı. Eski oyun jargonu öğrenciye görünen alandan kaldırıldı; ortak sağ panel başarı mesajı bu modülde `Sonuç hazır` diline özelleştirildi. Browser/Codex ve Playwright QA'da beş görev akışı geçti, yatay taşma `0`, console warning/error `0`, eski terim taraması `0`. Teknik kapılar: `module:check`, `tsc`, `build`, `git diff --check` geçti; build yalnız mevcut büyük chunk uyarısını verdi.
- 2026-05-24 çıkış kapsülü cila: Kaptan geri bildirimiyle sahnedeki büyük sonuç kapsülünden `0/3 adım` gibi sayaç dili kaldırıldı. Kural seçilince kapsül seçilen kuralın sonuç şemasını (`fʼ + gʼ`, `fʼg + fgʼ`, `(fʼg - fgʼ)/g²`, `Fʼ(g) · gʼ`) gösteriyor; gerçek çıktı yalnız kontrol sonrası açılıyor. Adım sayacı alt tezgâhta kalıyor. Teknik kapılar: `module:check`, `tsc`, `build`, `git diff --check` geçti; build yalnız mevcut büyük chunk uyarısını verdi.
- 2026-05-26 erişilebilirlik/teknik metin cilası: Canlı Browser denetiminde test-id kontratı görselde olmasa da sayfa metnine düşüyordu; marker `aria-hidden` ve `hidden` hale getirildi. Toplam kuralı akışı tekrar oynandı: kural seçimi, üç adım kilidi, `Sonucu Kontrol Et`, `2x + 3` sonucu, `Sonraki` yokluğu, yatay taşma `0`, console warning/error `0` ve teknik metin sızıntısı `0` doğrulandı. Teknik kapılar: `npm run module:check -- derivative-rule-forge`, `npx tsc --noEmit`, `npm run build`, `git diff --check` geçti.
- 2026-05-29 Kaptan isim/onay turu: `Türev Kural Dökümhanesi` adı değerlendirildi; yalnız `Dört İşlemin Türevi` denirse zincir kuralı dışarıda kalacağı için görünen ad `Dört İşlem ve Zincir Türevi` yapıldı. Registry ve embed statüsü Kaptan onayıyla `Showcase Ready / Vitrin Hazır` oldu. Browser/Codex canlı QA'da embed başlığı, `SHOWCASE READY` etiketi, dashboard `VİTRİN HAZIR`, eski başlık yokluğu, hat dışı ekranı yokluğu, yatay taşma `0` ve console warning/error `0` doğrulandı.
