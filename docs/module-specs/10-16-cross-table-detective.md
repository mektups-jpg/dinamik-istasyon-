# 10-16 Çapraz Tablo Dedektifi

## Durum

In Progress. SSOT atomları `MAT.10.6.1.1`, `MAT.10.6.1.2` ve `MAT.10.6.2.1` olarak doğrulandı. Bu modül istatistiksel test formüllerine girmez; çapraz tabloda kategorik eşleşme, sapma sinyali ve medya yorumu eleştirisini tek dedektif masasında gösterir.

## Amaç

10. sınıf öğrencisine iki kategorik değişkenin aynı tabloda nasıl eşleştirildiğini ve tablodan gelen ilişki sinyalinin medya iddiasına dönüştürülürken neden dikkat istediğini göstermek:

- Satırlar çalışma düzeni kategorilerini taşır.
- Sütunlar deneme sonucu kategorilerini taşır.
- Gözlenen değer ile beklenen değer farkı ilişki sinyali üretir.
- Medya iddiası nedensellik ve örneklem yanlılığı açısından işaretlenir.

## Atom Kapsamı

- `MAT.10.6.1.1`: İki farklı kategorik değişkeni aynı çapraz tabloda eşleştirir.
- `MAT.10.6.1.2`: Çapraz tablolar üzerinden iki değişken arasındaki sapmayı puanlar.
- `MAT.10.6.2.1`: İki değişkenli anket sonuçlarını yanlılıklarına karşı eleştirir.

## Kapsam Dışı

- Ki-kare testi, p-değeri ve nedensellik ispatı bu modülde açılmaz.
- Korelasyon serpilme grafiği 11. sınıf veri modüllerinde ayrı tutulur.

## Ana Oyuncak

Tek sahne bir **çapraz tablo dedektif masası**dır:

- 2x2 tablo `Planlı çalışma / Dağınık çalışma` ve `Sonuç yükseldi / Sabit kaldı` kategorilerini taşır.
- Öğrenci önce `Planlı + yükseldi = 28` hücresini tarar.
- Sonra beklenen değer `19` ile gözlenen `28` arasındaki `+9` sapma sinyalini kilitler.
- Son görevde "planlı çalışan herkes yükselir" medya iddiasını yanlılık bayrağıyla eleştirir ve rapor mührünü açar.

## Görev Akışı

1. `Kategori Hücresi`: aksı tablo tarayıcısına getir ve `Planlı + yükseldi = 28` hücresini seç.
2. `Sapma Sinyali`: aksı sapma paneline getir ve `28 - 19 = +9` ilişki sinyalini kilitle.
3. `Medya Denetimi`: aksı medya kartına getir, yanlılık bayrağını ve güvenli rapor mührünü aç.

## Route

- `/embed/statistics/cross-table-detective`

## Test ID Kontratı

- `cross-table-scene`
- `cross-table-handle`
- `cross-table-cell-28`
- `cross-table-deviation-signal`
- `cross-table-bias-flag`
- `cross-table-report-seal`
- `cross-table-check`
- `cross-table-reset`

## QA Planı

- `npm run module:check -- cross-table-detective`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/statistics/cross-table-detective?qa=1` açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback ile kategori hücresi, sapma sinyali ve medya denetimi görevleri tamamlanır.
  - Completion ekranı ve console warning/error `[]` doğrulanır.
- Gemini 3 Flash:
  - Öğrenci satır/sütun kategorilerini ve `28` hücresinin anlamını görebiliyor mu denetlenir.
  - `+9` sapma sinyali ilişki ima ediyor ama nedensellik kurmuyor mu kontrol edilir.
  - Medya yanlılığı, ilk 3 saniye, responsive/embed ve bilişsel yük değerlendirilir.
