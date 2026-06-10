# 04-10 Bölme Dedektifi

## Kimlik
- Modül id: `division-detective-4`
- Route: `/embed/numbers/division-detective-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Cebir

## Atom Kapsamı
- `MAT.4.2.5.2`: Çok basamaklı sayıyı basamak basamak bölerek kalanlı bölme algoritmasını tamamlar.
- `MAT.4.2.5.3`: Çok basamaklı sayıyı basamak basamak bölerek kalansız bölme algoritmasını tamamlar.

## Öğrenci Deneyimi
Öğrenci bölme dedektif masasında kalansız bölmede kalan kutusunun boş kaldığını ve kalanlı bölmede kalanın bölen sayıdan küçük olduğunu görür. Bölme tahmini ayrı `Bölme Tahmini` atomunda oynanır.

## Görev Akışı
1. Kalansız bölme sonucunu ve kalan yok bilgisini seç.
2. Kalanlı bölmede bölüm ve kalan kartını seç.

## Zorunlu Test Idleri
- `division-detective-4-stage`
- `division-detective-4-control-panel`
- `division-detective-4-choice`
- `division-detective-4-feedback`
- `division-detective-4-complete`
- `division-detective-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede gerçek bölme işlemi, kalan kutusu dili ve cevap kartları görünür.
- Görev yalnız kalanlı/kalansız bölme hedefini taşır; tahmin görevi içermez.
- Yanlış cevapta kart kırmızı yanar ve AstroBot kısa ipucu verir.
- Doğru cevapta kart yeşil yanar ve görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni bölüm ve kalan sayıları üretir.
- Yatay taşma ve metin çakışması yoktur.

## Kaptan Onayı
- 2026-06-03: Kaptan canlı kontrolden sonra `Bölme Dedektifi` atomunu Vitrin Hazır olarak onayladı.
