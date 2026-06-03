# 09-08 Aralık Kapıları İstasyonu

## Amaç
9. sınıf `MAT.9.1.3.1-4` atomlarını tek sayı doğrusu deneyinde öğretmek: öğrenci aralığı hazır seçenekten seçmez; uç kapıları sürükler, açık/kapalı uç mantığını değiştirir ve kesişim/birleşim sonucunu sahnede kurar.

## Atom Kapsamı
- `MAT.9.1.3.1`: Bir sayı aralığını sayı doğrusunda kapalı kapı mantığıyla modeller.
- `MAT.9.1.3.2`: Bir sayı aralığını sayı doğrusunda açık kapı mantığıyla modeller.
- `MAT.9.1.3.3`: İki sayı aralığını kesiştirerek yeni aralığı ifade eder.
- `MAT.9.1.3.4`: İki sayı aralığını birleştirerek yeni aralığı ifade eder.

## Kapsam Dışı
- `MAT.9.1.4.x` sayı kümeleri ayrı **Gerçek Sayı Atlası** modülüne bırakılır.
- `MAT.9.1.5.x` işlem özellikleri ayrı **İşlem Yasaları** modülüne bırakılır.
- Doğrusal eşitsizlik çözüm bölgesi `MAT.9.2.3.2` kapsamındadır ve ayrı **Eşitsizlik Güvenlik Alanı** modülünde yapılacaktır.

## Ana Oyuncak
Sahnede tek sayı doğrusu vardır:
- Sol ve sağ kapı doğrudan sayı doğrusunda sürüklenir.
- Kapının iç noktası tıklanınca uç `dahil/hariç` moduna döner.
- Kesişim ve birleşim görevlerinde iki hazır ışık bandı üstte görünür; öğrenci alttaki sonuç bandını kendisi kurar.

## Görev Akışı
1. Kapalı aralık: `[-2, 3]`.
2. Açık aralık: `(-1, 4)`.
3. Kesişim: `[-4, 2] ∩ [0, 5) = [0, 2]`.
4. Birleşim: `(-3, 1] ∪ [1, 5) = (-3, 5)`.

## QA Başarı Kriteri
- `/embed/numbers/interval-gate-station?qa=1` açılır.
- `interval-scene`, `interval-controls`, `interval-left-gate`, `interval-right-gate`, `interval-check`, `interval-reset` görünür.
- Yanlış kilitleme AstroBot hata mesajı üretir.
- Kapılar sürüklenerek ve uç tipi değiştirilerek 4 görev tamamlanır.
- Completion ekranı görünür.
- `npm run module:check -- interval-gate-station`, `npx tsc --noEmit`, `npm run build`, `git diff --check`, console ve desktop görsel smoke temizdir.

## 2026-06-01 Cila Notu
- Sahne üst etiketi ve shell rozetleri gerçek atom aralığına (`MAT.9.1.3.1-4`) çekildi.
- Başlangıç aralığı nötr `[−1, 1]` yapıldı; ilk ekranda sonuç gibi duran geniş bant kaldırıldı.
- Kesişim/birleşim görevlerinde verilen aralık etiketleri sahne içine alındı; sol kesilme temizlendi.
- Kesişim için `ORTAK IŞIK`, birleşim için `TEK KÖPRÜ` kısa rehberi eklendi; öğrenci kendi sonuç bandını kurarken sebep-sonuç sahnede okunuyor.
- Normal desktop genişlikte destek paneli sahnenin altında kalır; sahne ilk bakışta kesilmez, geniş kiosk ekranlarda panel yanda destek rolüne döner.

## 2026-06-02 Vitrin Onayı
- Kaptan canlı onayıyla registry statüsü Showcase Ready yapıldı.
- Dashboard/inceleme etiketi Vitrin Hazır / Showcase Ready olarak doğrulanacaktır.
