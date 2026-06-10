# 04-03 Kesir Denge Terazisi

## Modül

- Module id: fraction-balance-4
- Route: /embed/numbers/fraction-balance-4
- Sınıf: 4
- Statü: Showcase Ready / Vitrin Hazır. Kaptan canlı görsel onayıyla kilitlendi.

## SSOT Atomları

- MAT.4.1.6.1: Payı paydasından küçük olanların "Basit Kesir" olduğunu test eder.
- MAT.4.1.6.2: Payı paydasına eşit veya büyük olanların "Bileşik Kesir" olduğunu ayırt eder.
- MAT.4.1.6.3: Tam sayılı kesri modeller üzerinden birleştirerek kurgular.
- MAT.4.1.7.1: Bir kesrin pay ve paydasını aynı sayıyla çarparak denkliğini bozmadığını doğrular.
- MAT.4.1.7.2: Bir kesrin pay ve paydasını aynı sayıyla bölerek denkliğini bozmadığını doğrular.
- MAT.4.1.8.1: Payı 1 olan birim kesirlerin paydası büyüdükçe küçüldüğü kuralını uygular.
- MAT.4.1.9.1: Paydaları eşit olan kesirlerde payı büyük olanın daha büyük alanı kapladığını görselleştirir.
- MAT.4.1.10.1: Verilen bir çokluğun belirtilen bir basit kesir kadarını alır.
- MAT.4.1.10.2: Birim kesir kadarı verilen çokluğun tamamını geri inşa eder.
- MAT.4.1.11.1: Eşit paydalı kesirleri toplarken paydaya dokunmadan sadece payları birleştirir.
- MAT.4.1.11.2: Eşit paydalı kesirleri çıkarırken paydayı sabit tutup paydan eksiltir.
- MAT.4.1.12.1: Kesirlerin toplama ve çıkarmasını barındıran günlük yaşam problemini denkleme döker.

## Çocuk Deneyimi

- Öğrenci ilk 3 saniyede renkli kesir tanklarını, pay/payda rozetini ve büyük cevap kartlarını görür.
- Her görev farklı renkte gelir; kesir türü, denklik, kıyas ve işlem ekranları ayrışır.
- Yazı kısa tutulur; hedef cümlesi ve AstroBot ipucu aynı sınıf diliyle verilir.
- Yanlış kart kırmızı yanar, AstroBot kısa ipucu verir ve doğru cevap hemen söylenmez.
- Doğru kart yeşil yanar, sistem sıradaki kesir görevine geçer.
- Tekrar Oyna yeni kesirler ve cevap sıraları üretir.

## Test Notları

- Route: /embed/numbers/fraction-balance-4
- Sahne test id: `fraction-balance-4-stage`
- Panel test id: `fraction-balance-4-control-panel`
- Cevap kartları test id: `fraction-balance-4-choice`
- Feedback test id: `fraction-balance-4-feedback`
- Completion test id: `fraction-balance-4-complete`
- Tekrar oynama test id: `fraction-balance-4-restart`
- Yanlış deneme: seçilen kart kırmızı yanmalı ve AstroBot kısa ipucu vermeli.
- Doğru deneme: seçilen kart yeşil yanmalı ve görev ilerlemeli.
- Completion: kazanılan atomlar listesi, Tekrar Oyna ve Ana Merkez görünmeli.
- Tam sayılı kesir görevi: `1 tam a/b` sorusunda seçeneklerin tamamı tam sayılı yazım formatında kalmalı; eşdeğer `c/b` bileşik kesir seçeneği bu görevde gösterilmemeli.
