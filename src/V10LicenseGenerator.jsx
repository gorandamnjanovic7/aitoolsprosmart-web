// FAJL: V10LicenseGenerator.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, FileText } from 'lucide-react';

// POČETAK FUNKCIJE: PDF Stilovi
const styles = StyleSheet.create({
  page: { backgroundColor: '#0a0a0a', padding: 40, color: '#e4e4e7', fontFamily: 'Helvetica' },
  headerBox: { borderBottom: '1px solid #ff6a00', paddingBottom: 20, marginBottom: 20 },
  title: { fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginBottom: 5 },
  subTitle: { fontSize: 10, color: '#ff6a00', letterSpacing: 2 },
  stampBox: { border: '2px dashed #ff6a00', padding: 15, marginBottom: 20, backgroundColor: '#110500' },
  stampLabel: { fontSize: 8, color: '#ff6a00', marginBottom: 4, letterSpacing: 1 },
  stampValue: { fontSize: 14, color: '#ffffff', fontWeight: 'bold', marginBottom: 8 },
  sectionTitle: { fontSize: 12, color: '#ff6a00', fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  paragraph: { fontSize: 10, lineHeight: 1.5, color: '#a1a1aa', marginBottom: 10 },
  boldText: { color: '#ffffff', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, borderTop: '1px solid #3f3f46', paddingTop: 10 },
  footerText: { fontSize: 8, color: '#71717a', textAlign: 'center', lineHeight: 1.4 },
});
// KRAJ FUNKCIJE: PDF Stilovi

// POČETAK FUNKCIJE: V10LicenseDocument (Sama PDF struktura)
const V10LicenseDocument = ({ clientEmail, companyName, packageName, date }) => {
  
  const EULA_INTRO = "IMPORTANT NOTICE REGARDING COPYRIGHT PROTECTION AND TRACKING: All graphic files within this package (including 150MP renders and originals) contain a permanently integrated, encrypted digital footprint and proprietary IPTC/EXIF metadata. This data does not affect the visual quality of the image but is permanently embedded into the file's code.";
  const TRACKING_WARNING = "V10 MASTERWORK utilizes advanced Reverse Image Tracking software to continuously monitor the use of these visuals across the internet. Any use of the files that exceeds the scope of your purchased license will be automatically detected. Violation of these terms will result in an immediate DMCA takedown notice against the website hosting the material, as well as the direct issuance of an Enterprise License invoice to your agency or your client.";
  
  let licenseTitle = "PERSONAL LICENSE";
  let licensePermitted = "Use of the files for personal concepts, practice, education, and presentation in a personal portfolio (e.g., Behance, Dribbble, personal website).";
  let licenseProhibited = "Any commercial use. It is strictly forbidden to use these files on websites, applications, or in menus that are billed to a client or generate any financial profit.";

  if (packageName === "B2B RETAINER" || packageName === "CINEMATIC PITCH") {
    licenseTitle = "COMMERCIAL AGENCY LICENSE";
    licensePermitted = "Integration of V10 MASTERWORK files into one (1) commercial client project (e.g., developing a premium website or restaurant application billed to a client). The license covers the work of up to three (3) team members within your agency.";
    licenseProhibited = "Multiple resales or using the same V10 design for several different clients. Distribution or resale of the original, unmodified V10 files and PSD templates to third parties on stock platforms.";
  } else if (packageName === "V10 MASTER VAULT") {
    licenseTitle = "ENTERPRISE / MASTER LICENSE";
    licensePermitted = "Unlimited use of all files from the package across an unlimited number of commercial client projects. Integration of visuals into internal software, SaaS platforms, and global marketing campaigns is allowed. The license covers an unlimited number of 'seats' (access for all employees within your company).";
    licenseProhibited = "The only restriction is a strict ban on the direct, raw resale of the source V10 files as a competing 'Stock' package. The materials must be used as part of a broader design or software solution.";
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>V10 MASTERWORK</Text>
          <Text style={styles.subTitle}>OFFICIAL END USER LICENSE AGREEMENT (EULA)</Text>
        </View>

        <View style={styles.stampBox}>
          <Text style={styles.stampLabel}>AUTHORIZED ENTITY (LICENSE HOLDER):</Text>
          <Text style={styles.stampValue}>{companyName.toUpperCase()}</Text>
          <Text style={styles.stampLabel}>REGISTERED EMAIL:</Text>
          <Text style={styles.stampValue}>{clientEmail}</Text>
          <Text style={styles.stampLabel}>PACKAGE TIER:</Text>
          <Text style={styles.stampValue}>{packageName}</Text>
          <Text style={styles.stampLabel}>ISSUANCE DATE:</Text>
          <Text style={styles.stampValue}>{date}</Text>
          
          <Text style={{...styles.paragraph, color: '#ef4444', marginTop: 10, fontSize: 9}}>
            This license is granted EXCLUSIVELY to {companyName}. Any transfer, sharing, or reselling of this license to a third-party is strictly prohibited and legally void.
          </Text>
        </View>

        <Text style={styles.paragraph}>{EULA_INTRO}</Text>
        <Text style={styles.paragraph}>{TRACKING_WARNING}</Text>

        <Text style={styles.sectionTitle}>{licenseTitle}</Text>
        <Text style={styles.paragraph}><Text style={styles.boldText}>• Permitted: </Text>{licensePermitted}</Text>
        <Text style={styles.paragraph}><Text style={styles.boldText}>• Prohibited: </Text>{licenseProhibited}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By purchasing and downloading this V10 MASTERWORK package, you automatically agree to all the above-mentioned terms and legal consequences in the event of a license violation.
          </Text>
          <Text style={{...styles.footerText, marginTop: 5, color: '#ff6a00'}}>
            AI TOOLS PRO SMART / V10 ENGINE
          </Text>
        </View>
      </Page>
    </Document>
  );
};
// KRAJ FUNKCIJE: V10LicenseDocument

// POČETAK FUNKCIJE: V10LicenseGenerator (Dugme za React aplikaciju)
const V10LicenseGenerator = ({ clientEmail, companyName, packageName }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const safeCompany = companyName || "Independent Professional";

  return (
    <PDFDownloadLink 
      document={<V10LicenseDocument clientEmail={clientEmail} companyName={safeCompany} packageName={packageName} date={currentDate} />}
      fileName={`V10_License_${safeCompany.replace(/\s+/g, '_')}.pdf`}
      className="w-full bg-zinc-900 hover:bg-[#ff6a00] text-zinc-300 hover:text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-[#ff6a00] group mt-4 cursor-pointer shadow-xl"
    >
      {({ loading }) => (
        loading ? (
          <>Generating Secure PDF...</>
        ) : (
          <><FileText className="w-5 h-5" /> Download License & Invoice</>
        )
      )}
    </PDFDownloadLink>
  );
};
// KRAJ FUNKCIJE: V10LicenseGenerator

export default V10LicenseGenerator;