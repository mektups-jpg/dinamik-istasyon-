# 09-04 Denklem Denizaltısı

## Durum

Showcase Ready / Vitrin Hazır. 2026-06-07 Kaptan canlı görsel onayıyla vitrine alındı; tekrar oynayışta aynı başlangıç denklemi riskine küçük koruma eklendi.

## Amaç

Öğrenci doğrusal denklem çözümünde taraf tarafa toplama, katsayı dengeleme, `x` değerini bulma ve yerine koyma adımlarını tek reaktör konsolunda sırayla uygular. Modül, eski üretim hattından geldiği için tema dili güçlüdür; daha sonra Kaptan standardına alınırsa günlük yaşam modeli ve öğrenci dili ayrıca sadeleştirilmelidir.

## Atom Kapsamı

- `MAT.9.2.3.1`: Doğrusal modellerle kurulan bir günlük yaşam probleminin denklemini çözer.

## Kapsam Dışı

- Günlük yaşam eşitsizlikleri `Eşitsizlik Güvenlik Alanı` içinde kalır.
- Fonksiyon grafiği dönüşümleri `Fonksiyon Grafiği Dönüşüm Atölyesi` içinde kalır.
- Bu turda büyük sahne/redesign yapılmaz; yalnız denklem çeşitliliği ve mevcut akış güvenliği korunur.

## Tek Ana Oyuncak

Ana sahne bir denizaltı reaktör konsoludur. Öğrenci iki denklemi sırayla dengeler, gerekirse katsayı çarpanı girer, taraf tarafa toplama sonucunu yazar, `x` değerini bulur ve yerine koyarak `y` değerini tamamlar.

## Görev Akışı

1. Zıt `y` katsayılarıyla taraf tarafa toplama.
2. Tek denklemde katsayı dengeleme ve sonra taraf tarafa toplama.
3. İki denklemi de uygun çarpanlarla genişletip taraf tarafa toplama.

Her açılışta üç aşama rastgele tam sayı setleriyle üretilir. Aynı tarayıcı oturumunda yeni açılış veya `Tekrar Oyna` sonrası ilk görünen denklem çifti bir öncekiyle aynıysa yeni set tekrar üretilir; böylece öğrenci art arda aynı başlangıç sorusu hissi yaşamaz.

## Route

/embed/algebra/equation-submarine

## QA Planı

- Art arda açılışlarda ilk denklem çifti üst üste aynı gelmeyecek.
- Final ekranındaki `TEKRAR OYNA` sonrası ilk denklem çifti önceki başlangıçtan farklı olacak.
- Üç aşama tamamlanıp completion ekranına ulaşacak.
- Desktop/kiosk ana viewport'ta yatay taşma olmayacak.
- Console warning/error temiz olacak.
- `npm run module:check -- equation-submarine`, `npx tsc --noEmit`, `npm run build`, `git diff --check` çalıştırılacak.
