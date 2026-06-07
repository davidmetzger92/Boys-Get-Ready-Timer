import { fit, withTimestamps } from "../engine/fit.js";
import { DEFAULT_BLOCKS } from "../data/blocks.js";
import { PAGE, ICONS } from "../data/theme.js";
import { toMin, fmtClock } from "../utils/time.js";

export default function ConfigScreen({ startStr, leaveStr, onChangeStart, onChangeLeave, onStart }) {
  const startMin = toMin(startStr);
  const leaveMin = toMin(leaveStr);
  const windowMin = Math.max(0, leaveMin - startMin);
  const result = fit(DEFAULT_BLOCKS, windowMin);
  const sched = result.ok ? withTimestamps(result.blocks) : [];
  const minTotal = DEFAULT_BLOCKS.reduce((s, b) => s + b.floor, 0);

  return (
    <div style={{
      background: PAGE.panel, borderRadius: 20, padding: 28,
      display: "flex", gap: 28, flexWrap: "wrap",
    }}>
      {/* Left: controls */}
      <div style={{ flex: "1 1 280px" }}>
        <h2 style={{ margin: "0 0 4px", fontFamily: "Fredoka", fontSize: 28, color: PAGE.ink }}>
          Set the morning
        </h2>
        <p style={{ marginTop: 0, color: PAGE.sub, fontSize: 14, lineHeight: 1.6 }}>
          Set the night before. Change either time and the blocks re-fit live.
        </p>

        <div style={{ display: "flex", gap: 16, margin: "18px 0" }}>
          <TimeInput label="Start" value={startStr} onChange={onChangeStart} />
          <TimeInput label="Leave (hard stop)" value={leaveStr} onChange={onChangeLeave} />
        </div>

        <div style={{ fontSize: 14, color: PAGE.sub, marginBottom: 16 }}>
          Window:{" "}
          <strong style={{ color: PAGE.ink }}>{windowMin} min</strong>
          {" · "}minimum needed:{" "}
          <strong style={{ color: PAGE.ink }}>{minTotal} min</strong>
        </div>

        {result.ok ? (
          <button
            onClick={onStart}
            style={{
              cursor: "pointer", fontSize: 22, fontWeight: 800,
              fontFamily: "Fredoka", padding: "14px 30px", borderRadius: 16,
              border: "none", background: PAGE.green, color: PAGE.bg,
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          >
            ▶ Start the race
          </button>
        ) : (
          <div style={{
            background: PAGE.red, color: "#1a0b08", borderRadius: 14,
            padding: "14px 16px", fontWeight: 700, lineHeight: 1.5,
          }}>
            Not enough time. You gave {windowMin} min; minimum is {result.minTotal} min.
            Push leave time back {result.shortBy} min, or cut a block.
          </div>
        )}
      </div>

      {/* Right: live block preview */}
      <div style={{ flex: "1 1 360px" }}>
        <div style={{ fontSize: 13, color: PAGE.sub, marginBottom: 10 }}>
          Block fit (updates live):
        </div>
        {result.ok ? (
          <>
            {sched.map((b) => (
              <BlockRow key={b.id} block={b} startMin={startMin} totalMin={windowMin} />
            ))}
            <div style={{ fontSize: 12, color: PAGE.sub, marginTop: 10, lineHeight: 1.5 }}>
              Start earlier → bigger prize block. Prize shrinks first when time is tight.
              Fixed blocks give up time by priority if prize hits its floor.
            </div>
          </>
        ) : (
          <div style={{ color: PAGE.sub, fontSize: 14 }}>
            Fix the time window to see the block preview.
          </div>
        )}
      </div>
    </div>
  );
}

function TimeInput({ label, value, onChange }) {
  return (
    <label style={{ fontSize: 13, color: PAGE.sub }}>
      {label}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block", marginTop: 5, fontSize: 20, padding: "8px 12px",
          borderRadius: 10, border: "none", background: PAGE.track, color: PAGE.ink,
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}

function BlockRow({ block: b, startMin, totalMin }) {
  const blockStart = startMin + Math.round(b.startS / 60);
  const widthPct = Math.max(4, (b.minutes / totalMin) * 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 28, textAlign: "center", fontSize: 20 }}>{ICONS[b.kind]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
          <span style={{ color: PAGE.ink }}>
            {b.label}
            {b.reward && <span style={{ color: PAGE.yellow }}> ★ prize</span>}
            {!b.scored && !b.reward && <span style={{ color: PAGE.sub }}> (unscored)</span>}
          </span>
          <span style={{ color: PAGE.sub }}>{fmtClock(blockStart)}</span>
        </div>
        <div style={{ height: 18, background: PAGE.track, borderRadius: 9, overflow: "hidden" }}>
          <div style={{
            width: `${widthPct}%`, height: "100%", borderRadius: 9,
            background: b.reward ? PAGE.yellow : b.scored ? PAGE.green : PAGE.sub,
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: 6, fontSize: 11, fontWeight: 800,
            color: PAGE.bg, lineHeight: "18px", minWidth: 28,
          }}>
            {b.minutes}m
          </div>
        </div>
      </div>
    </div>
  );
}
