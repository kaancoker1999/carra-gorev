import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, ArrowLeft, ArrowUp, Check, Circle, CheckCircle2, Loader2,
  Lock, Users, Calendar, Sparkles, ChevronRight, ChevronUp, ChevronDown, MessageSquare, X,
  Wand2, Languages, PencilLine, LogOut, Trash2, Bell,
} from "lucide-react";

/* ---------- tasarım belirteçleri ---------- */
const T = {
  bg: "#EAEDF2", surface: "#FFFFFF", surface2: "#F1F4F9",
  ink: "#1F2530", muted: "#666C77", faint: "#98A0AB", border: "#E0E4EB",
  accent: "#2A67AE", accentBg: "#E7EFFA", accentBorder: "#C1D6EF",
  ai: "#6B5BD6", aiBg: "#EEEBFB", aiBorder: "#D8D2F5",
  green: "#3B7A3B", greenBg: "#E9F1E5",
  amber: "#A9791A", amberBg: "#F4ECDA",
};
const UCOLOR = { baban: "#2F3A56", kaan: "#1E6E63", caglar: "#A9791A", daniel: "#7A3B52", harika: "#4E8055" };
const USERS = {
  baban: { name: "Tuluhan", ini: "T", role: "Yönetici", lang: "tr" },
  kaan: { name: "Kaan", ini: "K", role: "Operasyon", lang: "tr" },
  caglar: { name: "Çağlar", ini: "Ç", role: "Ekip", lang: "tr" },
  daniel: { name: "Daniel", ini: "D", role: "ABD tarafı", lang: "en" },
  harika: { name: "Harika", ini: "H", role: "Ekip", lang: "tr" },
};
const ORDER = ["baban", "kaan", "caglar", "daniel", "harika"];
const LOGIN = { tuluhan: "baban", kaan: "kaan", caglar: "caglar", daniel: "daniel", harika: "harika" };
const PASSWORD = "carra2026";
const PRIO = { dusuk: { c: "#3B9E4B", size: 8 }, orta: { c: "#E0A83A", size: 11 }, yuksek: { c: "#D64545", size: 15 } };

/* ---------- arayüz dilleri ---------- */
const STR = {
  tr: {
    tasks: "Görevler",
    visibleAs: (n, name) => `${name} olarak ${n} görev görünüyor`,
    newTask: "Yeni görev",
    everyone: "Herkes",
    stepsN: (n) => `${n} adım`,
    noTasks: "Bu hesap için görünür görev yok. Başka biriyle giriş yap.",
    all: "Tümü", f_category: "Kategori",
    c_mine: "Kendi görevlerim", c_others: "Başkalarının görevleri", c_progress: "Devam edenler", c_done: "Bitmişler",
    emptyFilter: "Bu filtreye uyan görev yok.",
    emptyStart: "Henüz görev yok. “Yeni görev” ile ilk görevini oluştur.",
    newStepPh: "Yeni adım yaz…",
    forward: "İlet",
    fwdContent: "İletilen içerik", fwdContentPh: "E-postayı veya mesajı buraya yapıştır…",
    fwdInstruction: "Ne yapılsın?", fwdInstructionPh: "Örn: bu müşteriye fiyat teklifi hazırla",
    fwdTarget: "Nereye?", fwdNew: "Yeni görev oluştur", fwdExisting: "Var olan göreve ekle", fwdAdd: "Göreve ekle",
    stepOwner: "Adım sorumlusu",
    st_progress: "Devam ediyor", st_done: "Tamamlandı", st_new: "Yeni",
    createdBy: (name) => `${name} oluşturuyor`,
    title: "Görev başlığı", titlePh: "Kısa ve net bir başlık",
    desc: "Açıklama", descPh: "İşin kapsamını birkaç cümleyle yaz",
    assignTo: "Kim yapacak",
    whoSees: "Kim görecek", visibility: "görünürlük",
    selected: "Seçili kişiler",
    onlySee: (names) => `Sadece ${names} görür.`,
    priority: "Öncelik", low: "Düşük", med: "Orta", high: "Yüksek",
    splitAi: "AI ile adımlara böl",
    cancel: "İptal", create: "Oluştur", preparing: "Adımlar hazırlanıyor…",
    aiSummary: "AI özeti", update: "Güncelle", summaryHint: "Özeti oluşturmak için “Güncelle”ye bas.",
    progress: "İlerleme", stepsProg: (d, n, p) => `${d} / ${n} adım · %${p}`,
    stepsLabel: "Adımlar",
    aiSuggests: "AI öneriyor", add: "Ekle", askStep: "AI'dan yeni adım iste",
    stepOf: (i, n) => `Adım ${i} / ${n}`, doneAt: (s) => `bitti ${s}`,
    completed: "Tamamlandı", complete: "Bitir",
    noMsg: "Henüz mesaj yok. @AI veya bir ekip arkadaşını etiketleyerek başla.",
    aiAssistant: "AI asistan",
    translated: "çevrildi",
    showOrig: (l) => `Orijinali göster (${l})`,
    showTrans: (l) => `Çeviriyi göster (${l})`,
    typing: "yazıyor…",
    w_write: "Benim için yaz", w_improve: "İyileştir",
    w_translate: "İngilizce'ye çevir", w_formal: "Kısalt / resmileştir",
    msgPh: "Mesaj yaz ya da taslağı AI çıkarsın…",
    helpWand: "taslağını senin yerine yazar, mesaj senden gider",
    helpAi: "AI sohbete kendi mesajını atar",
    wandTitle: "Yazmama yardım et", aiBtnTitle: "Sohbete AI mesajı at",
    loggedIn: (name, lang) => `${name} olarak giriş yapıldı · dil: ${lang} · veriler bu oturumda tutulur`,
    langLabel: "Türkçe", logout: "Çıkış",
    notifs: "Bildirimler", noNotifs: "Henüz bildirim yok",
    n_assigned: (name) => `${name} sana bir görev atadı`,
    n_visibility: (name) => `${name} bir görevi seninle paylaştı`,
    n_step: (name) => `${name} sana bir adım atadı`,
  },
  en: {
    tasks: "Tasks",
    visibleAs: (n, name) => `${n} tasks visible as ${name}`,
    newTask: "New task",
    everyone: "Everyone",
    stepsN: (n) => `${n} steps`,
    noTasks: "No visible tasks for this account. Log in as someone else.",
    all: "All", f_category: "Category",
    c_mine: "My tasks", c_others: "Others' tasks", c_progress: "In progress", c_done: "Completed",
    emptyFilter: "No tasks match this filter.",
    emptyStart: "No tasks yet. Create your first one with “New task”.",
    newStepPh: "Write a new step…",
    forward: "Forward",
    fwdContent: "Forwarded content", fwdContentPh: "Paste the email or message here…",
    fwdInstruction: "What should be done?", fwdInstructionPh: "e.g. prepare a quote for this customer",
    fwdTarget: "Where to?", fwdNew: "Create a new task", fwdExisting: "Add to an existing task", fwdAdd: "Add to task",
    stepOwner: "Step owner",
    st_progress: "In progress", st_done: "Completed", st_new: "New",
    createdBy: (name) => `Created by ${name}`,
    title: "Task title", titlePh: "A short, clear title",
    desc: "Description", descPh: "Describe the scope in a couple of sentences",
    assignTo: "Assigned to",
    whoSees: "Who can see", visibility: "visibility",
    selected: "Selected people",
    onlySee: (names) => `Only ${names} can see this.`,
    priority: "Priority", low: "Low", med: "Medium", high: "High",
    splitAi: "Split into steps with AI",
    cancel: "Cancel", create: "Create", preparing: "Preparing steps…",
    aiSummary: "AI summary", update: "Update", summaryHint: "Press “Update” to generate a summary.",
    progress: "Progress", stepsProg: (d, n, p) => `${d} / ${n} steps · ${p}%`,
    stepsLabel: "Steps",
    aiSuggests: "AI suggests", add: "Add", askStep: "Ask AI for a new step",
    stepOf: (i, n) => `Step ${i} / ${n}`, doneAt: (s) => `done ${s}`,
    completed: "Completed", complete: "Complete",
    noMsg: "No messages yet. Start by tagging @AI or a teammate.",
    aiAssistant: "AI assistant",
    translated: "translated",
    showOrig: (l) => `Show original (${l})`,
    showTrans: (l) => `Show translation (${l})`,
    typing: "typing…",
    w_write: "Write for me", w_improve: "Improve",
    w_translate: "Translate to Turkish", w_formal: "Shorten / make formal",
    msgPh: "Type a message or let AI draft it…",
    helpWand: "drafts your message for you, sent as you",
    helpAi: "AI posts its own message to the chat",
    wandTitle: "Help me write", aiBtnTitle: "Post an AI message to the chat",
    loggedIn: (name, lang) => `Signed in as ${name} · language: ${lang} · data is kept for this session`,
    langLabel: "English", logout: "Log out",
    notifs: "Notifications", noNotifs: "No notifications yet",
    n_assigned: (name) => `${name} assigned you a task`,
    n_visibility: (name) => `${name} shared a task with you`,
    n_step: (name) => `${name} assigned you a step`,
  },
};

