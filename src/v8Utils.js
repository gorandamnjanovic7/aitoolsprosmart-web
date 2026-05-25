export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};