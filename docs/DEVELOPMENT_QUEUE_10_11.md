# 10-11. Sınıf Geliştirme Kuyruğu

Bu dosya, saatlik otomasyonun ve manuel geliştirme oturumlarının takip edeceği üretim kuyruğudur. Atom doğruluğu için kaynak `docs/MEB_ATOMLARI.md`; tasarım kalitesi için kaynak `docs/MODULE_DESIGN_GUIDE.md`; bitiş kriteri için kaynak `docs/MODULE_DONE_CRITERIA.md`.

Otonom üretim hattı için ana protokol: `docs/AUTONOMOUS_MODULE_PIPELINE.md`.

## Çalışma Kuralı
- Sıradaki iş, önce `Status = In Progress` olan en üst modül; yoksa `Status = Ready` olan en üst modüldür.
- Uzun koşu sınıf kilidi şu anda **11. sınıf**tır. 11. sınıfta Ready kalmazsa en üst Backlog modül otomatik Ready yapılıp aynı sınıfta devam edilir.
- 11. sınıf tamamen Done olmadan 10. sınıf Backlog'una dönülmez.
- Her modül tek ana oyuncak/deney etrafında yapılır.
- Geniş kapsamlı ünite tek modüle sıkıştırılmaz; ayrı makro deneylere bölünür.
- Her modül uygulamadan önce registry route, atom listesi, ana manipulative ve QA akışı netleşir.
- Modül bitince status `Done` yapılır, `PROGRESS.md`, `.agent/WORKLOG.md` ve `docs/MODULE_QUALITY_SCORECARD.md` güncellenir.

## Öncelik Stratejisi
İlk sıra, yazılımla en iyi görünür hale gelen ve öğrencide en güçlü "anladım" hissi oluşturacak konulara verilir:

1. Grafik ve geometri manipülasyonları.
2. 3D/2D dönüşüm, sürükleme, döndürme, üst üste bindirme ve tarama gerektiren konular.
3. Soyut kuralı fiziksel sisteme dönüştüren sayı/olasılık/istatistik deneyleri.

## 10. Sınıf Kuyruğu

| Sıra | Status | Önerilen Modül | Atomlar | Ana Oyuncak | Neden Öncelikli |
| --- | --- | --- | --- | --- | --- |
| 10-01 | Done | Parabol Şekil Stüdyosu | `MAT.10.2.2.x` | Tepe noktası ve genişliği doğrudan sürüklenen parabol hologramı | 9. sınıf fonksiyon çizgisinin doğal devamı; güçlü görsel manipülasyon sağlar. |
| 10-02 | Done | Tanım Kümesi Kapıları | `MAT.10.2.3.x`, `MAT.10.2.4.x` | Karekök güvenli bölgesi ve rasyonel asimptot duvarı | Öğrenci `x>=0` ve payda sıfır yasağını sahnede engel olarak görür. |
| 10-03 | Done | Fonksiyon Mu Filtresi | `MAT.10.2.1.x` | Dikey doğru tarayıcısı ve eşleme paneli | Bağıntı/fonksiyon ayrımını tek tarama hareketiyle öğretir. |
| 10-04 | Done | Ters Fonksiyon Aynası | `MAT.10.2.5.x` | `y=x` aynasına göre grafik ve makine tersleme | Fonksiyon tersini cebirden önce görsel simetriye bağlar. |
| 10-05 | Done | İşaret Tablosu Tarayıcısı | `MAT.10.2.6.x` | Kök noktalarından geçen artı/eksi lazer bandı | Browser Use QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-06 | Done | Trigonometrik Teodolit | `MAT.10.4.1.x` | Dik üçgen üzerinde açı kolu, hipotenüs ve oran okuyucu | Sin/cos/tan/cot oranlarını formül ezberi olmadan ölçtürür. |
| 10-07 | Done | Sabit Alan Üçgen Rayı | `MAT.10.4.3.x` | Tepe noktası paralel doğru üzerinde kayan üçgen | Browser Use QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-08 | Done | Sinüs-Kosinüs Arazi Ölçeri | `MAT.10.4.4.x` | Dik olmayan arazide eksik kenar/açı ölçen lazer ölçer | Browser Use QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-09 | Done | Birim Çember Kalkanı | `MAT.10.4.2.x` | `sin²x + cos²x = 1` enerji halkası | Browser Use QA ve Gemini 3 Flash 92/100 PASS geçti. |
| 10-10 | Done | Analitik Rota Haritası | `MAT.10.5.1.x`, `MAT.10.5.2.x` | İki nokta arası rota, eğim oku ve içten bölme istasyonu | Koordinat, mesafe ve eğim tek navigasyon deneyinde anlamlı bağlanır. |
| 10-11 | Done | Asal Kilit Kasası | `MAT.10.1.1.x` | Sayıyı asal lazerlerle parçalayan kasa | Browser Use QA ve Gemini 3 Flash 92/100 PASS geçti. |
| 10-12 | Done | EBOB/EKOK Dişli Kutusu | `MAT.10.1.2.x` | Ortak bölen/kat hizasında kilitlenen sayı dişlileri | Browser Use final QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-13 | Done | Kalan Kapısı | `MAT.10.1.3.x` | Bölme yapmadan kalan test eden modüler kapılar | Browser Use final QA ve Gemini 3 Flash 95/100 PASS geçti. |
| 10-14 | Done | Sayma Montaj Hattı | `MAT.10.3.1.x` | Paralel veya ardışık üretim bantları | Browser Use final QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-15 | Done | Cebir Algoritma Makinesi | `MAT.10.3.2.x` | Girdi-çıktı blokları ve işlem boru hattı | Browser Use final QA ve Gemini 3 Flash 98/100 PASS geçti. |
| 10-16 | Done | Çapraz Tablo Dedektifi | `MAT.10.6.1.x`, `MAT.10.6.2.x` | İki kategorili veri matrisinde sapma ve medya yanlılığı tarayıcısı | Browser Use final QA ve Gemini 3 Flash 96/100 PASS geçti. |
| 10-17 | Done | Koşullu Olasılık Filtresi | `MAT.10.7.1.x` | Evrensel kümeyi daraltan koşul kapısı | Browser Use final QA ve Gemini 3 Flash 98/100 PASS geçti. |
| 10-18 | Done | Bağımlı Çekiliş Makinesi | `MAT.10.7.2.x` | Geri konulmayan top makinesi | Browser Use final QA ve Gemini 3 Flash 94/100 PASS geçti. |

