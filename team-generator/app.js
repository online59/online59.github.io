'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const countBy = (arr, f) => arr.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const avg = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

const STORE_KEY = 'team-generator.v1';
const GENDERS = { M: 'Male', F: 'Female', X: 'Unspecified' };
const CHIEF = 'Chief';
const KNOWN_RANK = { 'Chief': 50, 'Director': 40, 'Deputy Director': 35, 'Associate Director': 30, 'Assistant Director': 28, 'Senior Manager': 25, 'Manager': 20 };
const ABBR = { 'Chief': 'CXO', 'Director': 'DIR', 'Deputy Director': 'DD', 'Associate Director': 'AD', 'Assistant Director': 'ASD', 'Senior Manager': 'SM', 'Manager': 'MGR', 'Unspecified': '—' };
const LEVEL_COLORS = ['#1F2A44', '#2547C9', '#0E8F7E', '#C77A12', '#B0417A', '#6B7280', '#5B4BC4', '#8A5A2B'];
const TEAM_HUES = ['#2547C9', '#F08A3C', '#1D8A57', '#C2387A', '#0E8FA3', '#8A5A2B', '#5B4BC4', '#B8860B', '#D1453B', '#3F7D20'];
const PHONETIC = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
const BALANCE = [
  ['gender', 'Gender mix', 'Even male / female split'],
  ['level', 'Seniority mix', 'Spread each level evenly'],
  ['age', 'Age mix', 'Similar average age and age bands'],
  ['dept', 'Department mix', 'Mix people across departments'],
];
const QUANT = { min: ['at least', '≥'], max: ['at most', '≤'], exact: ['exactly', '='] };
const FIELDS = [
  ['name', 'Name', /(^|\s)(full\s*name|name|employee|staff|colleague)|ชื่อ/i],
  ['age', 'Age', /(^|[^a-z])age([^a-z]|$)|birth|\bdob\b|อายุ|เกิด/i],
  ['position', 'Position', /position|title|level|grade|rank|role|seniority|designation|ตำแหน่ง|ระดับ/i],
  ['gender', 'Gender', /gender|sex|เพศ/i],
  ['dept', 'Department', /dep(t|artment)|division|unit|function|section|ฝ่าย|แผนก|หน่วย|สังกัด/i],
];

const defaults = () => ({
  people: [],
  levels: [],
  filter: { ageMin: '', ageMax: '', genders: {}, levels: {} },
  shape: { mode: 'count', count: 4, size: 6, naming: 'phonetic' },
  balance: { gender: 1, level: 1, age: 1, dept: 1 },
  rules: [],
  separateChiefs: true,
  result: null,
  view: 'roster',
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!s || !Array.isArray(s.people)) return null;
    const d = defaults();
    return { ...d, ...s, filter: { ...d.filter, ...s.filter }, shape: { ...d.shape, ...s.shape }, balance: { ...d.balance, ...s.balance } };
  } catch { return null; }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

let state = load() || defaults();
let search = '';

/* ---------------- normalisation ---------------- */

function canonLevel(raw) {
  const s = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (!s) return 'Unspecified';
  const l = s.toLowerCase();
  if (/\bchief\b|^c[a-z]o$|ประธานเจ้าหน้าที่/.test(l) && !/deputy|assist|vice|รอง|ผู้ช่วย/.test(l)) return CHIEF;
  if (/assist|ผู้ช่วยผู้อำนวยการ/.test(l) && /dir|ผู้อำนวยการ/.test(l)) return 'Assistant Director';
  if (/deputy|รองผู้อำนวยการ/.test(l) && /dir|ผู้อำนวยการ/.test(l)) return 'Deputy Director';
  if ((/assoc|asso\b|asso\./.test(l) && /dir/.test(l)) || /^a\.?\s?d\.?$/.test(l)) return 'Associate Director';
  if (/director|\bdir\b|ผู้อำนวยการ/.test(l)) return 'Director';
  if (/(senior|\bsr\.?)\s*manager/.test(l)) return 'Senior Manager';
  if (/manager|\bmgr\b|ผู้จัดการ/.test(l)) return 'Manager';
  return l.replace(/(^|\s)\S/g, c => c.toUpperCase());
}

function canonGender(v) {
  const l = String(v ?? '').trim().toLowerCase().replace(/\.$/, '');
  if (/^(m|male|man|men|boy|mr|ชาย|ช|นาย)$/.test(l)) return 'M';
  if (/^(f|female|woman|women|girl|ms|mrs|miss|หญิง|ญ|นาง|นางสาว|น\.ส)$/.test(l)) return 'F';
  return 'X';
}

function parseAge(v) {
  const now = new Date();
  const fromDate = d => {
    let a = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--;
    if (d.getFullYear() > 2400) a += 543;
    return a > 0 && a < 120 ? a : null;
  };
  if (v instanceof Date) return isNaN(v) ? null : fromDate(v);
  const s = String(v ?? '').trim();
  if (!s) return null;
  if (/^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : fromDate(d);
  }
  const n = parseFloat(s.replace(/[^\d.]/g, ''));
  if (!isFinite(n)) return null;
  if (n > 2400 && n < 2700) return now.getFullYear() - (n - 543);
  if (n > 1900 && n < 2100) return now.getFullYear() - n;
  if (n > 0 && n < 120) return Math.round(n);
  return null;
}

/* ---------------- derived data ---------------- */

const rankHint = l => l === 'Unspecified' ? 0 : (KNOWN_RANK[l] ?? 10);
const rankOf = l => state.levels.indexOf(l);
const hasDept = () => state.people.some(p => p.dept);
const presentGenders = () => ['M', 'F', 'X'].filter(g => state.people.some(p => p.gender === g));
const ageBand = a => a == null ? '?' : a < 30 ? '<30' : a < 40 ? '30s' : a < 50 ? '40s' : '50+';

function levelColor(l) {
  const r = rankOf(l);
  if (r < 0) return LEVEL_COLORS[5];
  return LEVEL_COLORS[(state.levels.length - 1 - r) % LEVEL_COLORS.length];
}
function abbr(l) {
  if (ABBR[l]) return ABBR[l];
  const w = l.split(/\s+/);
  return (w.length > 1 ? w.map(x => x[0]).join('') : l.slice(0, 3)).toUpperCase().slice(0, 4);
}

function syncLevels() {
  const present = new Set(state.people.map(p => p.level));
  const lv = state.levels.filter(l => present.has(l));
  for (const l of present) {
    if (lv.includes(l)) continue;
    let i = lv.findIndex(x => rankHint(x) > rankHint(l));
    if (i < 0) i = lv.length;
    lv.splice(i, 0, l);
  }
  state.levels = lv;
}

function passes(p) {
  const f = state.filter;
  if (f.ageMin !== '' && f.ageMin != null && (p.age == null || p.age < +f.ageMin)) return false;
  if (f.ageMax !== '' && f.ageMax != null && (p.age == null || p.age > +f.ageMax)) return false;
  if (f.genders[p.gender] === false) return false;
  if (f.levels[p.level] === false) return false;
  return true;
}
const pool = () => state.people.filter(p => p.included && passes(p));

function teamCount(n) {
  if (!n) return 0;
  const s = state.shape;
  if (s.mode === 'count') return clamp(Math.round(+s.count) || 1, 1, n);
  return clamp(Math.ceil(n / Math.max(1, Math.round(+s.size) || 1)), 1, n);
}
function sizesFor(n, t) {
  const base = Math.floor(n / t), extra = n % t;
  return Array.from({ length: t }, (_, i) => base + (i < extra ? 1 : 0));
}
function teamNames(t) {
  return Array.from({ length: t }, (_, i) =>
    state.shape.naming === 'phonetic' && i < PHONETIC.length ? PHONETIC[i] : `Team ${i + 1}`);
}

/* ---------------- rules ---------------- */

function splitSubj(s) {
  const i = s.indexOf(':');
  return [s.slice(0, i), s.slice(i + 1)];
}

