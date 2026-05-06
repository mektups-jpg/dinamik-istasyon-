# 11-10 Özel Dörtgen Tanı Masası

## Durum

Done. SSOT atomları doğrulandı; uygulama klasörü ve registry route'u eklendi. Browser Use ile görsel smoke, kareyi yanlış kilit seçme özel uyarısı, `Home` fallback üzerinden kenar/köşegen tarayıcıları, doğru eşkenar dörtgen/dikdörtgen kilitleri, completion ve console warning/error `[]` kontrolü geçti. Gemini 3 Flash ilk turda "4 kenar eşit" ifadesinin kareyi de kapsadığı must-fix'ini verdi; görev metni, hedef etiketi, kural paneli ve kare seçimi hata mesajı `dik açı yok` ayrımıyla düzeltildi. Final Gemini turu 98/100 PASS verdi, must-fix yok. `npm run module:check -- special-quadrilateral-diagnostic-table` 21 pass / 0 warn / 0 fail, `npm run build` ve `git diff --check` temiz.

## Amaç
11. sınıf öğrencisine özel dörtgenleri ezber kartı gibi değil, özellik taramasıyla tanıtmak. Öğrenci şeklin kenarlarını ve köşegenlerini ayrı tarayıcılarla test eder; çıkan izleri doğru sınıflandırma kilidine bağlar.

## Atom Kapsamı
- `MAT.11.2.2.1`: Özel dörtgenleri kenar özelliklerine göre sınıflandırır.
- `MAT.11.2.2.2`: Özel dörtgenleri köşegen kesişim özelliklerine göre sınıflandırır.

## Kapsam Dışı
- İç açı toplamı ve alan birleştirme tekrar edilmez; bu kapsam 11-09 içinde tamamlandı.
- İçbükey/dışbükey, köşegen sayısı, simetri ve mozaik kaplama bu modüle sıkıştırılmaz.
- Ağır ispat metni yoktur; öğrenci özellik tarama sonucunu görerek sınıflandırır.

## Ana Oyuncak
Tek sahne bir **geometri teşhis masası** olur:
- Ortada taranacak özel dörtgen numunesi bulunur.
- Kenar görevinde öğrenci kenar tarayıcısını sona taşır; eşit kenarlar ve paralel karşı kenarlar ışır.
- Köşegen görevinde öğrenci köşegen tarayıcısını sona taşır; eşit köşegenler ve orta noktada kesişme ışır.
- Öğrenci sınıflandırma mühürlerinden doğru kilidi seçer.

## Görev Akışı
1. `kenar izi`: Eşkenar dörtgen numunesinde dört kenar eşitliği, karşı kenar paralelliği ve dik açı olmadığı taranır; doğru kilit `Eşkenar Dörtgen`. Kare de 4 eşit kenara sahip olabileceği için ayrım özellikle "dik açı yok" iziyle verilir.
2. `köşegen izi`: Dikdörtgen numunesinde eşit köşegenler ve orta noktada kesişme taranır; doğru kilit `Dikdörtgen`.

## Route
- `/embed/geometry/special-quadrilateral-diagnostic-table`

## Test ID Kontratı
- `special-quadrilateral-diagnostic-scene`
- `special-quad-side-scanner`
- `special-quad-diagonal-scanner`
- `special-quad-classification-lock`
- `special-quad-lock-rhombus`
- `special-quad-lock-rectangle`
- `special-quad-check`
- `special-quad-reset`

## QA Planı
- `npm run module:check -- special-quadrilateral-diagnostic-table`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/geometry/special-quadrilateral-diagnostic-table?qa=1` açılır.
  - Ana teşhis masası, aktif numune, tarayıcı ve sınıflandırma kilitleri görünür.
  - Yanlış sınıflandırma veya eksik tarama AstroBot hata mesajı üretir.
  - `Home` fallback ile kenar/köşegen tarayıcıları hedefe alınır.
  - Doğru kilitler seçilir, iki görev tamamlanır ve completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Kenar/köşegen özellikleri öğrencinin ilk bakışta anlayacağı kadar net mi, sınıflandırma kilitleri ezber butonu gibi mi duruyor, görsel karmaşa var mı değerlendirilir.

## QA Kapanışı
- Browser Use ekran kanıtları:
  - `.agent/browser-use-shots/11-10-final-start.png`
  - `.agent/browser-use-shots/11-10-final-square-wrong.png`
  - `.agent/browser-use-shots/11-10-final-side-locked.png`
  - `.agent/browser-use-shots/11-10-final-diagonal-locked.png`
  - `.agent/browser-use-shots/11-10-final-completion.png`
- Browser Use akış sonucu: kare yanlış kilit özel uyarısı, `Home` fallback ile kenar/köşegen tarayıcıları, doğru kilitler, completion ve console `[]` geçti.
- Gemini 3 Flash sonucu: ilk tur 88/100 PASS_WITH_WARNINGS ve must-fix; final tur 98/100 PASS, must-fix yok.
