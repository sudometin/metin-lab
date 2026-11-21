// Tiny Web Audio helpers: spikes sound like clicks, the way they do on a lab amplifier.
let ctx: AudioContext | null = null;
const KEY = 'metinlab.sound';

export function audio(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function soundOn(): boolean {
  try { return localStorage.getItem(KEY) === 'on'; } catch { return false; }
}
export function setSound(on: boolean) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {}
  window.dispatchEvent(new CustomEvent('metinlab:sound', { detail: on }));
}

/** A short spike-like click: a few ms of filtered noise with a sharp envelope. */
export function click(at = 0, gain = 0.35, tone = 2200) {
  const a = audio();
  const t = at || a.currentTime;
  const len = Math.floor(a.sampleRate * 0.004);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len / 5));
  const src = a.createBufferSource();
  src.buffer = buf;
  const bp = a.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = tone;
  bp.Q.value = 1.2;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t);
}

/** A low thud for wrong answers. */
export function thud(gain = 0.25) {
  const a = audio();
  const o = a.createOscillator();
  const g = a.createGain();
  o.frequency.setValueAtTime(140, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(60, a.currentTime + 0.15);
  g.gain.setValueAtTime(gain, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.18);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.2);
}
