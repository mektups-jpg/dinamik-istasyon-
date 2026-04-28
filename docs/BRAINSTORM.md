# 🧠 Matnastik Brainstorm & Fikir Havuzu

Bu dosya, üzerine düşündüğümüz ancak henüz koda dökmediğimiz potansiyel modüllerin, oyun mekaniklerinin ve eklentilerin arşivlendiği alandır. 

## 💡 Fikir: "Neon Rota Terminali" (Grid Geometrisi)
**Durum:** 🟢 Fikir Aşamasında (Değerlendiriliyor)
**Kazanım Hedefleri:** MAT.5.3.1.2 (Doğru parçası çizimi), MAT.5.3.2.1 (Noktanın konumu)

### Öğrenci Deneyimi (UX):
* Ekranda devasa bir Kartezyen/Izgara ekranı var.
* Geminin ana modülüne giden bir elektrik hattı kopmuş.
* Öğrenci koordinat/yön komutları vererek (Örn: "Sağa 3 Birim, Yukarı 2 Birim") başlangıçtan hedefe neon bir lazer (doğru parçası) çizmeye çalışacak.

### Edge Caseler (Zorluklar):
* Çizgi, alanın dışına çıkarsa ne olacak? (Ekran sarsıntısı, AstroBot uyarısı).
* Düz çapraz gitmek yerine "L" şeklinde gidildiğinde iki farklı doğru parçası oluşmalı, state bunu nasıl tutacak?

### Aksiyon:
- [x] Zemin Izgarası (Framer Motion grid) bileşenini tasarla.
- [x] Yön ve Değer (Input) alanlarını oluştur.
- [x] Çizim mantığını ve MEB doğrulamasını entegre et.

## 💡 Fikir: "Kesir Senkronizasyon Tezgahı" (Pay ve Payda)
**Durum:** 🟢 Fikir Aşamasında (Değerlendiriliyor)
**Kazanım Hedefleri:** MAT.3.1.9.1 (Bütün/Yarım/Çeyrek kesir sembolleri), MAT.3.1.10.2 (Birim kesirlerde parça küçülmesi), MAT.3.1.11.1/2 (Pay ve Payda ilişkisi)

### Öğrenci Deneyimi (UX):
* Ekranda büyük holografik bir daire veya dikdörtgen "Reaktör Çekirdeği" bulunur.
* Altta "PAYDA (Bölücü)" adında bir sürgü (slider), üstte "PAY (Yüklenen Çekirdek)" adında bir gösterge vardır.
* Öğrenci paydayı artırdıkça şekil, lazerlerle eş parçalara (dilimlere) ayrılır.
* Dilimlerin içine tıklandıkça dilim neon renkle dolar ve PAY göstergesi 1 birim artar.

