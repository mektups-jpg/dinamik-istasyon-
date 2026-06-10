# 04-07 Olasılık Etiketleri

## Kimlik
- Modül id: `probability-label-lab-4`
- Route: `/embed/data/probability-label-lab-4`
- Sınıf: 4
- Durum: showcase ready
- Kategori: Olasılık

## Atom Kapsamı
- `MAT.4.4.1.1`: Olmayacak durumu imkânsız olarak etiketler.
- `MAT.4.4.1.2`: Kesin olacak durumu kesin olarak etiketler.
- `MAT.4.4.1.3`: Arada kalan durumu olabilir olarak etiketler.

## Öğrenci Deneyimi
Çocuk kapsül torbasını veya olay cümlesini görür. Ekranda yalnız üç güçlü karar vardır: imkânsız, kesin, olabilir. Yanlışta sebep hatırlatılır; doğruda bir sonraki olasılık durumu açılır.

## Görev Akışı
1. İmkânsız olayı seç.
2. Kesin olayı seç.
3. Olabilir olayı seç.

## Zorunlu Test Idleri
- `probability-label-lab-4-stage`
- `probability-label-lab-4-control-panel`
- `probability-label-lab-4-choice`
- `probability-label-lab-4-feedback`
- `probability-label-lab-4-complete`
- `probability-label-lab-4-restart`

## QA Kontrol Listesi
- İlk 3 saniyede kapsül modeli ve üç cevap etiketi görünür.
- Yanlış cevapta anlık renk ve AstroBot ipucu gelir.
- Doğru cevapta görev ilerler.
- Completion ekranı, tekrar oynama ve ana merkeze dönüş çalışır.
- Tekrar oynama her kategori için farklı çocuk-dostu senaryo üretir.
- Yatay taşma ve metin çakışması yoktur.
