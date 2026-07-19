import { useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';

export const usePurchaseMonitor = (triggerModal) => {
  useEffect(() => {
    // Slušamo nove Payoneer zahteve
    const q = query(
      collection(db, "v8_payoneer_requests"), 
      orderBy("requestDate", "desc"), 
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // Play sound
          const audio = new Audio('/sounds/notification-ping.mp3');
          audio.play().catch(e => console.log("Audio blocked by browser"));
          
          // Trigger visual modal
          triggerModal({
            title: "NOVA B2B UPLATA",
            message: "Novi zahtev je stigao u Payoneer Command Center!"
          });
        }
      });
    });

    return () => unsubscribe();
  }, [triggerModal]);
};