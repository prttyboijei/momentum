import { useState, useEffect, useRef } from 'react';
import { Brain, Coffee, Play, Pause, RotateCcw } from 'lucide-react';
import { C } from './tokens';
import { Card, Btn } from './Primitives';
import { genId, todayStr, timeNow } from './utils';

const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

// FIX: original code used `sessions` inside setInterval callback, causing a stale
// closure — the callback always saw the value from the render when it was created.
// Solution: track sessions in a ref (always current) and sync to state for display.

export default function FocusTimer({ activeGoalId, goals, setLogs }) {
  const [mode,       setMode]     = useState('focus');
  const [time,       setTime]     = useState(DURATIONS.focus);
  const [running,    setRunning]  = useState(false);
  const [sessions,   setSessions] = useState(0);   // display only

  const intervalRef  = useRef(null);
  const sessionsRef  = useRef(0);   // FIX: always-current session count
  const modeRef      = useRef('focus');
  const runningRef   = useRef(false);

  // Keep mode ref in sync
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { runningRef.current = running; }, [running]);

  const switchMode = (m) => {
    setMode(m);
    modeRef.current = m;
    setTime(DURATIONS[m]);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const completeSession = () => {
    sessionsRef.current += 1;
    const ns = sessionsRef.current;
    setSessions(ns);

    // Auto-log to active goal
    const activeGoal = goals.find((g) => g.id === activeGoalId) ?? goals[0];
    if (activeGoal) {
      setLogs((ls) => ({
        ...ls,
        [activeGoal.id]: [
          ...(ls[activeGoal.id] ?? []),
          {
            id: genId(), goalId: activeGoal.id,
            date: todayStr(), time: timeNow(),
            action: `Completed focus session #${ns} (25 min)`,
            fromTimer: true,
          },
        ],
      }));
    }

    // Auto-switch mode
    const nextMode = ns % 4 === 0 ? 'long' : 'short';
    setTimeout(() => switchMode(nextMode), 500);
  };

  // Timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (modeRef.current === 'focus') {
              completeSession();
            } else {
              setTimeout(() => switchMode('focus'), 500);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = String(Math.floor(time / 60)).padStart(2, '0');
  const secs = String(time % 60).padStart(2, '0');

  const R     = 90;
  const circ  = 2 * Math.PI * R;
  const progress = 1 - time / DURATIONS[mode];

  const modeColors = { focus: C.accent, short: C.teal, long: C.purple };
  const mc = modeColors[mode];

  const MODES = [
    { id: 'focus', label: 'Focus',       icon: Brain  },
    { id: 'short', label: 'Short Break', icon: Coffee },
    { id: 'long',  label: 'Long Break',  icon: Coffee },
  ];

  return (
    <div className="fade" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="f-serif" style={{ fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 4 }}>Focus Timer</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Stay in flow. Completed sessions auto-log to your goal.</p>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 36,
        background: C.card, padding: 5, borderRadius: 12,
        border: `1px solid ${C.border}`,
      }}>
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => switchMode(id)}
            style={{
              flex: 1, padding: '8px 6px', borderRadius: 8,
              background: mode === id ? modeColors[id] : 'transparent',
              color: mode === id ? '#07070A' : C.textMuted,
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              border: 'none',
            }}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* SVG ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
        <div
          style={{ position: 'relative', width: 224, height: 224, borderRadius: '50%' }}
          className={running ? 'timer-pulse' : ''}
        >
          <svg width="224" height="224" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="112" cy="112" r={R} fill="none" stroke={C.border}   strokeWidth="7" />
            <circle
              cx="112" cy="112" r={R} fill="none" stroke={mc} strokeWidth="7"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 54, fontWeight: 200, color: C.text, letterSpacing: '-3px', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {mode === 'focus' ? 'Focus' : mode === 'short' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
        <Btn size="lg" onClick={() => setRunning((r) => !r)} style={{ minWidth: 120 }}>
          {running ? <><Pause size={19} /> Pause</> : <><Play size={19} /> Start</>}
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => { setRunning(false); setTime(DURATIONS[mode]); }}>
          <RotateCcw size={16} />
        </Btn>
      </div>

      {/* Session dots */}
      <Card style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Focus Sessions
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          {Array.from(
            { length: Math.max(sessions + (sessions % 4 === 0 ? 4 : 4 - (sessions % 4)), 4) },
            (_, i) => {
              const done   = i < sessions;
              const isLong = (i + 1) % 4 === 0;
              return (
                <div
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: done ? (isLong ? C.purpleDim : C.accentDim) : C.surface,
                    border: `1px solid ${done ? (isLong ? C.purple : C.accent) : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600,
                    color: done ? (isLong ? C.purple : C.accent) : C.textMuted,
                  }}
                >
                  {done ? '✓' : i + 1}
                </div>
              );
            }
          )}
        </div>
        <p style={{ fontSize: 12, color: C.textMuted }}>
          {sessions === 0
            ? 'Start your first 25-min session.'
            : `${sessions} session${sessions > 1 ? 's' : ''} · ${sessions * 25} minutes of deep focus`}
        </p>
      </Card>
    </div>
  );
}