import type { Mode } from "../../types/appTypes";

type LegalSectionProps = {
  mode: Mode;
};

export default function LegalSection({ mode }: LegalSectionProps) {
  if (mode === "privacy") {
    return (
      <section className="workspace-shell legal-shell">
        <div className="workspace-head">
          <h2>Privacy Policy</h2>
        </div>
        <article className="tool-card legal-card">
          <p>
            Learning Lab uses analytics to understand page views and improve content quality.
            We do not intentionally collect sensitive personal data through tools on this site.
          </p>
          <h3>What we collect</h3>
          <ul>
            <li>Basic usage events such as page visits and feature interactions.</li>
            <li>Technical metadata like browser type and approximate location.</li>
          </ul>
          <h3>How data is used</h3>
          <ul>
            <li>Improve learning content and user experience.</li>
            <li>Measure performance of learning pages and tools.</li>
          </ul>
          <h3>Third-party services</h3>
          <p>
            Google Analytics may set cookies according to Google policies. You can control cookies
            in your browser settings.
          </p>
        </article>
      </section>
    );
  }

  if (mode === "terms") {
    return (
      <section className="workspace-shell legal-shell">
        <div className="workspace-head">
          <h2>Terms of Use</h2>
        </div>
        <article className="tool-card legal-card">
          <p>
            Learning Lab content and tools are provided for educational and informational use.
            By using this site, you agree to use features lawfully and responsibly.
          </p>
          <ul>
            <li>Do not misuse tools for fraud, deception, or unlawful activity.</li>
            <li>Use generated examples only in testing, demos, or learning contexts.</li>
            <li>External links are provided as references without warranty.</li>
          </ul>
        </article>
      </section>
    );
  }

  if (mode === "disclaimer") {
    return (
      <section className="workspace-shell legal-shell">
        <div className="workspace-head">
          <h2>Disclaimer</h2>
        </div>
        <article className="tool-card legal-card">
          <p>
            Content across AI Studio, Java Learning, ID Tools, and Number Lab does not constitute
            legal, financial, medical, or regulatory advice.
          </p>
          <ul>
            <li>Verify critical information with authoritative primary sources.</li>
            <li>Lottery-related content is educational and not betting advice.</li>
            <li>ID generators are for format demonstration only.</li>
          </ul>
        </article>
      </section>
    );
  }

  if (mode === "contact") {
    return (
      <section className="workspace-shell legal-shell">
        <div className="workspace-head">
          <h2>Contact</h2>
        </div>
        <article className="tool-card legal-card">
          <p>For feedback, improvements, or collaboration inquiries:</p>
          <p>
            Email: <a href="mailto:hello@learninglab.dev">hello@learninglab.dev</a>
          </p>
          <p>
            Include the page/tool name and steps to reproduce if reporting a bug.
          </p>
        </article>
      </section>
    );
  }

  return null;
}
