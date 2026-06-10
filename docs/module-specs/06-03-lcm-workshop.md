# 06-03 EKOK Ritim Atölyesi

- Module ID: `lcm-workshop`
- Route: `/embed/numbers/lcm-workshop`
- Band: `ortaokul`
- Grade: 6
- Status: showcase-ready

## Atom Kapsami

- `MAT.6.1.1.2`: Bir sayinin ritmik katlarini oruntuler.
- `MAT.6.1.4.1`: Iki verinin en kucuk ortak katini kullanarak ritmik karsilasma problemlerini cozer.

## Kapsam Disi

- EBOB ve en buyuk es parca problemleri ayri EBOB Parca Atolyesi'ndedir.
- Asal sayilar ve bolunebilme kurallari ayri sayi atomlarinda calisilir.

## Ana Oyuncak

Tek sahne buyuk bir **ritim hedefi ve secenek panosu**dur. Ogrenci tekrar eden iki olay icin ilk ortak zamani bulur.

## Gorev Zinciri

1. Basit iki ritmin ilk ortak zamani secilir.
2. Orta zorlukta nobet/isik ritmi icin ilk ortak zaman bulunur.
3. Gunluk zaman problemi EKOK ile cozulur.
4. Daha buyuk sayili iki dongunun ilk kesisimi secilir.

## Degisken Sayi Havuzu

- Gorevler 3-5, 4-6, 5-10, 6-8, 6-15, 7-14, 8-12, 8-18, 9-12, 9-15, 10-15, 12-18, 12-20, 14-21, 15-25, 16-20 veya 18-24 sayi ciftlerinden secilebilir.
- Secenek sirasi karistirilir; dogru cevap sabit konumda kalmaz.
- Tekrar oynama veya sifirlama sonrasi yakin zamanda gelen sayi ciftleri tekrar secilmemeye calisilir.

## QA Plani

- `/embed/numbers/lcm-workshop?qa=1&audit=ortaokul` acilir.
- Ilk 3 saniyede konunun EKOK/ilk ortak zaman oldugu anlasilir.
- Yanlis secimde ortak bolen degil, ortak kat gerektigi soylenir.
- Dogru secimler dort kisa gorev boyunca ilerler ve completion ekrani acilir.
- `npm run module:check -- lcm-workshop`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Kapanis Notu

Bu modul ortaokul hattindadir ve 2026-06-07 Kaptan canli onayiyla showcase-ready yapilmistir.
