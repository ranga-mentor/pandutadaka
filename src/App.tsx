import { useEffect, useMemo, useRef, useState } from "react";
import { CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { trackEvent } from "./analytics";
import JavaFeaturesPage from "./components/JavaFeaturesPage";
import NricTools from "./components/NricTools";
import SingaporeTotoPage from "./components/SingaporeTotoPage";
import TotoPredictor from "./components/TotoPredictor";
import { learningTracks } from "./data/learningContent";
import "./App.css";

type Mode = "home" | "workbook" | "id-tools" | "numbers" | "java";

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
                  <article key={card.title} className={`ca-card ${card.mode === "java" ? "is-java" : ""}`}>
                    <img src={card.image} alt={card.title} />
                    <div className="ca-card-body">
                      <h3>
                        {card.mode === "java" && <span className="java-icon" aria-hidden="true">☕</span>}
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
      </main>
    </ThemeProvider>
  );
}

export default App;
