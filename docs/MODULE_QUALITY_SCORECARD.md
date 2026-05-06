# Module Quality Scorecard

Bu dosya, modül bitişini sayısal kalite kapısına bağlar. Amaç, uzun koşularda "bitti" kararını hisse değil kanıta dayandırmaktır.

## Kapanış Kuralı

Bir modül `Done` olabilmek için üç şartı aynı anda geçmelidir:

1. **Hard gate temiz:** SSOT, build, `git diff --check`, Browser Use QA, completion, console ve doküman kapıları geçer.
2. **Internal score en az 90/100:** Aşağıdaki puan kartı doldurulur.
3. **Gemini must-fix yok:** Gemini 3 Flash `MUST_FIX` boş döner. Gemini skorunun 85 altında kalması durumunda modül `PASS_WITH_WARNINGS` bile olsa yeniden ele alınır.

## Puan Kartı

| Kategori | Puan | Kanıt |
| --- | ---: | --- |
| SSOT ve kapsam | 10 | Atomlar yalnız `docs/MEB_ATOMLARI.md`; kapsam şişirme yok |
| Kod/mimari kontrat | 15 | Modül parçalı, `any` yok, `HighSchoolLabShell`, test-id kontratı |
| Browser Use-only canlı QA | 15 | Sadece Browser Use IAB; recovery varsa kaydedilmiş |
| Görev akışı | 20 | Yanlış deneme, doğru zincir, görev geçişi, completion |
| Görsel/UX | 15 | İlk 3 saniye net, tek ana oyuncak, matematiksel görsel |
| Responsive/embed | 10 | Orta/mobil smoke, yatay taşma/kırpılma yok |
| Console/build/diff | 10 | `npm run build`, `git diff --check`, console warning/error temiz |
| Gemini kapanışı | 5 | Must-fix yok, kapsam büyüten öneriler future'a ayrılmış |

## Score Log Formatı

Her kapanan modül için şu format kullanılır:

```text
| Modül | Internal | Gemini | Verdict | Kanıt | Not |
```

## 11. Sınıf Kalite Defteri

| Modül | Internal | Gemini | Verdict | Kanıt | Not |
| --- | ---: | ---: | --- | --- | --- |
| 11-14 Korelasyon Serpilme Radarı | 96 | 88 | Done | `module:check` 19/19, build, diff, Browser Use wrong/right/completion/console, Gemini 2 tur | İlk Gemini must-fixleri okunabilirlikti; düzeltildi, ikinci turda must-fix yok. |
| 11-15 Medya Korelasyon Denetçisi | 95 | 92 | Done | `module:check` 19/19, build, diff, Browser Use wrong/right/completion/console, Gemini 3 tur | İlk sert Gemini turunda küçük metin, sürgü etiketi ve eksen must-fixleri çıktı; kontrast, Tarama/Mühür etiketleri ve eksenler düzeltildi, son turda must-fix yok. |
| 11-03 Trigonometrik Kök Avcısı | 94 | 92 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right/completion/console/responsive, Gemini kapanış | Dar/embed eksen kopması ve sağ kırpılma Browser Use ile yakalandı; eksenler SVG içine alındı, sahne güvenli viewport payıyla sınırlandı. Gemini must-fix yok, öneriler v2 etiketi/snap konforu. |
| 11-06 Richter-Desibel Ölçek Simülatörü | 95 | 94 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right/completion/console, Gemini 2 tur | İlk Gemini turu büyüme modunda yanlış "sıkışmış ölçek" dili, küçük formül metni ve desibel oran vurgusu için must-fix verdi; başlıklar mod bazlı düzeltildi, metinler büyütüldü, log formülleri ham oranı açık yazacak hale getirildi. |
| 11-07 Fonksiyon Bileşke Portları | 96 | 96 | Done | `module:check` 20/20, build, diff, Browser Use wrong/right/completion/console, Gemini 3 tur | Browser Use ve Gemini ile sahne etiketi, zincir bandı kontrastı ve AstroBot toast çakışması yakalandı; sağ kontrol paneli kapanmadan geri bildirim görünecek şekilde düzeltildi. Must-fix yok. |
| 11-08 Fonksiyon İşlem Mikseri | 96 | 96 | Done | `module:check` 23/23, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Browser Use/Gemini turunda `Home` fallback'in SVG kadranı ilerletmediği ve `f/g` etiketlerinin kapsüllere yakın olduğu yakalandı; `focusable` kadran hedefleri ve etiket hizası düzeltildi. Final Gemini 96/100 PASS, must-fix yok. |
| 11-10 Özel Dörtgen Tanı Masası | 96 | 98 | Done | `module:check` 21/21, build, diff, Browser Use square-wrong/right(Home)/completion/console, Gemini 2 tur | Gemini ilk turda "4 kenar eşit" ifadesinin kareyi de kapsadığı must-fix'ini verdi; görev, hedef, kural ve kare hata mesajı `dik açı yok` ayrımıyla düzeltildi. Final Gemini 98/100 PASS, must-fix yok. |
| 11-11 Konkav-Konveks Lazer Dedektörü | 96 | 96 | Done | `module:check` 19/19, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 3 tur | Kaynak Gemini turunda lazer sıçraması must-fix'i düzeltildi. Browser Use finalinde konkav alarm panelinin `90°` göstermesi yakalandı; aktif açı `266°` alarm açısına bağlandı. Final Gemini 96/100 PASS, must-fix yok. |
| 11-12 Çokgen Köşegen ve Simetri Atölyesi | 96 | 98 | Done | `module:check` 21/21, build, diff, Browser Use wrong/right(Home)/completion/console/responsive, Gemini 2 tur | İlk Gemini turunda alt ray sıkışması, yüzde etiketi çakışması ve hedef dilinin karışması must-fix çıktı; raylar ferahlatıldı, değerler ray sağına taşındı ve `HEDEF: 9 köşegen` dili eklendi. Final Gemini 98/100 PASS, must-fix yok. |
| 11-13 Mozaik Kaplama Atölyesi | 96 | 98 | Done | `module:check` 20/20, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Gemini turunda kadran hitbox'ı, merkez etiket çakışması ve mühürlerin kontrol dili must-fix çıktı; ray dokunma alanı büyütüldü, pasif etiketler gizlendi, mühürler ayrıştırıldı ve completion auto-scroll eklendi. Final Gemini 98/100 PASS, must-fix yok. |

