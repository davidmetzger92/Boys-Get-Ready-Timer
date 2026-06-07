import { PAGE, PRIZE } from "../data/theme.js";
import { fmtClock } from "../utils/time.js";

export default function PrizeHandoff({ rewardMins, leaveMin, onBackToTimer, onLeave }) {
  return (
    <div style={{
      background: PAGE.panel, borderRadius: 20, padding: 44,
      textAlign: "center",
    }}>
      <div style={{
        fontSize: 80,
        animation: "glow 1.8s ease-in-out infinite",
        display: "inline-block",
      }}>
        {PRIZE.icon}
      </div>

      <h1 style={{
        fontFamily: "Fredoka", fontSize: 40, margin: "10px 0",
        color: PAGE.yellow,
      }}>
        {PRIZE.label}
      </h1>

      <p style={{
        color: PAGE.sub, fontSize: 16, maxWidth: 520, margin: "0 auto 16px",
        lineHeight: 1.6,
      }}>
        The timer steps aside. If prize time is screen-based, hand off to Alexa:
      </p>

      {/* Alexa command box */}
      <div style={{
        display: "inline-block", background: PAGE.track, borderRadius: 16,
        padding: "18px 28px", margin: "0 0 20px",
      }}>
        <div style={{ fontSize: 12, color: PAGE.sub, marginBottom: 4 }}>Say:</div>
        <div style={{
          fontFamily: "Fredoka", fontSize: 26, fontWeight: 700, color: PAGE.ink,
        }}>
          "Alexa, set a timer for {rewardMins} minutes"
        </div>
        <div style={{ fontSize: 12, color: PAGE.sub, marginTop: 6 }}>
          Fires at {fmtClock(leaveMin)} — car time.
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={onBackToTimer}
          style={{
            cursor: "pointer", fontSize: 15, fontWeight: 700,
            padding: "11px 22px", borderRadius: 14,
            border: `2px solid ${PAGE.sub}`, background: "transparent", color: PAGE.ink,
          }}
        >
          ⤺ Back to timer
        </button>
        <button
          onClick={onLeave}
          style={{
            cursor: "pointer", fontSize: 15, fontWeight: 700,
            padding: "11px 22px", borderRadius: 14,
            border: "none", background: PAGE.green, color: PAGE.bg,
          }}
        >
          Skip to car time →
        </button>
      </div>
    </div>
  );
}
