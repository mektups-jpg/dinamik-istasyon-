# 10-07 Sabit Alan Üçgen Rayı

## Durum

Done. SSOT atomu `MAT.10.4.3.1` olarak doğrulandı.

## Amaç

10. sınıf öğrencisine tabanı ve yüksekliği aynı kalan üçgenlerin alanlarının aynı olduğunu formül ezberi olarak değil, tepe noktası paralel ray üzerinde kayarken alan büyüklüğünün sabit kalmasıyla sezdirmek.

## Atom Kapsamı

- `MAT.10.4.3.1`: Bir üçgenin tabanı sabitken, tepe noktasını paralel doğru üzerinde kaydırarak aynı alana sahip farklı üçgen illüzyonu yaratır.

## Kapsam Dışı

- Dik üçgen trigonometrik oranları `10-06 Trigonometrik Teodolit` içinde tamamlandı.
- Sinüs/kosinüs teoremleri `10-08 Sinüs-Kosinüs Arazi Ölçeri` içinde ayrı ele alınacak.
- Birim çember özdeşliği `10-09 Birim Çember Kalkanı` içinde ayrı ele alınacak.

## Ana Oyuncak

Tek sahne bir **sabit alan ray masası** olur:

- Alt taban `A-B` sabit kalır.
- Üstte tabana paralel bir tepe rayı bulunur.
- Öğrenci `C` tepe düğümünü ray üzerinde sola/sağa sürükler.
- Alan büyüklüğü ve yükseklik kablosu her konumda aynı kalır.
- Görevler öğrenciyi önce sol, sonra sağ, sonra serbest konumda aynı alan mühürlerine götürür.

## Görev Akışı

1. `sol kaydırma`: Tepe düğümünü sol hedefe taşı; taban değişmeden alanın aynı kaldığını gör.
2. `sağ kaydırma`: Tepe düğümünü sağ hedefe taşı; üçgen şekli değişir ama alan büyüklüğü sabit kalır.
3. `alan mührü`: Tepeyi orta hedefe getir ve `A = taban · yükseklik / 2` alan mührünü kilitle.

## Route

- `/embed/geometry/constant-area-triangle-rail`

## Test ID Kontratı

- `constant-area-scene`
- `constant-area-apex`
- `constant-area-left-target`
- `constant-area-right-target`
- `constant-area-mid-target`
- `constant-area-check`
- `constant-area-reset`

## QA Planı

- `npm run module:check -- constant-area-triangle-rail`: 19 pass / 0 warn / 0 fail.
- `npm run build`: geçti.
- `git diff --check`: temiz.
- Browser Use:
  - `/embed/geometry/constant-area-triangle-rail?qa=1` açılır.
  - İlk viewport'ta taban, paralel tepe rayı, tepe düğümü, alan gölgesi ve kontrol paneli görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback aktif hedefe kilitler.
  - Üç görev tamamlanır, completion ekranı görünür.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Sabit taban-yükseklik ilişkisi, alanın neden değişmediği, ilk 3 saniye anlaşılabilirlik ve dar/embed görünüm kontrol edilir.

## Güncel Test Durumu

- Browser Use canlı QA: yanlış deneme, `Home` fallback ile sol/sağ/orta hedef, completion ve console `[]` geçti.
- Screenshot kanıtları: `.agent/browser-use-shots/10-07-*.png`.
- Gemini 3 Flash ilk tur: 88/100 PASS_WITH_WARNINGS; sağ hedefte sol yön başarı mesajı must-fix çıktı.
- Düzeltme: Başarı dili yön yerine ray hareketi ve sabit alan büyüklüğüne çekildi; etiket/formül dili güçlendirildi.
- Gemini 3 Flash final: `.agent/gemini-reports/10-07-constant-area-triangle-rail-final.txt` 96/100 PASS, must-fix yok.
- Durum: Done.
