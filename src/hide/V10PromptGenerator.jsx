import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  LayoutGrid,
  X,
  ArrowUpRight
} from 'lucide-react';

export const HIDDEN_VAULT_ROUTE = '/goran';

const FALLBACK_PREVIEW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
    <defs>
      <radialGradient id="bg" cx="75%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#14292e"/>
        <stop offset="55%" stop-color="#090d14"/>
        <stop offset="100%" stop-color="#05070b"/>
      </radialGradient>
      <linearGradient id="prism1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#34d399" stop-opacity="0.65"/>
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.75"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#bg)"/>
    <path d="M260,450 C360,310 520,240 800,190 L800,450 Z" fill="#0d131d" opacity="0.85"/>
    <polygon points="410,450 675,75 565,450" fill="url(#prism1)" stroke="#e2e8f0" stroke-opacity="0.6" stroke-width="1.5"/>
    <polygon points="340,145 765,375 725,405" fill="url(#prism1)" stroke="#34d399" stroke-opacity="0.55" stroke-width="1.2"/>
  </svg>`
)}`;

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

const NO_FULL_CAR_DIRECTIVE =
  'strictly framing only this specific installed component on the left with completely empty pitch-black negative space on the right so nothing is visible on the right side, flawless mirror-gloss metallic automotive clearcoat with zero dust specks, zero scratches, and zero surface anomalies, all lights brightly powered on where applicable, no full car ever shown';

