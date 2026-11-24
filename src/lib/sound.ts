"use client";

let ctx: AudioContext | null = null;

/** Tiny UI "blip" synthesised with the Web Audio API — no audio files needed. */
export function playBlip(freq = 880, duration = 0.06) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch {
    /* audio unavailable — ignore */
  }
}
