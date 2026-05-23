# 12-07 Türev Kural Dökümhanesi

## Durum
Hazırlanıyor. Ana uygulamada `Review Needed / Görüş Gerekli` etiketiyle görünecek; Kaptan canlı göz onayı gelmeden Showcase Ready sayılmaz.

## Amaç
Türev alma kurallarını formül listesi olmaktan çıkarıp büyük bir "Kural Döküm Bandı" deneyine çevirmek. Öğrenci iki fonksiyon kapsülünü veya iç-dış fonksiyon halkasını doğru kural kartuşundan geçirir; sahne hangi parçanın türevlenip hangi parçanın korunduğunu fiziksel kollarla gösterir.

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
Ortada geniş bir kural döküm bandı bulunur. Sol tarafta fonksiyon kapsülleri, ortada seçilen kural kartuşu, sağda türev çıktısı vardır. Toplam/farkta iki türev ışını paralel birleşir; çarpımda iki kol `f'·g` ve `f·g'` parçalarını birlikte döker; bölümde üstte çıkarma bandı, altta `g²` zırhı görünür; zincirde dış halka açılır ve iç çekirdek çarpan olarak kilitlenir.

## Görev Akışı
1. MAT.12.2.5.1: Toplam kuralında iki türev ışını `f' + g'` olarak birleşir.
2. MAT.12.2.5.2: Fark kuralında ikinci ışın ters işaretle çıkar.
3. MAT.12.2.5.3: Çarpım kuralında iki çapraz kol aynı anda çalışır.
4. MAT.12.2.5.4: Bölüm kuralında pay bandı `f'g - fg'`, payda zırhı `g²` olur.
5. MAT.12.2.5.5: Zincir kuralında dış türev halkası ve iç türev çekirdeği çarpılır.

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

## QA Notu
- Kural listesi veya formül reçetesi hard faildir; seçilen kural sahnede mekanik parça olarak çalışmalıdır.
- Çarpım ve bölüm kurallarında "hangisi türevleniyor, hangisi korunuyor?" ayrımı görsel kol ve renklerle görünmelidir.
- Zincir kuralı iç-dış fonksiyon halkası olarak anlaşılmalıdır; yalnız `u` yazısı yeterli değildir.
- Seçim anı doğru/yanlış kararı vermez; yalnız önizleme ve ipucu gösterir. Karar `Kuralı Test Et` sonrası verilir.
- Telefon görünümü ana hedef değildir; karar desktop/kiosk görünümünden verilir.

## Kapanış Kanıtı
- Statü: `Review Needed / Görüş Gerekli`. Kaptan canlı görsel onayı olmadan `Showcase Ready` yapılmayacak.
- Computer Use QA: Chrome desktop üzerinde açılış, yanlış çarpım kartuşu denemesi, doğru toplam/fark/çarpım/bölüm/zincir zinciri, completion ve `Tekrar Oyna` reset akışı gözlendi.
- Playwright QA: `.agent/browser-use-shots/12-07-derivative-rule-forge-00-start.png`, `25-wrong.png`, `50-mid.png`, `75-edge.png`, `80-chain.png`, `100-complete.png`, `viewport-1488x768.png`.
- Console: `.agent/browser-use-shots/12-07-derivative-rule-forge-console.md`, 0 warning / 0 error.
- Gemini 3.1 Pro final: `.agent/gemini-reports/12-07-derivative-rule-forge-final.txt`, `100/100 PASS`, `MUST_FIX` boş.
- Teknik kapılar: `npm run module:check -- derivative-rule-forge` 24 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti. Build yalnız mevcut Vite büyük chunk uyarısını verdi.
- Internal görsel/öğrenci deneyimi puanı: `97/100`. Başlangıçta doğru formülün erken görünmesi self-audit ile yakalandı; artık öğrenci önce `(f + g)' = ?` gibi üretim isteğini görüyor, kural formülü doğru testten sonra açılıyor.
- 2026-05-16 son cila: kartuş seçimi sırasında çıkış kapsülü artık `fʼ+gʼ`, `fʼg+fgʼ`, `g²` gibi formül cevabını sızdırmıyor; yalnız `iki ışın`, `iki kol`, `pay/zırh`, `halka/çekirdek` gibi mekanik önizleme dili kullanıyor. Gerçek formül, çıktı ve kural kanıtı yalnız `Kuralı Test Et` sonrası açılıyor.
- 2026-05-16 QA: Computer Use Chrome desktop'ta yanlış `Çarpım Kolu` önizlemesi ve test alarmı gözlendi. Playwright 1488x768 üzerinde yanlış deneme, doğru toplam/fark/çarpım/bölüm/zincir zinciri, completion ve reset geçti.
