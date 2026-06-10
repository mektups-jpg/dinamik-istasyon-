# 02-11 Şekil Tamamlama Atölyesi

## Kapsam

- Module id: hologram-design-base-2
- Route: /embed/geometry/hologram-design-base-2
- Sınıf: 2
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-11 Kaptan canlı görsel onayıyla onaylandı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.2.3.2.1: 3D geometrik cisimleri üst üste dizerek istenen modeli inşa eder.
- MAT.2.3.3.1: 2D geometrik şekilleri yan yana dizerek yeni şekiller türetir.

## Deneyim Notu

Öğrenci şekil tasarım ekranında yalnız tek oyun fikriyle ilerler: robot veya araç modelindeki boş yuvada soluk taslak parçayı görür, bu parçanın adını büyük seçim kartlarından seçer. Her seçimde anlık kırmızı/yeşil geri bildirim gelir.

## 2026-06-10 Pedagoji ve Dil Cilası

- Çocuk ekranındaki `Hologram`, `3D`, `2D`, `Tasarım kodu` ve `kilitlendi` gibi teknik ifadeler sadeleştirildi.
- Cevap kartları `Küp baş`, `Silindir gövde`, `Küre teker` gibi rol karıştıran ifadeler yerine doğrudan cisim/şekil adına çekildi.
- Sağ panel uzun soruyu tekrar etmek yerine kısa `Görev` hedefi gösteriyor; ana açıklama sahnede kalıyor.
- Robot ve araç model görevlerinde sahne artık yalnız parça sırası göstermiyor; baş/gövde/ayak yuvalı robot çerçevesi ile gövde-tekerlekli araç silüeti boş parçanın nereye geleceğini görünür kılıyor.
- Kaptan geri bildirimiyle atom pedagojik olarak sadeleştirildi: simetri, eş olmayan şekil, örüntü ve kroki görevleri bu atomdan çıkarıldı. Bu kazanımlar ayrı atomlarda ele alınmalı; bu atom yalnız model kurma kazanımlarını taşır.
- Bu cila turu sonrası statü Kaptan onayı bekliyordu; 2026-06-11 canlı görsel onayıyla `Showcase Ready / Vitrin Hazır` yapıldı.

## 2026-06-11 Görsel Netlik Cilası

- Kaptan geri bildirimiyle `Eksik` / `?` ağırlıklı boş yuva kaldırıldı; boş yuvada artık seçilecek cismin ya da düz şeklin soluk taslağı görünür.
- Küre görseli düz kapsül/daire gibi algılanmayacak şekilde ışık ve gölge taşıyan gerçek top modeline çekildi.
- Soru dili `Gölgedeki cismin adını seç.` / `Gölgedeki düz şeklin adını seç.` çizgisine getirildi; çocuk şekli görür ve sağdaki adla eşleştirir.
- Ayrı üretim kaydı: `MAT.2.3.6.1` için `Kroki Yol Bulucu`, `MAT.2.3.7.x` için `Simetri Aynası`, `MAT.2.1.5.x` için `Örüntü Tamir Bandı` ayrı atom olarak planlandı; mevcut atomda tekrar birleştirilmeyecek.

## 2026-06-11 Kaptan Vitrin Onayı

- Kaptan canlı ekranda bu atomun `Vitrin Hazır` olarak işaretlenmesini onayladı.
- Registry, module spec, MODULES, kalite scorecard ve showcase readiness kayıtları `Showcase Ready / Vitrin Hazır` ile eşitlendi.

## 2026-06-11 Adlandırma Notu

- `Şekil Tasarım Üssü` adı 2. sınıf için fazla soyut bulundu; `üs` ve `tasarım` kelimeleri çocuğun ilk anda yapacağı işi söylemiyordu.
- Görünen ad `Şekil Tamamlama Atölyesi` yapıldı. Bu ad ekrandaki davranışı doğrudan anlatır: gölgedeki parçayı gör, adını seç, modeli tamamla.

## QA Kontratı

- Route: /embed/geometry/hologram-design-base-2
- Sahne test id: `hologram-design-base-2-stage`
- Panel test id: `hologram-design-base-2-control-panel`
- Cevap kartları test id: `hologram-design-base-2-choice`
- Feedback test id: `hologram-design-base-2-feedback`
- Completion test id: `hologram-design-base-2-complete`
- Tekrar oynama test id: `hologram-design-base-2-restart`
