# 04-04 Açınım ve Çevre Keşfi

## Kimlik
- Modül id: `net-perimeter-table-4`
- Route: `/embed/geometry/net-perimeter-table-4`
- Sınıf: 4
- Durum: Showcase Ready / Vitrin Hazır. 2026-06-01 Kaptan canlı görsel onayıyla vitrine alındı.
- Kategori: Geometri

## Atom Kapsamı
- `MAT.4.3.1.1`: 3D geometrik cisimlerin 2D açınımını yapılandırır.
- `MAT.4.3.2.1`: Açılmış şekilleri kenar uzunluk eşliği açısından kıyaslar.
- `MAT.4.3.2.2`: Kapalı şekilleri kenar uzunluk eşliği açısından kıyaslar.
- `MAT.4.3.3.1`: Sanal cetvelle şeklin çevresini dolanarak ölçer.
- `MAT.4.3.4.1`: Standart olmayan birimlerle tahmini alan söyler.
- `MAT.4.3.8.1`: Kat çizgisinin simetri aynası olduğunu gösterir.
- `MAT.4.3.9.1`: Zor simetri çizgisine göre aynalamayı tamamlar.
- `MAT.4.3.10.1`: Kod bloklarıyla yeni şekil deseni oluşturur.

## Öğrenci Deneyimi
Çocuk ilk ekranda büyük bir analiz masası görür. Her görevde sahne ortasında tek bir görsel hedef vardır: açılmış kutu, eş kenar işaretleri, çevre yolu, fayans alanı, ayna çizgisi veya kod blokları. Sağ panelde üç büyük cevap kartı bulunur. Yanlışa basınca seçilen kart pembeleşir ve AstroBot kısa ipucu verir; doğru karta basınca kart yeşil yanar, sahnedeki hedef parlar ve sıradaki görev açılır.

## Görev Akışı
1. Küp açınımını tanı.
2. Açınım üstündeki eş uzunluktaki kenarı seç.
3. Dikdörtgenin çevresini sanal yol üzerinden bul.
4. Şeklin içini kare fayanslarla tahmini alan olarak say.
5. Simetri çizgisinin hangi tarafı aynaladığını seç.
6. Kod bloklarının oluşturduğu şekli seç.

## Zorunlu Test Idleri
- `net-perimeter-table-4-stage`
- `net-perimeter-table-4-control-panel`
- `net-perimeter-table-4-choice`
- `net-perimeter-table-4-feedback`
- `net-perimeter-table-4-complete`
- `net-perimeter-table-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede hedef ve cevap kartları görünür.
- Eş kenar görevinde kare yüzler renkle doldurulmaz; yalnız iki eş kenar çizgisi A/B olarak parlatılır.
- Yanlış cevapta anlık renk ve AstroBot ipucu gelir.
- Doğru cevapta ilerleme çalışır.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Her tekrar oynamada sayılar/şekil parametreleri değişir; küp açınımı görevinde geçerli farklı açınımlar kullanılır ve aynı açınım üst üste gelmez.
- Aynayı tamamla görevinde farklı simetri şekilleri kullanılır; aynı ayna varyantı üst üste gelmez.
- Kodla şekil yap görevinde 6 farklı desen havuzu kullanılır; aynı kod deseni üst üste gelmez.
- Yatay taşma ve metin çakışması yoktur.
- Açınım görevi soru dili: "Hangi cisme kapanır?" yerine "Hangi cismin açınımıdır?" ifadesi kullanılmalı.
