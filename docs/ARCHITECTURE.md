# 🏛️ Mimari ve Altın Şablon (Golden Template)

Bu doküman, 100+ modüllük devasa bir eğitim platformu inşa ederken projenin çökmemesi ve spagetti koda dönüşmemesi için kurduğumuz **"Altın Şablon" (Golden Template)** mimarisini açıklar.

## 🎯 Neden Altın Şablon?

Kumon ve Mathnasium gibi devlerle rekabet etmek için çok sayıda konuyu (modülü) sisteme eklememiz gerekiyor. Eğer her modülü kendi başına, farklı stillerle ve farklı mantıklarla yazarsak proje yönetilemez hale gelir. Altın Şablon, projenin **"Fabrika Üretim Bandı"**dır. Bize hız, kalite, hata kontrolü ve öğrencileri motive edecek bir ekosistem sunar.

## 💎 Altın Şablon'un 5 Temel Taşı

### 1. İnanılmaz Geliştirme Hızı (Tak-Çalıştır Mantığı)
Her modül için baştan UI (butonlar, kaydırıcılar, paneller) tasarlamayız. Sol taraf simülasyon, sağ taraf matematik/kontrol paneli olacak şekilde iskelet hazırdır. Sadece ortadaki simülasyon mantığını yazarız. Puan eklemek `addScore(10)`, ses çalmak `playSound()` kadar kısadır.

### 2. Kusursuz Tutarlılık ve Kullanıcı Deneyimi (UX)
1. modüldeki butonun rengi, fontu ve animasyonu ile 99. modüldeki tamamen aynıdır (Shadcn UI sayesinde). Öğrenci "Birim Çember" modülünü nasıl kullanacağını anladığında, "Galton Tahtası"nı da anında anlar çünkü kontroller hep aynı sağ paneldedir.

### 3. Global Oyunlaştırma (Zustand)
Öğrencilerin platformda daha fazla vakit geçirmesini ve modülleri tamamlamak için motive olmasını sağlar. Zustand (Global State) sayesinde puan sistemi tüm uygulamaya yayılır. Öğrenci Geometri modülünde özel bir açıyı bulduğunda kazandığı 50 puan, Fizik modülüne geçtiğinde de hesabında durur. 

### 4. Akademik ve Profesyonel Görünüm (KaTeX)
Platformun basit bir oyun gibi değil, ciddi ve premium bir eğitim aracı gibi görünmesini sağlar. Matematiksel formüller ekrana düz metin (`x^2 + y^2`) olarak değil, üniversite ders kitaplarındaki gibi kusursuz bir tipografiyle ($x^2 + y^2 = r^2$) basılır. 

### 5. Merkezi Bakım ve Hata Çözümü (Maintainability)
İleride bir değişiklik yapmak istediğimizde 100 dosyayı tek tek gezmek zorunda kalmayız. Örneğin, "Başarı sesini değiştirelim" veya "Puan rozetinin rengini kırmızı yapalım" dediğimizde, bunu tek bir merkezden (Store veya UI bileşeni) değiştiririz ve 100 modülün tamamı anında güncellenir.

## 🛠️ Yeni Modül Ekleme Rehberi (4 Adım)

Yeni bir modül (örneğin "Eğik Atış") ekleyeceğimiz zaman şu 4 adımı izleriz:

### Adım 1: Klasör Yapısı (Düzen)
Her modül kendi klasöründe yaşar.
`src/modules/[ders-adi]/[modul-adi]/[ModulAdi]App.tsx`

### Adım 2: Oyunlaştırma ve Puan Sistemi (Zustand)
Yeni modüle puan sistemini eklemek sadece 1 satır sürer.
```tsx
import { useGameStore } from '../../../store/useGameStore';
const { score, addScore } = useGameStore();

// Öğrenci hedefi vurduğunda veya doğru açıyı bulduğunda:
addScore(50);
```

### Adım 3: Ses Efektleri (use-sound)
Öğrenciye "oyun" hissiyatı vermek için sesleri eklemek 1 satır sürer.
```tsx
import useSound from 'use-sound';
const [playSuccess] = useSound('basari-sesi.mp3');

// Butona basıldığında veya top hedefe çarptığında:
playSuccess();
```

### Adım 4: Matematiksel Formüller (KaTeX)
Ekrana çirkin `x^2 + y^2 = z^2` yazmak yerine, ders kitabındaki gibi kusursuz basmak için:
```tsx
import { InlineMath, BlockMath } from 'react-katex';

// Ekranda göstermek için:
<InlineMath math={`f(x) = ax^2 + bx + c`} />
```
