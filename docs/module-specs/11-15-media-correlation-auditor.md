# 11-15 Medya Korelasyon Denetçisi

## Amaç
11. sınıf öğrencisine dışarıdan verilmiş iki nicel değişkenli istatistiksel sonucun tutarlılığını eleştirmeyi öğretmek. Bu modül 11-14'teki serpilme grafiği kurma deneyinin devamı değildir; burada ana oyuncak bir **iddia denetim masasıdır**. Öğrenci hazır bir medya/anket iddiasını, veri izini ve sonuç cümlesini aynı ekranda test eder.

## Atom Kapsamı
- `MAT.11.3.2.1`: Dışarıdan verilmiş iki nicel değişkenli istatistiksel sonuçların tutarlılığını eleştirir.

## Kapsam Dışı
- Serpilme grafiğini sıfırdan noktalama, pozitif/negatif ilişkiyi ilk kez tanıma ve eğilim ışını kurma `11-14 Korelasyon Serpilme Radarı` içinde tamamlandı.
- Korelasyon katsayısı hesaplama, regresyon doğrusu kurma, gerçek internetten veri çekme ve politik/kişisel medya analizi bu ilk modüle alınmaz.
- Öğrenciden hassas kişisel veri veya dış siteye veri gönderimi istenmez.

## Ana Oyuncak
Tek sahne bir medya iddiası denetim masasıdır:
- Sol tarafta kısa bir medya iddiası kartı bulunur: örnek "Ekran süresi arttıkça deneme başarısı kesin düşer."
- Ortada küçük ama okunabilir hazır nokta bulutu ve kaynak izi görünür.
- Öğrenci üç denetim merceğini sırayla çalıştırır:
  1. **Veri izi:** Noktalar iddiayla aynı yönü mü gösteriyor?
  2. **Dil alarmı:** "Kesin", "sebep oldu", "kanıtlandı" gibi nedensellik iddiaları korelasyon verisinden fazla mı?
  3. **Tutarlılık mührü:** Sonuç cümlesi verinin desteklediği kadar yumuşatıldı mı?
- Amaç, "korelasyon var/yok"tan öte "bu sonuç cümlesi veriye göre fazla iddialı mı?" sorusunu öğrenciye sahnede çözdürmek.

## Görev Akışı
1. `İz Uyumunu Tara`: Verilen iddia negatif ilişki diyorsa, hazır nokta bulutunda eğilim gerçekten negatif mi kontrol et.
2. `Nedensellik Alarmı`: İddia kartındaki aşırı kelimeyi işaretle. Öğrenci "kesin düşürür" gibi sebep-sonuç dilini korelasyon kanıtından ayırır.
3. `Güvenli Sonuç Mührü`: Sonuç cümlesini "Bu veri setinde ekran süresi arttıkça başarı genelde azalıyor; bu tek başına neden-sonuç kanıtı değildir." çizgisine yumuşat.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: medya iddiası kartı + denetim merceği + küçük nokta bulutu.
- Öğrenci uzun metin okumaz; iddia cümlesi kısa, alarm kelimesi görsel olarak seçilebilir olur.
- Kritik öğrenme noktası ekranda net kalır: veri ilişki gösterebilir, ama nedenselliği tek başına kanıtlamaz.
- Kontrol paneli en fazla aktif mercek, canlı karar ve onay/reset içerir.
- Mobil/embed görünümde iddia kartı, nokta bulutu ve karar paneli üst üste binmez; uzun cümleler taşmaz.
- Klavye/Home QA fallback: aktif görevde doğru mercek/kelime/sonuç mühür konumuna hizalar.

## Route
- `/embed/statistics/media-correlation-auditor`

## Test ID Kontratı
- `media-correlation-scene`
- `claim-card`
- `evidence-scatter`
- `audit-lens-handle`
- `causation-word-*`
- `safe-conclusion-slider`
- `media-correlation-check`
- `media-correlation-reset`

## QA Planı
- `npm run module:check -- media-correlation-auditor`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/statistics/media-correlation-auditor?qa=1` açılır.
  - İlk sahne, iddia kartı, veri izi ve aktif denetim merceği görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback veya gerçek etkileşimle üç görev tamamlanır.
  - Completion ekranı görünür.
  - Console warning/error kontrolü yapılır.
  - Orta viewport ve mobil/embed smoke yapılır.
- Gemini 3 Flash:
  - Başlangıç, yanlış deneme, son görev ve completion ekranları öğrenci/medya okuryazarlığı açısından değerlendirilir.
  - Must-fix yok, Gemini skor >=85 ve internal skor >=90 olmadan Done yapılmaz.
