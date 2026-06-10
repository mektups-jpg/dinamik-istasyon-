# 04-12 Problem Kur ve Çöz Atölyesi

## Kimlik
- Modül id: `problem-studio-4`
- Route: `/embed/algebra/problem-studio-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Cebir

## Atom Kapsamı
- `MAT.4.2.7.1`: Parantezler ve farklı dört işlemler içeren ileri seviye bir metin problemini sonlandırır.
- `MAT.4.2.8.1`: Verilen sayılar ve 4 farklı işlem türüyle kendi mantıklı hikaye problemini tasarlar.

## Öğrenci Deneyimi
Öğrenci hikaye işlem stüdyosunda önce işlem sırasını seçer, sonra kısa bir hikayeyi işleme çevirip çözer ve son görevde verilen işleme uygun mantıklı hikayeyi seçer.

## Görev Akışı
1. Parantezli işlemde ilk yapılacak adımı seç.
2. Kısa hikaye problemini doğru işlem sonucuna bağla.
3. Verilen işleme uygun problem hikayesini seç.

## Zorunlu Test Idleri
- `problem-studio-4-stage`
- `problem-studio-4-control-panel`
- `problem-studio-4-choice`
- `problem-studio-4-feedback`
- `problem-studio-4-complete`
- `problem-studio-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede işlem/hikaye, adım kartları ve cevap kartları görünür.
- Yanlış cevapta kart kırmızı yanar ve AstroBot sınıf seviyesine uygun ipucu verir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama yeni sayılar veya yeni hikaye bağlamı üretir.
- Yatay taşma ve metin çakışması yoktur.

## Kaptan Onayı
- 2026-06-03: Kaptan canlı ekranda Türkçe ek ve hikaye dili cilası sonrası modülün `Vitrin Hazır / Showcase Ready` olarak işaretlenmesini onayladı.
