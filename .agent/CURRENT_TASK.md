# Current Task

## What We're Building
10. ve 11. sınıf interaktif matematik modülleri için kalite çıtası, kullanıcı tercih hafızası ve makro atom roadmap'i.

## Status
Planning

## Last Session Summary
2026-05-01 — Kullanıcının tasarım tercihleri memory sync ile kalıcılaştırıldı. Güçlü referanslar 3D silindir/prizma modüllerindeki açma-kapama, döndürme, zoom ve dokunulabilir acınım hissi ile 1. sınıf modüllerindeki sade, oyunlu ve tek bakışta anlaşılır akış olarak kaydedildi. 10-11. sınıf planlarında "tek ana oyuncak", "matematiksel anlam taşıyan görsel", "Apple Education sadeliği + Nintendo oyun hissi" ve "geniş üniteyi ayrı makro deneylere bölme" kalite filtresi uygulanacak.

2026-04-29 — Superpowers/Prompt Enhancer akışıyla Gemini dış değerlendirmesi alındı. `gemini-3.1-pro-preview` mevcut ücretsiz key kotasına takıldı, istenen model ailesinden `gemini-3-flash-preview` ile rapor üretildi. Raporun ana teşhisi "İsviçre çakısı sendromu": modüller tek gerçeği öğreten laboratuvarlar olmalı. Bu doğrultuda `function-hologram-room` v4 rebuild yapıldı: kapsam yalnız `MAT.9.2.1.x` doğrusal fonksiyon dönüşümlerine indirildi; mutlak değer ve eşitsizlik ayrı gelecek makro modüllere ayrıldı. Devamında `logic-circuit-lab` aynı kapalı çevrimle yeniden kuruldu: kapsam yalnız `MAT.9.3.2.x` kapılarına indirildi, algoritma akış hattı ve niceleyici radar avı ayrı gelecek makro modüllere ayrıldı. Gemini 3 Flash görsel feedback'i giriş/çıkış ayrımı, mini tablo sadeleştirme ve 0 renginin gri olması yönünde geldi; üçü de uygulandı. Browser Use ile dört kapı görevi tamamlandı. `npm run build` geçti.

2026-04-29 devam — `transformation-forensics` v4 doğrudan manipülasyon deneyine çevrildi. Slider ve "hedefe sürükle" butonları kaldırıldı; öğrenci artık döndürme merkezini sahnede orijine sürüklüyor, açı halkasını 90° hedefe çeviriyor ve yansıma eksenini sahnedeki çizgilerden seçiyor. Modül `ForensicsScene`, `ForensicsControls`, `forensicsModel` ve `types` dosyalarına bölündü. Browser Use ile merkez sürükleme, açı çevirme, Y ekseni seçimi ve completion ekranı doğrulandı; taze konsol turunda warning/error yoktu. Gemini görsel feedback denemesi clipboard'daki key geçersiz olduğu için tamamlanamadı; aynı eleştiri filtresiyle ilk görevdeki açı halkası dikkat dağıtması ve "Açı" rozeti düzeltildi.

2026-04-30 — Superpowers verification/debugging akışıyla `transformation-forensics` uçtan uca tekrar test edildi. İlk ortam hatası dev server kapalı olmasıydı; Vite `localhost:3000` üzerinde başlatıldı. E2E testte yanlış onay geri bildirimi, merkez sürükleme ve açı halkası çalıştı; ancak SVG eksen seçiminde `data-testid` tıklaması eksenlerin kesişim bölgesine düştüğü için Y ekseni otomasyon/user-click güvenilirliği zayıftı. Sahneye her eksen için ayrı uç seçim düğümü eklendi; final Browser Use akışında 3 yanlış deneme, 3 doğru manipülasyon, completion ekranı ve taze console taraması temiz geçti.

