# 🚀 Dinamik İstasyon - Proje İlerleme Durumu (PROGRESS.md)

Bu dosya, projenin genel vizyonunu, tamamlanan özellikleri ve gelecekteki planları takip etmek için kullanılmaktadır.

## 🎯 Proje Vizyonu
İlkokul öğrencileri için matematik öğrenimini sıkıcı bir görev olmaktan çıkarıp, **"Uzay / Bilim-Kurgu"** temalı, yüksek kaliteli, animasyonlu ve ödül sistemli (Atom kazanma) bir oyun deneyimine dönüştürmek.

---

## ✅ Tamamlananlar (Done)

### 1. Temel Altyapı ve Mimari
- [x] React + Vite + Tailwind CSS kurulumu.
- [x] Zustand ile global state yönetimi (`useAtomStore`, `useGameStore`).
- [x] React Router ile sayfa yönlendirmeleri.
- [x] Lucide React ikon entegrasyonu.
- [x] Framer Motion ile animasyon altyapısı.

### 2. Ana Ekran (Dashboard / Uzay Haritası)
- [x] Karanlık uzay teması, hareketli yıldız arka planı.
- [x] Kilitli ve açık görevleri gösteren, birbiriyle bağlantılı "Görev Düğümleri" (Nodes).
- [x] Üst barda oyuncunun kazandığı "Atom" (para birimi) ve "Skor" göstergesi.
- [x] Görev kartlarına hover ve tıklama animasyonları.

### 3. Modül 1: Sayı Doğrusu Zıplaması (Toplama İşlemi)
- [x] Sayı doğrusu UI tasarımı (neon çentikler, parlayan aktif noktalar).
- [x] 3 Aşamalı oyun döngüsü:
  1. Başlangıç noktasını bulma.
  2. Belirtilen adım kadar ileri zıplama.
  3. Başarı ve ödül ekranı.
- [x] **Karakter Tasarımı (Astro-Bot):** CSS ve Framer Motion ile çizilmiş, yüksek kaliteli, süzülen (hover), göz kırpan, zıplayan ve koşan robot karakteri.
- [x] Fiziksel hissiyatlı (Juicy) butonlar (+1 Zıpla, -1 Zıpla, Hedefe Koş).
- [x] **Klavye Desteği:** Sağ ve sol ok tuşlarıyla zıplama kontrolü.
- [x] Başarı durumunda konfeti patlaması ve Atom kazanma animasyonu.

### 4. Modül 2: Sayı Doğrusunda Çıkarma (Geriye Zıplama)
- [x] Toplama modülünün altyapısı kullanılarak çıkarma işlemine uyarlandı.
- [x] **Tema Değişikliği:** Enerji azalması konseptiyle kırmızı/turuncu neon renk paleti kullanıldı.
- [x] Geriye doğru zıplama ve hedefe koşma (sola doğru) animasyonları eklendi.
- [x] Yeni kazanım atomları (G1.NUM.001.2 ve G1.NUM.003.1) sisteme entegre edildi.

### 5. Modül 3: Onluk Bozma Fabrikası (Onluk-Birlik Evreni)
- [x] 'Onluk ve Birlik' kavramlarını öğretmek için laboratuvar arayüzü tasarımı (Neon fabrikasyon stili).
- [x] Onluklar (büyük mor enerji tüpleri) ve Birlikler (küçük mavi küpler) için görsel simülasyon.
- [x] Framer Motion kullanılarak akıcı ve animasyonlu "Makineye Enerji Yükleme" parçacıkları.

---

## 🚧 Üzerinde Çalışılanlar (In Progress)
- [x] **Mutlak Değer Lazerleri:** Sıfır noktasına olan uzaklık kavramını simetrik lazer ışınları ile kanıtlayan, aynalı ve temiz bir fizik deneyi oluşturuldu.
- [x] **Boyutlararası Küp (Cebirsel Boyut Odası):** x, x² ve x³ kavramlarını (Uzunluk, Alan, Hacim) sürgü ile değiştirip objenin nasıl katlanarak büyüdüğünü gösteren 3D/2D/1D CSS simülatörü eklendi.

---

## 📅 Planlananlar (To-Do / Backlog)

### Ortaokul (5-8. Sınıf) - Teknoloji ve Mühendislik Laboratuvarı
- [ ] **Dişli Simülatörü İçin Avara Çark (Idle Gear):** Yön değiştiren çark konseptinin eklenmesi.
- [ ] **Olasılık Şelalesi (Galton Board):** Binlerce partikülün düşerek çan eğrisi oluşturduğu fizik motorlu 2D olasılık deneyi.

### Gelecek İçin Fikirler (İlkokul Yedek)
- [ ] **Ritmik Sayma:** Belirli aralıklarla düşen bloklara lazer atarak ritmik sayma döngüsü oturtma.
- [ ] **Boyutsal Terazi (<, > ,=):** Nicelik ağırlıklarını eşitleyen dinamik fizik terazisi.
