// ─── STORAGE HELPERS (localStorage) ──────────────────────────────────────────
// Replaces the Claude artifact window.storage API with standard localStorage.

export const store = {
  get: async (k) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },

  set: async (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },

  del: async (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};