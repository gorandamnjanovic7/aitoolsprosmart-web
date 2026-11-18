import os
import re

APP_JSX_PATH = "src/App.jsx"
LIVE_WEBHOOK_URL = "https://n8n-production-720dcf20.up.railway.app/webhook/AVIATION_Concierge_And_Calendar"


def find_component_file(comp_name, fallback_filename):
    """Pronalazi tačnu putanju .jsx fajla u src/pages da Vite nikad ne izbaci grešku."""
    for root, _, files in os.walk("src/pages"):
        for f in files:
            if not f.endswith(".jsx"):
                continue
            full_path = os.path.join(root, f).replace("\\", "/")
            if f == f"{comp_name}.jsx":
                return full_path
            try:
                with open(full_path, "r", encoding="utf-8") as fp:
                    txt = fp.read()
                if f"export default {comp_name}" in txt or f"function {comp_name}" in txt:
                    return full_path
            except Exception:
                pass
    return f"src/pages/kits/aviation/{fallback_filename}"


def detect_first_yacht_route():
    """Čita App.jsx i pronalazi tačnu rutu 1. stranice jahti."""
    if os.path.exists(APP_JSX_PATH):
        with open(APP_JSX_PATH, "r", encoding="utf-8") as f:
            app_code = f.read()
        # Traži prvu rutu koja sadrži 'yacht'
        matches = re.findall(r'path=["\'](/[^"\']*yacht[^"\']*)["\']', app_code, re.IGNORECASE)
        if matches:
            return matches[0]
    return "/yacht-charter-kit"


