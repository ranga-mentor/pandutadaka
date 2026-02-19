import { useEffect, useMemo, useRef, useState } from "react";
import { CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { trackEvent } from "./analytics";
import JavaFeaturesPage from "./components/JavaFeaturesPage";
import NricTools from "./components/NricTools";
import SingaporeTotoPage from "./components/SingaporeTotoPage";
import TotoPredictor from "./components/TotoPredictor";
import { learningTracks } from "./data/learningContent";
import "./App.css";

type Mode = "home" | "workbook" | "id-tools" | "numbers" | "java" | "ai";

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

const featureCards: FeatureCard[] = [
  {
    title: "Workbook Tracks",
    description: "Structured chapters with practice and quick checks for guided learning.",
    action: "Open Workbook",
    mode: "workbook",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
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
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "AI Studio",
    description: "Learn prompt design, model workflows, and practical AI usage patterns.",
    action: "Open AI",
    mode: "ai",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
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
];

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
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const aiCarouselRef = useRef<HTMLDivElement | null>(null);
  const [aiSlideIndex, setAiSlideIndex] = useState(0);
  const [aiFlipDirection, setAiFlipDirection] = useState<"next" | "prev" | null>(null);
  const flipResetTimerRef = useRef<number | null>(null);

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
        hint: "Prompting and AI workflows",
        mode: "ai",
        keywords: ["ai", "prompt", "llm", "assistant"],
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
    if (!viewport) {
      return;
    }
    const clampedIndex = Math.max(0, Math.min(nextIndex, aiPosterSlides.length - 1));
    const direction = clampedIndex > aiSlideIndex ? "next" : clampedIndex < aiSlideIndex ? "prev" : null;
    if (direction) {
      setAiFlipDirection(direction);
      if (flipResetTimerRef.current) {
        window.clearTimeout(flipResetTimerRef.current);
      }
      flipResetTimerRef.current = window.setTimeout(() => {
        setAiFlipDirection(null);
        flipResetTimerRef.current = null;
      }, 420);
    }
    const left = clampedIndex * viewport.clientWidth;
    viewport.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    setAiSlideIndex(clampedIndex);
  }

  useEffect(() => {
    if (mode !== "ai") {
      return;
    }
    setAiSlideIndex(0);
    requestAnimationFrame(() => {
      scrollToAiSlide(0, false);
    });
  }, [mode]);

  useEffect(() => {
    return () => {
      if (flipResetTimerRef.current) {
        window.clearTimeout(flipResetTimerRef.current);
      }
    };
  }, []);

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
                  >
                    <img src={card.image} alt={card.title} />
                    <div className="ca-card-body">
                      <h3>
                        {card.mode === "java" && <span className="java-icon" aria-hidden="true">☕</span>}
                        {card.mode === "ai" && <span className="ai-icon" aria-hidden="true">🤖</span>}
                        {card.title}
                      </h3>
                      <p className="ca-card-meta">{card.description}</p>
                      <button type="button" className="ca-secondary-btn" onClick={() => setMode(card.mode)}>
                        {card.action}
                      </button>
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
            <section className="tool-card ai-hero">
              <h2>How to use AI in this lab</h2>
              <p>
                Start with clear prompts, provide context, and ask for structured output.
                Validate important results before using them in production workflows.
              </p>
            </section>
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
                    <figure className="ai-poster ai-slide" key={slide.src}>
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
          </section>
        )}
      </main>
    </ThemeProvider>
  );
}

export default App;
