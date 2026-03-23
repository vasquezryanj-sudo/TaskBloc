"use client";

import { useState } from "react";

const LAW_LINKS: Record<string, { url: string; summary: string }> = {
  "EU AI Act": {
    url: "https://artificialintelligenceact.eu/",
    summary: "The European Union's comprehensive regulation on artificial intelligence, classifying AI systems by risk level and imposing obligations on developers and deployers. High-risk systems face strict requirements around transparency, human oversight, and data governance.",
  },
  "GDPR": {
    url: "https://gdpr.eu/",
    summary: "The General Data Protection Regulation governs how organizations collect, store, and use personal data of EU residents. It includes AI-specific implications around automated decision-making (Article 22) and data protection impact assessments (Article 35).",
  },
  "NIST AI RMF": {
    url: "https://www.nist.gov/system/files/documents/2023/01/26/AI%20RMF%201.0.pdf",
    summary: "The U.S. National Institute of Standards and Technology's AI Risk Management Framework. A voluntary framework helping organizations identify, assess, and manage AI risks across four functions: Govern, Map, Measure, and Manage.",
  },
  "ISO/IEC 42001": {
    url: "https://www.iso.org/standard/81230.html",
    summary: "An international standard for AI management systems, providing organizations with a structured framework to responsibly develop and use AI. Certifiable, it demonstrates to partners and regulators that your AI practices meet global standards.",
  },
  "CCPA": {
    url: "https://oag.ca.gov/privacy/ccpa",
    summary: "The California Consumer Privacy Act gives California residents rights over their personal data, including data used in AI systems. It requires transparency about data collection and grants opt-out rights for data sales.",
  },
  "HIPAA": {
    url: "https://www.hhs.gov/hipaa/index.html",
    summary: "The Health Insurance Portability and Accountability Act governs the use of protected health information. AI systems in healthcare must comply with HIPAA's privacy and security rules when processing patient data.",
  },
  "FFIEC": {
    url: "https://www.ffiec.gov/",
    summary: "The Federal Financial Institutions Examination Council issues guidance for AI use in banking and financial services, covering model risk management, fair lending, and explainability requirements for algorithmic decisions.",
  },
  "FDA AI/ML Guidance": {
    url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices",
    summary: "FDA guidance for AI and machine learning used in medical devices and clinical decision support. Requires pre-market approval processes, ongoing monitoring, and transparency about how AI-driven medical tools make recommendations.",
  },
  "UK ICO AI Guidance": {
    url: "https://ico.org.uk/for-organisations/guide-to-data-protection/key-data-protection-themes/explaining-decisions-made-with-artificial-intelligence/",
    summary: "The UK Information Commissioner's Office guidance on using AI in compliance with UK GDPR. Covers fairness, accountability, and the requirement to explain automated decisions to individuals.",
  },
  "Canada AIDA": {
    url: "https://ised-isde.canada.ca/site/innovation-better-canada/en/artificial-intelligence-data-act",
    summary: "Canada's Artificial Intelligence and Data Act proposes a risk-based regulatory framework for high-impact AI systems, requiring impact assessments, human oversight, and transparency obligations for organizations deploying AI in Canada.",
  },
  "OECD AI Principles": {
    url: "https://oecd.ai/en/ai-principles",
    summary: "Internationally adopted principles recommending that AI systems be transparent, explainable, fair, and accountable. Endorsed by over 40 countries, these principles form the ethical backbone of many national AI regulations.",
  },
  "IEEE Ethically Aligned Design": {
    url: "https://standards.ieee.org/industry-connections/ec/autonomous-systems/",
    summary: "IEEE's framework for embedding ethical considerations into AI and autonomous systems design. Covers human rights, well-being, data agency, and accountability, and is used as a reference standard by engineers and governance teams.",
  },
  "China AI Regulations": {
    url: "https://www.cac.gov.cn/",
    summary: "China has enacted several AI-specific regulations including rules on algorithmic recommendation, deep synthesis (deepfakes), and generative AI. Organizations operating in China must register AI systems with regulators and meet content security requirements.",
  },
};

