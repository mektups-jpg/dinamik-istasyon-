# Module Design Guide

Bu rehber, yeni matematik modulleri tasarlanirken kullanicinin tercihlerini ve projenin urun kalitesi cizgisini korumak icin yazildi. `docs/MEB_ATOMLARI.md` kazanimin SSOT kaynagidir; bu dosya kazanimi nasil deneyime donusturecegimizi tarif eder.

## Kullanici Tercihleri
- 3D silindir/prizma modullerindeki gibi acma-kapama, dondurme, buyutme/kucultme ve yakindan inceleme hissi cok degerli.
- 1. sinif modullerindeki sade, oyunlu, tek bakista anlasilir akislara geri donulmeli.
- Apple Education benzeri temiz, modern ve premium gorunum tercih edilir; ama deney hissi steril olmamali, ogrenci oynadigini hissetmeli.
- Her modulun kendi kimligi olmali. Sadece GameHeader, AstroBot, progress/completion ve QA davranisi ortak kalmali.
- Moduller "ayni panelin baska konusu" gibi gorunmemeli.

## Tasarim Filtresi
Her modul fikri uygulanmadan once su sorulari gecmelidir:

1. Ogrenci ilk 3 saniyede neyi tutup, oynatip, degistirecegini anliyor mu?
2. Bu konu kagitta zor olup yazilimla gorunur hale geliyor mu?
3. Ana sahnede tek guclu deney mi var, yoksa cok konu ayni ekrana mi yigilmis?
4. Gorsel ogelerin her biri matematiksel anlam tasiyor mu?
5. Kontroller sahneye dogrudan etki ediyor mu, yoksa sadece cevap secimi mi yaptiriyor?
6. Yanlis denemede neyin neden yanlis oldugu AstroBot ve sahne uzerinden goruluyor mu?
7. Embed ve mobil gorunumde ilk oyuncak, temel kontroller ve onay aksiyonu kaybolmadan gorunuyor mu?

## Tercih Edilen Etkilesim Kaliplari
- Surukle ve hizala: nokta, vektor, parca, token, merkez, eksen.
- Ac/kapat: 3D cisim acinimi, kapilar, ispat katmanlari, mutlak deger aynasi.
- Dondur ve cevir: aci halkasi, trigonometri cemberi, donusum merkezi, kamera.
- Uste bindir ve kilitle: benzerlik, donusum izi, grafik donusumu, denk kesir.
- Sıkistir/genislet: veri dagilimi, parabol, fonksiyon, olcek.
- Tarat/scan et: olasilik radari, hata bulma, kesit alma, turev/egim okuyucu.

## Kacinilacaklar
- Tek modul icinde cok fazla atomu ayni anda gostermek.
- Cok sayida kart, metin ve butonu ayni gorunume doldurmak.
- Matematiksel anlam tasimayan dekoratif sekiller kullanmak.
- Slider ve cevap butonlarini ana deneyin yerine koymak.
- Ortak shell'in modullere ayni gorsel kimligi dayatmasi.
- Sadece guzel gorunen ama ogrencinin kavrami daha iyi anlamasini saglamayan animasyonlar.

## 10 ve 11. Sinif Icin Uygulama Notu
10. ve 11. sinif modulleri genis kapsamli oldugu icin planlama "sinif bolumu" degil, "makro atom deneyleri" seklinde yapilacak. Bir modul bir ana kavrami ogretecek; gerekirse ayni unite birden fazla cilali mini deney olarak ayrilacak. Kalite hedefi, 3D geometri modullerindeki dokunulabilirlik ile 1. sinif modullerindeki sadeligi lise seviyesine tasimaktir.
