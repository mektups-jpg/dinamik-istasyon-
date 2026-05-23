# 12-03 İşaret Yörünge Radarı

## Durum
Showcase Ready. Bu modül 2026-05-17 tarihinde Kaptan canlı görsel onayı aldı: "işaret yörünge radarı <vitrin hazır < şeklinde işaretlenebilir." 12. sınıf vitrin paketine alınabilir.

## Kapanış Kanıtı
- Computer Use desktop QA: açılış, yanlış pozitif bölge denemesi, doğru kök/yasak/pozitif/çözüm zinciri, reset ve completion geçti.
- 2026-05-16 son cila: tarayıcı seçimi ile yörünge kararı ayrıldı. Seçim artık yalnız ışık/istasyon önizlemesi veriyor; doğru kilit, hedef değer ve pembe alarm yalnız `Yörüngeyi Kilitle` sonrası açılıyor. Computer Use ile yanlış yasak denemesi, doğru kök/yasak/pozitif/çözüm zinciri, completion ve tekrar oynama reset akışı yeniden geçti.
- 2026-05-17 okunurluk cilası: çözüm yörüngesindeki `(-∞, -1)`, `(-1, 3]`, `(3, ∞)` aralık etiketleri küçük teknik yazıdan çıkarılıp 16px okunur rozetlere büyütüldü.
- 2026-05-17 kesir gösterimi cilası: rasyonel görevlerde işaret komutu artık slash ile değil, pay/payda ayrımı olan yatay kesir çizgisiyle gösteriliyor. Sağ panel/robot açıklaması da slash yerine pay-payda dili kullanır.
- 2026-05-17 denklem/eşitsizlik dil ayrımı: Denklem görevlerinde kök noktalarının altında `kök kapalı` yerine `kök istasyonu` yazıyor; açık/kapalı uç dili yalnız eşitsizlik çözüm aralıklarında kullanılıyor.
- 2026-05-17 eşitsizlik komutu cilası: `(x + 2)(x - 1) > 0` gibi eşitsizlikler artık komut kartında tek satır okunuyor; `> 0` alta düşüp ayrı işlem hissi vermiyor. Denklem kimlikleri (`P(x)=0`, `R(x)=0`) küçük alt not olarak korunuyor.
- 2026-05-17 işaret tablosu renk cilası: Aralık kutuları artık yalnız `+/-` sembolüyle değil, pozitif için yeşil, negatif için amber ton ve `Pozitif/Negatif` etiketiyle okunuyor. Renk anlamı destekler; sembol ve etiket asıl kanıt olarak kalır.
- 2026-05-17 işaret tablosu hizalama cilası: Her aralık kutusunda aralık rozeti üstte, `+ Pozitif` / `- Negatif` rozeti altta ve ikisi de kendi çerçevesinde ortalı hizalanır.
- 2026-05-17 Kaptan canlı görsel onayı: Son cila ve ağda canlı kontrol sonrası modül `Showcase Ready / Vitrin Hazır` olarak işaretlendi.
- Playwright kanıtları: 00 start, 25 wrong, 50 mid, 75 edge ve 100 complete görüntüleri `.agent/browser-use-shots/` altında.
- Console: `.agent/browser-use-shots/12-03-inequality-orbit-console.md` içinde 0 error / 0 warning.
- Gemini 3.1 Pro final: `.agent/gemini-reports/12-03-inequality-orbit-final.txt`, 100/100 PASS, `MUST_FIX` ve `SHOULD_FIX` boş.
- Teknik: `npm run module:check -- inequality-orbit` 23 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.

## Amaç
12. sınıf ileri denklem ve eşitsizlik atomlarını tek ana oyuncakla okutmak: öğrenci kök, yasak nokta, pozitif/negatif aralık ve çözüm kümesini küçük işaret tablosu yazısı gibi değil, yörünge üstündeki kritik istasyonlar ve ışık koridorları olarak görür.

## Atom Kapsamı
- MAT.12.1.3.1: Polinomlarla kurgulanmış denklem problemlerini çözer.
- MAT.12.1.3.2: Rasyonel fonksiyonlarla kurgulanmış denklem problemlerini çözer.
- MAT.12.1.3.3: Polinom yapıdaki eşitsizliklerin işaret tablosunu oluşturarak çözüm aralığını bulur.
- MAT.12.1.3.4: Rasyonel yapıdaki eşitsizliklerin işaret tablosunu oluşturarak çözüm aralığını bulur.

## Kapsam Dışı
- Limit, süreklilik ve türev atomları bu modüle alınmaz.
- Polinom anatomisi 12-02'de tamamlandığı için burada yalnız denklem/eşitsizlik kullanımı vardır.
- Çok adımlı gerçek yaşam problem metinleri future v2'ye ayrılır; bu tur ana işaret/rasyonel mantığı kurar.

## Ana Oyuncak
Ortada geniş bir "İşaret Yörünge Radarı" bulunur. Sayı doğrusu, uzay rotası gibi tek hat üzerinde akar; kökler mavi istasyon, payda yasakları pembe kilit, pozitif/negatif aralıklar ışık koridoru olarak görünür. Öğrenci sağ panelden Kökler, Yasak, Pozitif Bölge, Negatif Bölge veya Çözüm tarayıcısını seçer. Seçim sahnede gerçek bir tarama merceğiyle ilgili istasyon/koridoru yalnız önizleme olarak aydınlatır; pembe alarm, doğru kilit ve kısa neden `Yörüngeyi Kilitle` testinden sonra görünür.

## Görev Akışı
1. MAT.12.1.3.1: `P(x) = (x + 1)(x - 3)` için `x=-1` ve `x=3` kökleri kilitlenir.
2. MAT.12.1.3.2: `R(x) = (x - 2)/(x + 1)` için payda yasağı `x=-1` kökten ayrılır.
3. MAT.12.1.3.3: `(x + 2)(x - 1) > 0` için dış pozitif bölgeler seçilir.
4. MAT.12.1.3.4: `(x - 3)/(x + 1) <= 0` için `(-1, 3]` çözüm koridoru, açık yasak ve kapalı kökle okunur.

## Route
- /embed/algebra/inequality-orbit

## Test ID Kontratı
- `inequality-orbit-scene`
- `inequality-orbit-manipulator`
- `inequality-orbit-roots`
- `inequality-orbit-forbidden`
- `inequality-orbit-positive`
- `inequality-orbit-negative`
- `inequality-orbit-solution`
- `inequality-orbit-check`
- `inequality-orbit-feedback`
- `inequality-orbit-reset`

## QA Notu
- Ana yörünge desktop/kiosk görünümünde sahnenin baskın oyuncak alanı olmalı.
- Kök/yasak/çözüm ayrımı yalnız metinde kalırsa hard fail.
- Yanlış deneme işaret tablosunda neden yanlış olduğunu sahnede pembe alarm ile göstermeli.
- Rasyonel görevde yasak nokta açık uç, kök eşitlikten dolayı kapalı uç olarak görünmeli.
- Telefon görünümü bu modül için ana hedef değildir; karar desktop/dizüstü QA ile verilir.
