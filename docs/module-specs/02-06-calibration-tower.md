# 02-06 Kalibrasyon Kulesi

## Kapsam

- Module id: calibration-tower
- Route: /embed/measure/calibration-tower
- Sınıf: 2
- Statü: Review Needed / Görüş Gerekli. Üretildi; Kaptan canlı göz onayı bekliyor.
- Kazanım kaynağı: docs/MEB_ATOMLARI.md
- MAT.2.1.9.1: Analog saat üzerinde tam saatleri okur.
- MAT.2.1.9.2: Analog saat üzerinde yarım (buçuk) saatleri okur.
- MAT.2.1.9.3: Analog saat üzerinde çeyrek saatleri okur.
- MAT.2.1.9.4: Dijital saatteki değeri analog saat üzerinde akrep/yelkovanla ayarlar.
- MAT.2.1.10.1: Karış/adım gibi ölçülerin kişiden kişiye değişerek hata verdiğini test eder.
- MAT.2.1.10.2: Herkesin aynı ölçümü bulması için "Cetvel" ve "Tartı" gerekliliğini onaylar.
- MAT.2.1.11.1: Ekranda gösterilen nesnenin uzunluğunu tahmini santimetre(cm) cinsinden seçer.
- MAT.2.1.11.2: Gerçek ölçümü standart araçlarla yaparak tahminini puanlar.
- MAT.2.3.5.1: Verilen sıvının standart olmayan kaplara kaç defa dolacağını tahmin eder.
- MAT.2.3.5.2: Suyu aktararak/boşaltarak kendi tahminini doğrular.

## Deneyim Notu

Öğrenci kalibrasyon kulesindeki analog saati okur, dijital saatin yelkovan yerini seçer, standart ölçme aracını bulur, bardak izlerini sayar ve cetvel üstünde santimetre tahmini yapar.

## QA Kontratı

- Route: /embed/measure/calibration-tower
- Sahne test id: `calibration-tower-stage`
- Panel test id: `calibration-tower-control-panel`
- Cevap kartları test id: `calibration-tower-choice`
- Feedback test id: `calibration-tower-feedback`
- Completion test id: `calibration-tower-complete`
- Tekrar oynama test id: `calibration-tower-restart`
