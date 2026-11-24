import React, { useState, useMemo, useEffect, useRef } from 'react';

export const HIDDEN_VAULT_ROUTE = '/goran';

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
        text: 'a tight macro shot of a complete heat-seasoned slotted brake disc with acid yellow brake calipers and pads, fine brake dust micro-texture, forged spokes, tire shoulder, and fender edge on the vehicle, entire brake and wheel assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a crisp macro framing of a complete large cross-drilled brake rotor with deep cobalt blue brake calipers and pads installed on the wheel hub with visible tire profile and sculpted bodywork on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a high-contrast close-up of a complete perforated carbon-ceramic brake disc with vibrant racing red brake calipers and pads mounted inside a dark performance wheel with tire rubber and fender arch on the vehicle, entire wheel assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up detail of a complete cross-drilled disc rotor with golden amber-yellow brake calipers and pads behind dark forged spokes, visible tire sidewall, and sculpted quarter panel on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'an intimate macro view of a complete grooved carbon-ceramic brake disc with royal blue brake calipers and pads mounted inside an alloy wheel with visible tire tread shoulder and bodywork on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a razor-sharp close-up of a complete vented brake rotor with deep ruby red brake calipers and pads behind forged wheel spokes, visible tire sidewall, and fender arch on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro shot of a complete cross-drilled performance brake disc with bright yellow brake calipers and pads mounted on the wheel with tire rubber and lower sill bodywork on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed close-up of a complete slotted brake rotor with metallic blue brake calipers and pads inside a forged wheel with visible tire sidewall and fender line on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dramatic macro framing of a complete carbon-ceramic brake disc with intense crimson red brake calipers and pads mounted inside a dark wheel with tire sidewall and bodywork on the vehicle, entire assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight interior macro shot of an entire illuminated digital instrument cluster and curved LED display glowing inside a dark luxury vehicle cabin inspired by Porsche and BMW flagship cockpits with zero visible branding or logos and no legible text or UI clutter, showing the full cockpit display intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up interior detail of a complete sculpted automatic gear selector paired with a full tactile control rail of precision buttons and switches alongside the shifter inside a luxury vehicle cabin inspired by Ferrari and Aston Martin interiors with zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a dramatic macro shot of a complete glowing backlit instrument panel and deep-set LED display gauges inside a dark performance cabin inspired by Lamborghini and McLaren cockpits with zero visible branding or logos and clean abstract light indicators, no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight interior close-up of an entire elongated center console control rail lined with crisp backlit buttons, knurled dials, and toggle switches right beside an automatic gear shifter inside a luxury grand tourer cabin inspired by Rolls-Royce and Bentley interiors with zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up of a complete faceted glass and brushed-metal automatic gear shifter beside a full row of precision control buttons and switches on the center console inside a luxury vehicle cabin inspired by Bugatti and Porsche interiors with zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a focused interior shot of a complete glowing high-contrast LED display and illuminated instrument binnacle inside a dark luxury cabin with crisp ambient light reflections and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed close-up of a complete control rail of metallic and backlit buttons running alongside an automatic transmission selector inside a luxury vehicle interior with dark leather and carbon trim and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'an intimate macro shot of a complete illuminated digital gauge cluster and sleek LED display panel inside a dark luxury vehicle interior with soft light diffusion and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio framing of the complete rear section of a dark luxury hypercar inspired by Bugatti and Porsche flagship engineering with zero visible branding or logos, showcasing the full illuminated red LED taillight bar, sculpted rear diffuser fins, and carbon aero vents intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a dramatic studio framing of the complete rear section of a performance coupe inspired by Ferrari and Aston Martin halo design with zero visible branding or logos, highlighting precision segmented red LED taillights, dark honeycomb rear vents, and sculpted rear quarter bodywork intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a precision close-up of the complete rear section of a dark exotic sports car inspired by Lamborghini and McLaren flagship lighting architecture with zero visible branding or logos, featuring razor-sharp glowing red LED light blades, sculpted rear deck louvers, and deep carbon diffuser geometry intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed studio study of the complete rear section of a luxury grand tourer inspired by Rolls-Royce and Bentley flagship craftsmanship with zero visible branding or logos, showcasing jewel-like illuminated rear light clusters, clean rear bumper contours, and subtle metallic paint depth intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio close-up of the complete front fascia of a dark luxury supercar inspired by Ferrari and Aston Martin flagship headlights with mandatory glowing front headlights turned on and crisp LED light signatures and zero visible branding or logos, intact front section with no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio framing of the complete front section of a performance coupe inspired by Porsche and Bugatti flagship lighting with mandatory bright illuminated front headlights turned on, sharp daytime running light blades, and sculpted front intakes and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a focused studio shot of the complete front section of an exotic hypercar inspired by Lamborghini and McLaren flagship LED optics with mandatory glowing front headlights turned on, intense white-and-amber light accents, and sculpted front bodywork and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a refined studio view of the complete front section of an ultra-luxury coupe inspired by Rolls-Royce and Bentley flagship front lighting with mandatory glowing front headlights turned on, multi-element optical projectors, and crisp front fender lines and zero visible branding or logos, no full car visible',
        placement: 'center'
      },
      {
        text: 'a macro close-up of the complete rear lighting section of a supercar inspired by Porsche and Ferrari flagship rear lighting with glowing red LED light strips, dark carbon rear diffuser, and sculpted rear fender contours intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a studio framing of the complete front section of a dark hypercar inspired by Bugatti and Aston Martin flagship front lights with mandatory glowing front headlights turned on, razor-sharp LED beam elements, and sculpted hood and bumper lines intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up of the complete rear lighting section of a flagship sports car inspired by Lamborghini and Rolls-Royce lighting details with vivid red LED tail lamps, sculpted rear air vents, and clean lower diffuser geometry intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed close-up of the complete front section of a luxury coupe inspired by McLaren and Bentley flagship headlights with mandatory glowing front headlights turned on, crisp optical projectors, and sculpted front aero vents intact, no full car visible',
        placement: 'center'
      },
      {
        text: 'an extreme close-up of a complete cross-drilled carbon-ceramic brake disc and glossy crimson-painted multi-piston brake caliper mounted inside a dark forged wheel with visible low-profile tire sidewall and fender arch on the vehicle, entire wheel assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro shot of precision contrast stitching along a woven safety seat belt mounted on the B-pillar beside a leather seat bolster inside the vehicle cabin, complete buckle and strap assembly intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up study of a complete sculpted luxury bucket seat in supple cognac aniline leather with quilted side bolsters and fine double stitching installed inside a dark luxury vehicle cabin, entire seat intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dedicated macro close-up of the entire left rear taillight cluster alone integrated into the sculpted rear fender and bumper of the vehicle showing glowing red LED light blades and dark carbon trim, complete lamp intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a dedicated macro close-up of the entire right rear taillight cluster alone integrated into the sculpted rear quarter panel and bumper of the vehicle showing crisp red LED illumination, complete lamp intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up of a complete vented brake rotor and bright acid-yellow caliper installed behind dark wheel spokes with visible tire tread shoulder and wheel arch on the vehicle, entire wheel intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'an intimate macro close-up of taut diagonal stitching across a dark seat belt strap and complete brushed hardware buckle, strictly showing the intact strap and buckle with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up of a complete ultra-luxury lounge seat with perforated dark leather, sculpted headrest contour, and contrast piping installed inside the rear cabin of the vehicle, entire seat intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro close-up of the entire left rear lamp assembly alone flush-mounted in the vehicle bodywork with glowing ruby LED light elements and sleek paintwork, complete lamp intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a tight macro close-up of the entire right rear lamp assembly alone flush-mounted in the vehicle bodywork with sharp glowing red LED contours and dark aero diffuser trim, complete lamp intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a close-up of a complete cobalt-blue painted brake caliper and grooved disc rotor mounted inside the alloy wheel with visible tire rubber and lower bodywork on the car, entire wheel intact with no full car visible',
        placement: 'center'
      },
      {
        text: 'a detailed macro shot of hand-finished diamond stitching on a complete installed luxury car seat bolster beside the door trim inside the vehicle cabin, entire seat intact with no full car visible',
        placement: 'center'
      }
    ])
  },
  {
    id: 'luxury-watches',
    label: 'Luksuzni satovi',
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
        text: 'a complete vintage-inspired bronze diver watch with domed sapphire crystal and full strap inspired by Panerai and Tudor heritage profiles with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete monolithic black DLC-coated mechanical watch with exposed balance wheel and full strap inspired by Rolex and Omega modern tool watches with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete sculptural high-horology wristwatch with double-axis tourbillon and full strap inspired by Jaeger-LeCoultre and Breguet haute horlogerie with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete hand-engraved white-gold minute repeater watch with full strap inspired by Patek Philippe and Vacheron Constantin dress classics with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete sleek sapphire-case ultra-thin mechanical watch with open mainspring barrel and full strap inspired by Cartier and Audemars Piguet contemporary design with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete rectangular art-deco platinum wristwatch with guilloché dial and full strap inspired by Cartier Tank and Jaeger-LeCoultre Reverso geometry with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete grand-complication gold chronograph with exposed column wheel and full strap inspired by Patek Philippe and A. Lange & Söhne watchmaking with zero visible branding or logos',
        placement: 'center'
      }
    ])
  },
  {
    id: 'diamonds-jewelry',
    label: 'Dijamanti i visoki nakit',
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
        text: 'a complete matched set of pear-shaped diamonds arranged cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete bespoke sapphire and platinum ring displayed cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'complete raw gold nuggets and faceted diamonds arranged cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'an entire minimalist geometric diamond bracelet displayed cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete cushion-cut diamond ring set in brushed 18k yellow gold displayed cleanly with zero visible branding or logos',
        placement: 'center'
      },
      {
        text: 'a complete pair of high-jewelry diamond ear cuffs arranged cleanly with zero visible branding or logos',
        placement: 'center'
      }
    ])
  },
  {
    id: 'smoke-and-gold-leaf-mask',
    label: 'Maska od dima i zlatnog listića',
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
      },
      {
        text: 'a complete sculptural mask of dense swirling black and indigo smoke on a human silhouette with fractured 24k gold leaf suspended in the vapor and bright rim separation against a seamless dark charcoal background',
        placement: 'center'
      },
      {
        text: 'a frozen-motion portrait of a human silhouette wearing a complete mask of curling black and indigo smoke trails and suspended 24k gold leaf fragments illuminated by dramatic rim light in a dark charcoal studio setting',
        placement: 'left'
      },
      {
        text: 'an atmospheric studio portrait where a human silhouette wears a complete mask of solid-looking black and indigo smoke swirls with delicate 24k gold leaf pieces suspended in the vapor and strong rim light against dark charcoal',
        placement: 'right'
      },
      {
        text: 'a crisp high-speed portrait of a human silhouette with a complete swirling black and indigo smoke mask and fractured 24k gold leaf suspended in the smoke under dramatic rim lighting against a seamless dark charcoal backdrop',
        placement: 'center'
      },
      {
        text: 'an award-style studio portrait of a human silhouette wearing a complete mask of swirling black and indigo smoke trails with delicate fractured 24k gold leaf suspended within the vapor and bold rim light over a dark charcoal background',
        placement: 'left'
      }
    ])
  },
  {
    id: 'bioluminescent-porcelain-portrait',
    label: 'Bioluminiscentni portret od porcelana',
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
      },
      {
        text: 'a high-contrast head-and-shoulders portrait of a face merging authentic skin texture and fine stray hairs into delicately cracked antique white porcelain with glowing blue bioluminescent veins pulsing just beneath the surface and dark reflective eyes in sharp focus',
        placement: 'center'
      },
      {
        text: 'a low-key head-and-shoulders portrait where rich skin pores and vellus hair transition seamlessly into fine-cracked antique white porcelain with luminous blue bioluminescent veins glowing inside the fractures and dark reflective eyes devoid of emotion in sharp focus',
        placement: 'center'
      },
      {
        text: 'an atmospheric head-and-shoulders face study with detailed natural skin and fine hair blending into cracked antique white porcelain where glowing blue bioluminescent veins pulse beneath the surface and dark reflective eyes remain in sharp focus under moody low-key lighting',
        placement: 'center'
      },
      {
        text: 'a head-and-shoulders portrait transitioning from natural skin pores and delicate vellus hair into cracked antique white porcelain with glowing blue bioluminescent veins pulsing within the cracks and dark reflective eyes in sharp focus against a dark moody setting',
        placement: 'center'
      },
      {
        text: 'a poetic head-and-shoulders face portrait where detailed skin texture and fine hair seamlessly become cracked antique white porcelain with glowing blue bioluminescent veins pulsing beneath the surface and dark reflective eyes in sharp focus under moody low-key light',
        placement: 'center'
      }
    ])
  },
  {
    id: 'human-scale-surrealism',
    label: 'Nadrealizam ljudske skale',
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
      },
      {
        text: 'a precision capture of complete human hands with authentic ridged dermal texture touching a mirror-polished black obsidian surface where dark liquid ripples rise to meet the skin',
        placement: 'center'
      },
      {
        text: 'a serene head-and-shoulders portrait blending lifelike skin pores and subtle facial shadows with a delicate geometric wireframe of warm brass emerging along the jawline',
        placement: 'center'
      },
      {
        text: 'a human-scale surreal upper-body portrait of a neck and shoulders with natural skin warmth and subtle sheen transitioning into smooth frosted glass and fine metallic threads',
        placement: 'center'
      },
      {
        text: 'an intimate profile study of a human head with natural skin texture and fine hair merging with a precision miniature acoustic turbine in dark anodized alloy',
        placement: 'center'
      },
      {
        text: 'a poetic human-scale portrait where lifelike facial features and natural skin micro-texture gradually resolve into layered translucent crystal sheets catching cool directional light',
        placement: 'center'
      }
    ])
  },
  {
    id: 'submerged-venetian-palazzo',
    label: 'Potopljena venecijanska palata',
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
        text: 'a wide cross-section of a flooded Venetian palazzo resting on a rocky seabed with crisp water-line separation between dark wet stone and sun-warmed gold leaf above, as refracted light patterns dance across submerged reliefs and faint murals',
        placement: 'center'
      },
      {
        text: 'a documentary over-under wide study of an entire sunken Venetian Gothic palace showing intricate caustics across submerged carved stone and decaying fresco pigment in deep blue water paired with crumbling gilded facades open to the air above',
        placement: 'center'
      },
      {
        text: 'a wide submerged Venetian Gothic interior cross-section where sun rays pierce clear Mediterranean water to cast shimmering caustics over sculpted stone capitals and weathered frescoes below while aged gilded masonry rises into bright air above',
        placement: 'center'
      },
      {
        text: 'a dramatic over-under wide composition of an entire sunken Venetian palazzo with shimmering light networks on submerged stone carvings and fading frescoes below the surface and crumbling gilded Gothic architecture open to the sky above',
        placement: 'center'
      },
      {
        text: 'a half-submerged Venetian Gothic palazzo completely visible on the seabed with crisp optical contrast between wet carved stone and decaying frescoes in deep blue water below and dry gilded stonework in open air above',
        placement: 'center'
      },
      {
        text: 'a wide cross-section view of an underwater Venetian Gothic hall where shimmering caustics and fine particulate drift across ornate stone carvings and decaying frescoes beneath clear blue water while crumbling gilded architecture rises above',
        placement: 'center'
      },
      {
        text: 'an entire sunken Venetian Gothic palazzo in over-under documentary framing with intricate caustics dancing across carved stone and decaying frescoes underwater and gilded crumbling architecture open to the air above',
        placement: 'center'
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
        text: 'a complete studio study of liquid ferrofluid rising into intricate spiky magnetic field lines with micro-droplets suspended along the tips over a wet obsidian surface against pure black',
        placement: 'center'
      },
      {
        text: 'a complete symmetrical crown of sharp black ferrofluid spikes sculpted by magnetic attraction on a wet obsidian mirror plane, with intense single-source hard light creating bright metallic pinpoints across every peak',
        placement: 'center'
      },
      {
        text: 'a complete asymmetric fractal ferrofluid formation stretching toward a shifting magnetic field on wet obsidian in a pitch-black environment, showing fine liquid tension bridges and mirror-like dark reflections',
        placement: 'center'
      },
      {
        text: 'a complete precision capture of black ferrofluid spikes curving along invisible magnetic field lines above a glossy wet obsidian surface under stark hard lighting and pitch-black background',
        placement: 'center'
      },
      {
        text: 'a complete dynamic wave of black ferrofluid peaks and valleys responding to a strong Neodymium magnet on wet obsidian, framed by crisp metallic highlights and deep black negative space',
        placement: 'center'
      },
      {
        text: 'a complete ultra-detailed ferrofluid sculpture with sharp fractal spikes and wet obsidian reflections in absolute black contrast, lit by a single harsh hard-light beam for dramatic specular brilliance',
        placement: 'center'
      }
    ])
  },
  {
    id: 'frozen-strawberry-micro-scan',
    label: 'Mikro-sken zamrznute jagode',
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
      },
      {
        text: 'a complete cryopreserved strawberry with a delicate web of frost crystals bridging tiny surface pits while directional backlighting highlights ruby-red internal juice pockets and ice micro-fractures',
        placement: 'center'
      },
      {
        text: 'a crisp scientific studio shot of a complete frozen strawberry coated in fine rime ice and sparkling micro-crystals with cool cyan-blue and deep ruby tonal contrast',
        placement: 'center'
      },
      {
        text: 'a single complete frozen strawberry undergoing micro-scan inspection with translucent red cellular chambers glowing under cold directional light and frost needles along its entire contour',
        placement: 'center'
      },
      {
        text: 'a cryogenic studio study of an entire ripe strawberry covered in intricate hoarfrost filaments with razor-sharp focus on frost-dusted achenes and deep red translucent interior detail',
        placement: 'center'
      },
      {
        text: 'a hyper-detailed scan of a complete frozen strawberry in cool blue and deep red tones showing delicate ice crystal geometry, translucent fruit cells, and shallow depth of field',
        placement: 'center'
      }
    ])
  },
  {
    id: 'natgeo-bbc-wildlife',
    label: 'National Geographic i BBC živi svet',
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
        text: 'a full-body snowy owl perched on a frost-covered branch amidst snow-laden pine trees in cold winter haze with soft background bokeh',
        placement: 'right'
      },
      {
        text: 'a full-body musk ox with heavy winter fur standing on frozen snow-covered tundra with breath condensation and distant ice ridges',
        placement: 'center'
      },
      {
        text: 'a full-body herd of wild reindeer crossing deep winter snow across a quiet snowy forest clearing under pale icy sunlight',
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
        text: 'a full-body polar bear emerging from dark icy water onto slick snow-covered ice floes with rim light along its wet white coat',
        placement: 'right'
      },
      {
        text: 'a majestic full-body silverback mountain gorilla resting amidst dense emerald bamboo and misty cloud-forest foliage in Central Africa',
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
        text: 'a complete bioluminescent octopus gliding over dark volcanic seabed formations and delicate deep-sea corals in pitch-dark ocean depths',
        placement: 'left'
      },
      {
        text: 'a full-wingspan great horned owl in mid-flight emerging from dense misty old-growth woodland with crisp feather detail and forest canopy depth',
        placement: 'right'
      }
    ])
  },
  {
    id: 'marine-underwater-life',
    label: 'Podvodni i rečni živi svet',
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
        text: 'a complete full-body European river otter swimming underwater through clear cold river currents with pebbles and aquatic plants below',
        placement: 'right'
      },
      {
        text: 'a complete giant manta ray sweeping its wide wings through open blue ocean water with crisp light rays',
        placement: 'center'
      },
      {
        text: 'a complete full-body beaver swimming beneath the surface of a calm forest river beside submerged roots and stones',
        placement: 'left'
      },
      {
        text: 'a complete Pacific octopus camouflaged along rocky marine reef ledges in crystal-clear underwater light',
        placement: 'right'
      },
      {
        text: 'a complete full-body freshwater river pike suspended calmly in clear green-tinted river water over gravel and reeds',
        placement: 'left'
      },
      {
        text: 'complete translucent moon jellyfish drifting through calm deep marine water with soft natural light diffusion',
        placement: 'right'
      },
      {
        text: 'a complete full-body ancient sturgeon gliding near the rocky bed of a deep wild river under filtered natural light',
        placement: 'left'
      },
      {
        text: 'a school of silver barracudas moving in tight formation through sunlit open sea water',
        placement: 'right'
      },
      {
        text: 'a complete river freshwater turtle swimming past submerged mossy stones in a clear mountain river',
        placement: 'left'
      },
      {
        text: 'a complete full-body leopard seal patrolling icy polar coastal waters beneath dramatic sub-surface light',
        placement: 'right'
      },
      {
        text: 'a complete freshwater crayfish resting on dark river stones amidst gentle underwater current ripples',
        placement: 'center'
      },
      {
        text: 'a complete full-body tiger shark swimming along a steep coral drop-off in deep turquoise ocean water',
        placement: 'left'
      },
      {
        text: 'a complete full-body playful river dolphin gliding through clear warm river water with sun shafts above',
        placement: 'right'
      },
      {
        text: 'a complete red lionfish with ornate venomous dorsal spines hovering above a dark reef ledge in clear tropical water',
        placement: 'left'
      },
      {
        text: 'a complete camouflaged reef stonefish resting motionless on rocky seabed covered in algae and sand in shallow coastal water',
        placement: 'right'
      },
      {
        text: 'a complete small blue-ringed octopus displaying iridescent blue rings across its skin while moving over dark coral rubble in clear water',
        placement: 'center'
      },
      {
        text: 'a complete translucent box jellyfish with delicate trailing tentacles drifting through clear warm marine water with light shafts above',
        placement: 'left'
      },
      {
        text: 'a complete Portuguese man o war with a translucent bluish-violet float and long trailing tentacles suspended near the ocean surface in sunlight',
        placement: 'right'
      },
      {
        text: 'a complete spotted pufferfish swimming calmly above sandy seabed near rocky outcrops in clear blue water',
        placement: 'left'
      },
      {
        text: 'a complete crown-of-thorns starfish with dense spiny arms clinging to dark coral rock in clear reef water',
        placement: 'center'
      },
      {
        text: 'a complete patterned textile cone snail moving slowly across fine sand and shell fragments on the seabed in bright filtered light',
        placement: 'right'
      },
      {
        text: 'a complete spotted scorpionfish perched on encrusted stone along a reef wall with natural shadow and underwater clarity',
        placement: 'left'
      },
      {
        text: 'a complete banded sea snake gliding gracefully through clear coastal water above rocky bottom with sun rays from above',
        placement: 'right'
      },
      {
        text: 'a complete greater weeverfish half-buried in fine sandy seabed with dorsal spines visible in clear shallow water',
        placement: 'center'
      },
      {
        text: 'a school of venomous striped eel catfish swimming tightly near dark reef rocks under natural sub-surface light',
        placement: 'left'
      },
      {
        text: 'a complete flower urchin with dense round venomous pedicellariae resting on rocky seabed in clear water',
        placement: 'center'
      },
      {
        text: 'a complete sharpnose pufferfish hovering near branching corals in sunlit blue water',
        placement: 'right'
      },
      {
        text: 'a complete venomous stingray gliding close to sandy ocean floor with trailing tail in clear water',
        placement: 'left'
      },
      {
        text: 'a complete fireworm with bright feathery white bristles crawling across dark rock and coral rubble in clear water',
        placement: 'right'
      }
    ])
  },
  {
    id: 'underwater-cafes-sunken-worlds',
    label: 'Podvodni kafei i potopljeni svetovi',
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
        text: 'a full-body female diver ascending with rising air bubbles beside a classic curved-glass cafe counter and warm pendant lights with a shipwreck silhouette behind her in glowing amber water',
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
        text: 'a full-body diver observing a submerged vintage cafe interior with warm glass shelves and a sunken galleon mast cutting through golden water and fine marine particles',
        placement: 'right'
      },
      {
        text: 'a full-body diver with rising bubbles floating above a submerged bistro table set with a small cup and glass while an ancient wooden ship rests among coral and shipwreck debris in warm sun-filtered water',
        placement: 'left'
      },
      {
        text: 'a full-body diver approaching a classic cafe facade with warm glowing lamps and bentwood chairs underwater with a massive sunken sailing ship in the background',
        placement: 'right'
      },
      {
        text: 'a full-body diver gliding past a submerged bistro balcony and glowing amber cafe lights with a monumental historic galleon rising through golden underwater haze and small fish',
        placement: 'left'
      },
      {
        text: 'a full-body diver pausing beside a sunken cafe table with warm interior light spilling from a shopfront window as a towering shipwreck looms in golden-lit water',
        placement: 'right'
      }
    ])
  },
  {
    id: 'extreme-weather-sky',
    label: 'Ekstremni vremenski i nebeski fenomeni',
    subjects: wrapSubjects([
      { text: 'towering dark storm clouds with distant lightning bolts illuminating a turbulent deep ocean swell at dusk', placement: 'left' },
      { text: 'vivid emerald and violet northern lights dancing above snow-covered arctic peaks and a frozen fjord', placement: 'right' },
      { text: 'dramatic sunbeams breaking through dense low mist over rugged mountain ridges at sunrise', placement: 'center' },
      { text: 'a massive supercell cloud formation casting deep shadow across wide open plains beneath a glowing amber sky', placement: 'left' },
      { text: 'swirling sea fog rolling over steep coastal cliffs as pale twilight settles across the horizon', placement: 'right' },
      { text: 'a blazing crimson and gold sunset sky reflected across wet tidal flats and calm shallow pools', placement: 'center' },
      { text: 'crisp starlight and milky way bands stretching above dark volcanic highlands in clear mountain air', placement: 'left' },
      { text: 'a complete towering lenticular cloud shaped like a smooth stone disc hovering over a snowy alpine summit', placement: 'center' },
      { text: 'heavy rain squalls sweeping across a wide river valley while warm sunlight catches distant peaks', placement: 'right' },
      { text: 'frost-laden winter clouds drifting past high granite crags under pale blue polar twilight', placement: 'left' }
    ])
  },
  {
    id: 'futuristic-architecture',
    label: 'Futuristička arhitektura i monoliti',
    subjects: wrapSubjects([
      { text: 'a complete cantilevered glass and raw concrete architectural pavilion jutting out from a sheer desert cliff at dusk', placement: 'left' },
      { text: 'an entire monumental dark basalt monolith standing in a vast misty valley with subtle warm light along its seam', placement: 'right' },
      { text: 'a complete sleek curved glass-and-steel observatory perched on a snowy mountain ridge under twilight clouds', placement: 'center' },
      { text: 'an underground architectural courtyard carved into dark stone with a complete circular skylight and reflecting pool', placement: 'center' },
      { text: 'a complete minimalist brutalist concrete gateway framed by tall pines and drifting morning fog', placement: 'right' },
      { text: 'a complete suspended modern glass walkway spanning a deep misty canyon with warm interior light', placement: 'center' },
      { text: 'a complete sculptural smoked-glass residence set on dark volcanic rock beside calm ocean water', placement: 'left' },
      { text: 'an entire towering geometric stone-and-glass tower rising above a low sea of clouds at dawn', placement: 'right' },
      { text: 'a complete isolated minimalist cabin with floor-to-ceiling black steel frames overlooking a quiet alpine lake', placement: 'left' },
      { text: 'a complete monolithic stone amphitheater open to the sky with dramatic long shadows in late afternoon sun', placement: 'center' }
    ])
  },
  {
    id: 'luxury-fragrances-spirits',
    label: 'Luksuzna pića, parfemi i bočice',
    subjects: wrapSubjects([
      { text: 'a complete heavy square glass fragrance bottle with its dark brushed cap resting on raw travertine stone in warm light', placement: 'center' },
      { text: 'a complete crystal decanter pouring deep amber spirit into a full cut-glass tumbler beside dark volcanic rock', placement: 'center' },
      { text: 'a complete minimalist smoked-glass perfume flacon standing on wet dark slate with subtle water reflections', placement: 'center' },
      { text: 'a complete ornate dark glass bottle with warm metallic accents resting on golden desert sand at sunset', placement: 'center' },
      { text: 'a complete hand-blown glass carafe of clear liquid set on honed limestone with crisp shadow lines', placement: 'center' },
      { text: 'a complete dark amber bottle surrounded by mist and moss-covered stone in a quiet woodland setting', placement: 'center' },
      { text: 'a complete sleek architectural glass bottle catching a narrow beam of golden sunlight against charcoal stone', placement: 'center' },
      { text: 'a complete pair of heavy crystal glasses beside an entire dark bottle on a moody wood and stone table', placement: 'center' },
      { text: 'a complete frosted glass fragrance bottle resting on cool marble with soft diffused morning light', placement: 'center' },
      { text: 'a complete vintage-style heavy glass bottle with warm liquid glow set on dark basalt near calm water', placement: 'center' }
    ])
  },
  {
    id: 'ancient-abandoned-sanctuaries',
    label: 'Napušteni i drevni prostori u prirodi',
    subjects: wrapSubjects([
      { text: 'complete weathered stone arches of an ancient ruin overgrown with moss and ferns as shafts of sunlight pierce the mist', placement: 'left' },
      { text: 'an old stone aqueduct stretching across a misty valley with dense forest and quiet river below', placement: 'right' },
      { text: 'a quiet forgotten stone chamber with cracked plaster, tall arched windows, and soft natural daylight', placement: 'center' },
      { text: 'ancient mossy steps winding through a dense misty forest toward a ruined stone terrace', placement: 'left' },
      { text: 'a complete abandoned stone mill beside a rushing mountain stream with wet rocks and autumn leaves', placement: 'right' },
      { text: 'a secluded stone courtyard reclaimed by wild greenery under moody overcast sky light', placement: 'center' },
      { text: 'complete weathered marble columns standing in shallow calm water reflecting soft twilight clouds', placement: 'left' },
      { text: 'an old timber-and-stone cabin interior with dust motes in a single beam of afternoon sun', placement: 'center' },
      { text: 'ruined stone walls overlooking a wide misty mountain gorge at golden hour', placement: 'right' },
      { text: 'a complete quiet ancient stone bridge spanning a clear forest stream surrounded by ferns and mist', placement: 'center' }
    ])
  },
  {
    id: 'night-automotive-urban',
    label: 'Noćni urbani i auto-moto kadrovi',
    subjects: wrapSubjects([
      { text: 'a complete sleek dark sports coupe driving along a wet asphalt road at night with glowing tail lights and street reflections', placement: 'center' },
      { text: 'a complete modern grand tourer parked under warm amber streetlamps on rain-slicked cobblestones after midnight', placement: 'center' },
      { text: 'a complete matte black performance car moving through a misty night highway with crisp headlight beams and wet road sheen', placement: 'center' },
      { text: 'an architectural city avenue at night with wet pavement reflecting warm building lights and clean framing', placement: 'left' },
      { text: 'a complete lone coupe on a coastal night road beside dark ocean waves with subtle light trails on wet asphalt', placement: 'center' },
      { text: 'a moody night street scene with warm shopfront glow, wet stone surfaces, and deep shadow contrast', placement: 'center' },
      { text: 'a complete performance car with glowing rear light bar cruising a quiet mountain pass road under dark night sky', placement: 'center' },
      { text: 'a complete sleek dark sedan resting near illuminated glass architecture at blue-hour nightfall', placement: 'center' },
      { text: 'wet urban crosswalks and dark asphalt reflecting warm amber and cool night lights in light rain', placement: 'right' },
      { text: 'a complete sports car parked along an empty harbor quay at night with calm dark water reflections', placement: 'center' }
    ])
  },
  {
    id: 'nature-seasons-rivers',
    label: 'Priroda: Godišnja doba, planine i reke',
    subjects: wrapSubjects([
      { text: 'a wild mountain river winding through a lush spring valley filled with blooming wildflowers and fresh emerald birch trees beneath snow-capped peaks', placement: 'left' },
      { text: 'a crystal-clear turquoise alpine river carving through sun-drenched summer granite gorges with dense pine forests along the banks', placement: 'right' },
      { text: 'a calm broad autumn river reflecting fiery amber, copper, and crimson foliage beneath misty mountain ridges at dawn', placement: 'center' },
      { text: 'a dark winter river flowing swiftly between snow-draped boulders and frosted evergreen trees at the foot of towering jagged ice-covered mountains', placement: 'left' },
      { text: 'a dramatic jagged mountain peak catching warm alpenglow at sunrise above a mirror-still glacial tarn framed by dark conifers', placement: 'right' },
      { text: 'a cascading mountain waterfall feeding a wide emerald river through a steep canyon in early spring thaw with wet moss-covered rocks', placement: 'center' },
      { text: 'a high-altitude summer meadow dotted with alpine flora overlooking a glacial river valley and distant snow-streaked summits under a deep clear sky', placement: 'left' },
      { text: 'a winding autumn river cutting through golden larch forests and low drifting morning fog against rugged slate mountain slopes', placement: 'right' },
      { text: 'snow-covered high mountain ridges under pale winter twilight with a frozen river bend and crisp blue shadows across fresh powder snow', placement: 'center' },
      { text: 'a wide braided river delta meeting dark coastal cliffs and dramatic mountain peaks as shifting seasonal clouds cast alternating light and shadow', placement: 'left' }
    ])
  },
  {
    id: 'surreal-fantasy-worlds',
    label: 'Nadrealni svetovi i fantazija',
    subjects: wrapSubjects([
      { text: 'an entire grand ancient stone citadel rising above a thick sea of golden-lit clouds with cascading waterfalls pouring off its outer walls', placement: 'center' },
      { text: 'a complete sculpted fire-breathing dragon poised on a carved stone pedestal inside a dim vaulted hall with warm shafts of light through tall windows', placement: 'center' },
      { text: 'a full-body armored warrior standing atop a high rocky mountain cliff holding a glowing sword aloft beneath dramatic storm clouds and jagged peaks', placement: 'left' },
      { text: 'an entire colossal floating island of ancient ruins and waterfalls suspended above misty alpine valleys at dusk', placement: 'center' },
      { text: 'an entire towering bioluminescent ancient tree inside a dark subterranean cavern with glowing mist and stone walkways', placement: 'center' },
      { text: 'a complete solitary lighthouse standing on a jagged basalt rock spire amidst turbulent ocean waves and dramatic sky light', placement: 'right' },
      { text: 'a complete ornate celestial observatory dome perched on a snowy mountain ridge under glowing twilight clouds', placement: 'left' },
      { text: 'a complete monumental stone archway opening onto a glowing golden horizon across a vast misty highland', placement: 'center' },
      { text: 'a sunken cathedral courtyard overgrown with lush greenery where shafts of sunlight pierce through broken arches', placement: 'center' },
      { text: 'an entire giant crystal spire rising from a calm dark mountain lake reflecting warm sunset clouds', placement: 'left' }
    ])
  },
  {
    id: 'unusual-luxury-collisions',
    label: 'Neobični luksuzni sudari',
    subjects: wrapSubjects([
      { text: 'a complete fine mechanical wristwatch resting on a brass stand inside an entire glass bell jar surrounded by delicate glowing butterflies and mossy botanical details', placement: 'center' },
      { text: 'a complete rich dark chocolate bar partially melted into warm golden desert sand dunes under bright low sun with crisp shadows', placement: 'center' },
      { text: 'a complete sleek champagne-gold supercar parked along a winding mountain highway with a complete camera drone hovering above the alpine valley', placement: 'center' },
      { text: 'a complete dark matte supercar speeding along a rain-slicked coastal road at night with glowing tail lights, wet reflections, and a complete drone above', placement: 'center' },
      { text: 'a complete vintage leather-bound book resting on a moss-covered forest log with warm golden light filtering through tall trees', placement: 'center' },
      { text: 'a complete crystal decanter of amber liquid resting on dark volcanic rock beside a calm mountain stream at twilight', placement: 'center' },
      { text: 'a complete minimalist architectural glass pavilion set in the middle of a vast snowy mountain basin at dusk', placement: 'center' },
      { text: 'a complete sculpted metallic timepiece resting on raw desert sandstone beside wind-carved dunes at golden hour', placement: 'center' },
      { text: 'a complete open brass compass and entire fine watch resting on dark wet slate beside a rushing forest waterfall', placement: 'center' },
      { text: 'a complete sleek luxury coupe parked beside a mirror-still autumn mountain lake reflecting golden trees and peaks', placement: 'center' }
    ])
  },
  {
    id: 'cinematic-portraits-glamour',
    label: 'Filmski portreti i glamur',
    subjects: wrapSubjects([
      { text: 'a full-length poised woman with blonde bob hair in a structured crimson satin evening gown standing inside a grand historic hall with crystal chandeliers and warm side light', placement: 'left' },
      { text: 'a three-quarter editorial portrait of a figure in tailored dark wool inside a moody classical gallery with soft window light and rich shadows', placement: 'right' },
      { text: 'a refined three-quarter evening portrait in a candlelit architectural salon with dark velvet drapery, warm rim lighting, and shallow depth of field', placement: 'center' },
      { text: 'a full-length striking editorial figure in a structured emerald silk coat standing before tall arched windows with soft diffused daylight', placement: 'left' },
      { text: 'a three-quarter cinematic portrait inside a minimalist concrete and glass space with dramatic directional light and crisp shadow contrast', placement: 'right' },
      { text: 'a full-length poised subject in classic evening attire beside a grand staircase with warm ambient glow and natural film grain', placement: 'center' },
      { text: 'an atmospheric three-quarter portrait in a dimly lit library with warm lamp light, wood paneling, and subtle lens flare', placement: 'left' },
      { text: 'a three-quarter high-fashion editorial portrait against dark textured plaster with sculpted key light and deep tonal richness', placement: 'right' },
      { text: 'a serene three-quarter portrait near tall misty windows with soft morning light and delicate highlights on fabric and skin', placement: 'center' },
      { text: 'a full-length bold evening portrait in a grand hall with warm chandelier reflections and rich dark shadow tones', placement: 'left' }
    ])
  },
  {
    id: 'unusual-photography',
    label: 'Neobične fotografije',
    subjects: wrapSubjects([
      { text: 'a complete solitary rowboat floating calmly above a sea of dense white clouds between towering snow-dusted mountain peaks', placement: 'left' },
      { text: 'an entire ancient grand piano standing in the middle of a vast salt flat at dusk with a mirror-like reflection of a glowing amber horizon', placement: 'right' },
      { text: 'a complete giant glowing translucent hourglass suspended inside a dark misty redwood forest with golden sand trickling through the glass', placement: 'center' },
      { text: 'a cascade of crystal-clear water pouring out of an entire open vintage leather-bound book resting on a monolithic stone ledge in an arid desert canyon', placement: 'center' },
      { text: 'an entire monumental glass greenhouse suspended above deep turquoise ocean swells under dramatic storm clouds', placement: 'right' },
      { text: 'a complete single luminous full moon rising just above a calm mirror lake framed by tall dark cypress silhouettes', placement: 'center' },
      { text: 'complete sculptural floating monoliths of dark basalt and warm amber light hovering above an endless wind-rippled sand dune', placement: 'left' },
      { text: 'a complete surrealist architectural staircase ascending into a beam of golden sunlight through dense morning fog in a pine forest', placement: 'right' },
      { text: 'a complete vintage brass telescope aimed at a cluster of glowing suspended crystal prisms inside an abandoned brutalist concrete observatory', placement: 'center' },
      { text: 'an entire towering solitary lighthouse built from translucent amber glass standing on a narrow ribbon of black volcanic sand between two calm seas', placement: 'left' }
    ])
  },
  {
    id: 'womens-eyewear',
    label: 'Ženske luksuzne naočare',
    subjects: wrapSubjects([
      { text: 'a complete pair of oversized sculptural black acetate women’s sunglasses with 18k gold temple hardware', placement: 'center' },
      { text: 'a complete pair of avant-garde rimless titanium cat-eye sunglasses with gradient amber lenses', placement: 'center' },
      { text: 'a complete pair of handcrafted Havana tortoiseshell women’s frames with beveled edges and gold hinges', placement: 'center' },
      { text: 'a complete pair of geometric hexagonal gold-wire women’s sunglasses with smoked rose-tinted glass lenses', placement: 'center' },
      { text: 'a complete pair of minimalist white-gold and horn-rimmed luxury women’s optical frames on a stone ledge', placement: 'center' },
      { text: 'a complete pair of bold architectural ivory-acetate women’s sunglasses with subtle polarized reflection', placement: 'center' },
      { text: 'a complete pair of ultra-thin brushed champagne-titanium women’s aviator sunglasses with crystal lenses', placement: 'center' },
      { text: 'a complete pair of sculptural monochrome dark-emerald acetate women’s frames resting beside raw quartz', placement: 'center' },
      { text: 'a complete pair of rounded retro smoked-quartz women’s sunglasses with brushed brass bridge detail', placement: 'center' },
      { text: 'a complete pair of asymmetrical luxury dark-burgundy acetate women’s eyewear on honed travertine', placement: 'center' }
    ])
  },
  {
    id: 'womens-handbags',
    label: 'Ženske luksuzne torbe',
    subjects: wrapSubjects([
      { text: 'an entire structured matte-black box-calfskin women’s top-handle handbag with brushed palladium clasp', placement: 'center' },
      { text: 'an entire exotic emerald-green alligator-embossed leather evening clutch with sculpted gold frame', placement: 'center' },
      { text: 'an entire minimalist warm-taupe full-grain Epsom leather tote bag standing upright on stone', placement: 'center' },
      { text: 'an entire quilted lambskin chain-strap luxury shoulder bag in deep burgundy leather', placement: 'center' },
      { text: 'an entire architectural ivory-white saddle handbag with hand-stitched saddle seams and brass hardware', placement: 'center' },
      { text: 'an entire petite sculptural satin and brushed-gold minaudière evening bag on dark glass', placement: 'center' },
      { text: 'an entire cognac-tan heritage leather weekender handbag with solid unlacquered brass lock', placement: 'center' },
      { text: 'an entire sleek midnight-navy crocodile-grain structured handbag with clean minimalist silhouette', placement: 'center' },
      { text: 'an entire soft cloud-grey suede and smooth-leather bucket bag with gold drawstring hardware', placement: 'center' },
      { text: 'an entire geometric obsidian-leather envelope clutch with brushed silver bar accent', placement: 'center' }
    ])
  },
  {
    id: 'luxury-home-interiors',
    label: 'Luksuzan enterijer kuća',
    subjects: wrapSubjects([
      { text: 'a wide architectural view of a double-height modern penthouse living room with floor-to-ceiling bronze-framed glass, travertine fireplace, and low bouclé seating', placement: 'center' },
      { text: 'a wide architectural view of a minimalist kitchen featuring a monolithic veined Calacatta Viola marble island and smoked-oak cabinetry', placement: 'center' },
      { text: 'a wide architectural view of a serene master bedroom suite with recessed warm cove lighting, raw linen drapery, and a monolithic honed limestone wall', placement: 'center' },
      { text: 'a wide architectural view of a private subterranean wine cellar and tasting lounge framed in backlit smoked glass, blackened steel, and aged walnut', placement: 'center' },
      { text: 'a wide architectural view of a sculptural spa bathroom with a freestanding carved black-basalt soaking tub overlooking an indoor Zen courtyard', placement: 'center' },
      { text: 'a wide architectural view of a grand minimalist foyer with a cantilevered raw-concrete and oak staircase beside a tall indoor olive tree', placement: 'center' },
      { text: 'a wide architectural view of an executive private library with floor-to-ceiling matte walnut shelving, integrated brass reading lamps, and cognac leather lounge chairs', placement: 'center' },
      { text: 'a wide architectural view of an open-concept dining gallery featuring a massive live-edge dark timber table beneath a sculptural alabaster chandelier', placement: 'center' },
      { text: 'a wide architectural view of a quiet listening lounge with custom acoustic timber slats, low modular linen sofa, and smoked glass bar', placement: 'center' },
      { text: 'a wide architectural view of a minimalist courtyard residence gallery with floor-to-ceiling sliding glass doors opening onto a reflecting pool', placement: 'center' }
    ])
  },
  {
    id: 'oceanfront-villas',
    label: 'Luksuzan eksterijer vila na obali okeana',
    subjects: wrapSubjects([
      { text: 'an entire cantilevered white-concrete and glass cliffside modern villa with a zero-edge infinity pool merging into the deep blue ocean', placement: 'center' },
      { text: 'an entire sprawling Mediterranean limestone coastal estate with sunken firepit lounge terraces overlooking dramatic rocky cliffs at sunset', placement: 'center' },
      { text: 'an entire tropical minimalist teak-and-basalt oceanfront villa surrounded by reflection ponds and palm silhouettes above turquoise water', placement: 'center' },
      { text: 'an entire ultra-modern blackened-cedar and floor-to-ceiling glass beach residence perched directly above crashing white ocean waves', placement: 'center' },
      { text: 'an entire multi-level architectural coastal mansion with glowing warm interior lights reflecting across a glassy infinity pool at blue hour', placement: 'center' },
      { text: 'an entire sculptural curved-concrete seaside sanctuary with private stone steps descending into a secluded crystal-clear cove', placement: 'center' },
      { text: 'an entire contemporary coastal pavilion villa with overhanging travertine roofs, outdoor travertine dining deck, and panoramic horizon views', placement: 'center' },
      { text: 'an entire isolated Nordic coastal glass-and-granite villa anchored onto rugged dark sea cliffs facing a calm steel-blue ocean', placement: 'center' },
      { text: 'an entire minimalist sand-stone oceanfront retreat with cantilevered sun deck and dark lap pool overlooking gentle surf', placement: 'center' },
      { text: 'an entire architectural cliffside residence with warm recessed exterior lighting and panoramic glass walls above deep indigo sea', placement: 'center' }
    ])
  },
  {
    id: 'forest-cabins',
    label: 'Luksuzan enterijer koliba u šumi',
    subjects: wrapSubjects([
      { text: 'a wide interior view of an A-frame luxury forest cabin living room with soaring charred-cedar beams, a suspended matte-black fireplace, and panoramic glass framing misty pines', placement: 'center' },
      { text: 'a wide interior view of a cozy ultra-luxury timber-and-stone woodland sanctuary with low shearling armchairs, raw river-stone hearth, and tall moss-covered forest views', placement: 'center' },
      { text: 'a wide interior view of a modern Scandinavian woodland cabin bedroom with warm Douglas-fir paneling, wool throws, and floor-to-ceiling windows looking into snowy spruce trees', placement: 'center' },
      { text: 'a wide interior view of a secluded forest cabin spa lounge featuring a cedar wood-fired sauna, cold plunge stone basin, and rain-streaked glass overlooking dense ferns', placement: 'center' },
      { text: 'a wide interior view of an architectural glass-and-dark-oak forest dining room nestled deep inside an ancient redwood grove during morning fog', placement: 'center' },
      { text: 'a wide interior view of a moody modern mountain-forest loft with dark slate floors, bespoke leather sofa, and warm amber lighting contrasting deep twilight woods', placement: 'center' },
      { text: 'a wide interior view of a minimalist Japanese-inspired forest cabin tea room with tatami-level seating, shoji-screen light diffusion, and open sliding doors to a misty cedar forest', placement: 'center' },
      { text: 'a wide interior view of a luxury woodland hideaway kitchen and lounge crafted from reclaimed dark barn wood, honed soapstone counters, and expansive forest canopy windows', placement: 'center' },
      { text: 'a wide interior view of a warm timber-lined forest cabin reading nook with built-in oak benches, wool blankets, and tall glass overlooking birch trees in mist', placement: 'center' },
      { text: 'a wide interior view of a bespoke mountain-forest cabin living space with raw board-formed concrete hearth, smoked oak beams, and quiet woodland views', placement: 'center' }
    ])
  },
  {
    id: 'aviation-yachts',
    label: 'Avijacija i jahte',
    subjects: wrapSubjects([
      { text: 'a wide interior view of a sleek private jet cabin with hand-stitched cream leather seats', placement: 'center' },
      { text: 'a complete aerodynamic carbon-fiber private aircraft flying above twilight clouds', placement: 'center' },
      { text: 'a wide architectural view of a superyacht aft deck lounge overlooking calm deep-blue Mediterranean water', placement: 'center' },
      { text: 'a wide interior view of a minimalist mega-yacht master suite with panoramic floor-to-ceiling glass', placement: 'center' },
      { text: 'a wide interior view of a supersonic business jet cockpit console with matte dark anodized switches', placement: 'center' },
      { text: 'an entire teak-decked luxury tender yacht cutting through mirror-still morning sea', placement: 'center' },
      { text: 'a wide hangar interior housing an entire matte-silver long-range business jet', placement: 'center' },
      { text: 'a wide view of a cantilevered superyacht glass infinity pool deck at golden hour', placement: 'center' },
      { text: 'a wide interior view of a luxury superyacht salon with brushed bronze accents and panoramic sea windows', placement: 'center' },
      { text: 'an entire long-range private jet cruising above golden cloud tops at dusk', placement: 'center' }
    ])
  },
  {
    id: 'gourmet-culinary',
    label: 'Luksuzna gastronomija',
    subjects: wrapSubjects([
      { text: 'an entire avant-garde Michelin-star dish plated on a complete hand-forged dark stoneware plate', placement: 'center' },
      { text: 'a complete artisanal crystal decanter pouring aged amber spirit into a full glass over hand-carved ice', placement: 'center' },
      { text: 'a complete serving of delicate edible gold leaf and botanical micro-greens on an entire matte black ceramic plate', placement: 'center' },
      { text: 'a complete molecular gastronomy dessert sphere with subtle dry-ice vapor trail on a full dark plate', placement: 'center' },
      { text: 'a complete single-origin espresso extraction into a full double-walled borosilicate glass', placement: 'center' },
      { text: 'a complete aged Japanese Wagyu sear resting on an entire hot volcanic basalt slab', placement: 'center' },
      { text: 'a complete minimalist Nordic seafood plating with translucent sea-foam reduction on a full stoneware dish', placement: 'center' },
      { text: 'a complete vintage crystal coupe glass with clear botanical cocktail on dark marble', placement: 'center' },
      { text: 'a complete hand-crafted dark chocolate tartlet with delicate caramelized glaze on a full slate board', placement: 'center' },
      { text: 'a complete platter of chilled raw oysters arranged on crushed ice and dark volcanic stone', placement: 'center' }
    ])
  },
  {
    id: 'abstract-concepts',
    label: 'Unikatni koncepti',
    subjects: wrapSubjects([
      { text: 'the full-figure physical embodiment of Silence as a towering figure of dark velvet and mist', placement: 'left' },
      { text: 'a full-body lone traveler carrying an intricately caged glowing star across cracked earth', placement: 'right' },
      { text: 'an entire ancient gnarled oak tree fused with precision aged-brass clockwork gears', placement: 'center' },
      { text: 'a full-body majestic stag sculpted entirely from clear spun optical glass in a forest', placement: 'left' },
      { text: 'an entire subterranean metropolis carved inside a colossal amethyst geode', placement: 'center' },
      { text: 'a library of waterfalls with stone reading ledges carved into misty cliffs', placement: 'right' },
      { text: 'a double-exposure urban street merging modern glass towers with 1920s stone', placement: 'center' },
      { text: 'a monumental thundercloud forming a contemplative silhouette over calm sea', placement: 'left' },
      { text: 'a complete suspended sphere of liquid mercury reflecting a quiet desert horizon', placement: 'center' },
      { text: 'a complete monolithic stone archway framing a portal of warm golden twilight', placement: 'right' }
    ])
  },
  {
    id: 'ai-generated',
    label: 'AI Generated',
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
      },
      {
        text: 'an entire futuristic executive desktop AI core crafted from CNC-machined matte black aluminum with parallel cooling vents and an array of angled warm gold-tinted optical glass fins resting on a beveled black marble plinth',
        placement: 'left'
      },
      {
        text: 'a complete high-luxury dark anodized hardware module with precision hex fasteners, a deep obsidian glass display cavity with zero graphics, and glowing amber-gold glass baffles radiating warm light flares on black marble',
        placement: 'center'
      },
      {
        text: 'an entire architectural black metal AI data core crowned with staggered translucent golden-amber glass prisms catching directional studio sunbeams against a dark moody stone and bronze interior',
        placement: 'right'
      },
      {
        text: 'a complete bespoke matte-black and dark-titanium hardware artifact flanked by curved golden-amber optical glass panels with crisp caustic light patterns on a polished dark marble pedestal',
        placement: 'left'
      },
      {
        text: 'an entire ultra-clean industrial-luxury AI compute unit with finned black alloy housing, dark sapphire optical front glass, and luminous golden-amber crystal blades resting intact on a dark Nero Marquina marble surface',
        placement: 'center'
      },
      {
        text: 'a complete precision-engineered dark anodized aluminum optical processor with layered warm amber glass fins refracting golden light rays in a minimalist dark architectural showroom on black marble',
        placement: 'right'
      },
      {
        text: 'an entire minimalist luxury hardware sculpture combining CNC-milled black metal cooling ribs, a deep blue-black optical glass viewport, and edge-glowing golden-amber glass plates on a dark veined marble plinth',
        placement: 'center'
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
  'presented inside a complete ornate lacquer collector chest with a fitted warm amber silk cushion and delicate decorative border with zero text or logos',
  'resting securely on a pleated amber organza and velvet insert inside an entire ornate display box with zero text or logos',
  'displayed inside a complete refined embellished presentation box featuring a soft amber plush lining and precision compartments with zero text or logos',
  'nestled neatly inside its complete dedicated luxury box with rich amber velvet interior and ornamental metal corner detailing with zero text or logos',
  'resting on a fitted amber-toned silk and velvet tray inside a complete ornate collector box with zero text or logos',
  'housed in an entire ornate dark-wood presentation box lined with warm honey-amber velvet and sculpted slots with zero text or logos',
  'displayed cleanly inside its complete matching decorated case with plush amber fabric lining and zero text or logos'
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
  'under soft diffused natural light with clean shadow separation and zero harsh glare',
  'illuminated by volumetric god rays and crepuscular light shafts cutting through subtle atmospheric mist',
  'lit by dramatic Rembrandt chiaroscuro lighting with deep shadow contrast and sculpted highlights',
  'bathed in soft global illumination and natural bounce fill with clean tonal transitions',
  'sculpted by intense rim lighting and golden-hour backlighting with warm atmospheric haze',
  'under moody low-key directional studio lighting with crisp specular reflections on wet surfaces',
  'lit by natural caustic light patterns and underwater volumetric rays with subtle depth falloff'
];

