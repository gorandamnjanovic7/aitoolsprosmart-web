import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// POCETAK FUNKCIJE: AnalyticsTracker
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Proveravamo da li je gtag skripta iz index.html učitana
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // Šaljemo page_view event svaki put kada se URL promeni
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
      console.log(`GA4: Zabeležena poseta stranici -> ${location.pathname}`);
    }
  }, [location]); // useEffect se okida na svaku promenu lokacije

  return null; // Komponenta je nevidljiva u crno-narandžastom interfejsu
};
// KRAJ FUNKCIJE: AnalyticsTracker

export default AnalyticsTracker;