2026-04-30 devam — `transformation-forensics` v5 görsel cilası uygulandı. Sahne ve kontrol paneli Apple Education hissine daha yakın premium glass yüzeylere, daha sakin grid/spotlight arka plana ve ayrışan orijinal/hedef/hayalet renklerine çekildi. SVG hedef işaretleri gerçek dokunulabilir hedefler oldu: orijin hedefi, 90° hedefi ve Y ekseni uç düğümüyle Browser Use akışı güvenilir tamamlanıyor. `npm run build` geçti; Browser Use ile yanlış onaylar, hedef seçimi, Y ekseni ve completion ekranı tekrar doğrulandı.

2026-04-30 devam — `radical-power-reactor` v5 baştan tasarlandı. Eski köşeli reaktör paneli yerine daha sakin Apple Education / uzay laboratuvarı karışımı glass sahne kuruldu. Üs görevi `2³` ve `2²` çekirdeklerini merkez füzyon yuvalarına taşıtarak `2⁵ = 32` sonucunu sahnede üretiyor; kök görevi `√72` kristalini `√36 -> 6` dış haznesi ve `√2` kök haznesi olarak ayırıyor. Orta viewport'ta yatay kırpılmayı önlemek için layout tek kolon, geniş ekranda iki kolon davranışına çekildi. Browser Use ile yanlış onay, iki görev zinciri, completion ekranı ve taze console delta 0 doğrulandı; `npm run build` geçti.

2026-04-30 devam — Kullanıcı görsel hata şüphesiyle Kök/Üs Reaktörü tekrar denetlendi. Browser Use ekran turunda iki sorun yakalandı: orta viewport'ta sağ panel/aksiyonlar ilk ekranda kırpılıyordu ve kök sahnesindeki `motion.rect` `y` animasyonu `√36`/`√2` token arka planlarını SVG altına kaydırıp anlamsız renkli bloklar oluşturuyordu. Layout `max-w-4xl + md 260px panel` akışına sıkılaştırıldı, açıklama kartı orta viewport'ta gizlendi, token zemin animasyonu sabit konum + opacity/scale nabzına çevrildi. Browser Use ile kök sahnesi görsel olarak doğrulandı; final e2e completion ekranına ulaştı ve yeni warning/error çıkmadı. `npm run build` ve `git diff --check` geçti.

2026-04-30 devam — Kullanıcının "uçtan uca test et" standardı proje yeteneğine dönüştürüldü: `.agent/skills/project-visual-e2e-qa` eklendi ve `AGENTS.md` içine bağlandı. Browser Use in-app QA ile 9. sınıf modülleri tek tek denetlendi: `radical-power-reactor`, `function-hologram-room`, `equation-submarine`, `logic-circuit-lab`, `triangle-tension-lab`, `transformation-forensics` ve `statistics-probability-radar` yanlış deneme, doğru etkileşim ve completion ekranı üzerinden geçti. Orta viewport'ta yeni v4 modüllerin sağ kontrol paneli/aksiyon kırpılmaları düzeltildi; kontrol panelleri daha kompakt yapıldı ve AstroBot mesajları 4.2 saniye sonra otomatik kapanacak şekilde güncellendi. Console taramasında yalnız eski Firestore WebChannel bağlantı uyarıları kaldı; eski `radical-power-reactor` runtime logu yeniden üretilemedi ve yeni hata delta 0 doğrulandı. `npm run build` ve `git diff --check` geçti.

## Next Steps
1. 10. ve 11. sınıf modül listesini `docs/MEB_ATOMLARI.md` atomlarına göre dar makro deneylere böl.
2. Her modül için ana manipulative, öğrenme hedefi, görsel metafor ve QA başarı kriterini yaz.
3. Kullanıcı onayından sonra ilk 10. sınıf modülünü tek ana deney yaklaşımıyla uygula.
4. Publish hattı için Firebase Hosting + GitHub Actions planını ayrı teknik sprintte kur.

## Blockers
- None