const OPTICS_PROFILES = [
  'Shot on Phase One IQ4 150MP, 80mm lens, f/8, wide clean framing, razor-sharp focal plane, RAW unedited sensor response, micro-contrast preservation, natural organic film grain',
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
  'Shot on Zeiss Otus 55mm f/1.4, ISO 64 fine film grain, ACEScg cinematic bounce, refraction noise-off, razor-sharp focal separation',
  'Shot on Sony A7IV, 35mm f/1.4 lens, editorial realism, crisp bokeh, authentic surface micro-texture, natural low-light grain',
  'Shot on Canon EOS R5, 50mm f/1.8 lens, RAW unedited photo, 1/125s shutter, ISO 100, focus stacking, natural optical depth',
  'Shot on Leica SL2-S, 50mm f/2.0, ISO 3200 real film grain, flicker blend dynamic light, natural highlight roll-off',
  'Shot on Phase One IQ4 150MP backplate, 80mm f/8, high-speed capture, HDR micro-contrast 256-map, uncompressed RAW 16-bit ACEScg',
  'Shot on 35mm film camera, Kodak Vision3 250D, Ektachrome tonal latitude, subtle chromatic aberration, organic lens flare, film grain',
  'Shot on 85mm prime lens, f/2.8, 1/250s shutter, clean full-subject framing, creamy bokeh, sharp focus on subject'
];

