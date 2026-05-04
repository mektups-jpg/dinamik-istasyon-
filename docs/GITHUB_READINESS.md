# GitHub Hazırlık Notu

Tarih: 2026-05-04

## Durum

Bu repo GitHub'a bağlıdır:

```text
origin https://github.com/mektups-jpg/dinamik-istasyon-.git
branch main
```

Bu proje `Dinamik İstasyon / Matnastik Laboratuvarı` olarak sınıflandırıldı. Öğrenciye dönük interaktif matematik modülü platformudur; Airtable içerik üretim, AI soru QC veya dizgi otomasyonu değildir.

## Güvenli Commit Paketleri

### Paket A - Sınır ve Git Temizliği

Güvenle commit edilebilir:

- `AUTOMATION_CARD.md`
- `.gitignore`
- `docs/GITHUB_READINESS.md`

Amaç:

- Repo rolünü netleştirmek.
- `.agent` ekran görüntüsü ve AI ara çıktılarının GitHub'a karışmasını önlemek.
- GitHub taşıma/temizlik kararını belgelemek.

### Paket B - 11. Sınıf Modül Üretimi

Kod ve doküman değişiklikleri ayrı commit olmalı:

- `docs/module-specs/11-03-trigonometric-root-hunter.md`
- `docs/module-specs/11-04-exponential-growth-reactor.md`
- `docs/module-specs/11-05-logarithm-inverse-mirror.md`
- `docs/module-specs/11-06-richter-desibel-scale-simulator.md`
- `docs/module-specs/11-09-quadrilateral-decomposition-table.md`
- `docs/module-specs/11-14-correlation-scatter-radar.md`
- `docs/module-specs/11-15-media-correlation-auditor.md`
- ilgili `src/modules/grade11/...` klasörleri
- `src/registry/moduleRegistry.ts`
- `PROGRESS.md`, `docs/MODULES.md`, `docs/ROADMAP.md`, `docs/DEVELOPMENT_QUEUE_10_11.md`

Bu paket büyük ürün değişikliğidir; build ve module guard sonuçlarıyla birlikte commit edilmeli.

### Paket C - Spec Var, Uygulama Yok

`function-composition-ports` şu an eksik:

- Spec var: `docs/module-specs/11-07-function-composition-ports.md`
- Registry kaydı yok.
- Kaynak klasörü yok.

Bu dosya ya backlog/spec-only olarak ayrı commit edilmeli ya da uygulama yazılana kadar bekletilmeli.

### Paket D - Agent Çalışma Notları

Dikkatli ele alınmalı:

- `.agent/CURRENT_TASK.md`
- `.agent/WORKLOG.md`
- `.agent/knowledge/...`

Bu dosyalar ürün kodu değildir. Ekip gerçekten çalışma hafızasını GitHub'da tutmak istiyorsa ayrı commit yapılabilir. Aksi halde ürün commit'ine karıştırılmamalı.

## Kontrol Sonuçları

`npm run build` geçti.

`npm run module:check -- <module-id>` sonuçları:

| Modül | Sonuç |
| --- | --- |
| `trigonometric-root-hunter` | geçti |
| `exponential-growth-reactor` | geçti |
| `logarithm-inverse-mirror` | geçti |
| `richter-desibel-scale-simulator` | geçti |
| `function-composition-ports` | eksik: registry ve kaynak klasörü yok |
| `quadrilateral-decomposition-table` | geçti |
| `correlation-scatter-radar` | geçti |
| `media-correlation-auditor` | geçti |

## Push Öncesi Kural

- `.agent/*.png`, `.agent/*.jpg`, `.agent/*.json`, `.tmp-*` GitHub'a gitmemeli.
- `dist/` ve `node_modules/` GitHub'a gitmemeli.
- Ürün modülleri ile agent çalışma notları aynı commit'e karıştırılmamalı.
- `function-composition-ports` eksik olduğu için tam modül paketi gibi sunulmamalı.
