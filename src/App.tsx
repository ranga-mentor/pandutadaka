import { useEffect, useMemo, useRef, useState } from "react";
import { CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { trackEvent } from "./analytics";
import AiHeartfulnessToolsPage from "./components/AiHeartfulnessToolsPage";
import JavaFeaturesPage from "./components/JavaFeaturesPage";
import NricTools from "./components/NricTools";
import SingaporeTotoPage from "./components/SingaporeTotoPage";
import TotoPredictor from "./components/TotoPredictor";
import { learningTracks } from "./data/learningContent";
import "./App.css";

type Mode =
  | "home"
  | "workbook"
  | "id-tools"
  | "numbers"
  | "java"
  | "ai"
  | "privacy"
  | "terms"
  | "disclaimer"
  | "contact";

type FeatureCard = {
  title: string;
  description: string;
  action: string;
  mode: Mode;
  image: string;
};

type SearchResult = {
  id: string;
  label: string;
  hint: string;
  mode: Mode;
  numbersMode?: "4d" | "toto";
  trackIndex?: number;
  lessonIndex?: number;
  keywords?: string[];
};

type SeoMeta = {
  title: string;
  description: string;
  path: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "Workbook Tracks",
    description: "Structured chapters with practice and quick checks for guided learning.",
    action: "Open Workbook",
    mode: "workbook",
    image: "/workbook-tracks.jpg",
  },
  {
    title: "ID Tools Studio",
    description: "Validate and generate Singapore, Malaysia, and Hong Kong IDs in one place.",
    action: "Open ID Tools",
    mode: "id-tools",
    image: "/id-tools-neon-theme.svg",
  },
  {
    title: "🇸🇬 4D & Toto Lab",
    description: "Use probability-driven predictors for Singapore 4D and Toto as one toolkit.",
    action: "Open Number Lab",
    mode: "numbers",
    image: "/number-lab-lottery.svg",
  },
  {
    title: "Java Feature Explorer",
    description: "Review practical updates from Java 11 through Java 21 in a single release map.",
    action: "Open Java",
    mode: "java",
    image: "/java-feature-explorer.jpg",
  },
  {
    title: "AI Studio",
    description: "Learn prompt design, model workflows, and practical AI usage patterns.",
    action: "Open AI",
    mode: "ai",
    image: "/ai-studio.jpg",
  },
];

const aiPosterSlides = [
  {
    src: "/AIinnutshell.png",
    alt: "What is AI quick visual guide with simple definition, examples, business use, and AI versus ML",
    caption: "AI basics poster: sense, think, act, examples, and AI vs ML.",
  },
  {
    src: "/MLHF.png",
    alt: "What is ML visual guide explaining machine learning basics, workflow, real-life examples, and learning types",
    caption: "ML basics poster: how ML works, real-life usage, and learning types.",
  },
  {
    src: "/GenAI.png",
    alt: "What is Generative AI visual guide covering what it is, how it works, capabilities, and practical examples",
    caption: "Generative AI poster: concept, workflow, and what GenAI can create.",
  },
  {
    src: "/LLM.png",
    alt: "What are LLMs visual guide covering what large language models are, how they work, uses, and examples",
    caption: "LLM poster: what LLMs are, how they work, and common use cases.",
  },
  {
    src: "/RAG.png",
    alt: "What is RAG visual guide explaining retrieval-augmented generation and how search plus generation improves answers",
    caption: "RAG poster: retrieval + generation workflow for more reliable AI answers.",
  },
];

const SEO_BASE_URL = "https://learninglab.example.com";

