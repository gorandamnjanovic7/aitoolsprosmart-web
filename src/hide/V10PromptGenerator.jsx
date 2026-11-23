import React, { useState, useMemo } from 'react';

export const HIDDEN_VAULT_ROUTE = '/goran';

const wrapSubjects = (items) =>
  items.map((entry, idx) => {
    if (typeof entry === 'string') {
      const cycle = ['left', 'right', 'center'];
      return { text: entry, placement: cycle[idx % cycle.length] };
    }
    return {
      text: entry.text,
      placement: entry.placement || 'center'
    };
  });

const resolvePlacementDirective = (placement) => {
  if (placement === 'left') {
    return 'subject positioned on the left side of the frame with clean open space on the right';
  }
  if (placement === 'right') {
    return 'subject positioned on the right side of the frame with clean open space on the left';
  }
  return 'subject centered cleanly in the frame with balanced composition';
};

const NO_FULL_CAR_DIRECTIVE =
  'strictly framing only this specific detail or partial section with no full car ever shown in the frame';

const CATEGORIES = [
  {
    id: 'luxury-car-parts-brakes-seats-lights',
    label: 'Luksuzni auto-delovi i makro enterijer (Bez celog vozila)',
    subjects: wrapSubjects([
      {
        text: 'an ultra-sharp macro photograph of a cross-drilled carbon-ceramic brake disc with bright racing yellow brake calipers and pads mounted inside a forged alloy wheel with visible low-profile tire sidewall and sculpted fender arch on the vehicle, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a close-up studio detail of a grooved performance brake rotor with electric sapphire blue brake calipers and pads behind dark twin-spoke wheel geometry, visible tire rubber and lower bodywork on the vehicle, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a dramatic close-up of a ventilated carbon-ceramic brake disc with glossy crimson red multi-piston brake calipers and pads mounted inside a dark forged wheel with tire sidewall and wheel arch on the vehicle, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro shot of a heat-seasoned slotted brake disc with acid yellow brake calipers and pads, fine brake dust micro-texture, forged spokes, tire shoulder, and fender edge on the vehicle, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a crisp macro framing of a large cross-drilled brake rotor with deep cobalt blue brake calipers and pads installed on the wheel hub with visible tire profile and sculpted bodywork on the vehicle, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a high-contrast close-up of a perforated carbon-ceramic brake disc with vibrant racing red brake calipers and pads mounted inside a dark performance wheel with tire rubber and fender arch on the vehicle, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up detail of a cross-drilled disc rotor with golden amber-yellow brake calipers and pads behind dark forged spokes, visible tire sidewall, and sculpted quarter panel on the vehicle, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'an intimate macro view of a grooved carbon-ceramic brake disc with royal blue brake calipers and pads mounted inside an alloy wheel with visible tire tread shoulder and bodywork on the vehicle, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a razor-sharp close-up of a vented brake rotor with deep ruby red brake calipers and pads behind forged wheel spokes, visible tire sidewall, and fender arch on the vehicle, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro shot of a cross-drilled performance brake disc with bright yellow brake calipers and pads mounted on the wheel with tire rubber and lower sill bodywork on the vehicle, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a detailed close-up of a slotted brake rotor with metallic blue brake calipers and pads inside a forged wheel with visible tire sidewall and fender line on the vehicle, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a dramatic macro framing of a carbon-ceramic brake disc with intense crimson red brake calipers and pads mounted inside a dark wheel with tire sidewall and bodywork on the vehicle, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight interior macro shot of an illuminated digital instrument cluster and curved LED display glowing inside a dark luxury vehicle cabin inspired by Porsche and BMW flagship cockpits with zero visible branding or logos and no legible text or UI clutter, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up interior detail of a sculpted automatic gear selector paired with a long tactile control rail of precision buttons and switches alongside the shifter inside a luxury vehicle cabin inspired by Ferrari and Aston Martin interiors with zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a dramatic macro shot of a glowing backlit instrument panel and deep-set LED display gauges inside a dark performance cabin inspired by Lamborghini and McLaren cockpits with zero visible branding or logos and clean abstract light indicators, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight interior close-up of an elongated center console control rail lined with crisp backlit buttons, knurled dials, and toggle switches right beside an automatic gear shifter inside a luxury grand tourer cabin inspired by Rolls-Royce and Bentley interiors with zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up of a faceted glass and brushed-metal automatic gear shifter beside a long row of precision control buttons and switches on the center console inside a luxury vehicle cabin inspired by Bugatti and Porsche interiors with zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a focused interior shot of a glowing high-contrast LED display and illuminated instrument binnacle inside a dark luxury cabin with crisp ambient light reflections and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed close-up of a long control rail of metallic and backlit buttons running alongside an automatic transmission selector inside a luxury vehicle interior with dark leather and carbon trim and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'an intimate macro shot of an illuminated digital gauge cluster and sleek LED display panel inside a dark luxury vehicle interior with soft light diffusion and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a tight studio crop of the rear half of a dark luxury hypercar inspired by Bugatti and Porsche flagship engineering with zero visible branding or logos, showcasing an illuminated full-width red LED taillight bar, sculpted rear diffuser fins, and carbon aero vents, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a dramatic studio framing of the rear half of a performance coupe inspired by Ferrari and Aston Martin halo design with zero visible branding or logos, highlighting precision segmented red LED taillights, dark honeycomb rear vents, and sculpted rear quarter bodywork, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a precision close-up of the rear half of a dark exotic sports car inspired by Lamborghini and McLaren flagship lighting architecture with zero visible branding or logos, featuring razor-sharp glowing red LED light blades, sculpted rear deck louvers, and deep carbon diffuser geometry, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed studio study of the rear half of a luxury grand tourer inspired by Rolls-Royce and Bentley flagship craftsmanship with zero visible branding or logos, showcasing jewel-like illuminated rear light clusters, clean rear bumper contours, and subtle metallic paint depth, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a tight close-up of the front half of a dark luxury supercar inspired by Ferrari and Aston Martin flagship headlights with mandatory glowing front headlights turned on and crisp LED light signatures and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a studio framing of the front half of a performance coupe inspired by Porsche and Bugatti flagship lighting with mandatory bright illuminated front headlights turned on, sharp daytime running light blades, and sculpted front intakes and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a focused studio shot of the front half of an exotic hypercar inspired by Lamborghini and McLaren flagship LED optics with mandatory glowing front headlights turned on, intense white-and-amber light accents, and sculpted front bodywork and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a refined studio view of the front half of an ultra-luxury coupe inspired by Rolls-Royce and Bentley flagship front lighting with mandatory glowing front headlights turned on, multi-element optical projectors, and crisp front fender lines and zero visible branding or logos, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a macro close-up of the rear half of a supercar inspired by Porsche and Ferrari flagship rear lighting with glowing red LED light strips, dark carbon rear diffuser, and sculpted rear fender contours, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a tight studio crop of the front half of a dark hypercar inspired by Bugatti and Aston Martin flagship front lights with mandatory glowing front headlights turned on, razor-sharp LED beam elements, and sculpted hood and bumper lines, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up of the rear half of a flagship sports car inspired by Lamborghini and Rolls-Royce lighting details with vivid red LED tail lamps, sculpted rear air vents, and clean lower diffuser geometry, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed close-up of the front half of a luxury coupe inspired by McLaren and Bentley flagship headlights with mandatory glowing front headlights turned on, crisp optical projectors, and sculpted front aero vents, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'an extreme close-up of a cross-drilled carbon-ceramic brake disc and glossy crimson-painted multi-piston brake caliper mounted inside a dark forged wheel with visible low-profile tire sidewall and fender arch on the vehicle, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a tight macro shot of precision contrast stitching along a woven safety seat belt mounted on the B-pillar beside a leather seat bolster inside the vehicle cabin, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a close-up study of a sculpted luxury bucket seat in supple cognac aniline leather with quilted side bolsters and fine double stitching installed inside a dark luxury vehicle cabin, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dedicated macro close-up of the left rear taillight cluster alone integrated into the sculpted rear fender and bumper of the vehicle showing glowing red LED light blades and dark carbon trim, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a dedicated macro close-up of the right rear taillight cluster alone integrated into the sculpted rear quarter panel and bumper of the vehicle showing crisp red LED illumination, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a close-up of a vented brake rotor and bright acid-yellow caliper installed behind dark wheel spokes with visible tire tread shoulder and wheel arch on the vehicle, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'an intimate macro close-up of taut diagonal stitching across a dark seat belt strap and brushed hardware edge, strictly showing only the strap stitching with no full car visible',
        placement: 'right'
      },
      {
        text: 'a close-up of an ultra-luxury lounge seat with perforated dark leather, sculpted headrest contour, and contrast piping installed inside the rear cabin of the vehicle, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro close-up of the left rear lamp assembly alone flush-mounted in the vehicle bodywork with glowing ruby LED light elements and sleek paintwork, tightly cropped with no full car visible',
        placement: 'left'
      },
      {
        text: 'a tight macro close-up of the right rear lamp assembly alone flush-mounted in the vehicle bodywork with sharp glowing red LED contours and dark aero diffuser trim, tightly cropped with no full car visible',
        placement: 'right'
      },
      {
        text: 'a close-up of a cobalt-blue painted brake caliper and grooved disc rotor mounted inside the alloy wheel with visible tire rubber and lower bodywork on the car, tightly cropped with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed macro shot of hand-finished diamond stitching on an installed luxury car seat bolster beside the door trim inside the vehicle cabin, tightly cropped with no full car visible',
        placement: 'center'
      }
    ])
  },
  {
    id: 'luxury-watches',
    label: 'Luksuzni satovi',
    subjects: wrapSubjects([
      {
        text: 'a skeleton mechanical tourbillon wristwatch with brushed titanium case inspired by Audemars Piguet design language with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a minimalist 18k rose-gold dress watch with matte alligator strap inspired by Patek Philippe Calatrava proportions with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'a heavy-duty ceramic and steel diving chronograph with sapphire bezel inspired by Omega Seamaster and Rolex Submariner silhouettes with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a platinum perpetual calendar timepiece with openworked dial inspired by Vacheron Constantin and A. Lange & Söhne craftsmanship with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'an avant-garde carbon-fiber tourbillon watch resting on edge inspired by Richard Mille and Audemars Piguet engineering with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a vintage-inspired bronze diver watch with domed sapphire crystal inspired by Panerai and Tudor heritage profiles with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'a monolithic black DLC-coated mechanical watch with exposed balance wheel inspired by Rolex and Omega modern tool watches with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a sculptural high-horology wristwatch with double-axis tourbillon inspired by Jaeger-LeCoultre and Breguet haute horlogerie with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'a hand-engraved white-gold minute repeater watch inspired by Patek Philippe and Vacheron Constantin dress classics with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a sleek sapphire-case ultra-thin mechanical watch with open mainspring barrel inspired by Cartier and Audemars Piguet contemporary design with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a rectangular art-deco platinum wristwatch with guilloché dial inspired by Cartier Tank and Jaeger-LeCoultre Reverso geometry with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'a grand-complication gold chronograph with exposed column wheel inspired by Patek Philippe and A. Lange & Söhne watchmaking with zero visible branding or logos',
        placement: 'center'
      }
    ])
  },
  {
    id: 'diamonds-jewelry',
    label: 'Dijamanti i visoki nakit',
    subjects: wrapSubjects([
      {
        text: 'an uncut raw octahedron diamond resting beside a precision-cut solitaire with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a platinum high-jewelry necklace arranged neatly with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'an emerald-cut diamond ring mounted cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a pair of sculptural gold and baguette-diamond cuffs arranged cleanly with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a matched set of pear-shaped diamonds arranged cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a bespoke sapphire and platinum ring displayed cleanly with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'raw gold nuggets and faceted diamonds arranged cleanly with zero visible branding or logos',
        placement: 'left'
      },
      {
        text: 'a minimalist geometric diamond bracelet displayed cleanly with zero visible branding or logos',
        placement: 'right'
      },
      {
        text: 'a cushion-cut diamond ring set in brushed 18k yellow gold displayed cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'high-jewelry diamond ear cuffs arranged cleanly with zero visible branding or logos',
        placement: 'left'
      }
    ])
  },
  {
    id: 'smoke-and-gold-leaf-mask',
    label: 'Maska od dima i zlatnog listića',
    subjects: wrapSubjects([
      {
        text: 'a human silhouette wearing a mask sculpted from swirling solid black and indigo smoke trails accented with delicate fractured pieces of 24k gold leaf suspended within the vapor against a seamless dark charcoal grey backdrop with dramatic rim lighting and high-speed sync flash clarity',
        placement: 'left'
      },
      {
        text: 'an enigmatic human profile wearing a structured smoke mask formed from dense curling obsidian and deep indigo vapor with floating 24k gold leaf fragments caught in mid-motion and crisp edge illumination on a dark charcoal background',
        placement: 'right'
      },
      {
        text: 'a dramatic studio study of a human silhouette whose facial mask is formed from coiled black and indigo smoke filaments interwoven with micro-fractured 24k gold leaf catching sharp specular glints against deep dark grey',
        placement: 'center'
      },
      {
        text: 'a high-speed sync studio portrait showing a sculpted mask of solidified black and indigo smoke swirls studded with delicate 24k gold leaf shards suspended in the mist with strong rim lighting against a dark charcoal backdrop',
        placement: 'left'
      },
      {
        text: 'a close-up editorial silhouette wearing an intricate mask of swirling black and indigo smoke trails embedded with fragile 24k gold leaf flakes and lit by crisp rim light over deep dark charcoal shadow tones',
        placement: 'right'
      },
      {
        text: 'a sculptural mask of dense swirling black and indigo smoke on a human silhouette with fractured 24k gold leaf suspended in the vapor and bright rim separation against a seamless dark charcoal background',
        placement: 'center'
      },
      {
        text: 'a frozen-motion portrait of a human silhouette wearing a mask of curling black and indigo smoke trails and suspended 24k gold leaf fragments illuminated by dramatic rim light in a dark charcoal studio setting',
        placement: 'left'
      },
      {
        text: 'an atmospheric studio portrait where a human silhouette wears a mask of solid-looking black and indigo smoke swirls with delicate 24k gold leaf pieces suspended in the vapor and strong rim light against dark charcoal',
        placement: 'right'
      },
      {
        text: 'a crisp high-speed portrait of a human silhouette with a swirling black and indigo smoke mask and fractured 24k gold leaf suspended in the smoke under dramatic rim lighting against a seamless dark charcoal backdrop',
        placement: 'center'
      },
      {
        text: 'an award-style studio portrait of a human silhouette wearing a mask of swirling black and indigo smoke trails with delicate fractured 24k gold leaf suspended within the vapor and bold rim light over a dark charcoal background',
        placement: 'left'
      }
    ])
  },
  {
    id: 'bioluminescent-porcelain-portrait',
    label: 'Bioluminiscentni portret od porcelana',
    subjects: wrapSubjects([
      {
        text: 'a close-up portrait of a human face where natural skin with visible pores and fine vellus hair transitions seamlessly into cracked antique white porcelain with glowing blue bioluminescent veins pulsing beneath the surface and along the fractures while dark reflective eyes hold sharp focus in moody low-key lighting',
        placement: 'left'
      },
      {
        text: 'an intimate close-up face study blending lifelike skin grain and peach fuzz into fine crackled antique porcelain as subtle bioluminescent cyan-blue veins glow within the hairline fissures and dark reflective eyes remain calm and emotionless',
        placement: 'right'
      },
      {
        text: 'a dramatic low-key portrait where unblemished skin with crisp pores and delicate vellus hairs gives way to fractured vintage white porcelain laced with luminous blue bioluminescent lines inside the cracks and dark mirror-like eyes in razor focus',
        placement: 'center'
      },
      {
        text: 'a close-up editorial portrait showing detailed skin texture and fine hair merging smoothly into crazed antique white porcelain with faint glowing blue bioluminescent veins pulsing under the glaze and dark expressive-void eyes sharply focused',
        placement: 'left'
      },
      {
        text: 'a moody close-up face where natural epidermal pores and fine vellus hair transition into cracked cream-white porcelain with glowing electric-blue bioluminescent filaments running through the cracks and dark reflective eyes holding tack-sharp focus',
        placement: 'right'
      },
      {
        text: 'a high-contrast close-up portrait of a face merging authentic skin texture and fine stray hairs into delicately cracked antique white porcelain with glowing blue bioluminescent veins pulsing just beneath the surface and dark reflective eyes in sharp focus',
        placement: 'center'
      },
      {
        text: 'a low-key close-up portrait where rich skin pores and vellus hair transition seamlessly into fine-cracked antique white porcelain with luminous blue bioluminescent veins glowing inside the fractures and dark reflective eyes devoid of emotion in sharp focus',
        placement: 'left'
      },
      {
        text: 'an atmospheric close-up face study with detailed natural skin and fine hair blending into cracked antique white porcelain where glowing blue bioluminescent veins pulse beneath the surface and dark reflective eyes remain in sharp focus under moody low-key lighting',
        placement: 'right'
      },
      {
        text: 'a close-up portrait transitioning from natural skin pores and delicate vellus hair into cracked antique white porcelain with glowing blue bioluminescent veins pulsing within the cracks and dark reflective eyes in sharp focus against a dark moody setting',
        placement: 'center'
      },
      {
        text: 'a poetic close-up face portrait where detailed skin texture and fine hair seamlessly become cracked antique white porcelain with glowing blue bioluminescent veins pulsing beneath the surface and dark reflective eyes in sharp focus under moody low-key light',
        placement: 'left'
      }
    ])
  },
  {
    id: 'human-scale-surrealism',
    label: 'Nadrealizam ljudske skale',
    subjects: wrapSubjects([
      {
        text: 'a close-up portrait of a calm face where fine natural skin pores and peach fuzz transition seamlessly into delicate translucent optical glass filaments along the cheekbone with subtle light refraction',
        placement: 'left'
      },
      {
        text: 'an intimate human-scale portrait showing detailed skin texture, natural lip grain, and fine stray hairs alongside brushed dark titanium latticework emerging smoothly from beneath the temple skin',
        placement: 'right'
      },
      {
        text: 'a dramatic close-up of a human hand with visible knuckle creases and fine epidermal texture cradling a glowing liquid-amber glass sphere formed directly from the palm lines',
        placement: 'center'
      },
      {
        text: 'a close-up profile of a human eye with crisp iris fibers and natural eyelashes set beside a precision mechanical camera shutter ring seamlessly embedded into the surrounding skin',
        placement: 'left'
      },
      {
        text: 'a human-scale editorial portrait where soft natural skin tone and fine collarbone shadows blend into sculpted smoked quartz facets with internal light dispersion',
        placement: 'right'
      },
      {
        text: 'an extreme close-up of human fingertips with authentic ridged dermal texture touching a mirror-polished black obsidian surface where dark liquid ripples rise to meet the skin',
        placement: 'center'
      },
      {
        text: 'a serene close-up portrait blending lifelike skin pores and subtle facial shadows with a delicate geometric wireframe of warm brass emerging along the jawline',
        placement: 'left'
      },
      {
        text: 'a human-scale surreal close-up of a neck and shoulder with natural skin warmth and subtle sheen transitioning into smooth frosted glass and fine metallic threads',
        placement: 'right'
      },
      {
        text: 'an intimate close-up of a human ear and temple with natural skin texture and fine hair merging with a precision miniature acoustic turbine in dark anodized alloy',
        placement: 'center'
      },
      {
        text: 'a poetic human-scale portrait where lifelike facial features and natural skin micro-texture gradually resolve into layered translucent crystal sheets catching cool directional light',
        placement: 'left'
      }
    ])
  },
  {
    id: 'submerged-venetian-palazzo',
    label: 'Potopljena venecijanska palata',
    subjects: wrapSubjects([
      {
        text: 'a cross-section view of a sunken Venetian Gothic palazzo resting on the seabed with its lower half submerged in crystal clear deep blue Mediterranean water showing shimmering caustic light patterns across ornate stone carvings and a decaying fresco while its upper half rises into open air with gilded crumbling architecture and sunbeams penetrating from above',
        placement: 'left'
      },
      {
        text: 'a split-level view of an ancient Venetian palazzo half-submerged in clear azure sea water with delicate caustic ripples dancing over carved stone arches and faded wall frescoes below the waterline while weathered gilded cornices and open Gothic loggias meet the sky above',
        placement: 'right'
      },
      {
        text: 'a half-sunken Venetian Gothic hall where shimmering underwater caustics and fine suspended particles illuminate carved stone tracery and damp fresco remnants below while dry gilded stonework and crumbling arches stand exposed above the surface under sunbeams',
        placement: 'center'
      },
      {
        text: 'a cross-section of a flooded Venetian palazzo resting on a rocky seabed with crisp water-line separation between dark wet stone and sun-warmed gold leaf above, as refracted light patterns dance across submerged reliefs and faint murals',
        placement: 'left'
      },
      {
        text: 'a documentary over-under study of a sunken Venetian Gothic palace showing intricate caustics across submerged carved stone and decaying fresco pigment in deep blue water paired with crumbling gilded facades open to the air above',
        placement: 'right'
      },
      {
        text: 'a submerged Venetian Gothic interior cross-section where sun rays pierce clear Mediterranean water to cast shimmering caustics over sculpted stone capitals and weathered frescoes below while aged gilded masonry rises into bright air above',
        placement: 'center'
      },
      {
        text: 'a dramatic over-under composition of a sunken Venetian palazzo with shimmering light networks on submerged stone carvings and fading frescoes below the surface and crumbling gilded Gothic architecture open to the sky above',
        placement: 'left'
      },
      {
        text: 'a half-submerged Venetian Gothic palazzo on the seabed with crisp optical contrast between wet carved stone and decaying frescoes in deep blue water below and dry gilded stonework in open air above',
        placement: 'right'
      },
      {
        text: 'a cross-section view of an underwater Venetian Gothic hall where shimmering caustics and fine particulate drift across ornate stone carvings and decaying frescoes beneath clear blue water while crumbling gilded architecture rises above',
        placement: 'center'
      },
      {
        text: 'a sunken Venetian Gothic palazzo in over-under documentary framing with intricate caustics dancing across carved stone and decaying frescoes underwater and gilded crumbling architecture open to the air above',
        placement: 'left'
      }
    ])
  },
  {
    id: 'infinite-library-of-aerogel',
    label: 'Beskonačna biblioteka od aerogela',
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
      },
      {
        text: 'a vast subterranean-scale brutalist library constructed from translucent silica aerogel with cantilevered walkways, deep niches, and soft cool light diffusing evenly across every solid edge',
        placement: 'center'
      },
      {
        text: 'a minimalist brutalist hall of endless aerogel tiers, monumental pillars, and stairs receding into a glowing misty vanishing point with subtle dust motes catching cool volumetric illumination',
        placement: 'left'
      },
      {
        text: 'a sweeping wide-angle view down an infinite brutalist gallery of translucent silica aerogel shelving and steps with cool light rays filtering through the material and soft atmospheric depth',
        placement: 'right'
      },
      {
        text: 'a colossal brutalist library interior made of frosted translucent aerogel blocks, stepped galleries, and long corridors disappearing into cool hazy mist with airborne dust motes',
        placement: 'center'
      },
      {
        text: 'an ethereal brutalist hall of translucent silica aerogel shelves, floors, and stairs extending into a misty horizon with cool volumetric light transmission and subtle dust motes in the air',
        placement: 'left'
      }
    ])
  },
  {
    id: 'ferrofluid-sculpture',
    label: 'Skulptura od ferofluida',
    subjects: wrapSubjects([
      {
        text: 'a blob of black ferrofluid reacting to a powerful Neodymium magnet beneath it, pulling the fluid into sharp, spiky, fractal magnetic field formations on a perfectly reflective wet obsidian surface against a pitch-black background',
        placement: 'left'
      },
      {
        text: 'high-speed liquid ferrofluid forming dense interlocking magnetic spikes and rhythmic ridges above a submerged neodymium core while a single harsh hard-light source carves crisp specular highlights across the dark metallic peaks',
        placement: 'right'
      },
      {
        text: 'a sculptural ferrofluid dome splitting into fine needle-like magnetic flux columns over a mirror-dark wet obsidian slab in an absolute black studio void with sharp metallic edge glints',
        placement: 'center'
      },
      {
        text: 'a dense black ferrofluid cluster pulled into towering fractal spires by dual magnetic fields beneath a wet black glass stage, catching razor-sharp directional highlights and deep obsidian shadow contrast',
        placement: 'left'
      },
      {
        text: 'a close-up study of liquid ferrofluid rising into intricate spiky magnetic field lines with micro-droplets suspended along the tips over a wet obsidian surface against pure black',
        placement: 'right'
      },
      {
        text: 'a symmetrical crown of sharp black ferrofluid spikes sculpted by magnetic attraction on a wet obsidian mirror plane, with intense single-source hard light creating bright metallic pinpoints across every peak',
        placement: 'center'
      },
      {
        text: 'an asymmetric fractal ferrofluid formation stretching toward a shifting magnetic field on wet obsidian in a pitch-black environment, showing fine liquid tension bridges and mirror-like dark reflections',
        placement: 'left'
      },
      {
        text: 'a precision macro capture of black ferrofluid spikes curving along invisible magnetic field lines above a glossy wet obsidian surface under stark hard lighting and pitch-black background',
        placement: 'right'
      },
      {
        text: 'a dynamic wave of black ferrofluid peaks and valleys responding to a strong Neodymium magnet on wet obsidian, framed by crisp metallic highlights and deep black negative space',
        placement: 'center'
      },
      {
        text: 'an ultra-detailed ferrofluid sculpture with sharp fractal spikes and wet obsidian reflections in absolute black contrast, lit by a single harsh hard-light beam for dramatic specular brilliance',
        placement: 'center'
      }
    ])
  },
  {
    id: 'frozen-strawberry-micro-scan',
    label: 'Mikro-sken zamrznute jagode',
    subjects: wrapSubjects([
      {
        text: 'a single perfectly ripe strawberry undergoing cryopreservation with an intricate lattice of microscopic ice crystals and hoarfrost across its surface while internal cold cathode illumination reveals its translucent red cellular structure and a single frozen achene in razor focus',
        placement: 'left'
      },
      {
        text: 'a cryopreserved wild strawberry cross-section showing frost-rimmed cellular walls, delicate ice needles along the flesh, and deep crimson translucent pulp lit from within by a cool scientific cathode ray',
        placement: 'right'
      },
      {
        text: 'an ultra-close scientific macro study of a frozen strawberry calyx and leafy cap encrusted in micro-hoarfrost beside frost-covered achenes under cool blue and deep red lighting',
        placement: 'center'
      },
      {
        text: 'a single deep-crimson strawberry suspended in sub-zero cryo-vapor with microscopic frost dendrites forming across its dimpled skin and translucent internal vascular fibers glowing softly',
        placement: 'left'
      },
      {
        text: 'a macro laboratory scan of a frozen strawberry seed cluster where a single crystalline achene sits in tack-sharp focus amidst frosted red pulp and cool blue rim illumination',
        placement: 'right'
      },
      {
        text: 'a cryopreserved strawberry with a delicate web of frost crystals bridging tiny surface pits while directional backlighting highlights ruby-red internal juice pockets and ice micro-fractures',
        placement: 'center'
      },
      {
        text: 'an extreme close-up of a frozen strawberry tip coated in fine rime ice and sparkling micro-crystals with cool cyan-blue and deep ruby tonal contrast in a scientific macro aesthetic',
        placement: 'left'
      },
      {
        text: 'a single frozen strawberry undergoing micro-scan inspection with translucent red cellular chambers glowing under cold directional light and frost needles along its contour',
        placement: 'right'
      },
      {
        text: 'a cryogenic macro study of a ripe strawberry covered in intricate hoarfrost filaments with razor-sharp focus on a frost-dusted achene and deep red translucent interior detail',
        placement: 'center'
      },
      {
        text: 'a hyper-detailed macro scan of a frozen strawberry in cool blue and deep red tones showing delicate ice crystal geometry, translucent fruit cells, and shallow depth of field focused on one frozen seed',
        placement: 'left'
      }
    ])
  },
  {
    id: 'natgeo-bbc-wildlife',
    label: 'National Geographic i BBC živi svet',
    subjects: wrapSubjects([
      {
        text: 'a polar bear prowling low toward the camera across slushy ice and shallow freezing meltwater with snow-dusted evergreens blurred in the background',
        placement: 'left'
      },
      {
        text: 'a massive polar bear wading through icy winter water and wet snow at eye level with falling snowflakes and frosty forest depth behind it',
        placement: 'right'
      },
      {
        text: 'a lone snow leopard stalking across steep jagged granite ridges in the high Himalayas with swirling mist below',
        placement: 'left'
      },
      {
        text: 'an Arctic fox with thick white winter coat moving silently across deep snowdrifts under cold blue winter twilight',
        placement: 'right'
      },
      {
        text: 'a solitary Siberian tiger walking silently through deep snow-covered boreal taiga forest at twilight with frost riming its fur',
        placement: 'left'
      },
      {
        text: 'a snowy owl perched on a frost-covered branch amidst snow-laden pine trees in cold winter haze with soft background bokeh',
        placement: 'right'
      },
      {
        text: 'a musk ox with heavy winter fur standing on frozen snow-covered tundra with breath condensation and distant ice ridges',
        placement: 'center'
      },
      {
        text: 'a herd of wild reindeer crossing deep winter snow across a quiet snowy forest clearing under pale icy sunlight',
        placement: 'left'
      },
      {
        text: 'an emperor penguin colony standing along a towering wall of sculpted blue glacial ice in Antarctica under crisp polar light',
        placement: 'right'
      },
      {
        text: 'a pack of grey wolves moving across windswept Arctic tundra with drifting snow and low pale winter sun',
        placement: 'left'
      },
      {
        text: 'a polar bear emerging from dark icy water onto slick snow-covered ice floes with rim light along its wet white coat',
        placement: 'right'
      },
      {
        text: 'a majestic silverback mountain gorilla resting amidst dense emerald bamboo and misty cloud-forest foliage in Central Africa',
        placement: 'left'
      },
      {
        text: 'a pod of humpback whales breaching gracefully through deep indigo pelagic waters off a rugged coastal cliff at dawn',
        placement: 'center'
      },
      {
        text: 'a herd of wild elephants crossing golden savanna grasslands in front of a dramatic thunderhead storm and warm horizon light',
        placement: 'right'
      },
      {
        text: 'a bioluminescent octopus gliding over dark volcanic seabed formations and delicate deep-sea corals in pitch-dark ocean depths',
        placement: 'left'
      },
      {
        text: 'a great horned owl in mid-flight emerging from dense misty old-growth woodland with crisp feather detail and forest canopy depth',
        placement: 'right'
      }
    ])
  },
  {
    id: 'marine-underwater-life',
    label: 'Podvodni i rečni živi svet',
    subjects: wrapSubjects([
      {
        text: 'a massive humpback whale gliding smoothly through deep pelagic ocean water with sunbeams filtering down from above',
        placement: 'left'
      },
      {
        text: 'a great white shark cruising silently above sandy ocean seabed in clear cool blue water',
        placement: 'right'
      },
      {
        text: 'a green sea turtle swimming effortlessly over a vibrant coral reef with shafts of bright daylight piercing the water',
        placement: 'left'
      },
      {
        text: 'a European river otter swimming underwater through clear cold river currents with pebbles and aquatic plants below',
        placement: 'right'
      },
      {
        text: 'a giant manta ray sweeping its wide wings through open blue ocean water with crisp light rays',
        placement: 'center'
      },
      {
        text: 'a beaver swimming beneath the surface of a calm forest river beside submerged roots and stones',
        placement: 'left'
      },
      {
        text: 'a Pacific octopus camouflaged along rocky marine reef ledges in crystal-clear underwater light',
        placement: 'right'
      },
      {
        text: 'a large freshwater river pike suspended calmly in clear green-tinted river water over gravel and reeds',
        placement: 'left'
      },
      {
        text: 'translucent moon jellyfish drifting through calm deep marine water with soft natural light diffusion',
        placement: 'right'
      },
      {
        text: 'an ancient sturgeon gliding near the rocky bed of a deep wild river under filtered natural light',
        placement: 'left'
      },
      {
        text: 'a school of silver barracudas moving in tight formation through sunlit open sea water',
        placement: 'right'
      },
      {
        text: 'a river freshwater turtle swimming past submerged mossy stones in a clear mountain river',
        placement: 'left'
      },
      {
        text: 'a leopard seal patrolling icy polar coastal waters beneath dramatic sub-surface light',
        placement: 'right'
      },
      {
        text: 'a freshwater crayfish resting on dark river stones amidst gentle underwater current ripples',
        placement: 'center'
      },
      {
        text: 'a tiger shark swimming along a steep coral drop-off in deep turquoise ocean water',
        placement: 'left'
      },
      {
        text: 'a playful river dolphin gliding through clear warm river water with sun shafts above',
        placement: 'right'
      },
      {
        text: 'a red lionfish with ornate venomous dorsal spines hovering above a dark reef ledge in clear tropical water',
        placement: 'left'
      },
      {
        text: 'a camouflaged reef stonefish resting motionless on rocky seabed covered in algae and sand in shallow coastal water',
        placement: 'right'
      },
      {
        text: 'a small blue-ringed octopus displaying iridescent blue rings across its skin while moving over dark coral rubble in clear water',
        placement: 'center'
      },
      {
        text: 'a translucent box jellyfish with delicate trailing tentacles drifting through clear warm marine water with light shafts above',
        placement: 'left'
      },
      {
        text: 'a Portuguese man o war with a translucent bluish-violet float and long trailing tentacles suspended near the ocean surface in sunlight',
        placement: 'right'
      },
      {
        text: 'a spotted pufferfish swimming calmly above sandy seabed near rocky outcrops in clear blue water',
        placement: 'left'
      },
      {
        text: 'a crown-of-thorns starfish with dense spiny arms clinging to dark coral rock in clear reef water',
        placement: 'center'
      },
      {
        text: 'a patterned textile cone snail moving slowly across fine sand and shell fragments on the seabed in bright filtered light',
        placement: 'right'
      },
      {
        text: 'a spotted scorpionfish perched on encrusted stone along a reef wall with natural shadow and underwater clarity',
        placement: 'left'
      },
      {
        text: 'a banded sea snake gliding gracefully through clear coastal water above rocky bottom with sun rays from above',
        placement: 'right'
      },
      {
        text: 'a greater weeverfish half-buried in fine sandy seabed with dorsal spines visible in clear shallow water',
        placement: 'center'
      },
      {
        text: 'a venomous striped eel catfish schooling tightly near dark reef rocks under natural sub-surface light',
        placement: 'left'
      },
      {
        text: 'a flower urchin with dense round venomous pedicellariae resting on rocky seabed in clear water',
        placement: 'center'
      },
      {
        text: 'a sharpnose pufferfish hovering near branching corals in sunlit blue water',
        placement: 'right'
      },
      {
        text: 'a venomous stingray gliding close to sandy ocean floor with trailing tail in clear water',
        placement: 'left'
      },
      {
        text: 'a fireworm with bright feathery white bristles crawling across dark rock and coral rubble in clear water',
        placement: 'right'
      }
    ])
  },
  {
    id: 'underwater-cafes-sunken-worlds',
    label: 'Podvodni kafei i potopljeni svetovi',
    subjects: wrapSubjects([
      {
        text: 'a scuba diver in a sleek black-and-gold wetsuit swimming past a vintage bistro cafe terrace with warm glowing globe lamps and a massive sunken wooden galleon in golden underwater light',
        placement: 'left'
      },
      {
        text: 'a scuba diver leaning over a round bistro table with a porcelain cup and glass on a submerged cafe patio while a towering antique sailing ship looms in golden-amber water',
        placement: 'left'
      },
      {
        text: 'a female diver ascending with rising air bubbles beside a classic curved-glass cafe counter and warm pendant lights with a shipwreck silhouette behind her in glowing amber water',
        placement: 'left'
      },
      {
        text: 'a diver gliding horizontally past a submerged outdoor cafe awning and small bistro chairs with a weathered sailing vessel rising from the seabed in warm golden haze',
        placement: 'right'
      },
      {
        text: 'a scuba diver hovering near a candlelit marble-topped cafe table and brass railing on the ocean floor beside a colossal sunken tall ship in glowing amber underwater light',
        placement: 'left'
      },
      {
        text: 'a diver observing a submerged vintage cafe interior with warm glass shelves and a sunken galleon mast cutting through golden water and fine marine particles',
        placement: 'right'
      },
      {
        text: 'a diver with rising bubbles floating above a submerged bistro table set with a small cup and glass while an ancient wooden ship rests among coral and shipwreck debris in warm sun-filtered water',
        placement: 'left'
      },
      {
        text: 'a diver approaching a classic cafe facade with warm glowing lamps and bentwood chairs underwater with a massive sunken sailing ship in the background',
        placement: 'right'
      },
      {
        text: 'a diver gliding past a submerged bistro balcony and glowing amber cafe lights with a monumental historic galleon rising through golden underwater haze and small fish',
        placement: 'left'
      },
      {
        text: 'a diver pausing beside a sunken cafe table with warm interior light spilling from a shopfront window as a towering shipwreck looms in golden-lit water',
        placement: 'right'
      }
    ])
  },
  {
    id: 'extreme-weather-sky',
    label: 'Ekstremni vremenski i nebeski fenomeni',
    subjects: wrapSubjects([
      'towering dark storm clouds with distant lightning bolts illuminating a turbulent deep ocean swell at dusk',
      'vivid emerald and violet northern lights dancing above snow-covered arctic peaks and a frozen fjord',
      'dramatic sunbeams breaking through dense low mist over rugged mountain ridges at sunrise',
      'a massive supercell cloud formation casting deep shadow across wide open plains beneath a glowing amber sky',
      'swirling sea fog rolling over steep coastal cliffs as pale twilight settles across the horizon',
      'a blazing crimson and gold sunset sky reflected across wet tidal flats and calm shallow pools',
      'crisp starlight and milky way bands stretching above dark volcanic highlands in clear mountain air',
      'a towering lenticular cloud shaped like a smooth stone disc hovering over a snowy alpine summit',
      'heavy rain squalls sweeping across a wide river valley while warm sunlight catches distant peaks',
      'frost-laden winter clouds drifting past high granite crags under pale blue polar twilight'
    ])
  },
  {
    id: 'futuristic-architecture',
    label: 'Futuristička arhitektura i monoliti',
    subjects: wrapSubjects([
      'a cantilevered glass and raw concrete architectural pavilion jutting out from a sheer desert cliff at dusk',
      'a monumental dark basalt monolith standing in a vast misty valley with subtle warm light along its seam',
      'a sleek curved glass-and-steel observatory perched on a snowy mountain ridge under twilight clouds',
      'an underground architectural courtyard carved into dark stone with a circular skylight and reflecting pool',
      'a minimalist brutalist concrete gateway framed by tall pines and drifting morning fog',
      'a suspended modern glass walkway spanning a deep misty canyon with warm interior light',
      'a sculptural smoked-glass residence set on dark volcanic rock beside calm ocean water',
      'a towering geometric stone-and-glass tower rising above a low sea of clouds at dawn',
      'an isolated minimalist cabin with floor-to-ceiling black steel frames overlooking a quiet alpine lake',
      'a monolithic stone amphitheater open to the sky with dramatic long shadows in late afternoon sun'
    ])
  },
  {
    id: 'luxury-fragrances-spirits',
    label: 'Luksuzna pića, parfemi i bočice',
    subjects: wrapSubjects([
      'a heavy square glass fragrance bottle with a dark brushed cap resting on raw travertine stone in warm light',
      'a crystal decanter pouring deep amber spirit into a cut-glass tumbler beside dark volcanic rock',
      'a minimalist smoked-glass perfume flacon standing on wet dark slate with subtle water reflections',
      'an ornate dark glass bottle with warm metallic accents resting on golden desert sand at sunset',
      'a hand-blown glass carafe of clear liquid set on honed limestone with crisp shadow lines',
      'a dark amber bottle surrounded by mist and moss-covered stone in a quiet woodland setting',
      'a sleek architectural glass bottle catching a narrow beam of golden sunlight against charcoal stone',
      'a pair of heavy crystal glasses beside a dark bottle on a moody wood and stone table',
      'a frosted glass fragrance bottle resting on cool marble with soft diffused morning light',
      'a vintage-style heavy glass bottle with warm liquid glow set on dark basalt near calm water'
    ])
  },
  {
    id: 'ancient-abandoned-sanctuaries',
    label: 'Napušteni i drevni prostori u prirodi',
    subjects: wrapSubjects([
      'weathered stone arches of an ancient ruin overgrown with moss and ferns as shafts of sunlight pierce the mist',
      'an old stone aqueduct stretching across a misty valley with dense forest and quiet river below',
      'a quiet forgotten stone chamber with cracked plaster, tall arched windows, and soft natural daylight',
      'ancient mossy steps winding through a dense misty forest toward a ruined stone terrace',
      'an abandoned stone mill beside a rushing mountain stream with wet rocks and autumn leaves',
      'a secluded stone courtyard reclaimed by wild greenery under moody overcast sky light',
      'weathered marble columns standing in shallow calm water reflecting soft twilight clouds',
      'an old timber-and-stone cabin interior with dust motes in a single beam of afternoon sun',
      'ruined stone walls overlooking a wide misty mountain gorge at golden hour',
      'a quiet ancient stone bridge spanning a clear forest stream surrounded by ferns and mist'
    ])
  },
  {
    id: 'night-automotive-urban',
    label: 'Noćni urbani i auto-moto kadrovi',
    subjects: wrapSubjects([
      'a sleek dark sports coupe driving along a wet asphalt road at night with glowing tail lights and street reflections',
      'a modern grand tourer parked under warm amber streetlamps on rain-slicked cobblestones after midnight',
      'a matte black performance car moving through a misty night highway with crisp headlight beams and wet road sheen',
      'an architectural city avenue at night with wet pavement reflecting warm building lights and clean framing',
      'a lone coupe on a coastal night road beside dark ocean waves with subtle light trails on wet asphalt',
      'a moody night street scene with warm shopfront glow, wet stone surfaces, and deep shadow contrast',
      'a performance car with glowing rear light bar cruising a quiet mountain pass road under dark night sky',
      'a sleek dark sedan resting near illuminated glass architecture at blue-hour nightfall',
      'wet urban crosswalks and dark asphalt reflecting warm amber and cool night lights in light rain',
      'a sports car parked along an empty harbor quay at night with calm dark water reflections'
    ])
  },
  {
    id: 'nature-seasons-rivers',
    label: 'Priroda: Godišnja doba, planine i reke',
    subjects: wrapSubjects([
      'a wild mountain river winding through a lush spring valley filled with blooming wildflowers and fresh emerald birch trees beneath snow-capped peaks',
      'a crystal-clear turquoise alpine river carving through sun-drenched summer granite gorges with dense pine forests along the banks',
      'a calm broad autumn river reflecting fiery amber, copper, and crimson foliage beneath misty mountain ridges at dawn',
      'a dark winter river flowing swiftly between snow-draped boulders and frosted evergreen trees at the foot of towering jagged ice-covered mountains',
      'a dramatic jagged mountain peak catching warm alpenglow at sunrise above a mirror-still glacial tarn framed by dark conifers',
      'a cascading mountain waterfall feeding a wide emerald river through a steep canyon in early spring thaw with wet moss-covered rocks',
      'a high-altitude summer meadow dotted with alpine flora overlooking a glacial river valley and distant snow-streaked summits under a deep clear sky',
      'a winding autumn river cutting through golden larch forests and low drifting morning fog against rugged slate mountain slopes',
      'snow-covered high mountain ridges under pale winter twilight with a frozen river bend and crisp blue shadows across fresh powder snow',
      'a wide braided river delta meeting dark coastal cliffs and dramatic mountain peaks as shifting seasonal clouds cast alternating light and shadow'
    ])
  },
  {
    id: 'surreal-fantasy-worlds',
    label: 'Nadrealni svetovi i fantazija',
    subjects: wrapSubjects([
      'a grand ancient stone citadel rising above a thick sea of golden-lit clouds with cascading waterfalls pouring off its outer walls',
      'a sculpted fire-breathing dragon poised on a carved stone pedestal inside a dim vaulted hall with warm shafts of light through tall windows',
      'an armored warrior standing atop a high rocky mountain cliff holding a glowing sword aloft beneath dramatic storm clouds and jagged peaks',
      'a colossal floating island of ancient ruins and waterfalls suspended above misty alpine valleys at dusk',
      'a towering bioluminescent ancient tree inside a dark subterranean cavern with glowing mist and stone walkways',
      'a solitary lighthouse standing on a jagged basalt rock spire amidst turbulent ocean waves and dramatic sky light',
      'an ornate celestial observatory dome perched on a snowy mountain ridge under glowing twilight clouds',
      'a monumental stone archway opening onto a glowing golden horizon across a vast misty highland',
      'a sunken cathedral courtyard overgrown with lush greenery where shafts of sunlight pierce through broken arches',
      'a giant crystal spire rising from a calm dark mountain lake reflecting warm sunset clouds'
    ])
  },
  {
    id: 'unusual-luxury-collisions',
    label: 'Neobični luksuzni sudari',
    subjects: wrapSubjects([
      'a fine mechanical wristwatch resting on a brass stand inside a glass bell jar surrounded by delicate glowing butterflies and mossy botanical details',
      'a rich dark chocolate bar partially melted into warm golden desert sand dunes under bright low sun with crisp shadows',
      'a sleek champagne-gold supercar parked along a winding mountain highway with a camera drone hovering above the alpine valley',
      'a dark matte supercar speeding along a rain-slicked coastal road at night with glowing tail lights, wet reflections, and a drone above',
      'a vintage leather-bound book resting on a moss-covered forest log with warm golden light filtering through tall trees',
      'a crystal decanter of amber liquid resting on dark volcanic rock beside a calm mountain stream at twilight',
      'a minimalist architectural glass pavilion set in the middle of a vast snowy mountain basin at dusk',
      'a sculpted metallic timepiece resting on raw desert sandstone beside wind-carved dunes at golden hour',
      'an open brass compass and fine watch resting on dark wet slate beside a rushing forest waterfall',
      'a sleek luxury coupe parked beside a mirror-still autumn mountain lake reflecting golden trees and peaks'
    ])
  },
  {
    id: 'cinematic-portraits-glamour',
    label: 'Filmski portreti i glamur',
    subjects: wrapSubjects([
      'a poised woman with blonde bob hair in a structured crimson satin evening gown standing inside a grand historic hall with crystal chandeliers and warm side light',
      'a dramatic editorial portrait of a figure in tailored dark wool inside a moody classical gallery with soft window light and rich shadows',
      'a refined evening portrait in a candlelit architectural salon with dark velvet drapery, warm rim lighting, and shallow depth of field',
      'a striking editorial figure in a structured emerald silk coat standing before tall arched windows with soft diffused daylight',
      'a cinematic portrait inside a minimalist concrete and glass space with dramatic directional light and crisp shadow contrast',
      'a poised subject in classic evening attire beside a grand staircase with warm ambient glow and natural film grain',
      'an atmospheric portrait in a dimly lit library with warm lamp light, wood paneling, and subtle lens flare',
      'a high-fashion editorial portrait against dark textured plaster with sculpted key light and deep tonal richness',
      'a serene portrait near tall misty windows with soft morning light and delicate highlights on fabric and skin',
      'a bold evening portrait in a grand hall with warm chandelier reflections and rich dark shadow tones'
    ])
  },
  {
    id: 'unusual-photography',
    label: 'Neobične fotografije',
    subjects: wrapSubjects([
      'a solitary rowboat floating calmly above a sea of dense white clouds between towering snow-dusted mountain peaks',
      'an ancient grand piano standing in the middle of a vast salt flat at dusk with a mirror-like reflection of a glowing amber horizon',
      'a giant glowing translucent hourglass suspended inside a dark misty redwood forest with golden sand trickling through the glass',
      'a cascade of crystal-clear water pouring out of an open vintage leather-bound book resting on a monolithic stone ledge in an arid desert canyon',
      'a monumental glass greenhouse suspended above deep turquoise ocean swells under dramatic storm clouds',
      'a single luminous full moon rising just above a calm mirror lake framed by tall dark cypress silhouettes',
      'sculptural floating monoliths of dark basalt and warm amber light hovering above an endless wind-rippled sand dune',
      'a surrealist architectural staircase ascending into a beam of golden sunlight through dense morning fog in a pine forest',
      'a vintage brass telescope aimed at a cluster of glowing suspended crystal prisms inside an abandoned brutalist concrete observatory',
      'a towering solitary lighthouse built from translucent amber glass standing on a narrow ribbon of black volcanic sand between two calm seas'
    ])
  },
  {
    id: 'womens-eyewear',
    label: 'Ženske luksuzne naočare',
    subjects: wrapSubjects([
      'oversized sculptural black acetate women’s sunglasses with 18k gold temple hardware',
      'avant-garde rimless titanium cat-eye sunglasses with gradient amber lenses',
      'handcrafted Havana tortoiseshell women’s frames with beveled edges and gold hinges',
      'geometric hexagonal gold-wire women’s sunglasses with smoked rose-tinted glass lenses',
      'minimalist white-gold and horn-rimmed luxury women’s optical frames on a stone ledge',
      'bold architectural ivory-acetate women’s sunglasses with subtle polarized reflection',
      'ultra-thin brushed champagne-titanium women’s aviator sunglasses with crystal lenses',
      'sculptural monochrome dark-emerald acetate women’s frames resting beside raw quartz',
      'rounded retro smoked-quartz women’s sunglasses with brushed brass bridge detail',
      'asymmetrical luxury dark-burgundy acetate women’s eyewear on honed travertine'
    ])
  },
  {
    id: 'womens-handbags',
    label: 'Ženske luksuzne torbe',
    subjects: wrapSubjects([
      'a structured matte-black box-calfskin women’s top-handle handbag with brushed palladium clasp',
      'an exotic emerald-green alligator-embossed leather evening clutch with sculpted gold frame',
      'a minimalist warm-taupe full-grain Epsom leather tote bag standing upright on stone',
      'a quilted lambskin chain-strap luxury shoulder bag in deep burgundy leather',
      'an architectural ivory-white saddle handbag with hand-stitched saddle seams and brass hardware',
      'a petite sculptural satin and brushed-gold minaudière evening bag on dark glass',
      'a cognac-tan heritage leather weekender handbag with solid unlacquered brass lock',
      'a sleek midnight-navy crocodile-grain structured handbag with clean minimalist silhouette',
      'a soft cloud-grey suede and smooth-leather bucket bag with gold drawstring hardware',
      'a geometric obsidian-leather envelope clutch with brushed silver bar accent'
    ])
  },
  {
    id: 'luxury-home-interiors',
    label: 'Luksuzan enterijer kuća',
    subjects: wrapSubjects([
      'a double-height modern penthouse living room with floor-to-ceiling bronze-framed glass, travertine fireplace, and low bouclé seating',
      'a minimalist architectural kitchen featuring a monolithic veined Calacatta Viola marble island and smoked-oak cabinetry',
      'a serene master bedroom suite with recessed warm cove lighting, raw linen drapery, and a monolithic honed limestone wall',
      'a private subterranean wine cellar and tasting lounge framed in backlit smoked glass, blackened steel, and aged walnut',
      'a sculptural spa bathroom with a freestanding carved black-basalt soaking tub overlooking an indoor Zen courtyard',
      'a grand minimalist foyer with a cantilevered raw-concrete and oak staircase beside a tall indoor olive tree',
      'an executive private library with floor-to-ceiling matte walnut shelving, integrated brass reading lamps, and cognac leather lounge chairs',
      'an open-concept dining gallery featuring a massive live-edge dark timber table beneath a sculptural alabaster chandelier',
      'a quiet architectural listening lounge with custom acoustic timber slats, low modular linen sofa, and smoked glass bar',
      'a minimalist courtyard residence gallery with floor-to-ceiling sliding glass doors opening onto a reflecting pool'
    ])
  },
  {
    id: 'oceanfront-villas',
    label: 'Luksuzan eksterijer vila na obali okeana',
    subjects: wrapSubjects([
      'a cantilevered white-concrete and glass cliffside modern villa with a zero-edge infinity pool merging into the deep blue ocean',
      'a sprawling Mediterranean limestone coastal estate with sunken firepit lounge terraces overlooking dramatic rocky cliffs at sunset',
      'a tropical minimalist teak-and-basalt oceanfront villa surrounded by reflection ponds and palm silhouettes above turquoise water',
      'an ultra-modern blackened-cedar and floor-to-ceiling glass beach residence perched directly above crashing white ocean waves',
      'a multi-level architectural coastal mansion with glowing warm interior lights reflecting across a glassy infinity pool at blue hour',
      'a sculptural curved-concrete seaside sanctuary with private stone steps descending into a secluded crystal-clear cove',
      'a contemporary coastal pavilion villa with overhanging travertine roofs, outdoor travertine dining deck, and panoramic horizon views',
      'an isolated Nordic coastal glass-and-granite villa anchored onto rugged dark sea cliffs facing a calm steel-blue ocean',
      'a minimalist sand-stone oceanfront retreat with cantilevered sun deck and dark lap pool overlooking gentle surf',
      'an architectural cliffside residence with warm recessed exterior lighting and panoramic glass walls above deep indigo sea'
    ])
  },
  {
    id: 'forest-cabins',
    label: 'Luksuzan enterijer koliba u šumi',
    subjects: wrapSubjects([
      'an A-frame luxury forest cabin living room with soaring charred-cedar beams, a suspended matte-black fireplace, and panoramic glass framing misty pines',
      'a cozy ultra-luxury timber-and-stone woodland sanctuary with low shearling armchairs, raw river-stone hearth, and tall moss-covered forest views',
      'a modern Scandinavian woodland cabin bedroom with warm Douglas-fir paneling, wool throws, and floor-to-ceiling windows looking into snowy spruce trees',
      'a secluded forest cabin spa lounge featuring a cedar wood-fired sauna, cold plunge stone basin, and rain-streaked glass overlooking dense ferns',
      'an architectural glass-and-dark-oak forest dining room nestled deep inside an ancient redwood grove during morning fog',
      'a moody modern mountain-forest loft interior with dark slate floors, bespoke leather sofa, and warm amber lighting contrasting deep twilight woods',
      'a minimalist Japanese-inspired forest cabin tea room with tatami-level seating, shoji-screen light diffusion, and open sliding doors to a misty cedar forest',
      'a luxury woodland hideaway kitchen and lounge crafted from reclaimed dark barn wood, honed soapstone counters, and expansive forest canopy windows',
      'a warm timber-lined forest cabin reading nook with built-in oak benches, wool blankets, and tall glass overlooking birch trees in mist',
      'a bespoke mountain-forest cabin living space with raw board-formed concrete hearth, smoked oak beams, and quiet woodland views'
    ])
  },
  {
    id: 'aviation-yachts',
    label: 'Avijacija i jahte',
    subjects: wrapSubjects([
      'sleek private jet cabin interior with hand-stitched cream leather seats',
      'aerodynamic carbon-fiber private aircraft winglet above twilight clouds',
      'superyacht aft deck lounge overlooking calm deep-blue Mediterranean water',
      'minimalist mega-yacht master suite with panoramic floor-to-ceiling glass',
      'supersonic business jet cockpit console with matte dark anodized switches',
      'teak-decked luxury tender yacht cutting through mirror-still morning sea',
      'private hangar interior housing a matte-silver long-range business jet',
      'cantilevered superyacht glass infinity pool edge at golden hour',
      'luxury superyacht salon with brushed bronze accents and panoramic sea windows',
      'long-range private jet cruising above golden cloud tops at dusk'
    ])
  },
  {
    id: 'gourmet-culinary',
    label: 'Luksuzna gastronomija',
    subjects: wrapSubjects([
      'avant-garde Michelin-star dish plated on hand-forged dark stoneware',
      'artisanal crystal decanter pouring aged amber spirit over hand-carved ice',
      'delicate edible gold leaf and botanical micro-greens on matte black ceramic',
      'molecular gastronomy dessert sphere with subtle dry-ice vapor trail',
      'single-origin espresso extraction in a double-walled borosilicate glass',
      'aged Japanese Wagyu sear resting on hot volcanic basalt slab',
      'minimalist Nordic seafood plating with translucent sea-foam reduction',
      'vintage crystal coupe glass with clear botanical cocktail on dark marble',
      'hand-crafted dark chocolate tartlet with delicate caramelized glaze on slate',
      'chilled raw oysters arranged on crushed ice and dark volcanic stone'
    ])
  },
  {
    id: 'abstract-concepts',
    label: 'Unikatni koncepti',
    subjects: wrapSubjects([
      'the physical embodiment of Silence as a towering figure of dark velvet and mist',
      'a lone traveler carrying an intricately caged glowing star across cracked earth',
      'an ancient gnarled oak tree fused with precision aged-brass clockwork gears',
      'a majestic stag sculpted entirely from clear spun optical glass in a forest',
      'an entire subterranean metropolis carved inside a colossal amethyst geode',
      'a library of waterfalls with stone reading ledges carved into misty cliffs',
      'a double-exposure urban street merging modern glass towers with 1920s stone',
      'a monumental thundercloud forming a contemplative silhouette over calm sea',
      'a suspended sphere of liquid mercury reflecting a quiet desert horizon',
      'a monolithic stone archway framing a portal of warm golden twilight'
    ])
  }
];

