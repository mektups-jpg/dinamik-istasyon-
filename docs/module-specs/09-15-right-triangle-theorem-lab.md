# 09-15 Dik Üçgen Teorem Laboratuvarı

## Module ID

`right-triangle-theorem-lab`

## Route

`/embed/geometry/right-triangle-theorem-lab`

## Atom Kapsamı

- `MAT.9.5.3.1`: Birbirine paralel kesitler arasında Tales teoreminin "Parça-Bütün" orantısını kurgular.
- `MAT.9.5.3.2`: Dik açılı üçgenin dik açısından inen yüksekliğiyle zemin arasında (Öklid: h²=p.k) kod şifresini yazar.
- `MAT.9.5.3.3`: Dik üçgenlerin kenarları arasında kurgulanmış zor Pisagor problemlerini harfli ifadelerle denklemleştirir.

## Öğrenme Oyuncağı

Öğrenci tek bir dik üçgen laboratuvarında üç teorem kapısını çalıştırır. Tales görevinde paralel kesit aynı anda iki kenarda aynı parça-bütün oranını yakar. Öklid görevinde dik açıdan hipotenüse inen yükseklik `h²` alan karesini ve `p · k` hipotenüs parça çarpımını sahnede eşler. Pisagor görevinde harfli dik kenarlar kare parçalarına dönüşür ve hipotenüs karesiyle denklem köprüsü kurulur.

## Sızıntı Kuralı

- Teorem sonucu ve nihai denklem testten önce görünmez.
- Parça seçimi yalnız sahnede önizleme ve kanıt hattı oluşturur.
- `Teoremi Test Et` geçmeden sonuç mührü `???` kalır.

## Test ID Sözleşmesi

- `right-triangle-theorem-lab-scene`
- `right-triangle-theorem-lab-controls`
- `right-triangle-theorem-lab-check`
- `right-triangle-theorem-lab-reset`
- `right-triangle-theorem-lab-tool-tales-slice-3-5`
- `right-triangle-theorem-lab-tool-euclid-height-square`
- `right-triangle-theorem-lab-tool-pythagoras-sum-equation`

## QA Planı

- Başlangıçta teorem sonucu ve denklem gizli kalacak.
- Yanlış parça seçimi AstroBot alarmı verecek.
- Tales, Öklid ve Pisagor görevleri test sonrası ayrı ayrı mühürlenecek.
- Üç görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- right-triangle-theorem-lab`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.

## Durum

`Review Needed`. Kaptan canlı görsel onayı olmadan `Showcase Ready` yapılmayacak.
