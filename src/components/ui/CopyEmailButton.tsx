"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { cn } from "./Card";

export function CopyEmailButton({ className, label = "Copy Email" }: { className?: string; label?: string }) {
  const { copyEmail } = useApp();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      onClick={async () => {
        await copyEmail();
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1600);
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-line bg-card-2 px-4 py-2.5 text-sm font-medium text-fg transition hover:border-line-strong hover:bg-[#1A1F36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {copied ? <Check className="size-4 text-emerald" aria-hidden /> : <Copy className="size-4 text-muted" aria-hidden />}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}
