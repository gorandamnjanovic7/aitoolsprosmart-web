// ============================================================================
// FAJL: src/hide/GoranExif.jsx
// RUTA / NAMENA: /goran-exif | Visionary Factory V10 — EXIF + 200 English Bundle Dropdown + CSV Reaktor
// ============================================================================
import React, { useState, useMemo, useEffect, useRef } from 'react';

export const HIDDEN_EXIF_VAULT_ROUTE = '/goran-exif';

const wrapSubjects = (items) =>
  items.map((entry) => {
    if (typeof entry === 'string') {
      return { text: entry, placement: 'center' };
    }
    return {
      text: entry.text,
      placement: entry.placement || 'center'
    };
  });

const resolvePlacementDirective = (placement) => {
  if (placement === 'left') {
    return 'full intact subject completely visible inside the frame with generous margin around all edges, never cropped or cut off at the borders, positioned within the left third with clean open negative space on the right';
  }
  if (placement === 'right') {
    return 'full intact subject completely visible inside the frame with generous margin around all edges, never cropped or cut off at the borders, positioned within the right third with clean open negative space on the left';
  }
  return 'full intact subject centered cleanly in the frame with generous breathing room around all edges, completely visible and never cut off at the borders';
};

const V10_EXIF_GUARDRAILS =
  'subject completely visible inside frame, no cropped edges, zero letterbox bars, 100% IP-safe unbranded commercial composition, zero text, zero typography, zero magazine mastheads, zero logos, zero badges, zero watermarks, zero UI overlays';

// OPTIČKI UGLOVI KADA JE UKLJUČEN "SAMO MOJ OPIS" (SPREČAVA SUDAR OKRUŽENJA I DRŽI 5,000 UNIKATNIH KOMBINACIJA)
const PURE_OPTICAL_FRAMINGS = [
  'captured from a hero eye-level commercial angle with tack-sharp foreground micro-texture and creamy optical depth falloff',
  'framed with precision rectilinear architectural symmetry and ultra-clean background separation',
  'shot from a subtle low three-quarter hero perspective emphasizing physical material weight and surface specular fidelity',
  'captured with medium-format depth compression, razor-sharp focal plane lock, and natural optical vignette',
  'composed with gallery-grade commercial negative space and true physical light refraction across surfaces',
  'shot at intimate editorial distance revealing sub-millimeter material grain without synthetic smoothing',
  'framed as a flagship B2B campaign master plate with balanced horizon geometry and deep tonal latitude',
  'captured with precision focus-stacked clarity from front edge to rear contour and smooth background bokeh',
  'composed from a poised cinematic dolly angle with organic highlight roll-off and deep shadow micro-contrast',
  'shot with apochromatic edge-to-edge lens sharpness and authentic unretouched sensor texture'
];

// ============================================================================
// DROPDOWN BIBLIOTEKA: TAČNO 200 ENGLESKIH KOMERCIJALNIH MOTIVA ZA V10 PAKETE (10 × 20)
// ============================================================================
export const BUNDLE_KEYWORDS_200 = [
  {
    group: '1. Executive Billboards & OOH Mockups (20)',
    placement: 'center',
    items: [
      'blank backlit glass street billboard on rain-slicked asphalt at dusk',
      'unmarked concrete highway mega-billboard against golden sunset clouds',
      'blank vertical digital mupi totem on modern architectural plaza',
      'unmarked brushed-steel bus shelter display frame on nocturnal boulevard',
      'blank curved LED facade billboard on contemporary glass corner building',
      'unmarked rooftop illuminated billboard frame overlooking twilight skyline',
      'blank luxury airport terminal lightbox display beside travertine columns',
      'unmarked subway station tiled wall poster frame under warm linear lighting',
      'blank shopping atrium suspended banner frame in sunlit glass galleria',
      'unmarked roadside corten-steel monument sign beside manicured pines',
      'blank pedestrian walkway twin glass poster vitrines in misty morning light',
      'unmarked stadium concourse wide-format lightbox over polished concrete',
      'blank marina promenade backlit display panel beside calm blue harbor',
      'unmarked exhibition hall freestanding matte-black display monolith',
      'blank brutalist concrete street poster wall with crisp afternoon shadows',
      'unmarked hotel porte-cochere illuminated welcome totem at blue hour',
      'blank luxury retail storefront window display frame on limestone street',
      'unmarked urban overpass horizontal banner frame above wet evening road',
      'blank high-speed rail platform digital totem with clean floor reflections',
      'unmarked sculpture garden glass information monolith in soft morning mist'
    ]
  },
  {
    group: '2. Architectural Wall & Glass Plaque Mockups (20)',
    placement: 'center',
    items: [
      'blank beveled optical crystal award plaque on dark walnut executive desk',
      'unmarked frosted glass wall plaque mounted on brushed brass standoffs',
      'blank honed Nero Marquina black marble corporate reception wall',
      'unmarked fluted travertine feature wall in sunlit architectural lobby',
      'blank smoked-glass donor wall plaque on raw board-formed concrete',
      'unmarked monolithic dark basalt wall in minimalist executive boardroom',
      'blank gallery-white museum exhibition wall above pale oak herringbone floor',
      'unmarked Venetian plaster feature wall bathed in diagonal window shadow',
      'blank brushed-titanium nameplate plaque on dark slate office entrance wall',
      'unmarked floating acrylic trophy plaque on polished black obsidian base',
      'blank warm walnut slat architectural wall with recessed LED cove glow',
      'unmarked Calacatta Viola veined marble gallery wall in soft daylight',
      'blank matte-bronze framed glass directory wall in luxury tower foyer',
      'unmarked raw concrete industrial loft wall with dramatic skylight beam',
      'blank emerald-tinted crystal award monolith on matte anthracite suede',
      'unmarked sandblasted limestone courtyard wall with olive branch shadow',
      'blank executive library dark-oak paneled wall above leather credenza',
      'unmarked hexagonal crystal recognition plaque on brushed gunmetal plinth',
      'blank minimalist microcement spa reception wall with warm indirect light',
      'unmarked arched terracotta plaster niche wall in Mediterranean villa hall'
    ]
  },
  {
    group: '3. Luxury Horology, Diamonds & High Jewelry (20)',
    placement: 'right',
    items: [
      'brushed grade-5 titanium skeleton tourbillon watch on wet volcanic basalt',
      'rose-gold perpetual calendar wristwatch on honed black marble slab',
      'forged-carbon chronograph watch with full rubber strap on dark slate',
      'platinum dress watch with guilloche dial on rich warm amber velvet',
      'sapphire-case openworked mechanical watch on smoked optical glass',
      'emerald-cut green emerald platinum ring with natural prismatic caustics',
      'channel-set baguette diamond 18k gold ring on wet black obsidian',
      'cushion-cut yellow diamond solitaire ring on raw travertine stone',
      'uncut raw octahedron diamond beside flawless round brilliant diamond',
      'articulated white-gold diamond tennis bracelet on matte charcoal suede',
      'pear-shaped drop sapphire and diamond earrings on dark mirror glass',
      'bespoke platinum geometric cufflinks resting on brushed gunmetal slab',
      'blackened gold signet ring beside raw 24k gold nugget on dark basalt',
      'heavy faceted crystal parfum flacon with golden amber elixir on wet stone',
      'handcrafted solid gold fountain pen nib on aged dark leather desk pad',
      'vintage-inspired bronze diver watch with luminous dial on wet driftwood',
      'sculptural pearl and brushed-gold collar necklace on black silk folds',
      'exposed mechanical watch movement macro showing ruby jewels and balance wheel',
      'ruby cabochon cocktail ring in hammered 18k yellow gold on dark slate',
      'minimalist ceramic midnight-blue GMT wristwatch on wet dark granite'
    ]
  },
  {
    group: '4. Hypercars, Superyachts & Private Aviation (20)',
    placement: 'left',
    items: [
      'unbranded metallic silver hypercar with illuminated LED headlights on wet mountain pass',
      'unbranded obsidian-black coupe with glowing headlights on rain-slicked coastal road',
      'unbranded champagne-gold supercar with headlights turned on inside dark studio',
      'unbranded British-racing-green grand tourer with lit headlights on misty alpine tarmac',
      'illuminated matrix LED headlight on wet black sports car hood with rain droplets',
      'carbon-ceramic brake rotor and yellow caliper inside forged wheel mounted on supercar',
      'exposed carbon-fiber rear diffuser and quad exhaust integrated on unbranded hypercar',
      'sculpted metallic gullwing door and side intake on unbranded silver exotic coupe',
      'dark-hulled explorer superyacht with turquoise underwater lights in calm cove',
      'superyacht teak sun deck with glass infinity plunge pool overlooking twilight sea',
      'unbranded sleek white twin-engine private business jet ascending above golden clouds',
      'private jet cabin interior with cream stitched leather club seats and walnut table',
      'silver-titanium long-range jet parked on wet hangar apron with warm window glow',
      'mahogany luxury day-tender speedboat gliding across mirror-still turquoise fjord',
      'superyacht main salon interior with panoramic sea glass at blue hour',
      'unbranded matte-grey electric hypercar with glowing LED lightbar on desert highway',
      'bespoke dark leather and machined-aluminum car cockpit console without emblems',
      'tri-deck white superyacht anchored beneath towering misty volcanic sea cliffs',
      'unbranded pearl-white roadster with headlights on along Mediterranean cliff road',
      'forged bronze center-lock wheel and carbon fender mounted on unbranded track coupe'
    ]
  },
  {
    group: '5. Michelin Gastronomy & Luxury Beverages (20)',
    placement: 'center',
    items: [
      'seared prime ribeye steak on luxury restaurant table with truffle mash and charred asparagus, strong background bokeh',
      'pan-seared A5 Wagyu medallions on fine-dining table with saffron risotto and glazed baby carrots, creamy background blur',
      'roasted rack of lamb on white-linen restaurant table with rosemary fondant potatoes and minted pea puree, deep bokeh',
      'butter-poached lobster tail on luxury dining table with bisque foam, fennel salad, and caviar blinis, soft background blur',
      'crispy duck breast on candlelit restaurant table with parsnip puree and braised red cabbage, strong background bokeh',
      'seared sea scallops on luxury restaurant table with cauliflower veloute and crispy pancetta greens, blurred dining room',
      'black-truffle tagliolini pasta on fine-dining table with aged parmesan crisps and herb bruschetta, creamy bokeh',
      'glazed black cod fillet on luxury restaurant table with steamed bok choy and forbidden black rice, soft bokeh',
      'dark chocolate mirror tart on fine-dining table with vanilla bean gelato and fresh raspberry coulis, strong bokeh',
      'caramelized pistachio mille-feuille on luxury restaurant table with espresso crema and berry compote, blurred background',
      'heavy cut-crystal whiskey decanter pouring amber spirit over clear ice sphere on dark oak bar',
      'naked espresso portafilter extracting rich tiger-stripe crema into borosilicate glass cup',
      'aged crystalline Parmigiano wedge with dripping golden honey and fresh figs on marble board',
      'high-speed splash of molten golden caramel colliding with aromatic white steam over black slate',
      'chilled unbranded crystal champagne flute with fine rising bubbles on wet black marble terrace',
      'smoked old-fashioned cocktail under glass cloche with swirling oakwood vapor on dark walnut',
      'artisanal sourdough loaf with cold-pressed golden olive oil cruet and black truffles on slate',
      'matcha ceremonial whisk and emerald foam in hand-thrown black raku tea bowl',
      'freshly shucked oysters on crushed ice platter with lemon pearls and herb salad on luxury table, soft bokeh',
      'ruby red wine swirling inside hand-blown crystal Bordeaux glass backlit by warm cellar candlelight'
    ]
  },
  {
    group: '6. Brutalist Villas, Hotels & Luxury Spaces (20)',
    placement: 'center',
    items: [
      'multi-tiered brutalist concrete cliffside eco-resort with waterfalls and warm glass suites',
      'cantilevered white-concrete coastal villa with zero-edge infinity pool over sapphire sea',
      'blackened-timber Nordic cliff residence perched above steel-blue fjord waters',
      'subterranean basalt luxury spa lounge with cantilevered plunge pool and skylight shaft',
      'desert limestone courtyard villa with sunken firepit lounge and oasis pool at dusk',
      'arched iron-and-glass botanical conservatory interior with sunbeams through tropical rain',
      'Japanese minimalist raw concrete tea pavilion surrounded by black mirror reflection pond',
      'double-height penthouse living room with walnut slats and panoramic twilight city glass',
      'minimalist Calacatta marble staircase hall with indoor olive tree and dappled shadows',
      'alpine glass-and-stone chalet cantilevering over snow-dusted pine valley at sunrise',
      'sunken conversation pit lounge in travertine seaside villa overlooking calm ocean horizon',
      'luxury boutique hotel atrium with cascading hanging gardens and warm brass walkways',
      'monolithic concrete private art museum nestled in misty green highland hills',
      'Mediterranean whitewashed cave suite opening onto private cliffside plunge terrace',
      'private underground wine cellar carved into natural rock with warm backlit glass racks',
      'rooftop infinity lap pool spanning between two minimalist glass residential towers',
      'serene master bedroom suite with frameless corner ocean glass and raw linen textures',
      'brutalist concrete bridge house spanning across a misty emerald forest river gorge',
      'private cinema lounge with tiered charcoal boucle sofas and acoustic smoked-oak walls',
      'floating glass sauna pavilion anchored in a mirror-still misty Nordic mountain lake'
    ]
  },
  {
    group: '7. Ancient Civilizations & Megalithic Wonders (20)',
    placement: 'center',
    items: [
      'weathered monolithic stone trilithon portal on windy green highland cliffs with sunbeams',
      'concentric circular desert oasis lake surrounding ancient stone island ruins from above',
      'submerged gothic stone cathedral overgrown with coral reefs and swimming fish schools',
      'forgotten temple sanctuary carved directly into vertical jungle canyon cliff with waterfalls',
      'ancient stepped stone ziggurat emerging from dense silver rainforest morning mist',
      'colossal carved sandstone temple columns bathed in dusty golden crepuscular rays',
      'sunken Greco-Roman marble colonnade resting in crystal-clear turquoise shallow sea',
      'prehistoric circle of moss-covered standing stones under brooding Nordic twilight clouds',
      'abandoned cliffside monastery connected by narrow arched stone footbridge in mountain fog',
      'subterranean carved rock cistern with hundreds of lit stone pillars reflecting in dark water',
      'ancient polygonal mountain citadel perched above a sea of golden sunrise clouds',
      'forgotten library rotunda carved into limestone cavern behind a curtain of waterfalls',
      'weathered bronze astrolabe monument standing atop a remote rocky ocean headland',
      'moss-reclaimed ancient stone temple roots intertwined with giant emerald banyan trees',
      'spiral stone stepwell descending deep into geometric shadow layers in arid sandstone',
      'ancient basalt sea fortress battered by Atlantic storm surf under dramatic sky breaks',
      'frozen ancient stone watchtower high on a windswept Himalayan glacier ridge',
      'carved rose-red canyon treasury facade illuminated by warm brass oil lanterns at dusk',
      'half-buried colossal stone guardian sculpture on wet volcanic black-sand beach',
      'submerged marble amphitheater steps visible beneath glassy emerald Mediterranean water'
    ]
  },
  {
    group: '8. Surreal Campaign Key-Art & Storytelling (20)',
    placement: 'center',
    items: [
      'colossal desert lion formed from swirling golden sand towering above tiny camel caravan',
      'circular multi-story library carved inside a giant hollow ancient tree lit by sunbeam',
      'vintage black steam locomotive crossing high stone viaduct above endless sea of sunset clouds',
      'antique brass Edison lightbulb containing a vibrant swirling miniature supernova nebula',
      'clear cut-crystal glass of ice water containing glowing emerald Aurora Borealis ribbons',
      'weathered iron-and-glass hourglass in ocean surf holding a sunlit desert oasis inside',
      'floating moss-covered rock island with ancient temple ruins and glowing golden stone doorway',
      'ancient cliffside oak tree with glowing golden roots beneath vivid Milky Way night sky',
      'luminous golden waterfall pouring from storm clouds into mirror mountain lake with double rainbow',
      'grand weathered timber concert piano standing intact on wet mirror-like black volcanic beach',
      'giant sequoia trunk fused seamlessly with weathered brass clockwork gears and vacuum tubes',
      'single macro forest leaf dewdrop refracting an entire twilight skyline inside the sphere',
      'heavy crystal apothecary jar holding a miniature rolling thunderstorm with tiny lightning',
      'monolithic stone chess pieces standing half-submerged in misty alpine tarn at dawn',
      'lone expedition kayaker gliding over swirling golden mineral water resembling espresso crema',
      'hollowed ancient coastal tree trunk forming a glowing warm lighthouse during ocean storm',
      'transparent quartz crystal geode split open to reveal a miniature turquoise alpine lake',
      'solitary diver with warm underwater lantern facing a colossal glowing deep-sea jellyfish',
      'staircase of floating weathered stone blocks ascending cleanly into sunlit cumulus clouds',
      'open antique brass pocket watch revealing a glowing golden planetary ring system inside'
    ]
  },
  {
    group: '9. Dark-Mode UI/UX Hero Backgrounds & Materials (20)',
    placement: 'right',
    items: [
      'sculptural matte-black liquid silk waves intersecting brushed gold metallic filaments',
      'abstract architectural dark basalt monoliths with thin warm amber rim light lines',
      'translucent smoked optical glass prisms refracting subtle cyan-and-gold caustics on black',
      'brushed dark titanium geometric planes with soft volumetric top-down studio light',
      'glossy black ferrofluid spikes catching crisp silver and warm gold specular highlights',
      'minimalist dark obsidian water ripples frozen at high speed in pitch-black studio',
      'layered matte charcoal paper-cut topographic contours with warm recessed glow',
      'handcrafted carbon-fiber weave macro bathed in grazing cool blue-and-amber edge light',
      'floating frosted glass geometric spheres over deep midnight-slate background',
      'swirling liquid 24k molten gold ribbon suspended cleanly in dark crystal-clear fluid',
      'raw honed dark slate slab with a single diagonal shaft of warm golden window light',
      'anisotropic brushed gunmetal cylinder standing on mirror-black acrylic surface',
      'delicate golden light filaments flowing across dark micro-textured concrete void',
      'intersecting clear borosilicate glass sheets with rainbow edge dispersion on dark grey',
      'minimalist dark-mode podium crafted from veined black marble and warm brass ring',
      'fine metallic bronze dust particles suspended in a narrow beam of studio chiaroscuro light',
      'curved matte-black acoustic architectural ribs receding into deep atmospheric shadow',
      'crystalline dark amethyst mineral surface macro with subtle directional specular fire',
      'smooth matte obsidian pebbles arranged zen-like on wet dark stone with negative space',
      'ultra-clean dark sapphire gradient glass wave with crisp physical refraction highlights'
    ]
  },
  {
    group: '10. Haute Couture, Beauty & Editorial Portraits (20)',
    placement: 'center',
    items: [
      'high-fashion blonde model in sculptural ivory silk bow gown on dark charcoal backdrop',
      'editorial portrait of poised model in crimson off-shoulder silk couture dress',
      'close-up natural beauty portrait with authentic freckles and emerald silk draping',
      'male creative director in charcoal cashmere turtleneck and titanium glasses under Rembrandt light',
      'avant-garde optical prism double-reflection portrait of serene woman in dark studio',
      'neo-renaissance Chiaroscuro portrait of woman in black raw silk with 24k gold-leaf collarbone accent',
      'distinguished silver-haired master watchmaker in dark wool coat under soft window light',
      'model in structured matte-black architectural wool coat with sleek pulled-back hair',
      'sunlit portrait of woman in raw undyed linen tailoring beside tall limestone windows',
      'couture profile portrait wearing Havana tortoiseshell sunglasses and ivory silk trench',
      'close-up beauty study of woman veiled behind rain-streaked glass with one tack-sharp eye',
      'poised female architect holding rolled blueprints in minimalist concrete gallery',
      'dramatic low-key portrait of model draped in midnight-velvet couture with silver rim light',
      'intimate window-light portrait of young woman in black eyeglasses beside rustic ceramic cup',
      'high-fashion model wearing pleated liquid-champagne organza and sculptural gold ear cuffs',
      'monochrome-toned portrait of marble sculptor dusted lightly with fine white stone powder',
      'editorial close-up of woman with platinum hair and sapphire eyes in north-light studio',
      'moody 35mm portrait of enigmatic woman casting rainbow prism band across her cheek',
      'executive founder portrait in bespoke navy wool suit standing in dark walnut library',
      'striking couture portrait in sculpted burgundy leather and silk evening silhouette'
    ]
  }
];

