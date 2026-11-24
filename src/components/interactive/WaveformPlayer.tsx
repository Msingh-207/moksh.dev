"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/components/ui/Card";
import { LOOP_SECONDS, SAMPLE_RATE, peaks, renderStems, type StemId } from "./audio-synth";

/**
 * HTML5 Web Audio stem player with a canvas waveform.
 *
 * Out of the box it synthesises a short loop in the browser (no files needed).
 * To use real FL Studio exports, put them in /public/media/audio/ and fill in
 * STEM_FILES below, e.g. { drums: "/media/audio/drums.mp3", ... }. Any stem
 * without a file falls back to the synthesised version.
 */
const STEM_FILES: Partial<Record<StemId, string>> = {};

const STEMS: { id: StemId; label: string; color: string }[] = [
  { id: "drums", label: "Drums", color: "#fb7185" },
  { id: "bass", label: "Bass", color: "#22d3ee" },
  { id: "keys", label: "Keys", color: "#a78bfa" },
];

const BUCKETS = 140;

interface Engine {
  ctx: AudioContext;
  buffers: Record<StemId, AudioBuffer>;
  gains: Record<StemId, GainNode>;
  analyser: AnalyserNode;
  sources: AudioBufferSourceNode[];
  startedAt: number;
  offset: number;
  duration: number;
}

