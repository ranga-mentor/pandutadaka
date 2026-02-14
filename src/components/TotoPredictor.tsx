import { useMemo, useState } from "react";
import { getPredictionNumbers, getTotoPredictorSources } from "../tools/totoPredictor";

export default function TotoPredictor() {
  const [picks, setPicks] = useState<string[]>(() => getPredictionNumbers(5));
  const sources = useMemo(() => getTotoPredictorSources(), []);

  async function copyAll() {
    const value = picks.join(", ");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Intentionally ignore clipboard errors.
    }
  }

  return (
    <section className="toto-page">
      <article className="tool-card toto-hero">
        <h2>Singapore Toto Predictor</h2>
        <p>5 probable 4-digit picks based on past draw frequency + recency weighting.</p>
        <div className="toto-actions">
          <button onClick={() => setPicks(getPredictionNumbers(5))} type="button">
            Predict Again
          </button>
          <button onClick={copyAll} type="button">
            Copy All
          </button>
        </div>
      </article>

      <article className="tool-card">
        <h3>Predicted 4-digit Numbers</h3>
        <ul className="toto-picks">
          {picks.map((pick) => (
            <li key={pick}>
              <code>{pick}</code>
            </li>
          ))}
        </ul>
        <p className="small-note">
          Output is always 5 unique numbers with no duplicates in the list.
        </p>
      </article>

      <article className="tool-card">
        <h3>Data Sources Used</h3>
        <ul className="source-list">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