/* ---------- başlangıç verisi ---------- */
const seed = () => [];

/* ---------- yardımcılar ---------- */
const canSee = (task, uid) =>
  task.creator === uid ||
  task.assignees.includes(uid) ||
  task.visibility === "everyone" ||
  (Array.isArray(task.visibility) && task.visibility.includes(uid)) ||
  task.steps.some((s) => s.assignee === uid);
const stepOwner = (step, task) => step.assignee || task.assignees[0];

const doneCount = (t) => t.steps.filter((s) => s.done).length;
const progress = (t) => (t.steps.length ? Math.round((doneCount(t) / t.steps.length) * 100) : 0);
const statusKey = (t) => {
  const d = doneCount(t);
  if (t.steps.length && d === t.steps.length) return "done";
  if (d > 0 || t.steps.some((s) => s.msgs.length)) return "progress";
  return "new";
};
const MONTHS = { tr: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
const nowStamp = () => { const d = new Date(); return { d: d.getDate(), m: d.getMonth(), hh: d.getHours(), mm: d.getMinutes() }; };
const fmtDate = (o, lang) => (o ? `${o.d} ${MONTHS[lang][o.m]} ${o.y}` : "");
const fmtStamp = (o, lang) => (o ? `${o.d} ${MONTHS[lang][o.m]}, ${String(o.hh).padStart(2, "0")}:${String(o.mm).padStart(2, "0")}` : "");
const base = (val) => (val && typeof val === "object" ? (val.tr || Object.values(val)[0]) : val);

async function callClaude(system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages: [{ role: "user", content: user }] }),
  });
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

async function aiSteps(title, desc, lang) {
  try {
    const langName = lang === "en" ? "İngilizce" : "Türkçe";
    const txt = await callClaude(
      `Sen bir görev planlama asistanısın. Verilen görevi 3-5 somut, sıralı adıma böl. SADECE bir JSON dizisi döndür, örn: ["adım bir","adım iki"]. ${langName} yaz, başka hiçbir şey ekleme.`,
      `Görev: ${title}\nAçıklama: ${desc || "-"}`
    );
    const arr = JSON.parse(txt.replace(/```json|```/g, "").trim());
    if (Array.isArray(arr) && arr.length) return arr.slice(0, 5).map(String);
  } catch (e) {}
  return lang === "en"
    ? ["Gather information and data", "Analyze", "Prepare a draft", "Review and approve"]
    : ["Bilgi ve veri topla", "Analiz et", "Taslağı hazırla", "Kontrol ve onay"];
}

async function aiReply(task, step, history, lang) {
  try {
    const convo = history.map((m) => `${m.author === "ai" ? "AI" : USERS[m.author]?.name || m.author}: ${m.text}`).join("\n");
    const txt = await callClaude(
      `Sen Carra firmasının görev takip sistemindeki AI asistanısın. Kısa (2-4 cümle), net ve yardımcı ol; içinde bulunduğun adımı ilerletmeye çalış. ${lang === "en" ? "İngilizce" : "Türkçe"} yaz. Görev: "${base(task.title)}". Adım: "${base(step.title)}".`,
      `Adımın şimdiye kadarki sohbeti:\n${convo || "(boş)"}\n\nSon mesaja kısa bir yanıt ver.`
    );
    return txt.trim() || (lang === "en" ? "I can help with this step." : "Bu adımda size yardımcı olabilirim.");
  } catch (e) {
    return lang === "en" ? "I couldn't respond just now, but I can help with this step." : "Şu an yanıt veremedim, ama bu adımda size yardımcı olabilirim.";
  }
}

