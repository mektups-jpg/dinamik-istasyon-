# Kaptan Inceleme ve Uretim Hatti

Bu dokuman, Kaptan'in modulleri gozle incelerken not birakmasi ve Codex'in bu notlari tek bir guvenli uretim sirasina cevirmesi icin kullanilir.

## Ana Karar

- Tek repo korunur. `docs/MEB_ATOMLARI.md`, `MODULES.md`, kalite defterleri ve registry tek kaynak olarak kalir.
- Is sohbetlere ayrilabilir: ilkokul audit, ortaokul audit, lise uretim.
- Kod degistiren sohbet ayni anda yalniz bir tane olur.
- Audit sohbetleri dosya duzenlemez, commit atmaz, yalniz rapor/not uretir.
- Kaptan canli goz onayi olmadan `Showcase Ready / Vitrin Hazir` etiketi verilmez.

## Hatlar

| Hat | Kapsam | Yetki | Cikti |
| --- | --- | --- | --- |
| Lise Uretim Hatti | Once 12. sinif, sonra 9-11 kalite farklari | Kod, test ve dokuman guncelleyebilir | Tek modul cila/rework, test kaniti, dokuman senkronu |
| Ortaokul Audit Hatti | 5-8. sinif | Kod degistirmez | Puan, etiket, must-fix/should-fix notu |
| Ilkokul Audit Hatti | 1-4. sinif | Kod degistirmez | Cocuk dostu anlasilirlik, gorsel kalite ve etkilesim notu |

## Review Workbench Kullanimi

Yerel agda aktif adres genelde:

```text
http://192.168.1.101:3001/review-workbench
```

Port veya IP degisirse ayni rota korunur:

```text
http://<local-ip>:<port>/review-workbench
```

Panelin sol tarafi Kaptan not alanidir:

- `Ilkokul / Ortaokul / Lise` filtresi sinif bandini degistirir.
- Modul kartindaki `Yanda ac` butonu modulu sagdaki canli onizleme icinde acar; inceleme paneli kaybolmaz.
- Tam ekran ikonu modulu yeni sekmede acar.
- `Hizli puan` 1-5 arasi ilk goz puanidir.
- `Hata etiketi` gorsel, matematik, etkilesim, metin veya tasma gibi sorunun tipini isaretler.
- `Oncelik` Kaptan notunun uretim sirasindaki agirligini belirler.
- `Kaptan notu` alanina gorulen problemi dogrudan yazilir.

Panelin sag tarafi uretim yonlendirme alanidir:

- `Canli modul onizleme` secilen modulu iframe icinde gosterir.
- Yenile butonu onizlemeyi taze query ile yeniden yukler.
- `Tek uretim kuyrugu`, Kaptan notlarini oncelige gore otomatik siralar.
- `Kaptan Feedback JSON`, notlari kopyalamak veya indirmek icindir. Codex uretim hatti bu JSON'u must-fix listesine cevirir.

## Kaptan Ne Yapar?

1. `/review-workbench` panelini acar.
2. Sinif bandini secer.
3. Modulu `Yanda ac` ile sag onizlemeye getirir.
4. Modulu ogrenci gozuyle inceler: guzel mi, okunuyor mu, neyle oynanacagi belli mi, teknoloji deger katiyor mu?
5. Puan, hata etiketi, oncelik ve kisa not girer.
6. Gerekirse JSON'u kopyalar veya indirir.

## Codex Ne Yapar?

1. Kaptan notlarini okur.
2. Notlari `Must Fix`, `Should Fix`, `Vitrin Adayi` ve `Cila` sirasina ayirir.
3. Ayni anda yalniz bir modulu kodlar.
4. Modulu Browser/CU/Playwright kanitiyla canli kontrol eder; kullanilan araci rapora yazar.
5. `module:check`, TypeScript, build ve `git diff --check` kapilarini calistirir.
6. Dokumanlari senkronlar.
7. Kaptan onayi gelene kadar modulu `Review Needed / Gorus Gerekli` seviyesinde tutar.

## Uc Sohbet Promptlari

### Lise Uretim Sohbeti