const LUXURY_WATCH_META_TOKENS = [
  '[Meta Tokens: Sapphire anti-reflective coating, guilloché dial micro-engraving, brushed grade-5 titanium, tourbillon bridge beveling, crisp specular highlights]',
  '[Meta Tokens: Precious metal micro-grain, domed sapphire refraction, hand-chamfered lugs, warm tonal depth, horological fidelity]',
  '[Meta Tokens: Ceramic bezel gloss, luminous index micro-relief, brushed steel grain, crisp edge contrast, optical realism]',
  '[Meta Tokens: Platinum density sheen, sub-dial micro-texture, gear train reflections, rim light separation, high-horology detail]',
  '[Meta Tokens: Forged carbon weave texture, sapphire crystal clarity, mechanical escapement depth, crisp shadows, studio lighting]',
  '[Meta Tokens: Patinated bronze surface, domed glass distortion, crisp edge bevels, deep tonal contrast, medium-format sharpness]',
  '[Meta Tokens: DLC matte-gloss contrast, oscillating balance wheel, anti-reflective sapphire, clean studio shadows, optical precision]',
  '[Meta Tokens: Guilloché engraving depth, multi-axis cage detail, amber fabric weave, soft specular highlights, optical clarity]',
  '[Meta Tokens: Hand-engraved white gold, amber suede micro-fibers, crisp acoustic hammer detail, natural roll-off, GFX fidelity]',
  '[Meta Tokens: Transparent sapphire case, mainspring coil detail, amber velvet relief, refined highlights, RAW color accuracy]'
];

