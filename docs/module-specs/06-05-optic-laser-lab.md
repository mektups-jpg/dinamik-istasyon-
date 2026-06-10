# 06-05 Paralel Doğrularda Açılar

- Module ID: `optic-laser-lab`
- Route: `/embed/geometry/optic-laser-lab`
- Band: `ortaokul`
- Grade: 6
- Status: showcase-ready

## Atom Kapsami

- `MAT.6.3.1.1`: Iki paralel dogruyu kesen bir cizginin olusturdugu ic ters acilari eslestirir.
- `MAT.6.3.1.2`: Yondes acilari ayni yon iliskisiyle kanitlar.
- `MAT.6.3.1.3`: Dis ters aci ciftlerini eslestirir.
- `MAT.6.3.2.1`: U kurali gibi aci kombinasyonlarini kullanarak aci ciftlerini yorumlar.

## Kapsam Disi

- Kosegenle dortgen teshisi bu atomda yoktur.
- Ucgen, yamuk ve paralelkenar ic aci problemleri ayri geometri atomu gerektirir.

## Ana Oyuncak

Tek sahne buyuk bir **paralel dogru ve kesen aci panosu**dur. Ogrenci iki aci bolgesine dokunarak ic ters, yondes, U kurali ve dis ters aci ciftlerini secer.

## Gorev Zinciri

1. Ic ters acilar Z kuraliyla eslestirilir.
2. Yondes acilar ayni yon iliskisiyle secilir.
3. U kurali ic aci ciftiyle yorumlanir.
4. Dis ters acilar son kilitte eslestirilir.

## Ad Karari

- Eski ad `Optik Lazer Labirenti` oyun hissi tasiyordu ancak MEB kazanimi ilk bakista gorunmuyordu.
- Yeni ad `Paralel Doğrularda Açılar` 6. sinif ogrencisine konuyu ilk 3 saniyede soyler.
- Route/id korunur: `optic-laser-lab`.

## QA Plani

- `/embed/geometry/optic-laser-lab?qa=1&audit=ortaokul` acilir.
- Ilk 3 saniyede konunun paralel dogru, kesen ve aci ciftleri oldugu anlasilir.
- Yanlis iki aci seciminde kural eslesmesi bozuldugu soylenir.
- Dogru secimler gorev zincirini ilerletir.
- `npm run module:check -- optic-laser-lab`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

## Kapanis Notu

Bu modul ortaokul hattindadir. 2026-06-10 Kaptan canli onayiyla showcase-ready olarak isaretlenmistir.

## Showcase Kaydi

- 2026-06-10: Kaptan canli onayi: "bu atomu da vitrin hazır şeklinde kaydet".
- Browser canli akista dort gorev tamamlandi; completion, tekrar oyna, ana merkeze donus ve console temizligi dogrulandi.
- Dashboard etiketi `Vitrin Hazır` olacak sekilde registry status showcase-ready yapildi.
