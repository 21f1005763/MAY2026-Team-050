import { Link } from "react-router-dom";

const categories = ["roads", "lighting", "sanitation", "drainage", "water", "garbage", "animals", "parks", "encroachment", "electricity", "other"] as const;
const categoryIcons = ["⌁", "◉", "✦", "≈", "◌", "▣", "♡", "♧", "▤", "ϟ", "?"];

const categoryText: Record<(typeof categories)[number], { label: string; dept: string }> = {
  roads: { label: "Roads & Potholes", dept: "Public Works Department" },
  lighting: { label: "Street Lighting", dept: "Electrical Department" },
  sanitation: { label: "Sanitation & Public Toilets", dept: "Sanitation Department" },
  drainage: { label: "Drainage & Sewerage", dept: "Public Works Department" },
  water: { label: "Water Supply", dept: "Water Works Department" },
  garbage: { label: "Garbage Collection", dept: "Sanitation Department" },
  animals: { label: "Stray Animal Cruelty & Care", dept: "Animal Welfare Department" },
  parks: { label: "Parks & Public Spaces", dept: "Parks & Gardens Department" },
  encroachment: { label: "Encroachment", dept: "Town Planning Department" },
  electricity: { label: "Electricity", dept: "Electrical Department" },
  other: { label: "Other", dept: "General Grievance Cell" },
};

function CivicHeroIllustration() {
  return <div className="civic-hero-art" aria-label={"A citizen sends a location and voice note, then receives a tracked complaint ticket"}>
    <svg viewBox="0 0 520 430" role="img" aria-label={"A citizen sends a location and voice note, then receives a tracked complaint ticket"}>
      <path className="civic-hero-art__road" d="M24 353c110-56 239-48 472 11" />
      <path className="civic-hero-art__city" d="M42 309V188h85v121M63 214h18v18H63zM94 214h18v18H94zM63 250h18v18H63zM94 250h18v18H94zM400 310V151h76v159M416 178h15v16h-15zM445 178h15v16h-15zM416 214h15v16h-15zM445 214h15v16h-15z" />
      <circle className="civic-hero-art__sun" cx="429" cy="79" r="36" />
      <g className="civic-hero-art__citizen"><circle cx="102" cy="287" r="25" /><path d="M59 386c5-54 21-77 43-77s38 23 43 77" /><path d="m136 335 61 31" /></g>
      <g className="civic-hero-art__phone"><rect x="181" y="74" width="151" height="285" rx="30" /><rect x="196" y="101" width="121" height="211" rx="12" /><path d="M237 335h39" /></g>
      <g className="civic-hero-art__chat"><path d="M215 127h73a10 10 0 0 1 10 10v32a10 10 0 0 1-10 10h-37l-13 13v-13h-23a10 10 0 0 1-10-10v-32a10 10 0 0 1 10-10z" /><circle cx="233" cy="152" r="4" /><circle cx="251" cy="152" r="4" /><circle cx="269" cy="152" r="4" /></g>
      <g className="civic-hero-art__pin"><path d="M255 203c19 0 33 14 33 32 0 23-33 50-33 50s-33-27-33-50c0-18 14-32 33-32z" /><circle cx="255" cy="235" r="10" /></g>
      <g className="civic-hero-art__waves"><path d="M212 292v-18M224 298v-30M236 293v-20M248 301v-36M260 294v-22M272 298v-30M284 291v-16" /></g>
      <path className="civic-hero-art__connection" d="M330 229c46-15 71-3 90 24" />
      <g className="civic-hero-art__ticket"><rect x="354" y="249" width="137" height="82" rx="16" /><path d="M373 272h59M373 289h43" /><circle cx="466" cy="288" r="12" /><path d="m460 288 5 5 8-10" /></g>
    </svg>
    <span className="civic-hero-art__label">{"WhatsApp → routed ticket → visible updates"}</span>
  </div>;
}

export function Hero() {
  return <><section className="parity-hero"><div className="parity-container parity-hero-grid"><div><h1>{"Report an issue. Watch the city respond."}</h1><p className="parity-lead">{"File a complaint here on the web, or send it straight from WhatsApp — same location pin, voice note and photo, same tracked ticket. Jan Setu classifies it and routes it to the right department automatically."}</p><div className="parity-actions"><Link className="parity-btn parity-orange" to="/login">{"Get started"} →</Link><a className="parity-btn parity-outline" href="#how">{"See how it works"}</a></div><div className="parity-chips"><span>{"70+ complaint categories"}</span><span>{"11 municipal departments"}</span><span>{"Works on web or WhatsApp"}</span></div></div><CivicHeroIllustration /></div></section><div className="parity-proof"><span>{"Location, voice, text & photo"}</span><span>{"WhatsApp verification"}</span><span>{"Tracked complaint history"}</span><span>{"Six Indian languages"}</span></div></>;
}

export function Process() {
  const steps = [["Report on WhatsApp", "Share your location, type or record your concern, and add a photo if it helps."], ["AI classifies it", "Speech-to-text and language models match the issue to the right category and department."], ["Duplicates are grouped", "Nearby reports about the same issue are grouped, while priority cases skip grouping."], ["Sent to the department", "A complete ticket reaches the responsible department and you receive status updates."]];
  return <section id="how" className="parity-section"><div className="parity-container"><div className="parity-heading"><h2>{"From WhatsApp message to a tracked ticket"}</h2><p>{"Four visible steps. No unexplained municipal process."}</p></div><ol className="parity-workflow">{steps.map(([heading, body], index) => <li key={heading}><i>{index + 1}</i><h3>{heading}</h3><p>{body}</p></li>)}</ol></div></section>;
}

export function Categories() {
  return <section id="categories" className="parity-section parity-soft"><div className="parity-container"><div className="parity-heading"><h2>{"Common complaints, routed to the right department"}</h2><p>{"Every category maps to a real municipal department — no report goes to a generic inbox."}</p></div><div className="parity-categories">{categories.map((category, index) => <article key={category}><span aria-hidden="true">{categoryIcons[index]}</span><div><h3>{categoryText[category].label}</h3><p>{categoryText[category].dept}</p>{category === "animals" && <em>{"Priority — skips grouping"}</em>}</div></article>)}</div></div></section>;
}

export function Features() {
  return <section className="parity-section"><div className="parity-container"><div className="parity-heading"><h2>{"Built for citizens, accessible however you prefer"}</h2></div><div className="parity-features">{[["One phone number, no password", "Approve sign-in from your own WhatsApp, or confirm a one-time code. Nothing to remember.", "✓"], ["Every channel, the same capability", "Location, voice notes, photos and text work identically here and on WhatsApp.", "⇄"], ["Track every step", "A live status timeline keeps every ticket visible from processing to dispatch.", "↗"]].map(([heading, body, icon]) => <article key={heading}><span>{icon}</span><h3>{heading}</h3><p>{body}</p></article>)}</div></div></section>;
}

export function CallToAction() {
  return <section className="parity-cta"><div><span className="parity-cta__artifact" aria-hidden="true">⌖</span><h2>{"Ready to report an issue?"}</h2><p>{"It takes less than a minute — on the web or on WhatsApp."}</p><Link className="parity-btn parity-orange" to="/login">{"Open Jan Setu"}</Link></div></section>;
}
