import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './settings.css';
import { publishSettings } from '../global/theme';
import SettingsHero from '../components/Hero/SettingsHero';
import { NavContext } from '../components/Navbar/Nanbar.jsx';

/* =====================================================================
   UnfilteredU settings page (React).  Usage:  <Settings />
   Sections: Look & feel, Personal details, Privacy, Alerts.
   Every change applies instantly and autosaves to localStorage.
   Backend hook: replace the body of api.saveSettings().
   All colleges / people shown are sample data.
   ===================================================================== */

/* ---------- sample data ---------- */
const COLS = { a: 'Sample College A', b: 'Sample College B', c: 'Sample College C', d: 'Sample College D', e: 'Sample College E' };
const BRANCH = { cse: 'Computer Science', ece: 'Electronics', mech: 'Mechanical', civil: 'Civil', comm: 'Commerce', arts: 'Arts' };
const YEARS = ['2022', '2023', '2024', '2025', '2026', '2027'];
const CATS = {
  reviews: { name: 'New reviews', desc: 'From colleges you follow' },
  replies: { name: 'Replies', desc: 'Someone answered your review' },
};
const MOODS = {
  classic:   { name: 'Default',   desc: 'The Unfiltered look, as designed.',        bars: 1, v: { mul: 1,   tw: .4, speed: 0,  big: 1,    glow: .35, blur: 14, card: .72, line: .14, dur: 1 } },
  calm:      { name: 'Calm',      desc: 'Fewer stars, slow drift, soft glass.',     bars: 1, v: { mul: .55, tw: .2, speed: .5, big: 1,    glow: .15, blur: 22, card: .62, line: .1,  dur: 1.7 } },
  focus:     { name: 'Focus',     desc: 'Almost no sky. Solid cards. Extras hidden.', bars: 0, v: { mul: .08, tw: 0,  speed: 0,  big: 1,    glow: 0,   blur: 4,  card: .97, line: .24, dur: .7 } },
  energetic: { name: 'Energetic', desc: 'Dense sky, bright glow, fast and snappy.', bars: 3, v: { mul: 1.8, tw: 1,  speed: 4,  big: 1.35, glow: 1,   blur: 10, card: .7,  line: .34, dur: .5 } },
  dreamy:    { name: 'Dreamy',    desc: 'Big soft stars, heavy blur, slow float.',  bars: 2, v: { mul: .85, tw: .6, speed: .9, big: 2.6,  glow: .7, blur: 36, card: .4,  line: .18, dur: 2 } },
};
const TABS = [['look', 'Look & feel'], ['me', 'Personal'], ['voice', 'Privacy'], ['alerts', 'Alerts']];

/* ---------- defaults + validation of saved data ---------- */
const REDUCE = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEF = {
  look: { mood: 'classic', density: 100, size: 100, font: 'inter', spacing: 'cozy', contrast: 'normal', motion: REDUCE ? 'reduce' : 'full' },
  me: { name: '', user: '', email: '', bio: '', college: 'a', branch: 'cse', year: '2025', university: '', personalEmail: '', semester: '' },
  voice: { byline: 'anon', showCollege: true, showBranch: false, showYear: false, vis: 'members', replies: true, dms: false },
  alerts: { cat: { reviews: true, replies: true }, follow: ['a', 'b'], quiet: { on: true, from: '22:00', to: '07:00' } },
};
const E = (...a) => ({ t: 'enum', a }), I = (a, b) => ({ t: 'int', a, b }), B = { t: 'bool' }, S = a => ({ t: 'set', a }), T = { t: 'time' };
const STR = (n, re) => ({ t: 'str', n, re });
const SC = {
  look: { mood: E(...Object.keys(MOODS)), density: I(20, 200), size: I(85, 140), font: E('inter', 'easy', 'serif'), spacing: E('compact', 'cozy', 'roomy'), contrast: E('normal', 'high'), motion: E('full', 'reduce') },
  me: { name: STR(40, /^[^<>]*$/), user: STR(20, /^[a-z0-9_]*$/), email: STR(80, /^([^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,})?$/), bio: STR(140, /^[^<>]*$/), college: E(...Object.keys(COLS)), branch: E(...Object.keys(BRANCH)), year: E(...YEARS), university: STR(80, /^[^<>]*$/), personalEmail: STR(80, /^([^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,})?$/), semester: E('', '1', '2', '3', '4', '5', '6', '7', '8') },
  voice: { byline: E('anon', 'handle', 'verified'), showCollege: B, showBranch: B, showYear: B, vis: E('public', 'members', 'private'), replies: B, dms: B },
  alerts: { cat: { reviews: B, replies: B }, follow: S(Object.keys(COLS)), quiet: { on: B, from: T, to: T } },
};
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function check(s, r, d) {
  if (r === undefined) return clone(d);
  switch (s.t) {
    case 'enum': return s.a.includes(r) ? r : d;
    case 'int': return typeof r === 'number' && Number.isFinite(r) ? Math.round(clamp(r, s.a, s.b)) : d;
    case 'bool': return typeof r === 'boolean' ? r : d;
    case 'set': return Array.isArray(r) ? s.a.filter(x => r.includes(x)) : clone(d);
    case 'str': return typeof r === 'string' && r.length <= s.n && s.re.test(r) ? r : d;
    case 'time': return typeof r === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(r) ? r : d;
    default: return d;
  }
}
function clean(def, sc, raw) {
  const out = {};
  for (const k of Object.keys(def)) {
    const r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw[k] : undefined;
    out[k] = sc[k].t ? check(sc[k], r, def[k]) : clean(def[k], sc[k], r);
  }
  return out;
}
const KEY = 'unfiltered.settings.v4';
const PROFILE_OWNER_KEY = 'unfiltered.settings.profileOwner.v1';
const load = () => { try { return clean(DEF, SC, JSON.parse(localStorage.getItem(KEY))); } catch { return clean(DEF, SC, null); } };