async function aiWrite(mode, draft, task, step, target) {
  const modes = {
    write: "Kullanıcının kaba notunu, bu adım bağlamında gönderilmeye hazır, net ve doğal bir mesaja çevir.",
    improve: "Bu taslağı daha net ve akıcı hale getir, anlamı ve dili koru.",
    translate: `Bu metni doğal, profesyonel ${target === "en" ? "İngilizceye" : "Türkçeye"} çevir.`,
    formal: "Bu metni daha kısa ve daha resmi bir tona getir.",
  };
  try {
    const txt = await callClaude(
      `Sen bir yazı asistanısın. ${modes[mode]} SADECE sonuç metnini döndür; açıklama, etiket veya tırnak ekleme. Görev: "${base(task.title)}". Adım: "${base(step.title)}".`,
      draft.trim() ? draft : "(Kullanıcı henüz bir şey yazmadı. Bu adımda atılabilecek makul, kısa bir başlangıç mesajı yaz.)"
    );
    return txt.trim().replace(/^["']|["']$/g, "");
  } catch (e) {
    return draft;
  }
}

async function aiTranslate(text, target) {
  try {
    const langName = target === "en" ? "İngilizce" : "Türkçe";
    const txt = await callClaude(
      `Sen bir çevirmensin. Verilen mesajı doğal, akıcı ${langName}'ye çevir. @etiketleri ve sayıları koru. SADECE çeviriyi döndür.`,
      text
    );
    return txt.trim();
  } catch (e) {
    return text;
  }
}

/* ---------- küçük bileşenler ---------- */
function Avatar({ uid, size = 30 }) {
  if (uid === "ai")
    return (
      <span style={{ width: size, height: size, borderRadius: "50%", background: T.ai, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Sparkles size={size * 0.5} />
      </span>
    );
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: UCOLOR[uid], color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 600, flexShrink: 0 }}>
      {USERS[uid].ini}
    </span>
  );
}

function StatusPill({ k, L }) {
  const map = { progress: [T.accent, T.accentBg, L.st_progress], done: [T.green, T.greenBg, L.st_done], new: [T.muted, "#E7EAEF", L.st_new] };
  const [c, bg, label] = map[k] || map.new;
  return <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, color: c, background: bg, whiteSpace: "nowrap" }}>{label}</span>;
}

function VisibilityText({ task, L }) {
  if (task.visibility === "everyone")
    return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Users size={14} /> {L.everyone}</span>);
  const names = task.visibility.map((u) => USERS[u].name).join(", ");
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Lock size={14} /> {names}</span>);
}

/* ---------- bildirimler ---------- */
function NotifBell({ me, L, tt, tasks, notifs, onOpenTask, onMarkRead }) {
  const [open, setOpen] = useState(false);
  const mine = notifs.filter((n) => n.to === me);
  const unread = mine.filter((n) => !n.read).length;
  const myLang = USERS[me].lang;
  const label = (n) =>
    n.type === "assigned" ? L.n_assigned(USERS[n.from].name)
    : n.type === "visibility" ? L.n_visibility(USERS[n.from].name)
    : L.n_step(USERS[n.from].name);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} title={L.notifs} style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", border: `1px solid ${T.border}`, background: open ? T.accentBg : T.surface, color: T.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Bell size={17} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, minWidth: 17, height: 17, borderRadius: 9, background: "#D64545", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{unread}</span>
        )}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: 40, zIndex: 20, width: 300, maxWidth: "calc(100vw - 32px)", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: "0 8px 28px rgba(24,34,52,.14)", padding: 6, maxHeight: 340, overflowY: "auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, margin: "6px 8px" }}>{L.notifs}</p>
          {mine.length === 0 && <p style={{ fontSize: 13, color: T.faint, margin: "4px 8px 10px" }}>{L.noNotifs}</p>}
          {mine.map((n) => {
            const task = tasks.find((t) => t.id === n.taskId);
            return (
              <button key={n.id} onClick={() => { onMarkRead(n.id); setOpen(false); if (task) onOpenTask(task.id); }} style={{ display: "flex", gap: 9, width: "100%", padding: 8, border: "none", background: n.read ? "transparent" : T.accentBg, borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2 }}>
                <Avatar uid={n.from} size={26} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, color: T.ink, lineHeight: 1.35 }}>{label(n)}</span>
                  {task && <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: T.accent, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tt(task.title, task.lang)}</span>}
                  <span style={{ display: "block", fontSize: 11, color: T.faint, marginTop: 1 }}>{fmtStamp(n.time, myLang)}</span>
                </span>
                {!n.read && <span style={{ width: 8, height: 8, borderRadius: 4, background: T.accent, flexShrink: 0, marginTop: 5 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- görev listesi ---------- */
function TaskList({ tasks, me, L, tt, onOpen, onNew }) {
  const [pf, setPf] = useState("all");
  const [cf, setCf] = useState("all");
  const myLang = USERS[me].lang;
  const isMine = (t) => t.creator === me || t.assignees.includes(me) || t.steps.some((s) => s.assignee === me);
  const prioLabel = (p) => (p === "dusuk" ? L.low : p === "orta" ? L.med : L.high);

  let list = tasks.filter((t) => canSee(t, me));
  if (pf !== "all") list = list.filter((t) => t.priority === pf);
  if (cf === "mine") list = list.filter(isMine);
  else if (cf === "others") list = list.filter((t) => !isMine(t));
  else if (cf === "progress") list = list.filter((t) => statusKey(t) !== "done");
  else if (cf === "done") list = list.filter((t) => statusKey(t) === "done");

  const renderTask = (t) => {
    const p = PRIO[t.priority] || PRIO.orta;
    return (
      <div key={t.id} onClick={() => onOpen(t.id)} style={card(true)}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <span title={prioLabel(t.priority)} style={{ width: p.size, height: p.size, borderRadius: "50%", background: p.c, flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>{tt(t.title, t.lang)}</span>
          </div>
          <StatusPill k={statusKey(t)} L={L} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12.5, color: T.muted, marginTop: 10 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Avatar uid={t.assignees[0]} size={18} /> {t.assignees.map((a) => USERS[a].name).join(", ")}
          </span>
          <VisibilityText task={t} L={L} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Calendar size={14} /> {fmtDate(t.due, myLang)}</span>
          <span>{doneCount(t)}/{t.steps.length} {L.stepsLabel.toLowerCase()}</span>
        </div>
        <div style={barWrap}><div style={{ ...barFill, width: progress(t) + "%" }} /></div>
      </div>
    );
  };

  const section = (title, items) => (items.length ? (
    <div style={{ marginBottom: 18 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: ".03em", margin: "0 0 8px 2px" }}>{title} <span style={{ color: T.faint, fontWeight: 400 }}>({items.length})</span></p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{items.map(renderTask)}</div>
    </div>
  ) : null);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{L.tasks}</h2>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: T.muted }}>{L.visibleAs(list.length, USERS[me].name)}</p>
        </div>
        <button onClick={onNew} style={btn(T.accent, "#fff")}><Plus size={16} /> {L.newTask}</button>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.muted }}>
          {L.priority}
          <select value={pf} onChange={(e) => setPf(e.target.value)} style={sel}>
            <option value="all">{L.all}</option>
            <option value="yuksek">{L.high}</option>
            <option value="orta">{L.med}</option>
            <option value="dusuk">{L.low}</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.muted }}>
          {L.f_category}
          <select value={cf} onChange={(e) => setCf(e.target.value)} style={sel}>
            <option value="all">{L.all}</option>
            <option value="mine">{L.c_mine}</option>
            <option value="others">{L.c_others}</option>
            <option value="progress">{L.c_progress}</option>
            <option value="done">{L.c_done}</option>
          </select>
        </label>
      </div>

      {list.length === 0 && <div style={{ ...card(false), textAlign: "center", color: T.muted, fontSize: 14 }}>{tasks.some((t) => canSee(t, me)) ? L.emptyFilter : L.emptyStart}</div>}

      {cf === "all" ? (
        <>{section(L.c_mine, list.filter(isMine))}{section(L.c_others, list.filter((t) => !isMine(t)))}</>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{list.map(renderTask)}</div>
      )}
    </div>
  );
}

