# Matnastik Laboratuvarı - Uygulama Yol Haritası

Bu doküman, mevcut kod tabanı ve proje belgeleri incelendikten sonra uygulanacak çalışma sırasını tanımlar. Müfredat ve atom doğruluğu için kaynak belgeler:

- `docs/MEB_ATOMLARI.md`: Mikro kazanım atomları için SSOT.
- `docs/MODULES.md`: 73 makro oyun/laboratuvar modülünün ana haritası.
- `docs/ARCHITECTURE.md`: Golden Template mimarisi.
- `.agent/knowledge/`: Bilinen UI gotcha ve teknik kararlar.

## Güncel Durum

| Alan | Durum |
| --- | --- |
| Hedef makro modül | 73 |
| Registry'de aktif modül | 32 |
| Yaklaşık üretim oranı | %44 |
| En dolu sınıf | 5. sınıf tamamlandı, 8. sınıf 3D/geometri ağırlıklı |
| En boş sınıf | 10. sınıf henüz modülsüz |
| Ana teknik risk | Modüller arası template tutarsızlığı, iframe root layout sorunları, kalan `any` tipleri, büyük ana bundle |

## Çalışma İlkeleri

1. Her yeni modül önce `docs/MEB_ATOMLARI.md` atomlarıyla eşleşir; uydurma kazanım kullanılmaz.
2. Her modül `src/registry/moduleRegistry.ts` üzerinden dashboard ve embed route'a bağlanır.
3. Embed root layout kuralı: `h-full w-full overflow-y-auto overflow-x-hidden`; root seviyesinde `min-h-screen` kullanılmaz.
4. Dekoratif absolute overlay'ler `pointer-events-none` alır.
5. Modül tamamlandı sayılması için build geçmeli, tarayıcı console temiz olmalı, temel desktop/mobile görsel kontrol yapılmalı.

## Faz 0 - Devralma ve Stabilizasyon

Amaç: Google AI Studio prototip hissinden çıkıp sürdürülebilir repo düzenine geçmek.

- [x] Depoyu yerelde çalışır hale getir.
- [x] `package-lock.json` ve bağımlılık güvenlik uyarılarını düzelt.
- [x] `node_modules/` ve `dist/` için `.gitignore` ekle.
- [x] `PROGRESS.md` / `progress.md` case-collision sorununu temizle.
- [x] Kırık dış `noise.svg` asset bağımlılığını yerel CSS ile değiştir.
- [x] Poligon Çatışma Testi SVG runtime hatalarını düzelt.
- [ ] Kalan `any` kullanımlarını temizle.
- [ ] Büyük bundle uyarısı için manual chunk stratejisi ekle.
- [ ] Iframe root layout audit'i yap ve eski modülleri normalize et.

## Faz 1 - Publish ve Operasyon Hattı

Amaç: AI Studio'daki `Publish` rahatlığını GitHub tabanlı tekrarlanabilir deploy'a taşımak.

- [ ] Firebase Hosting projesini mevcut Firebase projesiyle eşleştir.
- [ ] `firebase.json` ve deploy hedeflerini ekle.
- [ ] GitHub Actions ile `main` push sonrası otomatik build + deploy kur.
- [ ] Preview channel akışı ekle: PR veya manuel branch için geçici URL.
- [ ] Ortam ayrımı yap: local, preview, production.
- [ ] Deploy sonrası smoke test listesi oluştur: dashboard, login, 1 embed modül, 1 3D modül.

Not: Bu proje şu an Vite SPA olduğu için ilk tercih Firebase Hosting. Server-side ihtiyaç doğarsa Cloud Run veya Firebase App Hosting ayrıca değerlendirilir.

## Faz 2 - Golden Template Standardizasyonu

Amaç: 73 modül büyürken her modülün farklı iskelete savrulmasını engellemek.

- [ ] Ortak `ModuleShell` bileşeni çıkar: header, bot alanı, kontrol paneli, simülasyon alanı.
- [ ] `ModuleMeta` tipini sertleştir: `component` için `any` kaldır, `atomIds` dizisi ekle.
- [ ] Tamamlama ekranı ve atom unlock akışını tek bileşende standartlaştır.
- [ ] Ortak test/smoke checklist ekle.
- [ ] 3D modüllerde ortak Three.js lifecycle helper'ı oluştur.
- [ ] Eski modülleri template'e kademeli taşı.

## Faz 3 - Müfredat Üretim Sırası

Öncelik stratejisi: Önce 5-8 ortaokul omurgası tamamlanır, sonra ilkokul temel fazı doldurulur, lise modülleri daha sonra genişletilir. Sebep: mevcut kod tabanı en güçlü ortaokul/geometri simülasyonlarında; momentum buradan devam etmeli.

### Sprint 3.1 - 6. Sınıfı Tamamlama

5. sınıf tamamlandığı için doğal devam noktası 6. sınıf.