const CATEGORIES = [
  {
    id: 'luxury-car-parts-brakes-seats-lights',
    label: 'Luksuzni auto-delovi i makro enterijer (Na vozilu)',
    previewImage:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Phase One IQ4 150MP • Upaljena LED svetla, besprekoran metalik lak visokog sjaja bez prašine i potpuno prazan taman prostor sa desne strane.',
    subjects: wrapSubjects([
      {
        text: 'a dedicated macro close-up of the entire right rear taillight cluster flush-mounted into the rear fender of a luxury sports coupe with intensely glowing crimson-red 3D LED light blades powered on, framed by flawless mirror-gloss metallic dark grey bodywork with zero dust specks, zero scratches, and zero surface anomalies',
        placement: 'left'
      },
      {
        text: 'a macro close-up of the entire front headlight assembly mounted in the front fender of a luxury supercar with intensely glowing white-and-amber LED projector beams and daytime running light blades powered on, surrounded by flawless high-gloss metallic automotive paintwork with zero dust, zero blemishes, and zero anomalies',
        placement: 'left'
      },
      {
        text: 'an ultra-sharp macro photograph of a complete cross-drilled carbon-ceramic brake disc with glossy racing-yellow multi-piston brake calipers and pads mounted inside a forged wheel on a luxury supercar, framed by flawless mirror-gloss metallic fender paintwork with zero dust or defects, no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up detail of a complete grooved performance brake rotor with electric sapphire-blue brake calipers and pads installed inside a dark twin-spoke forged wheel on a sports coupe, surrounded by pristine high-gloss metallic clearcoat bodywork with zero scratches or anomalies, no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up exterior framing of the complete rear taillight and quarter-panel section of a luxury hypercar with bright glowing red LED light bars powered on, showcasing flawless mirror-finish metallic obsidian paintwork with zero dust particles, zero micro-scratches, and zero panel anomalies, no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up exterior framing of the complete front headlamp and sculpted aero intake section of a luxury grand tourer with bright illuminated LED headlights turned on, featuring pristine high-gloss metallic silver-grey paintwork with zero imperfections or anomalies, no full car visible',
        placement: 'left'
      },
      {
        text: 'a tight interior macro shot of an entire illuminated digital instrument cluster and curved cockpit display glowing inside the leather-wrapped dashboard of a luxury sports car with zero visible branding or logos, no full car visible',
        placement: 'left'
      },
      {
        text: 'an interior close-up of a complete sculpted luxury bucket seat in supple cognac aniline leather with precision double stitching bolted inside the cabin of a luxury grand tourer beside glossy metallic door sill paintwork with zero defects, no full car visible',
        placement: 'left'
      }
    ])
  },
  {
    id: 'luxury-watches',
    label: 'Luksuzni satovi',
    previewImage:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Phase One IQ4 150MP • Visoko časovničarstvo izloženo na jastučetu od toplog ćilibarnog somota u luksuznoj kutiji ili na mermernom pultu.',
    subjects: wrapSubjects([
      {
        text: 'a complete skeleton mechanical tourbillon wristwatch with brushed titanium case and full strap inspired by Audemars Piguet design language with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete minimalist 18k rose-gold dress watch with full matte alligator strap inspired by Patek Philippe Calatrava proportions with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete heavy-duty ceramic and steel diving chronograph with sapphire bezel and full bracelet inspired by Omega Seamaster and Rolex Submariner silhouettes with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete platinum perpetual calendar timepiece with openworked dial and full strap inspired by Vacheron Constantin and A. Lange & Söhne craftsmanship with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete avant-garde carbon-fiber tourbillon watch resting upright with full strap inspired by Richard Mille and Audemars Piguet engineering with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete monolithic black DLC-coated mechanical watch with exposed balance wheel and full strap inspired by Rolex and Omega modern tool watches with zero visible branding or logos',
        placement: 'center'
      }
    ])
  },
  {
    id: 'diamonds-jewelry',
    label: 'Dijamanti i visoki nakit',
    previewImage:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Hasselblad H6D-100c • Visoki nakit izložen u luksuznoj kolekcionarskoj kutiji obloženoj toplim ćilibarnim somotom.',
    subjects: wrapSubjects([
      {
        text: 'a complete uncut raw octahedron diamond resting beside a complete precision-cut solitaire with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'an entire platinum high-jewelry necklace arranged neatly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete emerald-cut diamond ring mounted cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete pair of sculptural gold and baguette-diamond cuffs arranged cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete bespoke sapphire and platinum ring displayed cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete cushion-cut diamond ring set in brushed 18k yellow gold displayed cleanly with zero visible branding or logos',
        placement: 'center'
      }
    ])
  },
  {
    id: 'smoke-and-gold-leaf-mask',
    label: 'Maska od dima i zlatnog listića',
    previewImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'High-speed sync flash • Studijski portret sa maskom od crno-indigo dima i listićima 24k zlata.',
    subjects: wrapSubjects([
      {
        text: 'a human silhouette wearing a complete mask sculpted from swirling solid black and indigo smoke trails accented with delicate fractured pieces of 24k gold leaf suspended within the vapor',
        placement: 'left'
      },
      {
        text: 'an enigmatic human profile wearing a complete structured smoke mask formed from dense curling obsidian and deep indigo vapor with floating 24k gold leaf fragments caught in mid-motion',
        placement: 'right'
      },
      {
        text: 'a dramatic studio study of a human silhouette whose entire facial mask is formed from coiled black and indigo smoke filaments interwoven with micro-fractured 24k gold leaf catching sharp specular glints',
        placement: 'center'
      },
      {
        text: 'a high-speed sync studio portrait showing a complete sculpted mask of solidified black and indigo smoke swirls studded with delicate 24k gold leaf shards suspended in the mist',
        placement: 'left'
      },
      {
        text: 'a medium editorial silhouette wearing an entire intricate mask of swirling black and indigo smoke trails embedded with fragile 24k gold leaf flakes',
        placement: 'right'
      }
    ])
  },
  {
    id: 'bioluminescent-porcelain-portrait',
    label: 'Bioluminiscentni portret od porcelana',
    previewImage:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Leica SL2-S APO-Summicron • Umetnički portret prelaza prirodne kože u ispucali porcelan sa plavim bioluminiscentnim venama.',
    subjects: wrapSubjects([
      {
        text: 'a head-and-shoulders portrait of a human face where natural skin with visible pores and fine vellus hair transitions seamlessly into cracked antique white porcelain with glowing blue bioluminescent veins pulsing beneath the surface and along the fractures while dark reflective eyes hold sharp focus',
        placement: 'center'
      },
      {
        text: 'an intimate head-and-shoulders face study blending lifelike skin grain and peach fuzz into fine crackled antique porcelain as subtle bioluminescent cyan-blue veins glow within the hairline fissures and dark reflective eyes remain calm',
        placement: 'center'
      },
      {
        text: 'a dramatic low-key head-and-shoulders portrait where unblemished skin with crisp pores and delicate vellus hairs gives way to fractured vintage white porcelain laced with luminous blue bioluminescent lines inside the cracks',
        placement: 'center'
      },
      {
        text: 'a head-and-shoulders editorial portrait showing detailed skin texture and fine hair merging smoothly into crazed antique white porcelain with faint glowing blue bioluminescent veins pulsing under the glaze',
        placement: 'center'
      },
      {
        text: 'a moody head-and-shoulders face portrait where natural epidermal pores and fine vellus hair transition into cracked cream-white porcelain with glowing electric-blue bioluminescent filaments running through the cracks',
        placement: 'center'
      }
    ])
  },
  {
    id: 'human-scale-surrealism',
    label: 'Nadrealizam ljudske skale',
    previewImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Arri Alexa 65 • Intimni portreti spajanja ljudske kože sa optičkim staklom, titanijumom i kvarcom.',
    subjects: wrapSubjects([
      {
        text: 'a head-and-shoulders portrait of a calm face where fine natural skin pores and peach fuzz transition seamlessly into delicate translucent optical glass filaments along the cheekbone with subtle light refraction',
        placement: 'center'
      },
      {
        text: 'an intimate human-scale head-and-shoulders portrait showing detailed skin texture, natural lip grain, and fine stray hairs alongside brushed dark titanium latticework emerging smoothly from beneath the temple skin',
        placement: 'center'
      },
      {
        text: 'a dramatic studio study of a complete human hand with visible knuckle creases and fine epidermal texture cradling a glowing liquid-amber glass sphere formed directly from the palm lines',
        placement: 'center'
      },
      {
        text: 'a refined profile portrait of a human eye and face with crisp iris fibers and natural eyelashes set beside a precision mechanical camera shutter ring seamlessly embedded into the surrounding skin',
        placement: 'center'
      },
      {
        text: 'a human-scale editorial portrait where soft natural skin tone and fine collarbone shadows blend into sculpted smoked quartz facets with internal light dispersion',
        placement: 'center'
      }
    ])
  },
  {
    id: 'submerged-venetian-palazzo',
    label: 'Potopljena venecijanska palata',
    previewImage:
      'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Over-under dokumentarni kadar • Venecijanska gotička palata napola pod vodom lagune a napola na otvorenom vazduhu.',
    subjects: wrapSubjects([
      {
        text: 'a wide cross-section view of an entire sunken Venetian Gothic palazzo resting on the seabed with its lower half submerged in crystal clear deep blue Mediterranean water showing shimmering caustic light patterns across ornate stone carvings and a decaying fresco while its upper half rises into open air with gilded crumbling architecture',
        placement: 'center'
      },
      {
        text: 'a split-level wide view of an entire ancient Venetian palazzo half-submerged in clear azure sea water with delicate caustic ripples dancing over carved stone arches and faded wall frescoes below the waterline while weathered gilded cornices and open Gothic loggias meet the sky above',
        placement: 'center'
      },
      {
        text: 'a wide view of a half-sunken Venetian Gothic hall where shimmering underwater caustics and fine suspended particles illuminate carved stone tracery and damp fresco remnants below while dry gilded stonework and crumbling arches stand exposed above the surface',
        placement: 'center'
      },
      {
        text: 'a documentary over-under wide study of an entire sunken Venetian Gothic palace showing intricate caustics across submerged carved stone and decaying fresco pigment in deep blue water paired with crumbling gilded facades open to the air above',
        placement: 'center'
      },
      {
        text: 'a dramatic over-under wide composition of an entire sunken Venetian palazzo with shimmering light networks on submerged stone carvings and fading frescoes below the surface and crumbling gilded Gothic architecture open to the sky above',
        placement: 'center'
      }
    ])
  },
  {
    id: 'infinite-library-of-aerogel',
    label: 'Beskonačna biblioteka od aerogela',
    previewImage:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85',
    previewNote:
      '24mm tilt-shift • Monumentalna arhitektura biblioteke od poluprovidnog aerogela sa galerijama i stepeništima.',
    subjects: wrapSubjects([
      {
        text: 'a wide-angle cinematic shot inside an infinite brutalist-style library where all shelving units, floors, and stairs are constructed from monolithic translucent silica aerogel receding into a hazy atmospheric vanishing point with dust motes dancing in soft cool sunlight',
        placement: 'left'
      },
      {
        text: 'towering brutalist balconies, spiral staircases, and deep archive shelves carved out of pale blue-tinted silica aerogel with cool volumetric shafts filtering through the translucent slabs into a misty distance',
        placement: 'right'
      },
      {
        text: 'an endless cavernous hall of monolithic aerogel columns, stepped galleries, and floating reading bridges dissolving into soft atmospheric haze with floating dust motes in cool light',
        placement: 'center'
      },
      {
        text: 'a brutalist atrium built entirely from ethereal translucent aerogel walls, stepped tiers, and deep alcoves where cool diffused daylight scatters through porous glass-like edges toward a distant horizon',
        placement: 'left'
      },
      {
        text: 'a dramatic architectural perspective along rows of monolithic aerogel bookshelves and monumental brutalist stairs fading into a pale misty fog with fine dust particles suspended in cool light beams',
        placement: 'right'
      }
    ])
  },
  {
    id: 'ferrofluid-sculpture',
    label: 'Skulptura od ferofluida',
    previewImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'High-speed 1/4000s • Laboratorijski snimak ferofluida pod dejstvom neodimijumskog magneta na mokrom opsidijanu.',
    subjects: wrapSubjects([
      {
        text: 'a complete sculptural blob of black ferrofluid reacting to a powerful Neodymium magnet beneath it, pulling the fluid into sharp, spiky, fractal magnetic field formations on a perfectly reflective wet obsidian surface',
        placement: 'center'
      },
      {
        text: 'a complete high-speed liquid ferrofluid cluster forming dense interlocking magnetic spikes and rhythmic ridges above a submerged neodymium core across the dark metallic peaks',
        placement: 'center'
      },
      {
        text: 'an entire sculptural ferrofluid dome splitting into fine needle-like magnetic flux columns over a mirror-dark wet obsidian slab in a dark laboratory chamber',
        placement: 'center'
      },
      {
        text: 'a complete dense black ferrofluid cluster pulled into towering fractal spires by dual magnetic fields beneath a wet black glass stage',
        placement: 'center'
      },
      {
        text: 'a complete symmetrical crown of sharp black ferrofluid spikes sculpted by magnetic attraction on a wet obsidian mirror plane',
        placement: 'center'
      }
    ])
  },
  {
    id: 'frozen-strawberry-micro-scan',
    label: 'Mikro-sken zamrznute jagode',
    previewImage:
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Kriogeni makro snimak • Zamrznuta jagoda sa kristalima inja u laboratoriji.',
    subjects: wrapSubjects([
      {
        text: 'a single complete perfectly ripe strawberry undergoing cryopreservation with an intricate lattice of microscopic ice crystals and hoarfrost across its entire surface while internal cold illumination reveals its translucent red cellular structure and frozen achenes in razor focus',
        placement: 'center'
      },
      {
        text: 'a complete cryopreserved wild strawberry cross-section showing frost-rimmed cellular walls, delicate ice needles along the flesh, and deep crimson translucent pulp',
        placement: 'center'
      },
      {
        text: 'a complete scientific studio study of an entire frozen strawberry with leafy calyx encrusted in micro-hoarfrost and frost-covered achenes',
        placement: 'center'
      },
      {
        text: 'a single complete deep-crimson strawberry suspended in sub-zero cryo-vapor with microscopic frost dendrites forming across its entire dimpled skin',
        placement: 'center'
      },
      {
        text: 'a laboratory macro capture of a complete frozen strawberry where crystalline achenes sit in tack-sharp focus amidst frosted red pulp',
        placement: 'center'
      }
    ])
  },
  {
    id: 'natgeo-bbc-wildlife',
    label: 'National Geographic i BBC živi svet',
    previewImage:
      'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Telephoto wildlife • Divlje životinje isključivo u svom prirodnom staništu (Arktik, Himalaji, tajga, savana).',
    subjects: wrapSubjects([
      {
        text: 'a full-body polar bear prowling low across slushy sea ice and shallow freezing meltwater in the high Arctic',
        placement: 'left'
      },
      {
        text: 'a massive full-body polar bear wading through icy coastal water and wet snow at eye level with falling snowflakes',
        placement: 'right'
      },
      {
        text: 'a lone full-body snow leopard stalking across steep jagged granite ridges in the high Himalayas',
        placement: 'left'
      },
      {
        text: 'a full-body Arctic fox with thick white winter coat moving silently across deep windswept snowdrifts',
        placement: 'right'
      },
      {
        text: 'a solitary full-body Siberian tiger walking silently through deep snow-covered boreal taiga forest with frost riming its fur',
        placement: 'left'
      },
      {
        text: 'a pod of humpback whales breaching gracefully through deep indigo pelagic ocean waters off a rugged coastal cliff',
        placement: 'center'
      }
    ])
  },
  {
    id: 'marine-underwater-life',
    label: 'Podvodni i rečni živi svet',
    previewImage:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Podvodna optika • Morske i rečne vrste isključivo u svom prirodnom podvodnom ekosistemu.',
    subjects: wrapSubjects([
      {
        text: 'a complete full-body humpback whale gliding smoothly through deep pelagic ocean water',
        placement: 'left'
      },
      {
        text: 'a complete full-body great white shark cruising silently above sandy ocean seabed in clear cool blue water',
        placement: 'right'
      },
      {
        text: 'a complete green sea turtle swimming effortlessly over a vibrant natural coral reef',
        placement: 'left'
      },
      {
        text: 'a complete giant manta ray sweeping its wide wings through open blue ocean water',
        placement: 'center'
      },
      {
        text: 'a complete Pacific octopus camouflaged along rocky marine reef ledges in crystal-clear coastal water',
        placement: 'right'
      }
    ])
  },
  {
    id: 'underwater-cafes-sunken-worlds',
    label: 'Podvodni kafei i potopljeni svetovi',
    previewImage:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Podvodna kinematografija • Ronilac pored potopljenog bistroa i olupine jedrenjaka na morskom dnu.',
    subjects: wrapSubjects([
      {
        text: 'a full-body scuba diver in a sleek black-and-gold wetsuit swimming past a submerged vintage bistro cafe terrace with warm glowing globe lamps and a massive sunken wooden galleon on the seabed',
        placement: 'left'
      },
      {
        text: 'a full-body scuba diver leaning over a round bistro table with a porcelain cup and glass on a submerged cafe patio while a towering antique sailing ship rests on the ocean floor behind',
        placement: 'left'
      },
      {
        text: 'a full-body diver gliding horizontally past a submerged outdoor cafe awning and small bistro chairs with a weathered sailing vessel rising from the sandy seabed',
        placement: 'right'
      },
      {
        text: 'a full-body scuba diver hovering near a candlelit marble-topped cafe table and brass railing on the ocean floor beside a colossal sunken tall ship',
        placement: 'left'
      },
      {
        text: 'a full-body diver approaching a classic submerged cafe facade with warm glowing lamps and bentwood chairs on the reef floor',
        placement: 'right'
      }
    ])
  },
  {
    id: 'extreme-weather-sky',
    label: 'Ekstremni vremenski i nebeski fenomeni',
    previewImage:
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'IMAX 70mm atmosferska fotografija • Superćelijski oblaci, polarna svetlost i oluje nad otvorenim predelima.',
    subjects: wrapSubjects([
      { text: 'towering dark storm clouds with distant lightning bolts illuminating a turbulent deep ocean swell', placement: 'left' },
      { text: 'vivid emerald and violet northern lights dancing above snow-covered arctic peaks and a frozen fjord', placement: 'right' },
      { text: 'dramatic sunbeams breaking through dense low mist over rugged mountain ridges', placement: 'center' },
      { text: 'a massive supercell cloud formation casting deep shadow across wide open prairie plains', placement: 'left' },
      { text: 'swirling sea fog rolling over steep coastal cliffs as pale twilight settles across the ocean horizon', placement: 'right' }
    ])
  },
  {
    id: 'futuristic-architecture',
    label: 'Futuristička arhitektura i monoliti',
    previewImage:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85',
    previewNote:
      '24mm tilt-shift arhitektura • Objekti uklopljeni u realne pejzaže kanjona, planina, šuma i obala.',
    subjects: wrapSubjects([
      { text: 'a complete cantilevered glass and raw concrete architectural pavilion jutting out from a sheer red-rock desert cliff', placement: 'left' },
      { text: 'an entire monumental dark basalt architectural pavilion standing in a vast misty highland valley', placement: 'right' },
      { text: 'a complete sleek curved glass-and-steel observatory perched on a snowy alpine mountain ridge', placement: 'center' },
      { text: 'a complete sculptural smoked-glass residence built onto dark volcanic coastal rock beside calm ocean water', placement: 'left' },
      { text: 'an entire towering geometric stone-and-glass tower rising above a low sea of mountain clouds', placement: 'right' }
    ])
  },
  {
    id: 'luxury-fragrances-spirits',
    label: 'Luksuzna pića, parfemi i bočice',
    previewImage:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Komercijalna fotografija • Bočice parfema i kristalnih dekantera u realnom enterijeru (bar od hrasta, mermerni pult, garderoba).',
    subjects: wrapSubjects([
      { text: 'a complete heavy square glass fragrance bottle with its dark brushed metal cap resting on a honed travertine vanity counter', placement: 'center' },
      { text: 'a complete crystal decanter filled with aged amber whiskey beside a cut-glass rocks tumbler on a dark walnut bar counter', placement: 'center' },
      { text: 'a complete minimalist smoked-glass perfume flacon standing on a dark marble bathroom console beside a folded linen towel', placement: 'center' },
      { text: 'a complete ornate dark amber glass bottle with brushed brass accents resting on a leather-inlaid dressing table', placement: 'center' },
      { text: 'a complete sleek architectural glass fragrance bottle beside a crystal tumbler on a polished stone lounge table', placement: 'center' }
    ])
  },
  {
    id: 'ancient-abandoned-sanctuaries',
    label: 'Napušteni i drevni prostori u prirodi',
    previewImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Kodak Portra 400 • Drevne kamene ruševine, akvadukti i vodenice u šumi i planinskim klisurama.',
    subjects: wrapSubjects([
      { text: 'complete weathered stone arches of an ancient Roman ruin overgrown with wild moss and forest ferns', placement: 'left' },
      { text: 'an old stone aqueduct stretching across a misty green valley with dense woodland and a quiet river below', placement: 'right' },
      { text: 'a quiet historic stone monastery courtyard with cracked plaster walls, tall arched windows, and wild ivy', placement: 'center' },
      { text: 'a complete abandoned stone watermill beside a rushing mountain stream surrounded by wet boulders and autumn foliage', placement: 'right' },
      { text: 'complete weathered marble temple columns standing in shallow calm coastal water at twilight', placement: 'left' }
    ])
  },
  {
    id: 'night-automotive-urban',
    label: 'Noćni urbani i auto-moto kadrovi',
    previewImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Leica SL2-S noćni kadar • Automobili na mokrom asfaltu bulevara, planinskih prevoja i obalskih puteva sa upaljenim svetlima i besprekornim metalik lakom.',
    subjects: wrapSubjects([
      { text: 'a complete sleek dark metallic sports coupe with flawless mirror-gloss clearcoat driving along a rain-slicked city boulevard at night with bright glowing LED headlights and red taillights powered on', placement: 'center' },
      { text: 'a complete modern grand tourer with immaculate high-gloss metallic paintwork parked under warm streetlamps on wet European cobblestone streets after midnight with illuminated headlights and taillights', placement: 'center' },
      { text: 'a complete metallic obsidian performance car with pristine mirror-finish paint cruising along a misty mountain highway at night with crisp white LED headlight beams turned on', placement: 'center' },
      { text: 'a complete lone sports coupe in flawless high-gloss metallic silver-grey paint on a coastal cliff road at night beside dark ocean waves with glowing headlights and red rear light bar', placement: 'center' },
      { text: 'a complete luxury performance sedan with spotless mirror-gloss metallic bodywork parked along an illuminated modern waterfront promenade at blue-hour nightfall with headlights powered on', placement: 'center' }
    ])
  },
  {
    id: 'nature-seasons-rivers',
    label: 'Priroda: Godišnja doba, planine i reke',
    previewImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Fujifilm Velvia 50 • Planinske reke, kanjoni, jezera i vrhovi kroz sva četiri godišnja doba.',
    subjects: wrapSubjects([
      { text: 'a wild mountain river winding through a lush spring alpine valley filled with blooming wildflowers and emerald birch trees', placement: 'left' },
      { text: 'a crystal-clear turquoise alpine river carving through sun-drenched summer granite gorges lined with pine forests', placement: 'right' },
      { text: 'a calm broad autumn river reflecting fiery amber, copper, and crimson forest foliage beneath misty mountain ridges', placement: 'center' },
      { text: 'a dramatic jagged alpine mountain peak catching warm alpenglow at sunrise above a mirror-still glacial lake', placement: 'right' },
      { text: 'a cascading mountain waterfall feeding a wide emerald river through a steep rocky canyon in spring thaw', placement: 'center' }
    ])
  },
  {
    id: 'surreal-fantasy-worlds',
    label: 'Nadrealni svetovi i fantazija',
    previewImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'ACEScg kinematografski pejzaži • Kamene citadele iznad oblaka, svetionici na hridima i drevne pećine.',
    subjects: wrapSubjects([
      { text: 'an entire grand ancient stone citadel built atop a high mountain peak rising above a sea of golden-lit clouds with waterfalls pouring down the cliffs', placement: 'center' },
      { text: 'a complete sculpted bronze-and-stone dragon perched on a carved pedestal inside a grand vaulted stone castle hall', placement: 'center' },
      { text: 'an entire colossal floating rock island with ancient stone ruins and waterfalls suspended above a misty alpine valley', placement: 'center' },
      { text: 'an entire towering bioluminescent ancient tree growing inside a vast subterranean cavern with stone walkways and underground pools', placement: 'center' },
      { text: 'a complete solitary stone lighthouse standing on a jagged coastal basalt spire amidst crashing ocean waves', placement: 'right' }
    ])
  },
  {
    id: 'unusual-luxury-collisions',
    label: 'Neobični luksuzni sudari',
    previewImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Urednički koncepti • Luksuzni objekti u neočekivanim ali potpuno prirodnim ambijentima.',
    subjects: wrapSubjects([
      { text: 'a complete fine mechanical wristwatch resting on a brass stand inside a glass bell jar placed on a mossy forest table surrounded by ferns', placement: 'center' },
      { text: 'a complete sleek champagne-gold metallic supercar with flawless high-gloss paintwork and illuminated LED headlights parked on a scenic alpine mountain pass turnout with a camera drone hovering above the valley', placement: 'center' },
      { text: 'a complete vintage leather-bound book resting on a weathered wooden dock beside a misty forest lake', placement: 'center' },
      { text: 'a complete crystal decanter and two glasses set on an outdoor wooden table overlooking a mountain river at twilight', placement: 'center' },
      { text: 'a complete sleek luxury coupe with pristine mirror-gloss metallic paintwork and glowing headlights parked on a quiet gravel overlook beside a mirror-still autumn mountain lake', placement: 'center' }
    ])
  },
  {
    id: 'cinematic-portraits-glamour',
    label: 'Filmski portreti i glamur',
    previewImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Arri Alexa 65 85mm Prime • Večernja moda i portreti u istorijskim salonima, galerijama i bibliotekama.',
    subjects: wrapSubjects([
      { text: 'a full-length poised woman with blonde bob hair in a structured crimson satin evening gown standing inside a grand historic palace hall with crystal chandeliers', placement: 'left' },
      { text: 'a three-quarter editorial portrait of a person in tailored dark wool inside a classical art gallery with tall arched windows', placement: 'right' },
      { text: 'a refined three-quarter evening portrait in an architectural salon with dark velvet drapery and warm chandelier light', placement: 'center' },
      { text: 'a full-length striking editorial figure in a structured emerald silk coat standing beside a grand marble staircase', placement: 'left' },
      { text: 'an atmospheric three-quarter portrait inside a wood-paneled private library with warm desk lamp light', placement: 'left' }
    ])
  },
  {
    id: 'unusual-photography',
    label: 'Neobične fotografije',
    previewImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Konceptualna umetnička fotografija • Klavir na slanoj ravnici, čamac iznad oblaka i svetionik na crnom pesku.',
    subjects: wrapSubjects([
      { text: 'a complete solitary wooden rowboat floating calmly above a dense sea of white clouds between snow-dusted alpine peaks', placement: 'left' },
      { text: 'an entire antique black grand piano standing on a vast mirror-wet salt flat reflecting the sunset sky', placement: 'right' },
      { text: 'a complete giant glass hourglass standing on a mossy clearing inside an ancient misty redwood forest', placement: 'center' },
      { text: 'a complete vintage brass telescope mounted on a wooden tripod inside an open-dome mountain observatory at twilight', placement: 'center' },
      { text: 'an entire solitary lighthouse standing on a narrow spit of black volcanic beach between calm ocean waters', placement: 'left' }
    ])
  },
  {
    id: 'womens-eyewear',
    label: 'Ženske luksuzne naočare',
    previewImage:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Luksuzni aksesoari • Ženske naočare izložene na mermernom toaletnom stolu, kožnom sedištu ili terasi.',
    subjects: wrapSubjects([
      { text: 'a complete pair of oversized sculptural black acetate women’s sunglasses with 18k gold temple hardware', placement: 'center' },
      { text: 'a complete pair of avant-garde rimless titanium cat-eye sunglasses with gradient amber lenses', placement: 'center' },
      { text: 'a complete pair of handcrafted Havana tortoiseshell women’s frames with beveled edges and gold hinges', placement: 'center' },
      { text: 'a complete pair of geometric hexagonal gold-wire women’s sunglasses with smoked rose-tinted glass lenses', placement: 'center' },
      { text: 'a complete pair of ultra-thin brushed champagne-titanium women’s aviator sunglasses with crystal lenses', placement: 'center' }
    ])
  },
  {
    id: 'womens-handbags',
    label: 'Ženske luksuzne torbe',
    previewImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Hasselblad X2D 100C • Kožne torbe na mermernom stolu butika, kožnoj fotelji ili u luksuznom garderoberu.',
    subjects: wrapSubjects([
      { text: 'an entire structured matte-black box-calfskin women’s top-handle handbag with brushed palladium clasp', placement: 'center' },
      { text: 'an entire exotic emerald-green alligator-embossed leather evening clutch with sculpted gold frame', placement: 'center' },
      { text: 'an entire minimalist warm-taupe full-grain Epsom leather tote bag standing upright', placement: 'center' },
      { text: 'an entire quilted lambskin chain-strap luxury shoulder bag in deep burgundy leather', placement: 'center' },
      { text: 'an entire architectural ivory-white saddle handbag with hand-stitched saddle seams and brass hardware', placement: 'center' }
    ])
  },
  {
    id: 'luxury-home-interiors',
    label: 'Luksuzan enterijer kuća',
    previewImage:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Architectural Digest enterijeri • Dnevni boravci, kuhinje, spavaće sobe, vinski podrumi i spa kupatila.',
    subjects: wrapSubjects([
      { text: 'a wide architectural view of a double-height modern penthouse living room with floor-to-ceiling bronze-framed glass, travertine fireplace, and low bouclé seating', placement: 'center' },
      { text: 'a wide architectural view of a minimalist luxury kitchen featuring a monolithic veined Calacatta Viola marble island and smoked-oak cabinetry', placement: 'center' },
      { text: 'a wide architectural view of a serene master bedroom suite with recessed warm cove lighting, raw linen drapery, and a honed limestone accent wall', placement: 'center' },
      { text: 'a wide architectural view of a sculptural spa bathroom with a freestanding carved black-basalt soaking tub overlooking an indoor Zen garden courtyard', placement: 'center' },
      { text: 'a wide architectural view of an executive private library with floor-to-ceiling matte walnut bookshelves, brass reading lamps, and cognac leather lounge chairs', placement: 'center' }
    ])
  },
  {
    id: 'oceanfront-villas',
    label: 'Luksuzan eksterijer vila na obali okeana',
    previewImage:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Eksterijeri vila • Rezidencije na obali okeana sa bazenima, terasama i pogledom na otvoreno more.',
    subjects: wrapSubjects([
      { text: 'an entire cantilevered white-concrete and glass cliffside modern villa with a zero-edge infinity pool merging into the deep blue ocean', placement: 'center' },
      { text: 'an entire sprawling Mediterranean limestone coastal estate with sunken firepit lounge terraces overlooking dramatic rocky cliffs', placement: 'center' },
      { text: 'an entire tropical minimalist teak-and-basalt oceanfront villa surrounded by reflection ponds and palm trees above turquoise water', placement: 'center' },
      { text: 'an entire multi-level architectural coastal mansion with glowing warm interior lights reflecting across a glassy infinity pool at blue hour', placement: 'center' },
      { text: 'an entire isolated Nordic coastal glass-and-granite villa anchored onto rugged dark sea cliffs facing a calm steel-blue ocean', placement: 'center' }
    ])
  },
  {
    id: 'forest-cabins',
    label: 'Luksuzan enterijer koliba u šumi',
    previewImage:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Planinske i šumske kolibe • Drvene grede, kamini, saune i panoramski prozori ka borovoj šumi.',
    subjects: wrapSubjects([
      { text: 'a wide interior view of an A-frame luxury forest cabin living room with soaring charred-cedar beams, a suspended matte-black fireplace, and panoramic glass framing misty pines', placement: 'center' },
      { text: 'a wide interior view of a cozy ultra-luxury timber-and-stone woodland sanctuary with low shearling armchairs, raw river-stone hearth, and tall moss-covered forest views', placement: 'center' },
      { text: 'a wide interior view of a modern Scandinavian woodland cabin bedroom with warm Douglas-fir paneling, wool throws, and floor-to-ceiling windows looking into snowy spruce trees', placement: 'center' },
      { text: 'a wide interior view of a secluded forest cabin spa lounge featuring a cedar wood-fired sauna, cold plunge stone basin, and rain-streaked glass overlooking dense ferns', placement: 'center' },
      { text: 'a wide interior view of a minimalist Japanese-inspired forest cabin tea room with tatami-level seating, shoji-screen light diffusion, and open sliding doors to a misty cedar forest', placement: 'center' }
    ])
  },
  {
    id: 'aviation-yachts',
    label: 'Avijacija i jahte',
    previewImage:
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Privatna avijacija i superjahte • Kabine privatnih aviona, hangari i palube jahti na Mediteranu.',
    subjects: wrapSubjects([
      { text: 'a wide interior view of a sleek private jet cabin with hand-stitched cream leather seats and panoramic oval windows above the clouds', placement: 'center' },
      { text: 'a complete aerodynamic carbon-fiber private business jet flying smoothly above sunlit clouds', placement: 'center' },
      { text: 'a wide architectural view of a superyacht aft deck lounge with teak flooring and cream sofas overlooking calm deep-blue Mediterranean water', placement: 'center' },
      { text: 'an entire teak-decked luxury tender yacht cutting through mirror-still morning sea near a rocky coastline', placement: 'center' },
      { text: 'a wide view of a cantilevered superyacht glass infinity pool deck anchored in a tranquil turquoise bay', placement: 'center' }
    ])
  },
  {
    id: 'gourmet-culinary',
    label: 'Luksuzna gastronomija (Luksuzan sto + 2 priloga + jak bokeh)',
    previewImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Michelin fine-dining • Svako jelo je servirano na luksuzno postavljenom stolu uz obavezna dva priloga i izrazito kremasto zamućenu (bokeh) pozadinu.',
    subjects: wrapSubjects([
      {
        text: 'an entire seared Japanese A5 Wagyu steak plated on a handcrafted porcelain dinner plate alongside two distinct gourmet side dishes of roasted truffle-butter baby potatoes and charred green asparagus spears with rich red-wine jus reduction',
        placement: 'center'
      },
      {
        text: 'a complete pan-roasted wild sea bass fillet served on fine bone-china tableware accompanied by two distinct side dishes of creamy saffron risotto quenelle and butter-glazed baby carrots with lemon herb emulsion',
        placement: 'center'
      },
      {
        text: 'an entire herb-crusted rack of lamb plated on a luxury stoneware dinner plate with two distinct side dishes of velvety parsnip purée and sautéed wild chanterelle mushrooms with rosemary demi-glace',
        placement: 'center'
      },
      {
        text: 'a complete butter-poached lobster tail arranged on an artisanal ceramic plate alongside two distinct gourmet side dishes of charred broccolini florets and golden dauphinoise potato gratin with Champagne beurre blanc',
        placement: 'center'
      },
      {
        text: 'an entire crispy-skin duck breast sliced cleanly on a fine-dining porcelain plate accompanied by two distinct side dishes of caramelized fig compote and roasted heirloom root vegetables with port reduction',
        placement: 'center'
      },
      {
        text: 'a complete prime beef tenderloin tournedos served on an upscale restaurant plate alongside two distinct side dishes of creamed morel mushrooms and crispy rosemary potato pavé with black truffle jus',
        placement: 'center'
      }
    ])
  },
  {
    id: 'abstract-concepts',
    label: 'Unikatni koncepti',
    previewImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Konceptualna fotografija • Umetničke instalacije u realnim prostorima i pejzažima.',
    subjects: wrapSubjects([
      { text: 'the full-figure physical embodiment of Silence as a poised figure draped in dark velvet standing inside a misty birch forest clearing', placement: 'left' },
      { text: 'a full-body lone traveler carrying a warm glowing glass lantern across an arid cracked salt plain at dusk', placement: 'right' },
      { text: 'an entire ancient gnarled oak tree with exposed aged-brass clockwork gears integrated into its hollow trunk inside a sunlit meadow', placement: 'center' },
      { text: 'a full-body majestic stag sculpted from clear spun optical glass standing in a quiet misty pine forest', placement: 'left' },
      { text: 'an entire monumental carved stone archway standing on a misty highland ridge framing a golden sunrise horizon', placement: 'right' }
    ])
  },
  {
    id: 'ai-generated',
    label: 'AI Generated (Hardverski moduli u galeriji)',
    previewImage:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'CNC crni anodizovani aluminijum i ćilibarno staklo na postolju od Nero Marquina mermera u izložbenoj galeriji.',
    subjects: wrapSubjects([
      {
        text: 'a complete luxury matte-black anodized aluminum AI compute core featuring precision machined cooling fins, a dark sapphire-tinted optical glass viewport with zero text or UI, and fan-like golden-amber translucent glass blades mounted on a polished black Nero Marquina marble plinth',
        placement: 'right'
      },
      {
        text: 'a complete monolithic black anodized metal quantum processing module framed by four sculpted golden-amber edge-lit glass fins resting on a veined black marble pedestal inside a dark architectural showroom',
        placement: 'right'
      },
      {
        text: 'an entire precision-milled matte obsidian hardware node with slotted heat-sink louvers, a deep blue-black optical sensor window, and cascading warm amber glass fins resting on a dark marble console',
        placement: 'left'
      },
      {
        text: 'a complete sculptural luxury AI hardware monolith in brushed gunmetal and matte black alloy surrounded by layered translucent champagne-gold crystal plates on a black veined marble slab',
        placement: 'center'
      },
      {
        text: 'a complete compact black anodized neural engine cube featuring a recessed dark optical lens aperture and symmetrical golden-amber glass wings on a dark Nero Marquina marble plinth',
        placement: 'right'
      }
    ])
  },
  {
    id: 'vila-na-moru',
    label: 'Vila na moru (Luksuzni eksterijeri na liticama)',
    previewImage:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Phase One IQ4 150MP • Moderne bele vile uklesane u morske litice sa konzolnim bazenom iznad tirkiznog mora.',
    subjects: wrapSubjects([
      {
        text: 'an entire luxury modern cliffside villa cantilevered over a sheer coastal cliff face, featuring white concrete architecture, floor-to-ceiling glass sliding doors, and a dramatic infinity pool extending out into the air, anchored on rugged natural cliff rock with sparse coastal vegetation, overlooking an expansive deep turquoise-blue sea stretching to a hazy mountainous coastline',
        placement: 'left'
      },
      {
        text: 'a complete multi-level architectural coastal villa built into a steep rocky precipice, showcasing open terrace living spaces, seamless floor-to-ceiling glass facades, and an iconic infinity lap pool hovering high above the sea, overlooking a vast azure ocean and distant misty mountain shores',
        placement: 'left'
      },
      {
        text: 'an entire minimalist white-concrete seaside villa anchored to a natural limestone cliffside, featuring expansive outdoor lounging decks, frameless glass-railed balconies, and a cantilevered swimming pool projecting into space, looking out over the open Mediterranean sea',
        placement: 'left'
      },
      {
        text: 'a complete sculptural contemporary residence integrated into a high coastal rock face, showcasing layered curved white concrete terraces, massive glazed walls, and a dramatic infinity pool jutting out over the deep turquoise ocean',
        placement: 'left'
      },
      {
        text: 'an entire elite cliffside retreat crafted from raw off-white architectural concrete and structural glass, featuring an indoor-outdoor lounge area, glass-paneled upper levels, and a zero-edge infinity pool floating over the sheer rocky drop with open views of a sparkling sapphire sea',
        placement: 'left'
      }
    ])
  },
  {
    id: 'hero-pozadine-obsidian-prism',
    label: 'Hero pozadine (Crni tečni opsidijan i prizmatično staklo)',
    previewImage: '/46.jpg',
    previewNote:
      'Shot on Phase One IQ4 150MP, 80mm Schneider lens • Crni tečni talasi sa oštrim optičkim staklenim prizmama i čistim negativnim prostorom za sajt.',
    subjects: wrapSubjects([
      {
        text: 'an abstract 3D dark-mode widescreen hero background featuring glossy black liquid obsidian silk folds intersected by razor-sharp transparent optical glass spears with subtle emerald-green and violet spectral dispersion along their beveled edges and clean matte-black negative space on the left',
        placement: 'right'
      },
      {
        text: 'ultra-sleek dark liquid chrome ripples flowing smoothly beneath crossing crystal-clear borosilicate glass needles with delicate cyan, emerald, and violet light caustics inside the glass facets against a pure black void',
        placement: 'right'
      },
      {
        text: 'deep pitch-black liquid metal satin waves sculpted in fluid motion with intersecting sharp-tipped optical quartz shards refracting subtle emerald and amethyst light beams and unobstructed left typography space',
        placement: 'right'
      },
      {
        text: 'flowing dark anodized liquid waves with high-contrast silver-grey specular ridges and crossed transparent prism cones displaying subtle teal and violet internal light dispersion for SaaS hero banners',
        placement: 'right'
      },
      {
        text: 'luxury dark-mode abstract hero composition of smooth undulating black ferro-silk folds and sharp intersecting glass lance structures with delicate iridescent optical refraction and pure #05070B black negative space',
        placement: 'right'
      },
      {
        text: 'glossy liquid carbon-black waves rippling diagonally with razor-edged clear crystal beams intersecting at acute angles and emitting subtle green-purple spectral caustics',
        placement: 'right'
      }
    ])
  }
];

