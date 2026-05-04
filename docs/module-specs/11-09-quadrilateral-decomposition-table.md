# 11-09 Dörtgen Ayrıştırma Masası

## Kapsam
- `MAT.11.2.1.1`: Bir dörtgeni köşegeninden iki üçgene ayırarak iç açılar toplamını 360° olarak kanıtlar.
- `MAT.11.2.1.2`: İki üçgenin alanını birleştirerek bir dörtgenin alanını hesaplar.

## Kapsam Dışı
- Özel dörtgen sınıflandırması `MAT.11.2.2.x` ayrı modüldür.
- Konkav/konveks ayrımı, köşegen sayısı, simetri ve mozaik kaplama `MAT.11.2.3.x` sonrası ayrı makro deneylerdir.

## Ana Oyuncak
Tek sahne: premium cam bir kesme masası. Öğrenci köşegen bıçağını sürükleyerek dörtgeni iki üçgene ayırır. Sonra alan birleştirici rayını çekerek iki üçgen alanını toplam haznesinde birleştirir.

## Öğrenci Perspektifi / Gemini 3 Flash Eleştirisi
- Güçlü yan: Tek oyuncak ve iki görev sırası öğrenciye net geliyor; görsel kalite ve 180° + 180° fikri anlaşılır.
- Must-fix olarak yakalanan nokta: Alan sayıları birimsiz bırakılmamalı. UI'da `br²` birimi gösterilir.
- Should-fix v2 adayı: Sürgü başarılı ama "video oynatıcı" hissi verebilir; köşegenin doğrudan çizilmesi veya en az bir köşenin sürüklenmesi keşif hissini artırır.
- Future v2 adayı: Açı yayları ve X-Ray/röntgen animasyonu ile açıların iki 180° grubuna akması kanıt hissini güçlendirir.

## Görevler
1. `360° Kesimi`: Köşegen bıçağı %94+ ilerleyince iki üçgen ayrılır ve `180° + 180° = 360°` görünür.
2. `Alan Birleştirme`: Kesim açıkken alan birleştirici %90+ ilerleyince `T1 + T2 = Dörtgen Alanı` kilitlenir ve alanlar `br²` birimiyle okunur.

## Route
- `/embed/geometry/quadrilateral-decomposition-table`

## Test ID Kontratı
- `quadrilateral-decomposition-scene`
- `quadrilateral-table-screen`
- `quadrilateral-blade-handle`
- `quadrilateral-area-handle`
- `quadrilateral-check`
- `quadrilateral-reset`

## QA Planı
- `npm run build`
- `git diff --check`
- Browser Use:
  - `?qa=1` ile route açılır.
- İlk görevde sahne ve köşegen bıçağı görünür; alan birleştirici yalnız ikinci görevde açılır.
  - Yanlış onay AstroBot hata mesajı üretir.
  - `quadrilateral-blade-handle` `Home` ile kesim tamamlanır, görev 1 geçer.
  - `quadrilateral-area-handle` `Home` ile alan birleşimi tamamlanır, completion görünür.
  - Console warning/error kontrolü yapılır.
  - Orta viewport ve mobil/embed smoke yapılır.