const seoByMode: Record<Mode, SeoMeta> = {
  home: {
    title: "Learning Lab | AI, Java, ID Tools, and Number Lab",
    description:
      "Learning Lab with AI Studio, Java feature explorer, ID tools, and Singapore number lab for 4D and Toto learning workflows.",
    path: "/",
  },
  workbook: {
    title: "Workbook | Learning Lab",
    description: "Structured workbook tracks and guided lessons with practice and quick checks.",
    path: "/workbook",
  },
  "id-tools": {
    title: "ID Tools Studio | Learning Lab",
    description:
      "Validate and generate Singapore NRIC/FIN, Malaysia MyKad, and Hong Kong HKID formats.",
    path: "/id-tools",
  },
  numbers: {
    title: "Number Lab | Learning Lab",
    description:
      "Explore Singapore 4D and Toto analysis tools with historical, probability-based educational views.",
    path: "/number-lab",
  },
  java: {
    title: "Java Learning | Learning Lab",
    description: "Java 11 to Java 21 feature explorer with practical release-by-release highlights.",
    path: "/java",
  },
  ai: {
    title: "AI Studio | Learning Lab",
    description:
      "AI Studio with flipbook guides, prompt workflows, and practical AI tool usage patterns.",
    path: "/ai-studio",
  },
  privacy: {
    title: "Privacy Policy | Learning Lab",
    description: "Privacy practices, analytics usage, and data handling policy for Learning Lab.",
    path: "/privacy-policy",
  },
  terms: {
    title: "Terms of Use | Learning Lab",
    description: "Terms governing usage of Learning Lab educational content and tools.",
    path: "/terms-of-use",
  },
  disclaimer: {
    title: "Disclaimer | Learning Lab",
    description:
      "Educational disclaimer for AI, Java, ID, and number-analysis content and tools on Learning Lab.",
    path: "/disclaimer",
  },
  contact: {
    title: "Contact | Learning Lab",
    description: "Contact Learning Lab for feedback, collaboration, and support.",
    path: "/contact",
  },
};

function GitZonesDiagram() {
  return (
    <figure className="zone-figure" aria-label="Git three zone flow">
      <div className="zone-flow">
        <div className="zone-box">Working Directory</div>
        <div className="zone-arrow">git add</div>
        <div className="zone-box">Staging Area</div>
        <div className="zone-arrow">git commit</div>
        <div className="zone-box">Repository (commits)</div>
      </div>
      <figcaption>The Git 3 zone universe</figcaption>
    </figure>
  );
}

