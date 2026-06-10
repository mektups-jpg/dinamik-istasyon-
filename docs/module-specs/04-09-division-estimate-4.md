# 04-09 Bölme Tahmini

## Kimlik
- Modül id: `division-estimate-4`
- Route: `/embed/numbers/division-estimate-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Cebir

## Atom Kapsamı
- `MAT.4.2.3.2`: Bölme işleminin sonucunu işlemi yapmadan önce tahmini olarak yuvarlayıp bulur.

## Öğrenci Deneyimi
Öğrenci tahmin rotasında bölme işlemini tam yapmadan önce bölünen sayıyı yakın ve kolay bölünen bir sayıya götürür. Büyük işlem kartında yuvarlama adımını görür, yaklaşık sonuç kartına dokunur.

## Görev Akışı
1. Bölünen sayıyı yakın bir sayıya yuvarlayıp 10'un katı olan yaklaşık bölümü seç.
2. 10'un katı olmayan ama kolay bölünen bir uyumlu sayı ile yaklaşık bölümü seç.
3. Yeni uyumlu sayıyla yaklaşık cevabı seçerek tahmin atomunu tamamla.

## Zorunlu Test Idleri
- `division-estimate-4-stage`
- `division-estimate-4-control-panel`
- `division-estimate-4-choice`
- `division-estimate-4-feedback`
- `division-estimate-4-complete`
- `division-estimate-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede yaklaşık bölme işlemi, yuvarlama adımları ve cevap kartları görünür.
- Görev yalnız tahmin hedefini taşır; kalanlı/kalansız bölme algoritması göstermez.
- Yanlış cevapta kart kırmızı yanar ve AstroBot kısa ipucu verir.
- Doğru cevapta kart yeşil yanar ve görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni tahmin sayıları üretir.
- 2. ve 3. görevlerde sonuç havuzu yalnız 10'un katlarından oluşmaz; 25, 35, 45, 55 gibi kolay bölünen sonuçlar da gelir.
- Yatay taşma ve metin çakışması yoktur.

## Kaptan Onayı
- 2026-06-03: Kaptan canlı kontrolden sonra `Bölme Tahmini` atomunu Vitrin Hazır olarak onayladı.
