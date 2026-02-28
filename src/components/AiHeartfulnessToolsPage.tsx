type ToolSummary = {
  name: string;
  category: string;
  usage: string;
  labUse: string;
  url: string;
};

const toolSummaries: ToolSummary[] = [
  {
    name: "Gemini (Pro / Flash / Deep Research)",
    category: "Research and Reasoning",
    usage: "Deep topic research, multi-step analysis, and structured drafting.",
    labUse: "Use for first-pass research briefs, then convert output into checklists or slide outlines.",
    url: "https://gemini.google.com/",
  },
  {
    name: "NotebookLM",
    category: "Knowledge Assistant",
    usage: "Upload notes/docs, ask grounded questions, and generate source-backed summaries.",
    labUse: "Build a project notebook per module and create revision summaries before publishing.",
    url: "https://notebooklm.google.com/",
  },
  {
    name: "Perplexity",
    category: "Web Discovery",
    usage: "Fast web search with citations and comparison of recent sources.",
    labUse: "Use for fact checks, trend scans, and collecting references before writing final outputs.",
    url: "https://www.perplexity.ai/",
  },
  {
    name: "Gamma",
    category: "Presentation Builder",
    usage: "Generate slide decks from prompts, docs, or outlines.",
    labUse: "Turn AI outputs into client-ready deck drafts, then finalize visuals and narrative flow.",
    url: "https://gamma.app/",
  },
  {
    name: "Notion AI",
    category: "Planning and Docs",
    usage: "Transform rough ideas into SOPs, trackers, and project documentation.",
    labUse: "Create reusable templates for prompts, experiments, and release notes.",
    url: "https://www.notion.so/product/ai",
  },
  {
    name: "Loom",
    category: "Async Communication",
    usage: "Record walkthrough videos with narration for demos and knowledge transfer.",
    labUse: "Pair with AI-generated scripts to create concise explainers for teams or learners.",
    url: "https://www.loom.com/",
  },
  {
    name: "n8n",
    category: "Automation",
    usage: "Connect apps and AI APIs into no-code/low-code workflows.",
    labUse: "Automate repetitive flows such as lead intake, summarization, and report delivery.",
    url: "https://n8n.io/",
  },
  {
    name: "Lovable",
    category: "App Prototyping",
    usage: "Generate product UIs and MVP flows from prompt-based specifications.",
    labUse: "Prototype internal tools quickly, then validate with users before engineering handoff.",
    url: "https://lovable.dev/",
  },
  {
    name: "HeyGen",
    category: "AI Video",
    usage: "Create talking-avatar videos from scripts with multilingual output.",
    labUse: "Produce quick course intros, product explainers, or onboarding clips at scale.",
    url: "https://www.heygen.com/",
  },
  {
    name: "ElevenLabs",
    category: "AI Voice",
    usage: "High-quality text-to-speech and voice cloning for narration.",
    labUse: "Generate narration tracks for tutorials, then sync into edited video assets.",
    url: "https://elevenlabs.io/",
  },
  {
    name: "Ideogram",
    category: "Image Generation",
    usage: "Generate visual concepts, poster styles, and design directions from prompts.",
    labUse: "Create concept art and campaign moodboards before committing design resources.",
    url: "https://ideogram.ai/",
  },
  {
    name: "RunwayML",
    category: "Video Generation and Editing",
    usage: "Generate or edit video scenes using text/image prompts.",
    labUse: "Create short AI-assisted motion clips for social, ads, and lesson visuals.",
    url: "https://runwayml.com/",
  },
];

function AiHeartfulnessToolsPage() {
  return (
    <section className="ai-tools-page" aria-label="Heartfulness AI Mastery tools summary">
      <article className="tool-card ai-hero ai-tools-hero">
        <h2>AI Tools</h2>
      </article>

      <div className="ai-tools-grid">
        {toolSummaries.map((tool) => (
          <article key={tool.name} className="tool-card ai-tool-card">
            <p className="ai-tool-category">{tool.category}</p>
            <h3>
              <a href={tool.url} target="_blank" rel="noreferrer" className="ai-tool-link">
                {tool.name}
              </a>
            </h3>
            <p>
              <strong>What it is used for:</strong> {tool.usage}
            </p>
            <p>
              <strong>Use cases:</strong> {tool.labUse}
            </p>
            <p>
              <a href={tool.url} target="_blank" rel="noreferrer" className="ai-tool-link-secondary">
                Open tool
              </a>
            </p>
          </article>
        ))}
      </div>

      <article className="tool-card ai-usage-flow">
        <h3>Recommended Workflow in AI Studio</h3>
        <ol>
          <li>Research: start with Perplexity or Gemini to collect context and constraints.</li>
          <li>Grounding: move reference material into NotebookLM for source-backed Q&A.</li>
          <li>Drafting: create structured content in Gemini or Notion AI.</li>
          <li>Packaging: convert output into slides (Gamma), video (HeyGen/Runway), and voice (ElevenLabs).</li>
          <li>Scale: automate repeatable tasks with n8n.</li>
        </ol>
        <p className="small-note">
          Summary adapted from the Heartfulness Academy AI Mastery outline and module references.
        </p>
        <ul className="source-list">
          <li>
            <a href="https://www.scribd.com/document/896747901/AI-Mastery-by-Heartfulness-Academy" target="_blank" rel="noreferrer">
              Scribd: AI Mastery by Heartfulness Academy
            </a>
          </li>
          <li>
            <a href="https://www.heartfulnessacademy.org/ai-roadmap" target="_blank" rel="noreferrer">
              Heartfulness Academy: AI Roadmap
            </a>
          </li>
        </ul>
      </article>
    </section>
  );
}

export default AiHeartfulnessToolsPage;