const CATEGORY_ENVIRONMENTS = {
  'luxury-car-parts-brakes-seats-lights': [
    'installed in its native position on the luxury vehicle inside a dark private showroom with a seamless pitch-black non-reflective wall on the right so nothing is visible on the right side, featuring flawless mirror-gloss metallic clearcoat paintwork with zero dust specks, zero scratches, and zero surface anomalies',
    'mounted intact on the luxury vehicle inside an ultra-clean dark architectural studio garage with completely empty pitch-black negative space on the right half of the frame and pristine high-gloss metallic automotive paintwork free of any dust or blemishes',
    'fitted cleanly on the luxury vehicle at night with the right half of the frame dissolving into pure unobstructed pitch-black darkness with zero background objects, showcasing concours-grade mirror-gloss metallic bodywork with zero imperfections',
    'installed natively on the luxury vehicle inside a dark minimalist design bay where the entire right side of the composition is clean empty dark shadow with no other vehicles or structures visible, highlighting flawless liquid-smooth metallic clearcoat paintwork',
    'mounted in place on the luxury vehicle in a dark night setting with completely blank pitch-black negative space on the right side and immaculate high-gloss metallic paintwork with zero dust, zero orange peel, and zero anomalies'
  ],
  'luxury-watches': [
    'nested neatly inside its complete ornate matching presentation box lined with rich warm amber velvet and fitted compartments with zero text or logos',
    'resting securely on a sculpted cushion wrapped in luminous golden-amber silk inside a complete finely decorated collector case with zero text or logos',
    'displayed inside an entire ornate carved walnut watch box with plush amber satin interior lining and brass hinges with zero text or logos',
    'poised on a tailored pillow of rich amber crushed velvet inside a complete embellished collector presentation box with zero text or logos',
    'housed neatly inside its complete matching luxury watch case lined with warm cognac-amber suede with zero text or logos'
  ],
  'diamonds-jewelry': [
    'nested neatly inside its complete ornate matching jewelry presentation box lined with rich warm amber velvet and fitted slots with zero text or logos',
    'resting securely on a sculpted cushion wrapped in luminous golden-amber silk inside a complete finely decorated high-jewelry case with zero text or logos',
    'displayed inside an entire ornate carved wood jewelry chest with plush amber satin interior lining and brass hinges with zero text or logos',
    'poised on a tailored pillow of rich amber crushed velvet inside a complete luxury boutique presentation box with zero text or logos',
    'housed neatly inside its complete matching collector jewelry box lined with warm cognac-amber suede with zero text or logos'
  ],
  'smoke-and-gold-leaf-mask': [
    'photographed against a seamless dark charcoal grey portrait studio backdrop with clean atmospheric depth',
    'set inside a minimalist dark-walled editorial portrait studio with subtle smoky haze and clean negative space',
    'captured against a matte obsidian studio cyclorama with crisp separation between subject and dark background',
    'framed inside a moody low-key fine-art portrait studio with deep charcoal shadow gradations',
    'isolated against a seamless dark slate-grey studio backdrop with clean asymmetric framing'
  ],
  'bioluminescent-porcelain-portrait': [
    'photographed inside a moody low-key portrait studio with a soft dark charcoal background and subtle depth falloff',
    'set against a dimly lit classical gallery wall in deep shadow so the subtle blue glow stands out naturally',
    'captured in an intimate dark portrait studio with soft out-of-focus shadow tones behind the subject',
    'framed inside a quiet minimalist dark-toned studio with smooth tonal background separation',
    'set against a deep muted slate-black portrait backdrop with gentle atmospheric depth'
  ],
  'human-scale-surrealism': [
    'captured in a quiet minimalist daylight portrait studio with soft neutral stone-grey background depth',
    'set inside a refined contemporary gallery room with soft out-of-focus architectural plaster walls',
    'photographed against a smooth dark charcoal portrait backdrop with clean studio separation',
    'framed inside an intimate editorial portrait space with natural window light and soft shadow falloff',
    'set against a muted warm-grey linen studio backdrop with shallow depth of field'
  ],
  'submerged-venetian-palazzo': [
    'submerged in the clear turquoise-blue coastal waters of the Venetian lagoon with natural seabed sand and historic stone pilings',
    'resting partially beneath calm Adriatic sea water with shimmering surface waves dividing the underwater hall from the open sky above',
    'situated in clear shallow Mediterranean water along a historic stone canal with sunbeams piercing the water surface',
    'partially flooded by crystal-clear sea water with natural marine sediment and light rays reaching the submerged stone floor',
    'resting in calm coastal waters where the waterline cleanly splits the underwater stone arches from the sunlit upper facade'
  ],
  'infinite-library-of-aerogel': [
    'inside a monumental multi-story architectural archive hall receding into soft cool atmospheric mist',
    'within a vast brutalist reading atrium with towering galleries, bridges, and quiet diffused daylight',
    'along endless stepped library corridors bathed in cool filtered light and subtle airborne dust motes',
    'inside a cavernous contemporary museum archive with soaring translucent columns and serene depth',
    'within an expansive architectural gallery hall dissolving softly into a pale misty vanishing point'
  ],
  'ferrofluid-sculpture': [
    'resting on a mirror-polished black obsidian stage inside a dark scientific photography studio',
    'positioned over a submerged neodymium magnet array on a wet black glass laboratory plate',
    'set on a sleek dark anodized metal surface inside a controlled pitch-black optical studio',
    'captured on a wet dark basalt slab inside a minimalist dark physics demonstration chamber',
    'resting on a glossy black glass surface against a pure non-reflective black studio background'
  ],
  'frozen-strawberry-micro-scan': [
    'suspended inside a sub-zero cryogenic laboratory chamber with delicate cold vapor and dark scientific backdrop',
    'mounted on a chilled dark anodized specimen stage inside an optical research studio',
    'captured inside a frosted glass cryo-preservation cell with cool scientific backlighting and dark background',
    'isolated on a cold matte-black laboratory plate surrounded by faint sub-zero mist',
    'set inside a precision botanical cryogenics chamber with clean dark background separation'
  ],
  'natgeo-bbc-wildlife': [
    'in its authentic wild natural habitat with untouched wilderness terrain and soft telephoto background depth',
    'surrounded by raw unspoiled wilderness scenery under authentic natural weather conditions',
    'in a remote protected wildlife reserve with natural terrain textures and atmospheric distance',
    'within its native wild ecosystem with authentic seasonal foliage, snow, or terrain details',
    'captured on location in the wild with natural environmental depth and zero human presence'
  ],
  'marine-underwater-life': [
    'in its natural open-water marine habitat with authentic sub-surface visibility, water particles, and depth falloff',
    'swimming freely in clear natural ocean waters with sunbeams filtering down from the surface above',
    'within a healthy natural underwater reef ecosystem with authentic marine flora and seabed textures',
    'gliding through deep blue pelagic waters with natural underwater light gradients',
    'in clear coastal ocean water above natural sandy and rocky seabed formations'
  ],
  'underwater-cafes-sunken-worlds': [
    'resting on a sandy coral-rimmed ocean floor bathed in warm sun-filtered golden-amber underwater haze',
    'situated on the seabed amidst drifting marine particles, gentle currents, and warm glowing cafe lamps',
    'submerged in clear warm coastal waters with shafts of sunlight piercing down toward the sunken terrace',
    'set on a quiet rocky ocean floor surrounded by small reef fish and warm underwater light glow',
    'resting on the seabed in glowing golden-amber water with soft underwater depth falloff'
  ],
  'extreme-weather-sky': [
    'stretching across a vast untamed natural horizon with dramatic atmospheric scale and weather depth',
    'overlooking rugged mountain ridges and open valleys under shifting storm and twilight skies',
    'above dark ocean swells and remote coastal cliffs in raw natural weather conditions',
    'across wide open highlands with dramatic cloud formations and natural atmospheric perspective',
    'over a remote arctic fjord and snow-covered peaks under vivid polar sky light'
  ],
  'futuristic-architecture': [
    'integrated seamlessly into a dramatic natural landscape of cliffs, mountains, or coastline with realistic terrain contact',
    'set on a rugged rocky ridge overlooking a vast misty valley with natural vegetation and stone',
    'anchored into a sheer coastal rock face above calm ocean waters under open sky light',
    'nestled within a serene alpine landscape surrounded by pine forest and mountain peaks',
    'built onto natural desert sandstone terrain with realistic shadows and atmospheric horizon depth'
  ],
  'luxury-fragrances-spirits': [
    'placed on a honed travertine vanity counter inside a sunlit luxury dressing room with soft linen curtains in the background',
    'resting on a dark walnut and brushed-brass bar counter inside an intimate private lounge with warm out-of-focus bottles behind',
    'set on a dark Nero Marquina marble bathroom console beside a folded white cotton towel and soft morning window light',
    'arranged on a leather-inlaid oak study table inside a quiet executive salon with warm ambient lamp glow',
    'placed on a polished stone tasting table inside a high-end cocktail lounge with subtle warm bokeh lights'
  ],
  'ancient-abandoned-sanctuaries': [
    'nestled deep within an overgrown woodland valley with wild moss, ferns, and morning mist',
    'standing in a secluded mountain gorge beside a clear rushing stream and weathered boulders',
    'surrounded by ancient Mediterranean olive trees and wild greenery under soft natural daylight',
    'set along a quiet forested riverbank with damp stones and fallen autumn leaves',
    'standing in shallow calm coastal water reflecting soft twilight clouds along a quiet shore'
  ],
  'night-automotive-urban': [
    'on a rain-slicked downtown metropolitan avenue at night with warm shopfront and streetlamp reflections on wet asphalt',
    'along a quiet wet European cobblestone street at night under warm vintage streetlamps',
    'on a winding dark alpine mountain pass road at night beneath a clear starry sky',
    'along a coastal highway overlooking dark ocean waves at night with wet road reflections',
    'parked along an illuminated architectural harbor promenade at blue-hour nightfall'
  ],
  'nature-seasons-rivers': [
    'in an untouched national park wilderness with crystal-clear water, natural river stones, and old-growth forest',
    'across a sweeping alpine mountain valley with crisp clean air and natural seasonal foliage',
    'along a wild winding river canyon with authentic geological rock strata and forest banks',
    'in a serene high-altitude glacial basin surrounded by rugged snow-dusted summits',
    'across a pristine river valley at dawn with low drifting mist over the water'
  ],
  'surreal-fantasy-worlds': [
    'set within a breathtaking high-altitude landscape of jagged mountain peaks, waterfalls, and golden cloud seas',
    'inside a monumental vaulted stone hall with tall Gothic windows and shafts of natural daylight',
    'amidst a dramatic coastal seascape of towering basalt sea stacks and crashing ocean surf',
    'within a vast subterranean crystal cavern illuminated by natural bioluminescent flora',
    'standing in a tranquil misty highland valley at sunrise with sweeping atmospheric depth'
  ],
  'unusual-luxury-collisions': [
    'set on a rustic weathered wooden table in a sunlit forest clearing surrounded by ferns and wildflowers',
    'positioned on a scenic alpine mountain road turnout overlooking snow-dusted peaks and valleys',
    'placed on a weathered timber lakeside pier beside calm mountain water at twilight',
    'set on an outdoor stone terrace overlooking a peaceful river valley at golden hour',
    'parked along a quiet scenic lakefront road with mirror-still water reflections'
  ],
  'cinematic-portraits-glamour': [
    'inside a grand historic European palace ballroom with crystal chandeliers, gilded moldings, and marble floors',
    'within a moody classical museum gallery surrounded by tall arched windows and textured plaster walls',
    'inside a candlelit architectural salon with rich velvet drapery and warm ambient glow',
    'beside a sweeping marble staircase inside a classic luxury hotel lobby',
    'inside a quiet wood-paneled private library with floor-to-ceiling bookshelves and warm lamp light'
  ],
  'unusual-photography': [
    'set across a vast mirror-still salt flat at twilight reflecting the glowing horizon sky',
    'floating above a dense sea of white alpine clouds between rugged mountain summits',
    'standing inside an ancient misty redwood forest clearing with soft shafts of morning light',
    'inside an open-dome mountain astronomical observatory overlooking starry night peaks',
    'on a narrow strip of black volcanic sand beach between calm ocean swells at dusk'
  ],
  'womens-eyewear': [
    'resting neatly on a honed white Calacatta marble vanity table beside a silk scarf in a bright boutique dressing room',
    'placed on a tan quilted leather console inside a luxury grand tourer cabin in soft daylight',
    'resting on a travertine cafe table on a sunlit Mediterranean hotel terrace overlooking the sea',
    'displayed on a brushed brass and suede tray inside an upscale optical boutique',
    'set on a warm oak dressing table near tall sheer-curtained windows in soft morning light'
  ],
  'womens-handbags': [
    'standing upright on a honed travertine display plinth inside a minimalist luxury fashion boutique',
    'resting on a cognac leather armchair inside a sunlit Parisian apartment salon',
    'placed on a polished marble console table in a high-end hotel suite foyer',
    'set on a tailored suede bench inside a bespoke walk-in wardrobe with soft warm cove lighting',
    'resting on a white-linen terrace table overlooking a calm coastal garden in soft afternoon light'
  ],
  'luxury-home-interiors': [
    'inside an architectural private residence designed with natural stone, warm timber, and expansive floor-to-ceiling glass views',
    'within a serene contemporary penthouse overlooking a distant city skyline and soft horizon light',
    'inside a tranquil courtyard villa where natural daylight filters across honed limestone and oak surfaces',
    'within a bespoke modernist home blending indoor living spaces with lush exterior garden views',
    'inside an executive architectural residence with balanced natural light and refined material textures'
  ],
  'oceanfront-villas': [
    'perched along dramatic coastal cliffs overlooking a vast turquoise and deep-blue ocean horizon',
    'set directly above a secluded rocky cove with crystal-clear coastal water and gentle surf',
    'integrated into a sun-drenched Mediterranean hillside overlooking the open sea and distant islands',
    'anchored onto rugged coastal granite cliffs facing a calm steel-blue ocean at twilight',
    'surrounded by coastal palms and reflection pools overlooking a tranquil tropical bay'
  ],
  'forest-cabins': [
    'nestled deep inside a quiet old-growth pine and cedar forest with misty woodland views through every window',
    'surrounded by snow-laden spruce trees in a serene alpine winter forest',
    'set beside a mossy woodland clearing in the Pacific Northwest during soft morning fog',
    'tucked into a secluded mountain forest hillside overlooking tall fir trees at dusk',
    'surrounded by lush forest ferns and ancient redwoods with soft filtered canopy light'
  ],
  'aviation-yachts': [
    'cruising high above a sunlit sea of clouds at golden hour with crisp sky clarity',
    'anchored in a calm deep-blue Mediterranean bay surrounded by distant coastal hills',
    'parked inside a spotless modern architectural private aviation hangar with polished epoxy floors',
    'gliding across mirror-still turquoise coastal waters at sunrise',
    'high above twilight cloud tops with warm horizon light illuminating the cabin'
  ],
  'gourmet-culinary': [
    'set on a luxuriously dressed fine-dining restaurant table with crisp white damask linen, polished silver cutlery, stemmed crystal wine glasses, and a heavily blurred candlelit dining room background with creamy bokeh',
    'arranged on a dark solid-walnut Michelin-starred restaurant table with gold-rimmed charger plates, fine crystal stemware, folded linen napkin, and a deeply out-of-focus warm restaurant interior behind',
    'served on a honed Calacatta marble luxury restaurant table with brushed brass cutlery, crystal water goblet, and an ultra-shallow depth of field blurring the distant chandelier-lit dining hall into smooth bokeh',
    'presented at an upscale European gourmet restaurant table dressed with fine linen, crystal wine glass, and small porcelain condiment bowls against a richly blurred warm ambient restaurant background',
    'placed on an opulent dark-oak fine-dining table with silver flatware, crystal glassware, and soft candlelight while the background dining room dissolves into deep creamy optical blur'
  ],
  'abstract-concepts': [
    'set inside a serene mist-filled forest clearing with soft shafts of natural morning sunlight',
    'positioned on a vast quiet salt plain under dramatic twilight sky gradations',
    'surrounded by wild meadow grasses and soft golden-hour sunlight in an open valley',
    'standing on a rugged misty highland ridge overlooking distant mountain silhouettes',
    'within a tranquil subterranean cavern illuminated by soft natural mineral glow'
  ],
  'ai-generated': [
    'displayed on a black Nero Marquina marble pedestal inside a minimalist dark architectural technology gallery',
    'set on a dark stone executive console inside a modern private showroom with subtle architectural lighting',
    'positioned inside a sleek dark anodized exhibition space with clean shadow lines and zero clutter',
    'resting on a beveled dark marble plinth inside a quiet contemporary design studio',
    'presented on a polished obsidian display block in a dark-toned architectural interior'
  ],
  'vila-na-moru': [
    'set high above a vast shimmering turquoise and deep cobalt sea with a clean open horizon on the right and soft atmospheric coastal haze',
    'perched along dramatic sun-drenched limestone cliffs overlooking crystal-clear coastal coves and expansive open ocean negative space',
    'anchored into rugged natural coastal rock formations with calm deep-blue Mediterranean waters stretching uninterrupted across the right side of the frame',
    'suspended above steep rocky seaside precipices with bright turquoise water near the base of the cliffs and serene distant mountain silhouettes',
    'framed against an expansive sunlit coastal panorama with glassy infinity-pool reflections and vast open sky and sea space'
  ],
  'hero-pozadine-obsidian-prism': [
    'suspended in an infinite pitch-black studio void with zero background clutter and smooth gradient falloff',
    'set against a deep matte obsidian dark-mode canvas engineered for high-contrast website hero overlays',
    'floating inside a dark architectural optical chamber with pure #05070B black negative space on the left',
    'emerging from deep velvety shadow planes with mirror-smooth dark liquid surface reflections',
    'framed in a widescreen 16:9 dark editorial environment with clean asymmetric negative space for headlines'
  ]
};

