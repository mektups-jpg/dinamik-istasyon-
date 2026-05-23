# Current Task

## What We're Building

12. sınıf kalite rehabilitasyonu başladı. İlk tur global kalite kapısı: AstroBot okunur/persistent olacak, 12. sınıf modüller yalnız panel seçimiyle kapanmayacak, konuya göre esnek ama sahnede canlı etkileşim standardı uygulanacak.

## Status

Global AstroBot otomatik kapanmayan, botun sağ tarafına açılan ve daha dikkat çekici bir konuşma balonuna taşındı. Mesaj id'si monotonic hale getirildi; görev değişiminde eski mesaj temizleniyor. 12. sınıf sağ panelindeki AstroBot kopyası daha sakin "son not" formatına, uzun sağ-alt feedback tekrarları da kısa durum çipine çekildi.

İlk rework adayı `12-06 derivative-slope-driver`: sahne üstüne native range tabanlı `eğim probu` eklendi. Öğrenci probu sürükleyerek B noktası, sekant çizgisi ve teğete yaklaşma hissini canlı değiştiriyor; panel butonları fallback/kısa yol olarak kalıyor. Son cila turunda çift görünen SVG/native tutacak tek native prob halinde sadeleştirildi, AstroBot ile çakışan sahne içi uzun feedback kartı kaldırıldı ve AstroBot giriş gecikmesi kısaltıldı. Rehab Gemini final `100/100 PASS`, `MUST_FIX` boş.

12-01, 12-02, 12-03, 12-04, 12-05, 12-06 ve 12-06b `Showcase Ready`; sıradaki canlı göz/cila adayı 12-07 Türev Kural Dökümhanesi. 12-02 Polinom Kasası son cila turunda mercek seçimi ile kasa kararı ayrıldı; seçim artık yalnız raf önizlemesi veriyor, doğru/yanlış hükmü ve hedef değer yalnız `Kasayı Kilitle` sonrası açılıyor. 2026-05-17 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-03 İşaret Yörünge Radarı da aynı kapıdan geçirildi; tarayıcı seçimi yalnız önizleme, doğru/yanlış yörünge hükmü yalnız `Yörüngeyi Kilitle` sonrası, aralık/işaret rozetleri dikey ve ortalı. 2026-05-17 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-04 Limit Asimptot Sensörü son cila turunda Computer Use yerel cebir cevap sızıntısını yakaladı; Playwright 1488x768 zinciriyle grafik, sonsuz, yerel ve 0/0 görevlerinde sonuçların yalnız `Limiti Kilitle` sonrası olduğu doğrulandı. 2026-05-19 son cila turunda 0/0 AstroBot balonu kesir çizgili denklemle desteklendi ve yalnız AstroBot içinde tutuldu; Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-05 Süreklilik Köprüsü son cila turunda `lim` hizası, `f(2)` dili, AstroBot metni ve matematiksel anlamı olmayan sarı dekor çizgileri temizlendi; 2026-05-19 Kaptan canlı onayıyla `Showcase Ready / Vitrin Hazır` oldu. 12-07 Türev Kural Dökümhanesi'nde kartuş seçimi formül cevabı sızdırmayacak şekilde sadeleştirildi; gerçek formül ve çıktı yalnız `Kuralı Test Et` sonrası açılıyor. 12-08 Optimizasyon Arazisi'nde karar seçimi yalnız mekanik önizleme veriyor; formül/sonuç/gizli kanıt `Araziyi Test Et` sonrası açılıyor. 12-11 Büyük Veri Yargı Laboratuvarı'nda kaynak/yargı seçimleri nötr önizleme oldu; `%64/+12`, `ONAY/RED` ve sonuç cümlesi yalnız `Yargıyı Test Et` sonrası açılıyor.

