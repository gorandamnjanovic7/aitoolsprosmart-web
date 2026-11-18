import os
import re
import zipfile

PAGES_CONFIG = [
    {
        "kit_id": "V10-PrivateAviationKit-Page1",
        "component_name": "PrivateAviationKit",
        "jsx_path": "src/pages/kits/aviation/PrivateAviationKit.jsx",
        "route_path": "/aviation-charter-kit"
    },
    {
        "kit_id": "V10-AeroPriveAtelier-Page2",
        "component_name": "AeroPriveAtelier",
        "jsx_path": "src/pages/kits/aviation/AeroPriveAtelier.jsx",
        "route_path": "/aviation-atelier-kit"
    },
    {
        "kit_id": "V10-CloudlinePrestige-Page3",
        "component_name": "CloudlinePrestige",
        "jsx_path": "src/pages/kits/aviation/CloudlinePrestige.jsx",
        "route_path": "/aviation-cloudline-kit"
    },
    {
        "kit_id": "V10-RunwayReserve-Page4",
        "component_name": "RunwayReserve",
        "jsx_path": "src/pages/kits/aviation/RunwayReserve.jsx",
        "route_path": "/aviation-runway-kit"
    },
    {
        "kit_id": "V10-SkyglassAviation-Page5",
        "component_name": "SkyglassAviation",
        "jsx_path": "src/pages/kits/aviation/SkyglassAviation.jsx",
        "route_path": "/aviation-skyglass-aviation"
    }
]

# Čista čarter sekcija koja u ZIP-u za kupca menja tvojih $349 / $1490 + Order Bump + Free Sample .TXT boks
CLEAN_CLIENT_CHARTER_SECTION = """<section id="commercial-pricing" className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#F3E5AB]">
              <Crown size={13} className="text-[#D4AF37]" /> BESPOKE FLIGHT PROGRAMS
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
              Command the sky on <br />
              your own schedule.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-300 sm:text-base">
              Choose between on-demand transoceanic charter or guaranteed fleet access through our Sovereign Annual Jet Card.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#0C0D12] p-8 shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-300">
                    ON-DEMAND BESPOKE CHARTER
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-stone-200">
                    GLOBAL DISPATCH
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">From $11,500</span>
                  <span className="text-xs font-bold uppercase text-stone-400">/ flight hour</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-stone-300">
                  Ideal for single transcontinental missions, diplomatic delegations, and bespoke family voyages with zero long-term commitment.
                </p>
                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-stone-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Aircraft positioned globally across 5,000+ private FBO terminals within 4–6 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Full 6-zone cabin access including dining salon & private aft stateroom</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Wing-side chauffeur transfer & 90-second biometric customs clearance</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <a
                  href="#ai-concierge"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl transition hover:bg-stone-200"
                >
                  Request Instant Route Quote
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-[#D4AF37]/65 bg-[#0C0D12] p-8 shadow-2xl shadow-[#D4AF37]/10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    SOVEREIGN 50-HOUR JET CARD
                  </span>
                  <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-black">
                    GUARANTEED AVAILABILITY
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-[#F3E5AB]">$475,000</span>
                  <span className="text-xs font-bold uppercase text-stone-400">/ 50 flight hours</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-stone-300">
                  Locked hourly rates, guaranteed peak-day aircraft availability, and dedicated flight crew assignment for principals and family offices.
                </p>
                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-stone-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>Guaranteed 3-hour call-out across North America, Europe & Middle East</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>Zero repositioning fees and complimentary empty-leg upgrades</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>Michelin-curated private dining & dedicated 24/7 Flight Director</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4">
                <a
                  href="#ai-concierge"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C59B27] py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl shadow-[#D4AF37]/20 transition hover:brightness-110"
                >
                  Schedule Membership Briefing
                </a>
              </div>
            </div>
          </div>
        </section>"""