## 11. Sınıf Kuyruğu

> Not: Eski `trig-pendulum`, `unit-circle`, `laser-defense` ve `slope-rollercoaster` kayıtları silinmedi; Dashboard'da `Legacy / Eski Deneyler` arşivine alındı. Yeni üretim bu kuyruktaki dar makro deneylerden ilerler.

| Sıra | Status | Önerilen Modül | Atomlar | Ana Oyuncak | Neden Öncelikli |
| --- | --- | --- | --- | --- | --- |
| 11-01 | Done | Trigonometrik Osiloskop | `MAT.11.1.1.1`, `MAT.11.1.1.2` | Birim çemberden sin/cos dalgası çizen piston | Önceki sevilen animasyonlu sin/cos deneylerine en yakın lise modülü. |
| 11-02 | Done | Tanjant Asimptot Kapıları | `MAT.11.1.1.3`, `MAT.11.1.1.4` | Asimptot duvarlarına yaklaşan tan/cot dalgası | Asimptot fikrini güçlü ve net görselleştirir. |
| 11-03 | Done | Trigonometrik Kök Avcısı | `MAT.11.1.2.x` | Dalga üzerinde kök işaretleyici ve faz tarayıcı | Denklem köklerini grafikle eşleştirir. |
| 11-04 | Done | Üstel Büyüme Reaktörü | `MAT.11.1.3.x` | Taban sürgüsüyle artan/azalan büyüme sahnesi | Büyüme/azalma farkı tek manipülasyonla görünür. |
| 11-05 | Done | Logaritma Ters Ayna Odası | `MAT.11.1.4.x`, `MAT.11.1.5.x` | Üstel grafiği `y=x` aynasında logaritmaya çeviren düzenek | Logaritmayı ters işlem olarak sezdirir. |
| 11-06 | Done | Richter-Desibel Ölçek Simülatörü | `MAT.11.1.6.x` | Ses/deprem verisini log ölçeğinde sıkıştıran ölçer | Gerçek yaşam bağlantısı güçlüdür. |
| 11-07 | Done | Fonksiyon Bileşke Portları | `MAT.11.1.7.x` | `g` makinesinin çıktısını `f` makinesine takan port sistemi | Bileşkeyi kablo ve makine zinciriyle gösterir. |
| 11-08 | Done | Fonksiyon İşlem Mikseri | `MAT.11.1.8.x` | Aynı tanım kümesinde iki fonksiyonu karıştıran mikser | Dört işlemi grafik ve değer tablosuyla bağlar. |
| 11-09 | Done | Dörtgen Ayrıştırma Masası | `MAT.11.2.1.x` | Dörtgeni köşegeninden iki üçgene ayıran kesme masası | 360° ve alan mantığını önceki üçgen deneylerine bağlar. |
| 11-10 | Done | Özel Dörtgen Tanı Masası | `MAT.11.2.2.x` | Kenar/köşegen özelliklerini tarayan geometri teşhis paneli | Sınıflandırmayı ezber değil test haline getirir. |
| 11-11 | Done | Konkav-Konveks Lazer Dedektörü | `MAT.11.2.3.x` | İçeri göçen açıyı yakalayan açı tarayıcı | İçbükey/dışbükey ayrımını tek görsel işarete indirir. |
| 11-12 | Done | Çokgen Köşegen ve Simetri Atölyesi | `MAT.11.2.4.x` | Köşegen çizen ve simetri ekseni sayan çokgen aracı | Formülleri çizimden doğurur. |
| 11-13 | Done | Mozaik Kaplama Atölyesi | `MAT.11.2.5.x` | Fayansları sürükleyip boşluksuz kaplama kurma | Öğrencinin tasarım yaparak öğrenmesini sağlar. |
| 11-14 | Done | Korelasyon Serpilme Radarı | `MAT.11.3.1.x` | Nokta bulutu, eğilim çizgisi ve pozitif/negatif tarayıcı | Veri ilişkiselliğini güçlü görsel pattern olarak gösterir. |
| 11-15 | Done | Medya Korelasyon Denetçisi | `MAT.11.3.2.x` | Dış veri iddiasını tutarlılık testinden geçiren analiz ekranı | Eleştirel veri okuryazarlığı kazandırır. |

## İlk Üç Sprint Önerisi

### Sprint A - Görsel Grafik Omurgası
- `10-01` Parabol Şekil Stüdyosu.
- `10-02` Tanım Kümesi Kapıları.
- `11-01` Trigonometrik Osiloskop.

### Sprint B - Ölçüm ve Geometri Omurgası
- `10-06` Trigonometrik Teodolit.
- `10-10` Analitik Rota Haritası.
- `11-09` Dörtgen Ayrıştırma Masası.

### Sprint C - Veri ve Olasılık Omurgası
- `10-17` Koşullu Olasılık Filtresi.
- `10-18` Bağımlı Çekiliş Makinesi.
- `11-14` Korelasyon Serpilme Radarı.