def patch_aviation_page(file_path, page_info, prev_route, prev_label, next_route, next_label):
    if not os.path.exists(file_path):
        print(f"[UPOZORENJE] Fajl nije pronađen na disku: {file_path}")
        return False

    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Povezivanje na živi Railway webhook (Concierge + Google Calendar)
    code = re.sub(
        r"const\s+WEBHOOK_URL\s*=\s*['\"][^'\"]+['\"];",
        f"const WEBHOOK_URL = '{LIVE_WEBHOOK_URL}';",
        code
    )

    # 2. Ažuriranje KIT_CONFIG ruta (prev i next)
    code = re.sub(r"(prevPageRoute\s*:\s*)['\"][^'\"]+['\"]", f"\\1'{prev_route}'", code)
    code = re.sub(r"(prevPageLabel\s*:\s*)['\"][^'\"]+['\"]", f"\\1'{prev_label}'", code)
    code = re.sub(r"(nextLandingRoute\s*:\s*)['\"][^'\"]+['\"]", f"\\1'{next_route}'", code)
    code = re.sub(r"(nextLandingLabel\s*:\s*)['\"][^'\"]+['\"]", f"\\1'{next_label}'", code)
    code = re.sub(r"(nextLandingTitle\s*:\s*)['\"][^'\"]+['\"]", f"\\1'{next_label}'", code)

    # Na 3. stranici menjamo eventualni hardkodovani link ka starom runway-kit u midnight-kit
    if page_info["num"] == 3:
        code = code.replace("'/aviation-runway-kit'", "'/aviation-midnight-kit'")
        code = code.replace('"/aviation-runway-kit"', '"/aviation-midnight-kit"')
        code = re.sub(r"RUNWAY\s*\(4/5\)", "MIDNIGHT (4/5)", code, flags=re.IGNORECASE)

    # Na 5. stranici (Skyglass) gornje desno dugme u headeru menjamo iz "Page 1" u "Yachts"
    if page_info["num"] == 5:
        code = re.sub(r"Page\s*1\s*<ArrowRight", "Yachts <ArrowRight", code)

    # Na prvih 3 stranica (ako imaju hardkodovane fixed bottom-6 dugmiće bez KIT_CONFIG.prevPageRoute)
    if "KIT_CONFIG.prevPageRoute" not in code:
        code = re.sub(
            r"(<div\s+className=[\"']fixed\s+bottom-6\s+left-6[\s\S]*?onClick=\{\(\)\s*=>\s*navigate\()[^)]+(\)\}[\s\S]*?<span>)[\s\S]*?(</span>[\s\S]*?</div>)",
            f"\\1'{prev_route}'\\2← {prev_label}\\3",
            code,
            count=1
        )
        code = re.sub(
            r"(<div\s+className=[\"']fixed\s+bottom-6\s+right-24[\s\S]*?onClick=\{\(\)\s*=>\s*navigate\()[^)]+(\)\}[\s\S]*?<span>)[\s\S]*?(</span>[\s\S]*?</div>)",
            f"\\1'{next_route}'\\2{next_label} →\\3",
            code,
            count=1
        )

    # 3. Dodavanje Google Calendar state polja (flightDate i flightSlot) u svih 5 stranica
    if "const [flightDate, setFlightDate]" not in code:
        code = re.sub(
            r"(const\s+\[clientEmail,\s*setClientEmail\]\s*=\s*useState\(['\"][^'\"]*['\"]\);)",
            "\\1\n  const [flightDate, setFlightDate] = useState('2026-11-20');\n  const [flightSlot, setFlightSlot] = useState('14:00 CET');",
            code,
            count=1
        )

    # 4. Ubacivanje Date & Time Slot birača u AI Flight Desk formu (odmah ispod clientEmail polja)
    if "value={flightDate}" not in code:
        calendar_fields = """                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
                <select
                  value={flightSlot}
                  onChange={(e) => setFlightSlot(e.target.value)}
                  className="rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-xs font-bold text-amber-200 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="10:00 CET" className="bg-black text-white">Calendar Slot: 10:00 CET</option>
                  <option value="12:00 CET" className="bg-black text-white">Calendar Slot: 12:00 CET</option>
                  <option value="14:00 CET" className="bg-black text-white">Calendar Slot: 14:00 CET</option>
                  <option value="16:30 CET" className="bg-black text-white">Calendar Slot: 16:30 CET</option>
                  <option value="18:00 CET" className="bg-black text-white">Calendar Slot: 18:00 CET</option>
                </select>"""

        code = re.sub(
            r"(<input[^>]*value=\{clientEmail\}[\s\S]*?/>)",
            f"\\1\n{calendar_fields}",
            code,
            count=1
        )

    # 5. Slanje izabranog datuma i termina u JSON body ka n8n webhooku
    if "date: `${flightDate}" not in code:
        code = re.sub(
            r"(body:\s*JSON\.stringify\(\{\s*\n\s*message:\s*msg,)",
            "\\1\n          date: `${flightDate} at ${flightSlot}`,",
            code,
            count=1
        )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)

    return True


