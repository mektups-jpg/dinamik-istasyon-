# 06-02 Asal Sayılar Atölyesi

- Module ID: `prime-numbers-workshop`
- Route: `/embed/numbers/prime-numbers-workshop`
- Band: `ortaokul`
- Grade: 6
- Status: showcase-ready

## Atom Kapsami

- `MAT.6.1.3.1`: 100'e kadar asal sayilari kalbur mantigiyla ayirir.
- `MAT.6.1.3.2`: Asal olmayan sayiyi asal carpanlara ayirir.

## Kapsam Disi

- Bolunebilme kurallari yalniz destek bilgisi olarak kullanilir; asil odak asal sayi ve asal carpan zinciridir.
- EBOB/EKOK karar problemleri ayri EBOB-EKOK Atolyesi'ndedir.

## Ana Oyuncak

Tek sahne buyuk bir **hedef aralik / hedef sayi ve secenek panosu**dur. Ogrenci once asal sayilari secer, sonra bir sayinin asal carpan zincirini ayirt eder.

## Gorev Zinciri

1. Temel aralikta 1'in asal olmadigi ve 2, 3, 5, 7 gibi ilk asal sayilar ayrilir.
2. Daha genis bir aralikta kalbur mantigiyla bileşik sayilar elenir.
3. Hedef sayi asal carpan zincirinde en kucuk asal parcalara kadar secilir.

## Degisken Sayi Havuzu

- Temel asal ayirma gorevinde hedef aralik 1-10, 1-12, 1-15 veya 1-18 olabilir.
- Genis asal ayirma gorevinde hedef aralik 11-20, 21-30, 31-40, 41-50, 51-60, 71-80 veya 89-100 olabilir.
- Asal carpan zincirinde hedef sayi 36, 45, 56, 60, 72, 84, 90, 96, 98 veya 105 olabilir.
- Asal carpan zinciri gorevinde cevap secenekleri her calismada karistirilir; dogru cevap sabit ilk sirada kalmaz.
- Tekrar oynama veya sifirlama sonrasi ayni turdaki hedefler tekrar secilmemeye calisilir.

## QA Plani

- `/embed/numbers/prime-numbers-workshop?qa=1&audit=ortaokul` acilir.
- Ilk 3 saniyede hedef aralik ve asal sayi odağı anlasilir.
- Yanlis secimde neden asal olmadigi aciklanir.
- Dogru secimler uc kisa gorev boyunca ilerler ve completion ekrani acilir.
- `npm run module:check -- prime-numbers-workshop`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Kapanis Notu

Bu modul ortaokul hattindadir. 2026-06-07 Kaptan canli onayiyla showcase-ready olarak isaretlenmistir.
