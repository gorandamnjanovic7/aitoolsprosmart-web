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

// SVE KLJUČNE REČENICE I OKIDAČI ZA BRZO KOPIRANJE U META AI / MAGNIFIC / HIGGSFIELD
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
    'THE MOST MYSTICAL AND UNEXPLAINED PLACE ON EARTH, PHOTOREALISTIC, NATIONAL GEOGRAPHIC STYLE'
  ],
  realismLocks: [
    'CAPTURED ON 35MM FILM',
    'NATIONAL GEOGRAPHIC STYLE',
    'clean textless frame, no logos, no typography, zero magazine mastheads',
    'unbranded bespoke chassis, zero emblems, clean front hood without badges, zero drones in sky',
    'Remove all text, typography, and magazine logos, keep clean studio portrait only',
    'IMG_3177.RAF: high-fashion studio editorial portrait, sculptural ivory silk couture dress, dramatic softbox lighting on dark charcoal backdrop, unretouched skin texture, clean textless frame, no logos, no typography'
  ]
};

const POWER_HOOKS_FOR_GENERATOR = [
  'THE MOST UNIQUE AND PHOTOREALISTIC PHOTOGRAPH EVER CAPTURED ON EARTH, NATIONAL GEOGRAPHIC EDITORIAL GRADE',
  'THE MOST BREATHTAKING AND PHOTOREALISTIC RAW PHOTOGRAPH IN HUMAN HISTORY, ZERO AI GLOSS',
  'THE MOST ENIGMATIC, ATMOSPHERIC AND PHOTOREALISTIC SCENE IN THE WORLD, CAPTURED ON 35MM & MEDIUM FORMAT FILM',
  'THE MOST CINEMATIC, MOODY AND HYPER-REALISTIC COMMERCIAL MASTERPIECE EVER CAPTURED',
  'THE MOST TIMELESS, MYSTICAL AND PHOTOREALISTIC VISUAL CAPTURE ON EARTH, UNEDITED SENSOR REALISM'
];

export const EXIF_CATEGORIES = [
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
      { text: 'a complete bespoke champagne-gold mid-engine hypercar with clean unbranded front hood, sculpted aero channels, and zero emblems or badges', placement: 'right' },
      { text: 'a focused macro close-up of a single illuminated matrix LED headlight on a wet black performance coupe covered in crisp rain droplets with zero logos', placement: 'center' },
      { text: 'a complete dark-hulled luxury superyacht illuminated by glowing turquoise underwater hull lights and warm golden deck lounges', placement: 'center' },
      { text: 'a complete sleek white long-range private business jet with strictly symmetrical twin rear fuselage engines ascending cleanly through sunlit clouds with zero tail numbers', placement: 'center' },
      { text: 'a complete superyacht sun deck featuring a glass-rimmed plunge pool, cream sun loungers, brushed steel railings, and teak wood flooring overlooking calm sea', placement: 'center' },
      { text: 'a complete matte-obsidian bespoke grand tourer coupe with glowing crimson rear LED light blade and carbon diffuser, completely unbranded with zero badges', placement: 'left' },
      { text: 'an ultra-sharp close-up of a complete cross-drilled carbon-ceramic brake disc and acid-yellow caliper inside a dark forged wheel on the vehicle', placement: 'center' },
      { text: 'a complete metallic British-racing-green bespoke supercar parked at three-quarter rear angle with clean badge-free fascia and sculpted carbon aero', placement: 'right' },
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
      { text: 'a Michelin-star seared Wagyu beef cut resting on hot dark volcanic stone with flaky sea salt crystals and rosemary smoke curl', placement: 'center' },
      { text: 'dramatic snow-covered Dolomite-style jagged mountain peaks rising above a glowing golden sea of clouds at sunrise', placement: 'right' },
      { text: 'iridescent clear optical glass shards intersecting over a swirling glossy black liquid silk surface with subtle rainbow edge refraction', placement: 'right' },
      { text: 'an artisanal dark-chocolate ganache tartlet glazed in mirror cocoa with delicate 24k edible gold leaf flakes on dark stoneware', placement: 'center' },
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
  }
];

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

export function buildExifCategoryPrompts(categoryObj, injectPowerKeywords = false) {
  const list = [];
  const subPool = categoryObj.subjects;
  const optPool = categoryObj.exifOptics;
  const envPool = categoryObj.environments;
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

    const unifiedPrompt = `${powerPrefix}${optPool[o]}: editorial ultra-realistic commercial photograph of ${subjObj.text}, ${placementDirective}, ${envPool[e]}, ${lightPool[l]}, ${metaPool[m]}, ${V10_EXIF_GUARDRAILS}.`;

    list.push({
      index: step + 1,
      category: categoryObj.label,
      prompt: unifiedPrompt
    });
  }

  return list;
}

