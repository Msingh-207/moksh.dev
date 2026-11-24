"use client";

import { Cpu, Search, Wifi } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/components/ui/Card";

/** Interactive mock of the EndeavourOS + Hyprland desktop. Click the workspaces. */

const subscribeClock = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const clockSnapshot = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date());

function Win({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-lg border border-accent/40 bg-[#0c0c12]/90 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]", className)}>
      <div className="border-b border-white/5 px-2 py-1 font-mono text-[9px] text-dim">{title}</div>
      <div className="min-h-0 flex-1 overflow-hidden p-2 font-mono text-[9.5px] leading-[1.45]">{children}</div>
    </div>
  );
}

function Fastfetch() {
  const rows: [string, string][] = [
    ["OS", "EndeavourOS x86_64"],
    ["Kernel", "linux 6.x-arch"],
    ["WM", "Hyprland (Wayland)"],
    ["Bar", "Waybar"],
    ["Term", "kitty"],
    ["CPU", "i7-14650HX (24)"],
    ["GPU", "RTX 5060 Laptop 8GB"],
    ["Memory", "7.4 / 24 GiB"],
  ];
  return (
    <div className="flex gap-3">
      <pre className="hidden leading-[1.15] text-violet sm:block" aria-hidden>
{`     /\\
    /  \\
   / /\\ \\
  / /  \\ \\
 / / /\\ \\ \\
/_/ /__\\ \\_\\`}
      </pre>
      <div className="min-w-0">
        <div>
          <span className="text-accent">moksh</span>
          <span className="text-dim">@</span>
          <span className="text-accent">omen</span>
        </div>
        <div className="text-dim">-----------</div>
        {rows.map(([k, v]) => (
          <div key={k} className="truncate">
            <span className="text-violet">{k}</span>
            <span className="text-dim">: </span>
            <span className="text-slate-300">{v}</span>
          </div>
        ))}
        <div className="mt-1 flex gap-0.5">
          {["#151A2E", "#fb7185", "#34d399", "#fbbf24", "#60a5fa", "#a78bfa", "#22d3ee", "#E2E8F0"].map((c) => (
            <span key={c} className="h-2 w-3" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LuaSnippet() {
  return (
    <pre className="text-slate-300">
      <span className="text-dim">-- ~/.config/hypr/scripts/ws.lua</span>
      {"\n"}
      <span className="text-violet">local</span> monitors = {"{ "}
      <span className="text-emerald">&quot;eDP-1&quot;</span>
      {", "}
      <span className="text-emerald">&quot;HDMI-A-1&quot;</span>
      {" }"}
      {"\n"}
      <span className="text-violet">for</span> i, m <span className="text-violet">in</span> ipairs(monitors) <span className="text-violet">do</span>
      {"\n  "}
      os.execute(<span className="text-emerald">&quot;hyprctl keyword workspace &quot;</span>
      {"\n    "}.. i .. <span className="text-emerald">&quot;,monitor:&quot;</span> .. m)
      {"\n"}
      <span className="text-violet">end</span>
    </pre>
  );
}

function GpuPanel() {
  const bars = [
    ["GPU", 62, "#22d3ee"],
    ["VRAM", 64, "#a78bfa"],
    ["CPU", 28, "#34d399"],
    ["TEMP", 71, "#fb7185"],
  ] as const;
  return (
    <div className="space-y-1.5">
      <div className="text-dim">$ llama-server -m qwen-7b-q4_k_m.gguf -ngl 99</div>
      {bars.map(([k, v, c]) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-8 text-dim">{k}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded bg-white/5">
            <div className="h-full rounded" style={{ width: `${v}%`, background: c }} />
          </div>
          <span className="w-7 text-right text-slate-300">{v}%</span>
        </div>
      ))}
      <div className="text-emerald">→ 48.2 tok/s</div>
    </div>
  );
}

function Rofi() {
  const apps = ["kitty", "firefox", "code", "obsidian", "blender", "davinci-resolve"];
  return (
    <div className="absolute left-1/2 top-1/2 w-[min(78%,300px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-violet/50 bg-[#0e0b16]/95 p-2 shadow-2xl backdrop-blur">
      <div className="mb-1.5 flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5 font-mono text-[10px] text-muted">
        <Search className="size-3 text-violet" />
        drun<span className="text-dim">:</span> <span className="text-fg">bl</span>
        <span className="h-3 w-px animate-blink bg-violet" />
      </div>
      {apps.map((a, i) => (
        <div key={a} className={cn("rounded-md px-2 py-1 font-mono text-[10px]", i === 4 ? "bg-violet/20 text-fg" : "text-muted")}>
          {a}
        </div>
      ))}
    </div>
  );
}

function Grub() {
  const items = ["EndeavourOS", "Advanced options for EndeavourOS", "Windows Boot Manager", "UEFI Firmware Settings"];
  return (
    <div className="flex h-full flex-col justify-center bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1305_100%)] p-4 font-mono">
      <div className="mb-3 text-xs font-bold tracking-[0.3em] text-[#fcee0a]">{"// BOOT_SEQUENCE"}</div>
      {items.map((it, i) => (
        <div
          key={it}
          className={cn(
            "mb-1 border-l-2 px-2 py-1 text-[10.5px]",
            i === 0 ? "border-[#fcee0a] bg-[#fcee0a] text-black" : "border-[#00f0ff]/40 text-[#00f0ff]/80",
          )}
        >
          {i === 0 ? "▶ " : "  "}
          {it}
        </div>
      ))}
      <div className="mt-3 text-[9px] text-[#fcee0a]/60">AUTOBOOT IN 5s · CYBERPUNK 2077 GRUB THEME</div>
    </div>
  );
}

export function HyprlandPreview({ compact = false }: { compact?: boolean }) {
  const [ws, setWs] = useState(1);
  const time = useSyncExternalStore(subscribeClock, clockSnapshot, () => "--:--");

  return (
    <div className={cn("relative flex flex-col overflow-hidden", compact ? "h-full" : "m-4 h-[340px] rounded-lg border border-line")}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(167,139,250,0.35),transparent_50%),radial-gradient(ellipse_at_90%_90%,rgba(34,211,238,0.28),transparent_50%),linear-gradient(160deg,#0b0816,#05060b)]" />

      {/* Waybar */}
      <div className="relative z-10 m-1.5 flex items-center gap-2 rounded-lg border border-white/5 bg-black/50 px-2 py-1 font-mono text-[9.5px] backdrop-blur">
        <div className="flex gap-1" role="tablist" aria-label="Workspaces">
          {[1, 2, 3].map((n) => (
            <button
              type="button"
              role="tab"
              aria-selected={ws === n}
              key={n}
              onClick={() => setWs(n)}
              className={cn("rounded px-1.5 transition", ws === n ? "bg-accent text-bg" : "text-muted hover:text-fg")}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="hidden text-dim sm:inline">
          {ws === 1 ? "kitty — ~/dotfiles" : ws === 2 ? "rofi — drun" : "grub-theme preview"}
        </span>
        <span className="ml-auto flex items-center gap-2 text-muted">
          <span className="flex items-center gap-1">
            <Cpu className="size-3 text-emerald" />
            62°C
          </span>
          <Wifi className="size-3 text-accent" />
          <span className="text-fg">{time}</span>
        </span>
      </div>

      <div className="relative z-10 min-h-0 flex-1 p-1.5 pt-0">
        {ws === 1 && (
          <div className="grid h-full grid-cols-1 gap-1.5 sm:grid-cols-[1.25fr_1fr] sm:grid-rows-2">
            <Win title="kitty · fastfetch" className="sm:row-span-2">
              <div className="mb-1 text-dim">❯ fastfetch</div>
              <Fastfetch />
            </Win>
            <Win title="nvim · ws.lua" className="hidden sm:flex">
              <LuaSnippet />
            </Win>
            <Win title="kitty · local LLM" className="hidden sm:flex">
              <GpuPanel />
            </Win>
          </div>
        )}
        {ws === 2 && (
          <div className="relative h-full">
            <div className="grid h-full grid-cols-2 gap-1.5 opacity-40 blur-[1px]">
              <Win title="kitty">
                <Fastfetch />
              </Win>
              <Win title="kitty · local LLM">
                <GpuPanel />
              </Win>
            </div>
            <Rofi />
          </div>
        )}
        {ws === 3 && (
          <div className="h-full overflow-hidden rounded-lg border border-[#fcee0a]/30">
            <Grub />
          </div>
        )}
      </div>
    </div>
  );
}
