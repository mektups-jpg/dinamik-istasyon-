# 05-02 Konum Belirleme Terminali

## Amaç
5. sınıf öğrencisinin kareli düzlemde yön ve birim kullanarak bir noktanın diğer noktaya göre konumunu belirlemesini sağlamak. Öğrenci başlangıç noktasından hedefe giden komut dizisini kurar; doğru rota çizildiğinde doğru parçası ve konum kodu birlikte anlam kazanır.

## Atom Kapsamı
- `MAT.5.3.1.2`: Dijital/Sanal araçla bir doğru parçası çizerek kodlar.
- `MAT.5.3.2.1`: Bir noktanın diğer noktaya göre konumunu yön/birim belirterek kodlar.

## Kapsam Dışı
- Koordinat düzleminde cebirsel denklem, eğim, uzaklık formülü ve analitik geometri bu modüle alınmaz.
- Negatif koordinat, dört bölge ve 10. sınıf analitik kazanımları bu modülün hedefi değildir.

## Ana Oyuncak
Tek ana oyuncak kareli konum belirleme zemini ve sağdaki yörünge kodlayıcıdır:
- Öğrenci yön oklarından yukarı, aşağı, sol veya sağ seçer.
- Birim kare sayısını 1'den 10'a kadar aralıktan belirler.
- Komutlar listeye eklenir ve `Ateşle` ile rota sahne üstünde denenir.
- Başlangıç ve hedef noktaları zemin üzerinde görünür; doğru rota tamamlandığında görev kilitlenir.

## Görev Akışı
1. Öğrenci başlangıç ve hedef noktalarını kareli zeminde okur.
2. Sağ panelden yön ve birim kare seçerek komut listesi oluşturur.
3. `Ateşle` ile rota yürütülür.
4. Yanlış rota hedefe ulaşmazsa AstroBot yön/birim hatasını açıklar.
5. Doğru rota hedefe bağlanınca iki MEB atomu kilitlenir ve completion ekranı görünür.

## UI/UX Kriterleri
- İlk üç saniyede ana oyuncak kareli zemin ve hedef noktası olarak anlaşılmalıdır.
- Izgara çizgileri aynı renkte, yeterli kontrastta ve kare saymaya elverişli olmalıdır.
- Sağ paneldeki birim seçimleri taşmadan 1'den 10'a kadar aralığı göstermelidir.
- Yanlış cevapta sadece hata değil, yön veya birim seçiminde neyin bozulduğu da söylenmelidir.
- Modül route'u `/embed/geometry/neon-route` olarak kalır; görünür ad `Konum Belirleme Terminali`dir.

## QA Başarı Kriteri
- `/embed/geometry/neon-route` açılır.
- Başlıkta `Konum Belirleme Terminali` görünür.
- Kareli zemin, başlangıç noktası, hedef noktası ve sağ panel aynı ilk ekranda görünür.
- Birim seçimlerinde 1'den 10'a kadar tüm sayılar görünür ve seçilebilir.
- Dashboard kartında `Vitrin Hazır` etiketi görünür.
- `npm run module:check -- neon-route`, `npx tsc --noEmit`, `npm run build` ve `git diff --check` çalıştırılır.
