// FAJL: src/ux/V10LicenseGenerator.jsx
import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { FileText } from 'lucide-react';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', color: '#333333' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: 20, marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#ea580c', letterSpacing: 1 },
  invoiceMeta: { fontSize: 10, textAlign: 'right', color: '#555555', lineHeight: 1.5 },
  
  detailsWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  detailsCol: { width: '48%' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#888888', marginBottom: 8, letterSpacing: 1 },
  detailText: { fontSize: 11, lineHeight: 1.6, color: '#333333' },
  detailBold: { fontSize: 11, fontWeight: 'bold', lineHeight: 1.6, color: '#000000' },

  table: { width: '100%', marginBottom: 30 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderBottom: '1px solid #eeeeee', padding: 8 },
  thDesc: { width: '70%', fontSize: 10, fontWeight: 'bold', color: '#555555' },
  thQty: { width: '15%', fontSize: 10, fontWeight: 'bold', textAlign: 'center', color: '#555555' },
  thTotal: { width: '15%', fontSize: 10, fontWeight: 'bold', textAlign: 'right', color: '#555555' },
  tableRow: { flexDirection: 'row', padding: 12, borderBottom: '1px solid #eeeeee' },
  tdDesc: { width: '70%', fontSize: 10, fontWeight: 'bold', color: '#111' },
  tdQty: { width: '15%', fontSize: 11, textAlign: 'center' },
  tdTotal: { width: '15%', fontSize: 11, fontWeight: 'bold', textAlign: 'right' },

  totalBox: { borderTop: '2px solid #000000', paddingTop: 15, alignItems: 'flex-end', marginBottom: 30 },
  totalDue: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
  
  statusBox: { padding: 15, backgroundColor: '#fdfdfd', borderLeft: '4px solid #16a34a' },
  statusTitle: { fontSize: 14, fontWeight: 'bold', color: '#16a34a', marginBottom: 4 },
  statusNote: { fontSize: 9, color: '#666666' },
  
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', borderTop: '1px solid #eeeeee', paddingTop: 15 },
  footerText: { fontSize: 9, color: '#999999' },

  contractTitle: { fontSize: 18, fontWeight: 'bold', color: '#ea580c', marginBottom: 5 },
  contractSubTitle: { fontSize: 10, fontWeight: 'bold', color: '#111111', marginBottom: 20 },
  warningBox: { backgroundColor: '#fff5f5', padding: 15, borderLeft: '3px solid #ef4444', marginBottom: 15 },
  warningTitle: { fontSize: 9, fontWeight: 'bold', color: '#ef4444', marginBottom: 5 },
  contractText: { fontSize: 10, lineHeight: 1.5, color: '#444444', marginBottom: 10 },
  contractBold: { fontWeight: 'bold', color: '#111111' },
  sectionHead: { fontSize: 11, fontWeight: 'bold', color: '#111111', marginTop: 15, marginBottom: 5 },
  assetItem: { fontSize: 10, color: '#ea580c', fontWeight: 'bold', marginBottom: 4, paddingLeft: 10 },
  trackingHashBox: { backgroundColor: '#111', color: '#ea580c', padding: 6, fontSize: 12, fontWeight: 'bold', textAlign: 'center', letterSpacing: 2, marginVertical: 8 }
});

