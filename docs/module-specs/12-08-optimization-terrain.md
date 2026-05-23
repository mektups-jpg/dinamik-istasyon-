# 12-08 Optimizasyon Arazisi

## Durum
Hazırlanıyor. Ana uygulamada `Review Needed / Görüş Gerekli` etiketiyle görünecek; Kaptan canlı göz onayı gelmeden Showcase Ready sayılmaz.

## Amaç
Türev uygulamalarını yalnız işaret tablosu veya formül ezberi olmaktan çıkarıp büyük bir "Optimizasyon Arazisi" deneyine çevirmek. Öğrenci arazi üzerindeki aracın tırmanış/iniş durumunu, sıfır eğim kapısını, maksimum hacim tepesini ve minimum maliyet vadisini tek sahnede görür.

## Atom Kapsamı
- MAT.12.2.6.1: Birinci türevin pozitif olduğu bölgelerde asıl fonksiyonun "Artan" olduğunu tespit eder.
- MAT.12.2.6.2: Birinci türevin negatif olduğu bölgelerde asıl fonksiyonun "Azalan" olduğunu tespit eder.
- MAT.12.2.6.3: Birinci türevi sıfıra eşitleyerek fonksiyonun tepelerini ve çukurlarını (Ekstremum noktalarını) bulur.
- MAT.12.2.6.4: Gerçek yaşamı modelleyen süreçlerde ulaşılabilecek maksimum hacim (kapasite) problemlerini türevle çözer.
- MAT.12.2.6.5: Gerçek yaşamı modelleyen süreçlerde inilebilecek minimum maliyet (kayıp) problemlerini türevle çözer.

## Kapsam Dışı
- Sekant-teğet türev temeli 12-06 modülünde kalır.
- Türev alma kuralları 12-07 modülünde kalır.
- İkinci türev, konkavlık ve detaylı grafik çizimi bu modülün ana kapsamına alınmaz.

## Ana Oyuncak
Ortada geniş bir neon arazi pisti bulunur. Araç pist üzerinde artan, azalan, tepe/çukur, maksimum hacim ve minimum maliyet durumlarına göre farklı noktalara gelir. Seçilen karar kartuşu sahnede fiziksel olarak görünür: artanda yeşil tırmanış okları, azalanda pembe iniş frenleri, ekstremumda sıfır eğim kapısı, maksimum hacimde açılan kapasite kutusu, minimum maliyette derinleşen maliyet vadisi.

## Görev Akışı
1. MAT.12.2.6.1: Türev pozitifse fonksiyon artıyor; öğrenci artan bölge kartuşunu kilitler.
2. MAT.12.2.6.2: Türev negatifse fonksiyon azalıyor; öğrenci azalan bölge kartuşunu kilitler.
3. MAT.12.2.6.3: Türev sıfıra yaklaşınca tepe/çukur kapısı ekstremumu yakalar.
4. MAT.12.2.6.4: Kısıtlı hacim probleminde kapasite tepesini maksimum hacim kararıyla kilitler.
5. MAT.12.2.6.5: Maliyet eğrisinin en düşük vadisini minimum maliyet kararıyla kilitler.

## Route
- /embed/calculus/optimization-terrain

## Test ID Kontratı
- `optimization-terrain-scene`
- `optimization-terrain-manipulator`
- `optimization-terrain-increasing`
- `optimization-terrain-decreasing`
- `optimization-terrain-extremum`
- `optimization-terrain-max-volume`
- `optimization-terrain-min-cost`
- `optimization-terrain-check`
- `optimization-terrain-feedback`
- `optimization-terrain-reset`

## QA Notu
- "Artan/azalan" yalnız metin olarak kalırsa hard faildir; pist yönü ve türev işareti sahnede beraber görünmelidir.
- Maksimum/minimum gerçek problem görevlerinde tepe/vadi yalnız soyut nokta değil, kapasite kutusu veya maliyet çukuru olarak görünmelidir.
- Seçim anı doğru/yanlış kararı vermez; yalnız önizleme ve ipucu gösterir. Karar `Araziyi Test Et` sonrası verilir.
- Telefon görünümü ana hedef değildir; karar desktop/kiosk görünümünden verilir.

## Kapanış Kanıtı
- Statü: `Review Needed / Görüş Gerekli`. Kaptan canlı görsel onayı gelmeden `Showcase Ready` sayılmaz.
- Internal görsel/öğrenci deneyimi puanı: `96/100`.
- Son cila: karar seçimi cevap sızdırmayacak şekilde sıkılaştırıldı. `f'(x)>0`, `f'(x)<0`, `V maksimum`, `C minimum` ve gizli kanıt metni yalnız `Araziyi Test Et` sonrası açılıyor; seçim anında sadece `yükseliş izi`, `iniş izi`, `düz kapı`, `kapasite izi`, `maliyet izi` gibi önizleme dili görünüyor.
- Computer Use QA: Chrome desktop üzerinde başlangıç, yanlış azalan karar önizlemesi, yanlış alarmı ve doğru ilk karar kilidi gözlendi; gri/boş alan veya aşağı kaydırma ihtiyacı görülmedi.
- Playwright QA: 1488x768 desktop akışında yanlış deneme, doğru artan/azalan/ekstremum/maksimum hacim/minimum maliyet zinciri, completion ve reset geçti.
- Playwright QA: `.agent/browser-use-shots/12-08-optimization-terrain-00-start.png`, `25-wrong.png`, `50-correct-first.png`, `65-extremum.png`, `75-max-volume.png`, `85-min-cost.png`, `100-complete.png`, `viewport-1488x768.png`.
- Console: `.agent/browser-use-shots/12-08-optimization-terrain-console.md`, `No console/page errors captured.`
- Gemini: `.agent/gemini-reports/12-08-optimization-terrain-final.txt`, Gemini 3.1 Pro `95/100 PASS`, `MUST_FIX` yok. İlk turda ortadaki yönerge metninin pistle çakışması yakalandı ve düzeltildi.
- Teknik kapılar: `npm run module:check -- optimization-terrain` 24 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build`, `git diff --check` geçti. Build yalnız mevcut Vite büyük chunk uyarısını verdi.