- [ ] Kuantum Filtre İstasyonu: çarpanlar, katlar, bölünebilme, asal sayılar, EBOB/EKOK.
- [ ] Format Dönüştürücü Çekirdek: kesir, ondalık, yüzde dönüşümü.
- [ ] Cebirsel Reaktör: değişken, denklem dengesi, benzer terimler.
- [ ] Büyük Veri Hızlandırıcısı: ortalama, açıklık, deneysel olasılık, yanıltıcı grafik.
- [ ] Mevcut Optik Lazer ve Area/Pi modüllerini template + iframe kurallarına göre yeniden denetle.

İlk önerilen modül: **Kuantum Filtre İstasyonu**. Hem 6. sınıfın ilk büyük ekseni hem de çok sayıda atomu tek modülde kapatıyor.

### Sprint 3.2 - İlkokul Temel Fazı

Amaç: küçük yaş kullanıcıları için ürünün giriş deneyimini güçlendirmek.

- [ ] 1. sınıf: Lazer Denge Reaktörü.
- [ ] 1. sınıf: Otonom Rota Bağlantısı.
- [ ] 1. sınıf: Optik Kalite Kontrol Bandı.
- [ ] 1. sınıf: Akıllı Lojistik Terminali.
- [ ] 1. sınıf: Veri Akış Ekranı.
- [ ] 2. sınıf: Lazer Kesim Odası.
- [ ] 2. sınıf: Kargo Gruplama Bandı.
- [ ] 2. sınıf: Kuantum Denge Terazisi.
- [ ] 3. sınıf: İşlem Laboratuvarı ve Dinamik Birim Dönüştürücü.
- [ ] 4. sınıf: Dinamik Kesir Terazisi ve Rotasyonlu Açı İletkisi.

### Sprint 3.3 - 7 ve 8. Sınıf Tamamlama

- [ ] 7. sınıf: Kuantum Kesir/Ondalık Senkronizatörü.
- [ ] 7. sınıf: Akış Diyagramı ve Terim Reaktörü.
- [ ] 7. sınıf: Optik Mimari Masası.
- [ ] 7. sınıf: Hacim Dolum Tesisleri & Daire Alan Kurgusu.
- [ ] 7. sınıf: Geometrik Asistan Robot & Spekülasyon Dedektifi.
- [ ] 8. sınıf: Radikal Üs ve Kök Jeneratörü.
- [ ] 8. sınıf: Kinematik Transformasyon Matrisi.
- [ ] 8. sınıf: Spekülasyon Klasörü.
- [ ] 8. sınıf 3D Holografik Ambalaj Tesisi alt modüllerini tek pedagogik akışta birleştir.

### Sprint 3.4 - Lise Omurgası

- [ ] 9. sınıf: Kök ve Üs Reaktörü.
- [ ] 9. sınıf: Fonksiyonel Hologram Odası.
- [ ] 9. sınıf: Akıllı Mantık Devreleri.
- [ ] 10. sınıf: Şifreli Kuantum Kasası.
- [ ] 10. sınıf: Parabolik Eğri Simülatörü.
- [ ] 10. sınıf: Lazer Teodoliti.
- [ ] 11. sınıf: Logaritmik Büyüme Reaktörü.
- [ ] 12. sınıf: Limit Sensörü ve Türev Eğim Sürücüsü.

## Modül Definition of Done

Bir modül ancak şu maddeler tamamlanınca bitmiş sayılır:

- [ ] `docs/MEB_ATOMLARI.md` içinden kapsadığı atomlar belirlenmiş.
- [ ] Modül `src/modules/<domain>/<module>/` altında tek sorumluluklu kurulmuş.
- [ ] `src/registry/moduleRegistry.ts` içine doğru `grade`, `category`, `difficulty`, `path`, `atomIds` ile eklenmiş.
- [ ] Root layout iframe uyumlu.
- [ ] `any` yok; event ve state tipleri açık.
- [ ] Decorative overlay'ler click/drag engellemiyor.
- [ ] Completion state `useAtomStore` üzerinden çalışıyor.
- [ ] `npm run build` geçiyor.
- [ ] Tarayıcı console error vermiyor.
- [ ] Desktop ve mobil viewport smoke test tamam.
- [ ] `PROGRESS.md` ve gerekirse `docs/BRAINSTORM.md` güncellenmiş.

## Yakın Dönem Checkpoint'leri

### Checkpoint A

Teknik omurga kapanmış olmalı: deploy pipeline, type cleanup, bundle chunking, layout audit.

### Checkpoint B

6. sınıf ana modülleri tamamlanmış olmalı. Dashboard'da 6. sınıf artık eksik görünmemeli.

### Checkpoint C

İlkokul 1-4 için en az her sınıfta 3 güçlü modül bulunmalı. Ürün küçük yaş kullanıcısına da gerçek değer sunmalı.

### Checkpoint D

8. sınıf ve lise 9-10 için fonksiyon/analitik modüller açılmalı. Bu noktadan sonra platform demo değil, gerçek K-12 omurga olur.
