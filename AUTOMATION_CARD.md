# Otomasyon Kartı

## Ad

Dinamik İstasyon / Matnastik Laboratuvarı

## Amaç

Öğrenciye dönük interaktif matematik ve geometri modülleri üretmek. Kâğıt fasikül yerine dokunulabilir, görsel, simülasyon tabanlı ve oyunlaştırılmış öğrenme deneyimleri sunmak.

## Girdi

- Müfredat/kazanım planı.
- Modül spesifikasyonu.
- Matematiksel model veya simülasyon fikri.
- Görsel/etkileşim tasarım kararı.
- Gerektiğinde içerik bankasından kavram, soru veya örnek.

## Çıktı

- React/Vite tabanlı interaktif modül.
- Öğrenci arayüzü.
- Simülasyon, oyunlaştırma, puan veya görev akışı.
- Modül kayıtları ve module registry güncellemeleri.

## Yapar

- Öğrenciye dönük etkileşimli matematik deneyimi üretir.
- React, TypeScript, KaTeX, Matter.js, Three.js, Zustand gibi frontend araçlarını kullanır.
- Altın Şablon mantığıyla modülleri ortak kabuk ve UI içinde tutar.
- Görsel keşif, simülasyon, animasyon ve oyunlaştırma yapar.

## Yapmaz

- Airtable içerik bankasının ana yazıcısı olmaz.
- AI soru üretim, kategori QC veya QA feedback merkezi olmaz.
- Taranmış kitap OCR/kırpma hattı olmaz.
- InDesign/Typst final fasikül dizgisi yapmaz.
- Geometri görsel render factory'nin yerine geçmez.

## Okuduğu Airtable Alanları

V1'de doğrudan Airtable'a bağlı ana otomasyon gibi düşünülmemeli. İleride içerik bankasından onaylı kavram, örnek veya soru okuyabilir.

## Yazdığı Airtable Alanları

Varsayılan yazmamalı. Öğrenci performans verisi veya modül tamamlama sinyali ayrı öğrenci takip/değerlendirme otomasyonunun sözleşmesiyle yazılmalı.

## Ürettiği Dosya/Paket

- `src/modules/...`
- `src/registry/moduleRegistry.ts`
- `docs/module-specs/...`
- frontend build çıktısı `dist/`

`dist/` GitHub'a kaynak olarak gitmemeli; build çıktısı olarak kalmalı.

## Bağımlı Olduğu Otomasyonlar

- Soru Akış Merkezi: onaylı kapsam/kategori/öğrenme kartı dili sağlayabilir.
- Değerlendirme otomasyonu: öğrenci performans sinyallerini yorumlayabilir.
- Görsel/geometri otomasyonu: modül içinde kullanılacak özel matematik görselleri veya vektör varlıkları sağlayabilir.

## Sonraki Otomasyona Verdiği Sözleşme

İleride öğrenci verisi üretirse şu sözleşmeye yaklaşmalı:

- `student_id`
- `module_id`
- `grade`
- `topic`
- `learning_outcome`
- `category_5`
- `category_level`
- `attempt_status`
- `score`
- `time_spent`
- `error_tag`
- `support_recommendation`

## Riskler

- İçerik üretim otomasyonlarıyla karışırsa öğrenci ürünü içinde ham/yetersiz doğrulanmış içerik görünür.
- Çok sayıda modül aynı şablonu bozarsa bakım zorlaşır.
- `.agent` görsel/JSON çıktıları GitHub'a kontrolsüz giderse repo şişer.
- Build çıktısı, node_modules veya yerel çalışma dosyaları repo'ya karışmamalı.

## Test / Kabul Kriteri

- `npm run build`
- `npm run module:check`
- Modül registry yeni modülleri doğru gösterir.
- Modül mobil/desktop görünümde taşma yapmaz.
- Öğrenciye görünen matematiksel ifadeler KaTeX ile okunur durumdadır.