// SVE KLJUČNE REČENICE I OKIDAČI ZA BRZO KOPIRANJE U META AI / MAGNIFIC / HIGGSFIELD / MIDJOURNEY (28 MYSTIC REČENICA)
export const QUICK_META_KEYWORDS = {
  mysticSentences: [
    'THE MOST UNIQUE AND PHOTOREALISTIC PHOTO IN THE WORLD',
    'THE MOST MYSTICAL AND PHOTOREALISTIC PHOTOGRAPH EVER CAPTURED ON EARTH',
    'THE MOST ENIGMATIC AND BREATHTAKING PHOTOREALISTIC SCENE IN THE WORLD',
    'THE MOST MYSTERIOUS AND ATMOSPHERIC RAW PHOTOGRAPH IN HUMAN HISTORY',
    'THE MOST ANCIENT, MYSTICAL AND PHOTOREALISTIC FORGOTTEN PLACE ON EARTH',
    'THE MOST SACRED, MIST-COVERED AND PHOTOREALISTIC HIDDEN SANCTUARY IN THE WORLD',
    'THE MOST TIMELESS AND MYSTICAL ARCHITECTURAL WONDER HIDDEN IN NATURE, PHOTOREALISTIC',
    'THE MOST HAUNTINGLY BEAUTIFUL, DARK MYSTICAL AND PHOTOREALISTIC NIGHT PHOTO IN THE WORLD',
    'THE MOST ETHEREAL, BIOLUMINESCENT AND PHOTOREALISTIC MYSTIC PHENOMENON ON EARTH',
    'THE MOST CINEMATIC, MOODY AND MYSTICAL PHOTOREALISTIC MOMENT EVER CAPTURED',
    'THE MOST OTHERWORLDLY, MYSTICAL AND HYPER-REALISTIC VISUAL PARADOX IN THE WORLD',
    'THE MOST TRANSCENDENT, MYSTICAL AND PHOTOREALISTIC NATURAL MIRACLE EVER SEEN',
    'THE MOST MYSTICAL AND UNEXPLAINED PLACE ON EARTH, PHOTOREALISTIC, NATIONAL GEOGRAPHIC STYLE',
    'THE MOST AWE-INSPIRING MONUMENTAL SCALE PHOTOGRAPH EVER CAPTURED, TINY HUMAN SILHOUETTE, RAW 35MM FILM',
    'THE MOST EXTRAORDINARY PULITZER-GRADE DOCUMENTARY PHOTOGRAPH OF AN UNTOUCHED WONDER ON EARTH',
    'THE MOST HYPNOTIC OPTICAL REFRACTION AND CAUSTIC LIGHT PHENOMENON EVER PHOTOGRAPHED IN RAW',
    'THE MOST DRAMATIC GOLDEN-HOUR CREPUSCULAR SUNBEAMS PIERCING AN ANCIENT HIDDEN CAVERN, PHOTOREALISTIC',
    'THE MOST SURREAL YET 100% REALISTIC CAMPAIGN KEY-ART PHOTOGRAPH EVER SHOT ON IMAX 70MM FILM',
    'THE MOST BREATHTAKING AERIAL EXPEDITION PHOTOGRAPH OF A FORGOTTEN GEOMETRIC OASIS ON EARTH',
    'THE MOST INTIMATE ZERO-RETOUCH MEDIUM FORMAT MACRO PHOTOGRAPH EVER CAPTURED, SUB-MILLIMETER REALISM',
    'THE MOST ATMOSPHERIC STORM-LIT OCEANIC MONOLITH PHOTOGRAPH EVER TAKEN, NATIONAL GEOGRAPHIC ARCHIVE',
    'THE MOST MAJESTIC SUBMERGED ANCIENT ARCHITECTURE PHOTOGRAPHED IN CRYSTAL-CLEAR ABYSSAL WATER',
    'THE MOST POETIC CHIAROSCURO SHADOW AND VOLUMETRIC MIST PHOTOGRAPH IN MODERN VISUAL HISTORY',
    'THE MOST UNBELIEVABLE NATURAL GEOLOGICAL PARADOX ON EARTH, UNEDITED MEDIUM FORMAT RAW SENSOR',
    'THE MOST LUXURIOUS ARCHITECTURAL DIGEST MEETS NATIONAL GEOGRAPHIC SANCTUARY PHOTOGRAPH EVER SHOT',
    'THE MOST STRIKING HIGH-SPEED FROZEN LIQUID AND ELEMENTAL PHYSICS PHOTOGRAPH EVER CAPTURED IN STUDIO',
    'THE MOST SILENT, SACRED AND HYPER-DETAILED NORDIC TWILIGHT LANDSCAPE EVER RECORDED ON FILM',
    'THE MOST ICONIC MUSEUM-GRADE LARGE FORMAT COMMERCIAL PHOTOGRAPH EVER PRODUCED, ZERO CGI GLOSS'
  ],
  realismLocks: [
    'CAPTURED ON 35MM FILM',
    'NATIONAL GEOGRAPHIC STYLE',
    'Shot on IMAX 70mm film, ARRI Alexa 65, natural anamorphic lens flare, Kodak Portra 400 grain',
    'clean textless frame, no logos, no typography, zero magazine mastheads',
    'unbranded bespoke chassis, zero emblems, clean front hood without badges, zero drones in sky',
    'Remove all text, typography, and magazine logos, keep clean studio portrait only',
    'IMG_3177.RAF: high-fashion studio editorial portrait, sculptural ivory silk couture dress, dramatic softbox lighting on dark charcoal backdrop, unretouched skin texture, clean textless frame, no logos, no typography'
  ],
  secretMetaTokensBank: [
    'ACEScg_P3_D65_matrix, phaseone_IQ4_backplate, HDR_microcontrast_256map',
    'glass_diffusion.normalpass, exposure_stack_x9_dynamicrange, uncompressed_RAW_16bit',
    'albedo_subsurface.vfx, micro-fabric_specular_2024, lux_tonecurve.8bit_expansion',
    'Hasselblad_X2D_lensmap, ProRes_4444XQ, diffusion_reflectivity_0.98, HDR10+_film_still',
    'Zeiss_Otus_55mm_f1.4, ACEScg_cinematic_bounce, ISO_64_filmgrain, refraction_noise=off',
    'shutter_angle_180, optical_caustics_pass, Kodak_Portra_400_emulsion, zero_CGI_gloss'
  ]
};

const POWER_HOOKS_FOR_GENERATOR = [
  'THE MOST UNIQUE AND PHOTOREALISTIC PHOTOGRAPH EVER CAPTURED ON EARTH, NATIONAL GEOGRAPHIC EDITORIAL GRADE',
  'THE MOST BREATHTAKING AND PHOTOREALISTIC RAW PHOTOGRAPH IN HUMAN HISTORY, ZERO AI GLOSS',
  'THE MOST ENIGMATIC, ATMOSPHERIC AND PHOTOREALISTIC SCENE IN THE WORLD, CAPTURED ON 35MM & MEDIUM FORMAT FILM',
  'THE MOST CINEMATIC, MOODY AND HYPER-REALISTIC COMMERCIAL MASTERPIECE EVER CAPTURED',
  'THE MOST TIMELESS, MYSTICAL AND PHOTOREALISTIC VISUAL CAPTURE ON EARTH, UNEDITED SENSOR REALISM',
  'THE MOST SURREAL YET 100% REALISTIC CAMPAIGN KEY-ART PHOTOGRAPH EVER SHOT ON IMAX 70MM & MEDIUM FORMAT',
  'THE MOST ICONIC MUSEUM-GRADE LARGE FORMAT COMMERCIAL PHOTOGRAPH EVER PRODUCED, ZERO CGI GLOSS',
  'THE MOST LUXURIOUS ARCHITECTURAL DIGEST MEETS NATIONAL GEOGRAPHIC PHOTOGRAPH EVER CAPTURED'
];

