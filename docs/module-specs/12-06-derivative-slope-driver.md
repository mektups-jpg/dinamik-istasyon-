# 12-06 Türev Eğim Sürücüsü

## Durum
Showcase Ready. Kaptan canlı göz onayıyla vitrine alındı; kesen-teğet omurgası kilitli kabul edilir.

## Amaç
Türevi formül ezberinden çıkarıp büyük bir "Teğet Sürüş Pisti" deneyine çevirmek. Öğrenci iki araç arasındaki kesen doğruyu ortalama değişim oranı olarak okur; araçlar birbirine yaklaştıkça kesen doğrunun teğet kızağına dönüştüğünü görür.

## Atom Kapsamı
- MAT.12.2.4.1: Bir fonksiyonun belirli bir aralıktaki ortalama değişim oranını saptar.
- MAT.12.2.4.2: Bir noktadaki anlık değişim oranının teğetin eğimi (Türev) olduğunu vizüalize eder.

## Kapsam Dışı
- MAT.12.2.4.3 ve MAT.12.2.4.4 artık ayrı Türev Yok Alarm İstasyonu modülündedir.
- Türev alma kuralları 12-07 Derivative Rule Forge modülüne bırakılır.
- Maksimum/minimum ve optimizasyon 12-08 Optimization Terrain modülüne bırakılır.
- Limit hesaplama ve süreklilik teşhisi 12-04 / 12-05 modüllerinde kalır.

## Ana Oyuncak
Ortada geniş bir neon sürüş pisti bulunur. A aracı sabit noktayı, B aracı yaklaşan noktayı temsil eder. Kesen doğru A-B arasında gerilir; B aracı A'ya yaklaştıkça doğru teğet kızağına dönüşür.

2026-05-16 rehabilitasyon notu: Sahne artık yalnız panelde parça seçimiyle çalışmaz. Öğrenci ana pistin üstündeki `eğim probu`nu sürükleyerek B aracının konumunu ve kesen doğrunun teğete yaklaşmasını canlı değiştirir. Panel butonları fallback/kısa yol olarak kalır; asıl oynama hissi sahnedeki probdadır.

2026-05-16 ikinci cila notu: Eğim probunda SVG tutacağı ile native range tutacağı üst üste görünerek iki ayrı sürükleme hedefi hissi veriyordu. SVG tutacağı kaldırıldı; tek erişilebilir native `eğim probu` kaldı. Sahne içi uzun feedback kartı da AstroBot balonuyla çakıştığı için kaldırıldı; geri bildirim artık renk/alarm hareketi, üst durum çipi, sağ panel ve global AstroBot hattında veriliyor.

## Görev Akışı
1. MAT.12.2.4.1: İki araç arası sekant kirişi ile ortalama değişim oranı okunur.
2. MAT.12.2.4.2: B aracı A'ya yaklaşır; sekant kirişinin teğet kızağına dönüştüğü görülür.
3. MAT.12.2.4.2: Son düzgün pistte anlık eğim kilitlenir ve türev kanıtı tamamlanır.

## Route
- /embed/calculus/derivative-slope-driver

## Test ID Kontratı
- `derivative-slope-driver-scene`
- `derivative-slope-driver-manipulator`
- `derivative-slope-driver-secant`
- `derivative-slope-driver-tangent`
- `derivative-slope-driver-check`
- `derivative-slope-driver-feedback`
- `derivative-slope-driver-reset`

## QA Notu
- Teğet ve sekant küçük formül kartı olarak kalırsa hard fail; kiriş ve kızağın sahnede fiziksel olarak görülmesi gerekir.
- Sivri uç ve kopuk grafik bu modülün içine tekrar eklenmemeli; ayrı alarm istasyonu kullanılmalıdır.
- Gri boşluk, aşağı kaydırma zorunluluğu, dev formül ve panel/reçete hissi hard faildir.
- Eğim probu desktop/kiosk görünümünde gerçek sürüklenebilir olmalı; Computer Use erişilebilirlik ağacında kaydırma çubuğu olarak görünmesi ve sahnedeki B/sekant/teğet tepkisini değiştirmesi beklenir.
- Telefon görünümü ana hedef değildir; karar desktop/kiosk görünümünden verilir.

## Kapanış Kanıtı
- Statü: `Showcase Ready / Vitrin Hazır`. Kaptan canlı göz onayıyla kilitlendi.
- Internal görsel/öğrenci deneyimi puanı: `98/100`.
- Gemini 3.1 Pro rehab final: `.agent/gemini-reports/12-06-derivative-slope-driver-rehab.txt`, `100/100 PASS`, `MUST_FIX` ve `SHOULD_FIX` boş.
- Computer Use QA: Eski tam kapsam turunda reset, yanlış teğet seçimi, doğru sekant, teğet ve completion zinciri canlı denendi. 2026-05-22 sonrası sivri uç/kopuk pist bu modülün kapanış kapsamından çıkarıldı.
- Playwright QA: Eski kanıt setinde `.agent/browser-use-shots/12-06-final-pass-00-start.png`, `25-wrong.png`, `35-secant-success.png`, `50-tangent-start.png`, `55-tangent-success.png`, `95-final-success.png`, `100-complete.png` bulunur. Ayrım sonrası yeni görsel onay Kaptan review turunda güncellenecek.
- Console: Rehab Playwright turunda `0 warning / 0 error`; desktop overflow `1488x768` içinde temiz.
- Teknik kapılar: `npm run module:check -- derivative-slope-driver` 22 pass / 2 expected warn / 0 fail; `npx tsc --noEmit` geçti; `npm run build` geçti; `git diff --check` geçti.
- QA notu: İlk Gemini turu `85/100 PASS` olsa da 1488x768 sağ panel taşması için `MUST_FIX` verdiği için modül kapatılmadı. Sağ panelde atom rezervi laptop genişliğinde gizlendi, görev ve aktif kanıt tek blokta birleştirildi, SVG görsel test-id tekrarları ayrıştırıldı ve ikinci Gemini turu `100/100 PASS` oldu.
- Rehabilitasyon notu: Kaptan geri bildirimi sonrası `eğim probu` native range + sahne üstü neon sürgü olarak eklendi. Computer Use canlı kontrolde prob erişilebilir `kaydırma çubuğu` olarak görüldü, seçim global AstroBot mesajını kalıcı gösterdi ve balon botun sağ tarafında kaldı. İlk rehab Gemini turu AstroBot senkronu/kontrastı ve tekrar eden panel feedback'i için fail verdi; mesaj state'i monotonic hale getirildi, görev geçişinde eski balon temizlendi, completion kontrastı yükseltildi ve sağ alt uzun feedback kısa durum çipine çekildi. Final rehab turu `100/100 PASS`. 2026-05-22 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu.
- 2026-05-22 ayrım notu: Kaptan canlı gözleminde sivri uç alarmının kesen/teğet sahnesini kalabalıklaştırdığı görüldü. MAT.12.2.4.3 ve MAT.12.2.4.4 ayrı Türev Yok Alarm İstasyonu modülüne taşındı. Bu modül artık sadece ortalama değişim ve anlık teğet omurgasını taşır.
