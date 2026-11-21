// The About toss: sheets of paper that leave the photo's paper cluster and
// flutter down the section. Pure canvas 2D, no dependencies.
//
// Each sheet is a flat card seen from the front. Two rotations sell the 3D:
// `theta` turns it in the page plane, and `phi` turns it about its own
// horizontal axis, which the renderer draws as a vertical scale of cos(phi)
// (a sheet edge-on is a sliver; past 90° we see its back). Drag depends on
// how flat the sheet is to the fall, so edge-on sheets slice down and flat
// ones float, and that alone produces the flutter. Two kinds of fallers:
//   - flutterers rock about a mostly-flat pose, swaying side to side
//   - tumblers spin end over end and drift in the direction they spin
// Units are CSS pixels and seconds.

const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- textures

// Drawn once at roughly 2x the largest on-screen sheet, letter proportions.
const TEX_W = 96;
const TEX_H = 124;
const PAPER = '#FFFFFF';
const PAPER_BACK = '#F3F5F9';
const EDGE = 'rgba(15, 23, 42, 0.12)';
const INK_TEXT = 'rgba(15, 23, 42, 0.17)';
const ULTRAMARINE = 'rgba(8, 36, 169, 0.85)';
const ULTRAMARINE_SOFT = 'rgba(8, 36, 169, 0.32)';
const GRID = 'rgba(8, 36, 169, 0.11)';

function sheetCanvas(fill) {
  const c = document.createElement('canvas');
  c.width = TEX_W;
  c.height = TEX_H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  return { c, ctx };
}

function edge(ctx) {
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, TEX_W - 2, TEX_H - 2);
}

// Rows of typeset "text": full measure, a short last line per paragraph.
function lines(ctx, rng, { y, rows, color, mirror = false }) {
  const x = 13;
  const measure = TEX_W - 26;
  for (let i = 0; i < rows; i++) {
    const len = i === rows - 1 ? 0.3 + rng() * 0.3 : 0.78 + rng() * 0.22;
    const w = measure * len;
    ctx.fillStyle = color;
    ctx.fillRect(mirror ? TEX_W - x - w : x, y + i * 9, w, 3);
  }
}

function buildTextures() {
  const rng = mulberry32(7);
  const kinds = [];

  // Blank sheet, like the ones already in the photo.
  {
    const front = sheetCanvas(PAPER);
    edge(front.ctx);
    const back = sheetCanvas(PAPER_BACK);
    edge(back.ctx);
    kinds.push({ front: front.c, back: back.c, weight: 0.4 });
  }

  // Typed page, with the text faintly showing through the back.
  {
    const seed = rng() * 1e9;
    const front = sheetCanvas(PAPER);
    lines(front.ctx, mulberry32(seed), { y: 16, rows: 5, color: INK_TEXT });
    lines(front.ctx, mulberry32(seed + 1), { y: 68, rows: 4, color: INK_TEXT });
    edge(front.ctx);
    const back = sheetCanvas(PAPER_BACK);
    lines(back.ctx, mulberry32(seed), { y: 16, rows: 5, color: 'rgba(15,23,42,0.05)', mirror: true });
    lines(back.ctx, mulberry32(seed + 1), { y: 68, rows: 4, color: 'rgba(15,23,42,0.05)', mirror: true });
    edge(back.ctx);
    kinds.push({ front: front.c, back: back.c, weight: 0.3 });
  }

  // A resume-like page: an Ultramarine heading over two blocks of text.
  {
    const seed = rng() * 1e9;
    const front = sheetCanvas(PAPER);
    front.ctx.fillStyle = ULTRAMARINE;
    front.ctx.fillRect(13, 14, 40, 7);
    front.ctx.fillStyle = ULTRAMARINE_SOFT;
    front.ctx.fillRect(13, 26, 26, 3);
    lines(front.ctx, mulberry32(seed), { y: 42, rows: 4, color: INK_TEXT });
    front.ctx.fillStyle = ULTRAMARINE_SOFT;
    front.ctx.fillRect(13, 84, 22, 3);
    lines(front.ctx, mulberry32(seed + 1), { y: 94, rows: 3, color: INK_TEXT });
    edge(front.ctx);
    const back = sheetCanvas(PAPER_BACK);
    back.ctx.fillStyle = 'rgba(8,36,169,0.07)';
    back.ctx.fillRect(TEX_W - 13 - 40, 14, 40, 7);
    lines(back.ctx, mulberry32(seed), { y: 42, rows: 4, color: 'rgba(15,23,42,0.05)', mirror: true });
    edge(back.ctx);
    kinds.push({ front: front.c, back: back.c, weight: 0.15 });
  }

  // Grid paper, the site's sketching sheet.
  {
    const front = sheetCanvas(PAPER);
    front.ctx.fillStyle = GRID;
    for (let x = 8; x < TEX_W; x += 9) front.ctx.fillRect(x, 0, 1, TEX_H);
    for (let y = 8; y < TEX_H; y += 9) front.ctx.fillRect(0, y, TEX_W, 1);
    edge(front.ctx);
    const back = sheetCanvas(PAPER_BACK);
    edge(back.ctx);
    kinds.push({ front: front.c, back: back.c, weight: 0.15 });
  }

  return kinds;
}

