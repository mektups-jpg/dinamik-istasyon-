# 11-08 Fonksiyon İşlem Mikseri

## Durum

Done. SSOT atomları doğrulandı; uygulama klasörü ve registry route'u eklendi. Browser Use IAB tekrar denemesinde açıldı; görsel smoke, yanlış onay, `Home` fallback ile dört işlem akışı, bölme `kilit` güvenliği, completion ve console warning/error `[]` geçti. İlk QA turunda SVG kadranın `Home` fallback'i çalışmadığı ve `f/g` etiketlerinin ilk kapsüllere fazla yakın olduğu yakalandı; `focusable` kadran hedefleri ve etiket hizası düzeltildi. Gemini 3 Flash final turu 96/100 PASS verdi, must-fix yok. `npm run module:check -- function-operation-mixer` 23 pass / 0 warn / 0 fail, `npm run build` ve `git diff --check` temiz.

## Amaç
11. sınıf öğrencisine fonksiyonlarda toplama, çıkarma, çarpma ve bölmenin aynı iki fonksiyon akışını farklı işlem kapılarından geçirmek olduğunu göstermek. Öğrenci formül ezberi yerine iki değer akışını tek mikser panelinde birleştirir ve her işlemde çıkan yeni fonksiyonun değerlerini görür.

## Atom Kapsamı
- `MAT.11.1.8.1`: Aynı tanım kümesindeki iki fonksiyonu birbiriyle toplar.
- `MAT.11.1.8.2`: Aynı tanım kümesindeki iki fonksiyonu birbirinden çıkarır.
- `MAT.11.1.8.3`: Aynı tanım kümesindeki iki fonksiyonu birbiriyle çarpar.
- `MAT.11.1.8.4`: Aynı tanım kümesindeki iki fonksiyonu birbirine böler.

## Kapsam Dışı
- Bileşke fonksiyon sırası tekrar edilmez; bu kapsam `11-07 Fonksiyon Bileşke Portları` içinde tamamlandı.
- Ters fonksiyon, tanım kümesi kapıları ve grafik dönüşümleri bu modüle sıkıştırılmaz.
- Ağır cebirsel sadeleştirme yarışması yoktur; hedef aynı `x` değerinde iki fonksiyon değerini doğru işlem kapısında birleştirmektir.

## Ana Oyuncak
Tek sahne bir **fonksiyon işlem mikseri** olur:
- Solda `f(x)` ve `g(x)` değer akışları iki neon kanal gibi akar.
- Ortada dört konumlu işlem kadranı vardır: `+`, `-`, `×`, `÷`.
- Sağda çıktı rayı yeni fonksiyon değerini üretir: `(f+g)(x)`, `(f-g)(x)`, `(f·g)(x)`, `(f/g)(x)`.
- Bölme görevinde `g(x)=0` olan istasyon kırmızı güvenlik kapağıyla kapanır; öğrenci paydanın sıfır olamayacağını sadece metin olarak değil, kapı kilidi olarak görür.

## Başlangıç Veri Modeli
- Ortak örnek küme: `x = 1, 2, 3`.
- `f(x)=x+3` değerleri: `4, 5, 6`.
- `g(x)=x-2` değerleri: `-1, 0, 1`.
- Bölme sahnesinde `x=2` noktası güvenli çıktı üretmez; payda sıfır kapağı görünür.

## Görev Akışı
1. `toplama kanalı`: Öğrenci `+` kadranını kilitler; iki akış birleşip `(f+g)(x)` değerlerini üretir.
2. `çıkarma kanalı`: Öğrenci `-` kadranını kilitler; `f` akışından `g` akışı çıkarılır.
3. `çarpma kanalı`: Öğrenci `×` kadranını kilitler; iki akış enerji çarpanı gibi birleşir.
4. `bölme güvenliği`: Öğrenci `÷` kadranını kilitler; `g(x)=0` noktasında kapı kapanır ve kalan noktalarda bölüm okunur.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: iki giriş akışı, ortadaki işlem kadranı ve sağdaki çıktı rayı.
- Dört işlem aynı anda ayrıntı yığını olarak görünmez; aktif görev yalnız bir işlem kapısını öne çıkarır.
- Çıktı değerleri küçük tablo gibi değil, işlemden geçen veri kapsülleri gibi hissettirilir.
- Bölme görevinde payda sıfır kuralı pedagojik ve görsel olmalı; sadece hata mesajı olmamalı.
- Dar/embed görünümde kadran ve çıktı rayı kırpılmamalı; AstroBot toast kontrol panelini kapatmamalı.

## Route
- `/embed/algebra/function-operation-mixer`

## Test ID Kontratı
- `function-operation-mixer-scene`
- `function-operation-f-stream`
- `function-operation-g-stream`
- `function-operation-dial`
- `function-operation-output`
- `function-operation-check`
- `function-operation-reset`

## QA Planı
- `npm run module:check -- function-operation-mixer`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/function-operation-mixer?qa=1` açılır.
  - Ana mikser, iki fonksiyon akışı, kadran ve çıktı rayı görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback veya gerçek kadran sürükleme/tıklama ile dört görev tamamlanır.
  - Bölme görevinde `g(x)=0` kapağı görünür ve completion ekranına ulaşılır.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Dört işlem tek oyuncakta kafa karıştırmadan ayrışıyor mu, payda sıfır güvenliği görsel olarak anlaşılıyor mu ve ilk 3 saniye net mi değerlendirilir.
  - Must-fix yok, Gemini skor >=85 ve internal skor >=90 olmadan Done yapılmaz.

## QA Kapanışı
- Browser Use ekran kanıtları:
  - `.agent/browser-use-shots/11-08-final-home-start.png`
  - `.agent/browser-use-shots/11-08-final-home-wrong.png`
  - `.agent/browser-use-shots/11-08-final-home-divide-lock.png`
  - `.agent/browser-use-shots/11-08-final-home-completion.png`
- Browser Use akış sonucu: yanlış onay AstroBot hatası, `Home` fallback ile toplama/çıkarma/çarpma/bölme geçişleri, bölme `kilit`, completion ve console `[]` geçti.
- Gemini 3 Flash sonucu: final 96/100 PASS, must-fix yok. İlk turdaki `Home` fallback ve etiket yakınlığı uyarıları düzeltildi.
