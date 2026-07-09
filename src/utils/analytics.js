// POCETAK FUNKCIJE: trackV8Action
export const trackV8Action = (actionName, details = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", actionName, details);
    console.log(`GA4 Event poslat: ${actionName}`, details);
  }
};
// KRAJ FUNKCIJE: trackV8Action