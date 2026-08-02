// Phase 2 seed dataset for the suburb page network.
// Suburbs extracted from app/brisbane/page.tsx (the site's own service-area copy),
// deduplicated and normalized. Flags resolved conservatively:
//   - "Macgregor" -> "MacGregor" (official gazetted spelling)
//   - "Noosa" -> "Noosa Heads" (gazetted suburb)
//   - "Ipswich CBD" -> "Ipswich" (official locality)
//   - "Brisbane CBD" kept (common search term; not gazetted — official is "Brisbane City")
//   - "Bribie Island" and "Kawana" kept as standalone hub pages (common search terms,
//     not gazetted suburbs) — in addition to the specific suburbs overlapping them
//   - Region assignment follows how the live site markets each suburb (marketing-grouping
//     policy), NOT LGA/council boundaries:
//       - Strathpine/Petrie/Redcliffe/North Lakes/Mango Hill (Moreton Bay LGA) -> brisbane-north
//       - Darra/Oxley/Forest Lake/Richlands (City of Brisbane, listed under Ipswich & Logan) -> ipswich-logan
//       - Karana Downs (Ipswich LGA, listed under Brisbane West) -> brisbane-west
// Coordinates + postcodes are NOT listed here — they are geocoded from a real source
// (Geoapify Geocoding API) by scripts/seed-suburbs.ts.

export interface SuburbSeed {
  name: string;
  region: string;
  regionType: 'inner-city' | 'coastal' | 'outer-suburban';
}

