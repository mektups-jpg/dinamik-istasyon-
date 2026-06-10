# 04-06 Ölçü, Olasılık ve Veri İstasyonu

## Kimlik
- Modül id: `network-optimization-terminal-4`
- Route: `/embed/data/network-optimization-terminal-4`
- Sınıf: 4
- Durum: archived
- Kategori: Olasılık

## Arşiv Notu
Bu birleşik istasyon üç ayrı konu taşıdığı için 4. sınıf öğrenci odağı açısından parçalandı. Aktif üretim artık şu üç atom üzerinden yürür:
- Ölçü Dönüşüm Makinesi
- Olasılık Etiketleri
- İki Sınıf Grafiği

## Atom Kapsamı
- `MAT.4.1.13.1`: Milimetreyi santimetreye dönüştürür.
- `MAT.4.1.13.2`: Santimetreyi metreye dönüştürür.
- `MAT.4.1.13.3`: Tonu kilograma dönüştürür.
- `MAT.4.1.13.4`: Kilogramı grama dönüştürür.
- `MAT.4.4.1.1`: Olmayacak durumu imkânsız olarak etiketler.
- `MAT.4.4.1.2`: Kesin olacak durumu kesin olarak etiketler.
- `MAT.4.4.1.3`: Arada kalan durumu olabilir olarak etiketler.
- `MAT.4.4.2.1`: İki veri grubunu aynı sütun grafiğinde kıyaslar.

## Öğrenci Deneyimi
Çocuk ekranda üç küçük istasyonlu bir terminal görür. Ölçü istasyonunda giriş değeri enerji borusundan geçip başka bir birime dönüşür. Olasılık istasyonunda torba içindeki renkli kapsüllere bakıp imkânsız, kesin veya olabilir etiketi seçilir. Veri istasyonunda iki sınıfın sütunları yan yana görünür ve çocuk hangi grubun daha büyük olduğunu seçer.

## Görev Akışı
1. Milimetreyi santimetreye çevir.
2. Santimetreyi metreye çevir.
3. Tonu kilograma çevir.
4. Kilogramı grama çevir.
5. İmkânsız olayı seç.
6. Kesin olayı seç.
7. Olabilir olayı seç.
8. İki sınıflı sütun grafiğinde büyük olanı bul.

## Zorunlu Test Idleri
- `network-optimization-terminal-4-stage`
- `network-optimization-terminal-4-control-panel`
- `network-optimization-terminal-4-choice`
- `network-optimization-terminal-4-feedback`
- `network-optimization-terminal-4-complete`
- `network-optimization-terminal-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede istasyon görseli ve cevap kartları görünür.
- Yanlış cevapta anlık renk ve AstroBot ipucu gelir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni sayılar, kapsül sayıları veya grafik değerleri üretir.
- Yatay taşma ve metin çakışması yoktur.