12-01 Dizi Çarkı özel turunda görev sayısı `3`ten `6`ya çıkarıldı. Her MEB atomu iki örnekle pekişiyor: `+3/+5`, `x2/x3`, `n²/n³`. Completion 6 kalabalık kart yerine 3 ustalık kartında 6 kanıt satırı gösteriyor; XP atom sayısı değişmediği için `+120` kaldı. 2026-05-17 Kaptan canlı görsel onayı geldi: "Dizi çarkı modülü güzel oldu." Statü `Showcase Ready`; dashboard etiketi `Vitrin Hazır`.

12-02 Polinom Kasası için 2026-05-17'de fazla işaretleme hissi azaltıldı. 5 mercek korunuyor; seçenek sırası her görevde sabit, her görevde 3 odak mercek daha belirgin, diğer önemli mercekler yardımcı seçenek olarak sakin görünüyor. Doğrusal/karesel kimlik görevlerinde yalnız karar veren raf parlıyor. Uzun polinom etiketi tek satırda kalacak şekilde ayarlandı, duplicate sahne test id'si temizlendi ve completion kartları dar ekranda sıkışmayacak hale getirildi. Kaptan canlı onayı sonrası statü `Showcase Ready`; dashboard etiketi `Vitrin Hazır`.

2026-05-23 ara cila: `12-06b derivative-nonexistent-alarm` ekranındaki yazı yükü azaltıldı. Sahneye hafif koordinat sistemi/eksen hissi eklendi, uzun kanıt kartı kaldırıldı, sağ panel metinleri kısaltıldı, AstroBot ilk notu sadeleştirildi ve sahne içi tarayıcı kontrolü AstroBot balonuyla çakışmayacak şekilde sağ alta taşındı. Bu ara cila, sonraki eksik tamamlama turu ve Kaptan canlı onayıyla `Showcase Ready` kararına bağlandı.

2026-05-23 Kaptan eksik tamamlama turu: `12-06b derivative-nonexistent-alarm` sahne probu artık SVG sahnesinin üstünden doğrudan sürüklenebiliyor; sağ alttaki range yalnız erişilebilir ince ayar/fallback olarak kalıyor. Başlangıçta `f'(2) yok` hükmü sahneden kaldırıldı, yerine `tek teğet?` / `kesintisizlik?` ön-kanıt dili geldi; gerçek `f'(2) yok` yalnız doğru alarm kilidinden sonra açılıyor. Sağ panel kendi içinde dikey scroll alabiliyor, completion kartı daha dar güvenli genişliğe çekildi ve modül dosyası `AlarmTracks`, `AlarmControls`, `AlarmCompletion` parçalarına bölünerek 375 satıra indi. Kaptan canlı görsel onayıyla statü `Showcase Ready / Vitrin Hazır`.

2026-05-23 Kaptan canlı göz turu: `12-07 derivative-rule-forge` ekranında çizgilerin üst üste binmiş gibi durduğu görüldü. Kök neden tek kalın ana bandın giriş ışınları ve aktif kural kollarıyla aynı koridora tekrar tekrar çizilmesiydi. Ana bant üç ayrı ince raya ayrıldı, kartuş seçilince pasif giriş rayları gizlendi, aktif kuralın üstüne binen ekstra parlak çerçeve kaldırıldı ve embed statü etiketi `Görüş Gerekli` olarak Türkçeleştirildi. Modül hâlâ Kaptan final göz onayı beklediği için `Review Needed`.

2026-05-23 Kaptan onaylı altın şablon cila: `12-07 derivative-rule-forge` artık yalnız doğru kartuşu seçtirip bitirmiyor. Her görevde sahne üstünde `türevle`, `koru`, `topla`, `çıkar`, `g² zırh`, `dış/iç` gibi kural parçaları kilitlenmeden test başarıya dönmüyor. Doğru kartuş + eksik parçada `Eksik parça alarmı` veriyor; yanlış kartuş yine formül açmadan engelleniyor. Browser/Codex canlı QA'da eksik parça alarmı, kilitli toplam kuralı, yanlış kartuş, beş görev completion, completion genişliği, yatay taşma ve console kontrolü geçti. Statü hâlâ `Review Needed / Görüş Gerekli`; Kaptan canlı onayı olmadan `Showcase Ready` yapılmadı.

