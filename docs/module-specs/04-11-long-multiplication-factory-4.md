# 04-11 Uzun Çarpma Fabrikası

## Kimlik
- Modül id: `long-multiplication-factory-4`
- Route: `/embed/numbers/long-multiplication-factory-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Cebir

## Atom Kapsamı
- `MAT.4.2.5.1`: Çok basamaklı iki sayının uzun çarpma sütun algoritmasını kaydırmasız çalıştırır.

## Öğrenci Deneyimi
Öğrenci çarpma üretim bandında birler sonucunu, onlar sonucunu ve toplam sonucu büyük cevap kartlarıyla kurar.

## Görev Akışı
1. İkinci çarpan olan birler basamağıyla ilk sayıyı çarp.
2. İkinci çarpanın onlar basamağındaki değerini kullanarak onlar sonucunu seç.
3. Birler ve onlar sonuçlarını toplayarak uzun çarpma sonucunu seç.

## Zorunlu Test Idleri
- `long-multiplication-factory-4-stage`
- `long-multiplication-factory-4-control-panel`
- `long-multiplication-factory-4-choice`
- `long-multiplication-factory-4-feedback`
- `long-multiplication-factory-4-complete`
- `long-multiplication-factory-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede çarpma işlemi, birler/onlar adımları ve cevap kartları görünür.
- Yanlış cevapta kart kırmızı yanar ve AstroBot yer değeri ipucu verir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni çarpma sayıları üretir.
- Yatay taşma ve metin çakışması yoktur.

## Kaptan Onayı
- 2026-06-03: Kaptan canlı kontrolden sonra `Uzun Çarpma Fabrikası` atomunu Vitrin Hazır olarak onayladı.
