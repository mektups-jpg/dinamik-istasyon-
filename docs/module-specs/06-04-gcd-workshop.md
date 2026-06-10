# 06-04 EBOB Parca Atölyesi

- Module ID: `gcd-workshop`
- Route: `/embed/numbers/gcd-workshop`
- Band: `ortaokul`
- Grade: 6
- Status: showcase-ready

## Atom Kapsami

- `MAT.6.1.4.2`: Iki verinin en buyuk ortak bolenini kullanarak es parcalara ayirma problemlerini cozer.

## Kapsam Disi

- EKOK ve ilk ortak zaman problemleri ayri EKOK Ritim Atolyesi'ndedir.
- Asal sayilar ve bolunebilme kurallari ayri sayi atomlarinda calisilir.

## Ana Oyuncak

Tek sahne buyuk bir **es parca hedefi ve secenek panosu**dur. Ogrenci artmadan paylastirma/kesme durumunda en buyuk es parca uzunlugunu veya grup buyuklugunu secer.

## Gorev Zinciri

1. Basit iki uzunluk en buyuk es parcaya ayrilir.
2. Kurdele/etiket gibi gunluk es paylastirma problemi cozulur.
3. Koli/kablo gibi daha buyuk iki miktar icin en buyuk es grup bulunur.
4. Son gorevde daha buyuk iki sayi artmadan es parcalara ayrilir.

## Degisken Sayi Havuzu

- Gorevler 12-20, 16-28, 18-24, 24-40, 27-36, 28-42, 30-45, 36-48, 36-60, 40-64, 42-56, 45-75, 48-80, 54-72, 63-81 veya 66-88 sayi ciftlerinden secilebilir.
- Secenek sirasi karistirilir; dogru cevap sabit konumda kalmaz.
- Tekrar oynama veya sifirlama sonrasi yakin zamanda gelen sayi ciftleri tekrar secilmemeye calisilir.

## QA Plani

- `/embed/numbers/gcd-workshop?qa=1&audit=ortaokul` acilir.
- Ilk 3 saniyede konunun EBOB/en buyuk es parca oldugu anlasilir.
- Yanlis secimde ortak kat degil, ortak bolen gerektigi soylenir.
- Dogru secimler dort kisa gorev boyunca ilerler ve completion ekrani acilir.
- `npm run module:check -- gcd-workshop`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Kapanis Notu

Bu modul ortaokul hattindadir ve 2026-06-07 Kaptan canli onayiyla showcase-ready yapilmistir.