2026-05-23 çarpım kolu görsel cila: Kaptan işaretli yorumunda `köprü` ve çarpım kollarının kartuşun içinden geçiyor gibi durduğu görüldü. Eski statik ürün path'leri kaldırıldı; çarpım kolları kartuşun üstünden ve altından dolaşan animasyonlu dış raylara taşındı, `köprü` rozeti kompaktlaştırıldı. Browser/Codex canlı ölçümde 2 hareketli ray, eski path yok, `köprü`/çıkış çakışması yok, yatay taşma `0`, console warning/error `0`.

2026-05-23 kartuş gövdesi toplu cila: Kaptan'ın "diğer kartuşlarda da ortadaki tasarım kötü duruyor" notu üzerine toplam, fark, çarpım, bölüm ve zincir kartuşları ortak portlu `RuleCartridgeCore` ve animasyonlu `RuleFlowRail` sistemiyle eşitlendi. Toplam/fark etiketleri orta gövdenin arkasında kalmayacak şekilde dışa taşındı. Browser/Codex canlı kontrolde beş kartuş tek tek tıklandı; ortak çekirdek, doğru sembol, eski path yokluğu, yatay taşma `0` ve console warning/error `0` doğrulandı. Statü hâlâ `Review Needed / Görüş Gerekli`; Kaptan canlı onayı olmadan `Showcase Ready` yapılmadı.

2026-05-23 çalışma düzeni güncellemesi: `/review-workbench` paneli Kaptan'ın aynı ekranda modül inceleyebilmesi için sağ tarafta canlı önizleme paneliyle güncellendi. `Yanda aç` modülü iframe içinde açıyor, paneldeki puan/not alanları kaybolmuyor. Kaptan ile konuşulan yeni iş bölümü dokümana işlendi: ilkokul ve ortaokul sohbetleri audit-only kalacak, kod değiştiren tek hat lise/ana üretim sohbeti olacak. Kılavuz: `docs/KAPTAN_REVIEW_WORKFLOW.md`.

## Final Evidence

