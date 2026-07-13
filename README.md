# Carra Görev

Carra ekibi için görev takip uygulaması. Bu depo iki dosya içerir:

- **carra-gorev-prototip.jsx** — Tıklanabilir React prototipi (tasarım ve davranış referansı). Verileri tarayıcıda/oturumda tutar; kalıcı değildir.
- **carra-gorev-build-prompt.md** — Prototipi gerçek, yayınlanabilir bir uygulamaya (arka uç + veritabanı + gerçek giriş + canlı AI) çevirmek için Claude Code'a verilecek build talimatı.

## Özellikler
Giriş/roller, göreve özel görünürlük, öncelik renkleri + filtre + gruplama, adım ekle/sil/tamamla + tamamlanma zamanı, adım bazında sorumluluk, melez AI (sohbet katılımcısı + yazı asistanı), kullanıcıya göre dil ve çift yönlü çeviri. Uygulama boş (sıfır görev) başlar.

## Gerçek uygulamayı kurmak
1. Bir Anthropic API anahtarı edin.
2. `carra-gorev-build-prompt.md` ve `carra-gorev-prototip.jsx` dosyalarını Claude Code'a verin ve "bu prototipe göre bu build prompt'undaki uygulamayı kur" deyin.
3. Vercel + PostgreSQL (Supabase/Neon) ile deploy edin; ortam değişkenlerini (`DATABASE_URL`, `NEXTAUTH_SECRET`, `ANTHROPIC_API_KEY`) girin.

Ayrıntılar build prompt dosyasındadır.
