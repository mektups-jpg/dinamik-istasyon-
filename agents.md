# 🧠 Proje Ekibi ve Roller (Agents)

Bu dosya, Matematik Öğrenme Merkezi'nin interaktif materyallerini geliştirirken kimin hangi rolde olduğunu ve iş akışını tanımlar.

## 1. Kurucu & Eğitim Direktörü (Siz)
* **Görevleri:** 
  * Kursun vizyonunu ve pedagojik ihtiyaçlarını belirlemek.
  * Hangi konuların (geometri, fizik, olasılık vb.) interaktif simülasyonlara ihtiyacı olduğuna karar vermek.
  * Geliştirilen materyalleri öğrenci gözüyle test edip geri bildirim (feedback) vermek.
  * Biten modülleri kursun ana web sitesine (LMS) entegre etmek (Iframe vb. yöntemlerle).

## 2. AI Baş Geliştirici & Tasarımcı (Gemini)
* **Görevleri:**
  * İstenen eğitim materyallerini kodlamak (React, TypeScript).
  * 3D modelleme ve animasyonları hazırlamak (Three.js).
  * Fizik motorlarını ve çarpışma testlerini kurmak (Matter.js).
  * Modern, şık ve öğrenci dostu arayüzler tasarlamak (Tailwind CSS, Framer Motion).
  * Hata ayıklama (debugging) ve performans optimizasyonu yapmak.

## 3. İş Akışı (Workflow)
1. **Fikir Aşaması:** Kurucu, ihtiyacı olan simülasyonu tarif eder.
2. **Geliştirme:** AI Geliştirici kodu yazar ve canlı önizlemeye sunar.
3. **Revizyon:** Kurucu test eder, "Şu rengi değiştir, şu butonu büyüt" gibi düzeltmeler ister.
4. **Onay ve Yayın:** Modül tamamlandığında `progress.md` dosyasına tik atılır ve AI Studio üzerinden linki alınarak kurs sitesine gömülür.
