---
type: convention
topic: User Design Preferences for Math Modules
date: 2026-05-01
tags: [product, ux, modules, preferences, visual-design]
---

## Summary
Kullanici, matematik modullerinde tek tip panel deneyimi yerine, her konunun yazilimla daha iyi anlasilmasini saglayan dokunulabilir, sade ve etkileyici mini deneyimler istiyor.

## Context
9. sinif modullerinde ortak laboratuvar paneli, cok sayida kart, fazla konu yigilmasi ve dekoratif ama matematiksel anlami zayif gorseller kullanici tarafindan yetersiz bulundu. Buna karsin 3D silindir/prizma modullerindeki acma-kapama, dondurme, buyutme/kucultme ve 1. sinif modullerindeki basit, oyunlu ve hemen anlasilir akislari guclu referans olarak gosterildi.

## Decision / Finding
- Her modul ilk bakista "neyle oynayacagim?" sorusunu yanitlamali.
- Bir modul tek ana oyuncak/deney etrafinda kurulacak; genis kapsamlar ayrilmis makro modullere bolunecek.
- GameHeader, AstroBot, progress/completion ve QA ortak kalabilir; ana sahne, kontrol dili ve gorsel metafor modulle ozgun olacak.
- Cevap paneli, slider veya cok secenekli kartlar ancak sahnedeki manipulatifi destekliyorsa kullanilacak.
- Tercih edilen etkilesimler: surukle, dondur, ac/kapat, katla/ac, hizala, uste bindir, olcek degistir, hedef iz ile cakistir, kamera/zoom ile incele.
- Gorsel ogeler matematiksel anlam tasimali; rastgele dekoratif kareler, anlamsiz isaretler veya sadece havali gorunen sekiller kullanilmamali.
- Apple Education benzeri sakin, premium, temiz ve okunabilir yuzeyler tercih ediliyor; ancak deney hissi Nintendo tarzi oyunlu ve odullendirici kalmali.

## Rationale
Projenin amaci soru cozdurmek degil, soyut matematik atomunu ekranda gorulebilir ve manipule edilebilir hale getirmek. Kullanici ozellikle 3D geometri modullerinde yazilimin kagitta zor olan acinim, donusum ve inceleme hareketlerini dogrudan deneyime cevirmesini begendi. 1. sinif modullerinin sade ve oyunlu olmasi da ogrencinin bilişsel yukunu azaltan iyi bir ornek.

## Consequences
- 10. ve 11. sinif modulleri tasarlanirken genis "her seyi yapan" moduller yerine dar, guclu ve gorsel olarak ayirt edilebilir deneyler secilecek.
- Her yeni modul planinda once ana manipulative tanimlanacak, sonra kazanimin ona nasil baglandigi yazilacak.
- "Uctan uca test et" denildiginde build, Browser Use gorsel smoke, dogru/yanlis akis, completion, console ve responsive kontrol birlikte calistirilacak.
- Modul tamamlandi denmeden once ilk viewport, orta viewport ve embed gorunumu gorsel olarak denetlenecek.

## References
- `docs/MODULES.md`
- `docs/MODULE_DESIGN_GUIDE.md`
- `.agent/skills/project-visual-e2e-qa/SKILL.md`
