import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "./analytics";
import NricTools from "./components/NricTools";
import TotoPredictor from "./components/TotoPredictor";
import JavaFeaturesPage from "./components/JavaFeaturesPage";
import SingaporeTotoPage from "./components/SingaporeTotoPage";
import { learningTracks } from "./data/learningContent";
import "./App.css";

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
  const [mode, setMode] = useState<"workbook" | "nric" | "toto" | "sg-toto" | "java">("workbook");
  const [trackIndex, setTrackIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  const activeTrack = learningTracks[trackIndex];
  const flatLessons = useMemo(
    () =>
      activeTrack.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ moduleTitle: module.title, lesson })),
      ),
    [activeTrack],
  );

  const activeLesson = flatLessons[lessonIndex];

  useEffect(() => {
    if (mode !== "workbook") {
      return;
    }
    if (!activeLesson) {
      return;
    }
    trackEvent("lesson_view", {
      track: activeTrack.id,
      lesson: activeLesson.lesson.id,
      module: activeLesson.moduleTitle,
    });
  }, [activeLesson, activeTrack.id, mode]);

  if (!activeLesson) {
    return <main className="app-shell">No lessons available.</main>;
  }

  return (
    <main className="app-shell">
      <div className="card-background" aria-hidden="true">
        <span className="bg-card bg-card-1" />
        <span className="bg-card bg-card-2" />
        <span className="bg-card bg-card-3" />
        <span className="bg-card bg-card-4" />
        <span className="bg-card bg-card-5" />
      </div>

      <header className="topbar">
        <p className="eyebrow">Learning Workbook</p>
        <h1>Byte Learning</h1>
      </header>

      <section className="mode-switcher">
        <button
          className={mode === "workbook" ? "is-active" : ""}
          onClick={() => setMode("workbook")}
          type="button"
        >
          Workbook
        </button>
        <button
          className={mode === "nric" ? "is-active" : ""}
          onClick={() => setMode("nric")}
          type="button"
        >
          NRIC Tools
        </button>
        <button
          className={mode === "toto" ? "is-active" : ""}
          onClick={() => setMode("toto")}
          type="button"
        >
          4D Predictor
        </button>
        <button
          className={mode === "sg-toto" ? "is-active" : ""}
          onClick={() => setMode("sg-toto")}
          type="button"
        >
          Toto Predictor
        </button>
        <button
          className={mode === "java" ? "is-active" : ""}
          onClick={() => setMode("java")}
          type="button"
        >
          Java 11-21
        </button>
      </section>

      {mode === "nric" && <NricTools />}
      {mode === "toto" && <TotoPredictor />}
      {mode === "sg-toto" && <SingaporeTotoPage />}
      {mode === "java" && <JavaFeaturesPage />}

      {mode === "workbook" && <section className="track-switcher">
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
      </section>}

      {mode === "workbook" && <div className="layout">
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
            <button
              onClick={() => setLessonIndex(0)}
              type="button"
            >
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
      </div>}
    </main>
  );
}

export default App;