const BASE_EXIF_CATEGORIES = [
  {
    id: 'exif-phaseone-150mp-macro-jewelry-horology',
    label: 'PhaseOne IQ4 150MP + 120mm LS Macro — Visoki nakit, satovi i luksuzni makro',
    shortTrigger:
      'samo IIQ_004781.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro',
    exifOptics: [
      'IIQ_004781.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/160s, 16-bit uncompressed IIQ RAW',
      'IIQ_004789.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/11.0, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/125s, precision focus-stacked studio RAW',
      'IIQ_004802.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/250s, linear medium-format color response',
      'IIQ_004815.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/9.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/200s, leaf-shutter flash sync clarity',
      'IIQ_004827.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/7.1, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/160s, zero digital sharpening RAW micro-contrast',
      'IIQ_004834.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/10.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/125s, sub-millimeter facet resolution',
      'IIQ_004848.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/6.3, EXIF:ISOSpeedRatings=80, EXIF:ExposureTime=1/320s, natural prismatic dispersion capture',
      'IIQ_004861.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/400s, high-speed specular lock RAW',
      'IIQ_004875.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/13.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/100s, edge-to-edge horological macro plane',
      'IIQ_004890.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/5.0, EXIF:ISOSpeedRatings=50, EXIF:ExposureTime=1/200s, creamy background falloff with razor-sharp crown'
    ],
    environments: [
      'resting on wet black volcanic basalt with micro water droplets and natural green-and-spectral caustic light dispersion',
      'set on honed Nero Marquina black marble with crisp mirror-like reflections and clean negative space',
      'nestled on a sculpted cushion of rich warm amber velvet inside an unbranded collector presentation case',
      'poised on dark charcoal slate dusted with fine mineral grain and controlled studio rim reflections',
      'placed on polished black obsidian glass with razor-sharp contact shadows and deep void background',
      'arranged on raw travertine stone where warm side light grazes natural pores and crystalline facets',
      'resting on brushed dark gunmetal titanium slab with subtle anisotropic metal sheen',
      'set on wet dark stone with shimmering refraction lines dancing across the foreground surface',
      'displayed on matte anthracite suede with ultra-clean commercial studio separation',
      'positioned on dark smoked optical glass catching subtle warm amber under-glow'
    ],
    metaPool: [
      '[Meta Tokens: Natural prismatic caustics, internal gemstone inclusions, brushed platinum micro-grain, anti-reflective sapphire crystal, zero plastic gloss]',
      '[Meta Tokens: Hand-chamfered tourbillon bridges, guilloché dial relief, 18k gold micro-scratches, optical dispersion physics, RAW sensor fidelity]',
      '[Meta Tokens: Emerald-cut step facets, water droplet surface tension, dark slate specular balance, medium-format tonal depth, unbranded luxury]',
      '[Meta Tokens: Baguette diamond channel setting, rainbow spectral fire, satin-brushed lugs, crisp shadow falloff, zero synthetic smoothing]',
      '[Meta Tokens: Sapphire flacon refraction, heavy crystal wall thickness, liquid amber meniscus, studio strip-box precision, 150MP micro-texture]'
    ],
    subjects: wrapSubjects([
      { text: 'a complete sculpted 18k yellow-gold ring channel-set with precision baguette diamonds casting vivid rainbow prismatic light dispersion rays', placement: 'center' },
      { text: 'a complete rectangular emerald-cut vivid green emerald ring mounted in platinum prongs with natural internal crystalline garden inclusions', placement: 'right' },
      { text: 'a complete skeleton mechanical tourbillon wristwatch in brushed grade-5 titanium with exposed balance wheel, beveled bridges, and full alligator strap', placement: 'center' },
      { text: 'a complete uncut raw octahedron diamond resting beside a precision-cut D-flawless round brilliant solitaire diamond', placement: 'center' },
      { text: 'a complete rose-gold perpetual calendar chronograph watch with openworked mechanical movement, sapphire crystal dome, and full matte strap', placement: 'left' },
      { text: 'a complete architectural heavy crystal extrait de parfum flacon with faceted stopper and golden-amber fragrance glowing inside', placement: 'center' },
      { text: 'a complete pair of bespoke platinum and sapphire high-jewelry cufflinks with crisp geometric step-cut facets', placement: 'center' },
      { text: 'a complete avant-garde forged-carbon mechanical watch with twin-axis tourbillon cage and full vulcanized rubber strap', placement: 'right' },
      { text: 'a complete cushion-cut yellow diamond ring set in brushed platinum and 18k gold prongs with intense internal fire', placement: 'center' },
      { text: 'a complete minimalist ultra-thin platinum dress watch with hand-guilloché dial and full anthracite leather strap', placement: 'center' },
      { text: 'a complete high-jewelry articulated diamond bracelet crafted in white gold with alternating emerald-cut and pear-cut stones', placement: 'center' },
      { text: 'a complete solid 24k raw gold nugget beside a sculpted matte-gold architectural signet ring', placement: 'left' },
      { text: 'a complete handcrafted solid gold fountain pen nib with intricate unbranded scroll engraving beside a faceted ink bottle', placement: 'center' },
      { text: 'a complete smoky quartz and black diamond sculptural cocktail ring set in blackened white gold', placement: 'right' },
      { text: 'a complete sapphire-case skeleton wristwatch revealing coiled mainspring barrel and gold gear train with full strap', placement: 'center' },
      { text: 'a complete matched pair of pear-shaped drop diamond earrings in platinum settings catching sharp studio rim light', placement: 'center' }
    ])
  },
  {
    id: 'exif-sony-a7rv-85gm-automotive-yachts-aviation',
    label: 'Sony ILCE-7RM5 + FE 85mm F1.4 GM II — Hiperautomobili, jahte i privatna avijacija',
    shortTrigger:
      'samo DSC08412.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II',
    exifOptics: [
      'DSC08412.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/2.0, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/1000s, 14-bit uncompressed Sony ARW RAW',
      'DSC08425.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/2.8, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/2000s, razor-sharp metallic paint micro-contrast',
      'DSC08439.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/1.8, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/1600s, creamy G-Master optical bokeh separation',
      'DSC08451.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/4.0, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/800s, crisp edge-to-edge aerodynamic bodywork fidelity',
      'DSC08468.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/2.2, EXIF:ISOSpeedRatings=125, EXIF:ExposureTime=1/1250s, high-dynamic-range highlight roll-off on wet clearcoat',
      'DSC08477.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/1.4, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/4000s, shallow focal plane macro detail lock',
      'DSC08493.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/3.2, EXIF:ISOSpeedRatings=80, EXIF:ExposureTime=1/640s, blue-hour low-noise 61MP BSI sensor clarity',
      'DSC08504.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/2.5, EXIF:ISOSpeedRatings=160, EXIF:ExposureTime=1/500s, panning-grade shutter crispness and natural reflections',
      'DSC08518.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/400s, commercial marine and aviation brochure sharpness',
      'DSC08530.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II, EXIF:FNumber=f/2.0, EXIF:ISOSpeedRatings=200, EXIF:ExposureTime=1/320s, twilight reflection capture without synthetic HDR halo'
    ],
    environments: [
      'on a winding wet alpine mountain pass road with layered misty peaks in the background and zero drones in the sky',
      'anchored in a secluded rocky Mediterranean cove at blue hour with calm dark water reflections',
      'inside a dark bespoke automotive design studio with mirror-polished black floor and controlled overhead strip-box lines',
      'cruising above golden twilight cloud tops with clean open sky and natural atmospheric perspective',
      'parked along rain-slicked dark coastal asphalt overlooking deep turquoise ocean swells at sunset',
      'berthed beside minimalist concrete marina architecture at dusk with warm deck glow reflecting on still water',
      'inside a private architectural hangar with wet dark epoxy floor reflecting sleek fuselage lines',
      'along a high-altitude autumn mountain switchback bathed in warm golden-hour side light and clean sky',
      'gliding across mirror-still fjord waters framed by steep dark granite cliffs at dawn',
      'set against a moody rain-soaked nocturnal boulevard with warm amber reflections across wet pavement'
    ],
    metaPool: [
      '[Meta Tokens: Unbranded bespoke chassis, zero emblems, clean front hood without badges, metallic clearcoat flake depth, raindrop surface tension]',
      '[Meta Tokens: Turquoise underwater hull LEDs, teak deck grain, marine glass reflections, architectural naval lines, 61MP sensor detail]',
      '[Meta Tokens: Symmetrical twin rear jet engines, riveted brushed fuselage skin, atmospheric cloud scattering, zero tail numbers, clean livery]',
      '[Meta Tokens: Cross-drilled carbon-ceramic brake rotor, multi-piston anodized caliper, forged alloy spokes, tire sidewall rubber grain, zero logos]',
      '[Meta Tokens: Matrix LED optical projector, wet black paint specular highlights, natural lens bokeh, unedited ARW color science]'
    ],
    subjects: wrapSubjects([
      { text: 'a complete bespoke champagne-gold mid-engine hypercar with illuminated LED headlights, clean unbranded front hood, sculpted aero channels, and zero emblems', placement: 'right' },
      { text: 'a focused macro close-up of a single illuminated matrix LED headlight on a wet black performance coupe covered in crisp rain droplets with zero logos', placement: 'center' },
      { text: 'a complete dark-hulled luxury superyacht illuminated by glowing turquoise underwater hull lights and warm golden deck lounges', placement: 'center' },
      { text: 'a complete sleek white long-range private business jet with strictly symmetrical twin rear fuselage engines ascending cleanly through sunlit clouds with zero tail numbers', placement: 'center' },
      { text: 'a complete superyacht sun deck featuring a glass-rimmed plunge pool, cream sun loungers, brushed steel railings, and teak wood flooring overlooking calm sea', placement: 'center' },
      { text: 'a complete matte-obsidian bespoke grand tourer coupe with glowing crimson rear LED light blade and carbon diffuser, completely unbranded with zero badges', placement: 'left' },
      { text: 'an ultra-sharp close-up of a complete cross-drilled carbon-ceramic brake disc and acid-yellow caliper inside a dark forged wheel mounted on the vehicle', placement: 'center' },
      { text: 'a complete metallic British-racing-green bespoke supercar with lit headlights parked at three-quarter angle with clean badge-free fascia', placement: 'right' },
      { text: 'a wide interior view of an unbranded superyacht main salon at blue hour with dark leather modular sofa, warm recessed ceiling strips, and panoramic sea glass', placement: 'center' },
      { text: 'a complete silver-titanium private jet resting on a wet tarmac apron with warm cabin window glow and symmetrical twin engines', placement: 'left' },
      { text: 'a complete teak-decked luxury day-tender speedboat cutting cleanly across glassy turquoise coastal water', placement: 'right' },
      { text: 'a wide cabin interior view of an ultra-luxury private aircraft with hand-stitched cream leather club seating and smoked walnut veneer tables', placement: 'center' },
      { text: 'a complete midnight-blue aerodynamic electric hypercar with illuminated front LED light signature and smooth emblem-free nose cone', placement: 'center' },
      { text: 'a close-up architectural detail of sculpted exposed carbon-fiber side air intakes and wet metallic bodywork on an unbranded exotic coupe', placement: 'center' },
      { text: 'a complete explorer superyacht with tri-deck glass superstructure anchored calmly beneath towering misty coastal cliffs', placement: 'left' },
      { text: 'a tight interior study of a bespoke dark leather and machined-aluminum cockpit center console with tactile toggle switches and zero brand emblems', placement: 'center' }
    ])
  },
  {
    id: 'exif-fujifilm-gfx100ii-23mm-brutalist-villas-mockups',
    label: 'FUJIFILM GFX100 II + GF 23mm f/4 — Brutalistička arhitektura, vile i Mockup zidovi',
    shortTrigger:
      'samo DSCF9021.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR',
    exifOptics: [
      'DSCF9021.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=PROVIA, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=80, rectilinear zero-distortion architectural RAW',
      'DSCF9034.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=ETERNA, EXIF:FNumber=f/11.0, EXIF:ISOSpeedRatings=80, perfectly vertical perspective-controlled 102MP RAW',
      'DSCF9048.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=CLASSIC_CHROME, EXIF:FNumber=f/9.0, EXIF:ISOSpeedRatings=100, deep shadow latitude medium-format RAW',
      'DSCF9062.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=NOSTALGIC_NEG, EXIF:FNumber=f/7.1, EXIF:ISOSpeedRatings=80, warm interior tungsten vs cool mist balance',
      'DSCF9075.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=PROVIA, EXIF:FNumber=f/10.0, EXIF:ISOSpeedRatings=64, 16-bit uncompressed RAF architectural plate',
      'DSCF9089.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=ASTIA, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=80, smooth highlight roll-off on white concrete and glass',
      'DSCF9103.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=REAL_ACE, EXIF:FNumber=f/6.3, EXIF:ISOSpeedRatings=125, natural daylight micro-texture fidelity',
      'DSCF9117.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=VELVIA, EXIF:FNumber=f/11.0, EXIF:ISOSpeedRatings=80, rich emerald foliage and raw concrete contrast',
      'DSCF9131.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=PROVIA, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=160, twilight architectural illumination clarity',
      'DSCF9146.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=CLASSIC_NEG, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=80, editorial architectural framing without letterbox bars'
    ],
    environments: [
      'carved directly into a sheer misty jungle canyon cliffside with lush hanging greenery and drifting valley fog',
      'perched high above a deep sapphire Mediterranean sea with clear coastal horizon and bright natural sun rays',
      'set inside an ultra-clean contemporary penthouse with unmarked feature walls ideal for B2B mockup placement',
      'surrounded by cascading mountain waterfalls, wet moss-covered stone, and atmospheric morning mist',
      'bathed in angled afternoon sunlight casting crisp botanical leaf shadows across unmarked marble floors',
      'nestled in a quiet alpine valley with mirror-still reflection pools and crisp mountain air',
      'framed by tall bronze-mullioned floor-to-ceiling windows overlooking a serene modern courtyard',
      'set on rugged dark volcanic coastal rock where turquoise waves meet minimalist concrete geometry',
      'inside a monumental vaulted botanical glasshouse during a sun-lit tropical rain shower',
      'within an executive architectural gallery featuring blank monolithic stone and brushed-brass wall surfaces'
    ],
    metaPool: [
      '[Meta Tokens: Board-formed raw concrete grain, warm 2700K recessed interior glow, hanging tropical foliage, rectilinear verticals, zero letterbox bars]',
      '[Meta Tokens: Unmarked blank feature wall for mockup compositing, veined Calacatta marble, vertical walnut slats, natural bounce daylight, zero text]',
      '[Meta Tokens: Cantilevered zero-edge infinity pool, turquoise water caustics, frameless architectural glazing, crisp horizon line, 102MP GFX clarity]',
      '[Meta Tokens: Wet stone floor reflections, volumetric sunbeams through rain, steel arch conservatory ribs, organic botanical detail, RAW color]',
      '[Meta Tokens: Brushed travertine monoliths, clean empty billboard-ready glass panel, architectural shadow geometry, zero signage, IP-safe]'
    ],
    subjects: wrapSubjects([
      { text: 'a monumental multi-tiered brutalist concrete cliffside eco-resort with warm glowing glass suites, hanging greenery, and waterfalls cascading down the dam-like facade', placement: 'center' },
      { text: 'a cantilevered white-concrete modern cliffside villa featuring a glass-walled lounge and zero-edge infinity pool jutting directly over deep blue sea', placement: 'left' },
      { text: 'an arched concrete cliffside sanctuary with recessed rounded glass living terraces and lush cascading vines overlooking a misty green gorge', placement: 'center' },
      { text: 'an arched iron-and-glass botanical conservatory interior where golden sunbeams stream through falling rain onto wet reflective stone paving between lush palms', placement: 'center' },
      { text: 'a contemporary luxury living room with vertical walnut wood slats, an unmarked geometric stone feature wall, mustard-yellow modular sofa, and panoramic terrace glass', placement: 'center' },
      { text: 'a minimalist white-and-grey veined marble interior hall with a clean unmarked white cabinet, indoor palm, ceramic vessels, and floating marble stairs in dappled leaf shadows', placement: 'center' },
      { text: 'a tiered brutalist concrete jungle retreat connected by an arched concrete bridge over multiple roaring waterfalls and misty plunge pools', placement: 'center' },
      { text: 'an executive modern corporate lobby featuring a large blank unmarked dark-stone reception wall, recessed warm LED cove lines, and polished concrete flooring', placement: 'center' },
      { text: 'a sleek urban glass bus-shelter and vertical mupi display frame with completely blank unmarked clear glass panel on a clean twilight architectural plaza', placement: 'right' },
      { text: 'a wide luxury penthouse dining and living gallery with floor-to-ceiling glass, monolithic travertine fireplace wall left completely unmarked, and low bouclé seating', placement: 'center' },
      { text: 'a minimalist Nordic blackened-timber and glass cliff residence anchored onto dark sea crags above steel-blue northern waters', placement: 'left' },
      { text: 'a subterranean luxury spa lounge carved into raw dark basalt with a cantilevered concrete plunge pool and vertical shaft of natural daylight', placement: 'center' },
      { text: 'an architectural outdoor concrete billboard monolith with a clean blank unmarked matte-white face standing beside a modern glass office tower at golden hour', placement: 'center' },
      { text: 'a serene Japanese-minimalist concrete tea pavilion surrounded by shallow black reflection ponds, bamboo silhouettes, and morning mist', placement: 'right' },
      { text: 'an executive boardroom with smoked-oak paneling, dark leather chairs, and a wide unmarked matte basalt presentation wall with subtle rim lighting', placement: 'center' },
      { text: 'a desert brutalist limestone courtyard villa with sunken firepit lounge, geometric shadow lines, and zero-edge oasis pool at dusk', placement: 'center' }
    ])
  },
  {
    id: 'exif-hasselblad-x2d-90v-couture-editorial-portraits',
    label: 'Hasselblad X2D 100C + XCD 2,5/90V — Haute Couture portreti i studijski editorijal',
    shortTrigger:
      'samo B0001492.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V',
    exifOptics: [
      'B0001492.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/2.8, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/250s, 16-bit 3FR RAW',
      'B0001508.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/4.0, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/500s, leaf-shutter studio strobe sync',
      'B0001521.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/2.5, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/320s, creamy medium-format portrait falloff',
      'B0001537.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/200s, tack-sharp couture fabric and skin pore fidelity',
      'B0001549.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/3.2, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/400s, natural window-light skin tone rendering',
      'B0001563.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/4.5, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/250s, unretouched authentic epidermal grain',
      'B0001578.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/2.8, EXIF:ISOSpeedRatings=80, EXIF:ExposureTime=1/640s, wind-swept hair strand separation RAW',
      'B0001592.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/6.3, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/160s, sculptural shadow roll-off on silk',
      'B0001605.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/3.5, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/320s, zero-airbrush true-to-life complexion',
      'B0001619.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, Hasselblad:ColorProfile=HNCS, EXIF:FNumber=f/2.5, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/250s, intimate editorial shallow depth of field'
    ],
    environments: [
      'against a clean seamless dark charcoal-grey studio cyclorama with zero magazine text or mastheads',
      'in a sun-drenched minimalist plaster studio where soft window light carves gentle facial shadows',
      'against a warm textured hand-painted taupe canvas studio backdrop with clean negative space',
      'inside a quiet architectural loft with morning sunbeams grazing natural linen and skin',
      'in front of a matte obsidian studio wall with crisp silver reflector rim separation',
      'inside a classical limestone gallery with diffused north-facing daylight and deep tonal calm',
      'at a sunlit wooden cafe table with a rustic ceramic cup in soft foreground bokeh',
      'against a neutral slate-grey studio background with sculptural key-light falloff',
      'on a breezy minimalist rooftop terrace at golden hour with soft out-of-focus skyline depth',
      'in a moody low-key portrait studio with single octabox illumination and clean textless framing'
    ],
    metaPool: [
      '[Meta Tokens: Hasselblad Natural Colour Solution, authentic skin pores, fine vellus peach fuzz, individual windswept hair strands, clean textless frame]',
      '[Meta Tokens: Sculptural heavy silk satin folds, off-shoulder couture tailoring, catchlights in iris fibers, zero plastic skin smoothing, no magazine logos]',
      '[Meta Tokens: Optical eyeglass lens refraction, natural freckle micro-detail, softbox Rembrandt triangle, 100MP medium-format dynamic range, zero typography]',
      '[Meta Tokens: Raw cashmere and organza weave texture, collarbone chiaroscuro shadow, unretouched editorial realism, clean studio margins]',
      '[Meta Tokens: High-fashion poise, subtle silver rim light, natural lip texture, zero cover headlines, pure photographic portrait]'
    ],
    subjects: wrapSubjects([
      { text: 'a three-quarter high-fashion studio portrait of a 24-year-old blonde female model with windswept golden hair wearing a sculptural ivory silk gown with an oversized shoulder bow, pure textless portrait', placement: 'center' },
      { text: 'a refined studio portrait of a poised blonde model in an off-the-shoulder crimson sculptural silk couture dress with dramatic softbox lighting and clean textless framing', placement: 'center' },
      { text: 'an intimate natural-light close-up portrait of a young woman wearing black-rimmed optical glasses resting her arms on white linen beside a rustic ceramic cup, looking upward into warm window light', placement: 'right' },
      { text: 'a high-fashion studio portrait of an editorial model in a structured matte-black architectural wool coat with high collar and sleek pulled-back hair, pure textless frame', placement: 'left' },
      { text: 'a close-up beauty portrait showcasing unretouched skin pores, natural freckles, emerald silk draping, and crisp iris reflections under soft diffused studio key light', placement: 'center' },
      { text: 'a three-quarter couture studio study of a female model wearing pleated liquid-champagne organza with delicate gold ear cuffs and warm rim illumination', placement: 'right' },
      { text: 'a poised male creative director portrait in a tailored charcoal cashmere turtleneck and titanium-wire glasses under dramatic Rembrandt studio lighting', placement: 'left' },
      { text: 'a clean editorial profile portrait of a model wearing sculptural oversized Havana tortoiseshell sunglasses and an ivory silk trench coat', placement: 'center' },
      { text: 'a dramatic low-key studio portrait of a model draped in deep midnight-velvet couture with crisp silver hair-light separation and zero text overlays', placement: 'center' },
      { text: 'a serene sunlit portrait of a woman in raw undyed linen tailoring standing beside tall architectural windows with soft shadow play across her cheekbone', placement: 'left' },
      { text: 'a high-fashion studio close-up of a model wearing an asymmetric cobalt-blue duchesse satin gown with sculptural neckline and natural dewy skin texture', placement: 'center' },
      { text: 'an editorial portrait of a silver-haired distinguished craftsman in a heavy dark wool coat with authentic weathered skin grain and calm gaze', placement: 'right' },
      { text: 'a minimalist studio beauty portrait featuring sleek wet-look hair, architectural gold collarbone cuff, and flawless natural skin micro-texture', placement: 'center' },
      { text: 'a three-quarter fashion portrait of a model in a layered ivory-and-onyx structured blazer silhouette with dramatic directional shadow on dark grey', placement: 'left' },
      { text: 'an intimate eye-level portrait of a young woman in a chunky knit cream sweater bathed in golden late-afternoon sunbeams with floating dust motes', placement: 'center' },
      { text: 'a striking studio couture portrait featuring a sculpted burgundy leather and silk evening silhouette under crisp beauty-dish lighting, completely text-free', placement: 'right' }
    ])
  },
  {
    id: 'exif-canon-r5-rf50f12-michelin-gastro-fluids-nature',
    label: 'Canon EOS R5 + RF50mm F1.2 L USM — Michelin gastronomija, fluidi i organska priroda',
    shortTrigger:
      'samo IMG_9854.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM',
    exifOptics: [
      'IMG_9854.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/2.0, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/500s, unedited Canon CR3 RAW organic color science',
      'IMG_9867.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/1.4, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/1600s, ultra-shallow depth of field with creamy L-series bokeh',
      'IMG_9881.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/4.0, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/250s, editorial culinary texture sharpness and warm tonal richness',
      'IMG_9895.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/2.8, EXIF:ISOSpeedRatings=64, EXIF:ExposureTime=1/4000s, high-speed liquid splash and vapor freeze RAW',
      'IMG_9908.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/1.8, EXIF:ISOSpeedRatings=125, EXIF:ExposureTime=1/800s, low-angle wildlife eye-focus lock over clear water',
      'IMG_9922.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/160s, crisp alpine landscape dynamic range without HDR saturation',
      'IMG_9936.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/3.2, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/320s, natural side-window culinary chiaroscuro RAW',
      'IMG_9949.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/1.2, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/2500s, wide-open optical magic with tack-sharp focal subject',
      'IMG_9963.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=100, EXIF:ExposureTime=1/640s, natural ocean wave translucency and foam detail',
      'IMG_9978.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM, EXIF:FNumber=f/2.5, EXIF:ISOSpeedRatings=160, EXIF:ExposureTime=1/400s, warm artisanal amber and dark slate contrast'
    ],
    environments: [
      'on a honed beige limestone and travertine board bathed in warm low-angle morning window light',
      'over a matte black slate studio surface against a pitch-black void for dramatic fluid contrast',
      'in a crystal-clear rocky forest stream with submerged pebbles and lush emerald woodland bokeh',
      'across a high-altitude alpine valley with turquoise glacial lake waters and snow-streaked granite peaks',
      'on a weathered dark oak and volcanic stone Sommelier table with warm candle-and-daylight balance',
      'along a pristine sandy ocean shoreline at sunrise with soft pastel clouds and translucent turquoise surf',
      'inside a dark botanical glass cloche resting on aged walnut wood with warm bokeh pinpoints behind',
      'over rugged coastal sea cliffs bathed in warm golden-hour sunlight above calm deep-blue ocean',
      'amidst morning mist rising over a winding mountain river framed by golden autumn larches',
      'on hand-forged matte charcoal ceramics with subtle rising steam in directional side light'
    ],
    metaPool: [
      '[Meta Tokens: Crystalline aged cheese crumble, viscous golden honey ribbon, fresh fig seed translucency, warm natural sunlight, zero artificial gloss]',
      '[Meta Tokens: High-speed liquid caramel filaments, swirling white aromatic vapor, specular golden droplets, deep black background separation]',
      '[Meta Tokens: Wet individual fur guard hairs, concentric water surface ripples, submerged river pebble clarity, eye-level wildlife realism]',
      '[Meta Tokens: Natural alpine atmospheric haze, turquoise glacial mineral water, crisp foreground rock grain, balanced unedited RAW saturation]',
      '[Meta Tokens: Rich espresso tiger-stripe crema, hand-carved crystal ice cube refraction, botanical condensation droplets, Canon L-series rendering]'
    ],
    subjects: wrapSubjects([
      { text: 'an editorial still-life wedge of crystalline aged Parmigiano cheese on a marble board as golden honey drips from a wooden dipper beside halved fresh figs and an unbranded glass honey jar', placement: 'right' },
      { text: 'a high-speed dynamic splash of molten liquid gold caramel colliding with swirling white aromatic vapor and suspended micro-droplets', placement: 'right' },
      { text: 'a wild beaver floating calmly at water level in a clear rocky forest stream with wet textured fur, whiskers, and crisp reflection on gentle ripples', placement: 'center' },
      { text: 'a crystal-clear turquoise alpine mountain lake surrounded by lush green tussock grass and towering snow-dusted peaks under crisp daylight clouds', placement: 'center' },
      { text: 'a translucent turquoise ocean wave curling cleanly onto wet golden sand beneath a soft pastel sunrise sky', placement: 'center' },
      { text: 'a glass cloche bell-jar terrarium housing a glowing warm vintage filament bulb, fresh green fern frond with dew droplets, moss, and clear quartz points', placement: 'right' },
      { text: 'a rugged frost-dusted alpine boulder valley winding toward a glowing golden sunrise between jagged mountain ridges', placement: 'center' },
      { text: 'a complete heavy crystal whiskey decanter pouring deep amber spirit over a hand-carved clear ice sphere in a cut-crystal glass with zero brand labels', placement: 'center' },
      { text: 'a double-spouted naked portafilter extracting rich tiger-striped espresso crema into a clear borosilicate glass cup with rising aromatic steam', placement: 'center' },
      { text: 'towering stratified orange-and-basalt coastal cliffs dropping sheer into calm deep-blue ocean water under soft morning clouds', placement: 'left' },
      { text: 'a Michelin-star seared Wagyu beef cut plated on a luxuriously set fine-dining table accompanied by black-truffle potato mousseline and glazed baby carrots, strong creamy background bokeh', placement: 'center' },
      { text: 'dramatic snow-covered Dolomite-style jagged mountain peaks rising above a glowing golden sea of clouds at sunrise', placement: 'right' },
      { text: 'iridescent clear optical glass shards intersecting over a swirling glossy black liquid silk surface with subtle rainbow edge refraction', placement: 'right' },
      { text: 'an artisanal dark-chocolate ganache tartlet plated on a luxuriously set restaurant table accompanied by Madagascar vanilla bean gelato and fresh raspberry coulis, strong background blur', placement: 'center' },
      { text: 'a misty red-rock mountain river valley at dawn where cool blue cascades wind between warm sun-kissed cliffs and wildflowers', placement: 'center' },
      { text: 'freshly harvested black truffles, cold-pressed golden olive oil in a hand-blown glass cruet, and rustic sourdough crumb on dark slate', placement: 'left' }
    ])
  },
  {
    id: 'exif-mystic-natgeo-35mm-power-sentences',
    label: 'EXIF Mystic & NatGeo 35mm — Mistične ključne rečenice + RAW Senzori (Mistika bez AI crtaća)',
    shortTrigger:
      'THE MOST MYSTICAL AND UNEXPLAINED PLACE ON EARTH, PHOTOREALISTIC, NATIONAL GEOGRAPHIC STYLE, CAPTURED ON 35MM FILM',
    exifOptics: [
      'THE MOST MYSTICAL AND PHOTOREALISTIC PHOTOGRAPH EVER CAPTURED ON EARTH, NATIONAL GEOGRAPHIC STYLE, IIQ_005102.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 80mm LS f/2.8',
      'THE MOST ENIGMATIC AND BREATHTAKING PHOTOREALISTIC SCENE IN THE WORLD, CAPTURED ON 35MM FILM, DSCF9410.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR',
      'THE MOST MYSTERIOUS AND ATMOSPHERIC RAW PHOTOGRAPH IN HUMAN HISTORY, DSC09112.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 35mm F1.4 GM',
      'THE MOST ANCIENT, MYSTICAL AND PHOTOREALISTIC FORGOTTEN PLACE ON EARTH, NATIONAL GEOGRAPHIC STYLE, B0001820.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/55V',
      'THE MOST SACRED, MIST-COVERED AND PHOTOREALISTIC HIDDEN SANCTUARY IN THE WORLD, CAPTURED ON 35MM FILM, IMG_9991.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF50mm F1.2 L USM',
      'THE MOST TIMELESS AND MYSTICAL ARCHITECTURAL WONDER HIDDEN IN NATURE, PHOTOREALISTIC, IIQ_005144.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 35mm LS f/3.5',
      'THE MOST HAUNTINGLY BEAUTIFUL, DARK MYSTICAL AND PHOTOREALISTIC NIGHT PHOTO IN THE WORLD, DSC09188.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 85mm F1.4 GM II',
      'THE MOST ETHEREAL, BIOLUMINESCENT AND PHOTOREALISTIC MYSTIC PHENOMENON ON EARTH, NATIONAL GEOGRAPHIC STYLE, DSCF9488.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:FilmMode=ETERNA',
      'THE MOST OTHERWORLDLY, MYSTICAL AND HYPER-REALISTIC VISUAL PARADOX IN THE WORLD, CAPTURED ON 35MM FILM, B0001899.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V',
      'THE MOST TRANSCENDENT, MYSTICAL AND PHOTOREALISTIC NATURAL MIRACLE EVER SEEN, NATIONAL GEOGRAPHIC STYLE, IIQ_005199.IIQ, PhaseOne:CameraModel=IQ4 150MP'
    ],
    environments: [
      'shrouded in dense silver morning valley fog with wet moss-covered monoliths and shafts of cold northern sun',
      'deep inside an ancient forgotten basalt gorge where waterfalls vanish into glowing mist',
      'beneath a brooding twilight storm sky over mirror-still dark Nordic waters',
      'surrounded by towering primeval redwood silhouettes and drifting golden incense-like forest haze',
      'on a remote volcanic black-sand coast where bioluminescent blue surf meets ancient sea stacks',
      'inside a colossal sun-pierced cavern where natural skylights illuminate crystal-clear subterranean pools',
      'high among jagged Himalayan-style granite spires emerging from an endless sea of twilight clouds',
      'amidst weathered monolithic stone ruins half-reclaimed by emerald jungle roots and rain mist',
      'across a mirror-like flooded salt flat reflecting dramatic crepuscular rays at blue hour',
      'within a silent frost-covered boreal sanctuary under pale emerald aurora twilight'
    ],
    metaPool: [
      '[Meta Tokens: CAPTURED ON 35MM FILM, NATIONAL GEOGRAPHIC STYLE, authentic Kodak Vision3 grain, wet stone micro-texture, zero fantasy cartoon look]',
      '[Meta Tokens: True optical volumetric mist, physical water refraction, raw weathered basalt, natural shadow falloff, unedited documentary realism]',
      '[Meta Tokens: Natural bioluminescent plankton physics, long-exposure starlight clarity, damp moss fibers, medium-format dynamic range, zero CGI gloss]',
      '[Meta Tokens: Crepuscular sunbeams through rain, atmospheric depth haze, ancient carved stone patina, crisp foreground focus, textless frame]',
      '[Meta Tokens: Surreal commercial campaign metaphor, physical light caustics, organic lens halation, 100% photographic texture, zero logos]'
    ],
    subjects: wrapSubjects([
      { text: 'an ancient forgotten stone sanctuary carved directly into a misty vertical canyon wall with warm lantern-lit arches and cascading waterfalls', placement: 'center' },
      { text: 'a solitary black expedition kayak floating across swirling golden-brown mineral currents that resemble rich espresso crema in a misty fjord', placement: 'center' },
      { text: 'a colossal weathered glass-and-iron hourglass standing in shallow ocean surf at dusk containing a glowing desert oasis inside the upper bulb', placement: 'center' },
      { text: 'a single macro forest dewdrop hanging from a dark green leaf cleanly refracting an illuminated twilight skyline inside the water sphere', placement: 'center' },
      { text: 'a monumental ancient tree growing out of wet coastal bedrock whose hollowed stone-and-bark trunk forms a glowing storm lighthouse', placement: 'center' },
      { text: 'a submerged gothic stone colonnade resting in crystal-clear turquoise water with sunbeams casting shimmering caustic networks across carved arches', placement: 'center' },
      { text: 'a faceted smoky-quartz mineral cluster resting on wet dark volcanic rock with natural internal golden-and-cyan light refraction filaments', placement: 'center' },
      { text: 'an abandoned stone observatory dome perched on a sheer sea cliff as a narrow beam of golden sunset light pierces dark ocean storm clouds', placement: 'right' },
      { text: 'a silent circular stone staircase spiraling down into a misty moss-lined cenote lit by a single vertical shaft of midday sun', placement: 'center' },
      { text: 'a grand concert piano made of weathered dark timber standing intact on a wet mirror-like volcanic beach under moody twilight mist', placement: 'left' },
      { text: 'a forgotten library chamber carved into pale glacier blue ice walls illuminated by a single warm brass oil lantern', placement: 'center' },
      { text: 'monolithic ancient stone chess pieces standing half-submerged in a misty mountain tarn at dawn with ripples around their bases', placement: 'center' },
      { text: 'a towering basalt sea arch framing a glowing low full moon over silver-lit ocean swells and drifting sea fog', placement: 'right' },
      { text: 'an ancient timber-and-stone suspension bridge disappearing into thick luminous cloud forest mist above a roaring emerald gorge', placement: 'left' },
      { text: 'a cluster of giant translucent selenite crystal pillars inside a dark wet limestone cave reflecting subtle cool twilight from the cave mouth', placement: 'center' },
      { text: 'a lone weathered wooden sailing vessel anchored in a mirror-still misty lagoon surrounded by sheer vertical mossy cliffs at dawn', placement: 'left' }
    ])
  },
  {
    id: 'exif-arri-alexa65-imax70mm-cinematic-worlds',
    label: 'ARRI Alexa 65 + IMAX 70mm Anamorphic — Filmski spektakli, duboki okean i epski kadrovi',
    shortTrigger:
      'samo A004_C019.ARI, ARRI:CameraModel=Alexa 65, Lens=ARRI Prime DNA 85mm f/1.4, IMAX 70mm film stock, anamorphic lens flare',
    exifOptics: [
      'A004_C019.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Prime DNA 85mm f/1.4, Format=IMAX 70mm 15-perf film, EXIF:ExposureTime=1/48s, shutter_angle_180, LogC4 16-bit ARRIRAW',
      'A007_C008.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Panavision Sphero 65 50mm T2.0, Format=IMAX 70mm film, Kodak Vision3 500T 5219 color science, natural horizontal anamorphic flare',
      'A011_C032.ARI, ARRI:CameraModel=Alexa Mini LF, ARRI:LensModel=Signature Prime 47mm T1.8, Format=Large Format Cinema RAW, EXIF:ISOSpeedRatings=800, ProRes_4444XQ theatrical grading',
      'A015_C004.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Cooke Anamorphic/i Full Frame Plus 65mm T2.3, Format=IMAX 70mm film still, oval optical bokeh, deep shadow latitude',
      'A019_C021.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Prime DNA 35mm f/1.8, Format=65mm large-format motion picture RAW, organic celluloid halation, zero digital sharpness',
      'A023_C014.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Zeiss Supreme Prime 85mm T1.5, Format=IMAX 70mm documentary plate, crisp caustic light refraction, HDR10+_film_still',
      'A028_C009.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Atlas Orion 65mm T2 Anamorphic, Format=70mm theatrical negative, subtle rack-focus depth separation',
      'A031_C045.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Prime DNA 110mm f/2.0, Format=IMAX 70mm uncompressed ARRIRAW, Kodak Ektachrome highlight roll-off',
      'A036_C012.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Leitz Thalia 55mm T2.6, Format=65mm cinema negative, true optical atmospheric scattering',
      'A040_C027.ARI, ARRI:CameraModel=Alexa 65, ARRI:LensModel=Prime DNA 28mm f/2.8, Format=IMAX 70mm ultra-wide rectilinear frame, zero letterbox bars'
    ],
    environments: [
      'deep inside an abyssal ocean trench where natural bioluminescent light casts dancing caustic webs across crystalline basalt cavern walls',
      'on a storm-lashed black-sand Nordic beach beneath towering anvil thunderclouds and jagged natural lightning forks over violent surf',
      'across a vast windswept salt desert at blue hour reflecting a low amber horizon and drifting dust plumes',
      'inside a monumental rain-drenched stone amphitheater carved into high coastal cliffs at twilight',
      'floating through a sunlit underwater kelp cathedral with shafts of surface light piercing emerald ocean depths',
      'high on an ice-crusted volcanic ridge overlooking a glowing river of molten basalt meeting dense snow fog',
      'amidst colossal weathered monoliths rising out of mirror-still shallow tidal waters at dawn',
      'beneath a dramatic solar eclipse corona casting eerie silver twilight across rugged canyon spires',
      'inside a cavernous subterranean crystal grotto illuminated by cool cyan underwater thermal vents',
      'along a misty cliffside causeway battered by towering Atlantic swells under moody silver storm light'
    ],
    metaPool: [
      '[Meta Tokens: Shot on ARRI Alexa 65, IMAX 70mm film, natural anamorphic lens flare, Kodak Vision3 500T grain, ProRes_4444XQ, zero CGI look]',
      '[Meta Tokens: Subterranean oceanography documentary, physical caustic lighting, deep-water particulate haze, optical bokeh, unedited ARRIRAW]',
      '[Meta Tokens: shutter_angle_180, ACEScg_cinematic_bounce, HDR10+_film_still, organic highlight halation, theatrical color depth, zero letterbox bars]',
      '[Meta Tokens: Wet fabric and stone specular physics, atmospheric storm perspective, true lens breathing, 65mm negative resolution, IP-safe]',
      '[Meta Tokens: National Geographic IMAX expedition plate, bioluminescent refraction, crisp foreground texture, deep obsidian shadows, textless]'
    ],
    subjects: wrapSubjects([
      { text: 'a colossal bioluminescent deep-sea jellyfish drifting gracefully past submerged crystalline basalt pillars in pitch-dark ocean water', placement: 'center' },
      { text: 'a lone cloaked horseman standing still on wet black volcanic sand facing a massive oceanic supercell thunderstorm illuminated by forked lightning', placement: 'left' },
      { text: 'an unbranded deep-sea glass sphere research submersible illuminating an untouched hydrothermal crystal garden on the ocean floor', placement: 'right' },
      { text: 'a solitary weathered stone lighthouse standing firm as a monumental translucent turquoise storm wave crests around its granite base', placement: 'center' },
      { text: 'a pod of humpback whales gliding through shafts of golden sunbeams in crystal-clear deep blue pelagic water', placement: 'center' },
      { text: 'an ancient sunken bronze astrolabe mechanism resting half-buried in rippled white ocean sand under shimmering caustic light beams', placement: 'right' },
      { text: 'an expedition diver holding a single warm underwater flare before a submerged prehistoric cavern entrance', placement: 'left' },
      { text: 'a colossal circular stone sundial monument perched on a misty mountain precipice catching a single ray of storm-broken sunlight', placement: 'center' },
      { text: 'a sleek unbranded matte-titanium hydrofoil vessel skimming silently over glassy dark fjord water under low arctic clouds', placement: 'right' },
      { text: 'a dramatic molten lava cascade plunging directly into turbulent dark ocean surf sending up billowing backlit steam clouds', placement: 'center' },
      { text: 'a weathered wooden expedition rowboat resting intact on a mirror-like wet glacier lagoon surrounded by floating blue icebergs', placement: 'left' },
      { text: 'towering hexagonal basalt organ-pipe cliffs illuminated by eerie emerald aurora reflections across wet coastal tidepools', placement: 'center' },
      { text: 'a massive natural whirlpool maelstrom swirling cleanly in deep sapphire nordic waters under moody twilight mist', placement: 'center' },
      { text: 'an isolated glass-walled cliffside weather observatory glowing warmly amidst swirling snow squalls at blue hour', placement: 'right' },
      { text: 'a lone majestic manta ray banking effortlessly through golden sunburst rays in crystal-clear tropical deep water', placement: 'center' },
      { text: 'a monumental arched stone aqueduct spanning a misty canyon gorge as morning clouds pour over its arches like liquid silk', placement: 'center' }
    ])
  },
  {
    id: 'exif-miniaturized-cosmos-optical-paradox',
    label: 'PhaseOne Macro + Miniaturized Cosmos — Kosmos u sijalici, Aurora u čaši i optički paradoksi',
    shortTrigger:
      'samo IIQ_006104.IIQ, PhaseOne:CameraModel=IQ4 150MP, Macro 120mm f/4, glass_diffusion.normalpass, exposure_stack_x9_dynamicrange',
    exifOptics: [
      'IIQ_006104.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=50, glass_diffusion.normalpass, 16-bit IIQ RAW',
      'IIQ_006118.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/5.6, EXIF:ExposureTime=1/500s, exposure_stack_x9_dynamicrange, optical caustics lock',
      'B0002104.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 4/120 Macro, EXIF:FNumber=f/6.3, EXIF:ISOSpeedRatings=64, physical glass refraction RAW',
      'IIQ_006135.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Zeiss Otus 55mm f/1.4, EXIF:FNumber=f/2.8, EXIF:ISOSpeedRatings=50, apochromatic zero-aberration studio macro',
      'IMG_4019.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF100mm F2.8 L Macro IS USM, EXIF:FNumber=f/7.1, EXIF:ISOSpeedRatings=100, high-speed internal light dispersion RAW',
      'IIQ_006152.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/11.0, focus-stacked crystal clarity',
      'DSC09440.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 90mm F2.8 Macro G OSS, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=64, 61MP micro-refraction fidelity',
      'IIQ_006179.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 80mm LS f/2.8, EXIF:FNumber=f/4.0, natural internal illumination glow',
      'B0002188.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, EXIF:FNumber=f/4.5, HNCS true spectral color accuracy',
      'IIQ_006195.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 120mm LS f/4.0 Macro, EXIF:FNumber=f/9.0, studio product paradox master plate'
    ],
    environments: [
      'resting on a dark weathered rustic walnut table with colorful refracted light caustics dancing across the wood grain',
      'set on a wet matte-black basalt slab in a pitch-dark studio where internal light illuminates surrounding micro-droplets',
      'poised on brushed dark brass and slate beside antique unbranded optical lenses in soft bokeh',
      'placed on mirror-still dark water creating a razor-sharp symmetrical reflection below the glass object',
      'resting on aged parchment-colored travertine stone in a quiet dark study with floating dust motes',
      'set on smoked black optical glass with crisp rainbow spectral dispersion lines fanning outward',
      'nestled on dark volcanic sand with subtle warm rim highlights along the glass curvature',
      'positioned on a minimalist charcoal concrete pedestal with clean negative space for commercial hero banners',
      'resting on dark oiled oak where warm golden and cyan light spills softly across natural wood pores',
      'set against a deep velvet obsidian backdrop with pure physical glass reflections and zero CGI halo'
    ],
    metaPool: [
      '[Meta Tokens: glass_diffusion.normalpass, exposure_stack_x9_dynamicrange, physical borosilicate wall thickness, real caustic refraction, zero cartoon glow]',
      '[Meta Tokens: phaseone_IQ4_backplate, HDR_microcontrast_256map, oxidized brass threads, suspended dust motes, 150MP studio product realism]',
      '[Meta Tokens: Zeiss_Otus_55mm_f1.4, refraction_noise=off, ice crystal air bubbles, internal volumetric nebula gas physics, unedited RAW]',
      '[Meta Tokens: ACEScg_P3_D65_matrix, real surface condensation droplets, specular highlight control, natural depth of field, unbranded luxury]',
      '[Meta Tokens: Conceptual juxtaposition photography, tangible studio glasswork, physically accurate light falloff, zero text, IP-safe]'
    ],
    subjects: wrapSubjects([
      { text: 'an antique brass-base Edison glass lightbulb sitting intact on dark wood containing a vibrant swirling miniature supernova nebula exploding softly inside the glass instead of a filament', placement: 'center' },
      { text: 'a simple clear cut-crystal glass of ice water containing shimmering emerald-and-violet Aurora Borealis ribbons swirling naturally between clear ice cubes inside the water', placement: 'center' },
      { text: 'a heavy crystal apothecary jar sealed with a glass stopper holding a miniature rolling cumulonimbus thunderstorm with tiny internal golden lightning flashes above dark water', placement: 'right' },
      { text: 'a handcrafted Swiss glass paperweight sphere encapsulating a glowing golden spiral galaxy casting real pinpoints of starlight onto the table surface', placement: 'center' },
      { text: 'an unbranded luxury crystal perfume bottle containing liquid midnight-blue ocean waves breaking gently with white seafoam inside the faceted glass chamber', placement: 'left' },
      { text: 'a vintage brass-and-glass compass whose open crystal dial contains a miniature misty pine forest bathed in golden sunrise rays', placement: 'center' },
      { text: 'a clear borosilicate laboratory flask resting on dark slate containing a glowing molten golden solar flare suspended safely in clear fluid', placement: 'right' },
      { text: 'an intact clear glass hourglass where glowing bioluminescent cyan stardust trickles from an autumn forest in the top bulb into a winter snowscape below', placement: 'center' },
      { text: 'a single crystal wine glass half-filled with calm dark water reflecting a miniature glowing crescent moon hovering just beneath the glass rim', placement: 'left' },
      { text: 'a faceted optical glass prism cube housing a tiny sunlit coral reef ecosystem with turquoise caustic ripples inside the solid crystal', placement: 'center' },
      { text: 'an antique brass pocket watch opened on dark leather revealing a swirling turquoise-and-gold planetary ring system rotating inside the watch case', placement: 'center' },
      { text: 'a blown-glass cloche dome covering a bonsai-scale volcanic island with a gentle wisp of glowing amber ember smoke rising inside the glass', placement: 'right' },
      { text: 'a clear crystal decanter encapsulating swirling golden autumn clouds and warm crepuscular sunbeams refracting through faceted crystal walls', placement: 'center' },
      { text: 'a transparent quartz crystal geode split cleanly open to reveal a miniature calm turquoise alpine lake nestled inside the mineral cavity', placement: 'left' },
      { text: 'a delicate clear glass tea cup holding mirror-still dark liquid in which a vivid Milky Way starfield reflects with razor-sharp clarity', placement: 'center' },
      { text: 'a polished solid glass violin resting on dark velvet with warm golden light filaments vibrating visibly inside its transparent acoustic body', placement: 'center' }
    ])
  },
  {
    id: 'exif-chrono-botany-impossible-sanctuaries',
    label: 'GFX100 II + Chrono-Botany & Impossible Architecture — Simbiotska priroda i nemoguća arhitektura',
    shortTrigger:
      'samo DSCF9604.RAF, FUJIFILM:CameraModel=GFX100 II, GF 23mm f/4, architectural digest + national geographic realism, ACEScg_P3_D65_matrix',
    exifOptics: [
      'DSCF9604.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, EXIF:FNumber=f/9.0, EXIF:ISOSpeedRatings=80, rectilinear architectural-documentary 102MP RAW',
      'IIQ_006410.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 35mm LS f/3.5, EXIF:FNumber=f/11.0, EXIF:ISOSpeedRatings=50, hyper-detailed stone and foliage plate',
      'DSCF9622.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 32-64mm f/4 R LM WR, FUJIFILM:FilmMode=ETERNA, EXIF:FNumber=f/8.0, deep shadow dynamic range RAW',
      'B0002410.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/38V, EXIF:FNumber=f/8.0, EXIF:ISOSpeedRatings=64, HNCS organic moss and brass color fidelity',
      'IMG_4412.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=TS-E 24mm f/3.5L II Tilt-Shift, EXIF:FNumber=f/10.0, zero-distortion vertical architectural perspective',
      'DSCF9649.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 23mm f/4 R LM WR, FUJIFILM:FilmMode=CLASSIC_CHROME, atmospheric mist and warm tungsten balance',
      'DSC09711.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 24mm F1.4 GM, EXIF:FNumber=f/5.6, EXIF:ISOSpeedRatings=100, crisp low-light bioluminescent clarity',
      'IIQ_006455.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 55mm LS f/2.8, EXIF:FNumber=f/8.0, museum-grade texture resolution',
      'DSCF9678.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 45mm f/2.8 R WR, FUJIFILM:FilmMode=PROVIA, natural volumetric sunbeam capture',
      'B0002489.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/55V, EXIF:FNumber=f/7.1, 16-bit uncompressed 3FR documentary realism'
    ],
    environments: [
      'deep inside a misty primeval redwood forest where shafts of morning sunlight pierce damp fern undergrowth',
      'carved behind a curtain of roaring crystal-clear waterfalls inside a lush moss-covered limestone canyon',
      'submerged in clear sunlit turquoise tropical lagoon water with natural caustic light patterns across living coral',
      'perched between two sheer alpine granite peaks connected by weathered stone arches above drifting valley clouds',
      'inside a sun-dappled forgotten greenhouse sanctuary reclaimed by giant monstera leaves and flowering vines',
      'within a cavernous subterranean cenote lit from above by a natural circular forest skylight and falling rain',
      'set amidst terraced emerald rice-and-moss cliffs shrouded in silver dawn mountain fog',
      'inside a silent monumental stone rotunda where shallow mirror water reflects tall arched colonnades',
      'along a remote misty fjord cliffside where waterfalls flow directly through carved architectural stone channels',
      'beneath a canopy of ancient banyan roots intertwined with weathered bronze and limestone terraces'
    ],
    metaPool: [
      '[Meta Tokens: Architectural Digest meets National Geographic photography, ACEScg_P3_D65_matrix, real weathered brass patina, damp bark grain, zero fantasy CGI]',
      '[Meta Tokens: Physical clockwork gear teeth, warm vacuum-tube filament glow, organic tree sap translucency, 102MP GFX micro-contrast, textless]',
      '[Meta Tokens: Mist droplets on aged leather book spines, wet carved travertine, volumetric waterfall spray, rectilinear verticals, IP-safe]',
      '[Meta Tokens: Symbiotic coral limestone growth, underwater optical caustics, fiber-optic bioluminescence physics, documentary sensor realism]',
      '[Meta Tokens: Escher-inspired physical stone geometry, authentic gravity-defying cantilever engineering, natural moss velvet, zero logos]'
    ],
    subjects: wrapSubjects([
      { text: 'an ancient giant sequoia tree trunk naturally fused with intricate weathered brass clockwork gears and warm glowing glass vacuum tubes embedded seamlessly into living bark', placement: 'center' },
      { text: 'an immense circular stone library carved directly into a cliff face behind a curtain of cascading waterfalls with warm lantern-lit book alcoves and misty stone balconies', placement: 'center' },
      { text: 'a symbiotic underwater data sanctuary where brushed-titanium server monoliths are overgrown with living bioluminescent coral and pulsing golden optical glass veins', placement: 'center' },
      { text: 'a monumental gothic cathedral nave formed entirely from living interwoven ancient oak trees and translucent amber resin arches filtering golden forest sunlight', placement: 'center' },
      { text: 'an inverted stepped stone pyramid garden suspended cleanly within a sunlit canyon chasm with hanging vines and thin waterfalls dropping from its terraces', placement: 'center' },
      { text: 'a botanical mechanical planetarium made of oxidized bronze rings and living moss spheres rotating above a mirror-still forest reflection pool', placement: 'right' },
      { text: 'a spiral cantilevered white-limestone staircase ascending around a towering indoor waterfall inside a sunlit brutalist atrium overgrown with ferns', placement: 'left' },
      { text: 'an ancient bonsai olive tree growing atop a floating-illusion cantilevered black basalt plinth with delicate copper-filament veins glowing softly in its roots', placement: 'center' },
      { text: 'a serene sunken courtyard library where crystal-clear shallow water surrounds stepping-stone reading pavilions and towering carved sandstone shelves', placement: 'center' },
      { text: 'a colossal weathered brass astrolabe bridge spanning an emerald jungle gorge with lush orchids and vines woven through its precision rings', placement: 'center' },
      { text: 'a crystalline acoustic pavilion built from geometric clear quartz columns and raw timber nestled calmly in a misty alpine meadow at sunrise', placement: 'right' },
      { text: 'an abandoned stone watchtower reclaimed by glowing bioluminescent blue forest mushrooms and silver morning mist in an old-growth woodland', placement: 'left' },
      { text: 'a tiered circular amphitheater of raw travertine and living grass terraces cascading down into a turquoise geothermal crater lake', placement: 'center' },
      { text: 'a giant translucent glass botanical seed-vault sphere anchored into snowy granite cliffs with warm golden light illuminating lush green flora inside', placement: 'center' },
      { text: 'a labyrinth of monolithic mirrored-glass and mossy basalt walls reflecting sky and pine treetops in a silent Nordic clearing', placement: 'left' },
      { text: 'a grand pipe-organ sculpted from natural hollow basalt columns and brushed bronze pipes built into a coastal sea cave', placement: 'center' }
    ])
  },
  {
    id: 'exif-acescg-zeiss-otus-avantgarde-human-realism',
    label: 'Zeiss Otus 55mm + ACEScg Secret Meta-Tokens — Timefracture & Avant-Garde portreti (Test ekstremnog realizma)',
    shortTrigger:
      'samo IMG_2098.CR2, Zeiss Otus 55mm f/1.4, uncompressed RAW 16bit ACEScg, albedo_subsurface.vfx, micro-fabric_specular_2024',
    exifOptics: [
      'IMG_2098.CR2, Canon:Model=Canon EOS 5DS R, Lens=Zeiss Otus 55mm f/1.4 APO Distagon, EXIF:FNumber=f/2.0, EXIF:ISOSpeedRatings=64, uncompressed RAW 16bit ACEScg',
      'B0002715.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 1,9/80, Hasselblad_X2D_lensmap, EXIF:FNumber=f/2.2, EXIF:ISOSpeedRatings=64, HDR_microcontrast_256map',
      'IIQ_006812.IIQ, PhaseOne:CameraModel=IQ4 150MP, PhaseOne:LensModel=Schneider Kreuznach 80mm LS f/2.8, phaseone_IQ4_backplate, EXIF:FNumber=f/3.2, EXIF:ISOSpeedRatings=50',
      'DSC09914.ARW, Sony:CameraModelName=ILCE-7RM5, Lens=Zeiss Otus 85mm f/1.4, EXIF:FNumber=f/1.8, EXIF:ISOSpeedRatings=80, ACEScg_P3_D65_matrix, zero optical chromatic aberration',
      'IMG_2144.CR3, Canon:Model=Canon EOS R5, Canon:LensModel=RF85mm F1.2 L USM DS, EXIF:FNumber=f/2.0, EXIF:ISOSpeedRatings=100, Canon_EOS_R5_profile, defocus smoothing bokeh',
      'DSCF9812.RAF, FUJIFILM:CameraModel=GFX100 II, FUJIFILM:LensModel=GF 110mm f/2 R LM WR, EXIF:FNumber=f/2.5, EXIF:ISOSpeedRatings=80, Kodak Portra 400 tonal curve',
      'B0002790.3FR, Hasselblad:CameraModel=X2D 100C, Hasselblad:LensModel=XCD 2,5/90V, EXIF:FNumber=f/2.8, exposure_stack_x9_dynamicrange, 16-bit epidermal fidelity',
      'IIQ_006889.IIQ, PhaseOne:CameraModel=IQ4 150MP, Lens=Zeiss Otus 55mm f/1.4, EXIF:FNumber=f/2.8, ISO_64_filmgrain, refraction_noise=off',
      'DSC09968.ARW, Sony:CameraModelName=ILCE-7RM5, Sony:LensModel=FE 50mm F1.2 GM, EXIF:FNumber=f/1.6, EXIF:ISOSpeedRatings=100, glass_diffusion.normalpass',
      'IMG_2199.CR2, Canon:Model=Canon EOS-1D X Mark III, Lens=Zeiss Otus 55mm f/1.4, EXIF:FNumber=f/2.2, shutter_angle_270, double-exposure in-camera optical prism RAW'
    ],
    environments: [
      'inside a darkened architectural glass gallery with fractured prism rainbows and rain droplets streaking across foreground glass',
      'in a dust-mote-filled sunlit forgotten conservatory with antique mirrors and soft Chiaroscuro shadow falloff',
      'against a deep obsidian low-key studio void illuminated by precision optical projector slits and warm golden rim light',
      'standing on a wet twilight urban sidewalk where delicate bioluminescent wildflowers bloom through cracked dark concrete',
      'inside a minimalist concrete and brushed-brass chamber with floating softbox reflections in clean dark glass',
      'beneath a dramatic Caravaggio-style single overhead skylight in a weathered Venetian plaster atelier',
      'behind a condensation-misted windowpane reflecting warm amber streetlamps and cool twilight blue hour',
      'within an avant-garde mirror-and-smoke optical studio creating authentic physical double-reflection geometry',
      'in a quiet sun-drenched stone cloister where dusty crepuscular rays illuminate floating golden pollen',
      'against a hand-burnished dark copper backdrop catching warm skin subsurface tones and crisp hair highlights'
    ],
    metaPool: [
      '[Meta Tokens: ACEScg_P3_D65_matrix, albedo_subsurface.vfx, micro-fabric_specular_2024, authentic skin pores, fine vellus hair, zero airbrushing]',
      '[Meta Tokens: Zeiss_Otus_55mm_f1.4, HDR_microcontrast_256map, tear-film iris reflection, individual eyelash sharpness, clean textless frame]',
      '[Meta Tokens: phaseone_IQ4_backplate, glass_diffusion.normalpass, physical optical prism split, Kodak Portra 400 grain, zero magazine logos]',
      '[Meta Tokens: Hasselblad_X2D_lensmap, diffusion_reflectivity_0.98, gold-leaf flake micro-relief, silk thread weave, 100% photographic skin]',
      '[Meta Tokens: exposure_stack_x9_dynamicrange, lux_tonecurve.8bit_expansion, natural freckles and mineral shimmer, zero CGI plastic look]'
    ],
    subjects: wrapSubjects([
      { text: 'an ultra-realistic close-up portrait of a 24-year-old woman with striking blue-green eyes, natural freckles, and subtle iridescent mineral crystal dust across the bridge of her nose, pure textless frame', placement: 'center' },
      { text: 'an optical prism double-reflection portrait of a poised woman seen simultaneously in sharp profile and soft front focus through an angled bevelled studio glass plate', placement: 'center' },
      { text: 'a neo-renaissance Chiaroscuro portrait of a serene female subject draped in black raw silk with delicate 24k gold-leaf geometric accents on her collarbone under Caravaggio lighting', placement: 'right' },
      { text: 'an atmospheric portrait of a young woman in a tailored dark wool coat standing calmly beside a concrete wall where tiny glowing bioluminescent flowers sprout from the stone', placement: 'left' },
      { text: 'an extreme detail beauty study of a woman wearing intricate black lace headwear framing piercing grey-green eyes, authentic skin texture, and natural sunlit catchlights', placement: 'center' },
      { text: 'a poetic studio portrait of a woman surrounded by suspended crystal water droplets frozen at 1/4000s, each droplet refracting warm golden key light', placement: 'center' },
      { text: 'a dramatic slow-shutter motion-trail portrait where a sharp stillness-locked face emerges cleanly from subtle warm silk movement blur in camera', placement: 'right' },
      { text: 'a high-fashion sculptural portrait of a woman wearing bespoke translucent blown-glass collar art over ivory organza with real rainbow caustic reflections on her neck', placement: 'center' },
      { text: 'a moody 35mm Kodak Portra portrait of an enigmatic woman holding an antique brass prism that casts a crisp spectral rainbow band across her cheek in a dark room', placement: 'left' },
      { text: 'a hyper-detailed portrait of a silver-haired woman with striking amber eyes wearing heavy architectural silver jewelry with authentic unretouched life lines', placement: 'center' },
      { text: 'an avant-garde studio portrait of a model veiled behind thin cascading sheet water on clear glass creating natural optical distortion along the frame edges while one eye stays tack-sharp', placement: 'center' },
      { text: 'a sunlit editorial close-up of a woman with platinum-white hair, natural freckled complexion, and deep sapphire eyes under crisp north-light studio diffusion', placement: 'center' },
      { text: 'a quiet cinematic portrait of a woman in an emerald velvet gown seated beside a rain-streaked train window at twilight with warm interior tungsten glow', placement: 'right' },
      { text: 'a high-contrast monochrome-inspired tonal portrait of a sculptor dusted lightly with fine white marble powder under single overhead beauty-dish illumination', placement: 'left' },
      { text: 'a surreal photorealistic studio portrait of a woman holding a glowing warm filament sphere cupped gently in her hands illuminating her face with natural subsurface warmth', placement: 'center' },
      { text: 'an editorial close-up portrait of a woman wearing handcrafted filigree gold eyewear and dark burgundy cashmere with razor-sharp iris fiber detail', placement: 'center' }
    ])
  }
];