const JEWELRY_WATCH_AMBER_BOX_ENVIRONMENTS = [
  'nested neatly inside its ornate matching presentation box lined with rich warm amber velvet and fitted compartments with zero text or logos',
  'resting securely on a sculpted cushion wrapped in luminous golden-amber silk inside a finely decorated collector case with zero text or logos',
  'displayed inside an ornate carved wood jewelry and watch box with plush amber satin interior lining and brass hinges with zero text or logos',
  'poised on a tailored pillow of rich amber crushed velvet inside an embellished presentation box with zero text or logos',
  'housed neatly inside its matching luxury case lined with warm cognac-amber suede and ornate trim with zero text or logos',
  'presented inside an ornate lacquer collector chest with a fitted warm amber silk cushion and delicate decorative border with zero text or logos',
  'resting securely on a pleated amber organza and velvet insert inside an ornate display box with zero text or logos',
  'displayed inside a refined embellished presentation box featuring a soft amber plush lining and precision compartments with zero text or logos',
  'nestled neatly inside its dedicated luxury box with rich amber velvet interior and ornamental metal corner detailing with zero text or logos',
  'resting on a fitted amber-toned silk and velvet tray inside an ornate collector box with zero text or logos',
  'housed in an ornate dark-wood presentation box lined with warm honey-amber velvet and sculpted slots with zero text or logos',
  'displayed cleanly inside its matching decorated case with plush amber fabric lining and zero text or logos'
];

