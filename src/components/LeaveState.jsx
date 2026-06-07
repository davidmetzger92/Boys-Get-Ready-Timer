import { PAGE, ICONS } from "../data/theme.js";
import { fmtClock } from "../utils/time.js";

export default function LeaveState({ leaveMin, onReset }) {
  return (
    <div style={{
      background: PAGE.panel, borderRadius: 20, padding: "56px 40px",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: 96, marginBottom: 8,
        animation: "pulse 1.8s ease-in-out infinite",
        display: "inline-block",
      }}>
        {ICONS.shoe}
      </div>

      <h1 style={{
        fontFamily: "Fredoka", fontSize: 56, margin: "10px 0",
        color: PAGE.finish,
      }}>
        Car time!
      </h1>

      <p style={{
        color: PAGE.sub, fontSize: 18, maxWidth: 600,
        margin: "0 auto 12px", lineHeight: 1.6,
      }}>
        We leave at {fmtClock(leaveMin)} either way.
      </p>

      <p style={{
        color: PAGE.ink, fontSize: 17, maxWidth: 540,
        margin: "0 auto 28px", lineHeight: 1.6,
      }}>
        Ready = comfy + prize.{" "}
        <span style={{ color: PAGE.sub }}>Not ready = finish in the car.</span>
        <br />
        The clock decides, not a grown-up.
      </p>

      <div style={{ fontSize: 12, color: PAGE.sub, marginBottom: 28, fontStyle: "italic" }}>
        (Calm full-screen — soft chime, no klaxon.)
      </div>

      <button
        onClick={onReset}
        style={{
          cursor: "pointer", fontSize: 16, fontWeight: 700,
          padding: "12px 26px", borderRadius: 14,
          border: "none", background: PAGE.green, color: PAGE.bg,
        }}
      >
        ↺ Reset for tomorrow
      </button>
    </div>
  );
}
