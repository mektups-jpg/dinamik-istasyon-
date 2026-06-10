# 02-09 Eş Gruplar Kargo Bandı

## Kapsam

- Module id: cargo-grouping-band-2
- Route: /embed/numbers/cargo-grouping-band-2
- Sınıf: 2
- Statü: Showcase Ready / Vitrin Hazır. 2026-06-10 Kaptan canlı görsel onayıyla onaylandı.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.2.2.4.1: Tekrarlı toplama işleminin çarpma kısa yolu olduğunu onaylar.
- MAT.2.2.4.2: Çarpım işlemlerini yapar.
- MAT.2.2.4.3: Nesneleri belirli gruplara ardışık eşit paylaştırmanın bölme işlemi olduğunu simüle eder.
- MAT.2.2.4.4: Ardışık çıkarma işleminin kısa yolunun bölme olduğunu kanıtlar.
- MAT.2.2.5.1: Çarpmada sayıların yeri değişse de sonucun aynı kaldığını test eder.

## Deneyim Notu

Öğrenci kargoları eş kutular halinde görür, tekrarlı toplamayı çarpma işlemiyle anlatır, toplam kargoyu bulur, kargoları robotlara eşit paylaştırır, aynı sayıda kargo çıkararak tur sayısını bulur ve diziliş değişse de toplamın korunduğunu test eder.

## 2026-06-10 Dil ve Pedagoji Cilası

- `Dron`, `kısa işlem` ve teknik `kısa yol` ağırlığı azaltıldı.
- Soru kökleri `kutu`, `eş grup`, `çarpma işlemi`, `eşit paylaştırma` ve `tur sayısı` gibi 2. sınıf öğrencisinin daha kolay anlayacağı somut kelimelere çekildi.
- Completion atom açıklamaları veli/öğrenci gözüyle daha anlaşılır hale getirildi; statü Kaptan canlı onayı beklediği için `Review Needed` olarak korundu.

## 2026-06-10 Sayı Çeşitliliği

- İlk üretimde görevler tekrar oynayınca değişse de küçük bir sayı havuzu içinde dönüyordu.
- Çarpma, paylaştırma ve aynı sayıda çıkarma havuzları 2-5 çarpım gerçekleri içinde genişletildi.
- Yer değiştirme görevlerinde `3 x 3` gibi dizilişi değişmeyen simetrik örnekler çıkarıldı; ilk 20 seed için 20 farklı görev imzası doğrulandı.

## 2026-06-10 Canlı İpucu Cilası

- Aynı sayıda çıkarma görevinde canlı ipucu `25 - 5 - 5 ...` gibi yarım kalmış görünüyordu.
- İpucu tam yol olarak gösterildi: `25 -> 20 -> 15 -> 10 -> 5 -> 0` gibi.
- Böylece öğrenci işlemin 0'a kadar nasıl indiğini ve kaç tur sürdüğünü daha net görür.

## 2026-06-10 Showcase Ready

- Kaptan canlı kontrolden sonra modül `Showcase Ready / Vitrin Hazır` olarak onaylandı.
- Registry, MODULES, readiness, kalite scorecard, roadmap, progress ve current task kayıtları aynı statüye çekildi.

## QA Kontratı

- Route: /embed/numbers/cargo-grouping-band-2
- Sahne test id: `cargo-grouping-band-2-stage`
- Panel test id: `cargo-grouping-band-2-control-panel`
- Cevap kartları test id: `cargo-grouping-band-2-choice`
- Feedback test id: `cargo-grouping-band-2-feedback`
- Completion test id: `cargo-grouping-band-2-complete`
- Tekrar oynama test id: `cargo-grouping-band-2-restart`
