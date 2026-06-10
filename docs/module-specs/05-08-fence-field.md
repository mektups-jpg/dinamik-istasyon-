# 05-08 Çevre-Alan Bahçesi

## Durum
Showcase Ready. Ortaokul 5. sınıf üretim hattında `fence-field` modülü çevre ve alan yorumunu büyük dikdörtgen bahçe oyuncaklarıyla denetlemek için açılmıştır. 2026-06-03 Kaptan canlı görsel onayıyla Vitrin Hazır olarak işaretlenmiştir.

## Amaç
5. sınıf öğrencisinin dikdörtgen bahçe planlarını seçerek aynı çevreyle farklı alanlar ve aynı alanla farklı çevreler oluşabildiğini görmesini sağlamak. Öğrenci alan ve çevreyi ayrı büyüklükler olarak karşılaştırır.

## Atom Kapsamı
- `MAT.5.4.3.1`: Çevresi aynı olup alanı farklı olan dikdörtgen boyut kombinasyonlarını kurgular.
- `MAT.5.4.3.2`: Alanı aynı olup çevresi farklı olan dikdörtgen boyut kombinasyonlarını kurgular.

## Kapsam Dışı
- Birim karelerden alan formülünü ilk kez ispatlama Birim Kare Alan Fabrikası modülündedir.
- Metin ağırlıklı çevre/alan problemleri bu modüle sıkıştırılmaz.
- Veri/grafik yorumlama ve medya okuryazarlığı bu modülün hedefi değildir.

## Ana Oyuncak
Tek ana oyuncak büyük dikdörtgen bahçe planıdır:
- Öğrenci sağ paneldeki bahçe planlarına dokunur.
- Ortadaki dikdörtgenin şekli, alanı ve çevresi canlı değişir.
- Yanlış kilitlemede AstroBot neden yanlış olduğunu söyler.
- Doğru kilitlemede ilgili MEB atomu açılır ve sıradaki görev gelir.
- Görev metni ana oyuncak üstünde kısa karttır; kanıt zinciri sürekli kart listesi yerine küçük akış çubuklarıyla gösterilir.
- Her yeniden oynatmada aynı kazanımı koruyan farklı çevre/alan ölçü setleri ve seçenek sıraları gelir.

## Görev Akışı
1. Çevresi 20 birim olan bahçelerde alanı en büyük plan seçilir.
2. Alanı 24 birim kare olan bahçelerde çevresi en kısa plan seçilir.
3. Çevresi 24 birim olan bahçelerde alanın değiştiği tekrar kanıtlanır.
4. Son görevden sonra `MAT.5.4.3.1`, `MAT.5.4.3.2` ve `fence-field` modülü kilitlenir.

## UI/UX Kriterleri
- İlk üç saniyede büyük dikdörtgen bahçe planı görünür.
- Yazı kısa kalır; hedef üstte, plan seçimi sağda, canlı alan/çevre değerleri ana oyuncakta ayrıdır.
- Tıklanabilir plan kartları ve kilit düğmesi en az 44px dokunma alanına sahiptir.
- Yanlış cevapta neden yanlış olduğu söylenir: çevre aynıyken alan küçük kalır veya alan aynıyken çevre fazladır.
- Modül route'u `/embed/geometry/fence-field` olarak kalır.

## QA Başarı Kriteri
- `/embed/geometry/fence-field` açılır.
- `Çevre-Alan Bahçesi` başlığı görünür.
- Kök test id `fence-field` görünür.
- `garden-option-*` seçenekleriyle dikdörtgen, alan ve çevre değerleri değişir.
- Yeni oyunlarda ilk görev ölçüleri ve seçenek sırası sabit kalmamalıdır.
- Yanlış seçimden sonra `garden-lock` tıklanınca açıklayıcı hata feedback'i gelir.
- Doğru seçimlerle üç görev tamamlanınca completion ekranı açılır.
- Console hata/uyarı olmamalıdır.
- `npm run module:check -- fence-field`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
