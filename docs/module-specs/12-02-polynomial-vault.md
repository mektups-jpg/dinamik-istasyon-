# 12-02 Polinom Kasası

## Durum
Showcase Ready. Bu modül 2026-05-17 tarihinde Kaptan canlı görsel onayı aldı: "polinom kasası iyi oldu" ve "polinom kasası adlı modül de hazır oldu." 12. sınıf vitrin paketine alınabilir.

## Amaç
12. sınıf polinom fonksiyon atomlarını tek ana oyuncakla okutmak: öğrenci polinom ifadesini küçük yazı gibi okumaz, dört büyük derece rafına yerleşmiş terim bloklarını tarar. Polinom Kasası, doğrusal ve karesel polinom doğasını, ardından derece, başkatsayı ve sabit terimi fiziksel raf/mercek ilişkisiyle görünür yapar.

## Atom Kapsamı
- MAT.12.1.2.1: Doğrusal (1. Derece) fonksiyonların polinom doğasını doğrular.
- MAT.12.1.2.2: Karesel (Parabol - 2. Derece) fonksiyonların polinom doğasını doğrular.
- MAT.12.1.2.3: Tek değişkenli bir polinomun derecesini saptar.
- MAT.12.1.2.4: Tek değişkenli bir polinomun başkatsayısını saptar.
- MAT.12.1.2.5: Tek değişkenli bir polinomun sabit terimini saptar.

## Kapsam Dışı
- Polinom veya rasyonel denklem/eşitsizlik çözümü bu modüle alınmaz; 12-03 İşaret Yörünge Radarı modülünde ele alınır.
- Limit, süreklilik, türev ve optimizasyon atomları bu modüle alınmaz.

## Ana Oyuncak
Ortada geniş bir polinom kasası bulunur. Kasanın dört ana rafı vardır: x³, x², x ve x⁰. Her görevde terim blokları bu raflara fiziksel olarak yerleşir; olmayan derece rafı boş/uyuyan görünür. Öğrenci sağ panelden bir tarama merceği seçer: doğrusal kimlik, karesel kimlik, derece, başkatsayı veya sabit terim. Seçilen mercek sahnede ilgili rafı ışıklandırır; doğru mercekte kasa kilidi kapanır, yanlış mercekte seçilen raf pembe alarm verir ve neden yanlış olduğu yazılır.

## Görev Akışı
1. MAT.12.1.2.1: P(x) = 5x + 2 ifadesinin 1. derece polinom olduğu kilitlenir.
2. MAT.12.1.2.2: P(x) = 2x² - 3x + 1 ifadesinin karesel polinom olduğu kilitlenir.
3. MAT.12.1.2.3: P(x) = -4x³ + 3x - 2 ifadesinde en yüksek dolu rafın x³ olduğu ve derecenin 3 olduğu bulunur.
4. MAT.12.1.2.4: Aynı kübik kasada x³ rafındaki katsayının başkatsayı -4 olduğu okunur.
5. MAT.12.1.2.5: P(x) = 7x² - 5 ifadesinde x⁰ rafının sabit terim -5 olduğu kilitlenir.

## Route
- /embed/algebra/polynomial-vault

## Test ID Kontratı
- `polynomial-vault-scene`
- `polynomial-vault-manipulator`
- `polynomial-vault-linear`
- `polynomial-vault-quadratic`
- `polynomial-vault-degree`
- `polynomial-vault-leading`
- `polynomial-vault-constant`
- `polynomial-vault-check`
- `polynomial-vault-feedback`
- `polynomial-vault-reset`

## QA Notu
- Ana kasanın desktop/kiosk görünümünde küçük kalması hard fail.
- Terimler küçük reçete/panel yazısı gibi kalırsa hard fail.
- Seçili mercek sahnede fiziksel raf vurgusu üretmezse hard fail.
- Yanlış deneme neden yanlış olduğunu sahnede ve AstroBot mesajında göstermeli.
- Completion ekranı genel başarı değil, beş polinom okuma atomunu konuya özel özetlemeli.
- Telefon görünümü bu modül için ana hedef değildir; karar desktop/dizüstü QA ile verilir.

## Kapanış Kanıtı
- Computer Use desktop QA: açılış, yanlış karesel deneme, doğru görev zinciri, reset ve completion canlı denendi.
- 2026-05-16 son cila: mercek seçimi ile kasa kararı ayrıldı. Seçim artık yalnız raf önizlemesi veriyor; doğru/yanlış alarmı ve hedef değer yalnız `Kasayı Kilitle` sonrası açılıyor. Computer Use ile yanlış karesel, doğru doğrusal, tüm 5 görev zinciri ve completion yeniden geçti.
- 2026-05-17 işaretleme sadeleştirme: Kaptan'ın "öğrenci çok fazla işaretleme mi yapıyor?" kontrolü sonrası sağ panelde 5 mercek korunarak görsel hiyerarşi kuruldu. Seçenek sırası her görevde sabit kaldı; böylece öğrenci "ilk seçenek" ritmini ezberlemez, polinomun ne istediğini okuyarak seçim yapar. Her görevde 3 odak mercek daha belirgin, diğer önemli mercekler daha sakin yardımcı seçenek olarak görünür. Doğrusal/karesel kimlik görevlerinde yalnız karar veren raf parlıyor; alt terimler destek olarak sakin kalıyor. Duplicate `polynomial-vault-scene` DOM id'si kaldırıldı, uzun polinom etiketi tek satıra çekildi ve completion kartları dar ekranda sıkışmayacak şekilde responsive yapıldı.
- Playwright görsel kanıtları: `.agent/browser-use-shots/12-02-polynomial-vault-final2-00-start.png`, ayrıca final2 25-wrong, 50-mid, 75-edge ve 100-complete ekranları.
- Console kanıtı: `.agent/browser-use-shots/12-02-polynomial-vault-final2-console.log`, `0 error / 0 warning`.
- Gemini 3.1 Pro: ilk tur `65/100 FAIL` verdi; sahne fiziksel kasa/çekmece derinliği ve hareketli tarama merceğiyle rework edildi. Final2 raporu `.agent/gemini-reports/12-02-polynomial-vault-final2.txt`, `92/100 PASS`, must-fix yok.
- Teknik kapılar: `npm run module:check -- polynomial-vault` 24 pass / 2 expected warn / 0 fail; `npx tsc --noEmit` geçti; `npm run build` geçti.
- Durum: Ana uygulamada `Showcase Ready / Vitrin Hazır`; Kaptan canlı görsel onayıyla vitrin paketine alınabilir.
