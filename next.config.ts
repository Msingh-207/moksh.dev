import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Make sure the Markdown content ships with any server function that re-reads it.
  outputFileTracingIncludes: {
    "/": ["./content/**/*"],
  },
  // Serve /public/resume.pdf if it exists; otherwise fall back to the printable /resume page.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/resume.pdf", destination: "/resume" }],
    };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
