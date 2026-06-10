# 09-11 Eşitsizlik Güvenlik Alanı

## Durum

Showcase Ready / Vitrin Hazır. 2026-06-07 Kaptan canlı görsel onayıyla vitrine alındı.

## Amaç

Öğrenci günlük yaşamdan gelen doğrusal eşitsizliği yalnız cebir satırı olarak değil, sayı doğrusunda sınır ve güvenli bölge olarak kurar. Sınır çizgisi sürüklenir, güvenli yön seçilir; testten sonra çözüm kümesi ve kısa sebep açılır.

## Atom Kapsamı

- `MAT.9.2.3.2`: Doğrusal modellerle kurulan bir günlük yaşam probleminin eşitsizliğini (`≤`, `≥`) çözer.

## Kapsam Dışı

- İki bilinmeyenli denklem çözümü `Denklem Denizaltısı` içinde kalır.
- Aralık kesişim/birleşim dili `Aralık Kapıları İstasyonu` içinde kalır.
- Grafik üzerinde `y ≥ f(x)` bölge taraması bu ilk sürümde değil; bu modül bir değişkenli günlük problem çözüm bölgesine odaklanır.

## Tek Ana Oyuncak

Ana sahne bir sayı doğrusu güvenlik tarayıcısıdır. Öğrenci sınır işaretini sürükler ve güvenli alan yönünü `≤` ya da `≥` olarak seçer. Sahnede seçilen bölge anında ışıklanır; sağ panel yalnız problem metni, mevcut seçim ve test düğmeleriyle destek verir.

## Görev Akışı

1. Kantin bütçesi: `ax ≤ b` tipinde "en fazla" modeli; güvenli alan sola açılır.
2. Kutuya en fazla kitap: `ax + c ≤ b` tipinde "aşmamak" modeli; önce boş kutu ağırlığı çıkarılır, güvenli alan sola açılır.
3. Puan hedefi: `ax + c ≥ b` tipinde "en az" modeli; güvenli alan sağa açılır.
4. Bağış hedefi: `ax + c ≥ b` tipinde hedef modeli; önce sabit çıkarılır, güvenli alan sağa açılır.

Her oynayışta bu dört görev aynı kavram sırasını korur ama 8 güvenli sayı setinden biriyle gelir. Böylece öğrenci sadece `5` ve `6` cevaplarını ezberlemek yerine, modelden sınırı bulup sayı doğrusunda yön seçmeyi tekrarlar. `missionSet=0..7` tek başına öğrenci deneyimini kilitlemez; yalnız test için bilinçli sabitleme gerektiğinde `/embed/algebra/inequality-safety-zone?lockMissionSet=1&missionSet=0..7` kullanılır.

Başlangıçta seçim kutusu `yön + sınır` olarak nötr kalır; sahne yalnız sınır işaretini sürükletir ve sayıyı resmi değer gibi yazmaz. `x ≤ ...` veya `x ≥ ...` ifadesi öğrenci yön seçmeden kurulmaz. Yön seçildikten sonra sayı `deneme sınırı` olarak görünür; sınır dahil olma durumu da dolu sınır noktası ve kısa "sınır dahil" etiketiyle gösterilir. Sağ panelde günlük problem cümlesi ayrı, sıcak renkle vurgulanan `Çözmen gereken soru` kartında öne çıkar; model ve kısa kural destek bilgisidir. Başarı metinleri, cebir adımı ve çözüm cümlesi yalnız `Alanı Test Et` sonrası açılır. Doğru testten sonra sahne kilitli kalır; öğrenci cebir adımını okuyup `Sonraki Görev` ile ilerler. Yanlış denemede AstroBot kısa yönlendirici geri bildirim verir.

## Route

- `/embed/algebra/inequality-safety-zone`

## Test ID Kontratı

- `inequality-safety-zone-scene`
- `inequality-safety-zone-boundary-handle`
- `inequality-safety-zone-direction-left`
- `inequality-safety-zone-direction-right`
- `inequality-safety-zone-check`
- `inequality-safety-zone-reset`

## QA Planı

- Başlangıçta doğru çözüm cümlesi veya hedef sınır gizli kalacak.
- Yanlış deneme AstroBot alarmı verecek.
- Sınır sürükleme ve yön seçimi sahnedeki renkli güvenli bölgeyi anında değiştirecek.
- Dört görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- inequality-safety-zone`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
