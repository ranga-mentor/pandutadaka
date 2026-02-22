import type { FeatureCard, Mode } from "../../types/appTypes";

type HomeSectionProps = {
  cards: FeatureCard[];
  onOpenMode: (mode: Mode) => void;
};

export default function HomeSection({ cards, onOpenMode }: HomeSectionProps) {
  return (
    <section className="ca-section">
      <div className="ca-section-head">
        <h2>Featured Learning Blocks</h2>
      </div>
      <p className="ca-home-note">
        This site is a personal learning notebook, curated to organize and revisit practical concepts.
      </p>
      <div className="ca-card-grid">
        {cards.map((card) => (
          <article
            key={card.title}
            className={[
              "ca-card",
              card.mode === "java" ? "is-java" : "",
              card.mode === "ai" ? "is-ai" : "",
            ].filter(Boolean).join(" ")}
            role="button"
            tabIndex={0}
            onClick={() => onOpenMode(card.mode)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenMode(card.mode);
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
  );
}
