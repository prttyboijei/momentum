import { useState } from 'react';
import { Brain, Sparkles, RotateCcw, KeyRound } from 'lucide-react';
import { C } from './tokens';
import { Card, Btn } from './Primitives';

// ── Type styles ──────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  pattern:       { color: C.accent,  label: 'Pattern'       },
  encouragement: { color: C.teal,    label: 'Encouragement' },
  tip:           { color: C.purple,  label: 'Tip'           },
  warning:       { color: C.orange,  label: 'Watch Out'     },
  milestone:     { color: '#FB7185', label: 'Milestone'     },
};

export default function Insights({ goals, logs }) {
  const [insights, setInsights] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [done,     setDone]     = useState(false);

  // API key — reads from .env (VITE_ANTHROPIC_API_KEY) with manual fallback
  const [apiKey, setApiKey] = useState(
    typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_ANTHROPIC_API_KEY ?? '') : ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);

  const activeGoal = goals[0] ?? null;
  const allLogs    = activeGoal ? (logs[activeGoal.id] ?? []) : [];

  const generate = async () => {
    if (!activeGoal || !allLogs.length) {
      setError('Log some actions first before generating insights.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key.');
      setShowKeyInput(true);
      return;
    }
    setLoading(true);
    setError('');

    const summary = allLogs
      .slice(-25)
      .map((l) => `[${l.date} ${l.time}] ${l.action}`)
      .join('\n');

    const prompt = `You are an AI performance coach for Momentum, a goal tracking app. Analyze the following goal and action log.

Goal: ${activeGoal.title}
Target: ${activeGoal.target || 'Not specified'}
Deadline: ${activeGoal.deadline || 'Not set'}
Motivation: ${activeGoal.reason || 'Not specified'}
Progress: ${activeGoal.progress ?? 0}%

Recent action log:
${summary}

Provide exactly 5 coaching insights as a JSON array. Each insight must have:
- "type": one of "pattern", "encouragement", "tip", "warning", "milestone"
- "text": specific, actionable coaching message in 1-2 sentences based on the actual log data
- "emoji": one emoji representing the insight

Rules: Be specific to their actual data. Reference real patterns you see. Be encouraging but honest.
Respond ONLY with a valid JSON array. No markdown, no extra text.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
          // Required header for direct browser → Anthropic API calls
          'anthropic-dangerous-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const txt  = data.content
        .map((b) => b.text || '')
        .join('')
        .replace(/```json|```/g, '')
        .trim();

      setInsights(JSON.parse(txt));
      setDone(true);
    } catch (e) {
      setError(`Unable to generate insights: ${e.message}`);
    }

    setLoading(false);
  };

  if (!activeGoal) return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h1 className="f-serif" style={{ fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 4 }}>AI Insights</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Claude reviews your patterns and gives you personalized coaching.</p>
      </div>
      <Card style={{ textAlign: 'center', padding: 64 }}>
        <Brain size={38} color={C.textMuted} style={{ margin: '0 auto 14px' }} />
        <h3 style={{ color: C.text, marginBottom: 8 }}>No goal to analyze</h3>
        <p style={{ color: C.textMuted, fontSize: 13 }}>Create a goal and log some actions first.</p>
      </Card>
    </div>
  );

  return (
    <div className="fade">
      <div style={{ marginBottom: 28 }}>
        <h1 className="f-serif" style={{ fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 4 }}>AI Insights</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>Claude reviews your patterns and gives you personalized coaching.</p>
      </div>

      {/* API Key setup */}
      {(showKeyInput || !apiKey) && (
        <Card style={{ marginBottom: 18, borderColor: `${C.purple}44` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <KeyRound size={15} color={C.purple} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Anthropic API Key</span>
          </div>
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, lineHeight: 1.6 }}>
            Enter your API key from{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: C.accent }}>
              console.anthropic.com
            </a>
            . Or set <code style={{ background: C.surface, padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>VITE_ANTHROPIC_API_KEY</code> in your <code style={{ background: C.surface, padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>.env</code> file.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setShowKeyInput(false)}
            />
            <Btn size="sm" variant="teal" onClick={() => setShowKeyInput(false)} disabled={!apiKey.trim()}>
              Save
            </Btn>
          </div>
        </Card>
      )}

      {!done ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{
            width: 68, height: 68, background: C.purpleDim, borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', border: `1px solid rgba(167,139,250,0.2)`,
          }}>
            <Brain size={34} color={C.purple} />
          </div>
          <h3 className="f-serif" style={{ color: C.text, fontSize: 22, marginBottom: 10 }}>Weekly AI Review</h3>
          <p style={{ color: C.textMuted, fontSize: 13, maxWidth: 360, margin: '0 auto 22px', lineHeight: 1.7 }}>
            Claude will analyze your{' '}
            <strong style={{ color: C.text }}>{allLogs.length}</strong> logged action{allLogs.length !== 1 ? 's' : ''} for{' '}
            <strong style={{ color: C.text }}>{activeGoal.title}</strong> and generate personalized coaching insights.
          </p>
          {allLogs.length === 0 && (
            <p style={{ color: C.orange, fontSize: 12, marginBottom: 16 }}>⚠️ Log some actions first for meaningful insights.</p>
          )}
          {!apiKey && (
            <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>
              <button onClick={() => setShowKeyInput(true)} style={{ background: 'none', color: C.accent, fontSize: 12, padding: 0, cursor: 'pointer' }}>
                Set your API key
              </button>{' '}to enable insights.
            </p>
          )}
          {error && <p style={{ color: C.danger, fontSize: 12, marginBottom: 14 }}>{error}</p>}
          <Btn size="lg" onClick={generate} disabled={loading || allLogs.length === 0 || !apiKey}>
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid #07070A', borderTopColor: 'transparent', borderRadius: '50%' }} className="spin" />
                Analyzing your data...
              </>
            ) : (
              <><Sparkles size={17} /> Generate Insights</>
            )}
          </Btn>
        </Card>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: C.textMuted }}>
              Based on {allLogs.length} logged actions for{' '}
              <strong style={{ color: C.text }}>{activeGoal.title}</strong>
            </p>
            <Btn size="sm" variant="ghost" onClick={generate} disabled={loading}>
              {loading ? 'Refreshing...' : <><RotateCcw size={12} /> Refresh</>}
            </Btn>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((ins, i) => {
              const ts = TYPE_STYLE[ins.type] ?? TYPE_STYLE.tip;
              return (
                <Card
                  key={i}
                  style={{
                    display: 'flex', gap: 16, alignItems: 'flex-start',
                    borderLeft: `3px solid ${ts.color}`,
                  }}
                >
                  <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{ins.emoji}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: ts.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      {ts.label}
                    </div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.65, margin: 0 }}>{ins.text}</p>
                  </div>
                </Card>
              );
            })}
          </div>
          {error && <p style={{ color: C.danger, fontSize: 12, marginTop: 12 }}>{error}</p>}
        </>
      )}
    </div>
  );
}