const CULINARY_SHALLOW_DOF_OPTICS = [
  'Shot on Hasselblad H6D-100c, HC 100mm f/2.2 lens wide open at f/2.2, razor-sharp focus on the main dish and both side dishes, heavily blurred luxury restaurant background with creamy circular bokeh, RAW unedited color',
  'Shot on Phase One IQ4 150MP, Schneider 110mm LS f/2.8 lens at f/2.8, shallow depth of field melting the distant dining room into soft bokeh, crisp culinary texture, natural organic film grain',
  'Shot on Canon EOS R5, RF 85mm f/1.2L USM wide open at f/1.4, extreme background blur, tack-sharp focus across the plated main course and two side dishes, unretouched editorial gastronomy',
  'Shot on Leica SL2-S, APO-Summicron-SL 90mm f/2 ASPH at f/2.0, velvety out-of-focus restaurant background, luminous specular highlights on sauce and crystal glassware, zero AI gloss',
  'Shot on Fujifilm GFX 100 II, GF 110mm f/2 R LM WR wide open at f/2.0, medium-format shallow depth of field, deeply blurred warm ambient dining hall behind, authentic food texture',
  'Shot on Sony Alpha 1, FE 85mm f/1.4 GM at f/1.4, ultra-smooth background bokeh, crisp focus on plated dish and two side accompaniments, natural RAW sensor response',
  'Shot on Nikon Z9, Nikkor Z 85mm f/1.2 S wide open at f/1.4, dramatic background separation with creamy bokeh, razor-sharp culinary detail, true-to-life color rendition',
  'Shot on Arri Alexa 65, 85mm Prime DNA lens at f/1.8, cinematic shallow depth of field, deeply blurred restaurant background lights, Kodak Portra 400 tonal warmth'
];

