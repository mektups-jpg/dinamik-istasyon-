export type GradeLevel = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9' | 'G10' | 'G11' | 'G12';
export type Domain = 'NUM' | 'GEO' | 'ALG' | 'DAT' | 'CAL';

export interface MicroAtom {
  /** Örn: "G1.NUM.001.1" */
  id: string;
  /** Örn: "İleriye doğru 1'er ritmik sayar" */
  title: string;
  /** Bloom Taksonomisine göre zorluk (1: Hatırlama, 2: Anlama, 3: Uygulama, 4: Analiz, 5: Sentez) */
  bloomLevel: 1 | 2 | 3 | 4 | 5;
}

export interface MacroAtom {
  /** Örn: "G1.NUM.001" */
  id: string;
  title: string;
  domain: Domain;
  grade: GradeLevel;
  microAtoms: MicroAtom[];
}

/**
 * EVRENSEL ATOM VERİTABANI (Örneklem)
 * Bu JSON yapısını diğer projelerinizde (Backend, AI Asistan, Test Portalı) doğrudan kullanabilirsiniz.
 */
export const universalAtoms: MacroAtom[] = [
  {
    id: "G1.NUM.001",
    title: "Ritmik Sayma ve Sayı Doğrusu",
    domain: "NUM",
    grade: "G1",
    microAtoms: [
      { id: "G1.NUM.001.1", title: "20'ye kadar ileriye 1'er sayar.", bloomLevel: 1 },
      { id: "G1.NUM.001.2", title: "20'den geriye 1'er sayar.", bloomLevel: 2 },
      { id: "G1.NUM.001.3", title: "Verilen bir sayıdan başlayarak ileri sayar.", bloomLevel: 3 },
      { id: "G1.NUM.001.4", title: "Sayı doğrusunda eksik bırakılan sayıyı bulur.", bloomLevel: 4 }
    ]
  },
  {
    id: "G1.NUM.002",
    title: "Toplama İşleminin Anlamı",
    domain: "NUM",
    grade: "G1",
    microAtoms: [
      { id: "G1.NUM.002.1", title: "Toplamanın 'çoğalma' olduğunu nesnelerle gösterir.", bloomLevel: 2 },
      { id: "G1.NUM.002.2", title: "Sayı doğrusunda ileri zıplayarak toplama yapar.", bloomLevel: 3 },
      { id: "G1.NUM.002.3", title: "Toplamı 10 olan sayı ikililerini ezbere bilir.", bloomLevel: 1 }
    ]
  },
  {
    id: "G1.NUM.003",
    title: "Onluk ve Birlik Kavramı",
    domain: "NUM",
    grade: "G1",
    microAtoms: [
      { id: "G1.NUM.003.1", title: "İki basamaklı sayıları onluk ve birliklerine ayırır.", bloomLevel: 3 },
      { id: "G1.NUM.003.2", title: "10 birliğin 1 onluk ettiğini modellerle gösterir.", bloomLevel: 2 }
    ]
  },
  {
    id: "G6.NUM.020",
    title: "Tam Sayılar ve Mutlak Değer",
    domain: "NUM",
    grade: "G6",
    microAtoms: [
      { id: "G6.NUM.020.1", title: "Mutlak değerin, sayı doğrusunda sıfıra olan fiziki uzaklık olduğunu açıklar.", bloomLevel: 2 },
      { id: "G6.NUM.020.2", title: "Hem negatif hem pozitif tam sayıların mutlak değerini bulur.", bloomLevel: 3 },
      { id: "G6.NUM.020.3", title: "Merkezi sıfır olan bir sistemde simetrik uzaklıkları modeller.", bloomLevel: 4 }
    ]
  },
  {
    id: "G6.ALG.010",
    title: "Oran ve Ters Orantı",
    domain: "ALG",
    grade: "G6",
    microAtoms: [
      { id: "G6.ALG.010.1", title: "İki çokluğun birbirine oranını belirler.", bloomLevel: 2 },
      { id: "G6.ALG.010.2", title: "Ters orantı mantığını fiziksel bir sistemde (dişliler vb.) modeller.", bloomLevel: 4 },
      { id: "G6.ALG.010.3", title: "Verilen orantı problemini çözer.", bloomLevel: 3 }
    ]
  },
  {
    id: "G7.ALG.020",
    title: "Cebirsel İfadeler ve Boyutlar",
    domain: "ALG",
    grade: "G7",
    microAtoms: [
      { id: "G7.ALG.020.1", title: "Bir değişkenin (x) 1., 2. ve 3. kuvvetlerinin sırasıyla uzunluk, alan ve hacim belirttiğini kavrar.", bloomLevel: 3 },
      { id: "G7.ALG.020.2", title: "Cebirsel ifadelerde değişkenin değeri değiştikçe büyümenin boyutlara göre nasıl katlandığını modeller.", bloomLevel: 4 }
    ]
  },
  {
    id: "G8.GEO.010",
    title: "Koordinat Sistemi ve Doğrusal Denklemler",
    domain: "GEO",
    grade: "G8",
    microAtoms: [
      { id: "G8.GEO.010.1", title: "Koordinat sisteminde eksenleri ve bölgeleri tanır.", bloomLevel: 1 },
      { id: "G8.GEO.010.2", title: "Verilen (x, y) sıralı ikililerini koordinat sisteminde gösterir.", bloomLevel: 3 },
      { id: "G8.GEO.010.3", title: "Programlama mantığı ile objeleri koordinat düzleminde hareket ettirir.", bloomLevel: 4 }
    ]
  },
  {
    id: "G3.NUM.020",
    title: "Kesirlere Giriş (Parça-Bütün)",
    domain: "NUM",
    grade: "G3",
    microAtoms: [
      { id: "G3.NUM.020.1", title: "Bir bütünün yarım ve çeyreklerini modellerle gösterir.", bloomLevel: 2 },
      { id: "G3.NUM.020.2", title: "Pay ve payda kavramlarını açıklar.", bloomLevel: 1 },
      { id: "G3.NUM.020.3", title: "Birim kesirleri (1/3, 1/4) büyüklüklerine göre sıralar.", bloomLevel: 4 }
    ]
  }
  // ... 85 Makro Atom ve 500 Mikro Atom bu standartta JSON olarak tutulur.
];
