# 🗺️ Geliştirme Yol Haritası (K-12)

Bu doküman, 1. sınıftan 12. sınıfa kadar (K-12) tüm matematik ve geometri konularını kapsayan interaktif modüllerimizin geliştirme planını içerir.

## 🎯 Hedef Kitle ve Yaklaşım
- **İlkokul (1-4. Sınıf):** Görsel, dokunulabilir, somut kavramlar (Kesirler, Temel Dört İşlem, Şekiller).
- **Ortaokul (5-8. Sınıf):** Somuttan soyuta geçiş, kuralların görsel ispatları (Pisagor, Olasılık, Doğrusal Denklemler).
- **Lise (9-12. Sınıf):** İleri düzey soyut kavramların dinamik simülasyonları (Trigonometri, Parabol, Türev, İntegral, 3D Geometri).

---

## 🟢 Tamamlanan Modüller (Altın Şablon Standartlarında)
- [x] **Trigonometrik Birim Çember (Lise):** Açıların sinüs, kosinüs ve tanjant değerlerinin görselleştirilmesi. (KaTeX, Ses, Puanlama eklendi)
- [x] **Galton Tahtası (Ortaokul/Lise):** Olasılık ve Binom Dağılımı simülasyonu. (Matter.js, Ses, Puanlama, KaTeX eklendi)

---

## 🟡 Planlanan Modüller (Sıradaki Adımlar)

### İlkokul (1-4. Sınıf)
- [ ] **Kesirler (Fractions) Laboratuvarı:**
  - *Simülasyon:* Ekranda bir pizza veya çikolata barı.
  - *Etkileşim:* Öğrenci dilimleri sürükleyip bırakır. Doğru parçayı koyduğunda "Tebrikler" sesi çalar, +10 puan kazanır.
  - *Matematik:* Sağ tarafta $\frac{1}{2} + \frac{1}{4} = \frac{3}{4}$ işlemi KaTeX ile devasa ve net bir şekilde görünür.
- [ ] **Çarpım Tablosu Alan Modeli:** Çarpma işleminin sadece ezber değil, bir alan hesabı olduğunu gösteren interaktif ızgara (grid).

### Ortaokul (5-8. Sınıf)
- [ ] **Pisagor Teoremi Su Simülasyonu:**
  - *Simülasyon:* Dik üçgenin kenarlarındaki karelerin içindeki suların, hipotenüsteki büyük kareye dökülüp tam doldurduğu bir animasyon (Matter.js).
  - *Etkileşim:* Öğrenci kenar uzunluklarını değiştirir, suyun hacminin hep $a^2 + b^2 = c^2$ kuralına uyduğunu keşfeder.
- [ ] **Doğrusal Denklemler (Terazi Modeli):** $2x + 3 = 7$ denklemini çözerken terazinin iki kefesinden de ağırlık çıkararak dengeyi koruma oyunu.

### Lise (9-12. Sınıf)
- [ ] **İkinci Dereceden Denklemler ve Parabol:**
  - *Simülasyon:* $y = ax^2 + bx + c$ grafiği üzerinde $a, b, c$ katsayılarını kaydırıcılarla (slider) değiştirme.
  - *Etkileşim:* Kökleri (x eksenini kestiği noktaları) bulduğunda puan kazanma. Tepe noktasının nasıl değiştiğini anlık izleme.
- [ ] **Türev ve Teğet Doğrusu:**
  - *Simülasyon:* Eğri üzerinde hareket eden bir nokta ve o noktadaki teğet doğrusu.
  - *Etkileşim:* Öğrenci noktayı kaydırdıkça teğetin eğiminin (türevin) nasıl değiştiğini anlık görür.
- [ ] **Eğik Atış (Fizik/Matematik Kesişimi):**
  - *Simülasyon:* Top mermisi fırlatma ve hedef vurma.
  - *Etkileşim:* Açı ve ilk hızı ayarlayarak hedefi vurma. Vurunca patlama sesi ve puan.

---

*Not: Bu yol haritası canlı bir dokümandır. Yeni fikirler ve önceliklere göre sürekli güncellenecektir.*