// A soft shadow card, blurred once. The shadow is cast by drawing the card
// far off-canvas and offsetting only its shadow back in, which works in every
// browser (unlike ctx.filter).
const SHADOW_PAD = 14;

// Sheets at or above this depth fall in front of the photo; the rest behind it.
const NEAR = 0.82;
function buildShadow() {
  const c = document.createElement('canvas');
  c.width = TEX_W / 2 + SHADOW_PAD * 2;
  c.height = TEX_H / 2 + SHADOW_PAD * 2;
  const ctx = c.getContext('2d');
  ctx.shadowColor = 'rgba(15, 23, 42, 1)';
  ctx.shadowBlur = 9;
  ctx.shadowOffsetX = 1000;
  ctx.fillRect(SHADOW_PAD - 1000, SHADOW_PAD, TEX_W / 2, TEX_H / 2);
  return c;
}

let shared = null;
function assets() {
  if (!shared) shared = { kinds: buildTextures(), shadow: buildShadow() };
  return shared;
}

// ---------------------------------------------------------------- the field

export class PaperField {
  constructor({ rng = Math.random, max = 40 } = {}) {
    this.rng = rng;
    this.max = max;
    this.sheets = []; // kept sorted far → near, so nearer sheets draw on top
    this.pending = []; // { at, toss } staggered spawns
    this.time = 0;
    this.w = 0;
    this.h = 0;
    this.scale = 1;
    this.fadeTop = 0; // canvas y where the section begins
    this.source = null; // the photo's paper cluster, in canvas coordinates
    this.dirty = true;
    const { kinds, shadow } = assets();
    this.kinds = kinds;
    this.shadow = shadow;
  }

  resize(w, h, { scale = 1, fadeTop = 0, max = this.max } = {}) {
    this.w = w;
    this.h = h;
    this.scale = scale;
    this.fadeTop = fadeTop;
    this.max = max;
    this.dirty = true;
  }

  setSource(rect) {
    this.source = rect;
  }

  get count() {
    return this.sheets.length + this.pending.length;
  }

  // A toss: n sheets leave the cluster over `spread` seconds.
  burst(n, { spread = 0.5, toss = true } = {}) {
    for (let i = 0; i < n; i++) {
      this.pending.push({ at: this.time + (spread * i) / Math.max(1, n - 1) + this.rng() * 0.05, toss });
    }
    this.pending.sort((a, b) => a.at - b.at);
  }

  pickKind() {
    let r = this.rng();
    for (const kind of this.kinds) {
      if ((r -= kind.weight) <= 0) return kind;
    }
    return this.kinds[0];
  }

