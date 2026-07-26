exports.handler = async (event, context) => {
  // CSP izveštaji se uvek šalju kao POST zahtevi
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Hvatamo izveštaj koji je pretraživač poslao
    const cspReport = JSON.parse(event.body);
    
    // Ispisujemo ga u Netlify konzolu sa lepo formatiranim razmacima
    console.log("🚨 [CSP RADAR POGODAK]:", JSON.stringify(cspReport, null, 2));

    // Vraćamo status 204 (No Content) što pretraživaču znači "Izveštaj uspešno primljen"
    return { statusCode: 204, body: '' };
  } catch (error) {
    console.error("Greška pri čitanju CSP izveštaja:", error);
    return { statusCode: 400, body: 'Bad Request' };
  }
};