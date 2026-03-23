export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy-deep: #0d1426;
          --gold: #c4a55a; --gold-light: #dfc080;
          --text-main: #eeeaf5; --text-muted: #9490b2; --text-dim: #5e5a7a;
          --border: rgba(196,165,90,0.16);
        }
        body { font-family: 'Inter', sans-serif; background: var(--navy-deep); color: var(--text-main); min-height: 100vh; }
        .page {
          min-height: 100vh;
          background: radial-gradient(ellipse at 10% 5%, rgba(196,165,90,0.05) 0%, transparent 40%),
                      radial-gradient(ellipse at 90% 95%, rgba(30,45,90,0.7) 0%, transparent 50%),
                      var(--navy-deep);
          display: flex; flex-direction: column; align-items: center; padding: 3rem 1rem;
        }
        .card {
          background: rgba(20,30,65,0.65); border: 1px solid var(--border);
          border-radius: 16px; backdrop-filter: blur(18px);
          width: 100%; max-width: 700px; padding: 3rem 3.5rem;
        }
        .logo-wrap { display: flex; justify-content: center; margin-bottom: 2rem; }
        .logo-wrap img { height: 64px; width: auto; object-fit: contain; }
        .headline { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 400; color: var(--text-main); margin-bottom: 0.5rem; }
        .headline em { font-style: italic; color: var(--gold-light); }
        .updated { font-size: 0.75rem; color: var(--text-dim); margin-bottom: 2rem; }
        .divider-gold { width: 48px; height: 2px; background: linear-gradient(90deg, var(--gold), transparent); margin: 1.5rem 0; }
        .section-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--gold); font-weight: 700; margin-bottom: 0.6rem; margin-top: 1.75rem; }
        .body-text { font-size: 0.91rem; color: var(--text-muted); line-height: 1.85; font-weight: 300; }
        .body-text + .body-text { margin-top: 0.75rem; }
        .divider { height: 1px; background: rgba(196,165,90,0.1); margin: 1.5rem 0; }
        .back-link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--text-dim); text-decoration: none; margin-bottom: 2rem; transition: color 0.15s; }
        .back-link:hover { color: var(--gold); }
        .contact-box { background: rgba(196,165,90,0.04); border: 1px solid rgba(196,165,90,0.18); border-radius: 10px; padding: 1rem 1.2rem; margin-top: 0.75rem; }
        .contact-box a { color: var(--gold); text-decoration: none; font-size: 0.88rem; }
        .contact-box a:hover { text-decoration: underline; }
        .footer { text-align: center; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid rgba(196,165,90,0.1); font-size: 0.75rem; color: var(--text-dim); }
        .footer a { color: var(--text-dim); text-decoration: none; transition: color 0.15s; }
        .footer a:hover { color: var(--gold); }
      `}</style>
      <div className="page">
        <div className="card">
          <div className="logo-wrap">
            <img src="/logo.png" alt="Compass AI" />
          </div>
          <a href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to assessment
          </a>
          <h1 className="headline">Privacy <em>Policy</em></h1>
          <div className="updated">Last updated: March 2026</div>
          <div className="divider-gold" />

          <div className="section-title">What Data We Collect</div>
          <p className="body-text">
            When you complete the Compass AI assessment, your responses are collected solely to generate your governance profile. These responses are transmitted to the Anthropic API (the AI system that produces your profile) over an encrypted connection and are not stored by Compass AI after your session ends.
          </p>
          <p className="body-text">
            We do not collect your name, email address, or any other personally identifiable information unless you choose to contact us directly. We do not use cookies for tracking, and we do not run advertising or analytics scripts on this site.
          </p>

          <div className="divider" />

          <div className="section-title">How Assessment Responses Are Used</div>
          <p className="body-text">
            Your assessment responses are used for one purpose: to generate the governance profile returned to you in your current session. They are passed to the Anthropic API as part of a prompt and returned as structured output. Anthropic's own data handling policies govern how they process API inputs; you can review those at anthropic.com.
          </p>
          <p className="body-text">
            We do not sell, share, or transfer your responses to any third party beyond the Anthropic API call required to generate your profile. No data broker relationships exist. No marketing use is made of your responses.
          </p>

          <div className="divider" />

          <div className="section-title">No PII Stored, No Analytics</div>
          <p className="body-text">
            Compass AI does not maintain a database of user profiles, assessment responses, or session data. Each session is independent. When your browser session ends, your responses are gone. We do not use Google Analytics, Mixpanel, or any other third-party analytics service.
          </p>
          <p className="body-text">
            This site is hosted on Vercel. Standard server logs (IP address, request path, timestamp) may be retained by Vercel for operational purposes under their infrastructure privacy practices.
          </p>

          <div className="divider" />

          <div className="section-title">Contact</div>
          <p className="body-text">
            If you have questions about this privacy policy or about how your data is handled, you can reach us at:
          </p>
          <div className="contact-box">
            <a href="mailto:vasquezryanj@gmail.com">vasquezryanj@gmail.com</a>
          </div>

          <div className="footer">
            <a href="/">Home</a>
            {" · "}
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </>
  );
}