- 12-01 route: `/embed/algebra/sequence-wheel?qa=1&copycheck=1`.
- 12-01 Kaptan onayı: 2026-05-17, "Dizi çarkı modülü güzel oldu."
- 12-01 teknik kapılar: `npm run module:check -- sequence-wheel` 20 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.
- 12-01, 12-02, 12-03, 12-04 ve 12-05 uygulama etiketi: embed `Showcase Ready`, dashboard `Vitrin Hazır`.
- 12-03 Kaptan onayı: 2026-05-17, "işaret yörünge radarı <vitrin hazır < şeklinde işaretlenebilir."
- 12-05 Kaptan onayı: 2026-05-19, "süreklilik köprüsünü de vitrin hazır durumuna getirebilirsin."
- 12-04 Kaptan onayı: 2026-05-19, "gayet güzel oldu. limit asimptot sensörü nü de vitrin hazır durumuna getirebilirsin."
- 12-05 uygulama etiketi: embed `Showcase Ready`, dashboard `Vitrin Hazır`.
- 12-06b Kaptan onayı: 2026-05-23, "tamamdır bu vitrin olsun sıradakine geçelim."
- 12-06b uygulama etiketi: embed `Showcase Ready`, dashboard `Vitrin Hazır`.
- Route: `/embed/calculus/derivative-slope-driver?qa=1&rehab=5`.
- Computer Use QA: Chrome desktop üzerinde eğim probunun erişilebilir `kaydırma çubuğu` olarak geldiği, sahne state'ini değiştirdiği, global AstroBot mesajının kalıcı kaldığı ve balonun botun sağında açıldığı görüldü.
- Playwright QA: final-pass başlangıç/yanlış/sekant/teğet/sivri/kopuk/final/completion screenshot paketi; console/page error yok, desktop overflow temiz.
- Gemini: `.agent/gemini-reports/12-06-derivative-slope-driver-rehab.txt`, `100/100 PASS`, `MUST_FIX` ve `SHOULD_FIX` boş.
- Teknik kapılar: `npm run module:check -- derivative-slope-driver` 22 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve `git diff --check` geçti.
- 12-06b cila kanıtı: `node` kabul kontrolü kırmızıdan yeşile döndü; `npm run module:check -- derivative-nonexistent-alarm` 18 pass / 2 warn / 0 fail; `npx tsc --noEmit`, `npm run build`, `git diff --check` geçti. Browser/Codex canlı QA'da sahne probu doğrudan sürüklenince slider değeri `50 -> 92` değişti, doğru zincir completion'a ulaştı, console warning/error yok.
- 12-07 çizgi cila kanıtı: Browser/Codex canlı QA'da başlangıç, yanlış kartuş, doğru toplam ve tam beş görev completion akışı geçti; erken formül sızıntısı yok, `REVİEW` yazısı yok, yatay taşma yok, console warning/error yok. `npm run module:check -- derivative-rule-forge` 24 pass / 2 warn / 0 fail ve `git diff --check` geçti.
- 12-07 altın şablon cila kanıtı: TDD kabul kontrolü önce kırmızı, sonra yeşil geçti. Browser/Codex canlı QA'da doğru kartuş + eksik parça alarmı, sahnede 3/3 parça kilidi, yanlış kartuş engeli, beş görev completion ve completion kart genişliği geçti; console warning/error yok, yatay taşma yok. Teknik kapılar: `npm run module:check -- derivative-rule-forge` 24 pass / 2 warn / 0 fail; `npx tsc --noEmit`, `npm run build`, `git diff --check` geçti. Görseller: `.agent/visual-reports/12-07-build-start.png`, `.agent/visual-reports/12-07-build-step-lock.png`, `.agent/visual-reports/12-07-build-completion.png`.
- 12-07 çarpım kolu cila kanıtı: `.agent/visual-reports/12-07-product-outer-rails.png`; `module:check` 34 pass / 2 warn / 0 fail; `build` ve `git diff --check` geçti.
- 12-07 kartuş gövdesi cila kanıtı: `.agent/visual-reports/12-07-core-sum-after-label-fix.png`, `.agent/visual-reports/12-07-core-product.png`, `.agent/visual-reports/12-07-core-quotient.png`, `.agent/visual-reports/12-07-core-chain.png`; Browser/Codex canlı kartuş kontrolleri console warning/error `0`, yatay taşma `0`. Teknik kapılar: kaynak kabul kontrolü, `module:check` 34 pass / 2 warn / 0 fail, `tsc`, `build`, `git diff --check` geçti.

## Artifacts

- Spec: `docs/module-specs/12-06-derivative-slope-driver.md`.
- Spec: `docs/module-specs/12-06b-derivative-nonexistent-alarm.md`.
- Kalite defterleri: `docs/MODULE_SHOWCASE_READINESS.md`, `docs/MODULE_QUALITY_SCORECARD.md`, `docs/MODULE_DONE_CRITERIA.md`.
- Skill hafızası: `.agent/skills/dinamik-istasyon-module-development/SKILL.md`.

## Next Steps

1. Kaptan `/review-workbench` üzerinden ilkokul/ortaokul/lise notlarını bırakabilir; notlar tek üretim kuyruğuna aktarılacak.
2. Lise/ana üretim hattı `12-07 derivative-rule-forge` için Kaptan canlı göz onayını bekleyecek; onay gelirse vitrin kararı ayrı turda işlenecek.
3. Kaptan onayı olmayan sonraki modüller `Review Needed` kalacak; bu turda 12-07 koduna başlanmadı.

## Blockers

- Ürün blocker yok. Tek bilinçli kapı: sıradaki modüllerde Kaptan görsel onayı.
