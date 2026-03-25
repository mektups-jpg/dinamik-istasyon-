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

---

## 🚧 Üzerinde Çalışılanlar (In Progress)
- [ ] *Şu an aktif bir görev yok, yeni talimat bekleniyor.*

---

## 📅 Planlananlar (To-Do / Backlog)

### Yeni Eğitim Modülleri
- [ ] **Onluk-Birlik Evreni:** Sayıları onluk ve birlik bloklarına ayırma mini oyunu.
- [ ] **Ritmik Sayma Meteorları:** Belirli aralıklarla gelen meteorları vurarak ritmik sayma.

### Oyunlaştırma ve Meta-Oyun (Gamification)
- [ ] **Market (Shop):** Kazanılan Atom'lar ile Astro-Bot'a yeni renkler, şapkalar veya itici (thruster) efektleri satın alma.
- [ ] **Ses Efektleri (SFX) ve Müzik:** Zıplama sesi, buton tıklama sesi, arka plan uzay ambiyansı.
- [ ] **Seviye Sistemi (Leveling):** Skor arttıkça oyuncunun seviye atlaması ve yeni unvanlar kazanması (Örn: "Çaylak Astronot", "Galaksi Dehası").
- [ ] **Kayıt Sistemi:** Oyuncu ilerlemesinin `localStorage` veya bir backend (Firebase vb.) ile kaydedilmesi.
