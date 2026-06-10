# 05-04 Kesir Tanklari

## Durum

Showcase Ready. Ortaokul 5. sinif uretim hattinda `fraction-synchronizer` modulu Kaptan canli onayiyla vitrine alinmistir.

## Amac

5. sinif ogrencisine tam sayili kesri bilesik kesre cevirme ve paydalari esitleyerek kesir karsilastirma kuralini iki buyuk kesir tanki uzerinden gostermek.

## Atom Kapsami

- `MAT.5.1.3.2`: Tam sayili kesri, bilesik kesre cevirme simulasyonunu uygular.
- `MAT.5.1.4.1`: Paydalari farkli iki kesrin denk payda yontemiyle buyuklugunu siralar.

## Kapsam Disi

- Ondalik gosterim, yuzde ve kesirlerle dort islem yoktur.
- 6-8. sinif cebirsel kesir veya oran-oranti akisi degildir.

## Ana Oyuncak

Tek sahne iki buyuk **Kesir Tanki**dir:

- Sol tankta tam sayili kesir baslar.
- Ogrenci vanayi cevirerek tamlari esit parcalara ayirir ve bilesik kesri kurar.
- Ogrenci sol tanki dogru katsayi ile genisletip paydalari esitlemek zorundadir.
- Paydalar esitlenince hangi tankta daha cok parca oldugunu secer.
- Her yeni oyun/reload genis gorev havuzundan uc farkli kesir tanki gorevi secer; ilk gorev surekli ayni sayilarla baslamaz.
- Uc gorevlik sette genisletme katsayilari 2, 3 ve 4 olarak cesitlenir; ogrenci payda esitlemeyi tek bir katsayi ezberiyle yapmaz.
- Uc kesir tanki gorevi tamamlanmadan completion ekrani acilmaz.
- Yanlis hamlede AstroBot neden yanlis oldugunu soyler.

## Gorev Akisi

1. `Cevir`: Sol tanktaki tam sayili kesri bilesik kesre cevir.
2. `Esitle`: Sol tankin paydasini sag tankin paydasi ile esitleyecek genisletme katsayisini sec.
3. `Karsilastir`: Paydalar esitken payi buyuk olan kesri sec.
4. Ayni akisi uc farkli kesir gorevinde uygula.
5. Completion ekrani tekrar oynama ve ana merkeze donus komutlarini gosterir.

## Route

- `/embed/numbers/fraction-synchronizer`

## Test ID Kontrati

- `fraction-synchronizer-stage`
- `fraction-valve`
- `fraction-expand-correct`
- `fraction-expand-wrong`
- `fraction-compare-left`
- `fraction-compare-right`
- `fraction-replay`
- `fraction-home`

## QA Plani

- `npm run module:check -- fraction-synchronizer`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Canli QA:
  - `/embed/numbers/fraction-synchronizer?qa=1` acilir.
  - Baslangicta cocuk buyuk kesir tanklarini ve vanayi gorur.
  - Yanlis genisletme geri bildirim verir.
  - Dogru genisletme karsilastirma adimina gecirir.
  - Yanlis karsilastirma neden yanlis oldugunu soyler.
  - Dogru karsilastirma ilk iki gorevde siradaki goreve gecirir.
  - Ucuncu dogru karsilastirma completion ekranini acar.
  - Tekrar oynama, ana merkeze donus, Home fallback, console ve yatay tasma kontrol edilir.
