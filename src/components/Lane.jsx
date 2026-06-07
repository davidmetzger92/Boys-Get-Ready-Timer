import { PAGE, ICONS } from "../data/theme.js";
import { paceColor } from "../utils/time.js";

const PACE_COLORS = {
  green:  PAGE.green,
  yellow: PAGE.yellow,
  red:    PAGE.red,
};

const PACE_LABELS = {
  green:  "On pace",
  yellow: "Hurry up",
  red:    "Go go go!",
};

export default function Lane({ kid, taskIndex, sched, elapsedS, onAdvance, burst }) {
  const scoredBlocks  = sched.filter((b) => b.scored);
  const totalSteps    = scoredBlocks.length;
  const done          = taskIndex >= totalSteps;
  const pctUp         = Math.min(100, (taskIndex / totalSteps) * 100);

  // Current and next task (from the kid's perspective)
  const curTask  = done ? null : scoredBlocks[taskIndex];
  const nextTask = done ? null : scoredBlocks[taskIndex + 1];

  // Pace color is based on master schedule wall-clock, not per-kid progress (§5.3)
  const masterBlock = curTask ? sched.find((b) => b.id === curTask.id) : null;
  const pace = paceColor(masterBlock, elapsedS);
  const paceCol = PACE_COLORS[pace];

  return (
    <div style={{
      flex: 1, background: PAGE.panel, borderRadius: 20, padding: 16,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 22, color: kid.accent }}>
          {kid.name}
        </div>
        <div style={{ fontSize: 12, color: PAGE.sub }}>{kid.trackName}</div>
      </div>

      {/* Vertical track */}
      <div style={{
        position: "relative", flex: "1 1 300px", minHeight: 280,
        background: kid.trail, borderRadius: 14, overflow: "hidden",
        border: `1px solid ${PAGE.track}`,
      }}>
        {/* Summit */}
        <div style={{
          position: "absolute", top: 8, left: 0, right: 0,
          textAlign: "center", fontSize: 30,
          opacity: done ? 1 : 0.5,
          animation: done ? "bounce 1s ease-in-out infinite" : "none",
        }}>
          {kid.summit}
        </div>

        {/* Climbed-trail fill */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: `${pctUp}%`,
          background: `linear-gradient(to top, ${kid.accent}44, ${kid.accent}0a)`,
          transition: "height 0.6s ease",
        }} />

        {/* Step tick marks */}
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 8, right: 8,
            bottom: `${((i + 1) / totalSteps) * 100}%`,
            height: 1, background: "rgba(255,255,255,0.08)",
          }} />
        ))}

        {/* Completed step dots */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepPct = ((i + 0.5) / totalSteps) * 100;
          const reached = i < taskIndex;
          return (
            <div key={i} style={{
              position: "absolute", left: 12,
              bottom: `${stepPct}%`,
              fontSize: reached ? 14 : 10,
              opacity: reached ? 0.9 : 0.25,
              transition: "all 0.3s ease",
              transform: "translateY(50%)",
            }}>
              {reached ? "✓" : "○"}
            </div>
          );
        })}

        {/* Racer */}
        <div style={{
          position: "absolute", left: 0, right: 0, textAlign: "center",
          bottom: `calc(${pctUp}% - 28px)`,
          transition: "bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          fontSize: 52,
          filter: done ? `drop-shadow(0 0 14px ${kid.accent})` : "none",
          animation: done ? "glow 1.8s ease-in-out infinite" : "none",
        }}>
          {kid.glyph}
        </div>

        {/* Tap burst feedback */}
        {burst && (
          <div style={{
            position: "absolute", left: 0, right: 0, textAlign: "center",
            bottom: `calc(${pctUp}% + 10px)`,
            fontSize: 26, pointerEvents: "none",
            animation: "burstPop 0.35s ease-out forwards",
          }}>
            ✨
          </div>
        )}
      </div>

      {/* Task display (§5.2 CORE) */}
      <div style={{
        background: PAGE.track, borderRadius: 12, padding: "10px 12px",
        minHeight: 72,
      }}>
        {done ? (
          <div style={{
            textAlign: "center", fontFamily: "Fredoka", fontSize: 18,
            color: kid.accent, paddingTop: 8,
          }}>
            {kid.name} made it! 🎉
          </div>
        ) : (
          <>
            {/* Pace color badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: paceCol, flexShrink: 0,
                boxShadow: `0 0 6px ${paceCol}`,
              }} />
              <span style={{ fontSize: 11, color: paceCol, fontWeight: 700 }}>
                {PACE_LABELS[pace]}
              </span>
            </div>

            {/* Current task */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: nextTask ? 4 : 0,
            }}>
              <span style={{ fontSize: 22 }}>{ICONS[curTask.kind]}</span>
              <span style={{
                fontFamily: "Fredoka", fontWeight: 700,
                fontSize: 17, color: PAGE.ink, lineHeight: 1.2,
              }}>
                {curTask.label}
              </span>
            </div>

            {/* Next task */}
            {nextTask && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                paddingLeft: 2, opacity: 0.5,
              }}>
                <span style={{ fontSize: 14 }}>{ICONS[nextTask.kind]}</span>
                <span style={{ fontSize: 12, color: PAGE.sub }}>
                  Next: {nextTask.label}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Advance button */}
      <button
        onClick={onAdvance}
        disabled={done}
        style={{
          cursor: done ? "default" : "pointer",
          fontSize: 17, fontWeight: 800, padding: "13px",
          borderRadius: 14, border: "none",
          background: done ? PAGE.track : `linear-gradient(135deg, ${kid.accent}, ${kid.accent2})`,
          color: done ? PAGE.sub : "#1a1208",
          transition: "transform 0.1s ease",
        }}
        onPointerDown={(e) => { if (!done) e.currentTarget.style.transform = "scale(0.94)"; }}
        onPointerUp={(e)   => { e.currentTarget.style.transform = "scale(1)"; }}
        onPointerLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {done ? "All done ✓" : "I finished this step ✓"}
      </button>
    </div>
  );
}
