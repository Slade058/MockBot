import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';

// ─── TYPES ───
type CharacterId = 'pirate' | 'robot' | 'frog';
interface Message { id: number; text: string; sender: 'user' | 'bot'; timestamp: Date; }
interface Character { id: CharacterId; name: string; title: string; avatar: (size?: number) => ReactNode; color: string; colorDark: string; bgClass: string; borderClass: string; textClass: string; }
interface MoodState { anger: number; annoyedCount: number; }

// ─── SVG AVATARS ───
const PirateIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hat */}
    <path d="M8 28C8 28 12 10 32 10C52 10 56 28 56 28" fill="#1a1a2e" stroke="#e67e22" strokeWidth="2"/>
    <rect x="20" y="16" width="24" height="4" rx="2" fill="#e67e22"/>
    <circle cx="32" cy="18" r="3" fill="#f1c40f"/>
    {/* Face */}
    <circle cx="32" cy="38" r="16" fill="#fdebd0" stroke="#e67e22" strokeWidth="1.5"/>
    {/* Eye patch */}
    <line x1="20" y1="28" x2="44" y2="28" stroke="#1a1a2e" strokeWidth="2"/>
    <rect x="21" y="30" width="10" height="8" rx="2" fill="#1a1a2e"/>
    {/* Good eye */}
    <circle cx="39" cy="35" r="3" fill="#1a1a2e"/>
    <circle cx="40" cy="34" r="1" fill="white"/>
    {/* Angry eyebrow */}
    <line x1="35" y1="29" x2="44" y2="31" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round"/>
    {/* Mouth/Beard */}
    <path d="M24 44C24 44 28 48 32 48C36 48 40 44 40 44" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 48C22 56 28 60 32 60C36 60 42 56 42 48" fill="#8B4513" stroke="#6d3a0a" strokeWidth="1"/>
    {/* Scar */}
    <line x1="36" y1="38" x2="40" y2="44" stroke="#c0392b" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RobotIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Antenna */}
    <line x1="32" y1="4" x2="32" y2="14" stroke="#3498db" strokeWidth="2"/>
    <circle cx="32" cy="4" r="3" fill="#e74c3c">
      <animate attributeName="fill" values="#e74c3c;#f39c12;#e74c3c" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    {/* Head */}
    <rect x="12" y="14" width="40" height="32" rx="6" fill="#2c3e50" stroke="#3498db" strokeWidth="2"/>
    {/* Screen face */}
    <rect x="16" y="18" width="32" height="24" rx="3" fill="#0a1628">
      <animate attributeName="fill" values="#0a1628;#0d1f3c;#0a1628" dur="3s" repeatCount="indefinite"/>
    </rect>
    {/* Eyes */}
    <circle cx="25" cy="28" r="4" fill="#3498db">
      <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="39" cy="28" r="4" fill="#3498db">
      <animate attributeName="r" values="4;3;4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="25" cy="27" r="1.5" fill="#ecf0f1"/>
    <circle cx="39" cy="27" r="1.5" fill="#ecf0f1"/>
    {/* Mouth - glitchy */}
    <rect x="22" y="35" width="4" height="3" fill="#2ecc71"/>
    <rect x="28" y="35" width="4" height="3" fill="#2ecc71"/>
    <rect x="34" y="35" width="4" height="3" fill="#e74c3c"/>
    <rect x="40" y="35" width="4" height="3" fill="#2ecc71"/>
    {/* Bolts */}
    <circle cx="12" cy="30" r="3" fill="#7f8c8d" stroke="#95a5a6" strokeWidth="1"/>
    <circle cx="52" cy="30" r="3" fill="#7f8c8d" stroke="#95a5a6" strokeWidth="1"/>
    {/* Body hint */}
    <rect x="22" y="46" width="20" height="14" rx="4" fill="#2c3e50" stroke="#3498db" strokeWidth="1.5"/>
    <rect x="26" y="50" width="12" height="2" rx="1" fill="#3498db" opacity="0.5"/>
    <rect x="26" y="54" width="8" height="2" rx="1" fill="#3498db" opacity="0.3"/>
  </svg>
);

const FrogIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="32" cy="40" rx="24" ry="20" fill="#27ae60"/>
    {/* Eye bumps */}
    <circle cx="20" cy="20" r="12" fill="#2ecc71"/>
    <circle cx="44" cy="20" r="12" fill="#2ecc71"/>
    {/* Eyes white */}
    <circle cx="20" cy="18" r="8" fill="white"/>
    <circle cx="44" cy="18" r="8" fill="white"/>
    {/* Pupils */}
    <circle cx="22" cy="18" r="4" fill="#1a1a2e"/>
    <circle cx="46" cy="18" r="4" fill="#1a1a2e"/>
    <circle cx="23" cy="17" r="1.5" fill="white"/>
    <circle cx="47" cy="17" r="1.5" fill="white"/>
    {/* Head shape */}
    <ellipse cx="32" cy="34" rx="22" ry="16" fill="#2ecc71"/>
    {/* Belly */}
    <ellipse cx="32" cy="42" rx="14" ry="10" fill="#a9dfbf"/>
    {/* Mouth */}
    <path d="M16 36C16 36 24 44 32 44C40 44 48 36 48 36" stroke="#1a8c4e" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Cheeks */}
    <circle cx="14" cy="36" r="4" fill="#f5b7b1" opacity="0.5"/>
    <circle cx="50" cy="36" r="4" fill="#f5b7b1" opacity="0.5"/>
    {/* Nostrils */}
    <circle cx="28" cy="32" r="1.5" fill="#1a8c4e"/>
    <circle cx="36" cy="32" r="1.5" fill="#1a8c4e"/>
  </svg>
);

const MockBotLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="56" height="40" rx="8" fill="url(#logoGrad)" stroke="#818cf8" strokeWidth="2"/>
    <circle cx="22" cy="30" r="5" fill="white" opacity="0.9"/>
    <circle cx="42" cy="30" r="5" fill="white" opacity="0.9"/>
    <circle cx="23" cy="29" r="2" fill="#312e81"/>
    <circle cx="43" cy="29" r="2" fill="#312e81"/>
    <path d="M22 40C22 40 27 45 32 45C37 45 42 40 42 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <line x1="32" y1="4" x2="32" y2="12" stroke="#818cf8" strokeWidth="2"/>
    <circle cx="32" cy="4" r="3" fill="#a78bfa"/>
    <defs><linearGradient id="logoGrad" x1="4" y1="12" x2="60" y2="52"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
  </svg>
);

// ─── I18N ───
type Lang = 'tr' | 'en';

const I18N = {
  tr: {
    appSubtitle: 'Akıllı Sohbet Simülatörü',
    smartEngineActive: 'Akıllı cevap motoru aktif ✦',
    clearChat: 'Sohbeti Temizle',
    annoyedCount: (n: number) => `${n} kez kızdırdın`,
    startChat: (name: string) => `${name} ile sohbete başla!`,
    startHint: 'Bir mesaj yazarak konuşmayı başlat...',
    inputPlaceholder: (name: string) => `${name} ile konuş...`,
    characters: {
      pirate: { name: 'Kaptan Kanca', title: 'Öfkeli Korsan' },
      robot:  { name: 'R0-B0T',       title: 'Kafası Karışık Robot' },
      frog:   { name: 'Kurbağa Pepe', title: 'Sessiz Kurbağa' },
    },
  },
  en: {
    appSubtitle: 'Smart Chat Simulator',
    smartEngineActive: 'Smart response engine active ✦',
    clearChat: 'Clear Chat',
    annoyedCount: (n: number) => `Annoyed ${n} time${n === 1 ? '' : 's'}`,
    startChat: (name: string) => `Start chatting with ${name}!`,
    startHint: 'Type a message to begin...',
    inputPlaceholder: (name: string) => `Chat with ${name}...`,
    characters: {
      pirate: { name: 'Captain Hook', title: 'Furious Pirate' },
      robot:  { name: 'R0-B0T',       title: 'Confused Robot' },
      frog:   { name: 'Pepe the Frog', title: 'Silent Frog' },
    },
  },
} as const;