// 11. OMNI-EXIF KATEGORIJA — SPAJA SVIH 10 SENZORA I ACEScg PROFILA U JEDAN GENERATOR
const OMNI_EXIF_CATEGORY = {
  id: 'exif-omni-all-sensors-master-mix',
  label: '🌐 OMNI-EXIF MASTER MIX — Svih 10 kamera + IMAX 70mm + ACEScg zajedno (Idealno za 200 Bundle Motiva)',
  shortTrigger:
    'samo IIQ_004781.IIQ, PhaseOne:CameraModel=IQ4 150MP + ACEScg_P3_D65_matrix + HDR_microcontrast_256map, zero text, zero logos',
  exifOptics: BASE_EXIF_CATEGORIES.map((c) => c.exifOptics[0]),
  environments: [
    'resting on wet black volcanic basalt with natural spectral light reflections and micro water droplets',
    'set inside an architectural dark-marble and brushed-brass gallery with clean commercial negative space',
    'positioned on a rain-slicked nocturnal urban plaza with warm amber reflections across wet stone',
    'perched against misty coastal cliffs at blue hour with calm mirror-like water reflections',
    'placed on honed travertine stone bathed in angled golden-hour sunlight and crisp shadow geometry',
    'set on smoked black optical glass in a controlled studio void with razor-sharp contact shadows',
    'framed amidst lush misty primeval greenery with shafts of volumetric morning sun',
    'anchored in a serene minimalist concrete courtyard with shallow reflection pools at dusk',
    'resting on dark oiled walnut wood with subtle optical caustics and floating sunlit dust motes',
    'set beneath dramatic twilight storm clouds with crisp silver rim illumination'
  ],
  metaPool: [
    '[Meta Tokens: ACEScg_P3_D65_matrix, phaseone_IQ4_backplate, HDR_microcontrast_256map, 16-bit RAW micro-texture, zero CGI gloss]',
    '[Meta Tokens: glass_diffusion.normalpass, exposure_stack_x9_dynamicrange, physical refraction physics, unbranded luxury]',
    '[Meta Tokens: Shot on IMAX 70mm & Medium Format RAW, Kodak Vision3 tonal roll-off, authentic surface grain, textless frame]',
    '[Meta Tokens: Zeiss_Otus_55mm_f1.4, albedo_subsurface.vfx, refraction_noise=off, razor-sharp focal lock, zero logos]',
    '[Meta Tokens: Hasselblad_X2D_lensmap, ProRes_4444XQ, rectilinear verticals, natural shadow falloff, 100% IP-safe]'
  ],
  subjects: BASE_EXIF_CATEGORIES.flatMap((c) => c.subjects.slice(0, 2))
};