const QUESTIONS = [
  {
    id: "geography",
    question: "Where does your organization primarily operate?",
    type: "multi",
    options: ["United States", "European Union", "United Kingdom", "Canada", "China", "Global / Multiple Regions", "Other"],
  },
  {
    id: "size",
    question: "What is your organization's size?",
    type: "single",
    options: ["Startup (1 to 50 employees)", "Small or mid-size (51 to 500 employees)", "Mid-market (501 to 5,000 employees)", "Enterprise (5,000 or more employees)"],
  },
  {
    id: "sector",
    question: "What sector does your organization operate in?",
    type: "single",
    options: ["Healthcare or Life Sciences", "Financial Services or Fintech", "Government or Public Sector", "Education", "Technology or SaaS", "Nonprofit or Social Impact", "Retail or E-commerce", "Media or Entertainment", "Manufacturing or Industrial", "Legal or Professional Services", "Other"],
  },
  {
    id: "org_type",
    question: "Which best describes your organization's structure?",
    type: "single",
    options: ["For-profit corporation", "Nonprofit 501(c)(3)", "Nonprofit 501(c)(4) or other advocacy organization", "Government agency or public institution", "Academic or research institution", "Social enterprise or B Corp", "Other"],
  },
  {
    id: "ai_use",
    question: "How is AI currently used in your organization?",
    type: "multi",
    options: ["Customer-facing products or services", "Internal operations or automation", "Decision-making systems (hiring, lending, admissions, etc.)", "Research and development", "Data analytics and reporting", "Donor or constituent engagement", "Content generation or communications", "We are exploring AI but have not deployed yet"],
  },
  {
    id: "risk",
    question: "How would you characterize your AI use cases in terms of impact on people?",
    type: "single",
    options: ["Low impact: informational or creative tools only", "Moderate impact: operational tools that affect internal processes", "High impact: systems that affect individuals' rights, access to services, or safety", "We are not sure"],
  },
  {
    id: "data",
    question: "What types of data does your AI system use or process?",
    type: "multi",
    options: ["Personal data of EU or UK residents", "Personal data of US residents", "Health or biometric data", "Financial or credit data", "Data about minors", "Donor or beneficiary data", "Minimal or no personal data", "Not sure"],
  },
  {
    id: "maturity",
    question: "How would you describe your current AI governance posture?",
    type: "single",
    options: ["No governance practices in place", "Informal practices with no documentation", "Some written policies, inconsistently applied", "Formal program with dedicated ownership", "Advanced: audited, certified, or formally regulated"],
  },
  {
    id: "concern",
    question: "What is your organization most concerned about right now?",
    type: "multi",
    options: ["Legal liability or regulatory fines", "Reputational damage from AI misuse", "Harm to the communities or individuals we serve", "Lack of internal accountability", "Preparing for an audit or certification", "Not knowing where to start"],
  },
  {
    id: "goal",
    question: "What is your primary governance goal?",
    type: "single",
    options: ["Achieve regulatory compliance", "Build internal accountability and culture", "Prepare for third-party audits or certification", "Establish ethical AI principles and practices", "Reduce legal and reputational risk", "Protect the people our organization serves", "Not sure: I need guidance on where to begin"],
  },
];

interface Framework {
  name: string;
  relevance: string;
  reason: string;
}

interface PriorityItem {
  title: string;
  description: string;
}

interface Result {
  riskTier: string;
  summary: string;
  primaryFrameworks: Framework[];
  topPriorities: PriorityItem[];
  immediateActions: PriorityItem[];
  jurisdictionalNote: string;
}

const riskConfig: Record<string, { color: string; bg: string; border: string }> = {
  Low: { color: "#2e7d32", bg: "rgba(46,125,50,0.1)", border: "rgba(46,125,50,0.4)" },
  Moderate: { color: "#b45309", bg: "rgba(180,83,9,0.1)", border: "rgba(180,83,9,0.4)" },
  High: { color: "#c2410c", bg: "rgba(194,65,12,0.1)", border: "rgba(194,65,12,0.4)" },
  Critical: { color: "#991b1b", bg: "rgba(153,27,27,0.12)", border: "rgba(153,27,27,0.4)" },
};

