# 06-06 Geometrik Alan ve Pi Laboratuvari

- Module ID: `area-pi-lab`
- Route: /embed/geometry/area-pi-lab
- Band: ortaokul
- Grade: 6
- Status: review-needed

## Atom Kapsamı

- `MAT.6.4.1.1`: Uzunluk 10 kat buyurken alanin 100 kat buyudugunu birim donusumuyle gosterir.
- `MAT.6.4.2.1`: Dikdortgeni ikiye ayirarak ucgen alaninin taban x yukseklik / 2 oldugunu gosterir.
- `MAT.6.4.2.2`: Paralelkenar alaninin dikdortgen alan bagintisiyla iliskisini gosterir.
- `MAT.6.4.3.1`: Alan formullerini gercek yasam modeli uzerinden yorumlatir.
- `MAT.6.4.4.1`: Cemberin cevresini capina bolerek yaklasik 3,14 oranina ulasir.
- `MAT.6.4.5.1`: Yari cap bilgisiyle cember cevresi iliskisini kullanir.
- `MAT.6.4.6.1`: Merkez acinin cember yayina oranla nasil yansidigini gosterir.

## Ana Oyuncak

Modul iki deney masasindan olusur. Ilk masada ogrenci dikdortgen, ucgen ve paralelkenar alan iliskisini gorur. Ikinci masada tekerlek bir tam tur yuvarlanir; sarı iz cevreyi temsil eder ve ogrenci cevre / cap oraninin yaklasik 3,14 oldugunu kendisi secer.

## Pi Akisi

1. Ogrenci Pi sekmesine gecer.
2. Tekerlegi bir tur yuvarlar.
3. Cevreyi capa bolme sonucu icin 2, 3,14 ve 6,28 arasindan secim yapar.
4. Yanlis secimde neden yanlis oldugu aciklanir.
5. Dogru secimde Pi kaniti ve 90 derece yay orani gorunur.

## Kalite Notu

- Eski "gizemli Pi yörüngesi" dili 6. sinif icin fazla kapaliydi; gorunur sekme "Pi: Cevre / Cap" olarak sadelestirildi.
- Pi sonucu artik sayfa acilisinda hazir verilmez; ogrenci once bir tur deneyini gorur, sonra orani secer.
- "R (Cap)" notasyonu yerine `d` cap ve `C` cevre ayrimi yapildi.
- Bu kayit Kaptan onayi olmadigi icin vitrin hazir degildir.

## QA Plani

- /embed/geometry/area-pi-lab?qa=1&audit=pi-pedagogy acilir.
- Pi sekmesi acilir ve ilk ekranda Pi sonucunun hemen verilmedigi dogrulanir.
- "Bir Tur Yuvarla" calisir.
- Yanlis cevapta gerekceli hata mesaji gelir.
- Dogru cevapta Pi kaniti ve merkez aci/yay bolumu acilir.
- `npm run module:check -- area-pi-lab`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
