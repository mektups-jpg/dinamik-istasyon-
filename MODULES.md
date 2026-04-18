# 📋 Eğitim Modülleri ve Müfredat Planlaması (MODULES.md)

Bu dosya, Matnastik laboratuvarının ilkokuldan liseye kadar yapmayı planladığı tüm interaktif matematik modüllerinin detaylı bir dökümünü içerir.
`PROGRESS.md` teknik ilerlemeyi takip ederken, bu dosya **Eğitim Tasarımını (EdTech Design)** ve kavramsal hedefleri belgeler.

---

## 🎒 İlkokul Laboratuvarı (1-4. Sınıflar)
*Odak: Temel işlemlerin fiziksel karşılıklarını (somutlaştırma) kavratmak.*

### 1. Sayı Doğrusu Zıplaması (Mevcut)
- **Kavram:** Toplama ve Çıkarma
- **Mekanik:** Sağa (+) ve sola (-) animasyonlu zıplamalar.

### 2. Enerji Fabrikası (Mevcut)
- **Kavram:** Onluk Bozma / Basamak Değeri
- **Mekanik:** 10 küçük küpün (birlik) birleşip 1 dev neon tüpe (onluk) dönüşmesi animasyonu.

### 3. Ritmik Meteor Savunması
- **Kavram:** Çarpım tablosuna giriş / Ritmik sayma
- **Mekanik:** 3'er 3'er düşen uzay taşlarını (3, 6, 9..) hedef alma. Hatalı atış kalkanı kırar.

### 4. Boyutsal Terazi (<, >, =)
- **Kavram:** Sayısal büyüklük karşılaştırma
- **Mekanik:** Kefelere bırakılan sayılara veya ağırlıklara göre gerçek zamanlı eğilen 2D fizik tabanlı terazi. Eşitlik sağlandığında lazerle dengelenme animasyonu.

---

## 🚀 Ortaokul Laboratuvarı (5-8. Sınıflar)
*Odak: Soyut kavramları (Cebir, Geometri) teknolojik simülasyonlar ve mühendislik mantığı ile bağdaştırmak.*

### 5. Kinetik Oran Laboratuvarı (Mevcut)
- **Kavram:** Ters Orantı
- **Mekanik:** Vektörel dişliler ve RPM hız simülasyonu.
- **Geliştirme Planı:** Avara (Yön) çarkı ekleme, serbest mod.

### 6. Holografik Lazer Ağı: Analitik Geometri
- **Kavram:** Koordinat Sistemi (x,y)
- **Mekanik:** Kod/Terminal yok. Öğrenci X ekseni (mavi lazer) ve Y ekseni (mor lazer) için iki adet kontrol sürgüsüyle fiziksel ışınları kaydırır. Uzayda kaybolan veya beliren bir asteroidin üzerine kesişim noktasını getirirp "Işınla" diyerek koordinatları görsel olarak "yaşayarak" okur. Kesişim anında müthiş bir neon patlama animasyonu devreye girer.

### 7. Mutlak Değer Lazerleri
- **Kavram:** Uzunluk her zaman pozitiftir (Mutlak değer)
- **Mekanik:** Merkezde bir ayna. Öğrenci -5 konumundan lazere ateş eder, karşıya (0'a) olan ışın mesafesi dijital metre ile ölçülür ve 5m olarak ekrana yansır.

### 8. Cebirsel Küp Odası
- **Kavram:** Cebirsel İfadeler (x, x², x³)
- **Mekanik:** Öğrencinin "x" değerini sürgü ile artırdığı, ekrandaki 3B tesseract gibi küp hacminin bu denkleme göre gerçek zamanlı şiştiği / büzüldüğü simülasyon.

---

## 🛰️ Lise Laboratuvarı (9-12. Sınıflar)
*Odak: İleri matematik problemlerini, veri görselleştirme ve karmaşık kod mimarileri ile çözme.*

### 9. Fonksiyon Eğrisi (Function Plotter)
- **Kavram:** Parabol, Doğrusal, Trigonometrik fonksiyonlar
- **Mekanik:** Öğrencinin $y = x^2 - 4x + 4$ gibi denklemleri girdiği ve arka planda D3.js/Recharts gibi kütüphanelerle eğrinin lazer gibi çizildiği, tepe noktalarının (Vertex) ve köklerin hologramla vurgulandığı bir grafik motoru.

### 10. Trigonometrik Sarkaç 
- **Kavram:** Sinüs, Kosinüs grafikleri ve Birim Çember
- **Mekanik:** Dönmekte olan bir birim çember radarı ve ona bağlı salınan bir harmonik sarkaç. Çember döndükçe, sarkacın bıraktığı iz "Sinüs" dalgasını çizer (Fiziksel ispat). 

### 11. Olasılık Şelalesi (Galton Board)
- **Kavram:** Binom Dağılımı ve Normal Dağılım (Çan Eğrisi)
- **Mekanik:** Yukarıdan binlerce fotonun (parçacık) çivilere çarparak düştüğü, `requestAnimationFrame` veya WebGL ile çizilen fizik simülasyonu. Alt tarafta biriken fotonların kusursuz bir Çan Eğrisi oluşturduğunu kendi gözleriyle görmeleri hedeflenir.

### 12. Türev: Anlık Hız Aracı
- **Kavram:** Teğet eğimi ve Türev
- **Mekanik:** İnişli çıkışlı bir dağ yolu (Fonksiyon). Viraja giren bir roket arabası var. Öğrenci tıklayıp teğet doğrusunu (Türev) çizer. Araç tam o noktadan fırlarsa hangi 'anlık hız' vektörüyle boşluğa uçacağını simüle eder.