const LIGHTING_RIGS = [
  'pierced by a single tall vertical shaft of natural midday sunlight with volumetric god rays',
  'illuminated by low-angle golden-hour sunlight casting long crisp natural shadows',
  'lit by soft north-facing diffused daylight with smooth tonal falloff and bounce fill',
  'sculpted by dramatic chiaroscuro rim lighting and crisp specular reflections',
  'bathed in cool blue-hour twilight ambient fill with warm directional interior glow',
  'highlighted by clean directional softbox reflections and deep shadow contrast',
  'under moody overcast sky light creating soft micro-contrast across authentic textures',
  'backlit by subtle crepuscular light rays cutting through fine atmospheric haze',
  'illuminated by a narrow directional beam of warm late-afternoon sun',
  'balanced by soft ambient window light and subtle architectural shadow play',
  'lit by crisp downward sunbeams cutting through clear water with natural caustics',
  'illuminated by a precision grazing rim light igniting crisp spectral reflections',
  'lit by dramatic Rembrandt chiaroscuro lighting with deep shadow contrast and sculpted highlights',
  'bathed in soft global illumination and natural bounce fill with clean tonal transitions',
  'sculpted by intense rim lighting and golden-hour backlighting with warm atmospheric haze',
  'under moody low-key directional lighting with crisp specular highlights'
];

