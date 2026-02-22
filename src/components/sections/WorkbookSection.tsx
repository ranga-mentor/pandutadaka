import type { ReactNode } from "react";
import type { LearningTrack } from "../../data/learningContent";

type Bite = {
  title: string;
  text: string;
};

type Lesson = {
  id: string;
  title: string;
  objective: string;
  bites: Bite[];
  practice?: string[];
  check?: string;
};

type FlatLessonEntry = {
  moduleTitle: string;
  lesson: Lesson;
};

type WorkbookSectionProps = {
  tracks: LearningTrack[];
  activeTrack: LearningTrack;
  flatLessons: FlatLessonEntry[];
  lessonIndex: number;
  activeLesson: FlatLessonEntry;
  onTrackChange: (index: number) => void;
  onLessonChange: (index: number) => void;
  gitVisual: ReactNode;
};

export default function WorkbookSection({
  tracks,
  activeTrack,
  flatLessons,
  lessonIndex,
  activeLesson,
  onTrackChange,
  onLessonChange,
  gitVisual,
}: WorkbookSectionProps) {
  return (
    <section className="workspace-shell">
      <div className="workspace-head">
        <h2>{activeTrack.title}</h2>
      </div>
      <section className="track-switcher">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            className={track.id === activeTrack.id ? "is-active" : ""}
            onClick={() => onTrackChange(index)}
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
                    onClick={() => onLessonChange(index)}
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
          <h2 className="chapter-title">{activeLesson.lesson.title}</h2>
          <p className="chapter-intro">{activeLesson.lesson.objective}</p>

          {activeLesson.lesson.id === "zones" && gitVisual}
          {activeLesson.lesson.id === "containers-not-vm" && (
            <section aria-label="Container visuals">
              <figure className="zone-figure git-poster-figure">
                <img
                  src="/containers-image-vs-container.jpg"
                  alt="Image versus container blueprint and running instance"
                  width={1366}
                  height={768}
                  loading="lazy"
                  onError={(event) => {
                    const figure = event.currentTarget.closest("figure");
                    if (figure) {
                      figure.setAttribute("hidden", "true");
                    }
                  }}
                />
                <figcaption>Image vs Container: Blueprint and Build</figcaption>
              </figure>
              <figure className="zone-figure git-poster-figure">
                <img
                  src="/containers-docker-to-pods.jpg"
                  alt="From Docker to Pods with Kubernetes and OpenShift"
                  width={1366}
                  height={768}
                  loading="lazy"
                  onError={(event) => {
                    const figure = event.currentTarget.closest("figure");
                    if (figure) {
                      figure.setAttribute("hidden", "true");
                    }
                  }}
                />
                <figcaption>Docker to Pods: Sequential Journey</figcaption>
              </figure>
            </section>
          )}

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
              onClick={() => onLessonChange(Math.max(lessonIndex - 1, 0))}
              type="button"
            >
              Previous
            </button>
            <button onClick={() => onLessonChange(0)} type="button">
              Restart Track
            </button>
            <button
              disabled={lessonIndex === flatLessons.length - 1}
              onClick={() => onLessonChange(Math.min(lessonIndex + 1, flatLessons.length - 1))}
              type="button"
            >
              Next
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