function App() {
  const [mode, setMode] = useState<Mode>("home");
  const [numbersMode, setNumbersMode] = useState<"4d" | "toto">("4d");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    return window.localStorage.getItem("theme") === "dark" ? "dark" : "light";
  });
  const [trackIndex, setTrackIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [aiStudioPage, setAiStudioPage] = useState<"visuals" | "heartfulness">("visuals");
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const aiCarouselRef = useRef<HTMLDivElement | null>(null);
  const [aiSlideIndex, setAiSlideIndex] = useState(0);
  const [aiFlipDirection, setAiFlipDirection] = useState<"next" | "prev" | null>(null);
  const [aiFullscreenOpen, setAiFullscreenOpen] = useState(false);
  const flipResetTimerRef = useRef<number | null>(null);
  const aiNavLockTimerRef = useRef<number | null>(null);
  const aiNavLockedRef = useRef(false);
  const aiProgrammaticScrollRef = useRef(false);
  const aiProgrammaticScrollTimerRef = useRef<number | null>(null);

  const activeTrack = learningTracks[trackIndex];
  const flatLessons = useMemo(
    () =>
      activeTrack.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ moduleTitle: module.title, lesson })),
      ),
    [activeTrack],
  );
  const activeLesson = flatLessons[lessonIndex];
  const searchItems = useMemo(() => {
    const items: SearchResult[] = [
      {
        id: "home",
        label: "Learning Lab",
        hint: "Home page",
        mode: "home",
        keywords: ["home", "dashboard"],
      },
      {
        id: "id-tools",
        label: "ID Tools Studio",
        hint: "Singapore, Malaysia, Hong Kong",
        mode: "id-tools",
        keywords: ["nric", "mykad", "hkid", "validator", "generator"],
      },
      {
        id: "numbers-4d",
        label: "4D Predictor",
        hint: "Singapore 4D probability picks",
        mode: "numbers",
        numbersMode: "4d",
        keywords: ["4d", "lottery", "predictor"],
      },
      {
        id: "numbers-toto",
        label: "Toto Predictor",
        hint: "Singapore Toto history-based picks",
        mode: "numbers",
        numbersMode: "toto",
        keywords: ["toto", "lottery", "jackpot"],
      },
      {
        id: "java",
        label: "Java Feature Explorer",
        hint: "Java 11 to Java 21",
        mode: "java",
        keywords: ["java", "jdk", "features"],
      },
      {
        id: "ai",
        label: "AI Studio",
        hint: "Prompting, AI workflows, and Heartfulness tools",
        mode: "ai",
        keywords: ["ai", "prompt", "llm", "assistant", "heartfulness", "notebooklm", "perplexity", "gemini"],
      },
      {
        id: "privacy",
        label: "Privacy Policy",
        hint: "Data handling and analytics",
        mode: "privacy",
        keywords: ["privacy", "data", "cookie", "analytics"],
      },
      {
        id: "terms",
        label: "Terms of Use",
        hint: "Usage terms and conditions",
        mode: "terms",
        keywords: ["terms", "conditions", "usage"],
      },
      {
        id: "disclaimer",
        label: "Disclaimer",
        hint: "Educational and legal disclaimer",
        mode: "disclaimer",
        keywords: ["disclaimer", "legal", "educational", "responsibility"],
      },
      {
        id: "contact",
        label: "Contact",
        hint: "Reach out for support",
        mode: "contact",
        keywords: ["contact", "support", "feedback"],
      },
    ];

    learningTracks.forEach((track, tIndex) => {
      items.push({
        id: `track-${track.id}`,
        label: track.title,
        hint: "Workbook track",
        mode: "workbook",
        trackIndex: tIndex,
        lessonIndex: 0,
        keywords: [track.subtitle],
      });

      const lessons = track.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ moduleTitle: module.title, lesson })),
      );

      lessons.forEach((entry, index) => {
        items.push({
          id: `lesson-${track.id}-${entry.lesson.id}`,
          label: entry.lesson.title,
          hint: `${track.title} • ${entry.moduleTitle}`,
          mode: "workbook",
          trackIndex: tIndex,
          lessonIndex: index,
          keywords: [entry.lesson.objective],
        });
      });
    });

    return items;
  }, []);

  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return searchItems
      .filter((item) => {
        const haystack = `${item.label} ${item.hint} ${(item.keywords ?? []).join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 8);
  }, [searchItems, searchQuery]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: { main: themeMode === "light" ? "#0056d2" : "#8cb5ff" },
          secondary: { main: themeMode === "light" ? "#0a8f5b" : "#4fd69f" },
          background: {
            default: themeMode === "light" ? "#f5f7fa" : "#0f1728",
            paper: themeMode === "light" ? "#ffffff" : "#17233a",
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Lato", "Noto Sans", "Segoe UI", sans-serif',
        },
      }),
    [themeMode],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    window.localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    const seo = seoByMode[mode];
    const canonical = `${SEO_BASE_URL}${seo.path}`;
    document.title = seo.title;

    function upsertMeta(
      selector: string,
      attributeName: "name" | "property",
      attributeValue: string,
      content: string,
    ) {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.content = content;
    }

    upsertMeta('meta[name="description"]', "name", "description", seo.description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.description);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.head.querySelector(
      'script[data-seo="learninglab"]',
    ) as HTMLScriptElement | null;
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.seo = "learninglab";
      document.head.appendChild(structuredData);
    }
    structuredData.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Learning Lab",
      url: SEO_BASE_URL,
      description: seo.description,
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "Learning Lab",
      },
    });
  }, [mode]);

  useEffect(() => {
    if (mode !== "workbook" || !activeLesson) {
      return;
    }
    trackEvent("lesson_view", {
      track: activeTrack.id,
      lesson: activeLesson.lesson.id,
      module: activeLesson.moduleTitle,
    });
  }, [activeLesson, activeTrack.id, mode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!searchBoxRef.current) {
        return;
      }
      if (!searchBoxRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function openSearchResult(item: SearchResult) {
    setMode(item.mode);
    if (item.mode === "numbers" && item.numbersMode) {
      setNumbersMode(item.numbersMode);
    }
    if (item.mode === "workbook") {
      if (typeof item.trackIndex === "number") {
        setTrackIndex(item.trackIndex);
      }
      if (typeof item.lessonIndex === "number") {
        setLessonIndex(item.lessonIndex);
      }
    }
    setSearchQuery("");
    setSearchOpen(false);
  }

  function scrollToAiSlide(nextIndex: number, smooth = true) {
    const viewport = aiCarouselRef.current;
    const clampedIndex = Math.max(0, Math.min(nextIndex, aiPosterSlides.length - 1));
    const direction = clampedIndex > aiSlideIndex ? "next" : clampedIndex < aiSlideIndex ? "prev" : null;
    if (direction && !aiFullscreenOpen) {
      setAiFlipDirection(direction);
      if (flipResetTimerRef.current) {
        window.clearTimeout(flipResetTimerRef.current);
      }
      flipResetTimerRef.current = window.setTimeout(() => {
        setAiFlipDirection(null);
        flipResetTimerRef.current = null;
      }, 420);
    }
    if (aiFullscreenOpen) {
      if (aiNavLockedRef.current) {
        return;
      }
      aiNavLockedRef.current = true;
      if (aiNavLockTimerRef.current) {
        window.clearTimeout(aiNavLockTimerRef.current);
      }
      aiNavLockTimerRef.current = window.setTimeout(() => {
        aiNavLockedRef.current = false;
        aiNavLockTimerRef.current = null;
      }, 420);
      setAiSlideIndex(clampedIndex);
      return;
    }
    if (!viewport) {
      aiNavLockedRef.current = false;
      return;
    }
    aiProgrammaticScrollRef.current = true;
    if (aiProgrammaticScrollTimerRef.current) {
      window.clearTimeout(aiProgrammaticScrollTimerRef.current);
    }
    aiProgrammaticScrollTimerRef.current = window.setTimeout(() => {
      aiProgrammaticScrollRef.current = false;
      aiProgrammaticScrollTimerRef.current = null;
    }, smooth ? 460 : 80);
    const left = clampedIndex * viewport.clientWidth;
    viewport.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    setAiSlideIndex(clampedIndex);
  }

  useEffect(() => {
    if (mode !== "ai") {
      return;
    }
    setAiSlideIndex(0);
    setAiStudioPage("visuals");
    requestAnimationFrame(() => {
      scrollToAiSlide(0, false);
    });
  }, [mode]);

  useEffect(() => {
    if (mode !== "ai" || aiFullscreenOpen) {
      return;
    }
    const viewport = aiCarouselRef.current;
    if (!viewport) {
      return;
    }
    const left = aiSlideIndex * viewport.clientWidth;
    aiProgrammaticScrollRef.current = true;
    if (aiProgrammaticScrollTimerRef.current) {
      window.clearTimeout(aiProgrammaticScrollTimerRef.current);
    }
    aiProgrammaticScrollTimerRef.current = window.setTimeout(() => {
      aiProgrammaticScrollRef.current = false;
      aiProgrammaticScrollTimerRef.current = null;
    }, 80);
    viewport.scrollTo({ left, behavior: "auto" });
  }, [aiFullscreenOpen, mode]);

  useEffect(() => {
    return () => {
      if (flipResetTimerRef.current) {
        window.clearTimeout(flipResetTimerRef.current);
      }
      if (aiNavLockTimerRef.current) {
        window.clearTimeout(aiNavLockTimerRef.current);
      }
      if (aiProgrammaticScrollTimerRef.current) {
        window.clearTimeout(aiProgrammaticScrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!aiFullscreenOpen) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAiFullscreenOpen(false);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollToAiSlide(aiSlideIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollToAiSlide(aiSlideIndex + 1);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [aiFullscreenOpen, aiSlideIndex]);

  if (!activeLesson) {
    return <main className="ca-shell">No lessons available.</main>;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <main className="ca-shell">
        <header className="ca-header">
          <button
            className={`ca-brand ca-brand-link ${mode === "home" ? "is-active" : ""}`}
            onClick={() => setMode("home")}
            type="button"
            aria-label="Go to Learning Lab"
          >
            <span className="ca-brand-dot" />
            <strong>Learning Lab</strong>
          </button>
          <nav className="ca-nav" aria-label="Primary sections">
            <button className={mode === "workbook" ? "is-active" : ""} onClick={() => setMode("workbook")} type="button">
              Workbook
            </button>
            <button className={mode === "id-tools" ? "is-active" : ""} onClick={() => setMode("id-tools")} type="button">
              ID Tools
            </button>
            <button className={mode === "numbers" ? "is-active" : ""} onClick={() => setMode("numbers")} type="button">
              <span className="sg-icon" aria-hidden="true">🇸🇬</span> Number Lab
            </button>
            <button className={mode === "java" ? "is-active" : ""} onClick={() => setMode("java")} type="button">
              <span className="java-icon" aria-hidden="true">☕</span> Java
            </button>
            <button className={mode === "ai" ? "is-active" : ""} onClick={() => setMode("ai")} type="button">
              <span className="ai-icon" aria-hidden="true">🤖</span> AI
            </button>
          </nav>
          <div className="ca-header-actions">
            <div className="ca-search-box" ref={searchBoxRef}>
              <input
                className="ca-search"
                type="search"
                placeholder="Search courses or tools"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (filteredSearchItems[0]) {
                      openSearchResult(filteredSearchItems[0]);
                    }
                  }
                  if (event.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
              {searchOpen && searchQuery.trim() && (
                <div className="ca-search-dropdown" role="listbox" aria-label="Search results">
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="ca-search-result"
                        onClick={() => openSearchResult(item)}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.hint}</span>
                      </button>
                    ))
                  ) : (
                    <p className="ca-search-empty">No matching results</p>
                  )}
                </div>
              )}
            </div>
            <IconButton
              className={`theme-toggle ${themeMode === "dark" ? "is-dark" : ""}`}
              onClick={() =>
                setThemeMode((current) => (current === "light" ? "dark" : "light"))
              }
              aria-label={themeMode === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              <span aria-hidden="true" className="theme-toggle-icon sun">☀</span>
              <span aria-hidden="true" className="theme-toggle-thumb" />
              <span aria-hidden="true" className="theme-toggle-icon moon">☾</span>
            </IconButton>
          </div>
        </header>

        {mode === "home" && (
          <>
            <section className="ca-section">
              <div className="ca-section-head">
                <h2>Featured Learning Blocks</h2>
              </div>
              <div className="ca-card-grid">
                {featureCards.map((card) => (
                  <article
                    key={card.title}
                    className={[
                      "ca-card",
                      card.mode === "java" ? "is-java" : "",
                      card.mode === "ai" ? "is-ai" : "",
                    ].filter(Boolean).join(" ")}
                    role="button"
                    tabIndex={0}
                    onClick={() => setMode(card.mode)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setMode(card.mode);
                      }
                    }}
                    aria-label={`Open ${card.title}`}
                  >
                    <img src={card.image} alt={card.title} />
                    <div className="ca-card-body">
                      <h3>
                        {card.mode === "java" && <span className="java-icon" aria-hidden="true">☕</span>}
                        {card.mode === "ai" && <span className="ai-icon" aria-hidden="true">🤖</span>}
                        {card.title}
                      </h3>
                      <p className="ca-card-meta">{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {mode === "workbook" && (
          <section className="workspace-shell">
            <div className="workspace-head">
              <h2>{activeTrack.title}</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
            </div>
            <section className="track-switcher">
              {learningTracks.map((track, index) => (
                <button
                  key={track.id}
                  className={index === trackIndex ? "is-active" : ""}
                  onClick={() => {
                    setTrackIndex(index);
                    setLessonIndex(0);
                  }}
                  type="button"
                >
                  {track.title}
                </button>
              ))}
            </section>
            <div className="layout">
              <aside className="sidebar">
                <h2>{activeTrack.title}</h2>
                <p>{activeTrack.subtitle}</p>
                <small>{activeTrack.sourceLabel}</small>
                <nav aria-label="Lesson navigation">
                  <ol>
                    {flatLessons.map((entry, index) => (
                      <li key={entry.lesson.id}>
                        <button
                          className={index === lessonIndex ? "is-current" : ""}
                          onClick={() => setLessonIndex(index)}
                          type="button"
                        >
                          {index + 1}. {entry.lesson.title}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>

              <article className="content">
                <h2 className="chapter-title">Chapter {lessonIndex + 1} - {activeLesson.lesson.title}</h2>
                <p className="chapter-intro">{activeLesson.lesson.objective}</p>
                <p className="meta">{activeLesson.moduleTitle} • {activeLesson.lesson.time}</p>

                {activeLesson.lesson.id === "zones" && <GitZonesDiagram />}

                <section className="bite-grid">
                  {activeLesson.lesson.bites.map((bite) => (
                    <div key={bite.title} className="bite-card">
                      <h3>{bite.title}</h3>
                      <p>{bite.text}</p>
                    </div>
                  ))}
                </section>

                {activeLesson.lesson.practice && (
                  <section className="practice">
                    <h3>Try Now</h3>
                    <pre>
                      {activeLesson.lesson.practice.map((line) => `${line}\n`).join("")}
                    </pre>
                  </section>
                )}

                {activeLesson.lesson.check && (
                  <section className="brain-note">
                    <h3>Brain note</h3>
                    <p>{activeLesson.lesson.check}</p>
                  </section>
                )}

                <div className="lesson-controls">
                  <button
                    disabled={lessonIndex === 0}
                    onClick={() => setLessonIndex((index) => Math.max(index - 1, 0))}
                    type="button"
                  >
                    Previous
                  </button>
                  <button onClick={() => setLessonIndex(0)} type="button">
                    Restart Track
                  </button>
                  <button
                    disabled={lessonIndex === flatLessons.length - 1}
                    onClick={() =>
                      setLessonIndex((index) => Math.min(index + 1, flatLessons.length - 1))
                    }
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}

        {mode === "id-tools" && (
          <section className="workspace-shell">
            <div className="workspace-head">
              <h2>ID Tools</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
            </div>
            <NricTools />
          </section>
        )}

        {mode === "numbers" && (
          <section className="workspace-shell">
            <div className="workspace-head">
              <h2>Number Lab</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
            </div>
            <section className="country-switcher">
              <button
                className={numbersMode === "4d" ? "is-active" : ""}
                onClick={() => setNumbersMode("4d")}
                type="button"
              >
                <span className="sg-icon" aria-hidden="true">🇸🇬</span> 4D Predictor
              </button>
              <button
                className={numbersMode === "toto" ? "is-active" : ""}
                onClick={() => setNumbersMode("toto")}
                type="button"
              >
                <span className="sg-icon" aria-hidden="true">🇸🇬</span> Toto Predictor
              </button>
            </section>
            {numbersMode === "4d" && <TotoPredictor />}
            {numbersMode === "toto" && <SingaporeTotoPage />}
            <article className="tool-card legal-note">
              <h3>Educational Disclaimer</h3>
              <p>
                Number Lab predictions are educational demonstrations only and do not guarantee outcomes.
                Please use responsibly and follow local regulations.
              </p>
            </article>
          </section>
        )}

        {mode === "java" && (
          <section className="workspace-shell">
            <div className="workspace-head">
              <h2>Java Learning</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
            </div>
            <JavaFeaturesPage />
          </section>
        )}

        {mode === "ai" && (
          <section className="workspace-shell">
            <div className="workspace-head">
              <h2>AI Studio</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
            </div>
            <section className="country-switcher ai-page-switcher" aria-label="AI Studio pages">
              <button
                className={aiStudioPage === "visuals" ? "is-active" : ""}
                onClick={() => setAiStudioPage("visuals")}
                type="button"
              >
                Visual Flipbook
              </button>
              <button
                className={aiStudioPage === "heartfulness" ? "is-active" : ""}
                onClick={() => setAiStudioPage("heartfulness")}
                type="button"
              >
                AI Tools
              </button>
            </section>
            {aiStudioPage === "visuals" ? (
              <>
                <section className="ai-carousel" aria-label="AI visual pages">
                  <div className="ai-carousel-track">
                    <button
                      type="button"
                      className="ai-carousel-arrow"
                      onClick={() => scrollToAiSlide(aiSlideIndex - 1)}
                      disabled={aiSlideIndex === 0}
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    <div
                      className={[
                        "ai-carousel-viewport",
                        aiFlipDirection === "next" ? "is-flipping-next" : "",
                        aiFlipDirection === "prev" ? "is-flipping-prev" : "",
                      ].filter(Boolean).join(" ")}
                      ref={aiCarouselRef}
                      onScroll={(event) => {
                        if (aiProgrammaticScrollRef.current) {
                          return;
                        }
                        const target = event.currentTarget;
                        if (!target.clientWidth) {
                          return;
                        }
                        const nextIndex = Math.round(target.scrollLeft / target.clientWidth);
                        if (nextIndex !== aiSlideIndex) {
                          setAiSlideIndex(nextIndex);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          scrollToAiSlide(aiSlideIndex - 1);
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          scrollToAiSlide(aiSlideIndex + 1);
                        }
                      }}
                      tabIndex={0}
                    >
                      {aiPosterSlides.map((slide) => (
                        <figure
                          className="ai-poster ai-slide"
                          key={slide.src}
                          onClick={() => setAiFullscreenOpen(true)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setAiFullscreenOpen(true);
                            }
                          }}
                          aria-label="Open page in fullscreen"
                        >
                          <img src={slide.src} alt={slide.alt} width={1024} height={1536} />
                          <figcaption>{slide.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="ai-carousel-arrow"
                      onClick={() => scrollToAiSlide(aiSlideIndex + 1)}
                      disabled={aiSlideIndex === aiPosterSlides.length - 1}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </div>
                  <div className="ai-carousel-dots" role="tablist" aria-label="AI page indicators">
                    {aiPosterSlides.map((slide, index) => (
                      <button
                        key={slide.src}
                        type="button"
                        className={index === aiSlideIndex ? "is-active" : ""}
                        onClick={() => scrollToAiSlide(index)}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    ))}
                  </div>
                  {aiFullscreenOpen && (
                    <div
                      className="ai-fullscreen-overlay"
                      role="dialog"
                      aria-modal="true"
                      aria-label="AI page fullscreen"
                      onClick={(event) => {
                        if (event.target === event.currentTarget) {
                          setAiFullscreenOpen(false);
                        }
                      }}
                    >
                      <div className="ai-fullscreen-content">
                        <button
                          type="button"
                          className="ai-fullscreen-nav prev"
                          onClick={(event) => {
                            event.stopPropagation();
                            scrollToAiSlide(aiSlideIndex - 1, false);
                          }}
                          disabled={aiSlideIndex === 0}
                          aria-label="Previous page"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="ai-fullscreen-close"
                          onClick={(event) => {
                            event.stopPropagation();
                            setAiFullscreenOpen(false);
                          }}
                          aria-label="Close fullscreen"
                        >
                          ✕
                        </button>
                        <img
                          src={aiPosterSlides[aiSlideIndex].src}
                          alt={aiPosterSlides[aiSlideIndex].alt}
                          width={1024}
                          height={1536}
                        />
                        <button
                          type="button"
                          className="ai-fullscreen-nav next"
                          onClick={(event) => {
                            event.stopPropagation();
                            scrollToAiSlide(aiSlideIndex + 1, false);
                          }}
                          disabled={aiSlideIndex === aiPosterSlides.length - 1}
                          aria-label="Next page"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  )}
                </section>
                <section className="bite-grid" aria-label="AI learning blocks">
                  <article className="bite-card">
                    <h3>Prompt Basics</h3>
                    <p>Define role, goal, inputs, and output format in one short prompt block.</p>
                  </article>
                  <article className="bite-card">
                    <h3>Workflow Pattern</h3>
                    <p>Draft, critique, refine, and verify. This loop improves quality quickly.</p>
                  </article>
                  <article className="bite-card">
                    <h3>Safety Check</h3>
                    <p>For finance, legal, or medical topics, cross-check with trusted primary sources.</p>
                  </article>
                </section>
                <section className="tool-card ai-hero">
                  <h2>How to use AI in this lab</h2>
                  <p>
                    Start with clear prompts, provide context, and ask for structured output.
                    Validate important results before using them in production workflows.
                  </p>
                </section>
              </>
            ) : (
              <AiHeartfulnessToolsPage />
            )}
          </section>
        )}

        {mode === "privacy" && (
          <section className="workspace-shell legal-shell">
            <div className="workspace-head">
              <h2>Privacy Policy</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
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
        )}

        {mode === "terms" && (
          <section className="workspace-shell legal-shell">
            <div className="workspace-head">
              <h2>Terms of Use</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
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
        )}

        {mode === "disclaimer" && (
          <section className="workspace-shell legal-shell">
            <div className="workspace-head">
              <h2>Disclaimer</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
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
        )}

        {mode === "contact" && (
          <section className="workspace-shell legal-shell">
            <div className="workspace-head">
              <h2>Contact</h2>
              <button type="button" onClick={() => setMode("home")}>Back to Learning Lab</button>
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
        )}

        <footer className="ca-footer" aria-label="Footer links">
          <p>© {new Date().getFullYear()} Learning Lab</p>
          <div className="ca-footer-links">
            <button type="button" onClick={() => setMode("privacy")}>Privacy Policy</button>
            <button type="button" onClick={() => setMode("terms")}>Terms of Use</button>
            <button type="button" onClick={() => setMode("disclaimer")}>Disclaimer</button>
            <button type="button" onClick={() => setMode("contact")}>Contact</button>
          </div>
        </footer>
      </main>
    </ThemeProvider>
  );
}

export default App;
