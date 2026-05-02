# 10-03 Fonksiyon Mu Filtresi

## Amaç
10. sınıf fonksiyon şartlarını tek filtre deneyinde öğretmek. Öğrenci "her x en fazla bir y üretir" kuralını dikey tarayıcıyla görür; ardından tanım kümesindeki girişleri verilen kurala göre doğru çıkış portlarına bağlar.

## Atom Kapsamı
- `MAT.10.2.1.1`: Grafiği verilen bir bağıntının "Fonksiyon" olup olmadığını dikey doğru testiyle doğrular.
- `MAT.10.2.1.2`: Gerçek sayılarda fonksiyonun tanım kümesindeki elemanları matematiksel kurallarla eşleştirir.

## Kapsam Dışı
- `MAT.10.2.2.x` parabol dönüşümleri tamamlanan **Parabol Şekil Stüdyosu** modülündedir.
- `MAT.10.2.3.x` ve `MAT.10.2.4.x` tanım bölgesi/asimptot konuları tamamlanan **Tanım Kümesi Kapıları** modülündedir.
- Ters fonksiyon, işaret tablosu, bileşke ve dört işlem bu modülün kapsamına alınmaz.

## Ana Oyuncak
Tek sahne iki katmanlı bir filtre panelidir:
- **Dikey Tarayıcı:** Öğrenci x eksenindeki belirgin tarama lazerini sürükler. Lazer geniş bir ışık perdesi ve parlak çekirdek çizgi olarak görünür; aynı x değerinde iki noktaya çarparsa kırmızı alarm verir, tek noktaya çarparsa yeşil geçiş verir.
- **Fonksiyon Portları:** Tanım kümesi girişleri aynı panelde portlara dönüşür. Öğrenci `f(x)=2x+1` gibi kısa bir kuralı kullanarak her giriş portunu doğru çıkış portuyla eşleştirir.

## Görev Akışı
1. Fonksiyon olmayan ilişkiyi tara: tarayıcıyı iki çıktı üreten x değerine getir ve alarmı doğrula.
2. Fonksiyon olan ilişkiyi tara: tarayıcıyı örnek x değerlerinde gezdir ve her x için tek çıktı olduğunu doğrula.
3. Tanım kümesi portlarını eşleştir: verilen kuralda girişleri doğru çıkışlara bağla.

## UI/UX Kriterleri
- İlk bakışta tek ana oyuncak görünür: hareket eden dikey lazer filtresi.
- Öğrenci "neyle oynayacağım?" sorusunun cevabını tarayıcı handle'ı ve parlak portlarla hemen görür.
- Sağ/alt panel yalnız aktif görev, canlı x değeri, çarpılan nokta sayısı ve onay/reset içerir.
- Yanlış durumda AstroBot mesajı kısa ve öğretici olur: "Bu x değeri iki farklı y üretiyor; bu yüzden ilişki fonksiyon değil."
- Kapılar/portlar klavye erişimi de alır; Browser Use QA kırılgan koordinat tahminine bağlı kalmaz.

## QA Başarı Kriteri
- `/embed/algebra/function-filter?qa=1` açılır.
- `function-filter-scene`, `vertical-scanner-handle`, `relation-point-*`, `mapping-port-*`, `function-filter-check` görünür.
- Yanlış onay AstroBot hata mesajı üretir.
- Üç görev doğru etkileşimlerle tamamlanır ve `10. SINIF LAB TAMAMLANDI` görünür.
- `npm run build`, `git diff --check`, Browser Use console ve embed smoke temizdir.