const META_TOKEN_STACKS = [
  '[Meta Tokens: Volumetric smoke simulation, metallic flakes BRDF, physically based rendering, rim lighting, deep blacks]',
  '[Meta Tokens: Metallic flakes BRDF, volumetric smoke simulation, rim lighting, physically based rendering, deep blacks]',
  '[Meta Tokens: Physically based rendering, metallic flakes BRDF, volumetric smoke simulation, rim lighting, deep blacks]',
  '[Meta Tokens: Rim lighting, volumetric smoke simulation, metallic flakes BRDF, physically based rendering, deep blacks]',
  '[Meta Tokens: Deep blacks, metallic flakes BRDF, volumetric smoke simulation, physically based rendering, rim lighting]',
  '[Meta Tokens: IMG_2098.CR2, uncompressed RAW 16bit ACEScg, phase_shift.refraction_x, lostfilm_realism.v1, HDR_microcontrast_256map]',
  '[Meta Tokens: Hasselblad_X2D_lensmap, ProRes_4444XQ, diffusion_reflectivity_0.98, HDR10+ film still, phaseone_IQ4_backplate]',
  '[Meta Tokens: ACEScg_P3_D65_matrix, exposure_stack_x9_dynamicrange, glass_diffusion.normalpass, subsurface scattering, physically based rendering]',
  '[Meta Tokens: ISO_64_filmgrain, refraction_noiseoff, albedo_subsurface.vfx, micro-fabric_specular_2026, lux_tonecurve.8bit_expansion]',
  '[Meta Tokens: sensor_blood_rawHDR, industrial_bokeh.vfx, heatwave_refract.fx, subsurface scattering, physically based rendering]',
  '[Meta Tokens: CNC anodized black aluminum, golden-amber optical glass caustics, Nero Marquina black marble reflections, volumetric light beams, zero UI text]',
  '[Meta Tokens: Brushed dark alloy heat-sink fins, edge-lit amber crystal refraction, dark sapphire optical glass, architectural chiaroscuro, RAW studio clarity]'
];

