import { Archive } from "@/components/archive/Archive";
import { CaseStudyDrawer } from "@/components/archive/CaseStudyDrawer";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/nav/Navbar";
import { AppProvider } from "@/components/providers/AppProvider";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";
import { Lab } from "@/components/sections/Lab";
import { Skills } from "@/components/sections/Skills";
import { HireMeModal } from "@/components/ui/HireMeModal";
import { getMediaUrl } from "@/lib/media";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const [projects, portrait] = await Promise.all([getProjects(), getMediaUrl("portrait.png")]);

  return (
    <AppProvider projects={projects}>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_60%)]" />
      <Navbar />
      <main>
        <Hero portrait={portrait} />
        <About />
        <Skills />
        <Archive />
        <Lab />
      </main>
      <Footer />
      <CaseStudyDrawer />
      <CommandPalette />
      <HireMeModal />
    </AppProvider>
  );
}
