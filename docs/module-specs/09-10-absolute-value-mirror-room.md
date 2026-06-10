# 09-10 Mutlak Değer Ayna Odası

## Durum

Showcase Ready / Vitrin Hazır. 2026-06-06 Kaptan canlı görsel onayıyla vitrine alındı.

## Amaç

Öğrenci mutlak değeri cevap kutusu olarak değil, koordinat sahnesinde negatif çıktıyı yukarı katlayan bir ayna hareketi olarak görür. Ardından `|ax ± b|` biçiminde tepe noktasının iç ifadenin sıfırlandığı yerde oluştuğunu sürükleyerek kurar.

## Atom Kapsamı

- `MAT.9.2.2.1`: `f(x)=|x|` grafiğini negatifleri pozitife kıvıran bir ayna mantığıyla çizer.
- `MAT.9.2.2.2`: Mutlak değere bağlı gelişmiş fonksiyonların (`f(x)=|ax ± b|`) tepe noktasını tespit eder.

## Kapsam Dışı

- Doğrusal fonksiyonun `a, r, k` dönüşümleri Fonksiyon Grafiği Dönüşüm Atölyesi içinde kalır.
- Eşitsizlik çözüm bölgeleri ayrı `Eşitsizlik Güvenlik Alanı` modülüne ayrılır.
- Mutlak değer denklemleri ve eşitsizlikleri bu modüle eklenmez.

## Tek Ana Oyuncak

Ana sahne bir koordinat aynasıdır. Öğrenci tepe noktasını x ekseni üzerinde sürükler, negatif kolu yukarı katlayan sahne içi kolu açar ve gerektiğinde V grafiğinin eğimini dikleştirir. Sağ panel yalnız aktif görev, mevcut durum ve test düğmeleriyle destek verir.

## Görev Akışı

1. `|x|` için negatif kolu yukarı katla.
2. `|x - 2|` için tepe noktasını iç ifadenin sıfırlandığı yere taşı.
3. `|2x + 4|` için tepe noktasını doğru köke taşı ve eğimi `2` yap.

Başarı metinleri ve sonuç cümlesi yalnız `Aynayı Test Et` sonrası açılır. Yanlış denemede AstroBot kısa geri bildirim verir.

## Route

- `/embed/algebra/absolute-value-mirror-room`

## Test ID Kontratı

- `absolute-value-mirror-room-scene`
- `absolute-value-mirror-room-vertex-handle`
- `absolute-value-mirror-room-fold-toggle`
- `absolute-value-mirror-room-slope-toggle`
- `absolute-value-mirror-room-check`
- `absolute-value-mirror-room-reset`

## QA Planı

- Başlangıçta tepe sonucu veya hedef x değeri yazılı sızmayacak.
- Yanlış deneme AstroBot alarmı verecek.
- Sahne üstünde negatif kol katlama, tepe noktası sürükleme ve eğim değiştirme görsel sonucu anında değiştirecek.
- Üç görev completion'a ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma ve panel kırpılması olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- absolute-value-mirror-room`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