const V10_GUARDRAILS =
  'subject completely visible inside frame, no cropped edges, clean commercial composition, zero text, zero typography, zero logos, zero watermarks, zero UI overlays';

const BATCH_LIMIT = 10;
const MAX_PROMPTS = 5000;

function AntigravityField({ pulseTrigger }) {
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
        p.vy = p.vy * 0.96 + (-0.38) * 0.04;

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
  }, [pulseTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-85"
    />
  );
}

export default function V10PromptGenerator() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('luxury-car-parts-brakes-seats-lights');
  const [activePool, setActivePool] = useState([]);
  const [batchOffset, setBatchOffset] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [antigravityStatus, setAntigravityStatus] = useState('');
  const [reactorSurge, setReactorSurge] = useState(false);

  const selectedCategoryObj = useMemo(
    () => CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0],
    [selectedCategoryId]
  );

  const triggerSurge = () => {
    setReactorSurge(true);
    setTimeout(() => setReactorSurge(false), 750);
  };

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
      const unifiedPrompt = `${OPTICS_PROFILES[o]}, editorial ultra-realistic commercial photograph of ${subjObj.text}, ${placementDirective}, ${framingClause}${envPool[e]}, ${LIGHTING_RIGS[l]}, ${metaPool[m]}, ${V10_GUARDRAILS}.`;
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
    triggerSurge();
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
      triggerSurge();
      setBatchOffset(nextOffset);
    }
  };

  const handleDownloadAllFromInput = () => {
    triggerSurge();
    const pool = buildCategoryPrompts(selectedCategoryObj);
    setActivePool(pool);
    triggerDownloadForPool(pool, selectedCategoryObj);
    setAntigravityStatus(`⚡ ANTIGRAVITI EXPORT (${pool.length} PROMPTOVA)`);
    setTimeout(() => setAntigravityStatus(''), 3800);
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
        .ag-levitate {
          animation: agLevitate 4.4s ease-in-out infinite;
        }
        .ag-spin-cw {
          animation: agSpinCW 11s linear infinite;
        }
        .ag-spin-ccw {
          animation: agSpinCCW 7.5s linear infinite;
        }
        .ag-spin-fast {
          animation: agSpinCW 1.4s linear infinite;
        }
        .ag-energy-wave {
          animation: agEnergyWave 5s ease-in-out infinite;
        }
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

      <AntigravityField pulseTrigger={0} />

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
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#182030] border border-amber-400/40 text-amber-300 text-[11px] font-extrabold tracking-[0.18em] uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  PRIVATE VAULT • {HIDDEN_VAULT_ROUTE}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                  FULL-FRAME SAFE • OPTICS-FIRST
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black tracking-tight text-white uppercase leading-tight drop-shadow-[0_4px_24px_rgba(251,191,36,0.16)]">
                VISIONARY FACTORY{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-cyan-300">
                  V10 ANTIGRAVITI
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
                100% IP-SAFE UNBRANDED COMMERCIAL PROMPT REACTOR • Svaka slika je zaštićena od odsecanja ivica (celi subjekti u kadru, pametni centar za bliske objekte). Izaberi kategoriju, skini ceo paket ili lansiraj po 10.
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
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-cyan-300 transition-transform duration-300 ${
                    reactorSurge
                      ? 'scale-125 shadow-[0_0_28px_rgba(34,211,238,0.95)]'
                      : 'shadow-[0_0_18px_rgba(251,191,36,0.8)]'
                  }`}
                />
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-black tracking-widest uppercase">
                    ZERO-G REACTOR
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-bold">
                    FULL-FRAME
                  </span>
                </div>
                <div className="text-slate-200 font-semibold">
                  {CATEGORIES.length} Kategorija • {OPTICS_PROFILES.length} Senzora
                </div>
                <div className="text-[11px] font-mono text-amber-300/90">
                  0.000 G • MAX {MAX_PROMPTS.toLocaleString()} / KAT.
                </div>
              </div>
            </div>
          </header>

          <section className="relative bg-[#0e131d]/95 border border-slate-800/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="v10-category-select"
                  className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-amber-300 to-cyan-400" />
                  Kategorija promptova (1 od {CATEGORIES.length})
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-[#161e2e] border border-slate-700/80 text-[11px] text-slate-300">
                  Subjekata u bazi:{' '}
                  <strong className="text-cyan-300 font-bold">
                    {selectedCategoryObj.subjects.length}
                  </strong>
                </span>
              </div>

              <div className="relative group">
                <select
                  id="v10-category-select"
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
                  {CATEGORIES.map((cat, index) => (
                    <option key={cat.id} value={cat.id} className="bg-[#121722] text-white">
                      {index + 1}. {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              <button
                onClick={handleDownloadAllFromInput}
                className="ag-btn-shimmer md:col-span-5 group relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-r from-cyan-500/25 via-sky-500/25 to-indigo-500/25 hover:from-cyan-400/35 hover:to-indigo-500/35 border border-cyan-400/60 hover:border-cyan-300 text-cyan-100 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_32px_rgba(34,211,238,0.24)] hover:shadow-[0_0_45px_rgba(34,211,238,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)] group-hover:scale-125 transition" />
                <span>
                  {antigravityStatus || '⚡ SVI PROMPTOVI IZ INPUTA (.TXT)'}
                </span>
              </button>

              <button
                onClick={handleGenerate}
                className="ag-btn-shimmer md:col-span-4 relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_35px_rgba(245,158,11,0.38)] hover:shadow-[0_12px_45px_rgba(251,191,36,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>🔥 GENERATE (PO 10)</span>
              </button>

              <div className="md:col-span-3 flex items-stretch gap-2">
                <button
                  onClick={handleNext}
                  disabled={!hasNextBatch}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-4 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase border transition-all duration-200 ${
                    hasNextBatch
                      ? 'bg-[#182030] hover:bg-amber-400/15 border-amber-400/60 hover:border-amber-300 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.18)] hover:-translate-y-0.5 cursor-pointer'
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
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                <span>
                  Aktivno u inputu:{' '}
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
                    od <span className="text-white font-bold">{activePool.length}</span>{' '}
                    {hasNextBatch ? '• Spremno za NEXT (10)' : '• Kraj serije'}
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Reaktor spreman • Izaberi{' '}
                    <strong className="text-cyan-300">SVI PROMPTOVI</strong> ili{' '}
                    <strong className="text-amber-300">GENERATE (PO 10)</strong>
                  </span>
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
                  className="ag-card-enter group bg-[#0e131d]/95 hover:bg-[#141c2b] border border-slate-800/90 hover:border-cyan-400/45 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_14px_40px_rgba(34,211,238,0.14)] hover:-translate-y-0.5 transition-all duration-200"
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
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
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
                    unikatnih promptova u reaktoru
                  </span>

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#182030] hover:bg-amber-400 hover:text-slate-950 border border-amber-400/55 text-amber-300 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.2)] transition cursor-pointer"
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