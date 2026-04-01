import { useState } from 'react';
import { Zap } from 'lucide-react';
import { C } from './tokens';
import { Btn, Card } from './Primitives';

export default function Auth({ mode: init, onLogin, onBack }) {
  const [mode, setMode] = useState(init);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please fill all required fields.'); return; }
    if (mode === 'signup' && !form.name) { setError('Please enter your name.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    onLogin({ name: form.name || form.email.split('@')[0], email: form.email });
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="fade">
        <button
          onClick={onBack}
          style={{ background: 'none', color: C.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, padding: 0 }}
        >
          ← Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 50, height: 50, background: C.accent, borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Zap size={26} color="#07070A" fill="#07070A" />
          </div>
          <h2 className="f-serif" style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: 13, color: C.textMuted }}>
            {mode === 'signup' ? 'Start building momentum with Yoshi today.' : 'Continue your journey.'}
          </p>
        </div>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, fontWeight: 500 }}>NAME</label>
                <input placeholder="Your name" value={form.name} onChange={up('name')} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, fontWeight: 500 }}>EMAIL</label>
              <input type="email" placeholder="you@email.com" value={form.email} onChange={up('email')} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.textMuted, display: 'block', marginBottom: 6, fontWeight: 500 }}>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={up('password')}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </div>
            {error && <p style={{ fontSize: 12, color: C.danger }}>{error}</p>}
            <Btn size="lg" onClick={submit} style={{ width: '100%', marginTop: 4 }}>
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </Btn>
          </div>
        </Card>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.textMuted, marginTop: 18 }}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            style={{ background: 'none', color: C.accent, fontWeight: 500, fontSize: 13, padding: 0 }}
          >
            {mode === 'signup' ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}