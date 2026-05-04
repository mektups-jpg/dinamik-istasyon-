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

> Eski kapanmış 11. sınıf modülleri bu dosya oluşturulmadan tamamlandı. Gerektiğinde geriye dönük audit ile puanlanır; yeni uzun koşuda her modül kapanırken bu defter güncellenir.