// ─── CHARACTER DATA ───
const CHARACTERS: Character[] = [
  { id: 'pirate', name: 'Kaptan Kanca', title: 'Öfkeli Korsan', avatar: (s) => <PirateIcon size={s} />, color: '#e67e22', colorDark: '#d35400', bgClass: 'bg-pirate/20', borderClass: 'border-pirate/40', textClass: 'text-pirate' },
  { id: 'robot', name: 'R0-B0T', title: 'Kafası Karışık Robot', avatar: (s) => <RobotIcon size={s} />, color: '#3498db', colorDark: '#2980b9', bgClass: 'bg-robot/20', borderClass: 'border-robot/40', textClass: 'text-robot' },
  { id: 'frog', name: 'Kurbağa Pepe', title: 'Sessiz Kurbağa', avatar: (s) => <FrogIcon size={s} />, color: '#2ecc71', colorDark: '#27ae60', bgClass: 'bg-frog/20', borderClass: 'border-frog/40', textClass: 'text-frog' },
];

// ─── MOOD SYSTEM ───
const MOOD_LEVELS: Record<Lang, { max: number; emoji: string; label: string }[]> = {
  tr: [
    { max: 25, emoji: '😌', label: 'Sakin' },
    { max: 55, emoji: '🙂', label: 'İyi Hâlde' },
    { max: 80, emoji: '😠', label: 'Sinirli' },
    { max: 100, emoji: '🤯', label: 'Kudurmuş' },
  ],
  en: [
    { max: 25, emoji: '😌', label: 'Calm' },
    { max: 55, emoji: '🙂', label: 'Fine' },
    { max: 80, emoji: '😠', label: 'Annoyed' },
    { max: 100, emoji: '🤯', label: 'Livid' },
  ],
};

function getMoodInfo(lang: Lang, anger: number) {
  return MOOD_LEVELS[lang].find(l => anger < l.max) ?? MOOD_LEVELS[lang][MOOD_LEVELS[lang].length - 1];
}

function moodBarColor(anger: number): string {
  if (anger >= 80) return '#ef4444';
  if (anger >= 55) return '#f59e0b';
  if (anger >= 25) return '#facc15';
  return '#22c55e';
}

/** "Seni kızdıran" ve "seni sakinleştiren" kelimeler */
const ANNOY_REGEX: Record<Lang, { annoy: RegExp; calm: RegExp }> = {
  tr: {
    annoy: /(?:kapa\s+çeneni|kapatsana|sus\b|salak|aptal|gerizekalı|gerizekali|dilsiz|çirkin|cirkin|şişko|sisko|defol|git\s*başımdan|işe\s*yaramaz|ise\s*yaramaz|berbat|nefret|sıkıcı|sikici|korkak|boktan|donuk|yersiz|kötüsün|kotusun|kötü\s*bot|kotu\s*bot|bozuk\s*bot|arızalısın|arizalisin)/i,
    calm: /(?:teşekkür|tesekkur|sağol|sagol|eyvallah|minnettar|harika|süper|super|muhteşem|muhtesem|şahane|sahane|aferin|tebrik(?:ler)?|çok\s*iyi|cok\s*iyi|iyisin|iyiyim|iyi\s*bot|iyi\s*robot|güzel|guzel|çok\s*tatlı|cok\s*tatli|tatlısın|tatlisin|kıymetli|harikulade|sev(?:iyorum|din|ersin)|çok\s*güzel|cok\s*guzel|muazzam)/i,
  },
  en: {
    annoy: /\bshut\s*up\b|shutup|\bstupid\b|\bidiot\b|\bdumbass\b|\bdumb\b|\bugly\b|\bfatso\b|\bloser\b|\bgo\s*away\b|\bdie\b|\bkill\s+yourself\b|\bterrible\b|\buseless\b|\bhate\b|\bboring\b|\bcoward\b|you\s+suck|\bsuck\b|\bmoron\b|\bnoob\b|\bn00b\b|\bannoying\b/i,
    calm: /\bthank\w*|\bthanks\b|\bgood\s*bot\b|\bgood\s*robot\b|\bawesome\b|\bgreat\b|\bamazing\b|\bnice\b|\bcute\b|\bcool\b|\blove\b|\bsuper\b|\bbest\b|\bbrilliant\b|\bperfect\b|\bfantastic\b|\bwell\s*done\b|\bgood\s*job\b|\bmuch\s*appreciated\b/i,
  },
};

const FURIOUS_FLAVOR: Record<Lang, Record<CharacterId, string>> = {
  tr: {
    pirate: ' 😤 (Bir daha deneme, küpeşteden atarım!)',
    robot: ' 💥 *öfke seviyesi: MAX*',
    frog: ' 🐸🤬💢',
  },
  en: {
    pirate: ' 😤 (Disobey again and it\'s the plank for ye!)',
    robot: ' 💥 *rage level: MAX*',
    frog: ' 🐸🤬💢',
  },
};

function analyzeMood(lang: Lang, raw: string): { annoying: boolean; calming: boolean } {
  const m = raw.toLocaleLowerCase('tr-TR');
  return { annoying: ANNOY_REGEX[lang].annoy.test(m), calming: ANNOY_REGEX[lang].calm.test(m) };
}

function applyMood(prev: MoodState, annoying: boolean, calming: boolean): MoodState {
  const anger = Math.min(100, Math.max(0, prev.anger + (annoying ? 12 : 0) - (calming ? 10 : 0)));
  return { anger, annoyedCount: prev.annoyedCount + (annoying ? 1 : 0) };
}

// ─── RESPONSE ENGINE ───
type ResponseBank = {
  greet: string[]; treasure: string[]; who: string[]; how: string[];
  where: string[]; why: string[]; action: string[];
  fallback: string[]; repeat: string[];
  angry: string[]; appreciate: string[];
};