export function WaveformPlayer() {
  const stems = useMemo(() => renderStems(), []);
  const mixPeaks = useMemo(() => {
    const mix = new Float32Array(stems.drums.length);
    for (let i = 0; i < mix.length; i++) mix[i] = stems.drums[i] + stems.bass[i] + stems.keys[i];
    return peaks(mix, BUCKETS);
  }, [stems]);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState<Record<StemId, boolean>>({ drums: false, bass: false, keys: false });
  const [loading, setLoading] = useState(false);
  const engine = useRef<Engine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meterRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr;
      cv.height = h * dpr;
    }
    const g = cv.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const bw = w / BUCKETS;
    const p = progressRef.current;
    mixPeaks.forEach((v, i) => {
      const bh = Math.max(2, v * (h - 6));
      g.fillStyle = i / BUCKETS <= p ? "#a78bfa" : "#334155";
      g.fillRect(i * bw + 0.5, (h - bh) / 2, Math.max(1, bw - 1.5), bh);
    });
    g.fillStyle = "#fafafa";
    g.fillRect(p * w, 0, 1.5, h);

    // Spectrum meter
    const mc = meterRef.current;
    const eng = engine.current;
    if (mc) {
      const mw = mc.clientWidth, mh = mc.clientHeight;
      if (mc.width !== mw * dpr) {
        mc.width = mw * dpr;
        mc.height = mh * dpr;
      }
      const m = mc.getContext("2d");
      if (m) {
        m.setTransform(dpr, 0, 0, dpr, 0, 0);
        m.clearRect(0, 0, mw, mh);
        const bins = 24;
        const data = new Uint8Array(eng ? eng.analyser.frequencyBinCount : bins);
        if (eng) eng.analyser.getByteFrequencyData(data);
        for (let i = 0; i < bins; i++) {
          const v = eng ? data[Math.floor((i / bins) * data.length * 0.6)] / 255 : 0.04;
          m.fillStyle = i < bins * 0.33 ? "#fb7185" : i < bins * 0.66 ? "#22d3ee" : "#a78bfa";
          const bh = Math.max(1, v * mh);
          m.fillRect(i * (mw / bins), mh - bh, mw / bins - 2, bh);
        }
      }
    }
  }, [mixPeaks]);

  // Initial draw + redraw on resize
  useEffect(() => {
    draw();
    const cv = canvasRef.current;
    if (!cv) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(cv);
    return () => ro.disconnect();
  }, [draw]);

  // Animation loop while playing
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const loop = () => {
      const e = engine.current;
      if (e) {
        const t = (e.offset + e.ctx.currentTime - e.startedAt) % e.duration;
        progressRef.current = t / e.duration;
        if (timeRef.current) timeRef.current.textContent = `${t.toFixed(1)}s`;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, draw]);

  // Stop audio on unmount
  useEffect(
    () => () => {
      const e = engine.current;
      if (e) {
        e.sources.forEach((s) => {
          try {
            s.stop();
          } catch {}
        });
        void e.ctx.close();
      }
    },
    [],
  );

  const ensureEngine = async (): Promise<Engine> => {
    if (engine.current) return engine.current;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.connect(ctx.destination);
    const buffers = {} as Record<StemId, AudioBuffer>;
    const gains = {} as Record<StemId, GainNode>;
    for (const s of STEMS) {
      let buf: AudioBuffer | null = null;
      const file = STEM_FILES[s.id];
      if (file) {
        try {
          const res = await fetch(file);
          buf = await ctx.decodeAudioData(await res.arrayBuffer());
        } catch {
          buf = null;
        }
      }
      if (!buf) {
        buf = ctx.createBuffer(1, stems[s.id].length, SAMPLE_RATE);
        buf.copyToChannel(stems[s.id] as Float32Array<ArrayBuffer>, 0);
      }
      buffers[s.id] = buf;
      const gain = ctx.createGain();
      gain.gain.value = muted[s.id] ? 0 : 1;
      gain.connect(analyser);
      gains[s.id] = gain;
    }
    const duration = Math.max(...STEMS.map((s) => buffers[s.id].duration)) || LOOP_SECONDS;
    engine.current = { ctx, buffers, gains, analyser, sources: [], startedAt: 0, offset: 0, duration };
    return engine.current;
  };

  const startAt = (e: Engine, offset: number) => {
    e.sources.forEach((s) => {
      try {
        s.stop();
      } catch {}
    });
    e.sources = STEMS.map((s) => {
      const src = e.ctx.createBufferSource();
      src.buffer = e.buffers[s.id];
      src.loop = true;
      src.connect(e.gains[s.id]);
      src.start(0, offset % e.buffers[s.id].duration);
      return src;
    });
    e.startedAt = e.ctx.currentTime;
    e.offset = offset;
  };

  const toggle = async () => {
    if (playing) {
      const e = engine.current;
      if (e) {
        e.offset = (e.offset + e.ctx.currentTime - e.startedAt) % e.duration;
        e.sources.forEach((s) => {
          try {
            s.stop();
          } catch {}
        });
        e.sources = [];
      }
      setPlaying(false);
      return;
    }
    setLoading(true);
    const e = await ensureEngine();
    await e.ctx.resume();
    startAt(e, e.offset);
    setLoading(false);
    setPlaying(true);
  };

  const seek = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(0.999, (clientX - r.left) / r.width));
    progressRef.current = p;
    const e = engine.current;
    if (e) {
      if (playing) startAt(e, p * e.duration);
      else e.offset = p * e.duration;
    }
    if (timeRef.current) timeRef.current.textContent = `${(p * LOOP_SECONDS).toFixed(1)}s`;
    draw();
  };

  const toggleStem = (id: StemId) => {
    setMuted((m) => {
      const next = { ...m, [id]: !m[id] };
      const g = engine.current?.gains[id];
      if (g && engine.current) g.gain.setTargetAtTime(next[id] ? 0 : 1, engine.current.ctx.currentTime, 0.015);
      return next;
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-line bg-[#0D1020] p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet text-bg transition hover:brightness-110 disabled:opacity-50"
          disabled={loading}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-fg">Night Drive — loop sketch</div>
          <div className="font-mono text-[10.5px] text-dim">
            Am · F · C · G — 120 BPM — <span ref={timeRef}>0.0s</span> / {LOOP_SECONDS.toFixed(1)}s
          </div>
        </div>
        <canvas ref={meterRef} className="hidden h-8 w-24 sm:block" aria-hidden />
      </div>

      <canvas
        ref={canvasRef}
        className="h-16 w-full cursor-pointer"
        onPointerDown={(e) => seek(e.clientX, e.currentTarget)}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={-1}
      />

      <div className="flex flex-wrap gap-1.5">
        {STEMS.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => toggleStem(s.id)}
            aria-pressed={!muted[s.id]}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition",
              muted[s.id] ? "border-line text-dim" : "border-line-strong text-fg",
            )}
          >
            {muted[s.id] ? <VolumeX className="size-3" /> : <Volume2 className="size-3" style={{ color: s.color }} />}
            {s.label}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[10px] text-dim">click waveform to seek</span>
      </div>
    </div>
  );
}
