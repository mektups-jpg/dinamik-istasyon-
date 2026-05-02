# 11-01 Trigonometrik Osiloskop

## Amaç
11. sınıf sinüs ve kosinüs referans fonksiyonlarını tek dalga üretim deneyinde öğretmek. Öğrenci formül grafiğini ezberlemez; birim çember üzerinde dönen ışık noktasının yatay/zaman eksenine iz bırakmasını izler ve `sin(x)` ile `cos(x)` dalgalarının aynı kaynaktan nasıl doğduğunu görür.

## Atom Kapsamı
- `MAT.11.1.1.1`: `f(x)=sin(x)` referans fonksiyonunun periyodik dalga grafiğini çizer.
- `MAT.11.1.1.2`: `f(x)=cos(x)` referans fonksiyonunun periyodik dalga grafiğini çizer.

## Kapsam Dışı
- `MAT.11.1.1.3` ve `MAT.11.1.1.4` tanjant/kotanjant asimptot grafikleri ayrı **Tanjant Asimptot Kapıları** modülündedir.
- `MAT.11.1.2.x` trigonometrik denklem kökleri ayrı **Trigonometrik Kök Avcısı** modülündedir.
- Dönüşüm, genlik/periyot/faz kayması ve ileri trigonometrik modelleme bu ilk referans dalga modülünün kapsamına alınmaz.

## Ana Oyuncak
Tek sahne bir dijital osiloskoptur:
- Sol tarafta birim çember üzerinde dönen parlak bir faz noktası vardır.
- Faz noktasının `y` izdüşümü sinüs kalemini, `x` izdüşümü kosinüs kalemini sağdaki zaman ekranına taşır.
- Öğrenci faz kolunu doğrudan döndürür; sağdaki dalga izi canlı olarak aynı açıya kadar çizilir.
- Aktif görev sinüs veya kosinüs kanalını seçer; diğer kanal soluk arka plan referansı olarak kalır.

## Görev Akışı
1. Sinüs tepe sinyali: faz kolunu `90°` hedefe getir; sinüs dalgasının `1` tepe değerini gör.
2. Sinüs periyodu: faz kolunu `360°` tam tura tamamla; dalganın başladığı yüksekliğe döndüğünü doğrula.
3. Kosinüs sol uç: aktif kanal kosinüse geçer; faz kolunu `180°` hedefe getir; kosinüs dalgasının `-1` değerini gör.
4. Kosinüs periyodu: faz kolunu `360°` tam tura tamamla; kosinüs dalgasının tekrar `1` değerine döndüğünü doğrula.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: birim çember faz kolu ve yanında çizilen dalga ekranı.
- Öğrenci "hangi kontrolle oynayacağım?" sorusunu faz kolu/ışık noktasıyla hemen anlamalı.
- Sağ/alt panel yalnız aktif kanal, hedef açı, canlı değer ve onay/reset içerir.
- Görseller matematiksel anlam taşımalı: çember izdüşümü, dikey/yatay kalem, dalga izi ve hedef açı işaretleri dekor değil kavram anlatımıdır.
- Dalga çizimi sade ve Apple Education hissinde olmalı; çok sayıda formül kartı veya aynı anda tan/cot gürültüsü kullanılmamalı.
- Faz kolu sürüklenebilir ve klavye erişimli olmalı; `ArrowLeft/ArrowRight` küçük derece adımı, `Home` aktif hedefe hizalama sağlar.

## QA Başarı Kriteri
- `/embed/trigonometry/trigonometric-oscilloscope?qa=1` açılır.
- `trig-oscilloscope-scene`, `oscilloscope-phase-handle`, `oscilloscope-wave-screen`, `trig-oscilloscope-check` görünür.
- Yanlış onay AstroBot hata mesajı üretir.
- Dört görev doğru etkileşimlerle tamamlanır ve `11. SINIF LAB TAMAMLANDI` görünür.
- `npm run build`, `git diff --check`, Browser Use console ve embed smoke temizdir.
- Faz kolu klavye fallback'ine sahip olur: ok tuşlarıyla küçük adım, `Home` ile aktif hedefe hizalama.