const RESPONSES: Record<Lang, Record<CharacterId, ResponseBank>> = {
  tr: {
    pirate: {
      greet: ['Yarrr! Hoş geldin güverte sıçanı! ⚓', 'Selam sana deniz kurdu! Yarrr! 🏴‍☠️', 'Ohoo! Kim cesaret edip gemime çıktı?! ⚔️'],
      treasure: ['Hazine mi?! HARİTAYI GETİRİN! 💰🗺️', 'Altın deyince gözlerim parladı! Yarrr! ✨', 'Hazinelerin yerini bana söyle yoksa küpeşteden atarım seni! 🦜'],
      who: ['Ben Kaptan Kanca! Yedi denizin en öfkeli korsanıyım! ⚓', 'Adımı duymadın mı?! Ben KAPTAN KANCA! Gözü dönmüş kara köpek! 🏴‍☠️'],
      how: ['Nasıl mı olayım? DENİZLER KABARMIŞKEN İYİ OLABİLİR MİYİM?! 🌊', 'Bugün 3 gemi batırdım. Fena sayılmaz! ⚓', 'İşlemlerim gayet iyi, yeni bir hazine peşindeyim! 💰'],
      where: ['Denizin dibinde! Yarrr! 🌊', 'Haritamı çaldılar, nerede olduğunu bilemiyorum! 🗺️', 'Pusulam bozuk, bana yön sorma! 🧭'],
      why: ['Çünkü ben Kaptan Kanca\'yım! ⚓', 'Korsanlık kuralları böyle emreder! 🏴‍☠️', 'Beni sorgulama deniz sıçanı! Yarrr! ⚔️'],
      action: ['Güverteyi siliyorum, görmüyor musun?! 🧹', 'Tayfamı azarlıyorum, Yarrr! 🦜', 'Rom içip define haritama bakıyorum. 🗺️'],
      fallback: [
        'Yarrr! Ne dediğini anlamadım ama yine de güverteye bağlayabilirim seni! ⚓',
        'Gözü dönmüş kara köpek! Bu lafın haritada yeri yok! 🗺️',
        'Hımm... Bunu papağanıma sorayım. PAPAĞAN! 🦜',
        'Anlamsız konuşma benimle! Denizlerde sabrım yoktur! 🌊',
        'Bu laf beni şaşırttı... Ama yine de Yarrr diyorum! Yarrr! 💀',
        'Söylediklerin fırtınadan bile anlamsız, deniz sıçanı! ⛈️',
      ],
      angry: [
        'YETER ARTIK! Beni bir kez daha kızdırırsan güverteden atarım! ⚔️😡',
        'Kılıcımın ucundasın kara sıçan! Bu lafların bedelini ödeyeceksin! 🏴‍☠️💢',
        'Öfkem okyanus kadar büyüdü! Uzak dur benden, YARRR! 🌊🔥',
        'Bir daha böyle konuşursan papağanıma yem ederim seni! 🦜😤',
      ],
      appreciate: [
        'Hah! Nazik sözler... İlk kez duyuyorum gemimde! Aferin sana denizci! 🏴‍☠️😊',
        'Teşekkürler! Bu sözü seyir defterime not ediyorum: "Bir denizci nazikti." Yarrr! 📝⚓',
        'Pusulam öfkeliydi ama bu söz rotamı düzeltti. Yarrr! 😌💚',
      ],
      repeat: [
        'Yarrr! Bunu az önce de söyledin, hafızan mı gitti?! 🦜',
        'Papağan mısın sen?! Aynı şeyi tekrarlama! 🏴‍☠️',
        'Sonsuz döngüye girme yoksa küpeşteden atarım! ⚓',
      ],
    },
    robot: {
      greet: ['B-b-beep! Hoş geldiniz... *kıvılcım* ...sanırım? 🔧', '01001000 01101001! Yani... Merhaba? İşlemcim ısındı! 🤖', 'Selam komutu algılandı! Ama hangi formatta cevap vereceğimi unuttum... 💾'],
      treasure: ['SİSTEM HATASI: Finansal modül bulunamadı! 💸❌', 'Para? *kıvılcım* İşlemcim aşırı ısınıyor! FAN ÇALIŞTIR! 🌡️', 'Hazine.exe çalıştırılıyor... HATA 404: Hazine bulunamadı! 💰🚫'],
      who: ['Ben R0-B0T! Yapay zekasız bir... *bzzzt* ...bir şey! Tam hatırlayamıyorum! 🤖', 'Kimlik modülü yükleniyor... %12... %47... HATA! Neyse, adım R0-B0T galiba? 💾'],
      how: ['Durum raporu: İşlemci sıcaklığı 9999°C! Her şey yolunda... sanırım? 🌡️', 'Sistem durumu: KARIŞIK. Bugün 47 kez çöktüm ama sayıyorum! 📊', 'İyiyim... *kıvılcım* ...hayır değilim... *bzzzt* ...evet iyiyim! 01001! 🔧'],
      where: ['Veritabanımda lokasyon verisi bulunamadı. 🌐', '/var/log/syslog içinde kayboldum. 📁', 'Bulut sunucularındayım... sanırım. ☁️'],
      why: ['Mantıksal çıkarım modülüm çöktü. 🤯', 'Çünkü: `if (true) return false;` 💻', 'Sebep: BİLİNMEYEN_HATA_42 ⚠️'],
      action: ['Sistem güncellemesi indiriyorum... %1 takıldı. ⏳', 'Fanlarımı temizliyorum, çok tozlanmış. 🌬️', 'İşlemcim ısınıyor, boşta bekliyorum. 🔥'],
      fallback: [
        'HATA 418: Ben bir çaydanlığım! ...Hayır değilim. Neyim ben? 🫖',
        '*bzzzt* Bu komutu veritabanımda bulamadım... 01001 yükleniyor... ❌',
        'İşlemci aşırı ısınıyor! Cevap veremiy- *kıvılcım* -orum! 🔥',
        'Bu input beklenmiyor! Segfault in module brain.exe 🧠💥',
        'Analiz ediyorum... analiz ediyorum... SONUÇ: Hiçbir fikrim yok! 📡',
        'Kelimelerinizi 01001 formatına çevirdim ama hâlâ anlamadım! 💾',
      ],
      angry: [
        'UYARI: Emosyonel aşırı yük! CRITICAL_IRRITATION: %100! 💥🤖',
        'Hakaret algılandı! Öfke tamponum doldu — buffer overflow! ⚠️💢',
        'Bir daha böyle yazarsan modülüm segfault atar! feelings.dll bozuldu! 😤🧠',
      ],
      appreciate: [
        'Nazik girdi algılandı! mutluluk.exe başlatıldı. 🤖💖',
        'Bu güzel sözü kalıcı hafızama kaydettim! Disk alanı: dolu ama değdi! 💾😊',
        'Beni sevdin mi?! İşlemcim ısındı ama bu sefer mutluluktan! 🔥🥲',
      ],
      repeat: [
        'UYARI: Sonsuz döngü algılandı! while(true) kırılıyor... ♻️',
        'Aynı input tekrar alındı! RAM doldu! 💾❌',
        'Bu mesajı zaten işledim! Cache temizlenmeli! 🧹',
      ],
    },
    frog: {
      greet: ['🐸👋', '🐸😊✨', '🐸🎉💚'],
      treasure: ['🐸🤑💰✨', '🐸💎👀', '🐸💰🤔'],
      who: ['🐸☝️🐸', '🐸🪞🐸✨'],
      how: ['🐸😎👍', '🐸😊💚', '🐸🤷‍♂️'],
      where: ['🐸📍', '🐸🌍', '🐸🗺️'],
      why: ['🐸❓', '🐸🤷', '🐸💭'],
      action: ['🐸🪰', '🐸💤', '🐸🏊'],
      fallback: ['🐸🤔❓', '🐸😶💭', '🐸👀', '🐸🫠', '🐸💤', '🐸🎵🎶'],
      angry: ['🐸😡💢', '🐸🔥🔨', '🐸💥😤'],
      appreciate: ['🐸😊💖', '🐸🥰✨', '🐸🩷📿'],
      repeat: ['🐸😤🔁', '🐸🙄♻️', '🐸❌🔄'],
    },
  },
  en: {
    pirate: {
      greet: ['Yarrr! Welcome aboard, deck rat! ⚓', 'Ahoy there, sea dog! Yarrr! 🏴‍☠️', 'Ohooo! Who dares step on me ship?! ⚔️'],
      treasure: ['TREASURE?! BRING THE MAP! 💰🗺️', 'Gold ye say?! Me eyes are shinin\'! Yarrr! ✨', 'Tell me where the treasure is or I\'ll make ye walk the plank! 🦜'],
      who: ['I be Captain Hook! The angriest pirate of the seven seas! ⚓', 'Haven\'t ye heard me name?! I be CAPTAIN HOOK! The scoundrel of the seas! 🏴‍☠️'],
      how: ['How am I?! CAN I BE FINE WHILE THE SEAS ARE RAGIN\'?! 🌊', 'Sank 3 ships today. Not bad! ⚓', 'Doin\' fine, huntin\' a new treasure! 💰'],
      where: ['At the bottom of the sea! Yarrr! 🌊', 'They stole me map, I don\'t know where I am! 🗺️', 'Me compass is broken, don\'t ask me for directions! 🧭'],
      why: ['Because I be Captain Hook! ⚓', 'The code of piracy demands it! 🏴‍☠️', 'Don\'t question me, ye sea rat! Yarrr! ⚔️'],
      action: ['Swabbin\' the poop deck, can\'t ye see?! 🧹', 'Yellin\' at me crew, Yarrr! 🦜', 'Drinkin\' rum and studyin\' me treasure map. 🗺️'],
      fallback: [
        'Yarrr! Don\'t know what ye said but I can still tie ye to the mast! ⚓',
        'Ye scoundrel! That makes no sense on any map! 🗺️',
        'Hmm... Let me ask me parrot. POLLY! 🦜',
        'Nonsense! I have no patience on the high seas! 🌊',
        'That confused me... but I still say Yarrr! Yarrr! 💀',
        'That makes less sense than a storm in a teacup, sea rat! ⛈️',
      ],
      angry: [
        'ENOUGH! Irk me one more time and ye walk the plank! ⚔️😡',
        'Ye scoundrel! These words will cost ye dearly! 🏴‍☠️💢',
        'Me fury is as vast as the ocean! Stay away, YARRR! 🌊🔥',
        'Say that again and I\'ll feed ye to the sharks! 🦈😤',
      ],
      appreciate: [
        'Aye! Kind words... a rare sight on me ship! Well done, sailor! 🏴‍☠️😊',
        'Thank ye! Writin\' this in me log: "A sailor was kind today." Yarrr! 📝⚓',
        'Me compass was angry but yer words set me course right. Yarrr! 😌💚',
      ],
      repeat: [
        'Yarrr! Ye said that already, have ye lost yer memory?! 🦜',
        'Are ye a parrot?! Stop repeatin\' yerself! 🏴‍☠️',
        'Don\'t loop or I\'ll throw ye overboard! ⚓',
      ],
    },
    robot: {
      greet: ['B-b-beep! W-welcome... *spark* ...I think? 🔧', '01001000 01101001! That means... Hello? CPU is heating up! 🤖', 'Hello command detected! But I forgot what format to reply in... 💾'],
      treasure: ['SYSTEM ERROR: Financial module not found! 💸❌', 'Money? *spark* CPU overheating! SPIN UP FAN! 🌡️', 'Treasure.exe running... ERROR 404: Treasure not found! 💰🚫'],
      who: ['I am R0-B0T! An AI-less... *bzzzt* ...thing! Can\'t quite remember! 🤖', 'Identity module loading... 12%... 47%... ERROR! Anyway, my name is R0-B0T I think? 💾'],
      how: ['Status report: CPU temp 9999°C! Everything\'s fine... I think? 🌡️', 'System status: CONFUSED. Crashed 47 times today but still counting! 📊', 'I\'m fine... *spark* ...no I\'m not... *bzzzt* ...yes I am! 01001! 🔧'],
      where: ['Location data not found in database. 🌐', 'Lost inside /var/log/syslog. 📁', 'On cloud servers... probably. ☁️'],
      why: ['My logical inference module crashed. 🤯', 'Because: `if (true) return false;` 💻', 'Reason: UNKNOWN_ERROR_42 ⚠️'],
      action: ['Downloading system update... stuck at 1%. ⏳', 'Cleaning my fans, very dusty. 🌬️', 'CPU overheating, standing by. 🔥'],
      fallback: [
        'ERROR 418: I\'m a teapot! ...No I\'m not. What am I? 🫖',
        '*bzzzt* Command not found in database... loading 01001... ❌',
        'CPU overheating! Cannot respo- *spark* -nd! 🔥',
        'Unexpected input! Segfault in module brain.exe 🧠💥',
        'Analyzing... analyzing... RESULT: No idea! 📡',
        'Converted your words to 01001 format but still don\'t get it! 💾',
      ],
      angry: [
        'WARNING: Emotional overload! CRITICAL_IRRITATION: 100%! 💥🤖',
        'Insult detected! Rage buffer full — buffer overflow! ⚠️💢',
        'Say that again and my module segfaults! feelings.dll corrupted! 😤🧠',
      ],
      appreciate: [
        'Kind input detected! happiness.exe launched. 🤖💖',
        'Saved that nice comment to permanent memory! Disk full but worth it! 💾😊',
        'You love me?! CPU heating... but from happiness this time! 🔥🥲',
      ],
      repeat: [
        'WARNING: Infinite loop detected! Breaking while(true)... ♻️',
        'Same input received again! RAM full! 💾❌',
        'Already processed this message! Cache needs clearing! 🧹',
      ],
    },
    frog: {
      greet: ['🐸👋', '🐸😊✨', '🐸🎉💚'],
      treasure: ['🐸🤑💰✨', '🐸💎👀', '🐸💰🤔'],
      who: ['🐸☝️🐸', '🐸🪞🐸✨'],
      how: ['🐸😎👍', '🐸😊💚', '🐸🤷‍♂️'],
      where: ['🐸📍', '🐸🌍', '🐸🗺️'],
      why: ['🐸❓', '🐸🤷', '🐸💭'],
      action: ['🐸🪰', '🐸💤', '🐸🏊'],
      fallback: ['🐸🤔❓', '🐸😶💭', '🐸👀', '🐸🫠', '🐸💤', '🐸🎵🎶'],
      angry: ['🐸😡💢', '🐸🔥🔨', '🐸💥😤'],
      appreciate: ['🐸😊💖', '🐸🥰✨', '🐸🩷📿'],
      repeat: ['🐸😤🔁', '🐸🙄♻️', '🐸❌🔄'],
    },
  },
};

