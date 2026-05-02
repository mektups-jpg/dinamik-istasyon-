# Modül Bitti Kriteri

Bu dosya, "modül tamamlandı" demeden önce çalıştırılacak kalite kapısıdır. Saatlik otomasyon ve manuel geliştirme aynı standardı kullanır.

## 1. Kapsam Kapısı
- Atomlar yalnızca `docs/MEB_ATOMLARI.md` içinden alınmış olmalı.
- Modül tek ana deney/oyuncak etrafında kurulmalı.
- Genişleyen atomlar ayrı gelecek makro modül olarak not edilmeli.
- Route, registry kaydı, atom listesi ve dashboard görünürlüğü kontrol edilmeli.

## 2. Kod Kapısı
- TypeScript strict kurallarına aykırı `any` eklenmemeli.
- 300-400 satırı aşan dosyalar makul şekilde `Scene`, `Controls`, `types`, `model` gibi parçalara ayrılmalı.
- Dekoratif overlay'lerde `pointer-events-none` olmalı.
- Embed root layout `h-full w-full overflow-y-auto overflow-x-hidden` prensibini korumalı.
- Ana kontroller ve kritik sahne öğeleri sabit `data-testid` almalı.

## 3. Görsel/UX Kapısı
- İlk viewport "neyle oynayacağım?" sorusunu yanıtlamalı.
- Kontroller sahneye doğrudan etki etmeli.
- Görsel öğeler matematiksel anlam taşımalı.
- Sağ/alt panel ana sahneyi boğmamalı.
- Mobil ve embed görünümde yatay taşma, kırpılan aksiyon veya tıklanamayan overlay olmamalı.

## 4. Test Kapısı
Her modül için asgari doğrulama:

```bash
npm run build
git diff --check
```

Browser Use ile:
- Modül `?qa=1` açılır.
- Başlık, ana sahne ve ana oyuncak görünür.
- En az bir yanlış deneme AstroBot hata/uyarı mesajı üretir.
- Doğru akışla tüm görevler tamamlanır.
- Completion ekranı görünür.
- Console'da yeni warning/error yoktur.
- Orta viewport ve mobil/embed smoke kontrol edilir.

## 5. Dokümantasyon Kapısı
- `docs/DEVELOPMENT_QUEUE_10_11.md` status güncellenir.
- `PROGRESS.md` kısa başarı kaydı alır.
- `.agent/WORKLOG.md` teknik çalışma notu alır.
- Yeni kalıcı karar/tercih/gotcha varsa `.agent/knowledge/` içine knowledge entry eklenir.

## 6. Commit Kapısı
- Build ve Browser Use QA geçerse modül veya büyük refactor commitlenebilir temiz bir parçaya ayrılır.
- Commit mesajı modül adı, atom aralığı ve test sonucunu yansıtmalıdır.
- Kullanıcı değişiklikleri veya ilgisiz dosyalar commit'e karıştırılmamalıdır.
