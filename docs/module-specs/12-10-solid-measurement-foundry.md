# 12-10 Katı Cisim Ölçüm Dökümhanesi

## Durum

- Etiket: `Review Needed`
- Route: `/embed/geometry/solid-measurement-foundry`
- Ana kalite hedefi: 3D cisim referanslarındaki gibi ana oyuncak sahnenin başrolü; öğrenci hacim ve yüzey alanını kağıt formülü değil, iç dolum ve dış kaplama olarak görür.
- `Showcase Ready` değildir. Kaptan canlı görsel onayı beklenir.

## SSOT Atomları

- `MAT.12.4.1.1`: Dik prizmanın hacim argümanlarını hesaplar.
- `MAT.12.4.1.2`: Dik dairesel silindirin hacim argümanlarını hesaplar.
- `MAT.12.4.1.3`: Dik piramitin hacim argümanlarını hesaplar.
- `MAT.12.4.1.4`: Dik dairesel koninin hacim argümanlarını hesaplar.
- `MAT.12.4.1.5`: Kürenin hacim argümanlarını hesaplar.
- `MAT.12.4.2.1`: Dik prizmanın toplam yüzey alanını saptar.
- `MAT.12.4.2.2`: Dik dairesel silindirin toplam yüzey alanını saptar.
- `MAT.12.4.2.3`: Dik piramitin toplam yüzey alanını saptar.
- `MAT.12.4.2.4`: Dik dairesel koninin toplam yüzey alanını saptar.
- `MAT.12.4.2.5`: Kürenin dış yüzey alanını saptar.

## Ana Oyuncak

Büyük 3D ölçüm dökümhanesi.

Öğrenci sağ panelden bir cisim ve ölçüm modu seçer:

- Hacim görevinde cismin içi nanobot sıvısıyla dolar; aktif katman iç hacmin neyi saydığını gösterir.
- Yüzey alanı görevinde cismin dışı jelatin zırhla kaplanır; sahne sadece dış kabuğu ve kaplama bantlarını vurgular.
- Prizma ve silindirde taban alanı ile yükseklik ilişkisi görünür.
- Piramit ve konide tepeye daralan hacim, ilgili cismin üçte bir hacim mantığını sezdirir.
- Kürede hacim iç dolu çekirdek, yüzey alanı ise dış kabuk zırhı olarak ayrışır.

## Öğrenci Akışı

1. İlk görevde prizmanın iç hacim dolumu seçilir.
2. Yanlış cisim veya yanlış mod seçilirse sahne alarm verir ve neden yanlış olduğunu açıklar.
3. Doğru seçim `Dökümhaneyi Test Et` ile kilitlenir.
4. Sırayla prizma, silindir, piramit, koni ve küre için hacim; sonra aynı cisimler için yüzey alanı görevleri tamamlanır.
5. Completion ekranı hacim dolumu ve dış kaplama ayrımını kısa kanıt kartlarıyla özetler.

## Test ID Kontratı

- `solid-measurement-foundry-scene`
- `solid-measurement-foundry-manipulator`
- `solid-measurement-foundry-prism`
- `solid-measurement-foundry-cylinder`
- `solid-measurement-foundry-pyramid`
- `solid-measurement-foundry-cone`
- `solid-measurement-foundry-sphere`
- `solid-measurement-foundry-volume`
- `solid-measurement-foundry-surface`
- `solid-measurement-foundry-check`
- `solid-measurement-foundry-feedback`
- `solid-measurement-foundry-reset`

## QA Planı

- Computer Use desktop: açılış, yanlış deneme, doğru zincir, hacimden yüzey alanına geçiş, reset, completion.
- Playwright/browser screenshotları: 00-start, 25-wrong, 40-cylinder-volume, 60-cone-volume, 75-prism-surface, 90-sphere-surface, 100-complete, viewport-1488x768.
- Console/page error temizliği.
- Gemini 3.1 Pro veya mevcut en yüksek Gemini ile final screenshot paketi.
- Teknik kapılar: `npm run module:check -- solid-measurement-foundry`, `npx tsc --noEmit`, `npm run build`, `git diff --check`.

## İç Rubrik

- Internal hedef: `90+`.
- Hard fail: 3D oyuncak küçük kalırsa, sağ panel sahneyi boğarsa, hacim/yüzey alanı yalnız metinle anlatılırsa, öğrenci yanlışta neden yanlış olduğunu göremezse, canvas boş/gri kalırsa veya dar laptopta kontrol paneli kesilirse modül kapanmaz.

## Kapanış Notu

Bu modül `Review Needed` olarak ana uygulamada görünür. Kaptan görsel onayı gelmeden `Showcase Ready` yapılmayacak.

## Final Kanıt

- Computer Use: Chrome desktop üzerinde başlangıç, nötr çekirdek, yanlış silindir + yüzey alanı alarmı, doğru prizma/silindir/piramit hacim gözlemi ve sahne oranı denetlendi.
- Playwright QA: `.agent/browser-use-shots/12-10-solid-measurement-foundry-00-start.png`, `25-wrong.png`, `35-prism-volume.png`, `40-cylinder-volume.png`, `50-pyramid-volume.png`, `60-cone-volume.png`, `65-sphere-volume.png`, `75-prism-surface.png`, `80-cylinder-surface.png`, `85-pyramid-surface.png`, `88-cone-surface.png`, `90-sphere-surface.png`, `100-complete.png`, `viewport-1488x768.png`.
- Console/WebGL: `.agent/browser-use-shots/12-10-solid-measurement-foundry-console.md`; uygulama console/page error yok, WebGL pixel check `20/20` non-dark sample. Playwright screenshot/pixel capture kaynaklı WebGL `ReadPixels` performans uyarıları uygulama hatası olarak sayılmadı.
- Gemini: `.agent/gemini-reports/12-10-solid-measurement-foundry-final.txt`, Gemini 3.1 Pro çağrısı `95/100 PASS`, `MUST_FIX` yok. `SHOULD_FIX` olarak verilen prizma yüzey formülü dili `A = 2Tₐ + Yₐ` şeklinde düzeltildi.
- Teknik kapılar: `npm run module:check -- solid-measurement-foundry` 31 pass / 2 expected warn / 0 fail; `npx tsc --noEmit`, `npm run build` ve final doküman senkronu sonrası `git diff --check` geçti.