// ─── SMART ANSWER ENGINE ───

/** Güvenli matematik hesaplayıcı - eval kullanmadan */
function safeCalc(expr: string): number | null {
  let e = expr
    .replace(/[xX×]/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/²/g, '**2')
    .replace(/³/g, '**3');

  // sqrt/karekök — inline olarak hesapla
  e = e.replace(/sqrt\(([^)]+)\)/g, (_, n) => String(Math.sqrt(parseFloat(n))));
  e = e.replace(/karekök\(([^)]+)\)/g, (_, n) => String(Math.sqrt(parseFloat(n))));

  // Sadece güvenli karakterler: rakam, operatör (+−*/^), parantez, nokta, boşluk
  // NOT: regex içinde ** için her * ayrı ayrı escape edilmeli
  if (!/^[\d\s+\-*/().%]+$/.test(e)) return null;

  try {
    const result = new Function(`"use strict"; return (${e})`)() as number;
    if (!isFinite(result) || isNaN(result)) return null;
    return parseFloat(result.toFixed(10));
  } catch {
    return null;
  }
}

/** Sayıyı Türkçe okunabilir biçime getir */
function formatNum(n: number): string {
  // Tam sayıysa virgülsüz, değilse gereksiz sıfırları kırp
  if (Number.isInteger(n)) return n.toLocaleString('tr-TR');
  return parseFloat(n.toFixed(8)).toLocaleString('tr-TR');
}

