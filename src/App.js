import { useState, useEffect } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f6fc; font-family: 'Plus Jakarta Sans', sans-serif; color: #111827; -webkit-font-smoothing: antialiased; }
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
  .prof-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(30,79,216,0.15); border-color: #1e4fd8 !important; }
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
  .progress-fill { height:100%; background:linear-gradient(90deg,#1e4fd8,#10b981); border-radius:99px; transition:width 0.5s ease; }
  input:focus { outline: 2px solid #1e4fd8; outline-offset: 1px; }
`;

// --- PROFESSION GROUPS --------------------------------------------------------
const GROUPS = [
  {
    id: "healthcare", label: "Healthcare & Allied Health", emoji: "🏥",
    professions: [
      { id: "nurse", label: "Nurse / Midwife", emoji: "🏥" },
      { id: "doctor", label: "Doctor / GP", emoji: "👨‍⚕️" },
      { id: "physio", label: "Physio / OT / Chiro", emoji: "🦴" },
      { id: "paramedic", label: "Paramedic / Ambo", emoji: "🚑" },
      { id: "dentist", label: "Dentist / Dental Nurse", emoji: "🦷" },
      { id: "pharmacist", label: "Pharmacist", emoji: "💊" },
      { id: "psychologist", label: "Psychologist / Counsellor", emoji: "🧠" },
      { id: "optometrist", label: "Optometrist", emoji: "👁️" },
      { id: "radiographer", label: "Radiographer / Sonographer", emoji: "🩻" },
      { id: "dietitian", label: "Dietitian / Nutritionist", emoji: "🥗" },
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
      { id: "carpenter", label: "Carpenter / Joiner", emoji: "🪚" },
      { id: "welder", label: "Welder / Boilermaker", emoji: "🔥" },
      { id: "painter", label: "Painter / Decorator", emoji: "🖌️" },
      { id: "tiler", label: "Tiler / Floorer", emoji: "🟦" },
      { id: "pestcontrol", label: "Pest Control / Lawn Care", emoji: "🌿" },
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
      { id: "socialworker", label: "Social Worker", emoji: "🤲" },
      { id: "police", label: "Police Officer", emoji: "👮" },
      { id: "firefighter", label: "Firefighter", emoji: "🚒" },
      { id: "military", label: "Military Personnel", emoji: "🎖️" },
      { id: "corrections", label: "Corrections Officer", emoji: "🔐" },
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
      { id: "financeplanner", label: "Financial Planner / Adviser", emoji: "💰" },
      { id: "mortgagebroker", label: "Mortgage Broker", emoji: "🏦" },
      { id: "businessanalyst", label: "Business Analyst", emoji: "📈" },
      { id: "projectmanager", label: "Project Manager", emoji: "📋" },
      { id: "architect", label: "Architect / Interior Designer", emoji: "📐" },
    ]
  },
  {
    id: "education", label: "Education & Training", emoji: "🎓",
    professions: [
      { id: "teacher", label: "Teacher / Tutor", emoji: "📚" },
      { id: "lecturer", label: "University Lecturer / Academic", emoji: "🎓" },
      { id: "earlychildhood", label: "Early Childhood Educator", emoji: "🧒" },
      { id: "tafe", label: "TAFE / Vocational Trainer", emoji: "🔨" },
      { id: "schoolcounsellor", label: "School Counsellor", emoji: "💬" },
    ]
  },
  {
    id: "tech", label: "Tech & Digital", emoji: "💡",
    professions: [
      { id: "datascientist", label: "Data Scientist / Analyst", emoji: "📊" },
      { id: "cybersecurity", label: "Cybersecurity Analyst", emoji: "🔒" },
      { id: "uxdesigner", label: "UX / UI Designer", emoji: "🎨" },
      { id: "itsupport", label: "IT Support / Help Desk", emoji: "🖥️" },
      { id: "networkengineer", label: "Network / Systems Engineer", emoji: "🌐" },
    ]
  },
  {
    id: "creative", label: "Creative & Media", emoji: "🎭",
    professions: [
      { id: "creator", label: "Content Creator", emoji: "📱" },
      { id: "photographer", label: "Photographer / Videographer", emoji: "📸" },
      { id: "graphicdesigner", label: "Graphic Designer", emoji: "🖼️" },
      { id: "journalist", label: "Journalist / Writer", emoji: "✍️" },
      { id: "musician", label: "Musician / Performer", emoji: "🎵" },
      { id: "actor", label: "Actor / Presenter", emoji: "🎬" },
    ]
  },
  {
    id: "hospitality", label: "Hospitality & Tourism", emoji: "🍽️",
    professions: [
      { id: "chef", label: "Chef / Cook", emoji: "👨‍🍳" },
      { id: "barista", label: "Barista / Bartender", emoji: "☕" },
      { id: "hospitalitymanager", label: "Hospitality Manager", emoji: "🏨" },
      { id: "travelagent", label: "Travel Agent", emoji: "✈️" },
      { id: "eventplanner", label: "Event Planner / Manager", emoji: "🎉" },
      { id: "flightattendant", label: "Flight Attendant", emoji: "🛫" },
    ]
  },
  {
    id: "retail", label: "Retail, Sales & Personal Services", emoji: "🛍️",
    professions: [
      { id: "realestate", label: "Real Estate Agent", emoji: "🏠" },
      { id: "salesrep", label: "Sales Representative", emoji: "🤝" },
      { id: "hairdresser", label: "Hairdresser / Beauty Therapist", emoji: "💇" },
      { id: "personaltrainer", label: "Personal Trainer", emoji: "💪" },
      { id: "retailmanager", label: "Retail Manager", emoji: "🏪" },
    ]
  },
  {
    id: "property", label: "Property & Construction", emoji: "🏗️",
    professions: [
      { id: "propertymanager", label: "Property Manager", emoji: "🏢" },
      { id: "buildinginspector", label: "Building Inspector / Surveyor", emoji: "📏" },
      { id: "quantitysurveyor", label: "Quantity Surveyor", emoji: "🔢" },
      { id: "facilitiesmanager", label: "Facilities Manager", emoji: "🔧" },
      { id: "townplanner", label: "Town Planner", emoji: "🗺️" },
    ]
  },
  {
    id: "transport", label: "Transport & Logistics", emoji: "🚚",
    professions: [
      { id: "pilot", label: "Airline Pilot", emoji: "✈️" },
      { id: "busdriver", label: "Bus / Train Driver", emoji: "🚌" },
      { id: "forklift", label: "Forklift / Warehouse Operator", emoji: "🏭" },
      { id: "logistics", label: "Logistics Coordinator", emoji: "📦" },
      { id: "seafarer", label: "Marine / Seafarer", emoji: "⚓" },
    ]
  },
  {
    id: "agriculture", label: "Agriculture & Environment", emoji: "🌾",
    professions: [
      { id: "farmer", label: "Farmer / Agricultural Worker", emoji: "🌾" },
      { id: "vet", label: "Veterinarian / Vet Nurse", emoji: "🐾" },
      { id: "environmental", label: "Environmental Scientist", emoji: "🌍" },
      { id: "mining", label: "Mining / Resources Worker", emoji: "⛏️" },
      { id: "horticulturalist", label: "Horticulturalist / Arborist", emoji: "🌳" },
    ]
  },
  {
    id: "online", label: "Online & Digital Business", emoji: "🌐",
    professions: [
      { id: "ecommerce", label: "eCommerce / Dropshipper", emoji: "🛒" },
      { id: "freelancer", label: "Freelancer", emoji: "💼" },
      { id: "socialmedia", label: "Social Media Manager", emoji: "📣" },
      { id: "onlinetutor", label: "Online Tutor / Course Creator", emoji: "🎓" },
      { id: "crypto", label: "Crypto / NFT Trader", emoji: "₿" },
      { id: "podcaster", label: "Podcaster", emoji: "🎙️" },
      { id: "affiliatemarketer", label: "Affiliate Marketer", emoji: "🔗" },
      { id: "virtualassistant", label: "Virtual Assistant", emoji: "🤖" },
      { id: "appdeveloper", label: "Indie App Developer", emoji: "📲" },
      { id: "digitalnomad", label: "Digital Nomad / Remote Worker", emoji: "🌏" },
    ]
  },
];

const ALL_PROFESSIONS = GROUPS.flatMap(g => g.professions);

// --- DEDUCTION DATA -----------------------------------------------------------
const D = {
  nurse: {
    avgSalary: 80000,
    claimable: [
      { item: "Scrubs & nursing uniforms", value: 300, tag: "Clothing", summary: "Distinctive work uniforms are fully deductible.", scenario: "Sarah buys 3 sets of scrubs at $90 each = $270. Distinct work uniforms -- she claims the full $270.", howTo: "Keep receipt. Uniform must be 'distinctive' -- employer logo or required specific colour. Plain black pants don't qualify.", watchOut: "Cannot claim plain street clothes even if worn only to work.", docsNeeded: ["Receipt", "Note employer uniform policy if asked"] },
      { item: "Uniform laundry costs", value: 150, tag: "Clothing", summary: "ATO formula: $1 per load -- no receipts needed under $150.", scenario: "Tom washes scrubs 3x/week x 48 weeks = 144 loads x $1 = $144. No receipts needed.", howTo: "Use ATO formula: $1/load washing, $1/load if also drying. Keep a simple weekly count in Notes.", watchOut: "Only applies to distinctive uniforms. Cannot claim laundering plain clothes.", docsNeeded: ["Simple weekly tally (notes app is fine)", "No receipts needed under $150"] },
      { item: "Stethoscope & medical equipment", value: 400, tag: "Equipment", summary: "Tools of trade you personally buy are fully deductible.", scenario: "Amira buys a $320 Littmann stethoscope. Employer doesn't provide one. Claims full $320.", howTo: "Keep receipt. Under $300 = instant deduction. Over $300 = depreciate over ATO effective life.", watchOut: "If employer reimburses you -- you cannot claim it.", docsNeeded: ["Receipt", "Asset register entry if over $300"] },
      { item: "CPD courses & conferences", value: 500, tag: "Education", summary: "Professional development directly related to your current nursing role.", scenario: "James pays $450 for an ICU upskilling course as an ICU nurse. Directly related -- fully deductible.", howTo: "Keep receipt + course description. Key test: maintains or improves skills for your CURRENT job.", watchOut: "Studying law or a completely different field = not deductible.", docsNeeded: ["Receipt/invoice", "Course outline showing relevance"] },
      { item: "ANMF membership fees", value: 200, tag: "Memberships", summary: "Union and professional body fees are fully deductible.", scenario: "ANMF annual fee $190 -- claimed in full, no conditions.", howTo: "Get annual tax statement from ANMF (usually emailed in July). Use that exact figure.", watchOut: "None -- ANMF is 100% work-related.", docsNeeded: ["Annual tax statement from ANMF"] },
      { item: "Work phone use (portion)", value: 200, tag: "Phone", summary: "Work-use proportion of your phone plan.", scenario: "Priya uses her phone 30% for work. Annual plan $600. Claims 30% = $180.", howTo: "Keep a 4-week usage diary in June. That % applies to the whole year.", watchOut: "Cannot claim 100% on a mixed-use phone.", docsNeeded: ["4-week usage diary", "Annual plan cost or bills"] },
    ],
    conditional: [
      { item: "Home office (70c/hr)", value: 300, tag: "Home Office", summary: "If you do admin or CPD at home, claim 67 cents per hour.", scenario: "Mia does 2hrs/week clinical notes at home. 2 x 48 x $0.70 = $64. Small but real.", howTo: "ATO fixed rate 70c/hr. Keep a time diary -- calendar entries count.", watchOut: "Cannot also separately claim internet if using fixed rate.", docsNeeded: ["Time diary showing hours worked at home"] },
      { item: "Travel between work sites", value: 400, tag: "Travel", summary: "Driving between two workplaces in one day -- not home to work.", scenario: "Jake works morning at public hospital, afternoon at private clinic. The 15km between sites is deductible. His drive from home is not.", howTo: "Cents per km method: 88c/km (2024-25), up to 5,000km. Keep a simple trip diary.", watchOut: "Home-to-work commute is NEVER deductible. ATO's top audit target.", docsNeeded: ["Trip diary: date, from, to, km, purpose"] },
      { item: "Protective shoes / compression socks", value: 150, tag: "Clothing", summary: "Only if employer specifically requires protective footwear.", scenario: "Hospital policy requires safety-rated closed-toe shoes. Emma buys $140 pair -- claimable.", howTo: "Keep receipt. Document the employer's specific requirement.", watchOut: "'Sensible shoes' recommendation ≠ claimable. Must be a specific employer requirement.", docsNeeded: ["Receipt", "Reference to employer policy"] },
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
      { item: "Medical registration (AHPRA)", value: 900, tag: "Memberships", summary: "Annual AHPRA registration is required to practise -- fully deductible.", scenario: "GP pays $890 AHPRA annual fee. Claimed in full.", howTo: "Keep AHPRA tax invoice. Claim in year of payment.", watchOut: "Initial registration to enter the profession may not be deductible -- renewals are.", docsNeeded: ["AHPRA annual tax invoice"] },
      { item: "Medical indemnity insurance (MIGA, Avant)", value: 3000, tag: "Insurance", summary: "Professional indemnity insurance is a fully deductible work expense.", scenario: "GP pays $2,800 Avant indemnity insurance. Fully deductible as a cost of earning income.", howTo: "Keep annual insurance statement. Claim in full.", watchOut: "If employer pays it -- cannot claim it personally.", docsNeeded: ["Annual insurance statement or receipt"] },
      { item: "AMA membership & CPD", value: 1500, tag: "Memberships", summary: "AMA membership and mandatory CPD hours are deductible.", scenario: "AMA fee $1,200 + CPD conference $600. Total $1,800 -- claimed in full.", howTo: "Get annual tax statement from AMA. Keep CPD receipts and attendance records.", watchOut: "CPD must relate to current specialty and role.", docsNeeded: ["AMA annual tax statement", "CPD receipts and attendance records"] },
      { item: "Medical journals & reference materials", value: 600, tag: "Education", summary: "Clinical journals and textbooks relevant to your practice.", scenario: "BMJ subscription $280, MIMS online $320. Both directly used in clinical practice -- claimed in full.", howTo: "Keep subscription receipts. Must relate to current clinical work.", watchOut: "General interest health reading doesn't qualify -- must be clinical reference.", docsNeeded: ["Subscription receipts or annual statements"] },
      { item: "Work phone & internet (portion)", value: 500, tag: "Phone", summary: "Work-use proportion of phone and internet costs.", scenario: "Doctor uses phone 60% for work (on-call, clinical apps, referrals). $1,200/yr plan x 60% = $720.", howTo: "4-week usage diary. Apply % to full year costs.", watchOut: "Must be genuinely proportioned -- 100% claim on mixed-use phone is an audit flag.", docsNeeded: ["4-week usage diary", "Annual phone and internet costs"] },
      { item: "Home office (if consulting from home)", value: 800, tag: "Home Office", summary: "Telehealth consultations from home qualify for home office expenses.", scenario: "GP does 3 telehealth sessions/day from home office, 2 days/week. 48hrs/month x 12 x $0.70 = $386.", howTo: "70c/hr ATO fixed rate. Keep time records -- calendar entries showing telehealth hours.", watchOut: "Must be genuine work hours. Checking emails on the couch doesn't count.", docsNeeded: ["Time diary showing telehealth/work hours at home"] },
    ],
    conditional: [
      { item: "Specialist equipment (stethoscope, otoscope)", value: 800, tag: "Equipment", summary: "Medical instruments you personally purchase for your practice.", scenario: "Cardiologist buys a $750 digital stethoscope. Not provided by hospital. Claims full amount (under $1,000 instant asset write-off for individuals).", howTo: "Keep receipt. Claim work-use proportion if used in mixed settings.", watchOut: "Hospital-provided equipment cannot be claimed.", docsNeeded: ["Receipt", "Note if equipment is self-funded vs employer-provided"] },
      { item: "Vehicle use (visiting patients/hospitals)", value: 1500, tag: "Travel", summary: "Travel between hospitals, clinics or to visit patients is deductible.", scenario: "GP visits nursing home patients 3 days/week. 12-week logbook shows 40% work use. Annual car costs $14,000 -> claims $5,600.", howTo: "12-week logbook for logbook method, or 88c/km for cents per km method.", watchOut: "Home-to-first-clinic is not claimable unless home is your registered principal place of business.", docsNeeded: ["12-week logbook or trip diary", "All car expense receipts if using logbook method"] },
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
      { item: "AHPRA registration", value: 400, tag: "Memberships", summary: "Annual registration required to practise -- fully deductible.", scenario: "Physio pays $380 annual AHPRA fee. Claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only -- initial registration not deductible.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "APA membership & CPD", value: 800, tag: "Memberships", summary: "Australian Physiotherapy Association membership and CPD hours.", scenario: "APA membership $520 + CPD workshop $280. Total $800 -- fully claimed.", howTo: "Annual tax statement from APA + CPD receipts.", watchOut: "CPD must relate to current area of practice.", docsNeeded: ["APA tax statement", "CPD course receipts"] },
      { item: "Professional indemnity insurance", value: 600, tag: "Insurance", summary: "Required PI insurance is fully deductible.", scenario: "Annual Avant/Guild PI policy $580. Fully deductible.", howTo: "Keep insurance renewal certificate.", watchOut: "Only if personally paid -- employer-provided cover cannot be claimed.", docsNeeded: ["Insurance renewal receipt or certificate"] },
      { item: "Clinical equipment (resistance bands, tools)", value: 400, tag: "Equipment", summary: "Portable clinical equipment you personally buy for patient use.", scenario: "Physio buys resistance bands, massage tools, assessment equipment -- $380 self-funded. Claimed in full.", howTo: "Keep receipts. Under $300 per item = instant deduction.", watchOut: "Clinic-provided equipment cannot be claimed personally.", docsNeeded: ["Receipts"] },
      { item: "Clinical textbooks & online subscriptions", value: 350, tag: "Education", summary: "Reference materials directly related to your clinical practice.", scenario: "Musculoskeletal physio subscribes to clinical database $280/yr + buys $95 textbook update. Both claimed.", howTo: "Keep receipts. Must relate to current scope of practice.", watchOut: "General wellness or fitness books don't qualify.", docsNeeded: ["Receipts or subscription history"] },
      { item: "Work uniform (if required)", value: 200, tag: "Clothing", summary: "Clinic-branded polo shirts or required scrubs.", scenario: "Clinic requires branded polo shirts. Physio buys 4 x $45 = $180. Claimed.", howTo: "Keep receipt. Must have employer logo or be a specifically required colour.", watchOut: "Generic coloured shirts without branding generally don't qualify.", docsNeeded: ["Receipt"] },
    ],
    conditional: [
      { item: "Home office", value: 250, tag: "Home Office", summary: "If you write clinical notes or admin at home.", scenario: "Physio writes notes 1.5hrs/day from home on WFH days. 1.5 x 2 days x 48 weeks x $0.70 = $96.", howTo: "70c/hr fixed rate. Keep time diary.", watchOut: "Must be genuine work. ATO may ask for evidence of a dedicated work area.", docsNeeded: ["Time diary"] },
      { item: "Travel between clinics", value: 500, tag: "Travel", summary: "Working across multiple clinic sites -- travel between them is claimable.", scenario: "Physio works morning at CBD clinic, afternoon at suburban clinic. 25km between sites x 88c x 200 days = $4,400.", howTo: "Cents per km (88c/km) or logbook method. Keep trip diary.", watchOut: "Home-to-first-clinic is commuting -- not claimable.", docsNeeded: ["Trip diary: date, route, km, purpose"] },
    ],
    notClaimable: [
      { item: "Personal gym or Pilates membership", reason: "Personal fitness expense -- even if useful for your work." },
      { item: "Home-to-clinic commute", reason: "Standard commute rule applies." },
      { item: "Anatomy or yoga gear for personal use", reason: "Personal items are not deductible even if they inform your clinical knowledge." },
    ],
  },

  paramedic: {
    avgSalary: 85000,
    claimable: [
      { item: "Union fees (ASU/HACSU)", value: 600, tag: "Memberships", summary: "Paramedic union membership is fully deductible.", scenario: "ASU annual fee $560. Claimed in full using annual tax statement.", howTo: "Get annual tax statement from your union in July.", watchOut: "100% work-related -- claim in full.", docsNeeded: ["Union annual tax statement"] },
      { item: "AHPRA registration", value: 400, tag: "Memberships", summary: "Required annual registration -- fully deductible.", scenario: "$380 AHPRA registration. Claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "Clinical CPD & recertification", value: 500, tag: "Education", summary: "Recertification courses and CPD required to maintain your registration.", scenario: "Paramedic pays $480 for required recertification course. Fully deductible.", howTo: "Keep receipt + course outline showing clinical relevance.", watchOut: "Must relate to current paramedicine role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO laundry formula for compulsory work uniforms.", scenario: "Washes uniform 4x/week x 48 weeks = 192 loads x $1 = $192. Claim $150 (cap without receipts).", howTo: "Keep weekly count. $1/load formula. No receipts needed under $150.", watchOut: "Only if uniform is compulsory and distinctive.", docsNeeded: ["Weekly laundry tally"] },
      { item: "Work boots & safety equipment", value: 300, tag: "Clothing", summary: "Safety-rated footwear and PPE required for the role.", scenario: "Safety boots $180, nitrile gloves (bulk) $45, safety glasses $35. Total $260 -- claimed.", howTo: "Keep receipts. Must be safety-rated PPE.", watchOut: "Standard sturdy footwear without safety rating doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "Uses phone 40% for work (crew comms, clinical reference apps). Plan $720/yr x 40% = $288.", howTo: "4-week usage diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed personal/work phone.", docsNeeded: ["4-week usage diary", "Annual phone costs"] },
    ],
    conditional: [
      { item: "Home office", value: 200, tag: "Home Office", summary: "If you write incident reports or admin at home.", scenario: "Paramedic writes 2hrs of incident reports at home per week. 2 x 48 x $0.70 = $64.", howTo: "70c/hr fixed rate. Keep time diary.", watchOut: "Must be genuine required work, not optional.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-station commute", reason: "Standard commute -- personal expense regardless of shift length." },
      { item: "Meals during normal shifts", reason: "Personal expense. Only deductible if receiving a declared allowance." },
      { item: "Personal fitness or gym membership", reason: "Even if fitness testing is required, general gym costs are personal unless specifically mandated." },
    ],
  },

  dentist: {
    avgSalary: 140000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Required annual registration -- fully deductible.", scenario: "$480 AHPRA registration -- claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only -- initial registration costs aren't deductible.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "ADA membership & CPD", value: 1200, tag: "Memberships", summary: "Australian Dental Association membership and mandatory CPD.", scenario: "ADA fee $950 + CPD seminar $350. Total $1,300 -- fully deductible.", howTo: "Annual tax statement from ADA + CPD receipts.", watchOut: "CPD must relate to current dental practice.", docsNeeded: ["ADA tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 2000, tag: "Insurance", summary: "PI insurance required to practise -- fully deductible.", scenario: "Annual MIGA dental PI policy $1,900. Claimed in full.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded -- employer-provided cover cannot be claimed.", docsNeeded: ["Insurance receipt or annual statement"] },
      { item: "Dental instruments & equipment", value: 800, tag: "Equipment", summary: "Personal clinical instruments you purchase for your work.", scenario: "Dentist buys a loupe and headlight set ($750) self-funded. Claimed in full (if under $1,000 effective threshold).", howTo: "Keep receipt. Over $300 = depreciate. Under $300 = instant deduction.", watchOut: "Practice-provided equipment cannot be claimed personally.", docsNeeded: ["Receipt", "Asset register for items over $300"] },
      { item: "Clinical journals & reference databases", value: 400, tag: "Education", summary: "Dental journals and clinical reference subscriptions.", scenario: "JADA online subscription $300 + clinical reference app $120. Both claimed.", howTo: "Keep receipts. Must be clinical reference material.", watchOut: "General health or science publications don't qualify.", docsNeeded: ["Subscription receipts"] },
    ],
    conditional: [
      { item: "Home office", value: 300, tag: "Home Office", summary: "Admin, billing or practice management done at home.", scenario: "Practice owner spends 3hrs/week at home on admin. 3 x 48 x $0.70 = $96.", howTo: "70c/hr fixed rate. Time diary required.", watchOut: "Must be genuine required work hours.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal dental treatment", reason: "Your own dental work is personal -- even professional courtesy discounts don't make it deductible." },
      { item: "Practice fit-out or equipment (if owner)", reason: "Capital expenses are depreciated by the practice entity, not claimed personally." },
      { item: "Commute to practice", reason: "Standard commute rule applies." },
    ],
  },

  tradie: {
    avgSalary: 90000,
    claimable: [
      { item: "Tools & equipment (under $300 each)", value: 800, tag: "Equipment", summary: "Small tools are instantly deductible in the year purchased.", scenario: "Marco buys a $180 angle grinder, $95 level set and $85 drill bits. All under $300 each -- claims $360 immediately.", howTo: "Keep receipts. Each item assessed individually. Must be used for work.", watchOut: "Don't bundle items to avoid $300 threshold. A $350 kit is one $350 item.", docsNeeded: ["Receipt per item"] },
      { item: "Vehicle costs (logbook method)", value: 3000, tag: "Vehicle", summary: "Your biggest deduction -- claim the work % of ALL car running costs.", scenario: "Dave (plumber) drives ute to job sites. 12-week logbook: 75% work. Annual car costs $12,000. Claims $9,000.", howTo: "12-week logbook -- every trip, work AND personal. Calculate business %. Apply to all car costs for 5 years.", watchOut: "Home to first job site is NOT deductible. Site-to-site is fine.", docsNeeded: ["12-week logbook (all trips)", "All car receipts: fuel, rego, insurance, servicing", "Odometer readings 1 July & 30 June"] },
      { item: "Safety boots & PPE", value: 350, tag: "Clothing", summary: "Safety-rated protective clothing required for work.", scenario: "Site requires steel-caps, hi-vis and safety glasses. Liam buys all three for $310. Fully claimable.", howTo: "Keep receipts. Must be specifically protective -- safety-rated.", watchOut: "Regular work clothes don't count even if only worn to work.", docsNeeded: ["Receipts"] },
      { item: "Union fees & trade licence renewal", value: 600, tag: "Memberships", summary: "Trade licence renewals and union fees are fully deductible.", scenario: "Electrical licence $380 + ETU union $420 = $800 claimed.", howTo: "Keep licence renewal receipt. Union sends annual tax statement in July.", watchOut: "Only income-earning portions -- trade unions are 100% work-related.", docsNeeded: ["Licence renewal receipt", "Union annual tax statement"] },
      { item: "Sunscreen & sunglasses (outdoor workers)", value: 80, tag: "Health", summary: "Sun protection for outdoor workers -- often overlooked.", scenario: "Chris works outdoors 4 days/week. Buys $35 sunscreen + $60 sunglasses. Claims $35 + 80% x $60 = $83.", howTo: "Keep receipts. ATO allows this for workers exposed to sun. Apply work % to sunglasses.", watchOut: "Cannot claim if mostly indoors. Cosmetic SPF in moisturiser doesn't count.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 300, tag: "Phone", summary: "Work-use portion of phone for job comms and quoting.", scenario: "Uses phone 50% for work (client calls, quoting apps). $840/yr x 50% = $420.", howTo: "4-week diary. Apply % to full year costs.", watchOut: "Cannot claim 100% on a mixed-use phone.", docsNeeded: ["4-week diary", "Annual phone costs"] },
    ],
    conditional: [
      { item: "Home office (quotes & admin)", value: 250, tag: "Home Office", summary: "If you do quoting, invoicing or admin at home.", scenario: "Self-employed carpenter spends 3hrs/week at home on quoting. 3 x 48 x $0.70 = $96.", howTo: "70c/hr fixed rate. Must be genuine work -- not just checking messages.", watchOut: "PAYG employees rarely qualify unless specifically required to work from home.", docsNeeded: ["Time diary or quote timestamps"] },
      { item: "Overtime meal allowance meals", value: 200, tag: "Meals", summary: "Only if your award pays you a meal allowance you declare as income.", scenario: "Ben's award pays $25 meal allowance for overtime past 7pm. He declares it as income AND claims the meal. They offset.", howTo: "Check payslip for overtime meal allowances. Declare the allowance as income, then claim the meal.", watchOut: "Cannot claim meals during normal shifts. Allowance must be declared as income first.", docsNeeded: ["Payslip showing allowance", "Meal receipt"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "ATO treats your drive to the first job as a commute. Site-to-site is fine." },
      { item: "Tools bought before this job", reason: "Deductions relate to earning your current income." },
      { item: "Traffic fines", reason: "Penalties are explicitly excluded -- even during a work trip." },
      { item: "Plain work clothes", reason: "Must be certified PPE or a distinctive uniform with employer branding." },
    ],
  },

  electrician: {
    avgSalary: 95000,
    claimable: [
      { item: "Electrical licence renewal", value: 400, tag: "Licences", summary: "Required electrical licence renewals are fully deductible.", scenario: "Electrician A-grade licence renewal $380 -- claimed in full.", howTo: "Keep licence renewal receipt from state licensing body.", watchOut: "Initial training costs to get first licence generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Tools & test equipment", value: 1200, tag: "Equipment", summary: "Multimeters, testers, hand tools -- all deductible.", scenario: "Buys Fluke multimeter $380 (depreciated), screwdriver set $85, cable stripper $55. Claims $140 instantly + depreciation on multimeter.", howTo: "Under $300 per item = instant. Over $300 = depreciate. Keep all receipts.", watchOut: "Workshop tools also used for personal projects -- must apportion.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vehicle costs (site to site)", value: 3500, tag: "Vehicle", summary: "Driving between job sites in your own vehicle -- logbook method.", scenario: "Electrician drives van to various sites. Logbook: 85% work. Van costs $18,000/yr. Claims $15,300.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first site = commute. Not deductible.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety gear & PPE", value: 350, tag: "Clothing", summary: "Safety boots, hi-vis, gloves, safety glasses.", scenario: "Buys safety boots $180, hi-vis shirts $90, insulated gloves $65. Total $335 -- claimed.", howTo: "Keep receipts. All items must be safety-rated or required PPE.", watchOut: "Standard clothing worn to work doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "ETU union fees", value: 500, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "ETU annual fee $480. Get annual tax statement.", howTo: "Annual tax statement from ETU in July.", watchOut: "100% work-related -- claim in full.", docsNeeded: ["ETU annual tax statement"] },
    ],
    conditional: [
      { item: "Home office (admin/quoting)", value: 200, tag: "Home Office", summary: "Quoting, scheduling and admin done at home.", scenario: "Sole trader electrician spends 4hrs/week on quoting from home. 4 x 48 x $0.70 = $128.", howTo: "70c/hr fixed rate. Keep time log.", watchOut: "PAYG employees need genuine employer requirement to WFH.", docsNeeded: ["Time log or diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute -- not deductible even in a work vehicle." },
      { item: "Personal vehicle modifications for aesthetics", reason: "Only functional work modifications are potentially deductible." },
      { item: "Fines and penalties", reason: "Explicitly excluded by ATO." },
    ],
  },

  plumber: {
    avgSalary: 95000,
    claimable: [
      { item: "Plumbing licence renewal", value: 400, tag: "Licences", summary: "Required licence renewals are fully deductible.", scenario: "VIC plumbing licence renewal $360 -- claimed in full.", howTo: "Keep receipt from VBA or state licensing body.", watchOut: "Initial licensing training is generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Tools & equipment", value: 1500, tag: "Equipment", summary: "Pipe cutters, wrenches, testing equipment -- tools of trade.", scenario: "Buys drain snake $420 (depreciated), pipe cutter $95, thread sealing kit $45. Instant claims $140, depreciates $420.", howTo: "Under $300 = instant. Over $300 = depreciate over effective life.", watchOut: "Tools used for personal home projects -- must apportion.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vehicle costs (logbook)", value: 3500, tag: "Vehicle", summary: "Van or ute used for work -- claim the work-use % of all costs.", scenario: "Plumber's van: 80% work use. Annual costs $16,000. Claims $12,800.", howTo: "12-week logbook. All trips. Apply business % to full year costs.", watchOut: "Home to first job = commute. Not claimable.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety boots & PPE", value: 300, tag: "Clothing", summary: "Steel caps, gloves, eye protection.", scenario: "Steel cap boots $170, work gloves $45, safety glasses $35. Total $250 -- claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular boots or clothing don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Master Plumbers or union fees", value: 500, tag: "Memberships", summary: "Industry association and union fees.", scenario: "Master Plumbers annual fee $460. Claimed from annual tax statement.", howTo: "Annual tax statement from association.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
    ],
    conditional: [
      { item: "Home office", value: 200, tag: "Home Office", summary: "Quoting and admin at home if self-employed.", scenario: "Self-employed plumber spends 3hrs/week on quoting. 3 x 48 x $0.70 = $96.", howTo: "70c/hr. Keep time diary.", watchOut: "PAYG employees need employer requirement to WFH.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute -- same as any other worker." },
      { item: "Personal plumbing supplies for home", reason: "Home materials are personal expense." },
      { item: "Fines and penalties", reason: "Explicitly excluded." },
    ],
  },

  concreter: {
    avgSalary: 85000,
    claimable: [
      { item: "Safety boots, kneepads & PPE", value: 400, tag: "Clothing", summary: "Heavy-duty safety equipment required on site.", scenario: "Steel cap boots $190, kneepads $80, safety glasses $35, hi-vis $65. Total $370 -- fully claimed.", howTo: "Keep receipts. Must be safety-rated PPE.", watchOut: "Work clothes that aren't certified safety gear don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Tools & equipment", value: 600, tag: "Equipment", summary: "Hand tools and small equipment for concreting or landscaping work.", scenario: "Trowels, floats, edgers -- $520 total, all under $300 each. Claimed instantly.", howTo: "Under $300 per item = instant deduction.", watchOut: "Shared tools -- apportion for personal use.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 3000, tag: "Vehicle", summary: "Work vehicle use -- claim the work % of all costs.", scenario: "Ute 75% work use. Annual costs $14,000. Claims $10,500.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Union fees (CFMEU)", value: 600, tag: "Memberships", summary: "CFMEU or relevant union membership -- fully deductible.", scenario: "CFMEU annual fee $560. Claimed from annual tax statement.", howTo: "Annual tax statement from CFMEU.", watchOut: "100% work-related.", docsNeeded: ["CFMEU annual tax statement"] },
      { item: "Sunscreen (outdoor worker)", value: 80, tag: "Health", summary: "Sun protection for outdoor construction workers.", scenario: "Buys SPF 50+ sunscreen regularly -- $6/week x 48 weeks = $288. Claims $80 (ATO reasonable amount).", howTo: "Keep receipts. ATO allows this specifically for outdoor workers.", watchOut: "Cannot claim cosmetic sunscreen products.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Home office", value: 150, tag: "Home Office", summary: "Admin done at home if self-employed.", scenario: "Self-employed concreter: 2hrs/week quoting at home. 2 x 48 x $0.70 = $64.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine work, not just occasional messages.", docsNeeded: ["Time diary"] },
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
      { item: "Heavy vehicle licence & medicals", value: 500, tag: "Licences", summary: "MC/HC licence renewals and mandatory medicals.", scenario: "MC licence renewal $380 + mandatory medical $120 = $500. Both required to work -- fully deductible.", howTo: "Keep receipts. Medical must be required for your licence or employer.", watchOut: "Initial training licence costs generally not deductible -- only renewals.", docsNeeded: ["Licence renewal receipt", "Medical invoice"] },
      { item: "Safety boots & PPE (hi-vis, gloves)", value: 300, tag: "Clothing", summary: "Required safety gear for your work environment.", scenario: "Steel-cap boots $180, hi-vis shirts $90, gloves $35. Total $305 -- claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothes don't qualify.", docsNeeded: ["Receipts"] },
      { item: "TWU union fees", value: 500, tag: "Memberships", summary: "Transport Workers Union membership -- fully deductible.", scenario: "TWU annual fee $480 -- claimed from annual tax statement.", howTo: "Annual tax statement from TWU in July.", watchOut: "100% work-related.", docsNeeded: ["TWU annual tax statement"] },
      { item: "Overnight meal allowances", value: 1200, tag: "Meals", summary: "Meals on overnight interstate runs -- up to ATO reasonable amounts.", scenario: "Dan runs interstate 3 nights/week. ATO reasonable meal amount ~$33/day. 120 overnight nights x $33 = $3,960 claimable.", howTo: "Check ATO's reasonable amounts table annually. Keep receipts for amounts above the threshold.", watchOut: "Day runs with no overnight stay -- meals are NOT deductible.", docsNeeded: ["Trip diary showing overnight stays", "Receipts for amounts over ATO reasonable amounts"] },
      { item: "Logbook & compliance tools", value: 150, tag: "Equipment", summary: "Electronic logbook and telematics tools for compliance.", scenario: "Subscriptions to digital logbook app $120/yr. Work-related compliance tool -- claimed.", howTo: "Keep subscription receipt.", watchOut: "Only work-related compliance tools.", docsNeeded: ["Subscription receipt"] },
    ],
    conditional: [
      { item: "Owner-operator vehicle costs", value: 5000, tag: "Vehicle", summary: "Complex -- fuel, rego, insurance, depreciation on your own truck.", scenario: "Owner-operator with prime mover: fuel $40k, insurance $8k, rego $3k, tyres $6k, depreciation $20k. Potentially $60k+ in deductions.", howTo: "Keep every receipt all year. Logbook required. Separate business and personal use. Strongly recommend a specialist transport accountant.", watchOut: "Extremely complex area. DIY risks leaving thousands on the table and audit exposure.", docsNeeded: ["All expense receipts", "Logbook", "Loan documents if applicable", "Fuel tax credit records"] },
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
      { item: "Uniform & scrubs", value: 250, tag: "Clothing", summary: "Distinctive aged care uniforms are deductible.", scenario: "Employer requires facility-branded polo shirts. Maria buys 4 x $50 = $200. Claimed.", howTo: "Keep receipt. Must be a distinctive required uniform -- not plain everyday clothing.", watchOut: "Plain clothing worn to work doesn't qualify even if employer 'suggests' it.", docsNeeded: ["Receipt", "Reference to employer uniform policy"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula $1/load -- no receipts under $150.", scenario: "Washes uniform 4x/week x 48 weeks = 192 loads x $1. Claims $150 (cap without receipts).", howTo: "Weekly count. $1/load formula. No receipts needed under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally (notes app is fine)"] },
      { item: "Union fees (HSU/ANF)", value: 400, tag: "Memberships", summary: "Healthcare union membership -- fully deductible.", scenario: "HSU annual fee $380. Annual tax statement from HSU.", howTo: "Annual tax statement from your union in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "First aid & CPR recertification", value: 150, tag: "Education", summary: "Required certifications for aged care work.", scenario: "Annual first aid renewal $140. Required by employer. Fully deductible.", howTo: "Keep receipt from training provider.", watchOut: "Must be required for your role, not optional self-improvement.", docsNeeded: ["Receipt from registered provider"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "Uses phone 25% for work (checking rosters, family liaison). $600/yr x 25% = $150.", howTo: "4-week usage diary.", watchOut: "Honest apportionment -- cannot claim 100% on a mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Travel between care facilities", value: 300, tag: "Travel", summary: "If you work across multiple facilities, inter-site travel is claimable.", scenario: "Aged care worker covers two facilities. Drives 12km between sites. 88c x 12km x 200 days = $2,112.", howTo: "Cents per km: 88c/km. Keep trip diary.", watchOut: "Home to first facility = commute. Not deductible.", docsNeeded: ["Trip diary: date, route, km, purpose"] },
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
      { item: "Cleaning uniform (if required)", value: 200, tag: "Clothing", summary: "Employer-required distinctive uniform.", scenario: "Cleaning company requires branded polo and pants. Buys 3 sets x $55 = $165. Claimed.", howTo: "Keep receipt. Must be employer-branded or specifically required colour.", watchOut: "Generic black pants or white shirts don't qualify.", docsNeeded: ["Receipt", "Employer uniform policy"] },
      { item: "Safety boots & gloves", value: 150, tag: "Clothing", summary: "Required PPE for commercial cleaning environments.", scenario: "Non-slip boots $110, heavy-duty gloves $35. Total $145 -- claimed.", howTo: "Keep receipts. Must be safety-rated or specifically required.", watchOut: "General footwear doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Union fees (UWU/HSU)", value: 300, tag: "Memberships", summary: "Cleaning industry union fees -- fully deductible.", scenario: "UWU annual fee $260. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
      { item: "Phone (work portion)", value: 120, tag: "Phone", summary: "Work-use proportion for job scheduling and client comms.", scenario: "Uses phone 20% for work. $600/yr x 20% = $120.", howTo: "4-week diary. Apply % to full year.", watchOut: "Must be honestly proportioned.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Personal cleaning supplies (if self-funded)", value: 200, tag: "Supplies", summary: "If you supply your own cleaning products for client jobs.", scenario: "Independent cleaner buys $180 in cleaning supplies monthly for client jobs -- claims the full business-use amount.", howTo: "Keep all receipts. Only claim products used for client work, not personal cleaning.", watchOut: "Employer-supplied products cannot be claimed. Own products only.", docsNeeded: ["Receipts"] },
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
      { item: "Security licence renewal", value: 300, tag: "Licences", summary: "Required annual licence renewal -- fully deductible.", scenario: "Class 1A security licence renewal $280 -- claimed in full.", howTo: "Keep receipt from state licensing body (e.g. Victoria Police, SLED).", watchOut: "Initial licence training costs generally not deductible -- only renewals.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Uniform (if required)", value: 250, tag: "Clothing", summary: "Employer-required security uniform.", scenario: "Security company requires navy pants, black shirt and cap with company logo. Buys 2 sets x $90 = $180. Claimed.", howTo: "Keep receipt. Must be distinctive employer-branded uniform.", watchOut: "Plain black clothing not specific to employer doesn't qualify.", docsNeeded: ["Receipt", "Employer uniform requirement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO $1/load formula for compulsory uniforms.", scenario: "Washes uniform 5x/week x 48 weeks = 240 loads x $1. Claims $150 (without receipts cap).", howTo: "Keep weekly tally. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Safety boots", value: 120, tag: "Clothing", summary: "Required safety footwear for security work.", scenario: "Employer requires steel-cap or specific safety-rated boots. $110 -- claimed.", howTo: "Keep receipt. Must be specifically required safety footwear.", watchOut: "General black shoes don't qualify unless safety-rated and required.", docsNeeded: ["Receipt"] },
      { item: "Union fees (United Workers/SDA)", value: 300, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "Annual fee $260. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
    ],
    conditional: [
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "If you use your personal phone for work radio communications or reporting.", scenario: "Uses phone 25% for work reporting and comms. $600/yr x 25% = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "Many security jobs provide radios -- cannot claim personal phone if employer provides comms device.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    notClaimable: [
      { item: "Personal fitness or gym costs", reason: "Even if physical fitness is expected -- personal expense." },
      { item: "Home to work site commute", reason: "Standard commute rule." },
      { item: "Meals during shifts", reason: "Personal expense unless receiving a declared meal allowance." },
    ],
  },

  delivery: {
    avgSalary: 55000,
    claimable: [
      { item: "Vehicle costs (logbook -- own car)", value: 3500, tag: "Vehicle", summary: "If you use your own vehicle for deliveries -- logbook is essential.", scenario: "Courier uses own car. 12-week logbook: 90% work. Annual car costs $13,000. Claims $11,700.", howTo: "12-week logbook -- every trip, work and personal. Apply business % to all car costs.", watchOut: "The biggest claim and the most audited. No logbook = ATO can deny the entire claim.", docsNeeded: ["12-week logbook (all trips)", "All vehicle receipts", "Odometer start and end each year"] },
      { item: "Phone (work portion)", value: 350, tag: "Phone", summary: "Phone used for navigation, delivery apps and customer comms.", scenario: "Uses phone 60% for work (DoorDash app, navigation, customer comms). $720/yr x 60% = $432.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on a mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Insulated delivery bags & equipment", value: 150, tag: "Equipment", summary: "Equipment required to perform your delivery job.", scenario: "Buys insulated bags for food delivery $120 + phone mount $30. Total $150 -- claimed.", howTo: "Keep receipts. Must be required for the job.", watchOut: "Personal bags or equipment used for personal purposes not claimable.", docsNeeded: ["Receipts"] },
      { item: "Safety vest & PPE (if required)", value: 80, tag: "Clothing", summary: "Required safety gear for delivery work.", scenario: "Warehouse delivery requires hi-vis vest and safety boots. Buys both for $130 -- claimed.", howTo: "Keep receipts. Must be specifically required.", watchOut: "Optional safety gear you choose to wear doesn't qualify.", docsNeeded: ["Receipts"] },
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
      { item: "Vehicle costs (fuel, rego, insurance)", value: 4000, tag: "Vehicle", summary: "Your biggest deduction -- work % of ALL running costs via logbook.", scenario: "Raj drives Uber full-time. 12-week logbook: 85% work. Annual car costs $14,000. Claims $11,900.", howTo: "12-week logbook -- every trip, work and personal. Apply % to all costs for 5 years.", watchOut: "Without a logbook the ATO can deny your entire vehicle claim.", docsNeeded: ["12-week logbook (all trips -- work AND personal)", "All car receipts", "Annual odometer readings 1 July & 30 June"] },
      { item: "Phone plan (work portion)", value: 400, tag: "Phone", summary: "Phone used for Uber app, navigation and passenger comms.", scenario: "Lin's plan $70/month. Uses 70% for Uber. 70% x $840/yr = $588.", howTo: "4-week diary. Apply % to full year costs.", watchOut: "Must be honest. 100% claim on mixed phone is a common audit trigger.", docsNeeded: ["4-week diary", "Annual plan cost"] },
      { item: "Water & mints for passengers", value: 150, tag: "Supplies", summary: "Passenger comfort items are deductible.", scenario: "Spends $12/month on water and mints. $144/yr -- fully deductible.", howTo: "Keep supermarket receipts. Note 'Uber passenger supplies'.", watchOut: "Keep it reasonable -- lavish gifts won't hold up.", docsNeeded: ["Supermarket receipts"] },
      { item: "Car cleaning (work portion)", value: 300, tag: "Vehicle", summary: "Cleaning costs proportional to work use.", scenario: "Washes car weekly at $15. 85% work use x $780/yr = $663.", howTo: "Apply logbook work % to annual cleaning costs.", watchOut: "Don't claim 100% -- apply your logbook percentage.", docsNeeded: ["Receipts", "Apply logbook business %"] },
      { item: "Tolls on work trips", value: 400, tag: "Travel", summary: "Tolls incurred during rideshare trips.", scenario: "CityLink tolls during fares: $8/day x 200 work days = $1,600 in work tolls -- fully deductible.", howTo: "Check e-TAG trip history and separate work trips from personal. Keep records.", watchOut: "Personal tolls (your own travel) are not deductible.", docsNeeded: ["e-TAG records or trip receipts", "Work trip identification"] },
    ],
    conditional: [
      { item: "GST credits on fuel", value: 500, tag: "GST", summary: "Rideshare drivers must be GST registered -- claim credits on fuel.", scenario: "Annual fuel $5,000 incl $454 GST. Claims $454 back on BAS.", howTo: "Must be registered for GST and lodging BAS quarterly. Claim on BAS.", watchOut: "Separate from your tax return. Missing this is leaving hundreds on the table.", docsNeeded: ["GST registration", "Quarterly BAS lodgements", "Fuel receipts showing GST"] },
    ],
    notClaimable: [
      { item: "Personal car trips", reason: "Only work-use portion is claimable -- established by your logbook." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
      { item: "Car loan principal repayments", reason: "Loan principal is not deductible. Interest on the loan may be -- see a tax agent." },
    ],
  },

  lawyer: {
    avgSalary: 130000,
    claimable: [
      { item: "Practising certificate renewal", value: 700, tag: "Licences", summary: "Required annual practising certificate -- fully deductible.", scenario: "VIC practising certificate renewal $680 -- claimed in full.", howTo: "Keep receipt from Law Institute of Victoria or relevant bar association.", watchOut: "Initial admission costs are generally not deductible -- only ongoing renewal.", docsNeeded: ["Practising certificate renewal receipt"] },
      { item: "Law Institute / Bar Association membership", value: 800, tag: "Memberships", summary: "Professional body membership -- fully deductible.", scenario: "LIV annual membership $750 -- claimed using annual tax statement.", howTo: "Annual tax statement from LIV or relevant body.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "CPD points & legal courses", value: 1000, tag: "Education", summary: "Mandatory CPD and practice-area upskilling.", scenario: "Pays $400 for a property law CPD seminar + $650 online course. Both relate to current practice area. Claimed.", howTo: "Keep receipts + course descriptions. Must relate to current practice area.", watchOut: "Studying for a completely different area of law = borderline. Current specialty is safest.", docsNeeded: ["Receipts", "Course outlines"] },
      { item: "Legal databases & subscriptions", value: 1200, tag: "Software", summary: "LexisNexis, Westlaw, Practical Law -- if personally subscribed.", scenario: "Personal LexisNexis subscription $1,100/yr for research work. Fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed -- not employer-provided.", watchOut: "If employer provides access -- cannot claim personal subscription.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH portion)", value: 1000, tag: "Home Office", summary: "Lawyers who WFH or do after-hours work at home.", scenario: "Lawyer works from home 2 days/week + 2hrs/night on matters. ~6hrs/day WFH. 6 x 2 x 48 x $0.70 = $386.", howTo: "70c/hr fixed rate. Time diary. Calendar records of WFH days work.", watchOut: "Cannot separately claim internet or electricity if using fixed rate.", docsNeeded: ["Time diary or WFH calendar records"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Work-use proportion of phone and internet.", scenario: "Uses phone 50% for work. $1,200/yr plan x 50% = $600.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if claiming fixed rate home office method.", docsNeeded: ["4-week diary", "Annual phone/internet cost"] },
    ],
    conditional: [
      { item: "Vehicle costs (court appearances, client visits)", value: 1000, tag: "Travel", summary: "Travel to courts, client sites or other offices -- not your main office.", scenario: "Lawyer drives to court 3 days/week. 12-week logbook: 35% work. Annual car costs $12,000. Claims $4,200.", howTo: "Logbook method or 88c/km cents per km.", watchOut: "Home to main office = commute. Office to court = deductible.", docsNeeded: ["Trip diary or 12-week logbook", "Vehicle receipts if logbook method"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule applies even for demanding legal work schedules." },
      { item: "Client entertainment (generally)", reason: "ATO is very strict. Must directly connect to earning specific income." },
      { item: "Bar exams or initial admission", reason: "Costs to enter the profession are not deductible -- only ongoing maintenance." },
    ],
  },

  engineer: {
    avgSalary: 110000,
    claimable: [
      { item: "Engineers Australia membership", value: 500, tag: "Memberships", summary: "Professional body membership -- fully deductible.", scenario: "Engineers Australia annual fee $480. Claimed using annual tax statement.", howTo: "Annual tax statement from Engineers Australia.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "CPEng or NER registration", value: 300, tag: "Memberships", summary: "Professional registration required for engineering practice.", scenario: "CPEng annual renewal $280 -- claimed.", howTo: "Keep renewal receipt.", watchOut: "Initial assessment costs may not be deductible -- renewals are.", docsNeeded: ["Renewal receipt"] },
      { item: "Technical CPD & conferences", value: 800, tag: "Education", summary: "Continuing professional development in your engineering discipline.", scenario: "Structural engineer pays $750 for an industry conference and technical workshop. Directly related -- claimed.", howTo: "Keep receipts and event descriptions.", watchOut: "Must relate to your current engineering discipline and role.", docsNeeded: ["Receipts", "Event descriptions"] },
      { item: "Technical software subscriptions", value: 600, tag: "Software", summary: "CAD, structural analysis or other work software subscribed personally.", scenario: "Personal AutoCAD subscription $580/yr for after-hours project work. Fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "Engineers who WFH regularly -- claim 70c/hr.", scenario: "Civil engineer WFH 3 days/week. 3 x 8 x 48 x $0.70 = $773.", howTo: "70c/hr fixed rate. Time diary or calendar records.", watchOut: "Cannot also claim internet separately.", docsNeeded: ["Time diary or calendar WFH records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion of phone.", scenario: "Uses phone 40% for work. $900/yr x 40% = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment required.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Vehicle costs (site visits)", value: 1500, tag: "Travel", summary: "Travel to construction sites, client locations or inspections.", scenario: "Site engineer visits 3 sites/week. Logbook: 45% work. Annual car costs $12,000. Claims $5,400.", howTo: "12-week logbook or 88c/km method.", watchOut: "Office to site = deductible. Home to office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "PPE for site visits", value: 200, tag: "Clothing", summary: "Safety gear for visiting construction or industrial sites.", scenario: "Hard hat, hi-vis, steel caps required for site visits. Total $180 -- claimed.", howTo: "Keep receipts. Must be required for site access.", watchOut: "If employer provides PPE -- cannot claim personally.", docsNeeded: ["Receipts"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal software for hobby projects", reason: "Work software only -- personal use portion must be excluded." },
      { item: "Initial engineering degree costs", reason: "Costs to enter the profession are not deductible." },
    ],
  },

  hr: {
    avgSalary: 95000,
    claimable: [
      { item: "AHRI membership & CPD", value: 600, tag: "Memberships", summary: "Australian HR Institute membership and professional development.", scenario: "AHRI annual membership $520 + webinar series $180. Total $700 -- claimed.", howTo: "Annual tax statement from AHRI + CPD receipts.", watchOut: "Must relate to current HR role.", docsNeeded: ["AHRI tax statement", "CPD receipts"] },
      { item: "HR software & subscriptions", value: 400, tag: "Software", summary: "Personal subscriptions to HR tools or platforms.", scenario: "Personal LinkedIn Learning subscription $240/yr for HR upskilling. Fully deductible.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "HR professionals who WFH regularly.", scenario: "HR Manager WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,031.", howTo: "70c/hr fixed rate. Time diary.", watchOut: "Cannot also claim internet separately.", docsNeeded: ["Time diary or calendar WFH records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion of phone.", scenario: "Uses phone 40% for work. $900/yr x 40% = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Employment law books & resources", value: 300, tag: "Education", summary: "Work-related legal and HR reference materials.", scenario: "Buys FairWork handbook update $85 + employment law reference $220. Directly work-related -- claimed.", howTo: "Keep receipts. Must relate to current HR role.", watchOut: "General management or leadership books are borderline.", docsNeeded: ["Receipts"] },
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
      { item: "Technical courses & subscriptions", value: 800, tag: "Education", summary: "Udemy, Pluralsight, O'Reilly, conference tickets.", scenario: "Alex: AWS cert course $300 + Pluralsight $200 + dev conference $350 = $850 -- all work-relevant.", howTo: "Keep receipts. Must relate to current tech stack or role.", watchOut: "Learning an entirely new field for a career change = not deductible.", docsNeeded: ["Receipts", "Course description if relevance isn't obvious"] },
      { item: "Home office (WFH hours)", value: 1200, tag: "Home Office", summary: "Most devs WFH -- your most consistent annual deduction.", scenario: "Full-time WFH dev: 5 days x 8hrs x 48 weeks x $0.70 = $1,285.", howTo: "70c/hr. Time diary or calendar records.", watchOut: "Cannot also claim internet separately if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Software subscriptions (GitHub, Figma, Jira)", value: 600, tag: "Software", summary: "Work tools you personally subscribe to.", scenario: "GitHub Pro $48 + JetBrains $250 + Figma $180 = $478 -- fully deductible.", howTo: "Keep subscription receipts. Must be personally subscribed for work.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts or annual statements"] },
      { item: "Monitor, keyboard, peripherals", value: 800, tag: "Equipment", summary: "WFH equipment -- claim the work-use proportion.", scenario: "Buys $450 monitor (depreciated) + $120 keyboard (instant). 80% work. $96 now + depreciation on monitor.", howTo: "Under $300 = instant. Over $300 = depreciate. Apply work-use %.", watchOut: "Gaming peripherals or items also used personally -- must apportion.", docsNeeded: ["Receipts", "Work-use % calculation"] },
      { item: "Phone & internet (work portion)", value: 600, tag: "Phone", summary: "Work-use portion of phone and internet.", scenario: "Uses phone 50% for work + internet 60% for work. Separate diary for each.", howTo: "4-week diary for phone. If NOT using fixed rate -- also claim internet separately.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual phone and internet costs"] },
    ],
    conditional: [
      { item: "Laptop or computer", value: 1000, tag: "Equipment", summary: "Work portion of personal computer.", scenario: "Jamie's MacBook $2,400. 70% work. $1,680 deductible -- depreciated over 2 years = ~$840/yr.", howTo: "Calculate honest work-use %. Depreciate over effective life (2-3 years for laptops).", watchOut: "Claiming 100% on a laptop used for Netflix and gaming = audit flag.", docsNeeded: ["Receipt", "Work-use % with brief diary"] },
    ],
    notClaimable: [
      { item: "Personal streaming (Netflix, Spotify)", reason: "Not deductible even as background music while coding." },
      { item: "Home internet if claiming fixed rate", reason: "The 70c/hr fixed rate already includes internet -- can't claim it twice." },
      { item: "Gaming equipment", reason: "Unless you're a professional game developer and it's specifically required." },
    ],
  },

  accountant: {
    avgSalary: 90000,
    claimable: [
      { item: "CPA / CA ANZ membership & CPD", value: 1200, tag: "Memberships", summary: "Professional body membership and mandatory CPD.", scenario: "CPA annual fee $890 + CPD course $350 = $1,240 -- claimed.", howTo: "Annual tax statement from CPA or CA ANZ. CPD receipts.", watchOut: "CPD must relate to current accounting role.", docsNeeded: ["Annual tax statement", "CPD receipts"] },
      { item: "TPB registration (tax agents)", value: 300, tag: "Memberships", summary: "Tax Practitioners Board registration -- required to give tax advice.", scenario: "$280 TPB annual renewal -- claimed in full.", howTo: "Keep TPB renewal receipt.", watchOut: "Only for registered tax agents.", docsNeeded: ["TPB renewal receipt"] },
      { item: "Accounting software subscriptions", value: 500, tag: "Software", summary: "Work software personally subscribed to.", scenario: "Personal Xero $480 + Tax Act $340 -- both work-related, both claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed personally.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional journals & resources", value: 300, tag: "Education", summary: "Technical accounting and tax publications.", scenario: "CCH online $280 + Tax Institute webinars $180. Claimed.", howTo: "Keep receipts. Must relate to current accounting work.", watchOut: "General finance or investment reading doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Home office (WFH hours)", value: 800, tag: "Home Office", summary: "WFH accountants -- 70c/hr adds up.", scenario: "Full-time WFH: 5 x 8 x 48 x $0.70 = $1,285.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
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
      { item: "Classroom supplies (self-funded)", value: 300, tag: "Supplies", summary: "Resources bought out of pocket for students.", scenario: "Emma spends $280 on books, markers and printed worksheets. School doesn't reimburse. Claims $280.", howTo: "Keep receipts. Only claim what employer hasn't reimbursed.", watchOut: "If your school has a supply budget and you chose not to use it -- risky.", docsNeeded: ["Receipts", "Note that employer did not reimburse"] },
      { item: "VIT registration or state equivalent", value: 200, tag: "Memberships", summary: "Required teaching registration -- fully deductible.", scenario: "VIT fee $195. Claimed in full.", howTo: "Keep VIT tax invoice.", watchOut: "Renewals only.", docsNeeded: ["VIT tax invoice"] },
      { item: "Union fees (AEU/IEU)", value: 400, tag: "Memberships", summary: "Teaching union fees -- fully deductible.", scenario: "AEU annual fee $380. Annual tax statement claimed.", howTo: "Annual tax statement from union in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Work-related books & teaching resources", value: 250, tag: "Education", summary: "Subject-specific books and curriculum resources.", scenario: "Science teacher buys $65 textbook + $120/yr curriculum platform subscription. Both claimed.", howTo: "Keep receipts. Must relate to your current teaching subjects.", watchOut: "General education theory books are borderline.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion for parent/school comms.", scenario: "Uses phone 25% for work. $720/yr x 25% = $180.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Home office (marking & lesson planning)", value: 400, tag: "Home Office", summary: "Most teachers genuinely WFH -- don't leave this unclaimed.", scenario: "Michael marks 2hrs/night x 4 nights x 40 term weeks x $0.70 = $214.", howTo: "70c/hr fixed rate. Time diary -- calendar entries count.", watchOut: "Must be genuine work hours, not just being 'available'.", docsNeeded: ["Time diary or calendar entries"] },
      { item: "Laptop or tablet (work portion)", value: 500, tag: "Equipment", summary: "Personal device used for teaching prep -- claim work-use proportion.", scenario: "Rachel uses laptop 60% for work. Laptop cost $1,200. Claims $720 over 3 years = $240/yr.", howTo: "Calculate honest work-use %. Depreciate over effective life.", watchOut: "If school provides a device -- must show why personal device is also necessary.", docsNeeded: ["Receipt", "Work-use % calculation"] },
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
      { item: "Camera, lighting & studio equipment", value: 2000, tag: "Equipment", summary: "Production equipment used to create content -- your main deduction.", scenario: "Buys mirrorless camera $1,800 (depreciated), ring light $150 (instant), tripod $95 (instant). Claims $245 now + depreciates camera.", howTo: "Under $300 per item = instant. Over $300 = depreciate. Must be used for content creation.", watchOut: "Camera also used for personal holidays -- must apportion honestly.", docsNeeded: ["Receipts", "Asset register for items over $300", "Work-use % calculation"] },
      { item: "Software subscriptions (Adobe, Canva Pro)", value: 600, tag: "Software", summary: "Editing and design software for content production.", scenario: "Adobe Creative Cloud $660/yr + Canva Pro $180/yr = $840. Both used for content creation -- claimed.", howTo: "Keep subscription receipts. Personal editing for fun must be excluded.", watchOut: "Apportion if used for personal creative projects too.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office / studio space", value: 800, tag: "Home Office", summary: "Dedicated studio or home office for content creation.", scenario: "Content creator uses dedicated room as studio. 70c/hr x 6hrs/day x 5 days x 48 weeks = $965. OR actual costs method if room is exclusively used.", howTo: "Fixed rate 70c/hr OR if room is exclusive to business -- claim actual proportion of rent/utilities.", watchOut: "Room must be genuinely dedicated to work. Dual-use room = fixed rate only.", docsNeeded: ["Time diary", "If exclusive: rent/mortgage and utility bills"] },
      { item: "Platform fees & subscriptions", value: 300, tag: "Software", summary: "Scheduling tools, analytics platforms, creator tools.", scenario: "Hootsuite $360/yr + TubeBuddy $120/yr. Both business tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal social media use cannot be included.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Phone and internet used for content creation and posting.", scenario: "Creator uses phone 70% for work. $900/yr plan x 70% = $630. Internet 60% work = $720 x 60% = $432.", howTo: "4-week diary for phone. If NOT using fixed rate home office -- also claim internet separately.", watchOut: "Cannot claim internet separately if using fixed rate home office method.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Props, wardrobe & set items", value: 500, tag: "Supplies", summary: "Items purchased specifically for use in content -- not personal use.", scenario: "Fashion creator buys $400 in outfits exclusively used for sponsored content shoots. Fully deductible.", howTo: "Keep receipts. Must be exclusively or predominantly for content creation, not personal use.", watchOut: "Clothing you also wear personally = cannot claim. Exclusive content props = fine.", docsNeeded: ["Receipts", "Note that items are exclusively for content"] },
      { item: "Travel for content (locations, events)", value: 600, tag: "Travel", summary: "Travel to shooting locations or industry events -- if primarily work.", scenario: "Travel blogger travels interstate to create destination content. Airfare $350 + accommodation $280. Primary purpose = work. Claimed.", howTo: "Primary purpose of the trip must be content creation. Keep all receipts.", watchOut: "Mixing a holiday with content creation -- ATO may apportion or deny. Document the work purpose clearly.", docsNeeded: ["All receipts", "Evidence of work purpose (shooting schedule, brand brief)"] },
    ],
    notClaimable: [
      { item: "Personal clothing for everyday wear", reason: "Must be exclusively for content -- cannot claim clothes also worn personally." },
      { item: "Meals and entertainment (generally)", reason: "Personal expense unless specifically required for content (e.g. food reviewer -- even then, strict rules apply)." },
      { item: "Personal Netflix or streaming for 'research'", reason: "ATO does not accept personal entertainment as a research deduction." },
    ],
  },

  photographer: {
    avgSalary: 65000,
    claimable: [
      { item: "Camera bodies & lenses", value: 2500, tag: "Equipment", summary: "Core professional equipment -- your biggest deduction.", scenario: "Buys Sony A7 body $2,800 (depreciated over 3 years = $933/yr) + 50mm lens $600 (depreciated). Both used professionally.", howTo: "Over $300 = depreciate over effective life. Keep all receipts. Apply work-use % if mixed personal use.", watchOut: "Equipment also used for personal photography -- must apportion honestly.", docsNeeded: ["Receipts", "Asset register", "Work-use % calculation"] },
      { item: "Editing software (Adobe, Capture One)", value: 700, tag: "Software", summary: "Post-production software subscriptions.", scenario: "Adobe Photography Plan $240/yr + Capture One $250/yr = $490. Both work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal hobby editing must be excluded from the claim.", docsNeeded: ["Subscription receipts"] },
      { item: "Photography accessories (bags, tripods, lighting)", value: 600, tag: "Equipment", summary: "Professional accessories under $300 each -- instant deductions.", scenario: "Camera bag $180, portable flash $220, memory cards $85. All under $300 -- claimed instantly.", howTo: "Under $300 per item = instant deduction. Keep receipts.", watchOut: "Personal accessories (used for holidays) must be excluded.", docsNeeded: ["Receipts"] },
      { item: "Website & portfolio hosting", value: 300, tag: "Software", summary: "Professional website and portfolio to attract clients.", scenario: "Squarespace business plan $240/yr + domain $25/yr = $265. Business tool -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal website not used to attract clients doesn't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional indemnity insurance", value: 400, tag: "Insurance", summary: "PI insurance for professional photography work.", scenario: "Annual PI policy $380 -- claimed in full.", howTo: "Keep insurance receipt or certificate.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Client comms, social media marketing, work-use proportion.", scenario: "Uses phone 50% for work. $900/yr x 50% = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Vehicle costs (to shooting locations)", value: 1500, tag: "Travel", summary: "Driving to client shoots, weddings, events.", scenario: "Wedding photographer drives to 60 weddings/year + scouting. Logbook: 55% work. Annual car costs $10,000. Claims $5,500.", howTo: "12-week logbook or 88c/km method.", watchOut: "Home to first client = commute unless home is registered business address.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook method"] },
      { item: "Wardrobe for professional shoots", value: 300, tag: "Clothing", summary: "Professional attire required for high-end client work.", scenario: "Wedding photographer buys black suit specifically for weddings ($380). Depreciated over 3 years if claiming work-use %.", howTo: "Must be specifically required for professional shoots, not everyday wear. Document work purpose.", watchOut: "Borderline -- ATO may challenge clothing that can be worn personally.", docsNeeded: ["Receipt", "Note that item is exclusively for professional shoots"] },
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
      { item: "Real estate licence & renewal fees", value: 500, tag: "Licences", summary: "Required licence renewals -- fully deductible.", scenario: "CPV licence renewal $450 -- claimed in full.", howTo: "Keep receipt from Consumer Affairs VIC or state equivalent.", watchOut: "Initial licence training costs generally not deductible -- renewals are.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Vehicle costs (open homes, client visits)", value: 3500, tag: "Vehicle", summary: "Driving to properties and client meetings -- your biggest deduction.", scenario: "Mia drives 28,000km/yr. Logbook: 80% work. Annual car costs $15,000. Claims $12,000.", howTo: "12-week logbook. Every trip. Apply business % to all running costs.", watchOut: "Office to property = fine. Home to office = commute.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "REIV membership", value: 600, tag: "Memberships", summary: "Real Estate Institute membership -- fully deductible.", scenario: "REIV annual fee $580. Claimed from annual tax statement.", howTo: "Annual tax statement from REIV.", watchOut: "100% work-related.", docsNeeded: ["REIV annual tax statement"] },
      { item: "Personal brand marketing", value: 800, tag: "Marketing", summary: "Self-funded advertising for your personal agent brand.", scenario: "Tom: $600 letterbox drops + $250 professional headshot. Both build his personal brand -- claimed.", howTo: "Keep receipts. Must be YOUR marketing, not the agency's.", watchOut: "Agency-paid marketing doesn't count as your personal expense.", docsNeeded: ["Receipts with description"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Heavy phone use for client comms -- claim work portion.", scenario: "Uses phone 65% for work. $1,200/yr x 65% = $780.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual phone and internet costs"] },
      { item: "CPD & courses", value: 600, tag: "Education", summary: "Mandatory CPD and property-related upskilling.", scenario: "CPD seminar $350 + property investment course $280. Both work-relevant -- claimed.", howTo: "Keep receipts and course descriptions.", watchOut: "Must relate to current real estate role.", docsNeeded: ["Receipts", "Course descriptions"] },
    ],
    conditional: [
      { item: "Client entertainment (strictly limited)", value: 300, tag: "Meals", summary: "ATO scrutinises this heavily -- must directly connect to income.", scenario: "Taking a vendor to lunch to discuss a listing: potentially claimable. Christmas client lunch for goodwill: generally not.", howTo: "Keep receipt AND diary: who attended, business discussed, direct income connection.", watchOut: "General goodwill entertainment almost never holds up to ATO scrutiny.", docsNeeded: ["Receipt", "Diary note: who, what, income connection"] },
      { item: "Home office", value: 400, tag: "Home Office", summary: "Admin and after-hours work done at home.", scenario: "Works from home 2hrs most evenings on contracts and admin. 2 x 5 x 48 x $0.70 = $322.", howTo: "70c/hr. Time diary.", watchOut: "Cannot claim internet separately if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal dining or entertainment", reason: "Must meet strict ATO entertainment test -- goodwill dining almost never qualifies." },
      { item: "Unbranded clothing (suits)", reason: "Must be a required distinctive branded uniform. Suits are personal." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
    ],
  },

  chef: {
    avgSalary: 65000,
    claimable: [
      { item: "Chef's whites & kitchen uniform", value: 300, tag: "Clothing", summary: "Distinctive required kitchen uniforms.", scenario: "Restaurant requires white double-breasted jacket and checked pants. Cost $280 -- distinctive and required -- claimed.", howTo: "Keep receipt. Must be distinctive -- not plain clothing.", watchOut: "Generic black pants worn both to and from work don't qualify.", docsNeeded: ["Receipt"] },
      { item: "Knife set & kitchen tools", value: 500, tag: "Equipment", summary: "Personal knife set and kitchen tools -- tools of trade.", scenario: "Head chef buys Global knife set $380. Over $300 -- depreciated over 5 years. Year 1 claim: ~$76.", howTo: "Under $300 = instant. Over $300 = depreciate over effective life (knives: ~5 years).", watchOut: "Knives owned before this job can't be claimed.", docsNeeded: ["Receipt", "Asset register for items over $300"] },
      { item: "Food safety certificates", value: 200, tag: "Education", summary: "Required compliance certifications.", scenario: "Food Handler Certificate renewal $150 -- required by employer -- claimed.", howTo: "Keep receipt from registered training provider.", watchOut: "Must be required for current role.", docsNeeded: ["Receipt from training provider"] },
      { item: "Non-slip safety shoes", value: 150, tag: "Clothing", summary: "Required safety footwear for kitchen environments.", scenario: "Restaurant requires non-slip safety shoes. Emma buys $130 pair -- claimed.", howTo: "Keep receipt. Must be required safety footwear, not general comfort shoes.", watchOut: "'Comfortable shoes' without a specific safety requirement don't qualify.", docsNeeded: ["Receipt"] },
      { item: "Culinary courses & upskilling", value: 400, tag: "Education", summary: "Courses that improve skills in your current cooking role.", scenario: "Sous chef pays $380 for a pastry masterclass directly relevant to current role -- claimed.", howTo: "Keep receipt and course description. Must relate to current role.", watchOut: "Business management courses to open your own restaurant = career change = not deductible.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO $1/load formula for compulsory kitchen uniforms.", scenario: "Washes uniform 5x/week x 48 weeks = 240 loads x $1. Claims $150 (cap without receipts).", howTo: "Keep weekly tally. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
    ],
    conditional: [
      { item: "Cookbooks & culinary publications", value: 150, tag: "Education", summary: "Reference books relevant to your current cuisine and role.", scenario: "Japanese cuisine chef buys $120 specialist Japanese cookbook. Directly relevant to current role -- claimed.", howTo: "Keep receipt. Must relate to current cooking style or role.", watchOut: "General cookbook collection for personal interest doesn't qualify.", docsNeeded: ["Receipt", "Note relevance to current role"] },
    ],
    notClaimable: [
      { item: "Home-to-kitchen commute", reason: "Standard commute rule." },
      { item: "Meals eaten during shifts", reason: "Personal expense. Staff meals provided by employer may have FBT implications -- but that's the employer's issue." },
      { item: "Personal cooking equipment at home", reason: "Home kitchen equipment is personal." },
    ],
  },

  pharmacist: {
    avgSalary: 105000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", atoUrl: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/memberships-accreditations-fees-and-commissions/professional-memberships-and-accreditations", summary: "Annual AHPRA registration required to practise.", scenario: "Pharmacist pays $480 AHPRA renewal -- claimed in full.", howTo: "Keep AHPRA tax invoice. Claim in year paid.", watchOut: "Renewals only -- initial registration not deductible.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "PSA membership & CPD", value: 900, tag: "Memberships", summary: "Pharmaceutical Society membership and mandatory CPD.", scenario: "PSA annual fee $820 + CPD conference $280 = $1,100. Claimed.", howTo: "Annual tax statement from PSA + CPD receipts.", watchOut: "CPD must relate to current pharmacist role.", docsNeeded: ["PSA tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 800, tag: "Insurance", summary: "PI insurance required to practise -- fully deductible.", scenario: "Annual MIGA/Guild policy $750 -- claimed in full.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded -- employer-provided cover cannot be claimed.", docsNeeded: ["Insurance receipt"] },
      { item: "Pharmacy journals & clinical databases", value: 500, tag: "Education", summary: "Clinical reference materials directly related to practice.", scenario: "MIMS online $380/yr + pharmacy journal $150/yr. Both claimed.", howTo: "Keep subscription receipts.", watchOut: "General health reading doesn't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Work uniform / pharmacy coat", value: 200, tag: "Clothing", summary: "Employer-required pharmacy coat or branded uniform.", scenario: "Pharmacy requires branded white coat. Buys 2 x $85 = $170. Claimed.", howTo: "Keep receipt. Must be distinctive employer-branded.", watchOut: "Generic white coat without branding is borderline.", docsNeeded: ["Receipt"] },
      { item: "Phone (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion for patient comms and clinical queries.", scenario: "Uses phone 30% for work. $720/yr x 30% = $216.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment required.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Home office (WFH admin)", value: 250, tag: "Home Office", summary: "If you do CPD or admin at home.", scenario: "2hrs/week CPD at home. 2 x 48 x $0.70 = $67.", howTo: "70c/hr fixed rate. Keep time diary.", watchOut: "Must be genuine work, not just reading for interest.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-pharmacy commute", reason: "Standard commute rule." },
      { item: "Personal medications", reason: "Your own health costs are personal." },
      { item: "Gym membership", reason: "Personal expense." },
    ],
  },

  psychologist: {
    avgSalary: 95000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Annual registration required to practise.", scenario: "$480 AHPRA renewal -- claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "APS membership & CPD", value: 800, tag: "Memberships", summary: "Australian Psychological Society membership and CPD.", scenario: "APS annual fee $700 + CPD workshop $200 = $900. Claimed.", howTo: "Annual tax statement from APS + CPD receipts.", watchOut: "CPD must relate to current clinical role.", docsNeeded: ["APS tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 700, tag: "Insurance", summary: "PI insurance required for clinical practice.", scenario: "Annual policy $650 -- claimed in full.", howTo: "Keep insurance receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Clinical supervision fees", value: 1200, tag: "Education", summary: "Mandatory supervision required for registration maintenance.", scenario: "Monthly supervision sessions $120 x 10 = $1,200. Required for provisionally registered psychologists.", howTo: "Keep receipts from supervisor. Must be required for your registration or practice.", watchOut: "Optional mentoring or personal therapy is not deductible.", docsNeeded: ["Receipts from supervisor"] },
      { item: "Psychology books & journals", value: 400, tag: "Education", summary: "Clinical reference materials.", scenario: "DSM-5 update $180 + clinical journal subscription $220. Both claimed.", howTo: "Keep receipts. Must relate to current clinical work.", watchOut: "Self-help or personal interest books don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Home office (client notes, reports)", value: 800, tag: "Home Office", summary: "Writing clinical notes and reports at home.", scenario: "3hrs/day writing notes at home. 3 x 5 x 48 x $0.70 = $504.", howTo: "70c/hr fixed rate. Keep time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Personal therapy (if required for registration)", value: 600, tag: "Education", summary: "Some registrations require personal therapy -- partially deductible.", scenario: "Provisionally registered psychologist pays $150/session for required personal therapy. Claimed as self-education.", howTo: "Must be specifically required by your training program or supervisor. Keep receipts.", watchOut: "Personal therapy for your own wellbeing (not required) is not deductible.", docsNeeded: ["Receipt", "Evidence it is required by training program"] },
    ],
    notClaimable: [
      { item: "Home-to-clinic commute", reason: "Standard commute rule." },
      { item: "Personal therapy for self-care", reason: "Must be required for registration -- voluntary therapy is personal." },
      { item: "General self-help or wellness books", reason: "Must relate to your clinical practice area." },
    ],
  },

  optometrist: {
    avgSalary: 100000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Annual registration required to practise.", scenario: "$480 AHPRA renewal -- claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "Optometry Australia membership & CPD", value: 700, tag: "Memberships", summary: "Professional body membership and mandatory CPD.", scenario: "OA annual fee $600 + CPD workshop $180 = $780. Claimed.", howTo: "Annual tax statement from OA + CPD receipts.", watchOut: "CPD must relate to current optometry role.", docsNeeded: ["OA tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 800, tag: "Insurance", summary: "PI insurance required to practise.", scenario: "Annual Avant/Guild policy $760 -- claimed in full.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Clinical instruments & equipment", value: 500, tag: "Equipment", summary: "Personal clinical equipment for patient examinations.", scenario: "Buys hand-held ophthalmoscope $380 (depreciated) + trial lenses $120 (instant). Claims split.", howTo: "Under $300 = instant. Over $300 = depreciate over effective life.", watchOut: "Practice-provided equipment cannot be claimed.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Clinical journals & databases", value: 400, tag: "Education", summary: "Optometry and ophthalmology clinical references.", scenario: "Clinical journal subscription $350/yr. Claimed.", howTo: "Keep subscription receipts.", watchOut: "General health publications don't qualify.", docsNeeded: ["Subscription receipts"] },
    ],
    conditional: [
      { item: "Home office", value: 300, tag: "Home Office", summary: "Admin and CPD done at home.", scenario: "2hrs/week CPD and admin at home. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Keep time diary.", watchOut: "Must be genuine work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal glasses or contact lenses", reason: "Your own eyewear is personal -- even as an optometrist." },
      { item: "Home-to-practice commute", reason: "Standard commute rule." },
    ],
  },

  radiographer: {
    avgSalary: 90000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Annual registration required to practise.", scenario: "$480 AHPRA renewal -- claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "ASMIRT / AIR membership & CPD", value: 600, tag: "Memberships", summary: "Professional society membership and mandatory CPD.", scenario: "ASMIRT annual fee $520 + CPD course $180 = $700. Claimed.", howTo: "Annual tax statement + CPD receipts.", watchOut: "CPD must relate to current role.", docsNeeded: ["Tax statement", "CPD receipts"] },
      { item: "Work uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for hospital scrubs.", scenario: "Washes scrubs 4x/week. 192 loads x $1 = $192. Claims $150.", howTo: "$1/load formula. No receipts under $150.", watchOut: "Must be a distinctive required uniform.", docsNeeded: ["Weekly tally"] },
      { item: "Radiation safety resources", value: 200, tag: "Education", summary: "Safety compliance resources and dosimetry knowledge.", scenario: "Radiation safety manual $180 + online resource $60. Claimed.", howTo: "Keep receipts. Must relate to current practice.", watchOut: "General interest publications don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Work-use proportion.", scenario: "25% work use on $600/yr plan = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Travel between imaging facilities", value: 400, tag: "Travel", summary: "If you work across multiple sites.", scenario: "Works at 2 hospitals. 88c x 20km x 150 trips = $2,640.", howTo: "Cents per km (88c/km). Keep trip diary.", watchOut: "Home to first site = commute.", docsNeeded: ["Trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-hospital commute", reason: "Standard commute rule." },
      { item: "Personal health costs", reason: "Personal expense." },
    ],
  },

  dietitian: {
    avgSalary: 80000,
    claimable: [
      { item: "APD registration & DAA membership", value: 600, tag: "Memberships", summary: "Accredited Practising Dietitian registration and Dietitians Australia membership.", scenario: "DAA annual fee $550 + APD credential renewal $60 = $610. Claimed.", howTo: "Annual tax statement from DAA.", watchOut: "Renewals only.", docsNeeded: ["DAA tax statement"] },
      { item: "CPD workshops & conferences", value: 500, tag: "Education", summary: "Mandatory CPD for registration maintenance.", scenario: "Pays $480 for nutrition conference. Directly related -- claimed.", howTo: "Keep receipts + course descriptions.", watchOut: "Must relate to current dietetics role.", docsNeeded: ["Receipts", "Course outline"] },
      { item: "Clinical nutrition resources", value: 350, tag: "Education", summary: "Reference materials and clinical databases.", scenario: "Nutrient Reference Values database $280/yr. Claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal nutrition books for your own diet don't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Work uniform", value: 150, tag: "Clothing", summary: "Clinic-branded uniform if required.", scenario: "Clinic requires branded polo shirts. 3 x $45 = $135. Claimed.", howTo: "Keep receipt. Must be employer-branded.", watchOut: "Generic clothing doesn't qualify.", docsNeeded: ["Receipt"] },
      { item: "Home office (client notes, reports)", value: 600, tag: "Home Office", summary: "Writing client reports and CPD at home.", scenario: "2hrs/week at home on reports. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Keep time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Travel between clinics or sites", value: 400, tag: "Travel", summary: "Working across multiple sites.", scenario: "Works at 2 hospitals. 88c x 15km x 100 days = $1,320.", howTo: "Cents per km. Keep trip diary.", watchOut: "Home to first clinic = commute.", docsNeeded: ["Trip diary"] },
    ],
    notClaimable: [
      { item: "Personal food or groceries", reason: "Even for meal planning purposes -- personal expense." },
      { item: "Home-to-clinic commute", reason: "Standard commute rule." },
      { item: "Gym or fitness membership", reason: "Personal expense regardless of health knowledge." },
    ],
  },

  carpenter: {
    avgSalary: 85000,
    claimable: [
      { item: "Carpenter's licence renewal", value: 350, tag: "Licences", summary: "Required builder/carpenter licence renewals.", scenario: "NSW builder licence renewal $320 -- claimed in full.", howTo: "Keep receipt from state licensing body.", watchOut: "Initial training costs generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Hand tools & power tools (under $300)", value: 1000, tag: "Equipment", summary: "Chisels, saws, planes, drills -- all deductible.", scenario: "Buys handsaw $85, chisel set $95, router bits $120 = $300. All under $300 -- claimed instantly.", howTo: "Under $300 per item = instant. Keep receipts.", watchOut: "Tools also used for personal projects -- must apportion.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 3000, tag: "Vehicle", atoUrl: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/motor-vehicle-and-car-expenses/expenses-for-a-car-you-own-or-lease", summary: "Ute or van used for work -- logbook method.", scenario: "Ute 80% work use. Annual costs $13,000. Claims $10,400.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety boots, hi-vis & PPE", value: 350, tag: "Clothing", summary: "Required safety equipment for carpentry work.", scenario: "Steel caps $180, hi-vis $90, safety glasses $45. Total $315 -- claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "CFMEU / HIA union or association fees", value: 500, tag: "Memberships", summary: "Union and industry body fees.", scenario: "CFMEU annual fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
      { item: "Phone (work portion)", value: 250, tag: "Phone", summary: "Work-use for client comms and quoting.", scenario: "40% work use on $840/yr plan = $336.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Home office (quotes & admin)", value: 200, tag: "Home Office", summary: "Quoting and invoicing done at home.", scenario: "Self-employed carpenter 3hrs/week at home. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Keep time diary.", watchOut: "PAYG employees need employer requirement.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute is personal." },
      { item: "Tools used exclusively for personal home projects", reason: "Must be work-related." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  welder: {
    avgSalary: 90000,
    claimable: [
      { item: "Welder / boilermaker ticket renewal", value: 400, tag: "Licences", summary: "Required welding certifications and tickets.", scenario: "Boilermaker ticket renewal $380 -- claimed.", howTo: "Keep receipt from certifying body.", watchOut: "Initial tickets generally not deductible -- renewals are.", docsNeeded: ["Ticket renewal receipt"] },
      { item: "Welding tools & consumables", value: 800, tag: "Equipment", summary: "Personal welding equipment and consumables.", scenario: "Welding gloves $60, grinding discs $80, personal shield $180 = $320. All personal purchases -- claimed.", howTo: "Keep receipts. Work-use items only.", watchOut: "Employer-provided consumables cannot be claimed.", docsNeeded: ["Receipts"] },
      { item: "Safety boots, gloves & PPE", value: 400, tag: "Clothing", summary: "Heavy-duty safety equipment for welding environments.", scenario: "Steel caps $190, leather welding gloves $85, face shield $120 = $395. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Standard clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 2500, tag: "Vehicle", summary: "Work vehicle use.", scenario: "70% work use. Annual costs $12,000. Claims $8,400.", howTo: "12-week logbook. Apply business % to all costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Union fees (AWU/AMWU)", value: 500, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "AWU annual fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
    ],
    conditional: [
      { item: "Upskilling / welding tickets (new methods)", value: 500, tag: "Education", summary: "Additional welding certifications for current role.", scenario: "TIG welding upskill course $450. Adds skills to current boilermaker role -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current role, not a career change.", docsNeeded: ["Receipt", "Course outline"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute is personal." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
      { item: "Personal protective equipment for home use", reason: "Must be work-related." },
    ],
  },

  painter: {
    avgSalary: 75000,
    claimable: [
      { item: "Painter / decorator licence renewal", value: 300, tag: "Licences", summary: "Required licence renewals.", scenario: "Painting contractor licence renewal $280 -- claimed.", howTo: "Keep receipt from state licensing body.", watchOut: "Initial licence training generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Painting tools & equipment", value: 600, tag: "Equipment", summary: "Brushes, rollers, spray guns -- tools of trade.", scenario: "Spray gun $180, roller set $45, brush set $65 = $290. All under $300 -- claimed.", howTo: "Under $300 per item = instant. Keep receipts.", watchOut: "Tools used for personal home painting -- must apportion.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 2500, tag: "Vehicle", summary: "Van or ute used to transport equipment to sites.", scenario: "Van 75% work use. Annual costs $12,000. Claims $9,000.", howTo: "12-week logbook. Apply business % to all costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Safety gear & PPE", value: 300, tag: "Clothing", summary: "Safety boots, hi-vis, respirator mask.", scenario: "Respirator $120, safety boots $160, hi-vis $45 = $325. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Plain clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "MBAV / union fees", value: 400, tag: "Memberships", summary: "Master Builders or union membership.", scenario: "Annual fee $380. Claimed from annual tax statement.", howTo: "Annual tax statement.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Sunscreen (outdoor painter)", value: 80, tag: "Health", summary: "Sun protection for outdoor work.", scenario: "Buys SPF 50+ sunscreen weekly. $80/yr -- claimed.", howTo: "Keep receipts. ATO allows for outdoor workers.", watchOut: "Cosmetic sunscreen doesn't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Home office (quotes & admin)", value: 150, tag: "Home Office", summary: "Quoting and invoicing at home.", scenario: "2hrs/week at home on quotes. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute is personal." },
      { item: "Personal painting supplies for your own home", reason: "Home materials are personal." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  tiler: {
    avgSalary: 80000,
    claimable: [
      { item: "Tiling tools (under $300 each)", value: 700, tag: "Equipment", summary: "Tile cutters, spacers, floats -- tools of trade.", scenario: "Manual tile cutter $180, notched trowels $65, grout float $45 = $290. All under $300 -- claimed.", howTo: "Under $300 per item = instant. Keep receipts.", watchOut: "Expensive electric tile saws over $300 = depreciated.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 2500, tag: "Vehicle", summary: "Vehicle used to transport tools to job sites.", scenario: "80% work use. Annual costs $11,000. Claims $8,800.", howTo: "12-week logbook. Apply business % to all costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Safety gear & kneepads", value: 300, tag: "Clothing", summary: "Safety boots, kneepads, safety glasses.", scenario: "Steel caps $180, kneepads $75, safety glasses $35 = $290. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "CFMEU union fees", value: 500, tag: "Memberships", summary: "Union membership fully deductible.", scenario: "CFMEU fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from CFMEU.", watchOut: "100% work-related.", docsNeeded: ["CFMEU tax statement"] },
      { item: "Tiling licence renewal", value: 250, tag: "Licences", summary: "Required contractor licence if applicable.", scenario: "Tiling contractor licence $240 -- claimed.", howTo: "Keep receipt from licensing body.", watchOut: "Not all states require a licence -- only claim if applicable.", docsNeeded: ["Licence renewal receipt"] },
    ],
    conditional: [
      { item: "Home office (quotes)", value: 150, tag: "Home Office", summary: "Quoting done at home.", scenario: "2hrs/week at home on quotes. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine work, not just messaging.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first job site", reason: "Commute is personal." },
      { item: "Tiles or materials for own home", reason: "Personal home materials are not deductible." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  pestcontrol: {
    avgSalary: 70000,
    claimable: [
      { item: "Pest control licence renewal", value: 300, tag: "Licences", summary: "Required annual licence to apply pesticides.", scenario: "State pest control licence renewal $280 -- claimed.", howTo: "Keep receipt from EPA or state licensing body.", watchOut: "Initial licensing training generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Vehicle costs (logbook)", value: 3000, tag: "Vehicle", summary: "Van or ute used to travel to client properties.", scenario: "90% work use. Annual costs $12,000. Claims $10,800.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to first client = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "PPE -- respirator, gloves, protective gear", value: 400, tag: "Clothing", summary: "Chemical handling PPE required for the role.", scenario: "Respirator $120, chemical gloves $45, coveralls $80, safety glasses $35 = $280. Claimed.", howTo: "Keep receipts. Must be required safety gear.", watchOut: "Standard clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Sunscreen & hat (lawn care workers)", value: 80, tag: "Health", summary: "Sun protection for outdoor work.", scenario: "SPF 50+ sunscreen. $80/yr -- claimed.", howTo: "Keep receipts. ATO allows for outdoor workers.", watchOut: "Cosmetic sunscreen doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone (work portion)", value: 250, tag: "Phone", summary: "Work-use for client bookings and scheduling.", scenario: "50% work use on $840/yr plan = $420.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Spray equipment (over $300)", value: 500, tag: "Equipment", summary: "Professional spray equipment depreciated over effective life.", scenario: "Buys professional spray rig $1,200. Work use only. Depreciated over 5 years = $240/yr.", howTo: "Keep receipt. Depreciate over ATO effective life.", watchOut: "Only claim work-use proportion if used for personal garden too.", docsNeeded: ["Receipt", "Asset register"] },
    ],
    notClaimable: [
      { item: "Home to first client commute", reason: "Standard commute rule." },
      { item: "Pesticides for own home garden", reason: "Personal use materials." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  socialworker: {
    avgSalary: 78000,
    claimable: [
      { item: "AASW membership & CPD", value: 600, tag: "Memberships", summary: "Australian Association of Social Workers membership and CPD.", scenario: "AASW annual fee $520 + CPD workshop $180 = $700. Claimed.", howTo: "Annual tax statement from AASW + CPD receipts.", watchOut: "CPD must relate to current social work role.", docsNeeded: ["AASW tax statement", "CPD receipts"] },
      { item: "Vehicle costs (client visits)", value: 2000, tag: "Vehicle", summary: "Driving to client homes, hospitals, community sites.", scenario: "Logbook: 50% work. Annual car costs $10,000. Claims $5,000.", howTo: "12-week logbook or 88c/km method.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "Professional supervision fees", value: 800, tag: "Education", summary: "Mandatory professional supervision required for practice.", scenario: "Monthly supervision $80 x 10 sessions = $800. Required for AASW practice standards.", howTo: "Keep receipts from supervisor.", watchOut: "Personal therapy or coaching is not deductible.", docsNeeded: ["Supervisor receipts"] },
      { item: "Phone (work portion)", value: 300, tag: "Phone", summary: "High work-use for client and interagency comms.", scenario: "60% work use on $900/yr plan = $540.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Home office (case notes, reports)", value: 700, tag: "Home Office", summary: "Writing case notes and reports at home.", scenario: "2hrs/day on case notes at home. 2 x 5 x 48 x $0.70 = $336.", howTo: "70c/hr. Keep time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Work-related clothing (client-facing)", value: 150, tag: "Clothing", summary: "Organisation-branded uniform if required.", scenario: "Required to wear branded polo shirts. 3 x $45 = $135. Claimed.", howTo: "Keep receipt. Must be employer-branded.", watchOut: "Generic professional clothing doesn't qualify.", docsNeeded: ["Receipt", "Employer uniform requirement"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal counselling or therapy", reason: "Must be required for your role, not for personal wellbeing." },
      { item: "Meals during normal shifts", reason: "Personal expense." },
    ],
  },

  police: {
    avgSalary: 85000,
    claimable: [
      { item: "Police union fees (POLICE Association)", value: 500, tag: "Memberships", summary: "Police association membership -- fully deductible.", scenario: "Police Association annual fee $480. Claimed from annual tax statement.", howTo: "Annual tax statement from your state Police Association in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory police uniform.", scenario: "Washes uniform 5x/week x 48 weeks = 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Work boots & safety footwear", value: 200, tag: "Clothing", summary: "Required safety footwear if personally purchased.", scenario: "Police-required boots $180 -- claimed.", howTo: "Keep receipt. Must be employer-required footwear.", watchOut: "If police-issued, cannot claim.", docsNeeded: ["Receipt", "Employer footwear requirement"] },
      { item: "CPD & operational training", value: 300, tag: "Education", summary: "Job-required training and development courses.", scenario: "Pays $280 for specialised investigative course -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current policing role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Phone (work portion)", value: 200, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "30% work use on $720/yr plan = $216.", howTo: "4-week diary. Apply % to full year.", watchOut: "If issued a work phone, cannot claim personal phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Home office (reports, studies)", value: 250, tag: "Home Office", summary: "Writing reports or studying at home for work.", scenario: "2hrs/week writing reports at home. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Keep time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
      { item: "Fitness equipment (if mandated)", value: 200, tag: "Equipment", summary: "Only if fitness testing is a formal requirement AND equipment is mandated.", scenario: "Police officer required to maintain fitness standards. Gym equipment specifically required -- borderline claim.", howTo: "Extremely limited. Must be specifically mandated, not just generally expected.", watchOut: "General fitness is personal. Most gym or equipment costs are not deductible.", docsNeeded: ["Evidence of specific mandate", "Receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-station commute", reason: "Standard commute rule." },
      { item: "General fitness or gym membership", reason: "Personal expense even if fitness standards are expected." },
      { item: "Police-issued uniforms and equipment", reason: "Cannot claim employer-provided items." },
    ],
  },

  firefighter: {
    avgSalary: 80000,
    claimable: [
      { item: "UFU / fire union fees", value: 500, tag: "Memberships", summary: "United Firefighters Union membership -- fully deductible.", scenario: "UFU annual fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from UFU in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory firefighter uniform.", scenario: "Washes uniform 4x/week x 48 weeks = 192 loads. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Fitness training equipment", value: 300, tag: "Equipment", summary: "Where fitness testing is a formal occupational requirement.", scenario: "Fire service mandates fitness standards. Home training equipment $280 -- potentially claimable.", howTo: "Must be formally mandated by employer. Keep receipt.", watchOut: "General fitness is personal. Must be specifically required, not just expected.", docsNeeded: ["Receipt", "Evidence of formal fitness requirement"] },
      { item: "CPD & emergency response training", value: 400, tag: "Education", summary: "Required technical and safety training courses.", scenario: "Pays $380 for hazmat refresher course -- required. Claimed.", howTo: "Keep receipt + course description.", watchOut: "Must be required for your operational role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Work-use portion of personal phone.", scenario: "25% work use on $600/yr plan = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "If work phone provided, cannot claim personal phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Rescue / paramedic qualification costs", value: 400, tag: "Education", summary: "Additional qualifications required by fire service.", scenario: "Pays $380 for first responder recertification -- required. Claimed.", howTo: "Keep receipt. Must be required for your role.", watchOut: "Voluntary qualifications for career advancement are borderline.", docsNeeded: ["Receipt", "Evidence requirement"] },
    ],
    notClaimable: [
      { item: "Home-to-station commute", reason: "Standard commute rule." },
      { item: "Employer-issued gear", reason: "Cannot claim provided equipment." },
      { item: "General gym membership", reason: "Personal expense unless fitness testing is formally mandated." },
    ],
  },

  military: {
    avgSalary: 75000,
    claimable: [
      { item: "Defence Force Welfare Association fees", value: 200, tag: "Memberships", summary: "Welfare association and union fees.", scenario: "DFWA annual fee $180. Annual tax statement claimed.", howTo: "Annual tax statement from DFWA.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Uniform laundering & dry-cleaning", value: 150, tag: "Clothing", summary: "ATO formula for compulsory military uniform.", scenario: "Washes uniform 5x/week. 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Specialist skills training (personal cost)", value: 400, tag: "Education", summary: "Where personally funded training is required for current role.", scenario: "Pays $380 for specialised course not funded by ADF -- claimed.", howTo: "Keep receipt. Must relate to current military role.", watchOut: "ADF-funded training cannot be claimed.", docsNeeded: ["Receipt", "Evidence of personal funding"] },
      { item: "Self-funded books and resources", value: 200, tag: "Education", summary: "Military doctrine and specialist subject resources.", scenario: "Military history and tactics books $180. Directly related to current role -- claimed.", howTo: "Keep receipts. Must relate to current role.", watchOut: "General interest reading doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Home office (study, reports)", value: 400, tag: "Home Office", summary: "Study and report writing at home.", scenario: "3hrs/week at home studying and writing reports. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Keep time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Travel between postings (if unreimbursed)", value: 500, tag: "Travel", summary: "Travel costs between postings not covered by ADF.", scenario: "Drives to new posting. ADF covers part -- excess not reimbursed. Claims difference.", howTo: "Keep all travel receipts. Only claim the unreimbursed portion.", watchOut: "Cannot double-claim reimbursed amounts.", docsNeeded: ["Receipts", "Reimbursement documentation"] },
    ],
    notClaimable: [
      { item: "Employer-issued uniforms and equipment", reason: "Cannot claim ADF-provided items." },
      { item: "Home-to-base commute", reason: "Standard commute rule." },
      { item: "ADF-funded training costs", reason: "Cannot claim reimbursed or employer-funded items." },
    ],
  },

  corrections: {
    avgSalary: 72000,
    claimable: [
      { item: "CPSU / union fees", value: 400, tag: "Memberships", summary: "Community and Public Sector Union membership.", scenario: "CPSU annual fee $380. Annual tax statement claimed.", howTo: "Annual tax statement from CPSU in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory corrections uniform.", scenario: "Washes uniform 5x/week. 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Safety boots", value: 150, tag: "Clothing", summary: "Required safety footwear if personally purchased.", scenario: "Required steel-cap boots $140 -- claimed.", howTo: "Keep receipt. Must be employer-required.", watchOut: "If provided by employer, cannot claim.", docsNeeded: ["Receipt"] },
      { item: "CPD & correctional training", value: 300, tag: "Education", summary: "Required professional development courses.", scenario: "Pays $280 for required training course -- claimed.", howTo: "Keep receipt.", watchOut: "Must be required for current role.", docsNeeded: ["Receipt"] },
    ],
    conditional: [
      { item: "Home office (reports, studies)", value: 200, tag: "Home Office", summary: "Report writing or studying at home.", scenario: "2hrs/week at home. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Keep time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-facility commute", reason: "Standard commute rule." },
      { item: "Personal fitness costs", reason: "Personal expense even if fitness is expected." },
      { item: "Employer-issued equipment", reason: "Cannot claim provided items." },
    ],
  },

  financeplanner: {
    avgSalary: 110000,
    claimable: [
      { item: "FPA / AFA membership & CPD", value: 1000, tag: "Memberships", summary: "Financial Planning Association membership and mandatory CPD.", scenario: "FPA annual fee $850 + CPD conference $350 = $1,200. Claimed.", howTo: "Annual tax statement from FPA + CPD receipts.", watchOut: "CPD must relate to current financial planning role.", docsNeeded: ["FPA tax statement", "CPD receipts"] },
      { item: "ASIC financial adviser registration", value: 400, tag: "Licences", summary: "Required ASIC registration as a financial adviser.", scenario: "Annual ASIC adviser registration $380 -- claimed.", howTo: "Keep ASIC registration receipt.", watchOut: "Only if personally paying -- employer-paid cannot be claimed.", docsNeeded: ["ASIC registration receipt"] },
      { item: "Professional indemnity insurance", value: 2000, tag: "Insurance", summary: "PI insurance required for financial advice practice.", scenario: "Annual PI policy $1,800 -- claimed in full.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Financial planning software (personal)", value: 600, tag: "Software", summary: "Xplan, Midwinter or other advice software personally subscribed.", scenario: "Xplan personal subscription $560/yr. Fully deductible.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "Financial planners who WFH regularly.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "50% work use on $1,000/yr plan and internet = $500 combined.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Client travel", value: 600, tag: "Travel", summary: "Driving to client meetings.", scenario: "Logbook: 35% work. Annual car costs $12,000. Claims $4,200.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Personal investment advice fees", reason: "Advice about your own investments is personal." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict. Must directly connect to earning specific income." },
    ],
  },

  mortgagebroker: {
    avgSalary: 95000,
    claimable: [
      { item: "MFAA / FBAA membership", value: 500, tag: "Memberships", summary: "Mortgage & Finance Association membership -- required for practice.", scenario: "MFAA annual fee $480. Claimed.", howTo: "Annual tax statement from MFAA or FBAA.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Australian Credit Licence (ACL) costs", value: 400, tag: "Licences", summary: "ASIC credit licence fees.", scenario: "Annual ASIC ACL renewal $380 -- claimed.", howTo: "Keep receipt from ASIC.", watchOut: "Initial application costs may not be deductible -- renewals are.", docsNeeded: ["ASIC renewal receipt"] },
      { item: "Professional indemnity insurance", value: 1500, tag: "Insurance", summary: "PI insurance required for credit advice.", scenario: "Annual PI policy $1,400 -- claimed.", howTo: "Keep insurance receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Vehicle costs (client visits)", value: 2000, tag: "Vehicle", summary: "Driving to client meetings and property inspections.", scenario: "Logbook: 45% work. Annual car costs $12,000. Claims $5,400.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "Home office (WFH)", value: 800, tag: "Home Office", summary: "Brokers who WFH or work after hours.", scenario: "WFH 2 days/week + evening admin. 4hrs/day x 2 x 48 x $0.70 = $269.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Heavy phone use for client comms.", scenario: "60% work use on $1,200/yr = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "CRM software subscription", value: 400, tag: "Software", summary: "Personal CRM subscription for client management.", scenario: "Salesforce or Broker CRM $380/yr -- work tool, fully deductible.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided CRM cannot be claimed.", docsNeeded: ["Subscription receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict -- must directly connect to earning specific income." },
      { item: "Personal financial advice fees", reason: "Your own financial planning is personal." },
    ],
  },

  businessanalyst: {
    avgSalary: 100000,
    claimable: [
      { item: "IIBA membership & CBAP certification", value: 600, tag: "Memberships", summary: "International Institute of Business Analysis membership and certifications.", scenario: "IIBA annual fee $280 + CBAP exam prep $350 = $630. Claimed.", howTo: "Annual tax statement from IIBA + exam receipts.", watchOut: "Must relate to current BA role.", docsNeeded: ["IIBA tax statement", "Exam receipts"] },
      { item: "BA tools & software (personal)", value: 500, tag: "Software", summary: "Modelling, documentation and project tools personally subscribed.", scenario: "Lucidchart $180/yr + Confluence $120/yr + Jira $96/yr = $396. All work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH)", value: 1000, tag: "Home Office", summary: "BAs typically WFH -- claim every hour.", scenario: "WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,075.", howTo: "70c/hr. Time diary or WFH calendar.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "45% work use on $1,000/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Technical training & certifications", value: 800, tag: "Education", summary: "Agile, BPMN, Scrum certifications.", scenario: "SAFe Agilist certification $680 + Scrum course $200 = $880. Work-relevant -- claimed.", howTo: "Keep receipts + course descriptions.", watchOut: "Must relate to current BA role.", docsNeeded: ["Receipts", "Course outlines"] },
    ],
    conditional: [
      { item: "Laptop & peripherals (work portion)", value: 800, tag: "Equipment", summary: "Work-use proportion of computer.", scenario: "MacBook $2,400 x 75% work = $1,800 depreciated over 2 years = $900/yr.", howTo: "Calculate work-use %. Depreciate over effective life.", watchOut: "100% claim on device also used personally = audit flag.", docsNeeded: ["Receipt", "Work-use diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal project management apps", reason: "Must be used for your current work role." },
    ],
  },

  projectmanager: {
    avgSalary: 115000,
    claimable: [
      { item: "PMI / AIPM membership & PMP certification", value: 700, tag: "Memberships", summary: "Project Management Institute membership and PMP certification fees.", scenario: "PMI annual fee $290 + PMP exam $580 = $870. Claimed.", howTo: "Annual tax statement from PMI + exam receipts.", watchOut: "Must relate to current PM role.", docsNeeded: ["PMI tax statement", "Exam receipts"] },
      { item: "PM software (personal subscription)", value: 400, tag: "Software", summary: "Monday.com, Smartsheet or other PM tools personally subscribed.", scenario: "Monday.com $240/yr + MS Project $200/yr = $440. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH)", value: 1000, tag: "Home Office", summary: "PMs who WFH regularly.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion for stakeholder comms.", scenario: "50% work use on $1,000/yr = $500.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "PM books & CPD", value: 400, tag: "Education", summary: "Project management reference books and CPD courses.", scenario: "PMBOK guide $180 + leadership course $280 = $460. Claimed.", howTo: "Keep receipts. Must relate to current PM role.", watchOut: "General business books are borderline.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Vehicle costs (site visits)", value: 800, tag: "Travel", summary: "Driving to project sites or client locations.", scenario: "Logbook: 30% work. Annual car costs $12,000. Claims $3,600.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict." },
    ],
  },

  architect: {
    avgSalary: 95000,
    claimable: [
      { item: "Architects Registration Board annual fee", value: 400, tag: "Licences", summary: "Required annual registration to practise as an architect.", scenario: "ARB annual registration $380 -- claimed.", howTo: "Keep registration receipt.", watchOut: "Initial registration costs generally not deductible -- renewals are.", docsNeeded: ["ARB registration receipt"] },
      { item: "AIA membership & CPD", value: 700, tag: "Memberships", summary: "Australian Institute of Architects membership and mandatory CPD.", scenario: "AIA annual fee $620 + CPD seminar $180 = $800. Claimed.", howTo: "Annual tax statement from AIA + CPD receipts.", watchOut: "CPD must relate to current practice.", docsNeeded: ["AIA tax statement", "CPD receipts"] },
      { item: "Design software (personal subscription)", value: 800, tag: "Software", summary: "AutoCAD, Revit, Sketch-Up personally subscribed.", scenario: "AutoCAD personal licence $780/yr. Fully deductible.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional indemnity insurance", value: 1500, tag: "Insurance", summary: "PI insurance required for architectural practice.", scenario: "Annual PI policy $1,400 -- claimed.", howTo: "Keep insurance certificate and receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Home office (WFH design work)", value: 900, tag: "Home Office", summary: "Architects who WFH or work on projects at home.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Vehicle costs (site visits)", value: 1500, tag: "Travel", summary: "Driving to construction sites and client meetings.", scenario: "Logbook: 40% work. Annual car costs $12,000. Claims $4,800.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal design tools for hobby projects", reason: "Must be for current work, not personal creative projects." },
    ],
  },

  lecturer: {
    avgSalary: 100000,
    claimable: [
      { item: "Professional association membership & CPD", value: 600, tag: "Memberships", summary: "Discipline-specific professional body membership.", scenario: "Annual membership $520 + CPD conference $280 = $800. Claimed.", howTo: "Annual tax statement + CPD receipts.", watchOut: "Must relate to current teaching and research area.", docsNeeded: ["Tax statement", "CPD receipts"] },
      { item: "Academic books & research journals", value: 800, tag: "Education", summary: "Textbooks and journal subscriptions for teaching and research.", scenario: "Journal subscriptions $480/yr + textbooks $320. Claimed.", howTo: "Keep receipts. Must relate to current teaching subjects.", watchOut: "Personal interest reading doesn't qualify.", docsNeeded: ["Receipts or subscription statements"] },
      { item: "Home office (research, marking, preparation)", value: 1200, tag: "Home Office", summary: "Academics genuinely WFH significantly -- claim every hour.", scenario: "Research and prep 4hrs/day from home. 4 x 5 x 48 x $0.70 = $672.", howTo: "70c/hr. Time diary or calendar records.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Conference travel (academic)", value: 1000, tag: "Travel", summary: "Travel to academic conferences for research presentation.", scenario: "Presents research at interstate conference. Airfare $450 + accommodation $350 = $800 -- claimed.", howTo: "Keep all receipts. Must be for work-related academic conference.", watchOut: "Personal travel with incidental conference attendance doesn't qualify.", docsNeeded: ["Receipts", "Conference registration", "Evidence of presentation"] },
      { item: "Computer & software (work portion)", value: 800, tag: "Equipment", summary: "Work-use proportion of computer and research software.", scenario: "MacBook $2,400 x 70% work = $1,680 depreciated over 2 years = $840/yr.", howTo: "Calculate work-use %. Depreciate over effective life.", watchOut: "100% claim on device also used for personal Netflix = audit flag.", docsNeeded: ["Receipt", "Work-use diary"] },
    ],
    conditional: [
      { item: "Research-related equipment", value: 600, tag: "Equipment", summary: "Equipment specifically required for research activities.", scenario: "Buys specialised measurement tool $580 for research project not covered by university budget.", howTo: "Keep receipt. Document research requirement and that university didn't fund it.", watchOut: "University-funded equipment cannot be claimed personally.", docsNeeded: ["Receipt", "Evidence of self-funding"] },
    ],
    notClaimable: [
      { item: "Home-to-university commute", reason: "Standard commute rule." },
      { item: "University-funded conference travel", reason: "Cannot claim reimbursed or institution-funded expenses." },
      { item: "Personal academic interests unrelated to current teaching", reason: "Must relate to your current role and subjects." },
    ],
  },

  earlychildhood: {
    avgSalary: 58000,
    claimable: [
      { item: "ACECQA or state registration fees", value: 200, tag: "Licences", summary: "Required early childhood registration and qualification recognition.", scenario: "ACECQA registration $180 -- claimed.", howTo: "Keep registration receipt.", watchOut: "Only renewals -- initial qualification costs not deductible.", docsNeeded: ["Registration receipt"] },
      { item: "IEU / AEU union fees", value: 350, tag: "Memberships", summary: "Early childhood teachers union membership.", scenario: "IEU annual fee $320. Annual tax statement claimed.", howTo: "Annual tax statement from union in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Early childhood resources (self-funded)", value: 300, tag: "Supplies", summary: "Learning materials, books, craft supplies bought out of pocket.", scenario: "Spends $280 on books, puzzles, art supplies. Not reimbursed -- claimed.", howTo: "Keep receipts. Only claim what employer didn't reimburse.", watchOut: "Centre-provided resources cannot be claimed.", docsNeeded: ["Receipts", "Note of no employer reimbursement"] },
      { item: "Work uniform / branded clothing", value: 150, tag: "Clothing", summary: "Centre-branded uniform if required.", scenario: "Required branded polo shirts. 3 x $45 = $135. Claimed.", howTo: "Keep receipt. Must be distinctive employer-branded.", watchOut: "Generic casual clothing doesn't qualify.", docsNeeded: ["Receipt"] },
      { item: "First aid & CPD courses", value: 250, tag: "Education", summary: "Required first aid renewal and professional development.", scenario: "Annual first aid renewal $140 + CPD workshop $120 = $260. Claimed.", howTo: "Keep receipts from training providers.", watchOut: "Must be required for your role.", docsNeeded: ["Receipts from registered providers"] },
    ],
    conditional: [
      { item: "Home office (planning, reports)", value: 300, tag: "Home Office", summary: "Lesson planning and reports done at home.", scenario: "2hrs/evening x 3 evenings x 40 weeks x $0.70 = $168.", howTo: "70c/hr. Time diary or calendar records.", watchOut: "Must be genuine work hours.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-centre commute", reason: "Standard commute rule." },
      { item: "Personal childcare costs", reason: "Personal family expense." },
      { item: "Gifts or presents for children", reason: "Personal expense." },
    ],
  },

  tafe: {
    avgSalary: 85000,
    claimable: [
      { item: "Industry body membership & CPD", value: 500, tag: "Memberships", summary: "Industry-specific professional membership required for vocational training.", scenario: "Industry association annual fee $450 + CPD $180 = $630. Claimed.", howTo: "Annual tax statement + CPD receipts.", watchOut: "Must relate to your training discipline.", docsNeeded: ["Tax statement", "CPD receipts"] },
      { item: "Trade tools (if demonstrating skills)", value: 600, tag: "Equipment", summary: "Tools used to demonstrate trade skills to students.", scenario: "Carpentry TAFE trainer buys demonstration tools $550. Self-funded. Claimed.", howTo: "Keep receipts. Must be work-related demonstration tools.", watchOut: "TAFE-provided equipment cannot be claimed.", docsNeeded: ["Receipts"] },
      { item: "Work uniform or safety gear", value: 250, tag: "Clothing", summary: "Required work uniform or PPE for TAFE workshops.", scenario: "TAFE requires branded polo and safety boots. $200 total -- claimed.", howTo: "Keep receipts. Must be specifically required.", watchOut: "Generic clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Home office (preparation, marking)", value: 700, tag: "Home Office", summary: "Lesson preparation and marking done at home.", scenario: "3hrs/day x 3 days/week x 48 x $0.70 = $302.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "Training & assessment resources", value: 300, tag: "Supplies", summary: "Training materials and assessment resources self-funded.", scenario: "Buys $280 in training materials not provided by TAFE. Claimed.", howTo: "Keep receipts. Only claim what TAFE didn't provide.", watchOut: "TAFE-provided resources cannot be claimed.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Upskilling in current discipline", value: 400, tag: "Education", summary: "Keeping trade skills current for effective teaching.", scenario: "Plumbing TAFE trainer pays $380 for industry upskill course. Claimed.", howTo: "Keep receipt + course description. Must relate to current teaching area.", watchOut: "Career change courses not deductible.", docsNeeded: ["Receipt", "Course outline"] },
    ],
    notClaimable: [
      { item: "Home-to-campus commute", reason: "Standard commute rule." },
      { item: "Personal tools at home", reason: "Must be specifically for work teaching purposes." },
    ],
  },

  schoolcounsellor: {
    avgSalary: 85000,
    claimable: [
      { item: "AHPRA / ACA registration & membership", value: 500, tag: "Memberships", summary: "Required registration and professional body membership.", scenario: "AHPRA $480 or ACA annual fee $420. Claimed.", howTo: "Keep registration invoice.", watchOut: "Renewals only.", docsNeeded: ["Registration invoice"] },
      { item: "CPD & clinical training", value: 600, tag: "Education", summary: "Mandatory CPD for registration maintenance.", scenario: "Pays $550 for CPD workshop. Required -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current counselling role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Clinical supervision", value: 800, tag: "Education", summary: "Professional supervision required for registration.", scenario: "Monthly supervision sessions $80 x 10 = $800. Required.", howTo: "Keep receipts from supervisor.", watchOut: "Optional mentoring is not deductible.", docsNeeded: ["Supervisor receipts"] },
      { item: "Home office (case notes, reports)", value: 600, tag: "Home Office", summary: "Writing case notes and reports at home.", scenario: "2hrs/day at home on reports. 2 x 5 x 48 x $0.70 = $336.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "Professional resources & books", value: 300, tag: "Education", summary: "Clinical psychology and counselling reference materials.", scenario: "DSM-5 $180 + clinical resource book $130 = $310. Claimed.", howTo: "Keep receipts. Must relate to current role.", watchOut: "Personal self-help books don't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Union fees (AEU/IEU)", value: 350, tag: "Memberships", summary: "Teaching union membership if employed by school.", scenario: "AEU annual fee $320. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
    ],
    notClaimable: [
      { item: "Home-to-school commute", reason: "Standard commute rule." },
      { item: "Personal therapy for self-care", reason: "Must be required for registration." },
    ],
  },

  datascientist: {
    avgSalary: 120000,
    claimable: [
      { item: "Technical courses & certifications", value: 1000, tag: "Education", summary: "Data science, ML, cloud certifications.", scenario: "AWS ML Specialty $300 + Coursera specialisation $180 + DataCamp $200 = $680. Claimed.", howTo: "Keep receipts. Must relate to current role.", watchOut: "Learning a completely different field = career change = not deductible.", docsNeeded: ["Receipts", "Course descriptions"] },
      { item: "Home office (WFH hours)", value: 1200, tag: "Home Office", summary: "Data scientists typically WFH -- claim every hour.", scenario: "Full-time WFH. 5 x 8 x 48 x $0.70 = $1,344.", howTo: "70c/hr. Time diary or calendar records.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Software & cloud subscriptions", value: 800, tag: "Software", summary: "Statistical software, cloud compute, data tools.", scenario: "Tableau $600/yr + GitHub Pro $48 + cloud credits for personal projects $200 = $848. Work tools -- claimed.", howTo: "Keep subscription receipts. Must be used for work.", watchOut: "Personal data projects must be excluded.", docsNeeded: ["Subscription receipts"] },
      { item: "Technical books & journals", value: 400, tag: "Education", summary: "Data science, statistics, ML reference materials.", scenario: "O'Reilly subscription $480/yr. Direct reference material -- claimed.", howTo: "Keep subscription receipt.", watchOut: "Must relate to current work, not hobby projects.", docsNeeded: ["Subscription receipt"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Work-use proportion.", scenario: "50% work use on $1,200/yr total = $600.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "High-performance laptop / computer (work portion)", value: 1000, tag: "Equipment", summary: "High-spec machine needed for data work -- work-use proportion.", scenario: "MacBook Pro $3,200 x 80% work = $2,560 depreciated over 2 years = $1,280/yr.", howTo: "Calculate work-use %. Depreciate over effective life.", watchOut: "100% claim on device also used personally = audit flag.", docsNeeded: ["Receipt", "Work-use diary"] },
    ],
    notClaimable: [
      { item: "Personal hobby data projects", reason: "Must relate to your current employment role." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  cybersecurity: {
    avgSalary: 115000,
    claimable: [
      { item: "Security certifications (CISSP, CEH, etc.)", value: 1200, tag: "Education", summary: "Industry certifications required for cybersecurity work.", scenario: "CISSP exam $750 + CEH course $480 = $1,230. Direct career requirements -- claimed.", howTo: "Keep receipts + exam/course descriptions.", watchOut: "Must relate to current role.", docsNeeded: ["Receipts", "Cert descriptions"] },
      { item: "AISA membership", value: 400, tag: "Memberships", summary: "Australian Information Security Association membership.", scenario: "AISA annual fee $380. Claimed.", howTo: "Annual tax statement from AISA.", watchOut: "100% work-related.", docsNeeded: ["AISA tax statement"] },
      { item: "Home office (WFH hours)", value: 1200, tag: "Home Office", summary: "Security analysts who WFH regularly.", scenario: "WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,075.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Security tools & software", value: 600, tag: "Software", summary: "Security testing and analysis tools personally subscribed.", scenario: "Burp Suite Pro $450/yr + pen testing platform $200/yr = $650. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Work-use proportion.", scenario: "55% work use on $1,200/yr = $660.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Home lab / test equipment", value: 600, tag: "Equipment", summary: "Where you maintain a home lab for security research and testing.", scenario: "Raspberry Pi kit $200, network switch $180, USB drives $60 = $440 for security testing lab.", howTo: "Keep receipts. Must be for work-related security research -- document this.", watchOut: "Personal home network equipment cannot be claimed.", docsNeeded: ["Receipts", "Note of work purpose"] },
    ],
    notClaimable: [
      { item: "Personal VPN for privacy", reason: "Personal cybersecurity tools are personal expense." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  uxdesigner: {
    avgSalary: 105000,
    claimable: [
      { item: "Design software subscriptions", value: 700, tag: "Software", summary: "Figma, Sketch, Adobe XD personally subscribed.", scenario: "Figma Professional $180/yr + Adobe XD $600/yr = $780. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "UX/design courses & certifications", value: 600, tag: "Education", summary: "UX research, interaction design, and accessibility courses.", scenario: "Nielsen Norman certification $580. Directly work-related -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current UX/design role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Home office (WFH hours)", value: 1100, tag: "Home Office", summary: "UX designers who WFH regularly.", scenario: "WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,075.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Design books & UX resources", value: 300, tag: "Education", summary: "UX methodology and design system reference books.", scenario: "Don Norman's Design of Everyday Things + UX books $280. Claimed.", howTo: "Keep receipts. Must relate to current work.", watchOut: "General art or design books for personal interest don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "45% work use on $1,000/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "External monitor & peripherals (work portion)", value: 600, tag: "Equipment", summary: "WFH setup equipment -- work-use proportion.", scenario: "External monitor $600 x 80% work = $480. Claimed.", howTo: "Under $300 = instant. Over $300 = depreciate. Apply work-use %.", watchOut: "Gaming monitor also used for personal use -- must apportion.", docsNeeded: ["Receipts", "Work-use % calculation"] },
    ],
    notClaimable: [
      { item: "Personal creative projects tools", reason: "Must relate to your current employment role." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
    ],
  },

  itsupport: {
    avgSalary: 75000,
    claimable: [
      { item: "CompTIA / Microsoft / ITIL certifications", value: 600, tag: "Education", summary: "IT support certifications required for the role.", scenario: "CompTIA A+ $350 + ITIL Foundation $280 = $630. Direct job requirements -- claimed.", howTo: "Keep receipts + exam descriptions.", watchOut: "Must relate to current IT support role.", docsNeeded: ["Receipts", "Certification descriptions"] },
      { item: "Technical tools & software (personal)", value: 400, tag: "Software", summary: "Remote desktop, monitoring and ticketing tools personally subscribed.", scenario: "TeamViewer Personal $180/yr + knowledge base tool $120/yr = $300. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH / remote support)", value: 900, tag: "Home Office", summary: "IT support workers who provide remote support from home.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "40% work use on $900/yr = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Technical books & manuals", value: 200, tag: "Education", summary: "IT reference materials for current role.", scenario: "Network troubleshooting manual $180. Claimed.", howTo: "Keep receipts. Must relate to current IT support role.", watchOut: "General tech interest reading doesn't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Test equipment & tools (personal kit)", value: 300, tag: "Equipment", summary: "Network cables, testers and personal toolkit.", scenario: "Cable tester $120, patch cables $60, toolkit $80 = $260. Personal kit for work -- claimed.", howTo: "Keep receipts. Must be for work purposes.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Receipts"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal gaming PC or home network", reason: "Personal equipment is not deductible even if also used for work." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  networkengineer: {
    avgSalary: 105000,
    claimable: [
      { item: "Cisco / AWS / Azure certifications", value: 1000, tag: "Education", summary: "Network and cloud certifications for current role.", scenario: "CCNP exam $600 + AWS cert $300 = $900. Direct career requirements -- claimed.", howTo: "Keep receipts + exam descriptions.", watchOut: "Must relate to current network engineering role.", docsNeeded: ["Receipts", "Certification descriptions"] },
      { item: "Technical tools & network software", value: 600, tag: "Software", summary: "Network monitoring and management tools.", scenario: "PRTG licence $580/yr. Work tool -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (WFH hours)", value: 1000, tag: "Home Office", summary: "Network engineers who WFH regularly.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Technical books & vendor documentation", value: 300, tag: "Education", summary: "Networking reference materials.", scenario: "Cisco networking guide $280. Claimed.", howTo: "Keep receipts. Must relate to current role.", watchOut: "General IT books not relevant to current role.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "45% work use on $1,000/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Home lab networking equipment", value: 500, tag: "Equipment", summary: "Where home lab is used for work-related testing.", scenario: "Managed switch $280 + rack unit $180 = $460. Used for testing configurations for work.", howTo: "Keep receipts. Document work purpose -- not just personal home network.", watchOut: "Cannot claim personal home network equipment.", docsNeeded: ["Receipts", "Note of work purpose"] },
    ],
    notClaimable: [
      { item: "Personal home network equipment", reason: "Personal home network is not deductible." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  graphicdesigner: {
    avgSalary: 75000,
    claimable: [
      { item: "Adobe Creative Cloud subscription", value: 660, tag: "Software", summary: "Industry-standard design software -- fully deductible.", scenario: "Adobe Creative Cloud All Apps $660/yr. Fully deductible work tool.", howTo: "Keep subscription receipt. Annual plan is the most cost-effective.", watchOut: "Personal creative projects must be excluded if apportioning.", docsNeeded: ["Subscription receipt"] },
      { item: "Home office (WFH hours)", value: 1000, tag: "Home Office", summary: "Graphic designers who WFH or freelance.", scenario: "WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,075.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or WFH calendar"] },
      { item: "Design fonts & stock assets", value: 300, tag: "Software", summary: "Font licences and stock image subscriptions for client work.", scenario: "Adobe Fonts $120/yr + Shutterstock $200/yr = $320. Work assets -- claimed.", howTo: "Keep subscription receipts. Must be used for client work.", watchOut: "Personal creative projects must be excluded.", docsNeeded: ["Subscription receipts"] },
      { item: "Professional portfolio & website", value: 250, tag: "Software", summary: "Portfolio hosting to attract clients.", scenario: "Behance Pro $120/yr + domain $25/yr + Squarespace $180/yr = $325. Business tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal website not used to attract clients doesn't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "45% work use on $1,000/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Graphics tablet & peripherals (work portion)", value: 400, tag: "Equipment", summary: "Wacom tablet or similar design hardware.", scenario: "Wacom Intuus Pro $480 x 90% work use. Depreciated over 3 years = $144/yr.", howTo: "Keep receipt. Apply work-use %. Depreciate over effective life.", watchOut: "Also used for personal art -- must honestly apportion.", docsNeeded: ["Receipt", "Work-use % calculation"] },
    ],
    notClaimable: [
      { item: "Personal art supplies", reason: "Must be for paid client work, not personal creative projects." },
      { item: "Home-to-studio commute", reason: "Standard commute rule." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  journalist: {
    avgSalary: 75000,
    claimable: [
      { item: "MEAA membership", value: 400, tag: "Memberships", summary: "Media Entertainment & Arts Alliance membership -- fully deductible.", scenario: "MEAA annual fee $380. Claimed from annual tax statement.", howTo: "Annual tax statement from MEAA in July.", watchOut: "100% work-related.", docsNeeded: ["MEAA annual tax statement"] },
      { item: "Research subscriptions & databases", value: 600, tag: "Software", summary: "News archives, research databases, publication subscriptions.", scenario: "JSTOR $200/yr + news archives $150/yr + reference databases $250/yr = $600. Claimed.", howTo: "Keep subscription receipts. Must be for work research.", watchOut: "Personal magazine or newspaper subscriptions for general reading don't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (writing & research)", value: 1000, tag: "Home Office", summary: "Journalists who WFH or write from home.", scenario: "WFH 4 days/week. 4 x 8 x 48 x $0.70 = $1,075.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Phone & internet (work portion)", value: 600, tag: "Phone", summary: "High work-use for sources, interviews and research.", scenario: "60% work use on $1,200/yr = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Travel for stories (if unreimbursed)", value: 600, tag: "Travel", summary: "Travel to cover stories not reimbursed by employer.", scenario: "Freelance journalist travels to report on event. Airfare $280 + transport $80 -- not reimbursed. Claimed.", howTo: "Keep all receipts. Only claim unreimbursed portions.", watchOut: "Cannot double-claim reimbursed expenses.", docsNeeded: ["Receipts", "Evidence of no reimbursement"] },
    ],
    conditional: [
      { item: "Recording equipment (work portion)", value: 300, tag: "Equipment", summary: "Microphone, recorder for interviews.", scenario: "Tascam recorder $220. Work tool for interviews -- claimed.", howTo: "Keep receipt. Under $300 = instant deduction.", watchOut: "Also used personally -- must apportion.", docsNeeded: ["Receipt", "Work-use if mixed"] },
    ],
    notClaimable: [
      { item: "General newspaper or magazine subscriptions for reading", reason: "Personal entertainment even if related to your field." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  musician: {
    avgSalary: 55000,
    claimable: [
      { item: "Musical instruments (work portion)", value: 1500, tag: "Equipment", summary: "Instruments used for professional performances.", scenario: "Professional guitarist buys $1,800 guitar. 80% work use. Depreciated over 5 years x 80% = $288/yr.", howTo: "Keep receipt. Over $300 = depreciate over effective life. Apply work-use %.", watchOut: "Instruments also used for personal playing -- must honestly apportion.", docsNeeded: ["Receipt", "Asset register", "Work-use % calculation"] },
      { item: "Music software & DAW", value: 500, tag: "Software", summary: "Logic Pro, Ableton, Pro Tools for professional music production.", scenario: "Logic Pro $350 (one-time purchase, depreciated) + plugins $200/yr = $550. Work tools -- claimed.", howTo: "Keep receipts. Must be used for professional work.", watchOut: "Hobby music production must be excluded.", docsNeeded: ["Receipts"] },
      { item: "MEAA / PPCA membership fees", value: 300, tag: "Memberships", summary: "Performing rights and musicians union fees.", scenario: "MEAA annual fee $280. Claimed.", howTo: "Annual tax statement from MEAA.", watchOut: "100% work-related.", docsNeeded: ["MEAA annual tax statement"] },
      { item: "Home studio / home office", value: 800, tag: "Home Office", summary: "Dedicated home studio for professional music work.", scenario: "Uses dedicated room as home studio for recording and rehearsal. 70c/hr x 6hrs/day x 200 work days = $804.", howTo: "70c/hr fixed rate OR actual costs if room exclusively used. Time diary.", watchOut: "Must be genuinely dedicated. Dual-use room = fixed rate only.", docsNeeded: ["Time diary", "If exclusive: rent/mortgage and utility bills"] },
      { item: "Performance clothing / stage wear", value: 400, tag: "Clothing", summary: "Stage costumes and performance clothing that cannot be worn normally.", scenario: "Stage costume $380. Exclusively for performances -- claimed.", howTo: "Keep receipt. Must be exclusively for performances, not everyday wear.", watchOut: "General clothing you also wear personally cannot be claimed.", docsNeeded: ["Receipt", "Note that clothing is exclusively for performance"] },
    ],
    conditional: [
      { item: "Music lessons for current professional skills", value: 400, tag: "Education", summary: "Lessons that maintain or improve skills for current professional work.", scenario: "Jazz pianist takes advanced harmony lessons $400 to improve jazz performance skills -- claimed.", howTo: "Must maintain or improve skills for CURRENT professional work, not enter the profession.", watchOut: "Learning a completely new instrument for a different career = not deductible.", docsNeeded: ["Receipts", "Note of professional relevance"] },
    ],
    notClaimable: [
      { item: "Personal music listening (Spotify/Apple Music)", reason: "Personal entertainment regardless of professional musician status." },
      { item: "Instruments used exclusively for personal playing", reason: "Must be for professional performances or recordings." },
      { item: "Home-to-venue commute", reason: "If you travel to the same regular venue, that is treated as a commute." },
    ],
  },

  actor: {
    avgSalary: 55000,
    claimable: [
      { item: "Acting classes & workshops", value: 800, tag: "Education", summary: "Professional development classes directly related to current acting work.", scenario: "Pays $750 for Meisner technique workshop. Maintains and improves current professional acting skills -- claimed.", howTo: "Keep receipt + workshop description. Must relate to current professional work.", watchOut: "Initial training to enter the profession = not deductible.", docsNeeded: ["Receipt", "Workshop description"] },
      { item: "MEAA union fees", value: 400, tag: "Memberships", summary: "Media Entertainment & Arts Alliance membership.", scenario: "MEAA annual fee $380. Claimed from annual tax statement.", howTo: "Annual tax statement from MEAA.", watchOut: "100% work-related.", docsNeeded: ["MEAA annual tax statement"] },
      { item: "Headshots & portfolio", value: 600, tag: "Marketing", summary: "Professional headshots and show reel production -- essential marketing.", scenario: "Professional headshots $450 + show reel editing $200 = $650. Directly for securing work -- claimed.", howTo: "Keep receipts. Must be for professional acting career, not personal.", watchOut: "Personal portraits or social media photos don't qualify.", docsNeeded: ["Receipts"] },
      { item: "Agent fees (where not withheld from income)", value: 500, tag: "Memberships", summary: "Talent agency commission or fees if paid directly.", scenario: "Pays agent $500 directly for services -- deductible.", howTo: "Keep receipts or agent invoices.", watchOut: "If agent deducts commission from your income, don't also claim -- it's already excluded.", docsNeeded: ["Agent invoice or receipt"] },
      { item: "Home office (audition prep, self-tape)", value: 600, tag: "Home Office", summary: "Self-tape setup and audition preparation at home.", scenario: "4hrs/day at home on self-tapes and preparation. 4 x 5 x 48 x $0.70 = $672.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Costumes & performance clothing (exclusive)", value: 400, tag: "Clothing", summary: "Costumes and clothing exclusively for professional roles.", scenario: "Purchases period costume pieces for a specific production role. $380 -- exclusively for performance.", howTo: "Keep receipt. Must be exclusively for professional roles, not everyday wear.", watchOut: "General clothing worn outside performances cannot be claimed.", docsNeeded: ["Receipt", "Note of exclusive professional use"] },
    ],
    notClaimable: [
      { item: "General gym or personal training", reason: "Personal fitness even if maintaining physical appearance for roles." },
      { item: "Personal grooming and cosmetics", reason: "Personal expense regardless of on-screen appearance needs." },
      { item: "Travel to auditions (generally)", reason: "Travel to auditions is usually a private expense -- work hasn't started yet." },
    ],
  },

  barista: {
    avgSalary: 52000,
    claimable: [
      { item: "Barista & coffee courses", value: 300, tag: "Education", summary: "Professional coffee training courses.", scenario: "ASCA competition prep course $280. Directly relevant to current role -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current hospitality role.", docsNeeded: ["Receipt", "Course description"] },
      { item: "Non-slip safety shoes", value: 130, tag: "Clothing", summary: "Required non-slip footwear for hospitality environments.", scenario: "Non-slip kitchen shoes $120 -- required. Claimed.", howTo: "Keep receipt. Must be required by employer.", watchOut: "'Comfortable shoes' without specific employer requirement don't qualify.", docsNeeded: ["Receipt"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for required work uniform.", scenario: "Washes uniform 5x/week x 48 weeks = 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "RSA licence & food handler certificate", value: 150, tag: "Licences", summary: "Required industry licences.", scenario: "RSA renewal $60 + food handler cert renewal $90 = $150. Both required -- claimed.", howTo: "Keep receipts from registered training providers.", watchOut: "Must be renewals for current role.", docsNeeded: ["Receipts from registered providers"] },
      { item: "Union fees (UNITE / SDA)", value: 250, tag: "Memberships", summary: "Hospitality union membership.", scenario: "SDA annual fee $240. Annual tax statement claimed.", howTo: "Annual tax statement from union.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
    ],
    conditional: [
      { item: "Barista tools (personal tamper, knock box)", value: 150, tag: "Equipment", summary: "Personal professional tools if self-supplied.", scenario: "Purchases personal tamper $120 for work use. Not supplied by employer -- claimed.", howTo: "Keep receipt. Must be your personally purchased tools.", watchOut: "Cafe-provided equipment cannot be claimed.", docsNeeded: ["Receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-cafe commute", reason: "Standard commute rule." },
      { item: "Meals and coffees during shifts", reason: "Personal expense." },
      { item: "Personal coffee equipment at home", reason: "Personal interest -- not work-related." },
    ],
  },

  hospitalitymanager: {
    avgSalary: 75000,
    claimable: [
      { item: "Restaurant & Catering Australia membership", value: 400, tag: "Memberships", summary: "Industry body membership for hospitality managers.", scenario: "RCA annual fee $380. Claimed.", howTo: "Annual tax statement from RCA.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Management & hospitality courses", value: 500, tag: "Education", summary: "Leadership and hospitality management CPD.", scenario: "Management workshop $480. Claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current management role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Work uniform (if required)", value: 200, tag: "Clothing", summary: "Required management uniform.", scenario: "Required branded management uniform. 2 x $90 = $180. Claimed.", howTo: "Keep receipt. Must be employer-branded.", watchOut: "Generic professional clothing doesn't qualify.", docsNeeded: ["Receipt"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion for supplier and staff comms.", scenario: "55% work use on $900/yr = $495.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Home office (rosters, reports)", value: 500, tag: "Home Office", summary: "Admin and rostering done at home.", scenario: "2hrs/evening x 5 nights x 48 x $0.70 = $336.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Vehicle costs (multi-venue role)", value: 1000, tag: "Travel", summary: "If managing multiple venues.", scenario: "Logbook: 35% work visiting multiple venues. Annual car costs $10,000. Claims $3,500.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to primary venue = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Meals and drinks at work", reason: "Personal expense even in food service industry." },
      { item: "Home-to-venue commute", reason: "Standard commute rule." },
    ],
  },

  travelagent: {
    avgSalary: 58000,
    claimable: [
      { item: "AFTA membership & accreditation", value: 400, tag: "Memberships", summary: "Australian Federation of Travel Agents membership.", scenario: "AFTA annual fee $380. Claimed.", howTo: "Annual tax statement from AFTA.", watchOut: "100% work-related.", docsNeeded: ["AFTA annual tax statement"] },
      { item: "Destination familiarisation trips (partial)", value: 600, tag: "Travel", summary: "FAM trips with work-related learning component.", scenario: "Employer-assisted FAM trip to Europe. Personal portion excluded -- work component $580 claimed.", howTo: "Keep receipts. Document specific work-learning purpose. Apportion any personal benefit.", watchOut: "Pure holiday trips cannot be claimed. Must have genuine work purpose and documentation.", docsNeeded: ["Trip receipts", "Evidence of work purpose", "Work itinerary"] },
      { item: "Travel booking software subscriptions", value: 300, tag: "Software", summary: "GDS or booking tool personal subscriptions.", scenario: "Sabre GDS training subscription $280/yr. Claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided access cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone (work portion)", value: 250, tag: "Phone", summary: "Work-use for client bookings and supplier comms.", scenario: "50% work use on $720/yr = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
      { item: "Home office (quotes, research)", value: 500, tag: "Home Office", summary: "Research and client work done at home.", scenario: "3hrs/week at home. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Trade publications & destination resources", value: 200, tag: "Education", summary: "Travel trade publications and destination guides.", scenario: "Traveltrade Weekly and destination resources $180/yr. Work reference materials -- claimed.", howTo: "Keep subscription receipts. Must be professional trade resources.", watchOut: "General travel magazines for personal reading don't qualify.", docsNeeded: ["Subscription receipts"] },
    ],
    notClaimable: [
      { item: "Personal holidays", reason: "Even if learning about destinations -- personal travel is not deductible." },
      { item: "Home-to-office commute", reason: "Standard commute rule." },
    ],
  },

  eventplanner: {
    avgSalary: 70000,
    claimable: [
      { item: "EEAA / MEA membership & certification", value: 400, tag: "Memberships", summary: "Exhibition & Events Association or Meetings & Events Australia membership.", scenario: "MEA annual fee $380. Claimed.", howTo: "Annual tax statement from MEA.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Event management software", value: 400, tag: "Software", summary: "Project management and event software personally subscribed.", scenario: "Eventbrite Pro $360/yr + planning software $120/yr = $480. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "High work-use for supplier and client comms.", scenario: "60% work use on $900/yr = $540.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Vehicle costs (site inspections, event days)", value: 1500, tag: "Vehicle", summary: "Driving to venues, suppliers and event sites.", scenario: "Logbook: 40% work. Annual car costs $11,000. Claims $4,400.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "Home office (planning, coordination)", value: 700, tag: "Home Office", summary: "Event coordination and admin done at home.", scenario: "3hrs/evening x 4 nights x 48 x $0.70 = $403.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Work attire for formal events", value: 300, tag: "Clothing", summary: "Required formal attire for specific high-end events.", scenario: "Event manager required to wear formal attire for specific award ceremonies. $280 -- documented requirement.", howTo: "Keep receipt. Document employer/client specific requirement.", watchOut: "General professional clothing is personal. Must be specifically required for formal events.", docsNeeded: ["Receipt", "Event dress code requirement"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal attendance at events and functions", reason: "Attending events for personal enjoyment is not deductible." },
      { item: "Client entertainment", reason: "ATO is very strict -- must directly connect to earning specific income." },
    ],
  },

  flightattendant: {
    avgSalary: 65000,
    claimable: [
      { item: "Transport Workers Union (TWU) fees", value: 400, tag: "Memberships", summary: "TWU membership -- fully deductible.", scenario: "TWU annual fee $380. Annual tax statement claimed.", howTo: "Annual tax statement from TWU in July.", watchOut: "100% work-related.", docsNeeded: ["TWU annual tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory airline uniform.", scenario: "Washes uniform 4x/week x 48 weeks = 192 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Overnight meal allowances", value: 1200, tag: "Meals", summary: "Meals during overnight layovers -- up to ATO reasonable amounts.", scenario: "Domestic overnight layovers 60 nights/yr. ATO reasonable amount ~$33/meal. Claims reasonable amounts.", howTo: "Check ATO's reasonable meal amounts table. Keep receipts for amounts over the threshold.", watchOut: "Day flights with no overnight layover -- meals are NOT deductible.", docsNeeded: ["Duty roster showing overnight trips", "Receipts for amounts over ATO reasonable amounts"] },
      { item: "Safety training certifications (self-funded)", value: 300, tag: "Education", summary: "Required safety certifications if personally funded.", scenario: "First aid renewal $280 -- required by airline but self-funded. Claimed.", howTo: "Keep receipt. Must be required for your role.", watchOut: "Airline-funded training cannot be claimed.", docsNeeded: ["Receipt", "Evidence of self-funding"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Work-use proportion of personal phone.", scenario: "25% work use on $600/yr = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "If work phone provided, cannot claim personal phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Home office (rosters, training materials)", value: 200, tag: "Home Office", summary: "Reviewing rosters and training materials at home.", scenario: "2hrs/week at home reviewing training and completing admin. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-airport commute", reason: "Standard commute rule applies to getting to your base airport." },
      { item: "Airline-issued uniforms and equipment", reason: "Cannot claim employer-provided items." },
      { item: "Personal travel on staff discount tickets", reason: "Personal travel even at concessional rates is personal." },
    ],
  },

  salesrep: {
    avgSalary: 90000,
    claimable: [
      { item: "Vehicle costs (logbook -- client visits)", value: 4000, tag: "Vehicle", atoUrl: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/work-related-deductions/cars-transport-and-travel/motor-vehicle-and-car-expenses/expenses-for-a-car-you-own-or-lease", summary: "Driving to client meetings -- your biggest deduction.", scenario: "Sales rep drives to clients daily. Logbook: 75% work. Annual car costs $14,000. Claims $10,500.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Home to main office = commute. Office to clients = deductible.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "High work-use for client and pipeline management.", scenario: "65% work use on $1,200/yr = $780.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "CRM & sales tools (personal subscription)", value: 400, tag: "Software", summary: "CRM, prospecting and productivity tools.", scenario: "Salesforce personal licence $360/yr + LinkedIn Sales Navigator $400/yr = $760. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided CRM access cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (admin, reporting)", value: 600, tag: "Home Office", summary: "Admin, reporting and client research done at home.", scenario: "2hrs/day at home on admin. 2 x 5 x 48 x $0.70 = $336.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "Professional development courses", value: 400, tag: "Education", summary: "Sales skills, negotiation and product knowledge training.", scenario: "Sales training workshop $380. Claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current sales role.", docsNeeded: ["Receipt", "Course outline"] },
    ],
    conditional: [
      { item: "Accommodation & meals (interstate travel)", value: 600, tag: "Travel", summary: "Overnight travel to client sites in other cities.", scenario: "Travels interstate for 8 client visits/yr. Hotel $180/night + meals = $600/yr -- claimed.", howTo: "Keep all receipts. Must be for overnight business travel.", watchOut: "Day trips -- accommodation and most meals not deductible.", docsNeeded: ["Receipts", "Duty diary showing business purpose"] },
    ],
    notClaimable: [
      { item: "Home-to-main-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict -- must directly connect to earning specific income." },
      { item: "Personal clothing", reason: "Professional attire is personal even in a sales role." },
    ],
  },

  hairdresser: {
    avgSalary: 55000,
    claimable: [
      { item: "Professional scissors & tools", value: 600, tag: "Equipment", summary: "Personal professional hairdressing tools.", scenario: "Joewell scissors $380 (depreciated) + thinning shears $120 (instant) + comb set $45. Claims instantly on items under $300.", howTo: "Under $300 = instant. Over $300 = depreciate. Must be personally owned.", watchOut: "Salon-provided tools cannot be claimed.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Hair Stylists Australia / HBIA membership", value: 300, tag: "Memberships", summary: "Industry body membership.", scenario: "HBIA annual fee $280. Claimed.", howTo: "Annual tax statement from HBIA.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Hairdressing courses & upskilling", value: 400, tag: "Education", summary: "Colour, cutting and styling courses.", scenario: "Oribe colour course $380. Maintains current hairdressing skills -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current hairdressing role.", docsNeeded: ["Receipt", "Course description"] },
      { item: "Work uniform / salon clothing", value: 200, tag: "Clothing", summary: "Required salon uniform or black professional clothing.", scenario: "Salon requires all-black outfit with branded apron. Buys $180 in required items -- claimed.", howTo: "Keep receipt. Must be specifically required by employer.", watchOut: "Generic black clothing worn outside work is borderline.", docsNeeded: ["Receipt", "Employer uniform requirement"] },
      { item: "Phone (work portion)", value: 150, tag: "Phone", summary: "Client bookings and comms.", scenario: "25% work use on $600/yr = $150.", howTo: "4-week diary. Apply % to full year.", watchOut: "Honest apportionment required.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Self-employed: product costs & supplies", value: 500, tag: "Supplies", summary: "If you supply your own products for clients.", scenario: "Mobile hairdresser buys $400 in colour and styling products for client use -- claimed.", howTo: "Keep all receipts. Only claim products used for client work.", watchOut: "Salon-supplied products cannot be claimed. Own products only.", docsNeeded: ["Receipts"] },
    ],
    notClaimable: [
      { item: "Personal hair products at home", reason: "Home haircare is personal." },
      { item: "Home-to-salon commute", reason: "Standard commute rule." },
      { item: "Personal hair services", reason: "Your own hair treatments are personal even as a hairdresser." },
    ],
  },

  personaltrainer: {
    avgSalary: 60000,
    claimable: [
      { item: "Fitness Australia / ESSA registration & CPD", value: 500, tag: "Memberships", summary: "Required registration and professional development.", scenario: "Fitness Australia registration $420 + CPD workshop $180 = $600. Claimed.", howTo: "Annual statement from Fitness Australia + CPD receipts.", watchOut: "CPD must relate to current PT role.", docsNeeded: ["Fitness Australia statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 400, tag: "Insurance", summary: "PI insurance required for personal training.", scenario: "Annual PI policy $380 -- claimed.", howTo: "Keep insurance receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Training equipment & props (self-funded)", value: 500, tag: "Equipment", summary: "Resistance bands, cones, portable equipment for client sessions.", scenario: "Buys resistance band set $120, cones $45, TRX $180 = $345 for client training. Claimed.", howTo: "Keep receipts. Must be used for client sessions.", watchOut: "Gym-provided equipment cannot be claimed.", docsNeeded: ["Receipts"] },
      { item: "Work attire (branded PT clothing)", value: 200, tag: "Clothing", summary: "Branded professional activewear required for work.", scenario: "Requires clients to recognise staff by branded PT clothing. $180 in branded items -- claimed.", howTo: "Keep receipt. Must be employer-branded or required for work identification.", watchOut: "Generic activewear you also wear personally is personal expense.", docsNeeded: ["Receipt", "Evidence of work requirement"] },
      { item: "Phone (work portion)", value: 250, tag: "Phone", summary: "Work-use for client comms and program management.", scenario: "50% work use on $720/yr = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim 100% on mixed phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [
      { item: "Vehicle costs (mobile PT -- client travel)", value: 2000, tag: "Vehicle", summary: "If you're a mobile PT travelling to client homes.", scenario: "Mobile PT logbook: 70% work. Annual car costs $10,000. Claims $7,000.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to first client of the day = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
    ],
    notClaimable: [
      { item: "Personal gym membership", reason: "Even for maintaining your own fitness -- personal expense." },
      { item: "Personal protein powder or supplements", reason: "Personal dietary choices are not deductible." },
      { item: "Home-to-gym commute", reason: "Standard commute rule." },
    ],
  },

  retailmanager: {
    avgSalary: 70000,
    claimable: [
      { item: "SDA / retail union fees", value: 300, tag: "Memberships", summary: "Shop Distributive and Allied Employees Association membership.", scenario: "SDA annual fee $280. Annual tax statement claimed.", howTo: "Annual tax statement from SDA.", watchOut: "100% work-related.", docsNeeded: ["SDA annual tax statement"] },
      { item: "Retail management courses & CPD", value: 400, tag: "Education", summary: "Management and retail skills development.", scenario: "Retail management workshop $380. Claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current retail management role.", docsNeeded: ["Receipt", "Course outline"] },
      { item: "Work uniform (if required)", value: 150, tag: "Clothing", summary: "Required branded retail uniform.", scenario: "Required branded polo shirts. 3 x $45 = $135. Claimed.", howTo: "Keep receipt. Must be employer-branded.", watchOut: "Generic clothing doesn't qualify.", docsNeeded: ["Receipt"] },
      { item: "Phone & internet (work portion)", value: 300, tag: "Phone", summary: "Work-use for staff scheduling and supplier comms.", scenario: "40% work use on $720/yr = $288.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Home office (rostering, reporting)", value: 400, tag: "Home Office", summary: "Admin and rostering done at home.", scenario: "2hrs/evening x 3 nights x 48 x $0.70 = $202.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Vehicle costs (multi-store role)", value: 1000, tag: "Travel", summary: "Driving between multiple retail locations.", scenario: "Logbook: 30% work visiting multiple stores. Annual car costs $10,000. Claims $3,000.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to primary store = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-store commute", reason: "Standard commute rule." },
      { item: "Personal purchases from the store", reason: "Staff discounts on personal purchases are personal." },
    ],
  },

  propertymanager: {
    avgSalary: 80000,
    claimable: [
      { item: "Real estate licence renewal", value: 400, tag: "Licences", summary: "Required property management licence renewal.", scenario: "CPV licence renewal $380 -- claimed.", howTo: "Keep receipt from Consumer Affairs VIC or state equivalent.", watchOut: "Initial licence training generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "REIV / REIA membership & CPD", value: 500, tag: "Memberships", summary: "Real Estate Institute membership and mandatory CPD.", scenario: "REIV annual fee $480 + CPD $180 = $660. Claimed.", howTo: "Annual tax statement from REIV + CPD receipts.", watchOut: "CPD must relate to current property management role.", docsNeeded: ["REIV tax statement", "CPD receipts"] },
      { item: "Vehicle costs (property inspections)", value: 3000, tag: "Vehicle", summary: "Driving to rental properties for inspections and maintenance.", scenario: "Property manager visits 150 properties/month. Logbook: 70% work. Annual car costs $12,000. Claims $8,400.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "High work-use for tenant and owner comms.", scenario: "65% work use on $1,200/yr = $780.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Home office (admin, correspondence)", value: 600, tag: "Home Office", summary: "After-hours admin and tenant correspondence.", scenario: "2hrs/evening x 5 nights x 48 x $0.70 = $336.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    conditional: [
      { item: "Property management software (personal)", value: 400, tag: "Software", summary: "Inspection apps and PM software personally subscribed.", scenario: "PropertyMe personal subscription $380/yr. Claimed.", howTo: "Keep subscription receipt.", watchOut: "Agency-provided software cannot be claimed.", docsNeeded: ["Subscription receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Client entertainment", reason: "ATO is very strict." },
      { item: "Investment property expenses for personal properties", reason: "Personal investment properties are handled under rental income deductions, not work deductions." },
    ],
  },

  buildinginspector: {
    avgSalary: 90000,
    claimable: [
      { item: "Building inspector licence renewal", value: 400, tag: "Licences", summary: "Required annual licence to carry out building inspections.", scenario: "VIC building inspector registration renewal $380 -- claimed.", howTo: "Keep receipt from VBA or state licensing body.", watchOut: "Initial training costs generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "AIBS membership & CPD", value: 500, tag: "Memberships", summary: "Australian Institute of Building Surveyors membership and CPD.", scenario: "AIBS annual fee $460 + CPD workshop $180 = $640. Claimed.", howTo: "Annual tax statement from AIBS + CPD receipts.", watchOut: "CPD must relate to current role.", docsNeeded: ["AIBS tax statement", "CPD receipts"] },
      { item: "Vehicle costs (site inspections)", value: 3500, tag: "Vehicle", summary: "Driving to inspection sites is your biggest deduction.", scenario: "Inspects 8 properties/day. Logbook: 80% work. Annual car costs $13,000. Claims $10,400.", howTo: "12-week logbook. Apply business % to all costs.", watchOut: "Home to first site = commute.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "PPE & safety equipment", value: 250, tag: "Clothing", summary: "Hard hat, hi-vis, safety boots for site inspections.", scenario: "Hard hat $45, hi-vis $65, steel caps $160 = $270. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Generic clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Phone & tablet (work portion)", value: 400, tag: "Phone", summary: "High work-use for site reporting and client comms.", scenario: "60% work use on $1,200/yr = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Inspection software & apps", value: 300, tag: "Software", summary: "Inspection reporting apps personally subscribed.", scenario: "HappyCo inspection app $280/yr. Claimed.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided apps cannot be claimed.", docsNeeded: ["Subscription receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-first-site commute", reason: "Standard commute rule." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  quantitysurveyor: {
    avgSalary: 100000,
    claimable: [
      { item: "AIQS membership & CPD", value: 600, tag: "Memberships", summary: "Australian Institute of Quantity Surveyors membership and CPD.", scenario: "AIQS annual fee $540 + CPD conference $220 = $760. Claimed.", howTo: "Annual tax statement from AIQS + CPD receipts.", watchOut: "CPD must relate to current QS role.", docsNeeded: ["AIQS tax statement", "CPD receipts"] },
      { item: "QS software & estimating tools", value: 700, tag: "Software", summary: "Estimating and cost planning software personally subscribed.", scenario: "CostX personal licence $680/yr. Claimed.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided software cannot be claimed.", docsNeeded: ["Subscription receipt"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "QSs who WFH on estimates and reports.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use proportion.", scenario: "45% work use on $1,000/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "PPE for site visits", value: 200, tag: "Clothing", summary: "Required safety gear for site inspections.", scenario: "Hard hat $45, hi-vis $65, safety boots $120 = $230. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "If employer provides PPE, cannot claim.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Vehicle costs (site visits)", value: 1500, tag: "Travel", summary: "Driving to construction sites.", scenario: "Logbook: 40% work. Annual car costs $12,000. Claims $4,800.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal finance or investment tools", reason: "Must relate to current QS role, not personal investing." },
    ],
  },

  facilitiesmanager: {
    avgSalary: 90000,
    claimable: [
      { item: "FMA membership & CPD", value: 500, tag: "Memberships", summary: "Facility Management Association membership and CPD.", scenario: "FMA annual fee $460 + CPD workshop $160 = $620. Claimed.", howTo: "Annual tax statement from FMA + CPD receipts.", watchOut: "CPD must relate to current FM role.", docsNeeded: ["FMA tax statement", "CPD receipts"] },
      { item: "Vehicle costs (site inspections)", value: 2000, tag: "Vehicle", summary: "Driving between facilities and sites.", scenario: "Logbook: 50% work. Annual car costs $12,000. Claims $6,000.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to primary facility = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use for contractor and tenant comms.", scenario: "55% work use on $900/yr = $495.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Home office (after-hours admin)", value: 600, tag: "Home Office", summary: "Admin and planning done at home.", scenario: "2hrs/evening x 4 nights x 48 x $0.70 = $269.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
      { item: "PPE for site inspections", value: 200, tag: "Clothing", summary: "Safety gear for facility site visits.", scenario: "Hard hat $45, hi-vis $65, safety boots $120 = $230. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Employer-provided PPE cannot be claimed.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Facilities management software", value: 300, tag: "Software", summary: "CMMS or CAFM software personally subscribed.", scenario: "FM software subscription $280/yr. Claimed.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipt"] },
    ],
    notClaimable: [
      { item: "Home-to-primary-facility commute", reason: "Standard commute rule." },
      { item: "Personal maintenance tools at home", reason: "Home maintenance is personal." },
    ],
  },

  townplanner: {
    avgSalary: 95000,
    claimable: [
      { item: "PIA membership & CPP assessment", value: 500, tag: "Memberships", summary: "Planning Institute of Australia membership and Certified Practicing Planner fees.", scenario: "PIA annual fee $460 + CPP renewal $80 = $540. Claimed.", howTo: "Annual tax statement from PIA.", watchOut: "100% work-related.", docsNeeded: ["PIA annual tax statement"] },
      { item: "Planning software & GIS tools (personal)", value: 500, tag: "Software", summary: "GIS mapping and planning analysis software.", scenario: "ESRI ArcGIS personal licence $480/yr. Work tool -- claimed.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipt"] },
      { item: "Home office (WFH hours)", value: 900, tag: "Home Office", summary: "Town planners who WFH on reports and analysis.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Phone & internet (work portion)", value: 350, tag: "Phone", summary: "Work-use proportion.", scenario: "40% work use on $900/yr = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Planning publications & resources", value: 300, tag: "Education", summary: "Planning law and policy reference materials.", scenario: "Planning & Environment Act commentary $280. Claimed.", howTo: "Keep receipts. Must relate to current planning work.", watchOut: "General environmental or political interest publications don't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Vehicle costs (site inspections)", value: 1000, tag: "Travel", summary: "Driving to planning sites and development inspections.", scenario: "Logbook: 35% work. Annual car costs $10,000. Claims $3,500.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal property investment research", reason: "Personal investing is separate from professional planning work." },
    ],
  },

  pilot: {
    avgSalary: 150000,
    claimable: [
      { item: "CASA licence & medical renewal", value: 600, tag: "Licences", summary: "Required CASA flight crew licence and mandatory medical.", scenario: "ATPL renewal $280 + Class 1 medical $320 = $600. Both required to fly -- claimed.", howTo: "Keep receipts from CASA and approved aviation medical examiner.", watchOut: "Initial licence training costs generally not deductible -- renewals only.", docsNeeded: ["CASA renewal receipt", "Medical certificate receipt"] },
      { item: "AFAP / AIPA union fees", value: 500, tag: "Memberships", summary: "Australian Federation of Air Pilots or AIPA membership.", scenario: "AIPA annual fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from AIPA in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Simulator & recurrent training (self-funded)", value: 1500, tag: "Education", summary: "Type rating and recurrent training costs not covered by employer.", scenario: "Self-funded simulator session $1,400. Required for currency -- claimed.", howTo: "Keep receipt. Must be required for current flying role.", watchOut: "Employer-funded training cannot be claimed.", docsNeeded: ["Receipt", "Evidence of self-funding and work requirement"] },
      { item: "Aviation charts, apps & publications", value: 300, tag: "Software", summary: "Required flight planning resources.", scenario: "AvPlan EFB subscription $180/yr + NOTAMs service $120/yr = $300. Required tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Employer-provided navigation tools cannot be claimed.", docsNeeded: ["Subscription receipts"] },
      { item: "Overnight meal allowances", value: 1500, tag: "Meals", summary: "Meals during overnight layovers -- ATO reasonable amounts.", scenario: "Overnight layovers 80 nights/yr. Claims ATO reasonable meal amounts per location.", howTo: "Check ATO's reasonable amounts table. Keep receipts for amounts over the threshold.", watchOut: "Day trips without overnight layover -- meals generally not deductible.", docsNeeded: ["Flight schedule showing overnight layovers", "Receipts for amounts over ATO reasonable amounts"] },
    ],
    conditional: [
      { item: "Home office (flight planning, study)", value: 400, tag: "Home Office", summary: "Route planning, study and admin done at home.", scenario: "3hrs/week at home on flight planning and study. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-airport commute", reason: "Standard commute rule applies to travelling to your home base." },
      { item: "Employer-funded training", reason: "Cannot claim costs covered by your airline." },
      { item: "Personal flights on staff travel", reason: "Personal staff travel is personal expense." },
    ],
  },

  busdriver: {
    avgSalary: 65000,
    claimable: [
      { item: "MR/HR/HC licence renewal", value: 300, tag: "Licences", summary: "Required heavy vehicle licence renewal.", scenario: "HR licence renewal $280 -- claimed.", howTo: "Keep receipt from state licensing body.", watchOut: "Initial training costs generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "TWU / RTBU union fees", value: 400, tag: "Memberships", summary: "Transport Workers Union or Rail, Tram & Bus Union membership.", scenario: "TWU annual fee $380. Annual tax statement claimed.", howTo: "Annual tax statement from TWU or RTBU in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory driver uniform.", scenario: "Washes uniform 5x/week x 48 = 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Safety boots (if required)", value: 150, tag: "Clothing", summary: "Required safety footwear.", scenario: "Required safety shoes $140 -- claimed.", howTo: "Keep receipt. Must be employer-required.", watchOut: "If employer provides footwear, cannot claim.", docsNeeded: ["Receipt"] },
      { item: "Fatigue management & CPD training", value: 200, tag: "Education", summary: "Required driver training courses.", scenario: "Fatigue management course $180 -- required. Claimed.", howTo: "Keep receipt.", watchOut: "Must be required for current role.", docsNeeded: ["Receipt"] },
    ],
    conditional: [
      { item: "Home office (route planning, admin)", value: 150, tag: "Home Office", summary: "Route planning or admin done at home.", scenario: "2hrs/week at home. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-depot commute", reason: "Standard commute rule." },
      { item: "Meals during day shifts", reason: "Personal expense unless receiving a declared meal allowance." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  forklift: {
    avgSalary: 62000,
    claimable: [
      { item: "Forklift licence renewal", value: 200, tag: "Licences", summary: "Required forklift operator ticket renewal.", scenario: "LF/LO ticket renewal $180 -- claimed.", howTo: "Keep receipt from registered training organisation.", watchOut: "Initial licence training generally not deductible.", docsNeeded: ["Licence renewal receipt"] },
      { item: "Safety boots, hi-vis & PPE", value: 300, tag: "Clothing", summary: "Required safety equipment for warehouse environments.", scenario: "Steel caps $180, hi-vis $65, safety glasses $35 = $280. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Generic clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "TWU / union fees", value: 350, tag: "Memberships", summary: "Transport Workers Union membership.", scenario: "TWU annual fee $320. Annual tax statement claimed.", howTo: "Annual tax statement from TWU.", watchOut: "100% work-related.", docsNeeded: ["Union tax statement"] },
      { item: "Uniform laundering", value: 150, tag: "Clothing", summary: "ATO formula for compulsory work uniform.", scenario: "Washes uniform 5x/week x 48 = 240 loads x $1. Claims $150.", howTo: "$1/load. No receipts under $150.", watchOut: "Only for compulsory distinctive uniforms.", docsNeeded: ["Weekly tally"] },
      { item: "Phone (work portion)", value: 100, tag: "Phone", summary: "Work-use portion of personal phone.", scenario: "20% work use on $600/yr = $120.", howTo: "4-week diary. Apply % to full year.", watchOut: "If work radio or device provided, cannot claim personal phone.", docsNeeded: ["4-week diary", "Annual phone cost"] },
    ],
    conditional: [],
    notClaimable: [
      { item: "Home-to-warehouse commute", reason: "Standard commute rule." },
      { item: "Meals during shifts", reason: "Personal expense." },
      { item: "Employer-issued equipment or tools", reason: "Cannot claim provided items." },
    ],
  },

  logistics: {
    avgSalary: 75000,
    claimable: [
      { item: "CILTA / Logistics certification", value: 400, tag: "Memberships", summary: "Chartered Institute of Logistics and Transport Australia membership.", scenario: "CILTA annual fee $380. Claimed.", howTo: "Annual tax statement from CILTA.", watchOut: "100% work-related.", docsNeeded: ["CILTA annual tax statement"] },
      { item: "Logistics software tools (personal)", value: 300, tag: "Software", summary: "Supply chain and logistics management tools.", scenario: "Personal TMS subscription $280/yr. Claimed.", howTo: "Keep subscription receipt.", watchOut: "Employer-provided tools cannot be claimed.", docsNeeded: ["Subscription receipt"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use for supplier, carrier and team comms.", scenario: "55% work use on $900/yr = $495.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Home office (admin, planning)", value: 600, tag: "Home Office", summary: "Logistics coordination and planning done at home.", scenario: "WFH 2 days/week. 2 x 8 x 48 x $0.70 = $538.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
    ],
    conditional: [
      { item: "Vehicle costs (site and supplier visits)", value: 1500, tag: "Travel", summary: "Driving to warehouses, suppliers or ports.", scenario: "Logbook: 40% work. Annual car costs $11,000. Claims $4,400.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal online shopping delivery costs", reason: "Personal purchases are personal." },
    ],
  },

  seafarer: {
    avgSalary: 90000,
    claimable: [
      { item: "AMSA licence & medical renewal", value: 600, tag: "Licences", summary: "Required AMSA maritime licence and medical certificate.", scenario: "Master class renewal $380 + ENG1 medical $240 = $620. Both required -- claimed.", howTo: "Keep receipts from AMSA and approved maritime medical examiner.", watchOut: "Initial licence training generally not deductible.", docsNeeded: ["AMSA renewal receipt", "Medical certificate receipt"] },
      { item: "MUA / AMOU union fees", value: 500, tag: "Memberships", summary: "Maritime Union of Australia or AMOU membership.", scenario: "MUA annual fee $480. Annual tax statement claimed.", howTo: "Annual tax statement from MUA or AMOU in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "STCW safety training (self-funded)", value: 500, tag: "Education", summary: "Required STCW certificates where self-funded.", scenario: "Advanced firefighting course $480. Self-funded -- claimed.", howTo: "Keep receipt. Must be required for current role.", watchOut: "Company-funded training cannot be claimed.", docsNeeded: ["Receipt", "Evidence of self-funding"] },
      { item: "Overnight allowances (vessel time)", value: 2000, tag: "Meals", summary: "Meals and incidentals during sea time -- ATO reasonable amounts.", scenario: "200 vessel days/yr. Claims ATO reasonable meal amounts for each day.", howTo: "Keep records of vessel days. Claims ATO reasonable amounts per location/vessel.", watchOut: "Must be genuine sea time -- not shore-based days.", docsNeeded: ["Vessel logbook or roster showing sea days", "Receipts if amounts exceed ATO reasonable amounts"] },
      { item: "Work clothing & safety gear", value: 300, tag: "Clothing", summary: "Safety boots, overalls and PPE for vessel work.", scenario: "Safety boots $160, work overalls $120 = $280. Claimed.", howTo: "Keep receipts. Must be safety-rated work clothing.", watchOut: "Employer-issued uniforms cannot be claimed.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Home office (voyage planning, study)", value: 300, tag: "Home Office", summary: "Voyage planning and study done at home between voyages.", scenario: "3hrs/week at home on voyage planning and training. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-port commute", reason: "Standard commute rule applies to travelling to your home port." },
      { item: "Personal travel between voyages", reason: "Personal leave travel is personal." },
    ],
  },

  farmer: {
    avgSalary: 70000,
    claimable: [
      { item: "AgForce / NFF membership", value: 400, tag: "Memberships", summary: "National Farmers Federation or state farming organisation membership.", scenario: "AgForce annual fee $380. Claimed.", howTo: "Annual tax statement from AgForce or NFF.", watchOut: "100% work-related.", docsNeeded: ["Annual tax statement"] },
      { item: "Vehicle costs (logbook -- farm vehicle)", value: 4000, tag: "Vehicle", summary: "Farm vehicle used for work -- claim work-use % of all costs.", scenario: "Ute 90% work use. Annual costs $15,000. Claims $13,500.", howTo: "12-week logbook. Apply business % to all running costs.", watchOut: "Personal use portions must be excluded.", docsNeeded: ["12-week logbook", "All vehicle receipts", "Odometer records"] },
      { item: "Safety boots, hi-vis & PPE", value: 350, tag: "Clothing", summary: "Required safety equipment for farm work.", scenario: "Steel caps $180, hi-vis $65, gloves $45, safety glasses $35 = $325. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Farming tools & equipment (under $300)", value: 500, tag: "Equipment", summary: "Small farming tools and implements.", scenario: "Various hand tools under $300 each. Total $480 -- claimed instantly.", howTo: "Under $300 per item = instant deduction.", watchOut: "Large equipment over $300 = depreciated over effective life.", docsNeeded: ["Receipts"] },
      { item: "Phone & internet (work portion)", value: 300, tag: "Phone", summary: "Work-use for commodity prices, weather and comms.", scenario: "40% work use on $900/yr = $360.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Home office (farm admin, records)", value: 500, tag: "Home Office", summary: "Farm administration and record-keeping at home.", scenario: "3hrs/day on farm admin at home. 3 x 5 x 48 x $0.70 = $504.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home-to-paddock commute (if home is on the farm)", reason: "If you live on the farm, moving around the farm is generally commuting." },
      { item: "Personal food from the farm", reason: "Farm produce for personal consumption is personal." },
      { item: "Farm equipment used for personal projects", reason: "Must apportion work and personal use." },
    ],
  },

  vet: {
    avgSalary: 90000,
    claimable: [
      { item: "AHPRA registration", value: 500, tag: "Memberships", summary: "Annual registration required to practise.", scenario: "$480 AHPRA renewal -- claimed in full.", howTo: "Keep AHPRA tax invoice.", watchOut: "Renewals only.", docsNeeded: ["AHPRA tax invoice"] },
      { item: "AVA membership & CPD", value: 800, tag: "Memberships", summary: "Australian Veterinary Association membership and mandatory CPD.", scenario: "AVA annual fee $720 + CPD conference $280 = $1,000. Claimed.", howTo: "Annual tax statement from AVA + CPD receipts.", watchOut: "CPD must relate to current veterinary role.", docsNeeded: ["AVA tax statement", "CPD receipts"] },
      { item: "Professional indemnity insurance", value: 800, tag: "Insurance", summary: "PI insurance required to practise.", scenario: "Annual Avant/Guild policy $760 -- claimed.", howTo: "Keep insurance receipt.", watchOut: "Only if self-funded.", docsNeeded: ["Insurance receipt"] },
      { item: "Veterinary instruments & equipment", value: 600, tag: "Equipment", summary: "Personal clinical instruments for examinations.", scenario: "Ophthalmoscope $320 (depreciated) + stethoscope $180 (instant). Claims split.", howTo: "Under $300 = instant. Over $300 = depreciate.", watchOut: "Clinic-provided equipment cannot be claimed.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vet journals & clinical databases", value: 400, tag: "Education", summary: "Veterinary clinical references.", scenario: "AVA journal $220/yr + online database $180/yr = $400. Claimed.", howTo: "Keep subscription receipts.", watchOut: "General pet care publications for personal interest don't qualify.", docsNeeded: ["Subscription receipts"] },
    ],
    conditional: [
      { item: "Home office (clinical notes, CPD)", value: 400, tag: "Home Office", summary: "Writing clinical notes and CPD done at home.", scenario: "2hrs/week at home on notes and CPD. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Personal pet care for own animals", reason: "Your own pets' expenses are personal." },
      { item: "Home-to-clinic commute", reason: "Standard commute rule." },
    ],
  },

  environmental: {
    avgSalary: 85000,
    claimable: [
      { item: "EIANZ membership & CPD", value: 500, tag: "Memberships", summary: "Environment Institute of Australia & NZ membership.", scenario: "EIANZ annual fee $460 + CPD conference $180 = $640. Claimed.", howTo: "Annual tax statement from EIANZ + CPD receipts.", watchOut: "CPD must relate to current role.", docsNeeded: ["EIANZ tax statement", "CPD receipts"] },
      { item: "Field sampling equipment (personal)", value: 400, tag: "Equipment", summary: "Personal field equipment for environmental sampling.", scenario: "Purchases GPS unit $280 + sampling tools $120 = $400. Self-funded for work -- claimed.", howTo: "Under $300 = instant. Over $300 = depreciate.", watchOut: "Employer-provided equipment cannot be claimed.", docsNeeded: ["Receipts", "Asset register for items over $300"] },
      { item: "Vehicle costs (field work)", value: 2500, tag: "Vehicle", summary: "Driving to field sites and remote locations.", scenario: "Logbook: 60% work. Annual car costs $12,000. Claims $7,200.", howTo: "12-week logbook or 88c/km.", watchOut: "Home to main office = commute.", docsNeeded: ["12-week logbook or trip diary", "Vehicle receipts if logbook"] },
      { item: "Home office (report writing)", value: 800, tag: "Home Office", summary: "Environmental reports and analysis done at home.", scenario: "WFH 3 days/week. 3 x 8 x 48 x $0.70 = $806.", howTo: "70c/hr. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or calendar records"] },
      { item: "Environmental databases & journals", value: 400, tag: "Education", summary: "Scientific databases and environmental publications.", scenario: "Web of Science $200/yr + environmental journal $200/yr = $400. Claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal interest in nature doesn't make subscriptions deductible.", docsNeeded: ["Subscription receipts"] },
    ],
    conditional: [
      { item: "PPE & field safety equipment", value: 300, tag: "Clothing", summary: "Safety equipment for fieldwork environments.", scenario: "Safety boots $160, hi-vis $65, sun protection $45 = $270. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "General clothing doesn't qualify.", docsNeeded: ["Receipts"] },
    ],
    notClaimable: [
      { item: "Home-to-office commute", reason: "Standard commute rule." },
      { item: "Personal nature conservation activities", reason: "Volunteer or personal conservation activities are not deductible." },
    ],
  },

  mining: {
    avgSalary: 115000,
    claimable: [
      { item: "Mining industry licences & tickets", value: 500, tag: "Licences", summary: "Required site tickets and licence renewals.", scenario: "Mining induction ticket renewal $280 + first aid $220 = $500. Both required -- claimed.", howTo: "Keep receipts from registered training providers.", watchOut: "Must be required for current mining role.", docsNeeded: ["Receipts from registered providers"] },
      { item: "CFMEU / AWU union fees", value: 600, tag: "Memberships", summary: "Mining union membership -- fully deductible.", scenario: "CFMEU Mining annual fee $580. Annual tax statement claimed.", howTo: "Annual tax statement from CFMEU or AWU in July.", watchOut: "100% work-related.", docsNeeded: ["Union annual tax statement"] },
      { item: "Safety boots, hard hat & PPE", value: 400, tag: "Clothing", summary: "Required safety equipment for mine sites.", scenario: "Steel caps $190, hard hat $55, safety glasses $35, gloves $45 = $325. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Site-issued equipment cannot be claimed.", docsNeeded: ["Receipts"] },
      { item: "Overnight allowances (FIFO/DIDO)", value: 2500, tag: "Meals", summary: "Meals and incidentals during FIFO rosters.", scenario: "FIFO 2 weeks on. ATO reasonable amounts per day x 180 days/yr.", howTo: "Check ATO's reasonable meal amounts. Keep receipts for excess amounts.", watchOut: "Site-provided meals cannot be claimed. Only self-funded meals.", docsNeeded: ["Roster showing FIFO days away", "Receipts for amounts over ATO reasonable amounts"] },
      { item: "Vehicle costs (travel to mine site)", value: 1000, tag: "Travel", summary: "Where you personally transport yourself to a mine site.", scenario: "Drives 150km to mine village weekly. 88c/km x 150km x 46 trips = $6,072.", howTo: "Cents per km (88c/km). Keep trip diary. Not a daily commute -- distant worksite rule applies.", watchOut: "If mine provides transport, cannot claim.", docsNeeded: ["Trip diary", "Evidence of distant worksite"] },
    ],
    conditional: [
      { item: "Home office (technical reports, study)", value: 400, tag: "Home Office", summary: "Technical reports and upskilling done at home between rosters.", scenario: "3hrs/week at home on reports and study. 3 x 48 x $0.70 = $101.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine required work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Site-provided meals and accommodation", reason: "Cannot claim what employer already provides." },
      { item: "Personal travel between home and local activities during FIFO", reason: "Leisure travel during FIFO roster is personal." },
    ],
  },

  horticulturalist: {
    avgSalary: 65000,
    claimable: [
      { item: "Horticulture / arborist certification renewal", value: 300, tag: "Licences", summary: "Required certification renewals for professional practice.", scenario: "AQF arborist certificate renewal $280 -- claimed.", howTo: "Keep receipt from registered certifying body.", watchOut: "Initial qualification costs generally not deductible.", docsNeeded: ["Certification renewal receipt"] },
      { item: "Tools & equipment (under $300 each)", value: 600, tag: "Equipment", summary: "Pruning saws, loppers, spades -- tools of trade.", scenario: "Pruning saw $120, loppers $85, secateurs $65 = $270. All under $300 -- claimed.", howTo: "Under $300 per item = instant. Keep receipts.", watchOut: "Tools also used for personal gardening -- must apportion.", docsNeeded: ["Receipts"] },
      { item: "Vehicle costs (logbook)", value: 2500, tag: "Vehicle", summary: "Vehicle used to transport tools to client properties.", scenario: "Ute 80% work use. Annual costs $11,000. Claims $8,800.", howTo: "12-week logbook. Apply business % to all costs.", watchOut: "Home to first client = commute.", docsNeeded: ["12-week logbook", "Vehicle receipts", "Odometer records"] },
      { item: "Safety boots, hi-vis & PPE", value: 300, tag: "Clothing", summary: "Required safety equipment for horticulture/arborist work.", scenario: "Steel caps $160, hi-vis $65, safety gloves $45 = $270. Claimed.", howTo: "Keep receipts. Must be safety-rated.", watchOut: "Regular clothing doesn't qualify.", docsNeeded: ["Receipts"] },
      { item: "Sunscreen (outdoor worker)", value: 80, tag: "Health", summary: "Sun protection for outdoor horticulture work.", scenario: "Buys SPF 50+ sunscreen regularly. $80/yr -- claimed.", howTo: "Keep receipts. ATO allows for outdoor workers.", watchOut: "Cosmetic sunscreen doesn't qualify.", docsNeeded: ["Receipts"] },
    ],
    conditional: [
      { item: "Home office (quotes & admin)", value: 150, tag: "Home Office", summary: "Quoting and invoicing done at home.", scenario: "2hrs/week at home on quotes. 2 x 48 x $0.70 = $67.", howTo: "70c/hr. Time diary.", watchOut: "Must be genuine work.", docsNeeded: ["Time diary"] },
    ],
    notClaimable: [
      { item: "Home to first client commute", reason: "Standard commute rule." },
      { item: "Personal garden supplies at home", reason: "Personal gardening materials are personal expense." },
      { item: "Traffic fines", reason: "Explicitly excluded." },
    ],
  },

  podcaster: {
    avgSalary: 60000,
    claimable: [
      { item: "Podcast recording equipment", value: 800, tag: "Equipment", summary: "Microphone, audio interface, headphones for professional podcasting.", scenario: "Shure SM7B microphone $380 (depreciated) + focusrite interface $180 (instant) + headphones $120 (instant) = $678.", howTo: "Under $300 per item = instant. Over $300 = depreciate over effective life.", watchOut: "Equipment also used for personal use -- must apportion honestly.", docsNeeded: ["Receipts", "Asset register for items over $300", "Work-use % if mixed use"] },
      { item: "Hosting & distribution platforms", value: 400, tag: "Software", summary: "Podcast hosting and distribution subscription fees.", scenario: "Buzzsprout $240/yr + Spotify for Podcasters Pro $120/yr = $360. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Free tier hosting has no cost to claim.", docsNeeded: ["Subscription receipts"] },
      { item: "Audio editing software", value: 300, tag: "Software", summary: "Audacity (free), Adobe Audition, Descript for episode editing.", scenario: "Adobe Audition $360/yr or Descript $288/yr. Work tool -- claimed.", howTo: "Keep subscription receipt.", watchOut: "Personal music production use must be excluded.", docsNeeded: ["Subscription receipt"] },
      { item: "Home studio / home office", value: 700, tag: "Home Office", summary: "Dedicated recording space and editing time from home.", scenario: "Records and edits 3hrs/day x 5 days. 3 x 5 x 48 x $0.70 = $504.", howTo: "70c/hr fixed rate OR actual costs if room exclusively used for podcasting.", watchOut: "Must be genuine work time, not browsing while a mic is on.", docsNeeded: ["Time diary", "If exclusive use: rent and utility bills"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use for recording remote guests, research and promotion.", scenario: "50% work use on $900/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Guest travel & interview expenses", value: 300, tag: "Travel", summary: "Travel to record in-person interviews.", scenario: "Travels to interview 5 guests/yr at $60/trip average = $300. Claimed.", howTo: "Keep all receipts. Document business purpose.", watchOut: "Personal travel with incidental recording doesn't qualify.", docsNeeded: ["Receipts", "Interview documentation"] },
    ],
    notClaimable: [
      { item: "Personal music streaming subscriptions", reason: "Personal entertainment." },
      { item: "General internet browsing for 'research'", reason: "Must be genuine content research directly for episodes." },
    ],
  },

  affiliatemarketer: {
    avgSalary: 70000,
    claimable: [
      { item: "Website hosting & domain costs", value: 400, tag: "Software", summary: "Website infrastructure costs for affiliate content sites.", scenario: "Vercel hosting $240/yr + domain $25/yr + CDN $60/yr = $325. Business infrastructure -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal websites not used for affiliate income don't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Content creation tools & software", value: 500, tag: "Software", summary: "SEO, email, design and analytics tools.", scenario: "Ahrefs $180/yr + Canva Pro $180/yr + ConvertKit $120/yr = $480. Work tools -- claimed.", howTo: "Keep subscription receipts. Must be used for affiliate income generation.", watchOut: "Personal email newsletters unrelated to affiliate content don't qualify.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (content creation hours)", value: 1000, tag: "Home Office", summary: "Creating and managing affiliate content from home.", scenario: "5hrs/day creating content. 5 x 5 x 48 x $0.70 = $840.", howTo: "70c/hr fixed rate. Time diary.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or content publishing records"] },
      { item: "Phone & internet (work portion)", value: 400, tag: "Phone", summary: "Work-use for content research and promotion.", scenario: "50% work use on $900/yr = $450.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Advertising & promotion costs", value: 600, tag: "Marketing", summary: "Paid promotion to drive traffic to affiliate content.", scenario: "Google Ads $400 + social media ads $200 = $600. Business promotion -- claimed.", howTo: "Keep receipts and annual ad platform reports.", watchOut: "Must be promoting your affiliate business -- not personal posts.", docsNeeded: ["Ad platform receipts or annual reports"] },
    ],
    conditional: [
      { item: "Product purchases for reviews (work portion)", value: 400, tag: "Supplies", summary: "Products purchased to review for affiliate commissions.", scenario: "Buys $400 in products specifically to review and generate affiliate commissions. Claimed.", howTo: "Keep receipts. Document that purpose is affiliate review income generation.", watchOut: "Products also used personally -- must honestly apportion or document exclusive review use.", docsNeeded: ["Receipts", "Published review evidence"] },
    ],
    notClaimable: [
      { item: "Personal purchases through own affiliate links", reason: "Personal purchases are personal even if you earn a small commission." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
    ],
  },

  virtualassistant: {
    avgSalary: 60000,
    claimable: [
      { item: "Home office (WFH hours)", value: 1200, tag: "Home Office", summary: "Virtual assistants work entirely from home -- this is your biggest deduction.", scenario: "Full-time VA: 5 x 8 x 48 x $0.70 = $1,344.", howTo: "70c/hr fixed rate. Time diary or client log records.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or client project logs"] },
      { item: "Software subscriptions & tools", value: 500, tag: "Software", summary: "Project management, communication and admin tools.", scenario: "Asana $120/yr + Slack Pro $96/yr + Zoom Pro $200/yr + LastPass $36/yr = $452. Work tools -- claimed.", howTo: "Keep subscription receipts. Must be used for client work.", watchOut: "Personal subscriptions for the same tools cannot be bundled.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "High work-use for client comms.", scenario: "60% work use on $1,200/yr = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
      { item: "Platform fees (Upwork, Fiverr)", value: 400, tag: "Software", summary: "VA platform service fees.", scenario: "Upwork service fees $360/yr. Deductible.", howTo: "Download annual fee statement from platform.", watchOut: "Only the fee portion -- not your gross earnings.", docsNeeded: ["Platform annual fee statement"] },
      { item: "Professional development & upskilling", value: 300, tag: "Education", summary: "VA skills and tools training.", scenario: "VA Bootcamp course $280. Directly improves current VA skills -- claimed.", howTo: "Keep receipt + course description.", watchOut: "Must relate to current VA services offered.", docsNeeded: ["Receipt", "Course description"] },
    ],
    conditional: [
      { item: "Laptop & peripherals (work portion)", value: 800, tag: "Equipment", summary: "Work-use proportion of computer.", scenario: "MacBook $2,400 x 80% work = $1,920 depreciated over 2 years = $960/yr.", howTo: "Calculate work-use %. Depreciate over effective life.", watchOut: "100% claim on device also used personally = audit flag.", docsNeeded: ["Receipt", "Work-use diary"] },
    ],
    notClaimable: [
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
      { item: "Personal subscriptions to same tools used for work", reason: "Only claim work-related subscriptions." },
    ],
  },

  appdeveloper: {
    avgSalary: 95000,
    claimable: [
      { item: "Apple Developer Program / Google Play fees", value: 200, tag: "Licences", summary: "Required developer account fees to publish apps.", scenario: "Apple Developer $149/yr + Google Play $25 (one-time) = $174/yr. Business infrastructure -- claimed.", howTo: "Keep receipts from Apple/Google.", watchOut: "Only claim if actively developing apps for income.", docsNeeded: ["Apple/Google developer receipts"] },
      { item: "Development tools & software", value: 600, tag: "Software", summary: "IDEs, design tools, testing platforms and services.", scenario: "Xcode (free) + Sketch $120/yr + GitHub Pro $48 + cloud services $200 = $368. Work tools -- claimed.", howTo: "Keep subscription receipts.", watchOut: "Personal app projects for hobby use must be excluded.", docsNeeded: ["Subscription receipts"] },
      { item: "Home office (development hours)", value: 1200, tag: "Home Office", summary: "Indie app developers work from home -- claim every hour.", scenario: "Full-time indie dev: 5 x 8 x 48 x $0.70 = $1,344.", howTo: "70c/hr. Time diary or commit logs.", watchOut: "Cannot separately claim internet if using fixed rate.", docsNeeded: ["Time diary or development logs"] },
      { item: "Technical courses & certifications", value: 600, tag: "Education", summary: "Mobile development courses and WWDC content.", scenario: "Swift course $280 + design course $180 + tools training $140 = $600. Work-relevant -- claimed.", howTo: "Keep receipts. Must relate to current app development work.", watchOut: "Hobby learning for personal projects doesn't qualify.", docsNeeded: ["Receipts", "Course descriptions"] },
      { item: "Phone & internet (work portion)", value: 500, tag: "Phone", summary: "Work-use for development, testing and user comms.", scenario: "60% work use on $1,200/yr = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual costs"] },
    ],
    conditional: [
      { item: "Test devices (phones, tablets)", value: 400, tag: "Equipment", summary: "Devices used primarily for app testing.", scenario: "Buys older iPhone $380 exclusively for app testing. Depreciated over 2 years = $190/yr.", howTo: "Keep receipt. Document primary testing purpose.", watchOut: "Devices also used as personal phones -- must apportion.", docsNeeded: ["Receipt", "Documentation of testing purpose"] },
    ],
    notClaimable: [
      { item: "App Store purchases for personal use", reason: "Personal software purchases are not deductible." },
      { item: "Home internet if claiming fixed rate", reason: "70c/hr rate already includes internet." },
      { item: "Hobby app development (no income)", reason: "Must be earning income from apps to deduct development costs." },
    ],
  },

  digitalnomad: {
    avgSalary: 85000,
    claimable: [
      { item: "Home office (when working from Australian address)", value: 600, tag: "Home Office", summary: "Hours worked from an Australian home base.", scenario: "When in Australia 3 months/yr WFH. 3 x 8 x 65 days x $0.70 = $1,092.", howTo: "70c/hr. Keep time diary for Australian WFH periods.", watchOut: "Only claim Australian-based WFH hours -- overseas WFH is complex. Seek tax advice.", docsNeeded: ["Time diary for Australian WFH periods"] },
      { item: "Software & tools subscriptions", value: 600, tag: "Software", summary: "Remote work tools and productivity software.", scenario: "Notion $96/yr + Slack $180/yr + Zoom $200/yr + VPN $100/yr = $576. Work tools -- claimed.", howTo: "Keep subscription receipts. Must be for your Australian income-earning activity.", watchOut: "Tools used exclusively for overseas clients may not be deductible against Australian income.", docsNeeded: ["Subscription receipts"] },
      { item: "Phone & international data plan (work portion)", value: 500, tag: "Phone", summary: "Work-use proportion of phone plan.", scenario: "60% work use on $1,200/yr international plan = $720.", howTo: "4-week diary. Apply % to full year.", watchOut: "Cannot claim internet separately if using fixed rate home office.", docsNeeded: ["4-week diary", "Annual plan cost"] },
      { item: "Professional memberships & CPD", value: 400, tag: "Memberships", summary: "Professional body membership maintained regardless of location.", scenario: "Industry association annual fee $380. Work-related -- claimed.", howTo: "Keep annual tax statement.", watchOut: "Must relate to current income-earning activity.", docsNeeded: ["Annual tax statement"] },
    ],
    conditional: [
      { item: "Co-working space (work portion)", value: 800, tag: "Home Office", summary: "Co-working memberships used for work.", scenario: "Co-working space $200/month x 4 months in Australia = $800. Work expenses -- claimed.", howTo: "Keep receipts from co-working spaces. Only claim Australian work periods.", watchOut: "Overseas co-working space costs are complex -- seek specialist tax advice.", docsNeeded: ["Co-working space receipts"] },
    ],
    notClaimable: [
      { item: "International travel costs (generally)", reason: "Travel as a digital nomad is personal -- the work is portable but that doesn't make travel deductible." },
      { item: "Overseas accommodation", reason: "Personal living costs are not deductible even if you work while travelling." },
      { item: "Visa fees for personal travel", reason: "Personal travel documentation is personal expense." },
    ],
  },


};

// --- HELPERS ------------------------------------------------------------------
const TAX = [
  { max: 18200, rate: 0 }, { max: 45000, rate: 0.16 },
  { max: 135000, rate: 0.30 }, { max: 190000, rate: 0.37 },
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

// --- LOGBOOK GUIDE ------------------------------------------------------------
const LOGBOOK_STEPS = [
  { icon: "📅", title: "Choose your 12 weeks", content: "Pick a continuous 12-week period that represents your typical driving pattern. Don't cherry-pick your busiest period -- the ATO requires it to be representative.", tip: "Most people start in September or March to avoid school holidays skewing their pattern." },
  { icon: "🚗", title: "Record EVERY trip", content: "Every single trip during the 12 weeks -- work AND personal. The personal trips are just as important because they determine your total kilometres and therefore your business %.", tip: "For each trip: Date - Start odometer - End odometer - Destination - Purpose (be specific -- 'client meeting at 123 Smith St' not just 'work')" },
  { icon: "📊", title: "Calculate your business %", content: "At the end of 12 weeks: add up all work kilometres. Divide by total kilometres. Multiply by 100. This is your business-use % -- it applies to every car expense for the whole financial year.", tip: "Example: 6,600 work km ÷ 11,000 total km = 60% business use. All car costs x 60% = your deduction." },
  { icon: "🧾", title: "Keep all car receipts", content: "The logbook only determines your %. You still need receipts for everything: fuel, registration, insurance, servicing, tyres, car wash. No receipt = can't include that expense.", tip: "Create a folder in Google Photos called 'Car receipts 2025' and photograph every receipt immediately." },
  { icon: "📏", title: "Record odometer annually", content: "Note your car's odometer on 1 July AND 30 June every year. This gives the ATO the total annual kilometres to verify your claim.", tip: "Set a phone reminder: '1 July -- odometer reading'. Takes 30 seconds." },
  { icon: "⏰", title: "Your logbook lasts 5 years", content: "Once your 12-week logbook is done, you don't need to redo it for 5 years -- unless your work travel patterns change significantly.", tip: "Keep both the logbook AND receipts for 5 years after the last year you used it." },
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
          {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:"#f3f4f6", border:"none", borderRadius:12, padding:14, fontWeight:700, cursor:"pointer", fontSize:15 }}><- Back</button>}
          {step < LOGBOOK_STEPS.length-1
            ? <button onClick={()=>setStep(s=>s+1)} style={{ flex:2, background:"#1e4fd8", border:"none", borderRadius:12, padding:14, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:15 }}>Next -></button>
            : <button onClick={onClose} style={{ flex:2, background:"#059669", border:"none", borderRadius:12, padding:14, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:15 }}>✅ Got it!</button>}
        </div>
      </div>
    </div>
  );
}

// --- FLIP CARD ----------------------------------------------------------------
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
            <div style={{ marginTop:8, background:"#eff6ff", borderRadius:6, padding:"4px 8px" }}>
              <p style={{ fontSize:11, color:"#1e4fd8", fontWeight:700 }}>Tap to flip 🃏</p>
            </div>
          </div>
        </div>
      </div>
      {/* BACK */}
      <div className={`card-side ${flipped ? "visible" : "hidden"}`}
        style={{ background:"#fff", borderRadius:12, border:"2px solid #1e4fd8", padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
            <span className="stag" style={{ background:tagBg, color:tagColor, flexShrink:0 }}>{deduction.tag}</span>
            <p style={{ fontWeight:800, fontSize:13, color:"#111827", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{deduction.item}</p>
          </div>
          <button onClick={()=>flip(false)} style={{ background:"#eff6ff", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, color:"#1e4fd8", cursor:"pointer", fontWeight:700, flexShrink:0, marginLeft:8 }}><- Back</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#059669", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>📋 Real Example</p>
            <p style={{ fontSize:13, color:"#14532d", lineHeight:1.65 }}>{deduction.scenario}</p>
          </div>
          <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"10px 12px" }}>
            <p style={{ fontSize:10, fontWeight:800, color:"#1e4fd8", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>✅ How to Claim It</p>
            <p style={{ fontSize:13, color:"#0f1e3d", lineHeight:1.65 }}>{deduction.howTo}</p>
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
              <button onClick={()=>showLogbook()} style={{ marginTop:10, width:"100%", background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", border:"none", borderRadius:9, padding:"10px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                📖 Open Logbook Guide -- Step by step ->
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN ---------------------------------------------------------------------
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

  const NEEDS_LOGBOOK = ["tradie","electrician","plumber","concreter","truckie","uber","delivery","realestate","lawyer","engineer","photographer","doctor","cleaner","ecommerce","freelancer","carpenter","welder","painter","tiler","pestcontrol","socialworker","police","salesrep","propertymanager","buildinginspector","quantitysurveyor","facilitiesmanager","townplanner","farmer","vet","environmental","mining","horticulturalist","logisticscoord","mortgagebroker","eventplanner","personaltrainer","retailmanager","hospitalitymanager","travelagent"];

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
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, profession: profession?.id || "unknown" }),
    });
  } catch (e) {
    console.error("Email subscribe failed:", e);
  }
  setEmailSubmitted(true);
}
  function handleShare() {
    const text = `Just used this free Aussie tax tool -- found ${fmt(totalClaim)} in potential deductions as a ${profession?.label}. That's ~${fmt(estimatedSaving)} back. Check yours 👇 isitdeductible.com.au 🇦🇺`;
    if (navigator.share) navigator.share({ text });
    else { navigator.clipboard.writeText(text).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); }); }
  }

  async function handleDownload() {
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = resolve; script.onerror = reject;
        document.head.appendChild(script);
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210; const margin = 18; const contentW = W - margin * 2;
    let y = 0;

    function checkPage(needed = 10) { if (y + needed > 270) { doc.addPage(); y = 18; } }

    // Header
    doc.setFillColor(15, 30, 61); doc.rect(0, 0, W, 40, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(255,255,255);
    doc.text("Is It Deductible?", margin, 16);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(147,197,253);
    doc.text("Australian Tax Deduction Guide -- isitdeductible.com.au", margin, 23);
    doc.setFillColor(30,79,216); doc.roundedRect(margin, 28, 68, 7, 2, 2, "F");
    doc.setFontSize(7); doc.setTextColor(255,255,255);
    doc.text("Updated for 2025-26 Tax Year", margin+3, 33);
    doc.setFontSize(8); doc.setTextColor(147,197,253);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-AU")}`, W-margin, 33, {align:"right"});
    y = 48;

    // Profession banner
    doc.setFillColor(239,246,255); doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
    doc.setFontSize(15); doc.setFont("helvetica","bold"); doc.setTextColor(15,30,61);
    doc.text(`${profession?.label}`, margin+5, y+9);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
    doc.text(`Salary: ${fmt(effectiveSalary)}/yr  -  Marginal rate: ${Math.round(marginalRate*100)}%  -  ato.gov.au`, margin+5, y+17);
    y += 28;

    // Summary boxes
    const boxW = (contentW-6)/3;
    [{label:"Est. Tax Saving",value:fmt(estimatedSaving),color:[5,150,105],bg:[236,253,245]},
     {label:"Definite Claims",value:fmt(data?.claimable?.reduce((s,d)=>s+d.value,0)||0),color:[5,150,105],bg:[240,253,244]},
     {label:"Conditional",value:fmt(data?.conditional?.reduce((s,d)=>s+d.value,0)||0),color:[217,119,6],bg:[255,251,235]}
    ].forEach((box,i) => {
      const bx = margin + i*(boxW+3);
      doc.setFillColor(...box.bg); doc.roundedRect(bx, y, boxW, 18, 2, 2, "F");
      doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(...box.color);
      doc.text(box.label.toUpperCase(), bx+boxW/2, y+6, {align:"center"});
      doc.setFontSize(13); doc.setFont("helvetica","bold");
      doc.text(box.value, bx+boxW/2, y+14, {align:"center"});
    });
    y += 24;

    function renderSection(title, items, borderColor, bgColor, type) {
      checkPage(16);
      doc.setFillColor(...bgColor); doc.rect(margin, y, contentW, 8, "F");
      doc.setFillColor(...borderColor); doc.rect(margin, y, 3, 8, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...borderColor);
      doc.text(title, margin+7, y+5.5);
      y += 12;
      items.forEach(d => {
        const saving = Math.round(d.value*marginalRate);
        checkPage(28);
        doc.setFillColor(250,250,252); doc.roundedRect(margin, y, contentW, 24, 2, 2, "F");
        doc.setDrawColor(226,232,240); doc.roundedRect(margin, y, contentW, 24, 2, 2, "S");
        doc.setFillColor(...borderColor); doc.rect(margin, y, 3, 24, "F");
        doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(15,30,61);
        doc.text(type==="notclaimable"?`X  ${d.item}`:d.item, margin+7, y+6);
        if (type!=="notclaimable") {
          doc.setFontSize(10); doc.setTextColor(...borderColor);
          doc.text(fmt(d.value), W-margin-2, y+6, {align:"right"});
          doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
          doc.text(`~${fmt(saving)} back`, W-margin-2, y+11, {align:"right"});
        }
        doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(71,85,105);
        const summary = type==="notclaimable"?d.reason:d.summary;
        doc.text(doc.splitTextToSize(summary, contentW-52), margin+7, y+12);
        if (type!=="notclaimable" && d.howTo) {
          doc.setFont("helvetica","italic"); doc.setFontSize(7); doc.setTextColor(100,116,139);
          const ht = doc.splitTextToSize(`How to claim: ${d.howTo}`, contentW-10);
          doc.text(ht.slice(0,2), margin+7, y+19);
        }
        y += 28;
      });
      y += 4;
    }

    if (data?.claimable?.length) renderSection("DEDUCTIONS YOU CAN CLAIM", data.claimable, [5,150,105], [236,253,245], "claimable");
    if (data?.conditional?.length) renderSection("CONDITIONAL DEDUCTIONS", data.conditional, [217,119,6], [255,251,235], "conditional");
    if (data?.notClaimable?.length) renderSection("DO NOT CLAIM - COMMON MISTAKES", data.notClaimable, [220,38,38], [254,242,242], "notclaimable");

    for (let i=1; i<=doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.setFillColor(15,30,61); doc.rect(0,282,W,15,"F");
      doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(147,197,253);
      doc.text("General information only - not tax advice. Verify at ato.gov.au and consult a registered tax agent.", margin, 289);
      doc.text(`Page ${i} of ${doc.getNumberOfPages()}  -  isitdeductible.com.au`, W-margin, 289, {align:"right"});
    }

    doc.save(`IsItDeductible_${profession?.label.replace(/[ /]/g,"_")}_2025-26.pdf`);
  }

  const filteredProfessions = search.trim()
    ? ALL_PROFESSIONS.filter(p => p.label.toLowerCase().includes(search.toLowerCase()))
    : null;

  // -- HOME ------------------------------------------------------------------
  if (screen === "home") return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#eff6ff 0%,#f0f2f8 40%,#ecfdf5 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px" }}>
      <div className="scale-in" style={{ maxWidth:440, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:16 }}>💰</div>
        <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:36, color:"#111827", marginBottom:10, lineHeight:1.2 }}>Is It <em>Deductible?</em></h1>
        <p style={{ color:"#6b7280", fontSize:16, lineHeight:1.7, marginBottom:28, maxWidth:360, margin:"0 auto 28px" }}>
          Find out exactly what you can claim on your Australian tax return -- with real examples, how-to guides, and your estimated refund.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
          {[["🃏","Flip each card -- real example + exactly how to claim it"],["📖","Step-by-step logbook & documentation guides"],["💸","Personalised tax saving estimate in seconds"],["📄","Download a summary for your tax agent"],["👥","87 professions covered across 13 categories"]].map(([icon,text],i)=>(
            <div key={i} className="fade-up" style={{ animationDelay:`${i*0.07}s`, background:"#fff", border:"1px solid #e2e5f0", borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <p style={{ fontSize:13, fontWeight:600, color:"#374151", lineHeight:1.4 }}>{text}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setScreen("select")} style={{ width:"100%", background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", border:"none", borderRadius:14, padding:18, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 24px rgba(30,79,216,0.35)" }}>
          Check My Deductions ->
        </button>
        <p style={{ marginTop:14, fontSize:12, color:"#9ca3af" }}>🇦🇺 Free - Based on ATO guidance - General info only -- not tax advice</p>
        <div style={{ marginTop:10, display:"flex", gap:16, justifyContent:"center" }}>
          <button onClick={()=>setScreen("privacy")} style={{ background:"transparent", border:"none", fontSize:11, color:"#9ca3af", cursor:"pointer", textDecoration:"underline" }}>Privacy Policy</button>
          <button onClick={()=>setScreen("disclaimer")} style={{ background:"transparent", border:"none", fontSize:11, color:"#9ca3af", cursor:"pointer", textDecoration:"underline" }}>Disclaimer</button>
        </div>
      </div>
    </div>
  );

  // -- SELECT PROFESSION -----------------------------------------------------
  if (screen === "select") return (
    <div style={{ minHeight:"100vh", padding:"32px 20px 60px", maxWidth:580, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("home")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:20, padding:0 }}><- Back</button>
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
              ? <p style={{ color:"#9ca3af", fontSize:14, gridColumn:"1/-1" }}>No professions found -- try a different search.</p>
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
              style={{ width:"100%", background: selectedGroup===group.id ? "#1e4fd8" : "#fff", border:`2px solid ${selectedGroup===group.id ? "#1e4fd8" : "#e2e5f0"}`, borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom: selectedGroup===group.id ? 10 : 0 }}
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

  // -- SALARY ----------------------------------------------------------------
  if (screen === "salary") return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"40px 20px", maxWidth:460, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("select")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:20, padding:0 }}><- Back</button>
        <span style={{ fontSize:36 }}>{profession?.emoji}</span>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, marginBottom:6, marginTop:8 }}>Your annual salary?</h2>
        <p style={{ color:"#6b7280", marginBottom:8 }}>Used to calculate your exact tax saving. Not stored anywhere.</p>
        <p style={{ color:"#1e4fd8", fontSize:13, fontWeight:700, marginBottom:24 }}>Average for {profession?.label}: {fmt(data?.avgSalary||80000)}/yr</p>
        <div style={{ position:"relative", marginBottom:12 }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontWeight:800, color:"#9ca3af", fontSize:18 }}>$</span>
          <input autoFocus type="number" value={salaryInput} onChange={e=>setSalaryInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&(setSalary(salaryInput||String(data?.avgSalary)),setScreen("results"),setActiveTab("claimable"))}
            placeholder={String(data?.avgSalary||80000)}
            style={{ width:"100%", border:"2px solid #e2e5f0", borderRadius:12, padding:"16px 16px 16px 36px", fontSize:17, color:"#111827", background:"#fff" }} />
        </div>
        {salaryInput && (
          <div className="scale-in" style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#1e40af", fontWeight:600 }}>
            Marginal rate: {Math.round(getMarginalRate(Number(salaryInput))*100)}% -- every $100 claimed = ${Math.round(getMarginalRate(Number(salaryInput))*100)} back
          </div>
        )}
        <button onClick={()=>{ setSalary(salaryInput||String(data?.avgSalary)); setScreen("results"); setActiveTab("claimable"); }}
          style={{ width:"100%", background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", border:"none", borderRadius:14, padding:17, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 6px 18px rgba(30,79,216,0.3)", marginBottom:10 }}>
          Show My Deductions ->
        </button>
        <button onClick={()=>{ setSalary(String(data?.avgSalary)); setScreen("results"); setActiveTab("claimable"); }}
          style={{ width:"100%", background:"transparent", border:"none", color:"#9ca3af", fontSize:14, cursor:"pointer", padding:8 }}>
          Use average salary instead
        </button>
      </div>
    </div>
  );

  // -- RESULTS ---------------------------------------------------------------
  // -- PRIVACY POLICY --------------------------------------------------------
  if (screen === "privacy") return (
    <div style={{ minHeight:"100vh", padding:"40px 20px", maxWidth:600, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("home")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:24, padding:0 }}><- Back</button>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, marginBottom:20 }}>Privacy Policy</h2>
        <div style={{ background:"#fff", borderRadius:16, padding:"24px", border:"1px solid #e2e5f0", lineHeight:1.8, color:"#374151", fontSize:14 }}>
          <p style={{ marginBottom:16 }}><strong>Last updated: July 2025</strong></p>
          <p style={{ marginBottom:16 }}>Is It Deductible? (isitdeductible.com.au) is a free Australian tax deduction guide. We are committed to protecting your privacy in accordance with the <strong>Privacy Act 1988 (Cth)</strong> and the Australian Privacy Principles.</p>
          <p style={{ marginBottom:12 }}><strong>Information we collect:</strong> If you subscribe to our email list, we collect your email address and profession selection. We do not collect your name, salary, or any other personal financial information -- salary inputs are used only for on-screen calculations and are never transmitted or stored.</p>
          <p style={{ marginBottom:12 }}><strong>How we use your information:</strong> Email addresses are used solely to send annual tax reminders before 30 June. We use Kit (ConvertKit) to manage our email list. We do not sell, share, or disclose your information to third parties except as required by law.</p>
          <p style={{ marginBottom:12 }}><strong>Cookies and analytics:</strong> We may use basic analytics to understand how users interact with the site. No personally identifiable information is collected through analytics.</p>
          <p style={{ marginBottom:12 }}><strong>Unsubscribe:</strong> You can unsubscribe from our emails at any time using the link in any email we send.</p>
          <p style={{ marginBottom:12 }}><strong>Contact:</strong> For privacy-related enquiries, please contact us via isitdeductible.com.au.</p>
          <p style={{ marginBottom:0, color:"#9ca3af", fontSize:12 }}>This policy applies to the website isitdeductible.com.au only and does not apply to any third-party sites we may link to.</p>
        </div>
      </div>
    </div>
  );

  // -- DISCLAIMER -----------------------------------------------------------
  if (screen === "disclaimer") return (
    <div style={{ minHeight:"100vh", padding:"40px 20px", maxWidth:600, margin:"0 auto" }}>
      <div className="fade-up">
        <button onClick={()=>setScreen("home")} style={{ background:"transparent", border:"none", color:"#6b7280", cursor:"pointer", fontSize:14, fontWeight:600, marginBottom:24, padding:0 }}><- Back</button>
        <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:28, marginBottom:20 }}>Disclaimer</h2>
        <div style={{ background:"#fff", borderRadius:16, padding:"24px", border:"1px solid #e2e5f0", lineHeight:1.8, color:"#374151", fontSize:14 }}>
          <p style={{ marginBottom:16 }}><strong>General information only -- not tax advice.</strong></p>
          <p style={{ marginBottom:16 }}>Is It Deductible? is a general information resource. The content on this website is based on publicly available guidance from the Australian Taxation Office (ATO) and is intended to help Australians understand common tax deduction categories. It is <strong>not</strong> financial advice, tax advice, or legal advice.</p>
          <p style={{ marginBottom:12 }}><strong>No personal circumstances considered:</strong> The information on this site does not take into account your individual financial situation, objectives, or needs. Deductibility depends on your specific circumstances and may differ from the general examples provided.</p>
          <p style={{ marginBottom:12 }}><strong>Not a registered tax agent:</strong> Is It Deductible? is not a registered tax agent under the Tax Agent Services Act 2009 and is not regulated by the Tax Practitioners Board (TPB). We do not provide tax agent services.</p>
          <p style={{ marginBottom:12 }}><strong>Estimates are indicative only:</strong> All tax saving estimates are calculated using standard marginal tax rates and typical deduction values. Actual outcomes will vary. The ATO may apply different rules to your specific situation.</p>
          <p style={{ marginBottom:12 }}><strong>Always seek professional advice:</strong> Before making any tax claim, verify the rules at <a href="https://ato.gov.au" target="_blank" rel="noopener noreferrer" style={{ color:"#1e4fd8" }}>ato.gov.au</a> and consult a registered tax agent. You can find a registered tax agent at the <a href="https://www.tpb.gov.au/public-register" target="_blank" rel="noopener noreferrer" style={{ color:"#1e4fd8" }}>Tax Practitioners Board public register</a>.</p>
          <p style={{ marginBottom:0, color:"#9ca3af", fontSize:12 }}>Tax rates shown reflect the 2024-25 financial year (Stage 3 tax cuts). Rates are subject to change. Always confirm current rates with the ATO or a registered tax agent.</p>
        </div>
      </div>
    </div>
  );

    const tabs = [
    { id:"claimable", label:"✅ Can Claim", count:data?.claimable?.length, color:"#059669", bg:"#ecfdf5" },
    { id:"conditional", label:"⚠️ Conditions", count:data?.conditional?.length, color:"#d97706", bg:"#fffbeb" },
    { id:"notclaimable", label:"❌ Can't Claim", count:data?.notClaimable?.length, color:"#dc2626", bg:"#fef2f2" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f4f6fc", paddingBottom:60 }}>
      {showLogbook && <LogbookGuide onClose={()=>setShowLogbook(false)} />}

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,#1e4fd8 0%,#3b6ef0 100%)", padding:"24px 20px 72px" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <button onClick={()=>setScreen("select")} style={{ background:"rgba(255,255,255,0.18)", border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", fontSize:13, cursor:"pointer", marginBottom:18, fontFamily:"inherit", fontWeight:600 }}><- Change</button>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <span style={{ fontSize:36 }}>{profession?.emoji}</span>
            <div>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13 }}>Tax Deductions</p>
              <h2 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, color:"#fff", fontWeight:400 }}>{profession?.label}</h2>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span className="trust-badge">✅ Updated for 2025-26 Tax Year</span>
            <a href="https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/occupation-and-industry-specific-guides" target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.15)", borderRadius:99, padding:"4px 12px", fontSize:11, fontWeight:600, color:"#fff", textDecoration:"none" }}>🔗 ATO Guides ↗</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:560, margin:"-52px auto 0", padding:"0 16px" }}>

        {/* SAVINGS CARD */}
        <div className="scale-in" style={{ background:"#fff", borderRadius:18, padding:"20px", boxShadow:"0 8px 32px rgba(30,79,216,0.12)", marginBottom:12 }}>
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
            Based on {fmt(effectiveSalary)}/yr - {Math.round(marginalRate*100)}% marginal rate
          </div>
        </div>


        {/* 1 -- PERSONALISATION CHECKLIST */}
        {!checklistDone ? (
          <div style={{ background:"#fff", border:"2px solid #1e4fd8", borderRadius:16, padding:"18px", marginBottom:12 }}>
            {!showChecklist ? (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:22, marginBottom:8 }}>🎯</p>
                <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:6 }}>Get your personalised list</p>
                <p style={{ fontSize:13, color:"#6b7280", marginBottom:14, lineHeight:1.6 }}>Answer 6 quick questions -- we'll filter down to only the deductions that actually apply to you.</p>
                <button onClick={()=>setShowChecklist(true)} style={{ background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", border:"none", borderRadius:12, padding:"12px 24px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Personalise My Results ->
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:4 }}>Which of these apply to you?</p>
                <p style={{ fontSize:13, color:"#6b7280", marginBottom:14 }}>Tick all that apply</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                  {CHECKLIST_QUESTIONS.map(q=>(
                    <div key={q.id} onClick={()=>setChecklist(c=>({...c,[q.id]:!c[q.id]}))}
                      style={{ display:"flex", alignItems:"center", gap:12, background: checklist[q.id] ? "#eff6ff" : "#f9fafb", border:`2px solid ${checklist[q.id] ? "#1e4fd8" : "#e2e5f0"}`, borderRadius:10, padding:"12px 14px", cursor:"pointer" }}>
                      <div style={{ width:22, height:22, borderRadius:6, background: checklist[q.id] ? "#1e4fd8" : "#fff", border:`2px solid ${checklist[q.id] ? "#1e4fd8" : "#d1d5db"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {checklist[q.id] && <span style={{ color:"#fff", fontSize:13, fontWeight:800 }}>✓</span>}
                      </div>
                      <p style={{ fontSize:14, fontWeight:600, color:"#111827" }}>{q.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setChecklistDone(true)} style={{ width:"100%", background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", border:"none", borderRadius:12, padding:"13px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Show My Personalised Deductions ->
                </button>
              </div>
            )}
          </div>
        ) : personalised.length > 0 ? (
          <div style={{ background:"linear-gradient(135deg,#eff6ff,#ecfdf5)", border:"2px solid #1e4fd8", borderRadius:16, padding:"18px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:"#1e4fd8", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>Your Personalised Deductions</p>
                <p style={{ fontWeight:800, fontSize:22, color:"#059669" }}>{fmt(personalisedSaving)} estimated back</p>
                <p style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{personalised.length} deductions that apply to you specifically</p>
              </div>
              <button onClick={()=>{setChecklistDone(false);setChecklist({});setShowChecklist(false);}} style={{ background:"#eff6ff", border:"none", borderRadius:8, padding:"6px 10px", fontSize:11, color:"#1e4fd8", cursor:"pointer", fontWeight:700, flexShrink:0 }}>Edit</button>
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
            <p style={{ fontSize:14, color:"#6b7280" }}>No specific deductions matched your answers -- check the full list below.</p>
            <button onClick={()=>{setChecklistDone(false);setChecklist({});setShowChecklist(false);}} style={{ marginTop:8, background:"transparent", border:"none", color:"#1e4fd8", fontSize:13, fontWeight:700, cursor:"pointer" }}>Try again</button>
          </div>
        )}

        {/* 2 -- BOOK A TAX AGENT */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#0f1e3d)", borderRadius:16, padding:"18px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <span style={{ fontSize:32, flexShrink:0 }}>👨‍💼</span>
            <div style={{ flex:1 }}>
              <p style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:4 }}>Want someone to claim all of this for you?</p>
              <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.6, marginBottom:14 }}>
                You've found {fmt(totalClaim)} in potential deductions. A registered tax agent will make sure you claim every dollar -- and their fee is tax deductible too.
              </p>
              <a href="https://www.ato.gov.au/individuals-and-families/your-tax-return/help-and-support-to-lodge-your-tax-return/find-a-registered-tax-agent" target="_blank" rel="noopener noreferrer"
                style={{ display:"block", background:"linear-gradient(135deg,#1e4fd8,#3b6ef0)", borderRadius:12, padding:"13px 18px", color:"#fff", fontSize:14, fontWeight:700, textAlign:"center", textDecoration:"none" }}>
                Find a Registered Tax Agent ->
              </a>
              <p style={{ color:"#475569", fontSize:11, marginTop:8, textAlign:"center" }}>Powered by the ATO's official register</p>
            </div>
          </div>
        </div>

        {/* 3 -- EMAIL CAPTURE */}
        {!emailSubmitted ? (
          <div style={{ background:"#fff", border:"1px solid #e2e5f0", borderRadius:16, padding:"18px", marginBottom:12 }}>
            <p style={{ fontSize:22, marginBottom:8, textAlign:"center" }}>🔔</p>
            <p style={{ fontWeight:800, fontSize:15, color:"#111827", marginBottom:4, textAlign:"center" }}>Get your 30 June reminder</p>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:14, textAlign:"center", lineHeight:1.6 }}>
              We'll email you before tax time with your {profession?.label} deduction checklist -- so you never miss a claim again.
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
                onClick={handleEmailSubmit}
                style={{ background:"#1e4fd8", border:"none", borderRadius:10, padding:"11px 18px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", flexShrink:0 }}
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
          <button onClick={handleDownload} style={{ background:"#1e4fd8", border:"none", borderRadius:12, padding:13, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>📄 Download PDF</button>
          <button onClick={handleShare} style={{ background:"#059669", border:"none", borderRadius:12, padding:13, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{copied ? "✓ Copied!" : "📤 Share Results"}</button>
        </div>

        {/* LOGBOOK BANNER */}
        {NEEDS_LOGBOOK.includes(profession?.id) && (
          <div className="hover-lift" onClick={()=>setShowLogbook(true)} style={{ background:"linear-gradient(135deg,#0f1e3d,#1a3160)", borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <span style={{ fontSize:28, flexShrink:0 }}>🚗</span>
            <div style={{ flex:1 }}>
              <p style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:2 }}>Vehicle logbook guide</p>
              <p style={{ color:"#93c5fd", fontSize:12 }}>Your biggest deduction -- learn how to do it in 6 steps</p>
            </div>
            <span style={{ color:"#60a5fa", fontSize:18 }}>-></span>
          </div>
        )}

        {/* FLIP HINT */}
        <div style={{ background:"#eff6ff", border:"1px dashed #bfdbfe", borderRadius:10, padding:"10px 14px", marginBottom:10, textAlign:"center", fontSize:13, color:"#1e40af", fontWeight:600 }}>
          🃏 Tap any card to flip -- real example, how to claim it & what documents you need
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
              ⚠️ Valid deductions -- but only if you meet the conditions. Tap each card to check.
            </div>
            {data?.conditional?.map((d,i)=>(
              <FlipCard key={i} deduction={d} marginalRate={marginalRate} type="conditional" showLogbook={()=>setShowLogbook(true)} />
            ))}
          </>}
          {activeTab==="notclaimable" && <>
            <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"10px 14px", marginBottom:10, fontSize:13, color:"#991b1b", fontWeight:600 }}>
              ❌ Common mistakes -- claiming these incorrectly can trigger an ATO audit.
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
        <div style={{ marginTop:16, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:14, padding:"14px 16px" }}>
          <p style={{ fontSize:12, color:"#78350f", lineHeight:1.7 }}>
            ⚖️ <strong style={{ color:"#78350f" }}>General information only -- not tax advice.</strong> This tool provides general guidance based on ATO published rules. It does not consider your personal circumstances. Always verify at <a href="https://ato.gov.au" target="_blank" rel="noopener noreferrer" style={{ color:"#1e4fd8" }}>ato.gov.au</a> and consult a registered tax agent before making any claim. Updated for 2024-25 tax rates (Stage 3 cuts applied).
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
