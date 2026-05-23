# 12-09 Çember Radar İstasyonu

## Durum

- Etiket: `Review Needed`
- Route: `/embed/geometry/circle-radar-station`
- Ana kalite hedefi: 3D cisimlerdeki gibi büyük ana oyuncak başrolde; sağ panel yalnız kontrol alanı.
- `Showcase Ready` değildir. Kaptan canlı görsel onayı beklenir.

## SSOT Atomları

- `MAT.12.3.1.1`: Çemberi kesip geçen "Kesen" doğrusunun uzaysal davranışını inceler.
- `MAT.12.3.1.2`: Çemberin içindeki iki noktayı birleştiren "Kiriş" doğru parçasının özelliklerini çıkarır.
- `MAT.12.3.1.3`: Çemberin dışına bir noktada dokunan "Teğet" doğrusunun merkeze dikliğini ispatlar.
- `MAT.12.3.1.4`: Çember üzerindeki eğrisel "Yay" parçasının açısal büyüklüğünü hesaplar.
- `MAT.12.3.2.1`: Çember içindeki çevre açı hesaplama problemlerini çözer.
- `MAT.12.3.2.2`: Çember içindeki merkez açı hesaplama problemlerini çözer.
- `MAT.12.3.2.3`: Daire alanını, yarıçap ve π kullanarak formülize eder.

## Ana Oyuncak

Büyük çember radar istasyonu.

Öğrenci sağ panelden radar modunu seçer; çember sahnesinde seçilen ilişki fiziksel olarak görünür:

- Kesen modunda çemberi iki noktada kesen mavi ışın ve iki temas pimi yanar.
- Kiriş modunda iki çember noktası içeriden yeşil gergi ipiyle bağlanır.
- Teğet modunda tek temas noktası ve merkezden gelen dik yarıçap `90°` mührüyle görünür.
- Yay modunda çember üzerindeki eğrisel parça derece ışığıyla boyanır.
- Çevre açı modunda çember üstündeki bakış noktası aynı yayı yarıya indirir.
- Merkez açı modunda merkezden çıkan iki yarıçap yay ölçüsünü bire bir okur.
- Alan modunda tüm disk `πr²` sinyal alanı olarak dolar.

## Öğrenci Akışı

1. İlk görevde kesen ışını seçilir.
2. Yanlış seçimde radar alarmı seçilen modun neden uymadığını söyler.
3. Doğru mod `Radarı Test Et` ile kilitlenir.
4. Sırayla kiriş, teğet, yay, çevre açı, merkez açı ve alan görevleri tamamlanır.
5. Completion ekranı çember elemanı, yay/açı ve alan kanıtlarını özetler.

## Test ID Kontratı

- `circle-radar-station-scene`
- `circle-radar-station-manipulator`
- `circle-radar-station-secant`
- `circle-radar-station-chord`
- `circle-radar-station-tangent`
- `circle-radar-station-arc`
- `circle-radar-station-inscribed-angle`
- `circle-radar-station-central-angle`
- `circle-radar-station-area`
- `circle-radar-station-check`
- `circle-radar-station-feedback`
- `circle-radar-station-reset`

## QA Planı

- Computer Use desktop: açılış, yanlış deneme, doğru zincir, uç görevler, reset, completion.
- Playwright/browser screenshotları: 00-start, 25-wrong, 50-chord, 65-tangent, 75-angle, 85-area, 100-complete, viewport-1488x768.
- Console/page error temizliği.
- Gemini 3.1 Pro veya mevcut en yüksek Gemini ile final screenshot paketi.
- Teknik kapılar: `npm run module:check -- circle-radar-station`, `npx tsc --noEmit`, `npm run build`, `git diff --check`.

## İç Rubrik

- Internal hedef: `90+`.
- Hard fail: çember küçük kalırsa, yazılar çemberin içine taşarsa, sağ panel ana sahneyi çalarsa, yanlış deneme yalnız metin verirse, teğet/kesen/kiriş ayrımı fiziksel olarak görünmezse.

## Kapanış Notu

Bu modül `Review Needed` olarak ana uygulamada görünür. Kaptan görsel onayı gelmeden `Showcase Ready` yapılmayacak.

## Final Kanıt

- Computer Use: Chrome desktop üzerinde açılış, yanlış kiriş alarmı, doğru kesen, kiriş, teğet, yay, çevre açı, merkez açı, alan zinciri, completion ve `Tekrar Oyna` reset akışı gözlendi.
- Playwright QA: `.agent/browser-use-shots/12-09-circle-radar-station-00-start.png`, `25-wrong.png`, `50-chord.png`, `65-tangent.png`, `75-angle.png`, `85-area.png`, `100-complete.png`, `viewport-1488x768.png`.
- Console: `.agent/browser-use-shots/12-09-circle-radar-station-console.md`, `No console/page errors captured.`
- Gemini: `.agent/gemini-reports/12-09-circle-radar-station-final.txt`, Gemini 3.1 Pro çağrısı `95/100 PASS`, `MUST_FIX` yok. İlk Gemini turunda düşük kontrast yazı ve İngilizce completion etiketi `MUST_FIX` olarak yakalandı; düzeltildi.
- Teknik kapılar: `npm run module:check -- circle-radar-station` 28 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti. Build yalnız mevcut büyük chunk uyarısını verdi.