/* ---------- görev oluştur ---------- */
function CreateTask({ me, L, onCancel, onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignees, setAssignees] = useState([me]);
  const [visMode, setVisMode] = useState("selected");
  const [vis, setVis] = useState([]);
  const [priority, setPriority] = useState("orta");
  const [useAi, setUseAi] = useState(true);
  const [busy, setBusy] = useState(false);
  const myLang = USERS[me].lang;

  const toggle = (arr, set, id) => set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    let steps = [];
    if (useAi) {
      const titles = await aiSteps(title, desc, myLang);
      steps = titles.map((st, i) => ({ id: "s" + i, title: st, done: false, msgs: [], lang: myLang }));
    }
    onCreate({
      id: "t" + Date.now(), creator: me, lang: myLang, assignees: assignees.length ? assignees : [me],
      visibility: visMode === "everyone" ? "everyone" : vis,
      title: title.trim(), desc: desc.trim(), priority, due: { d: 18, m: 6, y: 2026 }, steps,
    });
  };

  const chip = (id, active, onClick) => (
    <button key={id} onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px 5px 6px", borderRadius: 20,
      border: `1px solid ${active ? T.accentBorder : T.border}`, background: active ? T.accentBg : "transparent",
      color: active ? T.accent : T.muted, fontSize: 14, cursor: "pointer",
    }}>
      <Avatar uid={id} size={22} />{USERS[id].name}{active && <Check size={15} />}
    </button>
  );

  return (
    <div style={card(false)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 18, fontWeight: 600 }}><Plus size={20} color={T.accent} /> {L.newTask}</span>
        <span style={{ fontSize: 13, color: T.faint }}>{L.createdBy(USERS[me].name)}</span>
      </div>

      <label style={lbl}>{L.title}</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={L.titlePh} style={inp} />

      <label style={lbl}>{L.desc}</label>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder={L.descPh} style={{ ...inp, resize: "vertical" }} />

      <label style={lbl}>{L.assignTo}</label>
      <div style={chipRow}>{ORDER.map((id) => chip(id, assignees.includes(id), () => toggle(assignees, setAssignees, id)))}</div>

      <label style={lbl}>{L.whoSees} <span style={{ color: T.faint }}>· {L.visibility}</span></label>
      <div style={{ display: "inline-flex", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        {[["selected", L.selected], ["everyone", L.everyone]].map(([v, label]) => (
          <button key={v} onClick={() => setVisMode(v)} style={{
            padding: "7px 16px", fontSize: 14, cursor: "pointer", border: "none",
            background: visMode === v ? T.accentBg : "transparent", color: visMode === v ? T.accent : T.muted,
          }}>{label}</button>
        ))}
      </div>
      {visMode === "selected" && (
        <>
          <div style={chipRow}>{ORDER.filter((id) => !assignees.includes(id)).map((id) => chip(id, vis.includes(id), () => toggle(vis, setVis, id)))}</div>
          <p style={{ fontSize: 12, color: T.faint, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
            <Lock size={13} /> {L.onlySee([me, ...assignees, ...vis].filter((v, i, a) => a.indexOf(v) === i).map((u) => USERS[u].name).join(", "))}
          </p>
        </>
      )}

      <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={lbl}>{L.priority}</label>
          <div style={{ display: "flex", gap: 6 }}>
            {[["dusuk", L.low], ["orta", L.med], ["yuksek", L.high]].map(([k, v]) => (
              <button key={k} onClick={() => setPriority(k)} style={{
                flex: 1, padding: "7px 0", fontSize: 13, borderRadius: 8, cursor: "pointer",
                border: `1px solid ${priority === k ? T.accentBorder : T.border}`,
                background: priority === k ? T.accentBg : "transparent", color: priority === k ? T.accent : T.muted,
              }}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div onClick={() => setUseAi(!useAi)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: T.surface2, borderRadius: 8, marginBottom: 18, cursor: "pointer" }}>
        <Sparkles size={18} color={T.ai} />
        <span style={{ fontSize: 14, flex: 1 }}>{L.splitAi}</span>
        <span style={{ width: 34, height: 19, borderRadius: 10, background: useAi ? T.ai : T.border, position: "relative", transition: "background .15s" }}>
          <span style={{ position: "absolute", top: 2, left: useAi ? 17 : 2, width: 15, height: 15, background: "#fff", borderRadius: "50%", transition: "left .15s" }} />
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <button onClick={onCancel} style={btn("transparent", T.ink, true)}>{L.cancel}</button>
        <button onClick={submit} disabled={busy || !title.trim()} style={{ ...btn(T.accent, "#fff"), opacity: busy || !title.trim() ? 0.55 : 1 }}>
          {busy ? <><Loader2 size={16} className="spin" /> {L.preparing}</> : L.create}
        </button>
      </div>
    </div>
  );
}

/* ---------- görev detayı ---------- */
function TaskDetail({ task, me, L, tt, onBack, onOpenStep, onToggleStep, onAddStep, onRemoveStep, onAssignStep, onMoveStep }) {
  const [summary, setSummary] = useState("");
  const [sumBusy, setSumBusy] = useState(false);
  const [propose, setPropose] = useState(null);
  const [propBusy, setPropBusy] = useState(false);
  const [newStep, setNewStep] = useState("");
  const [pickFor, setPickFor] = useState(null);
  const myLang = USERS[me].lang;
  const active = task.steps.find((s) => !s.done);
  const addManual = () => { if (newStep.trim()) { onAddStep(newStep.trim()); setNewStep(""); } };

  const genSummary = async () => {
    setSumBusy(true);
    try {
      const txt = await callClaude(
        `Sen bir görev takip asistanısın. Görevin adım durumundan yola çıkarak 1-2 cümlelik kısa ${myLang === "en" ? "İngilizce" : "Türkçe"} özet yaz: ne bitti, sırada ne var. Sadece özeti yaz.`,
        `Görev: ${base(task.title)}\nAdımlar:\n${task.steps.map((s) => `- [${s.done ? "bitti" : "bekliyor"}] ${base(s.title)}`).join("\n")}`
      );
      setSummary(txt.trim());
    } catch (e) { setSummary(myLang === "en" ? "Summary couldn't be generated." : "Özet şu an oluşturulamadı."); }
    setSumBusy(false);
  };

  const proposeStep = async () => {
    setPropBusy(true);
    try {
      const txt = await callClaude(
        `Sen bir görev planlama asistanısın. Bu göreve eklenebilecek MANTIKLI TEK bir yeni adım öner (${myLang === "en" ? "İngilizce" : "Türkçe"}). Sadece adımın başlığını yaz, başka hiçbir şey ekleme.`,
        `Görev: ${base(task.title)}\nMevcut adımlar:\n${task.steps.map((s) => "- " + base(s.title)).join("\n")}`
      );
      setPropose(txt.replace(/^["-\s]+|["\s]+$/g, "").split("\n")[0]);
    } catch (e) { setPropose(myLang === "en" ? "Share results with stakeholders" : "Sonuçları paydaşlarla paylaş"); }
    setPropBusy(false);
  };

  return (
    <div style={card(false)}>
      <button onClick={onBack} style={{ ...btn("transparent", T.muted, true), padding: "5px 10px", marginBottom: 14 }}><ArrowLeft size={15} /> {L.tasks}</button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 19, fontWeight: 600 }}>{tt(task.title, task.lang)}</span>
        <StatusPill k={statusKey(task)} L={L} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, color: T.muted, marginBottom: 18 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Avatar uid={task.assignees[0]} size={18} /> {task.assignees.map((a) => USERS[a].name).join(", ")}</span>
        <VisibilityText task={task} L={L} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Calendar size={14} /> {fmtDate(task.due, myLang)}</span>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: T.surface2, borderRadius: 8, marginBottom: 18 }}>
        <Sparkles size={18} color={T.ai} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: T.faint }}>{L.aiSummary}</span>
            <button onClick={genSummary} disabled={sumBusy} style={{ ...btn("transparent", T.ai, true), padding: "3px 9px", fontSize: 12 }}>
              {sumBusy ? <Loader2 size={13} className="spin" /> : L.update}
            </button>
          </div>
          <p style={{ fontSize: 14, margin: "4px 0 0", lineHeight: 1.5, color: summary ? T.ink : T.faint }}>
            {summary || L.summaryHint}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: T.muted, marginBottom: 6 }}>
        <span>{L.progress}</span><span>{L.stepsProg(doneCount(task), task.steps.length, progress(task))}</span>
      </div>
      <div style={barWrap}><div style={{ ...barFill, width: progress(task) + "%" }} /></div>

      <p style={{ fontSize: 13, color: T.muted, margin: "18px 0 10px" }}>{L.stepsLabel}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {task.steps.map((s, i) => {
          const isActive = active && s.id === active.id;
          return (
            <div key={s.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 8,
              border: isActive ? `1px solid ${T.accentBorder}` : "1px solid transparent",
              background: isActive ? T.accentBg : "transparent",
            }}>
              <span onClick={() => onToggleStep(s.id)} style={{ cursor: "pointer", display: "flex" }}>
                {s.done ? <CheckCircle2 size={20} color={T.green} /> : <Circle size={20} color={isActive ? T.accent : T.faint} />}
              </span>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onOpenStep(s.id)}>
                <span style={{ fontSize: 14, color: s.done ? T.faint : isActive ? T.accent : T.ink, textDecoration: s.done ? "line-through" : "none" }}>{i + 1}. {tt(s.title, s.lang || task.lang)}</span>
                {s.msgs.length > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: T.muted, marginLeft: 10 }}>
                    <MessageSquare size={13} /> {s.msgs.length}
                  </span>
                )}
                {s.done && s.completedAt && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: T.green, marginLeft: 10 }}>
                    <Check size={12} /> {fmtStamp(s.completedAt, myLang)}
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <button onClick={() => setPickFor(pickFor === s.id ? null : s.id)} title={L.stepOwner} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", display: "flex" }}>
                  <Avatar uid={stepOwner(s, task)} size={22} />
                </button>
                {pickFor === s.id && (
                  <div style={{ position: "absolute", right: 0, top: 28, zIndex: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 5, boxShadow: "0 6px 20px rgba(24,34,52,.12)", width: 168 }}>
                    {ORDER.map((uid) => (
                      <button key={uid} onClick={() => { onAssignStep(s.id, uid); setPickFor(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 8px", border: "none", background: stepOwner(s, task) === uid ? T.accentBg : "transparent", borderRadius: 7, cursor: "pointer", fontSize: 13.5, color: T.ink, textAlign: "left" }}>
                        <Avatar uid={uid} size={20} /> {USERS[uid].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
                <ChevronUp size={15} color={i === 0 ? T.border : T.faint} style={{ cursor: i === 0 ? "default" : "pointer" }} onClick={() => i > 0 && onMoveStep(s.id, -1)} />
                <ChevronDown size={15} color={i === task.steps.length - 1 ? T.border : T.faint} style={{ cursor: i === task.steps.length - 1 ? "default" : "pointer" }} onClick={() => i < task.steps.length - 1 && onMoveStep(s.id, 1)} />
              </span>
              <Trash2 size={16} color={T.faint} style={{ cursor: "pointer" }} onClick={() => onRemoveStep(s.id)} />
              <ChevronRight size={17} color={T.faint} style={{ cursor: "pointer" }} onClick={() => onOpenStep(s.id)} />
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={newStep} onChange={(e) => setNewStep(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addManual()} placeholder={L.newStepPh} style={{ ...inp, marginBottom: 0, flex: 1 }} />
        <button onClick={addManual} disabled={!newStep.trim()} style={{ ...btn(T.accent, "#fff"), opacity: newStep.trim() ? 1 : 0.5 }}>{L.add}</button>
      </div>

      {propose ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, padding: "10px 12px", background: T.aiBg, border: `1px solid ${T.aiBorder}`, borderRadius: 8 }}>
          <Sparkles size={16} color={T.ai} />
          <span style={{ flex: 1, fontSize: 14 }}>{L.aiSuggests}: <b style={{ fontWeight: 600 }}>{propose}</b></span>
          <button onClick={() => { onAddStep(propose); setPropose(null); }} style={{ ...btn(T.ai, "#fff"), padding: "5px 12px", fontSize: 13 }}>{L.add}</button>
          <button onClick={() => setPropose(null)} style={{ ...btn("transparent", T.muted, true), padding: "5px 8px" }}><X size={15} /></button>
        </div>
      ) : (
        <button onClick={proposeStep} disabled={propBusy} style={{ ...btn("transparent", T.ai, true), marginTop: 12, fontSize: 13 }}>
          {propBusy ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />} {L.askStep}
        </button>
      )}
    </div>
  );
}

/* ---------- adım chat ---------- */
function StepChat({ task, step, me, L, tt, idx, total, onBack, onSend, onToggleDone }) {
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [assistBusy, setAssistBusy] = useState(null);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [step.msgs.length, thinking]);

  const myLang = USERS[me].lang;
  const other = myLang === "tr" ? "en" : "tr";
  const [tr, setTr] = useState({});
  const [orig, setOrig] = useState({});
  const kicked = useRef(new Set());
  useEffect(() => {
    step.msgs.forEach((m, i) => {
      if (!m.lang || m.lang === myLang) return;
      const key = i + ":" + myLang;
      if (kicked.current.has(key)) return;
      kicked.current.add(key);
      aiTranslate(m.text, myLang).then((res) => setTr((c) => ({ ...c, [key]: res })));
    });
  }, [step.msgs.length, me]);

  const runAssist = async (mode) => {
    setAssistBusy(mode);
    const r = await aiWrite(mode, text, task, step, other);
    setText(r);
    setAssistBusy(null);
    setMenuOpen(false);
  };

  const send = async (withAi) => {
    const t = text.trim();
    if (!t && !withAi) return;
    const wantsAi = withAi || /@ai/i.test(t);
    if (t) onSend({ author: me, text: t, time: "•", lang: myLang });
    setText("");
    if (wantsAi) {
      setThinking(true);
      const history = [...step.msgs, ...(t ? [{ author: me, text: t }] : [])];
      const reply = await aiReply(task, step, history, myLang);
      onSend({ author: "ai", text: reply, time: "•", lang: myLang });
      setThinking(false);
    }
  };

  const items = [["write", PencilLine, L.w_write], ["improve", Wand2, L.w_improve], ["translate", Languages, L.w_translate], ["formal", Sparkles, L.w_formal]];

  return (
    <div style={card(false)}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, paddingBottom: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{ ...btn("transparent", T.muted, true), padding: 6 }}><ArrowLeft size={17} /></button>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, color: T.faint }}>{L.stepOf(idx + 1, total)}{step.done && step.completedAt ? ` · ${L.doneAt(fmtStamp(step.completedAt, myLang))}` : ""}</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{tt(step.title, step.lang || task.lang)}</p>
        </div>
        <span title={L.stepOwner} style={{ display: "flex", marginRight: 2 }}><Avatar uid={stepOwner(step, task)} size={24} /></span>
        <button onClick={onToggleDone} style={{ ...btn(step.done ? T.greenBg : "transparent", step.done ? T.green : T.muted, !step.done), padding: "6px 12px", fontSize: 13 }}>
          <Check size={15} /> {step.done ? L.completed : L.complete}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 120 }}>
        {step.msgs.length === 0 && <p style={{ fontSize: 14, color: T.faint, textAlign: "center", padding: "20px 0" }}>{L.noMsg}</p>}
        {step.msgs.map((m, i) => {
          const isAi = m.author === "ai";
          const isOther = m.lang && m.lang !== myLang;
          const key = i + ":" + myLang;
          const showOrig = orig[i];
          const display = isOther && !showOrig ? (tr[key] || (myLang === "en" ? "translating…" : "çeviriliyor…")) : m.text;
          return (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <Avatar uid={m.author} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isAi ? T.ai : T.ink }}>{isAi ? L.aiAssistant : USERS[m.author].name}</span>
                  <span style={{ fontSize: 11, color: T.faint }}>{m.time}</span>
                  {isOther && !showOrig && <span style={{ fontSize: 11, color: T.ai, display: "inline-flex", alignItems: "center", gap: 3 }}><Languages size={11} /> {L.translated}</span>}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.55, background: isAi ? T.aiBg : T.surface2, borderRadius: "2px 12px 12px 12px", padding: "9px 12px", whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: hlMentions(display) }} />
                {isOther && (
                  <button onClick={() => setOrig((o) => ({ ...o, [i]: !o[i] }))}
                    style={{ marginTop: 4, border: "none", background: "transparent", color: T.muted, fontSize: 11.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, padding: 0 }}>
                    <Languages size={11} /> {showOrig ? L.showTrans(myLang.toUpperCase()) : L.showOrig(m.lang.toUpperCase())}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {thinking && (
          <div style={{ display: "flex", gap: 10 }}>
            <Avatar uid="ai" size={30} />
            <div style={{ fontSize: 14, color: T.ai, background: T.aiBg, borderRadius: "2px 12px 12px 12px", padding: "9px 12px", display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Loader2 size={15} className="spin" /> {L.typing}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ position: "relative", marginTop: 16 }}>
        {menuOpen && (
          <div style={{ position: "absolute", bottom: 54, left: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 6, boxShadow: "0 6px 20px rgba(0,0,0,.09)", width: 244, zIndex: 5 }}>
            {items.map(([mode, Icon, label]) => (
              <button key={mode} onClick={() => runAssist(mode)} disabled={!!assistBusy}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", border: "none", background: "transparent", borderRadius: 8, cursor: "pointer", fontSize: 14, color: T.ink, textAlign: "left" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.surface2)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {assistBusy === mode ? <Loader2 size={16} className="spin" color={T.ai} /> : <Icon size={16} color={T.ai} />} {label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, borderRadius: 24, padding: "5px 6px 5px 8px" }}>
          <button onClick={() => setMenuOpen((o) => !o)} title={L.wandTitle}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: menuOpen ? T.aiBg : "transparent", color: T.ai, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            {assistBusy ? <Loader2 size={17} className="spin" /> : <Wand2 size={17} />}
          </button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(false)}
            placeholder={L.msgPh} style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: T.ink }} />
          <button onClick={() => send(true)} title={L.aiBtnTitle} style={{ ...btn(T.aiBg, T.ai, false), padding: "6px 10px", borderRadius: 20, fontSize: 13 }}><Sparkles size={15} /> AI</button>
          <button onClick={() => send(false)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ArrowUp size={18} /></button>
        </div>
        <p style={{ fontSize: 11.5, color: T.faint, margin: "7px 4px 0", display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <Wand2 size={12} /> {L.helpWand}
          <span style={{ margin: "0 2px" }}>·</span>
          <Sparkles size={12} /> {L.helpAi}
        </p>
      </div>
    </div>
  );
}

function hlMentions(text) {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/@(\w+)/g, `<span style="color:${T.accent};font-weight:600">@$1</span>`);
}

/* ---------- giriş ---------- */
function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    const uid = LOGIN[u.toLowerCase().trim()];
    if (uid && p === PASSWORD) { setErr(""); onLogin(uid); }
    else setErr("Kullanıcı adı veya şifre hatalı.");
  };
  return (
    <div style={{ maxWidth: 360, margin: "56px auto 0" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600, color: T.accent }}>Carra<span style={{ color: T.muted, fontWeight: 500 }}> · Görev</span></div>
        <p style={{ fontSize: 13, color: T.muted, margin: "4px 0 0" }}>Görev takip sistemine giriş</p>
      </div>
      <div style={card(false)}>
        <label style={lbl}>Kullanıcı adı</label>
        <input value={u} onChange={(e) => setU(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} style={inp} />
        <label style={lbl}>Şifre</label>
        <input type="password" value={p} onChange={(e) => setP(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" style={{ ...inp, marginBottom: err ? 8 : 16 }} />
        {err && <p style={{ color: "#B23A48", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}
        <button onClick={submit} style={{ ...btn(T.accent, "#fff"), width: "100%", justifyContent: "center", padding: "10px 0" }}>Giriş yap</button>
      </div>
    </div>
  );
}

/* ---------- kök ---------- */
export default function App() {
  const [tasks, setTasks] = useState(seed);
  const [me, setMe] = useState(null);
  const [view, setView] = useState({ name: "list" });
  const [notifs, setNotifs] = useState([]);

  const pushNotifs = (list) => { if (list.length) setNotifs((ns) => [...list.map((n, i) => ({ id: "n" + Date.now() + "_" + i, read: false, time: nowStamp(), ...n })), ...ns]); };
  const notifyTask = (t) => {
    const list = [];
    t.assignees.forEach((u) => { if (u !== t.creator) list.push({ to: u, type: "assigned", from: t.creator, taskId: t.id }); });
    if (Array.isArray(t.visibility)) t.visibility.forEach((u) => { if (u !== t.creator && !t.assignees.includes(u)) list.push({ to: u, type: "visibility", from: t.creator, taskId: t.id }); });
    pushNotifs(list);
  };
  const markRead = (id) => setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const task = useMemo(() => tasks.find((t) => t.id === view.taskId), [tasks, view.taskId]);
  const step = task && view.stepId ? task.steps.find((s) => s.id === view.stepId) : null;

  const viewerLang = me ? USERS[me].lang : "tr";
  const [contentTr, setContentTr] = useState({});
  const contentKicked = useRef(new Set());
  const trKey = (text, src, dst) => `${src}>${dst}:${text}`;
  useEffect(() => {
    if (!me) return;
    const vl = USERS[me].lang;
    const proc = (text, src) => {
      if (typeof text !== "string" || !src || src === vl) return;
      const k = trKey(text, src, vl);
      if (contentKicked.current.has(k)) return;
      contentKicked.current.add(k);
      aiTranslate(text, vl).then((res) => setContentTr((c) => ({ ...c, [k]: res })));
    };
    tasks.forEach((t) => {
      if (!canSee(t, me)) return;
      proc(t.title, t.lang);
      t.steps.forEach((s) => proc(s.title, s.lang || t.lang));
    });
  }, [me, tasks]);
  const tt = (val, src) => {
    if (val && typeof val === "object") return val[viewerLang] || val[src] || Object.values(val)[0];
    if (!val || !src || src === viewerLang) return val;
    return contentTr[trKey(val, src, viewerLang)] || val;
  };

  const updateTask = (id, fn) => setTasks((ts) => ts.map((t) => (t.id === id ? fn(t) : t)));
  const toggleStep = (tid, sid) => updateTask(tid, (t) => ({ ...t, steps: t.steps.map((s) => (s.id === sid ? { ...s, done: !s.done, completedAt: !s.done ? nowStamp() : null } : s)) }));
  const addStep = (tid, title, lang) => updateTask(tid, (t) => ({ ...t, steps: [...t.steps, { id: "s" + Date.now(), title, done: false, msgs: [], lang }] }));
  const removeStep = (tid, sid) => updateTask(tid, (t) => ({ ...t, steps: t.steps.filter((s) => s.id !== sid) }));
  const assignStep = (tid, sid, uid) => {
    updateTask(tid, (t) => ({ ...t, steps: t.steps.map((s) => (s.id === sid ? { ...s, assignee: uid } : s)) }));
    if (uid !== me) pushNotifs([{ to: uid, type: "step", from: me, taskId: tid }]);
  };
  const addMsg = (tid, sid, msg) => updateTask(tid, (t) => ({ ...t, steps: t.steps.map((s) => (s.id === sid ? { ...s, msgs: [...s.msgs, msg] } : s)) }));
  const moveStep = (tid, sid, dir) => updateTask(tid, (t) => {
    const i = t.steps.findIndex((s) => s.id === sid);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= t.steps.length) return t;
    const steps = [...t.steps];
    [steps[i], steps[j]] = [steps[j], steps[i]];
    return { ...t, steps };
  });

  const fontStyle = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');*{box-sizing:border-box}input,textarea,button{font-family:inherit}.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}textarea,input::placeholder{color:${T.faint}}@media (max-width:640px){input,textarea,select{font-size:16px !important}}`;

  if (!me)
    return (
      <div style={{ background: T.bg, minHeight: 640, padding: "18px 16px 40px", fontFamily: "'Inter',-apple-system,system-ui,sans-serif", color: T.ink }}>
        <style>{fontStyle}</style>
        <Login onLogin={setMe} />
      </div>
    );

  const L = STR[USERS[me].lang];

  return (
    <div style={{ background: T.bg, minHeight: 640, padding: "18px 16px 40px", fontFamily: "'Inter',-apple-system,system-ui,sans-serif", color: T.ink }}>
      <style>{fontStyle}</style>

      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 600, color: T.accent, cursor: "pointer" }} onClick={() => setView({ name: "list" })}>
            Carra<span style={{ color: T.muted, fontWeight: 500 }}> · Görev</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Avatar uid={me} size={26} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{USERS[me].name}</span>
            </span>
            <NotifBell me={me} L={L} tt={tt} tasks={tasks} notifs={notifs}
              onOpenTask={(id) => setView({ name: "detail", taskId: id })} onMarkRead={markRead} />
            <button onClick={() => { setMe(null); setView({ name: "list" }); }} style={{ ...btn("transparent", T.muted, true), padding: "6px 12px", fontSize: 13 }}><LogOut size={14} /> {L.logout}</button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.faint, marginBottom: 20 }}>{L.loggedIn(USERS[me].name, L.langLabel)}</div>

        {view.name === "list" && (
          <TaskList tasks={tasks} me={me} L={L} tt={tt}
            onOpen={(id) => setView({ name: "detail", taskId: id })}
            onNew={() => setView({ name: "create" })} />
        )}
        {view.name === "create" && (
          <CreateTask me={me} L={L}
            onCancel={() => setView({ name: "list" })}
            onCreate={(t) => { setTasks((ts) => [t, ...ts]); notifyTask(t); setView({ name: "detail", taskId: t.id }); }} />
        )}
        {view.name === "detail" && task && (
          <TaskDetail task={task} me={me} L={L} tt={tt}
            onBack={() => setView({ name: "list" })}
            onOpenStep={(sid) => setView({ name: "step", taskId: task.id, stepId: sid })}
            onToggleStep={(sid) => toggleStep(task.id, sid)}
            onAddStep={(title) => addStep(task.id, title, USERS[me].lang)}
            onRemoveStep={(sid) => removeStep(task.id, sid)}
            onAssignStep={(sid, uid) => assignStep(task.id, sid, uid)}
            onMoveStep={(sid, dir) => moveStep(task.id, sid, dir)} />
        )}
        {view.name === "step" && task && step && (
          <StepChat task={task} step={step} me={me} L={L} tt={tt}
            idx={task.steps.findIndex((s) => s.id === step.id)} total={task.steps.length}
            onBack={() => setView({ name: "detail", taskId: task.id })}
            onSend={(msg) => addMsg(task.id, step.id, msg)}
            onToggleDone={() => toggleStep(task.id, step.id)} />
        )}
      </div>
    </div>
  );
}

/* ---------- ortak stiller ---------- */
const card = (hover) => ({ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", cursor: hover ? "pointer" : "default", boxShadow: "0 1px 2px rgba(24,34,52,.05), 0 6px 20px rgba(24,34,52,.06)" });
const btn = (bg, color, outline) => ({ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 14, cursor: "pointer", background: bg, color, border: outline ? `1px solid ${T.border}` : "none" });
const lbl = { display: "block", fontSize: 13, color: T.muted, margin: "0 0 6px" };
const inp = { width: "100%", padding: "9px 12px", fontSize: 14, borderRadius: 8, border: `1px solid ${T.border}`, outline: "none", marginBottom: 16, color: T.ink, background: T.surface };
const chipRow = { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 };
const sel = { fontSize: 13, padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: T.ink, cursor: "pointer" };
const barWrap = { height: 6, background: "#E0E4EB", borderRadius: 3, overflow: "hidden" };
const barFill = { height: "100%", background: T.accent, borderRadius: 3, transition: "width .3s" };
