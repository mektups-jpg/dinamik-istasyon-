# 04-05 Açı Ölçme Çarkı

## Kimlik
- Modül id: `angle-turn-wheel-4`
- Route: `/embed/geometry/angle-turn-wheel-4`
- Sınıf: 4
- Durum: Showcase Ready / Vitrin Hazır. 2026-06-01 Kaptan canlı görsel onayıyla vitrine alındı.
- Kategori: Geometri

## Atom Kapsamı
- `MAT.4.3.5.1`: Açının bir cismin kendi etrafında dönme miktarı olduğunu simüle eder.
- `MAT.4.3.6.1`: Dönme miktarını standartlaştırmak için iletkiyi tanır.
- `MAT.4.3.7.1`: 90 derecelik açıları dik olarak sınıflandırır.
- `MAT.4.3.7.2`: 90 dereceden küçük açıları dar olarak sınıflandırır.
- `MAT.4.3.7.3`: 90 dereceden büyük açıları geniş olarak sınıflandırır.

## Öğrenci Deneyimi
Çocuk ekranda büyük bir menteşe ve dönen neon kapı kolu görür. Her görevde kapı farklı miktarda döner; sağdaki üç büyük cevap kartından doğru olan seçilir. Yanlış seçimde kart pembe yanar ve AstroBot çok kısa ipucu verir. Doğru seçimde kapı ışığı yeşile döner, açı etiketi kilitlenir ve sıradaki görev açılır.

## Görev Akışı
1. Açının çizgi değil, dönme miktarı olduğunu seç.
2. İletkinin merkezini menteşeye yerleştirme kuralını seç.
3. 90 derecelik açıyı dik açı olarak sınıflandır.
4. 90 dereceden küçük açıyı dar açı olarak sınıflandır.
5. 90 dereceden büyük açıyı geniş açı olarak sınıflandır.

## Zorunlu Test Idleri
- `angle-turn-wheel-4-stage`
- `angle-turn-wheel-4-control-panel`
- `angle-turn-wheel-4-choice`
- `angle-turn-wheel-4-feedback`
- `angle-turn-wheel-4-complete`
- `angle-turn-wheel-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede menteşe, dönen kol ve cevap kartları görünür.
- Yanlış cevapta anlık renk ve AstroBot ipucu gelir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni açı değerleri ve yeni kart sırası üretir.
- Yatay taşma ve metin çakışması yoktur.