export const SUBURBS_SEED: SuburbSeed[] = [
  // ── Inner City Brisbane (brisbane-city-inner) ────────────────────────
  { name: 'Brisbane CBD', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Fortitude Valley', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'South Brisbane', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'West End', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'New Farm', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Paddington', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Milton', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Toowong', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Indooroopilly', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Taringa', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'St Lucia', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Woolloongabba', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Kangaroo Point', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Teneriffe', region: 'brisbane-city-inner', regionType: 'inner-city' },
  { name: 'Newstead', region: 'brisbane-city-inner', regionType: 'inner-city' },

  // ── Brisbane North (outer-suburban; includes selected Moreton Bay LGA suburbs) ──
  { name: 'Chermside', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Aspley', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Kedron', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Nundah', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Stafford', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Everton Park', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Mitchelton', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Keperra', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Arana Hills', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Albany Creek', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Strathpine', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Petrie', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Redcliffe', region: 'brisbane-north', regionType: 'coastal' },
  { name: 'North Lakes', region: 'brisbane-north', regionType: 'outer-suburban' },
  { name: 'Mango Hill', region: 'brisbane-north', regionType: 'outer-suburban' },

  // ── Brisbane South (outer-suburban) ─────────────────────────────────
  { name: 'Sunnybank', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Calamvale', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Stretton', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Parkinson', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Algester', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Acacia Ridge', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Runcorn', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Eight Mile Plains', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'MacGregor', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Robertson', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Upper Mount Gravatt', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Mount Gravatt', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Holland Park', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Greenslopes', region: 'brisbane-south', regionType: 'outer-suburban' },
  { name: 'Coorparoo', region: 'brisbane-south', regionType: 'outer-suburban' },

  // ── Brisbane East (outer-suburban) ──────────────────────────────────
  { name: 'Carindale', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Carina', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Camp Hill', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Cannon Hill', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Morningside', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Balmoral', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Bulimba', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Hawthorne', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Norman Park', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Seven Hills', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Tingalpa', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Wakerley', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Gumdale', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Ransome', region: 'brisbane-east', regionType: 'outer-suburban' },
  { name: 'Chandler', region: 'brisbane-east', regionType: 'outer-suburban' },

  // ── Brisbane West (outer-suburban) ──
  { name: 'Kenmore', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Chapel Hill', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Fig Tree Pocket', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Jindalee', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Mount Ommaney', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Jamboree Heights', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Middle Park', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Sumner', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Riverhills', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Bellbowrie', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Moggill', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Pullenvale', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Brookfield', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Anstead', region: 'brisbane-west', regionType: 'outer-suburban' },
  { name: 'Karana Downs', region: 'brisbane-west', regionType: 'outer-suburban' },

  // ── Gold Coast (coastal) ────────────────────────────────────────────
  { name: 'Surfers Paradise', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Broadbeach', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Southport', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Robina', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Burleigh Heads', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Coolangatta', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Palm Beach', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Currumbin', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Mermaid Beach', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Miami', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Varsity Lakes', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Mudgeeraba', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Nerang', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Coomera', region: 'gold-coast', regionType: 'coastal' },
  { name: 'Helensvale', region: 'gold-coast', regionType: 'coastal' },

  // ── Sunshine Coast & Moreton Bay (coastal / outer-suburban) ──
  { name: 'Caloundra', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Mooloolaba', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Maroochydore', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Noosa Heads', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },

  // ── Ipswich & Logan (ipswich-logan, outer-suburban) ──────────────────
  { name: 'Ipswich', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Springfield', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Springfield Lakes', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Redbank', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Goodna', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Darra', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Oxley', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Forest Lake', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Richlands', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Logan Central', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Springwood', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Underwood', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Shailer Park', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Loganholme', region: 'ipswich-logan', regionType: 'outer-suburban' },
  { name: 'Browns Plains', region: 'ipswich-logan', regionType: 'outer-suburban' },

  // ── Sunshine Coast & Moreton Bay (continued) ─────────────────────────
  { name: 'Caboolture', region: 'sunshine-coast-moreton-bay', regionType: 'outer-suburban' },
  { name: 'Morayfield', region: 'sunshine-coast-moreton-bay', regionType: 'outer-suburban' },
  { name: 'Narangba', region: 'sunshine-coast-moreton-bay', regionType: 'outer-suburban' },
  { name: 'Burpengary', region: 'sunshine-coast-moreton-bay', regionType: 'outer-suburban' },
  { name: 'Deception Bay', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Sandstone Point', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Beachmere', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Ningi', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Bellara', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Bribie Island', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
  { name: 'Kawana', region: 'sunshine-coast-moreton-bay', regionType: 'coastal' },
];

// ── Copy blocks: 4 intro + 4 local-detail + 6 FAQ pairs per regionType ──
// FAQ questions/answers MUST stay in matched order (q_i, a_i) — the hub page
// pairs them by index.
export const COPY_BLOCKS_SEED: { regionType: string; blockType: string; content: string }[] = [
  // ============ inner-city ============
  { regionType: 'inner-city', blockType: 'intro', content: 'From high-rise apartments to character Queenslanders, we bring professional fabric and carpet cleaning to inner-city homes. We work around body-corporate access rules, tight street parking, and lift timings so your booking is as simple as possible.' },
  { regionType: 'inner-city', blockType: 'intro', content: 'Living in the city means your fabrics work harder — traffic dust, takeaway aromas, and compact living spaces. Our inner-city cleaning service is fast, discreet, and leaves your carpets, sofas, and mattresses fresh without disrupting your routine.' },
  { regionType: 'inner-city', blockType: 'intro', content: 'Inner-city living calls for a smarter clean. We specialise in compact homes and apartments where space is precious — deep-cleaning carpets and upholstery with minimal mess, all arranged around your schedule.' },
  { regionType: 'inner-city', blockType: 'intro', content: 'From Paddington terraces to riverfront towers, our technicians know how to handle the unique challenges of city addresses — restricted parking, security access, and precious weekend downtime — so your fabric care is effortless.' },
  { regionType: 'inner-city', blockType: 'local-detail', content: 'Most inner-city jobs are booked, cleaned, and done within a single visit. Our team works with strata and building managers on access requirements, and we can often arrange the work while you are at the office.' },
  { regionType: 'inner-city', blockType: 'local-detail', content: 'Compact spaces need efficient cleaning. We bring all equipment and water in-house — no heavy hoses across lobbies — and we can prioritise a single room like a bedroom or study when that is all you need.' },
  { regionType: 'inner-city', blockType: 'local-detail', content: 'For apartment dwellers, we offer timed arrival windows to coordinate with lifts, security doors, and body-corporate approval — most bookings are completed inside two hours.' },
  { regionType: 'inner-city', blockType: 'local-detail', content: 'We regularly clean for landlords and property managers across the inner city, handling end-of-tenancy fabric care in apartments and townhouses with zero fuss for tenants.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'Can you access apartments and secure buildings?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'Yes — we regularly clean in apartments and townhouses. Just let us know about body-corporate approval, lift access, or secure parking when you book, and we will arrange the rest.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'Do you need a lot of space or parking?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'No. Our equipment is self-contained and fits in a standard car. We can work with street parking or arrange timed slots for loading zones, and most inner-city jobs use on-site water.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'How long does an apartment clean take?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'Most apartment-size jobs — one or two rooms of carpet or a small sofa — are finished in 1 to 2 hours.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'Can you clean while I am at work?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'Absolutely. We work with strata access and key arrangements, and many clients choose to have us clean during business hours so their weekend stays free.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'Are your products safe in small, enclosed spaces?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'Yes. We use eco-friendly, low-odour solutions that are safe for children and pets, and our extraction leaves surfaces dry enough to use within hours.' },
  { regionType: 'inner-city', blockType: 'faq-question', content: 'Can you handle end-of-lease cleaning for apartments?' },
  { regionType: 'inner-city', blockType: 'faq-answer', content: 'We can — end-of-tenancy fabric cleaning is one of our specialities. We will leave carpets and upholstery inspection-ready, and provide a receipt for your bond claim.' },

  // ============ coastal ============
  { regionType: 'coastal', blockType: 'intro', content: 'Salt air, humidity, and sandy tracks take their toll on coastal fabrics. Our specialists restore carpets, rugs, and upholstery across the coast, lifting salt residue, mould, and odours that inland cleaners often miss.' },
  { regionType: 'coastal', blockType: 'intro', content: 'Life by the beach is amazing — until the sand, humidity, and salt creep into your fabrics. We deep-clean coastal homes with anti-mould treatments that keep carpets and furniture fresher for longer.' },
  { regionType: 'coastal', blockType: 'intro', content: 'Coastal homes face a unique enemy: moisture. We target mould and mildew at the source, then protect your fabrics so they withstand the humidity season after season.' },
  { regionType: 'coastal', blockType: 'intro', content: 'From beachside units to hinterland acreage, our coastal team understands Queensland\u2019s salt-laden climate — and cleans accordingly, with fast-drying methods perfect for humid conditions.' },
  { regionType: 'coastal', blockType: 'local-detail', content: 'Humidity means drying times matter. We use high-powered extraction that leaves carpets dry in 4\u20136 hours — even in the middle of a Queensland summer.' },
  { regionType: 'coastal', blockType: 'local-detail', content: 'Sand and salt are abrasive and can damage carpet fibres over time. Our deep extraction removes embedded grit, protecting the fibres and extending the life of your flooring.' },
  { regionType: 'coastal', blockType: 'local-detail', content: 'Coastal fabrics are prone to mould and mildew in the wet season. We offer targeted anti-microbial treatments that stop the problem from coming back.' },
  { regionType: 'coastal', blockType: 'local-detail', content: 'Outdoor living is part of coastal life — we also clean outdoor furniture, boat seats, and high-traffic entry rugs that bear the brunt of beach days.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'Does salt air actually damage carpets and furniture?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'Yes — salt residue absorbs moisture, which can lead to mould, mildew, and fibre breakdown. Regular deep cleaning removes the salt and protects your fabrics.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'How long do fabrics take to dry in coastal humidity?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'With our high-powered extraction, most carpets dry within 4\u20136 hours even in humid weather. We recommend leaving windows or doors open to help airflow.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'Can you treat mould and mildew on fabrics?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'We can. We apply anti-microbial treatments that kill mould at the source and help prevent regrowth in humid conditions.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'Is your cleaning safe for pets that spend time outdoors?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'Yes — our products are eco-friendly and pet-safe, and they are ideal for homes where dogs and cats track in sand and salt.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'Do you clean outdoor or patio furniture?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'We clean outdoor furniture, entry rugs, and even boat or caravan upholstery — anything that copes with beachside life.' },
  { regionType: 'coastal', blockType: 'faq-question', content: 'How often should coastal homes have fabrics cleaned?' },
  { regionType: 'coastal', blockType: 'faq-answer', content: 'We recommend every 6\u201312 months for most coastal homes, and more often for high-traffic areas or homes near the water that see heavy salt exposure.' },

  // ============ outer-suburban ============
  { regionType: 'outer-suburban', blockType: 'intro', content: 'Bigger homes mean more to clean — and more reason to call in the professionals. We service suburban families across Brisbane\u2019s outer regions with room-by-room fabric cleaning that fits around school runs and busy schedules.' },
  { regionType: 'outer-suburban', blockType: 'intro', content: 'From sprawling family rooms to rumpus rooms that have seen it all, we bring truck-mounted cleaning power to suburban homes, leaving every carpet and couch fresh and family-ready.' },
  { regionType: 'outer-suburban', blockType: 'intro', content: 'Outer-suburban homes deserve the same premium fabric care as the city. We cover the full service area with no travel surcharges on multi-room bookings — just thorough, dependable cleaning.' },
  { regionType: 'outer-suburban', blockType: 'intro', content: 'Kids, pets, and constant use take their toll on suburban fabrics. Our deep-cleaning service restores high-traffic carpets and family sofas, and we are happy to work around nap times and weekend commitments.' },
  { regionType: 'outer-suburban', blockType: 'local-detail', content: 'Multi-room families often book a full-home service: carpets, stairs, lounges, and mattresses in one visit. It saves time and money versus single-item bookings.' },
  { regionType: 'outer-suburban', blockType: 'local-detail', content: 'We regularly clean for families with young children and pets, using pet-safe, low-residue products that leave surfaces ready for crawling, napping, and playtime.' },
  { regionType: 'outer-suburban', blockType: 'local-detail', content: 'Suburban homes often have large rumpus and media rooms that need specialist attention — high-traffic fibres, pet hair, and set-in stains are our bread and butter.' },
  { regionType: 'outer-suburban', blockType: 'local-detail', content: 'Scheduling is flexible: weekend and after-hours appointments are available for busy families, and we will work around school pickups without clock-watching.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'Do you charge extra for travelling to outer suburbs?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'No — there are no hidden travel surcharges for standard bookings across our service area. You will see your quote upfront and that is what you pay.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'Can you clean a whole house in one visit?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'Yes. Most full-home bookings — carpets, stairs, lounges, and mattresses — take 2 to 5 hours depending on the size of the home.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'Are your products safe for babies and pets?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'Our products are eco-friendly, biodegradable, and safe for children and pets — low-residue and low-odour, so the family can get back to normal quickly.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'Can you work around school pickups or nap times?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'Of course. We offer flexible scheduling, including weekends and after-hours, and we will plan the rooms we clean around your routine.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'How do I get an accurate quote for a large home?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'Send us the number of rooms and the general size — we will give you a clear, fixed quote before you book, with no surprises on the day.' },
  { regionType: 'outer-suburban', blockType: 'faq-question', content: 'Do you move furniture like lounges and beds?' },
  { regionType: 'outer-suburban', blockType: 'faq-answer', content: 'We move lightweight furniture and can work around heavier pieces, or arrange them back into place as part of the service — just let us know what you need.' },
];
