"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Minimal URL query-string store. Avoids `useSearchParams` (which would force a
 * Suspense boundary under Cache Components) while keeping filters shareable.
 */
const EVENT = "urlstatechange";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useQueryParam(key: string): [string | null, (value: string | null) => void] {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = new URLSearchParams(search).get(key);

  const setValue = useCallback(
    (next: string | null) => {
      const url = new URL(window.location.href);
      if (next === null || next === "") url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(window.history.state, "", url.toString());
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, setValue];
}
