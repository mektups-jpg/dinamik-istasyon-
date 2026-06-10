# 06-01 Bölünebilme Atölyesi

- Module ID: `divisibility-workshop`
- Route: `/embed/numbers/divisibility-workshop`
- Band: `ortaokul`
- Grade: 6
- Status: showcase-ready

## Atom Kapsami

- `MAT.6.1.1.1`: Verilen bir dogal sayinin tam bolen carpanlarini eksiksiz listeler.
- `MAT.6.1.2.1`: Cift sayilarin 2'ye bolunebilirligini son rakamdan saptar.
- `MAT.6.1.2.2`: Son rakami 0 olanlarin 5'e bolunebilirligini ayiklar.
- `MAT.6.1.2.3`: Son rakami 5 olanlarin 5'e bolunebilirligini ayiklar.
- `MAT.6.1.2.4`: Son rakami 0 olanlarin 10'a bolunebilirligini ayiklar.
- `MAT.6.1.2.5`: Rakam toplami 3'un kati olanlarin 3'e bolunebilirligini ispatlar.
- `MAT.6.1.2.6`: Rakam toplami 9'un kati olanlarin 9'a bolunebilirligini ispatlar.
- `MAT.6.1.2.7`: Hem 2'ye hem 3'e bolunen sayinin 6'ya bolunebilecegini test eder.

## Kapsam Disi

- Asal sayilar ve asal carpan agaci ayri Asal Sayilar Atolyesi'ndedir.
- EBOB/EKOK problem ayrimi ayri EBOB-EKOK Atolyesi'ndedir.

## Ana Oyuncak

Tek sahne buyuk bir **hedef sayi ve secenek panosu**dur. Ogrenci once hedef sayiyi okur, sonra carpan ya da bolunebilme kuralina uyan butun secenekleri secer.

## Gorev Zinciri

1. Havuzdan gelen bir hedef sayinin tam bolenleri eksiksiz secilir.
2. Son rakam odakli hedef sayida 2, 5 ve 10 kurallari ayrilir.
3. Rakam toplami odakli hedef sayida 3 ve 9 kurallari ayrilir.
4. Karisik hedef sayida 2, 3, 5, 6, 9 ve 10 kurallari birlikte kontrol edilir.

## Degisken Sayi Havuzu

- Carpan gorevinde hedef sayi 18, 24, 30 veya 36 olabilir.
- Son rakam gorevinde hedef sayi 80, 125 veya 250 olabilir.
- Rakam toplami gorevinde hedef sayi 306, 333 veya 729 olabilir.
- Karisik bolunebilme gorevinde hedef sayi 144, 198, 270, 315, 360 veya 420 olabilir.
- Tekrar oynama veya sifirlama sonrasi ayni turdaki hedefler tekrar secilmemeye calisilir.

## QA Plani

- `/embed/numbers/divisibility-workshop?qa=1&audit=ortaokul` acilir.
- Ilk ekranda buyuk hedef sayi, iki konu karti ve tum secenekler gorunur.
- Sayfayi yenileyince veya `Sifirla` kullaninca hedef sayilarin havuzdan degistigi kontrol edilir.
- Eksik secimde AstroBot hangi dogru seceneklerin eksik kaldigini soyler.
- Dogru secimler dort kisa gorev boyunca ilerler ve completion ekrani acilir.
- `npm run module:check -- divisibility-workshop`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Kapanis Notu

Bu modul ortaokul hattindadir. 2026-06-07 Kaptan canli onayiyla showcase-ready olarak isaretlenmistir.
