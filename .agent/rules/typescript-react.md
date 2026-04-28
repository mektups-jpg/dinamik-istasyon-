# 📜 Kural Seti: TypeScript ve React Standartları

**Açıklama:** Ajanın kod yazarken uyması gereken kesin programlama ve dil standartları.

## 1. Mimari ve State Yönetimi (Zustand)
- **Global State:** Tüm global state'ler (skor, açılan kazanımlar, kullanıcı verisi) `Zustand` ile yönetilmelidir. Prop-drilling (derinlemesine prop iletme) yasaktır.
- **Local State:** Yalnızca tek bir bileşeni ilgilendiren durumlar (örn: animasyonun gösterilip/gizlenmesi, menü açık/kapalı state'i) `useState` ile tutulmalıdır.

## 2. TypeScript Katı Kuralları
- **Asla `any` Kullanma:** `any` tipi kullanmak kesinlikle yasaktır. Gerekirse `unknown` kullan veya bir interface/type tanımla.
- **Kesin Tipler:** Tüm oyun içi varlıklar, bot mesajları ve kazanım nesneleri belirli bir arayüze (Interface) sahip olmalıdır (Örn: `BotMessage`, `AtomStatus`).
- **Veri Dışa Aktarımı:** Sık kullanılan tipleri `src/types/` (veya ilgili modül klasörü altındaki `types.ts`) içinde tanımla.

## 3. React ve Hooks
- **Re-render Kontrolü:** `useEffect` bağımlılık (dependency) dizileri dikkatlice kontrol edilmeli, sonsuz döngü (infinite render) yaratacak objeler bağımlılık dizisine doğrudan eklenmemelidir.
- **Modülerlik:** Bir dosya 300-400 satırı geçmeye başladığında derhal küçük bileşenlere bölünmelidir (AstroBot iletişim paneli gibi).
- **JSX Okunabilirliği:** İç içe geçmiş (nested) `if/else` 'ler yerine erken dönüş (early return) ve mantıksal `&&` operatörü kullanılmalıdır.

## 4. Güvenlik ve Hata Yönetimi
- **Hata Yakalama (Error Handling):** Her oyun modülünde olası kullanıcı yasa dışı işlemlerine (yanlış veri girilmesi vs.) karşı Zustand store'larında hata fırlatılmalı (throw) veya UI'da kullanıcıya hata (AstroBot aracılığıyla) raporlanmalıdır.
