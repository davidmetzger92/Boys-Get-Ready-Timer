import { useState, useEffect, useRef, useCallback } from "react";
import { fit, withTimestamps } from "./engine/fit.js";
import { DEFAULT_BLOCKS } from "./data/blocks.js";
import { KIDS, ICONS, PAGE, COOPERATIVE } from "./data/theme.js";
import { toMin } from "./utils/time.js";
import { playTaskComplete, playLeaveChime, playCelebration, playPrizeHandoff } from "./sounds/audio.js";

import ConfigScreen      from "./components/ConfigScreen.jsx";
import SharedClock       from "./components/SharedClock.jsx";
import Lane              from "./components/Lane.jsx";
import CelebrationScreen from "./components/CelebrationScreen.jsx";
import PrizeHandoff      from "./components/PrizeHandoff.jsx";
import LeaveState        from "./components/LeaveState.jsx";

// Modes: config | running | celebrating | prizeHandoff | leaveState
const INITIAL_LANES = () =>
  Object.fromEntries(KIDS.map((k) => [k.id, { taskIndex: 0, burst: false }]));

export default function App() {
  const [startStr, setStartStr] = useState("06:00");
  const [leaveStr, setLeaveStr] = useState("06:50");
  const [mode, setMode]         = useState("config");
  const [elapsed, setElapsed]   = useState(0);   // seconds since start
  const [lanes, setLanes]       = useState(INITIAL_LANES);
  const [speed, setSpeed]       = useState(60);  // demo speed multiplier
  const tickRef  = useRef(null);
  const soundRef = useRef({ prize: false, leave: false, celebrate: false });

  // Derived schedule
  const startMin  = toMin(startStr);
  const leaveMin  = toMin(leaveStr);
  const windowMin = Math.max(0, leaveMin - startMin);
  const fitResult = fit(DEFAULT_BLOCKS, windowMin);
  const sched     = fitResult.ok ? withTimestamps(fitResult.blocks) : [];

  const totalS        = windowMin * 60;
  const prizeBlock    = sched.find((b) => b.reward);
  const scoredBlocks  = sched.filter((b) => b.scored);
  const lastScoredIdx = scoredBlocks.length - 1;

  // Master schedule clock position
  const masterBlockIdx = sched.findIndex((b) => elapsed < b.endS);
  const curBlock       = masterBlockIdx === -1 ? null : sched[masterBlockIdx];
  const blockFracLeft  = curBlock
    ? Math.max(0, (curBlock.endS - elapsed) / curBlock.dur)
    : 0;
  const totalSecsLeft = Math.max(0, totalS - elapsed);
  const urgent        = curBlock ? blockFracLeft < 0.2 : false;

  const rewardMins = prizeBlock ? prizeBlock.minutes : 0;

  // Tick
  useEffect(() => {
    if (mode !== "running") return;
    tickRef.current = setInterval(
      () => setElapsed((e) => e + 1),
      1000 / speed,
    );
    return () => clearInterval(tickRef.current);
  }, [mode, speed]);

  // Wall-clock transitions
  useEffect(() => {
    if (mode !== "running") return;

    if (elapsed >= totalS && !soundRef.current.leave) {
      soundRef.current.leave = true;
      playLeaveChime();
      setMode("leaveState");
      return;
    }

    if (prizeBlock && elapsed >= prizeBlock.startS && !soundRef.current.prize) {
      soundRef.current.prize = true;
      playPrizeHandoff();
      setMode("prizeHandoff");
    }
  }, [elapsed, mode, totalS, prizeBlock]);

  // Celebration trigger — fires when all kids clear their last scored task (§7.3)
  useEffect(() => {
    if (mode !== "running") return;
    if (soundRef.current.celebrate) return;

    const allDone = COOPERATIVE
      ? KIDS.every((k) => lanes[k.id].taskIndex > lastScoredIdx)
      : KIDS.some((k)  => lanes[k.id].taskIndex > lastScoredIdx);

    if (allDone && lastScoredIdx >= 0) {
      soundRef.current.celebrate = true;
      playCelebration();
      setMode("celebrating");
    }
  }, [lanes, mode, lastScoredIdx]);

  const start = useCallback(() => {
    soundRef.current = { prize: false, leave: false, celebrate: false };
    setElapsed(0);
    setLanes(INITIAL_LANES());
    setMode("running");
  }, []);

  const reset = useCallback(() => {
    clearInterval(tickRef.current);
    soundRef.current = { prize: false, leave: false, celebrate: false };
    setElapsed(0);
    setLanes(INITIAL_LANES());
    setMode("config");
  }, []);

  const advance = useCallback((kidId) => {
    const kid = KIDS.find((k) => k.id === kidId);
    setLanes((prev) => {
      const cur = prev[kidId];
      if (cur.taskIndex >= scoredBlocks.length) return prev;
      playTaskComplete(kid?.soundPreset ?? "chimes");
      const next = { ...prev, [kidId]: { taskIndex: cur.taskIndex + 1, burst: true } };
      setTimeout(() => {
        setLanes((p) => ({ ...p, [kidId]: { ...p[kidId], burst: false } }));
      }, 400);
      return next;
    });
  }, [scoredBlocks.length]);

  return (
    <div style={{
      minHeight: "100vh", background: PAGE.bg, color: PAGE.ink,
      padding: 16, fontFamily: "'Baloo 2', 'Trebuchet MS', sans-serif",
      boxSizing: "border-box",
    }}>
      <GlobalStyles />

      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Title bar */}
        <div style={{
          fontFamily: "Fredoka", fontWeight: 700, fontSize: 20,
          color: PAGE.sub, marginBottom: 14,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>Morning Race</span>
          {mode !== "config" && (
            <button onClick={reset} style={{
              cursor: "pointer", fontSize: 12, padding: "4px 12px",
              borderRadius: 8, border: `1px solid ${PAGE.sub}`,
              background: "transparent", color: PAGE.sub,
            }}>
              ↺ Reset
            </button>
          )}
        </div>

        {mode === "config" && (
          <ConfigScreen
            startStr={startStr} leaveStr={leaveStr}
            onChangeStart={setStartStr} onChangeLeave={setLeaveStr}
            onStart={start}
          />
        )}

        {mode === "running" && fitResult.ok && (
          <div>
            <SharedClock
              curBlock={curBlock}
              blockFracRemaining={blockFracLeft}
              totalSecondsLeft={totalSecsLeft}
              leaveMin={leaveMin}
              icons={ICONS}
              urgent={urgent}
            />

            <div style={{ display: "flex", gap: 14 }}>
              {KIDS.map((kid) => (
                <Lane
                  key={kid.id}
                  kid={kid}
                  taskIndex={lanes[kid.id].taskIndex}
                  sched={sched}
                  elapsedS={elapsed}
                  onAdvance={() => advance(kid.id)}
                  burst={lanes[kid.id].burst}
                />
              ))}
            </div>

            <div style={{
              display: "flex", gap: 8, alignItems: "center",
              marginTop: 14, justifyContent: "center",
              fontSize: 12, color: PAGE.sub,
            }}>
              <span>demo speed:</span>
              {[1, 30, 60, 120].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} style={{
                  cursor: "pointer", padding: "4px 10px", borderRadius: 8,
                  border: "none",
                  background: speed === s ? PAGE.green : PAGE.track,
                  color: speed === s ? PAGE.bg : PAGE.ink,
                  fontWeight: 700, fontSize: 12,
                }}>
                  {s}×
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "celebrating" && (
          <CelebrationScreen kids={KIDS} onContinue={() => setMode("prizeHandoff")} />
        )}

        {mode === "prizeHandoff" && (
          <PrizeHandoff
            rewardMins={rewardMins}
            leaveMin={leaveMin}
            onBackToTimer={() => setMode("running")}
            onLeave={() => { playLeaveChime(); setMode("leaveState"); }}
          />
        )}

        {mode === "leaveState" && (
          <LeaveState leaveMin={leaveMin} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.05); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
        50%       { filter: drop-shadow(0 0 14px currentColor); }
      }
      @keyframes burstPop {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-28px) scale(1.4); }
      }
      @keyframes confettiFall {
        0%   { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(12px) rotate(20deg); }
      }
    `}</style>
  );
}