### Edge Caseler (Zorluklar):
* Paydanın alabildiğince büyümesi (Örn: 20'ye kadar) şekli çizmekte performans sorunu/karışıklık yaratabilir (Dinamik SVG dasharray veya clip-path hesabı gerektirir).
* Öğrenci tıklayıp doldurduğu pay sayısı, sonradan paydayı küçültürse (Örn: 5 parça doluyken paydayı 3'e çekerse) ne olacak? (Mevcut pay, yeni paydaya cap(sınır)lenmeli).

### Aksiyon:
- [x] Dinamik olarak N parçaya bölünebilen ve her bir parçası React State ile tıklanabilir/aktif edilebilir bir SVG halkası/dikdörtgeni bileşeni yaz.
- [x] Pay ve Payda sayılarını bağla.
- [x] Görev sistemi kur: "Bana 3/8 oranında enerji yükle!" gibi hedefler ver.

## 💡 Fikir: "Veri Kapsülü ve Örüntü Motoru" (6 Haneli Sayılar ve Sıralama)
**Durum:** 🟢 Fikir Aşamasında (Değerlendiriliyor)
**Kazanım Hedefleri:** MAT.4.1.1.x, MAT.4.1.2.x (100.000'lere kadar sayıları gruplama ve okuma), MAT.4.1.3.x (Sıralama), MAT.4.1.4.x (İleri ritmik örüntü zinciri)

### Öğrenci Deneyimi (UX):
* Ekranda devasa bir 6 basamaklı "Kilitli Şifre Kapsülü" mekanizması. Şifre haneleri yüz binler basamağına kadar ayrılmış (Birler, Onlar, Yüzler - Binler, On Binler, Yüz Binler).
* Öğrenci, haneleri yukarı/aşağı silindir gibi kaydırarak (slot makinesi gibi) sistemin istediği büyük sayı şifresini girmeye çalışır.
* Şifre çözülünce kapsül açılır ve içinden karışık büyük veri blokları (örn: 345.678, 98.112, 450.000) çıkar. Oyun bunları "Büyükten Küçüğe" veya "Küçükten Büyüğe" sürükle-bırak yöntemiyle hizalamasını ister.
* Son aşamada sistem "Ritmik Hata: Motor Tekliyor" der. Ekranda belli bir kuralla artan 6 haneli sayılar akar (örn: 120.000, 120.500, 121.000, ?, 122.000). Boşluktaki ? değerinin klavyeden/tuşlardan girilmesi istenir.

### Edge Caseler (Zorluklar):
* 6 haneli sayıların mobilde yan yana okunabilmesi (Responsive font boyutları).
* Binler bölüğü ile birler bölüğünü görsel olarak Ayıran nokta veya boşluk kullanımının (örn: 125.000) açıkça verilmesi.
* Drag-and-drop (Sürükle-bırak) mekaniğinin mobil uyumlu olması (Framer Motion Reorder ile çözülebilir).

### Aksiyon:
- [x] 6 silindirli (100.000'ler) kripto tekerlek bileşeni oluştur.
- [x] Milyonlara kadar çıkabilen (100 binlerde tutulacak) sayıların drag-and-drop listesini Framer Motion ile tasarla.
- [x] Ritmik sayma algoritmasıyla rastgele soru üreten motor entegre et.

## 💡 Fikir: "Sıfır Laboratuvarı: Dokunsal Hata Teşhisi" (Revizyon)
**Durum:** 🟢 Fikir Aşamasında (Kullanıcı Geri Bildirimiyle Güncelleniyor)
**Kazanım:** MAT.4.2.5.1 (Çarpma algoritmasında sütun kaydırmanın mantığını ispatlama).

**Sorun:** Mevcut kurguda öğrenci sadece "İncele" ve "0 Ekle" butonuna basıyor. Düzeltme işini animasyon kendi yapıyor. Çocuğun eylemliliği (agency) ve keşfi çok düşük.

### Alternatif Kurgular (Sağ Panel - Bug Hunt İçin):

#### 🚀 Kurgu 1: "Sürükle-Bırak Sütun İtme" (Tam Fiziksel Motor)
* **Nasıl Çalışır:** Çocuğun önüne hatalı işlem gelir (2. satır sağa yaslıdır). Sistem ona sadece "Bu işlemde bir tuhaflık var, blokları hareket ettirip düzelt" der.
* **Etkileşim:** Çocuk, hatalı satırdaki "90" sayısını fare/parmak ile tutup *fiziksel olarak bir basamak sola* sürüklemek **zorundadır**. 
* **Sıfır Enjeksiyonu:** Sayıyı sola sola çektiği an, sağda neon, boş bir `[ _ ]` hücresi açılır. Çocuğun envanterinde (veya yanda) bir `0` bloğu vardır. O sıfırı alıp bu boşluğa "cuk" diye oturtmadan (sürükle-bırak yapmadan) işlem düzelmez ve toplama sistemine elektrik gitmez.

#### 🔍 Kurgu 2: "Dedektif Röntgeni" (X-Ray ve Manuel Giriş)
* **Nasıl Çalışır:** Çarpmada hata var ama nerede olduğu söylenmiyor. Çocuğun elinde fareyle kontrol ettiği yuvarlak bir X-Ray (röntgen) filtresi vardır.
* **Etkileşim:** Röntgeni 1. satırın üzerine getirince arka planda `45 x 3` işleminin yapıldığını ve doğru olduğunu görür. Röntgeni 2. satır (90) üzerine getirince arka planda `45 x 20` olması gerektiğini görür. 
* **Çözüm:** Çocuk sorunun "0" eksikliği olduğunu anlar. Yanlış sayının yanına açık olan input alanına klavyesiyle kendisi **0** yazarak sayıyı 900'e tamamlar ve enter'a basar.

#### ⚙️ Kurgu 3: "Bozuk Şalter Paneli" (Teşhis ve Onarım)
* **Nasıl Çalışır:** Ekranda hatalı bir çarpma var ve yanında 3 adet şalter var: (1. Satır Devresi), (2. Satır Devresi), (Toplama Devresi).
* **Etkileşim:** Öğrenci önce bozulan devrenin kendisini bulup ona tıklar (2. satır). 
* **Çözüm:** Devreye tıklayınca bir menü açılır: "Arıza Türü Nedir? => A) Yanlış Çarpım B) Onluk Basamak Unutulmuş (Sola Kaydırılmamış)". Çocuğun hatanın **adını** kendisi zihinsel olarak teşhis etmesi istenir. Doğru cevabı verirse onay mekanizması çocuğu "0" enjekte etmeye yönlendirir.

### Aksiyon Planı:
- Kaptan'ın onayına göre mevcut sağ panel (Phase 2) UI'si `ZeroEngineApp.tsx` dosyasında tamamen belirtilen yeni kurguya göre baştan yazılacak.