/* ---------- backend hook ---------- */
const api = {
  async saveSettings(/* settings */) {
    // TODO backend: await fetch('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(settings) });
    return true;
  },
};

/* ---------- look engine: mood + sliders -> CSS variables + star config ---------- */
function derive(s) {
  const L = s.look, e = MOODS[L.mood].v, reduce = L.motion === 'reduce', hc = L.contrast === 'high';
  const mulK = L.density / 100, mul = e.mul * mulK;
  const tw = reduce ? 0 : e.tw, speed = reduce ? 0 : e.speed, dur = reduce ? 0.001 : e.dur;
  const vars = {
    '--dur': dur, '--glow': e.glow.toFixed(3), '--blur': e.blur + 'px', '--card': `rgba(8,8,10,${e.card})`,
    '--tz': L.size / 100, '--pad': { compact: .78, cozy: 1, roomy: 1.3 }[L.spacing],
    '--ls': L.font === 'easy' ? '.03em' : '0em', '--line': hc ? null : `rgba(255,255,255,${e.line})`,
  };
  const focus = L.mood === 'focus';
  const total = Math.min(mul, 2) / 2 * 30 + tw * 20 + Math.min(speed, 4) / 4 * 20 + e.glow * 15 + (reduce ? 0 : dur < .8 ? 10 : dur > 1.4 ? 3 : 6) + (focus ? 0 : 10);
  const items = [];
  if (tw > .15 && mul > .15) items.push('twinkling stars');
  if (speed > .2 && mul > .15) items.push('drifting stars');
  if (mul > 1.2) items.push('a dense sky');
  if (e.glow > .5) items.push('strong glow');
  if (!reduce) items.push('animations');
  return { vars, stars: { mul, tw, speed, big: e.big, still: reduce }, score: Math.round(clamp(total / 105 * 100, 0, 100)), items };
}

/* ---------- privacy exposure score ---------- */
function exposure(v) {
  let p = { anon: 4, handle: 28, verified: 38 }[v.byline];
  if (v.showCollege) p += 18; if (v.showBranch) p += 14; if (v.showYear) p += 12;
  p += { public: 14, members: 6, private: 0 }[v.vis]; if (v.dms) p += 4;
  return clamp(p, 0, 100);
}
const mins = t => { const [a, b] = t.split(':').map(Number); return a * 60 + b; };
function inQuiet(q, now) {
  if (!q.on) return false;
  const x = mins(now), a = mins(q.from), b = mins(q.to);
  if (a === b) return false;
  return a < b ? x >= a && x < b : x >= a || x < b;  // wraps past midnight
}

/* ---------- small reusable controls ---------- */
function Seg({ value, onChange, options, label, labelledBy, full = true, className = '' }) {
  const idx = Math.max(0, options.findIndex(o => o[0] === value));
  const refs = useRef([]);
  const key = (e, i) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const n = options.length, j = (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : n - 1)) % n;
    refs.current[j].focus(); onChange(options[j][0]);
  };
  return (
    <div className={`seg ${full ? 'full' : ''} ${className}`} role="radiogroup" aria-label={label} aria-labelledby={labelledBy} style={{ '--n': options.length, '--i': idx }}>
      {options.map(([v, n], i) => (
        <button key={v} type="button" role="radio" aria-checked={v === value} tabIndex={i === idx ? 0 : -1}
          ref={el => (refs.current[i] = el)} onClick={() => onChange(v)} onKeyDown={e => key(e, i)}>{n}</button>
      ))}
    </div>
  );
}
function Switch({ id, label, desc, on, onChange }) {
  return (
    <div className="row" onClick={e => { if (e.target.closest('[role=switch]') === null) onChange(!on); }}>
      <div><div className="t" id={id}>{label}</div>{desc && <div className="d">{desc}</div>}</div>
      <button type="button" role="switch" aria-checked={on} aria-labelledby={id} onClick={() => onChange(!on)} />
    </div>
  );
}
function Range({ id, label, value, min, max, step, onChange }) {
  return (
    <div className="field rng">
      <div className="rl"><label htmlFor={id}>{label}</label><output htmlFor={id}>{value}%</output></div>
      <input type="range" id={id} min={min} max={max} step={step} value={value} aria-valuetext={`${value}%`} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}
const Shield = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></svg>
);