const LUXURY_CAR_PARTS_STUDIO_ENVIRONMENTS = [
  'all properly mounted in place on the luxury vehicle inside a dark commercial studio with a mirror-polished black obsidian floor and clean studio reflections',
  'installed intact on the luxury vehicle inside a private automotive design studio against a seamless matte charcoal cyclorama with crisp studio light lines',
  'fitted cleanly in its factory position on the luxury vehicle inside an exclusive dark studio with honed Nero Marquina marble reflections and controlled rim light',
  'mounted in situ on the luxury vehicle inside a bespoke dark atelier studio with soft overhead softbox reflections and deep obsidian shadow contrast',
  'attached intact to the luxury vehicle inside a high-end commercial studio featuring brushed dark anodized walls and subtle studio floor sheen',
  'installed natively on the luxury vehicle inside an ultra-clean dark automotive studio with precision strip-box highlights and zero loose parts',
  'mounted in place on the luxury vehicle inside a moody private showroom studio with dark architectural panels and controlled specular reflections',
  'fitted cleanly on the luxury vehicle inside a luxury dark photography studio with seamless charcoal backdrop and crisp directional lighting'
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
  'surrounded by organic natural textures, subtle patina, and quiet luxury ambiance',
  'with bright sun rays piercing through clear water and natural depth falloff',
  'in a serene deep-water habitat with subtle sediment and natural underwater visibility'
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
  'under soft diffused natural light with clean shadow separation and zero harsh glare'
];

