// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────

export const genId = () => Math.random().toString(36).slice(2, 10);

export const todayStr = () => new Date().toISOString().split('T')[0];

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const timeNow = () =>
  new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
};