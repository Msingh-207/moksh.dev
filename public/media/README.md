# /public/media — drop your own assets here

Everything on the site renders without these files (procedural SVG / canvas / Web Audio
placeholders), so nothing is broken if this folder is empty. Add files when you have them:

| File | Where it shows up | How to wire it |
| --- | --- | --- |
| `resume.pdf` | Command palette "Open résumé", footer | In `src/lib/site.ts`, set `resume: "/media/resume.pdf"` (defaults to the printable `/resume` page). |
| `naqsh-reel.mp4` | NAQSH case study drawer | Add `video: /media/naqsh-reel.mp4` to `content/projects/naqsh-studios.md` front-matter. |
| `turntable.mp4` | Blender & Audio Lab drawer | Add `video: /media/turntable.mp4` to `content/projects/blender-audio-lab.md`. |
| `audash.png` (any project) | Case study drawer, above the embeds | Add `cover: /media/audash.png` to that project's front-matter. |
| `grade-raw.jpg` + `grade-final.jpg` | Before/After colour slider | In `src/components/interactive/Embed.tsx`, render `<ColorGradeSlider rawSrc="/media/grade-raw.jpg" gradedSrc="/media/grade-final.jpg" />`. |
| `audio/drums.mp3`, `audio/bass.mp3`, `audio/keys.mp3` | Waveform stem player | Fill `STEM_FILES` at the top of `src/components/interactive/WaveformPlayer.tsx`. |
| `showreel.mp4` | Hero "preview" card | See the comment at the top of `src/components/bento/ShowreelCard.tsx`. |

Tip: keep videos short, H.264 `.mp4`, ≤ 1080p and ideally < 10 MB for fast loads on Vercel.