```text
Bu sohbet Dinamik Istasyon LISE uretim hattidir.

Calisma klasoru:
/Users/matnastik/Documents/New project 4/.worktrees/lise

Branch:
codex/lise

Ana hedef:
Lise 9-12. sinif modullerini ogrenci gozuyle canli denetleyip Kaptan standardina gore %95 kaliteye yaklastirmak.

Once project context primer calistir: AGENTS.md, README.md, .agent/CURRENT_TASK.md, PROGRESS.md,
docs/KAPTAN_REVIEW_WORKFLOW.md, docs/MEB_ATOMLARI.md, docs/MODULE_SHOWCASE_READINESS.md,
docs/MODULE_QUALITY_SCORECARD.md ve ilgili module speclerini oku.

Kapsam:
- Sadece 9-12. sinif modullerinde calis.
- Ilk oncelik 12. sinif kalan `Review Needed / Gorus Gerekli` modulleri.
- Vitrin hazir olan modullere Kaptan istemedikce dokunma.
- Kaptan onayi olmayan modul `Showcase Ready / Vitrin Hazir` yapilmayacak.
- Ayni anda tek modul yap.

Kalite referansi:
- 3D Cisimler, Dizi Carki, Polinom Kasasi ve 1. sinif sayi dogrusu sadeligi.
- Buyuk ana oyuncak, az yazi, dogrudan etkilesim, sahnede matematiksel sebep-sonuc.
- Sag panel sadece destek olsun; sahne basrolde olsun.
- Fazla yazi, panel/recete hissi, cevap sizintisi, anlamsiz dekor, tasma ve zayif feedback hard fail.
- Her anlamli ogrenci eylemine gorsel veya kisa AstroBot geri bildirimi gelsin.
- Desktop/kiosk ana hedef; telefon gorunumu ikinci oncelik.

Calisma yontemi:
- Once canli tarayicida ogrenci gibi oyna.
- Ilk 3 saniyede ogrenci ne yapacagini anliyor mu kontrol et.
- Eksikleri kisa raporla.
- Sonra uygula.
- Kaptan kontrol ederken durma; siradaki Kaptan onayi bekleyen veya `Review Needed` lise modulune gecip calismaya devam et.
- Kaptan sadece gorsel onay ve karar gereken yerlerde yorulsun; dogru/yanlis tiklama gibi kontrolleri asistan yapsin.

Her modulde zorunlu canli test:
- Yanlisa tiklayinca uyari/renk/feedback geliyor mu?
- Dogruya tiklayinca ilerleme/basari/yerlesme calisiyor mu?
- Gorev gecisi calisiyor mu?
- Completion ekrani calisiyor mu?
- Tekrar oynama calisiyor mu?
- Ana merkeze donus calisiyor mu?
- Console hatasi var mi?
- Tasma/cakisma var mi?
- Yazi miktari lise seviyesine uygun ve gereksiz uzun degil mi?
- Matematik hedefi ve MEB atomu net mi?

Sinif hedefi:
- 12. sinifta kalan `Review Needed` modulleri Kaptan standardina yaklastir.
- 12. sinif kalan review hattini bitirince net rapor ver: "12. sinif review hattinin kalanlari bitti."
- Sonra 9-11 kalite farklarini sirayla ele al.
- Her sinifta en az 5 kaliteli/vitrin adayi modul standardini koru.

Sunucu/hat kontrolu:
- Tarayicida Lise hatti gorunmeli.
- 3000 portunda yanlislikla ilkokul/ortaokul sunucusu calisiyorsa bunu tespit et, duzelt veya dogru portu Kaptan'a net soyle.
- Yanlis calisma agacinda islem yapma.

Test plani:
- `npm run module:check -- <module-id>`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Canli Browser/CU testi

Showcase kurali:
- Kaptan onayi olmadan hicbir module `Showcase Ready` deme.
- Kaptan "vitrin hazir" derse ancak o zaman ilgili modul vitrin hazir olarak isaretlenebilir.

Ilk is: git durumunu kontrol et, mevcut degisiklikleri anlamadan dokunma. Sonra Lise hattini canli ac, siradaki `Review Needed` lise modulunu ogrenci gibi denetle, eksikleri raporla ve uygula.
```

### Ortaokul Audit Sohbeti

```text
Bu sohbet 5-8. sinif audit hattidir. Kod degistirme, dosya duzenleme, commit yapma.

Once AGENTS.md, docs/KAPTAN_REVIEW_WORKFLOW.md, docs/MODULE_DESIGN_GUIDE.md,
docs/MODULE_SHOWCASE_READINESS.md ve docs/MODULE_QUALITY_SCORECARD.md oku.

5-8. sinif modullerini ogrenci gozuyle incele:
- Ana oyuncak ilk 3 saniyede anlasiliyor mu?
- 3D cisimler kalitesi ve dogrudan manipülasyon hissi var mi?
- Fazla yazi, tasma, karisik dekor veya cevap sizintisi var mi?
- Yanlis deneme pedagojik geri bildirim veriyor mu?

Her modul icin su formatta rapor ver:
Modul, puan 1-5, etiketler, oncelik, Kaptan notu taslagi, onerilen aksiyon.
Kod degistirme.
```

### Ilkokul Audit Sohbeti

```text
Bu sohbet 1-4. sinif audit hattidir. Kod degistirme, dosya duzenleme, commit yapma.

Once AGENTS.md, docs/KAPTAN_REVIEW_WORKFLOW.md, docs/MODULE_DESIGN_GUIDE.md,
docs/MODULE_SHOWCASE_READINESS.md ve docs/MODULE_QUALITY_SCORECARD.md oku.

1-4. sinif modullerini cocuk gozuyle incele:
- Ilk bakista ne yapilacagi belli mi?
- Oyun hissi, renk, hareket ve basari geri bildirimi guclu mu?
- Yazilar az, buyuk ve anlasilir mi?
- Her eylem aninda tepki veriyor mu?
- Sade ama sik mi?

Her modul icin su formatta rapor ver:
Modul, puan 1-5, etiketler, oncelik, Kaptan notu taslagi, onerilen aksiyon.
Kod degistirme.
```

## Uretim Sirasi Kurali

Tek uretim hatti notlari su oncelikle isler:

1. Kaptan `Must Fix`
2. Vitrin adaylari
3. 12. sinif kalan polish
4. 9-11 kalite farklari
5. Ortaokul/Ilkokul cila

Bu sayede Kaptan bir yandan farkli siniflari incelerken, kod degistiren asil hat dosya cakismasi ve kalite dagilmasi olmadan ilerler.
