# Carra Görev — Gerçek Uygulama Build Prompt

Bu belge, `carra-gorev-prototip.jsx` prototipini **gerçek, yayınlanabilir bir uygulamaya** çevirmek için Claude Code'a verilecek talimattır. Prototip, birebir tasarım ve davranış referansıdır; onu da Claude Code'a ver.

---

## 1. Amaç

Carra ekibi için, giriş yapılan bir görev takip uygulaması. Kullanıcılar görev açar, hiyerarşi/görünürlük kurallarına göre paylaşır, görevleri adımlara böler, her adımı bir kişiye atar, adımların altında hem insanlarla hem bir AI asistanıyla konuşur, ve her kullanıcı her şeyi kendi dilinde görür. **Uygulama sıfır görevle (boş) başlar.**

## 2. Teknoloji (öneri)

- **Next.js (App Router) + TypeScript**, **Vercel**'de yayınlanır.
- **Veritabanı:** PostgreSQL (Supabase veya Neon — ikisi de Vercel ile kolay).
- **ORM:** Prisma.
- **Kimlik doğrulama:** Auth.js (NextAuth) — e-posta/kullanıcı adı + şifre (credentials). Şifreler **bcrypt ile hash'lenir**, asla düz metin saklanmaz.
- **AI:** Anthropic API (`@anthropic-ai/sdk`), tüm çağrılar **sunucu tarafında** yapılır; API anahtarı `ANTHROPIC_API_KEY` ortam değişkeninde tutulur (istemciye asla gitmez).

## 3. Kullanıcılar ve giriş

Başlangıçta 5 kullanıcı (seed):

| Kullanıcı adı | İsim | Rol | Dil |
|---|---|---|---|
| tuluhan | Tuluhan | Yönetici | tr |
| kaan | Kaan | Operasyon | tr |
| caglar | Çağlar | Ekip | tr |
| daniel | Daniel | ABD tarafı | en |
| harika | Harika | Ekip | tr |

