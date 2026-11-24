import { DisciplineStrip } from "@/components/bento/DisciplineStrip";
import { ShowreelCard } from "@/components/bento/ShowreelCard";
import { Band, SectionHeading } from "@/components/ui/Card";

export function Lab() {
  return (
    <Band id="lab" labelledBy="lab-title">
      <SectionHeading
        index="04"
        eyebrow="Lab"
        title={
          <span id="lab-title">
            Live <span className="text-brand">previews</span>
          </span>
        }
        kicker="Interactive React previews, no video files. Toggle a tab, click around, or jump to a discipline in the archive."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ShowreelCard />
        <DisciplineStrip />
      </div>
    </Band>
  );
}
