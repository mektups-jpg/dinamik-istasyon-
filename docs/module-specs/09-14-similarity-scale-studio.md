# 09-14 Benzerlik Ölçek Stüdyosu

## Module ID

`similarity-scale-studio`

## Route

`/embed/geometry/similarity-scale-studio`

## Atom Kapsamı

- `MAT.9.5.2.1`: İki üçgenin benzer olması için açılarının eşit olması gerektiğini ispatlar.
- `MAT.9.5.2.2`: İki üçgenin benzer olması için kenarlarının tam orantılı büyümesi gerektiğini saptar.

## Öğrenme Oyuncağı

Öğrenci iki üçgeni aynı sahnede üst üste düşünür: önce karşılıklı açıları eşleştirir, sonra kenarların aynı katsayıyla büyüdüğünü kurar. Eşleştirme parçaları sahnede ışın çizgilerine dönüşür. Oran görevlerinde ölçek katsayısı sahne kartından seçilir ve kenar çiftleri aynı katsayıyı vermeden mühür açılmaz.

## Sızıntı Kuralı

- Benzerlik kararı ve nihai kanıt cümlesi testten önce görünmez.
- Eşleştirme seçimi yalnız sahnede önizleme çizgisi oluşturur.
- `Stüdyoyu Test Et` geçmeden sonuç mührü `???` kalır.

## Test ID Sözleşmesi

- `similarity-scale-studio-scene`
- `similarity-scale-studio-controls`
- `similarity-scale-studio-check`
- `similarity-scale-studio-reset`
- `similarity-scale-studio-pair-*`
- `similarity-scale-studio-scale-1-5`
- `similarity-scale-studio-scale-2`

## QA Planı

- Başlangıçta benzerlik kararı ve sonuç cümlesi gizli kalacak.
- Yanlış açı/kenar eşleşmesi AstroBot alarmı verecek.
- Doğru açı eşleşmeleri ve doğru ortak oran ayrı görevlerde test sonrası mühürlenecek.
- Dört görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- similarity-scale-studio`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.

## Durum

`Review Needed`. Kaptan canlı görsel onayı olmadan `Showcase Ready` yapılmayacak.
