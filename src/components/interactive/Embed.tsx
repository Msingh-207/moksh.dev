"use client";

import type { EmbedId } from "@/lib/types";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { AudashPreview } from "./AudashPreview";
import { AudioLab } from "./AudioLab";
import { ColorGradeSlider } from "./ColorGradeSlider";
import { FusionPreview } from "./FusionPreview";
import { HyprlandPreview } from "./HyprlandPreview";
import { MacroChart } from "./MacroChart";
import { NleTimeline } from "./NleTimeline";
import { PipelineDiagram } from "./PipelineDiagram";
import { RootFinder } from "./RootFinder";

const TITLES: Record<EmbedId, string> = {
  audash: "audash.vercel.app — week view",
  pipeline: "ci/cd → container → api → db",
  "macro-chart": "fredash — indicator explorer",
  "root-finder": "numerical-methods — root finder",
  "color-grade": "resolve — color page · before / after",
  fusion: "resolve — fusion page",
  "nle-timeline": "resolve — edit page",
  "audio-lab": "blender turntable + fl studio stems",
  hyprland: "hyprland — interactive desktop",
};

export function Embed({ id }: { id: EmbedId }) {
  const body = (() => {
    switch (id) {
      case "audash":
        return <AudashPreview />;
      case "pipeline":
        return <PipelineDiagram />;
      case "macro-chart":
        return <MacroChart />;
      case "root-finder":
        return <RootFinder />;
      case "color-grade":
        return <ColorGradeSlider />;
      case "fusion":
        return <FusionPreview />;
      case "nle-timeline":
        return <NleTimeline />;
      case "audio-lab":
        return <AudioLab />;
      case "hyprland":
        return <HyprlandPreview />;
    }
  })();
  return <BrowserFrame title={TITLES[id]}>{body}</BrowserFrame>;
}