export default function CompassApp() {
  const [step, setStep] = useState<"intro" | "questions" | "loading" | "results">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentQ];

  function handleSelect(qId: string, value: string, isMulti: boolean) {
    if (isMulti) {
      const current = (answers[qId] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  }

  function canProceed() {
    const val = answers[currentQuestion?.id];
    if (!val) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }

  function nextQuestion() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      submitAssessment();
    }
  }

  async function submitAssessment() {
    setStep("loading");
    try {
      const formatted = QUESTIONS.map((q) => {
        const ans = answers[q.id];
        const ansText = Array.isArray(ans) ? ans.join(", ") : (ans || "No answer");
        return `${q.question}\nAnswer: ${ansText}`;
      }).join("\n\n");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setResult(data);
      setStep("results");
    } catch (e) {
      setError("Something went wrong generating your profile. Please try again.");
      setStep("questions");
    }
  }

  function restart() {
    setStep("intro");
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setTooltip(null);
  }

  function renderFrameworkName(name: string) {
    const law = LAW_LINKS[name];
    if (!law) return <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{name}</span>;
    return (
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
        <a
          href={law.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ color: "var(--gold)", textDecoration: "underline", textDecorationStyle: "dotted", fontWeight: 700 }}
        >
          {name}
        </a>
        <button
          onClick={(e) => { e.stopPropagation(); setTooltip(tooltip === name ? null : name); }}
          style={{
            background: "rgba(196,165,90,0.15)", border: "1px solid rgba(196,165,90,0.35)",
            borderRadius: "50%", width: "17px", height: "17px", fontSize: "10px",
            color: "var(--gold)", cursor: "pointer", display: "inline-flex",
            alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0,
          }}
        >?</button>
        {tooltip === name && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 200,
            background: "#16203a", border: "1px solid rgba(196,165,90,0.3)",
            borderRadius: "10px", padding: "1rem 1.15rem", width: "300px",
            fontSize: "0.8rem", color: "#b0aac8", lineHeight: 1.7,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontWeight: 700, color: "var(--gold)", marginBottom: "0.4rem" }}>{name}</div>
            {law.summary}
            <div style={{ marginTop: "0.65rem" }}>
              <a href={law.url} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "var(--gold)", fontSize: "0.78rem", textDecoration: "none" }}>
                View official documentation
              </a>
            </div>
          </div>
        )}
      </span>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy-deep: #0d1426; --navy-mid: #1e2d5a;
          --gold: #c4a55a; --gold-light: #dfc080; --gold-pale: rgba(196,165,90,0.1);
          --text-main: #eeeaf5; --text-muted: #9490b2; --text-dim: #5e5a7a;
          --border: rgba(196,165,90,0.16);
        }
        body { font-family: 'Inter', sans-serif; background: var(--navy-deep); color: var(--text-main); min-height: 100vh; }
        .app {
          min-height: 100vh;
          background: radial-gradient(ellipse at 10% 5%, rgba(196,165,90,0.05) 0%, transparent 40%),
                      radial-gradient(ellipse at 90% 95%, rgba(30,45,90,0.7) 0%, transparent 50%),
                      var(--navy-deep);
          display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1rem;
        }
        .card {
          background: rgba(20,30,65,0.65); border: 1px solid var(--border);
          border-radius: 16px; backdrop-filter: blur(18px);
          width: 100%; max-width: 700px; padding: 3rem 3.5rem;
          animation: fadeUp 0.4s ease both;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .logo-wrap { display:flex; justify-content:center; margin-bottom:2.5rem; }
        .logo-wrap img { height:120px; width:auto; object-fit:contain; }
        .headline { font-family:'Playfair Display',serif; font-size:2.5rem; font-weight:400; line-height:1.2; margin-bottom:1.5rem; color:var(--text-main); }
        .headline em { font-style:italic; color:var(--gold-light); }
        .intro-body { font-size:0.93rem; color:var(--text-muted); line-height:1.85; margin-bottom:1.25rem; font-weight:300; }
        .intro-body strong { color:var(--text-main); font-weight:500; }
        .divider-gold { width:48px; height:2px; background:linear-gradient(90deg,var(--gold),transparent); margin:1.5rem 0; }
        .btn-primary { background:linear-gradient(135deg,var(--gold),#a8893f); color:#0d1426; border:none; border-radius:8px; padding:0.9rem 2.25rem; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; letter-spacing:0.08em; text-transform:uppercase; transition:all 0.2s; }
        .btn-primary:hover { opacity:0.87; transform:translateY(-1px); }
        .btn-primary:disabled { opacity:0.3; cursor:not-allowed; transform:none; }
        .btn-ghost { background:transparent; color:var(--text-muted); border:1px solid rgba(196,165,90,0.22); border-radius:8px; padding:0.9rem 1.75rem; font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:500; cursor:pointer; letter-spacing:0.05em; transition:all 0.2s; }
        .btn-ghost:hover { border-color:var(--gold); color:var(--gold); }
        .progress-wrap { margin-bottom:2.25rem; }
        .progress-meta { display:flex; justify-content:space-between; margin-bottom:0.55rem; }
        .progress-label { font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-dim); font-weight:500; }
        .progress-bar { height:2px; background:rgba(196,165,90,0.1); border-radius:2px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold-light)); border-radius:2px; transition:width 0.4s ease; }
        .q-label { font-size:0.68rem; text-transform:uppercase; letter-spacing:0.14em; color:var(--gold); margin-bottom:0.55rem; font-weight:600; }
        .q-text { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:400; line-height:1.35; margin-bottom:0.4rem; color:var(--text-main); }
        .multi-hint { font-size:0.77rem; color:var(--text-dim); margin-bottom:1.2rem; font-style:italic; }
        .options { display:flex; flex-direction:column; gap:0.45rem; margin-bottom:2rem; }
        .option { padding:0.78rem 1.1rem; border-radius:8px; border:1px solid rgba(196,165,90,0.13); background:rgba(196,165,90,0.02); color:var(--text-muted); cursor:pointer; transition:all 0.15s; font-size:0.88rem; text-align:left; font-family:'Inter',sans-serif; line-height:1.4; }
        .option:hover { border-color:rgba(196,165,90,0.38); color:var(--text-main); background:rgba(196,165,90,0.05); }
        .option.selected { border-color:var(--gold); background:var(--gold-pale); color:var(--text-main); }
        .nav-row { display:flex; justify-content:space-between; align-items:center; }
        .error-msg { background:rgba(153,27,27,0.1); border:1px solid rgba(239,68,68,0.22); border-radius:8px; padding:0.8rem 1rem; color:#fca5a5; font-size:0.83rem; margin-bottom:1.25rem; }
        .loading-center { text-align:center; padding:2rem 0 1rem; }
        .spinner { width:42px; height:42px; border:2px solid rgba(196,165,90,0.13); border-top-color:var(--gold); border-radius:50%; animation:spin 0.85s linear infinite; margin:0 auto 1.75rem; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .loading-headline { font-family:'Playfair Display',serif; font-size:1.45rem; font-weight:400; color:var(--text-main); margin-bottom:0.5rem; }
        .loading-sub { font-size:0.83rem; color:var(--text-muted); font-weight:300; }
        .risk-badge { display:inline-flex; align-items:center; gap:0.45rem; padding:0.28rem 0.85rem; border-radius:100px; font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.85rem; border:1px solid; }
        .results-headline { font-family:'Playfair Display',serif; font-size:1.9rem; font-weight:400; color:var(--text-main); line-height:1.2; }
        .results-headline em { font-style:italic; color:var(--gold-light); }
        .section-label { font-size:0.66rem; text-transform:uppercase; letter-spacing:0.14em; color:var(--gold); font-weight:700; margin-bottom:0.8rem; }
        .summary-text { font-size:0.91rem; color:var(--text-muted); line-height:1.85; font-weight:300; }
        .divider { height:1px; background:rgba(196,165,90,0.1); margin:1.65rem 0; }
        .frameworks { display:flex; flex-direction:column; gap:0.6rem; }
        .fw-item { display:flex; align-items:flex-start; gap:0.9rem; padding:0.85rem 1rem; border-radius:10px; background:rgba(196,165,90,0.03); border:1px solid rgba(196,165,90,0.1); }
        .fw-badge { font-size:0.62rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; padding:0.18rem 0.48rem; border-radius:4px; white-space:nowrap; margin-top:3px; flex-shrink:0; }
        .fw-high { background:rgba(196,165,90,0.18); color:var(--gold); }
        .fw-medium { background:rgba(148,163,184,0.12); color:#94a3b8; }
        .fw-low { background:rgba(100,116,139,0.1); color:#64748b; }
        .fw-reason { font-size:0.8rem; color:var(--text-muted); line-height:1.55; font-weight:300; margin-top:0.25rem; }
        .priority-list, .action-list { display:flex; flex-direction:column; gap:0.65rem; }
        .priority-item { padding:0.9rem 1.1rem; border-radius:10px; background:rgba(20,30,65,0.5); border:1px solid rgba(196,165,90,0.13); border-left:3px solid var(--gold); }
        .action-item { padding:0.9rem 1.1rem; border-radius:10px; background:rgba(196,165,90,0.03); border:1px solid rgba(196,165,90,0.09); border-left:3px solid rgba(196,165,90,0.35); }
        .item-title { font-weight:600; font-size:0.87rem; color:var(--text-main); margin-bottom:0.28rem; }
        .item-desc { font-size:0.8rem; color:var(--text-muted); line-height:1.6; font-weight:300; }
        .juris-box { background:rgba(196,165,90,0.04); border:1px solid rgba(196,165,90,0.18); border-radius:10px; padding:1.1rem 1.2rem; font-size:0.86rem; color:var(--text-muted); line-height:1.8; font-weight:300; }
        .consult-box { background:linear-gradient(135deg,rgba(196,165,90,0.07),rgba(20,30,65,0.4)); border:1px solid rgba(196,165,90,0.28); border-radius:12px; padding:1.5rem 1.6rem; }
        .consult-title { font-family:'Playfair Display',serif; font-size:1.1rem; font-weight:600; color:var(--text-main); margin-bottom:0.5rem; }
        .consult-body { font-size:0.83rem; color:var(--text-muted); line-height:1.75; margin-bottom:1rem; font-weight:300; }
        .consult-name { font-size:0.88rem; color:var(--text-main); font-weight:600; margin-bottom:0.2rem; }
        .consult-email a { font-size:0.85rem; color:var(--gold); text-decoration:none; }
        .consult-email a:hover { text-decoration:underline; }
        .action-row { display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:2rem; }
        .sublabel { font-size:0.77rem; color:var(--text-dim); margin-bottom:0.9rem; font-style:italic; }
        @media print {
          body,.app { background:white !important; }
          .app { padding:0 !important; justify-content:flex-start !important; }
          .card { background:white !important; border:none !important; border-radius:0 !important; max-width:100% !important; padding:1.75rem 2.25rem !important; box-shadow:none !important; backdrop-filter:none !important; animation:none !important; }
          .action-row,.screen-logo { display:none !important; }
          .print-header { display:flex !important; align-items:center; justify-content:space-between; padding-bottom:1.25rem; margin-bottom:1.75rem; border-bottom:2px solid #c4a55a; }
          .print-logo { height:60px !important; width:auto; }
          .print-meta { text-align:right; font-size:0.73rem; color:#555; line-height:1.7; }
          .print-meta strong { color:#0d1426; display:block; }
          .headline,.results-headline,.consult-title { color:#0d1426 !important; }
          .headline em,.results-headline em { color:#a8893f !important; }
          .summary-text,.fw-reason,.item-desc,.consult-body,.juris-box,.sublabel { color:#374151 !important; }
          .section-label,.q-label { color:#a8893f !important; }
          .fw-item { background:#f9f7f1 !important; border-color:#e5dcc5 !important; }
          .fw-high { background:#fef9ee !important; color:#a8893f !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .fw-medium { background:#f3f4f6 !important; color:#4b5563 !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .fw-low { background:#f9fafb !important; color:#6b7280 !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .item-title,.consult-name { color:#0d1426 !important; }
          .priority-item { background:#f9f7f1 !important; border-color:#e5dcc5 !important; border-left-color:#c4a55a !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .action-item { background:#fafaf8 !important; border-color:#ede8d8 !important; border-left-color:#c4a55a !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .juris-box { background:#f9f7f1 !important; border-color:#e5dcc5 !important; color:#374151 !important; }
          .consult-box { background:#f9f7f1 !important; border-color:#e5dcc5 !important; }
          .consult-email a { color:#a8893f !important; }
          .divider { background:#e5dcc5 !important; }
          .risk-badge { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        }
        .print-header { display:none; }
      `}</style>

      <div className="app" onClick={() => tooltip && setTooltip(null)}>

        {step === "intro" && (
          <div className="card">
            <div className="logo-wrap">
              <img src="/logo.png" alt="Compass AI" />
            </div>
            <h1 className="headline">
              AI governance is not optional.<br />It is a <em>responsibility.</em>
            </h1>
            <div className="divider-gold" />
            <p className="intro-body">
              Artificial intelligence is transforming how organizations operate, serve communities, and make decisions that affect real people. With that power comes real accountability. <strong>Regulators are watching. Laws are being enacted and enforced. Organizations that are not prepared face genuine legal, financial, and reputational exposure.</strong>
            </p>
            <p className="intro-body">
              Beyond legal risk, the individuals and communities your organization serves deserve to know that your AI systems are governed with care and intention. Responsible AI is not a compliance checkbox. It is a commitment to doing less harm.
            </p>
            <p className="intro-body">
              Compass helps you understand exactly where your organization stands. Answer a thorough set of questions about your operations and AI use, and receive a personalized governance profile that maps your legal obligations, applicable regulatory frameworks, and the concrete steps you should take next.
            </p>
            <button className="btn-primary" onClick={() => setStep("questions")}>
              Begin Assessment
            </button>
          </div>
        )}

        {step === "questions" && (
          <div className="card">
            <div className="logo-wrap screen-logo" style={{ marginBottom: "1.5rem" }}>
              <img src="/logo.png" alt="Compass AI" style={{ height: "80px" }} />
            </div>
            <div className="progress-wrap">
              <div className="progress-meta">
                <span className="progress-label">Assessment Progress</span>
                <span className="progress-label">{currentQ + 1} of {QUESTIONS.length}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <div className="q-label">Question {currentQ + 1}</div>
            <div className="q-text">{currentQuestion.question}</div>
            {currentQuestion.type === "multi" && (
              <div className="multi-hint">Select all that apply.</div>
            )}
            <div className="options">
              {currentQuestion.options.map((opt) => {
                const isSelected = currentQuestion.type === "multi"
                  ? ((answers[currentQuestion.id] as string[]) || []).includes(opt)
                  : answers[currentQuestion.id] === opt;
                return (
                  <button
                    key={opt}
                    className={`option${isSelected ? " selected" : ""}`}
                    onClick={() => handleSelect(currentQuestion.id, opt, currentQuestion.type === "multi")}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="nav-row">
              {currentQ > 0
                ? <button className="btn-ghost" onClick={() => setCurrentQ(currentQ - 1)}>Back</button>
                : <div />}
              <button className="btn-primary" onClick={nextQuestion} disabled={!canProceed()}>
                {currentQ === QUESTIONS.length - 1 ? "Generate My Profile" : "Continue"}
              </button>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="card">
            <div className="logo-wrap">
              <img src="/logo.png" alt="Compass AI" />
            </div>
            <div className="loading-center">
              <div className="spinner" />
              <div className="loading-headline">Analyzing your governance profile</div>
              <div className="loading-sub">Mapping jurisdictions, frameworks, and risk factors</div>
            </div>
          </div>
        )}

        {step === "results" && result && (
          <div className="card">
            <div className="print-header">
              <img src="/logo.png" alt="Compass AI" className="print-logo" />
              <div className="print-meta">
                <strong>Compass AI Governance Profile</strong>
                Prepared by Ryan Vasquez<br />
                AI Governance Consultant<br />
                vasquezryanj@gmail.com<br />
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            <div className="logo-wrap screen-logo" style={{ marginBottom: "1.5rem" }}>
              <img src="/logo.png" alt="Compass AI" style={{ height: "80px" }} />
            </div>

            <div
              className="risk-badge"
              style={{
                color: riskConfig[result.riskTier]?.color || "#c4a55a",
                background: riskConfig[result.riskTier]?.bg || "rgba(196,165,90,0.1)",
                borderColor: riskConfig[result.riskTier]?.border || "rgba(196,165,90,0.4)",
              }}
            >
              {result.riskTier} Risk Profile
            </div>

            <div className="results-headline">Your <em>Governance</em> Profile</div>
            <div className="divider-gold" style={{ marginTop: "1rem" }} />

            <div className="section-label" style={{ marginTop: "1.5rem" }}>Overview</div>
            <p className="summary-text">{result.summary}</p>
            <div className="divider" />

            <div className="section-label">Applicable Frameworks and Regulations</div>
            <div className="frameworks">
              {result.primaryFrameworks?.map((fw, i) => (
                <div className="fw-item" key={i}>
                  <span className={`fw-badge fw-${fw.relevance?.toLowerCase()}`}>{fw.relevance}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.25rem" }}>
                      {renderFrameworkName(fw.name)}
                    </div>
                    <div className="fw-reason">{fw.reason}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="divider" />

            <div className="section-label">Strategic Priorities</div>
            <p className="sublabel">Medium-term goals to build toward over the next 3 to 12 months.</p>
            <div className="priority-list">
              {result.topPriorities?.map((p, i) => (
                <div className="priority-item" key={i}>
                  <div className="item-title">{p.title}</div>
                  <div className="item-desc">{p.description}</div>
                </div>
              ))}
            </div>
            <div className="divider" />

            <div className="section-label">Immediate Actions</div>
            <p className="sublabel">Concrete steps you can take in the next 30 to 90 days.</p>
            <div className="action-list">
              {result.immediateActions?.map((a, i) => (
                <div className="action-item" key={i}>
                  <div className="item-title">{a.title}</div>
                  <div className="item-desc">{a.description}</div>
                </div>
              ))}
            </div>
            <div className="divider" />

            <div className="section-label">Jurisdictional Note</div>
            <div className="juris-box">{result.jurisdictionalNote}</div>
            <div className="divider" />

            <div className="section-label">Work With a Consultant</div>
            <div className="consult-box">
              <div className="consult-title">Take the next step with expert guidance.</div>
              <p className="consult-body">
                This profile gives you a clear picture of where your organization stands. Translating it into a governance program that actually protects your organization and the people you serve takes expertise. Ryan Vasquez is an AI governance consultant specializing in regulatory compliance, ethical AI frameworks, and organizational policy development. Reach out to discuss your specific situation.
              </p>
              <div className="consult-name">Ryan Vasquez, AI Governance Consultant</div>
              <div className="consult-email">
                <a href="mailto:vasquezryanj@gmail.com">vasquezryanj@gmail.com</a>
              </div>
            </div>

            <div className="action-row">
              <button className="btn-primary" onClick={() => window.print()}>Save as PDF</button>
              <button className="btn-ghost" onClick={restart}>Start Over</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