  add(toss) {
    const src = this.source;
    if (!src || this.sheets.length >= this.max) return;
    const r = this.rng;
    const depth = 0.5 + 0.75 * r() ** 1.3; // 0.5 far … 1.25 near, mostly mid-to-far
    const w = (12 + 44 * depth ** 1.6) * this.scale; // ~26px far … ~75px near
    const x = src.x + src.w * (0.2 + r() * 0.65);
    const y = src.y + src.h * (0.05 + r() * 0.3);
    // Thrown out from a point right of centre, so most sheets head left, over
    // the open page behind the copy.
    const dir = clamp((x - (src.x + src.w * 0.66)) / (src.w * 0.3), -1.6, 1.2);
    const tumble = r() < 0.4;
    const sheet = {
      x,
      y,
      // Near sheets fly wider, so fewer of them land across the photo.
      vx: (dir * (toss ? 170 + r() * 260 : 20 + r() * 50) * (0.75 + 0.45 * depth) + (r() - 0.5) * (toss ? 220 : 60)) * this.scale,
      vy: (toss ? -(300 + r() * 360) * (0.7 + 0.3 * depth) : -(30 + r() * 80)) * this.scale,
      tumble,
      theta: (r() - 0.5) * 1.6,
      theta0: (r() - 0.5) * 1.2,
      spin: (r() - 0.5) * 1.2,
      phi: tumble ? r() * TAU : 0,
      phiBase: (r() - 0.5) * 0.5,
      omega: tumble ? (2.4 + r() * 3) * (r() < 0.5 ? -1 : 1) : 0,
      freq: 0.35 + r() * 0.4,
      amp: (80 + r() * 100) * this.scale, // sway speed; ±25–60px of drift
      phase: r() * TAU,
      kick: 0,
      phiOff: 0,
      thetaOff: 0,
      depth,
      w,
      h: w * (TEX_H / TEX_W),
      kind: this.pickKind(),
      alpha: 0.7 + 0.3 * (depth - 0.5) / 0.75,
      age: 0,
    };
    let i = this.sheets.length;
    while (i > 0 && this.sheets[i - 1].depth > depth) i--;
    this.sheets.splice(i, 0, sheet);
  }