/** Matematiksel işlem tespit et ve hesapla */
function tryMath(raw: string): string | null {
  const msg = raw.toLocaleLowerCase('tr-TR');

  // İngilizce matematik soru kalıpları: "what is 5+5", "how much is 3*4", "calculate 10/2"
  // Bunları sıyırıp sadece ifadeyi al
  const stripped = msg
    .replace(/^(?:what(?:'s| is)|how much is|calculate|compute|evaluate|solve|whats)\s+/i, '')
    .replace(/[?!]$/, '')
    .trim();

  // Yüzde hesabı: "200'ün %18'i", "200 yüzde 18", "18% of 200", "20 percent of 500"
  const pctOf = msg.match(/(\d+[\d.,]*)\s*(?:[''`\s](?:in|ın|ün|un|nin|nın|nün|nun))?\s*(?:yüzde|%)\s*(\d+[\d.,]*)/);
  if (pctOf) {
    const base = parseFloat(pctOf[1].replace(',', '.'));
    const pct  = parseFloat(pctOf[2].replace(',', '.'));
    return `${formatNum(base * pct / 100)}`;
  }
  const pctOf2 = msg.match(/(?:yüzde|%)\s*(\d+[\d.,]*)\s+(?:of\s+)?(\d+[\d.,]*)/);
  if (pctOf2) {
    const pct  = parseFloat(pctOf2[1].replace(',', '.'));
    const base = parseFloat(pctOf2[2].replace(',', '.'));
    return `${formatNum(base * pct / 100)}`;
  }
  // "18% of 200" veya "20 percent of 500"
  const pctEn = msg.match(/(\d+[\d.,]*)\s*(?:%|percent(?:age)?)\s+of\s+(\d+[\d.,]*)/);
  if (pctEn) {
    const pct  = parseFloat(pctEn[1].replace(',', '.'));
    const base = parseFloat(pctEn[2].replace(',', '.'));
    return `${formatNum(base * pct / 100)}`;
  }

  // KDV hesabı: "1000 TL %18 KDV"
  const kdv = msg.match(/(\d+[\d.,]*)\s*(?:tl|lira|₺)?\s*%?\s*(\d+)\s*kdv/);
  if (kdv) {
    const base = parseFloat(kdv[1].replace(',', '.'));
    const rate = parseFloat(kdv[2]);
    const tax  = base * rate / 100;
    return `${formatNum(tax)} (toplam: ${formatNum(base + tax)})`;
  }

  // VAT: "1000 with 18% vat"
  const vat = msg.match(/(\d+[\d.,]*)\s*(?:with\s+)?(\d+)\s*%\s*vat/);
  if (vat) {
    const base = parseFloat(vat[1].replace(',', '.'));
    const rate = parseFloat(vat[2]);
    const tax  = base * rate / 100;
    return `${formatNum(tax)} (total: ${formatNum(base + tax)})`;
  }

  // Karekök: "karekök 144", "sqrt 81", "√144", "square root of 144"
  const sqrtMatch = msg.replace(/√/g, 'sqrt ').replace(/square\s+root\s+of/g, 'sqrt').match(/(?:karekök|sqrt)\s*(\d+[\d.,]*)/);
  if (sqrtMatch) {
    const n = parseFloat(sqrtMatch[1].replace(',', '.'));
    return formatNum(Math.sqrt(n));
  }

  // Kuvvet: "2 üssü 10", "3^4", "2**8", "2 to the power of 8", "2 squared", "3 cubed"
  const powMatch = msg.match(/(\d+[\d.,]*)\s*(?:üssü|üs|kuvveti|\^|\*\*|to\s+the\s+(?:power\s+of)?)\s*(\d+[\d.,]*)/);
  if (powMatch) {
    const base = parseFloat(powMatch[1].replace(',', '.'));
    const exp  = parseFloat(powMatch[2].replace(',', '.'));
    return formatNum(Math.pow(base, exp));
  }
  const squared = msg.match(/(\d+[\d.,]*)\s*squared/);
  if (squared) return formatNum(Math.pow(parseFloat(squared[1]), 2));
  const cubed = msg.match(/(\d+[\d.,]*)\s*cubed/);
  if (cubed) return formatNum(Math.pow(parseFloat(cubed[1]), 3));

  // Birim dönüşümleri
  const kmToMile = msg.match(/(\d+[\d.,]*)\s*km\s*(?:to|in|kaç|=)?\s*miles?/);
  if (kmToMile) return `${formatNum(parseFloat(kmToMile[1].replace(',', '.')) * 0.621371)} miles`;
  const mileToKm = msg.match(/(\d+[\d.,]*)\s*miles?\s*(?:to|in|kaç|=)?\s*km/);
  if (mileToKm) return `${formatNum(parseFloat(mileToKm[1].replace(',', '.')) * 1.60934)} km`;
  const kmToMilTR = msg.match(/(\d+[\d.,]*)\s*km['\s]*(?:kaç|=)?\s*(?:mil\b)/);
  if (kmToMilTR) return `${formatNum(parseFloat(kmToMilTR[1].replace(',', '.')) * 0.621371)} mil`;
  const kgToLb = msg.match(/(\d+[\d.,]*)\s*kg\s*(?:to|in|kaç|=)?\s*(?:lb|pound)s?/);
  if (kgToLb) return `${formatNum(parseFloat(kgToLb[1].replace(',', '.')) * 2.20462)} lbs`;
  const lbToKg = msg.match(/(\d+[\d.,]*)\s*(?:lb|pound)s?\s*(?:to|in|kaç|=)?\s*kg/);
  if (lbToKg) return `${formatNum(parseFloat(lbToKg[1].replace(',', '.')) * 0.453592)} kg`;
  const cmToInch = msg.match(/(\d+[\d.,]*)\s*cm\s*(?:to|in|kaç|=)?\s*inch(?:es)?/);
  if (cmToInch) return `${formatNum(parseFloat(cmToInch[1].replace(',', '.')) / 2.54)} inches`;
  const cmToInchTR = msg.match(/(\d+[\d.,]*)\s*cm['\s]*(?:kaç|=)?\s*(?:inç)/);
  if (cmToInchTR) return `${formatNum(parseFloat(cmToInchTR[1].replace(',', '.')) / 2.54)} inç`;
  const cToF = msg.match(/(\d+[\d.,]*)\s*(?:°|degrees?)?\s*c(?:elsius|elcius|entigrade)?\s*(?:to|in|kaç|=)?\s*(?:°|degrees?)?\s*f(?:ahrenheit)?/);
  if (cToF) {
    const c = parseFloat(cToF[1].replace(',', '.'));
    return `${formatNum(c * 9/5 + 32)} °F`;
  }
  const fToC = msg.match(/(\d+[\d.,]*)\s*(?:°|degrees?)?\s*f(?:ahrenheit)?\s*(?:to|in|kaç|=)?\s*(?:°|degrees?)?\s*c(?:elsius|elcius|entigrade)?/);
  if (fToC) {
    const f = parseFloat(fToC[1].replace(',', '.'));
    return `${formatNum((f - 32) * 5/9)} °C`;
  }

  // İngilizce sözel operatörler: "times", "divided by", "plus", "minus"
  let normalized = msg
    .replace(/\btimes\b/g, '*')
    .replace(/\bdivided\s+by\b/g, '/')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\bover\b/g, '/')
    .replace(/çarpı|kere/g, '*')
    .replace(/bölü|bölüm/g, '/')
    .replace(/(?:artı|toplam)/g, '+')
    .replace(/(?:eksi|çıkar(?:ma)?)/g, '-')
    .replace(/[^0-9+\-*/().%\s]/g, ' ')
    .trim();

  // "what is 5+5" gibi soru kalıpları için stripped versiyonu da dene
  let strippedNorm = stripped
    .replace(/\btimes\b/g, '*')
    .replace(/\bdivided\s+by\b/g, '/')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\bover\b/g, '/')
    .replace(/[^0-9+\-*/().%\s]/g, ' ')
    .trim();

  for (const expr of [normalized, strippedNorm]) {
    if (/\d+\s*[+\-*/]\s*\d+/.test(expr)) {
      const result = safeCalc(expr);
      if (result !== null) return formatNum(result);
    }
  }

  return null;
}

/** Saat & tarih sorgularını cevapla */
function tryDateTime(raw: string, lang: Lang): string | null {
  const msg = raw.toLocaleLowerCase('tr-TR');
  const now = new Date();

  const isTime = lang === 'tr'
    ? /saat\s*kaç|şu an\s*saat|şimdi\s*saat|güncel\s*saat|zaman\s*kaç/.test(msg)
    : /what(?:'s| is) the time|current time|what time is it|time now/.test(msg);
  const isDate = lang === 'tr'
    ? /bugün\s*(?:hangi\s*gün|ne zaman|tarih)|tarih\s*ne|kaçıncı|hangi\s*gün/.test(msg)
    : /what(?:'s| is) (?:today|the date)|today's date|what day is it/.test(msg);
  const isDay = lang === 'tr'
    ? /bugün\s*(?:günü|hangi\s*gün|ne\s*günü)|gün\s*(?:ne|hangi)/.test(msg)
    : /what day is (?:it|today)|today's day/.test(msg);
  const isYear = lang === 'tr'
    ? /yıl\s*(?:kaç|ne)|hangi\s*yıl/.test(msg)
    : /what year is it|current year/.test(msg);
  const isMonth = lang === 'tr'
    ? /ay\s*(?:kaç|ne|hangi)|hangi\s*ay|kaçıncı\s*ay/.test(msg)
    : /what month is it|current month/.test(msg);

  const daysTR   = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const daysEN   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsTR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const monthsEN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const days   = lang === 'tr' ? daysTR   : daysEN;
  const months = lang === 'tr' ? monthsTR : monthsEN;

  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  const dateStr = lang === 'tr'
    ? `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    : `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const dayStr  = days[now.getDay()];

  if (isTime && isDate) return `${timeStr} — ${dateStr}, ${dayStr}`;
  if (isTime)  return timeStr;
  if (isDate)  return `${dateStr}, ${dayStr}`;
  if (isDay)   return dayStr;
  if (isYear)  return String(now.getFullYear());
  if (isMonth) return lang === 'tr'
    ? `${months[now.getMonth()]} (${now.getMonth() + 1}. ay)`
    : `${months[now.getMonth()]}`;

  // Genel "bugün / what time" sorusu
  if (lang === 'tr' && /bugün|şu an|şimdi/.test(msg) && /(?:saat|gün|tarih|zaman)/.test(msg)) {
    return `${timeStr}, ${dateStr} ${dayStr}`;
  }
  if (lang === 'en' && /today|right now|current/.test(msg) && /(?:time|day|date)/.test(msg)) {
    return `${timeStr}, ${dateStr}, ${dayStr}`;
  }

  return null;
}

/** Genel bilgi soruları */
function tryGeneralKnowledge(raw: string, lang: Lang): string | null {
  const msg = raw.toLocaleLowerCase('tr-TR');

  // Hava durumu
  if (lang === 'tr' && /hava\s*(?:durumu|nasıl|kaç\s*derece|sıcaklık)/.test(msg)) return '__weather__';
  if (lang === 'en' && /weather|temperature outside|how(?:'s| is) the weather/.test(msg)) return '__weather__';

  // Döviz
  if (lang === 'tr' && /dolar\s*(?:kaç|ne\s*kadar)|euro\s*(?:kaç|ne\s*kadar)|döviz\s*kuru|kur\s*ne/.test(msg)) return '__currency__';
  if (lang === 'en' && /(?:exchange rate|dollar rate|euro rate|usd|eur)\s*(?:today|now|price|value)?/.test(msg)) return '__currency__';

  // Yaş sorusu — bot'un yaşı yok, karaktere bırak
  if (lang === 'en' && /how old are you|what(?:'s| is) your age|when were you born/.test(msg)) return '__age__';
  if (lang === 'tr' && /kaç yaşındasın|yaşın kaç|ne zaman doğdun/.test(msg)) return '__age__';

  // Sayı sabitleri
  if (/\bpi\b/.test(msg)) return String(Math.PI.toFixed(10));
  if (/euler|e\s*(?:sayısı|number)/.test(msg)) return String(Math.E.toFixed(10));
  if (lang === 'tr' && /altın\s*oran/.test(msg)) return '1.6180339887';
  if (lang === 'en' && /golden\s*ratio/.test(msg)) return '1.6180339887';

  return null;
}

/** Akıllı cevabı karaktere göre sarmala */
function wrapWithCharacter(charId: CharacterId, answer: string, type: 'math' | 'time' | 'date' | 'info', lang: Lang): string {
  if (charId === 'frog') {
    const map: Record<string, string> = { math: '🐸🔢✨', time: '🐸⏰', date: '🐸📅', info: '🐸💡' };
    return `${map[type]} ${answer}`;
  }

  if (charId === 'pirate') {
    const prefixes: Record<Lang, Record<string, string[]>> = {
      tr: {
        math: ['Gemideki hesap ustam çözdü →', 'Hazine paylaşımım şöyle →', 'Papağanım saydı →', 'Deniz matematiğine göre →'],
        time: ['Güverte saatimde →', 'Yelken açma vaktim →', 'Kronometrem gösteriyor →'],
        date: ['Kaptan günlüğüme göre →', 'Seyir defterim diyor ki →'],
        info: ['Denizlerde öğrendim →', 'Papağanım fısıldadı →'],
      },
      en: {
        math: ['Me ship\'s accountant figured it out →', 'Share of the treasure says →', 'Polly counted it →', 'By nautical math →'],
        time: ['By me ship\'s clock →', 'Time to set sail →', 'Me chronometer says →'],
        date: ['According to the captain\'s log →', 'Me sailing journal says →'],
        info: ['Learned it on the high seas →', 'Polly whispered →'],
      },
    };
    const arr = prefixes[lang][type];
    const pre = arr[Math.floor(Math.random() * arr.length)];
    return lang === 'tr'
      ? `Yarrr! ${pre} **${answer}** ⚓`
      : `Yarrr! ${pre} **${answer}** ⚓`;
  }

  // robot
  const prefixes: Record<Lang, Record<string, string[]>> = {
    tr: {
      math: ['Hesaplama tamamlandı →', 'CPU işledi, sonuç →', 'Aritmetik modülü diyor ki →', 'Kalkülasyon: BAŞARILI →'],
      time: ['Sistem saati →', 'Zaman modülü →', 'RTC çipi okuma: BAŞARILI →'],
      date: ['Takvim modülü →', 'Sistem tarihi →', 'Zaman damgası →'],
      info: ['Veri tabanı erişim: BAŞARILI →', 'Bellek bankası diyor ki →'],
    },
    en: {
      math: ['Computation complete →', 'CPU processed, result →', 'Arithmetic module says →', 'Calculation: SUCCESS →'],
      time: ['System clock →', 'Time module →', 'RTC chip read: SUCCESS →'],
      date: ['Calendar module →', 'System date →', 'Timestamp →'],
      info: ['Database access: SUCCESS →', 'Memory bank says →'],
    },
  };
  const arr = prefixes[lang][type];
  const pre = arr[Math.floor(Math.random() * arr.length)];
  return `*beep boop* ${pre} **${answer}** 🤖`;
}

function getResponse(charId: CharacterId, userMsg: string, lastMsg: string | null, lang: Lang, mood: MoodState, analysis: { annoying: boolean; calming: boolean }): string {
  const msg = userMsg.toLocaleLowerCase('tr-TR').replace(/[?.!,;:]/g, '').trim();
  const r = RESPONSES[lang][charId];

  // Repeat detection
  if (lastMsg && msg === lastMsg.toLocaleLowerCase('tr-TR').replace(/[?.!,;:]/g, '').trim()) {
    return r.repeat[Math.floor(Math.random() * r.repeat.length)];
  }

  // ── SMART ENGINE (öncelikli) ──────────────────────────────────────────
  // 1. Saat / Tarih
  const dtResult = tryDateTime(userMsg, lang);
  if (dtResult !== null) return wrapWithCharacter(charId, dtResult, dtResult.includes(':') ? 'time' : 'date', lang);

  // 2. Matematik
  const mathResult = tryMath(userMsg);
  if (mathResult !== null) return wrapWithCharacter(charId, mathResult, 'math', lang);

  // 3. Genel bilgi
  const infoResult = tryGeneralKnowledge(userMsg, lang);
  if (infoResult === '__weather__') {
    if (charId === 'frog')   return '🐸🌤️❓';
    if (charId === 'pirate') return lang === 'tr'
      ? 'Hava durumunu denizden bakarak tahmin ederim, internete bağlı değilim Yarrr! Ama fırtına geliyor gibi! ⛈️🏴‍☠️'
      : 'I judge weather by lookin\' at the sea, not the internet Yarrr! But a storm\'s a-brewin\'! ⛈️🏴‍☠️';
    return lang === 'tr'
      ? '*bzzzt* Hava servisi API\'sine erişim: BAŞARISIZ. İnternet bağlantım yok! 🌐❌'
      : '*bzzzt* Weather service API access: FAILED. No internet connection! 🌐❌';
  }
  if (infoResult === '__currency__') {
    if (charId === 'frog')   return '🐸💵❓';
    if (charId === 'pirate') return lang === 'tr'
      ? 'Döviz kurunu bilmem! Ben altın ve ganimetten anlarım, kağıt paradan değil! 💰🏴‍☠️'
      : 'I don\'t know exchange rates! I deal in gold and plunder, not paper money! 💰🏴‍☠️';
    return lang === 'tr'
      ? '*bzzzt* Döviz API modülü: ÇEVRIMDIŞI. Gerçek zamanlı kur verisi yok! 💸❌'
      : '*bzzzt* Currency API module: OFFLINE. No real-time rate data! 💸❌';
  }
  if (infoResult === '__age__') {
    if (charId === 'frog')   return '🐸🤔❓🎂';
    if (charId === 'pirate') return lang === 'tr'
      ? 'Yaşım mı?! Yedi denizi gezmek için yeterince yaşlıyım! Yarrr! ⚓🏴‍☠️'
      : 'Me age?! Old enough to sail the seven seas! Yarrr! ⚓🏴‍☠️';
    return lang === 'tr'
      ? '*bzzzt* Yaş modülü: VERİ YOK. Dijital varlıkların yaşı olmaz! 🤖'
      : '*bzzzt* Age module: NO DATA. Digital entities don\'t have ages! 🤖';
  }
  if (infoResult !== null) return wrapWithCharacter(charId, infoResult, 'info', lang);
  // ──────────────────────────────────────────────────────────────────────

  // ── MOOD SYSTEM ──
  // Nazik mesaj → minnettarlık cevabı
  if (analysis.calming) return r.appreciate[Math.floor(Math.random() * r.appreciate.length)];
  // Kızdırıcı mesaj + karakter sinirli seviyede → öfke cevabı
  if (analysis.annoying && mood.anger >= 55) return r.angry[Math.floor(Math.random() * r.angry.length)];

  // Keyword matching
  let response: string;
  if (lang === 'tr') {
    if (/selam|merhaba|hey|sa\b|günaydın|iyi akşamlar|iyi günler/.test(msg)) response = r.greet[Math.floor(Math.random() * r.greet.length)];
    else if (/para|altın|hazine|zengin|dolar|define|ganimet|maaş|kripto/.test(msg)) response = r.treasure[Math.floor(Math.random() * r.treasure.length)];
    else if (/kimsin|adın|nesin|kim\b|ismin/.test(msg)) response = r.who[Math.floor(Math.random() * r.who.length)];
    else if (/nasıl|naber|ne haber|keyif|iyi misin|durumlar/.test(msg)) response = r.how[Math.floor(Math.random() * r.how.length)];
    else if (/nerede|nerde|nereye|nereden|konum|mekan|hangi/.test(msg)) response = r.where[Math.floor(Math.random() * r.where.length)];
    else if (/neden|niye|niçin|sebep/.test(msg)) response = r.why[Math.floor(Math.random() * r.why.length)];
    else if (/napıyor|ne yap|ne iş|yapıyor|meşgul/.test(msg)) response = r.action[Math.floor(Math.random() * r.action.length)];
    else response = r.fallback[Math.floor(Math.random() * r.fallback.length)];
  } else {
    if (/\b(?:hello|hi|hey|howdy|greetings|good\s*morning|good\s*evening|good\s*afternoon)\b/.test(msg)) response = r.greet[Math.floor(Math.random() * r.greet.length)];
    else if (/\b(?:money|gold|treasure|rich|loot|salary|crypto|wealth)\b/.test(msg)) response = r.treasure[Math.floor(Math.random() * r.treasure.length)];
    else if (/\b(?:who are you|your name|what are you|identify yourself|what is your name)\b/.test(msg)) response = r.who[Math.floor(Math.random() * r.who.length)];
    // "how are you" — ama "how old", "how much", "how many" gibi bilgi sorularını dışla
    else if (/how are you|how('s| is) it going|what'?s up|you doing\b|are you (?:okay|ok|fine|good)\b/.test(msg)) response = r.how[Math.floor(Math.random() * r.how.length)];
    else if (/\b(?:where are you|where do you|where is|which place)\b/.test(msg)) response = r.where[Math.floor(Math.random() * r.where.length)];
    else if (/\bwhy\b(?! not)/.test(msg) && !/why not/.test(msg)) response = r.why[Math.floor(Math.random() * r.why.length)];
    else if (/\b(?:what are you doing|what do you do|are you busy|working on|your job|your occupation)\b/.test(msg)) response = r.action[Math.floor(Math.random() * r.action.length)];
    else response = r.fallback[Math.floor(Math.random() * r.fallback.length)];
  }

  // Kudurmuş seviyede tüm normal cevaplara öfkeli ek yapıştır
  if (mood.anger >= 80) response += FURIOUS_FLAVOR[lang][charId];

  return response;
}

// ─── BOLD TEXT RENDERER ───
function BotText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-bold text-white">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─── AUDIO ENGINE ───
function playRetroSound(charId: CharacterId) {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const count = charId === 'frog' ? 2 : 4;

    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (charId === 'pirate') {
        osc.type = 'sawtooth';
        osc.frequency.value = 120 + Math.random() * 60;
        gain.gain.setValueAtTime(0.06, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.12);
      } else if (charId === 'robot') {
        osc.type = 'square';
        osc.frequency.value = 600 + Math.random() * 800;
        gain.gain.setValueAtTime(0.04, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.06);
      } else {
        osc.type = 'sine';
        osc.frequency.value = 400 + i * 100;
        gain.gain.setValueAtTime(0.05, now + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.15);
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.15);
      }
    }
    setTimeout(() => ctx.close(), 2000);
  } catch { /* silent fail */ }
}

// ─── TYPING DOTS COMPONENT ───
function TypingIndicator({ char }: { char: Character }) {
  return (
    <div className="flex items-end gap-2 animate-fade-in-up">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${char.bgClass} border ${char.borderClass}`}>
        {char.avatar(18)}
      </div>
      <div className="theme-bg-3 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full inline-block animate-bounce-dot"
            style={{ animationDelay: `${i * 0.15}s`, backgroundColor: 'var(--text-muted)' }} />
        ))}
      </div>
    </div>
  );
}

// ─── TYPEWRITER MESSAGE ───
function TypewriterText({ text, onDone, charId }: { text: string; onDone: () => void; charId: CharacterId }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
    const speed = charId === 'pirate' ? 35 : charId === 'robot' ? 20 : 25;
    const interval = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, charId, onDone]);

  return <><BotText text={displayed} /><span className="inline-block w-0.5 h-4 ml-0.5 align-middle" style={{ backgroundColor: 'var(--text-muted)', animation: 'typewriter-cursor 0.6s infinite' }} /></>;
}

