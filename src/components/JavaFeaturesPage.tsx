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
  {
    version: "Java 22",
    year: "2024",
    highlights: [
      "Foreign Function & Memory API finalized",
      "Launch multi-file source-code programs",
      "Unnamed variables and patterns",
      "Structured concurrency (preview)",
    ],
  },
  {
    version: "Java 23",
    year: "2024",
    highlights: [
      "Markdown documentation comments",
      "Module import declarations (preview)",
      "Primitive types in patterns/switch (preview)",
      "Structured concurrency + scoped values previews continue",
    ],
  },
  {
    version: "Java 24",
    year: "2025",
    highlights: [
      "Class-File API finalized",
      "Stream gatherers finalized",
      "Security Manager permanently disabled",
      "AOT class loading/linking improvements",
    ],
  },
  {
    version: "Java 25 (LTS)",
    year: "2025",
    highlights: [
      "Scoped values finalized",
      "Module import declarations continue",
      "Structured concurrency preview iteration",
      "Compact source files + instance main methods",
      "Generational Shenandoah",
    ],
  },
];

type JavaFeaturesPageProps = {
  javaPage: "core" | "junit" | "spring-boot" | "releases";
  onJavaPageChange: (page: "core" | "junit" | "spring-boot" | "releases") => void;
};

