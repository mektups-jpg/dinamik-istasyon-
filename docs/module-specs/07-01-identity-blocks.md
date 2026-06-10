# 07-01 Özdeşlik Blokları

## Durum

Review Needed. Ortaokul üretim hattında canlı tarayıcı incelemesiyle eski prototipten büyük ana oyuncaklı dağılım alan fabrikasına taşındı; Showcase Ready değildir.

## Amaç

7. sınıf öğrencisine cebirsel ifadelerin çarpımında genişletme kuralını ezber formül olarak değil, `(a + b)` kenarlı alanı dört parçaya ayırarak doğrulatmak.

## Atom Kapsamı

- `MAT.7.2.1.1`: Rasyonel sayılarla cebirsel ifadelerin çarpımındaki (Dağılma özelliği) genişletme kurallarını doğrular.

## Kapsam Dışı

- 8. sınıf özdeşlik ezberi veya çarpanlara ayırma hedefi değildir.
- Sembolik denklem çözme akışı Equation Lab içinde kalır.

## Ana Oyuncak

Tek sahne bir **Dağılım Alan Fabrikası**dır:

- Öğrenci `a²`, iki farklı yönlü `ab` ve `b²` parçalarını sürükler veya seçip yuvaya dokunur.
- Hedef alan, `a` ve `b` kenar etiketleriyle dört ölçü yuvasına ayrılır.
- Yanlış yuvada AstroBot neden ölçünün uymadığını söyler.
- Tüm parçalar oturduğunda dağılım zinciri `a(a + b) + b(a + b) = a² + ab + ab + b²` olarak görünür.

## Görev Akışı

1. `a²` parçasını sol üst `a × a` karesine yerleştir.
2. Dikey `ab` parçasını üst sağ `b × a` dikdörtgenine yerleştir.
3. Yatay `ab` parçasını alt sol `a × b` dikdörtgenine yerleştir.
4. `b²` parçasını alt sağ `b × b` karesine yerleştir.

## Route

- `/embed/algebra/identity-blocks`

## Test ID Kontratı

- `identity-feedback`
- `identity-reset`
- `identity-scene`
- `identity-slot-*`
- `identity-block-*`

## QA Planı

- `npm run module:check -- identity-blocks`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/identity-blocks?qa=1` açılır.
  - Yanlış yuva seçimi `Neden uymadı?` geri bildirimi üretir.
  - Dört doğru yerleşim tamamlanınca `Alan tamamlandı` görünür.
  - Console warning/error kontrolü yapılır.