> Eski kapanmış 11. sınıf modülleri bu dosya oluşturulmadan tamamlandı. Gerektiğinde geriye dönük audit ile puanlanır; yeni uzun koşuda her modül kapanırken bu defter güncellenir.

## 10. Sınıf Kalite Defteri

| Modül | Internal | Gemini | Verdict | Kanıt | Not |
| --- | ---: | ---: | --- | --- | --- |
| 10-04 Ters Fonksiyon Aynası | 96 | 100 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Gemini turunda rasyonel görevde kapsül/makine sıkışması ve `y=x aynası` etiketi çakışma riski must-fix çıktı; kapsüller dış portlara açıldı, ayna etiketi rozet yapıldı. Final Gemini 100/100 PASS, must-fix yok. |
| 10-05 İşaret Tablosu Tarayıcısı | 96 | 96 | Done | `module:check` 21/21, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Gemini turunda kök çakışma belirsizliği ve eşitsizlik sürecinin kök görevinde yeterince görünmemesi must-fix çıktı; ayrı kök rayları, `çakışmaz boşluk`, akış etiketi ve güçlü hedef lazerleriyle düzeltildi. Final Gemini 96/100 PASS. |
| 10-07 Sabit Alan Üçgen Rayı | 96 | 96 | Done | `module:check` 19/19, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Gemini turunda sağ hedefte sol yön başarı mesajı must-fix çıktı; başarı dili yön yerine ray hareketi ve sabit alan büyüklüğüne çekildi, etiket/formül dili güçlendirildi. Final Gemini 96/100 PASS, must-fix yok. |
| 10-08 Sinüs-Kosinüs Arazi Ölçeri | 96 | 96 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right(Home)/completion/console screenshot kanıtları, Gemini kapanış | Kosinüs teoremi eksik kenar, sinüs teoremi bilinmeyen açı olarak ayrı görevlerde sade kaldı. Final Gemini 96/100 PASS, must-fix yok; toast/buton yakınlığı should-fix olarak nonblocking not edildi. |
| 10-09 Birim Çember Kalkanı | 94 | 92 | Done | `module:check` 19/19, build, diff, Browser Use wrong/right(Home)/completion/console screenshot kanıtları, Gemini kapanış | `cos²` ve `sin²` enerji plakaları tek birim çember kalkanına bağlı kaldı. Gemini 3 Flash 92/100 PASS verdi, must-fix yok; toast/buton yakınlığı should-fix olarak nonblocking kaldı ve güncel AstroBot yerleşimiyle IAB smoke tekrarlandı. |
| 10-11 Asal Kilit Kasası | 96 | 92 | Done | `module:check` 28/28, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini 2 tur | İlk Gemini turunda cevap veren hata ipucu ve AstroBot toast yerleşimi must-fix çıktı; ipuçları yönlendirici dile çekildi, sonuç/metrik kartları kilitlenmeden gizlendi, toast üst konuma alındı ve final Gemini 92/100 PASS verdi. |
| 10-12 EBOB/EKOK Dişli Kutusu | 96 | 96 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Browser Use final turunda rapor mührü ve Home hizalama zinciri doğrulandı. Gemini should-fix olarak EBOB/EKOK etiket netliği verdi; mühür `EBOB 6 / EKOK 36` ayrımına çekildi, final must-fix yok. |
| 10-13 Kalan Kapısı | 96 | 95 | Done | `module:check` 21/21, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Rakam toplamı, son basamak ve son iki basamak lensleri ayrı modüler kapılar olarak kaldı. Final Gemini 95/100 PASS, must-fix yok. |
| 10-14 Sayma Montaj Hattı | 96 | 96 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Toplama/çarpma yoluyla sayma ayrımı tek montaj hattında iki görev ve mühürle kapandı. Final Gemini 96/100 PASS, must-fix yok. |
| 10-15 Cebir Algoritma Makinesi | 96 | 98 | Done | `module:check` 21/21, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | İşlem boru hattı ve çıktı tokenı aynı hedefte doğrulandı; Gemini önerisiyle sözde kod Türkçeleştirildi. Final Gemini 98/100 PASS, must-fix yok. |
| 10-16 Çapraz Tablo Dedektifi | 96 | 96 | Done | `module:check` 22/22, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Çapraz tablo hücresi, sapma sinyali ve medya yanlılığı ayrı hedeflerde okundu. Final Gemini 96/100 PASS, must-fix yok. |
| 10-17 Koşullu Olasılık Filtresi | 96 | 98 | Done | `module:check` 20/20, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Koşul sonrası örnek uzay daralması ve `1/3` kesri tek filtre sahnesinde kapandı; `4'ten` dili düzeltildi. Final Gemini 98/100 PASS, must-fix yok. |
| 10-18 Bağımlı Çekiliş Makinesi | 96 | 94 | Done | `module:check` 20/20, build, diff, Browser Use wrong/right(Home)/completion/console, Gemini kapanış | Geri koymadan çekilişte örnek uzayın değişmesi fiziksel torba/sayaçla gösterildi. Final Gemini 94/100 PASS, must-fix yok. |
