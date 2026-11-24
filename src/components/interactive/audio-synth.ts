/**
 * Procedural 4-bar loop (Am – F – C – G, 120 BPM) rendered into Float32Arrays.
 * Used by the WaveformPlayer so the demo works with zero audio files.
 */

export const SAMPLE_RATE = 22050;
export const BPM = 120;
export const BARS = 4;
export const LOOP_SECONDS = (60 / BPM) * 4 * BARS; // 8s

export type StemId = "drums" | "bass" | "keys";

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// A minor → F → C → G
const CHORDS = [
  [57, 60, 64, 69],
  [53, 57, 60, 65],
  [48, 55, 60, 64],
  [55, 59, 62, 67],
];
const ROOTS = [45, 41, 36, 43];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) * 2 - 1;
  };
}

export function renderStems(): Record<StemId, Float32Array> {
  const len = Math.floor(LOOP_SECONDS * SAMPLE_RATE);
  const beat = 60 / BPM;
  const drums = new Float32Array(len);
  const bass = new Float32Array(len);
  const keys = new Float32Array(len);
  const noise = rng(42);

  const add = (buf: Float32Array, start: number, dur: number, fn: (t: number) => number) => {
    const i0 = Math.floor(start * SAMPLE_RATE);
    const n = Math.floor(dur * SAMPLE_RATE);
    for (let i = 0; i < n && i0 + i < len; i++) buf[i0 + i] += fn(i / SAMPLE_RATE);
  };

  for (let b = 0; b < BARS * 4; b++) {
    const t = b * beat;
    // Kick on every beat
    add(drums, t, 0.35, (x) => {
      const f = 45 + 90 * Math.exp(-x * 28);
      return Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 9) * 0.9;
    });
    // Snare on 2 and 4
    if (b % 2 === 1)
      add(drums, t, 0.22, (x) => (noise() * 0.5 + Math.sin(2 * Math.PI * 190 * x) * 0.3) * Math.exp(-x * 18));
    // Hats on off-beats
    let prev = 0;
    add(drums, t + beat / 2, 0.06, (x) => {
      const n = noise();
      const hp = n - prev;
      prev = n;
      return hp * 0.18 * Math.exp(-x * 60);
    });
  }

  for (let bar = 0; bar < BARS; bar++) {
    const barStart = bar * beat * 4;
    // Bass: root on 8ths with a little octave bounce
    for (let k = 0; k < 8; k++) {
      const note = ROOTS[bar] + (k % 4 === 3 ? 12 : 0);
      const f = midi(note);
      add(bass, barStart + (k * beat) / 2, beat / 2, (x) => {
        const ph = (f * x) % 1;
        const saw = 2 * ph - 1;
        const sine = Math.sin(2 * Math.PI * f * x);
        return (0.35 * saw + 0.65 * sine) * Math.min(1, x * 200) * Math.exp(-x * 5) * 0.45;
      });
    }
    // Keys: soft pad chord for the whole bar
    const chord = CHORDS[bar];
    add(keys, barStart, beat * 4, (x) => {
      let v = 0;
      for (const n of chord) {
        const f = midi(n);
        v += Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(2 * Math.PI * f * 2 * x + 0.3);
      }
      const env = Math.min(1, x * 6) * (0.6 + 0.4 * Math.exp(-x * 1.2)) * Math.min(1, (beat * 4 - x) * 8);
      return (v / chord.length) * env * 0.22;
    });
  }

  return { drums, bass, keys };
}

/** Peak envelope for drawing (N bars). */
export function peaks(data: Float32Array, buckets: number): number[] {
  const size = Math.floor(data.length / buckets);
  const out: number[] = [];
  for (let i = 0; i < buckets; i++) {
    let max = 0;
    for (let j = i * size; j < (i + 1) * size; j++) {
      const v = Math.abs(data[j]);
      if (v > max) max = v;
    }
    out.push(max);
  }
  const top = Math.max(...out, 1e-6);
  return out.map((v) => v / top);
}
