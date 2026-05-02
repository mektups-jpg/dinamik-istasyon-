# 🕹️ Oyun Modülleri ve Makro Atom Haritası (MODULES.md)

Bu dosya, `docs/MEB_ATOMLARI.md` içerisindeki **555 adet izole mikro atomun**, sistem içerisinde oynanabilir hangi **"Makro Atomlara (Oyun Modüllerine)"** dönüştürüldüğünü belgeler. 

Her bir oyun/laboratuvar modülü, birden fazla bağlantılı atomu tek bir eğlenceli konseptte birleştirir. Böylece her atom için ayrı bir oyun yapmak yerine, devasa modüller içinde spesifik hedefler gerçekleştirilir.

---

## 🌟 SİSTEM MİMARİSİ VE OYUNLAŞTIRMA (JUICE)
Tüm modüller aşağıdaki görsel ve mekanik felsefeye göre kodlanacaktır (Ses efektleri tamamen kapalıdır/kullanılmayacaktır):
* **Ana Lobi (Hub) Navigasyonu:** Sınıf seviyelerinin (1'den 12'ye) bir menü listesi gibi değil, "Astro-Bot Bilim Üssü"nde açılmayı bekleyen cam efektli (Glassmorphism), Apple/Vercel estetiğinde parlayan laboratuvar kapıları olarak tasarlandığı ana arayüz.
* **Ses Yok, Görsel Şölen Var (Silent Juice):** Sınıf içi veya kütüphane kullanımına uygun olarak ses efektleri sistemden çıkarılmıştır. Ancak eylemin tatmini tamamen gözlere hitap edecektir:
  * Etkileşimli butonların basıldığında fiziksel bir yay (spring) gibi küçülüp esneyerek büyümeleri (Framer Motion).
  * Hata yapıldığında ekranın hafifçe titremesi (screen shake) ve neon kırmızı geri bildirimler.
  * Bir modül başarıyla bitirildiğinde ekranda patlayan vektörel konfetiler ve kazanılan rozetin tatmin edici bir 3D eğimle (tilt) ekrana gelmesi.
* **Ödül Döngüsü:** Geçilen her modül, öğrencinin profil kartındaki "Enerji Kapasitesini" (XP) dolduran görsel bir batarya animasyonunu tetikler.

## 🎨 MODÜL TASARIM KALİTE ÇİZGİSİ
Yeni modüller `docs/MODULE_DESIGN_GUIDE.md` içindeki ürün tasarım filtresine göre planlanacaktır. Kullanıcının güçlü tercihleri:
* **3D geometri hissi:** Silindir/prizma modüllerindeki açma-kapama, döndürme, büyütme/küçültme ve yakından inceleme hissi referans alınır.
* **1. sınıf sadeliği:** İlkokul modüllerindeki oyunlu, net, tek bakışta anlaşılır akış lise modüllerine de taşınır.
* **Tek ana oyuncak:** Her modül önce "öğrenci neyle oynayacak?" sorusuna cevap verir. Geniş üniteler tek ekrana yığılmaz; gerekirse ayrı makro modüllere bölünür.
* **Anlamlı görsel:** Sahnedeki her şekil, ışık, hedef, iz veya animasyon matematiksel bir anlam taşır. Sadece dekoratif duran öğeler kullanılmaz.
* **Özgün kimlik:** GameHeader, AstroBot ve completion/progress ortak kalır; ana sahne ve kontrol dili modülün konusuna özel tasarlanır.

---

## 🏫 İLKOKUL 1. SINIF MODÜLLERİ