- İlk kurulumda her kullanıcı için geçici şifre `carra2026` (bcrypt hash'li). **İlk girişte şifre değiştirme** akışı eklensin.
- Her kullanıcının bir `lang` alanı var (tr/en); arayüz, içerik ve mesajlar bu dile göre gösterilir.
- Kullanıcı yönetimi (yeni kişi ekleme, rol/dil değiştirme) için basit bir admin ekranı (sadece Yönetici rolü).

## 4. Veri modeli

- **User**: id, username (benzersiz), name, passwordHash, role, lang, createdAt.
- **Task**: id, title, description, creatorId, priority (dusuk/orta/yuksek), dueDate, visibility (`everyone` | belirli kullanıcı listesi), lang (oluşturanın dili), createdAt.
- **TaskAssignee**: task ↔ user (çoklu atanan).
- **Step**: id, taskId, order, title, done (bool), completedAt (nullable), assigneeId (nullable — adım sorumlusu), lang, createdAt.
- **Message**: id, stepId, authorId (nullable — AI ise null), authorType (`human` | `ai`), text, lang, createdAt.
- **Translation (cache)**: kaynakMetin/kaynakDil/hedefDil → çeviri. Aynı metni tekrar çevirmemek için (görev başlıkları, adım adları, mesajlar).

## 5. Yetki ve görünürlük kuralları (sunucuda uygulanır)

Bir kullanıcı bir görevi **görebilir** eğer: görevi o açtıysa, VEYA atananlardan biriyse, VEYA bir adımının sorumlusuysa, VEYA görünürlük "herkes"se, VEYA görünürlük listesinde varsa.

- Herkes görev oluşturabilir; oluştururken "kim yapacak" (bir veya çok kişi) ve "kim görecek" (belirli kişiler / herkes) seçilir.
- "Kendi görevlerim": kullanıcının açtığı, atandığı ya da bir adımından sorumlu olduğu görevler.
- **Tüm görünürlük kontrolü API katmanında zorunlu tutulur** — istemciye sadece görebileceği veriler döner.

## 6. Özellikler (prototipe birebir uyacak)

**Görev listesi**
- Her görev kartı: başlığın solunda önceliğe göre renkli ve boyutu orantılı yuvarlak (düşük = küçük yeşil `#3B9E4B`, orta = sarı `#E0A83A`, yüksek = büyük kırmızı `#D64545`), durum rozeti (Yeni / Devam ediyor / Tamamlandı), atanan(lar), görünürlük, termin, adım sayısı, ilerleme çubuğu.
- "Görevler" başlığının altında iki filtre: **Öncelik** (Tümü/Yüksek/Orta/Düşük) ve **Kategori** (Tümü/Kendi görevlerim/Başkalarının görevleri/Devam edenler/Bitmişler).
- Kategori "Tümü"yken görevler "Kendi görevlerim" ve "Başkalarının görevleri" başlıkları altında gruplanır (sayıyla).
- Boş durumda "Henüz görev yok, ilk görevini oluştur" mesajı.

**Görev oluştur**
- Başlık, açıklama, atanan (çoklu), görünürlük (seçili kişiler / herkes), öncelik, "AI ile adımlara böl" seçeneği.
- "AI ile adımlara böl" açıksa, AI görevi 3-5 adıma böler (Anthropic API).

**Görev detayı**
- Başlık, durum, atanan/görünürlük/termin.
- **AI özeti**: adım durumundan 1-2 cümlelik özet (kullanıcının dilinde), "Güncelle" ile yenilenir.
- İlerleme çubuğu (tamamlanan/toplam adım, %).
- **Adımlar** listesi: her adımın durumu (tamamlanınca üstü çizili + yeşil tarih-saat damgası), mesaj sayısı, **adım sorumlusunun avatarı** (tıklayınca kişi seçici açılır ve sorumlu değiştirilir), silme simgesi.
- Adım tamamlanınca `completedAt` o anki tarih/saatle (okuyanın diline göre biçimli) yazılır; geri açılınca silinir.
- Altında **manuel adım ekleme** kutusu (+ Ekle) ve **"AI'dan yeni adım iste"** (öner → Ekle/Vazgeç).

**Adım chat (melez AI)**
- Her adımın altında ayrı sohbet; mesajlar insan veya AI'dan.
- **@AI**: AI sohbete görünür bir mesaj olarak yanıt verir (adımı ilerletir); adım/görev bağlamını bilir.
- **Yazı asistanı** (değnek düğmesi): AI sohbete yazmaz, senin taslağını yazar/iyileştirir/karşı dile çevirir/kısaltır; çıktı senin kutuna gelir, sen gönderirsin. Mesaj senden gider.
- Her adımı "Bitir/Tamamlandı" ile işaretleme.

**Dil ve çeviri (kritik)**
- Her kullanıcı **arayüzü, görev/adım içeriğini, mesajları ve tarihleri kendi dilinde** görür.
- Mesaj/başlık/adım orijinal diliyle saklanır; okuyanın dili farklıysa çeviri gösterilir + "çevrildi" etiketi + "orijinali göster" seçeneği.
- Çeviriler **Translation cache tablosunda** saklanır (aynı metni tekrar çevirme; anlık gösterim). İlk çeviri Anthropic API ile yapılır, sonra cache'ten gelir.
- AI'nın ürettiği içerik (adımlar, chat yanıtı, özet) o an giriş yapan kullanıcının dilinde üretilir.

## 7. AI entegrasyonu (sunucu tarafı)

Tüm çağrılar Anthropic API ile, `ANTHROPIC_API_KEY` env üzerinden. Kullanım alanları:
1. Görevden adım üretimi (3-5 adım, kullanıcı dilinde).
2. Adım chat'inde @AI yanıtı (adım/görev bağlamıyla, kısa).
3. Görev AI özeti.
4. Yazı asistanı (yaz/iyileştir/çevir/kısalt).
5. İçerik/mesaj çevirisi (cache'lenir).

Model olarak güncel bir Claude modeli kullan. Rate limit ve hata durumlarını yönet (başarısızsa orijinal metni göster, çökme yok).

## 8. Tasarım

Prototipteki paleti kullan: mavi aksan `#2A67AE`, açık mavi-gri zemin `#EAEDF2`, beyaz kartlar hafif gölgeyle, mor AI tonu `#6B5BD6`, öncelik yeşil/sarı/kırmızı. Tipografi: arayüz Inter, logo/başlık Fraunces. Mobil uyumlu (tek elle kullanım; öğeler dar ekranda alt alta).

## 9. Yayına alma adımları

1. Yeni bir Git deposu oluştur; Next.js projesini kur.
2. Supabase/Neon'da bir PostgreSQL veritabanı aç; bağlantı adresini al.
3. `.env`: `DATABASE_URL`, `NEXTAUTH_SECRET`, `ANTHROPIC_API_KEY`.
4. Prisma şemasını yaz, migrate et, 5 kullanıcıyı (hash'li `carra2026`) seed et. **Görev seed etme — boş başlasın.**
5. Auth, API rotaları ve ekranları prototipe göre kur.
6. Vercel'e bağla, ortam değişkenlerini Vercel'e gir, deploy et.
7. (İsteğe bağlı) `gorev.carra...` gibi bir alan adı bağla.
8. İlk girişte herkes `carra2026` ile girip şifresini değiştirir.

## 10. Referans

`carra-gorev-prototip.jsx` — bu uygulamanın birebir tasarım ve davranış örneği. Ekran akışları, bileşen düzeni, renkler, metinler ve mantık oradan birebir alınmalı. Prototipteki tek fark: orada veriler tarayıcıda/oturumda, AI istemciden çağrılıyor; gerçek uygulamada veriler veritabanında kalıcı, AI ve yetki sunucuda.

---

**Maliyet notu:** Anthropic API kullanım başına ücretlidir (adım üretimi, chat, çeviri, özet). Vercel ve Supabase/Neon'un ücretsiz katmanları başlangıç için yeterlidir; kullanım arttıkça ücretli plana geçilir.
