import { useState, useEffect } from 'react';
import { store } from './store';

import Landing    from './Landing';
import Auth       from './Auth';
import Shell      from './Shell';
import Dashboard  from './Dashboard';
import Goals      from './Goals';
import Log        from './Log';
import FocusTimer from './FocusTimer';
import Insights   from './Insights';

// Scenes: 'landing' | 'auth' | 'app'

export default function App() {
  const [scene,        setScene]        = useState('landing');
  const [authMode,     setAuthMode]     = useState('signup');
  const [user,         setUser]         = useState(null);
  const [appPage,      setAppPage]      = useState('dashboard');
  const [goals,        setGoals]        = useState([]);
  const [logs,         setLogs]         = useState({});
  const [activeGoalId, setActiveGoalId] = useState(null);

  // ── Rehydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    (async () => {
      const u  = await store.get('m_user');
      if (u)  { setUser(u); setScene('app'); }
      const g  = await store.get('m_goals');
      if (g)  setGoals(g);
      const l  = await store.get('m_logs');
      if (l)  setLogs(l);
      const ag = await store.get('m_activeg');
      if (ag) setActiveGoalId(ag);
    })();
  }, []);

  // ── Persist state changes ─────────────────────────────────────────────────
  useEffect(() => { if (user)        store.set('m_user',   user);        }, [user]);
  useEffect(() => {                  store.set('m_goals',  goals);       }, [goals]);
  useEffect(() => {                  store.set('m_logs',   logs);        }, [logs]);
  useEffect(() => { if (activeGoalId) store.set('m_activeg', activeGoalId); }, [activeGoalId]);

  // ── Auto-set active goal when goals list changes ──────────────────────────
  useEffect(() => {
    if (!activeGoalId && goals.length) setActiveGoalId(goals[0].id);
  }, [goals]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const login = (u) => {
    setUser(u);
    setScene('app');
    setAppPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setScene('landing');
    store.del('m_user');
  };

  // ── Goals proxy — ensures activeGoalId is always set after creation ───────
  const setGoalsProxy = (fn) => {
    setGoals((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      if (next.length > 0 && !activeGoalId) setActiveGoalId(next[0].id);
      return next;
    });
  };

  // ── Routing ───────────────────────────────────────────────────────────────
  if (scene === 'landing') {
    return <Landing onAuth={(m) => { setAuthMode(m); setScene('auth'); }} />;
  }

  if (scene === 'auth') {
    return <Auth mode={authMode} onLogin={login} onBack={() => setScene('landing')} />;
  }

  if (!user) return null;

  const PAGE = {
    dashboard: (
      <Dashboard
        user={user} goals={goals} logs={logs}
        setPage={setAppPage} setActiveGoalId={setActiveGoalId}
      />
    ),
    goals: (
      <Goals
        goals={goals} setGoals={setGoalsProxy}
        setActiveGoalId={setActiveGoalId} setPage={setAppPage}
      />
    ),
    log: (
      <Log
        goals={goals} logs={logs} setLogs={setLogs}
        activeGoalId={activeGoalId} setActiveGoalId={setActiveGoalId}
      />
    ),
    timer: (
      <FocusTimer activeGoalId={activeGoalId} goals={goals} setLogs={setLogs} />
    ),
    insights: (
      <Insights goals={goals} logs={logs} />
    ),
  };

  return (
    <Shell user={user} onLogout={logout} page={appPage} setPage={setAppPage}>
      {PAGE[appPage] ?? null}
    </Shell>
  );
}