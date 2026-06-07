import { PAGE } from "../data/theme.js";

const CONFETTI = ["🎉", "🏆", "⭐", "🌟", "🎊", "✨", "💥", "🎈"];

export default function CelebrationScreen({ kids, onContinue }) {
  return (
    <div style={{
      background: PAGE.panel, borderRadius: 20, padding: "52px 32px",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Confetti layer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", flexWrap: "wrap", gap: 12,
        justifyContent: "center", alignItems: "flex-start",
        padding: 8, opacity: 0.35,
      }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{
            fontSize: 20 + (i % 3) * 8,
            animation: `confettiFall ${1.5 + (i % 4) * 0.4}s ease-in-out ${(i * 0.13) % 1.2}s infinite alternate`,
          }}>
            {CONFETTI[i % CONFETTI.length]}
          </span>
        ))}
      </div>

      {/* Trophy */}
      <div style={{
        fontSize: 100,
        animation: "bounce 0.8s ease-in-out infinite",
        display: "inline-block",
      }}>
        🏆
      </div>

      <h1 style={{
        fontFamily: "Fredoka", fontSize: 52, margin: "12px 0 6px",
        color: PAGE.yellow,
        textShadow: `0 0 24px ${PAGE.yellow}88`,
      }}>
        YOU DID IT!
      </h1>

      <div style={{ fontSize: 24, color: PAGE.ink, marginBottom: 8 }}>
        {kids.map((k) => k.name).join(" & ")} crushed the morning race!
      </div>

      <div style={{
        display: "flex", justifyContent: "center", gap: 24,
        fontSize: 48, margin: "16px 0",
      }}>
        {kids.map((k) => (
          <span key={k.id} style={{
            filter: `drop-shadow(0 0 16px ${k.accent})`,
            animation: "bounce 0.9s ease-in-out infinite",
          }}>
            {k.glyph}
          </span>
        ))}
      </div>

      <p style={{ color: PAGE.sub, fontSize: 16, marginBottom: 24 }}>
        Prize time is loading…
      </p>

      <button
        onClick={onContinue}
        style={{
          cursor: "pointer", fontSize: 18, fontWeight: 800,
          padding: "14px 32px", borderRadius: 16, border: "none",
          background: PAGE.green, color: PAGE.bg,
        }}
      >
        → Prize time!
      </button>
    </div>
  );
}
