import React, { useEffect, useMemo, useRef, useState } from "react";

const styles = [
  { name: "lyrical", color: "blue", stats: { craft: 5, viral: 1, underground: 4, mainstream: 1 } },
  { name: "sad late-night music", color: "purple", stats: { craft: 2, viral: 3, underground: 3, mainstream: 3 } },
  { name: "cloud rap", color: "pink", stats: { craft: 2, viral: 2, underground: 5, mainstream: 2 } },
  { name: "rage", color: "coral", stats: { craft: 1, viral: 5, underground: 3, mainstream: 4 } },
  { name: "jazz rap", color: "gold", stats: { craft: 5, viral: 1, underground: 5, mainstream: 1 } },
  { name: "melodic", color: "teal", stats: { craft: 2, viral: 4, underground: 1, mainstream: 5 } },
];

const producers = [
  { id: "own", name: "make own beat", price: 0, bonus: { craft: 0, viral: 0, underground: 0, mainstream: 0 }, fixedTier: null, fixedBeatQuality: null },
  { id: "sora", name: "Basement Sora", price: 50, bonus: { craft: 1, viral: 0, underground: 2, mainstream: 0 }, fixedTier: "solid", fixedBeatQuality: 30 },
  { id: "miko", name: "404Miko", price: 150, bonus: { craft: 0, viral: 2, underground: 1, mainstream: 1 }, fixedTier: "fire", fixedBeatQuality: 40 },
  { id: "velvet", name: "Velvet Axis", price: 400, bonus: { craft: 2, viral: 0, underground: 2, mainstream: 0 }, fixedTier: "banger", fixedBeatQuality: 50 },
  { id: "brickwall", name: "DJ Brickwall", price: 1000, bonus: { craft: 0, viral: 3, underground: 0, mainstream: 1 }, fixedTier: "legendary", fixedBeatQuality: 60 },
];

const studios = [
  { name: "Bedroom", cost: 0, setupNeeded: 0, quality: 0, description: "free starter setup" },
  { name: "Garage Setup", cost: 300, setupNeeded: 12, quality: 8, description: "less echo, more hope" },
  { name: "Local Studio", cost: 900, setupNeeded: 25, quality: 17, description: "real booth time" },
  { name: "Pro Studio", cost: 2500, setupNeeded: 45, quality: 28, description: "serious engineer room" },
];

const studioUpgrades = [
  { name: "Pocket Notebook", detail: "bars written in class margins", cost: 50, stat: "lyrics", gain: 5, effect: "+5 Lyrics", helps: "Small boost to writing quality" },
  { name: "Phone Voice Memos", detail: "record ideas before they vanish", cost: 75, stat: "production", gain: 5, effect: "+5 Production", helps: "Tiny recording quality boost" },
  { name: "Starter USB Mic", detail: "not clean, but usable", cost: 150, stat: "production", gain: 10, effect: "+10 Production", helps: "Better recordings at home" },
  { name: "Cheap Sample Pack", detail: "some loops actually hit", cost: 225, stat: "beats", gain: 10, effect: "+10 Beats", helps: "Better own-beat quality" },
  { name: "Foam Panels", detail: "barely stick to the wall", cost: 350, stat: "production", gain: 15, effect: "+15 Production", helps: "Less room echo when recording" },
  { name: "Rhyme Journal Stack", detail: "more pages, fewer excuses", cost: 450, stat: "lyrics", gain: 15, effect: "+15 Lyrics", helps: "More consistent writing" },
  { name: "Basic MIDI Keyboard", detail: "tiny keys, real ideas", cost: 650, stat: "beats", gain: 25, effect: "+25 Beats", helps: "Own beats stop sounding random" },
  { name: "Garage Setup", detail: "less bedroom, more session", cost: 900, stat: "production", gain: 25, studioName: "Garage Setup", effect: "+25 Production + unlock Garage", helps: "+8 studio recording quality" },
  { name: "Better Laptop", detail: "exports without crying", cost: 1200, stat: "production", gain: 30, effect: "+30 Production", helps: "Cleaner recording workflow" },
  { name: "Drum Kit Library", detail: "kicks finally punch", cost: 1800, stat: "beats", gain: 35, effect: "+35 Beats", helps: "Stronger own-beat ceiling" },
  { name: "Studio Monitors", detail: "hear the bad mix clearly", cost: 2500, stat: "production", gain: 40, effect: "+40 Production", helps: "Better engineering and mix quality" },
  { name: "Punchline Study Pack", detail: "wordplay training arc", cost: 3200, stat: "lyrics", gain: 40, effect: "+40 Lyrics", helps: "Higher lyric quality ceiling" },
  { name: "Local Studio Pass", detail: "actual booth time", cost: 5000, stat: "production", gain: 100, studioName: "Local Studio", effect: "+100 Production + unlock Local Studio", helps: "+17 studio recording quality" },
  { name: "Producer Plugin Bundle", detail: "expensive buttons that work", cost: 7500, stat: "beats", gain: 120, effect: "+120 Beats", helps: "Big own-beat quality jump" },
  { name: "Vocal Chain Presets", detail: "less raw, more polished", cost: 10000, stat: "production", gain: 150, effect: "+150 Production", helps: "Major final-quality boost" },
  { name: "Writing Retreat", detail: "focus like the phone died", cost: 14000, stat: "lyrics", gain: 150, effect: "+150 Lyrics", helps: "Huge writing skill boost" },
  { name: "Pro Studio Access", detail: "engineer stops judging", cost: 20000, stat: "production", gain: 250, studioName: "Pro Studio", effect: "+250 Production + unlock Pro Studio", helps: "+28 studio recording quality" },
];

const skills = [
  { id: "perfectionist", name: "Perfectionist", unlockFans: 5000, cost: 2500, text: "+1 writing roll per song" },
  { id: "marketing", name: "Marketing Brain", unlockFans: 10000, cost: 7000, text: "+20% fan gain on releases" },
  { id: "thickSkin", name: "Thick Skin", unlockFans: 1000, cost: 1200, text: "Negative events cause 50% less stress" },
  { id: "plug", name: "Industry Plug", unlockFans: 100000, cost: 35000, text: "+25% label/rich event chance" },
  { id: "beatEar", name: "Beat Ear", unlockFans: 25000, cost: 18000, text: "Better own-beat consistency" },
  { id: "trendsetter", name: "Trendsetter", unlockFans: 50000, cost: 45000, text: "+50% viral moment chance" },
];

const hairOptions = ["Curly Fade", "Short Twists", "High Top", "Waves", "Braids"];
const skinToneOptions = [
  { name: "Light Brown", color: "from-[#a7653c] to-[#6c351e]" },
  { name: "Medium Brown", color: "from-[#8b4a2d] to-[#4b2417]" },
  { name: "Medium Dark", color: "from-[#6b351f] to-[#2b120b]" },
  { name: "Deep Brown", color: "from-[#4a2417] to-[#170806]" },
];
const outfitOptions = ["Plain Hoodie", "Thrift Tee", "Black Hoodie", "Old Jersey", "Purple Jacket", "Puffer Vest"];
const backdropOptions = ["Bedroom Studio", "Neon Alley", "Graffiti Wall", "Rooftop Night", "Small Stage"];
const accessoryOptions = [
  { name: "Gold Glasses", unlockFans: 20 },
  { name: "Silver Studs", unlockFans: 35 },
  { name: "Gold Hoop", unlockFans: 50 },
  { name: "Rope Chain", unlockFans: 100 },
  { name: "Crown Pendant", unlockFans: 250 },
  { name: "Black Watch", unlockFans: 500 },
];

const concepts = [
  "late nights, overthinking, empty streets",
  "trying to be heard through bad wifi and worse confidence",
  "a hook that sounds like it came from a cracked phone screen",
  "quiet flexing over a beat that barely survived export",
  "honest thoughts with cheap headphones and too much ambition",
  "bedroom dreams with the fan buzzing in the background",
  "sad melody, sharp lines, and a chorus that wants attention",
  "old voice memos stitched into something almost legendary",
];

const titlePool = ["Basement Moon", "No Signal", "After Midnight", "Rain Window", "Algorithm Blues", "Cheap Mic Anthem", "Bedroom Static"];
const rivalNames = ["Lil Static", "Yung Eclipse", "Kilo Verse", "Baby Signal", "Manny Mirage", "Nova Redd", "Kid Voltage"];

const sideHustles = [
  { name: "Cashier Shift", money: 50, stress: 6, creativity: 0 },
  { name: "Delivery Driver", money: 80, stress: 10, creativity: 0 },
  { name: "Babysitter", money: 40, stress: 0, creativity: 3 },
  { name: "Corner Store Stock", money: 60, stress: 5, creativity: 0 },
];

const fanMilestones = [
  { value: 50, text: "your first 50. someone you don't know listened to your song" },
  { value: 100, text: "100 fans. people recognize you at the corner store" },
  { value: 500, text: "your song hit 1k plays on soundcloud" },
  { value: 1000, text: "a small blog wrote about you. people are paying attention" },
  { value: 5000, text: "you're getting playlist placements. industry is watching" },
  { value: 10000, text: "10k fans. you can quit your day job" },
  { value: 50000, text: "regional buzz. labels are circling" },
  { value: 100000, text: "you're a known name now" },
  { value: 500000, text: "your face is on magazines" },
  { value: 1000000, text: "you went platinum" },
];

const restPools = {
  small: [
    { text: "A small blog called your sound raw but promising.", fans: 120, money: 25, rep: 6, stress: 2, tone: "good" },
    { text: "A fan DM said your song helped them through a rough night.", fans: 80, money: 0, rep: 5, stress: -4, tone: "good" },
  ],
  mid: [
    { text: "A playlist curator added you to a small underground playlist.", fans: 600, money: 120, rep: 8, stress: 4, tone: "good" },
    { text: "An underground producer said your sound is different.", fans: 250, money: 0, rep: 10, stress: 1, tone: "good" },
  ],
  big: [
    { text: "A smaller artist asked about a feature.", fans: 1800, money: 500, rep: 12, stress: 6, tone: "good" },
    { text: "A niche music page posted you as an artist to watch.", fans: 2400, money: 350, rep: 16, stress: 8, tone: "good" },
  ],
};

let audioContext = null;
let rhythmSchedulerTimeoutId = null;
const SAVE_KEY = "rap-sim-autosave-v1";
const SETTINGS_KEY = "rapSimSettings";
const SAVE_HASH_PREFIX = "rapsave=";

const defaultSettings = {
  masterVolume: 70,
  musicVolume: 60,
  sfxVolume: 80,
  mute: false,
  timingOffset: 0,
  autosave: true,
  uiScale: 1,
  reduceMotion: false,
  showFps: false,
  colorblindMode: false,
  highContrastText: false,
};

function encodeSaveData(save) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(save))));
  } catch (error) {
    return "";
  }
}

function decodeSaveData(text) {
  try {
    const cleaned = text.includes(SAVE_HASH_PREFIX) ? text.split(SAVE_HASH_PREFIX)[1] : text;
    return JSON.parse(decodeURIComponent(escape(atob(cleaned.trim()))));
  } catch (error) {
    return null;
  }
}

function playTone(kind = "click", settingsOverride = null) {
  const settings = settingsOverride || (typeof window !== "undefined" && window.__rapSimSettings) || defaultSettings;
  if (settings.mute || settings.masterVolume <= 0 || settings.sfxVolume <= 0) return;
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
    if (!AudioContextClass) return;
    audioContext = audioContext || new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const sounds = {
      click: [420, 520, 0.035, 0.055],
      ping: [660, 880, 0.05, 0.11],
      success: [520, 980, 0.065, 0.16],
      soft: [360, 460, 0.035, 0.12],
    };
    const [start, end, volume, time] = sounds[kind] || sounds.click;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + time);
    gain.gain.setValueAtTime(volume * (settings.masterVolume / 100) * (settings.sfxVolume / 100), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + time);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + time + 0.02);
  } catch (error) {}
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getEffectiveSkill(skill) {
  return Math.log10(skill + 10) * 20;
}

function getCreativityMultiplier(creativity) {
  return 0.3 + (creativity / 100) * 0.7;
}

function getQualityTier(value) {
  if (value < 15) return "trash";
  if (value < 25) return "mid";
  if (value < 35) return "solid";
  if (value < 45) return "fire";
  if (value < 55) return "banger";
  return "legendary";
}

function artistStatCost(value) {
  return Math.floor(50 + Math.pow(value, 1.7) * 8);
}

function artistStatGain(cost) {
  if (cost < 500) return 10;
  if (cost < 5000) return 30;
  return 100;
}

function predictOwnBeatValue(player) {
  return getEffectiveSkill(player.skills.beats) * getCreativityMultiplier(player.creativity);
}

function predictOwnBeatQuality(player) {
  return getQualityTier(predictOwnBeatValue(player));
}

function beatTierForProducer(producer, player) {
  return producer.id === "own" ? predictOwnBeatQuality(player) : producer.fixedTier;
}

function beatQualityForProducer(producer, player) {
  return producer.id === "own" ? Math.round(predictOwnBeatValue(player)) : producer.fixedBeatQuality;
}

function calculateDraftQuality({ lyricsSkill, beatsSkill, creativity, producer }) {
  const multiplier = getCreativityMultiplier(creativity);
  const lyricQuality = getEffectiveSkill(lyricsSkill) * multiplier;
  const player = { skills: { beats: beatsSkill }, creativity };
  const beatQuality = beatQualityForProducer(producer, player);
  return {
    lyricQuality,
    beatQuality,
    beatTier: beatTierForProducer(producer, player),
    draftQuality: (lyricQuality + beatQuality) / 2,
  };
}

function calculateFinalSongQuality({ draftQuality, productionSkill, stress, studioQuality, recordingMultiplier = 1 }) {
  const recordingQuality = (1 + studioQuality / 100) * (1 - stress / 200) * recordingMultiplier;
  const productionMultiplier = getEffectiveSkill(productionSkill) / 50 + 0.5;
  return draftQuality * recordingQuality * productionMultiplier;
}

function useAnimatedNumber(value, duration = 500) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  useEffect(() => {
    const start = previous.current;
    const end = value;
    const startTime = performance.now();
    let frame;
    function tick(now) {
      const progress = clamp((now - startTime) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else previous.current = end;
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return display;
}

function Button({ children, onClick, className = "", disabled = false, tone = "click", onMouseEnter, onMouseLeave, title }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(event) => {
        if (disabled) return;
        playTone(tone);
        onClick?.(event);
      }}
      className={cx("transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(34,211,238,.12)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:shadow-none", className)}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={cx("rounded-[1.75rem] border border-cyan-100/10 bg-[#08111f]/90 shadow-[0_24px_80px_rgba(0,0,0,.35)] ring-1 ring-white/[0.03] backdrop-blur-xl", className)}>{children}</div>;
}

function IconBubble({ label, color = "teal" }) {
  const colorMap = {
    teal: "bg-cyan-400/15 text-cyan-300 border-cyan-300/30",
    pink: "bg-pink-400/15 text-pink-300 border-pink-300/30",
    purple: "bg-violet-400/15 text-violet-300 border-violet-300/30",
    gold: "bg-amber-400/15 text-amber-300 border-amber-300/30",
    coral: "bg-rose-400/15 text-rose-300 border-rose-300/30",
    lime: "bg-lime-400/15 text-lime-300 border-lime-300/30",
    blue: "bg-blue-400/15 text-blue-300 border-blue-300/30",
    gray: "bg-zinc-400/10 text-zinc-300 border-zinc-300/20",
  };
  return <span className={cx("inline-flex h-9 w-9 items-center justify-center rounded-2xl border text-sm font-black", colorMap[color] || colorMap.teal)}>{label}</span>;
}

function SectionTitle({ title, right }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.7)]" /><h3 className="text-xs font-black uppercase tracking-[0.22em] text-zinc-200">{title}</h3></div>
      {right ? <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-bold text-zinc-500">{right}</div> : null}
    </div>
  );
}

