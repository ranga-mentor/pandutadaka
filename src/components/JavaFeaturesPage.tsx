const javaReleases = [
  {
    version: "Java 11 (LTS)",
    year: "2018",
    highlights: [
      "Standard HTTP Client (java.net.http)",
      "Single-file source launch: `java MyApp.java`",
      "Local-variable syntax for lambda parameters (`var`)",
      "Flight Recorder + Mission Control available in OpenJDK",
    ],
  },
  {
    version: "Java 12",
    year: "2019",
    highlights: [
      "Switch expressions introduced as preview",
      "Compact Number Formatting",
      "Shenandoah GC (experimental)",
    ],
  },
  {
    version: "Java 13",
    year: "2019",
    highlights: [
      "Text blocks preview for multiline strings",
      "Switch expressions preview update",
      "Dynamic CDS archives",
    ],
  },
  {
    version: "Java 14",
    year: "2020",
    highlights: [
      "Switch expressions finalized",
      "Helpful NullPointerException messages",
      "Records preview",
      "Pattern matching for `instanceof` preview",
    ],
  },
  {
    version: "Java 15",
    year: "2020",
    highlights: [
      "Text blocks finalized",
      "Sealed classes preview",
      "Hidden classes",
    ],
  },
  {
    version: "Java 16",
    year: "2021",
    highlights: [
      "Records finalized",
      "Pattern matching for `instanceof` finalized",
      "jpackage tool finalized",
    ],
  },
  {
    version: "Java 17 (LTS)",
    year: "2021",
    highlights: [
      "Sealed classes finalized",
      "Pattern matching for switch (preview)",
      "New macOS rendering pipeline",
      "Strong encapsulation of JDK internals",
    ],
  },
  {
    version: "Java 18",
    year: "2022",
    highlights: [
      "Simple web server (`jwebserver`)",
      "UTF-8 by default",
      "Code snippets in JavaDoc",
    ],
  },
  {
    version: "Java 19",
    year: "2022",
    highlights: [
      "Virtual threads preview (Project Loom)",
      "Structured concurrency incubator",
      "Record patterns preview",
    ],
  },
  {
    version: "Java 20",
    year: "2023",
    highlights: [
      "Scoped values incubator",
      "Record patterns second preview",
      "Pattern matching for switch fourth preview",
    ],
  },
  {
    version: "Java 21 (LTS)",
    year: "2023",
    highlights: [
      "Virtual threads finalized",
      "Pattern matching for switch finalized",
      "Record patterns finalized",
      "Sequenced collections",
      "String templates preview",
    ],
  },
];

function JavaFeaturesPage() {
  return (
    <section className="java-page" aria-label="Java 11 to Java 21 features">
      <article className="tool-card java-hero">
        <h2>Java 11 to Java 21 Features</h2>
        <p>
          Quick release-by-release guide from Java 11 up to Java 21, with LTS milestones and
          the most useful language/platform updates.
        </p>
      </article>

      <div className="java-grid">
        {javaReleases.map((release) => (
          <article key={release.version} className="tool-card java-release">
            <h3>{release.version}</h3>
            <small>Released: {release.year}</small>
            <ul>
              {release.highlights.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default JavaFeaturesPage;