const OPTICS_PROFILES = [
  'Shot on Phase One IQ4 150MP, 80mm Schneider Kreuznach lens, f/8, wide clean framing, razor-sharp focal plane, RAW unedited sensor response, micro-contrast preservation, natural organic film grain',
  'Shot on Hasselblad H6D-100c, HC 80mm f/2.8 lens, 1/125s, ISO 64, linear color science, subtle optical depth, fine surface patina, zero plastic smoothing',
  'Shot on Arri Alexa 65, 65mm Prime DNA lens at f/2.0, cinematic depth of field, Kodak Portra 400 tonal depth, natural bokeh, subtle lens dust',
  'Shot on Leica SL2-S, APO-Summicron 50mm f/2 ASPH, crisp edge-to-edge optical clarity, natural specular highlights, authentic micro-imperfections, zero AI gloss',
  'Shot on 80mm prime lens, f/5.6, extreme optical fidelity, subtle natural chromatic aberration, Fujifilm Velvia 50 dynamic range, fine grain',
  'Shot on medium format technical camera, 24mm tilt-shift lens, f/11, architectural perspective control, deep tonal gradation, RAW photographic realism',
  'Shot on Red V-Raptor 8K VV, 50mm anamorphic prime at f/2.8, 1/4000s high-speed shutter, crisp contact shadows, organic filmic texture',
  'Shot on Sony Alpha 1, 50mm f/1.4 GM, ISO 100, unretouched editorial photography, authentic material grain, zero synthetic smoothing',
  'Shot on Fujifilm GFX 100 II, GF 80mm f/1.7 R WR, medium-format tonal latitude, natural highlight roll-off, authentic surface texture',
  'Shot on Canon EOS R5, RF 50mm f/1.2L USM, crisp focal detail, organic optical rendering, clean unedited RAW color response',
  'Shot on Nikon Z9, Nikkor Z 50mm f/1.2 S, high dynamic range, natural micro-texture, unedited editorial fidelity',
  'Shot on Hasselblad X2D 100C, XCD 90V f/2.5, crisp medium-format detail, authentic tonal balance, zero artificial processing',
  'Shot on Arri Alexa 65, 65mm f/2.0 prime lens, cinematic still, anamorphic lens flare, natural depth of field, Kodak Portra 400 film grain',
  'Shot on IMAX 70mm film, 35mm wide-angle cinema lens, f/2.8, extreme scale and detail, subtle film grain, dramatic natural contrast',
  'Shot on Hasselblad X2D 100C, XCD lens, ProRes 4444XQ linear color, HDR10+ film still, optical realism, zero synthetic smoothing',
  'Shot on Zeiss Otus 85mm f/1.4 Apo Planar, ISO 64 fine film grain, ACEScg cinematic bounce, refraction noise-off, razor-sharp focal separation',
  'Shot on Sony A7IV, 35mm f/1.4 lens, editorial realism, crisp bokeh, authentic surface micro-texture, natural low-light grain',
  'Shot on Canon EOS R5, 50mm f/1.8 lens, RAW unedited photo, 1/125s shutter, ISO 100, focus stacking, natural optical depth',
  'Shot on Leica SL2-S, APO-Summicron-SL 75mm f/2.0, apochromatic optical precision, natural highlight roll-off',
  'Shot on Phase One IQ4 150MP backplate, 120mm macro lens, f/8, high-speed capture, HDR micro-contrast 256-map, uncompressed RAW 16-bit ACEScg',
  'Shot on 35mm film camera, Kodak Vision3 250D, Ektachrome tonal latitude, subtle chromatic aberration, organic lens flare, film grain',
  'Shot on 85mm prime lens, f/2.8, 1/250s shutter, clean full-subject framing, creamy bokeh, sharp focus on subject'
];

