# Modül Bitti Kriteri

Bu dosya, "modül tamamlandı" demeden önce çalıştırılacak kalite kapısıdır. Saatlik otomasyon ve manuel geliştirme aynı standardı kullanır.

## 1. Kapsam Kapısı
- Atomlar yalnızca `docs/MEB_ATOMLARI.md` içinden alınmış olmalı.
- Modül tek ana deney/oyuncak etrafında kurulmalı.
- Genişleyen atomlar ayrı gelecek makro modül olarak not edilmeli.
- Route, registry kaydı, atom listesi ve dashboard görünürlüğü kontrol edilmeli.

## 2. Kod Kapısı
- TypeScript strict kurallarına aykırı `any` eklenmemeli.
- 300-400 satırı aşan dosyalar makul şekilde `Scene`, `Controls`, `types`, `model` gibi parçalara ayrılmalı.
- Dekoratif overlay'lerde `pointer-events-none` olmalı.
- Embed root layout `h-full w-full overflow-y-auto overflow-x-hidden` prensibini korumalı.
- Ana kontroller ve kritik sahne öğeleri sabit `data-testid` almalı.

## 3. Görsel/UX Kapısı
- İlk viewport "neyle oynayacağım?" sorusunu yanıtlamalı.
- Kontroller sahneye doğrudan etki etmeli.
- Görsel öğeler matematiksel anlam taşımalı.
- Sağ/alt panel ana sahneyi boğmamalı.
- Mobil ve embed görünümde yatay taşma, kırpılan aksiyon veya tıklanamayan overlay olmamalı.

## 4. Test Kapısı
Her modül için asgari doğrulama:

```bash
npm run module:check -- <module-id>
npm run build
git diff --check
```

Browser Use ile:
- Browser Use IAB preflight once yapilir; takilirsa ajan kendi ic recovery merdivenini dener: Browser Use bootstrap yenileme, yeni tab, dev server kontrolu/baslatma, taze query reload, screenshot timeout durumunda Browser Use DOM/CUA/console kaniti.
- Modül `?qa=1` açılır.
- Başlık, ana sahne ve ana oyuncak görünür.
- En az bir yanlış deneme AstroBot hata/uyarı mesajı üretir.
- Doğru akışla tüm görevler tamamlanır.
- Completion ekranı görünür.
- Console'da yeni warning/error yoktur.
- Orta viewport ve mobil/embed smoke kontrol edilir.

Gemini 3 Flash ile:
- Browser Use ekran görüntüleri ve modül kapsamı gönderilir.
- `VERDICT`, skor, `MUST_FIX` ve `SHOULD_FIX` ayrımı istenir.
- `MUST_FIX` açıkken modül `Done` yapılamaz.
- Gemini skoru 85 altında kalırsa veya internal kalite skoru 90 altında kalırsa modül `Done` yapılamaz.
- Kapsam büyüten fikirler yalnız `v2/future` notu olarak tutulur.
- Kapanış puanı `docs/MODULE_QUALITY_SCORECARD.md` içine işlenir.

## 5. Dokümantasyon Kapısı
- `docs/DEVELOPMENT_QUEUE_10_11.md` status güncellenir.
- `PROGRESS.md` kısa başarı kaydı alır.
- `.agent/WORKLOG.md` teknik çalışma notu alır.
- Yeni kalıcı karar/tercih/gotcha varsa `.agent/knowledge/` içine knowledge entry eklenir.

## 6. Commit Kapısı
- Build ve Browser Use QA geçerse modül veya büyük refactor commitlenebilir temiz bir parçaya ayrılır.
- Commit mesajı modül adı, atom aralığı ve test sonucunu yansıtmalıdır.
- Kullanıcı değişiklikleri veya ilgisiz dosyalar commit'e karıştırılmamalıdır.

## 7. Otonom Geçiş Kapısı
- Modül state'i `Ready -> Spec Draft -> Implementing -> Static Verified -> Browser Use QA -> Gemini Critique -> Done` çizgisini izlemelidir.
- Browser Use IAB bulunamazsa once ic recovery uygulanir. Recovery sonrasi hâlâ bulunamazsa modül `In Progress` kalır; başka browser aracıyla `Done` yapılmaz.
- Internal kalite skoru en az 90/100 olmalı ve `docs/MODULE_QUALITY_SCORECARD.md` içinde kanıt satırı bulunmalıdır.
- Tüm hard gate'ler geçmeden sıradaki modüle başlanmaz.
- Detaylı işleyiş için `docs/AUTONOMOUS_MODULE_PIPELINE.md` referans alınır.
