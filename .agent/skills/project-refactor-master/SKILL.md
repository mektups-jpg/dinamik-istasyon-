# 🛠️ Skill: Refactor Master (Mimari Düzenleyici)

**Tetikleyici:** Kullanıcı "Bu dosya çok şişti", "Bunu daha iyi organize et" dediğinde veya ajan kodu yazarken dosya uzunluğunun 400+ satıra ulaştığını fark ettiğinde.

## 🎯 Amaç
Karmaşık (Monolithic) dosyaları parçalayarak, temiz ve bakımı kolay (Modular) bir klasör tipolojisi oluşturmak.

## 🔄 İş Akışı
1. **Analiz:** Şişmiş dosyanın bileşenlerini çıkar (Örn: Ana Sayfa, Bot Paneli, Ayarlar Modal'ı).
2. **Yapılandırma Planı (Blueprint):**
   - Hangi alt bileşen `components/UI/` içerisine gitmeli?
   - Hangi state mantığı (logical slice) `store/` içerisinde özel bir hook olmalı (Örnek: `useModuleLogic.ts`)?
3. **Güvenli Parçalama:**
   - Önce yeni dosyayı yarat (`create_file`).
   - İçerikleri aktar.
   - Orijinal dosyaya `import` ekle ve silinen kısmı düzenle (`edit_file`).
   - Bu işlemi kodun çökmesine (Build Hatası) izin vermeden küçük parçalar halinde (incremental) yap.
4. **Onaylama:** `compile_applet` aracıyla projenin çökmediğinden emin ol.
