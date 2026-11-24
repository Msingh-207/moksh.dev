import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Developer · Economist · Editor`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.github }],
  keywords: [
    "Moksh Singh",
    "Full-Stack Developer",
    "Economics",
    "Ambedkar University Delhi",
    "Levithan Technologies",
    "DaVinci Resolve",
    "Portfolio",
  ],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
  twitter: { card: "summary", title: SITE.name, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: "#0B0D17",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-dvh bg-bg font-sans text-fg">{children}</body>
    </html>
  );
}