export const EXIF_CATEGORIES = [...BASE_EXIF_CATEGORIES, OMNI_EXIF_CATEGORY];

const LIGHTING_RIGS = [
  'pierced by a single tall vertical shaft of natural sunlight with volumetric light rays',
  'illuminated by low-angle golden-hour sunlight casting long crisp shadows',
  'lit by soft north-facing diffused daylight with smooth tonal falloff and natural bounce fill',
  'sculpted by dramatic chiaroscuro rim lighting and crisp specular reflections',
  'bathed in cool blue-hour twilight ambient fill with warm directional interior glow',
  'highlighted by razor-sharp studio strip-box reflections and deep obsidian shadow contrast',
  'under moody overcast sky light creating soft micro-contrast across raw textures',
  'backlit by subtle crepuscular light rays cutting through fine atmospheric mist',
  'illuminated by a narrow directional beam of warm late-afternoon sun',
  'balanced by soft ambient window light and subtle architectural shadow play',
  'lit by dramatic Rembrandt chiaroscuro lighting with deep shadow contrast and sculpted highlights',
  'under moody low-key directional studio lighting with crisp specular reflections on wet surfaces'
];

const BATCH_LIMIT = 10;
const MAX_PROMPTS = 5000;

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

function AntigravityField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const count = Math.min(85, Math.floor(window.innerWidth / 16));
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.25 - Math.random() * 0.65,
      r: 1.2 + Math.random() * 2.2,
      isGold: i % 3 === 0,
      alpha: 0.35 + Math.random() * 0.55
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0.1) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.42;
          p.vy += (dy / dist) * force * 0.42;
        }

        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + -0.38 * 0.04;
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -15) {
          p.y = canvas.height + 15;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 115) {
            ctx.beginPath();
            ctx.strokeStyle =
              p.isGold || p2.isGold
                ? `rgba(251, 191, 36, ${(1 - ldist / 115) * 0.16})`
                : `rgba(34, 211, 238, ${(1 - ldist / 115) * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(251, 191, 36, ${p.alpha})`
          : `rgba(34, 211, 238, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.isGold ? 'rgba(251,191,36,0.75)' : 'rgba(34,211,238,0.75)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-85" />;
}

export function buildExifCategoryPrompts(
  categoryObj,
  injectPowerKeywords = false,
  tokenOrder = 'exif-first',
  customSubjectConfig = null
) {
  const list = [];
  const trimmedCustom = customSubjectConfig?.text?.trim() || '';
  const hasCustom = trimmedCustom.length > 0;

  const subPool = hasCustom
    ? [{ text: trimmedCustom, placement: customSubjectConfig.placement || 'center' }]
    : categoryObj.subjects;

  const optPool = categoryObj.exifOptics;
  const envPool =
    hasCustom && !customSubjectConfig?.useCategoryEnv
      ? PURE_OPTICAL_FRAMINGS
      : categoryObj.environments;
  const lightPool = LIGHTING_RIGS;
  const metaPool = categoryObj.metaPool;

  const subCount = subPool.length;
  const envCount = envPool.length;
  const lightCount = lightPool.length;
  const optCount = optPool.length;
  const metaCount = metaPool.length;

  const totalPermutations = subCount * envCount * lightCount * optCount * metaCount;
  const targetTotal = Math.min(MAX_PROMPTS, totalPermutations);

  let stride = 104729;
  while (gcd(stride, totalPermutations) !== 1) {
    stride += 2;
  }

  const isAlreadyMysticCat = categoryObj.id === 'exif-mystic-natgeo-35mm-power-sentences';

  for (let step = 0; step < targetTotal; step++) {
    const idx = (step * stride) % totalPermutations;
    const s = idx % subCount;
    const r1 = Math.floor(idx / subCount);
    const e = r1 % envCount;
    const r2 = Math.floor(r1 / envCount);
    const l = r2 % lightCount;
    const r3 = Math.floor(r2 / lightCount);
    const o = r3 % optCount;
    const m = Math.floor(r3 / optCount) % metaCount;

    const subjObj = subPool[s];
    const placementDirective = resolvePlacementDirective(subjObj.placement);
    const powerPrefix =
      injectPowerKeywords && !isAlreadyMysticCat
        ? `${POWER_HOOKS_FOR_GENERATOR[step % POWER_HOOKS_FOR_GENERATOR.length]} — `
        : '';

    const unifiedPrompt =
      tokenOrder === 'subject-first'
        ? `${powerPrefix}Editorial ultra-realistic commercial photograph of ${subjObj.text}, ${placementDirective}, ${envPool[e]}, ${lightPool[l]} — ${optPool[o]}, ${metaPool[m]}, ${V10_EXIF_GUARDRAILS}.`
        : `${powerPrefix}${optPool[o]}: editorial ultra-realistic commercial photograph of ${subjObj.text}, ${placementDirective}, ${envPool[e]}, ${lightPool[l]}, ${metaPool[m]}, ${V10_EXIF_GUARDRAILS}.`;

    list.push({
      index: step + 1,
      category: hasCustom ? `BUNDLE OVERRIDE • ${categoryObj.label}` : categoryObj.label,
      placement: subjObj.placement,
      cameraProfile: optPool[o].split(',')[0],
      prompt: unifiedPrompt
    });
  }

  return list;
}

export default function GoranExif() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(EXIF_CATEGORIES[0].id);
  const [injectPowerKeywords, setInjectPowerKeywords] = useState(true);
  const [tokenOrder, setTokenOrder] = useState('exif-first');

  // 200 ENGLISH BUNDLE DROPDOWN + CUSTOM SUBJECT OVERRIDE STATES
  const [customSubject, setCustomSubject] = useState('');
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('');
  const [dropdownFilter, setDropdownFilter] = useState('');
  const [customPlacement, setCustomPlacement] = useState('center');
  const [useCategoryEnvOnCustom, setUseCategoryEnvOnCustom] = useState(false);

  const [showKeywordDrawer, setShowKeywordDrawer] = useState(true);
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedQuickKey, setCopiedQuickKey] = useState(null);
  const [copiedShortTrigger, setCopiedShortTrigger] = useState(false);
  const [antigravityStatus, setAntigravityStatus] = useState('');
  const [csvExportStatus, setCsvExportStatus] = useState('');
  const [reactorSurge, setReactorSurge] = useState(false);

  // Blokada indeksiranja da /goran-exif ostane 100% skriven od Google-a
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Numerisana i filtrirana lista od 200 engleskih motiva za pakete
  const filteredBundleGroups = useMemo(() => {
    const q = dropdownFilter.trim().toLowerCase();
    let globalCounter = 0;

    return BUNDLE_KEYWORDS_200.map((grp) => {
      const mappedItems = grp.items.map((text) => {
        globalCounter += 1;
        return {
          num: globalCounter,
          text,
          placement: grp.placement
        };
      });

      const visibleItems = q
        ? mappedItems.filter(
            (entry) =>
              entry.text.toLowerCase().includes(q) || grp.group.toLowerCase().includes(q)
          )
        : mappedItems;

      return {
        group: grp.group,
        placement: grp.placement,
        items: visibleItems
      };
    }).filter((grp) => grp.items.length > 0);
  }, [dropdownFilter]);

  const totalVisibleDropdownItems = useMemo(
    () => filteredBundleGroups.reduce((acc, g) => acc + g.items.length, 0),
    [filteredBundleGroups]
  );

  const selectedCategoryObj = useMemo(
    () => EXIF_CATEGORIES.find((c) => c.id === selectedCategoryId) || EXIF_CATEGORIES[0],
    [selectedCategoryId]
  );

  const customConfig = useMemo(
    () => ({
      text: customSubject,
      placement: customPlacement,
      useCategoryEnv: useCategoryEnvOnCustom
    }),
    [customSubject, customPlacement, useCategoryEnvOnCustom]
  );

  // Automatsko osvežavanje aktivnih promptova uživo dok biraš iz 200-dropdowna ili kucaš
  useEffect(() => {
    if (isGenerated) {
      const pool = buildExifCategoryPrompts(
        selectedCategoryObj,
        injectPowerKeywords,
        tokenOrder,
        customConfig
      );
      setActivePool(pool);
      setBatchOffset(0);
    }
  }, [selectedCategoryObj, injectPowerKeywords, tokenOrder, customConfig, isGenerated]);

  const triggerSurge = () => {
    setReactorSurge(true);
    setTimeout(() => setReactorSurge(false), 750);
  };

  const handleSelectBundleKeyword = (e) => {
    const val = e.target.value;
    setSelectedDropdownItem(val);
    if (!val) {
      setCustomSubject('');
      return;
    }
    setCustomSubject(val);
    setUseCategoryEnvOnCustom(false);

    // Automatski postavi preporučenu poziciju za tu grupu (left / center / right)
    const foundGroup = BUNDLE_KEYWORDS_200.find((g) => g.items.includes(val));
    if (foundGroup) {
      setCustomPlacement(foundGroup.placement);
    }
  };

  const triggerDownloadForPool = (pool, categoryObj) => {
    const content = pool
      .map((item) => `${item.index}. [${item.category}]\n${item.prompt}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const customSlug = customSubject
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 28);
    link.href = url;
    link.download = customSlug
      ? `V10_BUNDLE_${customSlug}_${pool.length}_Promptova.txt`
      : `V10_EXIF_${categoryObj.id}_${pool.length}_Promptova.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const triggerCsvDownloadForPool = (pool, categoryObj) => {
    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const headers = [
      'Prompt_ID',
      'Category',
      'RAW_File_Trigger',
      'Placement',
      'Status',
      'Full_EXIF_Prompt'
    ];
    const rows = pool.map((item) =>
      [
        `V10-EXIF-${String(item.index).padStart(4, '0')}`,
        item.category,
        item.cameraProfile || '',
        item.placement || 'center',
        'Ready',
        item.prompt
      ]
        .map(escapeCsv)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const customSlug = customSubject
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 28);
    link.href = url;
    link.download = customSlug
      ? `V10_Airtable_BUNDLE_${customSlug}_${pool.length}.csv`
      : `V10_Airtable_${categoryObj.id}_${pool.length}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    triggerSurge();
    const pool = buildExifCategoryPrompts(
      selectedCategoryObj,
      injectPowerKeywords,
      tokenOrder,
      customConfig
    );
    setActivePool(pool);
    setBatchOffset(0);
    setIsGenerated(true);
    setAntigravityStatus('');
  };

  const handleNext = () => {
    if (!isGenerated) return;
    const nextOffset = batchOffset + BATCH_LIMIT;
    if (nextOffset < activePool.length) {
      triggerSurge();
      setBatchOffset(nextOffset);
    }
  };

  const handleDownloadAllFromInput = () => {
    triggerSurge();
    const pool = buildExifCategoryPrompts(
      selectedCategoryObj,
      injectPowerKeywords,
      tokenOrder,
      customConfig
    );
    setActivePool(pool);
    triggerDownloadForPool(pool, selectedCategoryObj);
    setAntigravityStatus(`⚡ TXT EXPORT (${pool.length})`);
    setTimeout(() => setAntigravityStatus(''), 3800);
  };

  const handleDownloadCsvForAirtable = () => {
    triggerSurge();
    const pool = buildExifCategoryPrompts(
      selectedCategoryObj,
      injectPowerKeywords,
      tokenOrder,
      customConfig
    );
    setActivePool(pool);
    triggerCsvDownloadForPool(pool, selectedCategoryObj);
    setCsvExportStatus(`✓ CSV SPREMAN (${pool.length})`);
    setTimeout(() => setCsvExportStatus(''), 3800);
  };

  const handleReset = () => {
    setActivePool([]);
    setBatchOffset(0);
    setIsGenerated(false);
    setAntigravityStatus('');
    setCsvExportStatus('');
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1600);
  };

  const handleCopyQuickKeyword = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedQuickKey(keyId);
    setTimeout(() => setCopiedQuickKey(null), 1600);
  };

  const handleCopyShortTrigger = () => {
    navigator.clipboard.writeText(selectedCategoryObj.shortTrigger);
    setCopiedShortTrigger(true);
    setTimeout(() => setCopiedShortTrigger(false), 1800);
  };

  const currentBatch = useMemo(() => {
    if (!isGenerated) return [];
    return activePool.slice(batchOffset, batchOffset + BATCH_LIMIT);
  }, [isGenerated, activePool, batchOffset]);

  const hasNextBatch = isGenerated && batchOffset + BATCH_LIMIT < activePool.length;
  const totalVaultPrompts = (EXIF_CATEGORIES.length * MAX_PROMPTS).toLocaleString('en-US');
  const isCustomActive = customSubject.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 relative overflow-hidden selection:bg-amber-400/30 selection:text-amber-200">
      <style>{`
        @keyframes agLevitate {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        @keyframes agSpinCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes agSpinCCW {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes agShimmer {
          0% { transform: translateX(-140%) skewX(-20deg); }
          100% { transform: translateX(260%) skewX(-20deg); }
        }
        @keyframes agEnergyWave {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes agCardEnter {
          0% { opacity: 0; transform: translateY(16px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0px) scale(1); }
        }
        .ag-levitate { animation: agLevitate 4.4s ease-in-out infinite; }
        .ag-spin-cw { animation: agSpinCW 11s linear infinite; }
        .ag-spin-ccw { animation: agSpinCCW 7.5s linear infinite; }
        .ag-spin-fast { animation: agSpinCW 1.4s linear infinite; }
        .ag-energy-wave { animation: agEnergyWave 5s ease-in-out infinite; }
        .ag-btn-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: agShimmer 3.2s infinite;
        }
        .ag-card-enter {
          animation: agCardEnter 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      <AntigravityField />

      <div className="pointer-events-none fixed -top-36 left-1/4 w-[560px] h-[560px] rounded-full bg-amber-500/12 blur-[145px] ag-energy-wave" />
      <div className="pointer-events-none fixed top-1/4 -right-28 w-[520px] h-[520px] rounded-full bg-cyan-500/14 blur-[145px] ag-energy-wave" />
      <div className="pointer-events-none fixed -bottom-36 left-1/3 w-[480px] h-[480px] rounded-full bg-indigo-500/10 blur-[145px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div
          className={`bg-[#121722]/95 backdrop-blur-xl border rounded-[30px] p-6 sm:p-8 md:p-10 transition-all duration-500 space-y-8 ${
            reactorSurge
              ? 'border-cyan-400/70 shadow-[0_0_95px_rgba(34,211,238,0.28)]'
              : 'border-slate-800/90 shadow-[0_25px_90px_rgba(0,0,0,0.75)]'
          }`}
        >
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182030] border border-amber-400/40 text-amber-300 text-[11px] font-extrabold tracking-[0.18em] uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  HIDDEN VAULT • {HIDDEN_EXIF_VAULT_ROUTE}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold tracking-wider uppercase">
                  200 ENGLISH BUNDLE KEYWORDS • {EXIF_CATEGORIES.length} × 5,000
                </span>
                <a
                  href="/goran"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/15 hover:bg-amber-400 hover:text-slate-950 border border-amber-400/60 text-amber-300 text-[11px] font-extrabold tracking-wider uppercase shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all duration-200 cursor-pointer"
                >
                  ← PREĐI NA /GORAN VAULT
                </a>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black tracking-tight text-white uppercase leading-tight">
                VISIONARY FACTORY{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-cyan-300">
                  GORAN EXIF VAULT
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
                Privatni EXIF + ACEScg reaktor sa{' '}
                <strong className="text-emerald-300">
                  Dropdown menijem od 200 engleskih B2B motiva za pakete
                </strong>
                , <strong className="text-amber-300">28 Mystic okidača</strong> i direktnim CSV
                eksportom za Airtable / Google Sheets.
              </p>
            </div>

            <div className="ag-levitate self-start lg:self-center flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-[#0d111a] via-[#101726] to-[#0b1019] border border-cyan-400/35 shadow-[0_15px_45px_rgba(6,182,212,0.22)]">
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div
                  className={`absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/70 ${
                    reactorSurge ? 'ag-spin-fast' : 'ag-spin-cw'
                  }`}
                />
                <div className="absolute inset-1.5 rounded-full border border-amber-400/75 ag-spin-ccw" />
                <div className="absolute inset-3 rounded-full border border-cyan-300/50 ag-spin-cw" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-cyan-300 shadow-[0_0_18px_rgba(251,191,36,0.8)]" />
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-black tracking-widest uppercase">
                    200 BUNDLE MENU
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold">
                    {totalVaultPrompts} BAZA
                  </span>
                </div>
                <div className="text-slate-200 font-semibold">
                  10 B2B Grupa × 20 Motiva = 200
                </div>
                <div className="text-[11px] font-mono text-amber-300/90">
                  CSV + TXT • NOINDEX LOCK
                </div>
              </div>
            </div>
          </header>

          {/* 1-KLIK TREZOR KLJUČNIH REČI ZA META AI / MIDJOURNEY / HIGGSFIELD */}
          <section className="bg-[#0e131d]/95 border border-amber-400/35 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
                  Meta AI Ključne Rečenice, EXIF &quot;SAMO&quot; Okidači &amp; Secret Meta-Tokens Bank
                </h2>
              </div>
              <button
                onClick={() => setShowKeywordDrawer((prev) => !prev)}
                className="px-3.5 py-1.5 rounded-lg bg-[#161e2e] border border-slate-700 hover:border-cyan-400/50 text-[11px] font-bold text-cyan-300 transition cursor-pointer"
              >
                {showKeywordDrawer ? 'SAKRIJ KLJUČNE REČI ▲' : 'PRIKAŽI SVE KLJUČNE REČI ▼'}
              </button>
            </div>

            {showKeywordDrawer && (
              <div className="space-y-6 pt-3 border-t border-slate-800/80">
                {/* 1. BRZI SAMO EXIF OKIDAČI */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    1. Brzi &quot;SAMO...&quot; EXIF okidači za promenu kamere u istom čatu:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {EXIF_CATEGORIES.map((cat, i) => {
                      const keyId = `exif-short-${i}`;
                      return (
                        <button
                          key={keyId}
                          onClick={() => handleCopyQuickKeyword(cat.shortTrigger, keyId)}
                          className={`text-left px-3 py-2.5 rounded-xl border font-mono text-[11px] transition cursor-pointer ${
                            copiedQuickKey === keyId
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold'
                              : 'bg-[#121722] hover:bg-[#182030] border-slate-800 hover:border-amber-400/50 text-slate-200'
                          }`}
                        >
                          {copiedQuickKey === keyId ? '✓ KOPIRANO U CLIPBOARD!' : cat.shortTrigger}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. MAKSIMALNO VIDLJIV ZLATNI BLOK ZA 28 MYSTIC & UNIQUE FOTOREALISTIČNIH REČENICA */}
                <div className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-500/15 via-[#151c2c] to-[#0d121d] p-4 sm:p-6 shadow-[0_0_45px_rgba(251,191,36,0.2)] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/30 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                        ★ SEKCIJA 2 • TOP FOKUS
                      </span>
                      <h3 className="text-sm sm:text-base md:text-[17px] font-black uppercase tracking-wide text-amber-200 drop-shadow">
                        2. Mystic &amp; Unique Fotorealistične Rečenice za Meta AI (
                        {QUICK_META_KEYWORDS.mysticSentences.length} Okidača)
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider">
                      Klikni bilo koju karticu za instant kopiranje
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {QUICK_META_KEYWORDS.mysticSentences.map((sentence, i) => {
                      const keyId = `mystic-${i}`;
                      const isCopied = copiedQuickKey === keyId;
                      return (
                        <button
                          key={keyId}
                          onClick={() => handleCopyQuickKeyword(sentence, keyId)}
                          className={`group flex items-start gap-3 text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-400 text-slate-950 border-emerald-200 shadow-[0_0_25px_rgba(52,211,153,0.6)] scale-[0.99]'
                              : 'bg-[#0b0f18]/95 hover:bg-amber-400/20 border-amber-400/45 hover:border-amber-300 text-white shadow-[0_4px_18px_rgba(0,0,0,0.45)] hover:shadow-[0_0_22px_rgba(251,191,36,0.28)]'
                          }`}
                        >
                          <span
                            className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-md font-mono text-[11px] font-black ${
                              isCopied
                                ? 'bg-slate-950 text-emerald-300'
                                : 'bg-amber-400/25 border border-amber-300/50 text-amber-200 group-hover:bg-amber-300 group-hover:text-slate-950'
                            }`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-xs sm:text-[13px] leading-snug tracking-wide ${
                              isCopied
                                ? 'font-black text-slate-950'
                                : 'font-extrabold text-amber-50 group-hover:text-white'
                            }`}
                          >
                            {isCopied ? '✓ KOPIRANO U CLIPBOARD — SPREMNO ZA PASTE!' : sentence}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. ANTI-AI / IP-SAFE DODACI */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    3. Anti-AI / IP-Safe dodaci (35mm, IMAX 70mm, NatGeo, brisanje Vogue i auto-znakova):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_META_KEYWORDS.realismLocks.map((lockText, i) => {
                      const keyId = `lock-${i}`;
                      return (
                        <button
                          key={keyId}
                          onClick={() => handleCopyQuickKeyword(lockText, keyId)}
                          className={`text-left px-3 py-2 rounded-xl border font-mono text-[11px] transition cursor-pointer ${
                            copiedQuickKey === keyId
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold'
                              : 'bg-[#161e2e] hover:bg-amber-400/15 border-emerald-400/30 hover:border-amber-400 text-emerald-200'
                          }`}
                        >
                          {copiedQuickKey === keyId ? '✓ KOPIRANO!' : lockText}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. SECRET REALISM META-TOKENS BANK */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    4. Secret Realism Meta-Tokens Bank (ACEScg / Backplate / Normalpass za ekstremnu fiziku):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {QUICK_META_KEYWORDS.secretMetaTokensBank.map((metaBankText, i) => {
                      const keyId = `metabank-${i}`;
                      return (
                        <button
                          key={keyId}
                          onClick={() => handleCopyQuickKeyword(metaBankText, keyId)}
                          className={`text-left px-3 py-2 rounded-xl border font-mono text-[11px] transition cursor-pointer ${
                            copiedQuickKey === keyId
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold'
                              : 'bg-[#151324] hover:bg-purple-500/15 border-purple-400/35 hover:border-purple-300 text-purple-200'
                          }`}
                        >
                          {copiedQuickKey === keyId ? '✓ KOPIRANO!' : metaBankText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* GLAVNI REAKTOR + DROPDOWN SA 200 ENGLESKIH REČI / MOTIVA ZA PAKETE */}
          <section className="relative bg-[#0e131d]/95 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-6">
            <div
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 space-y-4 ${
                isCustomActive
                  ? 'bg-gradient-to-br from-emerald-950/35 via-[#111827] to-cyan-950/30 border-emerald-400/60 shadow-[0_0_35px_rgba(16,185,129,0.16)]'
                  : 'bg-[#121722]/90 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="v10-bundle-200-select"
                  className="text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.14em] flex items-center gap-2 text-emerald-300"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isCustomActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                    }`}
                  />
                  📦 Dropdown Meni — 200 Engleskih Motiva za V10 Pakete ({totalVisibleDropdownItems}{' '}
                  prikazano)
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Pozicija subjekta za UI Negative Space */}
                  <div className="inline-flex rounded-lg bg-[#0b0e14] border border-slate-700/90 p-0.5">
                    {[
                      { id: 'left', label: '◧ LEVO (UI Desno)' },
                      { id: 'center', label: '▣ CENTAR' },
                      { id: 'right', label: '◨ DESNO (UI Levo)' }
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setCustomPlacement(pos.id)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase transition cursor-pointer ${
                          customPlacement === pos.id
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setUseCategoryEnvOnCustom((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold uppercase tracking-wide transition cursor-pointer ${
                      useCategoryEnvOnCustom
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                        : 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
                    }`}
                  >
                    {useCategoryEnvOnCustom
                      ? '🌍 + OKRUŽENJE KATEGORIJE'
                      : '🔒 ČISTI OPTIČKI UGLOVI'}
                  </button>
                </div>
              </div>

              {/* RED 1: PRETRAGA + GLAVNI DROPDOWN SA 200 STAVKI NA ENGLESKOM */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4 relative">
                  <input
                    type="text"
                    value={dropdownFilter}
                    onChange={(e) => setDropdownFilter(e.target.value)}
                    placeholder="🔍 Filtriraj 200 reči (npr. watch, plaque, steak)..."
                    className="w-full rounded-xl bg-[#0b0e14] border border-slate-700/90 focus:border-amber-400 focus:outline-none px-3.5 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500"
                  />
                  {dropdownFilter && (
                    <button
                      type="button"
                      onClick={() => setDropdownFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="md:col-span-8">
                  <select
                    id="v10-bundle-200-select"
                    value={selectedDropdownItem}
                    onChange={handleSelectBundleKeyword}
                    className="w-full rounded-xl bg-[#0b0e14] border-2 border-emerald-400/55 hover:border-amber-400 focus:border-amber-400 focus:outline-none px-4 py-3.5 text-xs sm:text-sm font-bold text-emerald-100 shadow-inner transition cursor-pointer"
                  >
                    <option value="" className="bg-[#0b0e14] text-slate-400">
                      — Izaberi bilo koji od 200 engleskih motiva za pakete (ili ostavi standardnu kategoriju) —
                    </option>
                    {filteredBundleGroups.map((grp) => (
                      <optgroup
                        key={grp.group}
                        label={grp.group}
                        className="bg-[#121722] text-amber-300 font-extrabold"
                      >
                        {grp.items.map((entry) => (
                          <option
                            key={entry.num}
                            value={entry.text}
                            className="bg-[#0b0e14] text-slate-100 font-medium"
                          >
                            #{String(entry.num).padStart(3, '0')} • {entry.text}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* RED 2: AKTIVNI ENGLESKI SUBJEKAT (MOŽEŠ I RUČNO DA GA DORADIŠ ILI OČISTIŠ) */}
              <div className="relative flex items-center">
                <input
                  id="v10-custom-subject"
                  type="text"
                  value={customSubject}
                  onChange={(e) => {
                    setCustomSubject(e.target.value);
                    setSelectedDropdownItem('');
                  }}
                  placeholder="Izaberi stavku iz padajućeg menija od 200 motiva iznad ili dopiši svoj engleski opis ovde..."
                  className="w-full rounded-xl bg-[#0b0e14]/90 border border-slate-700/80 focus:border-emerald-400 focus:outline-none pl-4 pr-28 py-3 text-xs sm:text-sm text-amber-100 placeholder:text-slate-500 font-mono transition"
                />
                {isCustomActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSubject('');
                      setSelectedDropdownItem('');
                    }}
                    className="absolute right-2.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-400/40 text-[11px] font-extrabold uppercase transition cursor-pointer"
                  >
                    ✕ OČISTI
                  </button>
                )}
              </div>
            </div>

            {/* IZBOR EXIF KAMERE I KONTROLE TEŽINE */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="v10-exif-select"
                  className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-300 to-cyan-400" />
                  EXIF Kamera &amp; Optika (1 od {EXIF_CATEGORIES.length} • 5,000 promptova)
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      setTokenOrder((prev) =>
                        prev === 'exif-first' ? 'subject-first' : 'exif-first'
                      )
                    }
                    className={`px-3 py-1 rounded-lg border text-[11px] font-extrabold tracking-wide transition cursor-pointer ${
                      tokenOrder === 'exif-first'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                        : 'bg-amber-500/20 border-amber-400 text-amber-200'
                    }`}
                  >
                    {tokenOrder === 'exif-first'
                      ? '📷 FOKUS TEŽINE: EXIF KAMERA PRVO'
                      : '🎯 FOKUS TEŽINE: SUBJEKAT PRVO'}
                  </button>

                  <button
                    onClick={() => setInjectPowerKeywords((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-extrabold tracking-wide transition cursor-pointer ${
                      injectPowerKeywords
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                        : 'bg-[#121722] border-slate-700 text-slate-400'
                    }`}
                  >
                    {injectPowerKeywords
                      ? '✨ POWER KLJUČNE REČI: UKLJUČENO'
                      : 'POWER KLJUČNE REČI: ISKLJUČENO'}
                  </button>

                  <button
                    onClick={handleCopyShortTrigger}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-extrabold tracking-wide transition cursor-pointer ${
                      copiedShortTrigger
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                        : 'bg-[#161e2e] hover:bg-amber-400/20 border-amber-400/40 text-amber-300'
                    }`}
                  >
                    {copiedShortTrigger ? '✓ KOPIRAN AKTIVNI OKIDAČ' : '📋 KOPIRAJ AKTIVNI EXIF OKIDAČ'}
                  </button>
                </div>
              </div>

              <select
                id="v10-exif-select"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setAntigravityStatus('');
                  setCsvExportStatus('');
                }}
                className="w-full rounded-xl bg-[#121722] border border-slate-700/90 hover:border-cyan-400/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none px-4 py-4 text-sm sm:text-[15px] font-semibold text-white shadow-inner transition cursor-pointer"
              >
                {EXIF_CATEGORIES.map((cat, index) => (
                  <option key={cat.id} value={cat.id} className="bg-[#121722] text-white">
                    {index + 1}. {cat.label} (5,000 promptova)
                  </option>
                ))}
              </select>

              <div className="px-3.5 py-2 rounded-lg bg-[#121722]/90 border border-slate-800 font-mono text-[11px] text-cyan-300/95 break-all">
                Aktivni okidač: {selectedCategoryObj.shortTrigger}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
              <button
                onClick={handleDownloadAllFromInput}
                className="ag-btn-shimmer md:col-span-3 group relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500/25 via-sky-500/25 to-indigo-500/25 hover:from-cyan-400/35 hover:to-indigo-500/35 border border-cyan-400/60 hover:border-cyan-300 text-cyan-100 font-extrabold text-xs tracking-wider uppercase shadow-[0_0_28px_rgba(34,211,238,0.2)] transition-all duration-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-300" />
                <span>{antigravityStatus || '⚡ SVIH 5,000 (.TXT)'}</span>
              </button>

              <button
                onClick={handleDownloadCsvForAirtable}
                className="ag-btn-shimmer md:col-span-3 group relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-cyan-500/20 hover:from-emerald-400/35 hover:to-teal-500/35 border border-emerald-400/60 hover:border-emerald-300 text-emerald-100 font-extrabold text-xs tracking-wider uppercase shadow-[0_0_28px_rgba(16,185,129,0.2)] transition-all duration-200 cursor-pointer"
              >
                <span>{csvExportStatus || '📊 CSV ZA AIRTABLE'}</span>
              </button>

              <button
                onClick={handleGenerate}
                className="ag-btn-shimmer md:col-span-3 relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_35px_rgba(245,158,11,0.38)] transition-all duration-200 cursor-pointer"
              >
                <span>{isCustomActive ? '🔥 GENERIŠI IZABRANI (10)' : '🔥 GENERATE (PO 10)'}</span>
              </button>

              <div className="md:col-span-3 flex items-stretch gap-2">
                <button
                  onClick={handleNext}
                  disabled={!hasNextBatch}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-4 rounded-xl font-black text-xs tracking-wider uppercase border transition-all duration-200 ${
                    hasNextBatch
                      ? 'bg-[#182030] hover:bg-amber-400/15 border-amber-400/60 hover:border-amber-300 text-amber-300 cursor-pointer'
                      : 'bg-[#121722]/60 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>NEXT (10) →</span>
                </button>

                {isGenerated && (
                  <button
                    onClick={handleReset}
                    title="Resetuj prikaz"
                    className="px-3.5 py-4 rounded-xl bg-[#121722] hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-400/50 text-xs font-bold text-slate-400 hover:text-rose-200 transition cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    isCustomActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>
                  Režim:{' '}
                  <strong className="text-slate-100">
                    {isCustomActive
                      ? `200 BUNDLE OVERRIDE (${customPlacement.toUpperCase()}) + ${selectedCategoryObj.label}`
                      : selectedCategoryObj.label}
                  </strong>
                </span>
              </div>

              <div>
                {isGenerated ? (
                  <span>
                    Prikazano:{' '}
                    <span className="text-amber-300 font-bold">
                      {batchOffset + 1}–{Math.min(batchOffset + BATCH_LIMIT, activePool.length)}
                    </span>{' '}
                    od <span className="text-white font-bold">{activePool.length}</span>
                  </span>
                ) : (
                  <span>Spreman za 5.000 unikatnih EXIF + Meta-Token promptova</span>
                )}
              </div>
            </div>
          </section>

          {isGenerated && (
            <section className="space-y-4">
              {currentBatch.map((item, idx) => (
                <article
                  key={item.index}
                  style={{ animationDelay: `${idx * 45}ms` }}
                  className="ag-card-enter bg-[#0e131d]/95 hover:bg-[#141c2b] border border-slate-800/90 hover:border-cyan-400/45 rounded-2xl p-5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400/15 to-cyan-400/15 border border-amber-400/35 text-amber-300 font-mono text-xs font-extrabold">
                        #{item.index}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(item.prompt, idx)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                        copiedIndex === idx
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                          : 'bg-[#182030] hover:bg-amber-400 hover:text-slate-950 border-slate-700/80 hover:border-amber-400 text-slate-200'
                      }`}
                    >
                      {copiedIndex === idx ? 'KOPIRANO ✓' : 'KOPIRAJ'}
                    </button>
                  </div>

                  <p className="text-sm md:text-[15px] leading-relaxed text-slate-100 select-all">
                    {item.prompt}
                  </p>
                </article>
              ))}

              {hasNextBatch && (
                <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Preostalo još{' '}
                    <strong className="text-amber-300">
                      {activePool.length - (batchOffset + BATCH_LIMIT)}
                    </strong>{' '}
                    unikatnih EXIF promptova
                  </span>

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#182030] hover:bg-amber-400 hover:text-slate-950 border border-amber-400/55 text-amber-300 font-black text-xs sm:text-sm tracking-wider uppercase transition cursor-pointer"
                  >
                    NEXT — SLEDEĆIH 10 →
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}