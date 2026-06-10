# 05-09 Bahçe ve Halı Atölyesi

Showcase Ready. Ortaokul 5. sınıf üretim hattında `garden-carpet-planner` modülü çevre ve alan günlük problemlerini ayırmak için açılmıştır. 2026-06-06 Kaptan canlı onayıyla vitrin hazır olarak işaretlenmiştir.

## Amaç

5. sınıf öğrencisinin gerçek yaşam probleminde istenen büyüklüğün çevre mi alan mı olduğunu ayırmasını sağlamak. Öğrenci çit/tel için dış çizgiyi, halı/toprak için iç kaplamayı sahnede görür ve doğru sonuca dokunur.

## SSOT Atomları

- `MAT.5.4.4.1`: Gerçek yaşamı tasvir eden çevre problemlerini sonuçlandırır.
- `MAT.5.4.4.2`: Gerçek yaşamı tasvir eden alan problemlerini sonuçlandırır.

## Route ve Test Kimliği

- Route: `/embed/geometry/garden-carpet-planner`
- Module id/test id: `garden-carpet-planner`
- Ana cevap test id: `planner-answer-*`
- Ana oyuncak test id: `planner-board`

## Öğrenci Akışı

1. Öğrenci günlük problemi okur.
2. Sahnedeki `Çit` ve `Alan` modlarıyla dış çizgi/iç kaplama farkını kontrol eder.
3. Sağdaki sonuç seçeneklerinden birine dokunur; cevap hemen kontrol edilir.
4. Yanlış seçimde çevre-alan ayrımı kısa gerekçeyle söylenir.
5. Doğru seçimde görev ilerler; dört görev sonunda `MAT.5.4.4.1`, `MAT.5.4.4.2` ve modül kilitlenir.

## Kalite Notları

- Ana oyuncak tek büyük dikdörtgen planıdır; çit modu dış kenarları, alan modu iç kareleri vurgular.
- Ana oyuncak cevabı önceden göstermez; sol üstte yalnız boyut, sağ altta aranan ölçü türü görünür.
- Her yeniden oynatmada aynı kazanımı koruyan farklı ölçüler ve cevap sıraları gelir.
- Metinler 5. sınıf seviyesinde kısa tutulur.
- 2026-06-06 Kaptan onayıyla `Showcase Ready` etiketi verildi.
