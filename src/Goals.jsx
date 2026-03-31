import { useState } from 'react';
import { Target, Plus, Trash2, BookOpen } from 'lucide-react';
import { C } from './tokens';
import { Card, Btn, ProgressBar } from './Primitives';
import { genId, todayStr, fmtDate } from './utils';

export default function Goals({ goals, setGoals, setActiveGoalId, setPage }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', target: '', deadline: '', reason: '' });
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = () => {
    if (!form.title.trim()) return;
    const g = { ...form, id: genId(), createdAt: todayStr(), progress: 0 };
    setGoals((gs) => [...gs, g]);
    if (!goals.length) setActiveGoalId(g.id);
    setForm({ title: '', description: '', target: '', deadline: '', reason: '' });
    setCreating(false);
  };

  const del = (id) => setGoals((gs) => gs.filter((g) => g.id !== id));

  const updateProgress = (id, val) =>
    setGoals((gs) =>
      gs.map((g) => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, parseInt(val) || 0)) } : g)
    );

  return (
    <div className="fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h1 className="f-serif" style={{ fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 4 }}>Your Goals</h1>
          <p style={{ fontSize: 13, color: C.textMuted }}>Set clear intentions. Track real progress.</p>
        </div>
        <Btn onClick={() => setCreating(true)}><Plus size={15} /> New Goal</Btn>
      </div>

      {/* Create form */}
      {creating && (
        <Card accent style={{ marginBottom: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 18 }}>Create New Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 5, fontWeight: 500 }}>GOAL TITLE *</label>
              <input placeholder="e.g. Lose 10 kg, Build a portfolio, Save ₱20,000" value={form.title} onChange={up('title')} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 5, fontWeight: 500 }}>DESCRIPTION</label>
              <textarea rows={2} placeholder="What does achieving this mean to you?" value={form.description} onChange={up('description')} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 5, fontWeight: 500 }}>TARGET</label>
              <input placeholder="e.g. 10 kg, 100 hours, ₱20,000" value={form.target} onChange={up('target')} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 5, fontWeight: 500 }}>DEADLINE</label>
              <input type="date" value={form.deadline} onChange={up('deadline')} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 5, fontWeight: 500 }}>WHY THIS GOAL?</label>
              <input placeholder="Your deep reason for pursuing this" value={form.reason} onChange={up('reason')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <Btn onClick={create} disabled={!form.title.trim()}>Create Goal</Btn>
            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Empty state */}
      {goals.length === 0 && !creating ? (
        <Card style={{ textAlign: 'center', padding: 64 }}>
          <Target size={38} color={C.textMuted} style={{ margin: '0 auto 14px' }} />
          <h3 style={{ color: C.text, marginBottom: 8, fontSize: 16 }}>No goals yet</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 18 }}>Create your first goal to start building momentum.</p>
          <Btn onClick={() => setCreating(true)}><Plus size={15} /> Create Your First Goal</Btn>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {goals.map((goal, idx) => (
            <Card key={goal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ flex: 1, paddingRight: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 className="f-serif" style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{goal.title}</h3>
                    {idx === 0 && (
                      <span style={{
                        fontSize: 10, background: C.accentDim, color: C.accent,
                        border: `1px solid rgba(232,160,32,0.2)`, borderRadius: 5,
                        padding: '2px 7px', fontWeight: 500,
                      }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  {goal.description && <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{goal.description}</p>}
                  <div style={{ display: 'flex', gap: 14, fontSize: 11, color: C.textMuted, flexWrap: 'wrap' }}>
                    {goal.target   && <span>🎯 {goal.target}</span>}
                    {goal.deadline && <span>📅 {fmtDate(goal.deadline)}</span>}
                    {goal.reason   && <span>💡 {goal.reason}</span>}
                  </div>
                </div>
                <button onClick={() => del(goal.id)} style={{ background: 'none', color: C.textMuted, padding: 6 }}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={goal.progress ?? 0} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <input
                    type="number" min={0} max={100}
                    value={goal.progress ?? 0}
                    onChange={(e) => updateProgress(goal.id, e.target.value)}
                    style={{ width: 58, padding: '4px 8px', textAlign: 'center', fontSize: 13 }}
                  />
                  <span style={{ fontSize: 12, color: C.textMuted }}>%</span>
                </div>
              </div>

              <Btn size="sm" onClick={() => { setActiveGoalId(goal.id); setPage('log'); }}>
                <BookOpen size={12} /> Log Actions
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}