const LUXURY_WATCH_META_TOKENS = [
  '[Meta Tokens: Sapphire anti-reflective coating, guilloché dial micro-engraving, brushed grade-5 titanium, tourbillon bridge beveling, crisp specular highlights]',
  '[Meta Tokens: Precious metal micro-grain, domed sapphire refraction, hand-chamfered lugs, warm tonal depth, horological fidelity]',
  '[Meta Tokens: Ceramic bezel gloss, luminous index micro-relief, brushed steel grain, crisp edge contrast, optical realism]',
  '[Meta Tokens: Platinum density sheen, sub-dial micro-texture, gear train reflections, rim light separation, high-horology detail]',
  '[Meta Tokens: Forged carbon weave texture, sapphire crystal clarity, mechanical escapement depth, crisp shadows, studio lighting]'
];

const CLIFFSIDE_VILLA_META_TOKENS = [
  '[Meta Tokens: high-contrast sea, volumetric sunlight, cantilevered infinity pool, realistic cliffside vegetation, GFX format, no watermarks, zero text]',
  '[Meta Tokens: cantilevered infinity pool, white architectural concrete, sheer rocky cliff face, vast negative sea space on the right, volumetric sun rays, GFX 100MP]',
  '[Meta Tokens: modern cliffside villa, seamless glass sliding doors, natural rugged rock, expansive turquoise-blue sea, distant mountains in haze, RAW unretouched]',
  '[Meta Tokens: zero-edge infinity pool water refraction, off-white concrete texture, sheer limestone drop, open Mediterranean horizon, natural daylight]',
  '[Meta Tokens: architectural tilt-shift precision, sunbeams piercing coastal haze, turquoise cove water, cantilevered slab, unedited 16-bit RAW]'
];

const HERO_LIQUID_META_TOKENS = [
  '[Meta Tokens: optical glass dispersion, liquid obsidian chrome, emerald-violet caustics, dark-mode UI hero negative space, 16-bit ACEScg, zero banding]',
  '[Meta Tokens: borosilicate prism refraction, black liquid silk BRDF, chromatic dispersion, PhaseOne IQ4 150MP optics, pure #05070B blacks]',
  '[Meta Tokens: anisotropic dark metal reflections, spectral caustic projection, razor-sharp glass bevels, clean left negative space, RAW studio output]',
  '[Meta Tokens: physically based glass IOR 1.52, liquid ferro-chrome waves, subtle iridescent edge glow, widescreen 16:9 hero composition]',
  '[Meta Tokens: Hasselblad X2D optical clarity, subsurface light dispersion, mirror-black fluid folds, zero text, zero watermarks]'
];

const CULINARY_META_TOKENS = [
  '[Meta Tokens: Michelin fine-dining table setting, two distinct plated side dishes, heavy creamy background bokeh, subsurface food sheen, unedited RAW]',
  '[Meta Tokens: shallow depth of field f/1.4, luxury damask tablecloth, crystal stemware reflections, appetizing glaze highlights, zero text]',
  '[Meta Tokens: editorial gastronomy photography, blurred candlelit restaurant background, crisp focus on main course and two sides, 16-bit ACEScg]',
  '[Meta Tokens: natural food micro-texture, warm dining room bokeh orbs, fine silverware and linen, authentic culinary color science]',
  '[Meta Tokens: Hasselblad H6D shallow focus, luxury table presentation with two side accompaniments, creamy background separation, zero watermarks]'
];

const CAR_PARTS_META_TOKENS = [
  '[Meta Tokens: concours-grade mirror-gloss metallic clearcoat, zero dust specks, zero scratches, intensely glowing LED lights powered on, pitch-black right negative space, 16-bit RAW]',
  '[Meta Tokens: liquid-smooth high-gloss metallic automotive paintwork, zero surface anomalies, illuminated LED projectors and taillights, clean empty dark right side, PhaseOne IQ4 150MP]',
  '[Meta Tokens: flawless metallic flake depth, mirror-polish clearcoat, active LED light signatures turned on, unobstructed black right background, zero defects]',
  '[Meta Tokens: showroom-grade spotless metallic finish, zero orange peel, glowing red and white LED optics, pitch-black negative space on right, unedited RAW]'
];

const META_TOKEN_STACKS = [
  '[Meta Tokens: Physically based rendering, authentic surface micro-texture, natural light falloff, deep tonal contrast, unretouched RAW]',
  '[Meta Tokens: IMG_2098.CR2, uncompressed RAW 16bit ACEScg, optical clarity, lostfilm_realism.v1, HDR_microcontrast_256map]',
  '[Meta Tokens: Hasselblad_X2D_lensmap, ProRes_4444XQ, authentic material reflectivity, HDR10+ film still, phaseone_IQ4_backplate]',
  '[Meta Tokens: ACEScg_P3_D65_matrix, exposure_stack_x9_dynamicrange, natural shadow separation, subsurface scattering, physically based rendering]',
  '[Meta Tokens: ISO_64_filmgrain, clean optical bokeh, albedo_subsurface.vfx, micro-texture_specular_2026, lux_tonecurve.8bit_expansion]'
];

const V10_GUARDRAILS =
  'AI_GUARDRAILS: subject completely visible in its authentic real-world environment, no cropped edges, clean commercial composition, zero text, zero typography, zero logos, zero watermarks, zero UI overlays';

const BATCH_LIMIT = 10;
const TARGET_UNIQUE_PROMPTS = 5000;

