import { useState, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f0f2f8; font-family: 'Plus Jakarta Sans', sans-serif; color: #111827; -webkit-font-smoothing: antialiased; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
  @keyframes numberPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
  .fade-up { animation: fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) both; }
  .scale-in { animation: scaleIn 0.35s cubic-bezier(.22,.68,0,1.1) both; }
  .num-pop { animation: numberPop 0.5s cubic-bezier(.22,.68,0,1.2) both; }
  .card-wrap { position: relative; margin-bottom: 10px; }
  .card-side { transition: opacity 0.18s ease, transform 0.22s cubic-bezier(.4,0,.2,1); }
  .card-side.hidden { opacity:0; transform:scale(0.97); pointer-events:none; position:absolute; top:0; left:0; width:100%; }
  .card-side.visible { opacity:1; transform:scale(1); pointer-events:auto; position:relative; }
  .prof-card { transition: all 0.18s ease; cursor: pointer; }
  .prof-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(79,70,229,0.15); border-color: #4f46e5 !important; }
  .prof-card:active { transform: scale(0.97); }
  .tab-btn { transition: all 0.18s; cursor: pointer; border: none; font-family: 'Plus Jakarta Sans', sans-serif; }
  .guide-step { animation: fadeUp 0.3s ease both; }
  input, button { font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
  .stag { display:inline-block; font-size:11px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:0.03em; }
  .hover-lift { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
  .progress-bar { height:4px; background:#e2e5f0; border-radius:99px; overflow:hidden; }
  .progress-fill { height:100%; background:linear-gradient(90deg,#4f46e5,#10b981); border-radius:99px; transition:width 0.5s ease; }
  input:focus { outline: 2px solid #4f46e5; outline-offset: 1px; }
`;

// ─── PROFESSION GROUPS ────────────────────────────────────────────────────────
const GROUPS = [
  {
    id: "healthcare", label: "Healthcare & Allied Health", emoji: "🏥",
    professions: [
      { id: "nurse", label: "Nurse / Midwife", emoji: "🏥" },
      { id: "doctor", label: "Doctor / GP", emoji: "👨‍⚕️" },
      { id: "physio", label: "Physio / OT / Chiro", emoji: "🦴" },
      { id: "paramedic", label: "Paramedic / Ambo", emoji: "🚑" },
      { id: "dentist", label: "Dentist / Dental Nurse", emoji: "🦷" },
    ]
  },
  {
    id: "trades", label: "Trades & Construction", emoji: "🔧",
    professions: [
      { id: "tradie", label: "Tradie (General)", emoji: "🔧" },
      { id: "electrician", label: "Electrician", emoji: "⚡" },
      { id: "plumber", label: "Plumber", emoji: "🪠" },
      { id: "concreter", label: "Concreter / Landscaper", emoji: "🏗️" },
      { id: "truckie", label: "Truck Driver", emoji: "🚛" },
    ]
  },
  {
    id: "community", label: "Care & Community Services", emoji: "🤝",
    professions: [
      { id: "agedcare", label: "Aged Care Worker", emoji: "👴" },
      { id: "cleaner", label: "Cleaner", emoji: "🧹" },
      { id: "security", label: "Security Guard", emoji: "🛡️" },
      { id: "delivery", label: "Delivery Driver", emoji: "📦" },
      { id: "uber", label: "Rideshare Driver", emoji: "🚗" },
    ]
  },
  {
    id: "whitecollar", label: "Professional Services", emoji: "💼",
    professions: [
      { id: "lawyer", label: "Lawyer / Solicitor", emoji: "⚖️" },
      { id: "engineer", label: "Engineer", emoji: "🔩" },
      { id: "hr", label: "HR Professional", emoji: "👥" },
      { id: "developer", label: "Software Developer", emoji: "💻" },
      { id: "accountant", label: "Accountant / Bookkeeper", emoji: "📊" },
    ]
  },
  {
    id: "gig", label: "Creative & Self-Employed", emoji: "🎨",
    professions: [
      { id: "teacher", label: "Teacher / Tutor", emoji: "📚" },
      { id: "creator", label: "Content Creator", emoji: "📱" },
      { id: "photographer", label: "Photographer / Videographer", emoji: "📸" },
      { id: "realestate", label: "Real Estate Agent", emoji: "🏠" },
      { id: "chef", label: "Chef / Cook", emoji: "👨‍🍳" },
    ]
  },
];

const ALL_PROFESSIONS = GROUPS.flatMap(g => g.professions);

// ─── DEDUCTION DATA ───────────────────────────────────────────────────────────
const D = {
  nurse: {
    avgSalary: 80000,
    claimable: [
      { item: "Scrubs & nursing uniforms", value: 300, tag: "Clothing", summary: "Distinctive work uniforms are fully deductible.", scenario: "Sarah buys 3 sets of scrubs at $90 each = $270. Distinct work uniforms — she claims the full $270.", howTo: "Keep receipt. Uniform must be 'distinctive' — employer logo or required specific colour. Plain black pants don't qualify.", watchOut: "Cannot claim plain street clothes even if worn only to work.", docsNeeded: ["Receipt", "Note employer uniform policy if asked"] },
      { item: "Uniform laundry costs", value: 150, tag: "Clothing", summary: "ATO formula: $1 per load — no receipts needed under $150.", scenario: "Tom washes scrubs 3x/week × 48 weeks = 144 loads × $1 = $144. No receipts needed.", howTo: "Use ATO formula: $1/load washing, $1/load if also drying. Keep a simple weekly count in Notes.", watchOut: "Only applies to distinctive uniforms. Cannot claim laundering plain clothes.", docsNeeded: ["Simple weekly tally (notes app is fine)", "No receipts needed under $150"] },
      { item: "Stethoscope & medical equipment", value: 400, tag: "Equipment", summary: "Tools of trade you personally buy are fully deductible.", scenario: "Amira buys a $320 Littmann stethoscope. Employer doesn't provide one. Claims full $320.", howTo: "Keep receipt. Under $300 = instant deduction. Over $300 = depreciate over ATO effective life.", watchOut: "If employer reimburses you — you cannot claim it.", docsNeeded: ["Receipt", "Asset register entry if over $300"] },
      { item: "CPD courses & conferences", value: 500, tag: "Education", summary: "Professional development directly related to your current nursing role.", scenario: "James pays $450 for an ICU upskilling course as an ICU nurse. Directly related — fully deductible.", howTo: "Keep receipt + course description. Key test: maintains or improves skills for your CURRENT job.", watchOut: "Studying law or a completely different field = not deductible.", docsNeeded: ["Receipt/invoice", "Course outline showing relevance"] },
      { item: "ANMF membership fees", value: 200, tag: "Memberships", summary: "Union and professional body fees are fully deductible.", scenario: "ANMF annual fee $190 — claimed in full, no conditions.", howTo: "Get annual tax statement from ANMF (usually emailed in July). Use that exact figure.", watchOut: "None — ANMF is 100% work-related.", docsNeeded: ["Annual tax statement from ANMF"] },
      { item: "Work phone use (portion)", value: 200, tag: "Phone", summary: "Work-use proportion of your phone plan.", scenario: "Priya uses her phone 30% for work. Annual plan $600. Claims 30% = $180.", howTo: "Keep a 4-week usage diary in June. That % applies to the whole year.", watchOut: "Cannot claim 100% on a mixed-use phone.", docsNeeded: ["4-week usage diary", "Annual plan cost or bills"] },
    ],
    conditional: [
      { item: "Home office (67c/hr)", value: 300, tag: "Home Office", summary: "If you do admin or CPD at home, claim 67 cents per hour.", scenario: "Mia does 2hrs/week clinical notes at home. 2 × 48 × $0.67 = $64. Small but real.", howTo: "ATO fixed rate 67c/hr. Keep a time diary — calendar entries count.", watchOut: "Cannot also separately claim internet if using fixed rate.", docsNeeded: ["Time diary showing hours worked at home"] },
      { item: "Travel between work sites", value: 400, tag: "Travel", summary: "Driving between two workplaces in one day — not home to work.", scenario: "Jake works morning at public hospital, afternoon at private clinic. The 15km between sites is deductible. His drive from home is not.", howTo: "Cents per km method: 88c/km (2024-25), up to 5,000km. Keep a simple trip diary.", watchOut: "Home-to-work commute is NEVER deductible. ATO's top audit target.", docsNeeded: ["Trip diary: date, from, to, km, purpose"] },
      { item: "Protective shoes / compression socks", value: 150, tag: "Clothing", summary: "Only if employer specifically requires protective footwear.", scenario: "Hospital policy requires safety-rated closed-toe shoes. Emma buys $140 pair — claimable.", howTo: "Keep receipt. Document the employer's specific requirement.", watchOut: "'Sensible shoes' recommendation ≠ claimable. Must be a specific employer requirement.", docsNeeded: ["Receipt", "Reference to employer policy"] },
    ],
    notClaimable: [
      { item: "Home-to-work commute", reason: "ATO has never allowed this. Your first and last trip each day is personal." },
      { item: "Meals during normal shifts", reason: "Food is a private expense unless you receive and declare an overtime meal allowance." },
      { item: "Personal grooming & cosmetics", reason: "Personal expense regardless of workplace presentation standards." },
      { item: "Gym membership", reason: "Personal expense unless prescribed by a treating practitioner for a workplace injury." },
    ],
  },

  doctor: {
    avgSalary: 180000,
    claimable: [
      { item: "Medical registration (AHPRA)", value: 900, tag: "Memberships", summary: "Annual AHPRA registration is required to practise — fully deductible.", scenario: "GP pays $890 AHPRA annual fee. Claimed in full.", howTo: "Keep AHPRA tax invoice. Claim in year of payment.", watchOut: "Initial registration to enter the profession may not be deductible — renewals are.", docsNeeded: ["AHPRA annual tax invoice"] },
      { item: "Medical indemnity insurance (MIGA, Avant)", value: 3000, tag: "Insurance", summary: "Professional indemnity insurance is a fully deductible work expense.", scenario: "GP pays $2,800 Avant indemnity insurance. Fully deductible as a cost of earning income.", howTo: "Keep annual insurance statement. Claim in full.", watchOut: "If employer pays it — cannot claim it personally.", docsNeeded: ["Annual insurance statement or receipt"] },
      { item: "AMA membership & CPD", value: 1500, tag: "Memberships", summary: "AMA membership and mandatory CPD hours are deductible.", scenario: "AMA fee $1,200 + CPD conference $600. Total $1,800 — claimed in full.", howTo: "Get annual tax statement from AMA. Keep CPD receipts and attendance records.", watchOut: "CPD must relate to current specialty and role.", docsNeeded: ["AMA annual tax statement", "CPD receipts and attendance records"] },
      { item: "Medical journals & reference materials", value: 600, tag: "Education", summary: "Clinical journals and textbooks relevant to your practice.", scenario: "BMJ subscription $280, MIMS online $320. Both directly used in clinical practice — claimed in full.", howTo: "Keep subscription receipts. Must relate to current clinical work.", watchOut: "General interest health reading doesn't qualify — must be clinical reference.", docsNeeded: ["Subscription receipts or annual statements"] },
      { item: "Work phone & internet (portion)", value: 500, tag: "Phone", summary: "Work-use proportion of phone and internet costs.", scenario: "Doctor uses phone 60% for work (on-call, clinical apps, referrals). $1,200/yr plan × 60% = $720.", howTo: "4-week usage diary. Apply % to full year costs.", watchOut: "Must be genuinely proportioned — 100% claim on mixed-use phone is an audit flag.", docsNeeded: ["4-week usage diary", "Annual phone and internet costs"] },
      { item: "Home office (if consulting from home)", value: 800, tag: "Home Office", summary: "Telehealth consultations from home qualify for home office expenses.", scenario: "GP does 3 telehealth sessions/day from home office, 2 days/week. 48hrs/month × 12 × $0.67 = $386.", howTo: "67c/hr ATO fixed rate. Keep time records — calendar entries showing telehealth hours.", watchOut: "Must be genuine work hours. Checking emails on the couch doesn't count.", docsNeeded: ["Time diary showing telehealth/work hours at home"] },
    ],
    conditional: [
      { item: "Specialist equipment (stethoscope, otoscope)", value: 800, tag: "Equipment", summary: "Medical instruments you personally purchase for your practice.", scenario: "Cardiologist buys a $750 digital stethoscope. Not provided by hospital. Claims full amount (under $1,000 instant asset write-off for individuals).", howTo: "Keep receipt. Claim work-use proportion if used in mixed settings.", watchOut: "Hospital-provided equipment cannot be claimed.", docsNeeded: ["Receipt", "Note if equipment is self-funded vs employer-provided"] },
      { item: "Vehicle use (visiting patients/hospitals)", value: 1500, tag: "Travel", summary: "Travel between hospitals, clinics or to visit patients is deductible.", scenario: "GP visits nursing home patients 3 days/week. 12-week logbook shows 40% work use. Annual car costs $14,000 → claims $5,600.", howTo: "12-week logbook for logbook method, or 88c/km for cents per km method.", watchOut: "Home-to-first-clinic is not claimable unless home is your registered principal place of business.", docsNeeded: ["12-week logbook or trip diary", "All car expense receipts if using logbook method"] },
    ],
    notClaimable: [
      { item: "Home-to-clinic commute", reason: "Standard commute rule applies regardless of on-call status." },
      { item: "Personal health insurance", reason: "Private health cover is a personal expense even for medical professionals." },
      { item: "Meals during normal shifts", reason: "Personal expense unless receiving a declared meal allowance." },
    ],
  },

  physio: {
    avgSalary: 85000,
    claimable: [
      { item: "AHPRA registration", value: 400, tag: "Memberships", summary: "Annual registration required to practise — fully deductible.", scenario: "Physio pays $380 annual AHPRA fee. Claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only — initial registration not deductible.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "APA membership & CPD", value: 800, tag: "Memberships", summary: "Australian Physiotherapy Association membership and CPD hours.", scenario: "APA membership $520 + CPD workshop $280. Total $800 — fully claimed.", howTo: "Annual tax statement from APA + CPD receipts.", watchOut: "CPD must relate to current area of practice.", docsNeeded: ["APA tax statement", "CPD course receipts"] },
      { item: "Professional indemnity insurance", value: 600, tag: "Insurance", summary: "Required PI insurance is fully deductible.", scenario: "Annual Avant/Guild PI policy $580. Fully deductible.", howTo: "Keep insurance renewal certificate.", watchOut: "Only if personally paid — employer-provided cover cannot be claimed.", docsNeeded: ["Insurance renewal receipt or certificate"] },
      { item: "Clinical equipment (resistance bands, tools)", value: 400, tag: "Equipment", summary: "Portable clinical equipment you personally buy for patient use.", scenario: "Physio buys resistance bands, massage tools, assessment equipment — $380 self-funded. Claimed in full.", howTo: "Keep receipts. Under $300 per item = instant deduction.", watchOut: "Clinic-provided equipment cannot be claimed personally.", docsNeeded: ["Receipts"] },
      { item: "Clinical textbooks & online subscriptions", value: 350, tag: "Education", summary: "Reference materials directly related to your clinical practice.", scenario: "Musculoskeletal physio subscribes to clinical database $280/yr + buys $95 textbook update. Both claimed.", howTo: "Keep receipts. Must relate to current scope of practice.", watchOut: "General wellness or fitness books don't qualify.", docsNeeded: ["Receipts or subscription history"] },
      { item: "Work uniform (if required)", value: 200, tag: "Clothing", summary: "Clinic-branded polo shirts or required scrubs.", scenario: "Clinic requires branded polo shirts. Physio buys 4 × $45 = $180. Claimed.", howTo: "Keep receipt. Must have employer logo or be a specifically required colour.", watchOut: "Generic coloured shirts without branding generally don't qualify.", docsNeeded: ["Receipt"] },
    ],
    conditional: [
      { item: "Home office", value: 250, tag: "Home Office", summary: "If you write clinical notes or admin at home.", scenario: "Physio writes notes 1.5hrs/day from home on WFH days. 1.5 × 2 days × 48 weeks × $0.67 = $96.", howTo: "67c/hr fixed rate. Keep time diary.", watchOut: "Must be genuine work. ATO may ask for evidence of a dedicated work area.", docsNeeded: ["Time diary"] },
      { item: "Travel between clinics", value: 500, tag: "Travel", summary: "Working across multiple clinic sites — travel between them is claimable.", scenario: "Physio works morning at CBD clinic, afternoon at suburban clinic. 25km between sites × 88c × 200 days = $4,400.", howTo: "Cents per km (88c/km) or logbook method. Keep trip diary.", watchOut: "Home-to-first-clinic is commuting — not claimable.", docsNeeded: ["Trip diary: date, route, km, purpose"] },
    ],
    notClaimable: [
      { item: "Personal gym or Pilates membership", reason: "Personal fitness expense — even if useful for your work." },
      { item: "Home-to-clinic commute", reason: "Standard commute rule applies." },
      { item: "Anatomy or yoga gear for personal use", reason: "Personal items are not deductible even if they inform your clinical knowledge." },
    ],
  },

  paramedic: {
    avgSalary: 85000,
    claimable: [
      { item: "Union fees (ASU/HACSU)", value: 600, tag: "Memberships", summary: "Paramedic union membership is fully deductible.", scenario: "ASU annual fee $560. Claimed in full using annual tax statement.", howTo: "Get annual tax statement from your union in July.", watchOut: "100% work-related — claim in full.", docsNeeded: ["Union annual tax statement"] },
      { item: "AHPRA registration", value: 400, tag: "Memberships", summary: "Required annual registration — fully deductible.", scenario: "$380 AHPRA registration. Claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "Clinical CPD & recertification", value: 500, tag: "Education", summary: "Recertification courses and CPD required to maintain your registration.", scenario: "Paramedic pays $480 for required recertification course. Fully deductible.", howTo: "Keep receipt + course outline showing clinical relevance.", watchOut: "Must relate to current paramedicine role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO laundry formula for compulsory work uniforms.", scenario: "Washes uniform 4x/week × 48 weeks = 192 loads × $1 = $192. Claim $150 (cap without receipts).", howTo: "Keep weekly count. $1/load formula. No receipts needed under $150.", watchOut: "Only if uniform is compulsory and distinctive.", docsNeeded: ["Weekly laundry tally"] },
      { item: "Work boots & safety equipment", value: 300, tag: "Clothing", summary: "Safety-rated footwear and PPE required for the role.", scenario: "Safety boots $180, nitrile gloves (bulk) $45, safety glasses $35. Total $260 — claimed.", howTo: "Keep receipts. Must be safety-rated PPE.", watchOut: "Standard sturdy footwear without safety rating doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "Uses phone 40% for work (crew comms, clinical reference apps). Plan $720/yr × 40% = $288.", howTo: "4-week usage diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed personal/work phone.", docsNeeded: ["4-week usage diary", "Annual phone costs"] },
    ],
    conditional: [
      { item: "Home office", value: 200, tag: "Home Office", summary: "If you write incident reports or admin at home.", scenario: "Paramedic writes 2hrs of incident reports at home per week. 2 × 48 × $0.67 = $64.", howTo: "67c/hr fixed rate. Keep time diary.", watchOut: "Must be genuine required work, not optional.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-station commute", reason: "Standard commute — personal expense regardless of shift length." },
      { item: "Meals during normal shifts", reason: "Personal expense. Only deductible if receiving a declared allowance." },
      { item: "Personal fitness or gym membership", reason: "Even if fitness testing is required, general gym costs are personal unless specifically mandated." },
    ],
  },

  dentist: {
    avgSalary: 140000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Required annual registration — fully deductible.", scenario: "$480 AHPRA registration — claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only — initial registration costs aren't deductible.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "ADA membership & CPD", value: 1200, tag: "Memberships", summary: "Australian Dental Association membership and mandatory CPD.", scenario: "ADA fee $950 + CPD seminar $350. Total $1,300 — fully deductible.", howTo: "Annual tax statement from ADA + CPD receipts.", watchOut: "CPD must relate to current dental practice.", docsNeeded: ["ADA tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 2000, tag: "Insurance", summary: "PI insurance required to practise — fully deductible.", scenario: "Annual MIGA dental PI policy $1,900. Claimed in full.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded — employer-provided cover cannot be claimed.", docsNeeded: ["Insurance receipt or annual statement"] },
      { item: "Dental instruments & equipment", value: 800, tag: "Equipment", summary: "Personal clinical instruments you purchase for your work.", scenario: "Dentist buys a loupe and headlight set ($750) self-funded. Claimed in full (if under $1,000 effective threshold).", howTo: "Keep receipt. Over $300 = depreciate. Under $300 = instant deduction.", watchOut: "Practice-provided equipment cannot be claimed personally.", docsNeeded: ["Receipt", "Asset register for items over $300"] },
      { item: "Clinical journals & reference databases", value: 400, tag: "Education", summary: "Dental journals and clinical reference subscriptions.", scenario: "JADA online subscription $300 + clinical reference app $120. Both claimed.", howTo: "Keep receipts. Must be clinical reference material.", watchOut: "General health or science publications don't qualify.", docsNeeded: ["Subscription receipts"] },
    ],
    conditional: [
      { item: "Home office", value: 300, tag: "Home Office", summary: "Admin, billing or practice management done at home.", scenario: "Practice owner spends 3hrs/week at home on admin. 3 × 48 × $0.67 = $96.", howTo: "67c/hr fixed rate. Time diary required.", watchOut: "Must be genuine required work hours.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal dental treatment", reason: "Your own dental work is personal — even professional courtesy discounts don't make it deductible." },
      { item: "Practice fit-out or equipment (if owner)", reason: "Capital expenses are depreciated by the practice entity, not claimed personally." },
      { item: "Commute to practice", reason: "Standard commute rule applies." },
    ],
  },

  tradie: {
    avgSalary: 90000,
    claimable: [
      { item: "Tools & equipment (under $300 each)", value: 800, tag: "Equipment", summary: "Small tools are instantly deductible in the year purchased.", scenario: "Marco buys a $180 angle grinder, $95 level set and $85 drill bits. All under $300 each — claims $360 immediately.", howTo: "Keep receipts. Each item assessed individually. Must be used for work.", watchOut: "Don't bundle items to avoid $300 threshold. A $350 kit is one $350 item.", docsNeeded: ["Receipt per item"] },
      { item: "Vehicle costs (logbook method)", value: 3000, tag: "Vehicle", summary: "Your biggest deduction — claim the work % of ALL car running costs.", scenario: "Dave (plumber) drives ute to job sites. 12-week logbook: 75% work. Annual car costs $12,000. Claims $9,000.", howTo: "12-week logbook — every trip, work AND personal. Calculate business %. Apply to all car costs for 5 years.", watchOut: "Home to first job site is NOT deductible. Site-to-site is fine.", docsNeeded: ["12-week logbook (all trips)", "All car receipts: fuel, rego, insurance, servicing", "Odometer readings 1 July & 30 June"] },
      { item: "Safety boots & PPE", value: 350, tag: "Clothing", summary: "Safety-rated protective clothing required for work.", scenario: "Site requires steel-caps, hi-vis and safety glasses. Liam buys all three for $310. Fully claimable.", howTo: "Keep receipts. Must be specifically protective — safety-rated.", watchOut: "Regular work clothes don't count even if only worn to work.", docsNeeded: ["Receipts"] },
      { item: "Union fees & trade licence renewal", value: 600, tag: "Memberships", summary: "Trade licence renewals and union fees are fully deductible.", scenario: "Electrical licence $380 + ETU union $420 = $800 claimed.", howTo: "Keep licence renewal receipt. Union sends annual tax statement in July.", watchOut: "Only income-earning portions — trade unions are 100% work-related.", docsNeeded: ["Licence renewal receipt", "Union annual tax statement"] },
      { item: "Sunscreen & sunglasses (outdoor workers)", value: 80, tag: "Health", summary: "Sun protection for outdoor workers — often overlooked.", scenario: "Chris works outdoors 4 days/week. Buys $35 sunscreen + $60 sunglasses. Claims $35 + 80% × $60 = $83.", howTo: "Keep receipts. ATO allows this for workers exposed to sun. Apply work % to sunglasses.", watchOut: "Cannot claim if mostly indoors. Cosmetic SPF in moisturiser doesn't count.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 300, tag: "Phone", summary: "Work-use portion of phone for job comms and quoting.", scenario: "Uses phone 50% for work (client calls, quoting apps). $840/yr × 50% = $420.", howTo: "4-week diary. Apply % to full year costs.", watchOut: "Cannot claim 100% on a mixed-use phone.", docsNeeded: ["4-week diary", "Annual phone costs"] },
    ],
    conditional: [
      { item: "Home office (quotes & admin)", value: 250, tag: "Home Office", summary: "If you do quoting, invoicing or admin at home.", scenario: "Self-employed carpenter spends 3hrs/week at home on quoting. 3 × 48 × $0.67 = $96.", howTo: "67c/hr fixed rate. Must be genuine work — not just checking messages.", watchOut: "PAYG employees rarely qualify unless specifically required to work from home.", docsNeeded: ["Time diary or quote timestamps"] },
      { item: "Overtime meal allowance meals", value: 200, tag: "Meals", summary: "Only if your award pays you a meal allowance you declare as income.", scenario: "Ben's award pays $25 meal allowance for overtime past 7pm. He declares it as income AND claims the meal. They offset.", howTo: "Check payslip for overtime meal allowances. Declare the allowance as income, then claim the meal.", watchOut: "Cannot claim meals during normal shifts. Allowance must be declared as income first.", docsNeeded: ["Payslip showing allowance", "Meal receipt"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "ATO treats your drive to the first job as a commute. Site-to-site is fine." },
      { item: "Tools bought before this job", reason: "Deductions relate to earning your current income." },
      { item: "Traffic fines", reason: "Penalties are explicitly excluded — even during a work trip." },
      { item: "Plain work clothes", reason: "Must be certified PPE or a distinctive uniform with employer branding." },
    ],
  },

  electrician: {
    avgSalary: 95000,
    claimable: [
      { item: "Electrical licence renewal", value: 400, tag: "Licences", summary: "Required electrical licence renewals are fully deductible.", scenario: "Electrician A-grade licence renewal $380 — claimed in full.", howTo: "Keep licence renewal receipt from state licensing body.", watchOut: "Initial training costs to get first licence generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Tools & test equipment", value: 1200, tag: "Equipment", summary: "Multimeters, testers, hand tools — all deductible.", scenario: "Buys Fluke multimeter $380 (depreciated), screwdriver set $85, cable stripper $55. Claims $140 instantly + depreciation on multimeter.", howTo: "Under $300 per item = instant. Over $300 = depreciate. Keep all receipts.", watchOut: "Workshop tools also used for personal projects — must apportion.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vehicle costs (site to site)", value: 3500, tag: "Vehicle", summary: "Driving between job sites in your own vehicle — logbook method.", scenario: "Electrician drives van to various sites. Logbook: 85% work. Van costs $18,000/yr. Claims $15,300.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first site = commute. Not deductible.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety gear & PPE", value: 350, tag: "Clothing", summary: "Safety boots, hi-vis, gloves, safety glasses.", scenario: "Buys safety boots $180, hi-vis shirts $90, insulated gloves $65. Total $335 — claimed.", howTo: "Keep receipts. All items must be safety-rated or required PPE.", watchOut: "Standard clothing worn to work doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "ETU union fees", value: 500, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "ETU annual fee $480. Get annual tax statement.", howTo: "Annual tax statement from ETU in July.", watchOut: "100% work-related — claim in full.", docsNeeded: ["ETU annual tax statement"] },
    ],
    conditional: [
      { item: "Home office (admin/quoting)", value: 200, tag: "Home Office", summary: "Quoting, scheduling and admin done at home.", scenario: "Sole trader electrician spends 4hrs/week on quoting from home. 4 × 48 × $0.67 = $128.", howTo: "67c/hr fixed rate. Keep time log.", watchOut: "PAYG employees need genuine employer requirement to WFH.", docsNeeded: ["Time log or diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute — not deductible even in a work vehicle." },
      { item: "Personal vehicle modifications for aesthetics", reason: "Only functional work modifications are potentially deductible." },
      { item: "Fines and penalties", reason: "Explicitly excluded by ATO." },
    ],
  },

  plumber: {
    avgSalary: 95000,
    claimable: [
      { item: "Plumbing licence renewal", value: 400, tag: "Licences", summary: "Required licence renewals are fully deductible.", scenario: "VIC plumbing licence renewal $360 — claimed in full.", howTo: "Keep receipt from VBA or state licensing body.", watchOut: "Initial licensing training is generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Tools & equipment", value: 1500, tag: "Equipment", summary: "Pipe cutters, wrenches, testing equipment — tools of trade.", scenario: "Buys drain snake $420 (depreciated), pipe cutter $95, thread sealing kit $45. Instant claims $140, depreciates $420.", howTo: "Under $300 = instant. Over $300 = depreciate over effective life.", watchOut: "Tools used for personal home projects — must apportion.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vehicle costs (logbook)", value: 3500, tag: "Vehicle", summary: "Van or ute used for work — claim the work-use % of all costs.", scenario: "Plumber's van: 80% work use. Annual costs $16,000. Claims $12,800.", howTo: "12-week logbook. All trips. Apply business % to full year costs.", watchOut: "Home to first job = commute. Not claimable.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety boots & PPE", value: 300, tag: "Clothing", summary: "Steel caps, gloves, eye protection.", scenario: "Steel cap boots $170, work gloves $45, safety glasses $35. Total $250 — claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular boots or clothing don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Master Plumbers or union fees", value: 500, tag: "Memberships", summary: "Industry association and union fees.", scenario: "Master Plumbers annual fee $460. Claimed from annual tax statement.", howTo: "Annual tax statement from association.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
    ],
    conditional: [
      { item: "Home office", value: 200, tag: "Home Office", summary: "Quoting and admin at home if self-employed.", scenario: "Self-employed plumber spends 3hrs/week on quoting. 3 × 48 × $0.67 = $96.", howTo: "67c/hr. Keep time diary.", watchOut: "PAYG employees need employer requirement to WFH.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute — same as any other worker." },
      { item: "Personal plumbing supplies for home", reason: "Home materials are personal expense." },
      { item: "Fines and penalties", reason: "Explicitly excluded." },
    ],
  },

  concreter: {
    avgSalary: 85000,
    claimable: [
      { item: "Safety boots, kneepads & PPE", value: 400, tag: "Clothing", summary: "Heavy-duty safety equipment required on site.", scenario: "Steel cap boots $190, kneepads $80, safety glasses $35, hi-vis $65. Total $370 — fully claimed.", howTo: "Keep receipts. Must be safety-rated PPE.", watchOut: "Work clothes that aren't certified safety gear don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Tools & equipment", value: 600, tag: "Equipment", summary: "Hand tools and small equipment for concreting or landscaping work.", scenario: "Trowels, floats, edgers — $520 total, all under $300 each. Claimed instantly.", howTo: "Under $300 per item = instant deduction.", watchOut: "Shared tools — apportion for personal use.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 3000, tag: "Vehicle", summary: "Work vehicle use — claim the work % of all costs.", scenario: "Ute 75% work use. Annual costs $14,000. Claims $10,500.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Union fees (CFMEU)", value: 600, tag: "Memberships", summary: "CFMEU or relevant union membership — fully deductible.", scenario: "CFMEU annual fee $560. Claimed from annual tax statement.", howTo: "Annual tax statement from CFMEU.", watchOut: "100% work-related.", docsNeeded: ["CFMEU annual tax statement"] },
      { item: "Sunscreen (outdoor worker)", value: 80, tag: "Health", summary: "Sun protection for outdoor construction workers.", scenario: "Buys SPF 50+ sunscreen regularly — $6/week × 48 weeks = $288. Claims $80 (ATO reasonable amount).", howTo: "Keep receipts. ATO allows this specifically for outdoor workers.", watchOut: "Cannot claim cosmetic sunscreen products.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Home office", value: 150, tag: "Home Office", summary: "Admin done at home if self-employed.", scenario: "Self-employed concreter: 2hrs/week quoting at home. 2 × 48 × $0.67 = $64.", howTo: "67c/hr. Time diary.", watchOut: "Must be genuine work, not just occasional messages.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first site", reason: "Commute is personal." },
      { item: "Meals during day shifts", reason: "Personal expense unless receiving a declared meal allowance." },
      { item: "Traffic fines", reason: "Penalties not deductible." },
    ],
  },

  truckie: {
    avgSalary: 75000,
    claimable: [
      { item: "Heavy vehicle licence & medicals", value: 500, tag: "Licences", summary: "MC/HC licence renewals and mandatory medicals.", scenario: "MC licence renewal $380 + mandatory medical $120 = $500. Both required to work — fully deductible.", howTo: "Keep receipts. Medical must be required for your licence or employer.", watchOut: "Initial training licence costs generally not deductible — only renewals.", docsNeeded: ["Licence renewal receipt", "Medical invoice"] },
      { item: "Safety boots & PPE (hi-vis, gloves)", value: 300, tag: "Clothing", summary: "Required safety gear for your work environment.", scenario: "Steel-cap boots $180, hi-vis shirts $90, gloves $35. Total $305 — claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothes don't qualify.", docsNeeded: ["Receipts"] },
      { item: "TWU union fees", value: 500, tag: "Memberships", summary: "Transport Workers Union membership — fully deductible.", scenario: "TWU annual fee $480 — claimed from annual tax statement.", howTo: "Annual tax statement from TWU in July.", watchOut: "100% work-related.", docsNeeded: ["TWU annual tax statement"] },
      { item: "Overnight meal allowances", value: 1200, tag: "Meals", summary: "Meals on overnight interstate runs — up to ATO reasonable amounts.", scenario: "Dan runs interstate 3 nights/week. ATO reasonable meal amount ~$33/day. 120 overnight nights × $33 = $3,960 claimable.", howTo: "Check ATO's reasonable amounts table annually. Keep receipts for amounts above the threshold.", watchOut: "Day runs with no overnight stay — meals are NOT deductible.", docsNeeded: ["Trip diary showing overnight stays", "Receipts for amounts over ATO reasonable amounts"] },
      { item: "Logbook & compliance tools", value: 150, tag: "Equipment", summary: "Electronic logbook and telematics tools for compliance.", scenario: "Subscriptions to digital logbook app $120/yr. Work-related compliance tool — claimed.", howTo: "Keep subscription receipt.", watchOut: "Only work-related compliance tools.", docsNeeded: ["Subscription receipt"] },
    ],
    conditional: [
      { item: "Owner-operator vehicle costs", value: 5000, tag: "Vehicle", summary: "Complex — fuel, rego, insurance, depreciation on your own truck.", scenario: "Owner-operator with prime mover: fuel $40k, insurance $8k, rego $3k, tyres $6k, depreciation $20k. Potentially $60k+ in deductions.", howTo: "Keep every receipt all year. Logbook required. Separate business and personal use. Strongly recommend a specialist transport accountant.", watchOut: "Extremely complex area. DIY risks leaving thousands on the table and audit exposure.", docsNeeded: ["All expense receipts", "Logbook", "Loan documents if applicable", "Fuel tax credit records"] },
    ],
    notClaimable: [
      { item: "Home to depot commute", reason: "Getting to your starting point each day is personal travel." },
      { item: "Day-run meals", reason: "Only overnight runs qualify for meal deductions." },
      { item: "Traffic fines", reason: "Penalties explicitly excluded." },
    ],
  },

  agedcare: {
    avgSalary: 60000,
    claimable: [
      { item: "Uniform & scrubs", value: 250, tag: "Clothing", summary: "Distinctive aged care uniforms are deductible.", scenario: "Employer requires facility-branded polo shirts. Maria buys 4 × $50 = $200. Claimed.", howTo: "Keep receipt. Must be a distinctive required uniform — not plain everyday clothing.", watchOut: "Plain clothing worn to work doesn't qualify even if employer 'suggests' it.", docsNeeded: ["Receipt", "Reference to employer uniform policy"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula $1/load — no receipts under $150.", scenario: "Washes uniform 4x/week × 48 weeks = 192 loads × $1. Claims $150 (cap without receipts).", howTo: "Weekly count. $1/load formula. No receipts needed under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally (notes app is fine)"] },
      { item: "Union fees (HSU/ANF)", value: 400, tag: "Memberships", summary: "Healthcare union membership — fully deductible.", scenario: "HSU annual fee $380. Annual tax statement from HSU.", howTo: "Annual tax statement from your union in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "First aid & CPR recertification", value: 150, tag: "Education", summary: "Required certifications for aged care work.", scenario: "Annual first aid renewal $140. Required by employer. Fully deductible.", howTo: "Keep receipt from training provider.", watchOut: "Must be required for your role, not optional self-improvement.", docsNeeded: ["Receipt from registered provider"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "Uses phone 25% for work (checking rosters, family liaison). $600/yr × 25% = $150.", howTo: "4-week usage diary.", watchOut: "Honest apportionment — cannot claim 100% on a mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Travel between care facilities", value: 300, tag: "Travel", summary: "If you work across multiple facilities, inter-site travel is claimable.", scenario: "Aged care worker covers two facilities. Drives 12km between sites. 88c × 12km × 200 days = $2,112.", howTo: "Cents per km: 88c/km. Keep trip diary.", watchOut: "Home to first facility = commute. Not deductible.", docsNeeded: ["Trip diary: date, route, km, purpose"] },
    ],
    notClaimable: [
      { item: "Home to facility commute", reason: "Standard commute rule applies." },
      { item: "Meals during shifts", reason: "Personal expense." },
      { item: "Personal grooming", reason: "Not deductible regardless of employer appearance standards." },
    ],
  },

  cleaner: {
    avgSalary: 50000,
    claimable: [
      { item: "Cleaning uniform (if required)", value: 200, tag: "Clothing", summary: "Employer-required distinctive uniform.", scenario: "Cleaning company requires branded polo and pants. Buys 3 sets × $55 = $165. Claimed.", howTo: "Keep receipt. Must be employer-branded or specifically required colour.", watchOut: "Generic black pants or white shirts don't qualify.", docsNeeded: ["Receipt", "Employer uniform policy"] },
      { item: "Safety boots & gloves", value: 150, tag: "Clothing", summary: "Required PPE for commercial cleaning environments.", scenario: "Non-slip boots $110, heavy-duty gloves $35. Total $145 — claimed.", howTo: "Keep receipts. Must be safety-rated or specifically required.", watchOut: "General footwear doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Union fees (UWU/HSU)", value: 300, tag: "Memberships", summary: "Cleaning industry union fees — fully deductible.", scenario: "UWU annual fee $260. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
      { item: "Phone (work portion)", value: 120, tag: "Phone", summary: "Work-use proportion for job scheduling and client comms.", scenario: "Uses phone 20% for work. $600/yr × 20% = $120.", howTo: "4-week diary. Apply % to full year.", watchOut: "Must be honestly proportioned.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Personal cleaning supplies (if self-funded)", value: 200, tag: "Supplies", summary: "If you supply your own cleaning products for client jobs.", scenario: "Independent cleaner buys $180 in cleaning supplies monthly for client jobs — claims the full business-use amount.", howTo: "Keep all receipts. Only claim products used for client work, not personal cleaning.", watchOut: "Employer-supplied products cannot be claimed. Own products only.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Vehicle costs (travelling to client sites)", value: 2000, tag: "Vehicle", summary: "If you travel between client sites in your own car.", scenario: "Independent cleaner visits 5 clients/day. 12-week logbook: 80% work. Annual car costs $10,000. Claims $8,000.", howTo: "12-week logbook method or 88c/km cents per km.", watchOut: "First client of the day from home = commute unless home is your business base.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts"] },
    ],
    notClaimable: [
      { item: "Personal cleaning products at home", reason: "Household cleaning is personal expense." },
      { item: "Home-to-first-client commute", reason: "Standard commute rule applies." },
      { item: "Meals during cleaning shifts", reason: "Personal food expense." },
    ],
  },

  security: {
    avgSalary: 60000,
    claimable: [
      { item: "Security licence renewal", value: 300, tag: "Licences", summary: "Required annual licence renewal — fully deductible.", scenario: "Class 1A security licence renewal $280 — claimed in full.", howTo: "Keep receipt from state licensing body (e.g. Victoria Police, SLED).", watchOut: "Initial licence training costs generally not deductible — only renewals.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Uniform (if required)", value: 250, tag: "Clothing", summary: "Employer-required security uniform.", scenario: "Security company requires navy pants, black shirt and cap with company logo. Buys 2 sets × $90 = $180. Claimed.", howTo: "Keep receipt. Must be distinctive employer-branded uniform.", watchOut: "Plain black clothing not specific to employer doesn't qualify.", docsNeeded: ["Receipt", "Employer uniform requirement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO $1/load formula for compulsory uniforms.", scenario: "Washes uniform 5x/week × 48 weeks = 240 loads × $1. Claims $150 (without receipts cap).", howTo: "Keep weekly tally. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Safety boots", value: 120, tag: "Clothing", summary: "Required safety footwear for security work.", scenario: "Employer requires steel-cap or specific safety-rated boots. $110 — claimed.", howTo: "Keep receipt. Must be specifically required safety footwear.", watchOut: "General black shoes don't qualify unless safety-rated and required.", docsNeeded: ["Receipt"] },
      { item: "Union fees (United Workers/SDA)", value: 300, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "Annual fee $260. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
    ],
    conditional: [
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "If you use your personal phone for work radio communications or reporting.", scenario: "Uses phone 25% for work reporting and comms. $600/yr × 25% = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "Many security jobs provide radios — cannot claim personal phone if employer provides comms device.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    notClaimable: [
      { item: "Personal fitness or gym costs", reason: "Even if physical fitness is expected — personal expense." },
      { item: "Home to work site commute", reason: "Standard commute rule." },
      { item: "Meals during shifts", reason: "Personal expense unless receiving a declared meal allowance." },
    ],
  },

  delivery: {
    avgSalary: 55000,
    claimable: [
      { item: "Vehicle costs (logbook — own car)", value: 3500, tag: "Vehicle", summary: "If you use your own vehicle for deliveries — logbook is essential.", scenario: "Courier uses own car. 12-week logbook: 90% work. Annual car costs $13,000. Claims $11,700.", howTo: "12-week logbook — every trip, work and personal. Apply business % to all car costs.", watchOut: "The biggest claim and the most audited. No logbook = ATO can deny the entire claim.", docsNeeded: ["12-week logbook (all trips)", "All vehicle receipts", "Odometer start and end each year"] },
      { item: "Phone (work portion)", value: 350, tag: "Phone", summary: "Phone used for navigation, delivery apps and customer comms.", scenario: "Uses phone 60% for work (DoorDash app, navigation, customer comms). $720/yr × 60% = $432.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on a mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Insulated delivery bags & equipment", value: 150, tag: "Equipment", summary: "Equipment required to perform your delivery job.", scenario: "Buys insulated bags for food delivery $120 + phone mount $30. Total $150 — claimed.", howTo: "Keep receipts. Must be required for the job.", watchOut: "Personal bags or equipment used for personal purposes not claimable.", docsNeeded: ["Receipts"] },
      { item: "Safety vest & PPE (if required)", value: 80, tag: "Clothing", summary: "Required safety gear for delivery work.", scenario: "Warehouse delivery requires hi-vis vest and safety boots. Buys both for $130 — claimed.", howTo: "Keep receipts. Must be specifically required.", watchOut: "Optional safety gear you choose to wear doesn't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "GST credits on fuel (if ABN registered)", value: 400, tag: "GST", summary: "If you have an ABN and lodge BAS, you can claim GST on fuel.", scenario: "Gig delivery worker registered for GST. Annual fuel $4,000 incl $363 GST. Claims $363 back on BAS.", howTo: "Must be GST registered and lodging BAS. Claim on BAS, not your tax return.", watchOut: "Separate from income tax. Many gig workers miss this entirely.", docsNeeded: ["ABN registration", "BAS lodgements", "Fuel receipts showing GST"] },
    ],
    notClaimable: [
      { item: "Home to first pickup point", reason: "If you start from home each day, that first trip is a commute." },
      { item: "Meals during delivery shifts", reason: "Personal food expense." },
      { item: "Traffic fines", reason: "Penalties explicitly excluded." },
    ],
  },

  uber: {
    avgSalary: 55000,
    claimable: [
      { item: "Vehicle costs (fuel, rego, insurance)", value: 4000, tag: "Vehicle", summary: "Your biggest deduction — work % of ALL running costs via logbook.", scenario: "Raj drives Uber full-time. 12-week logbook: 85% work. Annual car costs $14,000. Claims $11,900.", howTo: "12-week logbook — every trip, work and personal. Apply % to all costs for 5 years.", watchOut: "Without a logbook the ATO can deny your entire vehicle claim.", docsNeeded: ["12-week logbook (all trips — work AND personal)", "All car receipts", "Annual odometer readings 1 July & 30 June"] },
      { item: "Phone plan (work portion)", value: 400, tag: "Phone", summary: "Phone used for Uber app, navigation and passenger comms.", scenario: "Lin's plan $70/month. Uses 70% for Uber. 70% × $840/yr = $588.", howTo: "4-week diary. Apply % to full year costs.", watchOut: "Must be honest. 100% claim on mixed phone is a common audit trigger.", docsNeeded: ["4-week diary", "Annual plan cost"] },
      { item: "Water & mints for passengers", value: 150, tag: "Supplies", summary: "Passenger comfort items are deductible.", scenario: "Spends $12/month on water and mints. $144/yr — fully deductible.", howTo: "Keep supermarket receipts. Note 'Uber passenger supplies'.", watchOut: "Keep it reasonable — lavish gifts won't hold up.", docsNeeded: ["Supermarket receipts"] },
      { item: "Car cleaning (work portion)", value: 300, tag: "Vehicle", summary: "Cleaning costs proportional to work use.", scenario: "Washes car weekly at $15. 85% work use × $780/yr = $663.", howTo: "Apply logbook work % to annual cleaning costs.", watchOut: "Don't claim 100% — apply your logbook percentage.", docsNeeded: ["Receipts", "Apply logbook business %"] },
      { item: "Tolls on work trips", value: 400, tag: "Travel", summary: "Tolls incurred during rideshare trips.", scenario: "CityLink tolls during fares: $8/day × 200 work days = $1,600 in work tolls — fully deductible.", howTo: "Check e-TAG trip history and separate work trips from personal. Keep records.", watchOut: "Personal tolls (your own travel) are not deductible.", docsNeeded: ["e-TAG records or trip receipts", "Work trip identification"] },
    ],
    conditional: [
      { item: "GST credits on fuel", value: 500, tag: "GST", summary: "Rideshare drivers must be GST registered — claim credits on fuel.", scenario: "Annual fuel $5,000 incl $454 GST. Claims $454 back on BAS.", howTo: "Must be registered for GST and lodging BAS quarterly. Claim on BAS.", watchOut: "Separate from your tax return. Missing this is leaving hundreds on the table.", docsNeeded: ["GST registration", "Quarterly BAS lodgements", "Fuel receipts showing GST"] },
    ],
    notClaimable: [
      { item: "Personal car trips", reason: "Only work-use portion is claimable — established by your logbook." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
      { item: "Car loan principal repayments", reason: "Loan principal is not deductible. Interest on the loan may be — see a tax agent." },
    ],
  },

  lawyer: {
    avgSalary: 130000,
    claimable: [
      { item: "Practising certificate renewal", value: 700, tag: "Licences", summary: "Required annual practising certificate — fully deductible.", scenario: "VIC practising certificate renewal $680 — claimed in full.", howTo: "Keep receipt from Law Institute of Victoria or relevant bar association.", watchOut: "Initial admission costs are generally not deductible — only ongoing renewal.", docsNeeded: ["Practising certificate renewal receipt"] },
      { item: "Law Institute / Bar Association membership", value: 800, tag: "Memberships", summary: "Professional body membership — fully deductible.", scenario: "LIV annual membership $750 — claimed using annual tax statement.", howTo: "Annual tax statement from LIV or relevant body.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "CPD points & legal courses", value: 1000, tag: "Education", summary: "Mandatory CPD and practice-area upskilling.", scenario: "Pays $400 for a property law CPD seminar + $650 online course. Both relate to current practice area. Claimed.", howTo: "Keep receipts + course descriptions. Must relate to current practice area.", watchOut: "Studying for a completely different area of law = borderline. Current specialty is safest.", docsNeeded: ["Receipts", "Course outlines"] },
      { item: "Legal databases & subscriptions", value: 1200, tag: "Software", summary: "LexisNexis, Westlaw, Practical Law — if personally subscribed.", scenario: "Personal LexisNexis subscription $1,100/yr for research work. Fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed — not employer-provided.", watchOut: "If employer provides access — cannot claim personal subscription.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH portion)", value: 1000, tag: "Home Office", summary: "Lawyers who WFH or do after-hours work at home.", scenario: "Lawyer works from home 2 days/week + 2hrs/night on matters. ~6hrs/day WFH. 6 × 2 × 48 × $0.67 = $386.", howTo: "67c/hr fixed rate. Time diary. Calendar records of WFH days work.", watchOut: "Cannot separately claim internet or electricity if using fixed rate.", docsNeeded: ["Time diary or WFH calendar records"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Work-use proportion of phone and internet.", scenario: "Uses phone 50% for work. $1,200/yr plan × 50% = $600.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if claiming fixed rate home office method.", docsNeeded: ["4-week diary", "Annual phone/internet cost"] },
    ],
    conditional: [
      { item: "Vehicle costs (court appearances, client visits)", value: 1000, tag: "Travel", summary: "Travel to courts, client sites or other offices — not your main office.", scenario: "Lawyer drives to court 3 days/week. 12-week logbook: 35% work. Annual car costs $12,000. Claims $4,200.", howTo: "Logbook method or 88c/km cents per km.", watchOut: "Home to main office = commute. Office to court = deductible.", docsNeeded: ["Trip diary or 12-week logbook", "Vehicle receipts if logbook method"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule applies even for demanding legal work schedules." },
      { item: "Client entertainment (generally)", reason: "ATO is very strict. Must directly connect to earning specific income." },
      { item: "Bar exams or initial admission", reason: "Costs to enter the profession are not deductible — only ongoing maintenance." },
    ],
  },

  engineer: {
    avgSalary: 110000,
    claimable: [
      { item: "Engineers Australia membership", value: 500, tag: "Memberships", summary: "Professional body membership — fully deductible.", scenario: "Engineers Australia annual fee $480. Claimed using annual tax statement.", howTo: "Annual tax statement from Engineers Australia.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "CPEng or NER registration", value: 300, tag: "Memberships", summary: "Professional registration required for engineering practice.", scenario: "CPEng annual renewal $280 — claimed.", howTo: "Keep renewal receipt.", watchOut: "Initial assessment costs may not be deductible — renewals are.", docsNeeded: ["Renewal receipt"] },
      { item: "Technical CPD & conferences", value: 800, tag: "Education", summary: "Continuing professional development in your engineering discipline.", scenario: "Structural engineer pays $750 for an industry conference and technical workshop. Directly related — claimed.", howTo: "Keep receipts and event descriptions.", watchOut: "Must relate to your current engineering discipline and role.", docsNeeded: ["Receipts", "Event descriptions"] },
      { item: "Technical software subscriptions", value: 600, tag: "Software", summary: "CAD, structural analysis or other work software subscribed personally.", scenario: "Personal AutoCAD subscription $580/yr for after-hours project work. Fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "Engineers who WFH regularly — claim 67c/hr.", scenario: "Civil engineer WFH 3 days/week. 3 × 8 × 48 × $0.67 = $773.", howTo: "67c/hr fixed rate. Time diary or calendar records.", watchOut: "Cannot also claim internet separately.", docsNeeded: ["Time diary or calendar WFH records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion of phone.", scenario: "Uses phone 40% for work. $900/yr × 40% = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment required.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Vehicle costs (site visits)", value: 1500, tag: "Travel", summary: "Travel to construction sites, client locations or inspections.", scenario: "Site engineer visits 3 sites/week. Logbook: 45% work. Annual car costs $12,000. Claims $5,400.", howTo: "12-week logbook or 88c/km method.", watchOut: "Office to site = deductible. Home to office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "PPE for site visits", value: 200, tag: "Clothing", summary: "Safety gear for visiting construction or industrial sites.", scenario: "Hard hat, hi-vis, steel caps required for site visits. Total $180 — claimed.", howTo: "Keep receipts. Must be required for site access.", watchOut: "If employer provides PPE — cannot claim personally.", docsNeeded: ["Receipts"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal software for hobby projects", reason: "Work software only — personal use portion must be excluded." },
      { item: "Initial engineering degree costs", reason: "Costs to enter the profession are not deductible." },
    ],
  },

  hr: {
    avgSalary: 95000,
    claimable: [
      { item: "AHRI membership & CPD", value: 600, tag: "Memberships", summary: "Australian HR Institute membership and professional development.", scenario: "AHRI annual membership $520 + webinar series $180. Total $700 — claimed.", howTo: "Annual tax statement from AHRI + CPD receipts.", watchOut: "Must relate to current HR role.", docsNeeded: ["AHRI tax statement", "CPD receipts"] },
      { item: "HR software & subscriptions", value: 400, tag: "Software", summary: "Personal subscriptions to HR tools or platforms.", scenario: "Personal LinkedIn Learning subscription $240/yr for HR upskilling. Fully deductible.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "HR professionals who WFH regularly.", scenario: "HR Manager WFH 4 days/week. 4 × 8 × 48 × $0.67 = $1,031.", howTo: "67c/hr fixed rate. Time diary.", watchOut: "Cannot also claim internet separately.", docsNeeded: ["Time diary or calendar WFH records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion of phone.", scenario: "Uses phone 40% for work. $900/yr × 40% = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Employment law books & resources", value: 300, tag: "Education", summary: "Work-related legal and HR reference materials.", scenario: "Buys FairWork handbook update $85 + employment law reference $220. Directly work-related — claimed.", howTo: "Keep receipts. Must relate to current HR role.", watchOut: "General management or leadership books are borderline.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Vehicle costs (multi-site HR role)", value: 800, tag: "Travel", summary: "If you travel between company sites or to external meetings.", scenario: "HR Business Partner covers 3 sites. Logbook: 30% work. Annual car costs $11,000. Claims $3,300.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to primary office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal professional coaching", reason: "Personal development for general career growth rather than current role is borderline." },
      { item: "Team events or staff functions (if you organise)", reason: "Organising others' entertainment isn't the same as incurring a deductible work expense." },
    ],
  },

  developer: {
    avgSalary: 120000,
    claimable: [
      { item: "Technical courses & subscriptions", value: 800, tag: "Education", summary: "Udemy, Pluralsight, O'Reilly, conference tickets.", scenario: "Alex: AWS cert course $300 + Pluralsight $200 + dev conference $350 = $850 — all work-relevant.", howTo: "Keep receipts. Must relate to current tech stack or role.", watchOut: "Learning an entirely new field for a career change = not deductible.", docsNeeded: ["Receipts", "Course description if relevance isn't obvious"] },
      { item: "Home office (WFH hours)", value: 1200, tag: "Home Office", summary: "Most devs WFH — your most consistent annual deduction.", scenario: "Full-time WFH dev: 5 days × 8hrs × 48 weeks × $0.67 = $1,285.", howTo: "67c/hr. Time diary or calendar records.", watchOut: "Cannot also claim internet separately if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Software subscriptions (GitHub, Figma, Jira)", value: 600, tag: "Software", summary: "Work tools you personally subscribe to.", scenario: "GitHub Pro $48 + JetBrains $250 + Figma $180 = $478 — fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed for work.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts or annual statements"] },
      { item: "Monitor, keyboard, peripherals", value: 800, tag: "Equipment", summary: "WFH equipment — claim the work-use proportion.", scenario: "Buys $450 monitor (depreciated) + $120 keyboard (instant). 80% work. $96 now + depreciation on monitor.", howTo: "Under $300 = instant. Over $300 = depreciate. Apply work-use %.", watchOut: "Gaming peripherals or items also used personally — must apportion.", docsNeeded: ["Receipts", "Work-use % calculation"] },
      { item: "Phone & internet (work portion)", value: 600, tag: "Phone", summary: "Work-use portion of phone and internet.", scenario: "Uses phone 50% for work + internet 60% for work. Separate diary for each.", howTo: "4-week diary for phone. If NOT using fixed rate — also claim internet separately.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual phone and internet costs"] },
    ],
    conditional: [
      { item: "Laptop or computer", value: 1000, tag: "Equipment", summary: "Work portion of personal computer.", scenario: "Jamie's MacBook $2,400. 70% work. $1,680 deductible — depreciated over 2 years = ~$840/yr.", howTo: "Calculate honest work-use %. Depreciate over effective life (2-3 years for laptops).", watchOut: "Claiming 100% on a laptop used for Netflix and gaming = audit flag.", docsNeeded: ["Receipt", "Work-use % with brief diary"] },
    ],
    notClaimable: [
      { item: "Personal streaming (Netflix, Spotify)", reason: "Not deductible even as background music while coding." },
      { item: "Home internet if claiming fixed rate", reason: "The 67c/hr fixed rate already includes internet — can't claim it twice." },
      { item: "Gaming equipment", reason: "Unless you're a professional game developer and it's specifically required." },
    ],
  },

  accountant: {
    avgSalary: 90000,
    claimable: [
      { item: "CPA / CA ANZ membership & CPD", value: 1200, tag: "Memberships", summary: "Professional body membership and mandatory CPD.", scenario: "CPA annual fee $890 + CPD course $350 = $1,240 — claimed.", howTo: "Annual tax statement from CPA or CA ANZ. CPD receipts.", watchOut: "CPD must relate to current accounting role.", docsNeeded: ["Annual tax statement", "CPD receipts"] },
      { item: "TPB registration (tax agents)", value: 300, tag: "Memberships", summary: "Tax Practitioners Board registration — required to give tax advice.", scenario: "$280 TPB annual renewal — claimed in full.", howTo: "Keep TPB renewal receipt.", watchOut: "Only for registered tax agents.", docsNeeded: ["TPB renewal receipt"] },
      { item: "Accounting software subscriptions", value: 500, tag: "Software", summary: "Work software personally subscribed to.", scenario: "Personal Xero $480 + Tax Act $340 — both work-related, both claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed personally.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional journals & resources", value: 300, tag: "Education", summary: "Technical accounting and tax publications.", scenario: "CCH online $280 + Tax Institute webinars $180. Claimed.", howTo: "Keep receipts. Must relate to current accounting work.", watchOut: "General finance or investment reading doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Home office (WFH hours)", value: 800, tag: "Home Office", summary: "WFH accountants — 67c/hr adds up.", scenario: "Full-time WFH: 5 × 8 × 48 × $0.67 = $1,285.", howTo: "67c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use portion.", scenario: "40% work use on $900/yr plan = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Client travel", value: 600, tag: "Travel", summary: "Driving to client sites or ATO offices.", scenario: "Travels to 2 client offices/week. Logbook: 40% work. Annual car costs $10,000. Claims $4,000.", howTo: "12-week logbook or 88c/km.", watchOut: "Office to client = deductible. Home to office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict. Must directly connect to earning specific income." },
      { item: "Personal investing education", reason: "Must relate to your current accounting role, not personal wealth-building." },
    ],
  },

  teacher: {
    avgSalary: 85000,
    claimable: [
      { item: "Classroom supplies (self-funded)", value: 300, tag: "Supplies", summary: "Resources bought out of pocket for students.", scenario: "Emma spends $280 on books, markers and printed worksheets. School doesn't reimburse. Claims $280.", howTo: "Keep receipts. Only claim what employer hasn't reimbursed.", watchOut: "If your school has a supply budget and you chose not to use it — risky.", docsNeeded: ["Receipts", "Note that employer did not reimburse"] },
      { item: "VIT registration or state equivalent", value: 200, tag: "Memberships", summary: "Required teaching registration — fully deductible.", scenario: "VIT fee $195. Claimed in full.", howTo: "Keep VIT tax invoice.", watchOut: "Renewals only.", docsNeeded: ["VIT tax invoice"] },
      { item: "Union fees (AEU/IEU)", value: 400, tag: "Memberships", summary: "Teaching union fees — fully deductible.", scenario: "AEU annual fee $380. Annual tax statement claimed.", howTo: "Annual tax statement from union in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Work-related books & teaching resources", value: 250, tag: "Education", summary: "Subject-specific books and curriculum resources.", scenario: "Science teacher buys $65 textbook + $120/yr curriculum platform subscription. Both claimed.", howTo: "Keep receipts. Must relate to your current teaching subjects.", watchOut: "General education theory books are borderline.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion for parent/school comms.", scenario: "Uses phone 25% for work. $720/yr × 25% = $180.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Home office (marking & lesson planning)", value: 400, tag: "Home Office", summary: "Most teachers genuinely WFH — don't leave this unclaimed.", scenario: "Michael marks 2hrs/night × 4 nights × 40 term weeks × $0.67 = $214.", howTo: "67c/hr fixed rate. Time diary — calendar entries count.", watchOut: "Must be genuine work hours, not just being 'available'.", docsNeeded: ["Time diary or calendar entries"] },
      { item: "Laptop or tablet (work portion)", value: 500, tag: "Equipment", summary: "Personal device used for teaching prep — claim work-use proportion.", scenario: "Rachel uses laptop 60% for work. Laptop cost $1,200. Claims $720 over 3 years = $240/yr.", howTo: "Calculate honest work-use %. Depreciate over effective life.", watchOut: "If school provides a device — must show why personal device is also necessary.", docsNeeded: ["Receipt", "Work-use % calculation"] },
    ],
    notClaimable: [
      { item: "Childcare costs", reason: "Personal family expense regardless of working hours." },
      { item: "Home-to-school commute", reason: "Standard commute rule." },
      { item: "Gifts to students", reason: "Not deductible even when bought from your own pocket." },
    ],
  },

  creator: {
    avgSalary: 60000,
    claimable: [
      { item: "Camera, lighting & studio equipment", value: 2000, tag: "Equipment", summary: "Production equipment used to create content — your main deduction.", scenario: "Buys mirrorless camera $1,800 (depreciated), ring light $150 (instant), tripod $95 (instant). Claims $245 now + depreciates camera.", howTo: "Under $300 per item = instant. Over $300 = depreciate. Must be used for content creation.", watchOut: "Camera also used for personal holidays — must apportion honestly.", docsNeeded: ["Receipts", "Asset register for items over $300", "Work-use % calculation"] },
      { item: "Software subscriptions (Adobe, Canva Pro)", value: 600, tag: "Software", summary: "Editing and design software for content production.", scenario: "Adobe Creative Cloud $660/yr + Canva Pro $180/yr = $840. Both used for content creation — claimed.", howTo: "Keep subscription receipts. Personal editing for fun must be excluded.", watchOut: "Apportion if used for personal creative projects too.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office / studio space", value: 800, tag: "Home Office", summary: "Dedicated studio or home office for content creation.", scenario: "Content creator uses dedicated room as studio. 67c/hr × 6hrs/day × 5 days × 48 weeks = $965. OR actual costs method if room is exclusively used.", howTo: "Fixed rate 67c/hr OR if room is exclusive to business — claim actual proportion of rent/utilities.", watchOut: "Room must be genuinely dedicated to work. Dual-use room = fixed rate only.", docsNeeded: ["Time diary", "If exclusive: rent/mortgage and utility bills"] },
      { item: "Platform fees & subscriptions", value: 300, tag: "Software", summary: "Scheduling tools, analytics platforms, creator tools.", scenario: "Hootsuite $360/yr + TubeBuddy $120/yr. Both business tools — claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal social media use cannot be included.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Phone and internet used for content creation and posting.", scenario: "Creator uses phone 70% for work. $900/yr plan × 70% = $630. Internet 60% work = $720 × 60% = $432.", howTo: "4-week diary for phone. If NOT using fixed rate home office — also claim internet separately.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Props, wardrobe & set items", value: 500, tag: "Supplies", summary: "Items purchased specifically for use in content — not personal use.", scenario: "Fashion creator buys $400 in outfits exclusively used for sponsored content shoots. Fully deductible.", howTo: "Keep receipts. Must be exclusively or predominantly for content creation, not personal use.", watchOut: "Clothing you also wear personally = cannot claim. Exclusive content props = fine.", docsNeeded: ["Receipts", "Note that items are exclusively for content"] },
      { item: "Travel for content (locations, events)", value: 600, tag: "Travel", summary: "Travel to shooting locations or industry events — if primarily work.", scenario: "Travel blogger travels interstate to create destination content. Airfare $350 + accommodation $280. Primary purpose = work. Claimed.", howTo: "Primary purpose of the trip must be content creation. Keep all receipts.", watchOut: "Mixing a holiday with content creation — ATO may apportion or deny. Document the work purpose clearly.", docsNeeded: ["All receipts", "Evidence of work purpose (shooting schedule, brand brief)"] },
    ],
    notClaimable: [
      { item: "Personal clothing for everyday wear", reason: "Must be exclusively for content — cannot claim clothes also worn personally." },
      { item: "Meals and entertainment (generally)", reason: "Personal expense unless specifically required for content (e.g. food reviewer — even then, strict rules apply)." },
      { item: "Personal Netflix or streaming for 'research'", reason: "ATO does not accept personal entertainment as a research deduction." },
    ],
  },

  photographer: {
    avgSalary: 65000,
    claimable: [
      { item: "Camera bodies & lenses", value: 2500, tag: "Equipment", summary: "Core professional equipment — your biggest deduction.", scenario: "Buys Sony A7 body $2,800 (depreciated over 3 years = $933/yr) + 50mm lens $600 (depreciated). Both used professionally.", howTo: "Over $300 = depreciate over effective life. Keep all receipts. Apply work-use % if mixed personal use.", watchOut: "Equipment also used for personal photography — must apportion honestly.", docsNeeded: ["Receipts", "Asset register", "Work-use % calculation"] },
      { item: "Editing software (Adobe, Capture One)", value: 700, tag: "Software", summary: "Post-production software subscriptions.", scenario: "Adobe Photography Plan $240/yr + Capture One $250/yr = $490. Both work tools — claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal hobby editing must be excluded from the claim.", docsNeeded: ["Subscription receipts"] },
      { item: "Photography accessories (bags, tripods, lighting)", value: 600, tag: "Equipment", summary: "Professional accessories under $300 each — instant deductions.", scenario: "Camera bag $180, portable flash $220, memory cards $85. All under $300 — claimed instantly.", howTo: "Under $300 per item = instant deduction. Keep receipts.", watchOut: "Personal accessories (used for holidays) must be excluded.", docsNeeded: ["Receipts"] },
      { item: "Website & portfolio hosting", value: 300, tag: "Software", summary: "Professional website and portfolio to attract clients.", scenario: "Squarespace business plan $240/yr + domain $25/yr = $265. Business tool — claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal website not used to attract clients doesn't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional indemnity insurance", value: 400, tag: "Insurance", summary: "PI insurance for professional photography work.", scenario: "Annual PI policy $380 — claimed in full.", howTo: "Keep insurance receipt or certificate.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Client comms, social media marketing, work-use proportion.", scenario: "Uses phone 50% for work. $900/yr × 50% = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Vehicle costs (to shooting locations)", value: 1500, tag: "Travel", summary: "Driving to client shoots, weddings, events.", scenario: "Wedding photographer drives to 60 weddings/year + scouting. Logbook: 55% work. Annual car costs $10,000. Claims $5,500.", howTo: "12-week logbook or 88c/km method.", watchOut: "Home to first client = commute unless home is registered business address.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook method"] },
      { item: "Wardrobe for professional shoots", value: 300, tag: "Clothing", summary: "Professional attire required for high-end client work.", scenario: "Wedding photographer buys black suit specifically for weddings ($380). Depreciated over 3 years if claiming work-use %.", howTo: "Must be specifically required for professional shoots, not everyday wear. Document work purpose.", watchOut: "Borderline — ATO may challenge clothing that can be worn personally.", docsNeeded: ["Receipt", "Note that item is exclusively for professional shoots"] },
    ],
    notClaimable: [
      { item: "Equipment used for personal hobby photography", reason: "Must apportion work and personal use. Purely personal photography equipment is not deductible." },
      { item: "Home-to-studio commute", reason: "Standard commute rule if studio is separate from home." },
      { item: "Personal travel with incidental photography", reason: "The primary purpose must be work. Personal travel where you happen to take photos doesn't qualify." },
    ],
  },

  realestate: {
    avgSalary: 95000,
    claimable: [
      { item: "Real estate licence & renewal fees", value: 500, tag: "Licences", summary: "Required licence renewals — fully deductible.", scenario: "CPV licence renewal $450 — claimed in full.", howTo: "Keep receipt from Consumer Affairs VIC or state equivalent.", watchOut: "Initial licence training costs generally not deductible — renewals are.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Vehicle costs (open homes, client visits)", value: 3500, tag: "Vehicle", summary: "Driving to properties and client meetings — your biggest deduction.", scenario: "Mia drives 28,000km/yr. Logbook: 80% work. Annual car costs $15,000. Claims $12,000.", howTo: "12-week logbook. Every trip. Apply business % to all running costs.", watchOut: "Office to property = fine. Home to office = commute.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "REIV membership", value: 600, tag: "Memberships", summary: "Real Estate Institute membership — fully deductible.", scenario: "REIV annual fee $580. Claimed from annual tax statement.", howTo: "Annual tax statement from REIV.", watchOut: "100% work-related.", docsNeeded: ["REIV annual tax statement"] },
      { item: "Personal brand marketing", value: 800, tag: "Marketing", summary: "Self-funded advertising for your personal agent brand.", scenario: "Tom: $600 letterbox drops + $250 professional headshot. Both build his personal brand — claimed.", howTo: "Keep receipts. Must be YOUR marketing, not the agency's.", watchOut: "Agency-paid marketing doesn't count as your personal expense.", docsNeeded: ["Receipts with description"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Heavy phone use for client comms — claim work portion.", scenario: "Uses phone 65% for work. $1,200/yr × 65% = $780.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual phone and internet costs"] },
      { item: "CPD & courses", value: 600, tag: "Education", summary: "Mandatory CPD and property-related upskilling.", scenario: "CPD seminar $350 + property investment course $280. Both work-relevant — claimed.", howTo: "Keep receipts and course descriptions.", watchOut: "Must relate to current real estate role.", docsNeeded: ["Receipts", "Course descriptions"] },
    ],
    conditional: [
      { item: "Client entertainment (strictly limited)", value: 300, tag: "Meals", summary: "ATO scrutinises this heavily — must directly connect to income.", scenario: "Taking a vendor to lunch to discuss a listing: potentially claimable. Christmas client lunch for goodwill: generally not.", howTo: "Keep receipt AND diary: who attended, business discussed, direct income connection.", watchOut: "General goodwill entertainment almost never holds up to ATO scrutiny.", docsNeeded: ["Receipt", "Diary note: who, what, income connection"] },
      { item: "Home office", value: 400, tag: "Home Office", summary: "Admin and after-hours work done at home.", scenario: "Works from home 2hrs most evenings on contracts and admin. 2 × 5 × 48 × $0.67 = $322.", howTo: "67c/hr. Time diary.", watchOut: "Cannot claim internet separately if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal dining or entertainment", reason: "Must meet strict ATO entertainment test — goodwill dining almost never qualifies." },
      { item: "Unbranded clothing (suits)", reason: "Must be a required distinctive branded uniform. Suits are personal." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
    ],
  },

  chef: {
    avgSalary: 65000,
    claimable: [
      { item: "Chef's whites & kitchen uniform", value: 300, tag: "Clothing", summary: "Distinctive required kitchen uniforms.", scenario: "Restaurant requires white double-breasted jacket and checked pants. Cost $280 — distinctive and required — claimed.", howTo: "Keep receipt. Must be distinctive — not plain clothing.", watchOut: "Generic black pants worn both to and from work don't qualify.", docsNeeded: ["Receipt"] },
      { item: "Knife set & kitchen tools", value: 500, tag: "Equipment", summary: "Personal knife set and kitchen tools — tools of trade.", scenario: "Head chef buys Global knife set $380. Over $300 — depreciated over 5 years. Year 1 claim: ~$76.", howTo: "Under $300 = instant. Over $300 = depreciate over effective life (knives: ~5 years).", watchOut: "Knives owned before this job can't be claimed.", docsNeeded: ["Receipt", "Asset register for items over $300"] },
      { item: "Food safety certificates", value: 200, tag: "Education", summary: "Required compliance certifications.", scenario: "Food Handler Certificate renewal $150 — required by employer — claimed.", howTo: "Keep receipt from registered training provider.", watchOut: "Must be required for current role.", docsNeeded: ["Receipt from training provider"] },
      { item: "Non-slip safety shoes", value: 150, tag: "Clothing", summary: "Required safety footwear for kitchen environments.", scenario: "Restaurant requires non-slip safety shoes. Emma buys $130 pair — claimed.", howTo: "Keep receipt. Must be required safety footwear, not general comfort shoes.", watchOut: "'Comfortable shoes' without a specific safety requirement don't qualify.", docsNeeded: ["Receipt"] },
      { item: "Culinary courses & upskilling", value: 400, tag: "Education", summary: "Courses that improve skills in your current cooking role.", scenario: "Sous chef pays $380 for a pastry masterclass directly relevant to current role — claimed.", howTo: "Keep receipt and course description. Must relate to current role.", watchOut: "Business management courses to open your own restaurant = career change = not deductible.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO $1/load formula for compulsory kitchen uniforms.", scenario: "Washes uniform 5x/week × 48 weeks = 240 loads × $1. Claims $150 (cap without receipts).", howTo: "Keep weekly tally. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
    ],
    conditional: [
      { item: "Cookbooks & culinary publications", value: 150, tag: "Education", summary: "Reference books relevant to your current cuisine and role.", scenario: "Japanese cuisine chef buys $120 specialist Japanese cookbook. Directly relevant to current role — claimed.", howTo: "Keep receipt. Must relate to current cooking style or role.", watchOut: "General cookbook collection for personal interest doesn't qualify.", docsNeeded: ["Receipt", "Note relevance to current role"] },
    ],
    notClaimable: [
      { item: "Home-to-kitchen commute", reason: "Standard commute rule." },
      { item: "Meals eaten during shifts", reason: "Personal expense. Staff meals provided by employer may have FBT implications — but that's the employer's issue." },
      { item: "Personal cooking equipment at home", reason: "Home kitchen equipment is personal." },
    ],
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const TAX = [
  { max: 18200, rate: 0 }, { max: 45000, rate: 0.19 },
  { max: 120000, rate: 0.325 }, { max: 180000, rate: 0.37 },
  { max: Infinity, rate: 0.45 },
];
const getMarginalRate = (s) => { for (let i = TAX.length - 1; i >= 0; i--) { if (s > (i === 0 ? 0 : TAX[i-1].max)) return TAX[i].rate; } return 0; };
const fmt = (n) => "$" + Math.round(n).toLocaleString("en-AU");

const TAG_COLORS = {
  Clothing: ["#dbeafe","#1e40af"], Equipment: ["#f3e8ff","#6d28d9"],
  Education: ["#fce7f3","#9d174d"], Phone: ["#d1fae5","#065f46"],
  Travel: ["#fef9c3","#78350f"], "Home Office": ["#e0f2fe","#0c4a6e"],
  Memberships: ["#ede9fe","#5b21b6"], Vehicle: ["#fee2e2","#991b1b"],
  Software: ["#ecfdf5","#065f46"], Supplies: ["#fff7ed","#9a3412"],
  GST: ["#f0fdf4","#14532d"], Health: ["#fdf4ff","#7e22ce"],
  Marketing: ["#fff1f2","#9f1239"], Meals: ["#fffbeb","#78350f"],
  Licences: ["#e0f2fe","#0c4a6e"], Insurance: ["#fef9c3","#78350f"],
};

// ─── LOGBOOK GUIDE ────────────────────────────────────────────────────────────
const LOGBOOK_STEPS = [
  { icon: "📅", title: "Choose your 12 weeks", content: "Pick a continuous 12-week period that represents your typical driving pattern. Don't cherry-pick your busiest period — the ATO requires it to be representative.", tip: "Most people start in September or March to avoid school holidays skewing their pattern." },
  { icon: "🚗", title: "Record EVERY trip", content: "Every single trip during the 12 weeks — work AND personal. The personal trips are just as important because they determine your total kilometres and therefore your business %.", tip: "For each trip: Date · Start odometer · End odometer · Destination · Purpose (be specific — 'client meeting at 123 Smith St' not just 'work')" },
  { icon: "📊", title: "Calculate your business %", content: "At the end of 12 weeks: add up all work kilometres. Divide by total kilometres. Multiply by 100. This is your business-use % — it applies to every car expense for the whole financial year.", tip: "Example: 6,600 work km ÷ 11,000 total km = 60% business use. All car costs × 60% = your deduction." },
  { icon: "🧾", title: "Keep all car receipts", content: "The logbook only determines your %. You still need receipts for everything: fuel, registration, insurance, servicing, tyres, car wash. No receipt = can't include that expense.", tip: "Create a folder in Google Photos called 'Car receipts 2025' and photograph every receipt immediately." },
  { icon: "📏", title: "Record odometer annually", content: "Note your car's odometer on 1 July AND 30 June every year. This gives the ATO the total annual kilometres to verify your claim.", tip: "Set a phone reminder: '1 July — odometer reading'. Takes 30 seconds." },
  { icon: "⏰", title: "Your logbook lasts 5 years", content: "Once your 12-week logbook is done, you don't need to redo it for 5 years — unless your work travel patterns change significantly.", tip: "Keep both the logbook AND receipts for 5 years after the last year you used it." },
];

function LogbookGuide({ onClose }) {
  const [step, setStep] = useState(0);
  const s = LOGBOOK_STEPS[step];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 20px 36px", maxWidth:540, width:"100%", animation:"fadeUp 0.3s ease both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontWeight:800, fontSize:17 }}>Vehicle Logbook Guide 🚗</h3>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontWeight:700, color:"#6b7280" }}>✕</button>
        </div>
        <div className="progress-bar" style={{ marginBottom:16 }}><div className="progress-fill" style={{ width:`${((step+1)/LOGBOOK_STEPS.length)*100}%` }} /></div>
        <p style={{ fontSize:12, color:"#9ca3af", marginBottom:16 }}>Step {step+1} of {LOGBOOK_STEPS.length}</p>
        <div className="guide-step" key={step}>
          <div style={{ fontSize:36, marginBottom:10 }}>{s.icon}</div>
          <h4 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>{s.title}</h4>
          <p style={{ color:"#374151", lineHeight:1.7, marginBottom:12 }}>{s.content}</p>
          <div style={{ background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:10, padding:"12px 14px" }}>
            <p style={{ fontSize:13, color:"#92400e", fontWeight:600 }}>💡 {s.tip}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:"#f3f4f6", border:"none", borderRadius:12, padding:14, fontWeight:700, cursor:"pointer", fontSize:15 }}>← Back</button>}
          {step < LOGBOOK_STEPS.length-1
            ? <button onClick={()=>setStep(s=>s+1)} style={{ flex:2, background:"#4f46e5", border:"none", borderRadius:12, padding:14, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:15 }}>Next →</button>
            : <button onClick={onClose} style={{ flex:2, background:"#059669", border:"none", borderRadius:12, padding:14, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:15 }}>✅ Got it!</button>}
        </div>
      </div>
    </div>
  );
}

// ─── FLIP CARD ────────────────────────────────────────────────────────────────
function FlipCard({ deduction, marginalRate, type, showLogbook }) {
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const saving = Math.round(deduction.value * marginalRate);
  const [tagBg, tagColor] = TAG_COLORS[deduction.tag] || ["#f1f5f9","#475569"];
  const borderCol = type === "claimable" ? "#059669" : "#d97706";
  const hasLogbook = deduction.docsNeeded?.some(d => d.toLowerCase().includes("logbook"));

  function flip(to) {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setFlipped(to); setAnimating(false); }, 180);
  }

  return (
    <div className="card-wrap">
      {/* FRONT */}
      <div className={`card-side ${flipped ? "hidden" : "visible"}`}
        style={{ background:"#fff", borderRadius:12, border:"1px solid #e2e5f0", borderLeft:`4px solid ${borderCol}`, padding:"14px 16px", cursor:"pointer" }}
        onClick={() => flip(true)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
              <span className="stag" style={{ background:tagBg, color:tagColor }}>{deduction.tag}</span>
              {type === "conditional" && <span className="stag" style={{ background:"#fffbeb", color:"#92400e" }}>Conditions Apply</span>}
            </div>
            <p style={{ fontWeight:700, fontSize:14, color:"#111827", lineHeight:1.4, marginBottom:4 }}>{deduction.item}</p>
            <p style={{ fontSize:12, color:"#6b7280", lineHeight:1.5 }}>{deduction.summary}</p>
          </div>
          <div style={{ textAlign:"right", flexShrink:0, paddingLeft:8 }}>
            <p style={{ fontSize:16, fontWeight:800, color: type==="claimable" ? "#059669" : "#d97706", fontFamily:"monospace" }}>{fmt(deduction.value)}</p>
            <p style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>~{fmt(saving)} back</p>
            <div style={{ marginTop:8, background:"#eef2ff", borderRadius:6, padding:"4px 8px" }}>
              <p style={{ fontSize:11, color:"#4f46e5", fontWeight:700 }}>Tap to flip 🃏</p>
            </div>
          </div>
        </div>
      </div>
      {/* BACK */}
      <div className={`card-side ${flipped ? "visible" : "hidden"}`}
        style={{ background:"#fff", borderRadius:12, border:"2px solid #4f46e5", padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
            <span className="stag" style={{ background:tagBg, color:tagColor, flexShrink:0 }}>{deduction.tag}</span>
            <p style={{ fontWeight:800, fontSize:13, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{deduction.item}</p>
          </div>
          <button onClick={()=>flip(false)} style={{ background:"#eef2ff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:"#4f46e5", cursor:"pointer", fontWeight:700, flexShrink:0, marginLeft:8 }}>← Back</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#059669", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>📋 Real Example</p>
            <p style={{ fontSize:13, color:"#14532d", lineHeight:1.65 }}>{deduction.scenario}</p>
          </div>
          <div style={{ background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#4f46e5", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>✅ How to Claim It</p>
            <p style={{ fontSize:13, color:"#1e1b4b", lineHeight:1.65 }}>{deduction.howTo}</p>
          </div>
          {deduction.watchOut && (
            <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:10, padding:"10px 12px" }}>
              <p style={{ fontSize:10, fontWeight:800, color:"#c2410c", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>⚠️ Watch Out</p>
              <p style={{ fontSize:13, color:"#7c2d12", lineHeight:1.65 }}>{deduction.watchOut}</p>
            </div>
          )}
          <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#374151", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>📎 Documents You Need</p>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {deduction.docsNeeded?.map((doc,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                  <span style={{ width:18, height:18, background:"#d1fae5", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0, marginTop:1 }}>✓</span>
                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.5 }}>{doc}</p>
                </div>
              ))}
            </div>
            {hasLogbook && (
              <button onClick={()=>showLogbook()} style={{ marginTop:10, width:"100%", background:"linear-gradient(135deg,#4f46e5,#6366f1)", border:"none", borderRadius:9, padding:"10px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                📖 Open Logbook Guide — Step by step →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [profession, setProfession] = useState(null);
  const [salary, setSalary] = useState("");
  const [salaryInput, setSalaryInput] = useState("");
  const [activeTab, setActiveTab] = useState("claimable");
  const [showLogbook, setShowLogbook] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [checklist, setChecklist] = useState({});
  const [checklistDone, setChecklistDone] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const data = profession ? D[profession.id] : null;
  const effectiveSalary = Number(salary) || data?.avgSalary || 80000;
  const marginalRate = getMarginalRate(effectiveSalary);
  const totalClaim = data ? [...(data.claimable||[]), ...(data.conditional||[])].reduce((s,d)=>s+d.value,0) : 0;
  const estimatedSaving = data ? Math.round((data.claimable||[]).reduce((s,d)=>s+d.value*marginalRate,0) + (data.conditional||[]).reduce((s,d)=>s+d.value*marginalRate*0.6,0)) : 0;

  const NEEDS_LOGBOOK = ["tradie","electrician","plumber","concreter","truckie","uber","delivery","realestate","lawyer","engineer","photographer","doctor","cleaner"];

  const CHECKLIST_QUESTIONS = [
    { id: "car", label: "Do you use your own car for work?" },
    { id: "phone", label: "Do you use your personal phone for work?" },
    { id: "wfh", label: "Do you work from home (even sometimes)?" },
    { id: "uniform", label: "Do you wear a required work uniform?" },
    { id: "tools", label: "Do you buy your own tools or equipment for work?" },
    { id: "courses", label: "Have you paid for any work-related courses or memberships this year?" },
  ];

  const personalised = checklistDone && data ? [
    ...(checklist.car ? (data.claimable||[]).filter(d=>d.tag==="Vehicle"||d.tag==="Travel") : []),
    ...(checklist.phone ? (data.claimable||[]).filter(d=>d.tag==="Phone") : []),
    ...(checklist.wfh ? (data.claimable||[]).filter(d=>d.tag==="Home Office") : []),
    ...(checklist.uniform ? (data.claimable||[]).filter(d=>d.tag==="Clothing") : []),
    ...(checklist.tools ? (data.claimable||[]).filter(d=>d.tag==="Equipment") : []),
    ...(checklist.courses ? (data.claimable||[]).filter(d=>d.tag==="Education"||d.tag==="Memberships") : []),
  ] : [];

  const personalisedSaving = personalised.reduce((s,d)=>s+Math.round(d.value*marginalRate),0);
async function handleEmailSubmit() {
  if (!email.includes("@")) return;
  try {
    await fetch(`https://api.convertkit.com/v3/forms/9260632/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "MIBl3ebdZg5YyDUpqcZ-fw",
        email: email,
        fields: { profession: profession?.id || "unknown" },
      }),
    });
  } catch (e) {
    console.error("Email subscribe failed:", e);
  }
  setEmailSubmitted(true);
}
  function handleShare() {
    const text = `Just used this free Aussie tax tool — found ${fmt(totalClaim)} in potential deductions as a ${profession?.label}. That's ~${fmt(estimatedSaving)} back. Check yours 👇 isitdeductible.com.au 🇦🇺`;
    if (navigator.share) navigator.share({ text });
    else { navigator.clipboard.writeText(text).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); }); }
  }

  function handleDownload() {
    const lines = [
      "IS IT DEDUCTIBLE? — Tax Deduction Summary",
      `Generated: ${new Date().toLocaleDateString("en-AU")}`,
      `Profession: ${profession?.label}`,
      `Estimated Salary: ${fmt(effectiveSalary)}/yr | Marginal Rate: ${Math.round(marginalRate*100)}%`,
      `Estimated Tax Saving: ~${fmt(estimatedSaving)}`,
      "","═══════════════════════════════════",
      "✅ DEDUCTIONS YOU CAN CLAIM","═══════════════════════════════════",
      ...(data?.claimable?.map(d=>`• ${d.item} — ~${fmt(d.value)} (saves ~${fmt(Math.round(d.value*marginalRate))})\n  HOW TO: ${d.howTo}\n  DOCS: ${d.docsNeeded?.join(", ")}\n  WATCH OUT: ${d.watchOut||"N/A"}\n`)||[]),
      "","═══════════════════════════════════",
      "⚠️  CONDITIONAL DEDUCTIONS","═══════════════════════════════════",
      ...(data?.conditional?.map(d=>`• ${d.item} — ~${fmt(d.value)}\n  HOW TO: ${d.howTo}\n  DOCS: ${d.docsNeeded?.join(", ")}\n  WATCH OUT: ${d.watchOut||"N/A"}\n`)||[]),
      "","═══════════════════════════════════",
      "❌ DO NOT CLAIM — COMMON MISTAKES","═══════════════════════════════════",
      ...(data?.notClaimable?.map(d=>`• ${d.item}\n  Why: ${d.reason}`)||[]),
      "","───────────────────────────────────",
      "DISCLAIMER: General information only — not tax advice.",
      "Verify at ato.gov.au and consult a registered tax agent.",
    ];
    const blob = new Blob([lines.join("\n")],{type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`IsItDeductible_${profession?.label.replace(/[ /]/g,"_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const filteredProfessions = search.trim()
    ? ALL_PROFESSIONS.filter(p => p.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eef2ff 0%,#f0f2f8 40%,#ecfdf5 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px" }}>
      <div className="scale-in" style={{ maxWidth:440, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:16 }}>💰</div>
        <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:36, color:"#111827", marginBottom:10, lineHeight:1.2 }}>Is It <em>Deductible?</em></h1>
        <p style={{ color:"#6b7280", fontSize:16, lineHeight:1.7, marginBottom:28, maxWidth:360, margin:"0 auto 28px" }}>
          Find out exactly what you can claim on your Australian tax return — with real examples, how-to guides, and your estimated refund.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
          {[["🃏","Flip each card — real example + exactly how to claim it"],["📖","Step-by-step logbook & documentation guides"],["💸","Personalised tax saving estimate in seconds"],["📄","Download a summary for your tax agent"],["👥","25 professions covered across 5 categories"]].map(([icon,text],i)=>(
            <div key={i} className="fade-up" style={{ animationDelay:`${i*0.07}s`, background:"#fff", border:"1px solid #e2e5f0", borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <p style={{ fontSize:13, fontWeight:600, color:"#374151", lineHeight:1.4 }}>{text}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setScreen("select")} style={{ width:"100%", background:"linear-gradient(135deg,#4f46e5,#6366f1)", border:"none", borderRadius:14, padding:18, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 24px rgba(79,70,229,0.35)" }}>
          Check My Deductions →
        </button>
        <p style={{ marginTop:14, fontSize:12, color:"#9ca3af" }}>🇦🇺 Free · Based on ATO guidance · General info only — not tax advice</p>
      </div>
    </div>
  );

  // ── SELECT PROFESSION ─────────────────────────────────────────────────────
  if (screen === "select") return (
    <div style={{ minHeight:"100vh", padding:"32px 20px 60px", maxWidth:580, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("home")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:20, padding:0 }}>← Back</button>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, marginBottom:6 }}>What's your profession?</h2>
        <p style={{ color:"#6b7280", marginBottom:20 }}>Choose a category or search directly.</p>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:20 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search professions..." style={{ width:"100%", border:"2px solid #e2e5f0", borderRadius:12, padding:"12px 14px 12px 40px", fontSize:15, color:"#111827", background:"#fff" }} />
        </div>

        {/* Search results */}
        {filteredProfessions && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {filteredProfessions.length === 0
              ? <p style={{ color:"#9ca3af", fontSize:14, gridColumn:"1/-1" }}>No professions found — try a different search.</p>
              : filteredProfessions.map(p => (
                <div key={p.id} className="prof-card" style={{ background:"#fff", border:"2px solid #e2e5f0", borderRadius:14, padding:"16px 14px", cursor:"pointer" }}
                  onClick={()=>{ setProfession(p); setScreen("salary"); setSearch(""); }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{p.emoji}</div>
                  <p style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{p.label}</p>
                </div>
              ))}
          </div>
        )}

        {/* Group browse */}
        {!search && GROUPS.map((group, gi) => (
          <div key={group.id} className="fade-up" style={{ animationDelay:`${gi*0.05}s`, marginBottom:16 }}>
            <button
              onClick={()=>setSelectedGroup(selectedGroup===group.id ? null : group.id)}
              style={{ width:"100%", background: selectedGroup===group.id ? "#4f46e5" : "#fff", border:`2px solid ${selectedGroup===group.id ? "#4f46e5" : "#e2e5f0"}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom: selectedGroup===group.id ? 10 : 0 }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{group.emoji}</span>
                <div style={{ textAlign:"left" }}>
                  <p style={{ fontWeight:700, fontSize:15, color: selectedGroup===group.id ? "#fff" : "#111827" }}>{group.label}</p>
                  <p style={{ fontSize:12, color: selectedGroup===group.id ? "rgba(255,255,255,0.7)" : "#9ca3af" }}>{group.professions.length} professions</p>
                </div>
              </div>
              <span style={{ fontSize:18, color: selectedGroup===group.id ? "#fff" : "#9ca3af" }}>{selectedGroup===group.id ? "▲" : "▼"}</span>
            </button>
            {selectedGroup===group.id && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {group.professions.map(p => (
                  <div key={p.id} className="prof-card fade-up" style={{ background:"#fff", border:"2px solid #e2e5f0", borderRadius:12, padding:"14px 12px", cursor:"pointer" }}
                    onClick={()=>{ setProfession(p); setScreen("salary"); }}>
                    <div style={{ fontSize:24, marginBottom:6 }}>{p.emoji}</div>
                    <p style={{ fontWeight:700, fontSize:13, color:"#111827" }}>{p.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── SALARY ────────────────────────────────────────────────────────────────
  if (screen === "salary") return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"40px 20px", maxWidth:460, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("select")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:20, padding:0 }}>← Back</button>
        <span style={{ fontSize:36 }}>{profession?.emoji}</span>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, marginBottom:6, marginTop:8 }}>Your annual salary?</h2>
        <p style={{ color:"#6b7280", marginBottom:8 }}>Used to calculate your exact tax saving. Not stored anywhere.</p>
        <p style={{ color:"#4f46e5", fontSize:13, fontWeight:700, marginBottom:24 }}>Average for {profession?.label}: {fmt(data?.avgSalary||80000)}/yr</p>
        <div style={{ position:"relative", marginBottom:12 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontWeight:800, color:"#9ca3af", fontSize:18 }}>$</span>
          <input autoFocus type="number" value={salaryInput} onChange={e=>setSalaryInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(setSalary(salaryInput||String(data?.avgSalary)),setScreen("results"),setActiveTab("claimable"))}
            placeholder={String(data?.avgSalary||80000)}
            style={{ width:"100%", border:"2px solid #e2e5f0", borderRadius:12, padding:"16px 16px 16px 36px", fontSize:17, color:"#111827", background:"#fff" }} />
        </div>
        {salaryInput && (
          <div className="scale-in" style={{ background:"#eef2ff", border:"1px solid #c7d2fe", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#4338ca", fontWeight:600 }}>
            Marginal rate: {Math.round(getMarginalRate(Number(salaryInput))*100)}% — every $100 claimed = ${Math.round(getMarginalRate(Number(salaryInput))*100)} back
          </div>
        )}
        <button onClick={()=>{ setSalary(salaryInput||String(data?.avgSalary)); setScreen("results"); setActiveTab("claimable"); }}
          style={{ width:"100%", background:"linear-gradient(135deg,#4f46e5,#6366f1)", border:"none", borderRadius:14, padding:17, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 18px rgba(79,70,229,0.3)", marginBottom:10 }}>
          Show My Deductions →
        </button>
        <button onClick={()=>{ setSalary(String(data?.avgSalary)); setScreen("results"); setActiveTab("claimable"); }}
          style={{ width:"100%", background:"transparent", border:"none", color:"#9ca3af", fontSize:14, cursor:"pointer", padding:8 }}>
          Use average salary instead
        </button>
      </div>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const tabs = [
    { id:"claimable", label:"✅ Can Claim", count:data?.claimable?.length, color:"#059669", bg:"#ecfdf5" },
    { id:"conditional", label:"⚠️ Conditions", count:data?.conditional?.length, color:"#d97706", bg:"#fffbeb" },
    { id:"notclaimable", label:"❌ Can't Claim", count:data?.notClaimable?.length, color:"#dc2626", bg:"#fef2f2" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f0f2f8", paddingBottom:60 }}>
      {showLogbook && <LogbookGuide onClose={()=>setShowLogbook(false)} />}

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#4f46e5 0%,#6366f1 100%)", padding:"24px 20px 72px" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <button onClick={()=>setScreen("select")} style={{ background:"rgba(255,255,255,0.18)", border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:18, fontFamily:"inherit", fontWeight:600 }}>← Change</button>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:36 }}>{profession?.emoji}</span>
            <div>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13 }}>Tax Deductions</p>
              <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, color:"#fff", fontWeight:400 }}>{profession?.label}</h2>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:560, margin:"-52px auto 0", padding:"0 16px" }}>

        {/* SAVINGS CARD */}
        <div className="scale-in" style={{ background:"#fff", borderRadius:18, padding:"20px", boxShadow:"0 8px 32px rgba(79,70,229,0.12)", marginBottom:12 }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>Estimated Tax Saving</p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, marginBottom:14 }}>
            <p className="num-pop" style={{ fontFamily:"'Instrument Serif',serif", fontSize:48, color:"#059669", lineHeight:1 }}>{fmt(estimatedSaving)}</p>
            <p style={{ color:"#6b7280", fontSize:14, marginBottom:8 }}>back in your pocket</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            <div style={{ background:"#ecfdf5", borderRadius:10, padding:"12px 14px" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#059669", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>Definite Claims</p>
              <p style={{ fontSize:20, fontWeight:800, color:"#059669" }}>{fmt(data?.claimable?.reduce((s,d)=>s+d.value,0)||0)}</p>
            </div>
            <div style={{ background:"#fffbeb", borderRadius:10, padding:"12px 14px" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#d97706", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:4 }}>Conditional</p>
              <p style={{ fontSize:20, fontWeight:800, color:"#d97706" }}>{fmt(data?.conditional?.reduce((s,d)=>s+d.value,0)||0)}</p>
            </div>
          </div>
          <div style={{ background:"#f9fafb", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#6b7280" }}>
            Based on {fmt(effectiveSalary)}/yr · {Math.round(marginalRate*100)}% marginal rate
          </div>
        </div>


        {/* 1 — PERSONALISATION CHECKLIST */}
        {!checklistDone ? (
          <div style={{ background:"#fff", border:"2px solid #4f46e5", borderRadius:16, padding:"18px", marginBottom:12 }}>
            {!showChecklist ? (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:22, marginBottom:8 }}>🎯</p>
                <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:6 }}>Get your personalised list</p>
                <p style={{ fontSize:13, color:"#6b7280", marginBottom:14, lineHeight:1.6 }}>Answer 6 quick questions — we'll filter down to only the deductions that actually apply to you.</p>
                <button onClick={()=>setShowChecklist(true)} style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1)", border:"none", borderRadius:12, padding:"12px 24px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Personalise My Results →
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:4 }}>Which of these apply to you?</p>
                <p style={{ fontSize:13, color:"#6b7280", marginBottom:14 }}>Tick all that apply</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                  {CHECKLIST_QUESTIONS.map(q=>(
                    <div key={q.id} onClick={()=>setChecklist(c=>({...c,[q.id]:!c[q.id]}))}
                      style={{ display:"flex", alignItems:"center", gap:12, background: checklist[q.id] ? "#eef2ff" : "#f9fafb", border:`2px solid ${checklist[q.id] ? "#4f46e5" : "#e2e5f0"}`, borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
                      <div style={{ width:22, height:22, borderRadius:6, background: checklist[q.id] ? "#4f46e5" : "#fff", border:`2px solid ${checklist[q.id] ? "#4f46e5" : "#d1d5db"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {checklist[q.id] && <span style={{ color:"#fff", fontSize:13, fontWeight:800 }}>✓</span>}
                      </div>
                      <p style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{q.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setChecklistDone(true)} style={{ width:"100%", background:"linear-gradient(135deg,#4f46e5,#6366f1)", border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Show My Personalised Deductions →
                </button>
              </div>
            )}
          </div>
        ) : personalised.length > 0 ? (
          <div style={{ background:"linear-gradient(135deg,#eef2ff,#ecfdf5)", border:"2px solid #4f46e5", borderRadius:16, padding:"18px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:"#4f46e5", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Your Personalised Deductions</p>
                <p style={{ fontWeight:800, fontSize:22, color:"#059669" }}>{fmt(personalisedSaving)} estimated back</p>
                <p style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{personalised.length} deductions that apply to you specifically</p>
              </div>
              <button onClick={()=>{setChecklistDone(false);setChecklist({});setShowChecklist(false);}} style={{ background:"#eef2ff", border:"none", borderRadius:8, padding:"6px 10px", fontSize:11, color:"#4f46e5", cursor:"pointer", fontWeight:700, flexShrink:0 }}>Edit</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {personalised.map((d,i)=>(
                <div key={i} style={{ background:"#fff", borderRadius:9, padding:"10px 12px", borderLeft:"3px solid #059669", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <p style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{d.item}</p>
                  <p style={{ fontSize:13, fontWeight:800, color:"#059669", flexShrink:0, marginLeft:8, fontFamily:"monospace" }}>{fmt(d.value)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background:"#f9fafb", border:"1px solid #e2e5f0", borderRadius:14, padding:"14px 16px", marginBottom:12, textAlign:"center" }}>
            <p style={{ fontSize:14, color:"#6b7280" }}>No specific deductions matched your answers — check the full list below.</p>
            <button onClick={()=>{setChecklistDone(false);setChecklist({});setShowChecklist(false);}} style={{ marginTop:8, background:"transparent", border:"none", color:"#4f46e5", fontSize:13, fontWeight:700, cursor:"pointer" }}>Try again</button>
          </div>
        )}

        {/* 2 — BOOK A TAX AGENT */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderRadius:16, padding:"18px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <span style={{ fontSize:32, flexShrink:0 }}>👨‍💼</span>
            <div style={{ flex:1 }}>
              <p style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:4 }}>Want someone to claim all of this for you?</p>
              <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6, marginBottom:14 }}>
                You've found {fmt(totalClaim)} in potential deductions. A registered tax agent will make sure you claim every dollar — and their fee is tax deductible too.
              </p>
              <a href="https://www.ato.gov.au/individuals-and-families/your-tax-return/help-and-support-to-lodge-your-tax-return/find-a-registered-tax-agent" target="_blank" rel="noopener noreferrer"
                style={{ display:"block", background:"linear-gradient(135deg,#4f46e5,#6366f1)", borderRadius:12, padding:"13px 18px", color:"#fff", fontSize:14, fontWeight:700, textAlign:"center", textDecoration:"none" }}>
                Find a Registered Tax Agent →
              </a>
              <p style={{ color:"#475569", fontSize:11, marginTop:8, textAlign:"center" }}>Powered by the ATO's official register</p>
            </div>
          </div>
        </div>

        {/* 3 — EMAIL CAPTURE */}
        {!emailSubmitted ? (
          <div style={{ background:"#fff", border:"1px solid #e2e5f0", borderRadius:16, padding:"18px", marginBottom:12 }}>
            <p style={{ fontSize:22, marginBottom:8, textAlign:"center" }}>🔔</p>
            <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:4, textAlign:"center" }}>Get your 30 June reminder</p>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:14, textAlign:"center", lineHeight:1.6 }}>
              We'll email you before tax time with your {profession?.label} deduction checklist — so you never miss a claim again.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex:1, border:"2px solid #e2e5f0", borderRadius:10, padding:"11px 14px", fontSize:14, color:"#111827", background:"#f9fafb" }}
              />
              <button
                onClick={()=>{ if(email.includes("@")){ setEmailSubmitted(true); }}}
                style={{ background:"#4f46e5", border:"none", borderRadius:10, padding:"11px 18px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}
              >
                Remind Me
              </button>
            </div>
            <p style={{ fontSize:11, color:"#9ca3af", marginTop:8, textAlign:"center" }}>No spam. One email per year before 30 June.</p>
          </div>
        ) : (
          <div style={{ background:"#ecfdf5", border:"1px solid #a7f3d0", borderRadius:14, padding:"14px 18px", marginBottom:12, textAlign:"center" }}>
            <p style={{ fontSize:14, fontWeight:700, color:"#059669" }}>✅ Done! We'll remind you before 30 June with your {profession?.label} deduction checklist.</p>
          </div>
        )}

        {/* ACTIONS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
          <button onClick={handleDownload} style={{ background:"#4f46e5", border:"none", borderRadius:12, padding:13, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>📄 Download Summary</button>
          <button onClick={handleShare} style={{ background:"#059669", border:"none", borderRadius:12, padding:13, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{copied ? "✓ Copied!" : "📤 Share Results"}</button>
        </div>

        {/* LOGBOOK BANNER */}
        {NEEDS_LOGBOOK.includes(profession?.id) && (
          <div className="hover-lift" onClick={()=>setShowLogbook(true)} style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <span style={{ fontSize:28, flexShrink:0 }}>🚗</span>
            <div style={{ flex:1 }}>
              <p style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:2 }}>Vehicle logbook guide</p>
              <p style={{ color:"#a5b4fc", fontSize:12 }}>Your biggest deduction — learn how to do it in 6 steps</p>
            </div>
            <span style={{ color:"#818cf8", fontSize:18 }}>→</span>
          </div>
        )}

        {/* FLIP HINT */}
        <div style={{ background:"#eef2ff", border:"1px dashed #c7d2fe", borderRadius:10, padding:"10px 14px", marginBottom:10, textAlign:"center", fontSize:13, color:"#4338ca", fontWeight:600 }}>
          🃏 Tap any card to flip — real example, how to claim it & what documents you need
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:6, background:"#fff", borderRadius:12, padding:5, marginBottom:12, border:"1px solid #e2e5f0" }}>
          {tabs.map(tab=>(
            <button key={tab.id} className="tab-btn" onClick={()=>setActiveTab(tab.id)}
              style={{ flex:1, padding:"9px 6px", borderRadius:9, background: activeTab===tab.id ? tab.bg : "transparent", color: activeTab===tab.id ? tab.color : "#9ca3af", fontSize:11, fontWeight:700 }}>
              {tab.label.split(" ")[0]}<br /><span style={{ fontSize:13 }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* DEDUCTION CARDS */}
        <div className="fade-up" key={activeTab}>
          {activeTab==="claimable" && data?.claimable?.map((d,i)=>(
            <FlipCard key={i} deduction={d} marginalRate={marginalRate} type="claimable" showLogbook={()=>setShowLogbook(true)} />
          ))}
          {activeTab==="conditional" && <>
            <div style={{ background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#92400e", fontWeight:600 }}>
              ⚠️ Valid deductions — but only if you meet the conditions. Tap each card to check.
            </div>
            {data?.conditional?.map((d,i)=>(
              <FlipCard key={i} deduction={d} marginalRate={marginalRate} type="conditional" showLogbook={()=>setShowLogbook(true)} />
            ))}
          </>}
          {activeTab==="notclaimable" && <>
            <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#991b1b", fontWeight:600 }}>
              ❌ Common mistakes — claiming these incorrectly can trigger an ATO audit.
            </div>
            {data?.notClaimable?.map((d,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:10, border:"1px solid #e2e5f0", borderLeft:"4px solid #dc2626", padding:"14px 16px", marginBottom:8 }}>
                <p style={{ fontWeight:700, fontSize:14, color:"#111827", marginBottom:4 }}>✕ {d.item}</p>
                <p style={{ fontSize:13, color:"#6b7280", lineHeight:1.6 }}>{d.reason}</p>
              </div>
            ))}
          </>}
        </div>

        {/* DISCLAIMER */}
        <div style={{ marginTop:16, background:"#fff", border:"1px solid #e2e5f0", borderRadius:14, padding:"14px 16px" }}>
          <p style={{ fontSize:12, color:"#6b7280", lineHeight:1.7 }}>
            ⚖️ <strong style={{ color:"#374151" }}>Disclaimer:</strong> General information only — not tax advice. Estimates based on typical scenarios. Always verify at <strong>ato.gov.au</strong> and consult a registered tax agent for advice specific to your situation.
          </p>
        </div>

        <button onClick={()=>{ setScreen("home"); setProfession(null); setSalary(""); setSalaryInput(""); setSelectedGroup(null); }}
          style={{ width:"100%", marginTop:14, background:"#fff", border:"2px solid #e2e5f0", borderRadius:13, padding:14, color:"#6b7280", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          Check Another Profession
        </button>
      </div>
    </div>
  );
}
