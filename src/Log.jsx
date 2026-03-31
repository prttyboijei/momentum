import { useState } from 'react';
import { Target, Plus, Check, Clock, Trash2, Edit3 } from 'lucide-react';
import { C } from './tokens';
import { Card, Btn } from './Primitives';
import { genId, todayStr, timeNow } from './utils';

const QUICK_ADDS = [
  '45 min workout', '30 min cardio', '2 study sessions',
  '1800 cal diet', '8 glasses water', '10 programming problems',
];

export default function Log({ goals, logs, setLogs, activeGoalId, setActiveGoalId }) {
  const [newAction, setNewAction] = useState('');
  const [editing,   setEditing]   = useState(null);
  const [editText,  setEditText]  = useState('');

  const activeGoal = goals.find((g) => g.id === activeGoalId) ?? goals[0];
  const goalLogs   = activeGoal ? (logs[activeGoal.id] ?? []) : [];
  const todayLogs  = goalLogs.filter((l) => l.date === todayStr());

  const addAction = () => {
    if (!newAction.trim() || !activeGoal) return;
    const entry = {
      id: genId(), goalId: activeGoal.id,
      date: todayStr(), time: timeNow(),
      action: newAction.trim(),
    };
    setLogs((ls) => ({ ...ls, [activeGoal.id]: [...(ls[activeGoal.id] ?? []), entry] }));
    setNewAction('');
  };

  const del = (id) =>
    setLogs((ls) => ({ ...ls, [activeGoal.id]: ls[activeGoal.id].filter((l) => l.id !== id) }));

  const saveEdit = (id) => {
    setLogs((ls) => ({
      ...ls,
      [activeGoal.id]: ls[activeGoal.id].map((l) => l.id === id ? { ...l, action: editText } : l),
    }));
    setEditing(null);
  };

  if (!goals.length) return (
    <div className="fade" style={{ textAlign: 'center', paddingTop: 80 }}>
      <Target size={38} color={C.textMuted} style={{ margin: '0 auto 14px' }} />
      <h2 className="f-serif" style={{ color: C.text, marginBottom: 8, fontSize: 22 }}>No goals yet</h2>
      <p style={{ color: C.textMuted, fontSize: 13 }}>Create a goal first to start logging actions.</p>
    </div>
  );

  return (
    <div className="fade">
      <div style={{ marginBottom: 24 }}>
        <h1 className="f-serif" style={{ fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 4 }}>Today's Log</h1>
        <p style={{ fontSize: 13, color: C.textMuted }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Goal selector (multi-goal) */}
      {goals.length > 1 && (
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, fontWeight: 500 }}>LOGGING FOR</label>
          <select value={activeGoal?.id ?? ''} onChange={(e) => setActiveGoalId(e.target.value)} style={{ maxWidth: 300 }}>
            {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>
      )}

      {/* Active goal pill */}
      {activeGoal && (
        <div style={{
          background: C.accentDim, border: `1px solid rgba(232,160,32,0.2)`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Target size={14} color={C.accent} />
          <span className="f-serif" style={{ fontSize: 15, color: C.text }}>{activeGoal.title}</span>
        </div>
      )}

      {/* Add action */}
      <Card style={{ marginBottom: 22 }}>
        <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>
          What action did you take today toward this goal?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="e.g. 45 min gym workout, studied Chapter 3, solved 10 problems..."
            value={newAction}
            onChange={(e) => setNewAction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAction()}
          />
          <Btn onClick={addAction} disabled={!newAction.trim()} style={{ flexShrink: 0 }}>
            <Plus size={15} /> Add
          </Btn>
        </div>
        {/* Quick-add chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {QUICK_ADDS.map((s) => (
            <button
              key={s}
              onClick={() => setNewAction(s)}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                color: C.textMuted, fontSize: 11, borderRadius: 6,
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Logs header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>
          {todayLogs.length} {todayLogs.length === 1 ? 'action' : 'actions'} today
        </h2>
        {todayLogs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.teal }}>
            <Check size={12} /> Day complete
          </div>
        )}
      </div>

      {/* Logs list */}
      {todayLogs.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <Clock size={26} color={C.textMuted} style={{ margin: '0 auto 12px' }} />
          <p style={{ color: C.textMuted, fontSize: 13 }}>No actions logged yet today. Start logging above.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayLogs.map((log) => (
            <Card key={log.id} style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: C.tealDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={14} color={C.teal} />
                </div>

                {editing === log.id ? (
                  <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(log.id)}
                    />
                    <Btn size="sm" onClick={() => saveEdit(log.id)}>Save</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setEditing(null)}>×</Btn>
                  </div>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 13, color: C.text }}>{log.action}</span>
                    {log.fromTimer && (
                      <span style={{ fontSize: 10, color: C.accent, background: C.accentDim, borderRadius: 5, padding: '2px 6px', flexShrink: 0 }}>
                        ⏱ Timer
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: C.textMuted, flexShrink: 0 }}>{log.time}</span>
                    <button onClick={() => { setEditing(log.id); setEditText(log.action); }} style={{ background: 'none', color: C.textMuted, padding: 4 }}>
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => del(log.id)} style={{ background: 'none', color: C.textMuted, padding: 4 }}>
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}