/* ---------- main component ---------- */
export default function Settings() {
  const navigation = useContext(NavContext);
  const loginUser = navigation?.user ?? null;
  const loginIdentity = String(loginUser?.collegeEmail || loginUser?.email || loginUser?.personalEmail || '').trim().toLowerCase();

  const [state, setState] = useState(load);
  const [tab, setTab] = useState(() => (TABS.some(t => t[0] === window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'look'));
  const [viewer, setViewer] = useState('stranger');
  const [status, setStatus] = useState('saved');   // 'saved' | 'saving'
  const [toasts, setToasts] = useState([]);
  const [palOpen, setPalOpen] = useState(false);
  const [errs, setErrs] = useState({ user: '', email: '', personalEmail: '' });
  const [raw, setRaw] = useState({ user: state.me.user, email: state.me.email, personalEmail: state.me.personalEmail }); // what the user is typing
  const [glitchOn, setGlitchOn] = useState(false);
  const lastMood = useRef(state.look.mood);

  /* Import Login details into the existing Personal tab once per account. */
  useEffect(() => {
    if (!loginUser || !loginIdentity) return;

    let savedOwner = '';
    try {
      savedOwner = localStorage.getItem(PROFILE_OWNER_KEY) || '';
    } catch {
      // Keep the in-memory sync working if browser storage is unavailable.
    }

    // The same account has already been imported. Keep any edits made in Settings.
    if (savedOwner === loginIdentity) return;

    const email = String(loginUser.email || loginUser.collegeEmail || '').trim().slice(0, 80);
    const semester = String(loginUser.semester || '');
    const nextProfile = {
      ...DEF.me,
      name: String(loginUser.name || '').slice(0, 40),
      email,
      university: String(loginUser.university || '').slice(0, 80),
      personalEmail: String(loginUser.personalEmail || '').trim().slice(0, 80),
      semester: ['1', '2', '3', '4', '5', '6', '7', '8'].includes(semester) ? semester : '',
    };

    setState(current => ({ ...current, me: nextProfile }));
    setRaw({ user: '', email, personalEmail: nextProfile.personalEmail });
    setErrs({ user: '', email: '', personalEmail: '' });

    try {
      localStorage.setItem(PROFILE_OWNER_KEY, loginIdentity);
    } catch {
      // Existing autosave still handles the profile state where possible.
    }
  }, [loginUser, loginIdentity]);

  const d = useMemo(() => derive(state), [state.look]); // eslint-disable-line react-hooks/exhaustive-deps
  const motionOn = state.look.motion !== 'reduce';

  /* generic updater: set(section, key, value) or set('alerts', 'cat.reviews', value) */
  const set = useCallback((sec, path, val) => {
    setState(s => {
      const n = clone(s), ks = path.split('.'); let o = n[sec];
      for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
      o[ks[ks.length - 1]] = val; return n;
    });
  }, []);
  const toast = useCallback(msg => {
    const id = Math.random();
    setToasts(t => [...t.slice(-2), { id, msg }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  /* apply look to <html> */
  useEffect(() => {
    const root = document.documentElement, L = state.look;
    for (const k in d.vars) d.vars[k] == null ? root.style.removeProperty(k) : root.style.setProperty(k, d.vars[k]);
    root.dataset.mood = L.mood; root.dataset.font = L.font; root.dataset.contrast = L.contrast; root.dataset.motion = L.motion;
  }, [d, state.look]);

  /* Publish live look changes to the shared global theme/background. */
  useEffect(() => { publishSettings({ look: state.look, stars: d.stars }); }, [state.look, d.stars]);

  /* mood change: brief white veil + hero glitch */
  useEffect(() => {
    if (state.look.mood === lastMood.current) return;
    lastMood.current = state.look.mood;
    if (!motionOn) return;
    publishSettings({ look: state.look, stars: d.stars });
    setGlitchOn(true); const t = setTimeout(() => setGlitchOn(false), 1000); return () => clearTimeout(t);
  }, [state.look.mood]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (motionOn) { const a = setTimeout(() => setGlitchOn(true), 400), b = setTimeout(() => setGlitchOn(false), 1400); return () => { clearTimeout(a); clearTimeout(b); }; } }, []); // eslint-disable-line

  /* autosave: debounce 450ms, then localStorage + backend hook */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setStatus('saving');
    const t = setTimeout(async () => {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { toast('Could not save on this device. Changes last until you close this tab.'); }
      try { await api.saveSettings(state); } catch { toast('Saved on this device. Could not reach the server.'); }
      setStatus('saved');
    }, 450);
    return () => clearTimeout(t);
  }, [state, toast]);

  /* tabs + url hash */
  useEffect(() => { try { window.history.replaceState(null, '', '#' + tab); } catch {} }, [tab]);
  const tabKey = e => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return; e.preventDefault();
    const i = TABS.findIndex(t => t[0] === tab), n = TABS.length;
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : n - 1)) % n;
    setTab(TABS[j][0]);
  };
  /* global shortcuts: Ctrl/Cmd+K palette, Alt+1..4 tabs */
  useEffect(() => {
    const h = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalOpen(o => !o); }
      if (e.altKey && /^[1-4]$/.test(e.key)) { e.preventDefault(); setTab(TABS[Number(e.key) - 1][0]); }
    };
    addEventListener('keydown', h); return () => removeEventListener('keydown', h);
  }, []);

  const reset = sec => {
    setState(s => ({ ...s, [sec]: clone(DEF[sec]) }));
    if (sec === 'me') { setRaw({ user: '', email: '', personalEmail: '' }); setErrs({ user: '', email: '', personalEmail: '' }); }
    toast('Section reset.');
  };

  /* ---- personal details: validated text inputs ---- */
  const onUser = v => {
    setRaw(r => ({ ...r, user: v })); const t = v.trim();
    if (!t) { setErrs(e => ({ ...e, user: '' })); set('me', 'user', ''); }
    else if (/^[a-z0-9_]{3,20}$/i.test(t)) { setErrs(e => ({ ...e, user: '' })); set('me', 'user', t.toLowerCase()); }
    else { setErrs(e => ({ ...e, user: 'Use 3–20 letters, numbers or underscores.' })); set('me', 'user', ''); }
  };
  const onEmail = v => {
    setRaw(r => ({ ...r, email: v })); const t = v.trim();
    if (!t) { setErrs(e => ({ ...e, email: '' })); set('me', 'email', ''); }
    else if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(t)) { setErrs(e => ({ ...e, email: '' })); set('me', 'email', t); }
    else { setErrs(e => ({ ...e, email: 'Enter a valid email, like you@example.com.' })); set('me', 'email', ''); }
  };
  const onPersonalEmail = v => {
    setRaw(r => ({ ...r, personalEmail: v })); const t = v.trim();
    if (!t) { setErrs(e => ({ ...e, personalEmail: '' })); set('me', 'personalEmail', ''); }
    else if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(t)) { setErrs(e => ({ ...e, personalEmail: '' })); set('me', 'personalEmail', t); }
    else { setErrs(e => ({ ...e, personalEmail: 'Enter a valid email, like you@example.com.' })); set('me', 'personalEmail', ''); }
  };

  const L = state.look, M = state.me, V = state.voice, A = state.alerts;
  const dsLab = d.score < 25 ? 'Low' : d.score < 55 ? 'Medium' : 'High';
  const x = exposure(V), exLab = x < 25 ? 'Low' : x < 55 ? 'Moderate' : 'High';
  const need = [['full name', M.name.trim()], ['username', M.user], ['email', M.email], ['bio', M.bio.trim()]];
  const pct = Math.round(50 + need.filter(n => n[1]).length / need.length * 50);
  const bylineName = V.byline === 'anon' ? 'Anonymous senior' : M.user ? '@' + M.user : '@your_username';
  const live = {
    look: `${MOODS[L.mood].name} · stars ${L.density}% · text ${L.size}% · distraction ${dsLab.toLowerCase()}`,
    me: `${pct}% complete · ${M.user ? '@' + M.user : 'no username'}`,
    voice: `Identifiable: ${exLab.toLowerCase()} (${x})`,
    alerts: `${Object.values(A.cat).filter(Boolean).length} of 2 on · quiet ${A.quiet.on && A.quiet.from !== A.quiet.to ? A.quiet.from + '–' + A.quiet.to : 'off'}`,
  }[tab];

  return (
    <div className="uu-settings" data-solid data-mood={L.mood} data-font={L.font} data-contrast={L.contrast} data-motion={L.motion} style={d.vars}>
      <header className="top settings-top">
  <div className="brand settings-brand">
    <SettingsHero glitchOn={glitchOn} />
  </div>

  <button
    className="btn search"
    type="button"
    aria-haspopup="dialog"
    onClick={() => setPalOpen(true)}
  >
    <span className="ph-txt">Search</span>
    <kbd>Ctrl</kbd>
    <kbd>K</kbd>
  </button>

  <div
    className={`status ${status === 'saving' ? 'saving' : 'pop'}`}
    role="status"
    aria-live="polite"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle className="ring" cx="12" cy="12" r="10" />
      <path className="tick" d="M7 12.5l3.2 3.2L17 9" />
    </svg>
    <span>{status === 'saving' ? 'Saving…' : 'All changes saved'}</span>
  </div>
</header>

      <main className="wrap" id="main">

        <div className="tabs seg" role="tablist" aria-label="Settings sections" style={{ '--n': TABS.length, '--i': TABS.findIndex(t => t[0] === tab) }} onKeyDown={tabKey}>
          {TABS.map(([id, name]) => (
            <button key={id} type="button" role="tab" id={`t-${id}`} aria-controls={`p-${id}`} aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)}>{name}</button>
          ))}
        </div>

        {/* =============== LOOK & FEEL =============== */}
        <section className={`panel ${tab === 'look' ? 'on' : ''}`} id="p-look" role="tabpanel" aria-labelledby="t-look" hidden={tab !== 'look'}>
          <header className="ph">
            <div><p className="eyebrow">Look &amp; feel</p><h2>Change how it feels.</h2><p className="sub deco">Pick a mood and the whole page follows, sky included. Then tune it for easy reading.</p></div>
            <button className="btn sec sm" type="button" onClick={() => reset('look')}>Reset</button>
          </header>
          <a className="livebar" href="#lookPrev"><span>{live}</span><span>Preview</span></a>
          <div className="cols">
            <div className="glass">
              <div className="grp">
                <div className="gh"><h3 id="moodH">Mood</h3><p>Sky, glass, glow and speed change together.</p></div>
                <div className="moods" role="radiogroup" aria-labelledby="moodH">
                  {Object.entries(MOODS).map(([k, m]) => (
                    <button key={k} type="button" role="radio" className="mood" aria-checked={L.mood === k} onClick={() => set('look', 'mood', k)}>
                      <span className="n">{m.name}</span><span className="ds">{m.desc}</span>
                      <span className="bars" aria-hidden="true">{[1, 2, 3].map(i => <i key={i} className={i <= m.bars ? 'on' : ''} />)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grp">
                <div className="gh"><h3>Sky</h3><p>Set how many stars fill the sky.</p></div>
                <Range id="rDen" label="Star density" value={L.density} min={20} max={200} step={10} onChange={v => set('look', 'density', v)} />
              </div>
              <div className="grp">
                <div className="gh"><h3>Reading</h3><p>Make long reviews easy on your eyes.</p></div>
                <Range id="rSize" label="Text size" value={L.size} min={85} max={140} step={5} onChange={v => set('look', 'size', v)} />
                <div className="field"><span className="lab" id="fontL">Typeface</span><Seg labelledBy="fontL" value={L.font} onChange={v => set('look', 'font', v)} options={[['inter', 'Inter'], ['easy', 'Easy read'], ['serif', 'Serif']]} /></div>
                <div className="field"><span className="lab" id="spL">Spacing</span><Seg labelledBy="spL" value={L.spacing} onChange={v => set('look', 'spacing', v)} options={[['compact', 'Compact'], ['cozy', 'Cozy'], ['roomy', 'Roomy']]} /></div>
                <div className="grid2">
                  <div className="field"><span className="lab" id="ctL">Contrast</span><Seg labelledBy="ctL" value={L.contrast} onChange={v => set('look', 'contrast', v)} options={[['normal', 'Normal'], ['high', 'High']]} /></div>
                  <div className="field"><span className="lab" id="mtL">Motion</span><Seg labelledBy="mtL" value={L.motion} onChange={v => set('look', 'motion', v)} options={[['full', 'Full'], ['reduce', 'Reduced']]} /></div>
                </div>
              </div>
            </div>
            <div className="glass sticky" id="lookPrev">
              <div className="pv">
                <div className="mrow"><h3>Preview</h3><span className="sample">Sample data</span></div>
                <div className="rv">
                  <div className="hd"><span className="col">Sample College A</span><span className="rt">4 / 5 · Academics</span></div>
                  <p className="txt">Lectures move at a good pace and the lab staff will stay back to help. The timetable changes more than it should, so check it every Monday.</p>
                </div>
              </div>
              <div className="pv">
                <div className="mrow"><h3>Distraction level</h3><span className="big">{d.score}</span></div>
                <div className="meter"><i style={{ '--v': d.score + '%' }} /></div>
                <p className="sub">{dsLab}. {d.items.length ? `Moving or glowing now: ${d.items.join(', ')}.` : 'Nothing is moving.'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =============== PERSONAL DETAILS =============== */}
        <section className={`panel ${tab === 'me' ? 'on' : ''}`} id="p-me" role="tabpanel" aria-labelledby="t-me" hidden={tab !== 'me'}>
          <header className="ph">
            <div><p className="eyebrow">Personal details</p><h2>Who you are.</h2><p className="sub deco">Your account details. Nothing here shows on a review unless you allow it in Privacy.</p></div>
            <button className="btn sec sm" type="button" onClick={() => reset('me')}>Reset</button>
          </header>
          <a className="livebar" href="#mePrev"><span>{live}</span><span>Profile</span></a>
          <div className="cols">
            <div className="glass">
              <div className="grp">
                <div className="gh"><h3>Account</h3><p>Sample details. Use your own.</p></div>
                <div className="grid2">
                  <div className="field"><label className="lab" htmlFor="mName">Full name</label><input className="inp" id="mName" value={M.name} maxLength={40} autoComplete="name" placeholder="Your name" onChange={e => set('me', 'name', e.target.value.replace(/[<>]/g, ''))} /></div>
                  <div className="field"><label className="lab" htmlFor="mUser">Username</label>
                    <input className="inp" id="mUser" value={raw.user} maxLength={20} autoComplete="off" autoCapitalize="off" spellCheck="false" placeholder="e.g. quiet_senior" aria-invalid={errs.user ? 'true' : undefined} aria-describedby="mUserE" onChange={e => onUser(e.target.value)} />
                    <div className="err" id="mUserE" aria-live="polite">{errs.user}</div></div>
                </div>
                <div className="field"><label className="lab" htmlFor="mEmail">Email</label>
                  <input className="inp" id="mEmail" type="email" value={raw.email} maxLength={80} autoComplete="email" placeholder="you@example.com" aria-invalid={errs.email ? 'true' : undefined} aria-describedby="mEmailE" onChange={e => onEmail(e.target.value)} />
                  <div className="err" id="mEmailE" aria-live="polite">{errs.email}</div></div>
              </div>
              <div className="grp">
                <div className="gh"><h3>Your college</h3><p>Sample colleges. This is what you can show on reviews.</p></div>
                <div className="grid3">
                  <div className="field"><label className="lab" htmlFor="mCol">College</label><select className="inp" id="mCol" value={M.college} onChange={e => set('me', 'college', e.target.value)}>{Object.entries(COLS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
                  <div className="field"><label className="lab" htmlFor="mBr">Branch</label><select className="inp" id="mBr" value={M.branch} onChange={e => set('me', 'branch', e.target.value)}>{Object.entries(BRANCH).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></div>
                  <div className="field"><label className="lab" htmlFor="mYr">Graduating</label><select className="inp" id="mYr" value={M.year} onChange={e => set('me', 'year', e.target.value)}>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                </div>
                <div className="grid2" style={{ marginTop: 18 }}>
                  <div className="field">
                    <label className="lab" htmlFor="mUniversity">University name</label>
                    <input className="inp" id="mUniversity" value={M.university} maxLength={80} autoComplete="organization" placeholder="Your university" onChange={e => set('me', 'university', e.target.value.replace(/[<>]/g, '').slice(0, 80))} />
                  </div>
                  <div className="field">
                    <label className="lab" htmlFor="mSemester">Semester</label>
                    <select className="inp" id="mSemester" value={M.semester} onChange={e => set('me', 'semester', e.target.value)}>
                      <option value="">Not set</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={String(n)}>Semester {n}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="lab" htmlFor="mPersonalEmail">Personal email</label>
                    <input className="inp" id="mPersonalEmail" type="email" value={raw.personalEmail} maxLength={80} autoComplete="email" placeholder="you@example.com" aria-invalid={errs.personalEmail ? 'true' : undefined} aria-describedby="mPersonalEmailE" onChange={e => onPersonalEmail(e.target.value)} />
                    <div className="err" id="mPersonalEmailE" aria-live="polite">{errs.personalEmail}</div>
                  </div>
                </div>
              </div>
              <div className="grp">
                <div className="gh"><h3>About you</h3><p>A short line for your profile.</p></div>
                <div className="field"><label className="lab" htmlFor="mBio">Bio <span style={{ float: 'right', letterSpacing: 0 }}>{M.bio.length}/140</span></label>
                  <textarea className="inp" id="mBio" value={M.bio} maxLength={140} placeholder="Final year. Happy to answer questions about hostel life." onChange={e => set('me', 'bio', e.target.value.replace(/[<>]/g, ''))} /></div>
              </div>
            </div>
            <div className="glass sticky" id="mePrev">
              <div className="pv">
                <div className="mrow"><h3>Your profile</h3><span className="sample">Sample data</span></div>
                <div className="rv">
                  <div className="byline"><div className="av">{(M.name.trim() || M.user || '?')[0].toUpperCase()}</div>
                    <div style={{ minWidth: 0 }}><div className="bn">{M.name.trim() || 'Your name'}</div><div className="bd">{M.user ? '@' + M.user : 'No username yet'}</div></div></div>
                  <p className="txt">{M.bio.trim() || 'Your bio will show here.'}</p>
                  <div className="dl" style={{ marginTop: 16 }}>
                    {[
                      ['Email', M.email || 'Not set'],
                      ['University', M.university || 'Not set'],
                      ...(M.personalEmail ? [['Personal email', M.personalEmail]] : []),
                      ...(M.semester ? [['Semester', `Semester ${M.semester}`]] : []),
                      ['College profile', COLS[M.college]],
                      ['Branch', BRANCH[M.branch]],
                      ['Graduating', M.year],
                    ].map(([a, b]) => <div className="r" key={a}><span>{a}</span><span>{b}</span></div>)}
                  </div>
                </div>
              </div>
              <div className="pv">
                <div className="mrow"><h3>Profile complete</h3><span className="big">{pct}%</span></div>
                <div className="meter"><i style={{ '--v': pct + '%' }} /></div>
                <p className="sub">{need.some(n => !n[1]) ? 'Still to add: ' + need.filter(n => !n[1]).map(n => n[0]).join(', ') + '.' : 'Everything is filled in.'}</p>
                <p className="note" style={{ marginTop: 16 }}>Your email and full name are never shown on reviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =============== PRIVACY =============== */}
        <section className={`panel ${tab === 'voice' ? 'on' : ''}`} id="p-voice" role="tabpanel" aria-labelledby="t-voice" hidden={tab !== 'voice'}>
          <header className="ph">
            <div><p className="eyebrow">Voice &amp; privacy</p><h2>Choose how you appear.</h2><p className="sub deco">Decide how much of you comes with a review. The preview shows what others would see.</p></div>
            <button className="btn sec sm" type="button" onClick={() => reset('voice')}>Reset</button>
          </header>
          <a className="livebar" href="#voicePrev"><span>{live}</span><span>Exposure</span></a>
          <div className="cols">
            <div className="stack"><div className="glass">
              <div className="grp">
                <div className="gh"><h3 id="bylL">Sign my reviews as</h3>
                  <p>{{ anon: 'Nobody sees a name.', handle: 'Readers see your username and nothing else unless you switch it on.', verified: 'We confirm you are a real senior and show a Verified badge beside your username.' }[V.byline]}</p></div>
                <Seg labelledBy="bylL" value={V.byline} onChange={v => set('voice', 'byline', v)} options={[['anon', 'Anonymous'], ['handle', 'My username'], ['verified', 'Verified']]} />
                {V.byline !== 'anon' && (
                  <p className="note" style={{ marginTop: 24 }}>Your handle is your username, <b>{M.user ? '@' + M.user : 'not set yet'}</b>. <button type="button" className="lnk" onClick={() => setTab('me')}>Change it in Personal details</button></p>
                )}
              </div>
              <div className="grp">
                <div className="gh"><h3>Show on my reviews</h3></div>
                <div className="rows">
                  <Switch id="swC" label="My college" on={V.showCollege} onChange={v => set('voice', 'showCollege', v)} />
                  <Switch id="swB" label="My branch" on={V.showBranch} onChange={v => set('voice', 'showBranch', v)} />
                  <Switch id="swY" label="My graduating year" on={V.showYear} onChange={v => set('voice', 'showYear', v)} />
                </div>
              </div>
              <div className="grp">
                <div className="gh"><h3 id="visL">Who can open my profile</h3></div>
                <Seg labelledBy="visL" value={V.vis} onChange={v => set('voice', 'vis', v)} options={[['public', 'Anyone'], ['members', 'Members'], ['private', 'Only me']]} />
                <div className="rows" style={{ marginTop: 24 }}>
                  <Switch id="swR" label="Replies to my reviews" on={V.replies} onChange={v => set('voice', 'replies', v)} />
                  <Switch id="swD" label="Messages from juniors" on={V.dms} onChange={v => set('voice', 'dms', v)} />
                </div>
              </div>
            </div></div>
            <div className="glass sticky" id="voicePrev">
              <div className="pv">
                <div className="mrow"><h3>How a review looks</h3><span className="sample">Sample data</span></div>
                <div className="rv">
                  <div className="byline">
                    <div className={`av ${V.byline === 'anon' ? 'anon' : ''}`}>{V.byline === 'anon' ? '?' : M.user ? M.user[0].toUpperCase() : '@'}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="bn">{bylineName}{V.byline === 'verified' && <> <span className="pill"><Shield />Verified senior</span></>}</div>
                      <div className="bd">{[V.showCollege && COLS[M.college], V.showBranch && BRANCH[M.branch], V.showYear && 'Class of ' + M.year].filter(Boolean).join(' · ') || 'No details shown'}</div>
                    </div>
                  </div>
                  <p className="txt">This is where your words go. Your signature sits above them, exactly like this.</p>
                </div>
              </div>
              <div className="pv">
                <div className="mrow"><h3>Seen from outside</h3></div>
                <Seg label="Viewer" value={viewer} onChange={setViewer} options={[['stranger', 'Visitor'], ['member', 'Member'], ['me', 'You']]} className="" />
                <div className="dl" style={{ marginTop: 16 }}>
                  <ProfileRows V={V} M={M} viewer={viewer} name={bylineName} />
                </div>
              </div>
              <div className="pv">
                <div className="mrow"><h3>How identifiable you are</h3><span className="big">{x}</span></div>
                <div className="meter"><i style={{ '--v': x + '%' }} /></div>
                <p className="sub">{exLab}. {V.byline !== 'anon' && V.showCollege && V.showBranch && V.showYear ? 'College, branch and year together can point to a small group of people.' : x < 25 ? 'Very little links a review back to you.' : x < 55 ? 'Some details are visible. Switch one off to lower it.' : 'Much of you is visible. Anonymous and fewer details lowers this fast.'}</p>
                <p className="note" style={{ marginTop: 16 }}>Based on the options you chose. It is not a guarantee of anonymity or security.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =============== ALERTS =============== */}
        <section className={`panel ${tab === 'alerts' ? 'on' : ''}`} id="p-alerts" role="tabpanel" aria-labelledby="t-alerts" hidden={tab !== 'alerts'}>
          <Alerts A={A} set={set} reset={() => reset('alerts')} live={live} />
        </section>

        <p className="foot deco">Demo build. Settings stay in this browser. Backend hook: <code>api.saveSettings()</code>.</p>
      </main>

      {palOpen && <Palette onClose={() => setPalOpen(false)} setTab={setTab} set={set} />}
      <div id="toasts" aria-live="polite">{toasts.map(t => <div className="toast" role="status" key={t.id}><span>{t.msg}</span></div>)}</div>
    </div>
  );
}

/* what a visitor / member / the owner can see of the profile */
function ProfileRows({ V, M, viewer, name }) {
  const sees = viewer === 'me' ? true : viewer === 'member' ? V.vis !== 'private' : V.vis === 'public';
  const hide = (on, val) => (viewer === 'me' ? val + (on ? '' : ' (hidden from others)') : on ? val : null);
  const rows = [['Name on reviews', name]];
  if (!sees) rows.push(['Profile', V.vis === 'private' ? 'Only you can open it' : 'Sign in to view']);
  else {
    rows.push(['College', hide(V.showCollege, M.university || COLS[M.college])], ['Branch', hide(V.showBranch, BRANCH[M.branch])], ['Graduating', hide(V.showYear, M.year)]);
    rows.push(['Replies', V.replies ? 'Open' : 'Closed'], ['Messages', V.dms ? 'Open' : 'Closed']);
  }
  return rows.map(([a, b]) => <div className="r" key={a}><span>{a}</span>{b == null ? <span className="mask">••••••</span> : <span>{b}</span>}</div>);
}

/* ---------- alerts panel + simulator ---------- */
function Alerts({ A, set, reset, live }) {
  const [now, setNow] = useState('14:00');
  const [sim, setSim] = useState({ del: 0, held: 0, blk: 0, log: [], stack: [], rot: 0 });
  const names = { reviews: 'new reviews', replies: 'replies' };
  const on = Object.keys(CATS).filter(k => A.cat[k]), off = Object.keys(CATS).filter(k => !A.cat[k]);
  const q = A.quiet.on && A.quiet.from !== A.quiet.to, f = A.follow.length;
  const list = arr => (arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1]);
  const words = 'Right now: ' + (on.length ? list(on.map(k => names[k])) + ' can reach you' : 'nothing can reach you') +
    (off.length && on.length ? '; ' + list(off.map(k => names[k])) + (off.length > 1 ? ' are' : ' is') + ' off' : '') + '. ' +
    (A.cat.reviews ? (f ? `New reviews come from ${f} ${f > 1 ? 'colleges' : 'college'} you follow. ` : 'You follow no colleges, so no new-review alerts arrive. ') : '') +
    (q ? `Between ${A.quiet.from} and ${A.quiet.to} alerts wait, then arrive at ${A.quiet.to}.` : 'There are no quiet hours, so alerts arrive straight away.');

  /* the same three rules the real system would apply, in order */
  const fire = cat => setSim(s => {
    const c = CATS[cat], log = (k, m) => [[k, m], ...s.log].slice(0, 5);
    if (!A.cat[cat]) return { ...s, blk: s.blk + 1, log: log('Blocked', c.name + ' is switched off.') };                       // rule 1: switch
    if (cat === 'reviews' && !f) return { ...s, blk: s.blk + 1, log: log('Blocked', 'You follow no colleges, so no new-review alert.') };   // rule 2: followed colleges
    if (inQuiet(A.quiet, now)) return { ...s, held: s.held + 1, log: log('Held', `${c.name} waits until ${A.quiet.to} (quiet hours).`) };    // rule 3: quiet hours
    const col = COLS[A.follow[s.rot % Math.max(1, f)]] || 'a followed college';
    const t = { reviews: ['New review · ' + col, 'Sample: a senior wrote about hostel life.'], replies: ['Reply to your review', 'Sample: a junior asked when placement prep started.'] }[cat];
    return { ...s, rot: s.rot + 1, del: s.del + 1, stack: [{ t: t[0], b: t[1], time: now, id: Math.random() }, ...s.stack].slice(0, 3), log: log('Delivered', c.name + ' arrives now.') };
  });

  return (
    <>
      <header className="ph">
        <div><p className="eyebrow">Alerts</p><h2>Only what matters.</h2><p className="sub deco">Switch alerts on or off, pick quiet hours, then send a test to see what happens.</p></div>
        <button className="btn sec sm" type="button" onClick={reset}>Reset</button>
      </header>
      <a className="livebar" href="#alertPrev"><span>{live}</span><span>Test</span></a>
      <div className="cols">
        <div className="glass">
          <div className="grp">
            <div className="gh"><h3>How it works</h3></div>
            <ol className="steps">
              <li><span><b>Something happens.</b> A review, a reply, a vote or news.</span></li>
              <li><span><b>Your switches decide.</b> If that type is off, it is dropped. New reviews only count for colleges you follow.</span></li>
              <li><span><b>Quiet hours decide when.</b> During quiet hours it waits, then arrives when they end.</span></li>
            </ol>
            <p className="words" aria-live="polite">{words}</p>
          </div>
          <div className="grp">
            <div className="gh"><h3>What reaches you</h3></div>
            <div className="rows">{Object.entries(CATS).map(([k, c]) => <Switch key={k} id={'cat-' + k} label={c.name} desc={c.desc} on={A.cat[k]} onChange={v => set('alerts', 'cat.' + k, v)} />)}</div>
          </div>
          <div className="grp">
            <div className="gh"><h3>Quiet hours</h3><p>Alerts wait until quiet hours end.</p></div>
            <div className="rows"><Switch id="swQ" label="Hold alerts during quiet hours" on={A.quiet.on} onChange={v => set('alerts', 'quiet.on', v)} /></div>
            <div className="grid2" style={{ marginTop: 24 }}>
              <div className="field"><label className="lab" htmlFor="qFrom">From</label><input className="inp" type="time" id="qFrom" value={A.quiet.from} onChange={e => e.target.value && set('alerts', 'quiet.from', e.target.value)} /></div>
              <div className="field"><label className="lab" htmlFor="qTo">Until</label><input className="inp" type="time" id="qTo" value={A.quiet.to} onChange={e => e.target.value && set('alerts', 'quiet.to', e.target.value)} /></div>
            </div>
          </div>
          <div className="grp">
            <div className="gh"><h3 id="folL">Colleges I follow</h3><p>New-review alerts only come from these.</p></div>
            <div className="chips" role="group" aria-labelledby="folL">
              {Object.entries(COLS).map(([k, n]) => (
                <button key={k} type="button" className="chip" aria-pressed={A.follow.includes(k)}
                  onClick={() => set('alerts', 'follow', Object.keys(COLS).filter(x => (A.follow.includes(x) && x !== k) || (x === k && !A.follow.includes(k))))}>{n}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="glass sticky" id="alertPrev">
          <div className="pv">
            <div className="mrow"><h3>Try it</h3><span className="sample">Simulation</span></div>
            <div className="field" style={{ maxWidth: 240 }}><label className="lab" htmlFor="simNow">Pretend it's</label><input className="inp" type="time" id="simNow" value={now} onChange={e => e.target.value && setNow(e.target.value)} /></div>
            <div className="phone" aria-label="Simulated phone lock screen">
              <div className="clk">{now}</div><div className="cs">Sample notifications</div>
              <div aria-live="polite" style={{ display: 'grid', gap: 12 }}>
                {sim.stack.length ? sim.stack.map(n => (
                  <div className="nt" key={n.id}><div className="h"><span>Unfiltered U</span><span>{n.time}</span></div><div className="b">{n.t}</div><div className="s">{n.b}</div></div>
                )) : <p className="none">Nothing here yet. Send a test below.</p>}
              </div>
            </div>
          </div>
          <div className="pv"><span className="lab">Send a test</span>
            <div className="chips">{Object.entries(CATS).map(([k, c]) => <button key={k} type="button" className="chip" onClick={() => fire(k)}>{c.name}</button>)}</div></div>
          <div className="pv">
            <div className="counts"><div><b>{sim.del}</b><span>Delivered</span></div><div><b>{sim.held}</b><span>Held</span></div><div><b>{sim.blk}</b><span>Blocked</span></div></div>
            <ul className="log" aria-live="polite" style={{ marginTop: 16 }}>{sim.log.map(([k, m], i) => <li key={i}><b>{k}</b><span>{m}</span></li>)}</ul>
            <div className="btns" style={{ marginTop: 16 }}><button className="btn sec sm" type="button" onClick={() => setSim({ del: 0, held: 0, blk: 0, log: [], stack: [], rot: 0 })}>Clear</button></div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- command palette (Ctrl/Cmd + K) ---------- */
function Palette({ onClose, setTab, set }) {
  const ref = useRef(null), inp = useRef(null);
  const [q, setQ] = useState(''), [sel, setSel] = useState(0);
  const items = useMemo(() => [
    ...TABS.map(([id, n]) => ({ l: 'Go to ' + n, k: 'Section', kw: 'open ' + id, run: () => setTab(id) })),
    ...Object.entries(MOODS).map(([k, m]) => ({ l: 'Mood: ' + m.name, k: 'Action', kw: 'theme vibe', run: () => set('look', 'mood', k) })),
    { l: 'Star density', k: 'Setting', kw: 'stars sky', run: () => setTab('look') },
    { l: 'Username', k: 'Setting', kw: 'handle profile', run: () => setTab('me') },
    { l: 'Quiet hours', k: 'Setting', kw: 'sleep night', run: () => setTab('alerts') },
    { l: 'Turn on reduced motion', k: 'Action', kw: 'accessibility animations', run: () => set('look', 'motion', 'reduce') },
    { l: 'Turn on high contrast', k: 'Action', kw: 'accessibility', run: () => set('look', 'contrast', 'high') },
  ], [setTab, set]);
  const found = items.filter(i => (i.l + ' ' + i.kw).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8);
  useEffect(() => { ref.current.showModal(); inp.current.focus(); }, []);
  const run = i => { const it = found[i]; if (!it) return; onClose(); setTimeout(it.run, 40); };
  const key = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(found.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
  };
  return (
    <dialog ref={ref} aria-label="Search settings" onClose={onClose} onClick={e => e.target === ref.current && onClose()}>
      <input ref={inp} className="pal-in" type="text" role="combobox" aria-expanded="true" aria-controls="palList" aria-autocomplete="list" placeholder="Search settings…" autoComplete="off" spellCheck="false" value={q} onChange={e => { setQ(e.target.value); setSel(0); }} onKeyDown={key} />
      <ul className="pal-l" id="palList" role="listbox" aria-label="Results">
        {found.length ? found.map((it, i) => <li key={it.l} role="option" aria-selected={i === sel} onClick={() => run(i)}><span>{it.l}</span><span>{it.k}</span></li>) : <li role="option" aria-selected="false"><span>No match</span></li>}
      </ul>
      <div className="pal-f"><span>Up / down to move</span><span>Enter to run</span><span>Esc to close</span></div>
    </dialog>
  );
}
