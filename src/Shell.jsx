import { LayoutDashboard, Target, BookOpen, Timer, Brain, Zap, LogOut } from 'lucide-react';
import { C } from './tokens';
import { Btn } from './Primitives';

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'   },
  { id: 'goals',     icon: Target,          label: 'Goals'        },
  { id: 'log',       icon: BookOpen,        label: "Today's Log"  },
  { id: 'timer',     icon: Timer,           label: 'Focus Timer'  },
  { id: 'insights',  icon: Brain,           label: 'AI Insights'  },
];

export default function Shell({ user, onLogout, page, setPage, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      {/* Sidebar */}
      <aside style={{
        width: 218, background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        padding: '22px 10px', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', marginBottom: 28 }}>
          <div style={{ width: 30, height: 30, background: C.accent, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="#07070A" fill="#07070A" />
          </div>
          <span className="f-serif" style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Momentum by Yoshi</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ id, icon: Icon, label }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 10,
                  background: active ? C.accentDim : 'transparent',
                  color: active ? C.accent : C.textMuted,
                  fontSize: 13, fontWeight: active ? 500 : 400,
                  textAlign: 'left', border: 'none',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#0F0F14'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={15} /> {label}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 12px' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: C.accentDim, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: C.accent,
            }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: C.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>
          <Btn variant="ghost" size="sm" onClick={onLogout} style={{ width: '100%', justifyContent: 'flex-start', gap: 8 }}>
            <LogOut size={13} /> Sign Out
          </Btn>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '34px 36px' }}>
        {children}
      </main>
    </div>
  );
}