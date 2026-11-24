"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);

/** "⌘" on Apple platforms, "Ctrl" elsewhere (defaults to ⌘ during SSR). */
export function useModKey() {
  return useSyncExternalStore(noop, () => (isMac() ? "⌘" : "Ctrl "), () => "⌘");
}
