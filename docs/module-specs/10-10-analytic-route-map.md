# 10-10 Analitik Rota Haritası

## Amaç
10. sınıf analitik geometri atomlarını tek navigasyon deneyinde öğretmek. Öğrenci iki noktayı koordinat düzleminde doğrudan sürükler; rota uzunluğu, dikey-yatay değişim, eğim ve doğru denklemi aynı harita üzerinde canlı görünür. İçten bölme, aynı rotanın üzerinde hareket eden bir transfer istasyonu olarak ayrı katmanda açılır.

## Atom Kapsamı
- `MAT.10.5.1.1`: Dik koordinat sistemindeki iki nokta arasındaki doğrusal mesafeyi Pisagor denklemiyle bulur.
- `MAT.10.5.1.2`: Verilen bir doğru parçasını belirli oranda içten bölen gizli noktanın koordinatlarını hesaplar.
- `MAT.10.5.2.1`: İki noktası bilinen bir doğrunun eğimini dikey değişimi yatay değişime bölerek saptar.
- `MAT.10.5.2.2`: Eğimi bilinen doğrunun analitik denklemini `y-y1 = m(x-x1)` formuyla yazar.

## Kapsam Dışı
- Doğru denklemi aileleri, paralellik/diklik, çember analitiği ve 12. sınıf analitik çember konuları bu modüle alınmaz.
- Üçgen/çokgen alanı bu modülün hedefi değildir; rota uzunluğu, eğim ve içten bölme tek eksendir.

## Ana Oyuncak
Tek sahne bir analitik navigasyon haritasıdır:
- Öğrenci `A` ve `B` istasyonlarını grid üzerinde sürükler.
- Rota çizgisi, yatay `Δx` rayı, dikey `Δy` asansörü ve Pisagor mesafe kablosu aynı anda görünür.
- Eğim oku `m = Δy / Δx` olarak canlı hesaplanır; doğru denklemi kısa bir hologram etiketi olarak rotanın yanında belirir.
- İkinci katmanda transfer istasyonu rota üzerinde kayar; verilen oranı yakaladığında içten bölme koordinatı kilitlenir.

## Görev Akışı
1. Mesafe görevi: `A` ve `B` istasyonlarını hedef koordinatlara taşı; `Δx`, `Δy` ve rota mesafesini canlı doğrula.
2. Eğim görevi: iki noktayı hedef eğime getirecek şekilde sürükle; eğim oku doğru `m` değerinde kilitlenir.
3. Doğru denklemi görevi: aynı rota için `y-y1 = m(x-x1)` hologramını doğru değerlerle tamamla.
4. İçten bölme görevi: transfer istasyonunu verilen orana göre rota üzerinde kaydır ve koordinatını kilitle.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: iki sürüklenebilir istasyon ve aralarındaki neon rota.
- Sağ/alt panel yalnız aktif görev, canlı koordinatlar, `Δx`, `Δy`, `m`, mesafe ve onay/reset içerir.
- Rota matematiksel anlam taşımalı; dekoratif çizgiler yerine her çizgi bir ölçüyü temsil etmeli.
- Yanlış durumda AstroBot kısa neden verir: "Eğim için dikey değişimi yatay değişime böl; rota doğru ama oran henüz hedefte değil."
- İstasyonlar ve transfer düğümü klavye ile de küçük adımlarla taşınabilir olmalı; Browser Use QA kırılgan koordinat tahminine bağlı kalmamalı.

## QA Başarı Kriteri
- `/embed/geometry/analytic-route-map?qa=1` açılır.
- İlk sahnede `analytic-route-scene`, `route-point-a`, `route-point-b`, `analytic-route-check` görünür.
- `route-transfer-node` yalnız 4. görev olan içten bölme katmanında görünür; ilk üç görevde sahneyi kalabalıklaştırmaz.
- Yanlış onay AstroBot hata mesajı üretir.
- Dört görev doğru etkileşimlerle tamamlanır ve `10. SINIF LAB TAMAMLANDI` görünür.
- `npm run build`, `git diff --check`, Browser Use console ve embed smoke temizdir.
- SVG istasyonları klavye fallback'ine sahip olur: ok tuşlarıyla küçük adım, `Home` ile aktif hedefe hizalama.