function subjOptions() {
  const groups = [];
  const g = presentGenders().filter(x => x !== 'X');
  groups.push(['Gender', (g.length ? g : ['M', 'F']).map(x => [`g:${x}`, GENDERS[x]])]);
  const lv = [...state.levels].reverse().filter(l => l !== 'Unspecified');
  if (lv.length) {
    groups.push(['Seniority', [
      ...lv.map(l => [`l:${l}`, l]),
      ...lv.slice(1, -1).map(l => [`lmin:${l}`, `${l} or above`]),
    ]]);
  }
  groups.push(['Age', [['age:under', 'aged under …'], ['age:over', 'aged … or above'], ['age:between', 'aged … to …']]]);
  const depts = [...new Set(state.people.map(p => p.dept).filter(Boolean))].sort();
  if (depts.length) groups.push(['Department', depts.map(d => [`d:${d}`, `from ${d}`])]);
  return groups;
}

function subjLabel(r) {
  const [k, v] = splitSubj(r.subj);
  if (k === 'g') return GENDERS[v] || v;
  if (k === 'l') return v;
  if (k === 'lmin') return `${v}+`;
  if (k === 'd') return v;
  if (v === 'under') return `under ${r.a}`;
  if (v === 'over') return `${r.a}+ yrs`;
  return `aged ${Math.min(r.a, r.b)}–${Math.max(r.a, r.b)}`;
}
const ruleText = r => `${QUANT[r.quant][1]}${r.n} ${subjLabel(r)}`;

function matcher(r) {
  const [k, v] = splitSubj(r.subj);
  const a = +r.a, b = +r.b;
  switch (k) {
    case 'g': return p => p.gender === v;
    case 'l': return p => p.level === v;
    case 'lmin': { const m = rankOf(v); return p => m >= 0 && rankOf(p.level) >= m; }
    case 'd': return p => p.dept === v;
    case 'age':
      if (v === 'under') return p => p.age != null && p.age < a;
      if (v === 'over') return p => p.age != null && p.age >= a;
      return p => p.age != null && p.age >= Math.min(a, b) && p.age <= Math.max(a, b);
  }
  return () => false;
}

function ruleOk(r, count) {
  const n = +r.n || 0;
  return r.quant === 'min' ? count >= n : r.quant === 'max' ? count <= n : count === n;
}

function ruleIssue(r, P, T) {
  if (!T) return '';
  const m = P.filter(matcher(r)).length, need = (+r.n || 0) * T;
  const who = subjLabel(r);
  if ((r.quant === 'min' || r.quant === 'exact') && m < need)
    return `Only ${m} × ${who} in the pool — ${T} teams need ${need}.`;
  if ((r.quant === 'max' || r.quant === 'exact') && m > need)
    return `${m} × ${who} in the pool but ${T} teams can take at most ${need}.`;
  return '';
}

/* ---------------- solver ---------------- */

