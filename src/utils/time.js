export const pad = (n) => String(n).padStart(2, "0");

export const toMin = (s) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

export const fmtClock = (totalMins) => {
  const h24 = Math.floor((totalMins % 1440) / 60);
  const m = Math.floor(totalMins) % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(m)} ${ampm}`;
};

/** Green / yellow / red based on master schedule wall-clock (§5.3). */
export function paceColor(block, elapsedS) {
  if (!block) return "green";
  const frac = (elapsedS - block.startS) / block.dur;
  if (frac < 0.5) return "green";
  if (frac < 0.8) return "yellow";
  return "red";
}