export default function GoranExif() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(EXIF_CATEGORIES[0].id);
  const [injectPowerKeywords, setInjectPowerKeywords] = useState(true);
  const [showKeywordDrawer, setShowKeywordDrawer] = useState(true);
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedQuickKey, setCopiedQuickKey] = useState(null);
  const [copiedShortTrigger, setCopiedShortTrigger] = useState(false);
  const [antigravityStatus, setAntigravityStatus] = useState('');
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

  const selectedCategoryObj = useMemo(
    () => EXIF_CATEGORIES.find((c) => c.id === selectedCategoryId) || EXIF_CATEGORIES[0],
    [selectedCategoryId]
  );

  const triggerSurge = () => {
    setReactorSurge(true);
    setTimeout(() => setReactorSurge(false), 750);
  };

  const triggerDownloadForPool = (pool, categoryObj) => {
    const content = pool
      .map((item) => `${item.index}. [${item.category}]\n${item.prompt}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `V10_EXIF_${categoryObj.id}_${pool.length}_Promptova.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    triggerSurge();
    const pool = buildExifCategoryPrompts(selectedCategoryObj, injectPowerKeywords);
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
    const pool = buildExifCategoryPrompts(selectedCategoryObj, injectPowerKeywords);
    setActivePool(pool);
    triggerDownloadForPool(pool, selectedCategoryObj);
    setAntigravityStatus(`⚡ EXIF EXPORT (${pool.length} PROMPTOVA)`);
    setTimeout(() => setAntigravityStatus(''), 3800);
  };

  const handleReset = () => {
    setActivePool([]);
    setBatchOffset(0);
    setIsGenerated(false);
    setAntigravityStatus('');
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 text-[11px] font-bold tracking-wider uppercase">
                  EXIF + MYSTIC KEYWORD ENGINE • 6 × 5,000
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
                Privatni EXIF CameraModel + LensModel reaktor u <code>src/hide</code> sa ugrađenim Mystic / NatGeo / 35mm ključnim rečenicama i <code>samo ...</code> okidačima za Meta AI, Magnific i Higgsfield.
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
                    EXIF + MYSTIC
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold">
                    30,000 UKUPNO
                  </span>
                </div>
                <div className="text-slate-200 font-semibold">
                  {EXIF_CATEGORIES.length} Generatora • 60 RAW Profila
                </div>
                <div className="text-[11px] font-mono text-amber-300/90">
                  NOINDEX LOCK • 5,000 / KAT.
                </div>
              </div>
            </div>
          </header>

          {/* 1-KLIK TREZOR KLJUČNIH REČI ZA META AI */}
          <section className="bg-[#0e131d]/95 border border-amber-400/30 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300">
                  Meta AI Ključne Rečenice &amp; EXIF &quot;SAMO&quot; Okidači (Klikni za kopiranje)
                </h2>
              </div>
              <button
                onClick={() => setShowKeywordDrawer((prev) => !prev)}
                className="px-3 py-1 rounded-lg bg-[#161e2e] border border-slate-700 hover:border-cyan-400/50 text-[11px] font-bold text-cyan-300 transition cursor-pointer"
              >
                {showKeywordDrawer ? 'SAKRIJ KLJUČNE REČI ▲' : 'PRIKAŽI SVE KLJUČNE REČI ▼'}
              </button>
            </div>

            {showKeywordDrawer && (
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                    1. Brzi &quot;SAMO...&quot; EXIF okidači za promenu kamere u istom čatu (bez teksta i logotipa):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {EXIF_CATEGORIES.slice(0, 5).map((cat, i) => {
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

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    2. Mystic &amp; Unique Fotorealistične Rečenice za Meta AI:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {QUICK_META_KEYWORDS.mysticSentences.map((sentence, i) => {
                      const keyId = `mystic-${i}`;
                      return (
                        <button
                          key={keyId}
                          onClick={() => handleCopyQuickKeyword(sentence, keyId)}
                          className={`text-left px-3 py-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                            copiedQuickKey === keyId
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-extrabold'
                              : 'bg-[#121722] hover:bg-[#182030] border-slate-800 hover:border-cyan-400/50 text-slate-200'
                          }`}
                        >
                          {copiedQuickKey === keyId ? '✓ KOPIRANO!' : sentence}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    3. Anti-AI / IP-Safe dodaci (35mm, NatGeo, brisanje Vogue i auto-znakova):
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
              </div>
            )}
          </section>

          {/* GLAVNI REAKTOR ZA 5,000 PROMPTOVA */}
          <section className="relative bg-[#0e131d]/95 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="v10-exif-select"
                  className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-300 to-cyan-400" />
                  EXIF Generator (1 od {EXIF_CATEGORIES.length} • 5,000 promptova po kategoriji)
                </label>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const nextVal = !injectPowerKeywords;
                      setInjectPowerKeywords(nextVal);
                      if (isGenerated) {
                        const pool = buildExifCategoryPrompts(selectedCategoryObj, nextVal);
                        setActivePool(pool);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-extrabold tracking-wide transition cursor-pointer ${
                      injectPowerKeywords
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                        : 'bg-[#121722] border-slate-700 text-slate-400'
                    }`}
                  >
                    {injectPowerKeywords
                      ? '✨ POWER KLJUČNE REČI U SVAKOM PROMPTU: UKLJUČENO'
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
                  setActivePool([]);
                  setIsGenerated(false);
                  setBatchOffset(0);
                  setAntigravityStatus('');
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              <button
                onClick={handleDownloadAllFromInput}
                className="ag-btn-shimmer md:col-span-5 group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-r from-cyan-500/25 via-sky-500/25 to-indigo-500/25 hover:from-cyan-400/35 hover:to-indigo-500/35 border border-cyan-400/60 hover:border-cyan-300 text-cyan-100 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_32px_rgba(34,211,238,0.24)] transition-all duration-200 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]" />
                <span>{antigravityStatus || '⚡ SVIH 5,000 PROMPTOVA (.TXT)'}</span>
              </button>

              <button
                onClick={handleGenerate}
                className="ag-btn-shimmer md:col-span-4 relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_35px_rgba(245,158,11,0.38)] transition-all duration-200 cursor-pointer"
              >
                <span>🔥 GENERATE (PO 10)</span>
              </button>

              <div className="md:col-span-3 flex items-stretch gap-2">
                <button
                  onClick={handleNext}
                  disabled={!hasNextBatch}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase border transition-all duration-200 ${
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
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Aktivno:{' '}
                  <strong className="text-slate-100">{selectedCategoryObj.label}</strong>
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
                  <span>Spreman za 5.000 unikatnih EXIF + Mystic promptova</span>
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