function ZeroGReactorStage({ surge }) {
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
    window.addEventListener('mousemove', onMove);

    const stars = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35,
      r: 0.9 + Math.random() * 1.9,
      isCyan: i % 3 === 0,
      alpha: 0.25 + Math.random() * 0.65
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0.1) {
          const force = (140 - dist) / 140;
          s.vx += (dx / dist) * force * 0.3;
          s.vy += (dy / dist) * force * 0.3;
        }

        s.vx *= 0.96;
        s.vy = s.vy * 0.96 + (-0.22) * 0.04;
        s.x += s.vx;
        s.y += s.vy;

        if (s.y < -10) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.isCyan
          ? `rgba(56, 189, 248, ${s.alpha})`
          : `rgba(226, 232, 240, ${s.alpha * 0.7})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />

      <div className="pointer-events-none fixed left-[-90px] sm:left-[2%] top-1/2 -translate-y-1/2 z-0 select-none">
        <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">
          <svg
            viewBox="0 0 440 440"
            className={`w-full h-full ${surge ? 'animate-spin' : 'reactor-spin-slow'}`}
          >
            <circle
              cx="220"
              cy="220"
              r="204"
              fill="none"
              stroke="rgba(56, 189, 248, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="6 10 24 10"
            />
            <circle
              cx="220"
              cy="220"
              r="182"
              fill="none"
              stroke="rgba(148, 163, 184, 0.18)"
              strokeWidth="1"
            />
            <circle
              cx="220"
              cy="220"
              r="158"
              fill="none"
              stroke="rgba(56, 189, 248, 0.34)"
              strokeWidth="2.5"
              strokeDasharray="70 35 15 35"
            />
            <circle
              cx="220"
              cy="220"
              r="134"
              fill="none"
              stroke="rgba(251, 191, 36, 0.24)"
              strokeWidth="1.5"
              strokeDasharray="40 25"
            />
            <circle
              cx="220"
              cy="220"
              r="112"
              fill="none"
              stroke="rgba(56, 189, 248, 0.28)"
              strokeWidth="1.2"
            />
            <line x1="16" y1="220" x2="72" y2="220" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1" />
            <line x1="368" y1="220" x2="424" y2="220" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1" />
            <line x1="220" y1="16" x2="220" y2="72" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1" />
            <line x1="220" y1="368" x2="220" y2="424" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1" />
          </svg>

          <div className="absolute w-[195px] h-[195px] rounded-full border border-dashed border-cyan-400/35 reactor-spin-reverse" />

          <div
            className={`absolute w-[144px] h-[144px] rounded-full bg-[#0a1019]/90 border flex flex-col items-center justify-center transition-all duration-500 ${
              surge
                ? 'border-cyan-400 shadow-[0_0_55px_rgba(34,211,238,0.45)] scale-105'
                : 'border-slate-700/80 shadow-[0_0_40px_rgba(14,165,233,0.16)]'
            }`}
          >
            <span className="text-[13px] font-medium tracking-wide text-slate-300/90">
              Zero-G Reactor
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function V10PromptGenerator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    'luxury-car-parts-brakes-seats-lights'
  );
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [singleIndex, setSingleIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single');
  const [copiedKey, setCopiedKey] = useState(null);
  const [exportBanner, setExportBanner] = useState('');
  const [reactorSurge, setReactorSurge] = useState(false);

  const selectedCategoryObj = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0],
    [selectedCategoryId]
  );

  const triggerSurge = () => {
    setReactorSurge(true);
    setTimeout(() => setReactorSurge(false), 650);
  };

  const buildCategoryPrompts = (categoryObj) => {
    const list = [];
    const seenPrompts = new Set();

    const isJewelryOrWatch =
      categoryObj.id === 'luxury-watches' || categoryObj.id === 'diamonds-jewelry';
    const isCarPartsCategory = categoryObj.id === 'luxury-car-parts-brakes-seats-lights';
    const isCliffsideVillaCategory = categoryObj.id === 'vila-na-moru';
    const isHeroLiquidCategory = categoryObj.id === 'hero-pozadine-obsidian-prism';
    const isCulinaryCategory = categoryObj.id === 'gourmet-culinary';

    const envPool =
      CATEGORY_ENVIRONMENTS[categoryObj.id] ||
      CATEGORY_ENVIRONMENTS['luxury-home-interiors'];

    const optPool = isCulinaryCategory ? CULINARY_SHALLOW_DOF_OPTICS : OPTICS_PROFILES;

    const metaPool = isJewelryOrWatch
      ? LUXURY_WATCH_META_TOKENS
      : isCarPartsCategory
      ? CAR_PARTS_META_TOKENS
      : isCliffsideVillaCategory
      ? CLIFFSIDE_VILLA_META_TOKENS
      : isHeroLiquidCategory
      ? HERO_LIQUID_META_TOKENS
      : isCulinaryCategory
      ? CULINARY_META_TOKENS
      : META_TOKEN_STACKS;

    const subCount = categoryObj.subjects.length;
    const envCount = envPool.length;
    const lightCount = LIGHTING_RIGS.length;
    const optCount = optPool.length;
    const metaCount = metaPool.length;

    const totalPermutations = subCount * envCount * lightCount * optCount * metaCount;
    const targetTotal = Math.min(TARGET_UNIQUE_PROMPTS, totalPermutations);

    const stride = 7919;
    let cursor = 0;

    for (let i = 0; i < totalPermutations && list.length < targetTotal; i++) {
      cursor = (cursor + stride) % totalPermutations;

      let rem = cursor;
      const m = rem % metaCount;
      rem = Math.floor(rem / metaCount);
      const l = rem % lightCount;
      rem = Math.floor(rem / lightCount);
      const e = rem % envCount;
      rem = Math.floor(rem / envCount);
      const s = rem % subCount;
      const o = Math.floor(rem / subCount) % optCount;

      const subjObj = categoryObj.subjects[s];
      const placementLabel = isCarPartsCategory
        ? 'Placement: left half of the frame with completely empty pitch-black negative space on the right so nothing is visible on the right side'
        : subjObj.placement === 'left'
        ? 'Placement: left third with vast negative open space on the right, completely visible inside the frame'
        : subjObj.placement === 'right'
        ? 'Placement: right half with vast negative open space on the left, completely visible inside the frame'
        : 'Placement: centered cleanly in the frame with generous breathing room around all edges, completely visible';

      const placementDirective = resolvePlacementDirective(subjObj.placement);
      const framingClause = isCarPartsCategory ? `${NO_FULL_CAR_DIRECTIVE}, ` : '';
      const unifiedPrompt = `${optPool[o]}, editorial ultra-realistic commercial photograph of ${subjObj.text}. ${placementLabel} (${placementDirective}). ${framingClause}${envPool[e]}, ${LIGHTING_RIGS[l]}. ${metaPool[m]}. ${V10_GUARDRAILS}.`;

      if (!seenPrompts.has(unifiedPrompt)) {
        seenPrompts.add(unifiedPrompt);
        list.push({
          index: list.length + 1,
          category: categoryObj.label,
          prompt: unifiedPrompt
        });
      }
    }

    return list;
  };

  useEffect(() => {
    const initialPool = buildCategoryPrompts(selectedCategoryObj);
    setActivePool(initialPool);
    setSingleIndex(0);
    setBatchOffset(0);
  }, [selectedCategoryObj]);

  const handleDownloadAllFromInput = () => {
    triggerSurge();
    const pool = activePool.length ? activePool : buildCategoryPrompts(selectedCategoryObj);
    const content = pool
      .map((item) => `${item.index}. [${item.category}] ${item.prompt}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `V10_${selectedCategoryObj.id}_${pool.length}_Unikatnih_Promptova.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setExportBanner(`PREUZETO ${pool.length.toLocaleString()} UNIKATNIH PROMPTOVA (.TXT)`);
    setTimeout(() => setExportBanner(''), 3500);
  };

  const handleGenerateBatch10 = () => {
    triggerSurge();
    setViewMode('batch');
    setBatchOffset(0);
  };

  const handlePrevPrompt = () => {
    triggerSurge();
    if (viewMode === 'batch') {
      setBatchOffset((prev) => Math.max(0, prev - BATCH_LIMIT));
    } else {
      setSingleIndex((prev) => (prev > 0 ? prev - 1 : activePool.length - 1));
    }
  };

  const handleNextPrompt = () => {
    triggerSurge();
    if (viewMode === 'batch') {
      setBatchOffset((prev) =>
        prev + BATCH_LIMIT < activePool.length ? prev + BATCH_LIMIT : 0
      );
    } else {
      setSingleIndex((prev) => (prev + 1 < activePool.length ? prev + 1 : 0));
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const activeSinglePrompt = activePool[singleIndex] || {
    index: 1,
    category: selectedCategoryObj.label,
    prompt: ''
  };

  const currentBatch = useMemo(
    () => activePool.slice(batchOffset, batchOffset + BATCH_LIMIT),
    [activePool, batchOffset]
  );

  const selectedCategoryNumber =
    CATEGORIES.findIndex((c) => c.id === selectedCategoryObj.id) + 1;

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 relative overflow-x-hidden font-sans selection:bg-amber-400/30 selection:text-amber-200">
      <style>{`
        @keyframes reactorSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reactorSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .reactor-spin-slow {
          animation: reactorSpinSlow 36s linear infinite;
        }
        .reactor-spin-reverse {
          animation: reactorSpinReverse 22s linear infinite;
        }
        .v10-dual-border {
          position: relative;
          background: linear-gradient(145deg, rgba(11, 16, 24, 0.96), rgba(8, 12, 19, 0.98)) padding-box,
                      linear-gradient(125deg, rgba(34, 211, 238, 0.72), rgba(56, 189, 248, 0.25) 48%, rgba(251, 146, 60, 0.72)) border-box;
          border: 1.5px solid transparent;
        }
        .v10-cyan-border {
          border: 1.2px solid rgba(34, 211, 238, 0.55);
          box-shadow: 0 0 22px rgba(34, 211, 238, 0.14), inset 0 0 14px rgba(34, 211, 238, 0.06);
        }
        .v10-amber-border {
          border: 1.2px solid rgba(251, 146, 60, 0.65);
          box-shadow: 0 0 22px rgba(251, 146, 60, 0.16), inset 0 0 14px rgba(251, 146, 60, 0.06);
        }
      `}</style>

      <ZeroGReactorStage surge={reactorSurge} />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* CENTRALNA ZONA GENERATORA */}
        <main className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-12 pt-7 pb-12">
          <header className="w-full max-w-[780px] flex flex-col items-center text-center mb-7">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-[0.14em] uppercase bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(251,191,36,0.22)]">
              VISIONARY FACTORY V10
            </h1>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/35 text-cyan-300 font-mono font-semibold">
                {activePool.length.toLocaleString()} UNIKATNIH PROMPTOVA
              </span>

              <span className="px-3 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 text-amber-300/90 font-medium">
                REAL-WORLD CONTEXT • OPTICS-FIRST
              </span>

              <a
                href="/goran-exif"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-black tracking-wider uppercase shadow-[0_0_24px_rgba(251,191,36,0.5)] hover:shadow-[0_0_32px_rgba(251,191,36,0.8)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>EXIF VAULT</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </header>

          <div className="w-full max-w-[680px] space-y-5">
            {/* Select labela + Dropdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label
                  htmlFor="v10-category-select"
                  className="text-xs font-medium text-slate-400"
                >
                  Select
                </label>
                <span className="text-[11px] font-mono text-cyan-300/80">
                  Kategorija {selectedCategoryNumber} / {CATEGORIES.length}
                </span>
              </div>

              <div className="relative">
                <select
                  id="v10-category-select"
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setSingleIndex(0);
                    setBatchOffset(0);
                  }}
                  className="w-full appearance-none rounded-xl bg-[#0b1018]/95 v10-cyan-border hover:border-cyan-300 focus:outline-none px-4 py-3.5 pr-11 text-base sm:text-[18px] font-semibold text-white transition cursor-pointer"
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={cat.id} value={cat.id} className="bg-[#0b1018] text-white">
                      {idx + 1}. {cat.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-300 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* Dva glavna dugmeta u redu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={handleDownloadAllFromInput}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#0c121b]/95 hover:bg-cyan-950/40 v10-cyan-border text-cyan-200 font-bold text-xs sm:text-[13px] tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{exportBanner || 'SVI PROMPTOVI IZ INPUTA (.TXT)'}</span>
              </button>

              <button
                onClick={handleGenerateBatch10}
                className="flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-[#13100d]/95 hover:bg-amber-950/35 v10-amber-border text-amber-200 font-bold text-xs sm:text-[13px] tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-[0.99]"
              >
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span>GENERATE (PO 10)</span>
              </button>
            </div>

            {/* Toolbar red sa ikonicom levo i 3 strelice desno */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'single' ? 'batch' : 'single')}
                  title={
                    viewMode === 'single'
                      ? 'Prebaci na prikaz po 10 promptova'
                      : 'Prebaci na fokusirani prikaz 1 prompta'
                  }
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                    viewMode === 'batch'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-[#0c1119]/90 border-slate-800 hover:border-cyan-400/50 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-slate-400">
                  {viewMode === 'single'
                    ? `Prompt #${activeSinglePrompt.index} od ${activePool.length.toLocaleString()}`
                    : `Serija ${batchOffset + 1}–${Math.min(
                        batchOffset + BATCH_LIMIT,
                        activePool.length
                      )} od ${activePool.length.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerSurge();
                    setSingleIndex(0);
                    setBatchOffset(0);
                  }}
                  title="Na prvi prompt (#1)"
                  className="w-9 h-9 rounded-lg bg-[#0d131d] hover:bg-slate-800 border border-cyan-500/35 text-cyan-300 flex items-center justify-center transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handlePrevPrompt}
                  title="Prethodni"
                  className="w-9 h-9 rounded-lg bg-[#0d131d] hover:bg-slate-800 border border-cyan-500/35 text-cyan-300 flex items-center justify-center transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextPrompt}
                  title="Sledeći"
                  className="w-9 h-9 rounded-lg bg-[#16120e] hover:bg-amber-500/20 border border-amber-400/60 text-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.18)] transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fokusirani prikaz 1 primera prompta sa cijan-narandžastim okvirom */}
            {viewMode === 'single' && (
              <article className="v10-dual-border rounded-2xl p-6 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.85)] transition-all duration-300">
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 font-mono text-xs font-bold">
                      #{activeSinglePrompt.index}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-[240px] sm:max-w-[360px]">
                      {activeSinglePrompt.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(activeSinglePrompt.prompt, 'single')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      copiedKey === 'single'
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                        : 'bg-[#121926] hover:bg-amber-400 hover:text-slate-950 border-slate-700 hover:border-amber-400 text-slate-200'
                    }`}
                  >
                    {copiedKey === 'single' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>KOPIRANO</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>KOPIRAJ</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[15px] sm:text-[16px] leading-[1.68] text-slate-100 select-all">
                  {activeSinglePrompt.prompt}
                </p>
              </article>
            )}

            {/* Prikaz serije po 10 promptova */}
            {viewMode === 'batch' && (
              <div className="space-y-4">
                {currentBatch.map((item) => (
                  <article
                    key={item.index}
                    className="v10-dual-border rounded-2xl p-5 sm:p-6 shadow-[0_14px_45px_rgba(0,0,0,0.75)] transition-all"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold">
                          #{item.index}
                        </span>
                        <span className="text-xs text-slate-400">{item.category}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(item.prompt, item.index)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          copiedKey === item.index
                            ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                            : 'bg-[#121926] hover:bg-emerald-400 hover:text-slate-950 border-slate-700 hover:border-emerald-400 text-slate-200'
                        }`}
                      >
                        {copiedKey === item.index ? 'KOPIRANO ✓' : 'KOPIRAJ'}
                      </button>
                    </div>

                    <p className="text-sm sm:text-[15px] leading-relaxed text-slate-100 select-all">
                      {item.prompt}
                    </p>
                  </article>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setViewMode('single')}
                    className="text-xs text-cyan-300 hover:underline cursor-pointer"
                  >
                    ← Nazad na pojedinačni prikaz
                  </button>

                  <button
                    onClick={handleNextPrompt}
                    className="px-5 py-2.5 rounded-xl bg-[#13100d] hover:bg-amber-400 hover:text-slate-950 v10-amber-border text-amber-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    SLEDEĆIH 10 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* DESNI SIDEBAR PANEL SA POKAZNOM SLIKOM KOJA SE MENJA PO KATEGORIJI */}
        <aside className="w-full lg:w-[340px] xl:w-[370px] bg-[#0a0e16]/95 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-5">
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  triggerSurge();
                  setSingleIndex(0);
                  setBatchOffset(0);
                  setViewMode('single');
                }}
                title="Resetuj na početak"
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-[#070a0f] shadow-[0_12px_35px_rgba(0,0,0,0.75)]">
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  key={selectedCategoryObj.id}
                  src={selectedCategoryObj.previewImage}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_PREVIEW_SVG;
                  }}
                  alt={selectedCategoryObj.label}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90">
                {selectedCategoryObj.previewNote}
              </p>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Ukupno unikatnih:</span>
                  <span className="text-amber-300 font-mono font-bold">
                    {activePool.length.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Optički profili:</span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {OPTICS_PROFILES.length} (Na početku svakog)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Okruženje:</span>
                  <span className="text-emerald-400 font-semibold">100% Realno / Namensko</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/70">
            <button
              onClick={handleDownloadAllFromInput}
              className="w-full py-3 rounded-xl bg-[#0e1522] hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Preuzmi svih {activePool.length.toLocaleString()} (.TXT)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}