function StatBar({ label, value, color = "teal", icon, hint, max = 100 }) {
  const animated = useAnimatedNumber(value, 500);
  const colorMap = {
    teal: "bg-cyan-300", pink: "bg-pink-400", purple: "bg-violet-400", gold: "bg-amber-300", coral: "bg-rose-400", lime: "bg-lime-300", blue: "bg-blue-400",
  };
  const width = max ? `${clamp((animated / max) * 100, 0, 100)}%` : `${clamp(animated % 100, 0, 100)}%`;
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-zinc-200"><IconBubble label={icon} color={color} /><span className="font-semibold">{label}</span></div>
        <div className="text-xs text-zinc-400"><span className="font-black text-white">{Math.round(animated).toLocaleString()}</span>{max ? `/${max}` : ""}</div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={cx("h-full rounded-full transition-all duration-500", colorMap[color] || colorMap.teal)} style={{ width }} /></div>
      {hint ? <div className="mt-2 text-[11px] leading-relaxed text-zinc-500">{hint}</div> : null}
    </div>
  );
}

function getReputationMilestone(rep) {
  if (rep >= 10000) return "Legend Status";
  if (rep >= 5000) return "Industry Respect";
  if (rep >= 2500) return "National Name";
  if (rep >= 1000) return "Regional Buzz";
  if (rep >= 500) return "Underground Respected";
  if (rep >= 250) return "People Talk About You";
  if (rep >= 100) return "Known Locally";
  if (rep >= 50) return "Small Respect";
  return "Unknown";
}

function getNextReputationMilestone(rep) {
  const milestones = [50, 100, 250, 500, 1000, 2500, 5000, 10000];
  return milestones.find((value) => rep < value) || null;
}

function InfoCard({ icon, title, text, color = "teal" }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="mb-2 flex items-center gap-2"><IconBubble label={icon} color={color} /><div className="text-sm font-black text-white">{title}</div></div><div className="text-xs leading-relaxed text-zinc-400">{text}</div></div>;
}

function TopNumber({ value, type = "number" }) {
  const animated = useAnimatedNumber(value, 500);
  return <>{type === "money" ? formatMoney(animated) : Math.round(animated).toLocaleString()}</>;
}

function TextInput({ label, value, onChange, placeholder }) {
  return <label className="block"><div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{label}</div><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/60" /></label>;
}

function SettingsRow({ label, children, sub }) {
  return <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-sm font-black text-white">{label}</div>{sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}</div><div className="sm:min-w-[13rem]">{children}</div></div>;
}

function Toggle({ checked, onChange }) {
  return <Button onClick={() => onChange(!checked)} className={cx("w-full rounded-2xl border px-4 py-2 text-sm font-black", checked ? "border-cyan-300/40 bg-cyan-300/20 text-cyan-100" : "border-white/10 bg-black/30 text-zinc-400")}>{checked ? "On" : "Off"}</Button>;
}

function Slider({ value, min, max, step = 1, onChange, suffix = "" }) {
  return <div><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan-300" /><div className="mt-1 text-right text-xs font-black text-cyan-200">{value}{suffix}</div></div>;
}