const V10LicenseDocument = ({ clientEmail, companyName, packageName, price, date, invoiceNum, selectedProjects, licenseKey }) => {
  
  let licenseType = "PERSONAL LICENSE";
  let licenseDesc = "This license is intended exclusively for students, independent designers, and hobbyists for non-commercial purposes.";
  let permitted = "Use of the files for personal concepts, practice, education, and presentation in a personal portfolio (e.g., Behance, Dribbble, personal website).";
  let prohibited = "Any commercial use. It is strictly forbidden to use these files on websites, applications, or in menus that are billed to a client or generate any financial profit.";

  if (packageName === "B2B RETAINER" || packageName === "CINEMATIC PITCH") {
    licenseType = "COMMERCIAL AGENCY LICENSE";
    licenseDesc = "A standard B2B license intended for professional designers, freelancers, and web agencies.";
    permitted = "Integration of V10 MASTERWORK files into one (1) commercial client project (e.g., developing a premium website or restaurant application billed to a client). The license covers the work of up to three (3) team members within your agency.";
    prohibited = "Multiple resales or using the same V10 design for several different clients. Distribution or resale of the original, unmodified V10 files and PSD templates to third parties on stock platforms.";
  } else if (packageName === "V10 MASTER VAULT") {
    licenseType = "ENTERPRISE / MASTER LICENSE";
    licenseDesc = "The highest tier license, intended for large agencies, corporations, and SaaS platforms requiring maximum flexibility and legal security.";
    permitted = "Unlimited use of all files from the package across an unlimited number of commercial client projects. Integration of visuals into internal software, SaaS platforms, and global marketing campaigns is allowed. The license covers an unlimited number of \"seats\" (access for all employees within your company).";
    prohibited = "The only restriction is a strict ban on the direct, raw resale of the source V10 files as a competing \"Stock\" package. The materials must be used as part of a broader design or software solution.";
  }

  return (
    <Document>
      {/* STRANICA 1: INVOICE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View><Text style={styles.headerTitle}>INVOICE</Text></View>
          <View style={styles.invoiceMeta}>
            <Text>Invoice Number: {invoiceNum}</Text>
            <Text>Date of Issue: {date}</Text>
            {/* 🔥 PRIKAZ KLJUČA NA FAKTURI 🔥 */}
            <Text style={{ marginTop: 5, color: '#ea580c', fontWeight: 'bold' }}>Tracking Hash: {licenseKey}</Text>
          </View>
        </View>

        <View style={styles.detailsWrapper}>
          <View style={styles.detailsCol}>
            <Text style={styles.sectionTitle}>FROM (ISSUER):</Text>
            <Text style={styles.detailBold}>Goran Damnjanovic</Text>
            <Text style={styles.detailText}>Vucka Milicevica 117</Text>
            <Text style={styles.detailText}>11306 Grocka, Serbia</Text>
            <Text style={styles.detailText}>National ID: 0911972710000</Text>
          </View>
          <View style={[styles.detailsCol, { alignItems: 'flex-end', textAlign: 'right' }]}>
            <Text style={styles.sectionTitle}>BILL TO (CLIENT):</Text>
            <Text style={styles.detailBold}>{companyName}</Text>
            <Text style={styles.detailText}>{clientEmail}</Text>
            <Text style={styles.detailText}>Digital Delivery</Text>
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text style={styles.sectionTitle}>PACKAGE ACTIVE:</Text>
          <Text style={[styles.detailBold, { color: '#ea580c', fontSize: 14 }]}>{packageName}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Description of Secured Assets</Text>
            <Text style={styles.thQty}>Quantity</Text>
            <Text style={styles.thTotal}>Total</Text>
          </View>
          
          {selectedProjects && selectedProjects.length > 0 ? (
            selectedProjects.map((proj, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tdDesc}>{idx + 1}. V10 Master Asset: {proj.title}</Text>
                <Text style={styles.tdQty}>1</Text>
                <Text style={styles.tdTotal}>Included</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tdDesc}>V10 Master Vault Complete Archive Access</Text>
              <Text style={styles.tdQty}>1</Text>
              <Text style={styles.tdTotal}>Included</Text>
            </View>
          )}
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalDue}>TOTAL DUE: ${price}</Text>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>SECURED & LICENSED</Text>
          <Text style={styles.statusNote}>(Note: Payment settled via secure gateway. Exact Timestamp: {date})</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>This document is generated electronically and is valid without a physical signature or stamp.</Text>
        </View>
      </Page>

      {/* STRANICA 2: EULA UGOVOR */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.contractTitle}>V10 MASTERWORK</Text>
        <Text style={styles.contractSubTitle}>OFFICIAL END USER LICENSE AGREEMENT (EULA)</Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>CRITICAL NOTICE REGARDING COPYRIGHT PROTECTION AND ASSET TRACKING</Text>
          <Text style={styles.contractText}>
            All graphic files within this package (including 150MP renders and master PSD files) contain a permanently integrated, encrypted digital footprint.
          </Text>
          
          {/* 🔥 HASH TRACKING PSIHOLOŠKI EFEKAT 🔥 */}
          <View style={styles.trackingHashBox}>
            <Text>[ SYSTEM HASH: {licenseKey} ]</Text>
          </View>

          <Text style={styles.contractText}>
            The unique cryptographic identifier displayed above has been permanently embedded into the EXIF/IPTC metadata of all files listed below. <Text style={styles.contractBold}>V10 MASTERWORK</Text> utilizes advanced Reverse Image Tracking software calibrated to this exact hash. If files containing this digital footprint are detected in use by unauthorized third-party agencies, both the hosting provider and the registered entity (<Text style={styles.contractBold}>{companyName}</Text>) will be held legally and financially liable.
          </Text>
        </View>

        <Text style={[styles.sectionHead, { color: '#ea580c', fontSize: 12 }]}>{licenseType}</Text>
        <Text style={styles.contractText}>{licenseDesc}</Text>

        <Text style={[styles.sectionHead, { marginTop: 10, color: '#16a34a' }]}>• COVERED DIGITAL ASSETS:</Text>
        <Text style={styles.contractText}>This license strictly applies ONLY to the following downloaded files:</Text>
        <View style={{ marginBottom: 15, marginTop: 5, padding: 10, backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
          {selectedProjects && selectedProjects.length > 0 ? (
            selectedProjects.map((proj, idx) => (
              <Text key={idx} style={styles.assetItem}>- {proj.title} (Master PSD & ZIP)</Text>
            ))
          ) : (
            <Text style={styles.assetItem}>- Entire V10 Master Vault Collection</Text>
          )}
        </View>

        <Text style={styles.sectionHead}>• Permitted Use:</Text>
        <Text style={styles.contractText}>{permitted}</Text>

        <Text style={styles.sectionHead}>• Prohibited Use:</Text>
        <Text style={styles.contractText}>{prohibited}</Text>

        <View style={[styles.statusBox, { marginTop: 20, borderLeftColor: '#ea580c' }]}>
          <Text style={styles.contractText}>
            By purchasing and downloading this V10 MASTERWORK package, you automatically agree to all the above-mentioned terms and legal consequences in the event of a license violation.
          </Text>
          <Text style={[styles.contractText, { marginTop: 10, fontWeight: 'bold' }]}>License Granted to: {companyName} ({clientEmail})</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>AI TOOLS PRO SMART / V10 ENGINE</Text>
        </View>
      </Page>
    </Document>
  );
};

const V10LicenseGenerator = ({ clientEmail, companyName, packageName, price = 0, selectedProjects = [] }) => {
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const safeCompany = companyName || "Independent Professional";
  
  // 🔥 ZAKLJUČANO: Generiše se samo JEDNOM po sesiji 🔥
  const invoiceNum = useMemo(() => `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`, []);

  // 🔥 ZAKLJUČANO: Hash ostaje isti bez obzira na re-render 🔥
  const licenseKey = useMemo(() => {
    const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `V10-TRK-${segment()}-${segment()}-${segment()}-${segment()}`;
  }, []);

  return (
    <PDFDownloadLink 
      document={<V10LicenseDocument clientEmail={clientEmail} companyName={safeCompany} packageName={packageName} price={price} date={currentDate} invoiceNum={invoiceNum} selectedProjects={selectedProjects} licenseKey={licenseKey} />}
      fileName={`V10_Invoice_License_${safeCompany.replace(/\s+/g, '_')}.pdf`}
      className="w-full bg-zinc-900 hover:bg-[#ff6a00] text-zinc-300 hover:text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-[#ff6a00] group mt-4 cursor-pointer shadow-xl"
    >
      {({ loading }) => (
        loading ? (
          <>Generating Secure PDF...</>
        ) : (
          <><FileText className="w-5 h-5" /> Download Invoice & License</>
        )
      )}
    </PDFDownloadLink>
  );
};

export default V10LicenseGenerator;