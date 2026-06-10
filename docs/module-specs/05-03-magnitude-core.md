# 05-03 Sayıları Bölüklere Ayırma

## Amaç
5. sınıf öğrencisinin 7, 8 ve 9 basamaklı doğal sayıları sağdan üçerli bölüklere ayırarak okumasını sağlamak. Mikro modda öğrenci olasılığın 0 ile 1 arasında kaldığını görür; böylece büyük sayı ve olasılık ölçeği aynı sayı okuryazarlığı hattında birleşir.

## Atom Kapsamı
- `MAT.5.1.1.1`: 7 basamaklı milyonlu sayıları abaküs/şekil ile okur.
- `MAT.5.1.1.2`: 8 basamaklı (on milyonlar) sayıları abaküs ile okur.
- `MAT.5.1.1.3`: 9 basamaklı (yüz milyonlar) sayıları abaküs ile okur.
- `MAT.5.6.1.1`: Olasılığın 0'dan küçük, 1'den büyük olamayacağını sayı doğrusunda (0, 1/2, 1) doğrular.

## Kapsam Dışı
- Altı basamak ve daha küçük doğal sayılar bu modülün ana odağı değildir.
- Ondalık gösterim, yüzdeler ve kesir karşılaştırma bu modülün hedefi değildir.
- Olasılıkta deneysel frekans, örnek uzay ve ayrıntılı olasılık hesapları bu modüle alınmaz.

## Ana Oyuncak
Tek ana oyuncak sayı bölükleme sahnesidir:
- Öğrenci rakamların arasına ayırıcı lazerler yerleştirir.
- Sistem sağdan üçerli grup kuralına göre doğru bölükleri kilitler.
- Doğru ayırma sonrası milyonlar, binler ve birler bölükleri ayrışarak görünür.
- Mikro modda olay kartları 0, 1/2 ve 1 olasılık çizgisiyle eşleştirilir.

## Görev Akışı
1. Öğrenci 7, 8 veya 9 basamaklı sayıyı görür.
2. Ayırıcıları sağdan başlayarak üçerli bölükleri oluşturacak konumlara koyar.
3. `Bölükleri Ayır` ile kararını test eder.
4. Yanlışta AstroBot sağdan üçerli sayma kuralını açıklar.
5. Doğruda `Sıradaki Sayıya Geçelim` ile yeni sayıya geçilir.
6. Makro ve mikro görevler tamamlandığında modül tamamlanır.

## UI/UX Kriterleri
- Başlık ve dashboard kart adı `Sayıları Bölüklere Ayırma` olmalıdır.
- İlk üç saniyede ana oyuncak büyük sayı ve ayırıcı lazerler olarak okunmalıdır.
- Ayırıcılar doğrudan tıklanabilir olmalı; öğrenci hangi aralığı seçtiğini hemen görmelidir.
- Yanlış cevapta "sağdan üçerli bölükleme" nedeni açıkça söylenmelidir.
- Başarı sonrası bölük adları ekranda taşmadan görünmelidir.

## QA Başarı Kriteri
- `/embed/numbers/magnitude-core` açılır.
- Başlıkta `Sayıları Bölüklere Ayırma` görünür.
- Dashboard 5. sınıf kartında `Sayıları Bölüklere Ayırma` görünür.
- Yanlış ayırıcı seçimi AstroBot hata mesajı üretir.
- Doğru ayırıcı seçimi bölükleri ayırır ve `Sıradaki Sayıya Geçelim` butonunu gösterir.
- `npm run module:check -- magnitude-core`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
