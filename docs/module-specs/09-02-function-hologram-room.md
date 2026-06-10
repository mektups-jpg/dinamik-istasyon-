# 09-02 Fonksiyon Grafiği Dönüşüm Atölyesi

## Durum

- Route: `/embed/algebra/function-hologram-room`
- Module id: `function-hologram-room`
- Etiket: `Showcase Ready`
- 2026-06-03 Kaptan canlı görsel onayıyla `Vitrin Hazır`.

## MEB Atomları

- `MAT.9.2.1.1`: `f(x)=x` referans fonksiyonunu grafik üzerinde çizer.
- `MAT.9.2.1.2`: Y ekseni kaydırmasını (`± k`) grafikte uygulayarak fonksiyonu dikey taşır.
- `MAT.9.2.1.3`: X ekseni kaydırmasını (`± r`) grafikte uygulayarak fonksiyonu yatay taşır.
- `MAT.9.2.1.4`: Çarpan katsayısı (`a`) ile fonksiyonun eğimini grafikte esnetir.

## Oyuncak

Tek ana oyuncak bir doğrusal fonksiyon sahnesidir. Öğrenci mavi noktayı taşıyarak grafiği sağa-sola ve yukarı-aşağı kaydırır; yeşil eğim noktasını çekerek `a` katsayısının doğruyu nasıl yatıklaştırıp dikleştirdiğini görür. Sarı kesik hedef doğru, öğrencinin kendi doğrusunu nereye yerleştireceğini gösterir.

## Görev Akışı

1. `f(x)=x` referans doğrusunu kur.
2. Dikey kaydırmada aynı eğimli doğruyu 2 birim yukarı taşı.
3. Yatay kaydırmada mavi noktayı sağa al ve hedef doğruyla üst üste getir.
4. Eğim katsayısını artırarak doğruyu hedef dikliğe getir.

Yanlış denemede AstroBot neden hedefle üst üste gelmediğini söyler. Mavi nokta veya yeşil eğim noktası hareket ettikçe sahne ve AstroBot kısa geri bildirim verir. Hedef denklemi görev bağlamı olarak görünür; başarı yalnız `Kontrol Et / Sonraki Göreve Geç` sonrası ilerler.

## Kapsam Dışı

- Mutlak değer grafiği `09-10 Mutlak Değer Ayna Odası` içinde kalır.
- Doğrusal eşitsizlikler `09-11 Eşitsizlik Güvenlik Alanı` içinde kalır.
- Günlük yaşam doğrusal denklem problemleri bu modülde kalite hattına alınmadı; ayrı eski denklem modülü ileride değerlendirilecek.

## Test ID Kontratı

- `function-hologram-room-scene`
- `function-anchor-handle`
- `function-tilt-handle`
- `function-check`
- `function-reset`

## QA Planı

- Başlangıçta joker atom etiketi (`MAT.9.2.1.x`) görünmeyecek.
- Yanlış deneme AstroBot alarmı verecek.
- Mavi nokta ve yeşil eğim noktası gerçek sahnede oynanacak; Home fallback ile hedef hizası doğrulanacak.
- Dört görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve konsol warning/error olmayacak.
- `npm run module:check -- function-hologram-room`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
