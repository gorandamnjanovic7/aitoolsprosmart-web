export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};
// ============================================================================
// GOOGLE DRIVE LINKOVI ZA 150MP SAMPLE & ICC SPEC SHEET (AVIONI I JAHTE)
// ============================================================================
export const SAMPLE_LINKS = {
  // ✈️ JETS (2x 150MP slike + ICC Spec Sheet)
  aviation: 'https://drive.google.com/file/d/11RFyWjqgczESJuzpyje7hxrXHCvT_5o1/view?usp=sharing',
  aviationDirect: 'https://drive.google.com/uc?export=download&id=11RFyWjqgczESJuzpyje7hxrXHCvT_5o1',

  // 🛥️ YACHTS (2x 150MP slike + ICC Spec Sheet)
  yachts: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',
  yachtsDirect: 'https://drive.google.com/uc?export=download&id=1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp'
};

// ============================================================================
// INSTANT WHATSAPP SALE ALERT (+381648201496 preko n8n webhooka)
// ============================================================================
export const notifyWhatsAppSale = async ({
  buyer = 'B2B Client',
  email = 'Unknown',
  product = 'V10 Package',
  amount = '$0.00',
  method = 'Checkout'
}) => {
  try {
    await fetch('https://aitools-n8n.app.n8n.cloud/webhook/v10-sale-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'WhatsApp',
        buyer,
        email,
        product,
        amount: String(amount).startsWith('$') ? amount : `$${amount}`,
        method
      })
    });
  } catch (err) {
    console.warn('WhatsApp alert webhook skipped:', err);
  }
};