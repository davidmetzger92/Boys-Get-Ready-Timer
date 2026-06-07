import { PAGE } from "../data/theme.js";
import { pad, fmtClock } from "../utils/time.js";

/**
 * The ONE shared clock on screen (§5.1).
 * Shows: current block icon + name, draining bar for that block,
 * and time-until-leave countdown.
 */
export default function SharedClock({ curBlock, blockFracRemaining, totalSecondsLeft, leaveMin, icons, urgent }) {
  const blockSecsLeft = curBlock
    ? Math.max(0, Math.round(curBlock.dur * blockFracRemaining))
    : 0;

  const barColor = blockFracRemaining > 0.5
    ? PAGE.green
    : blockFracRemaining > 0.2
    ? PAGE.yellow
    : PAGE.red;

  const minsLeft = Math.ceil(totalSecondsLeft / 60);

  return (
    <div style={{
      background: PAGE.panel, borderRadius: 20, padding: "18px 24px",
      marginBottom: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Current block icon */}
        <div style={{
          fontSize: 72, flexShrink: 0,
          animation: urgent ? "pulse 1.4s ease-in-out infinite" : "none",
        }}>
          {curBlock ? icons[curBlock.kind] : "🏁"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Block label */}
          <div style={{
            fontFamily: "Fredoka", fontWeight: 700,
            fontSize: 36, lineHeight: 1.05, color: PAGE.ink,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {curBlock ? curBlock.label : "Race complete!"}
          </div>

          {/* Draining bar — THE one shared clock */}
          <div style={{
            height: 34, background: PAGE.track, borderRadius: 10,
            overflow: "hidden", marginTop: 10,
          }}>
            <div style={{
              width: `${Math.max(0, blockFracRemaining * 100)}%`,
              height: "100%", borderRadius: 10,
              background: barColor,
              transition: "width 1s linear, background 0.5s ease",
            }} />
          </div>

          {/* Readouts */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 6, fontSize: 13, color: PAGE.sub,
          }}>
            <span>
              {Math.floor(blockSecsLeft / 60)}:{pad(blockSecsLeft % 60)} left here
            </span>
            <span style={{ color: minsLeft <= 5 ? PAGE.red : PAGE.sub }}>
              leave at {fmtClock(leaveMin)} — {minsLeft} min
            </span>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: "center", fontSize: 11, color: PAGE.sub, marginTop: 8, opacity: 0.6,
      }}>
        ↑ one shared clock — tap buttons below are progress, not timers ↑
      </div>
    </div>
  );
}
