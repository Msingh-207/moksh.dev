import fs from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

/**
 * Returns the public URL of an optional asset in /public/media if it exists, otherwise null.
 * Lets components fall back to a generated placeholder instead of rendering a broken image.
 */
export async function getMediaUrl(file: string): Promise<string | null> {
  "use cache";
  cacheLife("max");
  try {
    await fs.access(path.join(process.cwd(), "public", "media", file));
    return `/media/${file}`;
  } catch {
    return null;
  }
}