function JavaFeaturesPage({ javaPage, onJavaPageChange }: JavaFeaturesPageProps) {

  return (
    <section className="java-page" aria-label="Java 11 to Java 25 features">
      <article className="tool-card java-hero">
        <h2>Java Learning Hub</h2>
        <p>Use tabs to switch between Core Java, Java Features, JUnit, and Spring Boot.</p>
      </article>

      <section className="country-switcher java-topic-switcher" aria-label="Java topic pages">
        <button
          type="button"
          className={javaPage === "core" ? "is-active" : ""}
          onClick={() => onJavaPageChange("core")}
        >
          Core Java
        </button>
        <button
          type="button"
          className={javaPage === "releases" ? "is-active" : ""}
          onClick={() => onJavaPageChange("releases")}
        >
          Java Features
        </button>
        <button
          type="button"
          className={javaPage === "junit" ? "is-active" : ""}
          onClick={() => onJavaPageChange("junit")}
        >
          JUnit
        </button>
        <button
          type="button"
          className={javaPage === "spring-boot" ? "is-active" : ""}
          onClick={() => onJavaPageChange("spring-boot")}
        >
          Spring Boot
        </button>
      </section>

      {javaPage === "core" && (
        <section className="java-grid">
          <article className="tool-card java-release">
            <h3>Core Java Fundamentals</h3>
            <ul>
              <li><strong>JVM vs JDK vs JRE:</strong> JDK builds, JVM runs, JRE provides runtime libraries.</li>
              <li><strong>OOP pillars:</strong> encapsulation, inheritance, polymorphism, abstraction with practical class design.</li>
              <li><strong>Collections:</strong> use List for order, Set for uniqueness, Map for key-value lookups.</li>
              <li><strong>Exceptions:</strong> checked for recoverable flows, unchecked for programming errors.</li>
              <li><strong>Immutability:</strong> prefer immutable objects for thread safety and easier debugging.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Core Java Daily Skills</h3>
            <ul>
              <li><strong>Strings + Streams:</strong> transform/filter data using `stream()`, `map()`, `filter()`, `collect()`.</li>
              <li><strong>Optional:</strong> avoid null checks via `map`, `orElse`, and `orElseThrow` patterns.</li>
              <li><strong>File I/O:</strong> use `java.nio.file` + try-with-resources for safe reads/writes.</li>
              <li><strong>Concurrency:</strong> start with `ExecutorService`; use `CompletableFuture` for async workflows.</li>
              <li><strong>Code quality:</strong> single-responsibility classes, clear method names, small focused methods.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Core Java Mini Roadmap</h3>
            <ul>
              <li>Week 1: syntax, classes, loops, methods, arrays, and String handling.</li>
              <li>Week 2: OOP and collections with small domain modeling exercises.</li>
              <li>Week 3: exception handling, file processing, and stream-based transforms.</li>
              <li>Week 4: multithreading basics and mini project with clean package structure.</li>
              <li>Outcome: build a small CLI app with validation, persistence, and tests.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Interview-Focused Core Java Topics</h3>
            <ul>
              <li>`equals` vs `==`, and why `hashCode` contract matters.</li>
              <li>`ArrayList` vs `LinkedList`, `HashMap` vs `TreeMap` tradeoffs.</li>
              <li>String pool, immutability, and pass-by-value behavior in Java.</li>
              <li>Checked vs unchecked exceptions with real API design examples.</li>
              <li>Thread lifecycle, race conditions, synchronization, and deadlock basics.</li>
            </ul>
          </article>
        </section>
      )}

      {javaPage === "junit" && (
        <section className="java-grid">
          <article className="tool-card java-release">
            <h3>JUnit 5 Essentials</h3>
            <ul>
              <li><strong>Core annotations:</strong> `@Test`, `@BeforeEach`, `@AfterEach`, `@Nested`, `@DisplayName`.</li>
              <li><strong>Assertions:</strong> `assertEquals`, `assertAll`, `assertThrows`, `assertTimeout` for robust checks.</li>
              <li><strong>Parameterized tests:</strong> `@ValueSource`, `@CsvSource`, `@MethodSource` for input variants.</li>
              <li><strong>Lifecycle:</strong> consistent setup/teardown to keep tests independent and deterministic.</li>
              <li><strong>Naming:</strong> `method_condition_expectedResult` style for readability.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Practical Testing Workflow</h3>
            <ul>
              <li><strong>AAA pattern:</strong> Arrange, Act, Assert for predictable test structure.</li>
              <li><strong>Mocking:</strong> isolate DB, HTTP, and file dependencies using Mockito-style doubles.</li>
              <li><strong>Test pyramid:</strong> many unit tests, fewer integration tests, very few end-to-end tests.</li>
              <li><strong>CI quality gates:</strong> run on every PR and fail build on test regressions.</li>
              <li><strong>Flaky test control:</strong> avoid shared state, fixed sleeps, and nondeterministic data.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>JUnit in Real Projects</h3>
            <ul>
              <li>Service layer: validate business rules and edge cases with unit tests.</li>
              <li>Controller/API layer: verify request validation and response contracts.</li>
              <li>Repository layer: use integration tests for actual query behavior.</li>
              <li>Error paths: verify exception mapping and fallback handling.</li>
              <li>Refactoring safety: tests provide confidence to change legacy code.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>JUnit Starter Checklist</h3>
            <ul>
              <li>Write one happy-path and at least two edge-case tests per method.</li>
              <li>Keep each test focused on one behavior only.</li>
              <li>Avoid testing framework internals; test your business logic.</li>
              <li>Prefer readable test data builders over long inline setup.</li>
              <li>Track coverage, but prioritize meaningful assertions over percentages.</li>
            </ul>
          </article>
        </section>
      )}

      {javaPage === "spring-boot" && (
        <section className="java-grid">
          <article className="tool-card java-release">
            <h3>Spring Boot Essentials</h3>
            <ul>
              <li><strong>Auto-configuration:</strong> sensible defaults reduce setup and boilerplate.</li>
              <li><strong>Starter dependencies:</strong> quick setup via `spring-boot-starter-web`, `data-jpa`, `test`.</li>
              <li><strong>Embedded servers:</strong> run apps with built-in Tomcat/Jetty without manual deployment.</li>
              <li><strong>External config:</strong> use `application.yml` and profiles for environment-specific values.</li>
              <li><strong>Actuator:</strong> health, metrics, and runtime insights for production readiness.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Build REST APIs</h3>
            <ul>
              <li>Use `@RestController`, `@RequestMapping`, and typed DTOs for clean contracts.</li>
              <li>Validate input with `jakarta.validation` (`@NotNull`, `@Size`, `@Email`).</li>
              <li>Centralize errors using `@ControllerAdvice` and consistent response payloads.</li>
              <li>Apply service layer boundaries to keep controller logic thin.</li>
              <li>Document endpoints with OpenAPI/Swagger for consumer teams.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Feign Client (Service-to-Service Calls)</h3>
            <ul>
              <li><strong>What it is:</strong> declarative HTTP client to call other services via Java interfaces.</li>
              <li><strong>Enablement:</strong> add OpenFeign dependency and `@EnableFeignClients` in your app config.</li>
              <li><strong>Usage:</strong> define an interface with `@FeignClient` and mapping annotations like `@GetMapping`.</li>
              <li><strong>Resilience:</strong> combine with retries/timeouts and fallback handlers for downstream failures.</li>
              <li><strong>Observability:</strong> log request/response metadata and monitor error rates per client.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Data and Persistence</h3>
            <ul>
              <li>Model entities with JPA annotations and map relationships carefully.</li>
              <li>Use Spring Data repositories for CRUD and query derivation.</li>
              <li>Prefer pagination for large reads and projections for lean responses.</li>
              <li>Handle transactions at service boundary with `@Transactional`.</li>
              <li>Manage schema changes with Flyway or Liquibase migrations.</li>
            </ul>
          </article>
          <article className="tool-card java-release">
            <h3>Testing and Deployment</h3>
            <ul>
              <li>Unit tests with JUnit + Mockito, API tests with `@WebMvcTest` / MockMvc.</li>
              <li>Integration tests with Testcontainers for real DB behavior.</li>
              <li>Secure APIs with Spring Security, JWT filters, and role-based access.</li>
              <li>Containerize via Docker and promote with CI/CD pipelines.</li>
              <li>Use logs + metrics + traces to monitor production incidents.</li>
            </ul>
          </article>
        </section>
      )}

      {javaPage === "releases" && (
        <section className="java-grid">
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
        </section>
      )}
    </section>
  );
}

export default JavaFeaturesPage;