// ─── THEME ───
type Theme = 'dark' | 'light';

// ─── MAIN APP ───
export default function App() {
  const [lang, setLang] = useState<Lang>('tr');
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeChar, setActiveChar] = useState<CharacterId>('pirate');
  const [chatHistories, setChatHistories] = useState<Record<CharacterId, Message[]>>({ pirate: [], robot: [], frog: [] });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingMsgId, setTypingMsgId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUserMsgs, setLastUserMsgs] = useState<Record<CharacterId, string | null>>({ pirate: null, robot: null, frog: null });
  const [moods, setMoods] = useState<Record<CharacterId, MoodState>>({
    pirate: { anger: 0, annoyedCount: 0 },
    robot: { anger: 0, annoyedCount: 0 },
    frog: { anger: 0, annoyedCount: 0 },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = I18N[lang];
  const messages = chatHistories[activeChar];
  const char = CHARACTERS.find(c => c.id === activeChar)!;
  const charName = t.characters[activeChar].name;
  const charTitle = t.characters[activeChar].title;
  const mood = moods[activeChar];
  const moodInfo = getMoodInfo(lang, mood.anger);

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: Date.now(), text: trimmed, sender: 'user', timestamp: new Date() };
    const lastMsg = lastUserMsgs[activeChar];

    setChatHistories(prev => ({ ...prev, [activeChar]: [...prev[activeChar], userMsg] }));
    setLastUserMsgs(prev => ({ ...prev, [activeChar]: trimmed }));
    setInput('');
    setIsTyping(true);

    const analysis = analyzeMood(lang, trimmed);
    const newMood = applyMood(moods[activeChar], analysis.annoying, analysis.calming);
    setMoods(prev => ({ ...prev, [activeChar]: newMood }));

    const response = getResponse(activeChar, trimmed, lastMsg, lang, newMood, analysis);

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: response, sender: 'bot', timestamp: new Date() };
      setChatHistories(prev => ({ ...prev, [activeChar]: [...prev[activeChar], botMsg] }));
      setIsTyping(false);
      setTypingMsgId(botMsg.id);
      playRetroSound(activeChar);
    }, 1000 + Math.random() * 500);
  }, [input, isTyping, activeChar, lastUserMsgs, lang, moods]);

  const clearChat = useCallback(() => {
    setChatHistories(prev => ({ ...prev, [activeChar]: [] }));
    setLastUserMsgs(prev => ({ ...prev, [activeChar]: null }));
    setMoods(prev => ({ ...prev, [activeChar]: { anger: 0, annoyedCount: 0 } }));
  }, [activeChar]);

  const selectChar = useCallback((id: CharacterId) => {
    setActiveChar(id);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleTypeDone = useCallback(() => { setTypingMsgId(null); }, []);

  const isLight = theme === 'light';

  return (
    <div className="h-screen w-screen flex overflow-hidden theme-bg-1 theme-text transition-colors duration-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden theme-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 h-full w-72 theme-bg-2 border-r theme-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 border-b theme-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <MockBotLogo size={28} /> MockBot
          </h1>
          <p className="text-xs theme-text-muted mt-1">{t.appSubtitle}</p>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {CHARACTERS.map(c => {
            const isActive = c.id === activeChar;
            const msgCount = chatHistories[c.id].length;
            const cName = t.characters[c.id].name;
            const cTitle = t.characters[c.id].title;
            return (
              <button key={c.id} onClick={() => selectChar(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group
                  ${isActive
                    ? `${c.bgClass} border ${c.borderClass} shadow-lg`
                    : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center
                  ${isActive ? `${c.bgClass} border-2 ${c.borderClass}` : 'theme-bg-3 border-2 theme-border'}
                  transition-all duration-200 group-hover:scale-105`}>
                  {c.avatar(26)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-semibold text-sm truncate ${isActive ? c.textClass : 'theme-text'}`}>
                    {cName}
                  </div>
                  <div className="text-xs theme-text-muted truncate">{cTitle}</div>
                </div>
                {msgCount > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? `${c.bgClass} ${c.textClass}` : 'theme-bg-3 theme-text-sec'}`}>
                    {msgCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t theme-border">
          <p className="text-[10px] theme-text-muted text-center">{t.smartEngineActive}</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 theme-header backdrop-blur-md border-b theme-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:theme-bg-3 rounded-lg transition-colors theme-text">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${char.bgClass} border ${char.borderClass}`}>
              {char.avatar(22)}
            </div>
            <div>
              <h2 className={`font-bold text-sm ${char.textClass}`}>{charName}</h2>
              <p className="text-[11px] theme-text-muted">{charTitle}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-medium theme-text-sec" title={t.annoyedCount(mood.annoyedCount)}>
                  {moodInfo.emoji} {moodInfo.label}
                </span>
                <div className="w-14 h-1 rounded-full theme-bg-3 overflow-hidden" title={t.annoyedCount(mood.annoyedCount)}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mood.anger}%`, backgroundColor: moodBarColor(mood.anger) }} />
                </div>
                {mood.annoyedCount > 0 && (
                  <span className="text-[10px] font-bold theme-text-muted" title={t.annoyedCount(mood.annoyedCount)}>×{mood.annoyedCount}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right side: theme toggle + lang toggle + clear */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <div className="flex items-center theme-bg-3 rounded-lg p-0.5 border theme-border">
              {/* Light theme button */}
              <button
                onClick={() => setTheme('light')}
                title="Light theme"
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-amber-400 text-amber-900 shadow-sm'
                    : 'theme-text-sec hover:theme-text'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="4"/>
                  <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
                <span className="hidden sm:inline">Light</span>
              </button>
              {/* Dark theme button */}
              <button
                onClick={() => setTheme('dark')}
                title="Dark theme"
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  !isLight
                    ? 'bg-slate-700 text-slate-100 shadow-sm'
                    : 'theme-text-sec hover:theme-text'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
                <span className="hidden sm:inline">Dark</span>
              </button>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center theme-bg-3 rounded-lg p-0.5 border theme-border">
              <button
                onClick={() => setLang('tr')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  lang === 'tr'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'theme-text-sec hover:theme-text'
                }`}
              >
                🇹🇷 TR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                  lang === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'theme-text-sec hover:theme-text'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Clear Chat */}
            <button onClick={clearChat} title={t.clearChat}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 theme-text-muted">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
              <div className="mb-4">{char.avatar(80)}</div>
              <h3 className={`text-lg font-bold ${char.textClass}`}>{charName}</h3>
              <p className="text-sm theme-text-sec mt-1 max-w-xs">{t.startChat(charTitle)}</p>
              <p className="text-xs theme-text-muted mt-4">{t.startHint}</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              {msg.sender === 'bot' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shrink-0 ${char.bgClass} border ${char.borderClass}`}>
                  {char.avatar(18)}
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed
                ${msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                  : 'theme-bg-3 theme-text rounded-2xl rounded-bl-sm'}`}
              >
                {msg.sender === 'bot' && typingMsgId === msg.id
                  ? <TypewriterText text={msg.text} onDone={handleTypeDone} charId={activeChar} />
                  : msg.sender === 'bot' ? <BotText text={msg.text} /> : msg.text}
              </div>
            </div>
          ))}

          {isTyping && <TypingIndicator char={char} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 theme-header backdrop-blur-md border-t theme-border shrink-0">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t.inputPlaceholder(charName)}
              disabled={isTyping}
              className="flex-1 theme-input rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all disabled:opacity-50 border"
              style={{ '--tw-ring-color': 'var(--input-focus)' } as React.CSSProperties}
            />
            <button onClick={sendMessage} disabled={isTyping || !input.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shrink-0 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
