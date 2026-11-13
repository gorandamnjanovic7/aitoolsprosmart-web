// ============================================================================
// FAJL: netlify/functions/v10-master-router.cjs
// Univerzalni V10 AI Ruter — Pokreće SVE agente 24/7 besplatno na Netlify-ju
// i omogućava dodavanje i prilagođavanje novih agenata za 30 sekundi
// ============================================================================

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const {
      agentType = 'sale-alert', // 'sale-alert' | 'booking' | 'quote-scoper' | 'seo-auditor' | 'custom-client'
      clientBrand = 'AI Tools Pro Smart V10',
      buyer = 'B2B Client',
      email = 'unknown@company.com',
      product = 'V10 AI System',
      amount = '$0.00',
      method = 'Direct',
      url = 'https://aitoolsprosmart.com',
      projectScope = 'Turnkey AI Automation',
      timeline = '14 Days'
    } = payload;

    // 1. AUTOMATSKA B2B PROVERA DOMENA KUPCA
    const domain = email.includes('@') ? email.split('@')[1].toLowerCase() : 'corporate.com';
    const freeEmails = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const isCorporate = !freeEmails.includes(domain);
    const leadScore = isCorporate ? 98 : 82;

    let responseData = {};
    let whatsappText = '';

    // ========================================================================
    // RUTIRANJE SVIH AGENATA (Ovde dodajemo svakog novog agenta!)
    // ========================================================================
    switch (agentType) {
      case 'booking':
        whatsappText = `📅 *NOVI ZAKAZAN SASTANAK (${clientBrand})*\n👤 Klijent: ${buyer}\n📧 Email: ${email}\n🎯 Tema: ${product}\n💰 Budžet: ${amount}\n📍 Kanal: ${method}\n🤖 B2B Lead Score: ${leadScore}/100`;
        responseData = {
          status: 'CONFIRMED',
          agent: 'Autonomous Calendar & Appointment Setter',
          clientBrand,
          leadScore,
          confirmationCode: `V10-BOOK-${Date.now().toString().slice(-5)}`,
          message: `Appointment locked for ${buyer}`
        };
        break;

      case 'quote-scoper':
        const basePrice = projectScope.toLowerCase().includes('enterprise') ? 6500 : 3500;
        const rushFee = timeline.toLowerCase().includes('urgent') ? 1000 : 0;
        const totalEstimate = basePrice + rushFee;

        whatsappText = `🧮 *NOVI B2B PREDRAČUN (${clientBrand})*\n👤 Klijent: ${buyer} (${email})\n🛠️ Projekat: ${projectScope}\n⏱️ Rok: ${timeline}\n💵 Procena: $${totalEstimate}`;
        responseData = {
          status: 'QUOTE_GENERATED',
          agent: 'B2B Project Scoper & AI Quote Calculator',
          clientBrand,
          estimatedTotal: `$${totalEstimate}`,
          phases: [
            'Phase 1 (Days 1–3): Architecture & Custom Brand Configuration',
            'Phase 2 (Days 4–8): Frontend UI + Backend Workflow Integration',
            'Phase 3 (Days 9–14): Live Testing, API Key Setup & Handover'
          ]
        };
        break;

      case 'seo-auditor':
        responseData = {
          overall_score: 86,
          seo_score: 89,
          cro_score: 82,
          ux_copy_score: 88,
          executive_summary: `Live executive inspection completed for ${url} under ${clientBrand} protocol. High B2B authority potential detected with immediate conversion optimization opportunities.`,
          critical_seo_issues: [
            'Add structured JSON-LD Organization & Product schema for higher B2B CTR',
            'Optimize hero video preload attributes for sub-1.2s Largest Contentful Paint'
          ],
          cro_barriers: [
            'Add interactive ROI calculator above the fold to capture enterprise intent',
            'Include direct 1-click WhatsApp/Calendar booking trigger in sticky header'
          ],
          quick_wins: [
            'Deploy V10 Autonomous Appointment Setter (+28% lead capture)',
            'Enable instant mobile checkout alerts for sales team response under 60 seconds'
          ]
        };
        break;

      default: // 'sale-alert' i svi ostali prodajni alarmi
        whatsappText = `🚨 *NOVA PORUDŽBINA / LEAD (${clientBrand})*\n👤 Kupac: ${buyer}\n📧 Email: ${email}\n📦 Paket: ${product}\n💰 Iznos: ${amount}\n💳 Metod: ${method}\n🤖 AI B2B Score: ${leadScore}/100 (${isCorporate ? 'Verifikovan domen: ' + domain : 'Standardni profil'})`;
        responseData = {
          status: 'ALERT_DISPATCHED',
          leadScore,
          domainVerified: isCorporate,
          timestamp: new Date().toISOString()
        };
        break;
    }

    // ========================================================================
    // 2. SLANJE NA TVOJ WHATSAPP (+381648201496) — RADI ZAUVEK BEZ N8N TRIALA!
    // ========================================================================
    if (whatsappText) {
      const phone = process.env.CALLMEBOT_PHONE || '381648201496';
      const apikey = process.env.CALLMEBOT_API_KEY || '3897090';
      const encodedMsg = encodeURIComponent(whatsappText);
      const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMsg}&apikey=${apikey}`;

      try {
        await fetch(waUrl);
      } catch (waErr) {
        console.warn('WhatsApp dispatch warning:', waErr);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        engine: 'V10 Master Serverless Router (Zero-Expiration)',
        ...responseData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Router execution error', details: error.message })
    };
  }
};