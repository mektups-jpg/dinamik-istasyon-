# 03-07 Dört İşlem Makinesi

## Kapsam

- Module id: operation-lab-3
- Route: /embed/numbers/operation-lab-3
- Sınıf: 3
- Statü: Showcase Ready / Vitrin Hazır. Kaptan canlı görsel onayı alındı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.3.2.1.1: Üç basamaklı sayılarla toplamayı yuvarlayarak tahmin eder.
- MAT.3.2.1.2: Zihinden stratejik toplama yapar.
- MAT.3.2.1.3: Zihinden stratejik çıkarma yapar.
- MAT.3.2.2.1: Eldeli toplamada artan onluğu taşıma kuralını simüle eder.
- MAT.3.2.2.2: Çıkarmada onluk/yüzlük bozma mekaniğini simüle eder.
- MAT.3.2.3.1: Çarpma veya bölme sonucunu önceden tahmin eder.
- MAT.3.2.4.1: İki basamaklı sayıyı tek basamaklı sayıyla çarpar.
- MAT.3.2.4.2: Kalanlı bölmede artan nesnenin paylaştırılamadığını görselleştirir.
- MAT.3.2.5.1: Ardışık çoklu yönergeleri doğru işleme çevirir.
- MAT.3.2.6.1: Çok işlemli hikaye problemini parçalara ayırır.
- MAT.3.2.6.2: Parçalara ayırdığı problemi işlem sırasına göre çözer.
- MAT.3.2.7.1: Verilen sayılar ve işlemle mantıklı hikaye cümlesi kurar.
- MAT.3.2.8.1: Eşittir sembolünü iki taraflı işlem dengesi olarak kanıtlar.

## Deneyim Notu

Öğrenci işlem makinesinde giren işlemi, kısa ipucu parçalarını ve çıkış yuvasını görür. Tahmin, zihinden işlem, elde taşıma, onluk bozma, çarpma, kalan, çok adım ve eşitlik görevlerini büyük cevap kartlarıyla tamamlar. Her `Tekrar Oyna` turunda 13 görevin tamamında sayılar güvenli 3. sınıf havuzlarından yeniden seçilir; çocuk sabit diziyi ezberlemez. Hikaye problemlerinde `dörder` gibi üleştirme ifadeleri açık yazılır; çocuk her kutudaki miktarı toplam miktarla karıştırmaz. Kısa ipucu şeridi makinenin üstünde kalır; altta AstroBot balonuyla yarışmaz. Genel/pasif `İşlem parçaları` ve statik `Taşıma kutusu` gösterilmez. `Yuvarlama modeli` yuvarlanmış sayıyı veya yaklaşık toplamı yazmaz; sayıyı iki yüzlük arasında nokta olarak gösterir. `Bozma modeli` doğru seçim öncesinde `1 onluk boz`, `10 birlik al` veya dönüşüm sonucunu yazmaz; bunun yerine seçilen sayıya göre `3 < 5`, `onluklara bak` gibi ipucu dili kullanır, hamleden sonra alanı soru işaretiyle bekler ve dönüşüm yalnız doğru karttan sonra açılır. `Kalan modeli` statik nesne kutusu değildir; seçilen grup büyüklüğüne göre tam grupları ve dışarıda kalan nesneleri ayırır, ama `2 kaldı` gibi cevap metnini yazmaz.

## QA Kontratı

- Route: /embed/numbers/operation-lab-3
- Sahne test id: `operation-lab-3-stage`
- Panel test id: `operation-lab-3-control-panel`
- Cevap kartları test id: `operation-lab-3-choice`
- Feedback test id: `operation-lab-3-feedback`
- Completion test id: `operation-lab-3-complete`
- Tekrar oynama test id: `operation-lab-3-restart`
- Bozma dönüşümü test id: `operation-lab-3-borrow-breakdown`
- Bozma önce modeli test id: `operation-lab-3-borrow-before`
- Bozma işlem oku test id: `operation-lab-3-borrow-action`
- Bozma sonra modeli test id: `operation-lab-3-borrow-after`
- Kalan modeli test id: `operation-lab-3-remainder-model`
- Kalan tam grup test id: `operation-lab-3-remainder-group`
- Kalan dışarıda kalanlar test id: `operation-lab-3-remainder-leftovers`
- Tahmin yuvarlama modeli test id: `operation-lab-3-rounding-model`
- Tahmin ilk sayı modeli test id: `operation-lab-3-rounding-first`
- Tahmin ikinci sayı modeli test id: `operation-lab-3-rounding-second`
- Kısa ipucu rehber şeridi test id: `operation-lab-3-hint-strip`