const OPTICS_PROFILES = [
  'shot on Phase One IQ4 150MP, 120mm macro lens, f/8, razor-sharp focal plane, RAW unedited sensor response, micro-contrast preservation, natural organic film grain',
  'shot on Hasselblad H6D-100c, HC 80mm f/2.8 lens, 1/125s, ISO 64, linear color science, subtle optical depth, fine surface patina, zero plastic smoothing',
  'shot on Arri Alexa 65, 85mm Prime DNA lens at f/1.8, cinematic shallow depth of field, Kodak Portra 400 tonal depth, natural bokeh, subtle lens dust',
  'shot on Leica SL2-S, APO-Summicron 50mm f/2 ASPH, crisp edge-to-edge optical clarity, natural specular highlights, authentic micro-imperfections, zero AI gloss',
  'shot on 100mm macro probe lens, f/5.6, extreme optical fidelity, subtle natural chromatic aberration, Fujifilm Velvia 50 dynamic range, fine grain',
  'shot on medium format technical camera, 24mm tilt-shift lens, f/11, architectural perspective control, deep tonal gradation, RAW photographic realism',
  'shot on Red V-Raptor 8K VV, 65mm anamorphic prime at f/2.4, 1/4000s high-speed shutter, crisp contact shadows, organic filmic texture',
  'shot on Sony Alpha 1, 90mm f/2.8 Macro G, ISO 100, unretouched editorial photography, authentic material grain, zero synthetic smoothing',
  'shot on Fujifilm GFX 100 II, GF 110mm f/2 R LM WR, medium-format tonal latitude, natural highlight roll-off, authentic surface texture',
  'shot on Canon EOS R5, RF 85mm f/1.2L USM, crisp focal detail, organic optical rendering, clean unedited RAW color response',
  'shot on Nikon Z9, Nikkor Z 50mm f/1.2 S, high dynamic range, natural micro-texture, unedited editorial fidelity',
  'shot on Hasselblad X2D 100C, XCD 90V f/2.5, crisp medium-format detail, authentic tonal balance, zero artificial processing'
];

