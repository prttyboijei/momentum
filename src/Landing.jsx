import { Target, BookOpen, Timer, Brain, Zap, Sparkles } from 'lucide-react';
import { C } from './tokens';
import { Btn, Card } from './Primitives';

const FEATURES = [
  { icon: Target,   title: 'Goal Setting',    desc: 'Define clear goals with targets, deadlines, and deep motivation.',             color: C.accent  },
  { icon: BookOpen, title: 'Daily Action Log', desc: 'Record every action you take toward your goal, day by day.',                  color: C.teal    },
  { icon: Timer,    title: 'Focus Timer',      desc: 'Pomodoro sessions that auto-log to your active goal.',                        color: C.purple  },
  { icon: Brain,    title: 'AI Insights',      desc: 'Claude analyzes patterns and delivers personalized coaching.',                 color: '#FB7185' },
];

export default function Landing({ onAuth }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, background: C.accent, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={17} color="#07070A" fill="#07070A" />
          </div>
          <span className="f-serif" style={{ fontSize: 19, fontWeight: 700, color: C.text }}>Momentum by Yoshi</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" onClick={() => onAuth('login')}>Log In</Btn>
          <Btn onClick={() => onAuth('signup')}>Get Started</Btn>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '90px 40px 70px', maxWidth: 680, margin: '0 auto' }} className="fade">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.accentDim, border: `1px solid rgba(232,160,32,0.22)`,
          borderRadius: 99, padding: '5px 14px', marginBottom: 30,
          fontSize: 12, color: C.accent, fontWeight: 500,
        }}>
          <Sparkles size={12} /> AI-Powered Goal Tracking
        </div>

        <h1 className="f-serif" style={{
          fontSize: 'clamp(46px,7vw,72px)', fontWeight: 700, lineHeight: 1.08,
          color: C.text, marginBottom: 22,
        }}>
          Build Momentum<br />
          <em style={{ color: C.accent, fontStyle: 'italic' }}>Every Day</em>
        </h1>

        <p style={{
          fontSize: 17, color: C.textSub, lineHeight: 1.75,
          maxWidth: 480, margin: '0 auto 38px',
        }}>
          Track your goals, log daily actions, stay focused with Pomodoro, and get AI insights that help you improve.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn size="lg" onClick={() => onAuth('signup')} style={{ gap: 8 }}>
            <Zap size={17} /> Start Tracking Your Goals
          </Btn>
          <Btn variant="ghost" size="lg" onClick={() => onAuth('login')}>
            I have an account
          </Btn>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <Card key={title}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${color}14`, border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 7 }}>{title}</h3>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.65 }}>{desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: '18px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Zap size={13} color={C.accent} fill={C.accent} />
          <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Fraunces',serif" }}>Momentum by Yoshi</span>
        </div>
        <span style={{ fontSize: 11, color: C.textMuted }}>Made by yoshi</span>
      </div>
    </div>
  );
}