function SettingsModal({ settings, setSettings, onClose, onSaveNow, onExportJson, onImportJson, onResetGame, playerName, version, fps }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  function update(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }
  function importFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImportJson(String(reader.result || ""));
    reader.readAsText(file);
    event.target.value = "";
  }
  return <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 px-3 py-5 backdrop-blur-sm"><Card className={cx("max-h-[92vh] w-[min(48rem,96vw)] overflow-y-auto p-5", settings.highContrastText ? "text-white" : "")}><div className="mb-5 flex items-start justify-between gap-4"><div><div className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">Settings</div><div className="mt-1 text-4xl font-black text-white">Game Options</div>{settings.showFps ? <div className="mt-1 text-xs font-black text-lime-200">FPS: {fps}</div> : null}</div><Button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Close</Button></div><div className="space-y-5"><div><SectionTitle title="Audio" /><div className="grid gap-2"><SettingsRow label="Master Volume"><Slider value={settings.masterVolume} min={0} max={100} onChange={(v) => update("masterVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="Music Volume"><Slider value={settings.musicVolume} min={0} max={100} onChange={(v) => update("musicVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="SFX Volume"><Slider value={settings.sfxVolume} min={0} max={100} onChange={(v) => update("sfxVolume", v)} suffix="%" /></SettingsRow><SettingsRow label="Mute"><Toggle checked={settings.mute} onChange={(v) => update("mute", v)} /></SettingsRow></div></div><div><SectionTitle title="Rhythm Minigame" /><div className="grid gap-2"><SettingsRow label="Timing Offset" sub="Calibration only. Does not widen timing windows."><Slider value={settings.timingOffset} min={-100} max={100} onChange={(v) => update("timingOffset", v)} suffix="ms" /></SettingsRow><SettingsRow label="Key Bindings" sub="No rebinding. Scroll speed stays locked."><div className="text-sm font-black text-white">← ↓ ↑ →</div></SettingsRow></div></div><div><SectionTitle title="Gameplay" /><div className="grid gap-2"><SettingsRow label="Autosave"><Toggle checked={settings.autosave} onChange={(v) => update("autosave", v)} /></SettingsRow><SettingsRow label="Save Now"><Button onClick={onSaveNow} className="w-full rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-black text-black hover:bg-cyan-200">Save Now</Button></SettingsRow></div></div><div><SectionTitle title="Display" /><div className="grid gap-2"><SettingsRow label="UI Scale"><Slider value={settings.uiScale} min={0.8} max={1.2} step={0.05} onChange={(v) => update("uiScale", Number(v.toFixed(2)))} suffix="x" /></SettingsRow><SettingsRow label="Reduce Motion"><Toggle checked={settings.reduceMotion} onChange={(v) => update("reduceMotion", v)} /></SettingsRow><SettingsRow label="Show FPS"><Toggle checked={settings.showFps} onChange={(v) => update("showFps", v)} /></SettingsRow></div></div><div><SectionTitle title="Accessibility" /><div className="grid gap-2"><SettingsRow label="Colorblind Mode" sub="Rhythm arrows switch to high contrast red/blue/green/yellow."><Toggle checked={settings.colorblindMode} onChange={(v) => update("colorblindMode", v)} /></SettingsRow><SettingsRow label="High Contrast Text"><Toggle checked={settings.highContrastText} onChange={(v) => update("highContrastText", v)} /></SettingsRow></div></div><div><SectionTitle title="Data" /><div className="grid gap-2"><SettingsRow label="Export Save"><Button onClick={onExportJson} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Download JSON</Button></SettingsRow><SettingsRow label="Import Save"><input ref={fileInputRef} type="file" accept="application/json" onChange={importFile} className="hidden" /><Button onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white hover:bg-white/10">Upload JSON</Button></SettingsRow><SettingsRow label="Reset Game" sub="this will erase everything. are you sure?"><div className="grid gap-2">{confirmReset ? <><Button onClick={onResetGame} className="rounded-2xl bg-rose-400 px-4 py-2 text-sm font-black text-black">Confirm Reset</Button><Button onClick={() => setConfirmReset(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white">Cancel</Button></> : <Button onClick={() => setConfirmReset(true)} className="rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-black text-rose-100">RESET GAME</Button>}</div></SettingsRow></div></div><div><SectionTitle title="Credits" /><div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-zinc-400"><div>Game version: {version}</div><div>built by {playerName || "player name placeholder"}</div><div className="mt-1 text-xs text-zinc-600">optional link space</div></div></div></div><div className="sticky bottom-0 mt-5 grid gap-3 border-t border-white/10 bg-[#08111f]/95 pt-4 sm:grid-cols-2"><Button onClick={onSaveNow} className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black hover:bg-cyan-200">Save</Button><Button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white hover:bg-white/10">Close</Button></div></Card></div>;
}

function BackdropScene({ backdrop }) {
  const base = "absolute inset-0";
  if (backdrop === "Neon Alley") return <div className={cx(base, "bg-gradient-to-br from-[#170b2d] via-[#10213a] to-black")}><div className="absolute inset-y-0 left-8 w-2 bg-cyan-300/40 blur-sm" /><div className="absolute inset-y-0 right-10 w-2 bg-pink-400/35 blur-sm" /><div className="absolute bottom-0 left-0 right-0 h-20 bg-black/50" /></div>;
  if (backdrop === "Graffiti Wall") return <div className={cx(base, "bg-gradient-to-br from-[#1f2937] via-[#111827] to-black")}><div className="absolute left-5 top-16 h-12 w-28 rotate-[-10deg] rounded-full bg-pink-400/25 blur-sm" /><div className="absolute right-6 top-24 h-12 w-24 rotate-[12deg] rounded-full bg-lime-300/20 blur-sm" /><div className="absolute bottom-0 left-0 right-0 h-20 bg-black/45" /></div>;
  if (backdrop === "Rooftop Night") return <div className={cx(base, "bg-gradient-to-br from-[#07111f] via-[#10172a] to-black")}><div className="absolute right-8 top-8 h-10 w-10 rounded-full bg-amber-200/80 shadow-[0_0_30px_rgba(253,230,138,.45)]" /><div className="absolute bottom-10 left-5 h-16 w-8 bg-slate-800/90" /><div className="absolute bottom-10 right-8 h-20 w-10 bg-slate-800/80" /></div>;
  if (backdrop === "Small Stage") return <div className={cx(base, "bg-gradient-to-br from-[#25071d] via-[#111827] to-black")}><div className="absolute left-8 top-4 h-28 w-14 rotate-12 bg-pink-400/25 blur-xl" /><div className="absolute right-8 top-4 h-28 w-14 -rotate-12 bg-cyan-300/25 blur-xl" /><div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-purple-950/30" /></div>;
  return <div className={cx(base, "bg-gradient-to-br from-[#0d1726] via-[#151024] to-black")}><div className="absolute bottom-8 left-5 h-20 w-28 rounded-xl border border-cyan-300/10 bg-slate-800/80" /><div className="absolute bottom-8 right-6 h-28 w-16 rounded-t-2xl border border-white/10 bg-slate-700/70" /></div>;
}

function HairLayer({ hair }) {
  if (hair === "Short Twists") return <><div className="absolute -top-5 left-1/2 h-12 w-28 -translate-x-1/2 rounded-t-[2rem] rounded-b-xl bg-[#05060a]" />{[26, 40, 54, 68, 82].map((left) => <div key={left} className="absolute -top-8 h-8 w-2 rounded-full bg-[#05060a]" style={{ left: `${left}%` }} />)}</>;
  if (hair === "High Top") return <><div className="absolute -top-9 left-1/2 h-16 w-24 -translate-x-1/2 rounded-t-3xl rounded-b-xl bg-[#05060a]" /><div className="absolute -top-1 left-4 h-5 w-5 rounded-full bg-[#05060a]" /><div className="absolute -top-1 right-4 h-5 w-5 rounded-full bg-[#05060a]" /></>;
  if (hair === "Waves") return <><div className="absolute -top-4 left-1/2 h-11 w-28 -translate-x-1/2 rounded-[999px] bg-[#05060a]" /><div className="absolute top-1 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/10" /><div className="absolute top-4 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/10" /></>;
  if (hair === "Braids") return <><div className="absolute -top-5 left-1/2 h-12 w-28 -translate-x-1/2 rounded-t-2xl bg-[#05060a]" />{[15, 27, 39, 51, 63, 75, 87].map((left) => <div key={left} className="absolute top-0 h-14 w-2 rounded-full bg-[#05060a]" style={{ left: `${left}%` }} />)}</>;
  return <><div className="absolute -top-6 left-1/2 h-14 w-32 -translate-x-1/2 rounded-[50%] bg-[#05060a]" /><div className="absolute -top-3 left-3 h-9 w-9 rounded-full bg-[#05060a]" /><div className="absolute -top-6 left-9 h-11 w-11 rounded-full bg-[#05060a]" /><div className="absolute -top-6 right-9 h-11 w-11 rounded-full bg-[#05060a]" /><div className="absolute -top-3 right-3 h-9 w-9 rounded-full bg-[#05060a]" /></>;
}

function OutfitLayer({ outfit }) {
  const looks = {
    "Plain Hoodie": { body: "from-zinc-800 to-black", chest: "bg-zinc-600/25", accent: "bg-zinc-400/20" },
    "Thrift Tee": { body: "from-emerald-700 to-emerald-950", chest: "bg-emerald-300/20", accent: "bg-emerald-200/25" },
    "Black Hoodie": { body: "from-slate-950 to-black", chest: "bg-cyan-300/15", accent: "bg-cyan-200/20" },
    "Old Jersey": { body: "from-blue-700 to-blue-950", chest: "bg-amber-300/20", accent: "bg-white/25" },
    "Purple Jacket": { body: "from-violet-700 to-black", chest: "bg-pink-300/18", accent: "bg-pink-200/25" },
    "Puffer Vest": { body: "from-slate-700 to-black", chest: "bg-white/10", accent: "bg-white/20" },
  };
  const look = looks[outfit] || looks["Plain Hoodie"];
  return <div className={cx("relative -mt-2 h-44 w-48 overflow-hidden rounded-t-[4rem] rounded-b-[1.4rem] bg-gradient-to-br shadow-xl", look.body)}><div className="absolute left-1/2 top-2 h-8 w-16 -translate-x-1/2 rounded-b-full bg-black/35" /><div className={cx("absolute inset-x-7 top-7 h-24 rounded-2xl", look.chest)} />{(outfit === "Plain Hoodie" || outfit === "Black Hoodie") && <><div className="absolute left-[4.35rem] top-9 h-14 w-1 rounded-full bg-white/20" /><div className="absolute right-[4.35rem] top-9 h-14 w-1 rounded-full bg-white/20" /><div className={cx("absolute left-1/2 top-16 h-10 w-20 -translate-x-1/2 rounded-2xl", look.accent)} /></>}{outfit === "Old Jersey" && <><div className="absolute left-12 top-8 h-24 w-3 rounded-full bg-white/25" /><div className="absolute right-12 top-8 h-24 w-3 rounded-full bg-white/25" /></>}{outfit === "Purple Jacket" && <><div className="absolute left-1/2 top-8 h-28 w-1 -translate-x-1/2 rounded-full bg-white/20" /><div className="absolute left-9 top-16 h-12 w-10 rounded-xl bg-pink-200/15" /><div className="absolute right-9 top-16 h-12 w-10 rounded-xl bg-pink-200/15" /></>}{outfit === "Puffer Vest" && <div className="absolute inset-x-8 top-10 space-y-3">{[0, 1, 2, 3].map((item) => <div key={item} className="h-2 rounded-full bg-white/12" />)}</div>}</div>;
}

function AccessoryLayer({ accessories = [] }) {
  return <>{accessories.includes("Gold Glasses") && <><div className="absolute left-4 top-12 h-6 w-9 rounded-full border-2 border-amber-300/95" /><div className="absolute right-4 top-12 h-6 w-9 rounded-full border-2 border-amber-300/95" /><div className="absolute left-1/2 top-[3.65rem] h-0.5 w-5 -translate-x-1/2 bg-amber-300/90" /></>}{accessories.includes("Silver Studs") && <><div className="absolute left-0.5 top-16 h-2.5 w-2.5 rounded-full bg-zinc-200" /><div className="absolute right-0.5 top-16 h-2.5 w-2.5 rounded-full bg-zinc-200" /></>}{accessories.includes("Gold Hoop") && <><div className="absolute left-[-3px] top-[4.15rem] h-4 w-4 rounded-full border-2 border-amber-300/95" /><div className="absolute right-[-3px] top-[4.15rem] h-4 w-4 rounded-full border-2 border-amber-300/95" /></>}</>;
}

function BodyAccessoryLayer({ accessories = [] }) {
  return <>{accessories.includes("Rope Chain") && <div className="absolute left-1/2 top-3 h-10 w-24 -translate-x-1/2 rounded-b-full border-[3px] border-amber-300/90" />}{accessories.includes("Crown Pendant") && <><div className="absolute left-1/2 top-3 h-10 w-24 -translate-x-1/2 rounded-b-full border-[3px] border-amber-300/90" /><div className="absolute left-1/2 top-12 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-amber-300 text-[10px] font-black text-black">C</div></>}{accessories.includes("Black Watch") && <div className="absolute right-3 bottom-8 h-4 w-7 rounded-full border border-zinc-500 bg-zinc-900/90" />}</>;
}

function AvatarRenderer({ avatar, compact = false }) {
  const skin = skinToneOptions.find((item) => item.name === avatar.skinTone) || skinToneOptions[2];
  return <div className={cx("relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-black/20 shadow-2xl shadow-cyan-950/40", compact ? "h-72 w-60" : "h-[28rem] w-80")}><BackdropScene backdrop={avatar.backdrop} /><div className="relative z-10 flex h-full items-end justify-center pb-3"><div className="flex flex-col items-center"><div className={cx("relative h-28 w-28 rounded-full bg-gradient-to-br shadow-xl", skin.color)}><HairLayer hair={avatar.hair} /><AccessoryLayer accessories={avatar.accessories || []} /><div className="absolute left-7 top-14 h-2 w-2 rounded-full bg-black" /><div className="absolute right-7 top-14 h-2 w-2 rounded-full bg-black" /><div className="absolute left-1/2 top-[4.05rem] h-3 w-2 -translate-x-1/2 rounded-full bg-black/20" /><div className="absolute left-1/2 top-[4.95rem] h-1.5 w-8 -translate-x-1/2 rounded-full bg-black/50" /><div className="absolute left-1 top-16 h-5 w-4 rounded-full bg-black/10" /><div className="absolute right-1 top-16 h-5 w-4 rounded-full bg-black/10" /></div><div className="relative"><OutfitLayer outfit={avatar.outfit} /><div className="absolute inset-0"><BodyAccessoryLayer accessories={avatar.accessories || []} /></div></div></div></div><div className="absolute bottom-0 left-0 right-0 z-20 h-20 bg-gradient-to-t from-black/70 to-transparent" /></div>;
}

function AvatarCard({ stageName, avatar, compact = false }) {
  return <Card className={cx("relative overflow-hidden p-4", compact ? "min-h-[23rem]" : "min-h-[34rem]")}><div className="relative z-20 mb-4 flex items-start justify-between gap-3 px-1 pt-1"><div className="min-w-0"><div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">Stage Name</div><div className="mt-1 truncate text-4xl font-black italic tracking-tight text-white drop-shadow md:text-5xl">{stageName || "Unnamed"}</div><div className="mt-2 inline-flex rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200">Bedroom Rookie</div></div><div className="shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">{avatar.backdrop}</div></div><div className="relative z-10 flex justify-center"><AvatarRenderer avatar={avatar} compact={compact} /></div></Card>;
}

function OptionButton({ children, active, onClick }) {
  return <Button onClick={onClick} className={cx("rounded-2xl border px-3 py-3 text-sm font-bold", active ? "border-cyan-300 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.035] text-zinc-300 hover:border-white/20 hover:bg-white/10")}>{children}</Button>;
}

function EmptyState({ text }) {
  return <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-500">{text}</div>;
}

function ChoiceModal({ title, text, options }) {
  return <Card className="w-[min(34rem,92vw)] p-6 animate-[popIn_.2s_ease-out]"><div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Major Event</div><div className="mt-2 text-3xl font-black text-white">{title}</div><p className="mt-3 text-sm leading-relaxed text-zinc-400">{text}</p><div className="mt-5 grid gap-3">{options.map((option) => <Button key={option.label} onClick={option.onClick} tone={option.tone === "good" ? "success" : "click"} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left hover:bg-white/10"><div className="font-black text-white">{option.label}</div><div className="mt-1 text-xs text-zinc-500">{option.sub}</div></Button>)}</div></Card>;
}

const RHYTHM_TIMING = { perfect: 0.045, great: 0.09, good: 0.135 };
const LANE_COLORS = ["violet", "cyan", "pink", "amber"];
const LANE_ARROWS = ["◀", "▼", "▲", "▶"];
const LANE_KEYS = ["LEFT", "DOWN", "UP", "RIGHT"];

function getRhythmStyle(selectedStyles) {
  const names = selectedStyles.map((style) => style.name.toLowerCase()).join(" ");
  if (names.includes("rage")) return { name: "aggressive", bpm: 140, density: 1, duration: 32 };
  if (names.includes("melodic")) return { name: "melodic", bpm: 100, density: 0.5, duration: 30 };
  if (names.includes("sad") || names.includes("cloud")) return { name: "chill", bpm: 80, density: 0.25, duration: 26 };
  if (names.includes("lyrical") || names.includes("jazz")) return { name: "smooth", bpm: 110, density: 0.5, duration: 30 };
  return { name: "smooth", bpm: 110, density: 0.5, duration: 30 };
}

function getStudioTimingBonus(studioName) {
  if (studioName === "Bedroom") return 0.9;
  if (studioName === "Garage Setup") return 1;
  if (studioName === "Local Studio") return 1.1;
  if (studioName === "Pro Studio") return 1.2;
  return 1;
}

function ensureRhythmAudio() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
  if (!AudioContextClass) return null;
  audioContext = audioContext || new AudioContextClass();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function getAudioVolume(kind = "music") {
  const settings = (typeof window !== "undefined" && window.__rapSimSettings) || defaultSettings;
  if (settings.mute || settings.masterVolume <= 0) return 0;
  const channel = kind === "sfx" ? settings.sfxVolume : settings.musicVolume;
  return (settings.masterVolume / 100) * (channel / 100);
}

function scheduleKick(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(60, time);
  osc.frequency.exponentialRampToValueAtTime(35, time + 0.15);
  gain.gain.setValueAtTime(0.28 * getAudioVolume("music"), time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.16);
}

function scheduleNoiseBurst(ctx, time, duration, highpass, volume) {
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(highpass, time);
  gain.gain.setValueAtTime(volume * getAudioVolume("music"), time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(time);
  source.stop(time + duration + 0.01);
}

function generateRhythmNotes({ selectedStyles, lyricsSkill }) {
  const rhythm = getRhythmStyle(selectedStyles);
  const secondsPerBeat = 60 / rhythm.bpm;
  const densityScale = clamp(0.7 + lyricsSkill / 200, 0.7, 2.5);
  const effectiveDensity = rhythm.density * densityScale;
  const step = secondsPerBeat / Math.max(0.25, effectiveDensity);
  const notes = [];
  const lastLaneTime = [-99, -99, -99, -99];
  for (let t = 0.8; t < rhythm.duration; t += step) {
    const roll = Math.random();
    const makeLane = () => {
      let lane = Math.floor(Math.random() * 4);
      let attempts = 0;
      while (t - lastLaneTime[lane] < 0.15 && attempts < 8) {
        lane = Math.floor(Math.random() * 4);
        attempts += 1;
      }
      lastLaneTime[lane] = t;
      return lane;
    };
    if (roll < 0.7) {
      notes.push({ id: makeId(), time: t, lane: makeLane(), hold: 0, hit: false, missed: false });
    } else if (roll < 0.85) {
      const laneA = makeLane();
      let laneB = makeLane();
      if (laneB === laneA) laneB = (laneA + 1) % 4;
      notes.push({ id: makeId(), time: t, lane: laneA, hold: 0, hit: false, missed: false }, { id: makeId(), time: t, lane: laneB, hold: 0, hit: false, missed: false });
    } else if (roll < 0.95) {
      notes.push({ id: makeId(), time: t, lane: makeLane(), hold: secondsPerBeat * (1 + Math.random()), hit: false, missed: false });
    } else {
      const lane = makeLane();
      notes.push({ id: makeId(), time: t, lane, hold: 0, hit: false, missed: false }, { id: makeId(), time: t + secondsPerBeat / 3, lane: (lane + 1) % 4, hold: 0, hit: false, missed: false }, { id: makeId(), time: t + (secondsPerBeat * 2) / 3, lane: (lane + 2) % 4, hold: 0, hit: false, missed: false });
    }
  }
  return { notes, bpm: rhythm.bpm, duration: rhythm.duration, secondsPerBeat, styleName: rhythm.name };
}

function takeMultiplierFromAccuracy(accuracy) {
  if (accuracy >= 0.95) return { multiplier: 1.3, label: "PERFECT TAKE" };
  if (accuracy >= 0.85) return { multiplier: 1.15, label: "GREAT TAKE" };
  if (accuracy >= 0.7) return { multiplier: 1, label: "SOLID TAKE" };
  if (accuracy >= 0.5) return { multiplier: 0.85, label: "OKAY TAKE" };
  return { multiplier: 0.7, label: "ROUGH TAKE" };
}

function RhythmMiniGame({ draft, player, studio, selectedStyles, onUseTake, onRetakeCost, onCancel, previewFinalQuality }) {
  const chart = useMemo(() => generateRhythmNotes({ selectedStyles, lyricsSkill: player.lyrics }), [selectedStyles, player.lyrics]);
  const [notes, setNotes] = useState(chart.notes);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [songStartTime, setSongStartTime] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [nextBeatTime, setNextBeatTime] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [counts, setCounts] = useState({ perfects: 0, greats: 0, goods: 0, misses: 0 });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [ratingPopup, setRatingPopup] = useState("");
  const [laneFlash, setLaneFlash] = useState(null);
  const [result, setResult] = useState(null);
  const [bestTake, setBestTake] = useState(null);
  const [retakes, setRetakes] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const nextBeatRef = useRef(0);
  const beatIndexRef = useRef(0);
  const notesRef = useRef(notes);
  const pausedRef = useRef(false);
  const totalNotes = chart.notes.length || 1;
  const rawStressMultiplier = 1 - player.stress / 200;
  const stressMultiplier = Math.max(0.5, rawStressMultiplier);
  const studioBonus = getStudioTimingBonus(studio.name);
  const finalTimingMultiplier = stressMultiplier * studioBonus;
  const timingOffsetSeconds = (((typeof window !== "undefined" && window.__rapSimSettings?.timingOffset) || 0) / 1000);
  const timing = {
    perfect: RHYTHM_TIMING.perfect * finalTimingMultiplier,
    great: RHYTHM_TIMING.great * finalTimingMultiplier,
    good: RHYTHM_TIMING.good * finalTimingMultiplier,
  };
  const stressLabel = player.stress >= 80 ? "HIGH STRESS" : player.stress > 50 ? "STRESSED" : "FOCUSED";
  const studioBonusText = studioBonus === 0.9 ? "slightly worse timing" : studioBonus === 1 ? "no timing bonus" : studioBonus === 1.1 ? "slight timing bonus" : "strong timing bonus";
  const topHudHeight = 112;
  const bottomControlsHeight = 170;
  const playAreaHeight = Math.max(260, viewportHeight - topHudHeight - bottomControlsHeight);
  const hitZoneY = Math.max(150, playAreaHeight - 125);
  const scrollSpeedMultiplier = player.stress >= 80 ? 1.1 : 1;
  const scrollSpeed = Math.max(320, hitZoneY / 1.5) * scrollSpeedMultiplier;

  useEffect(() => {
    function onResize() {
      setViewportHeight(window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { notesRef.current = notes; }, [notes]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  function showRating(text, lane) {
    setRatingPopup(text);
    setLaneFlash(lane);
    setTimeout(() => setRatingPopup(""), 500);
    setTimeout(() => setLaneFlash(null), 180);
  }

  function finishGame(finalCounts) {
    const score = finalCounts.perfects * 1 + finalCounts.greats * 0.7 + finalCounts.goods * 0.4;
    const accuracy = totalNotes ? score / totalNotes : 0;
    const take = takeMultiplierFromAccuracy(accuracy);
    const summary = { ...finalCounts, totalNotes, accuracy, maxCombo, multiplier: take.multiplier, label: take.label, finalQuality: previewFinalQuality(take.multiplier) };
    setBestTake((prev) => !prev || summary.multiplier > prev.multiplier ? summary : prev);
    setResult(summary);
    if (rhythmSchedulerTimeoutId) clearTimeout(rhythmSchedulerTimeoutId);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function startTake() {
    const ctx = ensureRhythmAudio();
    if (!ctx) return;
    const startAt = ctx.currentTime + 0.12;
    startRef.current = startAt;
    nextBeatRef.current = startAt;
    beatIndexRef.current = 0;
    setSongStartTime(startAt);
    setNextBeatTime(startAt);
    setBeatIndex(0);
    setStarted(true);
    setPaused(false);
    setResult(null);
    setNotes(chart.notes.map((note) => ({ ...note, hit: false, missed: false })));
    setCounts({ perfects: 0, greats: 0, goods: 0, misses: 0 });
    setCombo(0);
    setMaxCombo(0);
  }

  useEffect(() => {
    if (!started || result) return undefined;
    const ctx = audioContext;
    if (!ctx) return undefined;
    function scheduler() {
      while (nextBeatRef.current < ctx.currentTime + 0.1) {
        const index = beatIndexRef.current;
        if (index % 4 === 0 || index % 4 === 2) scheduleKick(ctx, nextBeatRef.current);
        if (index % 4 === 1 || index % 4 === 3) scheduleNoiseBurst(ctx, nextBeatRef.current, 0.1, 900, 0.16);
        scheduleNoiseBurst(ctx, nextBeatRef.current, 0.03, 5000, 0.045);
        nextBeatRef.current += chart.secondsPerBeat / 2;
        beatIndexRef.current += 1;
        setNextBeatTime(nextBeatRef.current);
        setBeatIndex(beatIndexRef.current);
      }
      rhythmSchedulerTimeoutId = setTimeout(scheduler, 25);
    }
    scheduler();
    return () => { if (rhythmSchedulerTimeoutId) clearTimeout(rhythmSchedulerTimeoutId); };
  }, [started, result, chart.secondsPerBeat]);

  useEffect(() => {
    if (!started || result) return undefined;
    function frame() {
      if (!pausedRef.current && audioContext) {
        const time = audioContext.currentTime - startRef.current;
        setCurrentAudioTime(time);
        setNotes((prev) => {
          let misses = 0;
          const next = prev.map((note) => {
            if (!note.hit && !note.missed && time - note.time > timing.good) {
              misses += 1;
              return { ...note, missed: true };
            }
            return note;
          });
          if (misses) {
            setCounts((old) => ({ ...old, misses: old.misses + misses }));
            setCombo(0);
            showRating("MISS", null);
          }
          return next;
        });
        if (time >= chart.duration + 1) {
          const finalNotes = notesRef.current;
          const missedLeft = finalNotes.filter((note) => !note.hit && !note.missed).length;
          setCounts((old) => {
            const finalCounts = { ...old, misses: old.misses + missedLeft };
            finishGame(finalCounts);
            return finalCounts;
          });
          return;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, result, chart.duration, timing.good]);

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") setPaused(true);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function hitLane(lane) {
    if (!started || paused || result || !audioContext) return;
    const time = audioContext.currentTime - startRef.current - timingOffsetSeconds;
    const candidates = notesRef.current
      .filter((note) => note.lane === lane && !note.hit && !note.missed)
      .map((note) => ({ note, diff: Math.abs(time - note.time) }))
      .sort((a, b) => a.diff - b.diff || a.note.time - b.note.time);
    const closest = candidates[0];
    if (!closest || closest.diff > timing.good) {
      setLaneFlash(lane);
      setTimeout(() => setLaneFlash(null), 120);
      return;
    }
    const rating = closest.diff <= timing.perfect ? "perfects" : closest.diff <= timing.great ? "greats" : "goods";
    const label = rating === "perfects" ? "PERFECT" : rating === "greats" ? "GREAT" : "GOOD";
    setNotes((prev) => prev.map((note) => note.id === closest.note.id ? { ...note, hit: true } : note));
    setCounts((old) => ({ ...old, [rating]: old[rating] + 1 }));
    setCombo((old) => {
      const next = old + 1;
      setMaxCombo((max) => Math.max(max, next));
      return next;
    });
    showRating(label, closest.note.lane);
    playTone(rating === "perfects" ? "success" : "click");
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") { setPaused((prev) => !prev); return; }
      if (event.key === "ArrowLeft") hitLane(0);
      if (event.key === "ArrowDown") hitLane(1);
      if (event.key === "ArrowUp") hitLane(2);
      if (event.key === "ArrowRight") hitLane(3);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function skipTake() {
    const summary = { perfects: 0, greats: 0, goods: 0, misses: totalNotes, totalNotes, accuracy: 0.5, maxCombo: 0, multiplier: 0.5, label: "SKIPPED TAKE", finalQuality: previewFinalQuality(0.5) };
    setBestTake((prev) => !prev || summary.multiplier > prev.multiplier ? summary : prev);
    setResult(summary);
  }

  function retake() {
    if (retakes >= 3) return;
    if (!onRetakeCost()) return;
    setRetakes((prev) => prev + 1);
    startTake();
  }

  const displayTake = bestTake || result;
  const progress = clamp((currentAudioTime / chart.duration) * 100, 0, 100);
  const accuracy = counts.perfects + counts.greats + counts.goods + counts.misses ? ((counts.perfects + counts.greats * 0.7 + counts.goods * 0.4) / totalNotes) * 100 : 0;

  return <div className={cx("fixed inset-0 z-[80] overflow-hidden bg-[#030814] text-white", ((typeof window !== "undefined" && window.__rapSimSettings?.reduceMotion) ? "" : player.stress >= 80 ? "animate-[stressShake_.14s_linear_infinite]" : player.stress > 50 ? "animate-[stressShakeSoft_.2s_linear_infinite]" : ""))}><div className={cx("absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,.15),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,.15),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(251,191,36,.1),transparent_28%)]", (player.stress > 50 && !(typeof window !== "undefined" && window.__rapSimSettings?.reduceMotion) ? "animate-[stressPulse_.75s_ease-in-out_infinite]" : ""))} /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.035),transparent_45%,rgba(0,0,0,.35))]" />{player.stress > 50 ? <div className={cx("pointer-events-none absolute inset-0", player.stress >= 80 ? "bg-red-500/12" : "bg-red-500/6")} /> : null}<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,.9)]" />{result ? <div className="relative z-10 flex min-h-screen items-center justify-center p-4"><Card className="w-[min(38rem,94vw)] p-6 text-center"><div className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Best Take Kept</div><div className="mt-2 text-5xl font-black text-white">{displayTake.label}</div><div className="mt-2 text-sm text-zinc-400">Accuracy {Math.round(displayTake.accuracy * 100)}% • Max combo {displayTake.maxCombo} • Final quality preview {displayTake.finalQuality}/100</div><div className="mt-5 grid gap-2 sm:grid-cols-4"><InfoCard icon="P" color="gold" title={`${displayTake.perfects}`} text="perfects" /><InfoCard icon="G" color="lime" title={`${displayTake.greats}`} text="greats" /><InfoCard icon="O" color="blue" title={`${displayTake.goods}`} text="goods" /><InfoCard icon="M" color="coral" title={`${displayTake.misses}`} text="misses" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Button onClick={() => onUseTake(displayTake)} tone="success" className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">Use This Take</Button><Button onClick={retake} disabled={retakes >= 3} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white hover:bg-white/10">{retakes >= 3 ? "No Retakes Left" : "Retake ($20, +10 stress)"}</Button></div></Card></div> : <><div className="relative z-10 grid h-screen grid-rows-[112px_1fr_170px]"><div className="flex items-start justify-between gap-4 p-4"><div><div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Recording Take</div><div className="mt-1 text-3xl font-black text-white">{draft.title}</div><div className="mt-1 text-xs text-zinc-500">{chart.styleName} • {chart.bpm} bpm • {studio.name}</div><div className={cx("mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]", player.stress >= 80 ? "border-red-300/40 bg-red-500/20 text-red-100" : player.stress > 50 ? "border-amber-300/40 bg-amber-500/15 text-amber-100" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100")}>{stressLabel}</div></div><div className="text-right text-xs text-zinc-400"><div>accuracy: {Math.round(accuracy)}%</div><div>score: {counts.perfects * 1000 + counts.greats * 700 + counts.goods * 400}</div><div>stress {player.stress} • timing {Math.round(finalTimingMultiplier * 100)}%</div><div>{studio.name}: {studioBonusText}</div></div></div><div className="relative mx-auto self-start overflow-hidden" style={{ width: 340, height: playAreaHeight, minHeight: playAreaHeight, maxHeight: playAreaHeight }}><div className="absolute inset-y-0 left-1/2 w-[340px] -translate-x-1/2 rounded-t-[2rem] border-x border-white/10 bg-black/25"><div className="grid h-full grid-cols-4">{[0, 1, 2, 3].map((lane) => <button type="button" key={lane} onTouchStart={() => hitLane(lane)} onMouseDown={() => hitLane(lane)} className={cx("relative border-r border-white/10 last:border-r-0", laneFlash === lane ? "bg-white/20" : "bg-white/[0.025]")}><div className="absolute inset-x-5 top-0 h-full bg-gradient-to-b from-white/5 via-transparent to-white/5 opacity-50" /></button>)}</div></div>{notes.filter((note) => !note.hit && !note.missed).map((note) => { const y = hitZoneY - ((note.time - currentAudioTime) * scrollSpeed); if (y < -100 || y > hitZoneY + 95) return null; const color = ((typeof window !== "undefined" && window.__rapSimSettings?.colorblindMode) ? ["red", "blue", "green", "yellow"] : LANE_COLORS)[note.lane]; return <div key={note.id} className={cx("absolute z-20 flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-6xl font-black drop-shadow-[0_0_18px_rgba(255,255,255,.25)]", color === "violet" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-violet-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-violet-200 bg-violet-500/25 text-violet-200 shadow-[0_0_26px_rgba(167,139,250,.4)]"), color === "cyan" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-cyan-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-cyan-100 bg-cyan-400/20 text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,.4)]"), color === "pink" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-pink-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-pink-100 bg-pink-400/20 text-pink-100 shadow-[0_0_26px_rgba(244,114,182,.4)]"), color === "amber" && (player.stress > 50 ? "border-red-200 bg-red-500/30 text-amber-100 shadow-[0_0_30px_rgba(248,113,113,.55)]" : "border-amber-100 bg-amber-300/20 text-amber-100 shadow-[0_0_26px_rgba(251,191,36,.4)]"), color === "red" && "border-red-100 bg-red-500/25 text-red-100 shadow-[0_0_26px_rgba(248,113,113,.45)]", color === "blue" && "border-blue-100 bg-blue-500/25 text-blue-100 shadow-[0_0_26px_rgba(96,165,250,.45)]", color === "green" && "border-green-100 bg-green-500/25 text-green-100 shadow-[0_0_26px_rgba(74,222,128,.45)]", color === "yellow" && "border-yellow-100 bg-yellow-400/25 text-yellow-100 shadow-[0_0_26px_rgba(250,204,21,.45)]")} style={{ left: `${note.lane * 85 + 2}px`, top: y }}><span className="absolute -top-10 h-10 w-2 rounded-full bg-white/15 blur-sm" />{LANE_ARROWS[note.lane]}</div>; })}<div className="absolute z-30 grid grid-cols-4 gap-1" style={{ width: 340, top: hitZoneY }}>{[0, 1, 2, 3].map((lane) => <button type="button" key={lane} onTouchStart={() => hitLane(lane)} onMouseDown={() => hitLane(lane)} className={cx("flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-black/45 text-6xl font-black transition", laneFlash === lane ? "scale-110 border-white text-white shadow-[0_0_30px_rgba(255,255,255,.7)]" : "border-white/45 text-white/45")}>{LANE_ARROWS[lane]}</button>)}</div>{ratingPopup ? <div className="pointer-events-none absolute left-1/2 top-[38%] z-40 -translate-x-1/2 animate-[floatUp_.5s_ease-out_forwards] text-6xl font-black text-white drop-shadow-[0_0_24px_rgba(255,255,255,.5)]">{ratingPopup}</div> : null}{combo > 1 ? <div className="pointer-events-none absolute left-1/2 top-[52%] z-40 -translate-x-1/2 text-5xl font-black text-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,.6)]">{combo}x</div> : null}{paused ? <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 text-6xl font-black text-white">PAUSED</div> : null}</div><div className="relative z-[120] border-t border-white/10 bg-[#030814]/95 p-4 shadow-[0_-18px_60px_rgba(0,0,0,.55)] backdrop-blur"><div className="mx-auto h-3 max-w-xl overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} /></div><div className="mx-auto mt-4 grid max-w-xl gap-3 sm:grid-cols-3"><Button onClick={() => setPaused((prev) => !prev)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Pause</Button>{!started ? <div><div className="mb-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-center text-[11px] font-bold text-zinc-300">stress: {player.stress} — timing windows reduced to {Math.round(stressMultiplier * 100)}% • studio: {studio.name} — {studioBonusText}</div><Button onClick={startTake} tone="success" className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">Start Take</Button></div> : <Button onClick={skipTake} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Skip</Button>}<Button onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-black text-white">Cancel</Button></div></div></div></>}</div>;
}

function FeedbackLayer({ floaters, progress, weekSplash, celebration, particles, milestone, modal }) {
  return <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">{floaters.map((item, index) => <div key={item.id} style={{ top: `${5 + index * 3.25}rem` }} className={cx("absolute left-1/2 -translate-x-1/2 animate-[floatUp_1.5s_ease-out_forwards] rounded-full border px-4 py-2 text-sm font-black shadow-2xl", item.kind === "loss" ? "border-rose-300/40 bg-rose-500/15 text-rose-200" : "border-lime-300/40 bg-lime-500/15 text-lime-200")}>{item.text}</div>)}{progress && <div className="absolute left-1/2 top-1/2 w-[min(24rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] border border-cyan-300/25 bg-[#07111f]/95 p-5 shadow-2xl shadow-cyan-950/40 animate-[popIn_.18s_ease-out]"><div className="mb-3 text-center text-sm font-black uppercase tracking-[0.25em] text-cyan-200">{progress.label}</div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full animate-[loadBar_.75s_ease-in-out_forwards] rounded-full bg-cyan-300" /></div></div>}{weekSplash && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><div className="animate-[weekFlash_1.2s_ease-in-out_forwards] rounded-[2rem] border border-white/10 bg-[#07111f]/90 px-10 py-6 text-5xl font-black tracking-tight text-white shadow-2xl">WEEK {weekSplash}</div></div>}{celebration && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="relative w-[min(28rem,90vw)] rounded-[2rem] border border-amber-300/25 bg-[#07111f]/95 p-6 text-center shadow-2xl animate-[popIn_.22s_ease-out]">{particles.map((particle) => <span key={particle.id} className="absolute h-2 w-2 animate-[particle_1.4s_ease-out_forwards] rounded-full bg-cyan-300" style={{ left: `${particle.x}%`, top: `${particle.y}%`, animationDelay: `${particle.delay}ms` }} />)}<div className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">Released</div><div className="mt-2 text-3xl font-black text-white">{celebration.title}</div><div className="mt-5 grid gap-2 sm:grid-cols-3">{celebration.stats.map((stat, index) => <div key={stat.label} className="animate-[statPop_.55s_ease-out_forwards] rounded-2xl border border-white/10 bg-white/[0.04] p-4 opacity-0" style={{ animationDelay: `${index * 220}ms` }}><div className="text-xl font-black text-lime-200">{stat.value}</div><div className="text-xs uppercase tracking-[0.16em] text-zinc-500">{stat.label}</div></div>)}</div></div></div>}{milestone ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 px-4"><div className="animate-[weekFlash_2.4s_ease-in-out_forwards] rounded-[2rem] border border-amber-300/30 bg-[#07111f]/95 px-8 py-7 text-center shadow-2xl"><div className="text-xs font-black uppercase tracking-[0.28em] text-amber-200">Fan Milestone</div><div className="mt-3 max-w-lg text-3xl font-black leading-tight text-white">{milestone}</div></div></div> : null}{modal ? <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/45 px-4">{modal}</div> : null}</div>;
}

function FeedbackStyles() {
  return <style>{`@keyframes stressShakeSoft{0%,100%{transform:translate(0,0)}50%{transform:translate(1px,-1px)}}@keyframes stressShake{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,-1px)}50%{transform:translate(-2px,1px)}75%{transform:translate(1px,2px)}}@keyframes stressPulse{0%,100%{opacity:.75;filter:brightness(1)}50%{opacity:1;filter:brightness(1.25)}}@keyframes floatUp{0%{opacity:0;transform:translate(-50%,18px) scale(.96)}15%{opacity:1}100%{opacity:0;transform:translate(-50%,-70px) scale(1.03)}}@keyframes popIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.94)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}@keyframes loadBar{0%{width:0%}100%{width:100%}}@keyframes weekFlash{0%{opacity:0;transform:scale(.9)}20%{opacity:1;transform:scale(1)}72%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.06)}}@keyframes statPop{0%{opacity:0;transform:translateY(12px) scale(.95)}100%{opacity:1;transform:translateY(0) scale(1)}}@keyframes particle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(20px,-70px) scale(.3)}}@keyframes tabFade{0%{opacity:.35;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}@keyframes slideEntry{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}`}</style>;
}

function EventLogItem({ item }) {
  const tone = item.tone || "neutral";
  const look = tone === "good" ? "border-lime-300/20 bg-lime-300/10 text-lime-100" : tone === "bad" ? "border-rose-300/20 bg-rose-300/10 text-rose-100" : "border-white/10 bg-white/[0.04] text-zinc-300";
  const icon = tone === "good" ? "+" : tone === "bad" ? "!" : "•";
  return <div className={cx("flex items-start gap-3 rounded-2xl border p-3 text-sm animate-[slideEntry_.25s_ease-out]", look)}><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/20 text-xs font-black">{icon}</span><span>{item.text}</span></div>;
}

function Picker({ title, options, value, onChange }) {
  return <div><SectionTitle title={title} /><div className="grid gap-2">{options.map((option) => <OptionButton key={option} active={value === option} onClick={() => onChange(option)}>{option}</OptionButton>)}</div></div>;
}

function StartScreen({ stageName, setStageName, avatar, updateAvatar, startGame, settings = defaultSettings }) {
  const canStart = stageName.trim().length > 0;
  return <div className={cx("min-h-screen bg-[#030814] text-white", settings.highContrastText ? "contrast-125" : "")} style={{ fontSize: `${settings.uiScale}rem` }}><div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,.14),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,.12),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(251,191,36,.08),transparent_30%)]" /><main className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-5 px-4 py-8 lg:grid-cols-[0.85fr_1.15fr]"><AvatarCard stageName={stageName || "Your Name"} avatar={avatar} /><div className="space-y-5"><Card className="p-6"><div className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">New Artist Setup</div><h1 className="bg-gradient-to-r from-cyan-200 via-white to-pink-200 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">Start from zero.</h1><p className="mt-4 text-sm leading-relaxed text-zinc-400">No fans. No money. Week 1. Just a bedroom, a notebook, and dangerous confidence.</p></Card><Card className="p-6"><TextInput label="Rapper Name" value={stageName} onChange={setStageName} placeholder="Enter your stage name" /><div className="mt-5 grid gap-4 md:grid-cols-3"><Picker title="Hair" options={hairOptions} value={avatar.hair} onChange={(v) => updateAvatar("hair", v)} /><Picker title="Skin Tone" options={skinToneOptions.map((i) => i.name)} value={avatar.skinTone} onChange={(v) => updateAvatar("skinTone", v)} /><Picker title="Starter Outfit" options={outfitOptions} value={avatar.outfit} onChange={(v) => updateAvatar("outfit", v)} /></div><div className="mt-5"><SectionTitle title="Backdrop" /><div className="grid gap-2 sm:grid-cols-2">{backdropOptions.map((option) => <OptionButton key={option} active={avatar.backdrop === option} onClick={() => updateAvatar("backdrop", option)}>{option}</OptionButton>)}</div></div><Button disabled={!canStart} onClick={startGame} tone="success" className="mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-4 text-lg font-black text-black hover:bg-cyan-200">Start Career</Button></Card></div></main></div>;
}

function SettingsButton({ onClick }) {
  return <Button onClick={onClick} className="fixed right-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#06101d]/95 text-2xl text-cyan-200 shadow-2xl backdrop-blur hover:bg-white/10">⚙</Button>;
}

function BottomNav({ tab, setTab }) {
  const items = [{ id: "home", label: "Home", icon: "⌂" }, { id: "music", label: "Music", icon: "♪" }, { id: "career", label: "Career", icon: "★" }, { id: "shop", label: "Upgrades", icon: "▣" }, { id: "profile", label: "Profile", icon: "●" }];
  return <div className="sticky bottom-4 z-30 mx-auto mt-5 max-w-7xl px-4"><div className="grid grid-cols-5 gap-2 rounded-[1.7rem] border border-white/10 bg-[#06101d]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">{items.map((item) => <Button key={item.id} onClick={() => setTab(item.id)} className={cx("rounded-[1.25rem] px-2 py-3 text-center text-xs font-black uppercase tracking-wide", tab === item.id ? "bg-cyan-300/15 text-cyan-200" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200")}><div className="text-xl leading-none">{item.icon}</div><div className="mt-1">{item.label}</div></Button>)}</div></div>;
}

function TopBar({ week, fans, money, rank }) {
  const items = [{ icon: "▣", color: "blue", main: `Week ${week}`, sub: "Bedroom era" }, { icon: "☷", color: "teal", main: <TopNumber value={fans} />, sub: "Fans" }, { icon: "$", color: "lime", main: <TopNumber value={money} type="money" />, sub: "Money" }, { icon: "♛", color: "gold", main: rank, sub: "Rank" }];
  return <Card className="grid gap-2 p-3 sm:grid-cols-4">{items.map((item) => <div key={item.sub} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3"><IconBubble label={item.icon} color={item.color} /><div className="min-w-0"><div className={cx("truncate text-sm font-black", item.color === "gold" ? "text-amber-200" : "text-white")}>{item.main}</div><div className="text-xs text-zinc-500">{item.sub}</div></div></div>)}</Card>;
}

function HomeScreen({ state, actions }) {
  const { stageName, avatar, selectedStyles, creativity, stress, setup, lyrics, beats, rep, draft, recorded, producer, songs, log, mix, purchased, currentStudio, currentLyricsRecorded, lastCatalogEarnings, weeksSinceLastRelease, sideHustleOpen, fans } = state;
  return <div className="grid gap-5 xl:grid-cols-[0.9fr_1.35fr] animate-[tabFade_.22s_ease-out]"><AvatarCard stageName={stageName} avatar={avatar} compact /><div className="space-y-5"><Card className="p-5"><div className="flex items-start justify-between gap-3"><div><SectionTitle title="Current Sound" /><div className="flex flex-wrap gap-2">{selectedStyles.map((style) => <span key={style.name} className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-bold text-cyan-200">{style.name}</span>)}</div></div><Button onClick={() => actions.setTab("music")} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10">Edit</Button></div></Card><Card className="p-5"><SectionTitle title="Artist Status" right="skill system" /><div className="space-y-3"><StatBar label="Creativity" value={creativity} color="teal" icon="C" hint={`Inspiration multiplier: ${getCreativityMultiplier(creativity).toFixed(2)}x. Affects writing and own beats.`} /><StatBar label="Stress" value={stress} color="coral" icon="S" hint="Performance fatigue. High stress hurts recordings only." /><InfoCard icon="L" color="blue" title={`Lyrics: ${lyrics} (effective: ${Math.round(getEffectiveSkill(lyrics))})`} text="Raw writing talent. Uncapped. Diminishing returns above 100." /><InfoCard icon="B" color="gold" title={`Beats: ${beats} (effective: ${Math.round(getEffectiveSkill(beats))})`} text="Raw beat making talent. Uncapped. Only matters when making own beats." /><InfoCard icon="P" color="pink" title={`Production: ${setup} (effective: ${Math.round(getEffectiveSkill(setup))})`} text="Mixing and engineering. Multiplies final song quality." /><InfoCard icon="R" color="purple" title={`Reputation: ${rep.toLocaleString()}`} text={`${getReputationMilestone(rep)}${getNextReputationMilestone(rep) ? ` • next milestone at ${getNextReputationMilestone(rep).toLocaleString()}` : " • max milestone reached"}`} /></div></Card></div><Card className="p-4 xl:col-span-2"><div className="mb-4 grid gap-3 md:grid-cols-3"><InfoCard icon="$" color="lime" title={`Catalog earnings: ${formatMoney(lastCatalogEarnings.money)} this week`} text={`${lastCatalogEarnings.streams.toLocaleString()} passive streams • +${lastCatalogEarnings.fans} fans`} /><InfoCard icon="W" color={weeksSinceLastRelease >= 3 ? "gold" : "gray"} title={`Weeks since last release: ${weeksSinceLastRelease}`} text={weeksSinceLastRelease >= 3 ? "Fans are waiting on a new drop." : "Audience is still warm."} /><div className="rounded-2xl border border-white/10 bg-black/20 p-3"><Button disabled={fans >= 5000} onClick={() => actions.setSideHustleOpen(!sideHustleOpen)} className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white hover:bg-white/10 disabled:text-zinc-600">{fans >= 5000 ? "you're too big for that now" : "Side Hustles"}</Button>{sideHustleOpen && fans < 5000 ? <div className="mt-3 grid gap-2">{sideHustles.map((hustle) => <Button key={hustle.name} onClick={() => actions.doSideHustle(hustle)} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left text-xs text-zinc-300 hover:bg-white/10"><div className="font-black text-white">{hustle.name}</div><div>+{formatMoney(hustle.money)}{hustle.stress ? `, +${hustle.stress} stress` : ""}{hustle.creativity ? `, +${hustle.creativity} creativity` : ""} • takes 1 week</div></Button>)}</div> : null}</div></div><div className="grid grid-cols-4 overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/20 text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-400"><div className="border-r border-white/10 bg-cyan-300/10 py-3 text-cyan-200">Notebook</div><div className="border-r border-white/10 bg-pink-300/10 py-3 text-pink-200">Mic</div><div className="border-r border-white/10 bg-amber-300/10 py-3 text-amber-200">Release</div><div className="bg-violet-300/10 py-3 text-violet-200">Rest</div></div><div className="mt-4 grid gap-3 md:grid-cols-4"><ActionButton color="teal" icon="✎" title="Write Song" sub={draft ? `${draft.rerollsLeft} rewrites left` : "New song: 3 rolls"} disabled={draft && draft.rerollsLeft <= 0} onClick={actions.writeSong} /><ActionButton color="pink" icon="●" title="Record Track" sub={currentLyricsRecorded ? "Current lyrics recorded" : `At ${currentStudio.name}`} disabled={currentLyricsRecorded} onClick={actions.recordSong} /><ActionButton color="gold" icon="↑" title="Release Track" sub="Gains fans, money, rep" onClick={actions.releaseSong} tone="success" /><ActionButton color="purple" icon="☾" title="Rest" sub="Recover + next week" onClick={actions.rest} /></div><div className="mt-4 text-center text-xs font-black uppercase tracking-[0.38em] text-zinc-500">Write → Record → Release → Rest / Next Week</div></Card><div className="grid gap-5 xl:col-span-2 lg:grid-cols-2"><Card className="p-5"><SectionTitle title="Current Draft" right={draft ? `${draft.rerollsLeft} rewrites left` : "empty"} />{draft ? <DraftCard draft={draft} setSongTitle={actions.setSongTitle} /> : <EmptyState text="No draft yet. Name a song and write it." />}</Card><Card className="p-5"><SectionTitle title="Recording Studio" right={currentStudio.name} /><div className="flex gap-4"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-500/20 to-black text-3xl">◉</div><div><div className="text-xl font-black text-amber-200">{currentStudio.name}</div><div className="mt-1 text-sm capitalize text-zinc-400">{currentStudio.description}</div><div className="mt-3 text-sm text-zinc-500">Beat source: {producer.name}</div></div></div></Card></div><div className="grid gap-5 xl:col-span-2 lg:grid-cols-3"><Card className="p-5"><SectionTitle title="Recent Tracks" /><div className="space-y-3">{songs.length ? songs.slice(0, 3).map((song) => <TrackRow key={song.id} song={song} />) : <EmptyState text="No tracks yet." />}</div></Card><Card className="p-5"><SectionTitle title="Career Mix" /><CareerMix mix={mix} /></Card><Card className="p-5"><SectionTitle title="Live World" /><div className="space-y-3">{log.slice(0, 4).map((item, index) => <EventLogItem key={`${item.text}-${index}`} item={item} />)}</div></Card></div><Card className="p-5 xl:col-span-2"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><SectionTitle title="Upgrades" right="gear + skills" /><div className="text-sm text-zinc-400">Lyrics, Beats, and Production are uncapped artist stats.</div></div><Button onClick={() => actions.setTab("shop")} className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black text-black hover:bg-amber-200">Open Upgrades</Button></div><div className="grid gap-3 md:grid-cols-3">{studioUpgrades.map((item) => <UpgradeButton key={item.name} item={item} owned={purchased.includes(item.name)} onClick={() => actions.buyUpgrade(item)} />)}</div></Card></div>;
}

function ActionButton({ color, icon, title, sub, onClick, disabled, tone = "click" }) {
  const map = { teal: "border-cyan-300/30 bg-cyan-300/10 hover:bg-cyan-300/15", pink: "border-pink-300/30 bg-pink-300/10 hover:bg-pink-300/15", gold: "border-amber-300/30 bg-amber-300/10 hover:bg-amber-300/15", purple: "border-violet-300/30 bg-violet-300/10 hover:bg-violet-300/15" };
  return <Button tone={tone} onClick={onClick} disabled={disabled} className={cx("rounded-[1.4rem] border p-5 text-left", map[color])}><IconBubble label={icon} color={color} /><div className="mt-4 text-lg font-black text-white">{title}</div><div className="mt-1 text-sm text-zinc-400">{sub}</div></Button>;
}

function DraftCard({ draft, setSongTitle }) {
  return <div className="flex gap-4"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#10263b] to-black text-3xl">☾</div><div className="min-w-0 flex-1"><TextInput label="Song Title" value={draft.title} onChange={setSongTitle} placeholder="Name the track" /><div className="mt-3 text-sm text-zinc-400">Concept: {draft.concept}</div><div className="mt-2 text-xs text-zinc-500">Beat: {draft.beat} • {draft.beatTier}</div><div className="mt-3 flex items-center gap-3 text-xs text-zinc-400"><span>Draft Quality</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all duration-500" style={{ width: `${draft.quality}%` }} /></div><span className="font-bold text-cyan-200">{draft.quality}/100</span></div></div></div>;
}

function CareerMix({ mix }) {
  return <div className="space-y-2 text-sm"><MixLine label="Virality" value={mix.viral} color="bg-rose-400" /><MixLine label="Craft" value={mix.craft} color="bg-cyan-300" /><MixLine label="Underground" value={mix.underground} color="bg-violet-300" /><MixLine label="Mainstream" value={mix.mainstream} color="bg-amber-300" /></div>;
}

function MixLine({ label, value, color }) {
  return <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-zinc-300"><span className={cx("h-3 w-3 rounded-full", color)} />{label}</span><span className="font-bold text-white">{value.toFixed(1)}</span></div>;
}

function UpgradeButton({ item, owned, onClick }) {
  return <Button disabled={owned} onClick={onClick} className={cx("rounded-2xl border p-4 text-left", owned ? "border-lime-300/30 bg-lime-300/10" : "border-white/10 bg-white/5 hover:bg-white/10")}><IconBubble label="S" color="gold" /><div className="mt-3 text-sm font-black text-white">{item.name}</div><div className="text-xs text-zinc-500">{item.detail}</div><div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-black text-amber-100">{item.effect}</div><div className="mt-2 text-[11px] text-zinc-400">{item.helps}</div><div className="mt-2 text-xs font-bold text-amber-200">{owned ? "Owned" : formatMoney(item.cost)}</div></Button>;
}

function TrackRow({ song, onSelect, active }) {
  return <div className={cx("flex items-center gap-3 rounded-2xl border p-3 animate-[slideEntry_.25s_ease-out]", active ? "border-amber-300/50 bg-amber-300/10" : "border-white/10 bg-white/5")}><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-pink-500/20 text-xl">♪</div><div className="min-w-0 flex-1"><div className="truncate font-bold text-white">{song.title}</div><div className={cx("text-xs font-black uppercase", song.released ? "text-lime-300" : active ? "text-amber-200" : "text-blue-300")}>{song.released ? "Released" : active ? "Selected Draft" : "Recorded Draft"}</div><div className="text-xs text-zinc-500">{song.released ? `${song.streams.toLocaleString()} streams` : `${song.studio} • ${getQualityTier(song.quality)} • quality ${song.quality}/100`}</div></div>{!song.released && onSelect ? <Button onClick={() => onSelect(song)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300 hover:bg-white/10">{active ? "Ready" : "Select"}</Button> : <IconBubble label="▶" color={song.released ? "lime" : "blue"} />}</div>;
}

function MusicScreen({ state, actions }) {
  const { songs, draft, recorded, selectedStyles, songTitleInput, unlockedStudios, currentStudio, producer, currentLyricsRecorded, creativity, beats, hoveredBeat, fans } = state;
  const playerForBeat = { skills: { beats }, creativity };
  const previewBeat = hoveredBeat || producer;
  const previewTier = beatTierForProducer(previewBeat, playerForBeat);
  const previewQuality = beatQualityForProducer(previewBeat, playerForBeat);
  const recordedDrafts = songs.filter((song) => !song.released);
  const releasedSongs = songs.filter((song) => song.released);
  return <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] animate-[tabFade_.22s_ease-out]"><Card className="p-5"><SectionTitle title="Make A Track" right={draft ? `${draft.rerollsLeft} rewrites left` : "new song"} />{!draft ? <TextInput label="Song Title" value={songTitleInput} onChange={actions.setSongTitleInput} placeholder="Name your song before writing" /> : <DraftCard draft={draft} setSongTitle={actions.setSongTitle} />}<div className="mt-4 grid grid-cols-2 gap-3"><Button onClick={actions.writeSong} disabled={draft && draft.rerollsLeft <= 0} className="rounded-2xl bg-cyan-300 px-4 py-3 font-black text-black">{draft ? "Rewrite" : "Write"}</Button><Button onClick={actions.recordSong} disabled={currentLyricsRecorded} className="rounded-2xl bg-pink-400 px-4 py-3 font-black text-black">{currentLyricsRecorded ? "Recorded" : "Record"}</Button><Button tone="success" onClick={actions.releaseSong} className="rounded-2xl bg-amber-300 px-4 py-3 font-black text-black">Release</Button><Button onClick={actions.rest} className="rounded-2xl bg-violet-400 px-4 py-3 font-black text-black">Rest / Next Week</Button></div><div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400 md:grid-cols-2"><div><span className="font-black text-cyan-200">Write:</span> uses Lyrics, Beat Source, and Creativity.</div><div><span className="font-black text-pink-200">Record:</span> uses Production, studio quality, and Stress.</div><div><span className="font-black text-amber-200">Release:</span> turns quality into fans, money, rep, and streams.</div><div><span className="font-black text-violet-200">Rest:</span> restores Creativity, lowers Stress, and starts the next week.</div></div></Card><Card className="p-5"><SectionTitle title="Recording Studio" right={currentStudio.name} /><div className="grid gap-3 sm:grid-cols-2">{studios.map((studio) => { const unlocked = unlockedStudios.includes(studio.name); return <Button key={studio.name} disabled={!unlocked} onClick={() => actions.setStudio(studio.name)} className={cx("rounded-2xl border p-4 text-left", currentStudio.name === studio.name ? "border-amber-300 bg-amber-300/15" : unlocked ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-white/5 bg-black/20 text-zinc-600")}><div className="font-black text-white">{studio.name}</div><div className="mt-1 text-xs text-zinc-500">{unlocked ? `${studio.description} • +${studio.quality} quality` : `Unlock with upgrade`}</div></Button>; })}</div><div className="mt-5"><SectionTitle title="Beat Source" right={`preview: ${previewTier}`} /><div className="mb-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-xs text-cyan-100">Make own beat uses your BEATS skill and current creativity. Higher skill + creativity = better beat.</div><div className="grid gap-2 sm:grid-cols-2">{producers.map((item) => { const tier = beatTierForProducer(item, playerForBeat); const quality = beatQualityForProducer(item, playerForBeat); const selected = producer.id === item.id; return <Button key={item.id} onMouseEnter={() => actions.setHoveredBeat(item)} onMouseLeave={() => actions.setHoveredBeat(null)} title={item.id === "own" ? "uses your BEATS skill and current creativity to make a beat. higher skill + creativity = better beat." : `${formatMoney(item.price)} • quality: ${tier}`} onClick={() => actions.hireProducer(item)} className={cx("rounded-2xl border p-3 text-left text-sm", selected ? "border-cyan-300 bg-cyan-300/15" : "border-white/10 bg-white/5 hover:bg-white/10")}><div className="font-bold text-white">{item.id === "own" ? "make own beat" : item.name} {item.price ? `(${formatMoney(item.price)})` : "(free)"}</div><div className="text-xs text-zinc-500">{item.id === "own" ? `your beats: ${tier}` : `quality: ${tier}`} • predicted {quality}</div></Button>; })}</div></div></Card><Card className="p-5 lg:col-span-2"><SectionTitle title="Recorded Drafts" right={`${recordedDrafts.length} saved`} /><div className="space-y-3">{recordedDrafts.length ? recordedDrafts.map((song) => <TrackRow key={song.id} song={song} active={recorded?.id === song.id} onSelect={actions.selectRecordedDraft} />) : <EmptyState text="No recorded drafts yet." />}</div></Card><Card className="p-5 lg:col-span-2"><SectionTitle title="Released Songs" right={`${releasedSongs.length} released`} /><div className="space-y-3">{releasedSongs.length ? releasedSongs.map((song) => <TrackRow key={song.id} song={song} />) : <EmptyState text="No releases yet." />}</div></Card><Card className="p-5 lg:col-span-2"><SectionTitle title="Styles" right="pick up to 3" /><div className="flex flex-wrap gap-2">{styles.map((style) => <Button key={style.name} onClick={() => actions.toggleStyle(style)} className={cx("rounded-full border px-3 py-1 text-xs font-bold capitalize", selectedStyles.some((item) => item.name === style.name) ? "border-cyan-300 bg-cyan-300/20 text-cyan-100" : "border-white/10 text-zinc-400")}>{style.name}</Button>)}</div></Card></div>;
}

function CareerScreen({ state }) {
  const { fans, rep, rank, week, mix, log, setup } = state;
  const nextGoal = Math.max(100, Math.ceil((fans + 100) / 100) * 100);
  return <div className="grid gap-5 lg:grid-cols-3 animate-[tabFade_.22s_ease-out]"><Card className="p-5 lg:col-span-2"><SectionTitle title="Career Progress" right={`Week ${week}`} /><div className="text-3xl font-black text-white">{rank}</div><div className="mt-2 text-sm text-zinc-400"><TopNumber value={fans} /> fans • <TopNumber value={rep} /> reputation • {setup} production</div><div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 transition-all duration-500" style={{ width: `${clamp((fans / nextGoal) * 100, 0, 100)}%` }} /></div><div className="mt-2 text-xs text-zinc-500">Next fan milestone: {nextGoal.toLocaleString()}</div></Card><Card className="p-5"><SectionTitle title="Lane Analysis" /><CareerMix mix={mix} /></Card><Card className="p-5 lg:col-span-3"><SectionTitle title="World Events" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{log.map((item, index) => <EventLogItem key={`${item.text}-${index}`} item={item} />)}</div></Card></div>;
}

function ArtistStatUpgradeCard({ title, icon, color, value, hint, onUpgrade }) {
  const cost = artistStatCost(value);
  const gain = artistStatGain(cost);
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><IconBubble label={icon} color={color} /><div><div className="font-black text-white">{title}: {value}</div><div className="text-xs text-zinc-500">effective: {Math.round(getEffectiveSkill(value))}</div></div></div><div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-zinc-300">uncapped</div></div><div className="mt-3 text-xs leading-relaxed text-zinc-400">{hint}</div><Button onClick={onUpgrade} className="mt-4 w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-black hover:bg-cyan-200">Upgrade +{gain} • {formatMoney(cost)}</Button></div>;
}

function ShopScreen({ state, actions }) {
  const { money, purchased, setup, lyrics, beats, unlockedStudios, purchasedSkills, activeSkills, fans } = state;
  return <div className="space-y-5 animate-[tabFade_.22s_ease-out]"><Card className="p-5"><SectionTitle title="Upgrades" right={<TopNumber value={money} type="money" />} /><div className="text-2xl font-black text-white">Upgrade your artist stats and studio access.</div><p className="mt-2 text-sm text-zinc-400">Lyrics, Beats, and Production are uncapped. Higher raw skill has diminishing returns through effective skill.</p></Card><Card className="p-5"><SectionTitle title="Artist Stat Training" right="uncapped" /><div className="grid gap-4 md:grid-cols-3"><ArtistStatUpgradeCard title="Lyrics" icon="L" color="blue" value={lyrics} hint="Raw writing talent. Affected by creativity." onUpgrade={() => actions.trainArtistStat("lyrics")} /><ArtistStatUpgradeCard title="Beats" icon="B" color="gold" value={beats} hint="Only matters when making own beats." onUpgrade={() => actions.trainArtistStat("beats")} /><ArtistStatUpgradeCard title="Production" icon="P" color="pink" value={setup} hint="Multiplies final song quality." onUpgrade={() => actions.trainArtistStat("production")} /></div></Card><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{studioUpgrades.map((item) => <Card key={item.name} className="p-5"><div className="flex items-start justify-between gap-3"><IconBubble label="S" color="gold" /><div className="text-right text-sm font-black text-amber-200">{purchased.includes(item.name) ? "Owned" : formatMoney(item.cost)}</div></div><div className="mt-4 text-xl font-black text-white">{item.name}</div><div className="mt-1 text-sm text-zinc-500">{item.detail}</div><div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100"><div className="font-black">{item.effect}</div><div className="mt-1 text-xs text-amber-100/70">{item.helps}</div></div><Button disabled={purchased.includes(item.name)} onClick={() => actions.buyUpgrade(item)} className="mt-5 w-full rounded-2xl bg-amber-300 px-4 py-3 font-black text-black hover:bg-amber-200">{purchased.includes(item.name) ? "Purchased" : "Buy Upgrade"}</Button></Card>)}</div><Card className="p-5"><SectionTitle title="Studio Unlocks" /><div className="grid gap-3 md:grid-cols-4">{studios.map((studio) => <div key={studio.name} className={cx("rounded-2xl border p-4", unlockedStudios.includes(studio.name) ? "border-cyan-300/30 bg-cyan-300/10" : "border-white/10 bg-white/5")}><div className="font-black text-white">{studio.name}</div><div className="mt-1 text-xs text-zinc-500">{unlockedStudios.includes(studio.name) ? `Unlocked • +${studio.quality} quality` : "Buy upgrade to unlock"}</div></div>)}</div></Card><Card className="p-5"><SectionTitle title="Skills" right={`${activeSkills.length}/3 active`} /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{skills.map((skill) => { const unlocked = fans >= skill.unlockFans; const bought = purchasedSkills.includes(skill.id); const active = activeSkills.includes(skill.id); return <div key={skill.id} className={cx("rounded-2xl border p-4", active ? "border-cyan-300/50 bg-cyan-300/15" : bought ? "border-lime-300/30 bg-lime-300/10" : unlocked ? "border-white/10 bg-white/5" : "border-white/5 bg-black/20 opacity-70")}><div className="font-black text-white">{skill.name}</div><div className="mt-1 text-xs text-zinc-400">{skill.text}</div><div className="mt-3 text-xs text-zinc-500">Unlock: {skill.unlockFans.toLocaleString()} fans • Cost: {formatMoney(skill.cost)}</div><Button disabled={!unlocked || (!bought && money < skill.cost)} onClick={() => bought ? actions.toggleSkill(skill) : actions.buySkill(skill)} className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10">{!unlocked ? "Locked" : bought ? active ? "Deactivate" : "Activate" : "Buy Skill"}</Button></div>; })}</div></Card></div>;
}

function ProfileScreen({ state, actions }) {
  const { stageName, avatar, fans, rep, creativity, setup, lyrics, beats, selectedStyles, saveTransferText, saveTransferStatus } = state;
  const styleScore = clamp(setup + selectedStyles.length * 18, 0, 100);
  const charisma = clamp(30 + rep / 2, 0, 100);
  const hype = clamp(fans / 8, 0, 100);
  const authenticity = clamp(60 + creativity / 5, 0, 100);
  return <div className="grid gap-5 xl:grid-cols-[0.95fr_1.25fr] animate-[tabFade_.22s_ease-out]"><AvatarCard stageName={stageName} avatar={avatar} /><div className="space-y-5"><Card className="p-5"><SectionTitle title="Identity" right="editable" /><TextInput label="Rapper Name" value={stageName} onChange={actions.setStageName} placeholder="Enter stage name" /></Card><Card className="p-5"><SectionTitle title="Stats" /><div className="grid gap-3"><InfoCard icon="L" color="blue" title={`Lyrics: ${lyrics} (effective: ${Math.round(getEffectiveSkill(lyrics))})`} text="Raw writing talent. Uncapped. Diminishing returns." /><InfoCard icon="B" color="gold" title={`Beats: ${beats} (effective: ${Math.round(getEffectiveSkill(beats))})`} text="Own-beat skill. Uncapped." /><InfoCard icon="P" color="pink" title={`Production: ${setup} (effective: ${Math.round(getEffectiveSkill(setup))})`} text="Final quality multiplier." /></div></Card><Card className="p-5"><SectionTitle title="Archetype" /><div className="mb-4 text-2xl font-black text-amber-200">Bedroom Rookie</div><div className="space-y-3"><StatBar label="Charisma" value={charisma} color="purple" icon="C" /><StatBar label="Style" value={styleScore} color="teal" icon="S" /><StatBar label="Hype" value={hype} color="gold" icon="H" /><StatBar label="Authenticity" value={authenticity} color="lime" icon="A" /></div></Card><Card className="p-5"><SectionTitle title="Save / Transfer" right="silent" /><div className="grid gap-3 sm:grid-cols-2"><Button onClick={actions.copySaveLink} className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-black hover:bg-cyan-200">Copy Save Link</Button><Button onClick={actions.exportSaveCode} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10">Export Save Code</Button></div><textarea value={saveTransferText} onChange={(event) => actions.setSaveTransferText(event.target.value)} placeholder="Paste save code here to import, or use Copy Save Link." className="mt-3 h-24 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-cyan-300/60" /><Button onClick={actions.importSaveCode} className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10">Import Save Code</Button>{saveTransferStatus ? <div className="mt-3 text-xs text-zinc-500">{saveTransferStatus}</div> : null}</Card><Card className="p-5"><SectionTitle title="Appearance" right="live preview" /><div className="grid gap-3 sm:grid-cols-2"><CustomizerGroup title="Hair" options={hairOptions} value={avatar.hair} onChange={(value) => actions.updateAvatar("hair", value)} /><CustomizerGroup title="Skin Tone" options={skinToneOptions.map((item) => item.name)} value={avatar.skinTone} onChange={(value) => actions.updateAvatar("skinTone", value)} /><CustomizerGroup title="Outfit" options={outfitOptions} value={avatar.outfit} onChange={(value) => actions.updateAvatar("outfit", value)} /><CustomizerGroup title="Backdrop" options={backdropOptions} value={avatar.backdrop} onChange={(value) => actions.updateAvatar("backdrop", value)} /><div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2"><div className="mb-3 flex items-center justify-between gap-3"><div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Accessories</div><div className="text-[11px] font-bold text-zinc-500">unlock with fans</div></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{accessoryOptions.map((item) => { const unlocked = fans >= item.unlockFans; const equipped = avatar.accessories?.includes(item.name); return <Button key={item.name} disabled={!unlocked} onClick={() => actions.toggleAccessory(item)} className={cx("rounded-2xl border p-3 text-left text-sm", equipped ? "border-amber-300 bg-amber-300/15 text-amber-100" : unlocked ? "border-white/10 bg-white/[0.035] text-zinc-300 hover:bg-white/10" : "border-white/5 bg-black/20 text-zinc-600")}><div className="font-black">{item.name}</div><div className="mt-1 text-xs opacity-70">{unlocked ? equipped ? "Equipped" : "Tap to equip" : `Needs ${item.unlockFans} fans`}</div></Button>; })}</div></div></div></Card></div></div>;
}

function CustomizerGroup({ title, options, value, onChange }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{title}</div><div className="grid gap-2">{options.map((option) => <OptionButton key={option} active={value === option} onClick={() => onChange(option)}>{option}</OptionButton>)}</div></div>;
}

export default function RapSimulatorPrototype() {
  const [started, setStarted] = useState(false);
  const [tab, setTabRaw] = useState("home");
  const [stageName, setStageName] = useState("");
  const [week, setWeek] = useState(1);
  const [fans, setFans] = useState(0);
  const [money, setMoney] = useState(0);
  const [rep, setRep] = useState(0);
  const [creativity, setCreativity] = useState(55);
  const [stress, setStress] = useState(10);
  const [lyrics, setLyrics] = useState(1);
  const [beats, setBeats] = useState(1);
  const [setup, setSetup] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState([styles[0]]);
  const [producer, setProducer] = useState(producers[0]);
  const [hoveredBeat, setHoveredBeat] = useState(null);
  const [currentStudioName, setCurrentStudioName] = useState("Bedroom");
  const [songTitleInput, setSongTitleInput] = useState("");
  const [draft, setDraft] = useState(null);
  const [recorded, setRecorded] = useState(null);
  const [songs, setSongs] = useState([]);
  const [log, setLog] = useState([{ text: "Week 1. No fans, no money, just a bedroom and dangerous confidence.", tone: "neutral" }]);
  const [purchased, setPurchased] = useState([]);
  const [purchasedSkills, setPurchasedSkills] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [labelContract, setLabelContract] = useState(null);
  const [labelCooldown, setLabelCooldown] = useState(0);
  const [activeRival, setActiveRival] = useState(null);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [rhythmSession, setRhythmSession] = useState(null);
  const [shownMilestones, setShownMilestones] = useState([]);
  const [milestoneMessage, setMilestoneMessage] = useState(null);
  const [peakFans, setPeakFans] = useState(0);
  const [lastReleaseWeek, setLastReleaseWeek] = useState(1);
  const [lastCatalogEarnings, setLastCatalogEarnings] = useState({ money: 0, fans: 0, streams: 0 });
  const [sideHustleOpen, setSideHustleOpen] = useState(false);
  const [floaters, setFloaters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [weekSplash, setWeekSplash] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [particles, setParticles] = useState([]);
  const [avatar, setAvatar] = useState({ hair: "Curly Fade", skinTone: "Medium Dark", outfit: "Plain Hoodie", backdrop: "Bedroom Studio", accessories: [] });
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [fps, setFps] = useState(0);
  const [saveTransferText, setSaveTransferText] = useState("");
  const [saveTransferStatus, setSaveTransferStatus] = useState("");
  const saveReadyRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch (error) {}
  }, []);

  useEffect(() => {
    window.__rapSimSettings = settings;
    try { window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (error) {}
  }, [settings]);

  useEffect(() => {
    if (!settings.showFps) return undefined;
    let frames = 0;
    let last = performance.now();
    let raf;
    function tick(now) {
      frames += 1;
      if (now - last >= 1000) {
        setFps(frames);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [settings.showFps]);

  function buildSaveObject() {
    return {
      started,
      tab,
      stageName,
      week,
      fans,
      money,
      rep,
      creativity,
      stress,
      lyrics,
      beats,
      setup,
      selectedStyles,
      producer,
      currentStudioName,
      songTitleInput,
      draft,
      recorded,
      songs,
      log,
      purchased,
      purchasedSkills,
      activeSkills,
      labelContract,
      labelCooldown,
      activeRival,
      shownMilestones,
      peakFans,
      lastReleaseWeek,
      lastCatalogEarnings,
      avatar,
    };
  }

  function applySaveObject(save) {
    if (!save) return false;
    try {
      if (typeof save.started === "boolean") setStarted(save.started);
      if (save.tab) setTabRaw(save.tab);
      if (save.stageName !== undefined) setStageName(save.stageName);
      if (save.week !== undefined) setWeek(save.week);
      if (save.fans !== undefined) setFans(save.fans);
      if (save.money !== undefined) setMoney(save.money);
      if (save.rep !== undefined) setRep(save.rep);
      if (save.creativity !== undefined) setCreativity(save.creativity);
      if (save.stress !== undefined) setStress(save.stress);
      if (save.lyrics !== undefined) setLyrics(save.lyrics);
      if (save.beats !== undefined) setBeats(save.beats);
      if (save.setup !== undefined) setSetup(save.setup);
      if (save.selectedStyles) setSelectedStyles(save.selectedStyles);
      if (save.producer) setProducer(save.producer);
      if (save.currentStudioName) setCurrentStudioName(save.currentStudioName);
      if (save.songTitleInput !== undefined) setSongTitleInput(save.songTitleInput);
      if (save.draft !== undefined) setDraft(save.draft);
      if (save.recorded !== undefined) setRecorded(save.recorded);
      if (save.songs) setSongs(save.songs);
      if (save.log) setLog(save.log);
      if (save.purchased) setPurchased(save.purchased);
      if (save.purchasedSkills) setPurchasedSkills(save.purchasedSkills);
      if (save.activeSkills) setActiveSkills(save.activeSkills);
      if (save.labelContract !== undefined) setLabelContract(save.labelContract);
      if (save.labelCooldown !== undefined) setLabelCooldown(save.labelCooldown);
      if (save.activeRival !== undefined) setActiveRival(save.activeRival);
      if (save.shownMilestones) setShownMilestones(save.shownMilestones);
      if (save.peakFans !== undefined) setPeakFans(save.peakFans);
      if (save.lastReleaseWeek !== undefined) setLastReleaseWeek(save.lastReleaseWeek);
      if (save.lastCatalogEarnings) setLastCatalogEarnings(save.lastCatalogEarnings);
      if (save.avatar) setAvatar(save.avatar);
      return true;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    try {
      const hash = window.location.hash || "";
      const hashSave = hash.includes(SAVE_HASH_PREFIX) ? decodeSaveData(hash) : null;
      const raw = window.localStorage.getItem(SAVE_KEY);
      const localSave = raw ? JSON.parse(raw) : null;
      applySaveObject(hashSave || localSave);
    } catch (error) {}
    setTimeout(() => { saveReadyRef.current = true; }, 0);
  }, []);

  useEffect(() => {
    if (!saveReadyRef.current || !settings.autosave) return;
    const saveTimeout = setTimeout(() => {
      try {
        const save = buildSaveObject();
        window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      } catch (error) {}
    }, 500);
    return () => clearTimeout(saveTimeout);
  }, [started, tab, stageName, week, fans, money, rep, creativity, stress, lyrics, beats, setup, selectedStyles, producer, currentStudioName, songTitleInput, draft, recorded, songs, log, purchased, purchasedSkills, activeSkills, labelContract, labelCooldown, activeRival, shownMilestones, peakFans, lastReleaseWeek, lastCatalogEarnings, avatar, settings.autosave]);

  const unlockedStudios = useMemo(() => {
    const unlockedNames = new Set(["Bedroom"]);
    studioUpgrades.forEach((item) => {
      if (item.studioName && purchased.includes(item.name)) unlockedNames.add(item.studioName);
    });
    return studios.filter((studio) => unlockedNames.has(studio.name)).map((studio) => studio.name);
  }, [purchased]);
  const currentStudio = studios.find((studio) => studio.name === currentStudioName && unlockedStudios.includes(studio.name)) || studios[0];
  const hasSkill = (id) => activeSkills.includes(id);
  const mix = useMemo(() => {
    const base = { craft: 0, viral: 0, underground: 0, mainstream: 0 };
    selectedStyles.forEach((style) => Object.entries(style.stats).forEach(([key, value]) => { base[key] += value; }));
    Object.entries(producer.bonus).forEach(([key, value]) => { base[key] += value; });
    const count = Math.max(1, selectedStyles.length);
    Object.keys(base).forEach((key) => { base[key] = base[key] / count; });
    return base;
  }, [selectedStyles, producer]);
  const careerScore = fans + rep * 65 + setup * 20;
  const rank = careerScore >= 18000 ? "Breakout Artist" : careerScore >= 9000 ? "Playlist Menace" : careerScore >= 4000 ? "Cult Fanbase Builder" : careerScore >= 1500 ? "Underground Favorite" : careerScore >= 500 ? "Local Internet Rumor" : "Unknown Bedroom Artist";

  function addFloater(text, delta) {
    if (!delta) return;
    const id = makeId();
    setFloaters((prev) => [...prev, { id, text, kind: delta < 0 ? "loss" : "gain" }]);
    setTimeout(() => setFloaters((prev) => prev.filter((item) => item.id !== id)), 1500);
  }

  function statChange(label, delta, setter, formatter = (value) => `${value}`) {
    setter((prev) => Math.max(0, prev + delta));
    addFloater(`${delta > 0 ? "+" : ""}${formatter(delta)} ${label}`, delta);
  }

  function checkFanMilestones(nextFans) {
    const newlyHit = fanMilestones.find((milestone) => nextFans >= milestone.value && !shownMilestones.includes(milestone.value));
    if (!newlyHit) return;
    setShownMilestones((prev) => [...prev, newlyHit.value]);
    setMilestoneMessage(newlyHit.text);
    playTone("success");
    setTimeout(() => setMilestoneMessage(null), 2400);
  }

  function changeFans(delta) {
    if (!delta) return;
    setFans((prev) => {
      const next = Math.max(0, prev + delta);
      checkFanMilestones(next);
      setPeakFans((peak) => Math.max(peak, next));
      return next;
    });
    addFloater(`${delta > 0 ? "+" : ""}${delta.toLocaleString()} fans`, delta);
  }

  function addLog(entry) {
    setLog((prev) => [entry, ...prev].slice(0, 8));
    playTone(entry.tone === "good" ? "ping" : entry.tone === "bad" ? "soft" : "click");
  }

  function runProgress(label, callback) {
    setProgress({ label });
    playTone("soft");
    setTimeout(() => { setProgress(null); callback(); }, 650);
  }

  function setTab(value) {
    playTone("click");
    setTabRaw(value);
  }

  function startGame() {
    if (!stageName.trim()) return;
    playTone("success");
    setStarted(true);
  }

  function updateAvatar(key, value) {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAccessory(item) {
    setAvatar((prev) => {
      const current = prev.accessories || [];
      return { ...prev, accessories: current.includes(item.name) ? current.filter((value) => value !== item.name) : [...current, item.name] };
    });
  }

  function calculateCatalogEarnings(nextWeek) {
    const releasedSongs = songs.filter((song) => song.released);
    const totals = releasedSongs.reduce((sum, song) => {
      const weeksSinceRelease = Math.max(0, nextWeek - (song.releaseWeek || week));
      const decay = 1 / (1 + weeksSinceRelease * 0.2);
      const weeklyPassiveStreams = song.quality * 3 * decay;
      const weeklyPassiveMoney = weeklyPassiveStreams * 0.002;
      const weeklyPassiveFans = Math.floor(weeklyPassiveStreams * 0.0001);
      return {
        streams: sum.streams + weeklyPassiveStreams,
        money: sum.money + weeklyPassiveMoney,
        fans: sum.fans + weeklyPassiveFans,
      };
    }, { streams: 0, money: 0, fans: 0 });
    return { streams: Math.round(totals.streams), money: Math.round(totals.money), fans: totals.fans };
  }

  function applyAudienceDecay(nextWeek) {
    const weeksSinceLastRelease = nextWeek - lastReleaseWeek;
    if (weeksSinceLastRelease < 3) return;
    addLog({ text: "fans are waiting on a new drop.", tone: "neutral" });
    const rate = weeksSinceLastRelease >= 10 ? 0.03 : weeksSinceLastRelease >= 5 ? 0.02 : 0.01;
    setFans((prev) => {
      const floor = Math.floor(peakFans * 0.8);
      const loss = Math.floor(prev * rate);
      const next = Math.max(floor, prev - loss);
      const actualLoss = prev - next;
      if (actualLoss > 0) addFloater(`-${actualLoss.toLocaleString()} fans`, -actualLoss);
      return next;
    });
  }

  function advanceWeek(extraStress = 0) {
    const nextWeek = week + 1;
    setWeek(nextWeek);
    setWeekSplash(nextWeek);
    setTimeout(() => setWeekSplash(null), 1200);
    const creativityDelta = Math.floor(Math.random() * 13) - 4;
    setCreativity((prev) => clamp(prev + creativityDelta, 0, 100));
    setStress((prev) => clamp(prev + extraStress - 4, 0, 100));
    const catalog = calculateCatalogEarnings(nextWeek);
    setLastCatalogEarnings(catalog);
    if (catalog.money > 0) statChange("catalog money", catalog.money, setMoney, (v) => formatMoney(Math.abs(v)));
    if (catalog.fans > 0) changeFans(catalog.fans);
    if (catalog.money > 0 || catalog.fans > 0) addLog({ text: `catalog earnings: ${formatMoney(catalog.money)} this week.`, tone: "good" });
    applyAudienceDecay(nextWeek);
  }

  function createDraftTitle() {
    return songTitleInput.trim() || titlePool[Math.floor(Math.random() * titlePool.length)];
  }

  function writeSong() {
    runProgress(draft ? "Rewriting lyrics" : "Writing song", () => {
      if (draft && draft.rerollsLeft <= 0) { addLog({ text: "No rewrites left on this song. Record it or live with the lyrics.", tone: "bad" }); setTabRaw("music"); return; }
      if (!draft && producer.price > money) { addLog({ text: `${producer.name} costs ${formatMoney(producer.price)}. Pick a cheaper beat first.`, tone: "bad" }); setTabRaw("music"); return; }
      const title = draft ? draft.title : createDraftTitle();
      const concept = concepts[Math.floor(Math.random() * concepts.length)];
      const style = selectedStyles[Math.floor(Math.random() * selectedStyles.length)] || styles[0];
      const draftParts = calculateDraftQuality({ lyricsSkill: lyrics, beatsSkill: beats, creativity, producer });
      const maxRolls = hasSkill("perfectionist") ? 4 : 3;
      const quality = clamp(Math.round(draftParts.draftQuality + Math.random() * 4), 1, 100);
      if (!draft && producer.price > 0) statChange("money", -producer.price, setMoney, (v) => formatMoney(Math.abs(v)));
      setDraft((prev) => ({ id: prev?.id || makeId(), title, concept, style: style.name, beat: producer.name, beatQuality: draftParts.beatQuality, beatTier: draftParts.beatTier, quality, rerollsLeft: prev ? prev.rerollsLeft - 1 : maxRolls - 1, lyricVersion: (prev?.lyricVersion || 0) + 1 }));
      setRecorded(null);
      setSongTitleInput(title);
      statChange("creativity", -10, setCreativity);
      addLog({ text: `Wrote ${title} with ${producer.name} (${draftParts.beatTier}). ${draft ? "Rewrite used." : "First draft locked in."}`, tone: "neutral" });
      setTabRaw("music");
    });
  }

  function setSongTitle(value) {
    setDraft((prev) => prev ? { ...prev, title: value } : prev);
    setSongTitleInput(value);
  }

  function recordSong() {
    if (!draft) { addLog({ text: "No draft loaded. Write a song first.", tone: "bad" }); setTabRaw("music"); return; }
    if (recorded && recorded.draftId === draft.id && recorded.lyricVersion === draft.lyricVersion) { addLog({ text: "These exact lyrics are already recorded. Rewrite or release the take.", tone: "bad" }); setTabRaw("music"); return; }
    setRhythmSession({ draft: { ...draft }, startedAt: Date.now() });
  }

  function finishRecordingTake(summary) {
    if (!rhythmSession?.draft) return;
    const sourceDraft = rhythmSession.draft;
    const finalQuality = clamp(Math.round(calculateFinalSongQuality({ draftQuality: sourceDraft.quality, productionSkill: setup, stress, studioQuality: currentStudio.quality, recordingMultiplier: summary.multiplier })), 1, 100);
    const take = { ...sourceDraft, id: makeId(), draftId: sourceDraft.id, lyricVersion: sourceDraft.lyricVersion, quality: finalQuality, takeRating: summary.label, takeAccuracy: summary.accuracy, released: false, streams: 0, studio: currentStudio.name };
    setRecorded(take);
    setSongs((prev) => [take, ...prev].slice(0, 12));
    setDraft(null);
    setSongTitleInput("");
    setRhythmSession(null);
    statChange("stress", 8, setStress);
    addLog({ text: `Recorded ${take.title}. ${summary.label}. Quality ${finalQuality}/100. Saved to Recorded Drafts.`, tone: "neutral" });
    setTabRaw("music");
  }

  function payForRhythmRetake() {
    if (money < 20) { addLog({ text: "Need $20 for a retake.", tone: "bad" }); return false; }
    statChange("money", -20, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("stress", 10, setStress);
    return true;
  }

  function applyRandomReleaseEvent() {
    if (fans < 1000) return;
    const viralChance = hasSkill("trendsetter") ? 0.375 : 0.25;
    if (Math.random() > viralChance) return;
    const event = { text: "A clip got a tiny push. Not viral, but not invisible either.", fans: 80, money: 18, rep: 6, stress: 6, tone: "good" };
    changeFans(event.fans);
    statChange("money", event.money, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", event.rep, setRep);
    statChange("stress", event.stress, setStress);
    addLog(event);
  }

  function maybeRivalTrigger() {
    if (fans < 10000 || activeRival) return;
    if (Math.random() > 0.03) return;
    const rival = { name: rivalNames[Math.floor(Math.random() * rivalNames.length)], heat: 1 };
    setActiveRival(rival);
    setPendingChoice({ kind: "rival", rival });
  }

  function releaseSong() {
    runProgress("Uploading release", () => {
      if (!recorded) { addLog({ text: "No recorded draft selected. Record or select one first.", tone: "bad" }); setTabRaw("music"); return; }
      const quality = recorded.quality;
      let fanGain = Math.max(3, Math.round(quality * (0.35 + mix.viral * 0.08 + mix.mainstream * 0.05) + Math.random() * 25));
      if (hasSkill("marketing")) fanGain = Math.round(fanGain * 1.2);
      if (fans >= 10000 && Math.random() < 0.12) { fanGain = Math.round(fanGain * 1.35); addLog({ text: "A playlist placement pushed the release farther than expected.", tone: "good" }); }
      let moneyGain = Math.round(fanGain * (0.15 + mix.mainstream * 0.025) + quality * 0.15);
      if (fans < 1000) moneyGain = Math.round(moneyGain * 2.5);
      else if (fans < 10000) moneyGain = Math.round(moneyGain * 1.5);
      const repGain = Math.max(1, Math.round(quality / 24 + mix.craft * 0.5 + mix.underground * 0.35));
      const releasedSong = { ...recorded, title: recorded.title.trim() || "Untitled Demo", released: true, releaseWeek: week, streams: fanGain * 9 };
      setSongs((prev) => [releasedSong, ...prev.filter((song) => song.id !== recorded.id)].slice(0, 12));
      changeFans(fanGain);
      statChange("money", moneyGain, setMoney, (v) => formatMoney(Math.abs(v)));
      statChange("rep", repGain, setRep);
      setDraft(null);
      setRecorded(null);
      setLastReleaseWeek(week);
      setSongTitleInput("");
      const burst = Array.from({ length: 18 }, (_, index) => ({ id: makeId(), x: 20 + Math.random() * 60, y: 25 + Math.random() * 45, delay: index * 22 }));
      setParticles(burst);
      setCelebration({ title: releasedSong.title, stats: [{ label: "fans", value: `+${fanGain}` }, { label: "money", value: `+${formatMoney(moneyGain)}` }, { label: "rep", value: `+${repGain}` }] });
      [0, 220, 440].forEach((delay) => setTimeout(() => playTone("success"), delay));
      setTimeout(() => { setCelebration(null); setParticles([]); }, 2600);
      addLog({ text: `Released ${releasedSong.title}. +${fanGain} fans, +${formatMoney(moneyGain)}, +${repGain} rep.`, tone: "good" });
      applyRandomReleaseEvent();
      maybeRivalTrigger();
      setTabRaw("home");
    });
  }

  function selectRecordedDraft(song) {
    setRecorded(song);
    addLog({ text: `${song.title} selected as the draft to release.`, tone: "neutral" });
    setTabRaw("music");
  }

  function currentRestPool() {
    if (fans >= 50000) return restPools.big;
    if (fans >= 10000) return restPools.mid;
    if (fans >= 1000) return restPools.small;
    return [];
  }

  function maybeRestEvent() {
    if (fans < 1000) return;
    if (Math.random() > 0.4) { addLog({ text: "Quiet week. Nothing major happened.", tone: "neutral" }); return; }
    const pool = currentRestPool();
    const event = pool[Math.floor(Math.random() * pool.length)];
    const stressEffect = event.stress > 0 && event.tone === "bad" && hasSkill("thickSkin") ? Math.round(event.stress / 2) : event.stress;
    changeFans(event.fans || 0);
    statChange("money", event.money || 0, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange("rep", event.rep || 0, setRep);
    statChange("stress", stressEffect || 0, setStress);
    addLog(event);
  }

  function doSideHustle(hustle) {
    if (fans >= 5000) { addLog({ text: "you're too big for that now.", tone: "neutral" }); return; }
    runProgress(hustle.name, () => {
      statChange("money", hustle.money, setMoney, (v) => formatMoney(Math.abs(v)));
      if (hustle.stress) statChange("stress", hustle.stress, setStress);
      if (hustle.creativity) statChange("creativity", hustle.creativity, setCreativity);
      addLog({ text: `${hustle.name}: +${formatMoney(hustle.money)}${hustle.stress ? `, +${hustle.stress} stress` : ""}${hustle.creativity ? `, +${hustle.creativity} creativity` : ""}.`, tone: "neutral" });
      setSideHustleOpen(false);
      advanceWeek(hustle.stress || 0);
    });
  }

  function rest() {
    runProgress("Taking a reset night", () => {
      statChange("creativity", 24, setCreativity);
      statChange("stress", -22, setStress);
      addLog({ text: "Reset night. A new week starts after this.", tone: "neutral" });
      advanceWeek(-10);
      setLabelCooldown((prev) => Math.max(0, prev - 1));
      if (labelContract) {
        const royalty = Math.max(100, Math.round(fans * 0.002 * (labelContract.royalties / 100)));
        statChange("money", royalty, setMoney, (v) => formatMoney(Math.abs(v)));
        addLog({ text: `${labelContract.type} royalty check came in: ${formatMoney(royalty)}.`, tone: "good" });
      }
      maybeRestEvent();
    });
  }

  function buyUpgrade(item) {
    if (purchased.includes(item.name)) return;
    if (money < item.cost) { addLog({ text: `Need ${formatMoney(item.cost - money)} more for ${item.name}.`, tone: "bad" }); return; }
    statChange("money", -item.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    setPurchased((prev) => [...prev, item.name]);
    if (item.stat === "lyrics") statChange("lyrics", item.gain, setLyrics);
    if (item.stat === "beats") statChange("beats", item.gain, setBeats);
    if (item.stat === "production") statChange("production", item.gain, setSetup);
    if (item.studioName) setCurrentStudioName(item.studioName);
    addLog({ text: `Bought ${item.name}. ${item.effect}.`, tone: "good" });
  }

  function trainArtistStat(type) {
    const config = {
      lyrics: { label: "lyrics", value: lyrics, setter: setLyrics },
      beats: { label: "beats", value: beats, setter: setBeats },
      production: { label: "production", value: setup, setter: setSetup },
    }[type];
    const cost = artistStatCost(config.value);
    const gain = artistStatGain(cost);
    if (money < cost) { addLog({ text: `Need ${formatMoney(cost - money)} more to upgrade ${config.label}.`, tone: "bad" }); return; }
    statChange("money", -cost, setMoney, (v) => formatMoney(Math.abs(v)));
    statChange(config.label, gain, config.setter);
    addLog({ text: `${config.label} upgraded by +${gain}. Effective skill: ${Math.round(getEffectiveSkill(config.value + gain))}.`, tone: "good" });
  }

  function hireProducer(item) {
    if (producer.id === item.id) { addLog({ text: `${item.name} is already selected.`, tone: "neutral" }); return; }
    setProducer(item);
    const tier = beatTierForProducer(item, { skills: { beats }, creativity });
    addLog({ text: `${item.name} selected. Beat quality: ${tier}.`, tone: "neutral" });
  }

  function buySkill(skill) {
    if (fans < skill.unlockFans || purchasedSkills.includes(skill.id)) return;
    if (money < skill.cost) { addLog({ text: `${skill.name} costs ${formatMoney(skill.cost)}. Not enough money yet.`, tone: "bad" }); return; }
    statChange("money", -skill.cost, setMoney, (v) => formatMoney(Math.abs(v)));
    setPurchasedSkills((prev) => [...prev, skill.id]);
    setActiveSkills((prev) => prev.length < 3 ? [...prev, skill.id] : prev);
    addLog({ text: `${skill.name} learned. ${skill.text}`, tone: "good" });
  }

  function toggleSkill(skill) {
    if (!purchasedSkills.includes(skill.id)) return;
    setActiveSkills((prev) => {
      if (prev.includes(skill.id)) return prev.filter((id) => id !== skill.id);
      if (prev.length >= 3) { addLog({ text: "Only 3 skills can be active at once.", tone: "bad" }); return prev; }
      return [...prev, skill.id];
    });
  }

  function toggleStyle(style) {
    setSelectedStyles((prev) => {
      const exists = prev.some((item) => item.name === style.name);
      if (exists) return prev.length === 1 ? prev : prev.filter((item) => item.name !== style.name);
      if (prev.length >= 3) return [prev[1], prev[2], style];
      return [...prev, style];
    });
  }

  function setStudio(name) {
    if (!unlockedStudios.includes(name)) return;
    setCurrentStudioName(name);
    addLog({ text: `Recording studio set to ${name}.`, tone: "neutral" });
  }

  function handleRival(choice) {
    if (!pendingChoice?.rival) return;
    const rival = pendingChoice.rival;
    setPendingChoice(null);
    if (choice === "diss") {
      const hit = Math.random() < 0.48;
      if (hit) { changeFans(Math.round(fans * 0.5)); statChange("rep", 20, setRep); addLog({ text: `Your diss at ${rival.name} hit hard.`, tone: "good" }); }
      else { changeFans(-Math.round(fans * 0.2)); statChange("stress", 18, setStress); addLog({ text: `The diss at ${rival.name} flopped.`, tone: "bad" }); }
    }
    if (choice === "social") { changeFans(Math.round(fans * 0.05)); statChange("rep", 4, setRep); addLog({ text: `You responded to ${rival.name} online.`, tone: "neutral" }); }
    if (choice === "ignore") { statChange("rep", -5, setRep); addLog({ text: `You ignored ${rival.name}.`, tone: "neutral" }); }
    setActiveRival(null);
  }

  async function copySaveLink() {
    const encoded = encodeSaveData(buildSaveObject());
    if (!encoded) { setSaveTransferStatus("Could not create save link."); return; }
    const url = `${window.location.origin}${window.location.pathname}#${SAVE_HASH_PREFIX}${encoded}`;
    setSaveTransferText(encoded);
    try {
      await navigator.clipboard.writeText(url);
      setSaveTransferStatus("Save link copied.");
    } catch (error) {
      setSaveTransferStatus("Save link created. Copy the code below if clipboard is blocked.");
    }
  }

  function exportSaveCode() {
    const encoded = encodeSaveData(buildSaveObject());
    setSaveTransferText(encoded);
    setSaveTransferStatus(encoded ? "Save code created." : "Could not create save code.");
  }

  function importSaveCode() {
    const save = decodeSaveData(saveTransferText);
    const loaded = applySaveObject(save);
    if (loaded) {
      try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (error) {}
      setSaveTransferStatus("Save imported.");
    } else {
      setSaveTransferStatus("That save code did not work.");
    }
  }

  function saveNow() {
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(buildSaveObject()));
      setToast("Game saved.");
      setTimeout(() => setToast(""), 1400);
    } catch (error) {
      setToast("Save failed.");
      setTimeout(() => setToast(""), 1400);
    }
  }

  function exportSaveJson() {
    const blob = new Blob([JSON.stringify(buildSaveObject(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rap-sim-save.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importSaveJson(text) {
    try {
      const save = JSON.parse(text);
      const loaded = applySaveObject(save);
      if (!loaded) throw new Error("bad save");
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
      setToast("Save imported.");
    } catch (error) {
      setToast("Import failed.");
    }
    setTimeout(() => setToast(""), 1400);
  }

  function resetGame() {
    try {
      window.localStorage.removeItem(SAVE_KEY);
      window.location.hash = "";
    } catch (error) {}
    setStarted(false);
    setTabRaw("home");
    setStageName("");
    setWeek(1);
    setFans(0);
    setMoney(0);
    setRep(0);
    setCreativity(55);
    setStress(10);
    setLyrics(1);
    setBeats(1);
    setSetup(1);
    setSelectedStyles([styles[0]]);
    setProducer(producers[0]);
    setCurrentStudioName("Bedroom");
    setSongTitleInput("");
    setDraft(null);
    setRecorded(null);
    setSongs([]);
    setLog([{ text: "Week 1. No fans, no money, just a bedroom and dangerous confidence.", tone: "neutral" }]);
    setPurchased([]);
    setPurchasedSkills([]);
    setActiveSkills([]);
    setLabelContract(null);
    setLabelCooldown(0);
    setActiveRival(null);
    setShownMilestones([]);
    setPeakFans(0);
    setLastReleaseWeek(1);
    setLastCatalogEarnings({ money: 0, fans: 0, streams: 0 });
    setAvatar({ hair: "Curly Fade", skinTone: "Medium Dark", outfit: "Plain Hoodie", backdrop: "Bedroom Studio", accessories: [] });
    setSettingsOpen(false);
  }

  const currentLyricsRecorded = Boolean(draft && recorded && recorded.draftId === draft.id && recorded.lyricVersion === draft.lyricVersion);
  const rhythmModal = rhythmSession ? <RhythmMiniGame draft={rhythmSession.draft} player={{ lyrics, stress, creativity }} studio={currentStudio} selectedStyles={selectedStyles} onUseTake={finishRecordingTake} onRetakeCost={payForRhythmRetake} onCancel={() => setRhythmSession(null)} previewFinalQuality={(multiplier) => clamp(Math.round(calculateFinalSongQuality({ draftQuality: rhythmSession.draft.quality, productionSkill: setup, stress, studioQuality: currentStudio.quality, recordingMultiplier: multiplier })), 1, 100)} /> : null;
  const eventModal = pendingChoice?.kind === "rival" ? <ChoiceModal title={`${pendingChoice.rival.name} just dissed you`} text="Pick how to respond." options={[{ label: "Drop Diss Track", sub: "High risk: lose 20% fans or gain 50% fans + rep", onClick: () => handleRival("diss"), tone: "bad" }, { label: "Respond on Social", sub: "Smaller swing, no song needed", onClick: () => handleRival("social"), tone: "neutral" }, { label: "Ignore", sub: "Small rep loss, no risk", onClick: () => handleRival("ignore"), tone: "neutral" }]} /> : null;
  const modal = rhythmModal || eventModal;
  const weeksSinceLastRelease = week - lastReleaseWeek;
  const state = { stageName, avatar, week, fans, money, rank, selectedStyles, creativity, stress, setup, lyrics, beats, rep, draft, recorded, producer, songs, log, mix, purchased, songTitleInput, unlockedStudios, currentStudio, currentLyricsRecorded, purchasedSkills, activeSkills, hoveredBeat, labelContract, activeRival, lastCatalogEarnings, weeksSinceLastRelease, sideHustleOpen, saveTransferText, saveTransferStatus };
  const actions = { setTab, writeSong, recordSong, releaseSong, rest, buyUpgrade, trainArtistStat, hireProducer, toggleStyle, updateAvatar, toggleAccessory, setStageName, setSongTitleInput, setSongTitle, setStudio, selectRecordedDraft, buySkill, toggleSkill, setHoveredBeat, setSideHustleOpen, doSideHustle, copySaveLink, exportSaveCode, importSaveCode, setSaveTransferText };

  if (!started) return <><FeedbackStyles /><StartScreen stageName={stageName} setStageName={setStageName} avatar={avatar} updateAvatar={updateAvatar} startGame={startGame} settings={settings} /></>;

  return <div className="min-h-screen bg-[#030814] text-white"><FeedbackStyles /><div className="fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,.14),transparent_32%),radial-gradient(circle_at_45%_92%,rgba(251,191,36,.08),transparent_30%)]" /><div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" /><main className="relative mx-auto max-w-7xl px-4 py-5 pb-28"><TopBar week={week} fans={fans} money={money} rank={rank} /><div className="mt-5">{tab === "home" && <HomeScreen state={state} actions={actions} />}{tab === "music" && <MusicScreen state={state} actions={actions} />}{tab === "career" && <CareerScreen state={state} />}{tab === "shop" && <ShopScreen state={state} actions={actions} />}{tab === "profile" && <ProfileScreen state={state} actions={actions} />}</div></main><SettingsButton onClick={() => setSettingsOpen(true)} /><BottomNav tab={tab} setTab={setTab} />{settingsOpen ? <SettingsModal settings={settings} setSettings={setSettings} onClose={() => setSettingsOpen(false)} onSaveNow={saveNow} onExportJson={exportSaveJson} onImportJson={importSaveJson} onResetGame={resetGame} playerName={stageName} version="0.4.0" fps={fps} /> : null}{toast ? <div className="fixed bottom-24 left-1/2 z-[160] -translate-x-1/2 rounded-2xl border border-cyan-300/30 bg-[#06101d]/95 px-5 py-3 text-sm font-black text-cyan-100 shadow-2xl">{toast}</div> : null}<FeedbackLayer floaters={floaters} progress={progress} weekSplash={weekSplash} celebration={celebration} particles={particles} milestone={milestoneMessage} modal={modal} /></div>;
}