const LUXURY_WATCH_META_TOKENS = [
  '[Meta Tokens: Sapphire anti-reflective coating, guilloché dial micro-engraving, brushed grade-5 titanium, tourbillon bridge beveling, crisp specular highlights]',
  '[Meta Tokens: Precious metal micro-grain, domed sapphire refraction, hand-chamfered lugs, warm tonal depth, horological macro fidelity]',
  '[Meta Tokens: Ceramic bezel gloss, luminous index micro-relief, brushed steel grain, crisp edge contrast, optical realism]',
  '[Meta Tokens: Platinum density sheen, sub-dial micro-texture, gear train reflections, rim light separation, high-horology detail]',
  '[Meta Tokens: Forged carbon weave texture, sapphire crystal clarity, mechanical escapement depth, crisp shadows, studio lighting]',
  '[Meta Tokens: Patinated bronze surface, domed glass distortion, crisp edge bevels, deep tonal contrast, medium-format sharpness]',
  '[Meta Tokens: DLC matte-gloss contrast, oscillating balance wheel, anti-reflective sapphire, clean studio shadows, optical precision]',
  '[Meta Tokens: Guilloché engraving depth, multi-axis cage detail, amber fabric weave, soft specular highlights, macro clarity]',
  '[Meta Tokens: Hand-engraved white gold, amber suede micro-fibers, crisp acoustic hammer detail, natural roll-off, GFX fidelity]',
  '[Meta Tokens: Transparent sapphire case, mainspring coil detail, amber velvet relief, refined highlights, RAW color accuracy]'
];