def make_valid_buyer_jsx(jsx_code):
    """Izbacuje $349/$1490 sekciju sa slike, Firebase, Checkout i NEXT JET PAGE dugmad za kupca."""
    jsx_code = jsx_code.replace("\xa0", " ")
    jsx_code = re.sub(r"-\s*\{currentZone\.zone\}\s*\{currentZone\.resolution\}", "{currentZone.zone} • {currentZone.resolution}", jsx_code)
    jsx_code = re.sub(r"-\s*Step\s*\{currentZone\.step\}", "Step {currentZone.step} • ", jsx_code)

    # 1. Brisanje internih importa (Firebase, Checkout, LoginModal, Analytics)
    jsx_code = re.sub(r"import\s+\{\s*AVIATION_FREE_BOX\s*\}\s+from\s+['\"][^'\"]+['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+\{\s*db,\s*auth\s*\}\s+from\s+['\"][^'\"]+['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+\{[^}]*\}\s+from\s+['\"]firebase/firestore['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+\{[^}]*\}\s+from\s+['\"]firebase/auth['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+V8SecureCheckout\s+from\s+['\"][^'\"]+['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+LoginRequiredModal\s+from\s+['\"][^'\"]+['\"];?\n?", "", jsx_code)
    jsx_code = re.sub(r"import\s+\{\s*trackV8Action\s*\}\s+from\s+['\"][^'\"]+['\"];?\n?", "", jsx_code)

    # 2. Čišćenje Firebase funkcija
    jsx_code = re.sub(
        r"useEffect\(\(\)\s*=>\s*\{\s*const\s+unsub\s*=\s*onAuthStateChanged[\s\S]*?\},\s*\[\]\);",
        "",
        jsx_code
    )
    jsx_code = re.sub(r"const\s+recordOrderIntent\s*=\s*async[\s\S]*?\};\n", "", jsx_code)
    jsx_code = re.sub(
        r"const\s+handlePurchaseTier\s*=\s*async[\s\S]*?\};\n",
        "const handlePurchaseTier = () => {\n    const el = document.getElementById('ai-concierge');\n    if (el) el.scrollIntoView({ behavior: 'smooth' });\n  };\n",
        jsx_code
    )
    jsx_code = re.sub(
        r"const\s+handleDownloadSampleAndSpec\s*=\s*\(\)\s*=>\s*\{[\s\S]*?\};\n",
        "const handleDownloadSampleAndSpec = () => {\n    const el = document.getElementById('ai-concierge');\n    if (el) el.scrollIntoView({ behavior: 'smooth' });\n  };\n",
        jsx_code
    )

    # 3. IZBACIVANJE CELE SEKCIJE SA TVOG SCREENSHOTA (<section id="commercial-pricing">...$349 / $1490 / .TXT...</section>)
    jsx_code = re.sub(
        r"<section\s+id=[\"']commercial-pricing[\"'][\s\S]*?</section>",
        CLEAN_CLIENT_CHARTER_SECTION,
        jsx_code
    )

    # 4. Izbacivanje LoginModala, V8SecureCheckout-a i donjih dugmadi (NEXT JET PAGE: ATELIER 2/5)
    jsx_code = re.sub(r"<LoginRequiredModal[\s\S]*?/>", "", jsx_code)
    jsx_code = re.sub(r"<AnimatePresence>[\s\S]*?<V8SecureCheckout[\s\S]*?</AnimatePresence>", "", jsx_code)
    jsx_code = re.sub(r"<div\s+className=[\"']fixed\s+bottom-6\s+left-6[\s\S]*?</div>", "", jsx_code)
    jsx_code = re.sub(r"<div\s+className=[\"']fixed\s+bottom-6\s+right-24[\s\S]*?</div>", "", jsx_code)

    # 5. Čišćenje preostalih prodajnih natpisa u Headeru i Hero sekciji
    jsx_code = re.sub(r"\s*•\s*Page\s+\d+\s+of\s+\d+", "", jsx_code)
    jsx_code = re.sub(r"\s*\(Page\s+\d+/\d+\)", "", jsx_code)
    jsx_code = jsx_code.replace("License Agency Kit — ${agencyPrice}", "Book Private Charter")
    jsx_code = jsx_code.replace("Pricing (${agencyPrice} / ${buyoutPrice})", "Charter Programs")
    jsx_code = re.sub(r"<button[^>]*onClick=\{handleDownloadSampleAndSpec\}[^>]*>[\s\S]*?</button>", "", jsx_code)
    jsx_code = re.sub(r"<button[^>]*onClick=\{\(\)\s*=>\s*navigate\('/stock'\)\}[^>]*>[\s\S]*?</button>", "", jsx_code)
    jsx_code = re.sub(
        r"<button[^>]*onClick=\{\(\)\s*=>\s*navigate\(KIT_CONFIG\.nextLandingRoute\)\}[^>]*>[\s\S]*?</button>",
        '<a href="#ai-concierge" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88924] px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-black shadow-lg">Request Charter</a>',
        jsx_code
    )

    return jsx_code


def build_kit(page):
    root_folder = f"{page['kit_id']}-WEB-CODE"
    zip_name = f"{root_folder}.zip"
    comp = page["component_name"]
    jsx_path = page["jsx_path"]

    if not os.path.exists(jsx_path):
        print(f"[PRESKOČENO] Nije pronađen fajl: {jsx_path}")
        return

    with open(jsx_path, "r", encoding="utf-8") as f:
        raw_jsx = f.read()

    # Izvlači samo one '/jets/*.webp' slike koje se koriste na toj konkretnoj stranici
    used_images = sorted(set(re.findall(r'["\'](/jets/[^"\']+\.webp)["\']', raw_jsx)))

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        # 1. Pakuje samo pripadajuće .webp slike iz tvog public/jets/ foldera
        copied_count = 0
        for img_rel in used_images:
            local_img = os.path.join("public", img_rel.lstrip("/"))
            if os.path.exists(local_img):
                zipf.write(local_img, f"{root_folder}/public{img_rel}")
                copied_count += 1
            else:
                print(f"  [!] Slika nije pronađena u public/jets: {local_img}")

        # 2. Čisti .jsx od prodajne sekcije sa tvog screenshota i upisuje u ZIP
        clean_jsx = make_valid_buyer_jsx(raw_jsx)
        zipf.writestr(f"{root_folder}/src/pages/{comp}.jsx", clean_jsx)

        # 3. Čist App.jsx
        app_jsx = (
            "import React from 'react';\n"
            "import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\n"
            f"import {comp} from './pages/{comp}';\n\n"
            "export default function App() {\n"
            "  return (\n"
            "    <Router>\n"
            "      <Routes>\n"
            f"        <Route path=\"/\" element={{<{comp} />}} />\n"
            f"        <Route path=\"{page['route_path']}\" element={{<{comp} />}} />\n"
            "      </Routes>\n"
            "    </Router>\n"
            "  );\n"
            "}\n"
        )
        zipf.writestr(f"{root_folder}/src/App.jsx", app_jsx)

    print(f"[OK] {zip_name} -> Spakovano {copied_count} slika + izbačena prodajna sekcija ($349/$1490)")


if __name__ == "__main__":
    for p in PAGES_CONFIG:
        build_kit(p)