# 09-12 Algoritma Akış Hattı

## Durum

Review Needed. Kaptan canlı görsel onayı olmadan `Showcase Ready / Vitrin Hazır` yapılmayacak.

## Amaç

Öğrenci karışık bir matematik problemini tek seferde çözmeye çalışmak yerine, ardışık ve kontrol edilebilir akış şeması bloklarına böler. Her blok sahnedeki akış hattına sırayla yerleşir; sonuç cümlesi yalnız `Akışı Test Et` sonrası açılır.

## Atom Kapsamı

- `MAT.9.3.1.1`: Karışık bir matematik problemini ardışık akış şeması bloklarına böler.

## Kapsam Dışı

- Mantıksal VE/VEYA/İSE/YA DA kapıları `Akıllı Mantık Devreleri` içinde kalır.
- Her/Bazı niceleyicileri ayrı **Niceleyici Radar Avı** modülüne bırakılır.
- Programlama dili, kod yazma ve döngü yapıları bu ilk sürümün kapsamı değildir.

## Tek Ana Oyuncak

Ana sahne bir akış bandıdır. Öğrenci problem kartındaki durumu okuyup blok kartlarını sırayla akış yuvalarına yerleştirir. Blok yerleşince hat ışığı bir sonraki yuvaya akar; yanlış sırada test edildiğinde AstroBot kısa geri bildirim verir. Sağ panel yalnız görevi, seçilen blok sayısını ve test/sıfırlama düğmelerini taşır.

## Görev Akışı

1. Takım sayısı: iki sınıftaki öğrenci sayısını topla, 6 kişilik takımlara böl, takım sayısını mühürle.
2. Kalan para: üç kitabın toplamını bul, bütçeden çıkar, kalan parayı mühürle.
3. Ortalama puan: puanları topla, deneme sayısına böl, barajla karşılaştır.
4. Bilet planı: öğrenci ve öğretmen biletlerini ayrı hesapla, toplam maliyeti bul, bütçeye göre karar ver.

Başarı metinleri ve nihai sonuç yalnız test sonrası açılır; blok seçimi yalnız süreç önizlemesidir.

## Route

- `/embed/algebra/algorithm-flow-line`

## Test ID Kontratı

- `algorithm-flow-line-scene`
- `algorithm-flow-line-controls`
- `algorithm-flow-line-check`
- `algorithm-flow-line-reset`
- `algorithm-flow-line-slot-0`
- `algorithm-flow-line-slot-1`
- `algorithm-flow-line-slot-2`
- `algorithm-flow-line-block-*`

## QA Planı

- Başlangıçta sonuç cümlesi ve hedef akış cevabı gizli kalacak.
- Yanlış sıralama AstroBot alarmı verecek.
- Blok seçimi sahnedeki akış hattını anında değiştirecek.
- Dört görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- algorithm-flow-line`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
