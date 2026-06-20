// POČETAK FAJLA: V8PayoneerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Zap, Clock, CheckCircle, Send, DollarSign, User, ShieldAlert, Mail, FileText } from 'lucide-react';

const V8PayoneerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // POČETAK FUNKCIJE: Učitavanje podataka u realnom vremenu
  useEffect(() => {
    // 🔧 ISPRAVKA: Ovde sada tražimo 'requestDate' kako je upisano u Firebase bazi
    const q = query(collection(db, "v8_payoneer_requests"), orderBy("requestDate", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // KRAJ FUNKCIJE: Učitavanje podataka u realnom vremenu

  // POČETAK FUNKCIJE: Promena statusa
  const updateStatus = async (id, newStatus) => {
    try {
      const requestRef = doc(db, "v8_payoneer_requests", id);
      await updateDoc(requestRef, {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Greška pri ažuriranju statusa!");
    }
  };
  // KRAJ FUNKCIJE: Promena statusa

  // POČETAK FUNKCIJE: Generisanje V8 PDF Fakture i Ugovora
  const handleGenerateInvoice = (saleData) => {
    const invoiceNum = `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`; 
    
    let dateObj = new Date();
    // 🔧 ISPRAVKA: Gledamo requestDate prvo
    if (saleData.requestDate?.toDate) dateObj = saleData.requestDate.toDate();
    else if (saleData.timestamp?.toDate) dateObj = saleData.timestamp.toDate();
    
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const clientName = saleData.firstName + ' ' + (saleData.lastName || '') || 'Valued Client';
    const clientEmail = saleData.clientEmail || 'N/A';
    const clientCountry = saleData.country || 'N/A';
    const productName = saleData.productName || 'V8 Master License';
    
    let finalPrice = saleData.price || "0";

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice & Contract - ${invoiceNum}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; margin: 0; background: #fff; }
          .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #ddd; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); font-size: 16px; line-height: 24px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header-left { display: flex; align-items: center; gap: 20px; }
          .logo-img { width: 80px; height: 80px; object-fit: contain; border-radius: 10px; }
          .header h1 { margin: 0; color: #ea580c; font-size: 42px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
          .details-wrapper { display: flex; justify-content: space-between; margin-bottom: 50px; }
          .details-col { width: 48%; }
          .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 10px; display: block; }
          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 40px; }
          table th, table td { padding: 15px; border-bottom: 1px solid #eee; }
          table th { background: #f9f9f9; font-weight: bold; text-transform: uppercase; font-size: 13px; color: #555; }
          table td.bold-col { font-weight: bold; }
          .total-box { text-align: right; border-top: 2px solid #000; padding-top: 20px; margin-top: 20px; }
          .total-box .due { font-size: 24px; font-weight: 900; }
          .payment-status { margin-top: 40px; padding: 20px; background: #fdfdfd; border-left: 4px solid #16a34a; }
          .status-badge { color: #16a34a; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
          
          /* Contract Styles */
          .contract-box { page-break-before: always; max-width: 800px; margin: auto; padding: 40px; font-size: 13px; line-height: 1.6; color: #444; }
          .contract-title { color: #ea580c; text-transform: uppercase; font-size: 24px; margin-bottom: 10px; font-weight: 900; }
          .contract-meta { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; font-size: 12px; color: #666; }
          .contract-section { margin-bottom: 20px; }
          .contract-section h3 { font-size: 14px; text-transform: uppercase; color: #111; margin-bottom: 8px; }
          .contract-section ul { margin-top: 5px; padding-left: 20px; }
          .contract-section li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        
        <div class="invoice-box">
          <div class="header">
            <div class="header-left">
               <img src="/logo.png" alt="V8 Vault Logo" class="logo-img" onerror="this.style.display='none'; document.getElementById('fallback-logo').style.display='flex';" />
               <div id="fallback-logo" style="display: none; background-color: #ea580c; color: #fff; width: 80px; height: 80px; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; border-radius: 12px; letter-spacing: 2px;">V8</div>
               <h1>INVOICE</h1>
            </div>
            <div style="text-align: right;">
              <strong>Invoice Number:</strong> ${invoiceNum}<br>
              <strong>Date of Issue:</strong> ${formattedDate}
            </div>
          </div>

          <div class="details-wrapper">
            <div class="details-col">
              <span class="section-title">FROM (Issuer):</span>
              <strong>Goran Damnjanovic</strong><br>
              Vucka Milicevica 117<br>
              11306 Grocka, Serbia<br>
              National ID (JMBG): 0911972710000
            </div>
            <div class="details-col" style="text-align: right;">
              <span class="section-title">BILL TO (Client):</span>
              <strong>${clientName}</strong><br>
              ${clientEmail}<br>
              ${clientCountry}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description of Services</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="bold-col">${productName} - Web Development & Digital Asset Engineering</td>
                <td style="text-align: center;">1</td>
                <td style="text-align: right; font-weight: bold;">$${finalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="due">TOTAL DUE: $${finalPrice}</div>
          </div>

          <div class="payment-status">
            <span class="status-badge">PAID IN FULL</span>
            <small style="color: #666;">(Note: Payment settled via international secure B2B gateway. Wire transfer to IBAN).</small>
          </div>
        </div>

        <div class="contract-box">
          <h2 class="contract-title">V8 Masterwork License Agreement</h2>
          
          <div class="contract-meta">
            <strong>Version:</strong> 1.0 &nbsp;|&nbsp; 
            <strong>Date:</strong> June 10, 2026 &nbsp;|&nbsp; 
            <strong>Author/Seller:</strong> Goran Damnjanović (https://aitoolsprosmart.com)<br><br>
            This document is a legally binding agreement between you (User/Buyer) and the author (Goran Damnjanovic). By purchasing and downloading digital assets from the V8 Masterwork collection, you agree to the following terms:
          </div>

          <div class="contract-section">
            <h3>1. LICENSE SUBJECT</h3>
            <p>V8 Vault grants you a non-exclusive, lifetime, global right to use the purchased digital assets in accordance with the terms outlined in this document.</p>
          </div>

          <div class="contract-section">
            <h3>2. PERMITTED USE</h3>
            <p>As an authorized user, you are entitled to use the assets for:</p>
            <ul>
              <li><strong>Commercial Marketing Campaigns:</strong> Use in advertisements, social media, websites, and digital ads.</li>
              <li><strong>Content Production:</strong> Inclusion in video production, films, presentations, and edited materials.</li>
              <li><strong>Print Materials:</strong> Use in catalogs, brochures, billboards, and other marketing collateral.</li>
              <li><strong>Modifications:</strong> You have the right to modify, crop, color grade, or adapt the assets to your needs, provided the final product remains professional.</li>
            </ul>
          </div>

          <div class="contract-section">
            <h3>3. PROHIBITED USE</h3>
            <p>Strictly prohibited:</p>
            <ul>
              <li><strong>Resale and Distribution:</strong> Selling, licensing, sharing, or distributing original files (or slightly modified versions) as "stock" assets or separate digital products is prohibited.</li>
              <li><strong>AI Model Training:</strong> Using these assets to train other AI models or for machine learning is prohibited.</li>
              <li><strong>Unregistered Use:</strong> Any use outside the scope of this license without explicit written permission is a violation of copyright.</li>
            </ul>
          </div>

          <div class="contract-section">
            <h3>4. OWNERSHIP AND COPYRIGHT</h3>
            <p>All copyright, intellectual property, and ownership of the original digital assets remain exclusively with the author (Goran Damnjanovic). This purchase does not transfer ownership of copyright, only the right to use.</p>
          </div>

          <div class="contract-section">
            <h3>5. LIABILITY AND WARRANTY</h3>
            <p>Digital assets are provided "as is". V8 Vault makes no warranties regarding specific fitness for a particular purpose. The author is not liable for any direct or indirect damage resulting from the use of these assets.</p>
          </div>

          <div class="contract-section">
            <h3>6. VALIDITY</h3>
            <p>This license is perpetual (lifetime) for the buyer who has duly paid the license fee. In case of breach of any clause, the license is automatically terminated without refund.</p>
          </div>

          <div class="contract-section" style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Support:</strong> For additional questions or corporate inquiries, contact:<br>
            Email: aitoolsprosmart@gmail.com / info@aitoolsprosmart.com<br>
            Platform: aitoolsprosmart.com</p>
          </div>

        </div>

        <script>
          window.onload = function() {
             setTimeout(function() {
                window.print();
             }, 500);
             window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };
  // KRAJ FUNKCIJE: Generisanje V8 PDF Fakture i Ugovora

  // POČETAK FUNKCIJE: Pomoćne funkcije za formatiranje datuma i statusa
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now'; 
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date)) return 'N/A';

    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'invoice_sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };
  // KRAJ FUNKCIJE: Pomoćne funkcije

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SEKCIJA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
              <ShieldAlert className="text-orange-500 w-8 h-8" />
              Payoneer <span className="text-orange-500">Command Center</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">
              Secure Manual Invoicing & License Management
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg px-6 py-3 text-center">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Requests</div>
              <div className="text-2xl font-black text-white">{requests.length}</div>
            </div>
            <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-lg px-6 py-3 text-center shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">Pending</div>
              <div className="text-2xl font-black text-white">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>

        {/* TABELA / LISTA ZAHTEVA */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-10 text-center text-orange-500 font-black uppercase tracking-widest animate-pulse">
              Loading Secure Data...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">
              No Payoneer requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 font-black uppercase tracking-widest">
                    <th className="p-5">Client details</th>
                    <th className="p-5">Package / Price</th>
                    <th className="p-5">Time requested</th>
                    <th className="p-5">Current Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* CLIENT INFO */}
                      <td className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mt-1">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{req.firstName} {req.lastName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Mail size={12} /> {req.clientEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PACKAGE INFO */}
                      <td className="p-5">
                        <div className="font-black text-sm text-gray-200 uppercase tracking-wide">
                          {req.productName}
                        </div>
                        <div className="text-orange-500 font-black flex items-center gap-1 mt-1">
                          <DollarSign size={14} /> {req.price}
                        </div>
                      </td>

                      {/* TIMESTAMP */}
                      <td className="p-5 text-sm text-gray-400 font-medium">
                        {/* 🔧 ISPRAVKA: Ovde prikazujemo requestDate */}
                        {formatDate(req.requestDate || req.timestamp)}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                          {req.status === 'pending' && <Clock size={12} />}
                          {req.status === 'invoice_sent' && <Send size={12} />}
                          {req.status === 'paid' && <CheckCircle size={12} />}
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          {/* PAID Dugmad (Samo kada nije Paid) */}
                          {req.status === 'pending' && (
                            <button 
                              onClick={() => updateStatus(req.id, 'invoice_sent')}
                              className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                              title="Mark as Invoice Sent"
                            >
                              Mark Sent
                            </button>
                          )}
                          
                          {(req.status === 'pending' || req.status === 'invoice_sent') && (
                            <button 
                              onClick={() => updateStatus(req.id, 'paid')}
                              className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1"
                              title="Mark as Paid & Approve"
                            >
                              <Zap size={12} /> Mark Paid
                            </button>
                          )}

                          {/* 🔥 INVOICE DUGME (Samo kada je status PAID) 🔥 */}
                          {req.status === 'paid' && (
                            <button 
                              onClick={() => handleGenerateInvoice(req)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              title="Generate PDF Invoice"
                            >
                              <FileText size={12} /> PDF INVOICE
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default V8PayoneerDashboard;
// KRAJ FAJLA: V8PayoneerDashboard.jsx