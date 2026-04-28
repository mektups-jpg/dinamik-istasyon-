# 🛠️ Skill: Module Builder (Modül İnşaatçısı)

**Tetikleyici:** Kullanıcı "Sıradaki modüle geçelim", "Işın/Doğru/Açı modülünü kodla" veya "Yeni oyun yapalım" dediğinde bu skill'i kullan.

## 🎯 Amaç
Sıkıcı matematik konularını, "Tek Gerçeklik Kaynağı" (SSOT) olan `MEB_ATOMLARI.md` üzerinden alıp, Framer Motion ve Zustand kullanarak mükemmel bir Uzay Macerası bulmacasına dönüştürmek.

## 🔄 İş Akışı (Workflow)

1. **Müfredat Kontrolü (Curriculum Check):**
   - Hangi kazanımda kaldığımızı `MODULES.md` dosyasından veya mevcut ilerlemeden analiz et.
   - Hedef kazanımın "Saf Text" halini oku (Örn: MAT.5.2.1.1 Doğru, ışın ve doğru parçasını tanır).

2. **Senaryo ve Tema Üretimi (Vibe Check):**
   - **Doğru (Line):** Sonu olmayan lazer ışınları.
   - **Işın (Ray):** Kaynağından çıkan tek yönlü plazma atışları.
   - **Doğru Parçası (Line Segment):** İki enerji nodu (düğümü) arasına çekilen fiber optik kablolar.
   - Bu konsepti "Ağ Onarımı", "Güç Kaynağı Aktarımı" veya "Kalkan Kurulumu" gibi bir ambalaja sar.

3. **Bileşen Mimarisi (Component Setup):**
   - Asla dışarıdan hazır `.svg` veya `.png` resmi kullanma. Tüm lazerleri, ışınları ve şekilleri `div`, `Tailwind` ve `framer-motion` ile kendin kodla.
   - Etkileşimsiz statik bir sayfa ALSA yapma. Kullanıcı tıklasın, sürüklesin veya eşleştirsin.

4. **Bot ve Geri Bildirim Entegrasyonu:**
   - Sayfaya mutlaka `<AstroBotHelper />` bileşenini ekle. 
   - İlerleyişe göre `info`, yanlışta `error`, doğrularda `success` mesajlarıyla "Juice" hissini ver.

5. **Modül Kaydı (Registration):**
   - Oluşturulan yeni modülü mutlaka `src/registry/moduleRegistry.ts` dosyasına dahil et.
   - ÖNEMLİ: Bu yetmez! Modülün dashboard ekranında da gözükmesi için `src/routes/Dashboard.tsx` dosyasındaki sınıf filtereleme (switch (level)) mantığına modülün ID'sini de mutlaka ekle.

6. **Kazanım Kilidi (Data Layer):**
   - Görev başarıldığında `useAtomStore` üzerinden o kazanımın kimliğini (Örn: `MAT.5.2.1.1`) unlock et.
   - Ekranda "KAZANIM ELDE EDİLDİ: XYZ" HUD'ı göster.

## ⚠️ Kısıtlamalar
- Tek bir dosyayı binlerce satıra çıkarma, gerekiyorsa alt klasör/component yapısı kur.
- Öğrencinin kafasını karıştıracak karmaşık matematik formülleri değil, bulmacayı çözerken farkında olmadan kuralı öğreneceği "Sezgisel (Intuitive)" tasarımlar yap.
