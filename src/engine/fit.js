/**
 * Pure schedule-fit engine.
 * fit(blocks, windowMinutes) → { ok: true, blocks: Block[] }
 *                            | { ok: false, shortBy: number, minTotal: number }
 *
 * Rules (per spec §4):
 *  1. Floors are inviolable.
 *  2. If window < minTotal → refuse (ok: false).
 *  3. Start every block at its target.
 *  4. Sum ≤ window → prize block absorbs ALL slack.
 *  5. Sum > window → shrink prize first, then fixed blocks by giveBackPriority.
 */
export function fit(blocks, windowMinutes) {
  const minTotal = blocks.reduce((s, b) => s + b.floor, 0);
  if (windowMinutes < minTotal) {
    return { ok: false, shortBy: Math.ceil(minTotal - windowMinutes), minTotal };
  }

  const out = blocks.map((b) => ({ ...b, minutes: b.target }));
  let sum = out.reduce((s, b) => s + b.minutes, 0);

  if (sum <= windowMinutes) {
    const prize = out.find((b) => b.reward);
    if (prize) prize.minutes += windowMinutes - sum;
    return { ok: true, blocks: out };
  }

  let deficit = sum - windowMinutes;
  const prize = out.find((b) => b.reward);
  if (prize) {
    const give = Math.min(prize.minutes - prize.floor, deficit);
    prize.minutes -= give;
    deficit -= give;
  }

  if (deficit > 0) {
    const fixed = out
      .filter((b) => !b.reward)
      .sort((a, b) => a.giveBackPriority - b.giveBackPriority);
    for (const b of fixed) {
      if (deficit <= 0) break;
      const give = Math.min(b.minutes - b.floor, deficit);
      b.minutes -= give;
      deficit -= give;
    }
  }

  return { ok: true, blocks: out };
}

/** Attach startS / endS / dur (seconds) to each fitted block. */
export function withTimestamps(fittedBlocks) {
  let acc = 0;
  return fittedBlocks.map((b) => {
    const startS = acc * 60;
    acc += b.minutes;
    return { ...b, startS, endS: acc * 60, dur: b.minutes * 60 };
  });
}
