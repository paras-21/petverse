// Tiny 8-bit chiptune synth on WebAudio. No audio files.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let muted = false;

export function setMuted(m: boolean) {
  muted = m;
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.3;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

interface ToneOpts {
  type?: OscillatorType;
  v?: number;
  at?: number;
  to?: number;
}

function tone(f: number, d: number, o: ToneOpts = {}) {
  const c = audio();
  if (!c || !master || muted) return;
  const t = c.currentTime + (o.at ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? 'square';
  osc.frequency.setValueAtTime(f, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  const v = o.v ?? 0.2;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.006);
  g.gain.setValueAtTime(v, t + d * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + d + 0.03);
}

interface NoiseOpts {
  v?: number;
  at?: number;
  f?: number;
  to?: number;
  type?: BiquadFilterType;
  q?: number;
}

function noise(d: number, o: NoiseOpts = {}) {
  const c = audio();
  if (!c || !master || muted) return;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const ch = noiseBuf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + (o.at ?? 0);
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const filt = c.createBiquadFilter();
  filt.type = o.type ?? 'bandpass';
  filt.frequency.setValueAtTime(o.f ?? 1200, t);
  if (o.to) filt.frequency.exponentialRampToValueAtTime(o.to, t + d);
  filt.Q.value = o.q ?? 1;
  const g = c.createGain();
  g.gain.setValueAtTime(o.v ?? 0.3, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  src.connect(filt);
  filt.connect(g);
  g.connect(master);
  src.start(t, Math.random() * 0.5);
  src.stop(t + d + 0.02);
}

function seq(notes: number[], step: number, d: number, o: ToneOpts = {}) {
  notes.forEach((n, i) => {
    if (n > 0) tone(midi(n), d, { ...o, at: (o.at ?? 0) + i * step });
  });
}

export const sfx = {
  click() {
    tone(660, 0.05, { v: 0.12 });
  },
  tap() {
    tone(520, 0.06, { v: 0.18 });
    tone(780, 0.05, { v: 0.12, at: 0.03 });
  },
  crack() {
    noise(0.12, { v: 0.45, f: 1800, q: 2 });
    tone(320, 0.12, { to: 120, v: 0.16 });
  },
  hatch() {
    noise(0.45, { v: 0.5, type: 'lowpass', f: 4000, to: 300 });
    seq([72, 76, 79, 84, 88], 0.07, 0.08, { v: 0.18, at: 0.15 });
    tone(midi(84), 0.45, { type: 'triangle', v: 0.3, at: 0.5 });
  },
  pop() {
    tone(300, 0.12, { to: 900, v: 0.18 });
  },
  bite() {
    noise(0.07, { v: 0.35, f: 900, q: 3 });
    tone(220, 0.08, { to: 110, v: 0.16 });
  },
  happy() {
    seq([76, 79, 83, 88], 0.06, 0.08, { type: 'triangle', v: 0.32 });
  },
  sleep() {
    seq([72, 67, 64, 60], 0.18, 0.25, { type: 'triangle', v: 0.25 });
  },
  wake() {
    seq([67, 74, 79], 0.07, 0.08, { v: 0.16 });
  },
  whoosh() {
    noise(0.22, { v: 0.3, f: 400, to: 3200, q: 1.5 });
  },
  hit() {
    tone(180, 0.18, { to: 50, v: 0.3 });
    noise(0.12, { v: 0.45, type: 'lowpass', f: 1400 });
  },
  crit() {
    sfx.hit();
    tone(1400, 0.12, { to: 500, v: 0.18, at: 0.02 });
    noise(0.25, { v: 0.35, type: 'highpass', f: 2000, at: 0.03 });
  },
  miss() {
    tone(500, 0.15, { type: 'triangle', to: 1100, v: 0.25 });
  },
  win() {
    seq([72, 76, 79, 84], 0.1, 0.1, { v: 0.18 });
    seq([60, 64, 67, 72], 0.1, 0.1, { type: 'triangle', v: 0.25 });
    tone(midi(88), 0.4, { v: 0.16, at: 0.42 });
    tone(midi(76), 0.4, { type: 'triangle', v: 0.25, at: 0.42 });
  },
  lose() {
    seq([67, 64, 60, 55], 0.2, 0.22, { v: 0.16 });
    tone(midi(48), 0.5, { type: 'triangle', v: 0.3, at: 0.8 });
  },
  levelUp() {
    seq([72, 76, 79, 84, 79, 84, 88, 91], 0.05, 0.07, { v: 0.16 });
  },
  train() {
    for (let i = 0; i < 5; i++) tone(900 + i * 80, 0.03, { v: 0.12, at: i * 0.18 });
    noise(0.1, { v: 0.3, type: 'lowpass', f: 900, at: 0.9 });
  },
  gain() {
    seq([84, 91], 0.08, 0.1, { type: 'triangle', v: 0.3 });
  },
  evolve() {
    tone(200, 1.3, { to: 1600, v: 0.12 });
    tone(150, 1.3, { type: 'triangle', to: 1200, v: 0.18 });
    [72, 76, 79, 84].forEach((n) => tone(midi(n), 0.7, { type: 'triangle', v: 0.18, at: 1.3 }));
  },
  error() {
    tone(140, 0.12, { v: 0.18 });
    tone(110, 0.15, { v: 0.18, at: 0.1 });
  },
};