  // Air moving at the pointer's velocity drags nearby sheets along with it.
  // Blending toward that velocity (rather than adding impulses) keeps the
  // push the same whatever the mouse's event rate.
  gust(px, py, vx, vy, dt) {
    const R = 180 * this.scale;
    const speed = Math.hypot(vx, vy);
    const ax = clamp(vx, -1400, 1400) * 0.55;
    const ay = clamp(vy, -1400, 1400) * 0.55;
    const blend = Math.min(1, dt * 9);
    for (const s of this.sheets) {
      const dx = s.x - px;
      const dy = s.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 > R * R) continue;
      const f = (1 - Math.sqrt(d2) / R) ** 2 * blend;
      s.vx += (ax - s.vx) * f;
      s.vy += (ay - s.vy) * f;
      s.kick = clamp(s.kick + Math.sign(vx || 1) * speed * 0.006 * f, -9, 9);
    }
  }

  step(dt) {
    this.time += dt;
    while (this.pending.length && this.pending[0].at <= this.time) this.add(this.pending.shift().toss);

    const t = this.time;
    const wind = (-12 + 14 * Math.sin(t * 0.13) + 6 * Math.sin(t * 0.37 + 1.3)) * this.scale;
    const sheets = this.sheets;
    for (let i = sheets.length - 1; i >= 0; i--) {
      const s = sheets[i];
      s.age += dt;
      s.phase += TAU * s.freq * dt;
      s.kick *= Math.exp(-2.4 * dt);

      if (s.tumble) {
        s.phi += (s.omega + s.kick) * dt;
        s.theta += (s.spin + s.kick * 0.2) * dt;
      } else {
        s.phiOff += s.kick * dt;
        s.thetaOff += s.kick * 0.25 * dt;
        s.phi = s.phiBase + 0.85 * Math.sin(s.phase) + s.phiOff;
        s.theta = s.theta0 + 0.42 * Math.sin(s.phase + 0.9) + s.thetaOff;
      }

      // Flat sheets catch the air; edge-on sheets slice through it. Right
      // after the toss the air hasn't caught them yet, so they rise first.
      const flat = Math.abs(Math.cos(s.phi));
      const air = Math.min(1, s.age / 0.8);
      const k = (1.6 + 3.6 * flat) * (0.22 + 0.78 * air);
      const g = 540 * (0.5 + 0.5 * s.depth) * this.scale;
      s.vy += (g - k * s.vy) * dt;

      // The throw dies into the wind (plus a tumbler's glide); the sway rides on
      // top as a pendulum, fading in as the air catches the sheet.
      const glide = s.tumble ? Math.sign(s.omega) * 38 : 0;
      s.vx += (wind + glide - s.vx) * (1 - Math.exp(-(0.5 + 1.4 * air) * dt));

      s.x += (s.vx + s.amp * air * Math.cos(s.phase)) * dt;
      s.y += s.vy * dt;

      const margin = s.h + 40;
      if (s.y > this.h + margin || s.x < -margin || s.x > this.w + margin) sheets.splice(i, 1);
    }
    this.dirty = true;
  }

  // Far sheets go to `back` (under the photo, so the cut-out hides them as
  // they pass behind Jason); near sheets go to `front`, over the photo.
  draw(back, front, dpr) {
    if (!this.dirty) return;
    this.dirty = false;
    for (const ctx of [back, front]) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const { shadow } = this;
    const bottomFade = 150 * this.scale;
    for (const s of this.sheets) {
      const fadeIn = Math.min(1, s.age / 0.35);
      const bottom = clamp((this.h - s.y) / bottomFade, 0, 1);
      const top = clamp((s.y - (this.fadeTop - 110)) / 110, 0, 1);
      const a = fadeIn * bottom * top * s.alpha;
      if (a < 0.01) continue;

      const ctx = s.depth >= NEAR ? front : back;
      const c = Math.cos(s.phi);
      const sy = Math.abs(c) < 0.08 ? (c < 0 ? -0.08 : 0.08) : c;
      const cos = Math.cos(s.theta) * dpr;
      const sin = Math.sin(s.theta) * dpr;
      const hw = s.w / 2;
      const hh = s.h / 2;

      // Shadow on the page, further off the nearer (higher) the sheet.
      ctx.globalAlpha = a * 0.14 * (0.35 + 0.65 * Math.abs(c));
      ctx.setTransform(cos, sin, -sin * sy, cos * sy, (s.x + 4 * s.depth) * dpr, (s.y + 10 * s.depth) * dpr);
      const sx = s.w / (TEX_W / 2);
      ctx.drawImage(shadow, -hw - SHADOW_PAD * sx, -hh - SHADOW_PAD * sx, s.w + SHADOW_PAD * 2 * sx, s.h + SHADOW_PAD * 2 * sx);

      // The sheet: front or back, shaded as it turns away from the light.
      ctx.globalAlpha = a;
      ctx.setTransform(cos, sin, -sin * sy, cos * sy, s.x * dpr, s.y * dpr);
      ctx.drawImage(c >= 0 ? s.kind.front : s.kind.back, -hw, -hh, s.w, s.h);
      const shade = (1 - Math.abs(c)) ** 2 * 0.2 + (c < 0 ? 0.035 : 0);
      if (shade > 0.01) {
        ctx.globalAlpha = a * shade;
        ctx.fillStyle = '#1B2A63';
        ctx.fillRect(-hw, -hh, s.w, s.h);
      }
    }
    back.globalAlpha = 1;
    front.globalAlpha = 1;
  }
}
