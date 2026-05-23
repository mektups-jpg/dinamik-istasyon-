# Current Task

## What We're Building

12. sınıf kalite rehabilitasyonu başladı. İlk tur global kalite kapısı: AstroBot okunur/persistent olacak, 12. sınıf modüller yalnız panel seçimiyle kapanmayacak, konuya göre esnek ama sahnede canlı etkileşim standardı uygulanacak.

## Status

Global AstroBot otomatik kapanmayan, botun sağ tarafına açılan ve daha dikkat çekici bir konuşma balonuna taşındı. Mesaj id'si monotonic hale getirildi; görev değişiminde eski mesaj temizleniyor. 12. sınıf sağ panelindeki AstroBot kopyası daha sakin "son not" formatına, uzun sağ-alt feedback tekrarları da kısa durum çipine çekildi.

İlk rework adayı `12-06 derivative-slope-driver`: sahne üstüne native range tabanlı `eğim probu` eklendi. Öğrenci probu sürükleyerek B noktası, sekant çizgisi ve teğete yaklaşma hissini canlı değiştiriyor; panel butonları fallback/kısa yol olarak kalıyor. Son cila turunda çift görünen SVG/native tutacak tek native prob halinde sadeleştirildi, AstroBot ile çakışan sahne içi uzun feedback kartı kaldırıldı ve AstroBot giriş gecikmesi kısaltıldı. Rehab Gemini final `100/100 PASS`, `MUST_FIX` boş.

12-01, 12-02, 12-03, 12-04 ve 12-05 `Showcase Ready`; 12-06 ve diğer 12. sınıf modülleri Kaptan canlı görsel onayı bekliyor. 12-02 Polinom Kasası son cila turunda mercek seçimi ile kasa kararı ayrıldı; seçim artık yalnız raf önizlemesi veriyor, doğru/yanlış hükmü ve hedef değer yalnız `Kasayı Kilitle` sonrası açılıyor. 2026-05-17 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-03 İşaret Yörünge Radarı da aynı kapıdan geçirildi; tarayıcı seçimi yalnız önizleme, doğru/yanlış yörünge hükmü yalnız `Yörüngeyi Kilitle` sonrası, aralık/işaret rozetleri dikey ve ortalı. 2026-05-17 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-04 Limit Asimptot Sensörü son cila turunda Computer Use yerel cebir cevap sızıntısını yakaladı; Playwright 1488x768 zinciriyle grafik, sonsuz, yerel ve 0/0 görevlerinde sonuçların yalnız `Limiti Kilitle` sonrası olduğu doğrulandı. 2026-05-19 son cila turunda 0/0 AstroBot balonu kesir çizgili denklemle desteklendi ve yalnız AstroBot içinde tutuldu; Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-05 Süreklilik Köprüsü son cila turunda `lim` hizası, `f(2)` dili, AstroBot metni ve matematiksel anlamı olmayan sarı dekor çizgileri temizlendi; 2026-05-19 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-07 Türev Kural Dökümhanesi'nde kartuş seçimi formül cevabı sızdırmayacak şekilde sadeleştirildi; gerçek formül ve çıktı yalnız `Kuralı Test Et` sonrası açılıyor. 12-08 Optimizasyon Arazisi'nde karar seçimi yalnız mekanik önizleme veriyor; formül/sonuç/gizli kanıt `Araziyi Test Et` sonrası açılıyor. 12-11 Büyük Veri Yargı Laboratuvarı'nda kaynak/yargı seçimleri nötr önizleme oldu; `%64/+12`, `ONAY/RED` ve sonuç cümlesi yalnız `Yargıyı Test Et` sonrası açılıyor.

12-01 Dizi Çarkı özel turunda görev sayısı `3`ten `6`ya çıkarıldı. Her MEB atomu iki örnekle pekişiyor: `+3/+5`, `x2/x3`, `n²/n³`. Completion 6 kalabalık kart yerine 3 ustalık kartında 6 kanıt satırı gösteriyor; XP atom sayısı değişmediği için `+120` kaldı. 2026-05-17 Kaptan canlı görsel onayı geldi: "Dizi çarkı modülü güzel oldu." Statü `Showcase Ready`; dashboard etiketi `Vitrin Hazır`.

12-02 Polinom Kasası için 2026-05-17'de fazla işaretleme hissi azaltıldı. 5 mercek korunuyor; seçenek sırası her görevde sabit, her görevde 3 odak mercek daha belirgin, diğer önemli mercekler yardımcı seçenek olarak sakin görünüyor. Doğrusal/karesel kimlik görevlerinde yalnız karar veren raf parlıyor. Uzun polinom etiketi tek satırda kalacak şekilde ayarlandı, duplicate sahne test id'si temizlendi ve completion kartları dar ekranda sıkışmayacak hale getirildi. Kaptan canlı onayı sonrası statü `Showcase Ready`; dashboard etiketi `Vitrin Hazır`.

## Final Evidence

- 12-01 route: `/embed/algebra/sequence-wheel?qa=1&copycheck=1`.
- 12-01 Kaptan onayı: 2026-05-17, "Dizi çarkı modülü güzel oldu."
- 12-01 teknik kapılar: `npm run module:check -- sequence-wheel` 20 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.
- 12-01, 12-02, 12-03, 12-04 ve 12-05 uygulama etiketi: embed `Showcase Ready`, dashboard `Vitrin Hazır`.
- 12-03 Kaptan onayı: 2026-05-17, "işaret yörünge radarı <vitrin hazır < şeklinde işaretlenebilir."
- 12-05 Kaptan onayı: 2026-05-19, "süreklilik köprüsünü de vitrin hazır durumuna getirebilirsin."
- 12-04 Kaptan onayı: 2026-05-19, "gayet güzel oldu. limit asimptot sensörü nü de vitrin hazır durumuna getirebilirsin."
- 12-05 uygulama etiketi: embed `Showcase Ready`, dashboard `Vitrin Hazır`.
- Route: `/embed/calculus/derivative-slope-driver?qa=1&rehab=5`.
- Computer Use QA: Chrome desktop üzerinde eğim probunun erişilebilir `kaydırma çubuğu` olarak geldiği, sahne state'ini değiştirdiği, global AstroBot mesajının kalıcı kaldığı ve balonun botun sağında açıldığı görüldü.
- Playwright QA: final-pass başlangıç/yanlış/sekant/teğet/sivri/kopuk/final/completion screenshot paketi; console/page error yok, desktop overflow temiz.
- Gemini: `.agent/gemini-reports/12-06-derivative-slope-driver-rehab.txt`, `100/100 PASS`, `MUST_FIX` ve `SHOULD_FIX` boş.
- Teknik kapılar: `npm run module:check -- derivative-slope-driver` 22 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.

## Artifacts

- Spec: `docs/module-specs/12-06-derivative-slope-driver.md`.
- Kalite defterleri: `docs/MODULE_SHOWCASE_READINESS.md`, `docs/MODULE_QUALITY_SCORECARD.md`, `docs/MODULE_DONE_CRITERIA.md`.
- Skill hafızası: `.agent/skills/dinamik-istasyon-module-development/SKILL.md`.

## Next Steps

1. Sıradaki modül `12-09 circle-radar-station`; benchmark kabul edilse bile seçim/test ayrımı, radar görsel netliği ve desktop taşma kapısı şüpheci ciladan geçirilecek.

## Blockers

- Ürün blocker yok. Tek bilinçli kapı: Kaptan görsel onayı.
