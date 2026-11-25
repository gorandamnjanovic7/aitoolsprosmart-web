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
  'strictly framing only this specific complete component intact inside the frame with no full car ever shown';

const CATEGORIES = [
  {
    id: 'luxury-car-parts-brakes-seats-lights',
    label: 'Luksuzni auto-delovi i makro enterijer (Bez celog vozila)',
    previewImage:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Phase One IQ4 150MP • Macro automotive detail descriptor anchored to studio component framing without full vehicle silhouette.',
    subjects: wrapSubjects([
      {
        text: 'an ultra-sharp macro photograph of a complete cross-drilled carbon-ceramic brake disc with bright racing yellow brake calipers and pads mounted inside a forged alloy wheel with visible low-profile tire sidewall and sculpted fender arch on the vehicle, showing the entire wheel and brake assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up studio detail of a complete grooved performance brake rotor with electric sapphire blue brake calipers and pads behind dark twin-spoke wheel geometry, visible tire rubber and lower bodywork on the vehicle, entire wheel assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dramatic close-up of a complete ventilated carbon-ceramic brake disc with glossy crimson red multi-piston brake calipers and pads mounted inside a dark forged wheel with tire sidewall and wheel arch on the vehicle, entire wheel assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight interior macro shot of an entire illuminated digital instrument cluster and curved LED display glowing inside a dark luxury vehicle cabin inspired by Porsche and BMW flagship cockpits with zero visible branding or logos, showing the full cockpit display intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio framing of the complete rear section of a dark luxury hypercar inspired by Bugatti and Porsche flagship engineering with zero visible branding or logos, showcasing the full illuminated red LED taillight bar and carbon diffuser intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio close-up of the complete front fascia of a dark luxury supercar inspired by Ferrari and Aston Martin flagship headlights with mandatory glowing front headlights turned on and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up study of a complete sculpted luxury bucket seat in supple cognac aniline leather with quilted side bolsters and fine double stitching installed inside a dark luxury vehicle cabin, entire seat intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dedicated macro close-up of the entire left rear taillight cluster alone integrated into the sculpted rear fender and bumper of the vehicle showing glowing red LED light blades, complete lamp intact with no full car visible',
        placement: 'center'
      }
    ])
  },
  {
    id: 'luxury-watches',
    label: 'Luksuzni satovi',
    previewImage:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Shot on Phase One IQ4 150MP • Haute horlogerie macro descriptor anchoring sapphire crystal and brushed titanium geometry.',
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
      'Shot on Hasselblad H6D-100c • High-jewelry optical dispersion descriptor inside amber collector presentation box.',
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
      'High-speed sync flash • Swirling obsidian & indigo vapor mask with 24k gold leaf fragments.',
    subjects: wrapSubjects([
      {
        text: 'a human silhouette wearing a complete mask sculpted from swirling solid black and indigo smoke trails accented with delicate fractured pieces of 24k gold leaf suspended within the vapor against a seamless dark charcoal grey backdrop with dramatic rim lighting and high-speed sync flash clarity',
        placement: 'left'
      },
      {
        text: 'an enigmatic human profile wearing a complete structured smoke mask formed from dense curling obsidian and deep indigo vapor with floating 24k gold leaf fragments caught in mid-motion and crisp edge illumination on a dark charcoal background',
        placement: 'right'
      },
      {
        text: 'a dramatic studio study of a human silhouette whose entire facial mask is formed from coiled black and indigo smoke filaments interwoven with micro-fractured 24k gold leaf catching sharp specular glints against deep dark grey',
        placement: 'center'
      },
      {
        text: 'a high-speed sync studio portrait showing a complete sculpted mask of solidified black and indigo smoke swirls studded with delicate 24k gold leaf shards suspended in the mist with strong rim lighting against a dark charcoal backdrop',
        placement: 'left'
      },
      {
        text: 'a medium editorial silhouette wearing an entire intricate mask of swirling black and indigo smoke trails embedded with fragile 24k gold leaf flakes and lit by crisp rim light over deep dark charcoal shadow tones',
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
      'Leica SL2-S APO-Summicron • Natural epidermal pores transitioning into cracked antique white porcelain.',
    subjects: wrapSubjects([
      {
        text: 'a head-and-shoulders portrait of a human face where natural skin with visible pores and fine vellus hair transitions seamlessly into cracked antique white porcelain with glowing blue bioluminescent veins pulsing beneath the surface and along the fractures while dark reflective eyes hold sharp focus in moody low-key lighting',
        placement: 'center'
      },
      {
        text: 'an intimate head-and-shoulders face study blending lifelike skin grain and peach fuzz into fine crackled antique porcelain as subtle bioluminescent cyan-blue veins glow within the hairline fissures and dark reflective eyes remain calm and emotionless',
        placement: 'center'
      },
      {
        text: 'a dramatic low-key head-and-shoulders portrait where unblemished skin with crisp pores and delicate vellus hairs gives way to fractured vintage white porcelain laced with luminous blue bioluminescent lines inside the cracks and dark mirror-like eyes in razor focus',
        placement: 'center'
      },
      {
        text: 'a head-and-shoulders editorial portrait showing detailed skin texture and fine hair merging smoothly into crazed antique white porcelain with faint glowing blue bioluminescent veins pulsing under the glaze and dark expressive-void eyes sharply focused',
        placement: 'center'
      },
      {
        text: 'a moody head-and-shoulders face portrait where natural epidermal pores and fine vellus hair transition into cracked cream-white porcelain with glowing electric-blue bioluminescent filaments running through the cracks and dark reflective eyes holding tack-sharp focus',
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
      'Arri Alexa 65 • Human-scale tactile surrealism merging natural skin texture with optical glass and titanium.',
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
      'Over-under optical cross-section • Venetian Gothic palazzo with underwater caustics and gilded stone above.',
    subjects: wrapSubjects([
      {
        text: 'a wide cross-section view of an entire sunken Venetian Gothic palazzo resting on the seabed with its lower half submerged in crystal clear deep blue Mediterranean water showing shimmering caustic light patterns across ornate stone carvings and a decaying fresco while its upper half rises into open air with gilded crumbling architecture and sunbeams penetrating from above',
        placement: 'center'
      },
      {
        text: 'a split-level wide view of an entire ancient Venetian palazzo half-submerged in clear azure sea water with delicate caustic ripples dancing over carved stone arches and faded wall frescoes below the waterline while weathered gilded cornices and open Gothic loggias meet the sky above',
        placement: 'center'
      },
      {
        text: 'a wide view of a half-sunken Venetian Gothic hall where shimmering underwater caustics and fine suspended particles illuminate carved stone tracery and damp fresco remnants below while dry gilded stonework and crumbling arches stand exposed above the surface under sunbeams',
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
      '24mm tilt-shift perspective • Monolithic translucent silica aerogel brutalist library receding into mist.',
    subjects: wrapSubjects([
      {
        text: 'a wide-angle cinematic shot inside an infinite brutalist-style library where all shelving units, floors, and stairs are constructed from monolithic translucent silica aerogel receding into a hazy atmospheric vanishing point with dust motes dancing in soft cool volumetric sunlight',
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
      'High-speed 1/4000s capture • Neodymium magnetic spikes on wet obsidian mirror surface.',
    subjects: wrapSubjects([
      {
        text: 'a complete sculptural blob of black ferrofluid reacting to a powerful Neodymium magnet beneath it, pulling the fluid into sharp, spiky, fractal magnetic field formations on a perfectly reflective wet obsidian surface against a pitch-black background',
        placement: 'center'
      },
      {
        text: 'a complete high-speed liquid ferrofluid cluster forming dense interlocking magnetic spikes and rhythmic ridges above a submerged neodymium core while a single harsh hard-light source carves crisp specular highlights across the dark metallic peaks',
        placement: 'center'
      },
      {
        text: 'an entire sculptural ferrofluid dome splitting into fine needle-like magnetic flux columns over a mirror-dark wet obsidian slab in an absolute black studio void with sharp metallic edge glints',
        placement: 'center'
      },
      {
        text: 'a complete dense black ferrofluid cluster pulled into towering fractal spires by dual magnetic fields beneath a wet black glass stage, catching razor-sharp directional highlights and deep obsidian shadow contrast',
        placement: 'center'
      },
      {
        text: 'a complete symmetrical crown of sharp black ferrofluid spikes sculpted by magnetic attraction on a wet obsidian mirror plane, with intense single-source hard light creating bright metallic pinpoints across every peak',
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
      'Cryogenic scientific studio scan • Micro-hoarfrost crystal lattice and translucent ruby cellular structure.',
    subjects: wrapSubjects([
      {
        text: 'a single complete perfectly ripe strawberry undergoing cryopreservation with an intricate lattice of microscopic ice crystals and hoarfrost across its entire surface while internal cold cathode illumination reveals its translucent red cellular structure and frozen achenes in razor focus',
        placement: 'center'
      },
      {
        text: 'a complete cryopreserved wild strawberry cross-section showing frost-rimmed cellular walls, delicate ice needles along the flesh, and deep crimson translucent pulp lit from within by a cool scientific cathode ray',
        placement: 'center'
      },
      {
        text: 'a complete scientific studio study of an entire frozen strawberry with leafy calyx encrusted in micro-hoarfrost and frost-covered achenes under cool blue and deep red lighting',
        placement: 'center'
      },
      {
        text: 'a single complete deep-crimson strawberry suspended in sub-zero cryo-vapor with microscopic frost dendrites forming across its entire dimpled skin and translucent internal vascular fibers glowing softly',
        placement: 'center'
      },
      {
        text: 'a laboratory scan of a complete frozen strawberry where crystalline achenes sit in tack-sharp focus amidst frosted red pulp and cool blue rim illumination',
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
      'Telephoto wildlife documentary • Full-body polar & apex predators framed intact with environmental breathing room.',
    subjects: wrapSubjects([
      {
        text: 'a full-body polar bear prowling low across slushy ice and shallow freezing meltwater with snow-dusted evergreens blurred in the background',
        placement: 'left'
      },
      {
        text: 'a massive full-body polar bear wading through icy winter water and wet snow at eye level with falling snowflakes and frosty forest depth behind it',
        placement: 'right'
      },
      {
        text: 'a lone full-body snow leopard stalking across steep jagged granite ridges in the high Himalayas with swirling mist below',
        placement: 'left'
      },
      {
        text: 'a full-body Arctic fox with thick white winter coat moving silently across deep snowdrifts under cold blue winter twilight',
        placement: 'right'
      },
      {
        text: 'a solitary full-body Siberian tiger walking silently through deep snow-covered boreal taiga forest at twilight with frost riming its fur',
        placement: 'left'
      },
      {
        text: 'a pod of humpback whales breaching gracefully through deep indigo pelagic waters off a rugged coastal cliff at dawn',
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
      'Pelagic & freshwater sub-surface optics • Full-body marine species with volumetric sun shafts.',
    subjects: wrapSubjects([
      {
        text: 'a complete full-body humpback whale gliding smoothly through deep pelagic ocean water with sunbeams filtering down from above',
        placement: 'left'
      },
      {
        text: 'a complete full-body great white shark cruising silently above sandy ocean seabed in clear cool blue water',
        placement: 'right'
      },
      {
        text: 'a complete green sea turtle swimming effortlessly over a vibrant coral reef with shafts of bright daylight piercing the water',
        placement: 'left'
      },
      {
        text: 'a complete giant manta ray sweeping its wide wings through open blue ocean water with crisp light rays',
        placement: 'center'
      },
      {
        text: 'a complete Pacific octopus camouflaged along rocky marine reef ledges in crystal-clear underwater light',
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
      'Golden-amber underwater cinema • Scuba explorer beside sunken bistro terraces and historic galleons.',
    subjects: wrapSubjects([
      {
        text: 'a full-body scuba diver in a sleek black-and-gold wetsuit swimming past a vintage bistro cafe terrace with warm glowing globe lamps and a massive sunken wooden galleon in golden underwater light',
        placement: 'left'
      },
      {
        text: 'a full-body scuba diver leaning over a round bistro table with a porcelain cup and glass on a submerged cafe patio while a towering antique sailing ship looms in golden-amber water',
        placement: 'left'
      },
      {
        text: 'a full-body diver gliding horizontally past a submerged outdoor cafe awning and small bistro chairs with a weathered sailing vessel rising from the seabed in warm golden haze',
        placement: 'right'
      },
      {
        text: 'a full-body scuba diver hovering near a candlelit marble-topped cafe table and brass railing on the ocean floor beside a colossal sunken tall ship in glowing amber underwater light',
        placement: 'left'
      },
      {
        text: 'a full-body diver approaching a classic cafe facade with warm glowing lamps and bentwood chairs underwater with a massive sunken sailing ship in the background',
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
      'IMAX 70mm atmospheric scale • Supercells, aurora borealis, and crepuscular sunbeams.',
    subjects: wrapSubjects([
      { text: 'towering dark storm clouds with distant lightning bolts illuminating a turbulent deep ocean swell at dusk', placement: 'left' },
      { text: 'vivid emerald and violet northern lights dancing above snow-covered arctic peaks and a frozen fjord', placement: 'right' },
      { text: 'dramatic sunbeams breaking through dense low mist over rugged mountain ridges at sunrise', placement: 'center' },
      { text: 'a massive supercell cloud formation casting deep shadow across wide open plains beneath a glowing amber sky', placement: 'left' },
      { text: 'swirling sea fog rolling over steep coastal cliffs as pale twilight settles across the horizon', placement: 'right' }
    ])
  },
  {
    id: 'futuristic-architecture',
    label: 'Futuristička arhitektura i monoliti',
    previewImage:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85',
    previewNote:
      '24mm tilt-shift architectural control • Cantilevered concrete, dark basalt monoliths, and smoked glass.',
    subjects: wrapSubjects([
      { text: 'a complete cantilevered glass and raw concrete architectural pavilion jutting out from a sheer desert cliff at dusk', placement: 'left' },
      { text: 'an entire monumental dark basalt monolith standing in a vast misty valley with subtle warm light along its seam', placement: 'right' },
      { text: 'a complete sleek curved glass-and-steel observatory perched on a snowy mountain ridge under twilight clouds', placement: 'center' },
      { text: 'a complete sculptural smoked-glass residence set on dark volcanic rock beside calm ocean water', placement: 'left' },
      { text: 'an entire towering geometric stone-and-glass tower rising above a low sea of clouds at dawn', placement: 'right' }
    ])
  },
  {
    id: 'luxury-fragrances-spirits',
    label: 'Luksuzna pića, parfemi i bočice',
    previewImage:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Commercial glass refraction • Heavy flacons and crystal decanters on travertine and volcanic stone.',
    subjects: wrapSubjects([
      { text: 'a complete heavy square glass fragrance bottle with its dark brushed cap resting on raw travertine stone in warm light', placement: 'center' },
      { text: 'a complete crystal decanter pouring deep amber spirit into a full cut-glass tumbler beside dark volcanic rock', placement: 'center' },
      { text: 'a complete minimalist smoked-glass perfume flacon standing on wet dark slate with subtle water reflections', placement: 'center' },
      { text: 'a complete ornate dark glass bottle with warm metallic accents resting on golden desert sand at sunset', placement: 'center' },
      { text: 'a complete sleek architectural glass bottle catching a narrow beam of golden sunlight against charcoal stone', placement: 'center' }
    ])
  },
  {
    id: 'ancient-abandoned-sanctuaries',
    label: 'Napušteni i drevni prostori u prirodi',
    previewImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Kodak Portra 400 tonal latitude • Moss-covered stone ruins and sunlit forest sanctuaries.',
    subjects: wrapSubjects([
      { text: 'complete weathered stone arches of an ancient ruin overgrown with moss and ferns as shafts of sunlight pierce the mist', placement: 'left' },
      { text: 'an old stone aqueduct stretching across a misty valley with dense forest and quiet river below', placement: 'right' },
      { text: 'a quiet forgotten stone chamber with cracked plaster, tall arched windows, and soft natural daylight', placement: 'center' },
      { text: 'a complete abandoned stone mill beside a rushing mountain stream with wet rocks and autumn leaves', placement: 'right' },
      { text: 'complete weathered marble columns standing in shallow calm water reflecting soft twilight clouds', placement: 'left' }
    ])
  },
  {
    id: 'night-automotive-urban',
    label: 'Noćni urbani i auto-moto kadrovi',
    previewImage:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Leica SL2-S low-light grain • Rain-slicked asphalt reflections and blue-hour grand tourers.',
    subjects: wrapSubjects([
      { text: 'a complete sleek dark sports coupe driving along a wet asphalt road at night with glowing tail lights and street reflections', placement: 'center' },
      { text: 'a complete modern grand tourer parked under warm amber streetlamps on rain-slicked cobblestones after midnight', placement: 'center' },
      { text: 'a complete matte black performance car moving through a misty night highway with crisp headlight beams and wet road sheen', placement: 'center' },
      { text: 'a complete lone coupe on a coastal night road beside dark ocean waves with subtle light trails on wet asphalt', placement: 'center' },
      { text: 'a complete performance car with glowing rear light bar cruising a quiet mountain pass road under dark night sky', placement: 'center' }
    ])
  },
  {
    id: 'nature-seasons-rivers',
    label: 'Priroda: Godišnja doba, planine i reke',
    previewImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Fujifilm Velvia 50 dynamic range • Alpine rivers, alpenglow peaks, and seasonal valleys.',
    subjects: wrapSubjects([
      { text: 'a wild mountain river winding through a lush spring valley filled with blooming wildflowers and fresh emerald birch trees beneath snow-capped peaks', placement: 'left' },
      { text: 'a crystal-clear turquoise alpine river carving through sun-drenched summer granite gorges with dense pine forests along the banks', placement: 'right' },
      { text: 'a calm broad autumn river reflecting fiery amber, copper, and crimson foliage beneath misty mountain ridges at dawn', placement: 'center' },
      { text: 'a dramatic jagged mountain peak catching warm alpenglow at sunrise above a mirror-still glacial tarn framed by dark conifers', placement: 'right' },
      { text: 'a cascading mountain waterfall feeding a wide emerald river through a steep canyon in early spring thaw with wet moss-covered rocks', placement: 'center' }
    ])
  },
  {
    id: 'surreal-fantasy-worlds',
    label: 'Nadrealni svetovi i fantazija',
    previewImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'ACEScg cinematic scale • Cloud-top stone citadels, bioluminescent ancient trees, and crystal spires.',
    subjects: wrapSubjects([
      { text: 'an entire grand ancient stone citadel rising above a thick sea of golden-lit clouds with cascading waterfalls pouring off its outer walls', placement: 'center' },
      { text: 'a complete sculpted fire-breathing dragon poised on a carved stone pedestal inside a dim vaulted hall with warm shafts of light through tall windows', placement: 'center' },
      { text: 'an entire colossal floating island of ancient ruins and waterfalls suspended above misty alpine valleys at dusk', placement: 'center' },
      { text: 'an entire towering bioluminescent ancient tree inside a dark subterranean cavern with glowing mist and stone walkways', placement: 'center' },
      { text: 'an entire giant crystal spire rising from a calm dark mountain lake reflecting warm sunset clouds', placement: 'left' }
    ])
  },
  {
    id: 'unusual-luxury-collisions',
    label: 'Neobični luksuzni sudari',
    previewImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Editorial juxtaposition • Horology, desert dunes, and high-altitude automotive collisions.',
    subjects: wrapSubjects([
      { text: 'a complete fine mechanical wristwatch resting on a brass stand inside an entire glass bell jar surrounded by delicate glowing butterflies and mossy botanical details', placement: 'center' },
      { text: 'a complete rich dark chocolate bar partially melted into warm golden desert sand dunes under bright low sun with crisp shadows', placement: 'center' },
      { text: 'a complete sleek champagne-gold supercar parked along a winding mountain highway with a complete camera drone hovering above the alpine valley', placement: 'center' },
      { text: 'a complete crystal decanter of amber liquid resting on dark volcanic rock beside a calm mountain stream at twilight', placement: 'center' },
      { text: 'a complete sleek luxury coupe parked beside a mirror-still autumn mountain lake reflecting golden trees and peaks', placement: 'center' }
    ])
  },
  {
    id: 'cinematic-portraits-glamour',
    label: 'Filmski portreti i glamur',
    previewImage:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Arri Alexa 65 85mm Prime • Structured evening couture in historic chandelier-lit halls.',
    subjects: wrapSubjects([
      { text: 'a full-length poised woman with blonde bob hair in a structured crimson satin evening gown standing inside a grand historic hall with crystal chandeliers and warm side light', placement: 'left' },
      { text: 'a three-quarter editorial portrait of a figure in tailored dark wool inside a moody classical gallery with soft window light and rich shadows', placement: 'right' },
      { text: 'a refined three-quarter evening portrait in a candlelit architectural salon with dark velvet drapery, warm rim lighting, and shallow depth of field', placement: 'center' },
      { text: 'a full-length striking editorial figure in a structured emerald silk coat standing before tall arched windows with soft diffused daylight', placement: 'left' },
      { text: 'a three-quarter cinematic portrait inside a minimalist concrete and glass space with dramatic directional light and crisp shadow contrast', placement: 'right' }
    ])
  },
  {
    id: 'unusual-photography',
    label: 'Neobične fotografije',
    previewImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Fine-art conceptual framing • Cloud-sea rowboats, salt-flat grand pianos, and amber glass lighthouses.',
    subjects: wrapSubjects([
      { text: 'a complete solitary rowboat floating calmly above a sea of dense white clouds between towering snow-dusted mountain peaks', placement: 'left' },
      { text: 'an entire ancient grand piano standing in the middle of a vast salt flat at dusk with a mirror-like reflection of a glowing amber horizon', placement: 'right' },
      { text: 'a complete giant glowing translucent hourglass suspended inside a dark misty redwood forest with golden sand trickling through the glass', placement: 'center' },
      { text: 'a cascade of crystal-clear water pouring out of an entire open vintage leather-bound book resting on a monolithic stone ledge in an arid desert canyon', placement: 'center' },
      { text: 'an entire towering solitary lighthouse built from translucent amber glass standing on a narrow ribbon of black volcanic sand between two calm seas', placement: 'left' }
    ])
  },
  {
    id: 'womens-eyewear',
    label: 'Ženske luksuzne naočare',
    previewImage:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Studio product precision • Sculptural acetate & titanium frames with 18k gold temple hardware.',
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
      'Hasselblad X2D 100C • Full-grain box-calfskin and saddle leather structured handbags.',
    subjects: wrapSubjects([
      { text: 'an entire structured matte-black box-calfskin women’s top-handle handbag with brushed palladium clasp', placement: 'center' },
      { text: 'an entire exotic emerald-green alligator-embossed leather evening clutch with sculpted gold frame', placement: 'center' },
      { text: 'an entire minimalist warm-taupe full-grain Epsom leather tote bag standing upright on stone', placement: 'center' },
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
      'Architectural Digest wide perspective • Double-height travertine, Calacatta marble, and smoked oak.',
    subjects: wrapSubjects([
      { text: 'a wide architectural view of a double-height modern penthouse living room with floor-to-ceiling bronze-framed glass, travertine fireplace, and low bouclé seating', placement: 'center' },
      { text: 'a wide architectural view of a minimalist kitchen featuring a monolithic veined Calacatta Viola marble island and smoked-oak cabinetry', placement: 'center' },
      { text: 'a wide architectural view of a serene master bedroom suite with recessed warm cove lighting, raw linen drapery, and a monolithic honed limestone wall', placement: 'center' },
      { text: 'a wide architectural view of a sculptural spa bathroom with a freestanding carved black-basalt soaking tub overlooking an indoor Zen courtyard', placement: 'center' },
      { text: 'a wide architectural view of an executive private library with floor-to-ceiling matte walnut shelving, integrated brass reading lamps, and cognac leather lounge chairs', placement: 'center' }
    ])
  },
  {
    id: 'oceanfront-villas',
    label: 'Luksuzan eksterijer vila na obali okeana',
    previewImage:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Coastal estate architecture • Zero-edge infinity pools, limestone terraces, and twilight reflections.',
    subjects: wrapSubjects([
      { text: 'an entire cantilevered white-concrete and glass cliffside modern villa with a zero-edge infinity pool merging into the deep blue ocean', placement: 'center' },
      { text: 'an entire sprawling Mediterranean limestone coastal estate with sunken firepit lounge terraces overlooking dramatic rocky cliffs at sunset', placement: 'center' },
      { text: 'an entire tropical minimalist teak-and-basalt oceanfront villa surrounded by reflection ponds and palm silhouettes above turquoise water', placement: 'center' },
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
      'Nordic & Japanese woodland interiors • Charred cedar beams, river-stone hearths, and misty pine views.',
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
      'Executive aviation & superyacht decks • Hand-stitched cream leather cabins and Mediterranean teak.',
    subjects: wrapSubjects([
      { text: 'a wide interior view of a sleek private jet cabin with hand-stitched cream leather seats', placement: 'center' },
      { text: 'a complete aerodynamic carbon-fiber private aircraft flying above twilight clouds', placement: 'center' },
      { text: 'a wide architectural view of a superyacht aft deck lounge overlooking calm deep-blue Mediterranean water', placement: 'center' },
      { text: 'an entire teak-decked luxury tender yacht cutting through mirror-still morning sea', placement: 'center' },
      { text: 'a wide view of a cantilevered superyacht glass infinity pool deck at golden hour', placement: 'center' }
    ])
  },
  {
    id: 'gourmet-culinary',
    label: 'Luksuzna gastronomija',
    previewImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Michelin-star plating • Hand-forged dark stoneware, edible gold leaf, and volcanic basalt.',
    subjects: wrapSubjects([
      { text: 'an entire avant-garde Michelin-star dish plated on a complete hand-forged dark stoneware plate', placement: 'center' },
      { text: 'a complete artisanal crystal decanter pouring aged amber spirit into a full glass over hand-carved ice', placement: 'center' },
      { text: 'a complete serving of delicate edible gold leaf and botanical micro-greens on an entire matte black ceramic plate', placement: 'center' },
      { text: 'a complete aged Japanese Wagyu sear resting on an entire hot volcanic basalt slab', placement: 'center' },
      { text: 'a complete minimalist Nordic seafood plating with translucent sea-foam reduction on a full stoneware dish', placement: 'center' }
    ])
  },
  {
    id: 'abstract-concepts',
    label: 'Unikatni koncepti',
    previewImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'Conceptual fine-art photography • Spun optical glass stags, amethyst geodes, and liquid mercury spheres.',
    subjects: wrapSubjects([
      { text: 'the full-figure physical embodiment of Silence as a towering figure of dark velvet and mist', placement: 'left' },
      { text: 'a full-body lone traveler carrying an intricately caged glowing star across cracked earth', placement: 'right' },
      { text: 'an entire ancient gnarled oak tree fused with precision aged-brass clockwork gears', placement: 'center' },
      { text: 'a full-body majestic stag sculpted entirely from clear spun optical glass in a forest', placement: 'left' },
      { text: 'an entire subterranean metropolis carved inside a colossal amethyst geode', placement: 'center' }
    ])
  },
  {
    id: 'ai-generated',
    label: 'AI Generated',
    previewImage:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=85',
    previewNote:
      'CNC matte-black anodized compute core • Edge-lit golden-amber glass fins on Nero Marquina marble.',
    subjects: wrapSubjects([
      {
        text: 'a complete luxury matte-black anodized aluminum AI compute core featuring precision machined cooling fins, a dark sapphire-tinted optical glass viewport with zero text or UI, and fan-like golden-amber translucent glass blades catching warm volumetric light rays while mounted on a polished black Nero Marquina marble plinth',
        placement: 'right'
      },
      {
        text: 'a complete monolithic black anodized metal quantum processing module framed by four sculpted golden-amber edge-lit glass fins projecting warm caustic light beams across a dark architectural gallery while resting on a veined black marble pedestal',
        placement: 'right'
      },
      {
        text: 'an entire precision-milled matte obsidian hardware node with slotted heat-sink louvers, a deep blue-black optical sensor window, and cascading warm amber glass fins glowing with internal light refraction on a dark marble base',
        placement: 'left'
      },
      {
        text: 'a complete sculptural luxury AI hardware monolith in brushed gunmetal and matte black alloy surrounded by layered translucent champagne-gold crystal plates with warm specular rim highlights on a black veined marble slab',
        placement: 'center'
      },
      {
        text: 'a complete compact black anodized neural engine cube featuring a recessed dark optical lens aperture and symmetrical golden-amber glass wings casting soft amber caustics onto a dark Nero Marquina marble block',
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
      'Shot on Phase One IQ4 150MP, eksterijeri na liticama descriptor: monitor to anchor the generator to the photographic original.',
    subjects: wrapSubjects([
      {
        text: 'an entire luxury modern cliffside villa cantilevered over a sheer coastal cliff face, featuring white concrete architecture, floor-to-ceiling glass sliding doors, and a dramatic infinity pool extending out into the air, anchored on rugged natural cliff rock with sparse coastal vegetation, overlooking an expansive deep turquoise-blue sea stretching to a hazy mountainous coastline under a bright clear sky with volumetric sun rays',
        placement: 'left'
      },
      {
        text: 'a complete multi-level architectural coastal villa built into a steep rocky precipice, showcasing open terrace living spaces, seamless floor-to-ceiling glass facades, and an iconic infinity lap pool hovering high above the sea, overlooking a vast azure ocean and distant misty mountain shores under crisp natural sunlight',
        placement: 'left'
      },
      {
        text: 'an entire minimalist white-concrete seaside villa anchored to a natural limestone cliffside, featuring expansive outdoor lounging decks, frameless glass-railed balconies, and a cantilevered swimming pool projecting into space, looking out over the open Mediterranean sea with diagonal sunbeams piercing the horizon',
        placement: 'left'
      },
      {
        text: 'a complete sculptural contemporary residence integrated into a high coastal rock face, showcasing layered curved white concrete terraces, massive glazed walls, and a dramatic infinity pool jutting out over the deep turquoise ocean under a vast bright blue sky with soft coastal haze',
        placement: 'left'
      },
      {
        text: 'an entire elite cliffside retreat crafted from raw off-white architectural concrete and structural glass, featuring an indoor-outdoor lounge area, glass-paneled upper levels, and a zero-edge infinity pool floating over the sheer rocky drop with open views of a sparkling sapphire sea and distant coastal ridges',
        placement: 'left'
      }
    ])
  },
  {
    id: 'hero-pozadine-obsidian-prism',
    label: 'Hero pozadine (Crni tečni opsidijan i prizmatično staklo)',
    previewImage: '/46.jpg',
    previewNote:
      'Shot on Phase One IQ4 150MP, 80mm Schneider lens descriptor: dark-mode liquid obsidian silk waves intersected by prismatic glass spears with clean negative space.',
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
      },
      {
        text: 'sculptural dark mercury and obsidian fluid contours paired with slender transparent prism spikes catching pinpoint specular highlights and soft chromatic dispersion on the right half of the frame',
        placement: 'right'
      },
      {
        text: 'high-precision optical macro abstract of dark liquid chrome folds and intersecting tapered crystal beams with clean spectral light refraction and 65 percent pure black negative space on the left',
        placement: 'right'
      }
    ])
  }
];

const JEWELRY_WATCH_AMBER_BOX_ENVIRONMENTS = [
  'nested neatly inside its complete ornate matching presentation box lined with rich warm amber velvet and fitted compartments with zero text or logos',
  'resting securely on a sculpted cushion wrapped in luminous golden-amber silk inside a complete finely decorated collector case with zero text or logos',
  'displayed inside an entire ornate carved wood jewelry and watch box with plush amber satin interior lining and brass hinges with zero text or logos',
  'poised on a tailored pillow of rich amber crushed velvet inside a complete embellished presentation box with zero text or logos',
  'housed neatly inside its complete matching luxury case lined with warm cognac-amber suede and ornate trim with zero text or logos',
  'presented inside a complete ornate lacquer collector chest with a fitted warm amber silk cushion and delicate decorative border with zero text or logos'
];

const LUXURY_CAR_PARTS_STUDIO_ENVIRONMENTS = [
  'all properly mounted in place on the luxury vehicle inside a dark commercial studio with a mirror-polished black obsidian floor and clean studio reflections',
  'installed intact on the luxury vehicle inside a private automotive design studio against a seamless matte charcoal cyclorama with crisp studio light lines',
  'fitted cleanly in its factory position on the luxury vehicle inside an exclusive dark studio with honed Nero Marquina marble reflections and controlled rim light',
  'mounted in situ on the luxury vehicle inside a bespoke dark atelier studio with soft overhead softbox reflections and deep obsidian shadow contrast',
  'attached intact to the luxury vehicle inside a high-end commercial studio featuring brushed dark anodized walls and subtle studio floor sheen'
];

const CLIFFSIDE_VILLA_SEA_ENVIRONMENTS = [
  'set high above a vast shimmering turquoise and deep cobalt sea with a clean open horizon on the right and soft atmospheric coastal haze',
  'perched along dramatic sun-drenched limestone cliffs overlooking crystal-clear coastal coves and expansive open ocean negative space',
  'anchored into rugged natural coastal rock formations with calm deep-blue Mediterranean waters stretching uninterrupted across the right side of the frame',
  'suspended above steep rocky seaside precipices with bright turquoise water near the base of the cliffs and serene distant mountain silhouettes',
  'framed against an expansive sunlit coastal panorama with glassy infinity-pool reflections and vast open sky and sea space'
];

const HERO_DARK_LIQUID_ENVIRONMENTS = [
  'suspended in an infinite pitch-black studio void with zero background clutter and smooth gradient falloff',
  'set against a deep matte obsidian dark-mode canvas engineered for high-contrast website hero overlays',
  'floating inside a dark architectural optical chamber with pure #05070B black negative space on the left',
  'emerging from deep velvety shadow planes with mirror-smooth dark liquid surface reflections',
  'framed in a widescreen 16:9 dark editorial environment with clean asymmetric negative space for headlines'
];

const ENVIRONMENTS = [
  'framed in an editorial luxury setting with natural architectural depth and clean composition',
  'set on a raw porous travertine surface with clean negative space and subtle mineral texture',
  'bathed in serene natural atmosphere with fine mist and organic surface reflections',
  'surrounded by dark volcanic basalt and subtle ambient water reflections',
  'set against a matte charcoal architectural backdrop with crisp geometric shadow lines',
  'resting beside a calm mirror-still water reflection with subtle atmospheric depth',
  'within a quiet minimalist sanctuary with fine airborne dust motes in the light',
  'placed on brushed anodized metal and honed limestone in a high-end editorial setting',
  'framed by minimalist smoked glass panels and raw monolithic stone textures',
  'overlooking a misty panoramic horizon at twilight with deep tonal contrast',
  'inside an ultra-clean architectural space with asymmetric balanced framing',
  'surrounded by organic natural textures, subtle patina, and quiet luxury ambiance'
];

const LIGHTING_RIGS = [
  'pierced by a single tall vertical shaft of natural midday sunlight with volumetric god rays',
  'illuminated by low-angle golden-hour sunlight casting long crisp architectural shadows',
  'lit by soft north-facing diffused daylight with smooth tonal falloff and bounce fill',
  'sculpted by dramatic chiaroscuro rim lighting and crisp specular reflections',
  'bathed in cool blue-hour twilight ambient fill with warm directional interior glow',
  'highlighted by razor-sharp studio strip-box reflections and deep obsidian shadow contrast',
  'under moody overcast sky light creating soft micro-contrast across raw textures',
  'backlit by subtle crepuscular light rays cutting through fine atmospheric haze',
  'illuminated by a narrow directional beam of warm late-afternoon sun',
  'balanced by soft ambient window light and subtle architectural shadow play',
  'lit by crisp downward sunbeams cutting through clear water with natural caustics',
  'illuminated by a precision grazing studio rim light igniting emerald and violet spectral caustics inside optical glass',
  'lit by dramatic Rembrandt chiaroscuro lighting with deep shadow contrast and sculpted highlights',
  'bathed in soft global illumination and natural bounce fill with clean tonal transitions',
  'sculpted by intense rim lighting and golden-hour backlighting with warm atmospheric haze',
  'under moody low-key directional studio lighting with crisp specular reflections on wet surfaces'
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

const META_TOKEN_STACKS = [
  '[Meta Tokens: Volumetric smoke simulation, metallic flakes BRDF, physically based rendering, rim lighting, deep blacks]',
  '[Meta Tokens: Physically based rendering, metallic flakes BRDF, volumetric smoke simulation, rim lighting, deep blacks]',
  '[Meta Tokens: IMG_2098.CR2, uncompressed RAW 16bit ACEScg, phase_shift.refraction_x, lostfilm_realism.v1, HDR_microcontrast_256map]',
  '[Meta Tokens: Hasselblad_X2D_lensmap, ProRes_4444XQ, diffusion_reflectivity_0.98, HDR10+ film still, phaseone_IQ4_backplate]',
  '[Meta Tokens: ACEScg_P3_D65_matrix, exposure_stack_x9_dynamicrange, glass_diffusion.normalpass, subsurface scattering, physically based rendering]',
  '[Meta Tokens: ISO_64_filmgrain, refraction_noiseoff, albedo_subsurface.vfx, micro-fabric_specular_2026, lux_tonecurve.8bit_expansion]',
  '[Meta Tokens: CNC anodized black aluminum, golden-amber optical glass caustics, Nero Marquina black marble reflections, volumetric light beams, zero UI text]'
];

const V10_GUARDRAILS =
  'AI_GUARDRAILS: subject completely visible, no cropped edges, clean commercial composition, zero text, zero typography, zero logos, zero watermarks, zero UI overlays';

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
    'hero-pozadine-obsidian-prism'
  );
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [singleIndex, setSingleIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // po 1 primer prompta kao na skici
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

  // Gradi tačno 5.000 (TARGET_UNIQUE_PROMPTS) 100% različitih, deduplikovanih promptova
  // sa optikom na samom početku svakog prompta
  const buildCategoryPrompts = (categoryObj) => {
    const list = [];
    const seenPrompts = new Set();
    const isJewelryOrWatch =
      categoryObj.id === 'luxury-watches' || categoryObj.id === 'diamonds-jewelry';
    const isCarPartsCategory = categoryObj.id === 'luxury-car-parts-brakes-seats-lights';
    const isCliffsideVillaCategory = categoryObj.id === 'vila-na-moru';
    const isHeroLiquidCategory = categoryObj.id === 'hero-pozadine-obsidian-prism';

    const envPool = isJewelryOrWatch
      ? JEWELRY_WATCH_AMBER_BOX_ENVIRONMENTS
      : isCarPartsCategory
      ? LUXURY_CAR_PARTS_STUDIO_ENVIRONMENTS
      : isCliffsideVillaCategory
      ? CLIFFSIDE_VILLA_SEA_ENVIRONMENTS
      : isHeroLiquidCategory
      ? HERO_DARK_LIQUID_ENVIRONMENTS
      : ENVIRONMENTS;

    const metaPool = isJewelryOrWatch
      ? LUXURY_WATCH_META_TOKENS
      : isCliffsideVillaCategory
      ? CLIFFSIDE_VILLA_META_TOKENS
      : isHeroLiquidCategory
      ? HERO_LIQUID_META_TOKENS
      : META_TOKEN_STACKS;

    const subCount = categoryObj.subjects.length;
    const envCount = envPool.length;
    const lightCount = LIGHTING_RIGS.length;
    const optCount = OPTICS_PROFILES.length;
    const metaCount = metaPool.length;

    const totalPermutations = subCount * envCount * lightCount * optCount * metaCount;
    const targetTotal = Math.min(TARGET_UNIQUE_PROMPTS, totalPermutations);

    // Coprime stride garantuje obilazak 5.000 jedinstvenih kombinacija bez duplikata
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
      const placementLabel =
        subjObj.placement === 'left'
          ? 'Placement: left third with vast negative open space on the right, completely visible inside the frame'
          : subjObj.placement === 'right'
          ? 'Placement: right half with vast matte-black negative open space on the left, completely visible inside the frame'
          : 'Placement: centered cleanly in the frame with generous breathing room around all edges, completely visible';

      const placementDirective = resolvePlacementDirective(subjObj.placement);
      const framingClause = isCarPartsCategory ? `${NO_FULL_CAR_DIRECTIVE}, ` : '';
      const unifiedPrompt = `${OPTICS_PROFILES[o]}, editorial ultra-realistic commercial photograph of ${subjObj.text}. ${placementLabel} (${placementDirective}). ${framingClause}${envPool[e]}, ${LIGHTING_RIGS[l]}. ${metaPool[m]}. ${V10_GUARDRAILS}.`;

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
        {/* CENTRALNA ZONA GENERATORA (identičan layout kao na skici) */}
        <main className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-12 pt-7 pb-12">
          <header className="w-full max-w-[780px] flex flex-col items-center text-center mb-7">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-[0.14em] uppercase bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(251,191,36,0.22)]">
              VISIONARY FACTORY V10
            </h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-300 font-mono">
                {activePool.length.toLocaleString()} UNIKATNIH PROMPTOVA
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-amber-300/90">
                OPTICS-FIRST • FULL-FRAME SAFE
              </span>
              <a
                href="/goran-exif"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 border border-amber-400/40 text-amber-300 font-semibold transition"
              >
                EXIF Vault <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </header>

          <div className="w-full max-w-[680px] space-y-5">
            {/* Select labela + Dropdown sa svih 28 kategorija */}
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
                  <span>Kadriranje:</span>
                  <span className="text-emerald-400 font-semibold">Full-Frame (Bez sečenja)</span>
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