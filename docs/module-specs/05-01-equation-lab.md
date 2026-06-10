# 05-01 Denklem Terazisi

## Durum

Showcase Ready. Ortaokul üretim hattında aktif Denklem Terazisi deneyidir; 2026-05-25 Kaptan canlı görsel onayıyla vitrine alınmıştır.

## Amaç

5. sınıf öğrencisine işlem önceliği ve eşitliğin korunumu kurallarını iki ayrı panel ezberi gibi değil, aynı denklem terazisinde yapılan görünür hamleler olarak doğrulatmak.

## Atom Kapsamı

- `MAT.5.2.1.1`: Terazinin iki kefesinde yer alan denklem dengesinin korunması kuralını ispatlar.
- `MAT.5.2.1.2`: Terazinin bir kefesine işlem yapıldığında diğer kefeye de aynı yapıldığında eşitliğin bozulmadığını uygular.
- `MAT.5.2.2.1`: Birden fazla işlemin olduğu satırda önce "Parantez İçi"nin yapılması kuralını işletir.
- `MAT.5.2.2.2`: Parantezden sonra "Çarpma/Bölme", en son "Toplama/Çıkarma" yapılacağını oyun algoritmasında uygular.

## Kapsam Dışı

- 7-8. sınıf sembolik denklem çözümü değildir.
- Cebirsel özdeşlik veya çarpanlara ayırma akışı Identity Blocks içinde kalır.

## Ana Oyuncak

Tek sahne bir **Denklem Terazisi**dir:

- Öncelik görevinde öğrenci parantez/çarpma kalkanını seçer, ara sonucu ve toplam sonucu kilitler.
- Eşitlik görevinde öğrenci iki kefeye aynı işlemi uygular, `x` değerini ortaya çıkarır.
- Yanlış seçimde AstroBot hangi kuralın neden bozulduğunu söyler.
- `Home` tuşu QA fallback olarak laboratuvarı başa alır.

## Görev Akışı

Her yeni oturum/yeniden başlatma aynı atomları koruyan 8 farklı görev setinden birini getirir.

1. `İşlem önceliğini belirle`: örnek olarak `8 + (3 × 4)`, `6 + (2 × 5)`, `9 + (4 × 3)`, `10 + (18 ÷ 3)` gibi ifadelerde önce parantez içindeki çarpma/bölme işlemini seç, ara sonucu ve toplam sonucu kilitle.
2. `Eşitliği koru`: örnek olarak `x + 5 = 17`, `x + 7 = 22`, `x - 4 = 13`, `x + 9 = 30` gibi terazilerde iki kefeye aynı işlemi uygula ve `x` değerini kilitle.
3. Seçeneklerde doğru cevap konumu görevden göreve değişir; öğrenci "ortadaki doğru" kestirmesine yönlendirilmez.

## Route

- `/embed/algebra/equation-lab`

## Test ID Kontratı

- `equation-lab-scene`
- `equation-feedback`
- `equation-reset`
- İlk görev seti için geriye dönük seçim ID'leri:
- `priority-shield`
- `priority-option-12`
- `priority-final-20`
- `balance-operation-minus-5`
- `balance-answer-12`
- `equation-check`

## QA Planı

- `npm run module:check -- equation-lab`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/equation-lab?qa=1` açılır.
  - Yeniden başlatma/yenileme sonrası gelen işlem örneğinin görev setleri arasında değiştiği gözlenir.
  - Yanlış öncelik seçimi `Neden yanlış?` geri bildirimi üretir.
  - Öncelik görevi doğru tamamlanır.
  - Eşitlik görevi doğru tamamlanır.
  - Completion paneli görünür, console warning/error kontrol edilir.