### 1. Siber Pist (Sayı Doğrusu & Ritim)
* **Konsept:** Rehber robotumuz **Astro-Bot'un** neon bir veri hattı üzerinde hedeflenen kordinatlara ileri-geri hareket etmesi. Öğrenci, bozulan veri yollarını onarmak için Astro-Bot'u bizzat kontrol ederek adım adım zıplatır.
* **Sağladığı Atom Grubları (%100 Kapsam):**
  * `MAT.1.1.1.x` (Rakamları tanıma, yazma, 20'ye kadar sayma ve eşleme)
  * `MAT.1.1.2.x` (Sayımlarda gruplama stratejisi)
  * `MAT.1.1.5.x` (İleri ve geri ritmik sayma)

### 2. Lazer Denge Reaktörü (Eşitlik & İşlemler)
* **Konsept:** Yüksek teknoloji laboratuvarında iki enerji reaktörünün (terazi kefesi) güç akışını eşitlemeye çalışmak. Ağırlık eklendiğinde sistem "Eşit (=)" uyarısı verir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.1.2.1.x` (Toplama/çıkarma, artma/azalma mantığı)
  * `MAT.1.2.2.x` (Zihinden işlem pratikleri)
  * `MAT.1.2.3.x` (Eşittir sembolünün denge ve sonuç bildirimi)
  * `MAT.1.2.4.x` (Toplama ve çıkarmanın ters işlem ilişkisi)

### 3. Otonom Rota Bağlantısı (Yönergeler & Sıra)
* **Konsept:** Akıllı şehir karelajı üzerinde **Astro-Bot'a** hedefe ulaşması için panelden yön bildirmek. (Örn: "Sıradaki 3. sokağı Dön", "3 Birim İleri").
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.1.1.3.x` (Sıra sayıları: Birinci, ikinci vb.)
  * `MAT.1.3.1.x` (Uzamsal yönergeler: Sağ, sol, ileri, geri)
  * `MAT.1.1.8.x` (Standart olmayan mesafeler: Karış, adım kavramları)

### 4. Optik Kalite Kontrol Bandı (Geometri, Örüntü & Sınıflandırma)
* **Konsept:** Kalite kontrol bandında akan geometrik parçaların lazer tarayıcılardan geçmesi. Yanlış şekilleri, desenleri bozulan örüntüleri ve köşesi kurallara uymayanları filtreleme.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.1.1.6.x` (Sayı ve şekil örüntülerindeki bozukluğu saptama)
  * `MAT.1.3.2.x` (Eşlik ilişkisi, şekilleri üst üste koyma)
  * `MAT.1.3.3.x` (Benzeyenleri gruplama, aykırı olanı ayıklama)
  * `MAT.1.3.4.x` / `MAT.1.3.5.x` (3D yapılar, köşeler, ayrıtlar ve 2D temel şekiller)

### 5. Akıllı Lojistik Terminali (Kütle, Para & Tahmin)
* **Konsept:** Terminalde yük dengesini test etmek (Ağır/Hafif kargo), kargo sayısını göz kararı tahmin etmek ve kasada dijital/fiziki kargo ücretini (para) okutmak.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.1.1.4.x` (Az/Çok ve Eşitlik karşılaştırması)
  * `MAT.1.1.7.x` (20'ye kadar göz kararı tahmin ve sağlama)
  * `MAT.1.1.8.2` (Nesnelerin ağırlıklarına göre ağır/hafif kıyası)
  * `MAT.1.1.9.x` (Madeni ve kâğıt paralar ile alım gücü)

### 6. Veri Akış Ekranı (İstatistik & Çetele)
* **Konsept:** Karanlık kontrol odasında **Astro-Bot'un getirdiği** renkli veri paketlerini (data packets) sınıflandırmak. Ekrana düşen verileri çetele tablosuna dokunarak işlemek.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.1.4.1.x` (Verileri tabloya/çeteleye dökmek ve en az/en çok ilişkisini yorumlamak)

---

## 🏫 İLKOKUL 2. SINIF MODÜLLERİ

### 1. Gelişmiş Onluk Bozma Reaktörü (Tamamlandı ✅)
* **Konsept:** **Astro-Bot'un** kontrol ettiği enerji reaktöründe "10 adet Birlik enerjinin" robotik kollarla preslenip "1 Onluk tüpe" dönüştürülmesi ve tam tersi çözümlenmesi.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.1.1.x` (100'e kadar onluk birlik çözümleme)
  * `MAT.2.1.2.x` (Basamak modelleri ve yapı taşları)
  * `MAT.2.2.1.x` (Eldeli toplama / onluk bozarak çıkarma mekaniği)
  * `MAT.2.2.2.x` (Zihinden çıkarma ve toplama işlemleri)

### 2. Lazer Kesim Odası (Kesirler & Şekil Sabitliği)
* **Konsept:** Ekrana gelen devasa geometrik enerji bloklarını lazerle kusursuz bir şekilde ikiye (Yarım) ve dörde (Çeyrek) bölmek; bölünen şekillerin yönü değişse bile aynı şekil olduğunu kavramak.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.1.7.x` (Bütün, Yarım, Çeyrek mantığı ve dönüşümü)
  * `MAT.2.3.1.x` (Cisim / Şekil sınıflandırması)
  * `MAT.2.3.4.x` (Geometrik uzamsal sabitliğin korunumu)

### 3. Kargo Gruplama Bandı (Çarpma, Bölme & Ritmik Sayma)
* **Konsept:** Fabrikadan çıkan yükleri dronlara yüklemek için yığılan kargoları ritmik sayarak üst üste eklemek (Çarpma) veya eşit şekilde filolara paylaştırmak (Bölme).
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.1.4.x` (İleri ve geri ileri seviye ritmik saymalar)
  * `MAT.2.2.4.x` (Çarpmanın tekrarlı toplama, bölmenin paylaştırma temeli)
  * `MAT.2.2.5.x` (Çarpma / Bölme muhakemesi)

### 4. Kuantum Denge Terazisi (İşlemler Arası İlişkiler & Eşitlik)
* **Konsept:** 1. sınıftaki terazinin gelişmiş versiyonu. İki kefeye de dört işlemi içeren matematiksel denklem (örn: sol kefe 15+3, sağ kefe 20-?) yansıtılır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.2.6.x` (Eşitlik sembolü ve eşitliği koruma refleksleri)
  * `MAT.2.2.3.x` (Toplama çıkarmanın denge ve sağlamadaki ilişkisi)

### 5. Hologram Tasarım Üssü (Geometri, Simetri & Örüntü)
* **Konsept:** Projeksiyon ekranına yansıyan yarım bir taşıtın simetrik eksenini bulmak, eksik geometrik parçalardan tam bir araç (Sentez) yapmak ve bu araçların üzerindeki örüntüyü dizmek.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.3.2.x` / `MAT.2.3.3.x` (Cisim ve şekil sentezi/inşası)
  * `MAT.2.3.7.x` (Simetrik şekillerin ayna yansıması)
  * `MAT.2.1.5.x` (Gelişmiş sayı ve şekil örüntü kuralları)
  * `MAT.2.3.6.x` (Mesafe ve yön algısı rotasyonları)

### 6. Kalibrasyon Kulesi (Ölçüm Merkezleri & Zaman)
* **Konsept:** Ana tesisin sayaçları! Dijital saat ekranlarından çeyrek veya buçuk saatleri onaylamak, sıvı reaktörünü doldurmak, uzunlukları / kütleleri cihazlarla standart birimlere tahvil etmek.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.1.9.x` (Tam, Yarım, Çeyrek saatler dizgisi)
  * `MAT.2.3.5.x` (Sıvı miktarı doldurma ve tahmini)
  * `MAT.2.1.10.x` / `MAT.2.1.11.x` (Metre/Kg, standart ölçme ihtiyacı ve tahmini)

### 7. Veri Çekirdeği (İstatistik ve Diziler)
* **Konsept:** Tesisin veri raporunu okuyan bir Dashboard. Kategorik değişkenleri ağaç şeması ve sembol grafiklerine sürükleyip bırakmak. Büyük veri yığınlarında çokluk tahmini ve sayıları büyükten küçüğe sıralamak.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.4.1.x` (Ağaç şeması, Nesne/Şekil grafiği, Veri sıklığı okuma)
  * `MAT.2.1.6.x` (Büyük verilerde (100'e kadar) çokluk tahmini)
  * `MAT.2.1.3.x` (Sıralama ve sayı dizinlerini okuma)

### 8. Otomatik Kantin / Kasa Terminali (Fiziksel Paralar)
* **Konsept:** Tamamen fiziksel donanımlı bir kasa/alışveriş simülasyonu. Ekranda madeni ve kâğıt paralar (sürükle-bırak fiziği ile) üst üste yığılır. Çocuğun elindeki bozuklukları sayarak birleştirip tam değeri bulması ve makineden yakıt/kargo satın alması istenir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.2.1.8.x` (Paralar ile finansal değer eşleştirmeleri ve fiziksel para sayımı)

---

## 🏫 İLKOKUL 3. SINIF MODÜLLERİ

### 1. Sayı Blokları ve Eşleştirme Paneli (Tek/Çift ve Basamaklar)
* **Konsept:** Ekranda 1000'e kadar nesne üretilebilen dijital bir blok kütüphanesi. Öğrenciler blokları birleştirip ayırarak (100'lük, 10'luk, 1'lik) sayıları modeller. "Tek/Çift" testine tıklandığında sistem blokları ikişerli eşleştirerek bağlar; dışarıda yalnız bir blok kalırsa ekranda "TEK" uyarısı yanar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.1.1.x` / `MAT.3.1.2.x` / `MAT.3.1.3.x` (1000'e kadar sayılar ve basamak değerleri)
  * `MAT.3.1.5.x` / `MAT.3.1.6.x` (Tek ve Çift sayıların görsel ispatı)
  * `MAT.3.1.4.x` / `MAT.3.1.7.x` / `MAT.3.1.8.x` (İleri ritmik sayma, sayı örüntüleri ve çokluk tahmini)

### 2. Kesir Modelleme Tezgahı (Pay ve Payda)
* **Konsept:** Etkileşimli bir bütün (daire veya dikdörtgen). Öğrenci "Kes" sürgüsünü çektikçe parça sayısı artar ve bu anlık olarak alttaki `Payda` sayısını değiştirir. Parçalara tıkladıkça içleri renklenir ve bu anlık olarak üstteki `Pay` rakamını artırır. Sembol ve görsel anlık senkronizedir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.1.9.x` (Bütün, yarım, çeyrek sembolleri)
  * `MAT.3.1.10.x` (Birim kesirlerin boyut karşılaştırması)
  * `MAT.3.1.11.x` (Pay ve Payda ilişkisi)

### 3. İşlem Laboratuvarı (Kalanlı Bölme ve Eldeli İşlemler)
* **Konsept:** Alt alta yapılan işlemlerin canlandırmalı arayüzü. 4 işlemi yaparken "Elde var 1" yazmak yerine, 10 adet birliğin paketlenip "Onluklar" sütununa fiziksel olarak uçtuğu animasyonlar. Bölmede ise sepete eşit girmeyen parçaların "Kalan Kutusu"na (Remainder) düştüğü bir simülasyon.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.2.2.x` (Eldeli toplama, bozmalı çıkarma)
  * `MAT.3.2.4.x` (Çarpma işlemleri ve kalanlı bölme görselleştirmesi)
  * `MAT.3.2.1.x` / `MAT.3.2.3.x` (Yuvarlama ve zihinden işlemler)
  * `MAT.3.2.5.x` - `MAT.3.2.8.x` (Çok adımlı problemler, eşitliğin sağ/sol denge testleri)

### 4. Dinamik Birim Dönüştürücü (Zaman, Uzunluk, Ağırlık, Para)
* **Konsept:** İki taraflı sürgülü bir akıllı panel. Öğrenci santimetre ibresini "99" dan "100"e ittiği an ibre *tık* diye kilitlenir ve karşı tarafta büyük bir "1 Metre" yazar. Aynı şekilde kuruşlar 100'e ulaşınca 1 TL ikonuna dönüşür. Zaman da (60 dk -> 1 saat) bir analog saat kadranı etrafında senkronize döner.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.1.12.x` / `MAT.3.1.13.x` / `MAT.3.1.14.x` (Analog/Dijital saatler ve dakika çevrimleri)
  * `MAT.3.1.15.x` / `MAT.3.3.5.x` (Metre/Santimetre, Kilogram/Gram ve Litre çevrimleri)
  * `MAT.3.1.16.x` (Madeni-Kuruş dönüşümleri ve bütçe hesaplama)

### 5. Dijital Geometri Tahtası (Çevre ve Çokgenler)
* **Konsept:** Dijital bir çivili tahta (Geoboard). Öğrenci lastikleri çekerek şekiller (beşgen, altıgen) oluşturur. Sistem, köşeleri (nokta) ve ayrıtları (çizgi) otomatik sayar. Şeklin etrafına tıklanınca çevresindeki birimler renklendirilerek toplanır (Çevre hesabı). Sanal ayna ile simetrik doğrular çizilir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.3.1.x` / `MAT.3.3.2.x` (3D özellik tabloları ve 2D çokgen isimlendirmeleri)
  * `MAT.3.3.4.x` (Kenar uzunluklarıyla Çevre hesabı ispatı)
  * `MAT.3.3.3.x` (Sanal cetvel kullanımı)
  * `MAT.3.3.6.x` / `MAT.3.3.7.x` / `MAT.3.3.8.x` (Simetri aynaları ve koordinat/ızgara yönergeleri)

### 6. Veri Görselleştirme Terminali (Sütun Grafikleri)
* **Konsept:** Ham verilerin girildiği modern bir Dashboard. Öğrenciler bir kategoriye değer girdikçe (Örn: Elma: 15), ekrandaki sütun grafiği / bar chart yukarı doğru yumuşak bir animasyonla uzar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.3.4.1.x` (Verileri sayma, nicel tablolama ve sütun grafiği oluşturma/okuma)

---

## 🏫 İLKOKUL 4. SINIF MODÜLLERİ

### 1. 6 Haneli Veri Kapsülü (100.000'ler ve Örüntü)
* **Konsept:** Dijital ekranlarda devasa 6 basamaklı sayıların parçalanıp döndüğü gelişmiş bir analiz ekranı. Abaküsün modern versiyonu olan dijital sürgülerle 6 haneli sayılar gruplanır, Yüz Binler hanesine kadar çözümlenir (Genişleyen UI) ve ekrandaki veriler ileri ritmik sayılarla örüntüye sokulup büyükten küçüğe sıralanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.1.1.x` / `MAT.4.1.2.x` (100.000'lere kadar devasa sayı temsili ve basamak gruplama)
  * `MAT.4.1.3.x` / `MAT.4.1.4.x` (6 haneli devasa sıralama ve ileri ritmik zincirler)
  * `MAT.4.1.5.x` (Karmaşık örüntüleri formülleştiren kural cümleleri)

### 2. İleri İşlem İşletim Sistemi (Algoritmalar ve Zeka)
* **Konsept:** Çift pencereli bir terminal (İşletim Sistemi). Öğrenci, dört ve çok basamaklı sayıların alt alta çıkarma/çarpma işlem algoritmalarını 'sütun kaydırmalarına' dikkat ederek simüle eder. Ayrıca 'Sıfır Silici/Sıfır Ekleyici' aracı ile 10, 100 ve 1000 ile kısa yoldan sihirli çarpma/bölme hareketleri yapar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.2.1.x` / `MAT.4.2.2.x` / `MAT.4.2.4.x` (Zihinden kısa yollar, sonu sıfırlı çarpmalar, elde/bozma mekanikleri)
  * `MAT.4.2.3.x` / `MAT.4.2.5.x` (Önceden yuvarlayarak tahmin ve uzun sütunlu işlem algoritmaları)
  * `MAT.4.2.6.x` - `MAT.4.2.9.x` (Çok kuralı/ardışık problemleri parçalama ve denklem eşitliğini koruma)

### 3. Dinamik Kesir Terazisi (Denk Kesirler ve Bileşiklik)
* **Konsept:** Şeffaf su tanklarıyla desteklenen neon bir laboratuvar terazisi. Basit kesir (Pay < Payda) ve Bileşik kesir sınırları test edilebilir. "Sadeleştirici/Genişletici Lazer" aracılığıyla kesrin içi bölünüp küçültüldüğünde (veya katlandığında) tanktaki hacmin değişmediği (Denklik korunduğu) ve Payda büyüdükçe dilimin ufalması gibi gerçeklikler su mekanikleriyle doğrulanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.1.6.x` / `MAT.4.1.7.x` (Basit, Bileşik, Tam Sayılı Kesirler ve Denk Kesir sadeleştirme/genişletme)
  * `MAT.4.1.8.x` / `MAT.4.1.9.x` (Birim kesirlerde kural tersliği ve eş paydalı alan kıyası)
  * `MAT.4.1.10.x` / `MAT.4.1.11.x` / `MAT.4.1.12.x` (Bütünden parçaya, kesir işlemi algoritmaları ve problem kurgusu)

### 4. Açınım ve Çevre Analiz Masası (Geometri ve Alan Tahmini)
* **Konsept:** Üç boyutlu küplerin ve prizmaların bir kâğıt kutusu gibi ekranda *şlak* diye 2D zemine serildiği bir 3D tarama masası. Öğrenci açılan şekilde kenar eşliklerini test eder, sanal bir metre sararak şeklin dış Çevresini bulur, içini "üçgen fayanslar" sürükleyerek Alan tahmini yapar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.3.1.x` (3D'den 2D'ye çokgen açınımları ve ambalaj modelleri)
  * `MAT.4.3.2.x` / `MAT.4.3.3.x` (Köşe/Ayrıt eşliği ve teknolojik/sanal araçlarla çevre dolanımı)
  * `MAT.4.3.4.x` (Frekans alan şablonlarıyla -standart olmayan birimle- tahmini iç bölge alanı doldurma)
  * `MAT.4.3.8.x` / `MAT.4.3.9.x` / `MAT.4.3.10.x` (Çapraz/Zor simetri aynaları, kodlama bloklarıyla şekil inşası)

### 5. Rotasyonlu Açı İletkisi (Dönme Dolap)
* **Konsept:** Açının iki çizgi değil de "menteşe/merkez ekseninde dönme eylemi" olduğunu kanıtlayan, merkeze sabitli sanal bir kapı/tekerlek sistemi. Dönme eylemi başladıkça sistem dijital olarak açıları saptar. Öğrenci sanal bir iletkiyi (açıölçer) sistemin üstüne oturtur. 90, dar veya geniş klasörlerine dönebilen şekilleri sürükler.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.3.5.x` (Açıyı rotasyon -dönme- olarak simüle etme mantığı)
  * `MAT.4.3.6.x` (Açı ölçme aleti -iletki- sistem entegrasyonu)
  * `MAT.4.3.7.x` (Dik, Dar, Geniş açıların 90 birim sınırı üzerinden eylemsel olarak klasörlenmesi)

### 6. Ağ Tasarım ve Optimizasyon Terminali (Dönüşüm & İleri Veri)
* **Konsept:** Çok amaçlı dev ekran kontrol paneli. Bir yanda ton (t) ibreleri milimetrelere (mm) çevrilen endüstriyel dönüştürücü vites mekanizması var. Diğer yanda çoklu (örneğin A ve B sınıfından) verilerin aynı grafik üzerinde çiftli-sütunlarla (ikili bar chart) okunuşu işleniyor. Sistem sonunda da "Bu bardağın devrilmesi İMKANSIZ" diyerek Olasılık mekanikleri etiketletiyor.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.4.1.13.x` (Ton->Kg, mm->cm, m dönüşümleri)
  * `MAT.4.4.1.x` (İmkansız, Kesin, Olabilir olasılık kurgu etiketlemeleri)
  * `MAT.4.4.2.x` (İkili veya daha fazla kategori barındıran kompleks sütun grafiği ile çapraz mukayese)

---

## 🚀 ORTAOKUL 5. SINIF MODÜLLERİ

### 1. Devasa Nicelik Çekirdeği (Milyonlar ve Olasılık Dizilimi)
* **Konsept:** Sayıların yüz milyonlara kadar ufuk çizgisi gibi uzadığı gelişmiş bir büyüklük simülatörü. Öğrenci 9 haneli rakamları bloklayarak okumakla kalmaz, aynı ekranın mikro (0 ile 1 arası) bölümüne geçerek Olasılık değerlerinin (İmkansız=0, Kesin=1) aslında bu makro-mikro sayı ekseninde nereye düştüğünü görselleştirerek test eder.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.1.1.x` (7, 8 ve 9 basamaklı (Milyonlar) sayıların sembolik ve parçalı okunması)
  * `MAT.5.6.1.x` (Olasılığın sadece 0 ve 1 arasında var olabileceği kanunu)
  * `MAT.5.6.2.x` (Olayları "Daha Olasılıklı / Daha Az" olarak ağırlıklandırma)

### 2. Algoritmik Denklem Laboratuvarı (İşlem Önceliği ve Eşitlik)
* **Konsept:** Çift taraflı dev bir güç terazisi. Terazide sadece ağırlık değil, karmaşık denklemler var. Öğrenci eşitliği korumak zorundadır (Sağa X2 işlemi yaparsa sola da yapmak zorundadır). İşlemleri çözerken "İşlem Önceliği" kanunları işler; sistem parantez içlerine "Enerji Kalkanı" koymuştur ve öğrenci önce onu kırmak (çözmek), ardından Çarpma/Bölme silahlarını kullanmak zorundadır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.2.1.x` (Terazi/Eşitlik korunum işlemleri kanunu)
  * `MAT.5.2.2.x` (Parantez içi -> Çarpma/Bölme -> Toplama/Çıkarma algoritmaları)
  * `MAT.5.2.3.x` / `MAT.5.2.4.x` (Örüntü n. kuralı hesabı ve operasyon hata/bug ayıklama)
  * `MAT.5.1.2.x` (Karmaşık metin problemini adım adım algoritmalara bölme)

### 3. İleri Kesir Senkronizatörü
* **Konsept:** Yan yana duran sıvı/enerji tankları. Öğrenci "Tam sayılı kesir" (1 tam tank ve yarım tank) tanklarının altındaki vanayı çevirdiğinde aradan bir sıvı akar ve otomatik olarak "Bileşik Kesre" (3/2) ayrışır. Farklı paydalara sahip kesirleri sıralamak için "Eşitleyici Amplifikatör" aracıyla paydaları genişleterek büyüklük ispatı yapar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.1.3.x` (Problem -> Kesir dönüşümü ve Tam/Bileşik çevrim simülasyonları)
  * `MAT.5.1.4.x` (Farklı paydaları genişleterek veya tam sayı ile kıyaslayarak sıraya dizme)

### 4. Vektörel Tasarım Paneli (Işın, Doğru ve Açı Fiziği)
* **Konsept:** Siyah zeminli şık bir Vektör (CAD) arayüzü. Öğrenci Doğru (iki ucu sonsuz), Doğru Parçası (sınırlandırılmış) ve Işın (tek ucu sonsuz) çizer. Bu lazerler birbiriyle kesiştiğinde akıllı panel "Ters Açılar ve Komşu Açılar" ilişkilerini ekranda patlatır. Şeffaf "Sanal İletki" ekrana sürüklenerek kesin açı (Derece) tespiti yapılır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.3.1.x` / `MAT.5.3.2.x` (Doğru, Işın, Doğru parçası dijital kurgusu ve koordinat ilişkisi)
  * `MAT.5.3.3.x` / `MAT.5.3.4.x` (İletki aracıyla derece saptama, komşu/ters açılar ve kesişen lazerler)

### 5. Poligon Çatışma Testi (Üçgen Eşitsizliği ve Geometri)
* **Konsept:** Çubuklardan 2D iskelet inşası. Öğrenci bir üçgen oluşturmak için iki kısa, bir aşırı uzun çubuğu uç uca eklemeye çalışır, ancak sistem "Hata! (Üçgen Eşitsizliği İhlali)" diyerek çubukların kavuşmadığını fizik motoruyla gösterir. Ayrıca oluşturulan çokgenlerin iç açılarının (Örn: Üçgen=180) toplanıp kilitlendiğini vizüalize eder.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.3.5.x` / `MAT.5.3.6.x` (Çokgen sınır özellikleri ve iç açılar toplamı ispatları)
  * `MAT.5.3.7.x` (Üçgenin iki kenar toplamının diğerinden büyük olmak zorunda olduğu fizik kanunu)

### 6. Optimizasyon Üssü: Alan & Çevre & Veri Dedektifi
* **Konsept:** Grid (ızgara) tabanlı bir mimari planlama modülü. Çiti (çevresi) aynı uzunlukta olan ipleri bükerek "Nasıl maksimum fayans (Alan) kaplayan" odalar elde edeceğini test eder. İşi bittiğinde ekranın sağındaki "Data Detectives" panelinde gazetelerden/medyadan alınan yalanlayıcı sütun/çizgi grafiklerini teşhis ederek anormallik/manipülasyon hatalarını bulur.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.5.4.1.x` / `MAT.5.4.2.x` (Dikdörtgen denklemleri ve İç bölgeyi 1x1 birim kareyle ispatlama)
  * `MAT.5.4.3.x` / `MAT.5.4.4.x` (Sabit çevre/Farklı alan, Sabit Alan/Farklı çevre optimizasyonları ve günlük problemler)
  * `MAT.5.5.1.x` / `MAT.5.5.2.x` (Zıt veya hatalı tasarlanmış manipülatif (çizgi/sütun) medya grafiklerini teşhis)

---

## 🚀 ORTAOKUL 6. SINIF MODÜLLERİ

### 1. Kuantum Filtre İstasyonu (Asal Sayılar, Çarpanlar ve Algoritmalar)
* **Konsept:** Sayıların fabrikaya girmeden önce lazer filtrelerden (Bölünebilme Kuralları) geçtiği güvenlik tarayıcısı. Öğrenci çift sayılar, sonu 0/5 olanlar veya rakam toplamı 3'ün katı olanları filtreleyerek eler. Tüm filtrelerden kurtulan "kırılamaz" sayılar (Asal Sayılar) Eratosten Kalburu havuzuna düşer. Asal olmayanlar ise "Çarpan Ağacı Lazerinde" parçalanıp EBOB (parçalara ayırma) veya EKOK (alarm/nöbet senkronizasyonu) kalkanlarına yönlendirilir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.1.1.x` (Çarpanları ve katları eksiksiz listeleme/örüntüleme)
  * `MAT.6.1.2.x` (2, 3, 5, 6, 9 ve 10 ile bölünebilme lazer kuralları)
  * `MAT.6.1.3.x` / `MAT.6.1.4.x` (Asal sayılar, Eratosten kalburu, asal çarpanlar, EKOK/EBOB algoritmaları)

### 2. Format Dönüştürücü Çekirdek (Ondalık, Kesir, Yüzde Entegrasyonu)
* **Konsept:** Karmaşık verilerin tek tipe dönüştürüldüğü simyacı makinesi. Bir tanktaki maddeye 1/2, %50 veya 0.50 yazıldığında, tüm gösterge panelleri (Kesir blokları, Ondalık basamak tablosu, Yüzde barı) aynı anda sekronize olarak eşdeğer seviyeye gelir. Kesir bölmesi yapmak isteyen öğrenci, makinedeki 2. Kesir Bloğunu ters çevirir ve (Tersine Çarpan) şalterini kaldırır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.1.5.x` (Ondalık kesirlerin yazımı ve basamak analizi)
  * `MAT.6.1.6.x` (Kesirlerle bölmede ters çevirip çarpma fonksiyonu)
  * `MAT.6.1.7.x` / `MAT.6.1.8.x` (Uygun ölçü tespiti ve farklı tür verileri (Kesir, %, Ondalık) tek dile/formata eşitleme)

### 3. Cebirsel Reaktör (Denklem Dengesi ve Değişkenler)
* **Konsept:** İleri seviye bir enerji terazisi. Öğrenci kefelere bilinmeyen 'X', '2X' kutularını ve sabit enerji bloklarını fırlatır. Kefelerdeki "Benzer Terimleri" üst üste okutarak birleştirir (Sadeleştirme). X'i terazide yalnız bırakma algoritmalarını işlettikten sonra, makinenin "n Generatörüne" bir formül yazar (Örn: 2n+1) ve makine o formüle uygun sıralı örüntü dizilerini dışarı tükürür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.2.1.x` (Bilinmeyen 'X' içeren terazi tabanlı denklem ispatı)
  * `MAT.6.2.2.x` (İlerleyen örüntüleri 'n' değişkenli makine formülüne dökmek)
  * `MAT.6.2.3.x` (Cebirsel ifade parçaları: Katsayı, Sabit, Terim ve Benzer terimleri toplama/çıkarma)

### 4. Optik Lazer Labirenti (Paralel Doğrular ve Açı Bağlantıları)
* **Konsept:** Uzay üssünün (Z, U, M) fiber optik hatlarını tamir etme arayüzü. Öğrenci paralel iki çizgiyi kesen bir lazer atar. Sistem anında köşelerde açılar oluşturur. Yöndeş, İç Ters ve Dış Ters açıları, renkli enerji kalkanlarıyla eşleştirerek kilitleri açar. Kapalı dörtgenlerin köşegen motorlarını çalıştırıp şekilleri Paralelkenar veya Yamuk olarak sabitleyerek eksik açı derecelerini (180/360) kilitlerine girer.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.3.1.x` / `MAT.6.3.2.x` (İç/Dış ters açılar, yöndeş açı ile Z/U/M labirent kuralı)
  * `MAT.6.3.3.x` / `MAT.6.3.4.x` (Köşegenden şekil -Kare/Yamuk- teşhisi, iç açılar toplamından eksik X açısını bulma)

### 5. Geometrik Alan ve Pi (π) Laboratuvarı
* **Konsept:** Fizikçi animasyon masası. Dikdörtgen bir blok, köşegen sürgüsüyle "kat" diye ikiye ayrılır ve Üçgen'in yarım alan $(a*h)/2$ formüllediği ispatlanır. Veya üstten yana itilir ve Paralelkenar olur. Sonra masada fırlatılan bir tekerlek tam 1 tur döner. Tekerleğin bıraktığı mürekkep izi çapın etrafına sarılır ve daima "3,14"te kaldığı izlenip Pi(π) sabiti ateşlenir. Devamında çemberin çevresi hesaplanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.4.1.x` (Uzunlukların 10'ar (1D), Alanların 100'er (2D) büyüme/küçülme simülasyonu)
  * `MAT.6.4.2.x` / `MAT.6.4.3.x` (Dikdörtgenden bükülerek Üçgen/Paralelkenar alan buluşu ve gerçek hayat problem entegrasyonu)
  * `MAT.6.4.4.x` / `MAT.6.4.5.x` / `MAT.6.4.6.x` (Çevre / Çap = π mucizesi, Çember çevre formülü ($2\pi r$) ve merkez (yay) ölçüleri)

### 6. Büyük Veri Hızlandırıcısı (Deneysel Olasılık, Ortalama ve Medya Analizi)
* **Konsept:** Kontrol paneli (Data Dashboard). Sisteme yüzlerce hızlandırılmış zar atma animasyonu girilir. İlk başlarda (Düşük sayı) grafik şaşar, 1000'inci zarda grafik jilet gibi dümdüz olarak teorik (1/6) ve gözlemsel olasılığın birleşimini kanıtlar (Büyük Sayılar Kanunu). Ardından verilerin Aritmetik Ortalaması ve açıklığı bulunur. Kenardaki "Fake Analiz" ekranında medya tarafından kasıtlı çarpıtılmış orantısız grafikleri (Yanıltıcı algı) tespit edip uyarı verir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.6.5.1.x` / `MAT.6.5.2.x` (Ortalama-Açıklık ile istikrar saptama ve hatalı grafik manipülasyonları fark etme)
  * `MAT.6.6.1.x` (Deney (Gözlem) sayısını sonsuza götürerek Teorik olasılığa varma simülasyonu)

---

## 🚀 ORTAOKUL 7. SINIF MODÜLLERİ

### 1. Kuantum Kesir / Ondalık Senkronizatörü (Negatif Genişleme)
* **Konsept:** Sayı doğrusunun yeraltına (negatiflere) doğru sonsuz uzadığı, termometre asansörü arayüzü. Öğrenci rasyonel sayıları (Örn: -3/4) bu kuyuya yerleştirir, sıfıra yaklaştıkça enerjinin arttığını (büyüklüğü) görür. Makinenin üstündeki devir motoruna 1/3 atıldığında sistem sonsuz bir döngüye (0.333...) girerek devirli ondalık simülasyonunu başlatır. Ekrana eklenen "Maaş-Bütçe Modülü", parçalı problemleri algoritmaya çevirir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.1.1.x` (Negatif tamsayılar, asansör mantığı ve Küme diyagramları)
  * `MAT.7.1.2.x` / `MAT.7.1.3.x` (Devirli ondalık simülasyonu ve Negatif rasyonel sıralama)
  * `MAT.7.1.4.x` (Çok adımlı rasyonel hayat -örnek: maaş/pasta- problemleri)

### 2. Altın Oran Kalibratörü (Oran, Orantı ve Çapraz Algoritma)
* **Konsept:** İki niceliğin birbirine (Örn: Dişli çarkların dönüş hızları ile çapları) oranlandığı mekanik test odası. Makinedeki iki veriyi "Altın Çizgi (/), Nokta (:)" formatlarında gösteren 3 farklı lens. Öğrenci "Doğru Orantı" kolunu çektiğinde, A çarkı büyürse B çarkı da fiziksel olarak aynı sekronla büyür. Orantıyı kanıtlamak için ekranda iki oran arasında dev bir `X` (Çapraz çarpım eştliği) lazeri çakılır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.1.5.x` (Bölüm ilişkisinin kesir, nokta ve çizgi ile sembolize modülleri)
  * `MAT.7.1.6.x` (İki oranın eşitliğini test eden çapraz çarpım modülü)
  * `MAT.7.1.7.x` (Bir değişkenin diğerini aynı miktar arttırdığı Doğru Orantı fizik simülasyonu)

### 3. Akış Diyagramı ve Terim Reaktörü (Cebir, Eşitsizlik)
* **Konsept:** Parantezli cebir işlemlerinin bir "Girdi -> İşlem -> Çıktı" (Input/Output) makinesinde akış diyagramı node'larına dönüştüğü yazılım arayüzü (Node-based UI). Dev bir terazide öğrenci `+` terimleri `-` olan tarafa fırlattığında terimin rengi/işareti değişir (Karşıya atma kuralı). Ayrıca "<" (Küçük) ve ">" (Büyük) sınır lazerleriyle sayı doğrusunda Karantina (Eşitsizlik) Bölgeleri taranır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.2.1.x` / `MAT.7.2.2.x` (Rasyonel cebir dağılımı, Terim transferi/işaret değişimi ve Eşitsizlik sınır taraması)
  * `MAT.7.2.3.x` (Çift+Çift=Çift mantıksal argüman ispatlayıcı)
  * `MAT.7.2.4.x` (Algoritmik akış şeması (Node UI) inşası)

### 4. Optik Mimari Masası (Yansıma, Açıortay ve 3D Prizmalar)
* **Konsept:** Mimari bir CAD çizim masası. Öğrenci lazer pergelle bir açıyı tık diye eş iki yarıya (Açıortay) kopartır veya doğrunun tam ortasından ayna ekseni (Orta Dikme) sarkıtır. Masanın sağındaki 3D İzometrik alanda ise birim küplerle inşa edilmiş piramitleri kamera ile sağdan, soldan, üstten süzerek 2D gölgelerini (Profili) çıkarır. 
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.3.1.x` (Uzaklığı/Ekseni eşit yansıma (Ayna) transformasyonu)
  * `MAT.7.3.2.x` (Orta Dikme ve Açıortay sanal çizim araçları)
  * `MAT.7.4.1.x` (3D izometrik yapıların Üst/Sağ/Sol 2D profillerini haritalama)

### 5. Hacim Dolum Tesisleri & Daire Alan Kurgusu (3D Ölçüm)
* **Konsept:** Cam dikdörtgenler prizmasının içini lazer yağmuru gibi suyla değil; sert 1x1'lik 3D birim küplerle (*Minecraft tarzı*) dolduran dolum tankı (`Taban Alanı x h = Hacim`). Daha sonra sistem m³ birimli kargoları cm³ birimine parçalayarak 1000^3 kuralını ispatlar. Tesisin diğer odasında makine pizzayı sonsuz üçgen dilimine kesip yan yana dizerek bir dikdörtgene (`π.r.r`) kilitler (Daire alan mucizesi).
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.4.2.x` / `MAT.7.4.3.x` / `MAT.7.4.4.x` (Prizma alan/açınım toplamı ve 1x1 küplerle Hacim katman mantığı)
  * `MAT.7.4.5.x` / `MAT.7.4.6.x` (m³ ve cm³ dönüşüm ispatı ile Malzeme/Sarfiyat hayat problemleri)
  * `MAT.7.4.7.x` / `MAT.7.4.8.x` / `MAT.7.4.9.x` / `MAT.7.4.10.x` (Dairenin dikdörtgene sentezlenişinden $~πr²$ buluşu, Merkez açı kesiti, Yamuk-Eşkenar alanları ve iç içe 3D kurgular)

### 6. Geometrik Asistan Robot & Spekülasyon Dedektifi (Vektör ve Veri)
* **Konsept:** İki modüllü sistem. Sol tarafta bir üçgenin tavanına tıklandığında "Kenarortay", "Açıortay" ve "Yükseklik (Dikme)" lazerlerinin nasıl birbirinden farklı düştüğünün vektörel ispatı. Sağ tarafta ise bitki büyümesi, borsa gibi "zamanla değişen" verilerin sürekli çizgi grafiği üzerindeki canlı akışı. Ekranın "Dedektif" uyarı merkezinde ise "Anket Manipülasyonları" ve olasılıktaki "Olumsuzu (Tümleyeni) Bütüne Tamamlama" analizleri ile kesişen/ayrık küme ikazları yapılır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.7.5.1.x` / `MAT.7.5.2.x` (Üçgen iç asistanları: Kenarortay, açıortay, dikme tespiti)
  * `MAT.7.6.1.x` / `MAT.7.6.2.x` (Zaman-Çizgi grafiği mekanizması ve manipülatif medya anket eleştirisi)
  * `MAT.7.7.1.x` / `MAT.7.7.2.x` / `MAT.7.7.3.x` (Bir olayın "Olmama (Tümleyen)" durumunun %100'e tamamlaması, Eşit alan kurguları ile Ayrık/Ayrık Olmayan Zar kümeleri analizi)

---

## 🚀 ORTAOKUL 8. SINIF MODÜLLERİ

### 1. Radikal Üs ve Kök Jeneratörü (İrrasyonel Ayrıştırıcı)
* **Konsept:** Negatif kuvvetin (- üs) bir rasyonel sayıyı "Takla attırdığı" mekanik bir jeneratör. Yanında bulunan Karekök ($\sqrt{}$) Makinesi ise tam kareleri direkt çıkarırken, $\sqrt{45}$ gibi düzensizleri parçalayıp "a$\sqrt{b}$" olarak sızdırır. En sonda $\pi$ veya $\sqrt{10}$ gibi irrasyonel anomaliler, sürgülü aletle sayı doğrusu üzerinde (Örn: 3 ile 4 arasına) kesin noktalarına sıkıştırılıp fişlenir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.1.1.x` (Negatif üsle takla atma, tabanları aynı ifadeleri çarparken/bölerken üs kombinasyonları)
  * `MAT.8.1.2.x` / `MAT.8.1.3.x` / `MAT.8.1.4.x` (Tam kare a$\sqrt{b}$ dışarı alma, İrrasyonelleri tespit edip tam sayı aralıklarında hapsetme)

### 2. Koordinat ve Lineer Fonksiyon Uydusu (Cebirsel Kesişim)
* **Konsept:** Karanlık bir radar ekranı (+x, -x, +y, -y) . Taksimetre gibi adım adım artan ($f(x) = ax+b$) günlük bir senaryo denkleme döküldüğünde ekranda dijital bir doğru çizilir. Sisteme iki farklı fonksiyon lazeri girildiğinde, sistemin Kesişim($x,y$) noktasının her iki denklemin de ortak "çözümü" olduğu kanıtlanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.2.1.x` (Apsis ve ordinat sisteminde yönlü bölge navigasyonu)
  * `MAT.8.2.2.x` / `MAT.8.2.3.x` / `MAT.8.2.4.x` (Doğrusal fonksiyon modelleme ve iki fonksiyon doğrusunun kesişiminde çözüm ispatı)

### 3. Üçgen Boyut Laboratuvarı ve Pisagor Ağı
* **Konsept:** İnteraktif ve esneyen bir Fizik/Vektör test odası. Öğrenci köşeden bir ipi asılıp açıyı büyüttükçe karşı kenarın da otomatik büyüdüğünü seyreder. Sistem öğrenciye 2cm, 3cm, 10cm gibi uyumsuz demir çubuklar verir, ancak Üçgen Eşitsizliği kuralından ötürü uçları bir türlü kaynaşmaz! Diğer yanda $a^2 + b^2 = c^2$ makinesi çalışarak alanı karelerle doldurup, dik üçgenin kusursuz "Hipotenüs" kestirmesini simüle eder.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.3.1.x` / `MAT.8.3.2.x` (Açı-Kenar büyüme esnekliği ve Üçgen eşitsizliği kırılma sınırları)
  * `MAT.8.3.3.x` / `MAT.8.3.4.x` (Eş üçgenler kurma (KKK, KAK) ve zoom in/out (Büyütme/Küçültme) kurgulu Benzerlik ispatı)
  * `MAT.8.3.5.x` / `MAT.8.3.6.x` (Pisagor teoreminin dik üçgen alanlar ispatı ve merdiven/duvar eğim problemleri)

### 4. 3D Holografik Ambalaj Tesisi (Silindir ve Prizmalar)
* **Konsept:** Ekranda dönen 3 boyutlu bir Piramit, Koni ve Silindir... Fareyle üstlerindeki bir fermuarı çekiyoruz ve bir ambalaj kutusu gibi *şlak* diye 2D boyuta yayılarak alan formüllerini açık ediyorlar. Silindirden dökülen büyük dikdörtgen ve alt/üst daire kapakları (2$\pi r \cdot h$ + $2\pi r^2$) alan kanunuyla toplanır, iç kısımları da $h$ (yükseklik) boyunca zemin hacmi ($\pi r^2$) kopyalanarak simüle edilir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.4.1.x` (Piramit, Koni ve Silindir 3D-2D açınım eşleştirmeleri)
  * `MAT.8.4.2.x` / `MAT.8.4.3.x` (Holo-Silindirin taban, yanal yüzey alanları entegrasyonu ve hacim simülasyonu)

### 5. Kinematik Transformasyon Matrisi (Öteleme & Yansıma)
* **Konsept:** Koordinat ekranındaki bir roketin veya nesnenin, yapısı/boyutu gram bozulmadan vektörel olarak ($X$ yönünde $+3$, $Y$ yönünde $-2$) süzülerek Ötelendiği (Translation) bir animasyon sekansı. Sonrasında ötelendiği yerde "aynalama" yeteneği çalıştırılarak kombolu ve ardışık dönüşüm kanunları kodlanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.5.1.x` / `MAT.8.5.2.x` (Bütünlük bozulmadan X/Y koordinatlarında Öteleme (Translation) ve üzerine Y ekseni ile Kombine Yansıma)

### 6. Spekülasyon Klasörü (Niceliksel Veri ve Olasılık Dedektifi)
* **Konsept:** Araç sayısı veya bilye gibi bütün halinde ilerleyen durumlara "Kesikli (Discrete)", boy veya zaman gibi aralıklı ölçülebilenlere "Sürekli (Continuous)" uyarısı basıp otomatik doğru grafik formatını tasarlayan robotik editör. Aynı makine, olasılık senaryolarına bakıp damga vurma masasında çalışır: Bunu formülle biliyorsam "Teorik", zarları bizzat denediysem "Deneysel", kafama/fikrime göre tahmin ediyorsam "Öznel" damgasını basar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.8.6.1.x` (Gerçek yaşam verilerini Kesikli/Sürekli (Discrete/Continuous) filtreden geçirip grafik tespiti)
  * `MAT.8.7.1.x` (Oluşan sonucun kaynağına "Teorik", "Deneysel" ve "Öznel/Kişisel" analiz mühürleri basma)

---

## 🛰️ LİSE MODÜLLERİ (9-12. Sınıflar)

## 🛰️ LİSE 9. SINIF MODÜLLERİ

### 1. Kök ve Üs Reaktörü (Üslü / Köklü İfadeler)
* **Konsept:** Öğrenci üslü ifadeleri sürüklenebilir enerji çekirdekleri gibi reaktör yuvalarına çarpıştırır; aynı taban çarpışınca üslerin toplandığını doğrudan görür. Köklü ifade katmanında `√72` içinden `√36` tam kare bloğu dışarı çıkar, `√2` kalıntısı kök içinde kalır. Modül tek bakışta iki fiziksel işlem öğretir: aynı tabanda üs birleşimi ve kökten tam kare ayırma.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.1.1.x` / `MAT.9.1.2.x` (Gerçek sayıların köklü ve üslü formlarını hesaplama / basitleştirme)
* **Sonraki Makro Modüller:**
  * `MAT.9.1.3.x` için **Aralık Kapıları İstasyonu**: açık/kapalı uçlar, kesişim ve birleşim sayı doğrusunda kapı-kalkan metaforuyla ayrılacak.
  * `MAT.9.1.4.x` / `MAT.9.1.5.x` için **Gerçek Sayı Atlası ve İşlem Yasaları**: sayı kümeleri ve işlem özellikleri ayrı, sakin bir sınıflandırma/dağıtma deneyine taşınacak.

### 2. Fonksiyonel Hologram Odası (Doğrusal Fonksiyon Kalibrasyonu)
* **Konsept:** Kartezyen ızgarada duran lazer çizgisi iki canlı düğümle kontrol edilir. Mavi kaynak düğümü sürüklenince `r` ve `k` grafiği yatay/dikey taşır; yeşil eğim kolu çekilince `a` katsayısı lazeri döndürür. Öğrenci formül paneliyle uğraşmaz; hedef hologram çizgisiyle gerçek lazeri üst üste getirerek `f(x)=a(x-r)+k` dönüşümünü görür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.2.1.x` ($f(x)=x$ fonksiyonu, y ekseni kaydırması, x ekseni kaydırması ve eğim (a) manipülasyonu)
* **Ayrılan Gelecek Makro Modüller:**
  * `MAT.9.2.2.x` için **Mutlak Değer Ayna Odası**: negatif ışının yukarı katlanması ve tepe noktası tek ayna mekaniğiyle işlenecek.
  * `MAT.9.2.3.2` için **Eşitsizlik Güvenlik Alanı**: $y \ge f(x)$ gibi çözüm bölgeleri lazer sis/tarama alanı olarak ayrı kurulacak.

### 3. Akıllı Mantık Devreleri (Logic Gates)
* **Konsept:** Fiziksel bir elektronik devre test tezgahı. Öğrencinin tek oyuncağı A/B anahtarlarıdır; aktif kapı kartuşu göreve göre değişir. VE, VEYA, İSE ve YA DA kapıları aynı kablo düzeninde farklı çıkış üretir. Mini doğruluk tablosu sahnede yanar, İSE kapısında `1=>0` tek hata durumu özel kırmızı arıza animasyonuyla görünür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.3.2.x` (VE, VEYA, İSE ve YA DA mantıksal doğruluk kapıları)
* **Ayrılan Gelecek Makro Modüller:**
  * `MAT.9.3.1.x` için **Algoritma Akış Hattı**: problemi ardışık bloklara bölme, kablo sıralama değil süreç tasarımı olarak ele alınacak.
  * `MAT.9.3.3.x` için **Niceleyici Radar Avı**: Her/Bazı niceleyicileri küme elemanlarını tarayan ayrı radar/arama deneyine taşınacak.

### 4. Üçgen Gerilim Laboratuvarı (Kenar-Açı)
* **Konsept:** Köşeleri doğrudan sürüklenebilen canlı üçgen vektörü. Öğrenci özellikle bir köşeyi çekerek açının büyümesini, karşı kenarın uzamasını ve en büyük açı ile en uzun karşı kenarın aynı anda parlamasını görür. Ardından aynı üçgenin A-B-C açı parçalarını 180° ispat rayına sürükleyerek iç açı toplamını doğrular.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.4.1.x` (Üçgende açı-kenar ilişkisi ve iç açı toplamı doğrulaması)
* **Sonraki Makro Modüller:**
  * `MAT.9.5.2.x` için **Benzerlik Ölçek Stüdyosu**: eş açılar ve orantılı kenarlar üzerinden iki üçgeni üst üste bindirme.
  * `MAT.9.5.3.x` için **Dik Üçgen Teorem Laboratuvarı**: Tales, Öklid ve Pisagor bağlantılarını ayrı ispat deneyleriyle açma.

### 5. Yansıma ve Döndürme Adli Bilişimi (Dönüşüm)
* **Konsept:** Tek ana oyuncak bir adli iz eşleştirme ekranı. Öğrenci önce döndürme merkezini doğrudan sahnedeki orijine sürükler, sonra açı halkasını 90° izine çevirir, son katmanda da ayna eksenini sahnedeki çizgilerden seçer. Kural, hayalet şeklin hedef iz ile çakışmasıyla sezgisel olarak görünür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.5.1.x` (Açı formundan döndürme merkezini ve ayna eksenini adli analizi)

### 6. Veri Karar Radarı (İstatistiksel Dağılım)
* **Konsept:** Üç sınıfın puan bulutları aynı anda görünür, fakat öğrenci sadece bir sigma tarayıcısını hareket ettirir. Tarayıcı en dar dağılım olan Sınıf B üzerinde kilitlenince “istikrar = küçük standart sapma” sezgisi oluşur. İkinci katmanda kutu-bıyık grafiğinde medyan okuyucu sürüklenir; doğru çizgiye oturduğunda medyanın veriyi iki eş yarıya böldüğü görünür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.9.6.1.x` / `MAT.9.6.2.x` (Standart sapma, kutu-bıyık analizi ve istikrarlı grup seçimi)
* **Sonraki Makro Modüller:**
  * `MAT.9.7.1.x` / `MAT.9.7.2.x` için **Olasılık Deney Makinesi**: gözlemsel oran ve tümevarımsal projeksiyon, veri radarından ayrı bir çark/deney makinesi olarak yapılacak.

## 🛰️ LİSE 10. SINIF MODÜLLERİ

### 1. Şifreli Kuantum Kasası (Bölünebilme ve Algoritmik Asallar)
* **Konsept:** Siber güvenlik şifreleriyle kilitlenmiş kasalar. Öğrenci devasa bir sayının şifresini (Örn: 360) kırmak için asal lazerlerle onu eriterek çarpanlarına ayırır. EBOB ve EKOK kilitlerinde, birden fazla sayının şifre çarkı aynı anda döndürülür ve kesiştikleri hizalarda (katlar) kilit açılır. Kalanlı (Modüler) bölme kapılarında ise bölme yapmadan "Son 2 rakam" gibi hızlı kurallar test edilerek kalkan atlatılır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.1.1.x` (Asal çarpanları izole etme ve bölen listesi çıkarma)
  * `MAT.10.1.2.x` (EBOB ve EKOK algoritmalarını çoklu sayılarda hesaplama)
  * `MAT.10.1.3.x` (Bölme işlemi yapmadan modüler kalan bulma taktikleri)

### 2. Fonksiyon Mu Filtresi (Fonksiyon Şartları) ✅
* **Konsept:** Tek ana oyuncak dikey lazer filtresi. Öğrenci lazeri bir bağıntı üzerinde gezdirir; aynı x değeri iki farklı y üretirse kırmızı alarm verir ve ilişki fonksiyon olarak reddedilir. Son katmanda `f(x)=2x+1` kuralı, tanım kümesi giriş portlarını doğru çıkış portlarına bağlayan görsel bir ağ olur.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.2.1.x` (Dikey doğru testiyle fonksiyon doğrulama ve tanım kümesi elemanlarını matematiksel kuralla eşleştirme)
* **Erişilebilir Etkileşim:**
  * Dikey tarayıcı sürüklenir; odaklanan tarayıcı sağ/sol oklarla küçük adım atar ve `Home` ile aktif hedefe hizalanır. Portlar tıklanır veya klavyeyle seçilebilir.

### 3. Parabol Şekil Stüdyosu (Karesel Fonksiyonlar) ✅
* **Konsept:** Ekranda `y=x²` kasesi yaratılan sakin bir hologram stüdyosu. Öğrenci mavi tepe düğümünü sürükleyerek `h` ve `k` kaymasını, pembe genişlik kolunu yukarı/aşağı çekerek `a` katsayısının parabolü daraltıp genişletmesini görür. Sarı kesik hedef hologram, canlı parabolün nereye oturacağını gösterir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.2.2.x` (Referans parabolü çizme, parabolü daraltma/genişletme ve tepe noktasını eksenlerde kaydırma)
* **Ayrılan Gelecek Makro Modüller:**
  * `MAT.10.2.5.x` için **Ters Fonksiyon Aynası**, `MAT.10.2.6.x` için **İşaret Tablosu Tarayıcısı** ayrı modüllerdir.

### 4. Tanım Kümesi Kapıları (Karekök ve Rasyonel Fonksiyon) ✅
* **Konsept:** Tek ana oyuncak koordinat kapı ekranı. Öğrenci karekök başlangıç düğümünü ve güvenli bölge kapısını x=0 çizgisine kilitleyerek `x≥0` fikrini görür; rasyonel katmanda asimptot duvarı ve `x≠0` alarmı aynı hedef çizgide kilitlenir. Kırmızı cam yasak alan, grafiğin nerede doğmadığını veya geçemediğini matematiksel olarak görünür kılar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.2.3.x` / `MAT.10.2.4.x` (Karekök referans grafiği, güvenli tanım bölgesi, rasyonel referans grafiği ve payda sıfır/asimptot yasağı)
* **Erişilebilir Etkileşim:**
  * Kapılar sürüklenir; ayrıca odaklanan handle sağ/sol oklarla ince ayar yapar ve `Home` ile orijin çizgisine hizalanır.

### 5. Otomatik Dizgi Terminali (Kombinasyon, Sayma ve Cebir)
* **Konsept:** Holografik bir üretim veya montaj hattı. Öğrenciye bir sipariş gelir ("Ya araba ya motor ver," veya "Önce gövde, sonra motor ve en son boya şasisi diz"). Eğer istenenler birbirinden bağımsız ayrık durumlarsa (Toplama yoluyla), aynı paralel bantlara düşerler. Peş peşe sıralı bir montajsa (Çarpma yoluyla sayma ve Permütasyon temeli) bant ucuza bağlanır. Tüm dizgi bilgisayar komutlarıyla algoritmaya dönüştürülür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.3.1.x` (Toplama yoluyla ayrık, Çarpma yoluyla eklemli kombinatuvar sayma algoritmaları)
  * `MAT.10.3.2.x` (Girdi-çıktı mantıklı karmaşık cebir bilgisayar akış şemaları)

### 6. Trigonometrik Teodolit (Dik Üçgen Oranları) ✅
* **Konsept:** Sanal bir topografi teodoliti. Öğrenci sarı açı kolunu canlı dik üçgen üzerinde görür; karşı, komşu ve hipotenüs kenarlarını doğrudan seçerek sin, cos, tan ve cot oranlarını kurar. Amaç formül ezberi değil, "hangi kenar pay, hangi kenar payda?" sorusunu tek ölçüm masasında görünür hale getirmektir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.4.1.x` (Sin, Cos, Tan, Cot karşı/komşu/hipotenüs oran vizörü)
* **Erişilebilir Etkileşim:**
  * Açı kolu sahnedeki uç tutamaçtan sürüklenir; kenarlar tıklanarak önce pay, sonra payda olarak oran okuyucuya kilitlenir.
* **Ayrılan Gelecek Makro Modüller:**
  * `MAT.10.4.2.x` için **Birim Çember Kalkanı**, `MAT.10.4.3.x` için **Sabit Alan Üçgen Rayı**, `MAT.10.4.4.x` için **Sinüs-Kosinüs Arazi Ölçeri** ayrı modüllerdir.

### 7. Analitik Rota Haritası (Nokta ve Doğru Analitiği) ✅
* **Konsept:** İki uydu / istasyon koordinatı ($x_1, y_1$ ve $x_2, y_2$) arasındaki doğrusal mesafeyi ve uçuş eğimini (m) bağlayan navigasyon siber haritası. Öğrenci A ve B istasyonlarını koordinat düzleminde doğrudan taşır; `Δx`, `Δy`, mesafe, eğim ve `y-y_1 = m(x-x_1)` denklemi aynı rota üzerinde canlı okunur. Son katmanda rotayı içten bölen mor transfer istasyonu yalnız gerektiğinde açılır ve `AP:PB = 1:3` oranına hizalanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.5.1.x` (İki nokta arası mesafe radarı ve doğruyu içten/hedefli bölen ara istasyon koordinat tespiti)
  * `MAT.10.5.2.x` (Doğrunun eğimini dikey/yatay oranlayarak saptama ve analitik uçuş denklemini oluşturma)
* **Erişilebilir Etkileşim:**
  * A/B istasyonları sürüklenir; odaklanan istasyon ok tuşlarıyla küçük adım atar ve `Home` ile aktif hedefe hizalanır. Transfer düğümü sadece içten bölme görevinde görünür.

### 8. Çapraz Matris ve Koşullu Olasılık Sireni (Veri Analizi)
* **Konsept:** Büyük ekranda "Torbadan 1 top çekildi ama GERİ ATILMADI!" diye kırmızı bir siren çalar ve toplam top ($%100$ küme) sayısı anında dinamik bir animasyonla azalır (Bağımlı Olaylar). Veya "Zarın ÇİFT geldiği kesin!" uyarısıyla ihtimaller daralır ve Koşullu Olasılık filtresi açılır. Sağ tarafta ise cinsiyet/medya tercihleri gibi kategorik veriler Çapraz Matrise yüklenip, medyadaki yalan / hatalı anket (Yanlış korelasyon) sonuçları ifşa edilir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.10.6.1.x` / `MAT.10.6.2.x` (Çapraz tablolar ile ilişkisellik testi ve yanlış yorumlanmış/spekülatif medya anketi teşhisi)
  * `MAT.10.7.1.x` / `MAT.10.7.2.x` (Daralan örneklemde Koşullu Olasılık ve Bağımlı Olaylarda/Geri konulmayan toplarda küme bozulma animasyonu)

---

## 🛰️ LİSE 11. SINIF MODÜLLERİ

### 1. ✅ Trigonometrik Osiloskop (Sin/Cos Dalga Analizi)
* **Konsept:** Merkezde dönen bir birim çemberin faz kolu, sağdaki dijital osiloskop ekranına sinüs veya kosinüs dalgası çizdirir. Öğrenci faz kolunu doğrudan sürükler veya odaklayıp `Home` ile aktif hedefe kilitler; 90°, 180° ve 360° fazlarında dikey/yatay izdüşümün dalga değerini nasıl ürettiğini görür.
* **Sağladığı Atom Grupları:**
  * `MAT.11.1.1.1` (f(x)=sin(x) referans fonksiyonunun periyodik dalga grafiği)
  * `MAT.11.1.1.2` (f(x)=cos(x) referans fonksiyonunun periyodik dalga grafiği)
* **Route:** `/embed/trigonometry/trigonometric-oscilloscope`
* **Not:** Tanjant/kotanjant asimptotları `11-02 Tanjant Asimptot Kapıları`, trigonometrik denklem kökleri `11-03 Trigonometrik Kök Avcısı` olarak ayrı makro deneylere ayrıldı.

### 2. ✅ Tanjant Asimptot Kapıları (Tan/Cot Yasak Duvarları)
* **Konsept:** 0°-360° arası trigonometrik grafik tünelinde öğrenci neon asimptot kapılarını doğrudan sürükler. `tan(x)` için 90° ve 270° duvarları; `cot(x)` için 0°, 180° ve 360° duvarları kilitlenir. Son katmanda tarayıcı 180° kotanjant duvarına yaklaşınca değer büyür ama çizginin üzerinde nokta oluşmadığı görsel olarak anlaşılır.
* **Sağladığı Atom Grupları:**
  * `MAT.11.1.1.3` (`f(x)=tan(x)` referans fonksiyonunun asimptotlu grafiği)
  * `MAT.11.1.1.4` (`f(x)=cot(x)` referans fonksiyonunun asimptotlu grafiği)
* **Route:** `/embed/trigonometry/tangent-asymptote-gates`
* **Durum:** Browser Use ile yanlış deneme, dört görev zinciri, completion, console ve dashboard aktif sayım kontrolü geçti.

### Legacy Arşiv / Eski Deneyler
Bu modüller silinmedi; route'ları korunuyor. Ancak yeni 11. sınıf aktif görev akışından çıkarıldılar çünkü SSOT atom kapsamı, tek ana oyuncak standardı veya 11. sınıf matematik odağıyla artık uyumlu değiller.

* `trig-pendulum` / `/embed/trig/pendulum`: Eski dalga deneyi; sin/cos kapsamında yerini `Trigonometrik Osiloskop` aldı.
* `unit-circle` / `/embed/geometry/unit-circle`: Eski birim çember keşif aracı; sin/cos kısmı osiloskopa taşındı, tan/cot kısmı `11-02 Tanjant Asimptot Kapıları` olarak yeniden yapılacak.
* `laser-defense` / `/embed/physics/laser-defense`: Fizik/yansıma prototipi; aktif 11. sınıf matematik kuyruğundan ayrıldı.
* `slope-rollercoaster` / `/embed/physics/slope-rollercoaster`: Eğim/fizik prototipi; aktif 11. sınıf matematik kuyruğundan ayrıldı.

### 3. Logaritmik Büyüme Reaktörü ve Tersine Mühendislik ($e^x$ & $ln x$)
* **Konsept:** İki farklı büyüme simülatörü. Bir yanda (Bakteri/Virüs yayılımı) tabanı 1'den büyük ($a>1$) patlayarak artan *Üstel Fonksiyon* grafiği. Diğer yanda "Tersine Mühendislik (Invert) Şalteri". Bu şalter çekildiğinde rampa aynı eksende bükülür ve Logaritma makinesine dönüşür! Simülatöre giren "Deprem Şiddeti (Richter)" ve "Ses Dalgaları (Desibel)" logaritmik olarak filtrelenerek zararsız veriye dönüştürülür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.11.1.3.x` / `MAT.11.1.4.x` / `MAT.11.1.5.x` (Artan/Azalan üstel fonksiyonlar, Tersini alma ve Logaritmik eşlenik grafikleri)
  * `MAT.11.1.6.x` (Bakteri/nüfus (üstel) ve Richter/Desibel (Logaritma) gerçek yaşam simülasyonları)

### 4. Fonksiyon Synthesizer'ı (Bileşke ve Dört İşlem)
* **Konsept:** DJ mikseri / Bilgisayar anakartı gibi bir sentezleyici. $f(x)$ ve $g(x)$ portlarına fonksiyonlar takılır. "+", "-", "x", "/" tuşlarına basıldıkça ikisi aynı tanım kümesinde işleme girer. `(f o g)` "Bileşke Bağlantısı" kablosu takıldığında, $g(x)$ makinesi tamamen eriyip $f(x)$ makinesinin *içine* girer (Nested Functions) ve ekranda yepyeni bir mutasyon algoritması belirir.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.11.1.7.x` / `MAT.11.1.8.x` (İki fonksiyonu iç içe bağlama (Bileşke/fog) ve eş tanımkümeli fonksiyonlarda 4 işlem mekanikleri)

### 5. Çokgen Anatomi Masası (İçbükey/Dışbükey ve Mozaik)
* **Konsept:** Parçalanmış geometrik cam şekiller. Dışbükey (Konveks) parçaların tüm köşeleri dışarı bakarken, makine "İçbükey (Konkav) Uyarı!" diyerek içeri çökük bir açıyı ($>180°$) kırmızı lazerle işaretler. Kenarları saydırarak $n(n-3)/2$ çapraz köşegen tespiti lazeri atılır. Öğrenci düzgün çokgenleri mouse ile sürükleyerek "boşluksuz mozaik ve fayans kaplamaları" tasarlar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.11.2.1.x` / `MAT.11.2.2.x` (Üçgenden dörtgen alan/açı ispatı ve Özel Dörtgenlerin köşegen özellik testleri)
  * `MAT.11.2.3.x` / `MAT.11.2.4.x` / `MAT.11.2.5.x` (İçbükey/Dışbükey klasörü, Simetri/Köşegen formülleri ve Mozaik fayans optimizasyonu)

### 6. Korelasyon Tarayıcısı ve Scatter (Serpilme) Radarı
* **Konsept:** Ekranda anlamsız gibi duran yüzlerce veri noktasının bulunduğu uzay radarı (Scatter Plot). Öğrenci "Eğilim Çizgisi"ni çektiği an noktaların yukarı tırmandığını (Pozitif Doğrusal İlişki) veya aşağı kırıldığını (Negatif Korelasyon) gözlemler. Alt ekrandaki istihbarat panelinde, yalan / kusurlu iki nicel anket arasındaki tutarsızlık çapraz kontrole sokulup çürütülür.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.11.3.1.x` (İstatistiksel Serpilme (Scatter) grafiğini kurgulama ve Pozitif/Negatif eğilim ilişkisini çıkarma)
  * `MAT.11.3.2.x` (Dışarıdan (Medyadan) verilmiş ikili verilerdeki tutarsızlık / korelasyon yalanlarını teşhis etme)

---

## 🛰️ LİSE 12. SINIF MODÜLLERİ (FİNAL)

### 1. Polinom Şifreleme ve Dizi Çarkları
* **Konsept:** Makinelerin kalbi. Üst kısımdaki çarklarda sabit bir "artış (Aritmetik)" veya sabit bir "çarpım (Geometrik)" ile dönen sonsuz dişliler dizileri ($a_n$) üretir. Alt tarafta ise başkatsayısı, derecesi ve sabit terimi olan kilitli "Polinom ($P(x)$) Kutuları". Öğrenciler, P(x) sandıklarının içinden P(x)/Q(x) şeklinde rasyonel eşitsizlikler/denklemler çıkarır ve kökleri bulup lazer "İşaret Tablosu (+ - +)" ile taranarak doğru çözüm aralığını kodlar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.1.1.x` (Aritmetik/Geometrik dizilerin kuralı ve standart fonksiyonlardan ayrışması)
  * `MAT.12.1.2.x` / `MAT.12.1.3.x` (Polinom anatomisi, derece saptama ve Polinom/Rasyonel eşitsizlik işaret tabloları)

### 2. Limit Sensörü ve Asimptot Duvarı
* **Konsept:** Dağlık/kırık bir rotada hareket eden aracın "Yaklaşma (Radar) Sensörü". Sensör, grafik üzerinde $X$ koordinatına sağdan ve soldan yavaşça yaklaşır. Eğer grafik kopuksa veya iki uç birbirini tutmuyorsa "LİMİT YOK - SÜREKSİZ" alarmı öter. Araç $\frac{0}{0}$ gibi karadelik bir çukura denk geldiğinde çarpanlara ayırma vinci ile engeli aşar. Rotanın sonunda sonsuza ($\pm\infty$) doğru giden asimptot (Sonsuzluk) tünelindeki eğilimi radar tespit eder.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.2.1.x` / `MAT.12.2.2.x` (Grafik ve kural üzerinden limit okuma, sonsuz limitleri ve $0/0$ çarpanlara ayırma manevraları)
  * `MAT.12.2.3.x` (Süreklilik kanunu: limit = fonksiyon değeri)

### 3. Türev Eğim Sürücüsü ve Optimizasyon
* **Konsept:** 3D engebeli bir arazi. Araç tepelere tırmanırken (Artan kısımlar, 1. Türev pozitif $+$, yeşil yanar), inişe geçtiğinde (Azalan, 1. Türev negatif $-$, kırmızı yanar). Tepe (Maksimum) ve Çukur (Minimum) noktalarına ulaştığında ise araç milisaniyelik uçar (Eğim=0) ve Türev sıfırlanır! Sistem sivri (köşe) ve kopuk uçlarda aracın altındaki "Teğet Kızağının" kırıldığını ve buralarda türev olmadığını kanıtlar. Tüm bileşke (Zincir Kuralı) ve (Çarpım/Bölüm) manevraları bu teğet kızağını hesaplamak içindir. Öğrenci bu sistemi "Maksimum Hacim" ve "Minimum Maliyet" kutularını optimize etmek için kullanır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.2.4.x` / `MAT.12.2.5.x` (Anlık değişim/Türev teğet eğimi ispatı, sivri/kopuk uçlarda türev yokluğu ve (Toplama/Bölme/Zincir) türev kuralları)
  * `MAT.12.2.6.x` (1. Türevin artan/azalan bölgeleri, Maksimum/Minimum ekstremum noktaları ve Optimizasyon problemleri)

### 4. Çember Radar İstasyonu (Kesen, Kiriş ve Teğet)
* **Konsept:** Koca bir uydu çanağı (Çember). Uzay gemisinin (Kesen) çanağı iki parçaya böldüğü, merkeze eşit mesafedeki iplerin (Kiriş) simetrik gerildiği ve çanağa dışarıdan teğet (Teğet) geçen lazerin merkeze birleşip otomatik 90° (Dik) olduğu radar simülasyonu. İstasyon, içerdeki çevre ve merkez açıların gördükleri yay (Yörünge) parçalarıyla olan 1'e 1 ve 1'e 2 oranlarını tarayıp $\pi r^2$ ile tüm bölgenin alanını (Sinyal Gücünü) hespalar.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.3.1.x` (Kiriş, Kesen, Yay ve Teğetin merkez diki ilişkisi)
  * `MAT.12.3.2.x` (Çevre açı, merkez açı ve Dairenin tam alanı kurguları)

### 5. Katı Cisim 3D Dolum Tesisi (Hacim ve Yüzey Alanı)
* **Konsept:** Ekranda dönebilen silindir, koni, prizma ve dev bir Küre. "Hacim (Sıvı)" butonuna basıldığında içleri tabandan tavana doğru nanobot sıvısıyla dolar (Silindir $V=\pi r^2h$, Küre $V = \frac{4}{3}\pi r^3$). "Kaplama (Alan)" butonuna basıldığında ise etraflarını jelatin bir dış zırh kaplar (Küre $Alan = 4\pi r^2$).
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.4.1.x` (Prizma, Silindir, Piramit, Koni ve Küre iç hacim doldurması)
  * `MAT.12.4.2.x` (Prizma, Silindir, Piramit, Koni ve Küre komple yüzey alanı (zırh) kurguları)

### 6. Büyük Veri Yargı Modülü (İstatistiksel Analiz)
* **Konsept:** TUİK veya WHO gibi kurumlardan gelen 3. parti ham büyük veri yığınları gerçek zamanlı olarak sisteme bağlanır. Öğrenci sistemin istatistik paneline girdiği verileri süzerek medyan, çeyrekler açıklığı gibi araçlarla o ham ve kirli veriden tek bir sarsıcı "Sonuç Cümlesi/Yargı" üretmek zorundadır.
* **Sağladığı Atom Grupları (%100 Kapsam):**
  * `MAT.12.5.1.x` (Gerçek kurumsal veri setlerini kullanarak istatistiksel direkt sonuç / yargı çıkartımı)
