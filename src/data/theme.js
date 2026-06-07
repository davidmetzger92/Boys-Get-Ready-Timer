/**
 * KID-OWNED aesthetics — all swappable via this object.
 * Colors, glyphs, labels, sounds, and prize are placeholders
 * until the boys weigh in.
 */
export const KIDS = [
  {
    id: "jonah",
    name: "Jonah",
    glyph: "🚙",
    trackName: "Monster Truck Hill",
    accent: "#ff8c42",
    accent2: "#ffd166",
    trail: "#3a2414",
    summit: "🏔️",
    soundPreset: "coins",
  },
  {
    id: "benji",
    name: "Benji",
    glyph: "⚡",
    trackName: "Poké Trail",
    accent: "#ffcb05",
    accent2: "#3b6cff",
    trail: "#13233f",
    summit: "🏆",
    soundPreset: "chimes",
  },
];

export const PRIZE = {
  label: "Prize time!",
  icon: "🎁",
};

export const ICONS = {
  drink: "🥤",
  shirt: "👕",
  tooth: "🪥",
  prize: "🎁",
  shoe:  "👟",
};

export const PAGE = {
  bg:     "#0e1116",
  panel:  "#171c24",
  ink:    "#eef2f7",
  sub:    "#8794a5",
  track:  "#222a35",
  green:  "#7bd88f",
  yellow: "#ffd166",
  red:    "#ff7a6b",
  finish: "#ffd166",
};

/** Cooperative scoring is the default (§7.2). Flip to false for per-kid points. */
export const COOPERATIVE = true;
