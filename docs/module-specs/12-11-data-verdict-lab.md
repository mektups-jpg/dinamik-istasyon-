# 12-11 Büyük Veri Yargı Laboratuvarı

## Kapsam

- Module id: `data-verdict-lab`
- Route: `/embed/statistics/data-verdict-lab`
- Grade: 12
- Status: `Review Needed / Görüş Gerekli`
- Atom kapsamı:
  - `MAT.12.5.1.1`: Toplumsal istatistik kurumları tarafından yayınlanmış 3. parti hazır veri setlerini işleyerek doğrudan sonuç cümlesi çıkarır.

## Ana Oyuncak

Tek ana deney "veri yargı hattı"dır. Öğrenci kaynak kilidini, istatistik filtresini ve sonuç cümlesi mührünü seçer; soldan gelen hazır veri kapsülleri ortadaki filtre kapısından geçip grafik çekirdeğinde görselleşir ve sağdaki yargı mührüne dönüşür.

Bu modül panel/reçete gibi durmamalı. Sahnenin başrolü büyük veri akışı, filtre kapısı, bar/çeyrek/trend grafiği ve yargı mührüdür. Sağ panel yalnız kontrol alanıdır.

## Görev Zinciri

1. Kurum oranını temizle: TUIK benzeri hazır veri kaynağı, aynı birim/oran filtresi, güvenli sonuç cümlesi.
2. Uç değeri sakinleştir: OECD benzeri hazır gelir seti, medyan ışını, uç değer abartısına karşı güvenli merkez yorumu.
3. İstikrar bandını ölç: WHO benzeri hizmet süresi seti, çeyrekler açıklığı, yayılım/istikrar sonucu.
4. Yıl serisini oku: Eurostat benzeri yıllık oran serisi, trend tarayıcı, artış yönü sonucu.

## Test ID Kontratı

- `data-verdict-lab-scene`
- `data-verdict-lab-manipulator`
- `data-verdict-lab-source`
- `data-verdict-lab-filter`
- `data-verdict-lab-chart`
- `data-verdict-lab-verdict`
- `data-verdict-lab-check`
- `data-verdict-lab-feedback`
- `data-verdict-lab-reset`

## Kalite Kapısı

- İlk açılışta doğru kaynak/filtre/sonuç seçili gelmez.
- Öğrenci her anlamlı seçimde sahnede fiziksel tepki görür: kaynak portu, filtre kapısı, grafik çekirdeği ve yargı mührü değişir.
- Yanlış deneme yalnız "yanlış" demez; kaynak, filtre veya yargı cümlesi neden hatalı onu açıklar.
- Sonuç cümlesi sebep-sonuç iddiasına kaçmaz; veri neyi gösteriyorsa onu güvenli dille söyler.
- Completion ekranı `Review Needed` bilgisini korur; Kaptan onayı olmadan `Showcase Ready` yapılmaz.

## Kapanış Planı

- `npm run module:check -- data-verdict-lab`
- `npx tsc --noEmit`
- `npm run build`
- Computer Use desktop QA: açılış, yanlış kaynak/filtre/yargı, doğru görev zinciri, reset, completion.
- Playwright screenshot paketi: start, wrong, mid, edge, complete ve 1488x768 desktop/dar dizüstü görünümleri.
- Gemini 3.1 Pro veya mevcut en yüksek görsel kalite eleştirmeni: internal görsel rubrik + screenshot paketi ile `90+`, `MUST_FIX` boş.
- `git diff --check`

## Final Kapanış Kanıtı

- Durum: `Review Needed / Görüş Gerekli`; Kaptan canlı onayı olmadan `Showcase Ready` değil.
- Son cila: panel rozeti cevap değerini önceden göstermiyor; `Kilit 1/2/3/4` olarak kalıyor. Kaynak/yargı seçimleri artık testten önce "bu yanlış" hükmü vermiyor; `ONAY/RED`, `%64`, `+12` ve güvenli sonuç cümlesi yalnız `Yargıyı Test Et` sonrası açılıyor.
- Computer Use desktop QA: başlangıç, sosyal kaynak önizlemesi, aynı birim önizlemesi, sebep-sonuç taslağı ve `Yargıyı Test Et` sonrası kırmızı kaynak alarmı gözlendi. Gri/boş alan veya aşağı kaydırma ihtiyacı görülmedi.
- Playwright QA: 1488x768 zincirinde başlangıç, yanlış önizleme, yanlış alarm, doğru ilk görev, medyan/IQR/trend zinciri, completion ve erken `%64`/final cümle sızıntısı kontrolü geçti.
- Console/page error: `.agent/browser-use-shots/12-11-data-verdict-lab-console.md` temiz; uygulama console/page error yok.
- Gemini final: `.agent/gemini-reports/12-11-data-verdict-lab-final.txt`, `95/100 PASS`, `MUST_FIX` boş.
- Teknik kapılar: `npm run module:check -- data-verdict-lab` 20 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.

## Öğrenilen Üretim Notu

İlk iki Gemini turu grafik bar değerlerinin barlardan kopuk görünmesini `MUST_FIX` olarak yakaladı. Kök neden SVG bar geometrisini `motion.rect` ile animasyonlamak ve screenshot anında değer etiketleriyle bar gövdelerinin farklı koordinat hissi vermesiydi. Veri-grafik modüllerinde QA kritik bar/çizgi geometri final state'te sabit tutulacak; animasyon gerekiyorsa etiket ve geometri aynı koordinat sisteminde birlikte hareket edecek.
