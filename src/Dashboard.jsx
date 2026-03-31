import {
  Flame, Check, Calendar, TrendingUp,
  Target, Plus, ChevronRight, Star,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
} from 'recharts';
import { C } from './tokens';
import { Card, StatCard, Badge, ProgressBar, Btn } from './Primitives';
import { todayStr, fmtDate, greeting } from './utils';

// FIX: original code put <rect> elements inside <Bar> which don't work in Recharts.
// The correct approach is to use <Cell> from recharts for per-bar coloring.

export default function Dashboard({ user, goals, logs, setPage, setActiveGoalId }) {
  const activeGoal = goals[0] ?? null;
  const allLogs = activeGoal ? (logs[activeGoal.id] ?? []) : [];

  /* ── streak ── */
  const calcStreak = () => {
    if (!allLogs.length) return 0;
    const days = [...new Set(allLogs.map((l) => l.date))].sort().reverse();
    let streak = 0;
    let cur = new Date(todayStr());
    for (const ds of days) {
      const d    = new Date(ds);
      const diff = Math.round((cur - d) / 86_400_000);
      if (diff <= 1) { streak++; cur = d; } else break;
    }
    return streak;
  };

  const streak       = calcStreak();
  const totalActions = Object.values(logs).flat().length;
  const daysLogged   = new Set(allLogs.map((l) => l.date)).size;
  const todayActions = allLogs.filter((l) => l.date === todayStr());

  /* ── weekly bar data ── */
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d  = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split('T')[0];
    return {
      day:     d.toLocaleDateString('en', { weekday: 'short' }),
      actions: allLogs.filter((l) => l.date === ds).length,
      isToday: ds === todayStr(),
    };
  });

  /* ── badges ── */
  const badges = [];
  if (streak       >= 3)  badges.push({ icon: Flame,    label: `${streak}-Day Streak`,   color: C.orange });
  if (totalActions >= 10) badges.push({ icon: Check,    label: '10 Actions Logged',       color: C.accent });
  if (daysLogged   >= 7)  badges.push({ icon: Star,     label: 'Week Warrior',            color: C.purple });

  return (
    <div className="fade">
      {/* Greeting */}
      <div style={{ marginBottom: 30 }}>
        <h1 className="f-serif" style={{ fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 5 }}>
          Good {greeting()}, {user.name.split(' ')[0]}
        </h1>
        <p style={{ fontSize: 14, color: C.textMuted }}>
          {streak > 0
            ? `🔥 ${streak}-day streak. You're building real momentum.`
            : 'What actions will you take today toward your goal?'}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard icon={Flame}       label="Streak"        value={streak}       color={C.orange} sub="days"     />
        <StatCard icon={Check}       label="Total Actions" value={totalActions} color={C.teal}   sub="all time" />
        <StatCard icon={Calendar}    label="Days Logged"   value={daysLogged}   color={C.accent} sub="days"     />
        <StatCard icon={TrendingUp}  label="Today"         value={todayActions.length} color={C.purple} sub="actions" />
      </div>

      {/* Active goal + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Active Goal */}
        <Card>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Active Goal
          </div>
          {activeGoal ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <h3 className="f-serif" style={{ fontSize: 20, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>
                  {activeGoal.title}
                </h3>
                <span style={{ fontSize: 24, fontWeight: 700, color: C.accent, lineHeight: 1 }}>
                  {activeGoal.progress ?? 0}%
                </span>
              </div>
              <ProgressBar value={activeGoal.progress ?? 0} />
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10, display: 'flex', gap: 12 }}>
                {activeGoal.target   && <span>🎯 {activeGoal.target}</span>}
                {activeGoal.deadline && <span>📅 {fmtDate(activeGoal.deadline)}</span>}
              </div>
              <Btn
                size="sm"
                style={{ marginTop: 16 }}
                onClick={() => { setActiveGoalId(activeGoal.id); setPage('log'); }}
              >
                Log Actions <ChevronRight size={13} />
              </Btn>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Target size={32} color={C.textMuted} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 14 }}>No goal yet.</p>
              <Btn size="sm" onClick={() => setPage('goals')}><Plus size={13} /> Create Goal</Btn>
            </div>
          )}
        </Card>

        {/* Weekly chart — FIX: uses Cell for per-bar color */}
        <Card>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Weekly Activity
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <BarChart data={weekData} barSize={22}>
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 12 }}
                cursor={{ fill: C.accentDim }}
              />
              <Bar dataKey="actions" radius={[5, 5, 0, 0]}>
                {weekData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isToday ? C.teal : C.accent}
                    fillOpacity={entry.actions === 0 ? 0.25 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Today's log preview */}
      {todayActions.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Actions
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.teal }}>
              <Check size={12} /> Day logged
            </div>
          </div>
          {todayActions.slice(0, 4).map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <Check size={13} color={C.teal} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: C.text, flex: 1 }}>{a.action}</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>{a.time}</span>
            </div>
          ))}
          {todayActions.length > 4 && (
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>+{todayActions.length - 4} more</div>
          )}
        </Card>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            Achievements
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {badges.map((b) => <Badge key={b.label} {...b} />)}
          </div>
        </Card>
      )}
    </div>
  );
}