// Simulated annealing over pairwise swaps; swaps keep team sizes fixed, so only two teams' costs change per step.
function solve(P, T) {
  const N = P.length;
  const sizes = sizesFor(N, T);
  const bal = state.balance;
  const mult = v => v === 2 ? 4 : v ? 1 : 0;
  const dims = [];
  if (bal.gender) dims.push([3 * mult(bal.gender), p => 'g' + p.gender]);
  if (bal.level) dims.push([3 * mult(bal.level), p => 'l' + p.level]);
  if (bal.age) dims.push([1 * mult(bal.age), p => 'a' + ageBand(p.age)]);
  if (bal.dept && hasDept()) dims.push([2 * mult(bal.dept), p => 'd' + (p.dept || '—')]);

  const catId = new Map(), catW = [], catTot = [];
  const pc = P.map(p => dims.map(([w, f]) => {
    const k = f(p);
    if (!catId.has(k)) { catId.set(k, catW.length); catW.push(w); catTot.push(0); }
    const c = catId.get(k);
    catTot[c]++;
    return c;
  }));
  const C = catW.length;
  const rules = state.rules.map(r => ({ q: r.quant, n: +r.n || 0, m: matcher(r) }));
  const R = rules.length;
  const pr = P.map(p => rules.map(r => r.m(p) ? 1 : 0));
  const ages = P.map(p => p.age);
  const meanAge = avg(ages.filter(a => a != null)) ?? 0;
  const ageW = bal.age ? 0.35 * mult(bal.age) : 0;
  const RULE_W = 1000;
  const trivial = !C && !R && !ageW;
  const isChief = Uint8Array.from(P, p => state.separateChiefs && p.level === CHIEF ? 1 : 0);

  function run(iters) {
    // Slots go round-robin across teams, so the first T people placed (the chiefs) land in distinct teams.
    const tOrder = shuffle([...Array(T).keys()]), slots = [];
    for (let r = 0; slots.length < N; r++) for (const t of tOrder) if (sizes[t] > r) slots.push(t);
    const idx = shuffle([...Array(N).keys()]);
    const team = new Int32Array(N);
    [...idx.filter(i => isChief[i]), ...idx.filter(i => !isChief[i])].forEach((i, k) => { team[i] = slots[k]; });
    const chiefIn = new Int32Array(T);
    for (let i = 0; i < N; i++) chiefIn[team[i]] += isChief[i];
    const chiefCap = Math.max(...chiefIn);
    const cnt = Array.from({ length: T }, () => new Float64Array(C));
    const rc = Array.from({ length: T }, () => new Float64Array(R));
    const aS = new Float64Array(T), aN = new Float64Array(T);
    const add = (i, t, s) => {
      for (const c of pc[i]) cnt[t][c] += s;
      for (let r = 0; r < R; r++) rc[t][r] += s * pr[i][r];
      if (ages[i] != null) { aS[t] += s * ages[i]; aN[t] += s; }
    };
    const cost = t => {
      let c = 0;
      const share = sizes[t] / N;
      for (let j = 0; j < C; j++) { const d = cnt[t][j] - catTot[j] * share; c += catW[j] * d * d; }
      for (let r = 0; r < R; r++) {
        const v = rc[t][r], n = rules[r].n, q = rules[r].q;
        c += RULE_W * (q === 'min' ? Math.max(0, n - v) : q === 'max' ? Math.max(0, v - n) : Math.abs(v - n));
      }
      if (ageW && aN[t]) { const d = aS[t] / aN[t] - meanAge; c += ageW * d * d; }
      return c;
    };
    for (let i = 0; i < N; i++) add(i, team[i], 1);
    const tc = Float64Array.from({ length: T }, (_, t) => cost(t));
    let total = tc.reduce((a, b) => a + b, 0), best = total, bestTeam = team.slice();
    const T0 = 4, T1 = 0.005;
    for (let it = 0; it < iters; it++) {
      const i = Math.random() * N | 0, j = Math.random() * N | 0;
      const a = team[i], b = team[j];
      if (a === b) continue;
      if (isChief[i] !== isChief[j] && chiefIn[isChief[i] ? b : a] >= chiefCap) continue;
      add(i, a, -1); add(j, b, -1); add(i, b, 1); add(j, a, 1);
      const ca = cost(a), cb = cost(b);
      const delta = ca + cb - tc[a] - tc[b];
      const temp = T0 * Math.pow(T1 / T0, it / iters);
      if (delta <= 0 || Math.random() < Math.exp(-delta / temp)) {
        team[i] = b; team[j] = a; tc[a] = ca; tc[b] = cb; total += delta;
        const moved = isChief[i] - isChief[j];
        chiefIn[a] -= moved; chiefIn[b] += moved;
        if (total < best - 1e-9) { best = total; bestTeam = team.slice(); }
      } else {
        add(i, b, -1); add(j, a, -1); add(i, a, 1); add(j, b, 1);
      }
    }
    return { cost: best, team: bestTeam };
  }

  if (trivial || T === 1) return run(0).team;
  const iters = clamp(N * 300, 6000, 60000);
  let best = null;
  for (let r = 0; r < 6; r++) {
    const res = run(iters);
    if (!best || res.cost < best.cost) best = res;
  }
  return best.team;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ---------------- rendering: setup ---------------- */

function renderAll() {
  renderSetup();
  renderTabs();
  renderRoster();
  renderTeams();
}

function renderSetup() {
  renderLevels();
  renderFilter();
  renderShape();
  renderBalance();
  renderRules();
}

function renderLevels() {
  const box = $('#levels-box');
  if (!state.people.length) { box.innerHTML = ''; return; }
  const counts = countBy(state.people, p => p.level);
  const lv = [...state.levels].reverse();
  box.innerHTML = `<div class="levels">
    <div class="levels-title">Seniority order <span>highest first</span></div>
    ${lv.map((l, i) => `<div class="lvl-item">
      <i class="sw" style="background:${levelColor(l)}"></i>
      <span class="nm">${esc(l)}</span><span class="ct">${counts[l] || 0}</span>
      <button class="icon-btn" data-lvl-move="${esc(l)}" data-dir="1" ${i === 0 ? 'disabled' : ''} aria-label="Move up">▲</button>
      <button class="icon-btn" data-lvl-move="${esc(l)}" data-dir="-1" ${i === lv.length - 1 ? 'disabled' : ''} aria-label="Move down">▼</button>
    </div>`).join('')}
  </div>`;
}

function renderFilter() {
  const f = state.filter;
  for (const [id, k] of [['#f-age-min', 'ageMin'], ['#f-age-max', 'ageMax']]) {
    const el = $(id);
    if (document.activeElement !== el) el.value = f[k] ?? '';
  }
  const gc = countBy(state.people, p => p.gender);
  const lc = countBy(state.people, p => p.level);
  const none = '<span class="hint" style="margin:0">Load a roster first</span>';
  $('#f-genders').innerHTML = state.people.length ? presentGenders().map(g => {
    const on = f.genders[g] !== false;
    return `<label class="chk ${on ? 'on' : ''}"><input type="checkbox" data-fg="${g}" ${on ? 'checked' : ''}><i class="sw g-${g}"></i>${GENDERS[g]} <span class="ct">${gc[g]}</span></label>`;
  }).join('') : none;
  $('#f-levels').innerHTML = state.people.length ? [...state.levels].reverse().map(l => {
    const on = f.levels[l] !== false;
    return `<label class="chk ${on ? 'on' : ''}"><input type="checkbox" data-fl="${esc(l)}" ${on ? 'checked' : ''}><i class="sw" style="background:${levelColor(l)}"></i>${esc(l)} <span class="ct">${lc[l]}</span></label>`;
  }).join('') : none;
  const P = pool().length, N = state.people.length;
  $('#f-summary').innerHTML = N ? `<b>${P}</b> of ${N} people will be placed into teams.` : '';
}

function renderShape() {
  const s = state.shape;
  $$('#shape-mode button').forEach(b => b.classList.toggle('on', b.dataset.v === s.mode));
  const inp = $('#shape-n');
  if (document.activeElement !== inp) inp.value = s.mode === 'count' ? s.count : s.size;
  $('#shape-naming').value = s.naming;
  const N = pool().length, T = teamCount(N);
  const el = $('#shape-preview');
  if (!N) { el.innerHTML = ''; return; }
  const sz = sizesFor(N, T), lo = Math.min(...sz), hi = Math.max(...sz);
  el.innerHTML = `→ <b>${T} team${T > 1 ? 's' : ''}</b> of <b>${lo === hi ? lo : `${lo}–${hi}`}</b> people each.`;
}

function renderBalance() {
  const dept = hasDept();
  $('#balance').innerHTML = BALANCE.map(([k, t, d]) => {
    const dis = k === 'dept' && !dept;
    const v = state.balance[k];
    return `<div class="bal ${dis ? 'disabled' : ''}">
      <div><div class="t">${t}</div><div class="d">${dis ? 'No department column in your file' : d}</div></div>
      <div class="seg sm">${[['0', 'Off'], ['1', 'On'], ['2', 'Priority']].map(([x, l]) =>
        `<button data-bal="${k}" data-v="${x}" class="${String(v) === x ? 'on' : ''}">${l}</button>`).join('')}</div>
    </div>`;
  }).join('');
}

function renderRules() {
  const P = pool(), T = teamCount(P.length);
  const groups = subjOptions();
  const known = new Set(groups.flatMap(g => g[1].map(o => o[0])));
  $('#rules').innerHTML = state.rules.length ? state.rules.map(r => {
    const [k, v] = splitSubj(r.subj);
    const extra = known.has(r.subj) ? '' : `<option value="${esc(r.subj)}" selected>${esc(subjLabel(r))} (not in roster)</option>`;
    const issue = ruleIssue(r, P, T);
    return `<div class="rule ${issue ? 'warn' : ''}" data-rule="${r.id}">
      <span>Each team has</span>
      <select data-k="quant">${Object.entries(QUANT).map(([q, [l]]) => `<option value="${q}" ${r.quant === q ? 'selected' : ''}>${l}</option>`).join('')}</select>
      <input type="number" data-k="n" min="0" value="${esc(r.n)}">
      <select data-k="subj">${extra}${groups.map(([gl, opts]) => `<optgroup label="${gl}">${opts.map(([val, lab]) =>
        `<option value="${esc(val)}" ${val === r.subj ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</optgroup>`).join('')}</select>
      ${k === 'age' ? `<input type="number" data-k="a" min="0" max="120" value="${esc(r.a)}" aria-label="Age">` : ''}
      ${k === 'age' && v === 'between' ? `<span>to</span><input type="number" data-k="b" min="0" max="120" value="${esc(r.b)}" aria-label="Age to">` : ''}
      <button class="icon-btn rm" data-rm-rule="${r.id}" aria-label="Remove rule">✕</button>
      ${issue ? `<div class="warn-msg">${esc(issue)}</div>` : ''}
    </div>`;
  }).join('') : `<p class="hint" style="margin:0 0 10px">No hard rules yet. Add one, e.g. “each team has at least 1 Director”.</p>`;
  renderChiefApart(P, T);
  renderPresets();
}

function renderChiefApart(P, T) {
  const has = state.people.some(p => p.level === CHIEF);
  const c = P.filter(p => p.level === CHIEF).length;
  const on = state.separateChiefs;
  const d = !has ? 'No Chief-level people in your roster'
    : on && c > T ? `${c} chiefs but only ${T} teams — some will share`
    : 'Each Chief-level person goes to a different team';
  $('#chief-apart').innerHTML = `<div class="bal ${has ? '' : 'disabled'} ${on && c > T ? 'warn' : ''}">
    <div><div class="t">Keep chiefs apart</div><div class="d">${d}</div></div>
    <div class="seg sm">${[['0', 'Off'], ['1', 'On']].map(([x, l]) =>
      `<button data-chiefs="${x}" class="${String(+on) === x ? 'on' : ''}">${l}</button>`).join('')}</div>
  </div>`;
}

function renderPresets() {
  const have = new Set(state.rules.map(r => `${r.quant}|${r.subj}|${r.a}`));
  const lv = state.levels.filter(l => l !== 'Unspecified');
  const g = presentGenders();
  const list = [];
  if (lv.length > 1) list.push({ quant: 'min', n: 1, subj: `l:${lv[lv.length - 1]}` });
  if (g.includes('F')) list.push({ quant: 'min', n: 1, subj: 'g:F' });
  if (g.includes('M')) list.push({ quant: 'min', n: 1, subj: 'g:M' });
  if (state.people.some(p => p.age != null && p.age < 30)) list.push({ quant: 'min', n: 1, subj: 'age:under', a: 30 });
  const show = list.filter(r => !have.has(`${r.quant}|${r.subj}|${r.a ?? 30}`));
  $('#presets').innerHTML = state.people.length ? show.map(r =>
    `<button class="preset" data-preset='${esc(JSON.stringify(r))}'>+ ${esc(ruleText({ a: 30, b: 40, ...r }))}</button>`).join('') : '';
}

function renderTabs() {
  $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.view === state.view));
  $('#view-roster').classList.toggle('on', state.view === 'roster');
  $('#view-teams').classList.toggle('on', state.view === 'teams');
  $('#tab-roster-n').textContent = state.people.length;
  $('#tab-teams-n').textContent = state.result ? state.result.teams.length : '–';
}

/* ---------------- rendering: roster ---------------- */

function emptyHTML(title, text, withActions) {
  return `<div class="empty"><div>
    <div class="illus" style="justify-content:center"><i style="--c:var(--accent)"></i><i style="--c:var(--signal)"></i><i style="--c:var(--g-F)"></i></div>
    <h3>${title}</h3><p>${text}</p>
    ${withActions ? `<div class="row-btns">
      <button class="btn primary" data-act="browse">Choose Excel file</button>
      <button class="btn ghost" data-act="sample">Try sample data</button>
      <button class="btn ghost" data-act="template">Download template</button>
    </div>
    <div class="col-guide"><code>Name</code><code>Age</code><code>Position</code><code>Gender</code><code>Department · optional</code></div>` : ''}
  </div></div>`;
}

function renderRoster() {
  const v = $('#view-roster');
  if (!state.people.length) {
    v.innerHTML = emptyHTML('Start with your roster', 'Drop an Excel or CSV file with your colleagues’ name, age, position and gender. Everything is processed locally in your browser.', true);
    return;
  }
  const dept = hasDept();
  v.innerHTML = `<div class="kpis" id="kpis"></div>
    <div class="card">
      <div class="toolbar">
        <input type="search" id="search" placeholder="Search name, level, department…" value="${esc(search)}">
        <span class="sp"></span>
        <button class="btn ghost sm" data-act="add-person">+ Add person</button>
        <button class="btn ghost sm danger" data-act="clear">Clear roster</button>
      </div>
      <div class="table-wrap"><table class="roster">
        <thead><tr>
          <th class="c-chk"><input type="checkbox" class="cb" id="chk-all" title="Include everyone"></th>
          <th>Name</th><th class="c-age">Age</th><th class="c-g">Gender</th><th class="c-l">Level</th>
          ${dept ? '<th>Department</th>' : ''}<th class="c-x"></th>
        </tr></thead>
        <tbody id="roster-body"></tbody>
      </table></div>
    </div>`;
  renderKpis();
  renderRosterBody();
}

function renderKpis() {
  const el = $('#kpis');
  if (!el) return;
  const all = state.people, P = pool();
  const gc = countBy(P, p => p.gender);
  const ages = P.map(p => p.age).filter(a => a != null);
  const lc = countBy(P, p => p.level);
  const lv = [...state.levels].reverse();
  const bar = (items, total) => `<div class="gbar">${items.filter(([n]) => n).map(([n, c]) =>
    `<i style="width:${n / total * 100}%;background:${c}"></i>`).join('')}</div>`;
  el.innerHTML = `
    <div class="kpi"><div class="l">In pool</div><div class="v">${P.length}<small>of ${all.length}</small></div>
      <div class="legend"><span>${teamCount(P.length)} teams planned</span></div></div>
    <div class="kpi"><div class="l">Gender</div><div class="v">${gc.M || 0}<small>M</small> ${gc.F || 0}<small>F</small>${gc.X ? ` ${gc.X}<small>?</small>` : ''}</div>
      ${bar([[gc.M, 'var(--g-M)'], [gc.F, 'var(--g-F)'], [gc.X, 'var(--g-X)']], P.length || 1)}</div>
    <div class="kpi"><div class="l">Average age</div><div class="v">${ages.length ? avg(ages).toFixed(1) : '–'}</div>
      <div class="legend"><span>${ages.length ? `range ${Math.min(...ages)}–${Math.max(...ages)}` : 'no ages'}${ages.length < P.length ? ` · ${P.length - ages.length} missing` : ''}</span></div></div>
    <div class="kpi"><div class="l">Seniority</div><div class="v">${lv.length}<small>levels</small></div>
      ${bar(lv.map(l => [lc[l] || 0, levelColor(l)]), P.length || 1)}</div>`;
  const chk = $('#chk-all');
  if (chk) {
    const inc = all.filter(p => p.included).length;
    chk.checked = inc === all.length;
    chk.indeterminate = inc > 0 && inc < all.length;
  }
}

function rowHTML(p) {
  const dept = hasDept();
  const lv = [...state.levels].reverse();
  return `<tr data-id="${p.id}">
    <td class="c-chk"><input type="checkbox" class="cb" data-k="included" ${p.included ? 'checked' : ''}></td>
    <td><div style="display:flex;align-items:center"><input type="text" data-k="name" value="${esc(p.name)}"><span class="tag" hidden>filtered out</span></div>
      ${p.position && p.position.toLowerCase() !== p.level.toLowerCase() ? `<span class="pos">${esc(p.position)}</span>` : ''}</td>
    <td class="c-age"><input type="number" data-k="age" min="0" max="120" value="${p.age ?? ''}" placeholder="–"></td>
    <td class="c-g"><div class="g-sel"><i class="dot g-${p.gender}"></i><select data-k="gender">${Object.entries(GENDERS).map(([g, l]) =>
      `<option value="${g}" ${p.gender === g ? 'selected' : ''}>${l}</option>`).join('')}</select></div></td>
    <td class="c-l"><select data-k="level">${lv.map(l => `<option ${p.level === l ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></td>
    ${dept ? `<td><input type="text" data-k="dept" value="${esc(p.dept)}"></td>` : ''}
    <td class="c-x"><button class="icon-btn" data-rm-person="${p.id}" aria-label="Remove">✕</button></td>
  </tr>`;
}

function updateRow(tr, p) {
  const filtered = !passes(p);
  tr.classList.toggle('off', !p.included);
  tr.classList.toggle('filtered', p.included && filtered);
  tr.querySelector('.tag').hidden = !(p.included && filtered);
  tr.querySelector('.dot').className = `dot g-${p.gender}`;
}

function renderRosterBody() {
  const body = $('#roster-body');
  if (!body) return;
  const q = search.trim().toLowerCase();
  const rows = state.people.filter(p => !q || [p.name, p.level, p.position, p.dept, p.age].some(x => String(x ?? '').toLowerCase().includes(q)));
  body.innerHTML = rows.map(rowHTML).join('') ||
    `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--muted)">No one matches “${esc(search)}”.</td></tr>`;
  $$('tr[data-id]', body).forEach(tr => updateRow(tr, byId(tr.dataset.id)));
}

const byId = id => state.people.find(p => p.id === id);

/* ---------------- rendering: teams ---------------- */

function resolvedTeams() {
  if (!state.result) return [];
  const map = new Map(state.people.map(p => [p.id, p]));
  const rules = state.rules.map(r => ({ r, m: matcher(r) }));
  return state.result.teams.map((t, i) => {
    const members = t.ids.map(id => map.get(id)).filter(Boolean)
      .sort((a, b) => rankOf(b.level) - rankOf(a.level) || a.name.localeCompare(b.name));
    const checks = rules.map(({ r, m }) => {
      const c = members.filter(m).length;
      return { r, c, ok: ruleOk(r, c) };
    });
    return { ...t, i, members, checks };
  });
}

function renderTeams(noAnim) {
  const v = $('#view-teams');
  if (!state.result) {
    v.innerHTML = emptyHTML('No teams yet', 'Set the team shape, balance and any rules on the left, then press <b>Present on stage</b> and hit <b>Generate teams</b>.', false);
    return;
  }
  const teams = resolvedTeams();
  const total = teams.reduce((s, t) => s + t.members.length, 0);
  const checks = teams.flatMap(t => t.checks);
  const fails = checks.filter(c => !c.ok).length;
  const avgs = teams.map(t => avg(t.members.map(p => p.age).filter(a => a != null))).filter(a => a != null);
  const status = !state.rules.length ? '' : fails
    ? `<span class="pill bad">✕ ${fails} rule check${fails > 1 ? 's' : ''} not met</span>`
    : `<span class="pill ok">✓ All ${state.rules.length} rule${state.rules.length > 1 ? 's' : ''} met in every team</span>`;
  v.innerHTML = `
    <div class="summary">
      <div class="s-main">${total} people <span>in</span> ${teams.length} teams</div>
      ${status}
      ${avgs.length > 1 ? `<span class="pill" style="background:var(--line-2);color:var(--ink-2)">Avg age ${Math.min(...avgs).toFixed(1)}–${Math.max(...avgs).toFixed(1)}</span>` : ''}
      <span class="sp"></span>
      <div class="acts">
        <button class="btn ghost sm" data-act="open-stage">▶ Present on stage</button>
        <button class="btn ghost sm" data-act="copy">Copy</button>
        <button class="btn ghost sm" data-act="print">Print</button>
        <button class="btn primary sm" data-act="export">Export Excel</button>
      </div>
    </div>
    <p class="drag-hint">Drag people between teams to fine-tune — stats and rule checks update live. Click a team name to rename it.</p>
    <div class="teams ${noAnim ? 'static' : ''}">${teams.map(teamHTML).join('')}</div>`;
}

function teamHTML(t) {
  const hue = TEAM_HUES[t.i % TEAM_HUES.length];
  const m = t.members;
  const gc = countBy(m, p => p.gender);
  const ages = m.map(p => p.age).filter(a => a != null);
  const lc = countBy(m, p => p.level);
  const depts = new Set(m.map(p => p.dept).filter(Boolean)).size;
  const n = m.length || 1;
  return `<article class="ticket" style="--d:${t.i};--hue:${hue};--tint:color-mix(in srgb, ${hue} 9%, white)">
    <header class="t-head">
      <div style="min-width:0;flex:1">
        <div class="t-kicker">TEAM ${String(t.i + 1).padStart(2, '0')}</div>
        <input class="t-name" data-team-name="${t.i}" value="${esc(t.name)}" aria-label="Team name">
      </div>
      <div class="t-count"><b>${m.length}</b><span>people</span></div>
    </header>
    <div class="t-stats">
      <div class="gbar">${['M', 'F', 'X'].filter(g => gc[g]).map(g => `<i class="g-${g}" style="width:${gc[g] / n * 100}%"></i>`).join('')}</div>
      <div class="t-meta">
        <span><i class="dot g-M"></i><b>${gc.M || 0}</b> M</span>
        <span><i class="dot g-F"></i><b>${gc.F || 0}</b> F</span>
        ${gc.X ? `<span><i class="dot g-X"></i><b>${gc.X}</b> ?</span>` : ''}
        <span>avg age <b>${ages.length ? avg(ages).toFixed(1) : '–'}</b></span>
        ${depts ? `<span><b>${depts}</b> dept${depts > 1 ? 's' : ''}</span>` : ''}
      </div>
      <div class="lvl-row">${[...state.levels].reverse().filter(l => lc[l]).map(l =>
        `<span class="lchip" style="--c:${levelColor(l)}" title="${esc(l)}"><i></i>${lc[l]} ${esc(abbr(l))}</span>`).join('')}</div>
    </div>
    <div class="perf"></div>
    <ul class="t-list" data-team="${t.i}">${m.map(p => `<li draggable="true" data-id="${p.id}" title="${esc(`${p.name} · ${p.level}${p.age != null ? ` · ${p.age}` : ''}${p.dept ? ` · ${p.dept}` : ''}`)}">
      <i class="dot g-${p.gender}"></i><span class="n">${esc(p.name)}</span>
      <span class="ab" style="--c:${levelColor(p.level)}">${esc(abbr(p.level))}</span>
      <span class="ag">${p.age ?? '–'}</span></li>`).join('')}</ul>
    ${t.checks.length ? `<footer class="t-rules">${t.checks.map(c =>
      `<span class="rpill ${c.ok ? 'ok' : 'bad'}" title="${esc(`${QUANT[c.r.quant][0]} ${c.r.n} ${subjLabel(c.r)} — has ${c.c}`)}">${c.ok ? '✓' : '✕'} ${esc(ruleText(c.r))}</span>`).join('')}</footer>` : ''}
  </article>`;
}

/* ---------------- actions ---------------- */

function poolError() {
  if (pool().length >= 2) return '';
  return state.people.length ? 'Not enough people match your filters.' : 'Load a roster first.';
}

function makeResult(P, T) {
  const assign = solve(P, T);
  const teams = teamNames(T).map(name => ({ name, ids: [] }));
  P.forEach((p, i) => teams[assign[i]].ids.push(p.id));
  return { teams, at: Date.now() };
}

/* ---------------- stage (live presentation) ---------------- */

const ANALYZE_MS = 5600;
const stage = { timers: [], ping: 0, raf: 0, busy: false, pushed: false };
const later = (fn, ms) => stage.timers.push(setTimeout(fn, ms));
const stageEl = () => $('#stage');
const onStage = () => !stageEl().hidden;

function stopStageTimers() {
  stage.timers.forEach(clearTimeout);
  stage.timers = [];
  clearInterval(stage.ping);
  cancelAnimationFrame(stage.raf);
  stage.busy = false;
}

function setPhase(p) {
  stageEl().dataset.phase = p;
  if (p === 'idle') {
    const go = $('#stage-go');
    go.classList.remove('launch');
    go.focus({ preventScroll: true });
  }
}

function openStage() {
  const err = poolError();
  if (err) { toast(err, 'error'); return; }
  if (location.hash !== '#stage') { stage.pushed = true; location.hash = 'stage'; }
  else showStage();
  document.documentElement.requestFullscreen?.().catch(() => {});
}

function showStage() {
  if (onStage()) return;
  if (poolError()) { history.replaceState(null, '', location.pathname + location.search); return; }
  stageEl().hidden = false;
  document.body.classList.add('on-stage');
  stopStageTimers();
  setPhase('idle');
}

function hideStage() {
  stopStageTimers();
  stageEl().hidden = true;
  document.body.classList.remove('on-stage');
  $('.confetti')?.remove();
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  renderTabs();
  renderTeams(true);
}

function exitStage() {
  if (stage.pushed) { stage.pushed = false; history.back(); return; }
  history.replaceState(null, '', location.pathname + location.search);
  hideStage();
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

function analysisSteps(n, t) {
  const b = state.balance, s = [`Reading ${n} profiles`];
  if (b.gender) s.push('Balancing gender mix');
  if (b.level) s.push('Spreading seniority levels');
  if (b.age) s.push('Matching age profiles');
  if (b.dept && hasDept()) s.push('Mixing departments');
  if (state.separateChiefs && pool().some(p => p.level === CHIEF)) s.push('Separating chief-level staff');
  if (state.rules.length) s.push(`Checking ${state.rules.length} rule${state.rules.length > 1 ? 's' : ''}`);
  s.push(`Optimising ${t} teams`, 'Finalising line-up');
  return s;
}

function buildOrbit(P, result) {
  const teamOf = new Map();
  result.teams.forEach((t, i) => t.ids.forEach(id => teamOf.set(id, i)));
  const show = shuffle([...P]).slice(0, 72);
  const radii = show.length > 40 ? [24, 33, 42] : show.length > 16 ? [26, 37] : [30];
  const total = radii.reduce((a, b) => a + b, 0);
  let k = 0;
  $('#orbit').innerHTML = radii.map((r, ri) => {
    const n = ri === radii.length - 1 ? show.length - k : Math.round(show.length * r / total);
    const chips = show.slice(k, k + n);
    k += n;
    const dur = 70 + ri * 25;
    return `<div class="o-ring ${ri % 2 ? 'rev' : ''}" style="--dur:${dur}s">${chips.map((p, i) => {
      const hue = TEAM_HUES[teamOf.get(p.id) % TEAM_HUES.length];
      return `<span class="o-chip" style="--a:${(360 / chips.length) * i + ri * 17}deg;--r:${r}vmin;--h:${hue}">` +
        `<i class="spin"><i class="fade" style="--in:${Math.round(Math.random() * 900)}ms"><b><i class="dot g-${p.gender}"></i>${esc(p.name.split(/\s+/)[0])}</b></i></i></span>`;
    }).join('')}</div>`;
  }).join('');
}

function runShow() {
  if (stage.busy) return;
  const err = poolError();
  if (err) { toast(err, 'error'); return; }
  stage.busy = true;
  const P = pool(), T = teamCount(P.length);
  const result = makeResult(P, T);
  buildOrbit(P, result);
  const steps = analysisSteps(P.length, T);
  const pct = $('#an-pct'), ring = $('#an-ring'), stepEl = $('#an-step'), orbit = $('#orbit');
  pct.textContent = '0';
  ring.style.strokeDashoffset = 289.03;
  stepEl.textContent = '';
  orbit.classList.remove('assigned');

  $('#stage-go').classList.add('launch');
  later(() => {
    setPhase('analyze');
    const chips = $$('.o-chip', orbit);
    stage.ping = setInterval(() => {
      const c = chips[Math.random() * chips.length | 0];
      c?.classList.add('ping');
      setTimeout(() => c?.classList.remove('ping'), 650);
    }, 110);
    const t0 = performance.now();
    let lastStep = -1;
    const tick = now => {
      const x = Math.min(1, (now - t0) / ANALYZE_MS);
      const e = x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      pct.textContent = Math.round(e * 100);
      ring.style.strokeDashoffset = 289.03 * (1 - e);
      const si = Math.min(steps.length - 1, Math.floor(x * steps.length));
      if (si !== lastStep) {
        lastStep = si;
        stepEl.textContent = steps[si];
        stepEl.classList.remove('swap');
        void stepEl.offsetWidth;
        stepEl.classList.add('swap');
      }
      if (x > .8) orbit.classList.add('assigned');
      if (x < 1) stage.raf = requestAnimationFrame(tick);
    };
    stage.raf = requestAnimationFrame(tick);
    later(() => countdown(result), ANALYZE_MS + 400);
  }, 480);
}

function countdown(result) {
  clearInterval(stage.ping);
  setPhase('count');
  const colors = ['var(--accent)', 'var(--signal)', 'var(--ok)'];
  [3, 2, 1].forEach((n, i) => later(() => {
    $('#stage-count').innerHTML = `<div class="cd" style="--c:${colors[i]}">
      <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" class="trk"/><circle cx="50" cy="50" r="47" class="prg"/></svg>
      <span class="cd-n">${n}</span></div>`;
  }, i * 1000));
  later(() => reveal(result), 3000);
}

// Try every combination of team columns (cols) and per-team name columns (k) and keep the one
// with the largest font that still fits one projector screen.
function revealLayout(T, most, teams) {
  const W = Math.min(innerWidth, 1700) - 2 * clamp(innerWidth * .04, 16, 56);
  const H = innerHeight - 230;
  const longest = Math.min(26, Math.max(...teams.flatMap(t => t.members.map(p => p.name.length))));
  const GAP = 20, SUB_GAP = 14, LINE = 2.15 * 16, CHAR = .53 * 16;
  let best = null;
  for (let cols = 1; cols <= T; cols++) {
    const rows = Math.ceil(T / cols);
    if (cols > 1 && Math.ceil(T / (cols - 1)) === rows) continue;
    const cardW = (W - (cols - 1) * GAP) / cols;
    const cardH = (H - (rows - 1) * GAP) / rows - 100;
    for (let k = 1; k <= 4 && k <= most; k++) {
      const subW = (cardW - 24 - (k - 1) * SUB_GAP) / k;
      const fs = Math.min(1.4, cardH / (Math.ceil(most / k) * LINE), (subW - 76) / (longest * CHAR));
      if (!best || fs > best.fs + .02) best = { cols, k, fs };
    }
  }
  return { cols: best.cols, k: best.k, fs: clamp(best.fs, .8, 1.4).toFixed(2) };
}

function reveal(result) {
  state.result = result;
  state.view = 'teams';
  save();
  const teams = resolvedTeams();
  const T = teams.length;
  const total = teams.reduce((s, t) => s + t.members.length, 0);
  const most = Math.max(...teams.map(t => t.members.length));
  const { cols, k, fs } = revealLayout(T, most, teams);
  const after = (T - 1) * 380 + 650 + most * 70 + 600;
  $('#stage-reveal').innerHTML = `
    <header class="rv-head"><div class="kicker">${total} people · ${T} teams</div><h2>Meet your <em>teams</em></h2></header>
    <div class="rv-grid" style="--cols:${cols};--k:${k};--fs:${fs}rem">${teams.map((t, i) => `
      <article class="rv-team" style="--h:${TEAM_HUES[i % TEAM_HUES.length]};--d:${i}">
        <div class="rv-top"><span class="rv-no">TEAM ${String(i + 1).padStart(2, '0')}</span><h3>${esc(t.name)}</h3></div>
        <ol style="--lines:${Math.ceil(t.members.length / k)}">${t.members.map((p, j) => `<li style="--j:${j}"><span class="n">${esc(p.name)}</span>` +
          `<span class="ab" style="--c:${levelColor(p.level)}">${esc(abbr(p.level))}</span></li>`).join('')}</ol>
      </article>`).join('')}</div>
    <div class="rv-actions" style="--after:${after}ms">
      <button class="btn ghost sm" data-act="stage-again">↻ Generate again</button>
      <button class="btn ghost sm" data-act="export">Export Excel</button>
      <button class="btn primary sm" data-act="exit-stage">Done</button>
    </div>`;
  setPhase('reveal');
  $('#stage-reveal').scrollTop = 0;
  later(confetti, T * 380 + 500);
  stage.busy = false;
}

function confetti() {
  $('.confetti')?.remove();
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = [...TEAM_HUES.slice(0, 5), '#F2C94C'];
  box.innerHTML = Array.from({ length: 90 }, () => {
    const c = colors[Math.random() * colors.length | 0];
    return `<i style="left:${Math.random() * 100}%;--c:${c};--t:${2.4 + Math.random() * 2}s;--dl:${Math.random() * .8}s;` +
      `--x:${Math.round((Math.random() - .5) * 240)}px;--rot:${Math.round((Math.random() - .5) * 1440)}deg"></i>`;
  }).join('');
  stageEl().appendChild(box);
  later(() => box.remove(), 5500);
}

function addRule(r) {
  state.rules.push({ id: uid(), quant: 'min', n: 1, subj: 'g:F', a: 30, b: 40, ...r });
  save();
  renderRules();
  if (state.result) renderTeams(true);
}

function exportXlsx() {
  const teams = resolvedTeams();
  if (!teams.length) return;
  const dept = hasDept();
  const wb = XLSX.utils.book_new();

  const rows = teams.flatMap(t => t.members.map((p, i) => ({
    Team: t.name, '#': i + 1, Name: p.name, Age: p.age ?? '', Gender: GENDERS[p.gender], Level: p.level,
    Position: p.position || p.level, ...(dept ? { Department: p.dept || '' } : {}),
  })));
  const ws1 = XLSX.utils.json_to_sheet(rows);
  ws1['!cols'] = [{ wch: 14 }, { wch: 4 }, { wch: 28 }, { wch: 6 }, { wch: 10 }, { wch: 20 }, { wch: 24 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Teams');

  const maxLen = Math.max(...teams.map(t => t.members.length));
  const aoa = [teams.map(t => t.name), ...Array.from({ length: maxLen }, (_, i) => teams.map(t => t.members[i]?.name ?? ''))];
  const ws2 = XLSX.utils.aoa_to_sheet(aoa);
  ws2['!cols'] = teams.map(() => ({ wch: 24 }));
  XLSX.utils.book_append_sheet(wb, ws2, 'Overview');

  const lv = [...state.levels].reverse();
  const summary = teams.map(t => {
    const gc = countBy(t.members, p => p.gender), lc = countBy(t.members, p => p.level);
    const ages = t.members.map(p => p.age).filter(a => a != null);
    const row = { Team: t.name, People: t.members.length, 'Avg age': ages.length ? +avg(ages).toFixed(1) : '', Male: gc.M || 0, Female: gc.F || 0 };
    lv.forEach(l => { row[l] = lc[l] || 0; });
    if (t.checks.length) row['Rules met'] = `${t.checks.filter(c => c.ok).length}/${t.checks.length}`;
    return row;
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');

  XLSX.writeFile(wb, `teams-${new Date().toISOString().slice(0, 10)}.xlsx`);
  toast('Excel file downloaded');
}

function copyTeams() {
  const txt = resolvedTeams().map(t => `${t.name} (${t.members.length})\n` +
    t.members.map(p => `  • ${p.name} — ${p.level}${p.age != null ? `, ${p.age}` : ''}`).join('\n')).join('\n\n');
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = txt;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    toast(ok ? 'Copied to clipboard' : 'Copy failed', ok ? '' : 'error');
  };
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(() => toast('Copied to clipboard'), fallback);
  else fallback();
}

function downloadTemplate() {
  const aoa = [
    ['Name', 'Age', 'Position', 'Gender', 'Department'],
    ['Somchai Wongsakul', 52, 'Director', 'Male', 'Operations'],
    ['Nattaya Srisuk', 44, 'Associate Director', 'Female', 'Finance'],
    ['Kittipong Rattanakorn', 36, 'Manager', 'Male', 'Engineering'],
    ['Pimchanok Thongdee', 28, 'Staff', 'Female', 'Commercial'],
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{ wch: 26 }, { wch: 6 }, { wch: 20 }, { wch: 8 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Colleagues');
  XLSX.writeFile(wb, 'team-roster-template.xlsx');
}

function loadSample() {
  const male = ['Somchai', 'Kittipong', 'Anan', 'Chaiwat', 'Prasert', 'Thanakorn', 'Wichai', 'Narongrit', 'Pongsakorn', 'Surasak', 'Teerapat', 'Jirayu', 'Nattapong', 'Panupong', 'Sittichai', 'Worawit', 'Kasem', 'Apichart', 'Ekkachai', 'Rattapon'];
  const female = ['Nattaya', 'Pimchanok', 'Siriporn', 'Kanokwan', 'Wanida', 'Ratchanee', 'Supaporn', 'Chutima', 'Arunee', 'Duangjai', 'Pornthip', 'Kulthida', 'Thitima', 'Napat', 'Sasithorn', 'Jiraporn', 'Malee', 'Orawan', 'Patcharee', 'Benjamas'];
  const last = shuffle(['Wongsakul', 'Srisuk', 'Rattanakorn', 'Thongdee', 'Chaiyaporn', 'Phromma', 'Saetang', 'Boonmee', 'Kaewmanee', 'Sukjai', 'Charoenrat', 'Siriwat', 'Pattanapong', 'Rungruang', 'Suwannarat', 'Kongkaew', 'Nakprasert', 'Tantiwong', 'Jaidee', 'Intharasombat', 'Somboon', 'Thepsiri', 'Wattana', 'Kraisorn', 'Limthong', 'Sangsuk', 'Bunnag', 'Chantara', 'Panyasiri', 'Udomsak', 'Yensuk', 'Mahasap', 'Ruangsri', 'Kittikun', 'Saengthong', 'Thammarat', 'Amornrat', 'Phuphan', 'Sriwong', 'Chaimongkol']);
  const depts = ['Operations', 'Engineering', 'Finance', 'Commercial', 'HR'];
  const plan = [['Director', 4, 46, 58], ['Associate Director', 6, 39, 50], ['Manager', 12, 31, 45], ['Staff', 18, 23, 34]];
  const fm = shuffle([...male]), ff = shuffle([...female]);
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const people = [];
  let k = 0;
  for (const [level, n, lo, hi] of plan) {
    for (let i = 0; i < n; i++) {
      const g = (fm.length && Math.random() < 0.55) || !ff.length ? 'M' : 'F';
      const first = g === 'M' ? fm.pop() : ff.pop();
      people.push({ id: uid(), name: `${first} ${last[k++ % last.length]}`, age: rnd(lo, hi), gender: g, level, position: level, dept: depts[rnd(0, depts.length - 1)], included: true });
    }
  }
  setRoster(people, 'replace');
  toast(`Loaded ${people.length} sample colleagues`);
}

function setRoster(people, mode) {
  state.people = mode === 'append' ? [...state.people, ...people] : people;
  if (mode !== 'append') state.filter.levels = {};
  state.result = null;
  state.view = 'roster';
  syncLevels();
  save();
  renderAll();
}

/* ---------------- import dialog ---------------- */

let imp = null;

async function handleFile(file) {
  if (!file) return;
  if (typeof XLSX === 'undefined') { toast('Excel reader failed to load — check your internet connection.', 'error'); return; }
  let wb;
  try {
    wb = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
  } catch {
    toast('Could not read that file. Is it a valid Excel or CSV?', 'error');
    return;
  }
  imp = { wb, sheet: wb.SheetNames[0], mode: 'replace' };
  $('#imp-file').textContent = file.name;
  $('#imp-sheet').innerHTML = wb.SheetNames.map(s => `<option>${esc(s)}</option>`).join('');
  $('#imp-sheet-field').hidden = wb.SheetNames.length < 2;
  loadSheet();
  $('#import-dlg').showModal();
}

function loadSheet() {
  const rows = XLSX.utils.sheet_to_json(imp.wb.Sheets[imp.sheet], { header: 1, defval: '', raw: true, blankrows: false });
  let h = 0, bestScore = 0;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const score = rows[i].filter(c => typeof c === 'string' && FIELDS.some(([, , rx]) => rx.test(c))).length;
    if (score > bestScore) { bestScore = score; h = i; }
  }
  const width = Math.max(0, ...rows.map(r => r.length));
  imp.headers = Array.from({ length: width }, (_, i) => String(rows[h]?.[i] ?? '').trim() || `Column ${XLSX.utils.encode_col(i)}`);
  imp.rows = rows.slice(h + 1).filter(r => r.some(c => String(c).trim() !== ''));
  imp.map = {};
  const taken = new Set();
  for (const key of ['gender', 'age', 'dept', 'position', 'name']) {
    const rx = FIELDS.find(f => f[0] === key)[2];
    const i = imp.headers.findIndex((hd, j) => !taken.has(j) && rx.test(hd));
    imp.map[key] = i;
    if (i >= 0) taken.add(i);
  }
  if (imp.map.name < 0) imp.map.name = imp.headers.findIndex((_, j) => !taken.has(j));
  renderImport();
}

function toPerson(r, m) {
  const cell = k => m[k] >= 0 ? r[m[k]] : '';
  const position = String(cell('position') ?? '').trim();
  return {
    id: uid(),
    name: String(cell('name') ?? '').trim(),
    age: parseAge(cell('age')),
    gender: canonGender(cell('gender')),
    position,
    level: canonLevel(position),
    dept: String(cell('dept') ?? '').trim(),
    included: true,
  };
}

function renderImport() {
  const m = imp.map;
  $('#imp-map').innerHTML = FIELDS.map(([k, label]) => `<div>
    <label>${label}${k === 'dept' ? ' <em>optional</em>' : ''}</label>
    <select data-map="${k}"><option value="-1">— none —</option>${imp.headers.map((h, i) =>
      `<option value="${i}" ${m[k] === i ? 'selected' : ''}>${esc(h)}</option>`).join('')}</select></div>`).join('');
  const people = imp.rows.map(r => toPerson(r, m)).filter(p => p.name);
  const miss = (cond, txt) => cond ? `<td class="miss">${txt}</td>` : null;
  $('#imp-preview').innerHTML = `<thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Level</th>${m.dept >= 0 ? '<th>Department</th>' : ''}</tr></thead>
    <tbody>${people.slice(0, 8).map(p => `<tr>
      <td>${esc(p.name)}</td>
      ${miss(p.age == null, 'missing') ?? `<td>${p.age}</td>`}
      ${miss(p.gender === 'X', 'unknown') ?? `<td>${GENDERS[p.gender]}</td>`}
      ${miss(p.level === 'Unspecified', 'missing') ?? `<td>${esc(p.level)}${p.position && p.position.toLowerCase() !== p.level.toLowerCase() ? ` <span style="color:var(--muted)">← ${esc(p.position)}</span>` : ''}</td>`}
      ${m.dept >= 0 ? `<td>${esc(p.dept)}</td>` : ''}
    </tr>`).join('')}</tbody>`;
  const noAge = people.filter(p => p.age == null).length;
  const noG = people.filter(p => p.gender === 'X').length;
  const lv = [...new Set(people.map(p => p.level))];
  $('#imp-stats').innerHTML = `<b>${people.length}</b> people found${people.length > 8 ? ' (showing 8)' : ''} · ${lv.length} level${lv.length !== 1 ? 's' : ''}: ${esc(lv.join(', '))}` +
    (noAge ? ` · <span style="color:var(--bad)">${noAge} without age</span>` : '') +
    (noG ? ` · <span style="color:var(--bad)">${noG} unrecognised gender</span>` : '');
  $$('#imp-mode button').forEach(b => b.classList.toggle('on', b.dataset.v === imp.mode));
  $('#imp-mode').hidden = !state.people.length;
  $('#imp-go').disabled = !people.length;
  imp.people = people;
}

/* ---------------- toast ---------------- */

let toastTimer;
function toast(msg, kind = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `show ${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = kind; }, 2800);
}

/* ---------------- events ---------------- */

document.addEventListener('click', e => {
  const t = e.target.closest('button, [data-act]');
  if (!t) return;
  const act = t.dataset.act;
  if (act === 'browse') $('#file').click();
  else if (act === 'sample') loadSample();
  else if (act === 'template') downloadTemplate();
  else if (act === 'open-stage') openStage();
  else if (act === 'exit-stage') exitStage();
  else if (act === 'fullscreen') toggleFullscreen();
  else if (act === 'stage-again') { stopStageTimers(); $('.confetti')?.remove(); setPhase('idle'); }
  else if (act === 'export') exportXlsx();
  else if (act === 'copy') copyTeams();
  else if (act === 'print') window.print();
  else if (act === 'add-person') {
    const lv = state.levels;
    state.people.unshift({ id: uid(), name: 'New person', age: null, gender: 'X', level: lv[0] || 'Unspecified', position: '', dept: '', included: true });
    syncLevels(); save(); renderAll();
    $('#roster-body input[data-k="name"]')?.select();
  } else if (act === 'clear') {
    if (confirm('Remove everyone from the roster? This also clears generated teams.')) setRoster([], 'replace');
  }

  if (t.dataset.view) { state.view = t.dataset.view; save(); renderTabs(); }
  if (t.dataset.lvlMove) {
    const i = state.levels.indexOf(t.dataset.lvlMove), j = i + +t.dataset.dir;
    if (i >= 0 && j >= 0 && j < state.levels.length) {
      [state.levels[i], state.levels[j]] = [state.levels[j], state.levels[i]];
      save(); renderAll();
    }
  }
  if (t.dataset.bal) { state.balance[t.dataset.bal] = +t.dataset.v; save(); renderBalance(); }
  if (t.dataset.chiefs) { state.separateChiefs = t.dataset.chiefs === '1'; save(); renderRules(); }
  if (t.closest('#shape-mode')) {
    state.shape.mode = t.dataset.v; save(); renderShape(); renderRules(); renderKpis();
  }
  if (t.dataset.step) {
    const k = state.shape.mode;
    state.shape[k] = Math.max(1, (+state.shape[k] || 1) + +t.dataset.step);
    save(); renderShape(); renderRules(); renderKpis();
  }
  if (t.dataset.rmRule) {
    state.rules = state.rules.filter(r => r.id !== t.dataset.rmRule);
    save(); renderRules(); if (state.result) renderTeams(true);
  }
  if (t.dataset.preset) addRule(JSON.parse(t.dataset.preset));
  if (t.id === 'btn-add-rule') addRule({});
  if (t.id === 'stage-go') runShow();
  if (t.dataset.rmPerson) {
    state.people = state.people.filter(p => p.id !== t.dataset.rmPerson);
    syncLevels(); save(); renderAll();
  }
  if (t.closest('#imp-mode') && t.dataset.v) { imp.mode = t.dataset.v; renderImport(); }
});

document.addEventListener('change', e => {
  const el = e.target;

  if (el.id === 'file') { handleFile(el.files[0]); el.value = ''; return; }
  if (el.dataset.fg) { state.filter.genders[el.dataset.fg] = el.checked; afterFilter(); return; }
  if (el.dataset.fl) { state.filter.levels[el.dataset.fl] = el.checked; afterFilter(); return; }
  if (el.id === 'f-age-min' || el.id === 'f-age-max') {
    state.filter[el.id === 'f-age-min' ? 'ageMin' : 'ageMax'] = el.value === '' ? '' : +el.value;
    afterFilter(); return;
  }
  if (el.id === 'shape-n') {
    state.shape[state.shape.mode] = Math.max(1, Math.round(+el.value) || 1);
    save(); renderShape(); renderRules(); renderKpis(); return;
  }
  if (el.id === 'shape-naming') {
    state.shape.naming = el.value;
    if (state.result) state.result.teams.forEach((t, i) => { t.name = teamNames(state.result.teams.length)[i]; });
    save(); renderTeams(true); return;
  }
  if (el.id === 'chk-all') {
    state.people.forEach(p => { p.included = el.checked; });
    save(); renderRosterBody(); renderKpis(); renderSetup(); return;
  }

  const ruleEl = el.closest('[data-rule]');
  if (ruleEl) {
    const r = state.rules.find(x => x.id === ruleEl.dataset.rule);
    const k = el.dataset.k;
    r[k] = k === 'quant' || k === 'subj' ? el.value : Math.max(0, +el.value || 0);
    save();
    if (k === 'subj') renderRules();
    else {
      const P = pool(), issue = ruleIssue(r, P, teamCount(P.length));
      ruleEl.classList.toggle('warn', !!issue);
      ruleEl.querySelector('.warn-msg')?.remove();
      if (issue) ruleEl.insertAdjacentHTML('beforeend', `<div class="warn-msg">${esc(issue)}</div>`);
      renderPresets();
    }
    if (state.result) renderTeams(true);
    return;
  }

  const row = el.closest('#roster-body tr[data-id]');
  if (row) {
    const p = byId(row.dataset.id), k = el.dataset.k;
    if (k === 'included') p.included = el.checked;
    else if (k === 'age') p.age = el.value === '' ? null : clamp(Math.round(+el.value), 0, 120);
    else if (k === 'name' || k === 'dept') p[k] = el.value.trim();
    else p[k] = el.value;
    save();
    updateRow(row, p);
    renderKpis();
    renderSetup();
    renderTabs();
    return;
  }

  if (el.dataset.teamName != null) {
    state.result.teams[+el.dataset.teamName].name = el.value.trim() || `Team ${+el.dataset.teamName + 1}`;
    save(); return;
  }
  if (el.dataset.map) { imp.map[el.dataset.map] = +el.value; renderImport(); return; }
  if (el.id === 'imp-sheet') { imp.sheet = el.value; loadSheet(); }
});

function afterFilter() {
  save();
  renderFilter(); renderShape(); renderRules(); renderKpis();
  $$('#roster-body tr[data-id]').forEach(tr => updateRow(tr, byId(tr.dataset.id)));
}

document.addEventListener('input', e => {
  if (e.target.id === 'search') { search = e.target.value; renderRosterBody(); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('.t-name')) e.target.blur();
  if (!onStage()) return;
  const phase = stageEl().dataset.phase;
  if (e.key === 'Escape') exitStage();
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  else if (phase === 'idle' && [' ', 'Enter', 'PageDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); runShow(); }
});

window.addEventListener('hashchange', () => {
  if (location.hash === '#stage') showStage();
  else if (onStage()) hideStage();
});

$('#import-dlg').addEventListener('close', () => {
  if ($('#import-dlg').returnValue === 'ok' && imp?.people?.length) {
    const n = imp.people.length;
    setRoster(imp.people, state.people.length ? imp.mode : 'replace');
    toast(`Imported ${n} people`);
  }
  imp = null;
});

/* drag & drop: files onto the page, people between teams */

let dragId = null;
const isFileDrag = e => [...(e.dataTransfer?.types || [])].includes('Files');

document.addEventListener('dragstart', e => {
  const li = e.target.closest?.('.t-list li');
  if (!li) return;
  dragId = li.dataset.id;
  li.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
});
document.addEventListener('dragend', () => {
  dragId = null;
  $$('.dragging, .over').forEach(x => x.classList.remove('dragging', 'over'));
});
document.addEventListener('dragover', e => {
  if (isFileDrag(e)) { e.preventDefault(); $('#drop').classList.add('over'); return; }
  const ul = e.target.closest?.('.t-list');
  if (ul && dragId) { e.preventDefault(); $$('.t-list.over').forEach(x => x !== ul && x.classList.remove('over')); ul.classList.add('over'); }
});
document.addEventListener('dragleave', e => {
  if (isFileDrag(e) && !e.relatedTarget) $('#drop').classList.remove('over');
});
document.addEventListener('drop', e => {
  if (isFileDrag(e)) {
    e.preventDefault();
    $('#drop').classList.remove('over');
    handleFile(e.dataTransfer.files[0]);
    return;
  }
  const ul = e.target.closest?.('.t-list');
  if (!ul || !dragId || !state.result) return;
  e.preventDefault();
  const to = +ul.dataset.team;
  state.result.teams.forEach(t => { t.ids = t.ids.filter(id => id !== dragId); });
  state.result.teams[to].ids.push(dragId);
  dragId = null;
  save();
  renderTeams(true);
});

renderAll();
if (location.hash === '#stage') showStage();
