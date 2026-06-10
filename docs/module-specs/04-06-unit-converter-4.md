# 04-06 Ölçü Dönüşüm Makinesi

## Kimlik
- Modül id: `unit-converter-4`
- Route: `/embed/measure/unit-converter-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Fizik

## Atom Kapsamı
- `MAT.4.1.13.1`: Milimetreyi santimetreye dönüştürür.
- `MAT.4.1.13.2`: Santimetreyi metreye dönüştürür.
- `MAT.4.1.13.3`: Tonu kilograma dönüştürür.
- `MAT.4.1.13.4`: Kilogramı grama dönüştürür.

## Öğrenci Deneyimi
Çocuk tek bir dönüşüm makinesi görür. Solda giriş ölçüsü, sağda hedef birim vardır. Büyük cevap kartlarından doğru dönüşümü seçer; yanlışta AstroBot kısa ipucu verir, doğruda makine ilerler.

## Görev Akışı
1. Milimetreyi santimetreye çevir.
2. Santimetreyi metreye çevir.
3. Tonu kilograma çevir.
4. Kilogramı grama çevir.

## Zorunlu Test Idleri
- `unit-converter-4-stage`
- `unit-converter-4-control-panel`
- `unit-converter-4-choice`
- `unit-converter-4-feedback`
- `unit-converter-4-complete`
- `unit-converter-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede giriş-çıkış dönüşüm makinesi ve cevap kartları görünür.
- Yanlış cevapta anlık renk ve AstroBot ipucu gelir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni ölçü değerleri üretir.
- Yatay taşma ve metin çakışması yoktur.
