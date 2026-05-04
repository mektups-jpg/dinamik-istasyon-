# 11-07 Fonksiyon Bileşke Portları

## Durum

Backlog / spec-only. Bu modülün fikir ve kalite sözleşmesi hazırdır; ancak registry kaydı ve kaynak kod klasörü henüz yoktur. Tamamlanmış modül gibi yayınlanmamalıdır.

## Amaç
11. sınıf öğrencisine bileşke fonksiyonu `f(g(x))` ifadesini cebirsel sembol yığını olarak değil, bir makinenin çıktısının ikinci makinenin girdisine bağlanması olarak göstermek. Öğrenci `x` kapsülünü önce `g` makinesinden geçirir, çıkan değeri kabloyla `f` portuna takar ve final çıktının neden `f(g(x))` olduğunu görür.

## Atom Kapsamı
- `MAT.11.1.7.1`: İki farklı fonksiyonu iç içe geçirerek `(f o g)` yeni bir bileşke fonksiyon kurgular.

## Kapsam Dışı
- Fonksiyonlarda toplama, çıkarma, çarpma ve bölme bu modüle sıkıştırılmaz; `11-08 Fonksiyon İşlem Mikseri` içinde ayrı makro deney olarak kalır.
- Ters fonksiyon, logaritma ters ayna ve tanım kümesi kapıları tekrar öğretilmez.
- Ağır cebirsel sadeleştirme maratonu yoktur; amaç girdi-çıktı zincirinin yönünü ve sırayı sezgisel kurmaktır.

## Ana Oyuncak
Tek sahne bir **fonksiyon port istasyonu** olur:
- Sol tarafta `x` giriş kapsülü bulunur.
- Ortada `g` makinesi, sağda `f` makinesi vardır.
- Öğrenci `x` kapsülünü `g` makinesine sürükler; çıkan `g(x)` kapsülü fiziksel olarak belirir.
- Sonra bu ara çıktıyı `f` giriş portuna kabloyla bağlar.
- Sahne finalde `x -> g -> f` zincirini ve `f(g(x))` sonucunu tek ışıklı hat olarak gösterir.

## Görev Akışı
1. `g makinesini çalıştır`: Öğrenci `x=3` kapsülünü `g(x)=2x+1` makinesine takar ve ara çıktı `7` olarak doğar.
2. `f portuna bağla`: Öğrenci çıkan `g(x)=7` kapsülünü `f(u)=u²-4` makinesinin girişine bağlar.
3. `bileşke zinciri mühürü`: Sistem final çıktıyı `f(g(3)) = 45` olarak gösterir; öğrenci zincir sırasını onaylar.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: `x` kapsülü, `g` makinesi, `f` makinesi ve aradaki kablo portları.
- Öğrenci önce neyi nereye taşıyacağını görmeli; formül metni sahnenin önüne geçmemeli.
- Kablo bağlantısı doğru sırayı öğretmeli: önce `g`, sonra `f`.
- Yanlışta AstroBot mesajı sıra hatasını söylemeli: "`f` portuna ham x değil, önce `g(x)` çıktısı girmeli."
- Dar/embed görünümde iki makine yan yana sıkışırsa dikey akışa dönebilmeli; yatay taşma olmamalı.

## Route
- `/embed/algebra/function-composition-ports`

## Test ID Kontratı
- `composition-port-scene`
- `composition-input-capsule`
- `composition-g-machine`
- `composition-f-machine`
- `composition-output-capsule`
- `composition-link-cable`
- `composition-check`
- `composition-reset`

## QA Planı
- `npm run module:check -- function-composition-ports`
- `npm run build`
- `git diff --check`
- Browser Use:
  - `/embed/algebra/function-composition-ports?qa=1` açılır.
  - Ana sahne, `x` kapsülü, `g` makinesi ve `f` makinesi görünür.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `Home` fallback veya gerçek sürükleme ile `x` kapsülü `g` makinesine, ara çıktı `f` portuna bağlanır.
  - Üç görev completion ekranına ulaşır.
  - Console warning/error kontrolü temizdir.
- Gemini 3 Flash:
  - Başlangıç, ara çıktı ve final zincir ekranları öğrenci netliği, sıra algısı, bilişsel yük ve görsel hiyerarşi açısından değerlendirilir.
  - Must-fix yok, Gemini skor >=85 ve internal skor >=90 olmadan Done yapılmaz.
