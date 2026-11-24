import { Turntable } from "./Turntable";
import { WaveformPlayer } from "./WaveformPlayer";

export function AudioLab() {
  return (
    <div className="grid gap-3 p-4">
      <Turntable />
      <WaveformPlayer />
    </div>
  );
}