def update_app_jsx(pages):
    if not os.path.exists(APP_JSX_PATH):
        print(f"[GREŠKA] Nije pronađen {APP_JSX_PATH}")
        return

    with open(APP_JSX_PATH, "r", encoding="utf-8") as f:
        app_code = f.read()

    uses_lazy = bool(re.search(r"lazy\(\(\)\s*=>\s*import\(", app_code))

    # 1. Provera i dodavanje tačnih importa na osnovu stvarne lokacije fajla na disku
    for p in pages:
        comp = p["comp"]
        if not os.path.exists(p["path"]):
            continue

        rel_import = "./" + os.path.relpath(p["path"], "src").replace("\\", "/")
        rel_import_no_ext = re.sub(r"\.jsx$", "", rel_import)

        # Ako komponenta uopšte nije importovana u App.jsx, dodajemo je
        if not re.search(rf"\b{comp}\b", app_code):
            if uses_lazy:
                imp_line = f"const {comp} = lazy(() => import('{rel_import_no_ext}'));\n"
            else:
                imp_line = f"import {comp} from '{rel_import_no_ext}';\n"

            imports = list(re.finditer(r"^import\s+.*?;?\s*$", app_code, re.MULTILINE))
            if imports:
                pos = imports[-1].end()
                app_code = app_code[:pos] + "\n" + imp_line + app_code[pos:]
            else:
                app_code = imp_line + app_code
            print(f"[OK] Dodat import u App.jsx: {comp} -> {rel_import_no_ext}")

    # 2. Registracija svih ruta i alijasa tako da nijedan link nikad ne promaši 4. i 5. stranicu
    route_map = [
        ("/aviation-charter-kit", pages[0]["comp"]),
        ("/aviation-atelier-kit", pages[1]["comp"]),
        ("/aviation-cloudline-kit", pages[2]["comp"]),
        ("/aviation-midnight-kit", pages[3]["comp"]),
        ("/aviation-runway-kit", pages[3]["comp"]),
        ("/aviation-page-5", pages[4]["comp"]),
        ("/aviation-skyglass-aviation", pages[4]["comp"]),
        ("/aviation-skyglass-kit", pages[4]["comp"]),
    ]

    for route_str, comp_name in route_map:
        # Proveravamo da li komponenta postoji u App.jsx pre upisa rute
        if not re.search(rf"\b{comp_name}\b", app_code):
            continue

        existing_route_pattern = rf'<Route\s+path=["\']{re.escape(route_str)}["\']\s+element=\{{<[^>]+>\}}\s*/>'
        new_route_tag = f'<Route path="{route_str}" element={{<{comp_name} />}} />'

        if re.search(existing_route_pattern, app_code):
            app_code = re.sub(existing_route_pattern, new_route_tag, app_code)
        elif "</Routes>" in app_code:
            app_code = app_code.replace("</Routes>", f"        {new_route_tag}\n      </Routes>", 1)
            print(f"[OK] Dodata ruta u App.jsx: {route_str} -> <{comp_name} />")

    with open(APP_JSX_PATH, "w", encoding="utf-8") as f:
        f.write(app_code)


def main():
    yacht_page_1 = detect_first_yacht_route()
    print(f"[INFO] 1. stranica jahti detektovana na ruti: {yacht_page_1}")

    pages = [
        {
            "num": 1,
            "comp": "PrivateAviationKit",
            "path": find_component_file("PrivateAviationKit", "PrivateAviationKit.jsx"),
            "route": "/aviation-charter-kit",
            "short": "Sovereign (1/5)"
        },
        {
            "num": 2,
            "comp": "AeroPriveAtelier",
            "path": find_component_file("AeroPriveAtelier", "AeroPriveAtelier.jsx"),
            "route": "/aviation-atelier-kit",
            "short": "Atelier (2/5)"
        },
        {
            "num": 3,
            "comp": "CloudlinePrestige",
            "path": find_component_file("CloudlinePrestige", "CloudlinePrestige.jsx"),
            "route": "/aviation-cloudline-kit",
            "short": "Cloudline (3/5)"
        },
        {
            "num": 4,
            "comp": "MidnightAltitude",
            "path": find_component_file("MidnightAltitude", "MidnightAltitude.jsx"),
            "route": "/aviation-midnight-kit",
            "short": "Midnight (4/5)"
        },
        {
            "num": 5,
            "comp": "SkyglassAviation",
            "path": find_component_file("SkyglassAviation", "SkyglassAviation.jsx"),
            "route": "/aviation-skyglass-aviation",
            "short": "Skyglass (5/5)"
        }
    ]

    for i, p in enumerate(pages):
        prev_p = pages[i - 1] if i > 0 else pages[-1]
        prev_route = prev_p["route"]
        prev_label = f"Prev Jet Page: {prev_p['short']}"

        if i < 4:
            next_p = pages[i + 1]
            next_route = next_p["route"]
            next_label = f"Next Jet Page: {next_p['short']}"
        else:
            # 5. stranica aviona (Skyglass) vodi direktno na 1. stranicu jahti!
            next_route = yacht_page_1
            next_label = "Next Niche: Yachts (1/5)"

        ok = patch_aviation_page(p["path"], p, prev_route, prev_label, next_route, next_label)
        if ok:
            print(f"[OK] Stranica {p['num']}/5 ({p['path']}) -> NEXT: {next_route}")

    update_app_jsx(pages)
    print("\n=== SVE JE ZAVRŠENO! Proveri na localhost:5173/aviation-midnight-kit i /aviation-skyglass-aviation ===")


if __name__ == "__main__":
    main()