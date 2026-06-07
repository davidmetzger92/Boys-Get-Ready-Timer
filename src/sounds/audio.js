/**
 * Web Audio API sound engine — no external files required.
 * All tones are synthesized so nothing needs to be downloaded.
 * Kids can tune presets; parents never touch this.
 */

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Low-level: play a sine-wave tone with an ADSR-ish envelope. */
function playTone({ freq = 440, duration = 0.25, gain = 0.35, type = "sine", delay = 0 }) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.connect(env);
  env.connect(ac.destination);
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + delay;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.015);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Two ascending notes — satisfying task-completion chime. */
export function playTaskComplete(preset = "chimes") {
  const presets = {
    chimes: [
      { freq: 523.25, duration: 0.3, gain: 0.3 },           // C5
      { freq: 659.25, duration: 0.35, gain: 0.28, delay: 0.18 }, // E5
    ],
    coins: [
      { freq: 988,  duration: 0.18, gain: 0.35, type: "square" },
      { freq: 1319, duration: 0.22, gain: 0.3,  type: "square", delay: 0.12 },
    ],
    sparkle: [
      { freq: 880,  duration: 0.2, gain: 0.25 },
      { freq: 1047, duration: 0.2, gain: 0.22, delay: 0.12 },
      { freq: 1319, duration: 0.25, gain: 0.2,  delay: 0.24 },
    ],
  };
  (presets[preset] || presets.chimes).forEach((t) => playTone(t));
}

/** Gentle descending bell — calm leave/car-time signal. */
export function playLeaveChime() {
  [
    { freq: 659.25, duration: 0.5, gain: 0.3 },
    { freq: 523.25, duration: 0.6, gain: 0.25, delay: 0.3 },
    { freq: 392,    duration: 0.7, gain: 0.2,  delay: 0.6 },
  ].forEach((t) => playTone(t));
}

/** Triumphant rising fanfare — the celebration moment (§7.3). */
export function playCelebration() {
  const melody = [
    { freq: 523.25, duration: 0.15, gain: 0.4 },
    { freq: 523.25, duration: 0.15, gain: 0.4,  delay: 0.15 },
    { freq: 523.25, duration: 0.15, gain: 0.4,  delay: 0.3  },
    { freq: 415.3,  duration: 0.12, gain: 0.35, delay: 0.45 },
    { freq: 523.25, duration: 0.5,  gain: 0.45, delay: 0.57 },
    { freq: 659.25, duration: 0.5,  gain: 0.5,  delay: 0.85 },
  ];
  melody.forEach((t) => playTone(t));
}

/** Soft two-tone for prize block arrival. */
export function playPrizeHandoff() {
  [
    { freq: 783.99, duration: 0.3, gain: 0.3 },
    { freq: 987.77, duration: 0.4, gain: 0.28, delay: 0.2 },
  ].forEach((t) => playTone(t));
}
