# 09-09 Gerçek Sayı Atlası ve İşlem Yasaları

## Amaç
9. sınıf `MAT.9.1.4.x` ve `MAT.9.1.5.x` atomlarını tek atlas makinesinde öğretmek: öğrenci sayı kümelerini ezber listesi olarak değil, kapsüllerin hangi katmanda yandığını görerek; işlem özelliklerini de parantez ve dağıtım kollarının aynı sonuca kapanmasıyla kurar.

## Atom Kapsamı
- `MAT.9.1.4.1`: Doğal sayıları tam sayılardan ayıran temel negatiflik özelliklerini ispatlar.
- `MAT.9.1.4.2`: Rasyonel ile irrasyonel kümenin birleşerek gerçek sayılar şemsiyesini oluşturduğunu diyagramda saptar.
- `MAT.9.1.5.1`: Toplama işleminin birleşme özelliğini denklemlerde kurgular.
- `MAT.9.1.5.2`: Çarpmanın toplama üzerine dağılma özelliğini ileri cebirsel ifadelerde kurgular.

## Kapsam Dışı
- `MAT.9.1.3.x` gerçek sayı aralıkları ayrı **Aralık Kapıları İstasyonu** modülünde yapılmıştır.
- `MAT.9.2.2.x` mutlak değer grafiği ayrı **Mutlak Değer Ayna Odası** modülüne bırakılır.
- `MAT.9.2.3.2` doğrusal eşitsizlik çözüm bölgesi ayrı **Eşitsizlik Güvenlik Alanı** modülünde yapılacaktır.

## Ana Oyuncak
Sahnede tek bir atlas makinesi vardır:
- Sayı kümeleri görevlerinde sayı kapsülleri `N`, `Z`, `Q`, irrasyonel ve `R` katmanlarına ışın gönderir.
- Birleşme yasasında iki farklı parantez yolu aynı toplam çekirdeğine bağlanır.
- Dağılma yasasında dış çarpan parantezin iki terimine ayrı kol gönderir.
- Sonuç cümlesi ve eşitlik mührü yalnız `Kontrol Et` sonrası açılır.

## Görev Akışı
1. Negatif kapı ayrımı: 8 setli örnek havuzundan gelen negatif sayı tam sayıdır, doğal sayı değildir.
2. Gerçek sayı şemsiyesi: Aynı setten gelen rasyonel sayı ve köklü irrasyonel sayı `R` şemsiyesinde birleşir.
3. Toplamda birleşme: `(a + b) + c` ve `a + (b + c)` aynı toplam çekirdeğine bağlanır.
4. Çarpmanın dağılması: Setten gelen `k(x + c)` ifadesi için `x` kolu ve sabit kol birlikte çalışır; sonuç kontrol sonrası mühürlenir.

## QA Başarı Kriteri
- `/embed/numbers/real-number-law-atlas?qa=1` açılır.
- `real-number-law-atlas-scene`, `real-number-law-atlas-controls`, `real-number-law-atlas-check`, `real-number-law-atlas-reset` görünür.
- Sayı kümesi görevlerinde `real-number-law-atlas-natural`, `real-number-law-atlas-integer`, `real-number-law-atlas-rational`, `real-number-law-atlas-irrational`, `real-number-law-atlas-real` kontrolleri çalışır.
- İşlem yasası görevlerinde `real-number-law-atlas-left-group`, `real-number-law-atlas-right-group`, `real-number-law-atlas-x-arm`, `real-number-law-atlas-constant-arm` kontrolleri çalışır.
- Yanlış kilitleme AstroBot hata mesajı üretir.
- Dört görev completion ekranına ulaşır.
- `npm run module:check -- real-number-law-atlas`, `npx tsc --noEmit`, `npm run build`, `git diff --check`, console ve desktop görsel smoke temizdir.