const META_TOKEN_STACKS = [
  '[Meta Tokens: Volumetric smoke simulation, metallic flakes BRDF, physically based rendering, rim lighting, deep blacks]',
  '[Meta Tokens: Metallic flakes BRDF, volumetric smoke simulation, rim lighting, physically based rendering, deep blacks]',
  '[Meta Tokens: Physically based rendering, metallic flakes BRDF, volumetric smoke simulation, rim lighting, deep blacks]',
  '[Meta Tokens: Rim lighting, volumetric smoke simulation, metallic flakes BRDF, physically based rendering, deep blacks]',
  '[Meta Tokens: Deep blacks, metallic flakes BRDF, volumetric smoke simulation, physically based rendering, rim lighting]'
];

const V10_GUARDRAILS = 'clean commercial composition, zero text, zero typography, zero logos, zero watermarks, zero UI overlays';

const BATCH_LIMIT = 10;
const MAX_PROMPTS = 5000;

export default function V10PromptGenerator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('luxury-car-parts-brakes-seats-lights');
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [antigravityStatus, setAntigravityStatus] = useState('');

  const selectedCategoryObj = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0],
    [selectedCategoryId]
  );

  // Izgradnja deduplikovanih unikatnih kombinacija do MAX_PROMPTS po kategoriji
  const buildCategoryPrompts = (categoryObj) => {
    const list = [];
    const seenPrompts = new Set();
    const isJewelryOrWatch =
      categoryObj.id === 'luxury-watches' || categoryObj.id === 'diamonds-jewelry';
    const isCarPartsCategory = categoryObj.id === 'luxury-car-parts-brakes-seats-lights';
    const envPool = isJewelryOrWatch
      ? JEWELRY_WATCH_AMBER_BOX_ENVIRONMENTS
      : isCarPartsCategory
      ? LUXURY_CAR_PARTS_STUDIO_ENVIRONMENTS
      : ENVIRONMENTS;
    const metaPool = isJewelryOrWatch ? LUXURY_WATCH_META_TOKENS : META_TOKEN_STACKS;

    const subCount = categoryObj.subjects.length;
    const envCount = envPool.length;
    const lightCount = LIGHTING_RIGS.length;
    const optCount = OPTICS_PROFILES.length;
    const metaCount = metaPool.length;
    const totalPermutations = subCount * envCount * lightCount * optCount * metaCount;
    const targetTotal = Math.min(MAX_PROMPTS, totalPermutations);

    let step = 0;
    while (list.length < targetTotal && step < totalPermutations * 3) {
      const s = (step + Math.floor(step / (subCount * envCount))) % subCount;
      const e = (step * 3 + Math.floor(step / subCount)) % envCount;
      const l = (step * 7 + Math.floor(step / (subCount * 2))) % lightCount;
      const o = (step * 11 + Math.floor(step / (subCount * 3))) % optCount;
      const m = (step * 5 + Math.floor(step / (subCount * 4))) % metaCount;
      step++;

      const subjObj = categoryObj.subjects[s];
      const placementDirective = resolvePlacementDirective(subjObj.placement);
      const framingClause = isCarPartsCategory ? `${NO_FULL_CAR_DIRECTIVE}, ` : '';
      const unifiedPrompt = `Editorial ultra-realistic commercial photograph of ${subjObj.text}, ${placementDirective}, ${framingClause}${envPool[e]}, ${LIGHTING_RIGS[l]}, ${OPTICS_PROFILES[o]}, ${metaPool[m]}, ${V10_GUARDRAILS}.`;
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

  const triggerDownloadForPool = (pool, categoryObj) => {
    const content = pool
      .map((item) => `${item.index}. [${item.category}] ${item.prompt}`)
      .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `V10_ANTIGRAVITI_${categoryObj.id}_${pool.length}_Promptova.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = () => {
    const pool = buildCategoryPrompts(selectedCategoryObj);
    setActivePool(pool);
    setBatchOffset(0);
    setIsGenerated(true);
    setAntigravityStatus('');
  };

  const handleNext = () => {
    if (!isGenerated) return;
    const nextOffset = batchOffset + BATCH_LIMIT;
    if (nextOffset < activePool.length) {
      setBatchOffset(nextOffset);
    }
  };

  const handleReset = () => {
    setActivePool([]);
    setBatchOffset(0);
    setIsGenerated(false);
    setAntigravityStatus('');
  };

  const currentBatch = useMemo(() => {
    if (!isGenerated) return [];
    return activePool.slice(batchOffset, batchOffset + BATCH_LIMIT);
  }, [isGenerated, activePool, batchOffset]);

  const hasNextBatch = isGenerated && batchOffset + BATCH_LIMIT < activePool.length;

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1600);
  };

  const handleAntigravityDownload = () => {
    const pool = activePool.length > 0 ? activePool : buildCategoryPrompts(selectedCategoryObj);
    if (activePool.length === 0) {
      setActivePool(pool);
      setBatchOffset(0);
      setIsGenerated(true);
    }
    triggerDownloadForPool(pool, selectedCategoryObj);
    setAntigravityStatus(`Antigraviti skinuto ✓ (${pool.length} promptova)`);
    setTimeout(() => setAntigravityStatus(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-amber-500/10 via-amber-900/5 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-5 py-10 md:py-14 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800/90 pb-7">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-300 text-[11px] font-semibold tracking-widest uppercase">
              PRIVATNI TREZOR • {HIDDEN_VAULT_ROUTE}
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Visionary Factory <span className="text-amber-400 font-serif italic">V10</span> Studio
            </h1>
            <p className="text-sm text-stone-400 max-w-2xl">
              Izaberi kategoriju, klikni <span className="text-amber-300 font-medium">GENERIŠI</span> za prvih 10 jedinstvenih spojenih promptova (bez ponavljanja), koristi <span className="text-amber-300 font-medium">SLEDEĆIH 10</span> za nastavak ili <span className="text-amber-300 font-medium">ANTIGRAVITI PREUZIMANJE</span> da odmah preuzmeš sve promptove izabrane kategorije.
            </p>
          </div>

          <button
            onClick={handleAntigravityDownload}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 via-amber-500/20 to-yellow-500/20 hover:from-amber-400/30 hover:to-yellow-500/30 border border-amber-400/40 text-xs font-bold tracking-wide text-amber-200 shadow-lg shadow-amber-500/10 transition cursor-pointer"
          >
            {antigravityStatus || 'ANTIGRAVITI PREUZIMANJE'}
          </button>
        </header>

        <section className="bg-stone-900/65 backdrop-blur-md border border-stone-800 rounded-2xl p-5 md:p-6 shadow-2xl space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-6 space-y-2">
              <label
                htmlFor="v10-category-select"
                className="block text-xs font-semibold uppercase tracking-wider text-amber-300/90"
              >
                Izaberi kategoriju (1 od {CATEGORIES.length})
              </label>
              <select
                id="v10-category-select"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setIsGenerated(false);
                  setBatchOffset(0);
                  setAntigravityStatus('');
                }}
                className="w-full rounded-xl bg-[#0c0c10] border border-stone-700/90 hover:border-amber-500/40 focus:border-amber-400 focus:outline-none px-4 py-3.5 text-sm text-white transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleGenerate}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:brightness-105 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                GENERIŠI
              </button>

              <button
                onClick={handleNext}
                disabled={!hasNextBatch}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl font-bold text-sm tracking-wide border transition ${
                  hasNextBatch
                    ? 'bg-stone-800 hover:bg-stone-700 border-amber-400/40 text-amber-300 cursor-pointer'
                    : 'bg-stone-900/50 border-stone-800 text-stone-600 cursor-not-allowed'
                }`}
              >
                SLEDEĆIH 10 →
              </button>

              <button
                onClick={handleAntigravityDownload}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-200 font-bold text-xs tracking-wide transition cursor-pointer"
              >
                {antigravityStatus || 'ANTIGRAVITI PREUZIMANJE'}
              </button>

              {isGenerated && (
                <button
                  onClick={handleReset}
                  title="Resetuj prikaz"
                  className="px-3.5 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-300 hover:text-white transition cursor-pointer"
                >
                  RESETUJ
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-800/80 text-xs text-stone-400">
            <div>
              Aktivna kategorija:{' '}
              <span className="text-stone-200 font-medium">{selectedCategoryObj.label}</span>
            </div>
            <div>
              {isGenerated ? (
                <span>
                  Prikazano:{' '}
                  <span className="text-amber-300 font-semibold">
                    {batchOffset + 1}–{Math.min(batchOffset + BATCH_LIMIT, activePool.length)}
                  </span>{' '}
                  od <span className="text-stone-200 font-semibold">{activePool.length}</span>{' '}
                  {hasNextBatch ? '• Čeka se klik na SLEDEĆIH 10' : '• Kraj serije'}
                </span>
              ) : (
                <span>Čeka se klik na GENERIŠI ili ANTIGRAVITI PREUZIMANJE</span>
              )}
            </div>
          </div>
        </section>

        {isGenerated && (
          <section className="space-y-4">
            {currentBatch.map((item, idx) => (
              <article
                key={item.index}
                className="bg-stone-900/55 hover:bg-stone-900/85 border border-stone-800/90 hover:border-amber-500/30 rounded-2xl p-5 transition"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs font-bold">
                      #{item.index}
                    </span>
                    <span className="text-xs font-medium text-stone-400">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.prompt, idx)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-400 hover:text-stone-950 text-xs font-semibold text-stone-200 transition cursor-pointer"
                  >
                    {copiedIndex === idx ? 'Kopirano ✓' : 'Kopiraj'}
                  </button>
                </div>

                <p className="text-sm md:text-[15px] leading-relaxed text-stone-100 select-all">
                  {item.prompt}
                </p>
              </article>
            ))}

            {hasNextBatch && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-bold text-sm tracking-wide transition cursor-pointer"
                >
                  SLEDEĆIH 10 PROMPTOVA →
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}